/**
 * UserProfile类
 * UserProfile相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.domain.user.valueobject;

import java.time.LocalDate;

// 性别枚举 - 定义用户的性别类型
public enum Gender {
    MALE("male", "男"),
    FEMALE("female", "女"),
    OTHER("other", "其他"),
    UNKNOWN("unknown", "未知");

    private final String code; // 性别代码
    private final String description; // 性别描述

    // 构造函数 - 初始化性别枚举
    Gender(String code, String description) {
        this.code = code;
        this.description = description;
    }

    // 获取性别代码
    public String getCode() {
        return code;
    }

    // 获取性别描述
    public String getDescription() {
        return description;
    }
}

// 用户档案值对象 - 包含用户的详细扩展信息，不可变对象
public final class UserProfile {

    // 1. 基本个人信息
    private final String nickname; // 昵称
    private final Gender gender; // 性别
    private final LocalDate birthday; // 生日
    private final String bio; // 个人简介
    private final String location; // 所在地
    private final String website; // 个人网站
    private final String company; // 公司
    private final String occupation; // 职业

    // 2. 用户偏好设置（JSON字段）
    private final String preferences; // 用户偏好设置
    private final String timezone; // 时区设置
    private final String language; // 语言设置

    // 3. 审计字段
    private final Long createdBy; // 创建人ID
    private final Long updatedBy; // 更新人ID
    private final Integer version; // 乐观锁版本号
    private final java.time.LocalDateTime createdAt; // 创建时间
    private final java.time.LocalDateTime updatedAt; // 更新时间
    private final java.time.LocalDateTime deletedAt; // 删除时间

    // 私有构造器，使用Builder模式创建
    private UserProfile(Builder builder) {
        this.nickname = builder.nickname;
        this.gender = builder.gender != null ? builder.gender : Gender.UNKNOWN;
        this.birthday = builder.birthday;
        this.bio = builder.bio;
        this.location = builder.location;
        this.website = builder.website;
        this.company = builder.company;
        this.occupation = builder.occupation;
        this.preferences = builder.preferences;
        this.timezone = builder.timezone != null ? builder.timezone : "Asia/Shanghai";
        this.language = builder.language != null ? builder.language : "zh-CN";
        this.createdBy = builder.createdBy;
        this.updatedBy = builder.updatedBy;
        this.version = builder.version != null ? builder.version : 1;
        this.createdAt = builder.createdAt != null ? builder.createdAt : java.time.LocalDateTime.now();
        this.updatedAt = builder.updatedAt != null ? builder.updatedAt : java.time.LocalDateTime.now();
        this.deletedAt = builder.deletedAt;
    }

    // Builder模式
    public static class Builder {
        private String nickname;
        private Gender gender;
        private LocalDate birthday;
        private String bio;
        private String location;
        private String website;
        private String company;
        private String occupation;
        private String preferences;
        private String timezone;
        private String language;
        private Long createdBy;
        private Long updatedBy;
        private Integer version;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime updatedAt;
        private java.time.LocalDateTime deletedAt;

        public Builder nickname(String nickname) {
            this.nickname = nickname;
            return this;
        }

        public Builder gender(Gender gender) {
            this.gender = gender;
            return this;
        }

        public Builder birthday(LocalDate birthday) {
            this.birthday = birthday;
            return this;
        }

        public Builder bio(String bio) {
            this.bio = bio;
            return this;
        }

        public Builder location(String location) {
            this.location = location;
            return this;
        }

        public Builder website(String website) {
            this.website = website;
            return this;
        }

        public Builder company(String company) {
            this.company = company;
            return this;
        }

        public Builder occupation(String occupation) {
            this.occupation = occupation;
            return this;
        }

        public Builder preferences(String preferences) {
            this.preferences = preferences;
            return this;
        }

        public Builder timezone(String timezone) {
            this.timezone = timezone;
            return this;
        }

        public Builder language(String language) {
            this.language = language;
            return this;
        }

        public Builder createdBy(Long createdBy) {
            this.createdBy = createdBy;
            return this;
        }

        public Builder updatedBy(Long updatedBy) {
            this.updatedBy = updatedBy;
            return this;
        }

        public Builder version(Integer version) {
            this.version = version;
            return this;
        }

        public Builder createdAt(java.time.LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder updatedAt(java.time.LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Builder deletedAt(java.time.LocalDateTime deletedAt) {
            this.deletedAt = deletedAt;
            return this;
        }

        public UserProfile build() {
            return new UserProfile(this);
        }
    }

    // 静态工厂方法 - 创建默认档案
    public static UserProfile createDefault(Long createdBy) {
        return new Builder()
                .createdBy(createdBy)
                .build();
    }

    // 业务方法 - 计算年龄
    public Integer calculateAge() {
        if (birthday == null) {
            return null;
        }
        return java.time.Period.between(birthday, LocalDate.now()).getYears();
    }

    // 业务方法 - 判断是否成年
    public boolean isAdult() {
        Integer age = calculateAge();
        return age != null && age >= 18;
    }

    // 业务方法 - 获取显示名称（优先使用昵称）
    public String getDisplayName() {
        return nickname != null && !nickname.trim().isEmpty() ? nickname : "用户";
    }

    // 业务方法 - 验证网站URL格式
    public boolean hasValidWebsite() {
        if (website == null || website.trim().isEmpty()) {
            return false;
        }
        return website.startsWith("http://") || website.startsWith("https://");
    }

    // 业务方法 - 检查档案完整度
    public int getCompletionScore() {
        int score = 0;
        int totalFields = 8; // 总共8个主要字段

        if (nickname != null && !nickname.trim().isEmpty()) score++;
        if (gender != null && gender != Gender.UNKNOWN) score++;
        if (birthday != null) score++;
        if (bio != null && !bio.trim().isEmpty()) score++;
        if (location != null && !location.trim().isEmpty()) score++;
        if (website != null && !website.trim().isEmpty()) score++;
        if (company != null && !company.trim().isEmpty()) score++;
        if (occupation != null && !occupation.trim().isEmpty()) score++;

        return (score * 100) / totalFields;
    }

    // Getter方法
    public String getNickname() {
        return nickname;
    }

    public Gender getGender() {
        return gender;
    }

    public LocalDate getBirthday() {
        return birthday;
    }

    public String getBio() {
        return bio;
    }

    public String getLocation() {
        return location;
    }

    public String getWebsite() {
        return website;
    }

    public String getCompany() {
        return company;
    }

    public String getOccupation() {
        return occupation;
    }

    public String getPreferences() {
        return preferences;
    }

    public String getTimezone() {
        return timezone;
    }

    public String getLanguage() {
        return language;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public Long getUpdatedBy() {
        return updatedBy;
    }

    public Integer getVersion() {
        return version;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public java.time.LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public java.time.LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    // 创建更新后的副本（不可变对象的更新方式）
    public UserProfile withNickname(String newNickname) {
        return new Builder()
                .nickname(newNickname)
                .gender(this.gender)
                .birthday(this.birthday)
                .bio(this.bio)
                .location(this.location)
                .website(this.website)
                .company(this.company)
                .occupation(this.occupation)
                .preferences(this.preferences)
                .timezone(this.timezone)
                .language(this.language)
                .createdBy(this.createdBy)
                .updatedBy(this.updatedBy)
                .version(this.version + 1)
                .createdAt(this.createdAt)
                .updatedAt(java.time.LocalDateTime.now())
                .deletedAt(this.deletedAt)
                .build();
    }

    public UserProfile withGender(Gender newGender) {
        return new Builder()
                .nickname(this.nickname)
                .gender(newGender)
                .birthday(this.birthday)
                .bio(this.bio)
                .location(this.location)
                .website(this.website)
                .company(this.company)
                .occupation(this.occupation)
                .preferences(this.preferences)
                .timezone(this.timezone)
                .language(this.language)
                .createdBy(this.createdBy)
                .updatedBy(this.updatedBy)
                .version(this.version + 1)
                .createdAt(this.createdAt)
                .updatedAt(java.time.LocalDateTime.now())
                .deletedAt(this.deletedAt)
                .build();
    }

    public UserProfile withBirthday(LocalDate newBirthday) {
        return new Builder()
                .nickname(this.nickname)
                .gender(this.gender)
                .birthday(newBirthday)
                .bio(this.bio)
                .location(this.location)
                .website(this.website)
                .company(this.company)
                .occupation(this.occupation)
                .preferences(this.preferences)
                .timezone(this.timezone)
                .language(this.language)
                .createdBy(this.createdBy)
                .updatedBy(this.updatedBy)
                .version(this.version + 1)
                .createdAt(this.createdAt)
                .updatedAt(java.time.LocalDateTime.now())
                .deletedAt(this.deletedAt)
                .build();
    }

    public UserProfile withBio(String newBio) {
        return new Builder()
                .nickname(this.nickname)
                .gender(this.gender)
                .birthday(this.birthday)
                .bio(newBio)
                .location(this.location)
                .website(this.website)
                .company(this.company)
                .occupation(this.occupation)
                .preferences(this.preferences)
                .timezone(this.timezone)
                .language(this.language)
                .createdBy(this.createdBy)
                .updatedBy(this.updatedBy)
                .version(this.version + 1)
                .createdAt(this.createdAt)
                .updatedAt(java.time.LocalDateTime.now())
                .deletedAt(this.deletedAt)
                .build();
    }

    public UserProfile withPreferences(String newPreferences) {
        return new Builder()
                .nickname(this.nickname)
                .gender(this.gender)
                .birthday(this.birthday)
                .bio(this.bio)
                .location(this.location)
                .website(this.website)
                .company(this.company)
                .occupation(this.occupation)
                .preferences(newPreferences)
                .timezone(this.timezone)
                .language(this.language)
                .createdBy(this.createdBy)
                .updatedBy(this.updatedBy)
                .version(this.version + 1)
                .createdAt(this.createdAt)
                .updatedAt(java.time.LocalDateTime.now())
                .deletedAt(this.deletedAt)
                .build();
    }

    @Override
    public String toString() {
        return "UserProfile{" +
                "nickname='" + nickname + '\'' +
                ", gender=" + gender +
                ", birthday=" + birthday +
                ", bio='" + bio + '\'' +
                ", location='" + location + '\'' +
                ", website='" + website + '\'' +
                ", company='" + company + '\'' +
                ", occupation='" + occupation + '\'' +
                ", timezone='" + timezone + '\'' +
                ", language='" + language + '\'' +
                ", completionScore=" + getCompletionScore() +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserProfile that = (UserProfile) o;
        return java.util.Objects.equals(nickname, that.nickname) &&
               java.util.Objects.equals(gender, that.gender) &&
               java.util.Objects.equals(birthday, that.birthday);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(nickname, gender, birthday);
    }
}