/**
 * UserEventPublisher类
 * UserEventPublisher相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.application.user.service;

// 用户事件发布器接口
// 定义用户相关事件的发布接口

// 用户事件发布器接口
public interface UserEventPublisher {

    // 发布用户注册事件
    void publishUserRegisteredEvent(Long userId, String email, String username);

    // 发布邮箱验证事件
    void publishEmailVerifiedEvent(String token);

    // 发布用户登录事件
    void publishUserLoginEvent(Long userId, String ipAddress);

    // 发布用户登录失败事件
    void publishUserLoginFailedEvent(String identifier, String ipAddress, String reason);

    // 发布用户登出事件
    void publishUserLogoutEvent(Long userId, String ipAddress);

    // 发布密码重置事件
    void publishPasswordResetEvent(String token);

    // 发布档案更新事件
    void publishProfileUpdatedEvent(Long userId);

    // 发布头像更新事件
    void publishAvatarUpdatedEvent(Long userId, String avatarUrl);

    // 发布用户锁定事件
    void publishUserLockedEvent(Long userId, String reason);

    // 发布用户解锁事件
    void publishUserUnlockedEvent(Long userId, String reason);
}