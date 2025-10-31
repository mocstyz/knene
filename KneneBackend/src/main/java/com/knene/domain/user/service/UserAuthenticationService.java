/**
 * UserAuthenticationService类
 * UserAuthenticationService相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.domain.user.service;

import com.knene.domain.user.entity.User;
import com.knene.domain.user.entity.RefreshToken;
import com.knene.domain.user.entity.UserLockout;
import com.knene.domain.user.repository.UserRepository;
import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.digest.BCrypt;
import cn.hutool.jwt.JWT;
import cn.hutool.jwt.JWTUtil;
import cn.hutool.jwt.signers.JWTSignerUtil;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

// 用户认证领域服务
// 处理用户登录、认证、令牌管理等认证相关的业务逻辑
public class UserAuthenticationService {

    private final UserRepository userRepository;
    private final JwtTokenService jwtTokenService;
    private final LoginAttemptService loginAttemptService;

    // 构造器注入依赖
    public UserAuthenticationService(UserRepository userRepository,
                                   JwtTokenService jwtTokenService,
                                   LoginAttemptService loginAttemptService) {
        this.userRepository = userRepository;
        this.jwtTokenService = jwtTokenService;
        this.loginAttemptService = loginAttemptService;
    }

    // 用户认证核心业务逻辑

    // 用户登录认证
    public AuthenticationResult authenticate(String identifier, String password,
                                           String ipAddress, String userAgent,
                                           String deviceFingerprint) {
        // 1. 验证输入参数
        validateAuthenticationInput(identifier, password);

        // 2. 检查登录频率限制
        if (loginAttemptService.isRateLimited(ipAddress)) {
            return new AuthenticationResult(AuthenticationStatus.RATE_LIMITED, "登录尝试过于频繁，请稍后再试");
        }

        // 3. 查找用户
        Optional<User> userOpt = userRepository.findByIdentifier(identifier);
        if (!userOpt.isPresent()) {
            loginAttemptService.recordFailedAttempt(ipAddress, identifier, "用户不存在");
            return new AuthenticationResult(AuthenticationStatus.USER_NOT_FOUND, "用户名或密码错误");
        }

        User user = userOpt.get();

        // 4. 检查用户状态
        AuthenticationStatus status = checkUserStatus(user);
        if (status != AuthenticationStatus.SUCCESS) {
            loginAttemptService.recordFailedAttempt(ipAddress, identifier, "用户状态异常: " + status);
            return new AuthenticationResult(status, getStatusMessage(status));
        }

        // 5. 检查账户锁定状态
        List<UserLockout> activeLockouts = userRepository.findActiveLockoutsByUserId(user.getId());
        if (!activeLockouts.isEmpty()) {
            UserLockout latestLockout = activeLockouts.get(activeLockouts.size() - 1);
            if (latestLockout.isLocked()) {
                loginAttemptService.recordFailedAttempt(ipAddress, identifier, "账户被锁定");
                return new AuthenticationResult(AuthenticationStatus.ACCOUNT_LOCKED,
                    "账户已被锁定，剩余" + latestLockout.getRemainingMinutes() + "分钟");
            }
        }

        // 6. 验证密码
        if (!BCrypt.checkpw(password, user.getPasswordHash())) {
            // 记录失败尝试
            loginAttemptService.recordFailedAttempt(ipAddress, identifier, "密码错误");

            // 检查是否需要锁定账户
            handleFailedLogin(user, ipAddress, userAgent);

            return new AuthenticationResult(AuthenticationStatus.INVALID_CREDENTIALS, "用户名或密码错误");
        }

        // 7. 登录成功，清除失败记录
        loginAttemptService.clearFailedAttempts(ipAddress, identifier);

        // 8. 更新用户登录信息
        updateLoginInfo(user, ipAddress, userAgent);

        // 9. 生成JWT令牌
        String accessToken = jwtTokenService.generateAccessToken(user);
        String refreshToken = jwtTokenService.generateRefreshToken(user);

        // 10. 保存刷新令牌
        RefreshToken refreshTokenEntity = createRefreshToken(user, refreshToken, ipAddress, userAgent, deviceFingerprint);
        userRepository.saveRefreshToken(refreshTokenEntity);

        // 11. 保存用户
        userRepository.save(user);

        return new AuthenticationResult(AuthenticationStatus.SUCCESS, "登录成功",
                user.getId(), user.getUsername(), user.getEmail(),
                accessToken, refreshToken, user.getRoles());
    }

  // 刷新访问令牌
    public TokenRefreshResult refreshToken(String refreshToken, String ipAddress, String userAgent) {
        // 1. 验证刷新令牌
        if (StrUtil.isBlank(refreshToken)) {
            return new TokenRefreshResult(TokenRefreshStatus.INVALID_TOKEN, "刷新令牌不能为空");
        }

        // 2. 解析JWT令牌
        try {
            JWT jwt = JWTUtil.parseToken(refreshToken);
            if (!jwt.verify(JWTSignerUtil.hs256("your-secret-key"))) {
                return new TokenRefreshResult(TokenRefreshStatus.INVALID_TOKEN, "无效的刷新令牌");
            }

            Long userId = Long.valueOf(jwt.getPayload("userId").toString());
            String tokenSeries = jwt.getPayload("tokenSeries").toString();

            // 3. 查找刷新令牌记录
            Optional<RefreshToken> tokenOpt = userRepository.findRefreshTokenBySeries(tokenSeries);
            if (!tokenOpt.isPresent()) {
                return new TokenRefreshResult(TokenRefreshStatus.TOKEN_NOT_FOUND, "刷新令牌不存在");
            }

            RefreshToken tokenEntity = tokenOpt.get();

            // 4. 验证令牌有效性
            if (!tokenEntity.isValid()) {
                return new TokenRefreshResult(TokenRefreshStatus.TOKEN_INVALID, "刷新令牌已失效");
            }

            // 5. 检查设备指纹（增强安全）
            if (!tokenEntity.matchesDevice(StrUtil.isBlank(deviceFingerprint) ? null : deviceFingerprint, ipAddress)) {
                // 撤销该系列的所有令牌（安全风险）
                userRepository.revokeRefreshTokensBySeries(tokenSeries, null);
                return new TokenRefreshResult(TokenRefreshStatus.SECURITY_RISK, "设备验证失败，请重新登录");
            }

            // 6. 查找用户
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return new TokenRefreshResult(TokenRefreshStatus.USER_NOT_FOUND, "用户不存在");
            }

            User user = userOpt.get();

            // 7. 检查用户状态
            AuthenticationStatus status = checkUserStatus(user);
            if (status != AuthenticationStatus.SUCCESS) {
                return new TokenRefreshResult(TokenRefreshStatus.USER_INACTIVE, getStatusMessage(status));
            }

            // 8. 生成新的访问令牌
            String newAccessToken = jwtTokenService.generateAccessToken(user);

            // 9. 如果刷新令牌即将过期，生成新的刷新令牌
            String newRefreshToken = refreshToken;
            if (tokenEntity.isNearExpiry()) {
                newRefreshToken = jwtTokenService.generateRefreshToken(user);

                // 撤销旧的刷新令牌
                tokenEntity.revoke(null);
                userRepository.saveRefreshToken(tokenEntity);

                // 创建新的刷新令牌
                RefreshToken newRefreshTokenEntity = createRefreshToken(user, newRefreshToken, ipAddress, userAgent, null);
                userRepository.saveRefreshToken(newRefreshTokenEntity);
            }

            return new TokenRefreshResult(TokenRefreshStatus.SUCCESS, "令牌刷新成功",
                    newAccessToken, newRefreshToken);

        } catch (Exception e) {
            return new TokenRefreshResult(TokenRefreshStatus.TOKEN_PARSE_ERROR, "令牌解析错误");
        }
    }

    // 用户登出
    public LogoutResult logout(String refreshToken, Long userId) {
        try {
            // 1. 如果提供了刷新令牌，撤销它
            if (StrUtil.isNotBlank(refreshToken)) {
                JWT jwt = JWTUtil.parseToken(refreshToken);
                String tokenSeries = jwt.getPayload("tokenSeries").toString();
                userRepository.revokeRefreshTokensBySeries(tokenSeries, userId);
            }

            // 2. 撤销用户的所有刷新令牌（可选，根据安全策略）
            userRepository.revokeAllRefreshTokensByUserId(userId, userId);

            return new LogoutResult(LogoutStatus.SUCCESS, "登出成功");

        } catch (Exception e) {
            return new LogoutResult(LogoutStatus.PARTIAL_SUCCESS, "登出基本成功，但部分令牌可能未清理");
        }
    }

    // 撤销用户的所有会话
    public SessionRevokeResult revokeAllSessions(Long userId, Long revokedBy) {
        try {
            // 撤销用户的所有刷新令牌
            userRepository.revokeAllRefreshTokensByUserId(userId, revokedBy);

            return new SessionRevokeResult(SessionRevokeStatus.SUCCESS, "所有会话已撤销");

        } catch (Exception e) {
            return new SessionRevokeResult(SessionRevokeStatus.SYSTEM_ERROR, "撤销会话时发生错误");
        }
    }

    // 私有辅助方法

    // 验证认证输入参数
    private void validateAuthenticationInput(String identifier, String password) {
        if (StrUtil.isBlank(identifier)) {
            throw new IllegalArgumentException("用户名或邮箱不能为空");
        }
        if (StrUtil.isBlank(password)) {
            throw new IllegalArgumentException("密码不能为空");
        }
    }

    // 检查用户状态
    private AuthenticationStatus checkUserStatus(User user) {
        if (!user.getIsActive()) {
            return AuthenticationStatus.USER_INACTIVE;
        }
        if (user.getIsSuspended()) {
            return AuthenticationStatus.USER_SUSPENDED;
        }
        if (user.getIsDeleted()) {
            return AuthenticationStatus.USER_DELETED;
        }
        if (!user.getIsEmailVerified()) {
            return AuthenticationStatus.EMAIL_NOT_VERIFIED;
        }
        return AuthenticationStatus.SUCCESS;
    }

    // 处理登录失败
    private void handleFailedLogin(User user, String ipAddress, String userAgent) {
        // 增加失败次数
        user.incrementFailedLoginAttempts();
        user.setLastFailedLoginAt(LocalDateTime.now());
        user.setLastFailedLoginIp(ipAddress);

        // 检查是否需要锁定账户
        if (user.shouldLockAccount()) {
            // 创建锁定记录
            UserLockout lockout = UserLockout.createTemporaryLock(
                    user.getId(),
                    UserLockout.LockType.PASSWORD_FAILED,
                    "连续登录失败次数过多",
                    30, // 锁定30分钟
                    null, // 系统操作
                    ipAddress,
                    userAgent,
                    user.getFailedLoginAttempts()
            );
            userRepository.saveUserLockout(lockout);

            // 锁定用户账户
            user.lockAccount("连续登录失败次数过多", null);
        }

        userRepository.save(user);
    }

    // 更新登录信息
    private void updateLoginInfo(User user, String ipAddress, String userAgent) {
        user.setLastLoginAt(LocalDateTime.now());
        user.setLastLoginIp(ipAddress);
        user.setLastLoginUserAgent(userAgent);
        user.resetFailedLoginAttempts(); // 重置失败次数
    }

    // 创建刷新令牌
    private RefreshToken createRefreshToken(User user, String refreshToken,
                                          String ipAddress, String userAgent,
                                          String deviceFingerprint) {
        String tokenHash = cn.hutool.crypto.digest.DigestUtil.sha256Hex(refreshToken);
        String tokenSeries = generateTokenSeries();
        LocalDateTime expiresAt = LocalDateTime.now().plusDays(7); // 7天过期

        return RefreshToken.create(
                user.getId(),
                user.getUsername(),
                tokenHash,
                tokenSeries,
                expiresAt,
                ipAddress,
                userAgent,
                deviceFingerprint
        );
    }

    // 生成令牌系列号
    private String generateTokenSeries() {
        return cn.hutool.core.util.IdUtil.fastSimpleUUID();
    }

    // 获取状态消息
    private String getStatusMessage(AuthenticationStatus status) {
        switch (status) {
            case USER_INACTIVE: return "账户未激活";
            case USER_SUSPENDED: return "账户已被暂停";
            case USER_DELETED: return "账户已被删除";
            case EMAIL_NOT_VERIFIED: return "邮箱未验证";
            case ACCOUNT_LOCKED: return "账户已被锁定";
            default: return "认证失败";
        }
    }

    // 结果类定义

    // 认证状态枚举
    public enum AuthenticationStatus {
        SUCCESS,                // 成功
        USER_NOT_FOUND,         // 用户不存在
        INVALID_CREDENTIALS,    // 凭据无效
        USER_INACTIVE,          // 用户未激活
        USER_SUSPENDED,         // 用户被暂停
        USER_DELETED,           // 用户已删除
        EMAIL_NOT_VERIFIED,     // 邮箱未验证
        ACCOUNT_LOCKED,         // 账户被锁定
        RATE_LIMITED,           // 频率限制
        SYSTEM_ERROR            // 系统错误
    }

    // 令牌刷新状态枚举
    public enum TokenRefreshStatus {
        SUCCESS,                // 成功
        INVALID_TOKEN,          // 无效令牌
        TOKEN_NOT_FOUND,        // 令牌不存在
        TOKEN_INVALID,          // 令牌已失效
        TOKEN_EXPIRED,          // 令牌已过期
        USER_NOT_FOUND,         // 用户不存在
        USER_INACTIVE,          // 用户未激活
        SECURITY_RISK,          // 安全风险
        TOKEN_PARSE_ERROR       // 令牌解析错误
    }

    // 登出状态枚举
    public enum LogoutStatus {
        SUCCESS,                // 成功
        PARTIAL_SUCCESS,        // 部分成功
        SYSTEM_ERROR            // 系统错误
    }

    // 会话撤销状态枚举
    public enum SessionRevokeStatus {
        SUCCESS,                // 成功
        SYSTEM_ERROR            // 系统错误
    }

    // 认证结果类
    public static class AuthenticationResult {
        private final AuthenticationStatus status;
        private final String message;
        private final Long userId;
        private final String username;
        private final String email;
        private final String accessToken;
        private final String refreshToken;
        private final List<String> roles;

        public AuthenticationResult(AuthenticationStatus status, String message) {
            this.status = status;
            this.message = message;
            this.userId = null;
            this.username = null;
            this.email = null;
            this.accessToken = null;
            this.refreshToken = null;
            this.roles = null;
        }

        public AuthenticationResult(AuthenticationStatus status, String message,
                                  Long userId, String username, String email,
                                  String accessToken, String refreshToken,
                                  List<String> roles) {
            this.status = status;
            this.message = message;
            this.userId = userId;
            this.username = username;
            this.email = email;
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.roles = roles;
        }

        public AuthenticationStatus getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public Long getUserId() {
            return userId;
        }

        public String getUsername() {
            return username;
        }

        public String getEmail() {
            return email;
        }

        public String getAccessToken() {
            return accessToken;
        }

        public String getRefreshToken() {
            return refreshToken;
        }

        public List<String> getRoles() {
            return roles;
        }

        public boolean isSuccess() {
            return status == AuthenticationStatus.SUCCESS;
        }
    }

    // 令牌刷新结果类
    public static class TokenRefreshResult {
        private final TokenRefreshStatus status;
        private final String message;
        private final String accessToken;
        private final String refreshToken;

        public TokenRefreshResult(TokenRefreshStatus status, String message) {
            this.status = status;
            this.message = message;
            this.accessToken = null;
            this.refreshToken = null;
        }

        public TokenRefreshResult(TokenRefreshStatus status, String message,
                                String accessToken, String refreshToken) {
            this.status = status;
            this.message = message;
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        }

        public TokenRefreshStatus getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public String getAccessToken() {
            return accessToken;
        }

        public String getRefreshToken() {
            return refreshToken;
        }

        public boolean isSuccess() {
            return status == TokenRefreshStatus.SUCCESS;
        }
    }

    // 登出结果类
    public static class LogoutResult {
        private final LogoutStatus status;
        private final String message;

        public LogoutResult(LogoutStatus status, String message) {
            this.status = status;
            this.message = message;
        }

        public LogoutStatus getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public boolean isSuccess() {
            return status == LogoutStatus.SUCCESS;
        }
    }

    // 会话撤销结果类
    public static class SessionRevokeResult {
        private final SessionRevokeStatus status;
        private final String message;

        public SessionRevokeResult(SessionRevokeStatus status, String message) {
            this.status = status;
            this.message = message;
        }

        public SessionRevokeStatus getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public boolean isSuccess() {
            return status == SessionRevokeStatus.SUCCESS;
        }
    }

    // JWT令牌服务接口
    public interface JwtTokenService {
        String generateAccessToken(User user);
        String generateRefreshToken(User user);
    }

    // 登录尝试服务接口
    public interface LoginAttemptService {
        boolean isRateLimited(String ipAddress);
        void recordFailedAttempt(String ipAddress, String identifier, String reason);
        void clearFailedAttempts(String ipAddress, String identifier);
    }
}