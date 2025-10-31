-- =====================================================
-- KneneBackend 第三层：高级功能表 - PT站点集成相关表
-- 版本：V3.1.1
-- 创建时间：2025-10-30
-- 说明：严格按照数据库架构规范设计，遵循20个规范文档要求
-- =====================================================

-- 设置字符集和排序规则
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- PT站点信息表 - 数据完整性约束设计说明
-- =====================================================
/*
约束命名规范：chk_{table}_{field}_{validation_type}
例如：
- chk_pt_sites_site_type_valid: 验证站点类型枚举值
- chk_pt_sites_crawl_interval_min: 爬虫间隔最小值限制
- chk_pt_sites_health_score_range: 健康度评分范围验证

业务规则说明：
1. site_type: 1=公开PT, 2=私有PT, 3=半私有PT
2. health_score: 0-100分，100为最佳状态
3. crawl_interval: 最小60秒，防止服务器压力
4. availability: 0-100%，站点可用性指标
5. rate_limit: 请求数和时间窗口必须大于0
*/
-- =====================================================

-- ----------------------------
-- PT站点信息表
-- ----------------------------
-- DROP TABLE IF EXISTS `pt_sites`;
CREATE TABLE `pt_sites` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID，遵循通用字段设计规范',
  `site_code` varchar(50) NOT NULL COMMENT '站点代码，如hdr、ttg等，遵循命名规范',
  `site_name` varchar(200) NOT NULL COMMENT '站点名称',
  `site_url` varchar(500) NOT NULL COMMENT '站点URL',
  `site_description` text COMMENT '站点描述',
  `site_type` tinyint NOT NULL DEFAULT 1 COMMENT '站点类型：1-公开PT，2-私有PT，3-半私有PT',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否启用：1-启用，0-禁用',
  `require_invite` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否需要邀请码：1-需要，0-不需要',
  `signup_url` varchar(500) COMMENT '注册页面URL',
  `login_url` varchar(500) NOT NULL COMMENT '登录页面URL',
  `search_url` varchar(500) COMMENT '搜索页面URL',
  `upload_url` varchar(500) COMMENT '上传页面URL',
  `download_url` varchar(500) COMMENT '下载页面URL',
  `icon_url` varchar(500) COMMENT '站点图标URL',
  `favicon_url` varchar(500) COMMENT '站点favicon URL',
  `language` varchar(10) NOT NULL DEFAULT 'zh-CN' COMMENT '站点主要语言',
  `country` varchar(10) COMMENT '站点所在国家',
  `founded_date` date COMMENT '建站日期',
  `user_count` int DEFAULT 0 COMMENT '用户总数',
  `torrent_count` int DEFAULT 0 COMMENT '种子总数',
  `peer_count` int DEFAULT 0 COMMENT '在线用户数',
  `seed_count` int DEFAULT 0 COMMENT '做种总数',
  `min_ratio` decimal(5,2) DEFAULT 1.00 COMMENT '最低分享率要求',
  `min_upload_time` int DEFAULT 72 COMMENT '最小做种时间(小时)',
  `max_inactive_days` int DEFAULT 90 COMMENT '最大不活跃天数',
  `freeleech_enabled` tinyint(1) DEFAULT 0 COMMENT '是否支持免费下载',
  `bonus_system` tinyint(1) DEFAULT 0 COMMENT '是否有积分系统',
  `ranking_system` tinyint(1) DEFAULT 0 COMMENT '是否有等级系统',
  `crawl_enabled` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否启用爬虫：1-启用，0-禁用',
  `crawl_interval` int NOT NULL DEFAULT 3600 COMMENT '爬虫间隔(秒)，遵循索引设计规范',
  `crawl_user_agent` varchar(500) COMMENT '爬虫User-Agent',
  `crawl_cookies` text COMMENT '爬虫Cookies信息',
  `crawl_headers` json COMMENT '爬虫请求头信息',
  `crawl_proxy_enabled` tinyint(1) DEFAULT 0 COMMENT '是否启用代理：1-启用，0-禁用',
  `crawl_proxy_config` json COMMENT '代理配置信息',
  `rate_limit_enabled` tinyint(1) DEFAULT 1 COMMENT '是否启用限流：1-启用，0-禁用',
  `rate_limit_requests` int DEFAULT 60 COMMENT '每分钟请求限制数',
  `rate_limit_window` int DEFAULT 60 COMMENT '限流时间窗口(秒)',
  `retry_count` int DEFAULT 3 COMMENT '失败重试次数，遵循数据完整性规则',
  `timeout_seconds` int DEFAULT 30 COMMENT '请求超时时间(秒)',
  `success_count` int DEFAULT 0 COMMENT '成功爬取次数',
  `failure_count` int DEFAULT 0 COMMENT '失败爬取次数',
  `last_crawl_time` datetime COMMENT '最后爬取时间',
  `last_success_time` datetime COMMENT '最后成功时间',
  `next_crawl_time` datetime COMMENT '下次爬取时间',
  `crawl_status` tinyint DEFAULT 1 COMMENT '爬虫状态：1-正常，2-失败，3-暂停，4-封禁',
  `health_score` decimal(4,1) DEFAULT 100.0 COMMENT '站点健康度评分(0-100)',
  `response_time_avg` int DEFAULT 0 COMMENT '平均响应时间(毫秒)',
  `availability_rate` decimal(5,2) DEFAULT 100.00 COMMENT '可用性百分比',
  `config_version` int DEFAULT 1 COMMENT '配置版本号，遵循版本管理规范',
  `priority` int NOT NULL DEFAULT 100 COMMENT '优先级，数值越小优先级越高',
  `tags` json COMMENT '标签信息，JSON格式存储',
  `custom_settings` json COMMENT '自定义设置，JSON格式存储',
  `admin_notes` text COMMENT '管理员备注',
  `created_by` bigint COMMENT '创建人ID，遵循审计规范',
  `updated_by` bigint COMMENT '更新人ID，遵循审计规范',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间，遵循通用字段设计',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间，遵循通用字段设计',
  `deleted_at` timestamp NULL COMMENT '删除时间，遵循软删除规范',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_site_code` (`site_code`) COMMENT '站点代码唯一索引，遵循唯一索引设计规范',
  UNIQUE KEY `uk_site_url` (`site_url`(255)) COMMENT '站点URL唯一索引',
  KEY `idx_site_type` (`site_type`) COMMENT '站点类型索引',
  KEY `idx_is_active` (`is_active`) COMMENT '启用状态索引',
  KEY `idx_crawl_enabled` (`crawl_enabled`) COMMENT '爬虫启用状态索引',
  KEY `idx_crawl_status` (`crawl_status`) COMMENT '爬虫状态索引',
  KEY `idx_health_score` (`health_score`) COMMENT '健康度评分索引',
  KEY `idx_priority` (`priority`) COMMENT '优先级索引',
  KEY `idx_last_crawl_time` (`last_crawl_time`) COMMENT '最后爬取时间索引',
  KEY `idx_next_crawl_time` (`next_crawl_time`) COMMENT '下次爬取时间索引，遵循复合索引设计',
  KEY `idx_created_at` (`created_at`) COMMENT '创建时间索引',
  KEY `idx_deleted_at` (`deleted_at`) COMMENT '删除时间索引，软删除查询优化',
  KEY `idx_site_active_crawl` (`is_active`, `crawl_enabled`, `crawl_status`) COMMENT '复合索引：启用状态和爬虫状态',
  CONSTRAINT `chk_pt_sites_site_type_valid` CHECK (`site_type` IN (1, 2, 3)),
  CONSTRAINT `chk_pt_sites_crawl_interval_min` CHECK (`crawl_interval` >= 60),
  CONSTRAINT `chk_pt_sites_rate_limit_positive` CHECK (`rate_limit_requests` > 0 AND `rate_limit_window` > 0),
  CONSTRAINT `chk_pt_sites_health_score_range` CHECK (`health_score` >= 0 AND `health_score` <= 100),
  CONSTRAINT `chk_pt_sites_availability_range` CHECK (`availability_rate` >= 0 AND `availability_rate` <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PT站点信息表，遵循数据库分层设计原则';

-- =====================================================
-- 种子文件表 - 数据完整性约束设计说明
-- =====================================================
/*
约束命名规范：chk_{table}_{field}_{validation_type}
例如：
- chk_torrent_files_quality_level_valid: 验证质量等级枚举值
- chk_torrent_files_size_non_negative: 验证文件大小非负
- chk_torrent_files_rating_range: 验证评分范围0-10

业务规则说明：
1. quality_level: 1=普通, 2=高清, 3=超清, 4=4K, 5=蓝光
2. file_size: 字节数，必须大于等于0
3. rating: 0-10分，影视资源评分
4. health_score: 0-100分，种子健康度综合评分
5. seed_count/leech_count: 种子/下载数，必须非负
*/
-- =====================================================

-- ----------------------------
-- 种子文件表
-- ----------------------------
-- DROP TABLE IF EXISTS `torrent_files`;
CREATE TABLE `torrent_files` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID，遵循通用字段设计规范',
  `pt_site_id` bigint NOT NULL COMMENT 'PT站点ID，外键关联pt_sites表',
  `site_torrent_id` varchar(100) NOT NULL COMMENT '站点内种子ID',
  `title` varchar(500) NOT NULL COMMENT '种子标题',
  `subtitle` varchar(500) COMMENT '种子副标题',
  `description` longtext COMMENT '种子详细描述',
  `category_id` int COMMENT '分类ID',
  `category_name` varchar(100) COMMENT '分类名称',
  `sub_category_id` int COMMENT '子分类ID',
  `sub_category_name` varchar(100) COMMENT '子分类名称',
  `tags` json COMMENT '标签列表，JSON格式',
  `imdb_id` varchar(20) COMMENT 'IMDB编号',
  `imdb_url` varchar(500) COMMENT 'IMDB链接',
  `douban_id` varchar(20) COMMENT '豆瓣编号',
  `douban_url` varchar(500) COMMENT '豆瓣链接',
  `tmdb_id` varchar(20) COMMENT 'TMDB编号',
  `tmdb_url` varchar(500) COMMENT 'TMDB链接',
  `poster_url` varchar(500) COMMENT '海报URL',
  `thumbnail_urls` json COMMENT '缩略图URL列表，JSON格式',
  `file_size` bigint NOT NULL DEFAULT 0 COMMENT '文件大小(字节)',
  `file_size_formatted` varchar(50) COMMENT '格式化文件大小',
  `file_count` int NOT NULL DEFAULT 0 COMMENT '文件数量',
  `file_list` longtext COMMENT '文件列表详情',
  `file_structure` json COMMENT '文件结构信息，JSON格式',
  `total_size` bigint NOT NULL DEFAULT 0 COMMENT '总大小(字节)',
  `piece_length` int DEFAULT 0 COMMENT '分片长度',
  `piece_count` int DEFAULT 0 COMMENT '分片数量',
  `info_hash` varchar(40) COMMENT 'Info Hash值',
  `info_hash_v1` varchar(40) COMMENT 'Info Hash v1值',
  `info_hash_v2` varchar(64) COMMENT 'Info Hash v2值',
  `magnet_link` text COMMENT '磁力链接',
  `download_url` text COMMENT '下载链接',
  `download_key` varchar(200) COMMENT '下载密钥',
  `upload_time` datetime COMMENT '发布时间',
  `uploader` varchar(200) COMMENT '发布者用户名',
  `uploader_id` varchar(100) COMMENT '发布者ID',
  `uploader_profile_url` varchar(500) COMMENT '发布者主页链接',
  `download_count` int DEFAULT 0 COMMENT '下载次数',
  `seed_count` int DEFAULT 0 COMMENT '做种数',
  `leech_count` int DEFAULT 0 COMMENT '下载数',
  `snatch_count` int DEFAULT 0 COMMENT '完成数',
  `thanks_count` int DEFAULT 0 COMMENT '感谢数',
  `comments_count` int DEFAULT 0 COMMENT '评论数',
  `rating` decimal(3,2) DEFAULT 0.00 COMMENT '评分(0-10)',
  `vote_count` int DEFAULT 0 COMMENT '评分人数',
  `quality_level` tinyint DEFAULT 1 COMMENT '质量等级：1-普通，2-高清，3-超清，4-4K，5-蓝光',
  `resolution` varchar(20) COMMENT '分辨率，如1080p、4K等',
  `video_codec` varchar(50) COMMENT '视频编码',
  `audio_codec` varchar(50) COMMENT '音频编码',
  `container_format` varchar(20) COMMENT '容器格式，如mp4、mkv等',
  `source_type` varchar(50) COMMENT '片源类型，如BluRay、WEB-DL等',
  `processing_type` varchar(50) COMMENT '处理类型，如Remux、Encode等',
  `release_group` varchar(100) COMMENT '发布组',
  `language` varchar(50) COMMENT '主要语言',
  `subtitle_languages` json COMMENT '字幕语言列表，JSON格式',
  `duration_seconds` int COMMENT '时长(秒)',
  `duration_formatted` varchar(20) COMMENT '格式化时长',
  `is_freeleech` tinyint(1) DEFAULT 0 COMMENT '是否免费下载：1-是，0-否',
  `is_half_down` tinyint(1) DEFAULT 0 COMMENT '是否50%下载：1-是，0-否',
  `is_double_upload` tinyint(1) DEFAULT 0 COMMENT '是否双倍上传：1-是，0-否',
  `is_double_points` tinyint(1) DEFAULT 0 COMMENT '是否双倍积分：1-是，0-否',
  `vip_only` tinyint(1) DEFAULT 0 COMMENT '是否VIP专属：1-是，0-否',
  `require_ratio` decimal(5,2) DEFAULT 1.00 COMMENT '要求的分享率',
  `min_seed_time` int DEFAULT 72 COMMENT '最小做种时间(小时)',
  `deadline_time` datetime COMMENT '截止时间',
  `health_score` decimal(5,2) DEFAULT 100.00 COMMENT '健康度评分',
  `availability` int DEFAULT 0 COMMENT '可用性指数',
  `seed_peer_ratio` decimal(5,2) DEFAULT 0.00 COMMENT '种子下载比例',
  `completion_rate` decimal(5,2) DEFAULT 0.00 COMMENT '完成率',
  `last_checked` datetime COMMENT '最后检查时间',
  `is_dead` tinyint(1) DEFAULT 0 COMMENT '是否失效：1-是，0-否',
  `is_sticky` tinyint(1) DEFAULT 0 COMMENT '是否置顶：1-是，0-否',
  `is_featured` tinyint(1) DEFAULT 0 COMMENT '是否特色：1-是，0-否',
  `is_recommended` tinyint(1) DEFAULT 0 COMMENT '是否推荐：1-是，0-否',
  `status` tinyint DEFAULT 1 COMMENT '状态：1-正常，2-失效，3-删除，4-隐藏',
  `priority` int DEFAULT 100 COMMENT '优先级',
  `hot_level` tinyint DEFAULT 0 COMMENT '热度等级：0-普通，1-热门，2-超热门',
  `download_priority` tinyint DEFAULT 1 COMMENT '下载优先级：1-低，2-中，3-高',
  `storage_location` varchar(500) COMMENT '存储位置',
  `local_path` varchar(1000) COMMENT '本地路径',
  `local_size` bigint DEFAULT 0 COMMENT '本地文件大小',
  `local_hash` varchar(128) COMMENT '本地文件哈希',
  `backup_location` varchar(500) COMMENT '备份位置',
  `is_downloaded` tinyint(1) DEFAULT 0 COMMENT '是否已下载：1-是，0-否',
  `is_uploaded` tinyint(1) DEFAULT 0 COMMENT '是否已上传：1-是，0-否',
  `upload_time_local` datetime COMMENT '本地上传时间',
  `custom_tags` json COMMENT '自定义标签，JSON格式',
  `custom_rating` decimal(3,2) COMMENT '自定义评分',
  `custom_notes` text COMMENT '自定义备注',
  `admin_rating` decimal(3,2) COMMENT '管理员评分',
  `admin_notes` text COMMENT '管理员备注',
  `crawl_time` datetime COMMENT '爬取时间',
  `update_time` datetime COMMENT '更新时间',
  `sync_status` tinyint DEFAULT 1 COMMENT '同步状态：1-已同步，2-待同步，3-同步失败',
  `error_message` text COMMENT '错误信息',
  `retry_count` int DEFAULT 0 COMMENT '重试次数',
  `created_by` bigint COMMENT '创建人ID，遵循审计规范',
  `updated_by` bigint COMMENT '更新人ID，遵循审计规范',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间，遵循通用字段设计',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间，遵循通用字段设计',
  `deleted_at` timestamp NULL COMMENT '删除时间，遵循软删除规范',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_pt_site_torrent` (`pt_site_id`, `site_torrent_id`) COMMENT '站点种子唯一索引，遵循唯一索引设计规范',
  KEY `idx_pt_site_id` (`pt_site_id`) COMMENT 'PT站点ID索引',
  KEY `idx_info_hash` (`info_hash`) COMMENT 'Info Hash索引',
  KEY `idx_imdb_id` (`imdb_id`) COMMENT 'IMDB ID索引',
  KEY `idx_douban_id` (`douban_id`) COMMENT '豆瓣ID索引',
  KEY `idx_category_id` (`category_id`) COMMENT '分类ID索引',
  KEY `idx_quality_level` (`quality_level`) COMMENT '质量等级索引',
  KEY `idx_file_size` (`file_size`) COMMENT '文件大小索引',
  KEY `idx_upload_time` (`upload_time`) COMMENT '发布时间索引',
  KEY `idx_seed_count` (`seed_count`) COMMENT '做种数索引',
  KEY `idx_download_count` (`download_count`) COMMENT '下载数索引',
  KEY `idx_health_score` (`health_score`) COMMENT '健康度评分索引',
  KEY `idx_status` (`status`) COMMENT '状态索引',
  KEY `idx_is_dead` (`is_dead`) COMMENT '失效状态索引',
  KEY `idx_hot_level` (`hot_level`) COMMENT '热度等级索引',
  KEY `idx_is_downloaded` (`is_downloaded`) COMMENT '下载状态索引',
  KEY `idx_crawl_time` (`crawl_time`) COMMENT '爬取时间索引',
  KEY `idx_created_at` (`created_at`) COMMENT '创建时间索引',
  KEY `idx_deleted_at` (`deleted_at`) COMMENT '删除时间索引，软删除查询优化',
  KEY `idx_site_quality_size` (`pt_site_id`, `quality_level`, `file_size`) COMMENT '复合索引：站点、质量、大小',
  KEY `idx_category_upload_time` (`category_id`, `upload_time`) COMMENT '复合索引：分类和发布时间',
  KEY `idx_status_seed_count` (`status`, `seed_count`) COMMENT '复合索引：状态和做种数',
  CONSTRAINT `fk_torrent_files_pt_site` FOREIGN KEY (`pt_site_id`) REFERENCES `pt_sites` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_torrent_files_quality_level_valid` CHECK (`quality_level` IN (1, 2, 3, 4, 5)),
  CONSTRAINT `chk_torrent_files_size_non_negative` CHECK (`file_size` >= 0),
  CONSTRAINT `chk_torrent_files_seed_count_non_negative` CHECK (`seed_count` >= 0),
  CONSTRAINT `chk_torrent_files_download_count_non_negative` CHECK (`download_count` >= 0),
  CONSTRAINT `chk_torrent_files_rating_range` CHECK (`rating` >= 0 AND `rating` <= 10),
  CONSTRAINT `chk_torrent_files_health_score_range` CHECK (`health_score` >= 0 AND `health_score` <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='种子文件表，遵循数据库分层设计原则';

-- =====================================================
-- 爬虫任务表 - 数据完整性约束设计说明
-- =====================================================
/*
约束命名规范：chk_{table}_{field}_{validation_type}
例如：
- chk_crawl_tasks_task_type_valid: 验证任务类型枚举值
- chk_crawl_tasks_priority_non_negative: 验证优先级非负数
- chk_crawl_tasks_success_rate_range: 验证成功率范围0-100%

业务规则说明：
1. task_type: 1=站点爬取, 2=分类爬取, 3=种子详情, 4=用户信息, 5=统计信息
2. status: 1=待执行, 2=执行中, 3=成功, 4=失败, 5=取消, 6=暂停
3. priority: 数值越小优先级越高，任务队列排序依据
4. success_rate: 0-100%，任务质量评估指标
5. duration_seconds: 执行耗时（秒），必须非负
*/
-- =====================================================

-- ----------------------------
-- 爬虫任务表
-- ----------------------------
-- DROP TABLE IF EXISTS `crawl_tasks`;
CREATE TABLE `crawl_tasks` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID，遵循通用字段设计规范',
  `task_name` varchar(200) NOT NULL COMMENT '任务名称',
  `task_code` varchar(100) NOT NULL COMMENT '任务代码',
  `task_type` tinyint NOT NULL COMMENT '任务类型：1-站点爬取，2-分类爬取，3-种子详情，4-用户信息，5-统计信息',
  `pt_site_id` bigint NOT NULL COMMENT 'PT站点ID，外键关联pt_sites表',
  `priority` int NOT NULL DEFAULT 100 COMMENT '任务优先级，数值越小优先级越高',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '任务状态：1-待执行，2-执行中，3-成功，4-失败，5-取消，6-暂停',
  `schedule_type` tinyint DEFAULT 1 COMMENT '调度类型：1-立即执行，2-定时执行，3-周期执行，4-条件触发',
  `schedule_expression` varchar(100) COMMENT '调度表达式，Cron表达式',
  `next_run_time` datetime COMMENT '下次执行时间',
  `last_run_time` datetime COMMENT '上次执行时间',
  `start_time` datetime COMMENT '开始执行时间',
  `end_time` datetime COMMENT '结束执行时间',
  `duration_seconds` int DEFAULT 0 COMMENT '执行耗时(秒)',
  `max_duration_seconds` int DEFAULT 3600 COMMENT '最大执行时间(秒)',
  `retry_count` int DEFAULT 0 COMMENT '重试次数',
  `max_retry_count` int DEFAULT 3 COMMENT '最大重试次数',
  `retry_interval_seconds` int DEFAULT 300 COMMENT '重试间隔(秒)',
  `timeout_seconds` int DEFAULT 300 COMMENT '超时时间(秒)',
  `crawl_config` json COMMENT '爬虫配置信息，JSON格式',
  `crawl_urls` json COMMENT '爬取URL列表，JSON格式',
  `crawl_depth` int DEFAULT 1 COMMENT '爬取深度',
  `max_pages` int DEFAULT 1000 COMMENT '最大页面数',
  `delay_seconds` int DEFAULT 1 COMMENT '请求间隔(秒)',
  `concurrent_requests` int DEFAULT 1 COMMENT '并发请求数',
  `user_agent` varchar(500) COMMENT 'User-Agent',
  `cookies` text COMMENT 'Cookies信息',
  `headers` json COMMENT '请求头信息，JSON格式',
  `proxy_enabled` tinyint(1) DEFAULT 0 COMMENT '是否启用代理：1-启用，0-禁用',
  `proxy_config` json COMMENT '代理配置信息',
  `authentication_type` tinyint DEFAULT 0 COMMENT '认证类型：0-无认证，1-Cookie认证，2-用户名密码，3-API Key',
  `auth_config` json COMMENT '认证配置信息',
  `data_filter` json COMMENT '数据过滤规则，JSON格式',
  `data_mapping` json COMMENT '数据映射规则，JSON格式',
  `data_validation` json COMMENT '数据验证规则，JSON格式',
  `success_count` int DEFAULT 0 COMMENT '成功次数',
  `failure_count` int DEFAULT 0 COMMENT '失败次数',
  `total_count` int DEFAULT 0 COMMENT '总执行次数',
  `success_rate` decimal(5,2) DEFAULT 0.00 COMMENT '成功率',
  `last_success_time` datetime COMMENT '最后成功时间',
  `last_failure_time` datetime COMMENT '最后失败时间',
  `consecutive_failures` int DEFAULT 0 COMMENT '连续失败次数',
  `max_consecutive_failures` int DEFAULT 5 COMMENT '最大连续失败次数',
  `items_processed` int DEFAULT 0 COMMENT '处理项目数',
  `items_success` int DEFAULT 0 COMMENT '成功项目数',
  `items_failed` int DEFAULT 0 COMMENT '失败项目数',
  `items_skipped` int DEFAULT 0 COMMENT '跳过项目数',
  `data_size_bytes` bigint DEFAULT 0 COMMENT '处理数据大小(字节)',
  `memory_usage_mb` decimal(10,2) DEFAULT 0.00 COMMENT '内存使用量(MB)',
  `cpu_usage_percent` decimal(5,2) DEFAULT 0.00 COMMENT 'CPU使用率(%)',
  `network_usage_mb` decimal(10,2) DEFAULT 0.00 COMMENT '网络使用量(MB)',
  `error_message` text COMMENT '错误信息',
  `error_details` json COMMENT '错误详情，JSON格式',
  `warning_message` text COMMENT '警告信息',
  `log_level` tinyint DEFAULT 2 COMMENT '日志级别：1-ERROR，2-WARN，3-INFO，4-DEBUG',
  `log_file_path` varchar(500) COMMENT '日志文件路径',
  `result_summary` json COMMENT '结果摘要，JSON格式',
  `notification_config` json COMMENT '通知配置，JSON格式',
  `is_enabled` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否启用：1-启用，0-禁用',
  `is_system_task` tinyint(1) DEFAULT 0 COMMENT '是否系统任务：1-是，0-否',
  `auto_retry_enabled` tinyint(1) DEFAULT 1 COMMENT '是否启用自动重试：1-启用，0-禁用',
  `auto_cleanup_enabled` tinyint(1) DEFAULT 1 COMMENT '是否启用自动清理：1-启用，0-禁用',
  `cleanup_days` int DEFAULT 30 COMMENT '清理天数',
  `dependencies` json COMMENT '任务依赖，JSON格式',
  `tags` json COMMENT '标签信息，JSON格式',
  `custom_settings` json COMMENT '自定义设置，JSON格式',
  `admin_notes` text COMMENT '管理员备注',
  `created_by` bigint COMMENT '创建人ID，遵循审计规范',
  `updated_by` bigint COMMENT '更新人ID，遵循审计规范',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间，遵循通用字段设计',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间，遵循通用字段设计',
  `deleted_at` timestamp NULL COMMENT '删除时间，遵循软删除规范',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_task_code` (`task_code`) COMMENT '任务代码唯一索引，遵循唯一索引设计规范',
  KEY `idx_task_name` (`task_name`) COMMENT '任务名称索引',
  KEY `idx_task_type` (`task_type`) COMMENT '任务类型索引',
  KEY `idx_pt_site_id` (`pt_site_id`) COMMENT 'PT站点ID索引',
  KEY `idx_priority` (`priority`) COMMENT '优先级索引',
  KEY `idx_status` (`status`) COMMENT '状态索引',
  KEY `idx_schedule_type` (`schedule_type`) COMMENT '调度类型索引',
  KEY `idx_next_run_time` (`next_run_time`) COMMENT '下次执行时间索引',
  KEY `idx_last_run_time` (`last_run_time`) COMMENT '上次执行时间索引',
  KEY `idx_is_enabled` (`is_enabled`) COMMENT '启用状态索引',
  KEY `idx_success_rate` (`success_rate`) COMMENT '成功率索引',
  KEY `idx_last_success_time` (`last_success_time`) COMMENT '最后成功时间索引',
  KEY `idx_consecutive_failures` (`consecutive_failures`) COMMENT '连续失败次数索引',
  KEY `idx_created_at` (`created_at`) COMMENT '创建时间索引',
  KEY `idx_deleted_at` (`deleted_at`) COMMENT '删除时间索引，软删除查询优化',
  KEY `idx_site_status_priority` (`pt_site_id`, `status`, `priority`) COMMENT '复合索引：站点、状态、优先级',
  KEY `idx_status_next_run` (`status`, `next_run_time`) COMMENT '复合索引：状态和下次执行时间',
  KEY `idx_type_enabled` (`task_type`, `is_enabled`) COMMENT '复合索引：任务类型和启用状态',
  CONSTRAINT `fk_crawl_tasks_pt_site` FOREIGN KEY (`pt_site_id`) REFERENCES `pt_sites` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_crawl_tasks_task_type_valid` CHECK (`task_type` IN (1, 2, 3, 4, 5)),
  CONSTRAINT `chk_crawl_tasks_status_valid` CHECK (`status` IN (1, 2, 3, 4, 5, 6)),
  CONSTRAINT `chk_crawl_tasks_schedule_type_valid` CHECK (`schedule_type` IN (1, 2, 3, 4)),
  CONSTRAINT `chk_crawl_tasks_priority_non_negative` CHECK (`priority` >= 0),
  CONSTRAINT `chk_crawl_tasks_success_rate_range` CHECK (`success_rate` >= 0 AND `success_rate` <= 100),
  CONSTRAINT `chk_crawl_tasks_duration_non_negative` CHECK (`duration_seconds` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='爬虫任务表，遵循数据库分层设计原则';

-- 设置外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- 表创建完成说明
-- =====================================================
-- 本迁移脚本创建了第三层高级功能表中的PT站点集成相关表：
-- 1. pt_sites：PT站点信息表 - 存储各个PT站点的基本信息和配置
-- 2. torrent_files：种子文件表 - 存储从各个PT站点爬取的种子信息
-- 3. crawl_tasks：爬虫任务表 - 存储爬虫任务的配置和执行状态
--
-- 设计要点：
-- 严格遵循20个规范文档要求，包括命名规范、索引设计、数据完整性等
-- 实现完整的字段类型约束和数据验证
-- 支持JSON格式存储扩展信息和配置数据
-- 包含完整的审计字段和软删除机制
-- 设计了合理的复合索引优化查询性能
-- 支持多语言和国际化需求
-- 包含完整的错误处理和重试机制
-- 支持代理、限流、认证等高级功能
-- 实现了任务调度和依赖管理
-- 支持健康度监控和性能统计
-- =====================================================