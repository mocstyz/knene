/**
 * UserProfileService类
 * UserProfileService相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.domain.user.service;

// 用户档案领域服务
// 处理用户档案管理、头像上传、个人信息更新等档案相关的业务逻辑

import com.knene.domain.user.entity.User;
import com.knene.domain.user.valueobject.UserProfile;
import com.knene.domain.user.valueobject.UserProfile.Gender;
import com.knene.domain.user.repository.UserRepository;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.date.DateUtil;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

// 用户档案领域服务实现类
public class UserProfileService {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final ContentModerationService contentModerationService;

    // 构造器注入依赖
    public UserProfileService(UserRepository userRepository,
                             FileStorageService fileStorageService,
                             ContentModerationService contentModerationService) {
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.contentModerationService = contentModerationService;
    }

    // 用户档案管理业务逻辑

    // 获取用户档案方法 - 根据用户ID获取用户档案信息
    public UserProfileResult getUserProfile(Long userId, Long requestUserId) {
        // 1. 验证用户存在
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return new UserProfileResult(ProfileStatus.USER_NOT_FOUND, "用户不存在");
        }

        User user = userOpt.get();

        // 2. 检查档案访问权限
        if (!hasProfileAccessPermission(userId, requestUserId)) {
            return new UserProfileResult(ProfileStatus.ACCESS_DENIED, "无权限访问该用户档案");
        }

        // 3. 查找用户档案
        Optional<UserProfile> profileOpt = userRepository.findProfileByUserId(userId);
        if (!profileOpt.isPresent()) {
            // 创建默认档案
            UserProfile defaultProfile = createDefaultProfile(userId);
            return new UserProfileResult(ProfileStatus.SUCCESS, "获取成功", defaultProfile);
        }

        UserProfile profile = profileOpt.get();

        // 4. 过滤敏感信息（如果请求者不是档案所有者）
        if (!userId.equals(requestUserId)) {
            profile = filterSensitiveProfileData(profile);
        }

        return new UserProfileResult(ProfileStatus.SUCCESS, "获取成功", profile);
    }

    // 更新用户档案方法 - 更新用户的个人档案信息
    public ProfileUpdateResult updateUserProfile(Long userId, ProfileUpdateRequest profileUpdate, Long requestUserId) {
        // 1. 验证权限
        if (!userId.equals(requestUserId)) {
            return new ProfileUpdateResult(ProfileUpdateStatus.ACCESS_DENIED, "只能更新自己的档案");
        }

        // 2. 验证用户存在
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return new ProfileUpdateResult(ProfileUpdateStatus.USER_NOT_FOUND, "用户不存在");
        }

        // 3. 验证更新数据
        ProfileValidationResult validation = validateProfileUpdate(profileUpdate);
        if (!validation.isValid()) {
            return new ProfileUpdateResult(ProfileUpdateStatus.INVALID_DATA, validation.getErrorMessage());
        }

        // 4. 查找现有档案
        Optional<UserProfile> existingProfileOpt = userRepository.findProfileByUserId(userId);
        UserProfile profile;

        if (existingProfileOpt.isPresent()) {
            // 更新现有档案
            profile = updateExistingProfile(existingProfileOpt.get(), profileUpdate);
        } else {
            // 创建新档案
            profile = createProfileFromUpdate(userId, profileUpdate);
        }

        // 5. 内容审核
        ContentModerationResult moderation = contentModerationService.moderateProfile(profile);
        if (moderation.isBlocked()) {
            return new ProfileUpdateResult(ProfileUpdateStatus.CONTENT_BLOCKED, "档案内容包含不当信息: " + moderation.getReason());
        }

        // 6. 保存档案
        UserProfile savedProfile = userRepository.saveProfile(profile);

        return new ProfileUpdateResult(ProfileUpdateStatus.SUCCESS, "档案更新成功", savedProfile);
    }

    // 上传用户头像方法 - 上传用户头像图片
    public AvatarUploadResult uploadAvatar(Long userId, byte[] imageData, String contentType, Long requestUserId) {
        // 1. 验证权限
        if (!userId.equals(requestUserId)) {
            return new AvatarUploadResult(AvatarUploadStatus.ACCESS_DENIED, "只能上传自己的头像");
        }

        // 2. 验证用户存在
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return new AvatarUploadResult(AvatarUploadStatus.USER_NOT_FOUND, "用户不存在");
        }

        // 3. 验证图片数据
        ImageValidationResult imageValidation = validateAvatarImage(imageData, contentType);
        if (!imageValidation.isValid()) {
            return new AvatarUploadResult(AvatarUploadStatus.INVALID_IMAGE, imageValidation.getErrorMessage());
        }

        try {
            // 4. 上传图片到存储服务
            String avatarUrl = fileStorageService.uploadAvatar(userId, imageData, contentType);

            // 5. 更新用户档案中的头像URL
            Optional<UserProfile> profileOpt = userRepository.findProfileByUserId(userId);
            UserProfile profile;

            if (profileOpt.isPresent()) {
                // 更新现有档案
                profile = UserProfile.builder()
                        .userId(userId)
                        .nickname(profileOpt.get().getNickname())
                        .gender(profileOpt.get().getGender())
                        .birthday(profileOpt.get().getBirthday())
                        .bio(profileOpt.get().getBio())
                        .location(profileOpt.get().getLocation())
                        .website(profileOpt.get().getWebsite())
                        .avatarUrl(avatarUrl)
                        .build();
            } else {
                // 创建新档案
                profile = UserProfile.builder()
                        .userId(userId)
                        .avatarUrl(avatarUrl)
                        .build();
            }

            userRepository.saveProfile(profile);

            return new AvatarUploadResult(AvatarUploadStatus.SUCCESS, "头像上传成功", avatarUrl);

        } catch (Exception e) {
            return new AvatarUploadResult(AvatarUploadStatus.UPLOAD_ERROR, "头像上传失败: " + e.getMessage());
        }
    }

    // 删除用户头像方法 - 删除用户的头像图片
    public AvatarDeleteResult deleteAvatar(Long userId, Long requestUserId) {
        // 1. 验证权限
        if (!userId.equals(requestUserId)) {
            return new AvatarDeleteResult(AvatarDeleteStatus.ACCESS_DENIED, "只能删除自己的头像");
        }

        // 2. 验证用户存在
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return new AvatarDeleteResult(AvatarDeleteStatus.USER_NOT_FOUND, "用户不存在");
        }

        // 3. 查找用户档案
        Optional<UserProfile> profileOpt = userRepository.findProfileByUserId(userId);
        if (!profileOpt.isPresent() || StrUtil.isBlank(profileOpt.get().getAvatarUrl())) {
            return new AvatarDeleteResult(AvatarDeleteStatus.NO_AVATAR, "用户没有设置头像");
        }

        try {
            // 4. 从存储服务删除头像
            fileStorageService.deleteAvatar(userId);

            // 5. 更新档案（移除头像URL）
            UserProfile existingProfile = profileOpt.get();
            UserProfile updatedProfile = UserProfile.builder()
                    .userId(userId)
                    .nickname(existingProfile.getNickname())
                    .gender(existingProfile.getGender())
                    .birthday(existingProfile.getBirthday())
                    .bio(existingProfile.getBio())
                    .location(existingProfile.getLocation())
                    .website(existingProfile.getWebsite())
                    .avatarUrl(null) // 移除头像
                    .build();

            userRepository.saveProfile(updatedProfile);

            return new AvatarDeleteResult(AvatarDeleteStatus.SUCCESS, "头像删除成功");

        } catch (Exception e) {
            return new AvatarDeleteResult(AvatarDeleteStatus.DELETE_ERROR, "头像删除失败: " + e.getMessage());
        }
    }

    // 更改邮箱地址方法 - 更改用户的注册邮箱地址
    public EmailChangeResult changeEmail(Long userId, String newEmail, String password,
                                       Long requestUserId, String ipAddress, String userAgent) {
        // 1. 验证权限
        if (!userId.equals(requestUserId)) {
            return new EmailChangeResult(EmailChangeStatus.ACCESS_DENIED, "只能更改自己的邮箱");
        }

        // 2. 验证输入参数
        if (StrUtil.isBlank(newEmail) || StrUtil.isBlank(password)) {
            return new EmailChangeResult(EmailChangeStatus.INVALID_INPUT, "新邮箱和密码不能为空");
        }

        // 3. 验证邮箱格式
        if (!isValidEmail(newEmail)) {
            return new EmailChangeResult(EmailChangeStatus.INVALID_EMAIL, "邮箱格式不正确");
        }

        // 4. 验证用户存在
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return new EmailChangeResult(EmailChangeStatus.USER_NOT_FOUND, "用户不存在");
        }

        User user = userOpt.get();

        // 5. 验证密码
        if (!cn.hutool.crypto.digest.BCrypt.checkpw(password, user.getPasswordHash())) {
            return new EmailChangeResult(EmailChangeStatus.INVALID_PASSWORD, "密码错误");
        }

        // 6. 检查新邮箱是否已被使用
        if (userRepository.existsByEmail(newEmail)) {
            return new EmailChangeResult(EmailChangeStatus.EMAIL_EXISTS, "该邮箱已被使用");
        }

        // 7. 检查是否已有进行中的邮箱变更
        // 这里应该检查是否有未完成的邮箱变更验证记录

        try {
            // 8. 创建邮箱变更验证记录
            String verificationToken = generateVerificationToken();
            String tokenHash = cn.hutool.crypto.digest.DigestUtil.sha256Hex(verificationToken);
            LocalDateTime expiresAt = LocalDateTime.now().plusHours(24);

            com.knene.domain.user.entity.EmailVerification emailVerification =
                    com.knene.domain.user.entity.EmailVerification.createEmailChangeVerification(
                            userId, newEmail, user.getEmail(), verificationToken, tokenHash,
                            expiresAt, ipAddress, userAgent
                    );

            userRepository.saveEmailVerification(emailVerification);

            // 9. 发送验证邮件
            sendEmailChangeVerificationEmail(newEmail, verificationToken, user.getEmail());

            return new EmailChangeResult(EmailChangeStatus.SUCCESS, "验证邮件已发送到新邮箱地址");

        } catch (Exception e) {
            return new EmailChangeResult(EmailChangeStatus.SYSTEM_ERROR, "邮箱更改请求失败");
        }
    }

    // 私有辅助方法

    // 检查档案访问权限
    private boolean hasProfileAccessPermission(Long targetUserId, Long requestUserId) {
        // 1. 用户可以访问自己的档案
        if (targetUserId.equals(requestUserId)) {
            return true;
        }

        // 2. 这里可以添加更复杂的权限逻辑，比如：
        // - 好友关系
        // - 相同组织
        // - 公开档案等
        // 目前简化为所有用户档案都可访问（但敏感信息会被过滤）

        return true;
    }

    // 创建默认档案
    private UserProfile createDefaultProfile(Long userId) {
        return UserProfile.builder()
                .userId(userId)
                .build();
    }

    // 过滤敏感档案数据
    private UserProfile filterSensitiveProfileData(UserProfile profile) {
        // 过滤掉一些敏感信息，只保留公开可见的信息
        return UserProfile.builder()
                .userId(profile.getUserId())
                .nickname(profile.getNickname())
                .avatarUrl(profile.getAvatarUrl())
                .bio(profile.getBio()) // 简介通常是公开的
                // 不包含生日、邮箱等敏感信息
                .build();
    }

    // 验证档案更新数据
    private ProfileValidationResult validateProfileUpdate(ProfileUpdateRequest update) {
        if (update == null) {
            return new ProfileValidationResult(false, "更新数据不能为空");
        }

        // 验证昵称
        if (StrUtil.isNotBlank(update.getNickname()) && update.getNickname().length() > 50) {
            return new ProfileValidationResult(false, "昵称长度不能超过50个字符");
        }

        // 验证生日
        if (update.getBirthday() != null) {
            LocalDate minDate = LocalDate.of(1900, 1, 1);
            LocalDate maxDate = LocalDate.now().minusYears(13); // 最小13岁
            if (update.getBirthday().isBefore(minDate) || update.getBirthday().isAfter(maxDate)) {
                return new ProfileValidationResult(false, "生日日期不在有效范围内");
            }
        }

        // 验证个人简介
        if (StrUtil.isNotBlank(update.getBio()) && update.getBio().length() > 500) {
            return new ProfileValidationResult(false, "个人简介长度不能超过500个字符");
        }

        // 验证位置
        if (StrUtil.isNotBlank(update.getLocation()) && update.getLocation().length() > 100) {
            return new ProfileValidationResult(false, "位置信息长度不能超过100个字符");
        }

        // 验证网站
        if (StrUtil.isNotBlank(update.getWebsite()) && !isValidUrl(update.getWebsite())) {
            return new ProfileValidationResult(false, "网站地址格式不正确");
        }

        return new ProfileValidationResult(true, null);
    }

    // 更新现有档案
    private UserProfile updateExistingProfile(UserProfile existingProfile, ProfileUpdateRequest update) {
        return UserProfile.builder()
                .userId(existingProfile.getUserId())
                .nickname(StrUtil.isNotBlank(update.getNickname()) ? update.getNickname() : existingProfile.getNickname())
                .gender(update.getGender() != null ? update.getGender() : existingProfile.getGender())
                .birthday(update.getBirthday() != null ? update.getBirthday() : existingProfile.getBirthday())
                .bio(StrUtil.isNotBlank(update.getBio()) ? update.getBio() : existingProfile.getBio())
                .location(StrUtil.isNotBlank(update.getLocation()) ? update.getLocation() : existingProfile.getLocation())
                .website(StrUtil.isNotBlank(update.getWebsite()) ? update.getWebsite() : existingProfile.getWebsite())
                .avatarUrl(existingProfile.getAvatarUrl()) // 头像不通过此接口更新
                .build();
    }

    // 从更新请求创建档案
    private UserProfile createProfileFromUpdate(Long userId, ProfileUpdateRequest update) {
        return UserProfile.builder()
                .userId(userId)
                .nickname(update.getNickname())
                .gender(update.getGender())
                .birthday(update.getBirthday())
                .bio(update.getBio())
                .location(update.getLocation())
                .website(update.getWebsite())
                .build();
    }

    // 验证头像图片
    private ImageValidationResult validateAvatarImage(byte[] imageData, String contentType) {
        // 1. 检查文件大小（最大5MB）
        if (imageData.length > 5 * 1024 * 1024) {
            return new ImageValidationResult(false, "头像文件大小不能超过5MB");
        }

        // 2. 检查内容类型
        if (!"image/jpeg".equals(contentType) && !"image/png".equals(contentType) && !"image/webp".equals(contentType)) {
            return new ImageValidationResult(false, "只支持JPG、PNG、WebP格式的图片");
        }

        // 3. 检查图片尺寸（这里简化处理，实际应该解析图片）
        // 可以使用ImageIO或其他库检查图片尺寸

        return new ImageValidationResult(true, null);
    }

    // 验证邮箱格式
    private boolean isValidEmail(String email) {
        return email.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    }

    // 验证URL格式
    private boolean isValidUrl(String url) {
        return url.matches("^https?://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}.*$");
    }

    // 生成验证令牌
    private String generateVerificationToken() {
        return cn.hutool.core.util.RandomUtil.randomString(32);
    }

    // 发送邮箱变更验证邮件
    private void sendEmailChangeVerificationEmail(String newEmail, String token, String oldEmail) {
        String subject = "验证您的邮箱地址变更";
        String content = buildEmailChangeVerificationContent(token, oldEmail);
        // 这里应该注入邮件服务并发送邮件
        // emailService.sendEmail(newEmail, subject, content);
    }

    // 构建邮箱变更验证邮件内容
    private String buildEmailChangeVerificationContent(String token, String oldEmail) {
        return "您请求将邮箱地址从 " + oldEmail + " 更改为当前邮箱。\n" +
               "请点击以下链接验证此变更：\n" +
               "https://example.com/verify-email-change?token=" + token + "\n" +
               "验证链接24小时内有效，请及时验证。";
    }

    // 结果类定义

    // 档案状态枚举
    public enum ProfileStatus {
        SUCCESS,                // 成功
        USER_NOT_FOUND,         // 用户不存在
        ACCESS_DENIED,          // 访问被拒绝
        SYSTEM_ERROR            // 系统错误
    }

    // 档案更新状态枚举
    public enum ProfileUpdateStatus {
        SUCCESS,                // 成功
        USER_NOT_FOUND,         // 用户不存在
        ACCESS_DENIED,          // 访问被拒绝
        INVALID_DATA,           // 数据无效
        CONTENT_BLOCKED,        // 内容被屏蔽
        SYSTEM_ERROR            // 系统错误
    }

    // 头像上传状态枚举
    public enum AvatarUploadStatus {
        SUCCESS,                // 成功
        USER_NOT_FOUND,         // 用户不存在
        ACCESS_DENIED,          // 访问被拒绝
        INVALID_IMAGE,          // 图片无效
        UPLOAD_ERROR,           // 上传错误
        SYSTEM_ERROR            // 系统错误
    }

    // 头像删除状态枚举
    public enum AvatarDeleteStatus {
        SUCCESS,                // 成功
        USER_NOT_FOUND,         // 用户不存在
        ACCESS_DENIED,          // 访问被拒绝
        NO_AVATAR,              // 没有头像
        DELETE_ERROR,           // 删除错误
        SYSTEM_ERROR            // 系统错误
    }

    // 邮箱更改状态枚举
    public enum EmailChangeStatus {
        SUCCESS,                // 成功
        USER_NOT_FOUND,         // 用户不存在
        ACCESS_DENIED,          // 访问被拒绝
        INVALID_INPUT,          // 输入无效
        INVALID_EMAIL,          // 邮箱无效
        INVALID_PASSWORD,       // 密码错误
        EMAIL_EXISTS,           // 邮箱已存在
        SYSTEM_ERROR            // 系统错误
    }

    // 档案更新请求类
    public static class ProfileUpdateRequest {
        private String nickname;
        private Gender gender;
        private LocalDate birthday;
        private String bio;
        private String location;
        private String website;

        // 构造器和getter/setter方法
        public ProfileUpdateRequest() {}

        public String getNickname() {
            return nickname;
        }

        public void setNickname(String nickname) {
            this.nickname = nickname;
        }

        public Gender getGender() {
            return gender;
        }

        public void setGender(Gender gender) {
            this.gender = gender;
        }

        public LocalDate getBirthday() {
            return birthday;
        }

        public void setBirthday(LocalDate birthday) {
            this.birthday = birthday;
        }

        public String getBio() {
            return bio;
        }

        public void setBio(String bio) {
            this.bio = bio;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getWebsite() {
            return website;
        }

        public void setWebsite(String website) {
            this.website = website;
        }
    }

    // 用户档案结果类
    public static class UserProfileResult {
        private final ProfileStatus status;
        private final String message;
        private final UserProfile profile;

        public UserProfileResult(ProfileStatus status, String message) {
            this.status = status;
            this.message = message;
            this.profile = null;
        }

        public UserProfileResult(ProfileStatus status, String message, UserProfile profile) {
            this.status = status;
            this.message = message;
            this.profile = profile;
        }

        public ProfileStatus getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public UserProfile getProfile() {
            return profile;
        }

        public boolean isSuccess() {
            return status == ProfileStatus.SUCCESS;
        }
    }

    // 档案更新结果类
    public static class ProfileUpdateResult {
        private final ProfileUpdateStatus status;
        private final String message;
        private final UserProfile profile;

        public ProfileUpdateResult(ProfileUpdateStatus status, String message) {
            this.status = status;
            this.message = message;
            this.profile = null;
        }

        public ProfileUpdateResult(ProfileUpdateStatus status, String message, UserProfile profile) {
            this.status = status;
            this.message = message;
            this.profile = profile;
        }

        public ProfileUpdateStatus getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public UserProfile getProfile() {
            return profile;
        }

        public boolean isSuccess() {
            return status == ProfileUpdateStatus.SUCCESS;
        }
    }

    // 头像上传结果类
    public static class AvatarUploadResult {
        private final AvatarUploadStatus status;
        private final String message;
        private final String avatarUrl;

        public AvatarUploadResult(AvatarUploadStatus status, String message) {
            this.status = status;
            this.message = message;
            this.avatarUrl = null;
        }

        public AvatarUploadResult(AvatarUploadStatus status, String message, String avatarUrl) {
            this.status = status;
            this.message = message;
            this.avatarUrl = avatarUrl;
        }

        public AvatarUploadStatus getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public String getAvatarUrl() {
            return avatarUrl;
        }

        public boolean isSuccess() {
            return status == AvatarUploadStatus.SUCCESS;
        }
    }

    // 头像删除结果类
    public static class AvatarDeleteResult {
        private final AvatarDeleteStatus status;
        private final String message;

        public AvatarDeleteResult(AvatarDeleteStatus status, String message) {
            this.status = status;
            this.message = message;
        }

        public AvatarDeleteStatus getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public boolean isSuccess() {
            return status == AvatarDeleteStatus.SUCCESS;
        }
    }

    // 邮箱更改结果类
    public static class EmailChangeResult {
        private final EmailChangeStatus status;
        private final String message;

        public EmailChangeResult(EmailChangeStatus status, String message) {
            this.status = status;
            this.message = message;
        }

        public EmailChangeStatus getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public boolean isSuccess() {
            return status == EmailChangeStatus.SUCCESS;
        }
    }

    // 验证结果类
    private static class ProfileValidationResult {
        private final boolean valid;
        private final String errorMessage;

        public ProfileValidationResult(boolean valid, String errorMessage) {
            this.valid = valid;
            this.errorMessage = errorMessage;
        }

        public boolean isValid() {
            return valid;
        }

        public String getErrorMessage() {
            return errorMessage;
        }
    }

    // 图片验证结果类
    private static class ImageValidationResult {
        private final boolean valid;
        private final String errorMessage;

        public ImageValidationResult(boolean valid, String errorMessage) {
            this.valid = valid;
            this.errorMessage = errorMessage;
        }

        public boolean isValid() {
            return valid;
        }

        public String getErrorMessage() {
            return errorMessage;
        }
    }

    // 文件存储服务接口
    public interface FileStorageService {
        String uploadAvatar(Long userId, byte[] imageData, String contentType);
        void deleteAvatar(Long userId);
    }

    // 内容审核服务接口
    public interface ContentModerationService {
        ContentModerationResult moderateProfile(UserProfile profile);
    }

    // 内容审核结果类
    public static class ContentModerationResult {
        private final boolean blocked;
        private final String reason;

        public ContentModerationResult(boolean blocked, String reason) {
            this.blocked = blocked;
            this.reason = reason;
        }

        public boolean isBlocked() {
            return blocked;
        }

        public String getReason() {
            return reason;
        }
    }
}