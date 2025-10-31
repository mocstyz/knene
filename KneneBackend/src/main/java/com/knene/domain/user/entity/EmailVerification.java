/**
 * EmailVerification类
 * EmailVerification相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.domain.user.entity;

import java.time.LocalDateTime;

// 邮箱验证类型枚举
public enum VerificationType {
    REGISTRATION("registration", "注册验证"),
    EMAIL_CHANGE("email_change", "邮箱变更验证"),
    PASSWORD_RESET("password_reset", "密码重置验证");

    private final String code; // 状态代码
    private final String description; // 状态描述

    // 构造函数 - 初始化枚举值
    VerificationType(String code, String description) {
        this.code = code;
        this.description = description;
    }

    // 获取状态代码
    public String getCode() {
        return code;
    }

    // 获取状态描述
    public String getDescription() {
        return description;
    }
}

// 邮箱验证实体
public class EmailVerification {

    // 1. 主键字段
    private Long id; // 主键ID

    // 2. 用户关联
    private Long userId; // 用户ID
    private String email; // 邮箱地址

    // 3. 验证令牌
    private String verificationToken; // 验证令牌
    private String tokenHash; // 令牌哈希值
    private VerificationType verificationType; // 验证类型

    // 4. 验证状态
    private Boolean isVerified; // 是否已验证
    private LocalDateTime verifiedAt; // 验证时间

    // 5. 过期和限制
    private LocalDateTime expiresAt; // 过期时间
    private Integer attempts; // 尝试次数
    private Integer maxAttempts; // 最大尝试次数
    private Boolean isLocked; // 是否锁定
    private LocalDateTime lockedAt; // 锁定时间

    // 6. 安全信息
    private String ipAddress; // 请求IP地址
    private String userAgent; // 用户代理信息
    private String oldEmail; // 旧邮箱（邮箱变更时使用）

    // 7. 状态管理
    private Boolean isActive; // 是否激活

    // 8. 审计字段
    private LocalDateTime createdAt; // 创建时间
    private LocalDateTime updatedAt; // 更新时间

    // 私有构造器，使用Builder模式创建
    private EmailVerification() {
        this.isVerified = false;
        this.attempts = 0;
        this.maxAttempts = 5; // 默认最大尝试5次
        this.isLocked = false;
        this.isActive = true;
    }

    // 静态工厂方法 - 创建注册邮箱验证
    public static EmailVerification createRegistrationVerification(Long userId, String email,
                                                              String verificationToken, String tokenHash,
                                                              LocalDateTime expiresAt,
                                                              String ipAddress, String userAgent) {
        EmailVerification verification = new EmailVerification();
        verification.userId = userId;
        verification.email = email.trim().toLowerCase();
        verification.verificationToken = verificationToken;
        verification.tokenHash = tokenHash;
        verification.verificationType = VerificationType.REGISTRATION;
        verification.expiresAt = expiresAt;
        verification.ipAddress = ipAddress;
        verification.userAgent = userAgent;
        verification.createdAt = LocalDateTime.now();
        verification.updatedAt = LocalDateTime.now();

        return verification;
    }

    // 静态工厂方法 - 创建邮箱变更验证
    public static EmailVerification createEmailChangeVerification(Long userId, String newEmail,
                                                              String oldEmail, String verificationToken,
                                                              String tokenHash, LocalDateTime expiresAt,
                                                              String ipAddress, String userAgent) {
        EmailVerification verification = new EmailVerification();
        verification.userId = userId;
        verification.email = newEmail.trim().toLowerCase();
        verification.oldEmail = oldEmail != null ? oldEmail.trim().toLowerCase() : null;
        verification.verificationToken = verificationToken;
        verification.tokenHash = tokenHash;
        verification.verificationType = VerificationType.EMAIL_CHANGE;
        verification.expiresAt = expiresAt;
        verification.ipAddress = ipAddress;
        verification.userAgent = userAgent;
        verification.createdAt = LocalDateTime.now();
        verification.updatedAt = LocalDateTime.now();

        return verification;
    }

    // 静态工厂方法 - 创建密码重置验证
    public static EmailVerification createPasswordResetVerification(Long userId, String email,
                                                                String verificationToken, String tokenHash,
                                                                LocalDateTime expiresAt,
                                                                String ipAddress, String userAgent) {
        EmailVerification verification = new EmailVerification();
        verification.userId = userId;
        verification.email = email.trim().toLowerCase();
        verification.verificationToken = verificationToken;
        verification.tokenHash = tokenHash;
        verification.verificationType = VerificationType.PASSWORD_RESET;
        verification.maxAttempts = 3; // 密码重置限制3次尝试
        verification.expiresAt = expiresAt;
        verification.ipAddress = ipAddress;
        verification.userAgent = userAgent;
        verification.createdAt = LocalDateTime.now();
        verification.updatedAt = LocalDateTime.now();

        return verification;
    }

    // 业务方法 - 验证令牌
    public boolean verifyToken(String providedToken, String ipAddress) {
        if (!canVerify()) {
            return false;
        }

        if (verificationToken.equals(providedToken)) {
            this.isVerified = true;
            this.verifiedAt = LocalDateTime.now();
            this.isActive = false; // 验证成功后停用
            this.updatedAt = LocalDateTime.now();
            return true;
        } else {
            recordFailedAttempt();
            return false;
        }
    }

    // 业务方法 - 检查是否可以验证
    public boolean canVerify() {
        return isActive && !isVerified && !isLocked && !isExpired() && !exceedsMaxAttempts();
    }

    // 业务方法 - 检查是否过期
    public boolean isExpired() {
        return expiresAt.isBefore(LocalDateTime.now());
    }

    // 业务方法 - 检查是否超过最大尝试次数
    public boolean exceedsMaxAttempts() {
        return attempts >= maxAttempts;
    }

    // 业务方法 - 记录验证失败
    public void recordFailedAttempt() {
        this.attempts++;
        this.updatedAt = LocalDateTime.now();

        // 达到最大尝试次数时锁定
        if (this.attempts >= this.maxAttempts) {
            this.isLocked = true;
            this.lockedAt = LocalDateTime.now();
        }
    }

    // 业务方法 - 手动锁定
    public void lock() {
        this.isLocked = true;
        this.lockedAt = LocalDateTime.now();
        this.isActive = false;
        this.updatedAt = LocalDateTime.now();
    }

    // 业务方法 - 手动解锁
    public void unlock() {
        this.isLocked = false;
        this.lockedAt = null;
        this.attempts = 0; // 重置尝试次数
        this.updatedAt = LocalDateTime.now();
    }

    // 业务方法 - 停用验证
    public void deactivate() {
        this.isActive = false;
        this.updatedAt = LocalDateTime.now();
    }

    // 业务方法 - 检查剩余有效时间（分钟）
    public Long getRemainingMinutes() {
        LocalDateTime now = LocalDateTime.now();
        if (expiresAt.isBefore(now)) {
            return 0L; // 已过期
        }
        return java.time.Duration.between(now, expiresAt).toMinutes();
    }

    // 业务方法 - 检查剩余尝试次数
    public Integer getRemainingAttempts() {
        return Math.max(0, maxAttempts - attempts);
    }

    // 业务方法 - 检查是否即将过期（10分钟内）
    public boolean isNearExpiry() {
        return getRemainingMinutes() <= 10;
    }

    // 业务方法 - 检查IP地址是否匹配
    public boolean matchesIpAddress(String ipAddress) {
        if (this.ipAddress == null || ipAddress == null) {
            return true; // 如果任一为空，认为匹配
        }
        return this.ipAddress.equals(ipAddress);
    }

    // 业务方法 - 获取验证状态描述
    public String getStatusDescription() {
        if (isVerified) {
            return "已验证";
        }
        if (isLocked) {
            return "已锁定";
        }
        if (isExpired()) {
            return "已过期";
        }
        if (exceedsMaxAttempts()) {
            return "尝试次数超限";
        }
        if (!isActive) {
            return "已停用";
        }
        return "待验证";
    }

    // Getter方法
    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getVerificationToken() {
        return verificationToken;
    }

    public String getTokenHash() {
        return tokenHash;
    }

    public VerificationType getVerificationType() {
        return verificationType;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public Integer getAttempts() {
        return attempts;
    }

    public Integer getMaxAttempts() {
        return maxAttempts;
    }

    public Boolean getIsLocked() {
        return isLocked;
    }

    public LocalDateTime getLockedAt() {
        return lockedAt;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public String getOldEmail() {
        return oldEmail;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // 内部方法供基础设施层使用
    void setId(Long id) {
        this.id = id;
    }

    void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "EmailVerification{" +
                "id=" + id +
                ", userId=" + userId +
                ", email='" + email + '\'' +
                ", verificationType=" + verificationType +
                ", isVerified=" + isVerified +
                ", verifiedAt=" + verifiedAt +
                ", expiresAt=" + expiresAt +
                ", attempts=" + attempts +
                ", maxAttempts=" + maxAttempts +
                ", isLocked=" + isLocked +
                ", lockedAt=" + lockedAt +
                ", isActive=" + isActive +
                ", isExpired=" + isExpired() +
                ", canVerify=" + canVerify() +
                ", remainingMinutes=" + getRemainingMinutes() +
                ", remainingAttempts=" + getRemainingAttempts() +
                ", statusDescription='" + getStatusDescription() + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EmailVerification that = (EmailVerification) o;
        return java.util.Objects.equals(id, that.id) &&
               java.util.Objects.equals(email, that.email) &&
               verificationType == that.verificationType;
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, email, verificationType);
    }
}