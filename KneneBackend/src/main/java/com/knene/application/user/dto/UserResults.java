/**
 * UserResults类
 * UserResults相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.application.user.dto;

// 用户应用服务结果对象定义
// 定义用户应用层返回的结果对象

import java.util.List;

// 结果对象定义

// 邮箱验证结果
public class EmailVerificationResult {
    private final boolean success;
    private final String message;

    public EmailVerificationResult(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
}

// 重新发送验证结果
public class ResendVerificationResult {
    private final boolean success;
    private final String message;

    public ResendVerificationResult(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
}

// 登录结果
public class LoginResult {
    private final boolean success;
    private final String message;
    private final Long userId;
    private final String username;
    private final String email;
    private final String accessToken;
    private final String refreshToken;
    private final List<String> roles;

    public LoginResult(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.userId = null;
        this.username = null;
        this.email = null;
        this.accessToken = null;
        this.refreshToken = null;
        this.roles = null;
    }

    public LoginResult(boolean success, String message, Long userId, String username, String email,
                      String accessToken, String refreshToken, List<String> roles) {
        this.success = success;
        this.message = message;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.roles = roles;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public Long getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getAccessToken() { return accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public List<String> getRoles() { return roles; }
}

// 刷新令牌结果
public class RefreshTokenResult {
    private final boolean success;
    private final String message;
    private final String accessToken;
    private final String refreshToken;

    public RefreshTokenResult(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.accessToken = null;
        this.refreshToken = null;
    }

    public RefreshTokenResult(boolean success, String message, String accessToken, String refreshToken) {
        this.success = success;
        this.message = message;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public String getAccessToken() { return accessToken; }
    public String getRefreshToken() { return refreshToken; }
}

// 登出结果
public class LogoutResult {
    private final boolean success;
    private final String message;

    public LogoutResult(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
}

// 密码重置请求结果
public class PasswordResetRequestResult {
    private final boolean success;
    private final String message;

    public PasswordResetRequestResult(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
}

// 密码重置令牌验证结果
public class PasswordResetTokenValidationResult {
    private final boolean valid;
    private final String message;

    public PasswordResetTokenValidationResult(boolean valid, String message) {
        this.valid = valid;
        this.message = message;
    }

    public boolean isValid() { return valid; }
    public String getMessage() { return message; }
}

// 密码重置执行结果
public class PasswordResetExecutionResult {
    private final boolean success;
    private final String message;

    public PasswordResetExecutionResult(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
}

// 档案更新结果
public class ProfileUpdateResult {
    private final boolean success;
    private final String message;

    public ProfileUpdateResult(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
}

// 头像上传结果
public class AvatarUploadResult {
    private final boolean success;
    private final String message;
    private final String avatarUrl;

    public AvatarUploadResult(boolean success, String message, String avatarUrl) {
        this.success = success;
        this.message = message;
        this.avatarUrl = avatarUrl;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public String getAvatarUrl() { return avatarUrl; }
}

// 用户列表结果
public class UserListResult {
    private final boolean success;
    private final String message;
    private final List<UserDto> users;
    private final long totalCount;

    public UserListResult(boolean success, String message, List<UserDto> users, long totalCount) {
        this.success = success;
        this.message = message;
        this.users = users;
        this.totalCount = totalCount;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public List<UserDto> getUsers() { return users; }
    public long getTotalCount() { return totalCount; }
}

// 用户锁定结果
public class UserLockResult {
    private final boolean success;
    private final String message;

    public UserLockResult(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
}

// 用户解锁结果
public class UserUnlockResult {
    private final boolean success;
    private final String message;

    public UserUnlockResult(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
}

// 系统清理结果
public class SystemCleanupResult {
    private final boolean success;
    private final String message;
    private final int expiredRefreshTokens;
    private final int expiredEmailVerifications;
    private final int expiredPasswordResets;
    private final int unlockedLockouts;

    public SystemCleanupResult(boolean success, String message,
                              int expiredRefreshTokens, int expiredEmailVerifications,
                              int expiredPasswordResets, int unlockedLockouts) {
        this.success = success;
        this.message = message;
        this.expiredRefreshTokens = expiredRefreshTokens;
        this.expiredEmailVerifications = expiredEmailVerifications;
        this.expiredPasswordResets = expiredPasswordResets;
        this.unlockedLockouts = unlockedLockouts;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public int getExpiredRefreshTokens() { return expiredRefreshTokens; }
    public int getExpiredEmailVerifications() { return expiredEmailVerifications; }
    public int getExpiredPasswordResets() { return expiredPasswordResets; }
    public int getUnlockedLockouts() { return unlockedLockouts; }
}