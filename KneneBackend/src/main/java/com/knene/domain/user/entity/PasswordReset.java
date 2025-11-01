/**
 * PasswordReset类
 * PasswordReset相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.domain.user.entity;

import java.time.LocalDateTime;

// 密码重置实体
public class PasswordReset {

    // 1. 主键字段
    private Long id; // 主键ID

    // 2. 用户关联
    private Long userId; // 用户ID
    private String email; // 邮箱地址

    // 3. 重置令牌
    private String resetToken; // 重置令牌
    private String tokenHash; // 令牌哈希值

    // 4. 使用状态
    private Boolean isUsed; // 是否已使用
    private LocalDateTime usedAt; // 使用时间

    // 5. 过期和限制
    private LocalDateTime expiresAt; // 过期时间
    private Integer attempts; // 尝试次数
    private Integer maxAttempts; // 最大尝试次数
    private Boolean isLocked; // 是否锁定
    private LocalDateTime lockedAt; // 锁定时间

    // 6. 安全信息
    private String ipAddress; // 请求IP地址
    private String userAgent; // 用户代理信息
    private String newPasswordHash; // 新密码哈希

    // 7. 状态管理
    private Boolean isActive; // 是否激活

    // 8. 审计字段
    private LocalDateTime createdAt; // 创建时间
    private LocalDateTime updatedAt; // 更新时间

    // 私有构造器，使用Builder模式创建
    private PasswordReset() {
        this.isUsed = false;
        this.attempts = 0;
        this.maxAttempts = 3; // 默认最大尝试3次
        this.isLocked = false;
        this.isActive = true;
    }

    // 静态工厂方法 - 创建密码重置请求
    public static PasswordReset create(Long userId, String email, String resetToken, String tokenHash,
                                     LocalDateTime expiresAt, String ipAddress, String userAgent) {
        if (userId == null) {
            throw new IllegalArgumentException("用户ID不能为空");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("邮箱不能为空");
        }
        if (resetToken == null || resetToken.trim().isEmpty()) {
            throw new IllegalArgumentException("重置令牌不能为空");
        }
        if (tokenHash == null || tokenHash.trim().isEmpty()) {
            throw new IllegalArgumentException("令牌哈希不能为空");
        }
        if (expiresAt == null) {
            throw new IllegalArgumentException("过期时间不能为空");
        }
        if (expiresAt.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("过期时间必须在未来");
        }

        PasswordReset passwordReset = new PasswordReset();
        passwordReset.userId = userId;
        passwordReset.email = email.trim().toLowerCase();
        passwordReset.resetToken = resetToken;
        passwordReset.tokenHash = tokenHash;
        passwordReset.expiresAt = expiresAt;
        passwordReset.ipAddress = ipAddress;
        passwordReset.userAgent = userAgent;
        passwordReset.createdAt = LocalDateTime.now();
        passwordReset.updatedAt = LocalDateTime.now();

        return passwordReset;
    }

    // 业务方法 - 验证重置令牌
    public boolean verifyToken(String providedToken, String ipAddress) {
        if (!canVerify()) {
            return false;
        }

        if (resetToken.equals(providedToken)) {
            this.isUsed = true;
            this.usedAt = LocalDateTime.now();
            this.isActive = false; // 使用后停用
            this.updatedAt = LocalDateTime.now();
            return true;
        } else {
            recordFailedAttempt();
            return false;
        }
    }

    // 业务方法 - 执行密码重置
    public boolean performReset(String providedToken, String newPasswordHash, String ipAddress) {
        if (!verifyToken(providedToken, ipAddress)) {
            return false;
        }

        this.newPasswordHash = newPasswordHash;
        this.updatedAt = LocalDateTime.now();
        return true;
    }

    // 业务方法 - 检查是否可以验证
    public boolean canVerify() {
        return isActive && !isUsed && !isLocked && !isExpired() && !exceedsMaxAttempts();
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

    // 业务方法 - 停用重置请求
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

    // 业务方法 - 获取重置状态描述
    public String getStatusDescription() {
        if (isUsed) {
            return "已使用";
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

    // 业务方法 - 检查是否可以重新生成令牌
    public boolean canRegenerate() {
        return !isUsed && (isExpired() || isLocked || !isActive);
    }

    // 业务方法 - 获取重置链接有效时长（分钟）
    public Long getLinkValidityMinutes() {
        return java.time.Duration.between(createdAt, expiresAt).toMinutes();
    }

    // 业务方法 - 检查重置请求使用时长（分钟）
    public Long getUsageDurationMinutes() {
        if (usedAt == null) {
            return null;
        }
        return java.time.Duration.between(createdAt, usedAt).toMinutes();
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

    public String getResetToken() {
        return resetToken;
    }

    public String getTokenHash() {
        return tokenHash;
    }

    public Boolean getIsUsed() {
        return isUsed;
    }

    public LocalDateTime getUsedAt() {
        return usedAt;
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

    public String getNewPasswordHash() {
        return newPasswordHash;
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
        return "PasswordReset{" +
                "id=" + id +
                ", userId=" + userId +
                ", email='" + email + '\'' +
                ", isUsed=" + isUsed +
                ", usedAt=" + usedAt +
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
                ", newPasswordHashSet=" + (newPasswordHash != null) +
                ", createdAt=" + createdAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PasswordReset that = (PasswordReset) o;
        return java.util.Objects.equals(id, that.id) &&
               java.util.Objects.equals(email, that.email);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, email);
    }
}