/**
 * UserSecurityService类
 * UserSecurityService相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.domain.user.service;

// 用户安全领域服务
// 处理密码重置、账户锁定、安全策略等安全相关的业务逻辑

import com.knene.domain.user.entity.User;
import com.knene.domain.user.entity.PasswordReset;
import com.knene.domain.user.entity.UserLockout;
import com.knene.domain.user.repository.UserRepository;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.digest.BCrypt;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// 用户安全领域服务实现类
public class UserSecurityService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final SecurityPolicyService securityPolicyService;

    // 构造器注入依赖
    public UserSecurityService(UserRepository userRepository,
                              EmailService emailService,
                              SecurityPolicyService securityPolicyService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.securityPolicyService = securityPolicyService;
    }

    // 密码重置业务逻辑

    // 请求密码重置方法 - 处理用户密码重置请求
    public PasswordResetRequestResult requestPasswordReset(String email, String ipAddress, String userAgent) {
        // 1. 验证输入参数
        if (StrUtil.isBlank(email)) {
            return new PasswordResetRequestResult(PasswordResetStatus.INVALID_INPUT, "邮箱不能为空");
        }

        // 2. 检查请求频率限制
        if (securityPolicyService.isPasswordResetRateLimited(email, ipAddress)) {
            return new PasswordResetRequestResult(PasswordResetStatus.RATE_LIMITED, "密码重置请求过于频繁，请稍后再试");
        }

        // 3. 查找用户
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            // 为了安全，即使用户不存在也返回成功，避免邮箱枚举攻击
            return new PasswordResetRequestResult(PasswordResetStatus.SUCCESS, "如果邮箱存在，重置链接已发送");
        }

        User user = userOpt.get();

        // 4. 检查用户状态
        if (!user.getIsActive() || user.getIsDeleted()) {
            return new PasswordResetRequestResult(PasswordResetStatus.USER_INACTIVE, "用户账户不可用");
        }

        // 5. 撤销所有未使用的密码重置记录
        List<PasswordReset> unusedResets = userRepository.findUnusedPasswordResetsByUserId(user.getId());
        for (PasswordReset oldReset : unusedResets) {
            oldReset.deactivate();
            userRepository.savePasswordReset(oldReset);
        }

        // 6. 创建新的密码重置记录
        PasswordReset passwordReset = createPasswordReset(user.getId(), email, ipAddress, userAgent);
        userRepository.savePasswordReset(passwordReset);

        // 7. 发送重置邮件
        sendPasswordResetEmail(email, passwordReset.getResetToken());

        return new PasswordResetRequestResult(PasswordResetStatus.SUCCESS, "密码重置链接已发送到您的邮箱");
    }

    // 验证密码重置令牌方法 - 验证重置令牌的有效性
    public PasswordResetTokenValidationResult validateResetToken(String token, String ipAddress) {
        // 1. 查找重置记录
        Optional<PasswordReset> resetOpt = userRepository.findPasswordResetByTokenHash(
                cn.hutool.crypto.digest.DigestUtil.sha256Hex(token)
        );

        if (!resetOpt.isPresent()) {
            return new PasswordResetTokenValidationResult(PasswordResetStatus.INVALID_TOKEN, "无效的重置令牌");
        }

        PasswordReset passwordReset = resetOpt.get();

        // 2. 检查是否可以验证
        if (!passwordReset.canVerify()) {
            return new PasswordResetTokenValidationResult(PasswordResetStatus.TOKEN_INVALID, passwordReset.getStatusDescription());
        }

        // 3. 检查IP地址匹配（可选增强安全）
        if (!passwordReset.matchesIpAddress(ipAddress)) {
            passwordReset.recordFailedAttempt();
            userRepository.savePasswordReset(passwordReset);
            return new PasswordResetTokenValidationResult(PasswordResetStatus.IP_MISMATCH, "IP地址不匹配");
        }

        return new PasswordResetTokenValidationResult(PasswordResetStatus.SUCCESS, "令牌验证成功");
    }

    // 执行密码重置方法 - 执行实际的密码重置操作
    public PasswordResetExecutionResult executePasswordReset(String token, String newPassword, String ipAddress) {
        // 1. 验证新密码强度
        PasswordValidationResult validation = validateNewPassword(newPassword);
        if (!validation.isValid()) {
            return new PasswordResetExecutionResult(PasswordResetStatus.PASSWORD_INVALID, validation.getErrorMessage());
        }

        // 2. 查找重置记录
        Optional<PasswordReset> resetOpt = userRepository.findPasswordResetByTokenHash(
                cn.hutool.crypto.digest.DigestUtil.sha256Hex(token)
        );

        if (!resetOpt.isPresent()) {
            return new PasswordResetExecutionResult(PasswordResetStatus.INVALID_TOKEN, "无效的重置令牌");
        }

        PasswordReset passwordReset = resetOpt.get();

        // 3. 检查是否可以执行重置
        if (!passwordReset.canVerify()) {
            return new PasswordResetExecutionResult(PasswordResetStatus.TOKEN_INVALID, passwordReset.getStatusDescription());
        }

        // 4. 查找用户
        Optional<User> userOpt = userRepository.findById(passwordReset.getUserId());
        if (!userOpt.isPresent()) {
            return new PasswordResetExecutionResult(PasswordResetStatus.USER_NOT_FOUND, "用户不存在");
        }

        User user = userOpt.get();

        // 5. 检查新密码是否与历史密码相同
        if (securityPolicyService.isPasswordReused(user.getId(), newPassword)) {
            return new PasswordResetExecutionResult(PasswordResetStatus.PASSWORD_REUSED, "新密码不能与最近使用的密码相同");
        }

        // 6. 执行密码重置
        String newPasswordHash = BCrypt.hashpw(newPassword, BCrypt.gensalt());
        boolean resetSuccess = passwordReset.performReset(token, newPasswordHash, ipAddress);

        if (!resetSuccess) {
            passwordReset.recordFailedAttempt();
            userRepository.savePasswordReset(passwordReset);
            return new PasswordResetExecutionResult(PasswordResetStatus.TOKEN_INVALID, "重置令牌验证失败");
        }

        // 7. 更新用户密码
        user.updatePassword(newPasswordHash, null); // 系统操作
        userRepository.save(user);

        // 8. 保存重置记录
        userRepository.savePasswordReset(passwordReset);

        // 9. 撤销用户的所有刷新令牌（强制重新登录）
        userRepository.revokeAllRefreshTokensByUserId(user.getId(), null);

        // 10. 解锁用户账户（如果因密码失败被锁定）
        List<UserLockout> activeLockouts = userRepository.findActiveLockoutsByUserId(user.getId());
        for (UserLockout lockout : activeLockouts) {
            if (lockout.getLockType() == UserLockout.LockType.PASSWORD_FAILED) {
                userRepository.unlockUser(user.getId(), "密码重置后自动解锁", null);
                break;
            }
        }

        return new PasswordResetExecutionResult(PasswordResetStatus.SUCCESS, "密码重置成功");
    }

    // 账户锁定业务逻辑

    // 手动锁定用户账户方法 - 管理员手动锁定用户账户
    public UserLockResult lockUser(Long userId, String lockReason, Integer lockDuration,
                                  Long lockedBy, String ipAddress, String userAgent) {
        // 1. 查找用户
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return new UserLockResult(UserLockStatus.USER_NOT_FOUND, "用户不存在");
        }

        User user = userOpt.get();

        // 2. 检查用户是否已被锁定
        List<UserLockout> activeLockouts = userRepository.findActiveLockoutsByUserId(userId);
        if (!activeLockouts.isEmpty()) {
            return new UserLockResult(UserLockStatus.ALREADY_LOCKED, "用户已被锁定");
        }

        // 3. 创建锁定记录
        UserLockout lockout;
        if (lockDuration != null && lockDuration > 0) {
            lockout = UserLockout.createTemporaryLock(
                    userId, UserLockout.LockType.ADMIN_ACTION, lockReason,
                    lockDuration, lockedBy, ipAddress, userAgent, null
            );
        } else {
            lockout = UserLockout.createPermanentLock(
                    userId, UserLockout.LockType.ADMIN_ACTION, lockReason,
                    lockedBy, ipAddress, userAgent, null
            );
        }

        userRepository.saveUserLockout(lockout);

        // 4. 锁定用户账户
        user.lockAccount(lockReason, lockedBy);
        userRepository.save(user);

        // 5. 撤销用户的所有会话
        userRepository.revokeAllRefreshTokensByUserId(userId, lockedBy);

        return new UserLockResult(UserLockStatus.SUCCESS, "用户锁定成功");
    }

    // 解锁用户账户方法 - 解锁被锁定的用户账户
    public UserUnlockResult unlockUser(Long userId, String unlockReason, Long unlockedBy) {
        // 1. 查找用户
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return new UserUnlockResult(UserUnlockStatus.USER_NOT_FOUND, "用户不存在");
        }

        User user = userOpt.get();

        // 2. 查找活跃的锁定记录
        List<UserLockout> activeLockouts = userRepository.findActiveLockoutsByUserId(userId);
        if (activeLockouts.isEmpty()) {
            return new UserUnlockResult(UserUnlockStatus.NOT_LOCKED, "用户未被锁定");
        }

        // 3. 解锁用户账户
        userRepository.unlockUser(userId, unlockReason, unlockedBy);

        // 4. 更新用户状态
        user.unlockAccount(unlockedBy);
        userRepository.save(user);

        return new UserUnlockResult(UserUnlockStatus.SUCCESS, "用户解锁成功");
    }

    // 自动解锁过期的锁定记录方法 - 系统自动解锁过期的锁定
    public AutoUnlockResult autoUnlockExpiredLocks() {
        int unlockedCount = userRepository.autoUnlockExpiredLocks();

        return new AutoUnlockResult(unlockedCount, "自动解锁完成");
    }

    // 安全策略执行

    // 检查用户安全风险方法 - 检查用户账户的安全风险等级
    public SecurityRiskCheckResult checkSecurityRisk(Long userId, String ipAddress, String userAgent) {
        // 1. 查找用户
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return new SecurityRiskCheckResult(SecurityRiskLevel.UNKNOWN, "用户不存在");
        }

        User user = userOpt.get();

        // 2. 检查各种安全风险
        SecurityRiskLevel riskLevel = SecurityRiskLevel.LOW;
        StringBuilder riskReasons = new StringBuilder();

        // 检查异常登录地点
        if (securityPolicyService.isSuspiciousLocation(userId, ipAddress)) {
            riskLevel = updateRiskLevel(riskLevel, SecurityRiskLevel.HIGH);
            riskReasons.append("检测到异常登录地点；");
        }

        // 检查异常设备
        if (securityPolicyService.isSuspiciousDevice(userId, userAgent)) {
            riskLevel = updateRiskLevel(riskLevel, SecurityRiskLevel.MEDIUM);
            riskReasons.append("检测到异常设备；");
        }

        // 检查登录频率
        if (securityPolicyService.isAbnormalLoginFrequency(userId)) {
            riskLevel = updateRiskLevel(riskLevel, SecurityRiskLevel.MEDIUM);
            riskReasons.append("检测到异常登录频率；");
        }

        // 检查密码安全
        if (securityPolicyService.isWeakPassword(userId)) {
            riskLevel = updateRiskLevel(riskLevel, SecurityRiskLevel.LOW);
            riskReasons.append("密码强度较弱；");
        }

        // 如果是高风险，可以考虑临时锁定账户
        if (riskLevel == SecurityRiskLevel.HIGH) {
            UserLockout securityLockout = UserLockout.createSecurityRiskLock(
                    userId, "检测到安全风险: " + riskReasons.toString(), null, ipAddress, userAgent
            );
            userRepository.saveUserLockout(securityLockout);
        }

        return new SecurityRiskCheckResult(riskLevel, riskReasons.toString());
    }

    // 私有辅助方法

    // 创建密码重置记录
    private PasswordReset createPasswordReset(Long userId, String email, String ipAddress, String userAgent) {
        String resetToken = generateResetToken();
        String tokenHash = cn.hutool.crypto.digest.DigestUtil.sha256Hex(resetToken);
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(1); // 1小时过期

        return PasswordReset.create(userId, email, resetToken, tokenHash, expiresAt, ipAddress, userAgent);
    }

    // 发送密码重置邮件
    private void sendPasswordResetEmail(String email, String resetToken) {
        String subject = "重置您的密码";
        String content = buildPasswordResetEmailContent(resetToken);
        emailService.sendEmail(email, subject, content);
    }

    // 构建密码重置邮件内容
    private String buildPasswordResetEmailContent(String resetToken) {
        return "请点击以下链接重置您的密码：\n" +
               "https://example.com/reset-password?token=" + resetToken + "\n" +
               "重置链接1小时内有效，请及时重置。";
    }

    // 生成重置令牌
    private String generateResetToken() {
        return RandomUtil.randomString(32);
    }

    // 验证新密码
    private PasswordValidationResult validateNewPassword(String password) {
        if (StrUtil.isBlank(password)) {
            return new PasswordValidationResult(false, "密码不能为空");
        }
        if (password.length() < 8) {
            return new PasswordValidationResult(false, "密码长度至少8位");
        }
        if (!cn.hutool.core.util.StrUtil.containsAny(password, "abcdefghijklmnopqrstuvwxyz")) {
            return new PasswordValidationResult(false, "密码必须包含小写字母");
        }
        if (!cn.hutool.core.util.StrUtil.containsAny(password, "ABCDEFGHIJKLMNOPQRSTUVWXYZ")) {
            return new PasswordValidationResult(false, "密码必须包含大写字母");
        }
        if (!cn.hutool.core.util.StrUtil.containsAny(password, "0123456789")) {
            return new PasswordValidationResult(false, "密码必须包含数字");
        }

        return new PasswordValidationResult(true, null);
    }

    // 更新风险等级
    private SecurityRiskLevel updateRiskLevel(SecurityRiskLevel current, SecurityRiskLevel newLevel) {
        if (newLevel.ordinal() > current.ordinal()) {
            return newLevel;
        }
        return current;
    }

    // 结果类定义

    // 密码重置状态枚举
    public enum PasswordResetStatus {
        SUCCESS,                // 成功
        INVALID_INPUT,          // 输入无效
        USER_NOT_FOUND,         // 用户不存在
        USER_INACTIVE,          // 用户未激活
        INVALID_TOKEN,          // 无效令牌
        TOKEN_INVALID,          // 令牌无效
        TOKEN_EXPIRED,          // 令牌过期
        TOKEN_USED,             // 令牌已使用
        PASSWORD_INVALID,       // 密码无效
        PASSWORD_REUSED,        // 密码重复使用
        IP_MISMATCH,            // IP不匹配
        RATE_LIMITED,           // 频率限制
        SYSTEM_ERROR            // 系统错误
    }

    // 用户锁定状态枚举
    public enum UserLockStatus {
        SUCCESS,                // 成功
        USER_NOT_FOUND,         // 用户不存在
        ALREADY_LOCKED,         // 已锁定
        SYSTEM_ERROR            // 系统错误
    }

    // 用户解锁状态枚举
    public enum UserUnlockStatus {
        SUCCESS,                // 成功
        USER_NOT_FOUND,         // 用户不存在
        NOT_LOCKED,             // 未锁定
        SYSTEM_ERROR            // 系统错误
    }

    // 安全风险等级枚举
    public enum SecurityRiskLevel {
        LOW,                    // 低风险
        MEDIUM,                 // 中等风险
        HIGH,                   // 高风险
        UNKNOWN                 // 未知
    }

    // 密码重置请求结果类
    public static class PasswordResetRequestResult {
        private final PasswordResetStatus status;
        private final String message;

        public PasswordResetRequestResult(PasswordResetStatus status, String message) {
            this.status = status;
            this.message = message;
        }

        public PasswordResetStatus getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public boolean isSuccess() {
            return status == PasswordResetStatus.SUCCESS;
        }
    }

    // 密码重置令牌验证结果类
    public static class PasswordResetTokenValidationResult {
        private final PasswordResetStatus status;
        private final String message;

        public PasswordResetTokenValidationResult(PasswordResetStatus status, String message) {
            this.status = status;
            this.message = message;
        }

        public PasswordResetStatus getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public boolean isValid() {
            return status == PasswordResetStatus.SUCCESS;
        }
    }

    // 密码重置执行结果类
    public static class PasswordResetExecutionResult {
        private final PasswordResetStatus status;
        private final String message;

        public PasswordResetExecutionResult(PasswordResetStatus status, String message) {
            this.status = status;
            this.message = message;
        }

        public PasswordResetStatus getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public boolean isSuccess() {
            return status == PasswordResetStatus.SUCCESS;
        }
    }

    // 用户锁定结果类
    public static class UserLockResult {
        private final UserLockStatus status;
        private final String message;

        public UserLockResult(UserLockStatus status, String message) {
            this.status = status;
            this.message = message;
        }

        public UserLockStatus getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public boolean isSuccess() {
            return status == UserLockStatus.SUCCESS;
        }
    }

    // 用户解锁结果类
    public static class UserUnlockResult {
        private final UserUnlockStatus status;
        private final String message;

        public UserUnlockResult(UserUnlockStatus status, String message) {
            this.status = status;
            this.message = message;
        }

        public UserUnlockStatus getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public boolean isSuccess() {
            return status == UserUnlockStatus.SUCCESS;
        }
    }

    // 自动解锁结果类
    public static class AutoUnlockResult {
        private final int unlockedCount;
        private final String message;

        public AutoUnlockResult(int unlockedCount, String message) {
            this.unlockedCount = unlockedCount;
            this.message = message;
        }

        public int getUnlockedCount() {
            return unlockedCount;
        }

        public String getMessage() {
            return message;
        }
    }

    // 安全风险检查结果类
    public static class SecurityRiskCheckResult {
        private final SecurityRiskLevel riskLevel;
        private final String riskReasons;

        public SecurityRiskCheckResult(SecurityRiskLevel riskLevel, String riskReasons) {
            this.riskLevel = riskLevel;
            this.riskReasons = riskReasons;
        }

        public SecurityRiskLevel getRiskLevel() {
            return riskLevel;
        }

        public String getRiskReasons() {
            return riskReasons;
        }

        public boolean isHighRisk() {
            return riskLevel == SecurityRiskLevel.HIGH;
        }
    }

    // 密码验证结果类
    private static class PasswordValidationResult {
        private final boolean valid;
        private final String errorMessage;

        public PasswordValidationResult(boolean valid, String errorMessage) {
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

    // 邮箱服务接口
    public interface EmailService {
        void sendEmail(String to, String subject, String content);
    }

    // 安全策略服务接口
    public interface SecurityPolicyService {
        boolean isPasswordResetRateLimited(String email, String ipAddress);
        boolean isPasswordReused(Long userId, String newPassword);
        boolean isSuspiciousLocation(Long userId, String ipAddress);
        boolean isSuspiciousDevice(Long userId, String userAgent);
        boolean isAbnormalLoginFrequency(Long userId);
        boolean isWeakPassword(Long userId);
    }
}