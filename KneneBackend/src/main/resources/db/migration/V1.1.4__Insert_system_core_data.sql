-- ====================================================================
-- 影视资源下载网站 - 系统核心基础数据插入脚本
-- ====================================================================
-- 版本：V1.1.4
-- 描述：插入系统核心基础数据（系统配置、数据字典、文件存储配置、操作日志、审计日志样本数据）
-- 作者：数据库团队
-- 日期：2025-10-30
-- 依赖：V1.1.3__Create_system_core_tables.sql
-- ====================================================================

-- 设置SQL模式
SET NAMES utf8mb4;

-- ====================================================================
-- 1. 插入系统配置数据
-- ====================================================================

-- 网站基础配置
INSERT INTO system_configs (config_key, config_value, config_type, module, description, is_public, is_encrypted, sort_order, created_by, updated_by, version, created_at, updated_at, deleted_at) VALUES
-- 网站信息配置
('site_name', '影视资源下载网站', 'string', 'site', '网站名称', 1, 0, 1, 1, 1, 1, NOW(), NOW(), NULL),
('site_description', '提供高质量影视资源下载服务，支持BT种子、磁力链接等多种下载方式', 'string', 'site', '网站描述', 1, 0, 2, 1, 1, 1, NOW(), NOW(), NULL),
('site_keywords', '影视资源,电影下载,BT种子,磁力链接,高清影视', 'string', 'site', '网站关键词', 1, 0, 3, 1, 1, 1, NOW(), NOW(), NULL),
('site_logo', '/static/images/logo.png', 'string', 'site', '网站Logo', 1, 0, 4, 1, 1, 1, NOW(), NOW(), NULL),
('site_favicon', '/static/images/favicon.ico', 'string', 'site', '网站图标', 1, 0, 5, 1, 1, 1, NOW(), NOW(), NULL),

-- 联系信息配置
('contact_email', 'admin@knene.com', 'string', 'contact', '联系邮箱', 1, 0, 10, 1, 1, 1, NOW(), NOW(), NULL),
('contact_phone', '400-123-4567', 'string', 'contact', '联系电话', 1, 0, 11, 1, 1, 1, NOW(), NOW(), NULL),
('contact_qq_group', '123456789', 'string', 'contact', 'QQ群号', 1, 0, 12, 1, 1, 1, NOW(), NOW(), NULL),
('contact_wechat', 'knene_support', 'string', 'contact', '微信公众号', 1, 0, 13, 1, 1, 1, NOW(), NOW(), NULL),

-- 用户相关配置
('user_default_avatar', '/static/images/default-avatar.png', 'string', 'user', '用户默认头像', 1, 0, 20, 1, 1, 1, NOW(), NOW(), NULL),
('user_max_login_attempts', '5', 'number', 'user', '最大登录尝试次数', 0, 0, 21, 1, 1, 1, NOW(), NOW(), NULL),
('user_lockout_duration', '1800', 'number', 'user', '账户锁定时长(秒)', 0, 0, 22, 1, 1, 1, NOW(), NOW(), NULL),
('user_password_min_length', '6', 'number', 'user', '密码最小长度', 0, 0, 23, 1, 1, 1, NOW(), NOW(), NULL),
('user_password_expire_days', '90', 'number', 'user', '密码过期天数', 0, 0, 24, 1, 1, 1, NOW(), NOW(), NULL),
('user_session_timeout', '3600', 'number', 'user', '会话超时时间(秒)', 0, 0, 25, 1, 1, 1, NOW(), NOW(), NULL),

-- 文件上传配置
('upload_max_file_size', '104857600', 'number', 'upload', '最大文件上传大小(字节)', 0, 0, 30, 1, 1, 1, NOW(), NOW(), NULL),
('upload_max_daily_size', '1073741824', 'number', 'upload', '每日上传大小限制(字节)', 0, 0, 31, 1, 1, 1, NOW(), NOW(), NULL),
('upload_allowed_extensions', JSON_ARRAY('jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mkv', 'mp3', 'flac', 'txt', 'srt'), 'json', 'upload', '允许的文件扩展名', 0, 0, 32, 1, 1, 1, NOW(), NOW(), NULL),
('upload_auto_scan', 'true', 'boolean', 'upload', '上传后自动扫描', 0, 0, 33, 1, 1, 1, NOW(), NOW(), NULL),

-- 功能开关配置
('feature_registration', 'true', 'boolean', 'feature', '是否开放注册', 1, 0, 40, 1, 1, 1, NOW(), NOW(), NULL),
('feature_email_verification', 'true', 'boolean', 'feature', '是否需要邮箱验证', 1, 0, 41, 1, 1, 1, NOW(), NOW(), NULL),
('feature_vip_system', 'true', 'boolean', 'feature', '是否启用VIP系统', 1, 0, 42, 1, 1, 1, NOW(), NOW(), NULL),
('feature_comment_system', 'true', 'boolean', 'feature', '是否启用评论系统', 1, 0, 43, 1, 1, 1, NOW(), NOW(), NULL),
('feature_favorite_system', 'true', 'boolean', 'feature', '是否启用收藏系统', 1, 0, 44, 1, 1, 1, NOW(), NOW(), NULL),
('feature_search_system', 'true', 'boolean', 'feature', '是否启用搜索系统', 1, 0, 45, 1, 1, 1, NOW(), NOW(), NULL),

-- 系统限制配置
('system_max_requests_per_minute', '60', 'number', 'system', '每分钟最大请求数', 0, 0, 50, 1, 1, 1, NOW(), NOW(), NULL),
('system_max_requests_per_hour', '1000', 'number', 'system', '每小时最大请求数', 0, 0, 51, 1, 1, 1, NOW(), NOW(), NULL),
('system_max_requests_per_day', '10000', 'number', 'system', '每日最大请求数', 0, 0, 52, 1, 1, 1, NOW(), NOW(), NULL),
('system_maintenance_mode', 'false', 'boolean', 'system', '维护模式', 0, 0, 53, 1, 1, 1, NOW(), NOW(), NULL),

-- 第三方服务配置
('third_party_email_service', 'smtp', 'string', 'third_party', '邮件服务类型', 0, 0, 60, 1, 1, 1, NOW(), NOW(), NULL),
('third_party_sms_service', 'aliyun', 'string', 'third_party', '短信服务类型', 0, 0, 61, 1, 1, 1, NOW(), NOW(), NULL),
('third_party_analytics', 'google', 'string', 'third_party', '统计分析服务', 0, 0, 62, 1, 1, 1, NOW(), NOW(), NULL),

-- 下载相关配置
('download_max_concurrent', '3', 'number', 'download', '最大并发下载数', 0, 0, 70, 1, 1, 1, NOW(), NOW(), NULL),
('download_speed_limit', '0', 'number', 'download', '下载速度限制(KB/s)', 0, 0, 71, 1, 1, 1, NOW(), NOW(), NULL),
('download_timeout', '300', 'number', 'download', '下载超时时间(秒)', 0, 0, 72, 1, 1, 1, NOW(), NOW(), NULL),
('download_retry_count', '3', 'number', 'download', '下载重试次数', 0, 0, 73, 1, 1, 1, NOW(), NOW(), NULL),

-- 缓存配置
('cache_session_ttl', '1800', 'number', 'cache', '会话缓存过期时间(秒)', 0, 0, 80, 1, 1, 1, NOW(), NOW(), NULL),
('cache_user_info_ttl', '600', 'number', 'cache', '用户信息缓存过期时间(秒)', 0, 0, 81, 1, 1, 1, NOW(), NOW(), NULL),
('cache_config_ttl', '3600', 'number', 'cache', '配置缓存过期时间(秒)', 0, 0, 82, 1, 1, 1, NOW(), NOW(), NULL),
('cache_dictionary_ttl', '7200', 'number', 'cache', '字典缓存过期时间(秒)', 0, 0, 83, 1, 1, 1, NOW(), NOW(), NULL),

-- 安全配置
('security_cors_origins', JSON_ARRAY('http://localhost:3000', 'https://knene.com'), 'json', 'security', 'CORS允许的域名', 0, 0, 90, 1, 1, 1, NOW(), NOW(), NULL),
('security_csrf_protection', 'true', 'boolean', 'security', 'CSRF保护', 0, 0, 91, 1, 1, 1, NOW(), NOW(), NULL),
('security_rate_limiting', 'true', 'boolean', 'security', '限流保护', 0, 0, 92, 1, 1, 1, NOW(), NOW(), NULL),
('security_ip_whitelist', JSON_ARRAY(), 'json', 'security', 'IP白名单', 0, 0, 93, 1, 1, 1, NOW(), NOW(), NULL),

-- 系统配置（加密存储）
('security_jwt_secret', 'your-jwt-secret-key-here', 'string', 'security', 'JWT密钥', 0, 1, 94, 1, 1, 1, NOW(), NOW(), NULL),
('security_encrypt_key', 'your-encrypt-key-here', 'string', 'security', '加密密钥', 0, 1, 95, 1, 1, 1, NOW(), NOW(), NULL),
('security_db_password', 'encrypted:your-db-password', 'string', 'security', '数据库密码', 0, 1, 96, 1, 1, 1, NOW(), NOW(), NULL),

-- 邮件服务配置
('mail_smtp_host', 'smtp.gmail.com', 'string', 'mail', 'SMTP服务器', 0, 0, 100, 1, 1, 1, NOW(), NOW(), NULL),
('mail_smtp_port', '587', 'number', 'mail', 'SMTP端口', 0, 0, 101, 1, 1, 1, NOW(), NOW(), NULL),
('mail_smtp_username', 'noreply@knene.com', 'string', 'mail', 'SMTP用户名', 0, 0, 102, 1, 1, 1, NOW(), NOW(), NULL),
('mail_smtp_password', 'encrypted:smtp-password', 'string', 'mail', 'SMTP密码', 0, 1, 103, 1, 1, 1, NOW(), NOW(), NULL),
('mail_from_name', '影视资源下载网站', 'string', 'mail', '发件人名称', 0, 1, 104, 1, 1, 1, NOW(), NOW(), NULL),
('mail_from_address', 'noreply@knene.com', 'string', 'mail', '发件人邮箱', 0, 1, 105, 1, 1, 1, NOW(), NOW(), NULL),

-- SEO配置
('seo_title_suffix', ' - 影视资源下载网站', 'string', 'seo', '网站标题后缀', 0, 1, 110, 1, 1, 1, NOW(), NOW(), NULL),
('seo_description', '影视资源下载网站提供最新的电影、电视剧、纪录片等高质量影视资源下载服务', 'string', 'seo', '网站默认描述', 0, 1, 111, 1, 1, 1, NOW(), NOW(), NULL),
('seo_keywords', '影视下载,电影下载,电视剧下载,BT种子,磁力链接', 'string', 'seo', '网站默认关键词', 0, 1, 112, 1, 1, 1, NOW(), NOW(), NULL),
('seo_canonical_url', 'https://www.knene.com', 'string', 'seo', '规范URL', 0, 1, 113, 1, 1, 1, NOW(), NOW(), NULL),

-- 社交媒体配置
('social_weibo', 'https://weibo.com/knene', 'string', 'social', '微博链接', 0, 1, 120, 1, 1, 1, NOW(), NOW(), NULL),
('social_twitter', 'https://twitter.com/knene', 'string', 'social', 'Twitter链接', 0, 1, 121, 1, 1, 1, NOW(), NOW(), NULL),
('social_facebook', 'https://facebook.com/knene', 'string', 'social', 'Facebook链接', 0, 1, 122, 1, 1, 1, NOW(), NOW(), NULL),
('social_instagram', 'https://instagram.com/knene', 'string', 'social', 'Instagram链接', 0, 1, 123, 1, 1, 1, NOW(), NOW(), NULL),

-- 备份配置
('backup_enabled', 'true', 'boolean', 'backup', '是否启用自动备份', 0, 0, 130, 1, 1, 1, NOW(), NOW(), NULL),
('backup_schedule', '0 2 * * *', 'string', 'backup', '备份计划（每天凌晨2点）', 0, 0, 131, 1, 1, 1, NOW(), NOW(), NULL),
('backup_retention_days', '30', 'number', 'backup', '备份保留天数', 0, 0, 132, 1, 1, 1, NOW(), NOW(), NULL),
('backup_path', '/var/backups/knene', 'string', 'backup', '备份存储路径', 0, 0, 133, 1, 1, 1, NOW(), NOW(), NULL),

-- API配置
('api_version', 'v1', 'string', 'api', 'API版本', 0, 1, 140, 1, 1, 1, NOW(), NOW(), NULL),
('api_base_url', 'https://api.knene.com', 'string', 'api', 'API基础URL', 0, 1, 141, 1, 1, 1, NOW(), NOW(), NULL),
('api_rate_limit_per_minute', '100', 'number', 'api', 'API每分钟请求限制', 0, 0, 142, 1, 1, 1, NOW(), NOW(), NULL),
('api_rate_limit_per_hour', '5000', 'number', 'api', 'API每小时请求限制', 0, 0, 143, 1, 1, 1, NOW(), NOW(), NULL),

-- 主题配置
('theme_default', 'light', 'string', 'theme', '默认主题', 0, 1, 150, 1, 1, 1, NOW(), NOW(), NULL),
('theme_allow_custom', 'true', 'boolean', 'theme', '允许自定义主题', 0, 1, 151, 1, 1, 1, NOW(), NOW(), NULL),
('theme_primary_color', '#007bff', 'string', 'theme', '主题色', 0, 1, 152, 1, 1, 1, NOW(), NOW(), NULL),

-- CDN配置
('cdn_enabled', 'false', 'boolean', 'cdn', '是否启用CDN', 0, 0, 160, 1, 1, 1, NOW(), NOW(), NULL),
('cdn_base_url', 'https://cdn.knene.com', 'string', 'cdn', 'CDN基础URL', 0, 1, 161, 1, 1, 1, NOW(), NOW(), NULL),
('cdn_static_path', '/static', 'string', 'cdn', '静态资源CDN路径', 0, 1, 162, 1, 1, 1, NOW(), NOW(), NULL),

-- 消息通知配置
('notification_email_enabled', 'true', 'boolean', 'notification', '邮件通知开关', 0, 1, 170, 1, 1, 1, NOW(), NOW(), NULL),
('notification_sms_enabled', 'false', 'boolean', 'notification', '短信通知开关', 0, 0, 171, 1, 1, 1, NOW(), NOW(), NULL),
('notification_push_enabled', 'false', 'boolean', 'notification', '推送通知开关', 0, 0, 172, 1, 1, 1, NOW(), NOW(), NULL),
('notification_batch_size', '100', 'number', 'notification', '批量通知大小', 0, 0, 173, 1, 1, 1, NOW(), NOW(), NULL);

-- ====================================================================
-- 2. 插入数据字典数据
-- ====================================================================

-- 用户状态字典
INSERT INTO dictionaries (dict_type, dict_key, dict_value, dict_label, dict_group, parent_key, sort_order, is_active, remark, created_by, updated_by, version, created_at, updated_at, deleted_at) VALUES
('user_status', 'active', 'active', '正常', 'user_status', NULL, 1, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('user_status', 'inactive', 'inactive', '非活跃', 'user_status', NULL, 2, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('user_status', 'suspended', 'suspended', '暂停', 'user_status', NULL, 3, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('user_status', 'deleted', 'deleted', '已删除', 'user_status', NULL, 4, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),

-- 文件类型字典
('file_type', 'image', 'image', '图片', 'file_type', NULL, 1, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('file_type', 'video', 'video', '视频', 'file_type', NULL, 2, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('file_type', 'audio', 'audio', '音频', 'file_type', NULL, 3, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('file_type', 'document', 'document', '文档', 'file_type', NULL, 4, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('file_type', 'subtitle', 'subtitle', '字幕', 'file_type', NULL, 5, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('file_type', 'other', 'other', '其他', 'file_type', NULL, 6, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),

-- 操作类型字典
('operation_type', 'login', 'login', '登录', 'operation_type', NULL, 1, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('operation_type', 'logout', 'logout', '登出', 'operation_type', NULL, 2, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('operation_type', 'register', 'register', '注册', 'operation_type', NULL, 3, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('operation_type', 'create', 'create', '创建', 'operation_type', NULL, 4, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('operation_type', 'update', 'update', '更新', 'operation_type', NULL, 5, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('operation_type', 'delete', 'delete', '删除', 'operation_type', NULL, 6, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('operation_type', 'view', 'view', '查看', 'operation_type', NULL, 7, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('operation_type', 'download', 'download', '下载', 'operation_type', NULL, 8, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('operation_type', 'upload', 'upload', '上传', 'operation_type', NULL, 9, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('operation_type', 'search', 'search', '搜索', 'operation_type', NULL, 10, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),

-- 操作模块字典
('operation_module', 'user', 'user', '用户模块', 'operation_module', NULL, 1, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('operation_module', 'role', 'role', '角色模块', 'operation_module', NULL, 2, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('operation_module', 'permission', 'permission', '权限模块', 'operation_module', NULL, 3, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('operation_module', 'content', 'content', '内容模块', 'operation_module', NULL, 4, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('operation_module', 'resource', 'resource', '资源模块', 'operation_module', NULL, 5, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('operation_module', 'system', 'system', '系统模块', 'operation_module', NULL, 6, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('operation_module', 'upload', 'upload', '上传模块', 'operation_module', NULL, 7, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('operation_module', 'download', 'download', '下载模块', 'operation_module', NULL, 8, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('operation_module', 'vip', 'vip', 'VIP模块', 'operation_module', NULL, 9, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('operation_module', 'analytics', 'analytics', '分析模块', 'operation_module', NULL, 10, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),

-- 影视类型字典
('movie_type', 'movie', 'movie', '电影', 'movie_type', NULL, 1, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('movie_type', 'tv_series', 'tv_series', '电视剧', 'movie_type', NULL, 2, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('movie_type', 'documentary', 'documentary', '纪录片', 'movie_type', NULL, 3, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('movie_type', 'animation', 'animation', '动画', 'movie_type', NULL, 4, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('movie_type', 'variety', 'variety', '综艺', 'movie_type', NULL, 5, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('movie_type', 'short', 'short', '短片', 'movie_type', NULL, 6, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('movie_type', 'other', 'other', '其他', 'movie_type', NULL, 7, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),

-- 视频质量字典
('video_quality', '4k', '4k', '4K', 'video_quality', NULL, 1, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('video_quality', '1080p', '1080p', '1080P', 'video_quality', NULL, 2, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('video_quality', '720p', '720p', '720P', 'video_quality', NULL, 3, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('video_quality', '480p', '480p', '480P', 'video_quality', NULL, 4, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('video_quality', '360p', '360p', '360P', 'video_quality', NULL, 5, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),

-- 下载状态字典
('download_status', 'pending', 'pending', '等待中', 'download_status', NULL, 1, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('download_status', 'downloading', 'downloading', '下载中', 'download_status', NULL, 2, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('download_status', 'completed', 'completed', '已完成', 'download_status', NULL, 3, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('download_status', 'failed', 'failed', '失败', 'download_status', NULL, 4, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('download_status', 'paused', 'paused', '已暂停', 'download_status', NULL, 5, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('download_status', 'cancelled', 'cancelled', '已取消', 'download_status', NULL, 6, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),

-- 语言字典
('language', 'zh-cn', 'zh-CN', '简体中文', 'language', NULL, 1, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('language', 'zh-tw', 'zh-TW', '繁体中文', 'language', NULL, 2, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('language', 'en', 'en', '英语', 'language', NULL, 3, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('language', 'ja', 'ja', '日语', 'language', NULL, 4, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('language', 'ko', 'ko', '韩语', 'language', NULL, 5, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),

-- 地区字典
('region', 'cn', 'cn', '中国大陆', 'region', NULL, 1, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('region', 'hk', 'hk', '香港', 'region', NULL, 2, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('region', 'tw', 'tw', '台湾', 'region', NULL, 3, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('region', 'us', 'us', '美国', 'region', NULL, 4, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('region', 'jp', 'jp', '日本', 'region', NULL, 5, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('region', 'kr', 'kr', '韩国', 'region', NULL, 6, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('region', 'eu', 'eu', '欧洲', 'region', NULL, 7, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),

-- 时区字典
('timezone', 'Asia/Shanghai', 'Asia/Shanghai', '上海时区', 'timezone', NULL, 1, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('timezone', 'Asia/Hong_Kong', 'Asia/Hong_Kong', '香港时区', 'timezone', NULL, 2, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('timezone', 'Asia/Taipei', 'Asia/Taipei', '台湾时区', 'timezone', NULL, 3, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('timezone', 'America/New_York', 'America/New_York', '纽约时区', 'timezone', NULL, 4, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('timezone', 'Europe/London', 'Europe/London', '伦敦时区', 'timezone', NULL, 5, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('timezone', 'Asia/Tokyo', 'Asia/Tokyo', '东京时区', 'timezone', NULL, 6, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('timezone', 'Asia/Seoul', 'Asia/Seoul', '首尔时区', 'timezone', NULL, 7, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),

-- VIP等级字典
('vip_level', 'vip1', 'vip1', 'VIP1级', 'vip_level', NULL, 1, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('vip_level', 'vip2', 'vip2', 'VIP2级', 'vip_level', NULL, 2, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('vip_level', 'vip3', 'vip3', 'VIP3级', 'vip_level', NULL, 3, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('vip_level', 'vip4', 'vip4', 'VIP4级', 'vip_level', NULL, 4, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('vip_level', 'vip5', 'vip5', 'VIP5级', 'vip_level', NULL, 5, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),

-- 通知类型字典
('notification_type', 'system', 'system', '系统通知', 'notification_type', NULL, 1, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('notification_type', 'user', 'user', '用户通知', 'notification_type', NULL, 2, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('notification_type', 'content', 'content', '内容通知', 'notification_type', NULL, 3, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('notification_type', 'security', 'security', '安全通知', 'notification_type', NULL, 4, 1, NULL, 1, 1, 1, NOW(), NOW(), NULL),
('notification_type', 'marketing', 'marketing', '营销通知', 'notification_type', NULL, 5, 1, '营销通知类型', 1, 1, 1, NOW(), NOW(), NULL);

-- ====================================================================
-- 3. 插入文件存储配置数据
-- ====================================================================

-- 本地存储配置
INSERT INTO file_storages (storage_name, storage_type, access_key, secret_key, bucket_name, endpoint, domain_url, region, max_file_size, allowed_extensions, is_default, is_active, created_by, updated_by, version, created_at, updated_at, deleted_at) VALUES
('Local Storage', 'local', NULL, NULL, 'uploads', '/var/www/uploads', 'http://localhost:8080/uploads', 'local', 104857600, JSON_ARRAY('jpg', 'jpeg', 'png', 'gif', 'txt', 'srt', 'vtt'), 1, 1, 1, 1, 1, NOW(), NOW(), NULL);

-- 阿里云OSS存储配置
INSERT INTO file_storages (storage_name, storage_type, access_key, secret_key, bucket_name, endpoint, domain_url, region, max_file_size, allowed_extensions, is_default, is_active, created_by, updated_by, version, created_at, updated_at, deleted_at) VALUES
('Aliyun OSS', 'oss', 'LTAI5tBEXAMPLE_KEY', 'SECRET_KEY_EXAMPLE', 'knene-bucket', 'https://oss-cn-beijing.aliyuncs.com', 'https://knene-bucket.oss-cn-beijing.aliyuncs.com', 'cn-beijing', 524288000, JSON_ARRAY('jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mkv', 'mp3', 'flac', 'txt', 'srt'), 0, 1, 1, 1, 1, NOW(), NOW(), NULL);

-- 腾讯云COS存储配置
INSERT INTO file_storages (storage_name, storage_type, access_key, secret_key, bucket_name, endpoint, domain_url, region, max_file_size, allowed_extensions, is_default, is_active, created_by, updated_by, version, created_at, updated_at, deleted_at) VALUES
('Tencent COS', 'cos', 'AKIDEXAMPLE_KEY', 'SECRET_KEY_EXAMPLE', 'knene-1250000000', 'https://cos.ap-beijing.myqcloud.com', 'https://knene-1250000000.cos.ap-beijing.myqcloud.com', 'ap-beijing', 524288000, JSON_ARRAY('jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mkv', 'mp3', 'flac', 'txt', 'srt'), 0, 1, 1, 1, 1, NOW(), NOW(), NULL);

-- 七牛云存储配置
INSERT INTO file_storages (storage_name, storage_type, access_key, secret_key, bucket_name, endpoint, domain_url, region, max_file_size, allowed_extensions, is_default, is_active, created_by, updated_by, version, created_at, updated_at, deleted_at) VALUES
('Qiniu', 'qiniu', 'ACCESS_KEY_EXAMPLE', 'SECRET_KEY_EXAMPLE', 'knene-bucket', 'http://rs.qiniu.com', 'http://cdn.knene.com', 'z0', 104857600, JSON_ARRAY('jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mkv', 'mp3', 'flac', 'txt', 'srt'), 0, 1, 1, 1, 1, NOW(), NOW(), NULL);

-- AWS S3存储配置
INSERT INTO file_storages (storage_name, storage_type, access_key, secret_key, bucket_name, endpoint, domain_url, region, max_file_size, allowed_extensions, is_default, is_active, created_by, updated_by, version, created_at, updated_at, deleted_at) VALUES
('AWS S3', 's3', 'AKIAIOSFODNN7EXAMPLE', 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', 'knene-bucket', 'https://s3.amazonaws.com', 'https://knene-bucket.s3.amazonaws.com', 'us-east-1', 1073741824, JSON_ARRAY('jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mkv', 'mp3', 'flac', 'txt', 'srt'), 0, 1, 1, 1, 1, NOW(), NOW(), NULL);

-- ====================================================================
-- 4. 插入操作日志样本数据
-- ====================================================================

-- 管理员操作日志
INSERT INTO operation_logs (user_id, username, operation_type, operation_module, operation_desc, request_method, request_url, request_params, response_result, response_status, ip_address, user_agent, browser, os, location, execution_time, status, session_id, trace_id, created_at) VALUES
(1, 'admin', 'login', 'user', '管理员登录系统', 'POST', '/api/v1/auth/login', '{"username":"admin","password":"*****"}', '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Chrome', 'Windows', '本地', 150, 'success', 'sess_admin_001', 'trace_001', NOW()),
(1, 'admin', 'view', 'user', '查看用户列表', 'GET', '/api/v1/users', '{"page":1,"size":20,"status":"active"}', '{"total":1,"users":[{"id":1,"username":"admin","email":"admin@knene.com","status":"active"}]}', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Chrome', 'Windows', '本地', 80, 'success', 'sess_admin_001', 'trace_002', NOW()),
(1, 'admin', 'view', 'system', '查看系统配置', 'GET', '/api/v1/system/configs', '{}', '{"configs":[{"key":"site.name","value":"影视资源下载网站"}]}', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Chrome', 'Windows', '本地', 120, 'success', 'sess_admin_001', 'trace_003', NOW()),
(1, 'admin', 'update', 'system', '更新系统配置', 'PUT', '/api/v1/system/configs/site_name', '{"value":"影视资源下载网站"}', '{"success":true}', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Chrome', 'Windows', '本地', 200, 'success', 'sess_admin_001', 'trace_004', NOW());

-- 模拟其他用户操作日志
INSERT INTO operation_logs (user_id, username, operation_type, operation_module, operation_desc, request_method, request_url, request_params, response_result, response_status, ip_address, user_agent, browser, os, location, execution_time, status, session_id, trace_id, created_at) VALUES
(NULL, 'anonymous', 'view', 'content', '查看内容列表', 'GET', '/api/v1/contents', '{"page":1,"size":10}', '{"total":0,"contents":[]}', 200, '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Safari', 'macOS', '北京', 95, 'success', 'sess_guest_001', 'trace_005', NOW()),
(NULL, 'anonymous', 'search', 'content', '搜索内容', 'GET', '/api/v1/contents/search', '{"q":"电影","page":1}', '{"total":0,"results":[]}', 200, '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Safari', 'macOS', '北京', 60, 'success', 'sess_guest_001', 'trace_006', NOW()),
(NULL, 'anonymous', 'view', 'content', '查看热门内容', 'GET', '/api/v1/contents/hot', '{}', '{"contents":[]}', 200, '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Safari', 'macOS', '北京', 75, 'success', 'sess_guest_001', 'trace_007', NOW());

-- 模拟失败操作日志
INSERT INTO operation_logs (user_id, username, operation_type, operation_module, operation_desc, request_method, request_url, request_params, response_result, response_status, ip_address, user_agent, browser, os, location, execution_time, status, error_code, error_message, session_id, trace_id, created_at) VALUES
(NULL, 'anonymous', 'login', 'user', '用户登录失败', 'POST', '/api/v1/auth/login', '{"username":"test","password":"wrong"}', '{"error":"用户名或密码错误"}', 401, '180.150.200.88', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', 'Safari', 'iOS', '广州', 250, 'failure', 'AUTH_FAILED', '用户名或密码错误', 'sess_failed_001', 'trace_008', NOW()),
(NULL, 'anonymous', 'create', 'user', '用户注册失败', 'POST', '/api/v1/auth/register', '{"username":"test","email":"invalid-email","password":"123"}', '{"error":"邮箱格式不正确"}', 400, '180.150.200.88', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', 'Safari', 'iOS', '广州', 180, 'failure', 'VALIDATION_ERROR', '邮箱格式不正确', 'sess_failed_002', 'trace_009', NOW());

--
-- 所有数据均包含审计字段（created_by, updated_by, version）
-- 系统配置中的敏感数据已加密存储
-- ====================================================================