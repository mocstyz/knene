/**
 * AdminRequests类
 * AdminRequests相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.interfaces.user.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// 用户管理请求

// 锁定用户请求DTO
// 包含锁定用户的原因和时长信息
public class LockUserRequest {

    @NotBlank(message = "锁定原因不能为空")
    @Size(max = 500, message = "锁定原因长度不能超过500个字符")
    @JsonProperty("lock_reason")
    private String lockReason;

    @JsonProperty("lock_duration")
    private Integer lockDuration; // 锁定时长（分钟），null表示永久锁定

    // getter和setter方法
    public String getLockReason() { return lockReason; }
    public void setLockReason(String lockReason) { this.lockReason = lockReason; }

    public Integer getLockDuration() { return lockDuration; }
    public void setLockDuration(Integer lockDuration) { this.lockDuration = lockDuration; }
}

// 解锁用户请求DTO
// 包含解锁用户的原因信息
public class UnlockUserRequest {

    @NotBlank(message = "解锁原因不能为空")
    @Size(max = 500, message = "解锁原因长度不能超过500个字符")
    @JsonProperty("unlock_reason")
    private String unlockReason;

    public String getUnlockReason() { return unlockReason; }
    public void setUnlockReason(String unlockReason) { this.unlockReason = unlockReason; }
}