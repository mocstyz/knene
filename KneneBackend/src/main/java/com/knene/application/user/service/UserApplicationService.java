/**
 * UserApplicationService类
 * UserApplicationService相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.application.user.service;

// 用户应用服务
// 协调用户领域服务，处理用户相关的应用层业务流程

import com.knene.domain.user.entity.User;
import com.knene.domain.user.valueobject.UserProfile;
import com.knene.domain.user.repository.UserRepository;
import com.knene.domain.user.service.*;
import com.knene.application.user.dto.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// 用户应用服务
@Service
public class UserApplicationService {

    private final UserRepository userRepository;
    private final UserRegistrationService userRegistrationService;
    private final UserAuthenticationService userAuthenticationService;
    private final UserSecurityService userSecurityService;
    private final UserProfileService userProfileService;
    private final UserEventPublisher userEventPublisher;

    // 构造器注入依赖
    public UserApplicationService(UserRepository userRepository,
                                 UserRegistrationService userRegistrationService,
                                 UserAuthenticationService userAuthenticationService,
                                 UserSecurityService userSecurityService,
                                 UserProfileService userProfileService,
                                 UserEventPublisher userEventPublisher) {
        this.userRepository = userRepository;
        this.userRegistrationService = userRegistrationService;
        this.userAuthenticationService = userAuthenticationService;
        this.userSecurityService = userSecurityService;
        this.userProfileService = userProfileService;
        this.userEventPublisher = userEventPublisher;
    }

    // 用户注册应用服务

    // 用户注册
    @Transactional(rollbackFor = Exception.class)
    public UserRegistrationResult registerUser(RegisterUserCommand command) {
        try {
            // 1. 调用领域服务执行注册
            UserRegistrationService.RegistrationResult result = userRegistrationService.registerUser(
                    command.getUsername(),
                    command.getEmail(),
                    command.getPassword(),
                    command.getNickname(),
                    command.getIpAddress(),
                    command.getUserAgent()
            );

            if (!result.isSuccess()) {
                return new UserRegistrationResult(false, result.getMessage());
            }

            // 2. 发布用户注册事件
            userEventPublisher.publishUserRegisteredEvent(result.getUserId(), command.getEmail(), command.getUsername());

            // 3. 返回成功结果
            return new UserRegistrationResult(true, result.getMessage(), result.getUserId());

        } catch (Exception e) {
            // 记录错误日志
            return new UserRegistrationResult(false, "注册失败，请稍后再试");
        }
    }

    // 验证邮箱
    @Transactional(rollbackFor = Exception.class)
    public EmailVerificationResult verifyEmail(VerifyEmailCommand command) {
        try {
            // 1. 调用领域服务验证邮箱
            UserRegistrationService.EmailVerificationResult result = userRegistrationService.verifyEmail(
                    command.getToken(),
                    command.getIpAddress()
            );

            if (result.isSuccess()) {
                // 2. 发布邮箱验证事件
                userEventPublisher.publishEmailVerifiedEvent(command.getToken());
            }

            return new EmailVerificationResult(result.isSuccess(), result.getMessage());

        } catch (Exception e) {
            return new EmailVerificationResult(false, "邮箱验证失败，请稍后再试");
        }
    }

    // 重新发送验证邮件
    @Transactional(rollbackFor = Exception.class)
    public ResendVerificationResult resendVerificationEmail(ResendVerificationCommand command) {
        try {
            UserRegistrationService.ResendVerificationResult result = userRegistrationService.resendVerificationEmail(
                    command.getEmail(),
                    command.getIpAddress(),
                    command.getUserAgent()
            );

            return new ResendVerificationResult(result.isSuccess(), result.getMessage());

        } catch (Exception e) {
            return new ResendVerificationResult(false, "发送验证邮件失败，请稍后再试");
        }
    }

    // 用户认证应用服务

    // 用户登录
    @Transactional(rollbackFor = Exception.class)
    public LoginResult loginUser(LoginUserCommand command) {
        try {
            // 1. 调用领域服务执行认证
            UserAuthenticationService.AuthenticationResult result = userAuthenticationService.authenticate(
                    command.getIdentifier(),
                    command.getPassword(),
                    command.getIpAddress(),
                    command.getUserAgent(),
                    command.getDeviceFingerprint()
            );

            if (result.isSuccess()) {
                // 2. 发布用户登录事件
                userEventPublisher.publishUserLoginEvent(result.getUserId(), command.getIpAddress());

                // 3. 返回登录成功结果
                return new LoginResult(true, result.getMessage(),
                        result.getUserId(), result.getUsername(), result.getEmail(),
                        result.getAccessToken(), result.getRefreshToken(), result.getRoles());
            } else {
                // 4. 发布登录失败事件
                userEventPublisher.publishUserLoginFailedEvent(command.getIdentifier(), command.getIpAddress(), result.getMessage());

                return new LoginResult(false, result.getMessage());
            }

        } catch (Exception e) {
            return new LoginResult(false, "登录失败，请稍后再试");
        }
    }

    // 刷新令牌
    @Transactional(rollbackFor = Exception.class)
    public RefreshTokenResult refreshToken(RefreshTokenCommand command) {
        try {
            UserAuthenticationService.TokenRefreshResult result = userAuthenticationService.refreshToken(
                    command.getRefreshToken(),
                    command.getIpAddress(),
                    command.getUserAgent()
            );

            if (result.isSuccess()) {
                return new RefreshTokenResult(true, result.getMessage(),
                        result.getAccessToken(), result.getRefreshToken());
            } else {
                return new RefreshTokenResult(false, result.getMessage());
            }

        } catch (Exception e) {
            return new RefreshTokenResult(false, "令牌刷新失败，请稍后再试");
        }
    }

    // 用户登出
    @Transactional(rollbackFor = Exception.class)
    public LogoutResult logoutUser(LogoutUserCommand command) {
        try {
            UserAuthenticationService.LogoutResult result = userAuthenticationService.logout(
                    command.getRefreshToken(),
                    command.getUserId()
            );

            if (result.isSuccess()) {
                // 发布用户登出事件
                userEventPublisher.publishUserLogoutEvent(command.getUserId(), command.getIpAddress());
            }

            return new LogoutResult(result.isSuccess(), result.getMessage());

        } catch (Exception e) {
            return new LogoutResult(false, "登出失败，请稍后再试");
        }
    }

    // 用户安全应用服务

    // 请求密码重置
    @Transactional(rollbackFor = Exception.class)
    public PasswordResetRequestResult requestPasswordReset(RequestPasswordResetCommand command) {
        try {
            UserSecurityService.PasswordResetRequestResult result = userSecurityService.requestPasswordReset(
                    command.getEmail(),
                    command.getIpAddress(),
                    command.getUserAgent()
            );

            return new PasswordResetRequestResult(result.isSuccess(), result.getMessage());

        } catch (Exception e) {
            return new PasswordResetRequestResult(false, "密码重置请求失败，请稍后再试");
        }
    }

    // 验证密码重置令牌
    @Transactional(rollbackFor = Exception.class)
    public PasswordResetTokenValidationResult validateResetToken(ValidateResetTokenCommand command) {
        try {
            UserSecurityService.PasswordResetTokenValidationResult result = userSecurityService.validateResetToken(
                    command.getToken(),
                    command.getIpAddress()
            );

            return new PasswordResetTokenValidationResult(result.isValid(), result.getMessage());

        } catch (Exception e) {
            return new PasswordResetTokenValidationResult(false, "令牌验证失败，请稍后再试");
        }
    }

    // 执行密码重置
    @Transactional(rollbackFor = Exception.class)
    public PasswordResetExecutionResult executePasswordReset(ExecutePasswordResetCommand command) {
        try {
            UserSecurityService.PasswordResetExecutionResult result = userSecurityService.executePasswordReset(
                    command.getToken(),
                    command.getNewPassword(),
                    command.getIpAddress()
            );

            if (result.isSuccess()) {
                // 发布密码重置事件
                userEventPublisher.publishPasswordResetEvent(command.getToken());
            }

            return new PasswordResetExecutionResult(result.isSuccess(), result.getMessage());

        } catch (Exception e) {
            return new PasswordResetExecutionResult(false, "密码重置失败，请稍后再试");
        }
    }

    // 用户档案应用服务

    // 获取用户档案
    @Transactional(readOnly = true)
    public UserProfileDto getUserProfile(GetUserProfileQuery query) {
        try {
            UserProfileService.UserProfileResult result = userProfileService.getUserProfile(
                    query.getUserId(),
                    query.getRequestUserId()
            );

            if (result.isSuccess() && result.getProfile() != null) {
                return UserProfileDto.fromDomain(result.getProfile());
            } else {
                return null;
            }

        } catch (Exception e) {
            return null;
        }
    }

    // 更新用户档案
    @Transactional(rollbackFor = Exception.class)
    public ProfileUpdateResult updateUserProfile(UpdateProfileCommand command) {
        try {
            UserProfileService.ProfileUpdateRequest updateRequest = new UserProfileService.ProfileUpdateRequest();
            updateRequest.setNickname(command.getNickname());
            updateRequest.setGender(command.getGender());
            updateRequest.setBirthday(command.getBirthday());
            updateRequest.setBio(command.getBio());
            updateRequest.setLocation(command.getLocation());
            updateRequest.setWebsite(command.getWebsite());

            UserProfileService.ProfileUpdateResult result = userProfileService.updateUserProfile(
                    command.getUserId(),
                    updateRequest,
                    command.getRequestUserId()
            );

            if (result.isSuccess()) {
                // 发布档案更新事件
                userEventPublisher.publishProfileUpdatedEvent(command.getUserId());
            }

            return new ProfileUpdateResult(result.isSuccess(), result.getMessage());

        } catch (Exception e) {
            return new ProfileUpdateResult(false, "档案更新失败，请稍后再试");
        }
    }

    // 上传用户头像
    @Transactional(rollbackFor = Exception.class)
    public AvatarUploadResult uploadAvatar(UploadAvatarCommand command) {
        try {
            UserProfileService.AvatarUploadResult result = userProfileService.uploadAvatar(
                    command.getUserId(),
                    command.getImageData(),
                    command.getContentType(),
                    command.getRequestUserId()
            );

            if (result.isSuccess()) {
                // 发布头像上传事件
                userEventPublisher.publishAvatarUpdatedEvent(command.getUserId(), result.getAvatarUrl());
            }

            return new AvatarUploadResult(result.isSuccess(), result.getMessage(), result.getAvatarUrl());

        } catch (Exception e) {
            return new AvatarUploadResult(false, "头像上传失败，请稍后再试", null);
        }
    }

    // 用户管理应用服务（管理员功能）

    // 获取用户列表（管理员功能）
    @Transactional(readOnly = true)
    public UserListResult getUserList(GetUserListQuery query) {
        try {
            List<User> users;
            long totalCount;

            if (query.getStatus() != null) {
                users = userRepository.findUsersByStatus(query.getStatus(), query.getLimit(), query.getOffset());
                totalCount = userRepository.countUsersByStatus(query.getStatus());
            } else {
                users = userRepository.findUsersByCreatedTimeRange(
                        query.getStartTime(), query.getEndTime(), query.getLimit(), query.getOffset()
                );
                totalCount = userRepository.countUsersByCreatedTimeRange(query.getStartTime(), query.getEndTime());
            }

            return new UserListResult(true, "获取成功",
                    users.stream().map(UserDto::fromDomain).toList(),
                    totalCount);

        } catch (Exception e) {
            return new UserListResult(false, "获取用户列表失败", null, 0);
        }
    }

    // 锁定用户（管理员功能）
    @Transactional(rollbackFor = Exception.class)
    public UserLockResult lockUser(LockUserCommand command) {
        try {
            UserSecurityService.UserLockResult result = userSecurityService.lockUser(
                    command.getUserId(),
                    command.getLockReason(),
                    command.getLockDuration(),
                    command.getLockedBy(),
                    command.getIpAddress(),
                    command.getUserAgent()
            );

            if (result.isSuccess()) {
                // 发布用户锁定事件
                userEventPublisher.publishUserLockedEvent(command.getUserId(), command.getLockReason());
            }

            return new UserLockResult(result.isSuccess(), result.getMessage());

        } catch (Exception e) {
            return new UserLockResult(false, "用户锁定失败，请稍后再试");
        }
    }

    // 解锁用户（管理员功能）
    @Transactional(rollbackFor = Exception.class)
    public UserUnlockResult unlockUser(UnlockUserCommand command) {
        try {
            UserSecurityService.UserUnlockResult result = userSecurityService.unlockUser(
                    command.getUserId(),
                    command.getUnlockReason(),
                    command.getUnlockedBy()
            );

            if (result.isSuccess()) {
                // 发布用户解锁事件
                userEventPublisher.publishUserUnlockedEvent(command.getUserId(), command.getUnlockReason());
            }

            return new UserUnlockResult(result.isSuccess(), result.getMessage());

        } catch (Exception e) {
            return new UserUnlockResult(false, "用户解锁失败，请稍后再试");
        }
    }

    // 系统维护应用服务

    // 执行系统清理
    @Transactional(rollbackFor = Exception.class)
    public SystemCleanupResult performSystemCleanup() {
        try {
            UserRepository.CleanupResult result = userRepository.performSystemCleanup();

            return new SystemCleanupResult(true, "系统清理完成",
                    result.getExpiredRefreshTokens(),
                    result.getExpiredEmailVerifications(),
                    result.getExpiredPasswordResets(),
                    result.getUnlockedLockouts());

        } catch (Exception e) {
            return new SystemCleanupResult(false, "系统清理失败", 0, 0, 0, 0);
        }
    }

    // 内部命令对象定义（仅在此应用服务中使用的简单命令）

    // 注册用户命令
    public static class RegisterUserCommand {
        private String username;
        private String email;
        private String password;
        private String nickname;
        private String ipAddress;
        private String userAgent;

        // getter和setter方法
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getNickname() { return nickname; }
        public void setNickname(String nickname) { this.nickname = nickname; }
        public String getIpAddress() { return ipAddress; }
        public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
        public String getUserAgent() { return userAgent; }
        public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    }

    // 验证邮箱命令
    public static class VerifyEmailCommand {
        private String token;
        private String ipAddress;

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getIpAddress() { return ipAddress; }
        public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    }

    // 登录用户命令
    public static class LoginUserCommand {
        private String identifier;
        private String password;
        private String ipAddress;
        private String userAgent;
        private String deviceFingerprint;

        // getter和setter方法
        public String getIdentifier() { return identifier; }
        public void setIdentifier(String identifier) { this.identifier = identifier; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getIpAddress() { return ipAddress; }
        public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
        public String getUserAgent() { return userAgent; }
        public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
        public String getDeviceFingerprint() { return deviceFingerprint; }
        public void setDeviceFingerprint(String deviceFingerprint) { this.deviceFingerprint = deviceFingerprint; }
    }

    // 登出用户命令
    public static class LogoutUserCommand {
        private String refreshToken;
        private Long userId;
        private String ipAddress;

        public String getRefreshToken() { return refreshToken; }
        public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getIpAddress() { return ipAddress; }
        public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    }

    // 请求密码重置命令
    public static class RequestPasswordResetCommand {
        private String email;
        private String ipAddress;
        private String userAgent;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getIpAddress() { return ipAddress; }
        public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
        public String getUserAgent() { return userAgent; }
        public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    }

    // 验证密码重置令牌命令
    public static class ValidateResetTokenCommand {
        private String token;
        private String ipAddress;

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getIpAddress() { return ipAddress; }
        public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    }

    // 执行密码重置命令
    public static class ExecutePasswordResetCommand {
        private String token;
        private String newPassword;
        private String ipAddress;

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
        public String getIpAddress() { return ipAddress; }
        public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    }

    // 获取用户档案查询
    public static class GetUserProfileQuery {
        private Long userId;
        private Long requestUserId;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public Long getRequestUserId() { return requestUserId; }
        public void setRequestUserId(Long requestUserId) { this.requestUserId = requestUserId; }
    }

    // 更新档案命令
    public static class UpdateProfileCommand {
        private Long userId;
        private Long requestUserId;
        private String nickname;
        private UserProfile.Gender gender;
        private java.time.LocalDate birthday;
        private String bio;
        private String location;
        private String website;

        // getter和setter方法
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public Long getRequestUserId() { return requestUserId; }
        public void setRequestUserId(Long requestUserId) { this.requestUserId = requestUserId; }
        public String getNickname() { return nickname; }
        public void setNickname(String nickname) { this.nickname = nickname; }
        public UserProfile.Gender getGender() { return gender; }
        public void setGender(UserProfile.Gender gender) { this.gender = gender; }
        public java.time.LocalDate getBirthday() { return birthday; }
        public void setBirthday(java.time.LocalDate birthday) { this.birthday = birthday; }
        public String getBio() { return bio; }
        public void setBio(String bio) { this.bio = bio; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public String getWebsite() { return website; }
        public void setWebsite(String website) { this.website = website; }
    }

    // 上传头像命令
    public static class UploadAvatarCommand {
        private Long userId;
        private Long requestUserId;
        private byte[] imageData;
        private String contentType;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public Long getRequestUserId() { return requestUserId; }
        public void setRequestUserId(Long requestUserId) { this.requestUserId = requestUserId; }
        public byte[] getImageData() { return imageData; }
        public void setImageData(byte[] imageData) { this.imageData = imageData; }
        public String getContentType() { return contentType; }
        public void setContentType(String contentType) { this.contentType = contentType; }
    }

    // 获取用户列表查询
    public static class GetUserListQuery {
        private User.UserStatus status;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private int limit = 20;
        private int offset = 0;

        // getter和setter方法
        public User.UserStatus getStatus() { return status; }
        public void setStatus(User.UserStatus status) { this.status = status; }
        public LocalDateTime getStartTime() { return startTime; }
        public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
        public LocalDateTime getEndTime() { return endTime; }
        public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
        public int getLimit() { return limit; }
        public void setLimit(int limit) { this.limit = limit; }
        public int getOffset() { return offset; }
        public void setOffset(int offset) { this.offset = offset; }
    }

    // 锁定用户命令
    public static class LockUserCommand {
        private Long userId;
        private String lockReason;
        private Integer lockDuration; // 分钟数，null表示永久锁定
        private Long lockedBy;
        private String ipAddress;
        private String userAgent;

        // getter和setter方法
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getLockReason() { return lockReason; }
        public void setLockReason(String lockReason) { this.lockReason = lockReason; }
        public Integer getLockDuration() { return lockDuration; }
        public void setLockDuration(Integer lockDuration) { this.lockDuration = lockDuration; }
        public Long getLockedBy() { return lockedBy; }
        public void setLockedBy(Long lockedBy) { this.lockedBy = lockedBy; }
        public String getIpAddress() { return ipAddress; }
        public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
        public String getUserAgent() { return userAgent; }
        public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    }

    // 解锁用户命令
    public static class UnlockUserCommand {
        private Long userId;
        private String unlockReason;
        private Long unlockedBy;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getUnlockReason() { return unlockReason; }
        public void setUnlockReason(String unlockReason) { this.unlockReason = unlockReason; }
        public Long getUnlockedBy() { return unlockedBy; }
        public void setUnlockedBy(Long unlockedBy) { this.unlockedBy = unlockedBy; }
    }

    // 结果类定义

    // 用户注册结果
    public static class UserRegistrationResult {
        private final boolean success;
        private final String message;
        private final Long userId;

        public UserRegistrationResult(boolean success, String message) {
            this.success = success;
            this.message = message;
            this.userId = null;
        }

        public UserRegistrationResult(boolean success, String message, Long userId) {
            this.success = success;
            this.message = message;
            this.userId = userId;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public Long getUserId() { return userId; }
    }
}

// DTO类定义
// 用户档案DTO
class UserProfileDto {
    private Long userId;
    private String nickname;
    private String gender;
    private java.time.LocalDate birthday;
    private String bio;
    private String location;
    private String website;
    private String avatarUrl;
    private Integer completionScore;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;

    public static UserProfileDto fromDomain(UserProfile profile) {
        UserProfileDto dto = new UserProfileDto();
        dto.userId = profile.getUserId();
        dto.nickname = profile.getNickname();
        dto.gender = profile.getGender() != null ? profile.getGender().name() : null;
        dto.birthday = profile.getBirthday();
        dto.bio = profile.getBio();
        dto.location = profile.getLocation();
        dto.website = profile.getWebsite();
        dto.avatarUrl = profile.getAvatarUrl();
        dto.completionScore = profile.getCompletionScore();
        dto.createdAt = java.time.LocalDateTime.now(); // 临时设置
        dto.updatedAt = java.time.LocalDateTime.now(); // 临时设置
        return dto;
    }

    // getter方法
    public Long getUserId() { return userId; }
    public String getNickname() { return nickname; }
    public String getGender() { return gender; }
    public java.time.LocalDate getBirthday() { return birthday; }
    public String getBio() { return bio; }
    public String getLocation() { return location; }
    public String getWebsite() { return website; }
    public String getAvatarUrl() { return avatarUrl; }
    public Integer getCompletionScore() { return completionScore; }
    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public java.time.LocalDateTime getUpdatedAt() { return updatedAt; }
}

// 用户DTO
class UserDto {
    private Long id;
    private String username;
    private String email;
    private User.UserStatus status;

    public static UserDto fromDomain(User user) {
        UserDto dto = new UserDto();
        dto.id = user.getId();
        dto.username = user.getUsername();
        dto.email = user.getEmail();
        dto.status = user.getStatus();
        return dto;
    }

    // getter方法
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public User.UserStatus getStatus() { return status; }
}