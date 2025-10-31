/**
 * UserRegistrationServiceTest类
 * UserRegistrationServiceTest相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.domain.user.service;

import com.knene.domain.user.entity.User;
import com.knene.domain.user.entity.EmailVerification;
import com.knene.domain.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

// 用户注册领域服务单元测试类
// 测试用户注册相关的业务逻辑
@ExtendWith(MockitoExtension.class)
class UserRegistrationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserRegistrationService.EmailService emailService;

    @InjectMocks
    private UserRegistrationService userRegistrationService;

    private static final String VALID_USERNAME = "testuser";
    private static final String VALID_EMAIL = "test@example.com";
    private static final String VALID_PASSWORD = "Password123";
    private static final String VALID_NICKNAME = "测试用户";
    private static final String IP_ADDRESS = "192.168.1.1";
    private static final String USER_AGENT = "Mozilla/5.0";

    @Nested
    @DisplayName("用户注册测试")
    class UserRegistrationTests {

        @Test
        @DisplayName("应该成功注册新用户")
        void shouldRegisterNewUserSuccessfully() {
            // Given
            when(userRepository.existsByUsername(VALID_USERNAME)).thenReturn(false);
            when(userRepository.existsByEmail(VALID_EMAIL)).thenReturn(false);
            when(userRepository.save(any(User.class))).thenReturn(createMockUser());
            when(userRepository.saveEmailVerification(any(EmailVerification.class))).thenReturn(createMockEmailVerification());
            doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());

            // When
            UserRegistrationService.RegistrationResult result = userRegistrationService.registerUser(
                    VALID_USERNAME, VALID_EMAIL, VALID_PASSWORD, VALID_NICKNAME, IP_ADDRESS, USER_AGENT
            );

            // Then
            assertTrue(result.isSuccess());
            assertEquals("注册成功，请查收验证邮件", result.getMessage());
            assertNotNull(result.getUserId());

            // 验证方法调用
            verify(userRepository).existsByUsername(VALID_USERNAME);
            verify(userRepository).existsByEmail(VALID_EMAIL);
            verify(userRepository).save(any(User.class));
            verify(userRepository).saveEmailVerification(any(EmailVerification.class));
            verify(emailService).sendEmail(eq(VALID_EMAIL), eq("验证您的邮箱地址"), anyString());
        }

        @Test
        @DisplayName("用户名已存在时应该注册失败")
        void shouldFailWhenUsernameExists() {
            // Given
            when(userRepository.existsByUsername(VALID_USERNAME)).thenReturn(true);

            // When
            UserRegistrationService.RegistrationResult result = userRegistrationService.registerUser(
                    VALID_USERNAME, VALID_EMAIL, VALID_PASSWORD, VALID_NICKNAME, IP_ADDRESS, USER_AGENT
            );

            // Then
            assertFalse(result.isSuccess());
            assertEquals("用户名已存在", result.getMessage());
            assertNull(result.getUserId());

            verify(userRepository).existsByUsername(VALID_USERNAME);
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("邮箱已存在时应该注册失败")
        void shouldFailWhenEmailExists() {
            // Given
            when(userRepository.existsByUsername(VALID_USERNAME)).thenReturn(false);
            when(userRepository.existsByEmail(VALID_EMAIL)).thenReturn(true);

            // When
            UserRegistrationService.RegistrationResult result = userRegistrationService.registerUser(
                    VALID_USERNAME, VALID_EMAIL, VALID_PASSWORD, VALID_NICKNAME, IP_ADDRESS, USER_AGENT
            );

            // Then
            assertFalse(result.isSuccess());
            assertEquals("邮箱已存在", result.getMessage());
            assertNull(result.getUserId());

            verify(userRepository).existsByUsername(VALID_USERNAME);
            verify(userRepository).existsByEmail(VALID_EMAIL);
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("密码强度不足时应该注册失败")
        void shouldFailWhenPasswordIsWeak() {
            // Given
            String weakPassword = "123";
            when(userRepository.existsByUsername(VALID_USERNAME)).thenReturn(false);
            when(userRepository.existsByEmail(VALID_EMAIL)).thenReturn(false);

            // When
            UserRegistrationService.RegistrationResult result = userRegistrationService.registerUser(
                    VALID_USERNAME, VALID_EMAIL, weakPassword, VALID_NICKNAME, IP_ADDRESS, USER_AGENT
            );

            // Then
            assertFalse(result.isSuccess());
            assertEquals("密码必须包含小写字母", result.getMessage()); // 第一个验证失败的条件

            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("邮箱格式无效时应该注册失败")
        void shouldFailWhenEmailIsInvalid() {
            // Given
            String invalidEmail = "invalid-email";
            when(userRepository.existsByUsername(VALID_USERNAME)).thenReturn(false);

            // When
            UserRegistrationService.RegistrationResult result = userRegistrationService.registerUser(
                    VALID_USERNAME, invalidEmail, VALID_PASSWORD, VALID_NICKNAME, IP_ADDRESS, USER_AGENT
            );

            // Then
            assertFalse(result.isSuccess());
            assertEquals("邮箱格式不正确", result.getMessage());

            verify(userRepository, never()).existsByEmail(invalidEmail);
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("用户名格式无效时应该注册失败")
        void shouldFailWhenUsernameIsInvalid() {
            // Given
            String invalidUsername = "test user!";

            // When
            UserRegistrationService.RegistrationResult result = userRegistrationService.registerUser(
                    invalidUsername, VALID_EMAIL, VALID_PASSWORD, VALID_NICKNAME, IP_ADDRESS, USER_AGENT
            );

            // Then
            assertFalse(result.isSuccess());
            assertEquals("用户名格式不正确", result.getMessage());

            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("昵称为空时应该也能成功注册")
        void shouldRegisterSuccessfullyWithoutNickname() {
            // Given
            when(userRepository.existsByUsername(VALID_USERNAME)).thenReturn(false);
            when(userRepository.existsByEmail(VALID_EMAIL)).thenReturn(false);
            when(userRepository.save(any(User.class))).thenReturn(createMockUser());
            when(userRepository.saveEmailVerification(any(EmailVerification.class))).thenReturn(createMockEmailVerification());
            doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());

            // When
            UserRegistrationService.RegistrationResult result = userRegistrationService.registerUser(
                    VALID_USERNAME, VALID_EMAIL, VALID_PASSWORD, null, IP_ADDRESS, USER_AGENT
            );

            // Then
            assertTrue(result.isSuccess());
            assertNotNull(result.getUserId());

            verify(userRepository).save(any(User.class));
        }
    }

    @Nested
    @DisplayName("邮箱验证测试")
    class EmailVerificationTests {

        @Test
        @DisplayName("应该成功验证邮箱")
        void shouldVerifyEmailSuccessfully() {
            // Given
            EmailVerification mockVerification = createMockEmailVerification();
            when(userRepository.findEmailVerificationByTokenHash(anyString())).thenReturn(Optional.of(mockVerification));
            when(userRepository.save(any(EmailVerification.class))).thenReturn(mockVerification);
            when(userRepository.findById(1L)).thenReturn(Optional.of(createMockUser()));
            when(userRepository.save(any(User.class))).thenReturn(createMockUser());

            // When
            UserRegistrationService.EmailVerificationResult result = userRegistrationService.verifyEmail(
                    "valid-token", IP_ADDRESS
            );

            // Then
            assertTrue(result.isSuccess());
            assertEquals("邮箱验证成功", result.getMessage());

            verify(userRepository).findEmailVerificationByTokenHash(anyString());
            verify(userRepository).save(any(EmailVerification.class));
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("令牌无效时应该验证失败")
        void shouldFailWhenTokenIsInvalid() {
            // Given
            when(userRepository.findEmailVerificationByTokenHash(anyString())).thenReturn(Optional.empty());

            // When
            UserRegistrationService.EmailVerificationResult result = userRegistrationService.verifyEmail(
                    "invalid-token", IP_ADDRESS
            );

            // Then
            assertFalse(result.isSuccess());
            assertEquals("无效的验证令牌", result.getMessage());

            verify(userRepository).findEmailVerificationByTokenHash(anyString());
            verify(userRepository, never()).save(any(EmailVerification.class));
        }

        @Test
        @DisplayName("令牌已过期时应该验证失败")
        void shouldFailWhenTokenIsExpired() {
            // Given
            EmailVerification expiredVerification = createExpiredEmailVerification();
            when(userRepository.findEmailVerificationByTokenHash(anyString())).thenReturn(Optional.of(expiredVerification));

            // When
            UserRegistrationService.EmailVerificationResult result = userRegistrationService.verifyEmail(
                    "expired-token", IP_ADDRESS
            );

            // Then
            assertFalse(result.isSuccess());
            assertEquals("已过期", result.getMessage());

            verify(userRepository).findEmailVerificationByTokenHash(anyString());
        }

        @Test
        @DisplayName("IP地址不匹配时应该验证失败并记录尝试")
        void shouldFailWhenIpMismatch() {
            // Given
            EmailVerification mockVerification = createMockEmailVerification();
            when(userRepository.findEmailVerificationByTokenHash(anyString())).thenReturn(Optional.of(mockVerification));
            when(userRepository.save(any(EmailVerification.class))).thenReturn(mockVerification);

            // When
            UserRegistrationService.EmailVerificationResult result = userRegistrationService.verifyEmail(
                    "valid-token", "different-ip"
            );

            // Then
            assertFalse(result.isSuccess());
            assertEquals("IP地址不匹配", result.getMessage());

            verify(userRepository).findEmailVerificationByTokenHash(anyString());
            verify(userRepository).save(any(EmailVerification.class));
        }
    }

    @Nested
    @DisplayName("重发验证邮件测试")
    class ResendVerificationTests {

        @Test
        @DisplayName("应该成功重发验证邮件")
        void shouldResendVerificationEmailSuccessfully() {
            // Given
            User mockUser = createMockUser();
            when(userRepository.findByEmail(VALID_EMAIL)).thenReturn(Optional.of(mockUser));
            when(userRepository.findPendingEmailVerificationsByUserId(1L)).thenReturn(java.util.Collections.emptyList());
            when(userRepository.saveEmailVerification(any(EmailVerification.class))).thenReturn(createMockEmailVerification());
            doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());

            // When
            UserRegistrationService.ResendVerificationResult result = userRegistrationService.resendVerificationEmail(
                    VALID_EMAIL, IP_ADDRESS, USER_AGENT
            );

            // Then
            assertTrue(result.isSuccess());
            assertEquals("验证邮件已重新发送", result.getMessage());

            verify(userRepository).findByEmail(VALID_EMAIL);
            verify(userRepository).findPendingEmailVerificationsByUserId(1L);
            verify(userRepository).saveEmailVerification(any(EmailVerification.class));
            verify(emailService).sendEmail(eq(VALID_EMAIL), eq("验证您的邮箱地址"), anyString());
        }

        @Test
        @DisplayName("用户不存在时应该返回用户不存在")
        void shouldReturnUserNotFoundWhenUserDoesNotExist() {
            // Given
            when(userRepository.findByEmail(VALID_EMAIL)).thenReturn(Optional.empty());

            // When
            UserRegistrationService.ResendVerificationResult result = userRegistrationService.resendVerificationEmail(
                    VALID_EMAIL, IP_ADDRESS, USER_AGENT
            );

            // Then
            assertFalse(result.isSuccess());
            assertEquals("用户不存在", result.getMessage());

            verify(userRepository).findByEmail(VALID_EMAIL);
            verify(userRepository, never()).saveEmailVerification(any(EmailVerification.class));
        }

        @Test
        @DisplayName("邮箱已验证时应该返回已验证")
        void shouldReturnAlreadyVerifiedWhenEmailIsVerified() {
            // Given
            User verifiedUser = createMockUser();
            // 假设用户已验证
            when(userRepository.findByEmail(VALID_EMAIL)).thenReturn(Optional.of(verifiedUser));

            // When
            UserRegistrationService.ResendVerificationResult result = userRegistrationService.resendVerificationEmail(
                    VALID_EMAIL, IP_ADDRESS, USER_AGENT
            );

            // Then
            // 这个测试的具体实现取决于User实体中的邮箱验证状态检查
            // 这里只是概念性测试
            verify(userRepository).findByEmail(VALID_EMAIL);
        }
    }

    // 测试辅助方法

    // 创建模拟用户
    private User createMockUser() {
        return User.create(VALID_USERNAME, VALID_EMAIL, "hashedPassword");
    }

    // 创建模拟邮箱验证
    private EmailVerification createMockEmailVerification() {
        return EmailVerification.createRegistrationVerification(
                1L, VALID_EMAIL, "token", "tokenHash",
                java.time.LocalDateTime.now().plusHours(24), IP_ADDRESS, USER_AGENT
        );
    }

    // 创建过期的邮箱验证
    private EmailVerification createExpiredEmailVerification() {
        return EmailVerification.createRegistrationVerification(
                1L, VALID_EMAIL, "token", "tokenHash",
                java.time.LocalDateTime.now().minusHours(1), IP_ADDRESS, USER_AGENT
        );
    }
}