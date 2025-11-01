/**
 * AuthRequests类
 * AuthRequests相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.interfaces.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonProperty;

// 用户注册相关请求

// 用户注册请求DTO - 包含用户注册所需的基本信息
public class RegisterUserRequest {

    @NotBlank(message = "用户名不能为空")
    @Size(min = 4, max = 20, message = "用户名长度必须在4-20个字符之间")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "用户名只能包含字母、数字和下划线")
    @JsonProperty("username")
    private String username;

    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    @JsonProperty("email")
    private String email;

    @NotBlank(message = "密码不能为空")
    @Size(min = 8, max = 50, message = "密码长度必须在8-50个字符之间")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$",
             message = "密码必须包含至少一个大写字母、一个小写字母和一个数字")
    @JsonProperty("password")
    private String password;

    @Size(max = 50, message = "昵称长度不能超过50个字符")
    @JsonProperty("nickname")
    private String nickname;

    // getter和setter方法
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
}

// 邮箱验证请求DTO - 用于验证用户邮箱地址的令牌
public class VerifyEmailRequest {

    @NotBlank(message = "验证令牌不能为空")
    @JsonProperty("token")
    private String token;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}

// 重新发送验证邮件请求DTO - 用于请求重新发送邮箱验证邮件
public class ResendVerificationRequest {

    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    @JsonProperty("email")
    private String email;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

// 用户登录相关请求

// 用户登录请求DTO - 包含用户登录所需的凭据信息
public class LoginUserRequest {

    @NotBlank(message = "用户名或邮箱不能为空")
    @JsonProperty("identifier")
    private String identifier;

    @NotBlank(message = "密码不能为空")
    @JsonProperty("password")
    private String password;

    @JsonProperty("remember_me")
    private Boolean rememberMe = false;

    // getter和setter方法
    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Boolean getRememberMe() { return rememberMe; }
    public void setRememberMe(Boolean rememberMe) { this.rememberMe = rememberMe; }
}

// 刷新令牌请求DTO - 用于使用刷新令牌获取新的访问令牌
public class RefreshTokenRequest {

    @NotBlank(message = "刷新令牌不能为空")
    @JsonProperty("refresh_token")
    private String refreshToken;

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
}

// 用户登出请求DTO - 用于用户安全登出并撤销令牌
public class LogoutUserRequest {

    @JsonProperty("refresh_token")
    private String refreshToken;

    @JsonProperty("user_id")
    private Long userId;

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}

// 密码重置相关请求

// 请求密码重置DTO - 用于请求重置用户密码的邮件
public class RequestPasswordResetRequest {

    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    @JsonProperty("email")
    private String email;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

// 验证重置令牌请求DTO - 用于验证密码重置令牌的有效性
public class ValidateResetTokenRequest {

    @NotBlank(message = "重置令牌不能为空")
    @JsonProperty("token")
    private String token;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}

// 执行密码重置请求DTO - 使用令牌执行密码重置操作
public class ExecutePasswordResetRequest {

    @NotBlank(message = "重置令牌不能为空")
    @JsonProperty("token")
    private String token;

    @NotBlank(message = "新密码不能为空")
    @Size(min = 8, max = 50, message = "密码长度必须在8-50个字符之间")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$",
             message = "密码必须包含至少一个大写字母、一个小写字母和一个数字")
    @JsonProperty("new_password")
    private String newPassword;

    @NotBlank(message = "确认密码不能为空")
    @JsonProperty("confirm_password")
    private String confirmPassword;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }

    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
}

