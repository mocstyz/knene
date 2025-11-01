/**
 * ProfileRequests类
 * ProfileRequests相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.interfaces.user.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

// 用户档案更新请求

// 更新用户档案请求DTO
// 包含用户档案的完整更新信息
public class UpdateProfileRequest {

    @Size(max = 50, message = "昵称长度不能超过50个字符")
    @JsonProperty("nickname")
    private String nickname;

    @JsonProperty("gender")
    private String gender; // "MALE", "FEMALE", "OTHER"

    @JsonProperty("birthday")
    private LocalDate birthday;

    @Size(max = 500, message = "个人简介长度不能超过500个字符")
    @JsonProperty("bio")
    private String bio;

    @Size(max = 100, message = "位置信息长度不能超过100个字符")
    @JsonProperty("location")
    private String location;

    @Size(max = 200, message = "网站地址长度不能超过200个字符")
    @JsonProperty("website")
    private String website;

    // getter和setter方法
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public LocalDate getBirthday() { return birthday; }
    public void setBirthday(LocalDate birthday) { this.birthday = birthday; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
}

// 部分更新用户档案请求DTO
// 用于部分更新用户档案信息，只更新非空字段
public class PatchProfileRequest {

    @Size(max = 50, message = "昵称长度不能超过50个字符")
    @JsonProperty("nickname")
    private String nickname;

    @JsonProperty("gender")
    private String gender;

    @JsonProperty("birthday")
    private LocalDate birthday;

    @Size(max = 500, message = "个人简介长度不能超过500个字符")
    @JsonProperty("bio")
    private String bio;

    @Size(max = 100, message = "位置信息长度不能超过100个字符")
    @JsonProperty("location")
    private String location;

    @Size(max = 200, message = "网站地址长度不能超过200个字符")
    @JsonProperty("website")
    private String website;

    // getter和setter方法
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public LocalDate getBirthday() { return birthday; }
    public void setBirthday(LocalDate birthday) { this.birthday = birthday; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
}