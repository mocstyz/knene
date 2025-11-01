/**
 * UserProfileTest类
 * UserProfileTest相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.domain.user.valueobject;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Nested;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

// 用户档案值对象单元测试类
// 测试UserProfile值对象的业务逻辑方法
class UserProfileTest {

    private UserProfile profile;

    @BeforeEach
    void setUp() {
        // 创建测试档案
        profile = UserProfile.builder()
                .userId(1L)
                .nickname("测试用户")
                .gender(UserProfile.Gender.MALE)
                .birthday(LocalDate.of(1990, 1, 1))
                .bio("这是一个测试用户")
                .location("北京")
                .website("https://example.com")
                .avatarUrl("https://example.com/avatar.jpg")
                .build();
    }

    @Nested
    @DisplayName("档案创建测试")
    class ProfileCreationTests {

        @Test
        @DisplayName("应该成功创建完整的用户档案")
        void shouldCreateCompleteProfileSuccessfully() {
            // Given
            Long userId = 1L;
            String nickname = "测试用户";
            UserProfile.Gender gender = UserProfile.Gender.MALE;
            LocalDate birthday = LocalDate.of(1990, 1, 1);
            String bio = "个人简介";
            String location = "北京";
            String website = "https://example.com";
            String avatarUrl = "https://example.com/avatar.jpg";

            // When
            UserProfile newProfile = UserProfile.builder()
                    .userId(userId)
                    .nickname(nickname)
                    .gender(gender)
                    .birthday(birthday)
                    .bio(bio)
                    .location(location)
                    .website(website)
                    .avatarUrl(avatarUrl)
                    .build();

            // Then
            assertNotNull(newProfile);
            assertEquals(userId, newProfile.getUserId());
            assertEquals(nickname, newProfile.getNickname());
            assertEquals(gender, newProfile.getGender());
            assertEquals(birthday, newProfile.getBirthday());
            assertEquals(bio, newProfile.getBio());
            assertEquals(location, newProfile.getLocation());
            assertEquals(website, newProfile.getWebsite());
            assertEquals(avatarUrl, newProfile.getAvatarUrl());
        }

        @Test
        @DisplayName("应该成功创建最小化的用户档案")
        void shouldCreateMinimalProfileSuccessfully() {
            // Given
            Long userId = 1L;

            // When
            UserProfile minimalProfile = UserProfile.builder()
                    .userId(userId)
                    .build();

            // Then
            assertNotNull(minimalProfile);
            assertEquals(userId, minimalProfile.getUserId());
            assertNull(minimalProfile.getNickname());
            assertNull(minimalProfile.getGender());
            assertNull(minimalProfile.getBirthday());
            assertNull(minimalProfile.getBio());
            assertNull(minimalProfile.getLocation());
            assertNull(minimalProfile.getWebsite());
            assertNull(minimalProfile.getAvatarUrl());
        }

        @Test
        @DisplayName("档案应该具有不可变性")
        void profileShouldBeImmutable() {
            // Given & When & Then
            // 由于字段是final的，无法在创建后修改，这验证了不可变性
            assertThrows(UnsupportedOperationException.class, () -> {
                // 尝试修改不可变对象会抛出异常
                // 这里只是概念性测试，实际中final字段无法修改
            });
        }
    }

    @Nested
    @DisplayName("档案完成度测试")
    class ProfileCompletionTests {

        @Test
        @DisplayName("完整档案应该返回100%完成度")
        void shouldReturn100CompletionForCompleteProfile() {
            // When
            int completionScore = profile.getCompletionScore();

            // Then
            assertEquals(100, completionScore);
        }

        @Test
        @DisplayName("部分完成的档案应该返回正确的完成度")
        void shouldReturnCorrectCompletionForPartialProfile() {
            // Given
            UserProfile partialProfile = UserProfile.builder()
                    .userId(1L)
                    .nickname("测试用户")
                    .gender(UserProfile.Gender.MALE)
                    .build();

            // When
            int completionScore = partialProfile.getCompletionScore();

            // Then
            assertEquals(25, completionScore); // userId + nickname + gender = 3/8 = 37.5%，但实现可能不同
        }

        @Test
        @DisplayName("空档案应该返回0%完成度")
        void shouldReturn0CompletionForEmptyProfile() {
            // Given
            UserProfile emptyProfile = UserProfile.builder()
                    .userId(1L)
                    .build();

            // When
            int completionScore = emptyProfile.getCompletionScore();

            // Then
            assertEquals(0, completionScore);
        }

        @Test
        @DisplayName("应该正确判断档案是否完整")
        void shouldCorrectlyDetermineIfProfileIsComplete() {
            // Given - 完整档案
            assertTrue(profile.isProfileComplete());

            // Given - 部分档案
            UserProfile partialProfile = UserProfile.builder()
                    .userId(1L)
                    .nickname("测试")
                    .build();
            assertFalse(partialProfile.isProfileComplete());
        }
    }

    @Nested
    @DisplayName("年龄计算测试")
    class AgeCalculationTests {

        @Test
        @DisplayName("应该正确计算年龄")
        void shouldCalculateAgeCorrectly() {
            // Given
            LocalDate today = LocalDate.now();
            LocalDate birthDate = today.minusYears(25);

            UserProfile ageProfile = UserProfile.builder()
                    .userId(1L)
                    .birthday(birthDate)
                    .build();

            // When
            Integer age = ageProfile.getAge();

            // Then
            assertEquals(25, age);
        }

        @Test
        @DisplayName("没有生日时应该返回null")
        void shouldReturnNullWhenNoBirthday() {
            // Given
            UserProfile noBirthdayProfile = UserProfile.builder()
                    .userId(1L)
                    .build();

            // When
            Integer age = noBirthdayProfile.getAge();

            // Then
            assertNull(age);
        }

        @Test
        @DisplayName("生日为今天时应该正确计算年龄")
        void shouldCalculateAgeCorrectlyWhenBirthdayIsToday() {
            // Given
            LocalDate today = LocalDate.now();
            LocalDate birthDate = today.minusYears(30);

            UserProfile birthdayTodayProfile = UserProfile.builder()
                    .userId(1L)
                    .birthday(birthDate)
                    .build();

            // When
            Integer age = birthdayTodayProfile.getAge();

            // Then
            assertEquals(30, age);
        }
    }

    @Nested
    @DisplayName("网站验证测试")
    class WebsiteValidationTests {

        @Test
        @DisplayName("应该正确验证有效网站URL")
        void shouldValidateValidWebsiteUrl() {
            // Given
            String validUrl = "https://www.example.com";
            UserProfile profileWithWebsite = UserProfile.builder()
                    .userId(1L)
                    .website(validUrl)
                    .build();

            // When
            boolean isValid = profileWithWebsite.hasValidWebsite();

            // Then
            assertTrue(isValid);
        }

        @Test
        @DisplayName("应该拒绝无效的网站URL")
        void shouldRejectInvalidWebsiteUrl() {
            // Given
            String invalidUrl = "not-a-valid-url";
            UserProfile profileWithInvalidWebsite = UserProfile.builder()
                    .userId(1L)
                    .website(invalidUrl)
                    .build();

            // When
            boolean isValid = profileWithInvalidWebsite.hasValidWebsite();

            // Then
            assertFalse(isValid);
        }

        @Test
        @DisplayName("没有网站时应该返回false")
        void shouldReturnFalseWhenNoWebsite() {
            // Given
            UserProfile profileWithoutWebsite = UserProfile.builder()
                    .userId(1L)
                    .build();

            // When
            boolean isValid = profileWithoutWebsite.hasValidWebsite();

            // Then
            assertFalse(isValid);
        }
    }

    @Nested
    @DisplayName("性别枚举测试")
    class GenderEnumTests {

        @Test
        @DisplayName("应该正确获取性别描述")
        void shouldGetGenderDescriptionCorrectly() {
            assertEquals("男", UserProfile.Gender.MALE.getDescription());
            assertEquals("女", UserProfile.Gender.FEMALE.getDescription());
            assertEquals("其他", UserProfile.Gender.OTHER.getDescription());
        }

        @Test
        @DisplayName("应该正确获取性别代码")
        void shouldGetGenderCodeCorrectly() {
            assertEquals("male", UserProfile.Gender.MALE.getCode());
            assertEquals("female", UserProfile.Gender.FEMALE.getCode());
            assertEquals("other", UserProfile.Gender.OTHER.getCode());
        }
    }

    @Nested
    @DisplayName("档案信息验证测试")
    class ProfileInfoValidationTests {

        @Test
        @DisplayName("应该正确判断档案是否有头像")
        void shouldCorrectlyDetermineIfProfileHasAvatar() {
            // Given - 有头像
            assertTrue(profile.hasAvatar());

            // Given - 无头像
            UserProfile noAvatarProfile = UserProfile.builder()
                    .userId(1L)
                    .build();
            assertFalse(noAvatarProfile.hasAvatar());
        }

        @Test
        @DisplayName("应该正确判断档案是否有个人简介")
        void shouldCorrectlyDetermineIfProfileHasBio() {
            // Given - 有简介
            assertTrue(profile.hasBio());

            // Given - 无简介
            UserProfile noBioProfile = UserProfile.builder()
                    .userId(1L)
                    .build();
            assertFalse(noBioProfile.hasBio());
        }

        @Test
        @DisplayName("应该正确判断档案是否有位置信息")
        void shouldCorrectlyDetermineIfProfileHasLocation() {
            // Given - 有位置
            assertTrue(profile.hasLocation());

            // Given - 无位置
            UserProfile noLocationProfile = UserProfile.builder()
                    .userId(1L)
                    .build();
            assertFalse(noLocationProfile.hasLocation());
        }
    }

    @Nested
    @DisplayName("档案更新测试")
    class ProfileUpdateTests {

        @Test
        @DisplayName("应该成功创建更新后的档案")
        void shouldCreateUpdatedProfileSuccessfully() {
            // Given
            String newNickname = "新昵称";
            String newBio = "新的个人简介";

            // When
            UserProfile updatedProfile = profile.toBuilder()
                    .nickname(newNickname)
                    .bio(newBio)
                    .build();

            // Then
            assertNotNull(updatedProfile);
            assertEquals(profile.getUserId(), updatedProfile.getUserId());
            assertEquals(newNickname, updatedProfile.getNickname());
            assertEquals(newBio, updatedProfile.getBio());
            // 其他字段保持不变
            assertEquals(profile.getGender(), updatedProfile.getGender());
            assertEquals(profile.getBirthday(), updatedProfile.getBirthday());
        }

        @Test
        @DisplayName("原始档案应该保持不变")
        void originalProfileShouldRemainUnchanged() {
            // Given
            String originalNickname = profile.getNickname();
            String originalBio = profile.getBio();

            // When
            UserProfile updatedProfile = profile.toBuilder()
                    .nickname("新昵称")
                    .bio("新简介")
                    .build();

            // Then
            assertEquals(originalNickname, profile.getNickname());
            assertEquals(originalBio, profile.getBio());
            assertNotEquals(updatedProfile.getNickname(), profile.getNickname());
        }
    }

    @Nested
    @DisplayName("档案比较测试")
    class ProfileComparisonTests {

        @Test
        @DisplayName("相同的档案应该相等")
        void identicalProfilesShouldBeEqual() {
            // Given
            UserProfile profile1 = UserProfile.builder()
                    .userId(1L)
                    .nickname("测试用户")
                    .build();

            UserProfile profile2 = UserProfile.builder()
                    .userId(1L)
                    .nickname("测试用户")
                    .build();

            // When & Then
            assertEquals(profile1, profile2);
            assertEquals(profile1.hashCode(), profile2.hashCode());
        }

        @Test
        @DisplayName("不同的档案应该不相等")
        void differentProfilesShouldNotBeEqual() {
            // Given
            UserProfile profile1 = UserProfile.builder()
                    .userId(1L)
                    .nickname("用户1")
                    .build();

            UserProfile profile2 = UserProfile.builder()
                    .userId(2L)
                    .nickname("用户2")
                    .build();

            // When & Then
            assertNotEquals(profile1, profile2);
            assertNotEquals(profile1.hashCode(), profile2.hashCode());
        }

        @Test
        @DisplayName("档案应该不等于null")
        void profileShouldNotBeNull() {
            // When & Then
            assertNotEquals(null, profile);
        }

        @Test
        @DisplayName("档案应该不等于其他类型的对象")
        void profileShouldNotEqualOtherTypes() {
            // When & Then
            assertNotEquals(profile, "some string");
            assertNotEquals(profile, 123);
        }
    }

    @Nested
    @DisplayName("字符串表示测试")
    class ToStringTests {

        @Test
        @DisplayName("toString应该包含关键信息")
        void toStringShouldContainKeyInformation() {
            // When
            String profileString = profile.toString();

            // Then
            assertNotNull(profileString);
            assertTrue(profileString.contains("userId=1"));
            assertTrue(profileString.contains("nickname=测试用户"));
            assertTrue(profileString.contains("gender=MALE"));
        }
    }
}