/**
 * UserAuthControllerTest类
 * UserAuthControllerTest相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.interfaces.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.knene.application.user.service.UserApplicationService;
import com.knene.interfaces.user.dto.request.*;
import com.knene.interfaces.user.dto.response.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// 用户认证控制器集成测试类
// 测试用户认证相关的HTTP接口
@WebMvcTest(UserAuthController.class)
class UserAuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserApplicationService userApplicationService;

    private static final String VALID_USERNAME = "testuser";
    private static final String VALID_EMAIL = "test@example.com";
    private static final String VALID_PASSWORD = "Password123";

    @Nested
    @DisplayName("用户注册接口测试")
    class UserRegistrationTests {

        @Test
        @DisplayName("应该成功注册新用户")
        void shouldRegisterNewUserSuccessfully() throws Exception {
            // Given
            RegisterUserRequest request = new RegisterUserRequest();
            request.setUsername(VALID_USERNAME);
            request.setEmail(VALID_EMAIL);
            request.setPassword(VALID_PASSWORD);
            request.setNickname("测试用户");

            UserApplicationService.UserRegistrationResult mockResult =
                    new UserApplicationService.UserRegistrationResult(true, "注册成功", 1L);
            when(userApplicationService.registerUser(any())).thenReturn(mockResult);

            // When & Then
            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.user_id").value(1))
                    .andExpect(jsonPath("$.data.message").value("注册成功"))
                    .andExpect(jsonPath("$.code").value("SUCCESS"));

            verify(userApplicationService).registerUser(any(UserApplicationService.RegisterUserCommand.class));
        }

        @Test
        @DisplayName("用户名已存在时应该返回400错误")
        void shouldReturnBadRequestWhenUsernameExists() throws Exception {
            // Given
            RegisterUserRequest request = new RegisterUserRequest();
            request.setUsername(VALID_USERNAME);
            request.setEmail(VALID_EMAIL);
            request.setPassword(VALID_PASSWORD);

            UserApplicationService.UserRegistrationResult mockResult =
                    new UserApplicationService.UserRegistrationResult(false, "用户名已存在");
            when(userApplicationService.registerUser(any())).thenReturn(mockResult);

            // When & Then
            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("用户名已存在"));
        }

        @Test
        @DisplayName("请求参数无效时应该返回400错误")
        void shouldReturnBadRequestWhenRequestIsInvalid() throws Exception {
            // Given
            RegisterUserRequest request = new RegisterUserRequest();
            request.setUsername(""); // 无效的用户名
            request.setEmail("invalid-email"); // 无效的邮箱
            request.setPassword("123"); // 无效的密码

            // When & Then
            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }

    @Nested
    @DisplayName("邮箱验证接口测试")
    class EmailVerificationTests {

        @Test
        @DisplayName("应该成功验证邮箱")
        void shouldVerifyEmailSuccessfully() throws Exception {
            // Given
            VerifyEmailRequest request = new VerifyEmailRequest();
            request.setToken("valid-token");

            EmailVerificationResult mockResult = new EmailVerificationResult(true, "邮箱验证成功");
            when(userApplicationService.verifyEmail(any())).thenReturn(mockResult);

            // When & Then
            mockMvc.perform(post("/api/auth/verify-email")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.message").value("邮箱验证成功"));

            verify(userApplicationService).verifyEmail(any(UserApplicationService.VerifyEmailCommand.class));
        }

        @Test
        @DisplayName("令牌无效时应该返回400错误")
        void shouldReturnBadRequestWhenTokenIsInvalid() throws Exception {
            // Given
            VerifyEmailRequest request = new VerifyEmailRequest();
            request.setToken("invalid-token");

            EmailVerificationResult mockResult = new EmailVerificationResult(false, "无效的验证令牌");
            when(userApplicationService.verifyEmail(any())).thenReturn(mockResult);

            // When & Then
            mockMvc.perform(post("/api/auth/verify-email")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("无效的验证令牌"));
        }

        @Test
        @DisplayName("令牌为空时应该返回400错误")
        void shouldReturnBadRequestWhenTokenIsEmpty() throws Exception {
            // Given
            VerifyEmailRequest request = new VerifyEmailRequest();
            request.setToken("");

            // When & Then
            mockMvc.perform(post("/api/auth/verify-email")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }

    @Nested
    @DisplayName("重发验证邮件接口测试")
    class ResendVerificationTests {

        @Test
        @DisplayName("应该成功重发验证邮件")
        void shouldResendVerificationEmailSuccessfully() throws Exception {
            // Given
            ResendVerificationRequest request = new ResendVerificationRequest();
            request.setEmail(VALID_EMAIL);

            ResendVerificationResult mockResult = new ResendVerificationResult(true, "验证邮件已重新发送");
            when(userApplicationService.resendVerificationEmail(any())).thenReturn(mockResult);

            // When & Then
            mockMvc.perform(post("/api/auth/resend-verification")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.message").value("验证邮件已重新发送"));

            verify(userApplicationService).resendVerificationEmail(any(ResendVerificationCommand.class));
        }
    }

    @Nested
    @DisplayName("用户登录接口测试")
    class UserLoginTests {

        @Test
        @DisplayName("应该成功登录用户")
        void shouldLoginUserSuccessfully() throws Exception {
            // Given
            LoginUserRequest request = new LoginUserRequest();
            request.setIdentifier(VALID_USERNAME);
            request.setPassword(VALID_PASSWORD);
            request.setRememberMe(false);

            LoginResult mockResult = new LoginResult(
                    true, "登录成功", 1L, VALID_USERNAME, VALID_EMAIL,
                    "access-token", "refresh-token", java.util.List.of("USER")
            );
            when(userApplicationService.loginUser(any())).thenReturn(mockResult);

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.user_id").value(1))
                    .andExpect(jsonPath("$.data.username").value(VALID_USERNAME))
                    .andExpect(jsonPath("$.data.email").value(VALID_EMAIL))
                    .andExpect(jsonPath("$.data.access_token").value("access-token"))
                    .andExpect(jsonPath("$.data.refresh_token").value("refresh-token"))
                    .andExpect(jsonPath("$.data.roles").isArray())
                    .andExpect(jsonPath("$.data.roles[0]").value("USER"));

            verify(userApplicationService).loginUser(any(UserApplicationService.LoginUserCommand.class));
        }

        @Test
        @DisplayName("凭据无效时应该返回400错误")
        void shouldReturnBadRequestWhenCredentialsAreInvalid() throws Exception {
            // Given
            LoginUserRequest request = new LoginUserRequest();
            request.setIdentifier(VALID_USERNAME);
            request.setPassword("wrong-password");

            LoginResult mockResult = new LoginResult(false, "用户名或密码错误");
            when(userApplicationService.loginUser(any())).thenReturn(mockResult);

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("用户名或密码错误"));
        }

        @Test
        @DisplayName("标识符为空时应该返回400错误")
        void shouldReturnBadRequestWhenIdentifierIsEmpty() throws Exception {
            // Given
            LoginUserRequest request = new LoginUserRequest();
            request.setIdentifier("");
            request.setPassword(VALID_PASSWORD);

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }

    @Nested
    @DisplayName("令牌刷新接口测试")
    class TokenRefreshTests {

        @Test
        @DisplayName("应该成功刷新令牌")
        void shouldRefreshTokenSuccessfully() throws Exception {
            // Given
            RefreshTokenRequest request = new RefreshTokenRequest();
            request.setRefreshToken("valid-refresh-token");

            RefreshTokenResult mockResult = new RefreshTokenResult(
                    true, "令牌刷新成功", "new-access-token", "new-refresh-token"
            );
            when(userApplicationService.refreshToken(any())).thenReturn(mockResult);

            // When & Then
            mockMvc.perform(post("/api/auth/refresh")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.access_token").value("new-access-token"))
                    .andExpect(jsonPath("$.data.refresh_token").value("new-refresh-token"));

            verify(userApplicationService).refreshToken(any(RefreshTokenCommand.class));
        }

        @Test
        @DisplayName("刷新令牌无效时应该返回400错误")
        void shouldReturnBadRequestWhenRefreshTokenIsInvalid() throws Exception {
            // Given
            RefreshTokenRequest request = new RefreshTokenRequest();
            request.setRefreshToken("invalid-token");

            RefreshTokenResult mockResult = new RefreshTokenResult(false, "刷新令牌不存在");
            when(userApplicationService.refreshToken(any())).thenReturn(mockResult);

            // When & Then
            mockMvc.perform(post("/api/auth/refresh")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("刷新令牌不存在"));
        }
    }

    @Nested
    @DisplayName("用户登出接口测试")
    class UserLogoutTests {

        @Test
        @DisplayName("应该成功登出用户")
        void shouldLogoutUserSuccessfully() throws Exception {
            // Given
            LogoutUserRequest request = new LogoutUserRequest();
            request.setRefreshToken("valid-refresh-token");
            request.setUserId(1L);

            LogoutResult mockResult = new LogoutResult(true, "登出成功");
            when(userApplicationService.logoutUser(any())).thenReturn(mockResult);

            // When & Then
            mockMvc.perform(post("/api/auth/logout")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.message").value("登出成功"));

            verify(userApplicationService).logoutUser(any(UserApplicationService.LogoutUserCommand.class));
        }
    }

    @Nested
    @DisplayName("密码重置接口测试")
    class PasswordResetTests {

        @Test
        @DisplayName("应该成功请求密码重置")
        void shouldRequestPasswordResetSuccessfully() throws Exception {
            // Given
            RequestPasswordResetRequest request = new RequestPasswordResetRequest();
            request.setEmail(VALID_EMAIL);

            PasswordResetRequestResult mockResult = new PasswordResetRequestResult(true, "密码重置链接已发送到您的邮箱");
            when(userApplicationService.requestPasswordReset(any())).thenReturn(mockResult);

            // When & Then
            mockMvc.perform(post("/api/auth/request-password-reset")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.message").value("密码重置链接已发送到您的邮箱"));

            verify(userApplicationService).requestPasswordReset(any(UserApplicationService.RequestPasswordResetCommand.class));
        }

        @Test
        @DisplayName("应该成功验证重置令牌")
        void shouldValidateResetTokenSuccessfully() throws Exception {
            // Given
            ValidateResetTokenRequest request = new ValidateResetTokenRequest();
            request.setToken("valid-token");

            PasswordResetTokenValidationResult mockResult = new PasswordResetTokenValidationResult(true, "令牌验证成功");
            when(userApplicationService.validateResetToken(any())).thenReturn(mockResult);

            // When & Then
            mockMvc.perform(post("/api/auth/validate-reset-token")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.message").value("令牌验证成功"));
        }

        @Test
        @DisplayName("应该成功执行密码重置")
        void shouldExecutePasswordResetSuccessfully() throws Exception {
            // Given
            ExecutePasswordResetRequest request = new ExecutePasswordResetRequest();
            request.setToken("valid-token");
            request.setNewPassword("NewPassword123");
            request.setConfirmPassword("NewPassword123");

            PasswordResetExecutionResult mockResult = new PasswordResetExecutionResult(true, "密码重置成功");
            when(userApplicationService.executePasswordReset(any())).thenReturn(mockResult);

            // When & Then
            mockMvc.perform(post("/api/auth/execute-password-reset")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.message").value("密码重置成功"));
        }
    }
}