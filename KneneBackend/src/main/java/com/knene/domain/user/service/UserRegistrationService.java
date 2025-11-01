/**
 * UserRegistrationService类
 * UserRegistrationService相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.domain.user.service;

import com.knene.domain.user.entity.User;
import com.knene.domain.user.entity.EmailVerification;
import com.knene.domain.user.valueobject.UserProfile;
import com.knene.domain.user.repository.UserRepository;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.digest.BCrypt;

import java.time.LocalDateTime;
import java.util.Optional;

// 用户注册领域服务
// 处理用户注册相关的业务逻辑，包括用户名验证、邮箱验证、密码策略等
public class UserRegistrationService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    // 构造器注入依赖
    public UserRegistrationService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // 用户注册核心业务逻辑

    // 注册新用户
    public RegistrationResult registerUser(String username, String email, String password,
                                         String nickname, String ipAddress, String userAgent) {
        // 1. 验证输入参数
        validateRegistrationInput(username, email, password);

        // 2. 检查用户名和邮箱是否已存在
        checkUserExistence(username, email);

        // 3. 验证密码强度
        validatePasswordStrength(password);

        // 4. 检查邮箱域名是否被允许
        validateEmailDomain(email);

        // 5. 检查IP地址是否被限制
        validateRegistrationIP(ipAddress);

        // 6. 创建用户实体
        String passwordHash = BCrypt.hashpw(password, BCrypt.gensalt());
        User user = User.create(username, email, passwordHash);
        user.setCreatedBy(null); // 系统注册
        user.setUpdatedBy(null);

        // 7. 保存用户
        User savedUser = userRepository.save(user);

        // 8. 创建默认用户档案
        if (StrUtil.isNotBlank(nickname)) {
            UserProfile profile = UserProfile.builder()
                    .nickname(nickname)
                    .build();
            userRepository.saveProfile(profile);
        }

        // 9. 发送邮箱验证
        EmailVerification emailVerification = createEmailVerification(savedUser.getId(), email, ipAddress, userAgent);
        userRepository.saveEmailVerification(emailVerification);
        sendVerificationEmail(email, emailVerification.getVerificationToken());

        return new RegistrationResult(savedUser.getId(), RegistrationStatus.SUCCESS, "注册成功，请查收验证邮件");
    }

    // 验证邮箱
    public EmailVerificationResult verifyEmail(String token, String ipAddress) {
        // 1. 根据令牌哈希查找验证记录
        Optional<EmailVerification> verificationOpt = userRepository.findEmailVerificationByTokenHash(
                cn.hutool.crypto.digest.DigestUtil.sha256Hex(token)
        );

        if (!verificationOpt.isPresent()) {
            return new EmailVerificationResult(EmailVerificationStatus.INVALID_TOKEN, "无效的验证令牌");
        }

        EmailVerification verification = verificationOpt.get();

        // 2. 检查是否可以验证
        if (!verification.canVerify()) {
            return new EmailVerificationResult(EmailVerificationStatus.VERIFICATION_FAILED, verification.getStatusDescription());
        }

        // 3. 检查IP地址匹配（可选增强安全）
        if (!verification.matchesIpAddress(ipAddress)) {
            verification.recordFailedAttempt();
            userRepository.saveEmailVerification(verification);
            return new EmailVerificationResult(EmailVerificationStatus.IP_MISMATCH, "IP地址不匹配");
        }

        // 4. 执行验证
        if (verification.verifyToken(token, ipAddress)) {
            // 5. 激活用户账户
            Optional<User> userOpt = userRepository.findById(verification.getUserId());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.activate(null); // 系统激活
                userRepository.save(user);
            }

            userRepository.saveEmailVerification(verification);
            return new EmailVerificationResult(EmailVerificationStatus.SUCCESS, "邮箱验证成功");
        } else {
            userRepository.saveEmailVerification(verification);
            return new EmailVerificationResult(EmailVerificationStatus.VERIFICATION_FAILED, "验证令牌错误");
        }
    }

    // 重新发送验证邮件
    public ResendVerificationResult resendVerificationEmail(String email, String ipAddress, String userAgent) {
        // 1. 查找用户
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            return new ResendVerificationResult(ResendStatus.USER_NOT_FOUND, "用户不存在");
        }

        User user = userOpt.get();

        // 2. 检查用户是否已验证
        if (user.getIsEmailVerified()) {
            return new ResendVerificationResult(ResendStatus.ALREADY_VERIFIED, "邮箱已验证");
        }

        // 3. 查找未完成的验证记录
        java.util.List<EmailVerification> pendingVerifications =
                userRepository.findPendingEmailVerificationsByUserId(user.getId());

        // 4. 撤销所有旧的验证记录
        for (EmailVerification oldVerification : pendingVerifications) {
            oldVerification.deactivate();
            userRepository.saveEmailVerification(oldVerification);
        }

        // 5. 创建新的验证记录
        EmailVerification newVerification = createEmailVerification(user.getId(), email, ipAddress, userAgent);
        userRepository.saveEmailVerification(newVerification);

        // 6. 发送验证邮件
        sendVerificationEmail(email, newVerification.getVerificationToken());

        return new ResendVerificationResult(ResendStatus.SUCCESS, "验证邮件已重新发送");
    }

    // 私有辅助方法

    // 验证注册输入参数
    private void validateRegistrationInput(String username, String email, String password) {
        if (StrUtil.isBlank(username)) {
            throw new IllegalArgumentException("用户名不能为空");
        }
        if (StrUtil.isBlank(email)) {
            throw new IllegalArgumentException("邮箱不能为空");
        }
        if (StrUtil.isBlank(password)) {
            throw new IllegalArgumentException("密码不能为空");
        }
        if (!isValidUsername(username)) {
            throw new IllegalArgumentException("用户名格式不正确");
        }
        if (!isValidEmail(email)) {
            throw new IllegalArgumentException("邮箱格式不正确");
        }
    }

    // 检查用户是否已存在
    private void checkUserExistence(String username, String email) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("用户名已存在");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("邮箱已存在");
        }
    }

    // 验证密码强度
    private void validatePasswordStrength(String password) {
        if (password.length() < 8) {
            throw new IllegalArgumentException("密码长度至少8位");
        }
        if (!StrUtil.containsAny(password, "abcdefghijklmnopqrstuvwxyz")) {
            throw new IllegalArgumentException("密码必须包含小写字母");
        }
        if (!StrUtil.containsAny(password, "ABCDEFGHIJKLMNOPQRSTUVWXYZ")) {
            throw new IllegalArgumentException("密码必须包含大写字母");
        }
        if (!StrUtil.containsAny(password, "0123456789")) {
            throw new IllegalArgumentException("密码必须包含数字");
        }
    }

    // 验证邮箱域名
    private void validateEmailDomain(String email) {
        String domain = StrUtil.subAfter(email, "@", false);
        if (isBlockedDomain(domain)) {
            throw new IllegalArgumentException("该邮箱域名不被允许");
        }
    }

    // 验证注册IP
    private void validateRegistrationIP(String ipAddress) {
        if (isBlockedIP(ipAddress)) {
            throw new IllegalArgumentException("该IP地址被限制注册");
        }
    }

    // 创建邮箱验证
    private EmailVerification createEmailVerification(Long userId, String email, String ipAddress, String userAgent) {
        String token = generateVerificationToken();
        String tokenHash = cn.hutool.crypto.digest.DigestUtil.sha256Hex(token);
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(24); // 24小时过期

        return EmailVerification.createRegistrationVerification(
                userId, email, token, tokenHash, expiresAt, ipAddress, userAgent
        );
    }

    // 发送验证邮件
    private void sendVerificationEmail(String email, String token) {
        String subject = "验证您的邮箱地址";
        String content = buildVerificationEmailContent(token);
        emailService.sendEmail(email, subject, content);
    }

    // 构建验证邮件内容
    private String buildVerificationEmailContent(String token) {
        return "请点击以下链接验证您的邮箱：\n" +
               "https://example.com/verify-email?token=" + token + "\n" +
               "验证链接24小时内有效，请及时验证。";
    }

    // 生成验证令牌
    private String generateVerificationToken() {
        return RandomUtil.randomString(32);
    }

    // 验证用户名格式
    private boolean isValidUsername(String username) {
        return username.matches("^[a-zA-Z0-9_]{4,20}$");
    }

    // 验证邮箱格式
    private boolean isValidEmail(String email) {
        return email.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    }

    // 检查是否为被屏蔽的域名
    private boolean isBlockedDomain(String domain) {
        // 这里应该从配置或数据库中读取被屏蔽的域名列表
        return false;
    }

    // 检查是否为被屏蔽的IP
    private boolean isBlockedIP(String ipAddress) {
        // 这里应该从配置或数据库中读取被屏蔽的IP列表
        return false;
    }

    // 结果类定义

    // 注册状态枚举
    public enum RegistrationStatus {
        SUCCESS,                // 成功
        USERNAME_EXISTS,       // 用户名已存在
        EMAIL_EXISTS,          // 邮箱已存在
        INVALID_INPUT,         // 输入无效
        PASSWORD_WEAK,         // 密码强度不够
        EMAIL_BLOCKED,         // 邮箱被屏蔽
        IP_BLOCKED,            // IP被屏蔽
        SYSTEM_ERROR           // 系统错误
    }

    // 邮箱验证状态枚举
    public enum EmailVerificationStatus {
        SUCCESS,               // 成功
        INVALID_TOKEN,         // 无效令牌
        TOKEN_EXPIRED,         // 令牌过期
        TOKEN_USED,            // 令牌已使用
        TOKEN_LOCKED,          // 令牌锁定
        ATTEMPTS_EXCEEDED,     // 尝试次数超限
        IP_MISMATCH,           // IP不匹配
        VERIFICATION_FAILED    // 验证失败
    }

    // 重发状态枚举
    public enum ResendStatus {
        SUCCESS,               // 成功
        USER_NOT_FOUND,        // 用户不存在
        ALREADY_VERIFIED,      // 已验证
        RATE_LIMIT_EXCEEDED,   // 频率限制
        SYSTEM_ERROR           // 系统错误
    }

    // 注册结果类
    public static class RegistrationResult {
        private final Long userId;
        private final RegistrationStatus status;
        private final String message;

        public RegistrationResult(Long userId, RegistrationStatus status, String message) {
            this.userId = userId;
            this.status = status;
            this.message = message;
        }

        public Long getUserId() {
            return userId;
        }

        public RegistrationStatus getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public boolean isSuccess() {
            return status == RegistrationStatus.SUCCESS;
        }
    }

    // 邮箱验证结果类
    public static class EmailVerificationResult {
        private final EmailVerificationStatus status;
        private final String message;

        public EmailVerificationResult(EmailVerificationStatus status, String message) {
            this.status = status;
            this.message = message;
        }

        public EmailVerificationStatus getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public boolean isSuccess() {
            return status == EmailVerificationStatus.SUCCESS;
        }
    }

    // 重发验证结果类
    public static class ResendVerificationResult {
        private final ResendStatus status;
        private final String message;

        public ResendVerificationResult(ResendStatus status, String message) {
            this.status = status;
            this.message = message;
        }

        public ResendStatus getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public boolean isSuccess() {
            return status == ResendStatus.SUCCESS;
        }
    }

    // 邮箱服务接口（领域服务依赖）
    public interface EmailService {
        void sendEmail(String to, String subject, String content);
    }
}