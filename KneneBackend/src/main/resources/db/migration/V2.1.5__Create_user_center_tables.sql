-- ====================================================================
-- 影视资源下载网站 - 用户中心相关表创建脚本
-- ====================================================================
-- 版本：V2.1.5
-- 描述：创建用户中心相关的所有表结构（个人资料、历史记录、收藏管理、评论管理等）
-- 作者：数据库团队
-- 日期：2025-10-30
-- 依赖：V2.1.4__Insert_vip_business_data.sql
-- ====================================================================

-- 设置SQL模式
SET NAMES utf8mb4;

-- ====================================================================
-- 1. 用户个人资料相关表
-- ====================================================================

-- 1.1 用户详细资料表
CREATE TABLE `user_profiles_detailed` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID，关联users表',
    `real_name` VARCHAR(50) DEFAULT NULL COMMENT '真实姓名',
    `gender` TINYINT DEFAULT NULL COMMENT '性别：1-男，2-女，3-其他',
    `birth_date` DATE DEFAULT NULL COMMENT '出生日期',
    `age` TINYINT DEFAULT NULL COMMENT '年龄',
    `id_card_number` VARCHAR(18) DEFAULT NULL COMMENT '身份证号码（加密存储）',
    `phone_number` VARCHAR(20) DEFAULT NULL COMMENT '手机号码',
    `address` VARCHAR(255) DEFAULT NULL COMMENT '详细地址',
    `city` VARCHAR(50) DEFAULT NULL COMMENT '所在城市',
    `province` VARCHAR(50) DEFAULT NULL COMMENT '所在省份',
    `country` VARCHAR(50) DEFAULT '中国' COMMENT '所在国家',
    `postal_code` VARCHAR(10) DEFAULT NULL COMMENT '邮政编码',
    `occupation` VARCHAR(100) DEFAULT NULL COMMENT '职业',
    `company` VARCHAR(100) DEFAULT NULL COMMENT '公司名称',
    `school` VARCHAR(100) DEFAULT NULL COMMENT '学校名称',
    `major` VARCHAR(100) DEFAULT NULL COMMENT '专业',
    `graduation_year` YEAR DEFAULT NULL COMMENT '毕业年份',
    `interests` TEXT DEFAULT NULL COMMENT '兴趣爱好（JSON格式）',
    `bio` TEXT DEFAULT NULL COMMENT '个人简介',
    `signature` VARCHAR(255) DEFAULT NULL COMMENT '个性签名',
    `website` VARCHAR(255) DEFAULT NULL COMMENT '个人网站',
    `social_links` JSON DEFAULT NULL COMMENT '社交媒体链接（JSON格式）',
    `skills` JSON DEFAULT NULL COMMENT '技能标签（JSON格式）',
    `language_preference` VARCHAR(10) DEFAULT 'zh-CN' COMMENT '语言偏好',
    `timezone` VARCHAR(50) DEFAULT 'Asia/Shanghai' COMMENT '时区设置',
    `is_verified` BOOLEAN DEFAULT FALSE COMMENT '是否已实名认证',
    `verification_status` VARCHAR(20) DEFAULT 'unverified' COMMENT '认证状态：unverified-未认证，pending-审核中，verified-已认证，rejected-已拒绝',
    `verification_level` TINYINT DEFAULT 0 COMMENT '认证等级：0-未认证，1-基础认证，2-高级认证，3-企业认证',
    `verification_documents` JSON DEFAULT NULL COMMENT '认证文档信息（JSON格式）',
    `privacy_level` TINYINT DEFAULT 1 COMMENT '隐私级别：1-公开，2-好友可见，3-私密',
    `profile_completion_score` TINYINT DEFAULT 0 COMMENT '资料完整度评分（0-100）',
    `profile_views` INT UNSIGNED DEFAULT 0 COMMENT '资料查看次数',
    `last_profile_update` TIMESTAMP NULL DEFAULT NULL COMMENT '最后资料更新时间',
    `created_by` BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    `updated_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '更新人ID',
    `version` INT UNSIGNED DEFAULT 1 COMMENT '版本号，用于乐观锁',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '软删除时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_profiles_detailed_user_id` (`user_id`),
    KEY `idx_user_profiles_detailed_gender` (`gender`),
    KEY `idx_user_profiles_detailed_city` (`city`),
    KEY `idx_user_profiles_detailed_verification_status` (`verification_status`),
    KEY `idx_user_profiles_detailed_verification_level` (`verification_level`),
    KEY `idx_user_profiles_detailed_privacy_level` (`privacy_level`),
    KEY `idx_user_profiles_detailed_completion_score` (`profile_completion_score`),
    KEY `idx_user_profiles_detailed_created_at` (`created_at`),
    CONSTRAINT `fk_user_profiles_detailed_user_id_users_id`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_user_profiles_detailed_created_by_users_id`
        FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_user_profiles_detailed_updated_by_users_id`
        FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户详细资料表';

-- 1.2 用户设置表
CREATE TABLE `user_settings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID，关联users表',
    `theme` VARCHAR(20) DEFAULT 'light' COMMENT '主题设置：light-浅色，dark-深色，auto-跟随系统',
    `language` VARCHAR(10) DEFAULT 'zh-CN' COMMENT '界面语言',
    `timezone` VARCHAR(50) DEFAULT 'Asia/Shanghai' COMMENT '时区设置',
    `date_format` VARCHAR(20) DEFAULT 'YYYY-MM-DD' COMMENT '日期格式',
    `time_format` VARCHAR(10) DEFAULT '24h' COMMENT '时间格式：12h-12小时制，24h-24小时制',
    `currency` VARCHAR(10) DEFAULT 'CNY' COMMENT '货币单位',
    `email_notifications` BOOLEAN DEFAULT TRUE COMMENT '是否接收邮件通知',
    `sms_notifications` BOOLEAN DEFAULT FALSE COMMENT '是否接收短信通知',
    `push_notifications` BOOLEAN DEFAULT TRUE COMMENT '是否接收推送通知',
    `auto_play_video` BOOLEAN DEFAULT FALSE COMMENT '是否自动播放视频',
    `video_quality` VARCHAR(10) DEFAULT 'auto' COMMENT '视频质量偏好：auto-自动，360p，480p，720p，1080p，4k',
    `subtitle_language` VARCHAR(10) DEFAULT 'zh-CN' COMMENT '字幕语言偏好',
    `download_quality` VARCHAR(10) DEFAULT '1080p' COMMENT '下载质量偏好',
    `auto_download` BOOLEAN DEFAULT FALSE COMMENT '是否自动下载',
    `auto_subtitle` BOOLEAN DEFAULT TRUE COMMENT '是否自动加载字幕',
    `playback_speed` DECIMAL(3,1) DEFAULT 1.0 COMMENT '默认播放速度',
    `volume_level` TINYINT DEFAULT 100 COMMENT '默认音量（0-100）',
    `show_download_progress` BOOLEAN DEFAULT TRUE COMMENT '是否显示下载进度',
    `auto_delete_downloaded` BOOLEAN DEFAULT FALSE COMMENT '是否自动删除已下载内容',
    `content_filter_level` TINYINT DEFAULT 1 COMMENT '内容过滤级别：0-不过滤，1-基础过滤，2-严格过滤',
    `auto_next_episode` BOOLEAN DEFAULT TRUE COMMENT '是否自动播放下一集',
    `remember_position` BOOLEAN DEFAULT TRUE COMMENT '是否记住播放位置',
    `cache_size_mb` INT UNSIGNED DEFAULT 1024 COMMENT '缓存大小限制（MB）',
    `data_usage_warning` BOOLEAN DEFAULT TRUE COMMENT '是否启用流量警告',
    `max_download_concurrent` TINYINT DEFAULT 3 COMMENT '最大并发下载数',
    `upload_bandwidth_limit` INT UNSIGNED DEFAULT 0 COMMENT '上传带宽限制（KB/s，0表示不限制）',
    `download_bandwidth_limit` INT UNSIGNED DEFAULT 0 COMMENT '下载带宽限制（KB/s，0表示不限制）',
    `security_settings` JSON DEFAULT NULL COMMENT '安全设置（JSON格式）',
    `privacy_settings` JSON DEFAULT NULL COMMENT '隐私设置（JSON格式）',
    `accessibility_settings` JSON DEFAULT NULL COMMENT '无障碍设置（JSON格式）',
    `created_by` BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    `updated_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '更新人ID',
    `version` INT UNSIGNED DEFAULT 1 COMMENT '版本号，用于乐观锁',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '软删除时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_settings_user_id` (`user_id`),
    KEY `idx_user_settings_theme` (`theme`),
    KEY `idx_user_settings_language` (`language`),
    KEY `idx_user_settings_timezone` (`timezone`),
    KEY `idx_user_settings_email_notifications` (`email_notifications`),
    KEY `idx_user_settings_created_at` (`created_at`),
    CONSTRAINT `fk_user_settings_user_id_users_id`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_user_settings_created_by_users_id`
        FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_user_settings_updated_by_users_id`
        FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户设置表';

-- 1.3 用户偏好设置表
CREATE TABLE `user_preferences` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID，关联users表',
    `preference_type` VARCHAR(50) NOT NULL COMMENT '偏好类型：genre-类型偏好，actor-演员偏好，director-导演偏好，year-年代偏好，country-国家偏好等',
    `preference_key` VARCHAR(100) NOT NULL COMMENT '偏好键名',
    `preference_value` TEXT NOT NULL COMMENT '偏好值（支持JSON格式）',
    `preference_score` DECIMAL(5,2) DEFAULT 0.00 COMMENT '偏好评分（0.00-100.00）',
    `preference_weight` DECIMAL(5,2) DEFAULT 1.00 COMMENT '偏好权重（0.01-10.00）',
    `is_active` BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    `auto_update` BOOLEAN DEFAULT TRUE COMMENT '是否自动更新（基于用户行为）',
    `last_interaction_at` TIMESTAMP NULL DEFAULT NULL COMMENT '最后交互时间',
    `interaction_count` INT UNSIGNED DEFAULT 0 COMMENT '交互次数',
    `created_by` BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    `updated_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '更新人ID',
    `version` INT UNSIGNED DEFAULT 1 COMMENT '版本号，用于乐观锁',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '软删除时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_preferences_user_type_key` (`user_id`, `preference_type`, `preference_key`),
    KEY `idx_user_preferences_user_id` (`user_id`),
    KEY `idx_user_preferences_preference_type` (`preference_type`),
    KEY `idx_user_preferences_preference_score` (`preference_score`),
    KEY `idx_user_preferences_preference_weight` (`preference_weight`),
    KEY `idx_user_preferences_is_active` (`is_active`),
    KEY `idx_user_preferences_auto_update` (`auto_update`),
    KEY `idx_user_preferences_last_interaction_at` (`last_interaction_at`),
    KEY `idx_user_preferences_interaction_count` (`interaction_count`),
    CONSTRAINT `fk_user_preferences_user_id_users_id`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_user_preferences_created_by_users_id`
        FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_user_preferences_updated_by_users_id`
        FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户偏好设置表';

-- ====================================================================
-- 2. 用户历史记录相关表
-- ====================================================================

-- 2.1 下载历史表
CREATE TABLE `download_history` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID，关联users表',
    `resource_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '资源ID，关联resources表',
    `torrent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '种子文件ID，关联torrent_files表',
    `download_id` VARCHAR(64) DEFAULT NULL COMMENT '下载任务ID',
    `download_type` VARCHAR(20) NOT NULL COMMENT '下载类型：direct-直接下载，torrent-种子下载，magnet-磁力链接，offline-离线下载',
    `download_title` VARCHAR(255) NOT NULL COMMENT '下载内容标题',
    `download_url` TEXT DEFAULT NULL COMMENT '下载链接',
    `file_size` BIGINT UNSIGNED DEFAULT 0 COMMENT '文件大小（字节）',
    `file_format` VARCHAR(20) DEFAULT NULL COMMENT '文件格式',
    `quality` VARCHAR(20) DEFAULT NULL COMMENT '视频质量',
    `download_status` VARCHAR(20) DEFAULT 'pending' COMMENT '下载状态：pending-等待中，downloading-下载中，completed-已完成，failed-失败，paused-暂停，cancelled-已取消',
    `progress_percentage` DECIMAL(5,2) DEFAULT 0.00 COMMENT '下载进度百分比（0.00-100.00）',
    `downloaded_size` BIGINT UNSIGNED DEFAULT 0 COMMENT '已下载大小（字节）',
    `download_speed` INT UNSIGNED DEFAULT 0 COMMENT '当前下载速度（KB/s）',
    `upload_speed` INT UNSIGNED DEFAULT 0 COMMENT '当前上传速度（KB/s）',
    `download_duration` INT UNSIGNED DEFAULT 0 COMMENT '下载耗时（秒）',
    `save_path` VARCHAR(500) DEFAULT NULL COMMENT '保存路径',
    `file_name` VARCHAR(255) DEFAULT NULL COMMENT '文件名',
    `file_hash` VARCHAR(128) DEFAULT NULL COMMENT '文件哈希值',
    `seed_time` INT UNSIGNED DEFAULT 0 COMMENT '做种时长（秒）',
    `ratio` DECIMAL(8,3) DEFAULT 0.000 COMMENT '分享率',
    `peers_connected` TINYINT UNSIGNED DEFAULT 0 COMMENT '连接的节点数',
    `seeds_connected` TINYINT UNSIGNED DEFAULT 0 COMMENT '连接的种子数',
    `priority` TINYINT DEFAULT 5 COMMENT '下载优先级（1-10）',
    `auto_start` BOOLEAN DEFAULT FALSE COMMENT '是否自动开始',
    `schedule_time` TIMESTAMP NULL DEFAULT NULL COMMENT '计划下载时间',
    `expire_time` TIMESTAMP NULL DEFAULT NULL COMMENT '过期时间',
    `retry_count` TINYINT UNSIGNED DEFAULT 0 COMMENT '重试次数',
    `max_retries` TINYINT UNSIGNED DEFAULT 3 COMMENT '最大重试次数',
    `error_message` TEXT DEFAULT NULL COMMENT '错误信息',
    `download_source` VARCHAR(50) DEFAULT NULL COMMENT '下载来源',
    `device_info` JSON DEFAULT NULL COMMENT '设备信息（JSON格式）',
    `ip_address` VARCHAR(45) DEFAULT NULL COMMENT '下载IP地址',
    `user_agent` TEXT DEFAULT NULL COMMENT '用户代理',
    `completed_at` TIMESTAMP NULL DEFAULT NULL COMMENT '完成时间',
    `started_at` TIMESTAMP NULL DEFAULT NULL COMMENT '开始时间',
    `paused_at` TIMESTAMP NULL DEFAULT NULL COMMENT '暂停时间',
    `cancelled_at` TIMESTAMP NULL DEFAULT NULL COMMENT '取消时间',
    `failed_at` TIMESTAMP NULL DEFAULT NULL COMMENT '失败时间',
    `created_by` BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    `updated_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '更新人ID',
    `version` INT UNSIGNED DEFAULT 1 COMMENT '版本号，用于乐观锁',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '软删除时间',
    PRIMARY KEY (`id`),
    KEY `idx_download_history_user_id` (`user_id`),
    KEY `idx_download_history_resource_id` (`resource_id`),
    KEY `idx_download_history_torrent_id` (`torrent_id`),
    KEY `idx_download_history_download_id` (`download_id`),
    KEY `idx_download_history_download_type` (`download_type`),
    KEY `idx_download_history_download_status` (`download_status`),
    KEY `idx_download_history_progress_percentage` (`progress_percentage`),
    KEY `idx_download_history_download_speed` (`download_speed`),
    KEY `idx_download_history_priority` (`priority`),
    KEY `idx_download_history_started_at` (`started_at`),
    KEY `idx_download_history_completed_at` (`completed_at`),
    KEY `idx_download_history_created_at` (`created_at`),
    CONSTRAINT `fk_download_history_user_id_users_id`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_download_history_created_by_users_id`
        FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_download_history_updated_by_users_id`
        FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='下载历史表';

-- 2.2 浏览历史表
CREATE TABLE `browse_history` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID，关联users表',
    `session_id` VARCHAR(128) DEFAULT NULL COMMENT '会话ID',
    `resource_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '资源ID，关联resources表',
    `content_type` VARCHAR(50) DEFAULT NULL COMMENT '内容类型：movie-电影，tv-电视剧，anime-动漫，documentary-纪录片，variety-综艺，other-其他',
    `browse_type` VARCHAR(20) NOT NULL COMMENT '浏览类型：detail-详情页，play-播放页，download-下载页，category-分类页，search-搜索页等',
    `browse_url` VARCHAR(500) NOT NULL COMMENT '浏览的URL',
    `page_title` VARCHAR(255) DEFAULT NULL COMMENT '页面标题',
    `referrer_url` VARCHAR(500) DEFAULT NULL COMMENT '来源页面URL',
    `duration_seconds` INT UNSIGNED DEFAULT 0 COMMENT '停留时长（秒）',
    `scroll_percentage` DECIMAL(5,2) DEFAULT 0.00 COMMENT '页面滚动百分比（0.00-100.00）',
    `interaction_count` INT UNSIGNED DEFAULT 0 COMMENT '交互次数（点击、滚动等）',
    `is_mobile` BOOLEAN DEFAULT FALSE COMMENT '是否移动端',
    `device_type` VARCHAR(20) DEFAULT NULL COMMENT '设备类型：desktop-桌面端，mobile-手机，tablet-平板，tv-电视等',
    `browser_name` VARCHAR(50) DEFAULT NULL COMMENT '浏览器名称',
    `browser_version` VARCHAR(20) DEFAULT NULL COMMENT '浏览器版本',
    `operating_system` VARCHAR(50) DEFAULT NULL COMMENT '操作系统',
    `screen_resolution` VARCHAR(20) DEFAULT NULL COMMENT '屏幕分辨率',
    `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'IP地址',
    `user_agent` TEXT DEFAULT NULL COMMENT '用户代理',
    `location_info` JSON DEFAULT NULL COMMENT '地理位置信息（JSON格式）',
    `entry_point` VARCHAR(20) DEFAULT NULL COMMENT '入口点：direct-直接访问，search-搜索，external-外部链接，bookmark-书签等',
    `exit_reason` VARCHAR(20) DEFAULT NULL COMMENT '退出原因：close-关闭页面，timeout-超时，click_link-点击链接，back-返回等',
    `is_bounce` BOOLEAN DEFAULT FALSE COMMENT '是否跳出页（访问即离开）',
    `view_source` VARCHAR(50) DEFAULT NULL COMMENT '浏览来源：recommend-推荐，search-搜索，category-分类，hot-热门，new-最新等',
    `engagement_score` DECIMAL(5,2) DEFAULT 0.00 COMMENT '参与度评分（0.00-100.00）',
    `created_by` BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    `updated_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '更新人ID',
    `version` INT UNSIGNED DEFAULT 1 COMMENT '版本号，用于乐观锁',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '软删除时间',
    PRIMARY KEY (`id`),
    KEY `idx_browse_history_user_id` (`user_id`),
    KEY `idx_browse_history_session_id` (`session_id`),
    KEY `idx_browse_history_resource_id` (`resource_id`),
    KEY `idx_browse_history_content_type` (`content_type`),
    KEY `idx_browse_history_browse_type` (`browse_type`),
    KEY `idx_browse_history_duration_seconds` (`duration_seconds`),
    KEY `idx_browse_history_is_mobile` (`is_mobile`),
    KEY `idx_browse_history_device_type` (`device_type`),
    KEY `idx_browse_history_entry_point` (`entry_point`),
    KEY `idx_browse_history_is_bounce` (`is_bounce`),
    KEY `idx_browse_history_view_source` (`view_source`),
    KEY `idx_browse_history_engagement_score` (`engagement_score`),
    KEY `idx_browse_history_created_at` (`created_at`),
    CONSTRAINT `fk_browse_history_user_id_users_id`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_browse_history_created_by_users_id`
        FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_browse_history_updated_by_users_id`
        FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='浏览历史表';

-- 2.3 搜索历史表
CREATE TABLE `search_history` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID，关联users表',
    `session_id` VARCHAR(128) DEFAULT NULL COMMENT '会话ID',
    `search_query` VARCHAR(255) NOT NULL COMMENT '搜索关键词',
    `search_type` VARCHAR(20) DEFAULT 'all' COMMENT '搜索类型：all-全部，movie-电影，tv-电视剧，anime-动漫，user-用户等',
    `search_category` VARCHAR(50) DEFAULT NULL COMMENT '搜索分类',
    `search_filters` JSON DEFAULT NULL COMMENT '搜索过滤条件（JSON格式）',
    `search_sort` VARCHAR(20) DEFAULT 'relevance' COMMENT '搜索排序：relevance-相关性，date-日期，rating-评分，popularity-热度等',
    `search_results_count` INT UNSIGNED DEFAULT 0 COMMENT '搜索结果数量',
    `clicked_result_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '点击的搜索结果ID',
    `clicked_result_position` INT UNSIGNED DEFAULT NULL COMMENT '点击结果在搜索结果中的位置',
    `click_through_rate` DECIMAL(5,2) DEFAULT 0.00 COMMENT '点击率（0.00-100.00）',
    `search_duration` INT UNSIGNED DEFAULT 0 COMMENT '搜索时长（毫秒）',
    `auto_suggest_used` BOOLEAN DEFAULT FALSE COMMENT '是否使用了自动补全',
    `suggestion_clicked` BOOLEAN DEFAULT FALSE COMMENT '是否点击了搜索建议',
    `spell_corrected` BOOLEAN DEFAULT FALSE COMMENT '是否进行了拼写纠正',
    `original_query` VARCHAR(255) DEFAULT NULL COMMENT '原始搜索词（纠错前）',
    `search_intent` VARCHAR(50) DEFAULT NULL COMMENT '搜索意图：informational-信息查询，transactional-事务查询，navigational-导航查询等',
    `search_context` VARCHAR(50) DEFAULT NULL COMMENT '搜索上下文：homepage-首页，category-分类页，detail-详情页等',
    `is_voice_search` BOOLEAN DEFAULT FALSE COMMENT '是否语音搜索',
    `is_image_search` BOOLEAN DEFAULT FALSE COMMENT '是否图片搜索',
    `device_type` VARCHAR(20) DEFAULT NULL COMMENT '设备类型',
    `location_info` JSON DEFAULT NULL COMMENT '地理位置信息（JSON格式）',
    `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'IP地址',
    `user_agent` TEXT DEFAULT NULL COMMENT '用户代理',
    `search_success` BOOLEAN DEFAULT TRUE COMMENT '搜索是否成功',
    `error_message` TEXT DEFAULT NULL COMMENT '错误信息',
    `created_by` BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    `updated_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '更新人ID',
    `version` INT UNSIGNED DEFAULT 1 COMMENT '版本号，用于乐观锁',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '软删除时间',
    PRIMARY KEY (`id`),
    KEY `idx_search_history_user_id` (`user_id`),
    KEY `idx_search_history_session_id` (`session_id`),
    KEY `idx_search_history_search_query` (`search_query`),
    KEY `idx_search_history_search_type` (`search_type`),
    KEY `idx_search_history_search_category` (`search_category`),
    KEY `idx_search_history_search_sort` (`search_sort`),
    KEY `idx_search_history_search_results_count` (`search_results_count`),
    KEY `idx_search_history_clicked_result_id` (`clicked_result_id`),
    KEY `idx_search_history_search_success` (`search_success`),
    KEY `idx_search_history_is_voice_search` (`is_voice_search`),
    KEY `idx_search_history_search_intent` (`search_intent`),
    KEY `idx_search_history_created_at` (`created_at`),
    CONSTRAINT `fk_search_history_user_id_users_id`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_search_history_created_by_users_id`
        FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_search_history_updated_by_users_id`
        FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='搜索历史表';

-- ====================================================================
-- 3. 收藏管理相关表
-- ====================================================================

-- 3.1 收藏主表
CREATE TABLE `favorites` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID，关联users表',
    `resource_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '资源ID，关联resources表',
    `content_type` VARCHAR(50) NOT NULL COMMENT '内容类型：movie-电影，tv-电视剧，anime-动漫，documentary-纪录片，variety-综艺，other-其他',
    `favorite_type` VARCHAR(20) DEFAULT 'favorite' COMMENT '收藏类型：favorite-收藏，watchlist-想看，watching-在看，watched-已看，like-喜欢等',
    `title` VARCHAR(255) NOT NULL COMMENT '标题',
    `description` TEXT DEFAULT NULL COMMENT '描述',
    `poster_url` VARCHAR(500) DEFAULT NULL COMMENT '海报URL',
    `rating` DECIMAL(3,1) DEFAULT NULL COMMENT '评分（0.0-10.0）',
    `user_rating` DECIMAL(3,1) DEFAULT NULL COMMENT '用户评分（0.0-10.0）',
    `user_review` TEXT DEFAULT NULL COMMENT '用户评论',
    `tags` JSON DEFAULT NULL COMMENT '标签（JSON格式）',
    `watch_progress` DECIMAL(5,2) DEFAULT 0.00 COMMENT '观看进度百分比（0.00-100.00）',
    `last_watched_position` INT UNSIGNED DEFAULT 0 COMMENT '最后观看位置（秒）',
    `episode_count` INT UNSIGNED DEFAULT 0 COMMENT '总集数',
    `watched_episode_count` INT UNSIGNED DEFAULT 0 COMMENT '已看集数',
    `current_episode` INT UNSIGNED DEFAULT 0 COMMENT '当前集数',
    `current_season` INT UNSIGNED DEFAULT 0 COMMENT '当前季数',
    `total_duration` INT UNSIGNED DEFAULT 0 COMMENT '总时长（秒）',
    `watched_duration` INT UNSIGNED DEFAULT 0 COMMENT '已观看时长（秒）',
    `priority` TINYINT DEFAULT 5 COMMENT '优先级（1-10）',
    `is_public` BOOLEAN DEFAULT FALSE COMMENT '是否公开',
    `is_featured` BOOLEAN DEFAULT FALSE COMMENT '是否推荐',
    `folder_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '收藏夹ID',
    `source` VARCHAR(50) DEFAULT NULL COMMENT '收藏来源：manual-手动，auto-自动，recommend-推荐等',
    `remind_me` BOOLEAN DEFAULT FALSE COMMENT '是否设置提醒',
    `remind_time` TIMESTAMP NULL DEFAULT NULL COMMENT '提醒时间',
    `expire_remind` BOOLEAN DEFAULT FALSE COMMENT '是否过期提醒',
    `custom_metadata` JSON DEFAULT NULL COMMENT '自定义元数据（JSON格式）',
    `thumbnail_url` VARCHAR(500) DEFAULT NULL COMMENT '缩略图URL',
    `background_url` VARCHAR(500) DEFAULT NULL COMMENT '背景图URL',
    `trailer_url` VARCHAR(500) DEFAULT NULL COMMENT '预告片URL',
    `release_date` DATE DEFAULT NULL COMMENT '发布日期',
    `genres` JSON DEFAULT NULL COMMENT '类型标签（JSON格式）',
    `cast_info` JSON DEFAULT NULL COMMENT '演员信息（JSON格式）',
    `director_info` JSON DEFAULT NULL COMMENT '导演信息（JSON格式）',
    `language` VARCHAR(20) DEFAULT NULL COMMENT '语言',
    `country` VARCHAR(50) DEFAULT NULL COMMENT '制片国家',
    `duration_minutes` INT UNSIGNED DEFAULT NULL COMMENT '时长（分钟）',
    `view_count` INT UNSIGNED DEFAULT 0 COMMENT '查看次数',
    `like_count` INT UNSIGNED DEFAULT 0 COMMENT '点赞次数',
    `share_count` INT UNSIGNED DEFAULT 0 COMMENT '分享次数',
    `created_by` BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    `updated_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '更新人ID',
    `version` INT UNSIGNED DEFAULT 1 COMMENT '版本号，用于乐观锁',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '软删除时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_favorites_user_resource_type` (`user_id`, `resource_id`, `favorite_type`),
    KEY `idx_favorites_user_id` (`user_id`),
    KEY `idx_favorites_resource_id` (`resource_id`),
    KEY `idx_favorites_content_type` (`content_type`),
    KEY `idx_favorites_favorite_type` (`favorite_type`),
    KEY `idx_favorites_folder_id` (`folder_id`),
    KEY `idx_favorites_user_rating` (`user_rating`),
    KEY `idx_favorites_watch_progress` (`watch_progress`),
    KEY `idx_favorites_priority` (`priority`),
    KEY `idx_favorites_is_public` (`is_public`),
    KEY `idx_favorites_is_featured` (`is_featured`),
    KEY `idx_favorites_remind_me` (`remind_me`),
    KEY `idx_favorites_created_at` (`created_at`),
    KEY `idx_favorites_updated_at` (`updated_at`),
    CONSTRAINT `fk_favorites_user_id_users_id`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_favorites_created_by_users_id`
        FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_favorites_updated_by_users_id`
        FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏主表';

-- 3.2 收藏夹表
CREATE TABLE `favorite_folders` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID，关联users表',
    `parent_folder_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '父收藏夹ID',
    `folder_name` VARCHAR(100) NOT NULL COMMENT '收藏夹名称',
    `folder_description` TEXT DEFAULT NULL COMMENT '收藏夹描述',
    `folder_type` VARCHAR(20) DEFAULT 'custom' COMMENT '收藏夹类型：default-默认，custom-自定义，auto-自动生成',
    `folder_color` VARCHAR(7) DEFAULT '#1890ff' COMMENT '收藏夹颜色（十六进制）',
    `folder_icon` VARCHAR(50) DEFAULT 'folder' COMMENT '收藏夹图标',
    `folder_cover_url` VARCHAR(500) DEFAULT NULL COMMENT '收藏夹封面图URL',
    `is_public` BOOLEAN DEFAULT FALSE COMMENT '是否公开',
    `is_featured` BOOLEAN DEFAULT FALSE COMMENT '是否推荐',
    `is_system` BOOLEAN DEFAULT FALSE COMMENT '是否系统收藏夹',
    `sort_order` INT DEFAULT 0 COMMENT '排序顺序',
    `item_count` INT UNSIGNED DEFAULT 0 COMMENT '收藏项目数量',
    `total_size` BIGINT UNSIGNED DEFAULT 0 COMMENT '总大小（字节）',
    `max_items` INT UNSIGNED DEFAULT NULL COMMENT '最大项目数量限制',
    `auto_organize` BOOLEAN DEFAULT FALSE COMMENT '是否自动整理',
    `organize_rules` JSON DEFAULT NULL COMMENT '整理规则（JSON格式）',
    `access_permission` VARCHAR(20) DEFAULT 'private' COMMENT '访问权限：private-私有，friends-好友可见，public-公开',
    `share_code` VARCHAR(32) DEFAULT NULL COMMENT '分享码',
    `share_url` VARCHAR(500) DEFAULT NULL COMMENT '分享链接',
    `share_password` VARCHAR(255) DEFAULT NULL COMMENT '分享密码（加密存储）',
    `share_expires_at` TIMESTAMP NULL DEFAULT NULL COMMENT '分享过期时间',
    `download_permission` BOOLEAN DEFAULT FALSE COMMENT '是否允许下载',
    `comment_permission` BOOLEAN DEFAULT TRUE COMMENT '是否允许评论',
    `tags` JSON DEFAULT NULL COMMENT '标签（JSON格式）',
    `metadata` JSON DEFAULT NULL COMMENT '元数据（JSON格式）',
    `created_by` BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    `updated_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '更新人ID',
    `version` INT UNSIGNED DEFAULT 1 COMMENT '版本号，用于乐观锁',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '软删除时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_favorite_folders_user_name` (`user_id`, `folder_name`),
    KEY `idx_favorite_folders_user_id` (`user_id`),
    KEY `idx_favorite_folders_parent_folder_id` (`parent_folder_id`),
    KEY `idx_favorite_folders_folder_type` (`folder_type`),
    KEY `idx_favorite_folders_is_public` (`is_public`),
    KEY `idx_favorite_folders_is_featured` (`is_featured`),
    KEY `idx_favorite_folders_is_system` (`is_system`),
    KEY `idx_favorite_folders_sort_order` (`sort_order`),
    KEY `idx_favorite_folders_item_count` (`item_count`),
    KEY `idx_favorite_folders_access_permission` (`access_permission`),
    KEY `idx_favorite_folders_share_code` (`share_code`),
    KEY `idx_favorite_folders_created_at` (`created_at`),
    CONSTRAINT `fk_favorite_folders_user_id_users_id`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_favorite_folders_parent_folder_id_favorite_folders_id`
        FOREIGN KEY (`parent_folder_id`) REFERENCES `favorite_folders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_favorite_folders_created_by_users_id`
        FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_favorite_folders_updated_by_users_id`
        FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏夹表';

-- 3.3 收藏夹关联表
CREATE TABLE `favorite_folder_relations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `folder_id` BIGINT UNSIGNED NOT NULL COMMENT '收藏夹ID，关联favorite_folders表',
    `favorite_id` BIGINT UNSIGNED NOT NULL COMMENT '收藏ID，关联favorites表',
    `added_by` BIGINT UNSIGNED NOT NULL COMMENT '添加人ID',
    `added_reason` VARCHAR(255) DEFAULT NULL COMMENT '添加原因',
    `sort_order` INT DEFAULT 0 COMMENT '在收藏夹中的排序',
    `is_pinned` BOOLEAN DEFAULT FALSE COMMENT '是否置顶',
    `pinned_at` TIMESTAMP NULL DEFAULT NULL COMMENT '置顶时间',
    `tags` JSON DEFAULT NULL COMMENT '标签（JSON格式）',
    `notes` TEXT DEFAULT NULL COMMENT '备注',
    `custom_properties` JSON DEFAULT NULL COMMENT '自定义属性（JSON格式）',
    `created_by` BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    `updated_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '更新人ID',
    `version` INT UNSIGNED DEFAULT 1 COMMENT '版本号，用于乐观锁',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '软删除时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_favorite_folder_relations_folder_favorite` (`folder_id`, `favorite_id`),
    KEY `idx_favorite_folder_relations_folder_id` (`folder_id`),
    KEY `idx_favorite_folder_relations_favorite_id` (`favorite_id`),
    KEY `idx_favorite_folder_relations_added_by` (`added_by`),
    KEY `idx_favorite_folder_relations_sort_order` (`sort_order`),
    KEY `idx_favorite_folder_relations_is_pinned` (`is_pinned`),
    KEY `idx_favorite_folder_relations_pinned_at` (`pinned_at`),
    KEY `idx_favorite_folder_relations_created_at` (`created_at`),
    CONSTRAINT `fk_favorite_folder_relations_folder_id_favorite_folders_id`
        FOREIGN KEY (`folder_id`) REFERENCES `favorite_folders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_favorite_folder_relations_favorite_id_favorites_id`
        FOREIGN KEY (`favorite_id`) REFERENCES `favorites` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_favorite_folder_relations_added_by_users_id`
        FOREIGN KEY (`added_by`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_favorite_folder_relations_created_by_users_id`
        FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_favorite_folder_relations_updated_by_users_id`
        FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏夹关联表';

-- 3.4 收藏分享表
CREATE TABLE `favorite_shares` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '分享者用户ID，关联users表',
    `favorite_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '收藏ID，关联favorites表',
    `folder_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '收藏夹ID，关联favorite_folders表',
    `share_type` VARCHAR(20) NOT NULL COMMENT '分享类型：favorite-单个收藏，folder-收藏夹，list-收藏列表',
    `share_code` VARCHAR(32) NOT NULL COMMENT '分享码',
    `share_url` VARCHAR(500) NOT NULL COMMENT '分享链接',
    `share_title` VARCHAR(255) DEFAULT NULL COMMENT '分享标题',
    `share_description` TEXT DEFAULT NULL COMMENT '分享描述',
    `share_image_url` VARCHAR(500) DEFAULT NULL COMMENT '分享图片URL',
    `share_password` VARCHAR(255) DEFAULT NULL COMMENT '分享密码（加密存储）',
    `access_permission` VARCHAR(20) DEFAULT 'public' COMMENT '访问权限：public-公开，password-密码验证，friends-好友，private-私有',
    `allow_download` BOOLEAN DEFAULT FALSE COMMENT '是否允许下载',
    `allow_comment` BOOLEAN DEFAULT TRUE COMMENT '是否允许评论',
    `allow_share` BOOLEAN DEFAULT TRUE COMMENT '是否允许二次分享',
    `max_views` INT UNSIGNED DEFAULT NULL COMMENT '最大查看次数限制',
    `current_views` INT UNSIGNED DEFAULT 0 COMMENT '当前查看次数',
    `max_downloads` INT UNSIGNED DEFAULT NULL COMMENT '最大下载次数限制',
    `current_downloads` INT UNSIGNED DEFAULT 0 COMMENT '当前下载次数',
    `expires_at` TIMESTAMP NULL DEFAULT NULL COMMENT '过期时间',
    `is_active` BOOLEAN DEFAULT TRUE COMMENT '是否激活',
    `is_featured` BOOLEAN DEFAULT FALSE COMMENT '是否推荐',
    `view_count` INT UNSIGNED DEFAULT 0 COMMENT '查看次数',
    `download_count` INT UNSIGNED DEFAULT 0 COMMENT '下载次数',
    `like_count` INT UNSIGNED DEFAULT 0 COMMENT '点赞次数',
    `comment_count` INT UNSIGNED DEFAULT 0 COMMENT '评论次数',
    `share_count` INT UNSIGNED DEFAULT 0 COMMENT '分享次数',
    `last_viewed_at` TIMESTAMP NULL DEFAULT NULL COMMENT '最后查看时间',
    `qr_code_url` VARCHAR(500) DEFAULT NULL COMMENT '二维码URL',
    `embed_code` TEXT DEFAULT NULL COMMENT '嵌入代码',
    `social_share_links` JSON DEFAULT NULL COMMENT '社交媒体分享链接（JSON格式）',
    `share_analytics` JSON DEFAULT NULL COMMENT '分享分析数据（JSON格式）',
    `custom_css` TEXT DEFAULT NULL COMMENT '自定义CSS',
    `custom_metadata` JSON DEFAULT NULL COMMENT '自定义元数据（JSON格式）',
    `created_by` BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    `updated_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '更新人ID',
    `version` INT UNSIGNED DEFAULT 1 COMMENT '版本号，用于乐观锁',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '软删除时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_favorite_shares_share_code` (`share_code`),
    KEY `idx_favorite_shares_user_id` (`user_id`),
    KEY `idx_favorite_shares_favorite_id` (`favorite_id`),
    KEY `idx_favorite_shares_folder_id` (`folder_id`),
    KEY `idx_favorite_shares_share_type` (`share_type`),
    KEY `idx_favorite_shares_access_permission` (`access_permission`),
    KEY `idx_favorite_shares_allow_download` (`allow_download`),
    KEY `idx_favorite_shares_is_active` (`is_active`),
    KEY `idx_favorite_shares_is_featured` (`is_featured`),
    KEY `idx_favorite_shares_expires_at` (`expires_at`),
    KEY `idx_favorite_shares_view_count` (`view_count`),
    KEY `idx_favorite_shares_created_at` (`created_at`),
    KEY `idx_favorite_shares_last_viewed_at` (`last_viewed_at`),
    CONSTRAINT `fk_favorite_shares_user_id_users_id`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_favorite_shares_favorite_id_favorites_id`
        FOREIGN KEY (`favorite_id`) REFERENCES `favorites` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_favorite_shares_folder_id_favorite_folders_id`
        FOREIGN KEY (`folder_id`) REFERENCES `favorite_folders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_favorite_shares_created_by_users_id`
        FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_favorite_shares_updated_by_users_id`
        FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏分享表';

-- ====================================================================
-- 4. 评论管理相关表
-- ====================================================================

-- 4.1 用户评论表
CREATE TABLE `user_comments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID，关联users表',
    `resource_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '资源ID，关联resources表',
    `parent_comment_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '父评论ID，关联自身表',
    `root_comment_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '根评论ID，关联自身表',
    `comment_type` VARCHAR(20) NOT NULL COMMENT '评论类型：resource-资源评论，list-列表评论，share-分享评论等',
    `content_type` VARCHAR(50) DEFAULT NULL COMMENT '内容类型：movie-电影，tv-电视剧，anime-动漫等',
    `comment_content` TEXT NOT NULL COMMENT '评论内容',
    `comment_summary` VARCHAR(255) DEFAULT NULL COMMENT '评论摘要',
    `rating` DECIMAL(3,1) DEFAULT NULL COMMENT '评分（0.0-10.0）',
    `is_spoiler` BOOLEAN DEFAULT FALSE COMMENT '是否包含剧透',
    `spoiler_warning` VARCHAR(255) DEFAULT NULL COMMENT '剧透警告内容',
    `comment_tags` JSON DEFAULT NULL COMMENT '评论标签（JSON格式）',
    `mention_users` JSON DEFAULT NULL COMMENT '提及的用户（JSON格式）',
    `reply_count` INT UNSIGNED DEFAULT 0 COMMENT '回复数量',
    `like_count` INT UNSIGNED DEFAULT 0 COMMENT '点赞数量',
    `dislike_count` INT UNSIGNED DEFAULT 0 COMMENT '踩数量',
    `report_count` INT UNSIGNED DEFAULT 0 COMMENT '举报数量',
    `share_count` INT UNSIGNED DEFAULT 0 COMMENT '分享数量',
    `view_count` INT UNSIGNED DEFAULT 0 COMMENT '查看数量',
    `is_top` BOOLEAN DEFAULT FALSE COMMENT '是否置顶',
    `is_hot` BOOLEAN DEFAULT FALSE COMMENT '是否热门',
    `is_official` BOOLEAN DEFAULT FALSE COMMENT '是否官方评论',
    `is_verified` BOOLEAN DEFAULT FALSE COMMENT '是否已认证用户评论',
    `is_featured` BOOLEAN DEFAULT FALSE COMMENT '是否精选评论',
    `moderation_status` VARCHAR(20) DEFAULT 'approved' COMMENT '审核状态：pending-待审核，approved-已通过，rejected-已拒绝，deleted-已删除',
    `moderation_reason` VARCHAR(255) DEFAULT NULL COMMENT '审核原因',
    `moderated_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '审核人ID',
    `moderated_at` TIMESTAMP NULL DEFAULT NULL COMMENT '审核时间',
    `edit_count` TINYINT UNSIGNED DEFAULT 0 COMMENT '编辑次数',
    `last_edited_at` TIMESTAMP NULL DEFAULT NULL COMMENT '最后编辑时间',
    `edited_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '编辑人ID',
    `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'IP地址',
    `user_agent` TEXT DEFAULT NULL COMMENT '用户代理',
    `device_info` JSON DEFAULT NULL COMMENT '设备信息（JSON格式）',
    `location_info` JSON DEFAULT NULL COMMENT '地理位置信息（JSON格式）',
    `sensitivity_score` DECIMAL(5,2) DEFAULT 0.00 COMMENT '敏感度评分（0.00-100.00）',
    `quality_score` DECIMAL(5,2) DEFAULT 0.00 COMMENT '质量评分（0.00-100.00）',
    `helpfulness_score` DECIMAL(5,2) DEFAULT 0.00 COMMENT '有用性评分（0.00-100.00）',
    `sentiment_analysis` JSON DEFAULT NULL COMMENT '情感分析结果（JSON格式）',
    `language_detected` VARCHAR(10) DEFAULT NULL COMMENT '检测到的语言',
    `auto_translated` BOOLEAN DEFAULT FALSE COMMENT '是否自动翻译',
    `translation_data` JSON DEFAULT NULL COMMENT '翻译数据（JSON格式）',
    `created_by` BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    `updated_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '更新人ID',
    `version` INT UNSIGNED DEFAULT 1 COMMENT '版本号，用于乐观锁',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '软删除时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_comments_user_id` (`user_id`),
    KEY `idx_user_comments_resource_id` (`resource_id`),
    KEY `idx_user_comments_parent_comment_id` (`parent_comment_id`),
    KEY `idx_user_comments_root_comment_id` (`root_comment_id`),
    KEY `idx_user_comments_comment_type` (`comment_type`),
    KEY `idx_user_comments_content_type` (`content_type`),
    KEY `idx_user_comments_rating` (`rating`),
    KEY `idx_user_comments_is_spoiler` (`is_spoiler`),
    KEY `idx_user_comments_reply_count` (`reply_count`),
    KEY `idx_user_comments_like_count` (`like_count`),
    KEY `idx_user_comments_is_top` (`is_top`),
    KEY `idx_user_comments_is_hot` (`is_hot`),
    KEY `idx_user_comments_moderation_status` (`moderation_status`),
    KEY `idx_user_comments_created_at` (`created_at`),
    KEY `idx_user_comments_updated_at` (`updated_at`),
    CONSTRAINT `fk_user_comments_user_id_users_id`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_user_comments_parent_comment_id_user_comments_id`
        FOREIGN KEY (`parent_comment_id`) REFERENCES `user_comments` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_user_comments_root_comment_id_user_comments_id`
        FOREIGN KEY (`root_comment_id`) REFERENCES `user_comments` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_user_comments_moderated_by_users_id`
        FOREIGN KEY (`moderated_by`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_user_comments_edited_by_users_id`
        FOREIGN KEY (`edited_by`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_user_comments_created_by_users_id`
        FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_user_comments_updated_by_users_id`
        FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户评论表';

-- 4.2 评论互动表
CREATE TABLE `comment_interactions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID，关联users表',
    `comment_id` BIGINT UNSIGNED NOT NULL COMMENT '评论ID，关联user_comments表',
    `interaction_type` VARCHAR(20) NOT NULL COMMENT '互动类型：like-点赞，dislike-踩，report-举报，share-分享，thank-感谢等',
    `interaction_value` VARCHAR(100) DEFAULT NULL COMMENT '互动值（如举报原因、感谢内容等）',
    `interaction_data` JSON DEFAULT NULL COMMENT '互动数据（JSON格式）',
    `is_active` BOOLEAN DEFAULT TRUE COMMENT '是否有效',
    `interaction_weight` DECIMAL(3,2) DEFAULT 1.00 COMMENT '互动权重（0.01-10.00）',
    `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'IP地址',
    `user_agent` TEXT DEFAULT NULL COMMENT '用户代理',
    `device_info` JSON DEFAULT NULL COMMENT '设备信息（JSON格式）',
    `location_info` JSON DEFAULT NULL COMMENT '地理位置信息（JSON格式）',
    `report_reason` VARCHAR(100) DEFAULT NULL COMMENT '举报原因',
    `report_detail` TEXT DEFAULT NULL COMMENT '举报详情',
    `report_status` VARCHAR(20) DEFAULT NULL COMMENT '举报处理状态：pending-待处理，processing-处理中，resolved-已解决，rejected-已驳回',
    `report_result` TEXT DEFAULT NULL COMMENT '举报处理结果',
    `processed_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '处理人ID',
    `processed_at` TIMESTAMP NULL DEFAULT NULL COMMENT '处理时间',
    `thank_message` TEXT DEFAULT NULL COMMENT '感谢信息',
    `share_platform` VARCHAR(50) DEFAULT NULL COMMENT '分享平台',
    `share_data` JSON DEFAULT NULL COMMENT '分享数据（JSON格式）',
    `created_by` BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    `updated_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '更新人ID',
    `version` INT UNSIGNED DEFAULT 1 COMMENT '版本号，用于乐观锁',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '软删除时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_comment_interactions_user_comment_type` (`user_id`, `comment_id`, `interaction_type`),
    KEY `idx_comment_interactions_user_id` (`user_id`),
    KEY `idx_comment_interactions_comment_id` (`comment_id`),
    KEY `idx_comment_interactions_interaction_type` (`interaction_type`),
    KEY `idx_comment_interactions_is_active` (`is_active`),
    KEY `idx_comment_interactions_interaction_weight` (`interaction_weight`),
    KEY `idx_comment_interactions_report_status` (`report_status`),
    KEY `idx_comment_interactions_share_platform` (`share_platform`),
    KEY `idx_comment_interactions_created_at` (`created_at`),
    CONSTRAINT `fk_comment_interactions_user_id_users_id`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_comment_interactions_comment_id_user_comments_id`
        FOREIGN KEY (`comment_id`) REFERENCES `user_comments` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_comment_interactions_processed_by_users_id`
        FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_comment_interactions_created_by_users_id`
        FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_comment_interactions_updated_by_users_id`
        FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论互动表';

-- ====================================================================
-- 表创建完成日志
-- ====================================================================
-- 用户中心相关表创建完成：
-- 1. 个人资料相关表（3个）
--    - user_profiles_detailed：用户详细资料表
--    - user_settings：用户设置表
--    - user_preferences：用户偏好设置表
-- 2. 历史记录相关表（3个）
--    - download_history：下载历史表
--    - browse_history：浏览历史表
--    - search_history：搜索历史表
-- 3. 收藏管理相关表（4个）
--    - favorites：收藏主表
--    - favorite_folders：收藏夹表
--    - favorite_folder_relations：收藏夹关联表
--    - favorite_shares：收藏分享表
-- 4. 评论管理相关表（2个）
--    - user_comments：用户评论表
--    - comment_interactions：评论互动表
--
-- 总计：12个表
-- 所有表都包含完整的审计字段和索引
-- 实现了完整的用户中心功能数据支持
-- ====================================================================