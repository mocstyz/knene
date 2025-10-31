/**
 * UserRepository类
 * UserRepository相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.domain.user.repository;

import com.knene.domain.user.entity.User;
import com.knene.domain.user.valueobject.UserProfile;
import com.knene.domain.user.entity.RefreshToken;
import com.knene.domain.user.entity.EmailVerification;
import com.knene.domain.user.entity.PasswordReset;
import com.knene.domain.user.entity.UserLockout;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// 用户仓储接口 - 定义用户聚合的持久化操作
public interface UserRepository {

    // 1. 用户基本操作
    User save(User user); // 保存用户实体

    Optional<User> findById(Long id); // 根据ID查找用户

    Optional<User> findByUsername(String username); // 根据用户名查找用户

    Optional<User> findByEmail(String email); // 根据邮箱查找用户

    Optional<User> findByIdentifier(String identifier); // 根据用户名或邮箱查找用户

    boolean existsByUsername(String username); // 检查用户名是否存在

    boolean existsByEmail(String email); // 检查邮箱是否存在

    void delete(User user); // 删除用户实体

    void deleteById(Long id); // 根据ID删除用户

    // 2. 用户档案操作

    UserProfile saveProfile(UserProfile profile); // 保存用户档案

    Optional<UserProfile> findProfileByUserId(Long userId); // 根据用户ID查找用户档案

    void deleteProfileByUserId(Long userId); // 删除用户档案

    // 3. 刷新令牌操作

    // 保存刷新令牌
    RefreshToken saveRefreshToken(RefreshToken refreshToken);

    // 根据ID查找刷新令牌
    Optional<RefreshToken> findRefreshTokenById(Long id);

    // 根据用户ID查找有效的刷新令牌
    List<RefreshToken> findValidRefreshTokensByUserId(Long userId);

    // 根据令牌系列号查找刷新令牌
    Optional<RefreshToken> findRefreshTokenBySeries(String tokenSeries);

    // 根据令牌哈希查找刷新令牌
    Optional<RefreshToken> findRefreshTokenByHash(String tokenHash);

    // 撤销用户的所有刷新令牌
    void revokeAllRefreshTokensByUserId(Long userId, Long revokedBy);

    // 根据令牌系列号撤销所有相关令牌
    void revokeRefreshTokensBySeries(String tokenSeries, Long revokedBy);

    // 清理过期的刷新令牌
    int cleanupExpiredRefreshTokens(LocalDateTime cleanUpBefore);

    // 邮箱验证操作

    // 保存邮箱验证
    EmailVerification saveEmailVerification(EmailVerification emailVerification);

    // 根据ID查找邮箱验证
    Optional<EmailVerification> findEmailVerificationById(Long id);

    // 根据用户ID和邮箱查找邮箱验证
    Optional<EmailVerification> findEmailVerificationByUserIdAndEmail(Long userId, String email);

    // 根据令牌哈希查找邮箱验证
    Optional<EmailVerification> findEmailVerificationByTokenHash(String tokenHash);

    // 根据用户ID查找未完成的邮箱验证
    List<EmailVerification> findPendingEmailVerificationsByUserId(Long userId);

    // 清理过期的邮箱验证
    int cleanupExpiredEmailVerifications(LocalDateTime cleanUpBefore);

    // 密码重置操作

    // 保存密码重置
    PasswordReset savePasswordReset(PasswordReset passwordReset);

    // 根据ID查找密码重置
    Optional<PasswordReset> findPasswordResetById(Long id);

    // 根据用户ID和邮箱查找密码重置
    Optional<PasswordReset> findPasswordResetByUserIdAndEmail(Long userId, String email);

    // 根据令牌哈希查找密码重置
    Optional<PasswordReset> findPasswordResetByTokenHash(String tokenHash);

    // 根据用户ID查找未使用的密码重置
    List<PasswordReset> findUnusedPasswordResetsByUserId(Long userId);

    // 清理过期的密码重置
    int cleanupExpiredPasswordResets(LocalDateTime cleanUpBefore);

    // 用户锁定操作

    // 保存用户锁定记录
    UserLockout saveUserLockout(UserLockout userLockout);

    // 根据ID查找用户锁定记录
    Optional<UserLockout> findUserLockoutById(Long id);

    // 根据用户ID查找有效的锁定记录
    List<UserLockout> findActiveLockoutsByUserId(Long userId);

    // 根据用户ID查找所有锁定记录
    List<UserLockout> findAllLockoutsByUserId(Long userId);

    // 查找即将过期的锁定记录
    List<UserLockout> findLockoutsNearExpiry(int minutesBefore);

    // 查找已过期的锁定记录
    List<UserLockout> findExpiredLockouts(LocalDateTime expiredBefore);

    // 解锁用户
    void unlockUser(Long userId, String unlockReason, Long unlockedBy);

    // 自动解锁已过期的锁定记录
    int autoUnlockExpiredLocks();

    // 用户查询操作

    // 根据状态查找用户
    List<User> findUsersByStatus(User.UserStatus status, int limit, int offset);

    // 根据创建时间范围查找用户
    List<User> findUsersByCreatedTimeRange(LocalDateTime startTime, LocalDateTime endTime, int limit, int offset);

    // 根据最后登录时间范围查找用户
    List<User> findUsersByLastLoginTimeRange(LocalDateTime startTime, LocalDateTime endTime, int limit, int offset);

    // 查找最近注册的用户
    List<User> findRecentlyRegisteredUsers(int days, int limit);

    // 查找活跃用户
    List<User> findActiveUsers(int days, int limit);

    // 根据角色查找用户
    List<User> findUsersByRole(String roleName, int limit, int offset);

    // 统计用户总数
    long countTotalUsers();

    // 根据状态统计用户数量
    long countUsersByStatus(User.UserStatus status);

    // 统计指定时间范围内注册的用户数量
    long countUsersByCreatedTimeRange(LocalDateTime startTime, LocalDateTime endTime);

    // 统计最近活跃的用户数量
    long countActiveUsers(int days);

    // 批量操作

    // 批量保存用户
    List<User> saveAll(List<User> users);

    // 批量删除用户
    void deleteAllById(List<Long> userIds);

    // 检查用户名是否存在（批量）
    java.util.Set<String> findExistingUsernames(java.util.Set<String> usernames);

    // 检查邮箱是否存在（批量）
    java.util.Set<String> findExistingEmails(java.util.Set<String> emails);

    // 系统维护操作

    // 执行系统清理操作 - 清理过期的令牌、验证记录等
    CleanupResult performSystemCleanup();

  // 清理统计结果
    class CleanupResult {
        private final int expiredRefreshTokens;
        private final int expiredEmailVerifications;
        private final int expiredPasswordResets;
        private final int unlockedLockouts;
        private final LocalDateTime cleanupTime;

        public CleanupResult(int expiredRefreshTokens, int expiredEmailVerifications, int expiredPasswordResets, int unlockedLockouts) {
            this.expiredRefreshTokens = expiredRefreshTokens;
            this.expiredEmailVerifications = expiredEmailVerifications;
            this.expiredPasswordResets = expiredPasswordResets;
            this.unlockedLockouts = unlockedLockouts;
            this.cleanupTime = LocalDateTime.now();
        }

        public int getExpiredRefreshTokens() {
            return expiredRefreshTokens;
        }

        public int getExpiredEmailVerifications() {
            return expiredEmailVerifications;
        }

        public int getExpiredPasswordResets() {
            return expiredPasswordResets;
        }

        public int getUnlockedLockouts() {
            return unlockedLockouts;
        }

        public LocalDateTime getCleanupTime() {
            return cleanupTime;
        }

        @Override
        public String toString() {
            return "CleanupResult{" +
                    "expiredRefreshTokens=" + expiredRefreshTokens +
                    ", expiredEmailVerifications=" + expiredEmailVerifications +
                    ", expiredPasswordResets=" + expiredPasswordResets +
                    ", unlockedLockouts=" + unlockedLockouts +
                    ", cleanupTime=" + cleanupTime +
                    '}';
        }
    }
}