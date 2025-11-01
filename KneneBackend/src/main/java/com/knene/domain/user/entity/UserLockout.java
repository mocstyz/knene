/**
 * UserLockout类
 * UserLockout相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.domain.user.entity;

import java.time.LocalDateTime;

// 锁定类型枚举 - 定义用户锁定的业务类型
public enum LockType {
    PASSWORD_FAILED("password_failed", "密码失败"),
    ACCOUNT_SUSPENSION("account_suspension", "账户暂停"),
    ADMIN_ACTION("admin_action", "管理员操作"),
    SECURITY_RISK("security_risk", "安全风险");

    private final String code; // 锁定类型代码
    private final String description; // 锁定类型描述

    // 构造函数 - 初始化锁定类型
    LockType(String code, String description) {
        this.code = code;
        this.description = description;
    }

    // 获取锁定类型代码
    public String getCode() {
        return code;
    }

    // 获取锁定类型描述
    public String getDescription() {
        return description;
    }
}

// 用户锁定记录实体 - 管理用户账户锁定状态
public class UserLockout {

    // 1. 主键字段
    private Long id; // 主键ID

    // 2. 用户关联
    private Long userId; // 用户ID

    // 3. 锁定信息
    private LockType lockType; // 锁定类型
    private String lockReason; // 锁定原因
    private Boolean isPermanent; // 是否永久锁定
    private Integer lockDuration; // 锁定时长（分钟）
    private LocalDateTime lockedAt; // 锁定时间
    private LocalDateTime expiresAt; // 解锁时间

    // 4. 状态管理
    private Boolean isActive; // 是否激活
    private String unlockReason; // 解锁原因
    private LocalDateTime unlockedAt; // 解锁时间
    private Long unlockedBy; // 解锁人ID

    // 5. 安全信息
    private String ipAddress; // 触发锁定的IP地址
    private String userAgent; // 用户代理信息
    private Integer failedAttempts; // 失败尝试次数

    // 6. 审计字段
    private Long createdBy; // 创建人ID
    private Long updatedBy; // 更新人ID
    private Integer version; // 版本号
    private LocalDateTime createdAt; // 创建时间
    private LocalDateTime updatedAt; // 更新时间

    // 私有构造器，使用Builder模式创建
    private UserLockout() {
        this.isPermanent = false;
        this.isActive = true;
        this.version = 1;
    }

    // 静态工厂方法 - 创建临时锁定
    public static UserLockout createTemporaryLock(Long userId, LockType lockType, String lockReason,
                                                 Integer lockDuration, Long createdBy,
                                                 String ipAddress, String userAgent,
                                                 Integer failedAttempts) {
        UserLockout lockout = new UserLockout();
        lockout.userId = userId;
        lockout.lockType = lockType;
        lockout.lockReason = lockReason;
        lockout.isPermanent = false;
        lockout.lockDuration = lockDuration;
        lockout.lockedAt = LocalDateTime.now();
        lockout.expiresAt = lockDuration != null ? LocalDateTime.now().plusMinutes(lockDuration) : null;
        lockout.ipAddress = ipAddress;
        lockout.userAgent = userAgent;
        lockout.failedAttempts = failedAttempts != null ? failedAttempts : 0;
        lockout.createdBy = createdBy;
        lockout.updatedBy = createdBy;
        lockout.createdAt = LocalDateTime.now();
        lockout.updatedAt = LocalDateTime.now();

        return lockout;
    }

    // 静态工厂方法 - 创建永久锁定
    public static UserLockout createPermanentLock(Long userId, LockType lockType, String lockReason,
                                                 Long createdBy, String ipAddress, String userAgent,
                                                 Integer failedAttempts) {
        UserLockout lockout = new UserLockout();
        lockout.userId = userId;
        lockout.lockType = lockType;
        lockout.lockReason = lockReason;
        lockout.isPermanent = true;
        lockout.lockDuration = null;
        lockout.lockedAt = LocalDateTime.now();
        lockout.expiresAt = null;
        lockout.ipAddress = ipAddress;
        lockout.userAgent = userAgent;
        lockout.failedAttempts = failedAttempts != null ? failedAttempts : 0;
        lockout.createdBy = createdBy;
        lockout.updatedBy = createdBy;
        lockout.createdAt = LocalDateTime.now();
        lockout.updatedAt = LocalDateTime.now();

        return lockout;
    }

    // 静态工厂方法 - 创建安全风险锁定
    public static UserLockout createSecurityRiskLock(Long userId, String lockReason,
                                                     Long createdBy, String ipAddress,
                                                     String userAgent) {
        return createTemporaryLock(userId, LockType.SECURITY_RISK, lockReason, 60, createdBy, ipAddress, userAgent, 0);
    }

    // 业务方法 - 手动解锁
    public void unlock(String unlockReason, Long unlockedBy) {
        this.isActive = false;
        this.unlockReason = unlockReason;
        this.unlockedAt = LocalDateTime.now();
        this.unlockedBy = unlockedBy;
        this.updatedAt = LocalDateTime.now();
    }

    // 业务方法 - 自动解锁（由系统定时任务调用）
    public boolean autoUnlock() {
        if (!isActive || isPermanent) {
            return false; // 已解锁或永久锁定，无需自动解锁
        }

        if (expiresAt != null && expiresAt.isBefore(LocalDateTime.now())) {
            this.isActive = false;
            this.unlockReason = "系统自动解锁";
            this.unlockedAt = LocalDateTime.now();
            this.unlockedBy = null;
            this.updatedAt = LocalDateTime.now();
            return true;
        }

        return false;
    }

    // 业务方法 - 检查是否锁定中
    public boolean isLocked() {
        return isActive && (isPermanent || (expiresAt != null && expiresAt.isAfter(LocalDateTime.now())));
    }

    // 业务方法 - 检查是否永久锁定
    public boolean isPermanentLock() {
        return isPermanent;
    }

    // 业务方法 - 检查剩余锁定时间（分钟）
    public Long getRemainingMinutes() {
        if (!isLocked() || isPermanent) {
            return null; // 永久锁定或未锁定
        }

        LocalDateTime now = LocalDateTime.now();
        if (expiresAt.isBefore(now)) {
            return 0L; // 已过期
        }
        return java.time.Duration.between(now, expiresAt).toMinutes();
    }

    // 业务方法 - 检查锁定时长（分钟）
    public Long getLockDurationMinutes() {
        if (lockDuration != null) {
            return lockDuration.longValue();
        }

        if (expiresAt != null && lockedAt != null) {
            return java.time.Duration.between(lockedAt, expiresAt).toMinutes();
        }

        return null;
    }

    // 业务方法 - 检查是否即将解锁（5分钟内）
    public boolean isNearUnlock() {
        Long remainingMinutes = getRemainingMinutes();
        return remainingMinutes != null && remainingMinutes <= 5;
    }

    // 业务方法 - 检查是否可以延长锁定时间
    public boolean canExtend() {
        return isActive && !isPermanent && expiresAt != null;
    }

    // 业务方法 - 延长锁定时间
    public UserLockout extend(Integer additionalMinutes, String reason) {
        if (!canExtend()) {
            throw new IllegalStateException("无法延长锁定时间");
        }

        if (additionalMinutes == null || additionalMinutes <= 0) {
            throw new IllegalArgumentException("延长时间必须大于0");
        }

        // 计算新的过期时间
        LocalDateTime newExpiresAt = expiresAt.plusMinutes(additionalMinutes);

        return new Builder()
                .userId(this.userId)
                .lockType(this.lockType)
                .lockReason(this.lockReason + " (延长" + additionalMinutes + "分钟: " + reason + ")")
                .isPermanent(false)
                .lockDuration(java.time.Duration.between(lockedAt, newExpiresAt).intValue())
                .lockedAt(this.lockedAt)
                .expiresAt(newExpiresAt)
                .isActive(true)
                .unlockReason(this.unlockReason)
                .unlockedAt(this.unlockedAt)
                .unlockedBy(this.unlockedBy)
                .ipAddress(this.ipAddress)
                .userAgent(this.userAgent)
                .failedAttempts(this.failedAttempts)
                .createdBy(this.createdBy)
                .updatedBy(this.updatedBy)
                .version(this.version + 1)
                .createdAt(this.createdAt)
                .updatedAt(LocalDateTime.now())
                .build();
    }

    // 业务方法 - 获取锁定状态描述
    public String getStatusDescription() {
        if (!isActive) {
            return "已解锁";
        }
        if (isPermanent) {
            return "永久锁定";
        }
        if (isLocked()) {
            return "临时锁定";
        }
        return "未激活";
    }

    // 业务方法 - 获取锁定严重程度
    public String getSeverityLevel() {
        switch (lockType) {
            case PASSWORD_FAILED:
                return failedAttempts != null && failedAttempts >= 5 ? "严重" : "中等";
            case SECURITY_RISK:
                return "严重";
            case ACCOUNT_SUSPENSION:
                return "高";
            case ADMIN_ACTION:
                return "可变";
            default:
                return "未知";
        }
    }

    // Builder模式（用于内部方法如extend）
    private static class Builder {
        private Long userId;
        private LockType lockType;
        private String lockReason;
        private Boolean isPermanent;
        private Integer lockDuration;
        private LocalDateTime lockedAt;
        private LocalDateTime expiresAt;
        private Boolean isActive;
        private String unlockReason;
        private LocalDateTime unlockedAt;
        private Long unlockedBy;
        private String ipAddress;
        private String userAgent;
        private Integer failedAttempts;
        private Long createdBy;
        private Long updatedBy;
        private Integer version;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public Builder lockType(LockType lockType) {
            this.lockType = lockType;
            return this;
        }

        public Builder lockReason(String lockReason) {
            this.lockReason = lockReason;
            return this;
        }

        public Builder isPermanent(Boolean isPermanent) {
            this.isPermanent = isPermanent;
            return this;
        }

        public Builder lockDuration(Integer lockDuration) {
            this.lockDuration = lockDuration;
            return this;
        }

        public Builder lockedAt(LocalDateTime lockedAt) {
            this.lockedAt = lockedAt;
            return this;
        }

        public Builder expiresAt(LocalDateTime expiresAt) {
            this.expiresAt = expiresAt;
            return this;
        }

        public Builder isActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public Builder unlockReason(String unlockReason) {
            this.unlockReason = unlockReason;
            return this;
        }

        public Builder unlockedAt(LocalDateTime unlockedAt) {
            this.unlockedAt = unlockedAt;
            return this;
        }

        public Builder unlockedBy(Long unlockedBy) {
            this.unlockedBy = unlockedBy;
            return this;
        }

        public Builder ipAddress(String ipAddress) {
            this.ipAddress = ipAddress;
            return this;
        }

        public Builder userAgent(String userAgent) {
            this.userAgent = userAgent;
            return this;
        }

        public Builder failedAttempts(Integer failedAttempts) {
            this.failedAttempts = failedAttempts;
            return this;
        }

        public Builder createdBy(Long createdBy) {
            this.createdBy = createdBy;
            return this;
        }

        public Builder updatedBy(Long updatedBy) {
            this.updatedBy = updatedBy;
            return this;
        }

        public Builder version(Integer version) {
            this.version = version;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public UserLockout build() {
            UserLockout lockout = new UserLockout();
            lockout.userId = this.userId;
            lockout.lockType = this.lockType;
            lockout.lockReason = this.lockReason;
            lockout.isPermanent = this.isPermanent;
            lockout.lockDuration = this.lockDuration;
            lockout.lockedAt = this.lockedAt;
            lockout.expiresAt = this.expiresAt;
            lockout.isActive = this.isActive;
            lockout.unlockReason = this.unlockReason;
            lockout.unlockedAt = this.unlockedAt;
            lockout.unlockedBy = this.unlockedBy;
            lockout.ipAddress = this.ipAddress;
            lockout.userAgent = this.userAgent;
            lockout.failedAttempts = this.failedAttempts;
            lockout.createdBy = this.createdBy;
            lockout.updatedBy = this.updatedBy;
            lockout.version = this.version;
            lockout.createdAt = this.createdAt;
            lockout.updatedAt = this.updatedAt;
            return lockout;
        }
    }

    // Getter方法
    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public LockType getLockType() {
        return lockType;
    }

    public String getLockReason() {
        return lockReason;
    }

    public Boolean getIsPermanent() {
        return isPermanent;
    }

    public Integer getLockDuration() {
        return lockDuration;
    }

    public LocalDateTime getLockedAt() {
        return lockedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public String getUnlockReason() {
        return unlockReason;
    }

    public LocalDateTime getUnlockedAt() {
        return unlockedAt;
    }

    public Long getUnlockedBy() {
        return unlockedBy;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public Integer getFailedAttempts() {
        return failedAttempts;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public Long getUpdatedBy() {
        return updatedBy;
    }

    public Integer getVersion() {
        return version;
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

    void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    void setUpdatedBy(Long updatedBy) {
        this.updatedBy = updatedBy;
    }

    void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "UserLockout{" +
                "id=" + id +
                ", userId=" + userId +
                ", lockType=" + lockType +
                ", lockReason='" + lockReason + '\'' +
                ", isPermanent=" + isPermanent +
                ", lockDuration=" + lockDuration +
                ", lockedAt=" + lockedAt +
                ", expiresAt=" + expiresAt +
                ", isActive=" + isActive +
                ", isLocked=" + isLocked() +
                ", remainingMinutes=" + getRemainingMinutes() +
                ", statusDescription='" + getStatusDescription() + '\'' +
                ", severityLevel='" + getSeverityLevel() + '\'' +
                ", failedAttempts=" + failedAttempts +
                ", createdAt=" + createdAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserLockout that = (UserLockout) o;
        return java.util.Objects.equals(id, that.id) &&
               java.util.Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, userId);
    }
}