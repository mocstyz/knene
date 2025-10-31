/**
 * UserRole类
 * UserRole相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.domain.user.valueobject;

import java.time.LocalDateTime;

// 用户角色状态枚举 - 定义用户角色的状态类型
public enum UserRoleStatus {
    ACTIVE("active", "激活"),
    INACTIVE("inactive", "未激活"),
    EXPIRED("expired", "已过期");

    private final String code; // 状态代码
    private final String description; // 状态描述

    // 构造函数 - 初始化角色状态
    UserRoleStatus(String code, String description) {
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

// 用户角色值对象 - 表示用户与角色的关联关系，不可变对象
public final class UserRole {

    // 1. 关联字段
    private final Long userId; // 用户ID
    private final Long roleId; // 角色ID
    private final String roleName; // 角色名称（冗余字段，避免频繁查询）

    // 2. 授权管理
    private final Long grantedBy; // 授权人ID
    private final LocalDateTime grantedAt; // 授权时间
    private final LocalDateTime expiresAt; // 过期时间（NULL表示永不过期）

    // 3. 状态管理
    private final UserRoleStatus status; // 状态
    private final String remarks; // 备注

    // 4. 审计字段
    private final Long createdBy; // 创建人ID
    private final Long updatedBy; // 更新人ID
    private final Integer version; // 乐观锁版本号
    private final LocalDateTime createdAt; // 创建时间
    private final LocalDateTime updatedAt; // 更新时间
    private final LocalDateTime deletedAt; // 删除时间

    // 5. 权限信息（从角色关联加载）
    private final java.util.List<String> permissions; // 权限列表

    // 私有构造器，使用Builder模式创建
    private UserRole(Builder builder) {
        this.userId = builder.userId;
        this.roleId = builder.roleId;
        this.roleName = builder.roleName;
        this.grantedBy = builder.grantedBy;
        this.grantedAt = builder.grantedAt != null ? builder.grantedAt : LocalDateTime.now();
        this.expiresAt = builder.expiresAt;
        this.status = builder.status != null ? builder.status : UserRoleStatus.ACTIVE;
        this.remarks = builder.remarks;
        this.createdBy = builder.createdBy;
        this.updatedBy = builder.updatedBy;
        this.version = builder.version != null ? builder.version : 1;
        this.createdAt = builder.createdAt != null ? builder.createdAt : LocalDateTime.now();
        this.updatedAt = builder.updatedAt != null ? builder.updatedAt : LocalDateTime.now();
        this.deletedAt = builder.deletedAt;
        this.permissions = builder.permissions != null ? new java.util.ArrayList<>(builder.permissions) : new java.util.ArrayList<>();
    }

    // Builder模式
    public static class Builder {
        private Long userId;
        private Long roleId;
        private String roleName;
        private Long grantedBy;
        private LocalDateTime grantedAt;
        private LocalDateTime expiresAt;
        private UserRoleStatus status;
        private String remarks;
        private Long createdBy;
        private Long updatedBy;
        private Integer version;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private LocalDateTime deletedAt;
        private java.util.List<String> permissions;

        public Builder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public Builder roleId(Long roleId) {
            this.roleId = roleId;
            return this;
        }

        public Builder roleName(String roleName) {
            this.roleName = roleName;
            return this;
        }

        public Builder grantedBy(Long grantedBy) {
            this.grantedBy = grantedBy;
            return this;
        }

        public Builder grantedAt(LocalDateTime grantedAt) {
            this.grantedAt = grantedAt;
            return this;
        }

        public Builder expiresAt(LocalDateTime expiresAt) {
            this.expiresAt = expiresAt;
            return this;
        }

        public Builder status(UserRoleStatus status) {
            this.status = status;
            return this;
        }

        public Builder remarks(String remarks) {
            this.remarks = remarks;
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

        public Builder deletedAt(LocalDateTime deletedAt) {
            this.deletedAt = deletedAt;
            return this;
        }

        public Builder permissions(java.util.List<String> permissions) {
            this.permissions = permissions;
            return this;
        }

        public UserRole build() {
            if (userId == null) {
                throw new IllegalArgumentException("用户ID不能为空");
            }
            if (roleId == null) {
                throw new IllegalArgumentException("角色ID不能为空");
            }
            if (roleName == null || roleName.trim().isEmpty()) {
                throw new IllegalArgumentException("角色名称不能为空");
            }
            if (grantedBy == null) {
                throw new IllegalArgumentException("授权人ID不能为空");
            }

            return new UserRole(this);
        }
    }

    // 静态工厂方法 - 创建角色授权
    public static UserRole createAuthorization(Long userId, Long roleId, String roleName, Long grantedBy) {
        return new Builder()
                .userId(userId)
                .roleId(roleId)
                .roleName(roleName)
                .grantedBy(grantedBy)
                .status(UserRoleStatus.ACTIVE)
                .createdBy(grantedBy)
                .updatedBy(grantedBy)
                .build();
    }

    // 静态工厂方法 - 创建临时角色授权
    public static UserRole createTemporaryAuthorization(Long userId, Long roleId, String roleName,
                                                  Long grantedBy, LocalDateTime expiresAt) {
        return new Builder()
                .userId(userId)
                .roleId(roleId)
                .roleName(roleName)
                .grantedBy(grantedBy)
                .expiresAt(expiresAt)
                .status(UserRoleStatus.ACTIVE)
                .createdBy(grantedBy)
                .updatedBy(grantedBy)
                .build();
    }

    // 业务方法 - 检查角色是否激活
    public boolean isActive() {
        return this.status == UserRoleStatus.ACTIVE && !isExpired();
    }

    // 业务方法 - 检查角色是否过期
    public boolean isExpired() {
        if (this.expiresAt == null) {
            return false; // 永不过期
        }
        return this.expiresAt.isBefore(LocalDateTime.now());
    }

    // 业务方法 - 检查角色是否有效（激活且未过期）
    public boolean isValid() {
        return isActive() && !isExpired();
    }

    // 业务方法 - 检查剩余有效时间（分钟）
    public Long getRemainingMinutes() {
        if (this.expiresAt == null) {
            return null; // 永不过期
        }
        LocalDateTime now = LocalDateTime.now();
        if (this.expiresAt.isBefore(now)) {
            return 0L; // 已过期
        }
        return java.time.Duration.between(now, this.expiresAt).toMinutes();
    }

    // 业务方法 - 检查是否拥有指定权限
    public boolean hasPermission(String permissionName) {
        if (permissionName == null || permissionName.trim().isEmpty()) {
            return false;
        }
        return this.permissions.stream()
                .anyMatch(permission -> permission.equalsIgnoreCase(permissionName.trim()));
    }

    // 业务方法 - 检查是否拥有任意指定权限
    public boolean hasAnyPermission(java.util.List<String> permissionNames) {
        if (permissionNames == null || permissionNames.isEmpty()) {
            return false;
        }
        return permissionNames.stream()
                .anyMatch(this::hasPermission);
    }

    // 业务方法 - 检查是否拥有所有指定权限
    public boolean hasAllPermissions(java.util.List<String> permissionNames) {
        if (permissionNames == null || permissionNames.isEmpty()) {
            return true;
        }
        return permissionNames.stream()
                .allMatch(this::hasPermission);
    }

    // 业务方法 - 停用角色
    public UserRole deactivate() {
        return new Builder()
                .userId(this.userId)
                .roleId(this.roleId)
                .roleName(this.roleName)
                .grantedBy(this.grantedBy)
                .grantedAt(this.grantedAt)
                .expiresAt(this.expiresAt)
                .status(UserRoleStatus.INACTIVE)
                .remarks(this.remarks)
                .createdBy(this.createdBy)
                .updatedBy(this.updatedBy)
                .version(this.version + 1)
                .createdAt(this.createdAt)
                .updatedAt(LocalDateTime.now())
                .deletedAt(this.deletedAt)
                .permissions(this.permissions)
                .build();
    }

    // 业务方法 - 标记为过期
    public UserRole markAsExpired() {
        return new Builder()
                .userId(this.userId)
                .roleId(this.roleId)
                .roleName(this.roleName)
                .grantedBy(this.grantedBy)
                .grantedAt(this.grantedAt)
                .expiresAt(this.expiresAt)
                .status(UserRoleStatus.EXPIRED)
                .remarks(this.remarks)
                .createdBy(this.createdBy)
                .updatedBy(this.updatedBy)
                .version(this.version + 1)
                .createdAt(this.createdAt)
                .updatedAt(LocalDateTime.now())
                .deletedAt(this.deletedAt)
                .permissions(this.permissions)
                .build();
    }

    // Getter方法
    public Long getUserId() {
        return userId;
    }

    public Long getRoleId() {
        return roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public Long getGrantedBy() {
        return grantedBy;
    }

    public LocalDateTime getGrantedAt() {
        return grantedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public UserRoleStatus getStatus() {
        return status;
    }

    public String getRemarks() {
        return remarks;
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

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public java.util.List<String> getPermissions() {
        return new java.util.ArrayList<>(permissions);
    }

    @Override
    public String toString() {
        return "UserRole{" +
                "userId=" + userId +
                ", roleId=" + roleId +
                ", roleName='" + roleName + '\'' +
                ", grantedBy=" + grantedBy +
                ", grantedAt=" + grantedAt +
                ", expiresAt=" + expiresAt +
                ", status=" + status +
                ", isValid=" + isValid() +
                ", permissionCount=" + permissions.size() +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserRole that = (UserRole) o;
        return java.util.Objects.equals(userId, that.userId) &&
               java.util.Objects.equals(roleId, that.roleId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(userId, roleId);
    }
}