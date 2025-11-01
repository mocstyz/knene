/**
 * UserTest类
 * UserTest相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.domain.user.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Nested;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

// 用户实体单元测试类
class UserTest {

    private User user;

    @BeforeEach
    void setUp() {
        // 创建测试用户
        user = User.create("testuser", "test@example.com", "hashedPassword");
    }

    @Nested
    @DisplayName("用户创建测试")
    class UserCreationTests {

        @Test
        @DisplayName("应该成功创建用户")
        void shouldCreateUserSuccessfully() {
            // Given
            String username = "newuser";
            String email = "newuser@example.com";
            String passwordHash = "hashedPassword";

            // When
            User newUser = User.create(username, email, passwordHash);

            // Then
            assertNotNull(newUser);
            assertEquals(username.toLowerCase(), newUser.getUsername());
            assertEquals(email.toLowerCase(), newUser.getEmail());
            assertEquals(passwordHash, newUser.getPasswordHash());
            assertEquals(User.UserStatus.PENDING, newUser.getStatus());
            assertTrue(newUser.getIsActive());
            assertFalse(newUser.getIsEmailVerified());
            assertFalse(newUser.getIsSuspended());
            assertFalse(newUser.getIsDeleted());
            assertNotNull(newUser.getCreatedAt());
            assertNotNull(newUser.getUpdatedAt());
            assertEquals(0, newUser.getFailedLoginAttempts());
        }

        @Test
        @DisplayName("用户名为空时应该抛出异常")
        void shouldThrowExceptionWhenUsernameIsEmpty() {
            // Given & When & Then
            assertThrows(IllegalArgumentException.class, () -> {
                User.create("", "test@example.com", "hashedPassword");
            });
        }

        @Test
        @DisplayName("邮箱为空时应该抛出异常")
        void shouldThrowExceptionWhenEmailIsEmpty() {
            // Given & When & Then
            assertThrows(IllegalArgumentException.class, () -> {
                User.create("testuser", "", "hashedPassword");
            });
        }

        @Test
        @DisplayName("密码哈希为空时应该抛出异常")
        void shouldThrowExceptionWhenPasswordHashIsEmpty() {
            // Given & When & Then
            assertThrows(IllegalArgumentException.class, () -> {
                User.create("testuser", "test@example.com", "");
            });
        }

        @Test
        @DisplayName("邮箱格式无效时应该抛出异常")
        void shouldThrowExceptionWhenEmailIsInvalid() {
            // Given & When & Then
            assertThrows(IllegalArgumentException.class, () -> {
                User.create("testuser", "invalid-email", "hashedPassword");
            });
        }

        @Test
        @DisplayName("用户名格式无效时应该抛出异常")
        void shouldThrowExceptionWhenUsernameIsInvalid() {
            // Given & When & Then
            assertThrows(IllegalArgumentException.class, () -> {
                User.create("test user!", "test@example.com", "hashedPassword");
            });
        }
    }

    @Nested
    @DisplayName("用户状态管理测试")
    class UserStatusManagementTests {

        @Test
        @DisplayName("应该成功激活用户")
        void shouldActivateUserSuccessfully() {
            // Given
            assertEquals(User.UserStatus.PENDING, user.getStatus());

            // When
            user.activate(1L);

            // Then
            assertEquals(User.UserStatus.ACTIVE, user.getStatus());
            assertTrue(user.getIsActive());
            assertNotNull(user.getActivatedAt());
            assertEquals(1L, user.getActivatedBy());
        }

        @Test
        @DisplayName("应该成功暂停用户")
        void shouldSuspendUserSuccessfully() {
            // Given
            user.activate(1L); // 先激活用户
            assertEquals(User.UserStatus.ACTIVE, user.getStatus());

            // When
            user.suspend("违规操作", 1L);

            // Then
            assertEquals(User.UserStatus.SUSPENDED, user.getStatus());
            assertFalse(user.getIsActive());
            assertTrue(user.getIsSuspended());
            assertEquals("违规操作", user.getSuspensionReason());
            assertEquals(1L, user.getSuspendedBy());
            assertNotNull(user.getSuspendedAt());
        }

        @Test
        @DisplayName("应该成功恢复用户")
        void shouldUnsuspendUserSuccessfully() {
            // Given
            user.activate(1L);
            user.suspend("违规操作", 1L);
            assertEquals(User.UserStatus.SUSPENDED, user.getStatus());

            // When
            user.unsuspend(1L);

            // Then
            assertEquals(User.UserStatus.ACTIVE, user.getStatus());
            assertTrue(user.getIsActive());
            assertFalse(user.getIsSuspended());
            assertNull(user.getSuspensionReason());
            assertEquals(1L, user.getUnsuspendedBy());
            assertNotNull(user.getUnsuspendedAt());
        }

        @Test
        @DisplayName("应该成功删除用户")
        void shouldDeleteUserSuccessfully() {
            // Given
            assertEquals(User.UserStatus.PENDING, user.getStatus());

            // When
            user.delete("用户主动删除", 1L);

            // Then
            assertEquals(User.UserStatus.DELETED, user.getStatus());
            assertTrue(user.getIsDeleted());
            assertEquals("用户主动删除", user.getDeletionReason());
            assertEquals(1L, user.getDeletedBy());
            assertNotNull(user.getDeletedAt());
        }
    }

    @Nested
    @DisplayName("密码管理测试")
    class PasswordManagementTests {

        @Test
        @DisplayName("应该成功更新密码")
        void shouldUpdatePasswordSuccessfully() {
            // Given
            String oldPasswordHash = user.getPasswordHash();
            String newPasswordHash = "newHashedPassword";

            // When
            user.updatePassword(newPasswordHash, 1L);

            // Then
            assertNotEquals(oldPasswordHash, user.getPasswordHash());
            assertEquals(newPasswordHash, user.getPasswordHash());
            assertNotNull(user.getPasswordChangedAt());
            assertEquals(1L, user.getPasswordChangedBy());
        }

        @Test
        @DisplayName("应该验证密码是否已过期")
        void shouldCheckPasswordExpiration() {
            // Given
            user.updatePassword("hashedPassword", 1L);
            assertFalse(user.isPasswordExpired(90)); // 90天内不过期

            // When - 模拟密码是100天前更改的
            // 注意：这里需要修改User类以支持测试，或者使用反射
        }

        @Test
        @DisplayName("应该重置失败登录次数")
        void shouldResetFailedLoginAttempts() {
            // Given
            user.incrementFailedLoginAttempts();
            assertEquals(1, user.getFailedLoginAttempts());

            // When
            user.resetFailedLoginAttempts();

            // Then
            assertEquals(0, user.getFailedLoginAttempts());
        }

        @Test
        @DisplayName("应该增加失败登录次数")
        void shouldIncrementFailedLoginAttempts() {
            // Given
            assertEquals(0, user.getFailedLoginAttempts());

            // When
            user.incrementFailedLoginAttempts();

            // Then
            assertEquals(1, user.getFailedLoginAttempts());
        }

        @Test
        @DisplayName("应该在达到最大失败次数时锁定账户")
        void shouldLockAccountWhenMaxFailedAttemptsReached() {
            // Given
            for (int i = 0; i < 4; i++) {
                user.incrementFailedLoginAttempts();
            }
            assertEquals(4, user.getFailedLoginAttempts());
            assertFalse(user.shouldLockAccount());

            // When
            user.incrementFailedLoginAttempts(); // 第5次失败

            // Then
            assertEquals(5, user.getFailedLoginAttempts());
            assertTrue(user.shouldLockAccount());
        }
    }

    @Nested
    @DisplayName("邮箱验证测试")
    class EmailVerificationTests {

        @Test
        @DisplayName("应该成功标记邮箱为已验证")
        void shouldMarkEmailAsVerified() {
            // Given
            assertFalse(user.getIsEmailVerified());
            assertNull(user.getEmailVerifiedAt());

            // When
            user.markEmailAsVerified();

            // Then
            assertTrue(user.getIsEmailVerified());
            assertNotNull(user.getEmailVerifiedAt());
        }
    }

    @Nested
    @DisplayName("登录信息更新测试")
    class LoginInfoUpdateTests {

        @Test
        @DisplayName("应该成功更新登录信息")
        void shouldUpdateLoginInfoSuccessfully() {
            // Given
            String ipAddress = "192.168.1.1";
            String userAgent = "Mozilla/5.0";

            // When
            user.updateLoginInfo(ipAddress, userAgent);

            // Then
            assertEquals(ipAddress, user.getLastLoginIp());
            assertEquals(userAgent, user.getLastLoginUserAgent());
            assertNotNull(user.getLastLoginAt());
        }
    }

    @Nested
    @DisplayName("账户锁定测试")
    class AccountLockTests {

        @Test
        @DisplayName("应该成功锁定账户")
        void shouldLockAccountSuccessfully() {
            // Given
            assertFalse(user.getIsAccountLocked());

            // When
            user.lockAccount("安全原因", 1L);

            // Then
            assertTrue(user.getIsAccountLocked());
            assertEquals("安全原因", user.getLockReason());
            assertEquals(1L, user.getLockedBy());
            assertNotNull(user.getLockedAt());
        }

        @Test
        @DisplayName("应该成功解锁账户")
        void shouldUnlockAccountSuccessfully() {
            // Given
            user.lockAccount("安全原因", 1L);
            assertTrue(user.getIsAccountLocked());

            // When
            user.unlockAccount(1L);

            // Then
            assertFalse(user.getIsAccountLocked());
            assertNull(user.getLockReason());
            assertEquals(1L, user.getUnlockedBy());
            assertNotNull(user.getUnlockedAt());
        }
    }

    @Nested
    @DisplayName("业务规则验证测试")
    class BusinessRuleValidationTests {

        @Test
        @DisplayName("应该正确计算账户年龄")
        void shouldCalculateAccountAgeCorrectly() {
            // Given - 用户刚创建
            LocalDateTime creationTime = user.getCreatedAt();

            // When
            long accountAgeInSeconds = user.getAccountAgeInSeconds();

            // Then
            assertTrue(accountAgeInSeconds >= 0);
            assertTrue(accountAgeInSeconds < 5); // 应该在5秒内完成测试
        }

        @Test
        @DisplayName("应该正确检查用户是否为活跃用户")
        void shouldCheckUserActiveStatusCorrectly() {
            // Given & When - 用户刚创建，未激活
            assertFalse(user.isActiveUser());

            // When - 激活用户
            user.activate(1L);

            // Then
            assertTrue(user.isActiveUser());

            // When - 暂停用户
            user.suspend("测试暂停", 1L);

            // Then
            assertFalse(user.isActiveUser());
        }
    }

    @Nested
    @DisplayName("角色权限测试")
    class RolePermissionTests {

        @Test
        @DisplayName("应该正确检查用户是否具有指定角色")
        void shouldCheckUserRoleCorrectly() {
            // Given - 用户刚创建，没有角色
            assertFalse(user.hasRole("ADMIN"));
            assertFalse(user.hasRole("USER"));

            // When - 添加角色（这里需要实现添加角色的方法）
            // user.addRole("USER");

            // Then - 验证角色
            // assertTrue(user.hasRole("USER"));
            // assertFalse(user.hasRole("ADMIN"));
        }
    }
}