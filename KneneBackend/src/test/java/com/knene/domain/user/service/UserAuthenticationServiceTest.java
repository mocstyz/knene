/**
 * UserAuthenticationServiceTest类
 * UserAuthenticationServiceTest相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.domain.user.service;

import com.knene.domain.user.entity.User;
import com.knene.domain.user.entity.RefreshToken;
import com.knene.domain.user.entity.UserLockout;
import com.knene.domain.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

// 用户认证领域服务单元测试类
// 测试用户认证相关的业务逻辑
@ExtendWith(MockitoExtension.class)
class UserAuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserAuthenticationService.JwtTokenService jwtTokenService;

    @Mock
    private UserAuthenticationService.LoginAttemptService loginAttemptService;

    @InjectMocks
    private UserAuthenticationService userAuthenticationService;

    private static final String VALID_IDENTIFIER = "testuser";
    private static final String VALID_PASSWORD = "Password123";
    private static final String INVALID_PASSWORD = "WrongPassword";
    private static final String IP_ADDRESS = "192.168.1.1";
    private static final String USER_AGENT = "Mozilla/5.0";
    private static final String DEVICE_FINGERPRINT = "device123";

    @Nested
    @DisplayName("用户认证测试")
    class UserAuthenticationTests {

        @Test
        @DisplayName("应该成功认证有效用户")
        void shouldAuthenticateValidUserSuccessfully() {
            // Given
            User mockUser = createActiveUser();
            when(userRepository.findByIdentifier(VALID_IDENTIFIER)).thenReturn(Optional.of(mockUser));
            when(loginAttemptService.isRateLimited(IP_ADDRESS)).thenReturn(false);
            when(userRepository.findActiveLockoutsByUserId(1L)).thenReturn(Collections.emptyList());
            when(jwtTokenService.generateAccessToken(any(User.class))).thenReturn("access-token");
            when(jwtTokenService.generateRefreshToken(any(User.class))).thenReturn("refresh-token");
            when(userRepository.saveRefreshToken(any(RefreshToken.class))).thenReturn(createMockRefreshToken());
            when(userRepository.save(any(User.class))).thenReturn(mockUser);

            // When
            UserAuthenticationService.AuthenticationResult result = userAuthenticationService.authenticate(
                    VALID_IDENTIFIER, VALID_PASSWORD, IP_ADDRESS, USER_AGENT, DEVICE_FINGERPRINT
            );

            // Then
            assertTrue(result.isSuccess());
            assertEquals("登录成功", result.getMessage());
            assertEquals(1L, result.getUserId());
            assertEquals(VALID_IDENTIFIER, result.getUsername());
            assertNotNull(result.getAccessToken());
            assertNotNull(result.getRefreshToken());

            verify(loginAttemptService).clearFailedAttempts(IP_ADDRESS, VALID_IDENTIFIER);
            verify(userRepository).save(any(User.class));
            verify(userRepository).saveRefreshToken(any(RefreshToken.class));
        }

        @Test
        @DisplayName("用户不存在时应该认证失败")
        void shouldFailWhenUserDoesNotExist() {
            // Given
            when(userRepository.findByIdentifier(VALID_IDENTIFIER)).thenReturn(Optional.empty());
            when(loginAttemptService.isRateLimited(IP_ADDRESS)).thenReturn(false);

            // When
            UserAuthenticationService.AuthenticationResult result = userAuthenticationService.authenticate(
                    VALID_IDENTIFIER, VALID_PASSWORD, IP_ADDRESS, USER_AGENT, DEVICE_FINGERPRINT
            );

            // Then
            assertFalse(result.isSuccess());
            assertEquals(UserAuthenticationService.AuthenticationStatus.USER_NOT_FOUND, result.getStatus());
            assertEquals("用户名或密码错误", result.getMessage());

            verify(loginAttemptService).recordFailedAttempt(IP_ADDRESS, VALID_IDENTIFIER, "用户不存在");
        }

        @Test
        @DisplayName("密码错误时应该认证失败")
        void shouldFailWhenPasswordIsIncorrect() {
            // Given
            User mockUser = createActiveUser();
            when(userRepository.findByIdentifier(VALID_IDENTIFIER)).thenReturn(Optional.of(mockUser));
            when(loginAttemptService.isRateLimited(IP_ADDRESS)).thenReturn(false);
            when(userRepository.findActiveLockoutsByUserId(1L)).thenReturn(Collections.emptyList());
            when(userRepository.save(any(User.class))).thenReturn(mockUser);

            // When
            UserAuthenticationService.AuthenticationResult result = userAuthenticationService.authenticate(
                    VALID_IDENTIFIER, INVALID_PASSWORD, IP_ADDRESS, USER_AGENT, DEVICE_FINGERPRINT
            );

            // Then
            assertFalse(result.isSuccess());
            assertEquals(UserAuthenticationService.AuthenticationStatus.INVALID_CREDENTIALS, result.getStatus());
            assertEquals("用户名或密码错误", result.getMessage());

            verify(loginAttemptService).recordFailedAttempt(IP_ADDRESS, VALID_IDENTIFIER, "密码错误");
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("用户未激活时应该认证失败")
        void shouldFailWhenUserIsNotActive() {
            // Given
            User inactiveUser = createInactiveUser();
            when(userRepository.findByIdentifier(VALID_IDENTIFIER)).thenReturn(Optional.of(inactiveUser));
            when(loginAttemptService.isRateLimited(IP_ADDRESS)).thenReturn(false);

            // When
            UserAuthenticationService.AuthenticationResult result = userAuthenticationService.authenticate(
                    VALID_IDENTIFIER, VALID_PASSWORD, IP_ADDRESS, USER_AGENT, DEVICE_FINGERPRINT
            );

            // Then
            assertFalse(result.isSuccess());
            assertEquals(UserAuthenticationService.AuthenticationStatus.USER_INACTIVE, result.getStatus());

            verify(loginAttemptService).recordFailedAttempt(IP_ADDRESS, VALID_IDENTIFIER, "用户状态异常: USER_INACTIVE");
        }

        @Test
        @DisplayName("账户被锁定时应该认证失败")
        void shouldFailWhenAccountIsLocked() {
            // Given
            User mockUser = createActiveUser();
            UserLockout activeLockout = createActiveLockout();
            when(userRepository.findByIdentifier(VALID_IDENTIFIER)).thenReturn(Optional.of(mockUser));
            when(loginAttemptService.isRateLimited(IP_ADDRESS)).thenReturn(false);
            when(userRepository.findActiveLockoutsByUserId(1L)).thenReturn(List.of(activeLockout));

            // When
            UserAuthenticationService.AuthenticationResult result = userAuthenticationService.authenticate(
                    VALID_IDENTIFIER, VALID_PASSWORD, IP_ADDRESS, USER_AGENT, DEVICE_FINGERPRINT
            );

            // Then
            assertFalse(result.isSuccess());
            assertEquals(UserAuthenticationService.AuthenticationStatus.ACCOUNT_LOCKED, result.getStatus());
            assertTrue(result.getMessage().contains("账户已被锁定"));

            verify(loginAttemptService).recordFailedAttempt(IP_ADDRESS, VALID_IDENTIFIER, "账户被锁定");
        }

        @Test
        @DisplayName("频率受限时应该认证失败")
        void shouldFailWhenRateLimited() {
            // Given
            when(loginAttemptService.isRateLimited(IP_ADDRESS)).thenReturn(true);

            // When
            UserAuthenticationService.AuthenticationResult result = userAuthenticationService.authenticate(
                    VALID_IDENTIFIER, VALID_PASSWORD, IP_ADDRESS, USER_AGENT, DEVICE_FINGERPRINT
            );

            // Then
            assertFalse(result.isSuccess());
            assertEquals(UserAuthenticationService.AuthenticationStatus.RATE_LIMITED, result.getStatus());
            assertEquals("登录尝试过于频繁，请稍后再试", result.getMessage());

            verify(userRepository, never()).findByIdentifier(anyString());
        }

        @Test
        @DisplayName("多次失败登录后应该锁定账户")
        void shouldLockAccountAfterMultipleFailedAttempts() {
            // Given
            User mockUser = createActiveUser();
            when(userRepository.findByIdentifier(VALID_IDENTIFIER)).thenReturn(Optional.of(mockUser));
            when(loginAttemptService.isRateLimited(IP_ADDRESS)).thenReturn(false);
            when(userRepository.findActiveLockoutsByUserId(1L)).thenReturn(Collections.emptyList());
            when(userRepository.save(any(User.class))).thenReturn(mockUser);
            when(userRepository.saveUserLockout(any(UserLockout.class))).thenReturn(createActiveLockout());

            // When - 连续失败5次
            for (int i = 0; i < 5; i++) {
                userAuthenticationService.authenticate(
                        VALID_IDENTIFIER, INVALID_PASSWORD, IP_ADDRESS, USER_AGENT, DEVICE_FINGERPRINT
                );
            }

            // Then - 应该创建锁定记录
            verify(userRepository, times(5)).save(any(User.class));
            verify(userRepository, atLeastOnce()).saveUserLockout(any(UserLockout.class));
        }
    }

    @Nested
    @DisplayName("令牌刷新测试")
    class TokenRefreshTests {

        @Test
        @DisplayName("应该成功刷新有效的令牌")
        void shouldRefreshValidTokenSuccessfully() {
            // Given
            String refreshToken = "valid-refresh-token";
            RefreshToken mockToken = createValidRefreshToken();
            User mockUser = createActiveUser();

            when(userRepository.findRefreshTokenBySeries(anyString())).thenReturn(Optional.of(mockToken));
            when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
            when(jwtTokenService.generateAccessToken(any(User.class))).thenReturn("new-access-token");

            // When
            UserAuthenticationService.TokenRefreshResult result = userAuthenticationService.refreshToken(
                    refreshToken, IP_ADDRESS, USER_AGENT
            );

            // Then
            assertTrue(result.isSuccess());
            assertEquals("令牌刷新成功", result.getMessage());
            assertEquals("new-access-token", result.getAccessToken());
            assertEquals(refreshToken, result.getRefreshToken()); // 未过期时不更换

            verify(userRepository).findRefreshTokenBySeries(anyString());
            verify(userRepository).findById(1L);
        }

        @Test
        @DisplayName("令牌无效时应该刷新失败")
        void shouldFailWhenTokenIsInvalid() {
            // Given
            String invalidToken = "invalid-token";
            when(userRepository.findRefreshTokenBySeries(anyString())).thenReturn(Optional.empty());

            // When
            UserAuthenticationService.TokenRefreshResult result = userAuthenticationService.refreshToken(
                    invalidToken, IP_ADDRESS, USER_AGENT
            );

            // Then
            assertFalse(result.isSuccess());
            assertEquals(UserAuthenticationService.TokenRefreshStatus.TOKEN_NOT_FOUND, result.getStatus());
            assertEquals("刷新令牌不存在", result.getMessage());

            verify(userRepository).findRefreshTokenBySeries(anyString());
        }

        @Test
        @DisplayName("令牌已撤销时应该刷新失败")
        void shouldFailWhenTokenIsRevoked() {
            // Given
            RefreshToken revokedToken = createRevokedRefreshToken();
            when(userRepository.findRefreshTokenBySeries(anyString())).thenReturn(Optional.of(revokedToken));

            // When
            UserAuthenticationService.TokenRefreshResult result = userAuthenticationService.refreshToken(
                    "revoked-token", IP_ADDRESS, USER_AGENT
            );

            // Then
            assertFalse(result.isSuccess());
            assertEquals(UserAuthenticationService.TokenRefreshStatus.TOKEN_INVALID, result.getStatus());

            verify(userRepository).findRefreshTokenBySeries(anyString());
        }

        @Test
        @DisplayName("设备指纹不匹配时应该撤销令牌")
        void shouldRevokeTokenWhenDeviceFingerprintMismatch() {
            // Given
            RefreshToken validToken = createValidRefreshToken();
            when(userRepository.findRefreshTokenBySeries(anyString())).thenReturn(Optional.of(validToken));
            when(userRepository.revokeRefreshTokensBySeries(anyString(), isNull())).thenReturn(true);

            // When
            UserAuthenticationService.TokenRefreshResult result = userAuthenticationService.refreshToken(
                    "valid-token", IP_ADDRESS, USER_AGENT
            );

            // Then
            assertFalse(result.isSuccess());
            assertEquals(UserAuthenticationService.TokenRefreshStatus.SECURITY_RISK, result.getStatus());

            verify(userRepository).findRefreshTokenBySeries(anyString());
            verify(userRepository).revokeRefreshTokensBySeries(anyString(), isNull());
        }
    }

    @Nested
    @DisplayName("用户登出测试")
    class UserLogoutTests {

        @Test
        @DisplayName("应该成功登出用户")
        void shouldLogoutUserSuccessfully() {
            // Given
            String refreshToken = "valid-refresh-token";
            Long userId = 1L;
            when(userRepository.revokeAllRefreshTokensByUserId(userId, userId)).thenReturn(true);

            // When
            UserAuthenticationService.LogoutResult result = userAuthenticationService.logout(
                    refreshToken, userId
            );

            // Then
            assertTrue(result.isSuccess());
            assertEquals("登出成功", result.getMessage());

            verify(userRepository).revokeAllRefreshTokensByUserId(userId, userId);
        }

        @Test
        @DisplayName("没有刷新令牌时也应该成功登出")
        void shouldLogoutSuccessfullyWithoutRefreshToken() {
            // Given
            Long userId = 1L;
            when(userRepository.revokeAllRefreshTokensByUserId(userId, userId)).thenReturn(true);

            // When
            UserAuthenticationService.LogoutResult result = userAuthenticationService.logout(
                    null, userId
            );

            // Then
            assertTrue(result.isSuccess());
            assertEquals("登出成功", result.getMessage());

            verify(userRepository).revokeAllRefreshTokensByUserId(userId, userId);
        }
    }

    @Nested
    @DisplayName("会话撤销测试")
    class SessionRevokeTests {

        @Test
        @DisplayName("应该成功撤销用户所有会话")
        void shouldRevokeAllUserSessionsSuccessfully() {
            // Given
            Long userId = 1L;
            when(userRepository.revokeAllRefreshTokensByUserId(userId, userId)).thenReturn(true);

            // When
            UserAuthenticationService.SessionRevokeResult result = userAuthenticationService.revokeAllSessions(
                    userId, userId
            );

            // Then
            assertTrue(result.isSuccess());
            assertEquals("所有会话已撤销", result.getMessage());

            verify(userRepository).revokeAllRefreshTokensByUserId(userId, userId);
        }
    }

    // 测试辅助方法

    // 创建活跃用户
    private User createActiveUser() {
        User user = User.create(VALID_IDENTIFIER, "test@example.com", "hashedPassword");
        user.activate(1L); // 激活用户
        return user;
    }

    // 创建非活跃用户
    private User createInactiveUser() {
        return User.create(VALID_IDENTIFIER, "test@example.com", "hashedPassword");
    }

    // 创建活跃锁定记录
    private UserLockout createActiveLockout() {
        return UserLockout.createTemporaryLock(
                1L, UserLockout.LockType.PASSWORD_FAILED, "测试锁定",
                30, 1L, IP_ADDRESS, USER_AGENT, 5
        );
    }

    // 创建有效的刷新令牌
    private RefreshToken createValidRefreshToken() {
        return RefreshToken.create(
                1L, VALID_IDENTIFIER, "hash", "series123",
                java.time.LocalDateTime.now().plusDays(7),
                IP_ADDRESS, USER_AGENT, DEVICE_FINGERPRINT
        );
    }

    // 创建已撤销的刷新令牌
    private RefreshToken createRevokedRefreshToken() {
        RefreshToken token = createValidRefreshToken();
        token.revoke(1L);
        return token;
    }

    // 创建模拟刷新令牌
    private RefreshToken createMockRefreshToken() {
        return createValidRefreshToken();
    }
}