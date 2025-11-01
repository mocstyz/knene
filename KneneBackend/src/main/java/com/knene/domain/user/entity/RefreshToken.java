/**
 * RefreshToken类
 * RefreshToken相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.domain.user.entity;

import java.time.LocalDateTime;

// 刷新令牌实体
public class RefreshToken {

    // 1. 主键字段
    private Long id; // 主键ID

    // 2. 用户关联
    private Long userId; // 用户ID
    private String username; // 用户名（冗余字段）

    // 3. 令牌信息
    private String tokenHash; // 令牌哈希值
    private String tokenSeries; // 令牌系列号
    private LocalDateTime expiresAt; // 过期时间

    // 4. 状态管理
    private Boolean isRevoked; // 是否已撤销
    private LocalDateTime revokedAt; // 撤销时间
    private Long revokedBy; // 撤销人ID

    // 5. 安全信息
    private String ipAddress; // 创建时IP地址
    private String userAgent; // 用户代理信息
    private String deviceFingerprint; // 设备指纹
    private Boolean isActive; // 是否激活

    // 6. 审计字段
    private LocalDateTime createdAt; // 创建时间
    private LocalDateTime updatedAt; // 更新时间

    // 私有构造器，使用Builder模式创建
    private RefreshToken() {
        this.isRevoked = false;
        this.isActive = true;
    }

    // 静态工厂方法 - 创建新的刷新令牌
    public static RefreshToken create(Long userId, String username, String tokenHash,
                                     String tokenSeries, LocalDateTime expiresAt,
                                     String ipAddress, String userAgent, String deviceFingerprint) {
        if (userId == null) {
            throw new IllegalArgumentException("用户ID不能为空");
        }
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("用户名不能为空");
        }
        if (tokenHash == null || tokenHash.trim().isEmpty()) {
            throw new IllegalArgumentException("令牌哈希不能为空");
        }
        if (tokenSeries == null || tokenSeries.trim().isEmpty()) {
            throw new IllegalArgumentException("令牌系列号不能为空");
        }
        if (expiresAt == null) {
            throw new IllegalArgumentException("过期时间不能为空");
        }
        if (expiresAt.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("过期时间必须在未来");
        }

        RefreshToken token = new RefreshToken();
        token.userId = userId;
        token.username = username.trim().toLowerCase();
        token.tokenHash = tokenHash;
        token.tokenSeries = tokenSeries;
        token.expiresAt = expiresAt;
        token.ipAddress = ipAddress;
        token.userAgent = userAgent;
        token.deviceFingerprint = deviceFingerprint;
        token.createdAt = LocalDateTime.now();
        token.updatedAt = LocalDateTime.now();

        return token;
    }

    // 业务方法 - 撤销令牌
    public void revoke(Long revokedBy) {
        this.isRevoked = true;
        this.revokedAt = LocalDateTime.now();
        this.revokedBy = revokedBy;
        this.isActive = false;
        this.updatedAt = LocalDateTime.now();
    }

    // 业务方法 - 检查令牌是否有效
    public boolean isValid() {
        return !isRevoked && isActive && !isExpired();
    }

    // 业务方法 - 检查令牌是否过期
    public boolean isExpired() {
        return expiresAt.isBefore(LocalDateTime.now());
    }

    // 业务方法 - 检查剩余有效时间（分钟）
    public Long getRemainingMinutes() {
        LocalDateTime now = LocalDateTime.now();
        if (expiresAt.isBefore(now)) {
            return 0L; // 已过期
        }
        return java.time.Duration.between(now, expiresAt).toMinutes();
    }

    // 业务方法 - 检查是否即将过期（30分钟内）
    public boolean isNearExpiry() {
        return getRemainingMinutes() <= 30;
    }

    // 业务方法 - 检查设备指纹是否匹配
    public boolean matchesDevice(String deviceFingerprint, String ipAddress) {
        return (this.deviceFingerprint == null && deviceFingerprint == null) ||
               (this.deviceFingerprint != null && this.deviceFingerprint.equals(deviceFingerprint)) &&
               (this.ipAddress == null && ipAddress == null) ||
               (this.ipAddress != null && this.ipAddress.equals(ipAddress));
    }

    // 业务方法 - 检查令牌来源是否安全
    public boolean isFromTrustedDevice() {
        // 如果有设备指纹，认为是可信设备
        return deviceFingerprint != null && !deviceFingerprint.trim().isEmpty();
    }

    // 业务方法 - 获取令牌使用时长（分钟）
    public Long getUsageDurationMinutes() {
        return java.time.Duration.between(createdAt, LocalDateTime.now()).toMinutes();
    }

    // Getter方法
    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getTokenHash() {
        return tokenHash;
    }

    public String getTokenSeries() {
        return tokenSeries;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public Boolean getIsRevoked() {
        return isRevoked;
    }

    public LocalDateTime getRevokedAt() {
        return revokedAt;
    }

    public Long getRevokedBy() {
        return revokedBy;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public String getDeviceFingerprint() {
        return deviceFingerprint;
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
        return STR."RefreshToken{id=\{id}, userId=\{userId}, username='\{username}', tokenSeries='\{tokenSeries}', expiresAt=\{expiresAt}, isRevoked=\{isRevoked}, revokedAt=\{revokedAt}, isValid=\{isValid()}, isExpired=\{isExpired()}, isNearExpiry=\{isNearExpiry()}, isFromTrustedDevice=\{isFromTrustedDevice()}, createdAt=\{createdAt}}";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RefreshToken that = (RefreshToken) o;
        return java.util.Objects.equals(id, that.id) &&
               java.util.Objects.equals(tokenSeries, that.tokenSeries);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, tokenSeries);
    }
}