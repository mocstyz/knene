/**
 * AdminResponses类
 * AdminResponses相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.interfaces.user.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.knene.application.user.dto.UserProfileDto;
import com.knene.application.user.dto.UserDto;
import java.time.LocalDateTime;
import java.util.List;

// 用户列表响应

// 用户列表响应DTO
// 包含分页的用户列表信息和分页详情
public class UserListResponse {
    private final List<UserSummaryDto> users;
    private final long totalCount;
    private final int currentPage;
    private final int pageSize;
    private final int totalPages;
    private final boolean hasNext;
    private final boolean hasPrevious;

    public UserListResponse(List<UserDto> users, long totalCount, int currentPage, int pageSize) {
        this.users = users.stream()
                .map(UserSummaryDto::fromDto)
                .toList();
        this.totalCount = totalCount;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalPages = (int) Math.ceil((double) totalCount / pageSize);
        this.hasNext = currentPage < totalPages - 1;
        this.hasPrevious = currentPage > 0;
    }

    public List<UserSummaryDto> getUsers() { return users; }

    @JsonProperty("total_count")
    public long getTotalCount() { return totalCount; }

    @JsonProperty("current_page")
    public int getCurrentPage() { return currentPage; }

    @JsonProperty("page_size")
    public int getPageSize() { return pageSize; }

    @JsonProperty("total_pages")
    public int getTotalPages() { return totalPages; }

    @JsonProperty("has_next")
    public boolean isHasNext() { return hasNext; }

    @JsonProperty("has_previous")
    public boolean isHasPrevious() { return hasPrevious; }
}

// 用户摘要DTO
// 包含用户的基本摘要信息，用于列表展示
public class UserSummaryDto {
    private final Long id;
    private final String username;
    private final String email;
    private final String status;
    private final LocalDateTime createdAt;
    private final LocalDateTime lastLoginAt;

    private UserSummaryDto(Long id, String username, String email, String status,
                           LocalDateTime createdAt, LocalDateTime lastLoginAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.status = status;
        this.createdAt = createdAt;
        this.lastLoginAt = lastLoginAt;
    }

    public static UserSummaryDto fromDto(UserDto userDto) {
        return new UserSummaryDto(
                userDto.getId(),
                userDto.getUsername(),
                userDto.getEmail(),
                userDto.getStatus().name(),
                LocalDateTime.now(), // 临时设置
                LocalDateTime.now()  // 临时设置
        );
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getStatus() { return status; }

    @JsonProperty("created_at")
    public LocalDateTime getCreatedAt() { return createdAt; }

    @JsonProperty("last_login_at")
    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
}

// 用户详情响应

// 用户详情响应DTO
// 包含用户的完整详细信息，供管理员查看
public class UserDetailResponse {
    private final Long userId;
    private final String username;
    private final String email;
    private final String status;
    private final String nickname;
    private final String gender;
    private final java.time.LocalDate birthday;
    private final String bio;
    private final String location;
    private final String website;
    private final String avatarUrl;
    private final Integer completionScore;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
    private final LocalDateTime lastLoginAt;
    private final LocalDateTime emailVerifiedAt;

    private UserDetailResponse(Long userId, String username, String email, String status,
                              String nickname, String gender, java.time.LocalDate birthday,
                              String bio, String location, String website, String avatarUrl,
                              Integer completionScore, LocalDateTime createdAt, LocalDateTime updatedAt,
                              LocalDateTime lastLoginAt, LocalDateTime emailVerifiedAt) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.status = status;
        this.nickname = nickname;
        this.gender = gender;
        this.birthday = birthday;
        this.bio = bio;
        this.location = location;
        this.website = website;
        this.avatarUrl = avatarUrl;
        this.completionScore = completionScore;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.lastLoginAt = lastLoginAt;
        this.emailVerifiedAt = emailVerifiedAt;
    }

    public static UserDetailResponse fromDto(UserProfileDto profileDto) {
        return new UserDetailResponse(
                profileDto.getUserId(),
                "", // username需要从User实体获取
                "", // email需要从User实体获取
                "ACTIVE", // status需要从User实体获取
                profileDto.getNickname(),
                profileDto.getGender(),
                profileDto.getBirthday(),
                profileDto.getBio(),
                profileDto.getLocation(),
                profileDto.getWebsite(),
                profileDto.getAvatarUrl(),
                profileDto.getCompletionScore(),
                profileDto.getCreatedAt(),
                profileDto.getUpdatedAt(),
                LocalDateTime.now(), // 临时设置
                LocalDateTime.now()  // 临时设置
        );
    }

    @JsonProperty("user_id")
    public Long getUserId() { return userId; }

    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getStatus() { return status; }
    public String getNickname() { return nickname; }
    public String getGender() { return gender; }

    public java.time.LocalDate getBirthday() { return birthday; }
    public String getBio() { return bio; }
    public String getLocation() { return location; }
    public String getWebsite() { return website; }

    @JsonProperty("avatar_url")
    public String getAvatarUrl() { return avatarUrl; }

    @JsonProperty("completion_score")
    public Integer getCompletionScore() { return completionScore; }

    @JsonProperty("created_at")
    public LocalDateTime getCreatedAt() { return createdAt; }

    @JsonProperty("updated_at")
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    @JsonProperty("last_login_at")
    public LocalDateTime getLastLoginAt() { return lastLoginAt; }

    @JsonProperty("email_verified_at")
    public LocalDateTime getEmailVerifiedAt() { return emailVerifiedAt; }
}

// 系统清理响应

// 系统清理响应DTO
// 包含系统清理操作的统计结果信息
public class SystemCleanupResponse {
    private final int expiredRefreshTokens;
    private final int expiredEmailVerifications;
    private final int expiredPasswordResets;
    private final int unlockedLockouts;
    private final String message;
    private final LocalDateTime timestamp;

    public SystemCleanupResponse(int expiredRefreshTokens, int expiredEmailVerifications,
                                int expiredPasswordResets, int unlockedLockouts, String message) {
        this.expiredRefreshTokens = expiredRefreshTokens;
        this.expiredEmailVerifications = expiredEmailVerifications;
        this.expiredPasswordResets = expiredPasswordResets;
        this.unlockedLockouts = unlockedLockouts;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    @JsonProperty("expired_refresh_tokens")
    public int getExpiredRefreshTokens() { return expiredRefreshTokens; }

    @JsonProperty("expired_email_verifications")
    public int getExpiredEmailVerifications() { return expiredEmailVerifications; }

    @JsonProperty("expired_password_resets")
    public int getExpiredPasswordResets() { return expiredPasswordResets; }

    @JsonProperty("unlocked_lockouts")
    public int getUnlockedLockouts() { return unlockedLockouts; }

    public String getMessage() { return message; }
    public LocalDateTime getTimestamp() { return timestamp; }
}