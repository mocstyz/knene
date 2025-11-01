/**
 * ProfileResponses类
 * ProfileResponses相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.interfaces.user.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.knene.application.user.dto.UserProfileDto;
import java.time.LocalDate;
import java.time.LocalDateTime;

// 用户档案响应

// 用户档案响应DTO
// 包含完整的用户档案信息
public class UserProfileResponse {
    private final Long userId;
    private final String nickname;
    private final String gender;
    private final LocalDate birthday;
    private final String bio;
    private final String location;
    private final String website;
    private final String avatarUrl;
    private final Integer completionScore;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    // 私有构造器
    private UserProfileResponse(Long userId, String nickname, String gender, LocalDate birthday,
                                String bio, String location, String website, String avatarUrl,
                                Integer completionScore, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.userId = userId;
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
    }

    // 从DTO构建响应对象
    public static UserProfileResponse fromDto(UserProfileDto dto) {
        return new UserProfileResponse(
                dto.getUserId(),
                dto.getNickname(),
                dto.getGender(),
                dto.getBirthday(),
                dto.getBio(),
                dto.getLocation(),
                dto.getWebsite(),
                dto.getAvatarUrl(),
                dto.getCompletionScore(),
                dto.getCreatedAt(),
                dto.getUpdatedAt()
        );
    }

    // getter方法
    @JsonProperty("user_id")
    public Long getUserId() { return userId; }

    public String getNickname() { return nickname; }
    public String getGender() { return gender; }

    public LocalDate getBirthday() { return birthday; }
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
}

// 头像上传响应DTO
// 包含头像上传后的URL和处理结果信息
public class AvatarUploadResponse {
    private final String avatarUrl;
    private final String message;
    private final LocalDateTime timestamp;

    public AvatarUploadResponse(String avatarUrl, String message) {
        this.avatarUrl = avatarUrl;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    @JsonProperty("avatar_url")
    public String getAvatarUrl() { return avatarUrl; }

    public String getMessage() { return message; }

    public LocalDateTime getTimestamp() { return timestamp; }
}