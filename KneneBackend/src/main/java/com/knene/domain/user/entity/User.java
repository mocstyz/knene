/**
 * User类
 * User相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.domain.user.entity;

import java.time.LocalDateTime;

// 用户状态枚举 - 定义用户的各种状态
public enum UserStatus {
    ACTIVE("active", "激活"),
    INACTIVE("inactive", "未激活"),
    SUSPENDED("suspended", "暂停"),
    DELETED("deleted", "已删除");

    private final String code; // 状态代码
    private final String description; // 状态描述

    // 构造函数 - 初始化枚举值
    UserStatus(String code, String description) {
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

// 用户聚合根 - 管理用户的核心业务逻辑
public class User {

    // 1. 核心标识字段
    private Long id; // 主键ID

    // 2. 基础认证信息
    private String username; // 用户名
    private String email; // 邮箱地址
    private String passwordHash; // 密码哈希值

    // 3. 可选联系信息
    private String phone; // 手机号码
    private String avatarUrl; // 头像URL

    // 4. 用户状态管理
    private UserStatus status; // 账户状态
    private Boolean emailVerified; // 邮箱是否验证
    private Boolean phoneVerified; // 手机是否验证

    // 5. 登录安全信息
    private LocalDateTime lastLoginAt; // 最后登录时间
    private String lastLoginIp; // 最后登录IP
    private Integer loginAttempts; // 登录尝试次数
    private LocalDateTime lockedUntil; // 账户锁定到期时间

    // 6. 审计字段
    private Long createdBy; // 创建人ID
    private Long updatedBy; // 更新人ID
    private Integer version; // 乐观锁版本号
    private LocalDateTime createdAt; // 创建时间
    private LocalDateTime updatedAt; // 更新时间
    private LocalDateTime deletedAt; // 删除时间

    // 7. 值对象（一对一关系）
    private UserProfile profile; // 用户扩展信息

    // 8. 用户角色关联
    private java.util.List<UserRole> userRoles; // 用户角色列表

    // 私有构造器，使用Builder模式创建
    private User() {
        this.status = UserStatus.INACTIVE; // 默认状态为未激活
        this.emailVerified = false;
        this.phoneVerified = false;
        this.loginAttempts = 0;
        this.version = 1;
    }

    // 静态工厂方法 - 创建新用户
    public static User create(String username, String email, String passwordHash) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("用户名不能为空");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("邮箱不能为空");
        }
        if (passwordHash == null || passwordHash.trim().isEmpty()) {
            throw new IllegalArgumentException("密码哈希不能为空");
        }

        User user = new User();
        user.username = username.trim().toLowerCase();
        user.email = email.trim().toLowerCase();
        user.passwordHash = passwordHash;
        user.createdAt = LocalDateTime.now();
        user.updatedAt = LocalDateTime.now();

        return user;
    }

    // 1. 用户状态管理方法
    public void activate() {
        if (this.status == UserStatus.DELETED) {
            throw new IllegalStateException("已删除的用户无法激活");
        }
        this.status = UserStatus.ACTIVE;
        this.updatedAt = LocalDateTime.now();
    }

    public void deactivate() {
        if (this.status == UserStatus.DELETED) {
            throw new IllegalStateException("已删除的用户无法停用");
        }
        this.status = UserStatus.INACTIVE;
        this.updatedAt = LocalDateTime.now();
    }

    public void suspend() {
        if (this.status == UserStatus.DELETED) {
            throw new IllegalStateException("已删除的用户无法暂停");
        }
        this.status = UserStatus.SUSPENDED;
        this.updatedAt = LocalDateTime.now();
    }

    public void delete() {
        this.status = UserStatus.DELETED;
        this.deletedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // 2. 认证相关方法
    public void recordLoginSuccess(String ipAddress) {
        this.lastLoginAt = LocalDateTime.now();
        this.lastLoginIp = ipAddress;
        this.loginAttempts = 0;
        this.lockedUntil = null;
        this.updatedAt = LocalDateTime.now();
    }

    public void recordLoginFailure() {
        this.loginAttempts++;
        this.updatedAt = LocalDateTime.now();

        // 连续失败5次后锁定账户30分钟
        if (this.loginAttempts >= 5) {
            this.lockedUntil = LocalDateTime.now().plusMinutes(30);
        }
    }

    public boolean isLocked() {
        return this.lockedUntil != null && this.lockedUntil.isAfter(LocalDateTime.now());
    }

    public boolean canLogin() {
        return !isLocked() && (this.status == UserStatus.ACTIVE);
    }

    // 3. 验证状态管理方法
    public void verifyEmail() {
        this.emailVerified = true;
        this.updatedAt = LocalDateTime.now();
    }

    public void verifyPhone() {
        this.phoneVerified = true;
        this.updatedAt = LocalDateTime.now();
    }

    // 4. 用户信息更新方法
    public void updateUsername(String newUsername) {
        if (newUsername == null || newUsername.trim().isEmpty()) {
            throw new IllegalArgumentException("用户名不能为空");
        }
        this.username = newUsername.trim().toLowerCase();
        this.updatedAt = LocalDateTime.now();
    }

    public void updateEmail(String newEmail) {
        if (newEmail == null || newEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("邮箱不能为空");
        }
        this.email = newEmail.trim().toLowerCase();
        this.emailVerified = false; // 更新邮箱后需要重新验证
        this.updatedAt = LocalDateTime.now();
    }

    public void updatePassword(String newPasswordHash) {
        if (newPasswordHash == null || newPasswordHash.trim().isEmpty()) {
            throw new IllegalArgumentException("密码哈希不能为空");
        }
        this.passwordHash = newPasswordHash;
        this.updatedAt = LocalDateTime.now();
    }

    public void updatePhone(String newPhone) {
        this.phone = newPhone;
        if (newPhone != null) {
            this.phoneVerified = false; // 更新手机号后需要重新验证
        }
        this.updatedAt = LocalDateTime.now();
    }

    public void updateAvatarUrl(String newAvatarUrl) {
        this.avatarUrl = newAvatarUrl;
        this.updatedAt = LocalDateTime.now();
    }

    // 5. 用户档案关联方法
    public void assignProfile(UserProfile profile) {
        this.profile = profile;
        this.updatedAt = LocalDateTime.now();
    }

    // 6. 用户角色管理方法
    public void addRole(UserRole userRole) {
        if (this.userRoles == null) {
            this.userRoles = new java.util.ArrayList<>();
        }
        this.userRoles.add(userRole);
        this.updatedAt = LocalDateTime.now();
    }

    public void removeRole(Long roleId) {
        if (this.userRoles != null) {
            this.userRoles.removeIf(role -> role.getRoleId().equals(roleId));
            this.updatedAt = LocalDateTime.now();
        }
    }

    public boolean hasRole(String roleName) {
        if (this.userRoles == null) {
            return false;
        }
        return this.userRoles.stream()
                .anyMatch(userRole -> userRole.getRoleName().equals(roleName) && userRole.isActive());
    }

    public boolean hasPermission(String permissionName) {
        if (this.userRoles == null) {
            return false;
        }
        return this.userRoles.stream()
                .filter(UserRole::isActive)
                .anyMatch(userRole -> userRole.hasPermission(permissionName));
    }

    // 7. 业务验证方法
    public boolean isActive() {
        return this.status == UserStatus.ACTIVE && !isLocked();
    }

    public boolean isFullyVerified() {
        return this.emailVerified && (this.phone == null || this.phoneVerified);
    }

    // 8. 乐观锁支持
    public boolean checkVersion(Integer expectedVersion) {
        return this.version.equals(expectedVersion);
    }

    public void incrementVersion() {
        this.version++;
        this.updatedAt = LocalDateTime.now();
    }

    // Getter方法
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getPhone() {
        return phone;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public UserStatus getStatus() {
        return status;
    }

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public Boolean getPhoneVerified() {
        return phoneVerified;
    }

    public LocalDateTime getLastLoginAt() {
        return lastLoginAt;
    }

    public String getLastLoginIp() {
        return lastLoginIp;
    }

    public Integer getLoginAttempts() {
        return loginAttempts;
    }

    public LocalDateTime getLockedUntil() {
        return lockedUntil;
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

    public UserProfile getProfile() {
        return profile;
    }

    public java.util.List<UserRole> getUserRoles() {
        return userRoles != null ? new java.util.ArrayList<>(userRoles) : new java.util.ArrayList<>();
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

    void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", status=" + status +
                ", emailVerified=" + emailVerified +
                ", phoneVerified=" + phoneVerified +
                ", lastLoginAt=" + lastLoginAt +
                ", createdAt=" + createdAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return java.util.Objects.equals(id, user.id) &&
               java.util.Objects.equals(email, user.email);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, email);
    }
}