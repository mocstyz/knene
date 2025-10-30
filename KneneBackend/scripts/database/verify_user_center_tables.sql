-- ====================================================================
-- 用户中心表结构和数据完整性验证脚本
-- ====================================================================
-- 版本：V2.1.5
-- 描述：验证用户中心相关表的创建情况和数据完整性
-- 作者：数据库团队
-- 日期：2025-10-30
-- ====================================================================

-- 设置SQL模式
SET NAMES utf8mb4;

SELECT '=== 用户中心表验证开始 ===' as verification_status;

-- ====================================================================
-- 1. 验证表是否创建成功
-- ====================================================================

SELECT '1. 检查用户中心相关表是否存在...' as check_step;

SELECT
    TABLE_NAME as table_name,
    TABLE_COMMENT as table_description,
    TABLE_ROWS as estimated_rows,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as size_mb
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME IN (
        'user_profiles_detailed', 'user_settings',
        'download_history', 'browse_history', 'search_history',
        'favorites', 'favorite_folders', 'favorite_folder_relations', 'favorite_shares',
        'user_comments', 'comment_interactions', 'comment_reports',
        'user_activities', 'user_achievements', 'user_notifications'
    )
ORDER BY TABLE_NAME;

-- ====================================================================
-- 2. 验证用户详细资料表
-- ====================================================================

SELECT '2. 验证用户详细资料表数据...' as check_step;

SELECT
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN real_name IS NOT NULL AND real_name != '' THEN 1 END) as with_real_name,
    COUNT(CASE WHEN gender IS NOT NULL THEN 1 END) as with_gender,
    COUNT(CASE WHEN birth_date IS NOT NULL THEN 1 END) as with_birth_date,
    COUNT(CASE WHEN phone_number IS NOT NULL AND phone_number != '' THEN 1 END) as with_phone,
    COUNT(CASE WHEN address IS NOT NULL AND address != '' THEN 1 END) as with_address,
    COUNT(CASE WHEN is_verified = TRUE THEN 1 END) as verified_users,
    COUNT(CASE WHEN verification_status = 'pending' THEN 1 END) as pending_verification,
    COUNT(CASE WHEN privacy_level = 1 THEN 1 END) as public_profiles,
    COUNT(CASE WHEN privacy_level = 3 THEN 1 END) as private_profiles,
    AVG(profile_completion_score) as avg_completion_score,
    MAX(profile_completion_score) as max_completion_score,
    MIN(profile_completion_score) as min_completion_score,
    COUNT(CASE WHEN profile_completion_score >= 80 THEN 1 END) as high_completion_profiles,
    COUNT(CASE WHEN profile_completion_score < 30 THEN 1 END) as low_completion_profiles
FROM user_profiles_detailed;

-- 检查资料完整度分布
SELECT
    CASE
        WHEN profile_completion_score >= 90 THEN '90-100%'
        WHEN profile_completion_score >= 70 THEN '70-89%'
        WHEN profile_completion_score >= 50 THEN '50-69%'
        WHEN profile_completion_score >= 30 THEN '30-49%'
        ELSE '0-29%'
    END as completion_range,
    COUNT(*) as profile_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM user_profiles_detailed), 2) as percentage
FROM user_profiles_detailed
WHERE deleted_at IS NULL
GROUP BY
    CASE
        WHEN profile_completion_score >= 90 THEN '90-100%'
        WHEN profile_completion_score >= 70 THEN '70-89%'
        WHEN profile_completion_score >= 50 THEN '50-69%'
        WHEN profile_completion_score >= 30 THEN '30-49%'
        ELSE '0-29%'
    END
ORDER BY profile_completion_score DESC;

-- 检查年龄分布
SELECT
    CASE
        WHEN age < 18 THEN 'Under 18'
        WHEN age < 25 THEN '18-24'
        WHEN age < 35 THEN '25-34'
        WHEN age < 45 THEN '35-44'
        WHEN age < 55 THEN '45-54'
        ELSE '55+'
    END as age_group,
    COUNT(*) as user_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM user_profiles_detailed WHERE age IS NOT NULL), 2) as percentage
FROM user_profiles_detailed
WHERE age IS NOT NULL AND deleted_at IS NULL
GROUP BY
    CASE
        WHEN age < 18 THEN 'Under 18'
        WHEN age < 25 THEN '18-24'
        WHEN age < 35 THEN '25-34'
        WHEN age < 45 THEN '35-44'
        WHEN age < 55 THEN '45-54'
        ELSE '55+'
    END
ORDER BY age_group;

-- ====================================================================
-- 3. 验证用户设置表
-- ====================================================================

SELECT '3. 验证用户设置表数据...' as check_step;

SELECT
    COUNT(*) as total_settings,
    COUNT(CASE WHEN theme = 'dark' THEN 1 END) as dark_theme_users,
    COUNT(CASE WHEN theme = 'light' THEN 1 END) as light_theme_users,
    COUNT(CASE WHEN language = 'zh-CN' THEN 1 END) as chinese_users,
    COUNT(CASE WHEN language = 'en-US' THEN 1 END) as english_users,
    COUNT(CASE WHEN email_notifications = TRUE THEN 1 END) as email_enabled_users,
    COUNT(CASE WHEN sms_notifications = TRUE THEN 1 END) as sms_enabled_users,
    COUNT(CASE WHEN push_notifications = TRUE THEN 1 END) as push_enabled_users,
    COUNT(CASE WHEN auto_play_video = TRUE THEN 1 END) as auto_play_users,
    COUNT(CASE WHEN video_quality = '4k' THEN 1 END) as four_k_users,
    COUNT(CASE WHEN video_quality = '1080p' THEN 1 END) as full_hd_users,
    COUNT(CASE WHEN download_quality = '1080p' THEN 1 END) as hd_download_users,
    AVG(playback_speed) as avg_playback_speed,
    AVG(volume_level) as avg_volume_level
FROM user_settings;

-- 检查视频质量偏好分布
SELECT
    video_quality,
    COUNT(*) as user_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM user_settings), 2) as percentage
FROM user_settings
WHERE deleted_at IS NULL
GROUP BY video_quality
ORDER BY user_count DESC;

-- ====================================================================
-- 4. 验证下载历史表
-- ====================================================================

SELECT '4. 验证下载历史表数据...' as check_step;

SELECT
    COUNT(*) as total_downloads,
    COUNT(CASE WHEN download_status = 'completed' THEN 1 END) as completed_downloads,
    COUNT(CASE WHEN download_status = 'in_progress' THEN 1 END) as in_progress_downloads,
    COUNT(CASE WHEN download_status = 'failed' THEN 1 END) as failed_downloads,
    COUNT(CASE WHEN download_status = 'paused' THEN 1 END) as paused_downloads,
    COUNT(CASE WHEN download_type = 'direct' THEN 1 END) as direct_downloads,
    COUNT(CASE WHEN download_type = 'torrent' THEN 1 END) as torrent_downloads,
    COUNT(CASE WHEN download_type = 'magnet' THEN 1 END) as magnet_downloads,
    AVG(progress_percentage) as avg_progress,
    COUNT(CASE WHEN progress_percentage = 100 THEN 1 END) as fully_completed,
    AVG(CASE WHEN download_status = 'completed'
        AND file_size_bytes > 0
        AND completed_at IS NOT NULL
        AND started_at IS NOT NULL
        THEN TIMESTAMPDIFF(SECOND, started_at, completed_at)
        ELSE NULL END) as avg_download_time_seconds,
    MAX(CASE WHEN download_speed > 0 THEN download_speed ELSE 0 END) as max_download_speed,
    AVG(CASE WHEN download_speed > 0 THEN download_speed ELSE NULL END) as avg_download_speed
FROM download_history;

-- 检查下载状态趋势（最近7天）
SELECT
    DATE(created_at) as download_date,
    COUNT(*) as daily_downloads,
    COUNT(CASE WHEN download_status = 'completed' THEN 1 END) as completed_count,
    COUNT(CASE WHEN download_status = 'failed' THEN 1 END) as failed_count,
    ROUND(COUNT(CASE WHEN download_status = 'completed' THEN 1 END) * 100.0 / COUNT(*), 2) as success_rate
FROM download_history
WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
    AND deleted_at IS NULL
GROUP BY DATE(created_at)
ORDER BY download_date DESC;

-- 检查下载失败原因分析
SELECT
    error_message,
    COUNT(*) as error_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM download_history WHERE download_status = 'failed'), 2) as error_percentage
FROM download_history
WHERE download_status = 'failed'
    AND error_message IS NOT NULL
    AND deleted_at IS NULL
GROUP BY error_message
ORDER BY error_count DESC
LIMIT 10;

-- ====================================================================
-- 5. 验证浏览历史表
-- ====================================================================

SELECT '5. 验证浏览历史表数据...' as check_step;

SELECT
    COUNT(*) as total_browses,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(CASE WHEN resource_id IS NOT NULL THEN 1 END) as resource_views,
    COUNT(CASE WHEN is_mobile = TRUE THEN 1 END) as mobile_views,
    COUNT(CASE WHEN is_mobile = FALSE THEN 1 END) as desktop_views,
    COUNT(CASE WHEN is_bounce = TRUE THEN 1 END) as bounce_views,
    ROUND(AVG(duration_seconds), 2) as avg_duration_seconds,
    ROUND(AVG(scroll_percentage), 2) as avg_scroll_percentage,
    ROUND(AVG(engagement_score), 2) as avg_engagement_score,
    COUNT(CASE WHEN engagement_score >= 80 THEN 1 END) as high_engagement_views,
    COUNT(CASE WHEN engagement_score < 20 THEN 1 END) as low_engagement_views
FROM browse_history;

-- 检查浏览类型分布
SELECT
    browse_type,
    COUNT(*) as view_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM browse_history), 2) as percentage,
    ROUND(AVG(duration_seconds), 2) as avg_duration_seconds
FROM browse_history
WHERE deleted_at IS NULL
GROUP BY browse_type
ORDER BY view_count DESC;

-- 检查设备类型分布
SELECT
    device_type,
    COUNT(*) as view_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM browse_history), 2) as percentage,
    ROUND(AVG(engagement_score), 2) as avg_engagement_score
FROM browse_history
WHERE device_type IS NOT NULL AND deleted_at IS NULL
GROUP BY device_type
ORDER BY view_count DESC;

-- 检查入口点分析
SELECT
    entry_point,
    COUNT(*) as view_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM browse_history WHERE entry_point IS NOT NULL), 2) as percentage,
    COUNT(CASE WHEN is_bounce = TRUE THEN 1 END) as bounce_count,
    ROUND(COUNT(CASE WHEN is_bounce = TRUE THEN 1 END) * 100.0 / COUNT(*), 2) as bounce_rate
FROM browse_history
WHERE entry_point IS NOT NULL AND deleted_at IS NULL
GROUP BY entry_point
ORDER BY view_count DESC;

-- ====================================================================
-- 6. 验证搜索历史表
-- ====================================================================

SELECT '6. 验证搜索历史表数据...' as check_step;

SELECT
    COUNT(*) as total_searches,
    COUNT(DISTINCT user_id) as unique_searchers,
    COUNT(DISTINCT search_query) as unique_queries,
    COUNT(CASE WHEN search_type = 'quick' THEN 1 END) as quick_searches,
    COUNT(CASE WHEN search_type = 'advanced' THEN 1 END) as advanced_searches,
    COUNT(CASE WHEN search_type = 'voice' THEN 1 END) as voice_searches,
    COUNT(CASE WHERE results_count > 0 THEN 1 END) as searches_with_results,
    COUNT(CASE WHERE clicked_result_id IS NOT NULL THEN 1 END) as searches_with_clicks,
    AVG(results_count) as avg_results_count,
    ROUND(AVG(engagement_score), 2) as avg_search_engagement
FROM search_history;

-- 检查热门搜索词
SELECT
    search_query,
    COUNT(*) as search_count,
    COUNT(DISTINCT user_id) as unique_searchers,
    COUNT(CASE WHERE clicked_result_id IS NOT NULL THEN 1 END) as click_count,
    ROUND(COUNT(CASE WHERE clicked_result_id IS NOT NULL THEN 1 END) * 100.0 / COUNT(*), 2) as click_rate
FROM search_history
WHERE search_query IS NOT NULL
    AND search_query != ''
    AND deleted_at IS NULL
GROUP BY search_query
ORDER BY search_count DESC
LIMIT 20;

-- ====================================================================
-- 7. 验证收藏相关表
-- ====================================================================

SELECT '7. 验证收藏相关表数据...' as check_step;

-- 收藏表统计
SELECT
    COUNT(*) as total_favorites,
    COUNT(DISTINCT user_id) as users_with_favorites,
    COUNT(DISTINCT resource_id) as favorited_resources,
    COUNT(CASE WHEN favorite_type = 'movie' THEN 1 END) as movie_favorites,
    COUNT(CASE WHEN favorite_type = 'tv' THEN 1 END) as tv_favorites,
    COUNT(CASE WHEN favorite_type = 'anime' THEN 1 END) as anime_favorites,
    COUNT(CASE WHEN favorite_type = 'documentary' THEN 1 END) as documentary_favorites,
    COUNT(CASE WHEN is_public = TRUE THEN 1 END) as public_favorites,
    COUNT(CASE WHERE rating IS NOT NULL THEN 1 END) as rated_favorites,
    AVG(CASE WHEN rating IS NOT NULL THEN rating ELSE NULL END) as avg_rating
FROM favorites;

-- 收藏夹表统计
SELECT
    COUNT(*) as total_folders,
    COUNT(DISTINCT user_id) as users_with_folders,
    COUNT(CASE WHEN is_public = TRUE THEN 1 END) as public_folders,
    COUNT(CASE WHEN is_default = TRUE THEN 1 END) as default_folders,
    AVG(item_count) as avg_items_per_folder,
    MAX(item_count) as max_items_in_folder
FROM favorite_folders;

-- 收藏分享表统计
SELECT
    COUNT(*) as total_shares,
    COUNT(DISTINCT user_id) as users_who_shared,
    COUNT(CASE WHEN share_type = 'favorite' THEN 1 END) as favorite_shares,
    COUNT(CASE WHEN share_type = 'folder' THEN 1 END) as folder_shares,
    COUNT(CASE WHEN access_permission = 'public' THEN 1 END) as public_shares,
    COUNT(CASE WHEN access_permission = 'password' THEN 1 END) as password_shares,
    COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_shares,
    SUM(current_views) as total_views,
    SUM(current_downloads) as total_downloads
FROM favorite_shares;

-- 检查收藏活跃度（最近30天）
SELECT
    DATE(created_at) as favorite_date,
    COUNT(*) as daily_favorites,
    COUNT(DISTINCT user_id) as active_users
FROM favorites
WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
    AND deleted_at IS NULL
GROUP BY DATE(created_at)
ORDER BY favorite_date DESC
LIMIT 7;

-- ====================================================================
-- 8. 验证评论相关表
-- ====================================================================

SELECT '8. 验证评论相关表数据...' as check_step;

-- 用户评论表统计
SELECT
    COUNT(*) as total_comments,
    COUNT(DISTINCT user_id) as users_who_commented,
    COUNT(DISTINCT resource_id) as commented_resources,
    COUNT(CASE WHEN comment_type = 'review' THEN 1 END) as reviews,
    COUNT(CASE WHEN comment_type = 'discussion' THEN 1 END) as discussions,
    COUNT(CASE WHEN parent_comment_id IS NULL THEN 1 END) as main_comments,
    COUNT(CASE WHEN parent_comment_id IS NOT NULL THEN 1 END) as replies,
    COUNT(CASE WHERE rating IS NOT NULL THEN 1 END) as rated_comments,
    AVG(CASE WHEN rating IS NOT NULL THEN rating ELSE NULL END) as avg_rating,
    COUNT(CASE WHERE like_count > 0 THEN 1 END) as liked_comments,
    AVG(like_count) as avg_likes_per_comment
FROM user_comments;

-- 评论互动表统计
SELECT
    COUNT(*) as total_interactions,
    COUNT(CASE WHEN interaction_type = 'like' THEN 1 END) as likes,
    COUNT(CASE WHEN interaction_type = 'dislike' THEN 1 END) as dislikes,
    COUNT(CASE WHEN interaction_type = 'reply' THEN 1 END) as reply_interactions,
    COUNT(DISTINCT user_id) as users_who_interacted,
    COUNT(DISTINCT comment_id) as commented_on
FROM comment_interactions;

-- 评论举报表统计
SELECT
    COUNT(*) as total_reports,
    COUNT(CASE WHEN report_status = 'pending' THEN 1 END) as pending_reports,
    COUNT(CASE WHEN report_status = 'processing' THEN 1 END) as processing_reports,
    COUNT(CASE WHEN report_status = 'resolved' THEN 1 END) as resolved_reports,
    COUNT(CASE WHEN report_status = 'dismissed' THEN 1 END) as dismissed_reports,
    COUNT(DISTINCT reporter_id) as unique_reporters,
    COUNT(DISTINCT reported_user_id) as reported_users
FROM comment_reports;

-- 检查评论质量分析
SELECT
    CASE
        WHEN LENGTH(content) < 20 THEN 'Very Short (<20 chars)'
        WHEN LENGTH(content) < 50 THEN 'Short (20-49 chars)'
        WHEN LENGTH(content) < 100 THEN 'Medium (50-99 chars)'
        WHEN LENGTH(content) < 200 THEN 'Long (100-199 chars)'
        ELSE 'Very Long (200+ chars)'
    END as content_length_category,
    COUNT(*) as comment_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM user_comments), 2) as percentage,
    AVG(like_count) as avg_likes
FROM user_comments
WHERE deleted_at IS NULL
GROUP BY
    CASE
        WHEN LENGTH(content) < 20 THEN 'Very Short (<20 chars)'
        WHEN LENGTH(content) < 50 THEN 'Short (20-49 chars)'
        WHEN LENGTH(content) < 100 THEN 'Medium (50-99 chars)'
        WHEN LENGTH(content) < 200 THEN 'Long (100-199 chars)'
        ELSE 'Very Long (200+ chars)'
    END
ORDER BY comment_count DESC;

-- ====================================================================
-- 9. 验证用户活动表
-- ====================================================================

SELECT '9. 验证用户活动表数据...' as check_step;

SELECT
    COUNT(*) as total_activities,
    COUNT(DISTINCT user_id) as active_users,
    COUNT(CASE WHEN activity_type = 'login' THEN 1 END) as login_activities,
    COUNT(CASE WHEN activity_type = 'download' THEN 1 END) as download_activities,
    COUNT(CASE WHEN activity_type = 'browse' THEN 1 END) as browse_activities,
    COUNT(CASE WHEN activity_type = 'comment' THEN 1 END) as comment_activities,
    COUNT(CASE WHEN activity_type = 'favorite' THEN 1 END) as favorite_activities,
    COUNT(CASE WHEN activity_type = 'share' THEN 1 END) as share_activities,
    COUNT(CASE WHEN is_mobile = TRUE THEN 1 END) as mobile_activities,
    COUNT(CASE WHEN is_mobile = FALSE THEN 1 END) as desktop_activities
FROM user_activities;

-- 检查每日活跃用户趋势（最近7天）
SELECT
    DATE(created_at) as activity_date,
    COUNT(*) as total_activities,
    COUNT(DISTINCT user_id) as daily_active_users,
    COUNT(CASE WHEN activity_type = 'login' THEN 1 END) as logins,
    COUNT(CASE WHEN activity_type = 'download' THEN 1 END) as downloads
FROM user_activities
WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
    AND deleted_at IS NULL
GROUP BY DATE(created_at)
ORDER BY activity_date DESC;

-- ====================================================================
-- 10. 验证用户成就表
-- ====================================================================

SELECT '10. 验证用户成就表数据...' as check_step;

SELECT
    COUNT(*) as total_achievements,
    COUNT(DISTINCT user_id) as users_with_achievements,
    COUNT(DISTINCT achievement_id) as unique_achievements,
    COUNT(CASE WHEN achievement_type = 'download' THEN 1 END) as download_achievements,
    COUNT(CASE WHEN achievement_type = 'browse' THEN 1 END) as browse_achievements,
    COUNT(CASE WHEN achievement_type = 'social' THEN 1 END) as social_achievements,
    COUNT(CASE WHEN achievement_type = 'contribution' THEN 1 END) as contribution_achievements,
    COUNT(CASE WHEN is_completed = TRUE THEN 1 END) as completed_achievements,
    AVG(CASE WHEN progress_percentage IS NOT NULL THEN progress_percentage ELSE NULL END) as avg_progress
FROM user_achievements;

-- ====================================================================
-- 11. 验证用户通知表
-- ====================================================================

SELECT '11. 验证用户通知表数据...' as check_step;

SELECT
    COUNT(*) as total_notifications,
    COUNT(DISTINCT user_id) as notified_users,
    COUNT(CASE WHEN notification_type = 'system' THEN 1 END) as system_notifications,
    COUNT(CASE WHEN notification_type = 'download' THEN 1 END) as download_notifications,
    COUNT(CASE WHEN notification_type = 'comment' THEN 1 END) as comment_notifications,
    COUNT(CASE WHEN notification_type = 'favorite' THEN 1 END) as favorite_notifications,
    COUNT(CASE WHEN is_read = TRUE THEN 1 END) as read_notifications,
    COUNT(CASE WHEN is_read = FALSE THEN 1 END) as unread_notifications,
    COUNT(CASE WHEN is_sent = TRUE THEN 1 END) as sent_notifications,
    COUNT(CASE WHEN is_sent = FALSE THEN 1 END) as pending_notifications
FROM user_notifications;

-- 检查未读通知统计
SELECT
    user_id,
    COUNT(*) as unread_count
FROM user_notifications
WHERE is_read = FALSE AND deleted_at IS NULL
GROUP BY user_id
HAVING COUNT(*) > 10
ORDER BY unread_count DESC
LIMIT 10;

-- ====================================================================
-- 12. 数据一致性检查
-- ====================================================================

SELECT '12. 执行数据一致性检查...' as check_step;

-- 检查用户详细资料与用户表的一致性
SELECT
    'User profiles consistency check' as check_name,
    COUNT(*) as orphaned_profiles
FROM user_profiles_detailed upd
LEFT JOIN users u ON upd.user_id = u.id
WHERE u.id IS NULL AND upd.deleted_at IS NULL;

-- 检查用户设置与用户表的一致性
SELECT
    'User settings consistency check' as check_name,
    COUNT(*) as orphaned_settings
FROM user_settings us
LEFT JOIN users u ON us.user_id = u.id
WHERE u.id IS NULL AND us.deleted_at IS NULL;

-- 检查下载历史与用户表的一致性
SELECT
    'Download history consistency check' as check_name,
    COUNT(*) as orphaned_downloads
FROM download_history dh
LEFT JOIN users u ON dh.user_id = u.id
WHERE u.id IS NULL AND dh.deleted_at IS NULL;

-- 检查收藏与用户表的一致性
SELECT
    'Favorites consistency check' as check_name,
    COUNT(*) as orphaned_favorites
FROM favorites f
LEFT JOIN users u ON f.user_id = u.id
WHERE u.id IS NULL AND f.deleted_at IS NULL;

-- 检查评论与用户表的一致性
SELECT
    'Comments consistency check' as check_name,
    COUNT(*) as orphaned_comments
FROM user_comments uc
LEFT JOIN users u ON uc.user_id = u.id
WHERE u.id IS NULL AND uc.deleted_at IS NULL;

-- ====================================================================
-- 13. 业务逻辑验证
-- ====================================================================

SELECT '13. 执行业务逻辑验证...' as check_step;

-- 检查资料完整度评分是否合理
SELECT
    'Profile completion score validation' as validation_name,
    COUNT(*) as invalid_scores
FROM user_profiles_detailed
WHERE (profile_completion_score < 0 OR profile_completion_score > 100)
    AND deleted_at IS NULL;

-- 检查下载进度是否合理
SELECT
    'Download progress validation' as validation_name,
    COUNT(*) as invalid_progress
FROM download_history
WHERE (progress_percentage < 0 OR progress_percentage > 100)
    AND deleted_at IS NULL;

-- 检查评分范围是否合理
SELECT
    'Rating range validation' as validation_name,
    COUNT(*) as invalid_ratings
FROM favorites
WHERE (rating < 1 OR rating > 10)
    AND rating IS NOT NULL
    AND deleted_at IS NULL;

-- 检查浏览时长是否合理
SELECT
    'Browse duration validation' as validation_name,
    COUNT(*) as suspicious_durations
FROM browse_history
WHERE duration_seconds > 86400  -- 超过24小时
    AND deleted_at IS NULL;

-- 检查重复收藏
SELECT
    'Duplicate favorites validation' as validation_name,
    COUNT(*) as duplicate_favorites
FROM favorites
WHERE user_id IS NOT NULL
    AND resource_id IS NOT NULL
    AND deleted_at IS NULL
GROUP BY user_id, resource_id, favorite_type
HAVING COUNT(*) > 1;

-- ====================================================================
-- 14. 性能和容量检查
-- ====================================================================

SELECT '14. 执行性能和容量检查...' as check_step;

-- 检查表大小和索引使用情况
SELECT
    TABLE_NAME as table_name,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as total_size_mb,
    ROUND((DATA_LENGTH / 1024 / 1024), 2) as data_size_mb,
    ROUND((INDEX_LENGTH / 1024 / 1024), 2) as index_size_mb,
    TABLE_ROWS as estimated_rows,
    ROUND((INDEX_LENGTH / DATA_LENGTH) * 100, 2) as index_percentage
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME IN (
        'user_profiles_detailed', 'user_settings', 'download_history',
        'browse_history', 'search_history', 'favorites', 'user_comments'
    )
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;

-- 检查高增长表的数据量
SELECT
    'download_history' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 END) as last_day,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as last_week,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as last_month
FROM download_history
WHERE deleted_at IS NULL

UNION ALL

SELECT
    'browse_history' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 END) as last_day,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as last_week,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as last_month
FROM browse_history
WHERE deleted_at IS NULL

UNION ALL

SELECT
    'user_activities' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 END) as last_day,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as last_week,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as last_month
FROM user_activities
WHERE deleted_at IS NULL;

-- ====================================================================
-- 15. 安全性检查
-- ====================================================================

SELECT '15. 执行安全性检查...' as check_step;

-- 检查是否有敏感信息泄露
SELECT
    'PII exposure check' as security_check,
    COUNT(CASE WHERE id_card_number IS NOT NULL AND id_card_number != '' THEN 1 END) as exposed_id_cards,
    COUNT(CASE WHERE phone_number IS NOT NULL AND phone_number != '' THEN 1 END) as exposed_phones,
    COUNT(CASE WHERE real_name IS NOT NULL AND real_name != '' THEN 1 END) as exposed_real_names
FROM user_profiles_detailed
WHERE deleted_at IS NULL;

-- 检查可疑的下载活动
SELECT
    'Suspicious download activity' as security_check,
    COUNT(*) as suspicious_downloads
FROM download_history
WHERE download_speed > 100 * 1024 * 1024  -- 超过100MB/s
    OR (file_size_bytes > 100 * 1024 * 1024 * 1024 AND download_status = 'completed')  -- 超大文件
    AND deleted_at IS NULL;

-- 检查异常的浏览行为
SELECT
    'Abnormal browse behavior' as security_check,
    COUNT(*) as abnormal_browses
FROM browse_history
WHERE duration_seconds > 3600  -- 浏览超过1小时
    OR interaction_count > 1000  -- 交互次数过多
    AND deleted_at IS NULL;

-- ====================================================================
-- 16. 验证结果汇总
-- ====================================================================

SELECT '16. 生成验证结果汇总...' as check_step;

-- 计算整体健康评分
SELECT
    'User Center Verification Summary' as summary_type,
    (SELECT COUNT(*) FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME IN ('user_profiles_detailed', 'user_settings', 'download_history',
                       'browse_history', 'search_history', 'favorites', 'favorite_folders',
                       'favorite_folder_relations', 'favorite_shares', 'user_comments',
                       'comment_interactions', 'comment_reports', 'user_activities',
                       'user_achievements', 'user_notifications')) as total_tables_found,

    (SELECT COUNT(*) FROM user_profiles_detailed WHERE deleted_at IS NULL) as total_user_profiles,
    (SELECT COUNT(*) FROM user_settings WHERE deleted_at IS NULL) as total_user_settings,
    (SELECT COUNT(*) FROM download_history WHERE deleted_at IS NULL) as total_download_history,
    (SELECT COUNT(*) FROM browse_history WHERE deleted_at IS NULL) as total_browse_history,
    (SELECT COUNT(*) FROM favorites WHERE deleted_at IS NULL) as total_favorites,
    (SELECT COUNT(*) FROM user_comments WHERE deleted_at IS NULL) as total_comments,

    (SELECT COUNT(*) FROM user_profiles_detailed WHERE profile_completion_score >= 80 AND deleted_at IS NULL) as high_quality_profiles,
    (SELECT COUNT(*) FROM download_history WHERE download_status = 'completed' AND deleted_at IS NULL) as successful_downloads,
    (SELECT COUNT(*) FROM favorites WHERE rating IS NOT NULL AND rating >= 8 AND deleted_at IS NULL) as high_rated_favorites,
    (SELECT COUNT(*) FROM user_comments WHERE like_count > 0 AND deleted_at IS NULL) as liked_comments,

    -- 计算健康评分 (0-100)
    CASE
        WHEN (SELECT COUNT(*) FROM information_schema.TABLES
              WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME IN ('user_profiles_detailed', 'user_settings', 'download_history',
                                'browse_history', 'search_history', 'favorites', 'favorite_folders',
                                'favorite_folder_relations', 'favorite_shares', 'user_comments',
                                'comment_interactions', 'comment_reports', 'user_activities',
                                'user_achievements', 'user_notifications')) = 16
             AND (SELECT COUNT(*) FROM user_profiles_detailed WHERE deleted_at IS NULL) > 0
             AND (SELECT COUNT(*) FROM download_history WHERE download_status = 'completed' AND deleted_at IS NULL) > 0
             AND (SELECT COUNT(*) FROM favorites WHERE deleted_at IS NULL) > 0
        THEN 95
        WHEN (SELECT COUNT(*) FROM information_schema.TABLES
              WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME IN ('user_profiles_detailed', 'user_settings', 'download_history',
                                'browse_history', 'search_history', 'favorites', 'favorite_folders',
                                'favorite_folder_relations', 'favorite_shares', 'user_comments',
                                'comment_interactions', 'comment_reports', 'user_activities',
                                'user_achievements', 'user_notifications')) >= 12
        THEN 80
        WHEN (SELECT COUNT(*) FROM information_schema.TABLES
              WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME IN ('user_profiles_detailed', 'user_settings', 'download_history',
                                'browse_history', 'search_history', 'favorites', 'favorite_folders',
                                'favorite_folder_relations', 'favorite_shares', 'user_comments',
                                'comment_interactions', 'comment_reports', 'user_activities',
                                'user_achievements', 'user_notifications')) >= 8
        THEN 60
        ELSE 30
    END as health_score;

SELECT '=== 用户中心表验证完成 ===' as verification_status;