/**
 * UserCommandsAndQueries类
 * UserCommandsAndQueries相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.application.user.dto;

// 用户应用服务命令和查询对象定义
// 定义用户应用层使用的命令和查询对象

import com.knene.domain.user.valueobject.UserProfile;
import java.time.LocalDateTime;

// 命令对象定义

// 重新发送验证邮件命令
public class ResendVerificationCommand {
    private String email;
    private String ipAddress;
    private String userAgent;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
}

// 刷新令牌命令
public class RefreshTokenCommand {
    private String refreshToken;
    private String ipAddress;
    private String userAgent;

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
}

// 用户登出命令
public class LogoutUserCommand {
    private String refreshToken;
    private Long userId;
    private String ipAddress;

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
}

// 请求密码重置命令
public class RequestPasswordResetCommand {
    private String email;
    private String ipAddress;
    private String userAgent;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
}

// 验证密码重置令牌命令
public class ValidateResetTokenCommand {
    private String token;
    private String ipAddress;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
}

// 执行密码重置命令
public class ExecutePasswordResetCommand {
    private String token;
    private String newPassword;
    private String ipAddress;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
}

// 更新档案命令
public class UpdateProfileCommand {
    private Long userId;
    private Long requestUserId;
    private String nickname;
    private UserProfile.Gender gender;
    private java.time.LocalDate birthday;
    private String bio;
    private String location;
    private String website;

    // getter和setter方法
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getRequestUserId() { return requestUserId; }
    public void setRequestUserId(Long requestUserId) { this.requestUserId = requestUserId; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public UserProfile.Gender getGender() { return gender; }
    public void setGender(UserProfile.Gender gender) { this.gender = gender; }
    public java.time.LocalDate getBirthday() { return birthday; }
    public void setBirthday(java.time.LocalDate birthday) { this.birthday = birthday; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
}

// 上传头像命令
public class UploadAvatarCommand {
    private Long userId;
    private Long requestUserId;
    private byte[] imageData;
    private String contentType;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getRequestUserId() { return requestUserId; }
    public void setRequestUserId(Long requestUserId) { this.requestUserId = requestUserId; }
    public byte[] getImageData() { return imageData; }
    public void setImageData(byte[] imageData) { this.imageData = imageData; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
}

// 锁定用户命令
public class LockUserCommand {
    private Long userId;
    private String lockReason;
    private Integer lockDuration; // 分钟数，null表示永久锁定
    private Long lockedBy;
    private String ipAddress;
    private String userAgent;

    // getter和setter方法
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getLockReason() { return lockReason; }
    public void setLockReason(String lockReason) { this.lockReason = lockReason; }
    public Integer getLockDuration() { return lockDuration; }
    public void setLockDuration(Integer lockDuration) { this.lockDuration = lockDuration; }
    public Long getLockedBy() { return lockedBy; }
    public void setLockedBy(Long lockedBy) { this.lockedBy = lockedBy; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
}

// 解锁用户命令
public class UnlockUserCommand {
    private Long userId;
    private String unlockReason;
    private Long unlockedBy;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUnlockReason() { return unlockReason; }
    public void setUnlockReason(String unlockReason) { this.unlockReason = unlockReason; }
    public Long getUnlockedBy() { return unlockedBy; }
    public void setUnlockedBy(Long unlockedBy) { this.unlockedBy = unlockedBy; }
}

// 查询对象定义

// 获取用户档案查询
public class GetUserProfileQuery {
    private Long userId;
    private Long requestUserId;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getRequestUserId() { return requestUserId; }
    public void setRequestUserId(Long requestUserId) { this.requestUserId = requestUserId; }
}

// 获取用户列表查询
public class GetUserListQuery {
    private com.knene.domain.user.entity.User.UserStatus status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int limit = 20;
    private int offset = 0;

    // getter和setter方法
    public com.knene.domain.user.entity.User.UserStatus getStatus() { return status; }
    public void setStatus(com.knene.domain.user.entity.User.UserStatus status) { this.status = status; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public int getLimit() { return limit; }
    public void setLimit(int limit) { this.limit = limit; }
    public int getOffset() { return offset; }
    public void setOffset(int offset) { this.offset = offset; }
}