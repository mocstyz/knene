/**
 * AuthResponses类
 * AuthResponses相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.interfaces.user.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.List;

// 基础响应类

// 基础响应DTO
// 包含基础的消息和时间戳信息
public class BaseResponse {
    private final String message;
    private final LocalDateTime timestamp;

    public BaseResponse(String message) {
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public String getMessage() { return message; }
    public LocalDateTime getTimestamp() { return timestamp; }
}

// 用户注册相关响应

// 用户注册响应DTO
// 包含用户注册成功后的用户ID和消息
public class UserRegistrationResponse {
    private final Long userId;
    private final String message;
    private final LocalDateTime timestamp;

    public UserRegistrationResponse(Long userId, String message) {
        this.userId = userId;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    @JsonProperty("user_id")
    public Long getUserId() { return userId; }

    public String getMessage() { return message; }
    public LocalDateTime getTimestamp() { return timestamp; }
}

// 用户登录相关响应

// 用户登录响应DTO
// 包含登录成功后的用户信息和令牌
public class LoginResponse {
    private final Long userId;
    private final String username;
    private final String email;
    private final String accessToken;
    private final String refreshToken;
    private final List<String> roles;
    private final LocalDateTime timestamp;
    private final Long expiresIn;

    public LoginResponse(Long userId, String username, String email,
                        String accessToken, String refreshToken, List<String> roles) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.roles = roles;
        this.timestamp = LocalDateTime.now();
        this.expiresIn = 3600L; // 1小时，单位：秒
    }

    @JsonProperty("user_id")
    public Long getUserId() { return userId; }

    public String getUsername() { return username; }
    public String getEmail() { return email; }

    @JsonProperty("access_token")
    public String getAccessToken() { return accessToken; }

    @JsonProperty("refresh_token")
    public String getRefreshToken() { return refreshToken; }

    public List<String> getRoles() { return roles; }
    public LocalDateTime getTimestamp() { return timestamp; }

    @JsonProperty("expires_in")
    public Long getExpiresIn() { return expiresIn; }
}

// 刷新令牌响应DTO
// 包含刷新后的新令牌信息
public class RefreshTokenResponse {
    private final String accessToken;
    private final String refreshToken;
    private final LocalDateTime timestamp;
    private final Long expiresIn;

    public RefreshTokenResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.timestamp = LocalDateTime.now();
        this.expiresIn = 3600L; // 1小时，单位：秒
    }

    @JsonProperty("access_token")
    public String getAccessToken() { return accessToken; }

    @JsonProperty("refresh_token")
    public String getRefreshToken() { return refreshToken; }

    public LocalDateTime getTimestamp() { return timestamp; }

    @JsonProperty("expires_in")
    public Long getExpiresIn() { return expiresIn; }
}

// 通用API响应包装类

// API响应包装类
// 统一的API响应格式，包含成功状态、消息、数据和时间戳
public class ApiResponse<T> {
    private final boolean success;
    private final String message;
    private final T data;
    private final LocalDateTime timestamp;
    private final String code;

    private ApiResponse(boolean success, String message, T data, String code) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
        this.code = code;
    }

    // 创建成功响应
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "操作成功", data, "SUCCESS");
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, "SUCCESS");
    }

    // 创建错误响应
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, "ERROR");
    }

    public static <T> ApiResponse<T> error(String code, String message) {
        return new ApiResponse<>(false, message, null, code);
    }

    // getter方法
    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public T getData() { return data; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getCode() { return code; }
}