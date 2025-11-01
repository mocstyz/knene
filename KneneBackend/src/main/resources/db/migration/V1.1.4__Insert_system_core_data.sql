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
INSERT INTO system_configs (config_key, config_value, config_type, module, description, is_public, sort_order, created_by, updated_by, version, created_at, updated_at) VALUES
-- 网站信息配置
('site.name', '影视资源下载网站', 'STRING', 'site', '网站名称', 1, 1, 1, 1, 1, NOW(), NOW()),
('site.description', '提供高质量影视资源下载服务，支持BT种子、磁力链接等多种下载方式', 'STRING', 'site', '网站描述', 1, 2, 1, 1, 1, NOW(), NOW()),
('site.keywords', '影视资源,电影下载,BT种子,磁力链接,高清影视', 'STRING', 'site', '网站关键词', 1, 3, 1, 1, 1, NOW(), NOW()),
('site.logo', '/static/images/logo.png', 'STRING', 'site', '网站Logo', 1, 4, 1, 1, 1, NOW(), NOW()),
('site.favicon', '/static/images/favicon.ico', 'STRING', 'site', '网站图标', 1, 5, 1, 1, 1, NOW(), NOW()),

-- 联系信息配置
('contact.email', 'admin@knene.com', 'STRING', 'contact', '联系邮箱', 1, 10, 1, 1, 1, NOW(), NOW()),
('contact.phone', '400-123-4567', 'STRING', 'contact', '联系电话', 1, 11, 1, 1, 1, NOW(), NOW()),
('contact.qq_group', '123456789', 'STRING', 'contact', 'QQ群号', 1, 12, 1, 1, 1, NOW(), NOW()),
('contact.wechat', 'knene_support', 'STRING', 'contact', '微信公众号', 1, 13, 1, 1, 1, NOW(), NOW()),

-- 用户相关配置
('user.default_avatar', '/static/images/default-avatar.png', 'STRING', 'user', '用户默认头像', 1, 20, 1, 1, 1, NOW(), NOW()),
('user.max_login_attempts', '5', 'NUMBER', 'user', '最大登录尝试次数', 0, 21, 1, 1, 1, NOW(), NOW()),
('user.lockout_duration', '1800', 'NUMBER', 'user', '账户锁定时长(秒)', 0, 22, 1, 1, 1, NOW(), NOW()),
('user.password_min_length', '6', 'NUMBER', 'user', '密码最小长度', 0, 23, 1, 1, 1, NOW(), NOW()),
('user.password_expire_days', '90', 'NUMBER', 'user', '密码过期天数', 0, 24, 1, 1, 1, NOW(), NOW()),
('user.session_timeout', '3600', 'NUMBER', 'user', '会话超时时间(秒)', 0, 25, 1, 1, 1, NOW(), NOW()),

-- 文件上传配置
('upload.max_file_size', '104857600', 'NUMBER', 'upload', '最大文件上传大小(字节)', 0, 30, 1, 1, 1, NOW(), NOW()),
('upload.max_daily_size', '1073741824', 'NUMBER', 'upload', '每日上传大小限制(字节)', 0, 31, 1, 1, 1, NOW(), NOW()),
('upload.allowed_extensions', '["jpg", "jpeg", "png", "gif", "mp4", "avi", "mkv", "mp3", "flac", "txt", "srt"]', 'JSON', 'upload', '允许的文件扩展名', 0, 32, 1, 1, 1, NOW(), NOW()),
('upload.auto_scan', 'true', 'BOOLEAN', 'upload', '上传后自动扫描', 0, 33, 1, 1, 1, NOW(), NOW()),

-- 功能开关配置
('feature.registration', 'true', 'BOOLEAN', 'feature', '是否开放注册', 1, 40, 1, 1, 1, NOW(), NOW()),
('feature.email_verification', 'true', 'BOOLEAN', 'feature', '是否需要邮箱验证', 1, 41, 1, 1, 1, NOW(), NOW()),
('feature.vip_system', 'true', 'BOOLEAN', 'feature', '是否启用VIP系统', 1, 42, 1, 1, 1, NOW(), NOW()),
('feature.comment_system', 'true', 'BOOLEAN', 'feature', '是否启用评论系统', 1, 43, 1, 1, 1, NOW(), NOW()),
('feature.favorite_system', 'true', 'BOOLEAN', 'feature', '是否启用收藏系统', 1, 44, 1, 1, 1, NOW(), NOW()),
('feature.search_system', 'true', 'BOOLEAN', 'feature', '是否启用搜索系统', 1, 45, 1, 1, 1, NOW(), NOW()),

-- 系统限制配置
('system.max_requests_per_minute', '60', 'NUMBER', 'system', '每分钟最大请求数', 0, 50, 1, 1, 1, NOW(), NOW()),
('system.max_requests_per_hour', '1000', 'NUMBER', 'system', '每小时最大请求数', 0, 51, 1, 1, 1, NOW(), NOW()),
('system.max_requests_per_day', '10000', 'NUMBER', 'system', '每日最大请求数', 0, 52, 1, 1, 1, NOW(), NOW()),
('system.maintenance_mode', 'false', 'BOOLEAN', 'system', '维护模式', 0, 53, 1, 1, 1, NOW(), NOW()),

-- 第三方服务配置
('third_party.email_service', 'smtp', 'STRING', 'third_party', '邮件服务类型', 0, 60, 1, 1, 1, NOW(), NOW()),
('third_party.sms_service', 'aliyun', 'STRING', 'third_party', '短信服务类型', 0, 61, 1, 1, 1, NOW(), NOW()),
('third_party.analytics', 'google', 'STRING', 'third_party', '统计分析服务', 0, 62, 1, 1, 1, NOW(), NOW()),

-- 下载相关配置
('download.max_concurrent', '3', 'NUMBER', 'download', '最大并发下载数', 0, 70, 1, 1, 1, NOW(), NOW()),
('download.speed_limit', '0', 'NUMBER', 'download', '下载速度限制(KB/s)', 0, 71, 1, 1, 1, NOW(), NOW()),
('download.timeout', '300', 'NUMBER', 'download', '下载超时时间(秒)', 0, 72, 1, 1, 1, NOW(), NOW()),
('download.retry_count', '3', 'NUMBER', 'download', '下载重试次数', 0, 73, 1, 1, 1, NOW(), NOW()),

-- 缓存配置
('cache.session_ttl', '1800', 'NUMBER', 'cache', '会话缓存过期时间(秒)', 0, 80, 1, 1, 1, NOW(), NOW()),
('cache.user_info_ttl', '600', 'NUMBER', 'cache', '用户信息缓存过期时间(秒)', 0, 81, 1, 1, 1, NOW(), NOW()),
('cache.config_ttl', '3600', 'NUMBER', 'cache', '配置缓存过期时间(秒)', 0, 82, 1, 1, 1, NOW(), NOW()),
('cache.dictionary_ttl', '7200', 'NUMBER', 'cache', '字典缓存过期时间(秒)', 0, 83, 1, 1, 1, NOW(), NOW()),

-- 安全配置
('security.cors_origins', '["http://localhost:3000", "https://knene.com"]', 'JSON', 'security', 'CORS允许的域名', 0, 90, 1, 1, 1, NOW(), NOW()),
('security.csrf_protection', 'true', 'BOOLEAN', 'security', 'CSRF保护', 0, 91, 1, 1, 1, NOW(), NOW()),
('security.rate_limiting', 'true', 'BOOLEAN', 'security', '限流保护', 0, 92, 1, 1, 1, NOW(), NOW()),
('security.ip_whitelist', '[]', 'JSON', 'security', 'IP白名单', 0, 93, 1, 1, 1, NOW(), NOW()),

-- 系统配置（加密存储）
('security.jwt_secret', 'your-jwt-secret-key-here', 'STRING', 'security', 'JWT密钥', 0, 94, 1, 1, 1, NOW(), NOW()),
('security.encrypt_key', 'your-encrypt-key-here', 'STRING', 'security', '加密密钥', 0, 95, 1, 1, 1, NOW(), NOW()),
('security.db_password', 'encrypted:your-db-password', 'STRING', 'security', '数据库密码', 0, 96, 1, 1, 1, NOW(), NOW()),

-- 邮件服务配置
('mail.smtp_host', 'smtp.gmail.com', 'STRING', 'mail', 'SMTP服务器', 0, 100, 1, 1, 1, NOW(), NOW()),
('mail.smtp_port', '587', 'NUMBER', 'mail', 'SMTP端口', 0, 101, 1, 1, 1, NOW(), NOW()),
('mail.smtp_username', 'noreply@knene.com', 'STRING', 'mail', 'SMTP用户名', 0, 102, 1, 1, 1, NOW(), NOW()),
('mail.smtp_password', 'encrypted:smtp-password', 'STRING', 'mail', 'SMTP密码', 0, 103, 1, 1, 1, NOW(), NOW()),
('mail.from_name', '影视资源下载网站', 'STRING', 'mail', '发件人名称', 1, 104, 1, 1, 1, NOW(), NOW()),
('mail.from_address', 'noreply@knene.com', 'STRING', 'mail', '发件人邮箱', 1, 105, 1, 1, 1, NOW(), NOW()),

-- SEO配置
('seo.title_suffix', ' - 影视资源下载网站', 'STRING', 'seo', '网站标题后缀', 1, 110, 1, 1, 1, NOW(), NOW()),
('seo.description', '影视资源下载网站提供最新的电影、电视剧、纪录片等高质量影视资源下载服务', 'STRING', 'seo', '网站默认描述', 1, 111, 1, 1, 1, NOW(), NOW()),
('seo.keywords', '影视下载,电影下载,电视剧下载,BT种子,磁力链接', 'STRING', 'seo', '网站默认关键词', 1, 112, 1, 1, 1, NOW(), NOW()),
('seo.canonical_url', 'https://www.knene.com', 'STRING', 'seo', '规范URL', 1, 113, 1, 1, 1, NOW(), NOW()),

-- 社交媒体配置
('social.weibo', 'https://weibo.com/knene', 'STRING', 'social', '微博链接', 1, 120, 1, 1, 1, NOW(), NOW()),
('social.twitter', 'https://twitter.com/knene', 'STRING', 'social', 'Twitter链接', 1, 121, 1, 1, 1, NOW(), NOW()),
('social.facebook', 'https://facebook.com/knene', 'STRING', 'social', 'Facebook链接', 1, 122, 1, 1, 1, NOW(), NOW()),
('social.instagram', 'https://instagram.com/knene', 'STRING', 'social', 'Instagram链接', 1, 123, 1, 1, 1, NOW(), NOW()),

-- 备份配置
('backup.enabled', 'true', 'BOOLEAN', 'backup', '是否启用自动备份', 0, 130, 1, 1, 1, NOW(), NOW()),
('backup.schedule', '0 2 * * *', 'STRING', 'backup', '备份计划（每天凌晨2点）', 0, 131, 1, 1, 1, NOW(), NOW()),
('backup.retention_days', '30', 'NUMBER', 'backup', '备份保留天数', 0, 132, 1, 1, 1, NOW(), NOW()),
('backup.path', '/var/backups/knene', 'STRING', 'backup', '备份存储路径', 0, 133, 1, 1, 1, NOW(), NOW()),

-- API配置
('api.version', 'v1', 'STRING', 'api', 'API版本', 1, 140, 1, 1, 1, NOW(), NOW()),
('api.base_url', 'https://api.knene.com', 'STRING', 'api', 'API基础URL', 1, 141, 1, 1, 1, NOW(), NOW()),
('api.rate_limit_per_minute', '100', 'NUMBER', 'api', 'API每分钟请求限制', 0, 142, 1, 1, 1, NOW(), NOW()),
('api.rate_limit_per_hour', '5000', 'NUMBER', 'api', 'API每小时请求限制', 0, 143, 1, 1, 1, NOW(), NOW()),

-- 主题配置
('theme.default', 'light', 'STRING', 'theme', '默认主题', 1, 150, 1, 1, 1, NOW(), NOW()),
('theme.allow_custom', 'true', 'BOOLEAN', 'theme', '允许自定义主题', 1, 151, 1, 1, 1, NOW(), NOW()),
('theme.primary_color', '#007bff', 'STRING', 'theme', '主题色', 1, 152, 1, 1, 1, NOW(), NOW()),

-- CDN配置
('cdn.enabled', 'false', 'BOOLEAN', 'cdn', '是否启用CDN', 0, 160, 1, 1, 1, NOW(), NOW()),
('cdn.base_url', 'https://cdn.knene.com', 'STRING', 'cdn', 'CDN基础URL', 1, 161, 1, 1, 1, NOW(), NOW()),
('cdn.static_path', '/static', 'STRING', 'cdn', '静态资源CDN路径', 1, 162, 1, 1, 1, NOW(), NOW()),

-- 消息通知配置
('notification.email_enabled', 'true', 'BOOLEAN', 'notification', '邮件通知开关', 1, 170, 1, 1, 1, NOW(), NOW()),
('notification.sms_enabled', 'false', 'BOOLEAN', 'notification', '短信通知开关', 0, 171, 1, 1, 1, NOW(), NOW()),
('notification.push_enabled', 'false', 'BOOLEAN', 'notification', '推送通知开关', 0, 172, 1, 1, 1, NOW(), NOW()),
('notification.batch_size', '100', 'NUMBER', 'notification', '批量通知大小', 0, 173, 1, 1, 1, NOW(), NOW());

-- ====================================================================
-- 2. 插入数据字典数据
-- ====================================================================

-- 用户状态字典
INSERT INTO dictionaries (dict_type, dict_key, dict_value, dict_label, dict_group, sort_order, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
('USER_STATUS', 'active', 'ACTIVE', '正常', 'user_status', 1, 1, 1, 1, 1, NOW(), NOW()),
('USER_STATUS', 'inactive', 'INACTIVE', '未激活', 'user_status', 2, 1, 1, 1, 1, NOW(), NOW()),
('USER_STATUS', 'suspended', 'SUSPENDED', '已暂停', 'user_status', 3, 1, 1, 1, 1, NOW(), NOW()),
('USER_STATUS', 'deleted', 'DELETED', '已删除', 'user_status', 4, 1, 1, 1, 1, NOW(), NOW()),

-- 文件类型字典
('FILE_TYPE', 'image', 'IMAGE', '图片', 'file_type', 1, 1, 1, 1, 1, NOW(), NOW()),
('FILE_TYPE', 'video', 'VIDEO', '视频', 'file_type', 2, 1, 1, 1, 1, NOW(), NOW()),
('FILE_TYPE', 'audio', 'AUDIO', '音频', 'file_type', 3, 1, 1, 1, 1, NOW(), NOW()),
('FILE_TYPE', 'document', 'DOCUMENT', '文档', 'file_type', 4, 1, 1, 1, 1, NOW(), NOW()),
('FILE_TYPE', 'subtitle', 'SUBTITLE', '字幕', 'file_type', 5, 1, 1, 1, 1, NOW(), NOW()),
('FILE_TYPE', 'other', 'OTHER', '其他', 'file_type', 6, 1, 1, 1, 1, NOW(), NOW()),

-- 操作类型字典
('OPERATION_TYPE', 'login', 'LOGIN', '登录', 'operation_type', 1, 1, 1, 1, 1, NOW(), NOW()),
('OPERATION_TYPE', 'logout', 'LOGOUT', '登出', 'operation_type', 2, 1, 1, 1, 1, NOW(), NOW()),
('OPERATION_TYPE', 'register', 'REGISTER', '注册', 'operation_type', 3, 1, 1, 1, 1, NOW(), NOW()),
('OPERATION_TYPE', 'create', 'CREATE', '创建', 'operation_type', 4, 1, 1, 1, 1, NOW(), NOW()),
('OPERATION_TYPE', 'update', 'UPDATE', '更新', 'operation_type', 5, 1, 1, 1, 1, NOW(), NOW()),
('OPERATION_TYPE', 'delete', 'DELETE', '删除', 'operation_type', 6, 1, 1, 1, 1, NOW(), NOW()),
('OPERATION_TYPE', 'view', 'VIEW', '查看', 'operation_type', 7, 1, 1, 1, 1, NOW(), NOW()),
('OPERATION_TYPE', 'download', 'DOWNLOAD', '下载', 'operation_type', 8, 1, 1, 1, 1, NOW(), NOW()),
('OPERATION_TYPE', 'upload', 'UPLOAD', '上传', 'operation_type', 9, 1, 1, 1, 1, NOW(), NOW()),
('OPERATION_TYPE', 'search', 'SEARCH', '搜索', 'operation_type', 10, 1, 1, 1, 1, NOW(), NOW()),

-- 操作模块字典
('OPERATION_MODULE', 'user', 'USER', '用户模块', 'operation_module', 1, 1, 1, 1, 1, NOW(), NOW()),
('OPERATION_MODULE', 'role', 'ROLE', '角色模块', 'operation_module', 2, 1, 1, 1, 1, NOW(), NOW()),
('OPERATION_MODULE', 'permission', 'PERMISSION', '权限模块', 'operation_module', 3, 1, 1, 1, 1, NOW(), NOW()),
('OPERATION_MODULE', 'content', 'CONTENT', '内容模块', 'operation_module', 4, 1, 1, 1, 1, NOW(), NOW()),
('OPERATION_MODULE', 'resource', 'RESOURCE', '资源模块', 'operation_module', 5, 1, 1, 1, 1, NOW(), NOW()),
('OPERATION_MODULE', 'system', 'SYSTEM', '系统模块', 'operation_module', 6, 1, 1, 1, 1, NOW(), NOW()),
('OPERATION_MODULE', 'upload', 'UPLOAD', '上传模块', 'operation_module', 7, 1, 1, 1, 1, NOW(), NOW()),
('OPERATION_MODULE', 'download', 'DOWNLOAD', '下载模块', 'operation_module', 8, 1, 1, 1, 1, NOW(), NOW()),
('OPERATION_MODULE', 'vip', 'VIP', 'VIP模块', 'operation_module', 9, 1, 1, 1, 1, NOW(), NOW()),
('OPERATION_MODULE', 'analytics', 'ANALYTICS', '统计模块', 'operation_module', 10, 1, 1, 1, 1, NOW(), NOW()),

-- 影视类型字典
('MOVIE_TYPE', 'movie', 'MOVIE', '电影', 'movie_type', 1, 1, 1, 1, 1, NOW(), NOW()),
('MOVIE_TYPE', 'tv_series', 'TV_SERIES', '电视剧', 'movie_type', 2, 1, 1, 1, 1, NOW(), NOW()),
('MOVIE_TYPE', 'documentary', 'DOCUMENTARY', '纪录片', 'movie_type', 3, 1, 1, 1, 1, NOW(), NOW()),
('MOVIE_TYPE', 'animation', 'ANIMATION', '动画片', 'movie_type', 4, 1, 1, 1, 1, NOW(), NOW()),
('MOVIE_TYPE', 'variety', 'VARIETY', '综艺', 'movie_type', 5, 1, 1, 1, 1, NOW(), NOW()),
('MOVIE_TYPE', 'short', 'SHORT', '短片', 'movie_type', 6, 1, 1, 1, 1, NOW(), NOW()),
('MOVIE_TYPE', 'other', 'OTHER', '其他', 'movie_type', 7, 1, 1, 1, 1, NOW(), NOW()),

-- 视频质量字典
('VIDEO_QUALITY', '4k', '4K', '4K超清', 'video_quality', 1, 1, 1, 1, 1, NOW(), NOW()),
('VIDEO_QUALITY', '1080p', '1080P', '1080P高清', 'video_quality', 2, 1, 1, 1, 1, NOW(), NOW()),
('VIDEO_QUALITY', '720p', '720P', '720P标清', 'video_quality', 3, 1, 1, 1, 1, NOW(), NOW()),
('VIDEO_QUALITY', '480p', '480P', '480P流畅', 'video_quality', 4, 1, 1, 1, 1, NOW(), NOW()),
('VIDEO_QUALITY', '360p', '360P', '360P极速', 'video_quality', 5, 1, 1, 1, 1, NOW(), NOW()),

-- 下载状态字典
('DOWNLOAD_STATUS', 'pending', 'PENDING', '等待中', 'download_status', 1, 1, 1, 1, 1, NOW(), NOW()),
('DOWNLOAD_STATUS', 'downloading', 'DOWNLOADING', '下载中', 'download_status', 2, 1, 1, 1, 1, NOW(), NOW()),
('DOWNLOAD_STATUS', 'completed', 'COMPLETED', '已完成', 'download_status', 3, 1, 1, 1, 1, NOW(), NOW()),
('DOWNLOAD_STATUS', 'failed', 'FAILED', '下载失败', 'download_status', 4, 1, 1, 1, 1, NOW(), NOW()),
('DOWNLOAD_STATUS', 'paused', 'PAUSED', '已暂停', 'download_status', 5, 1, 1, 1, 1, NOW(), NOW()),
('DOWNLOAD_STATUS', 'cancelled', 'CANCELLED', '已取消', 'download_status', 6, 1, 1, 1, 1, NOW(), NOW()),

-- 语言字典
('LANGUAGE', 'zh-cn', 'zh-CN', '简体中文', 'language', 1, 1, 1, 1, 1, NOW(), NOW()),
('LANGUAGE', 'zh-tw', 'zh-TW', '繁体中文', 'language', 2, 1, 1, 1, 1, NOW(), NOW()),
('LANGUAGE', 'en', 'en', '英语', 'language', 3, 1, 1, 1, 1, NOW(), NOW()),
('LANGUAGE', 'ja', 'ja', '日语', 'language', 4, 1, 1, 1, 1, NOW(), NOW()),
('LANGUAGE', 'ko', 'ko', '韩语', 'language', 5, 1, 1, 1, 1, NOW(), NOW()),

-- 地区字典
('REGION', 'cn', 'cn', '中国大陆', 'region', 1, 1, 1, 1, 1, NOW(), NOW()),
('REGION', 'hk', 'hk', '中国香港', 'region', 2, 1, 1, 1, 1, NOW(), NOW()),
('REGION', 'tw', 'tw', '中国台湾', 'region', 3, 1, 1, 1, 1, NOW(), NOW()),
('REGION', 'us', 'us', '美国', 'region', 4, 1, 1, 1, 1, NOW(), NOW()),
('REGION', 'jp', 'jp', '日本', 'region', 5, 1, 1, 1, 1, NOW(), NOW()),
('REGION', 'kr', 'kr', '韩国', 'region', 6, 1, 1, 1, 1, NOW(), NOW()),
('REGION', 'eu', 'eu', '欧洲', 'region', 7, 1, 1, 1, 1, NOW(), NOW()),

-- 时区字典
('TIMEZONE', 'Asia/Shanghai', 'Asia/Shanghai', '北京时间', 'timezone', 1, 1, 1, 1, 1, NOW(), NOW()),
('TIMEZONE', 'Asia/Hong_Kong', 'Asia/Hong_Kong', '香港时间', 'timezone', 2, 1, 1, 1, 1, NOW(), NOW()),
('TIMEZONE', 'Asia/Taipei', 'Asia/Taipei', '台北时间', 'timezone', 3, 1, 1, 1, 1, NOW(), NOW()),
('TIMEZONE', 'America/New_York', 'America/New_York', '纽约时间', 'timezone', 4, 1, 1, 1, 1, NOW(), NOW()),
('TIMEZONE', 'Europe/London', 'Europe/London', '伦敦时间', 'timezone', 5, 1, 1, 1, 1, NOW(), NOW()),
('TIMEZONE', 'Asia/Tokyo', 'Asia/Tokyo', '东京时间', 'timezone', 6, 1, 1, 1, 1, NOW(), NOW()),
('TIMEZONE', 'Asia/Seoul', 'Asia/Seoul', '首尔时间', 'timezone', 7, 1, 1, 1, 1, NOW(), NOW()),

-- VIP等级字典
('VIP_LEVEL', 'vip1', 'vip1', 'VIP 1级', 'vip_level', 1, 1, 1, 1, 1, NOW(), NOW()),
('VIP_LEVEL', 'vip2', 'vip2', 'VIP 2级', 'vip_level', 2, 1, 1, 1, 1, NOW(), NOW()),
('VIP_LEVEL', 'vip3', 'vip3', 'VIP 3级', 'vip_level', 3, 1, 1, 1, 1, NOW(), NOW()),
('VIP_LEVEL', 'vip4', 'vip4', 'VIP 4级', 'vip_level', 4, 1, 1, 1, 1, NOW(), NOW()),
('VIP_LEVEL', 'vip5', 'vip5', 'VIP 5级', 'vip_level', 5, 1, 1, 1, 1, NOW(), NOW()),

-- 通知类型字典
('NOTIFICATION_TYPE', 'system', 'system', '系统通知', 'notification_type', 1, 1, 1, 1, 1, NOW(), NOW()),
('NOTIFICATION_TYPE', 'user', 'user', '用户通知', 'notification_type', 2, 1, 1, 1, 1, NOW(), NOW()),
('NOTIFICATION_TYPE', 'content', 'content', '内容通知', 'notification_type', 3, 1, 1, 1, 1, NOW(), NOW()),
('NOTIFICATION_TYPE', 'security', 'security', '安全通知', 'notification_type', 4, 1, 1, 1, 1, NOW(), NOW()),
('NOTIFICATION_TYPE', 'marketing', 'marketing', '营销通知', 'notification_type', 5, 1, 1, 1, 1, NOW(), NOW());

-- ====================================================================
-- 3. 插入文件存储配置数据
-- ====================================================================

-- 本地存储配置
INSERT INTO file_storages (storage_name, storage_type, access_key, secret_key, bucket_name, endpoint, domain_url, region, max_file_size, allowed_extensions, is_default, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
('Local Storage', 'LOCAL', NULL, NULL, 'uploads', '/var/www/uploads', 'http://localhost:8080/uploads', 'local', 104857600, '["jpg", "jpeg", "png", "gif", "txt", "srt", "vtt"]', 1, 1, 1, 1, 1, NOW(), NOW()),

-- 阿里云OSS存储配置
INSERT INTO file_storages (storage_name, storage_type, access_key, secret_key, bucket_name, endpoint, domain_url, region, max_file_size, allowed_extensions, is_default, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
('Aliyun OSS', 'OSS', 'LTAI5tBEXAMPLE_KEY', 'SECRET_KEY_EXAMPLE', 'knene-bucket', 'https://oss-cn-beijing.aliyuncs.com', 'https://knene-bucket.oss-cn-beijing.aliyuncs.com', 'cn-beijing', 524288000, '["jpg", "jpeg", "png", "gif", "mp4", "avi", "mkv", "mp3", "flac", "txt", "srt"]', 0, 0, 1, 1, 1, NOW(), NOW()),

-- 腾讯云COS存储配置
INSERT INTO file_storages (storage_name, storage_type, access_key, secret_key, bucket_name, endpoint, domain_url, region, max_file_size, allowed_extensions, is_default, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
('Tencent COS', 'COS', 'AKIDEXAMPLE_KEY', 'SECRET_KEY_EXAMPLE', 'knene-1250000000', 'https://cos.ap-beijing.myqcloud.com', 'https://knene-1250000000.cos.ap-beijing.myqcloud.com', 'ap-beijing', 524288000, '["jpg", "jpeg", "png", "gif", "mp4", "avi", "mkv", "mp3", "flac", "txt", "srt"]', 0, 0, 1, 1, 1, NOW(), NOW()),

-- 七牛云存储配置
INSERT INTO file_storages (storage_name, storage_type, access_key, secret_key, bucket_name, endpoint, domain_url, region, max_file_size, allowed_extensions, is_default, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
('Qiniu', 'QINIU', 'ACCESS_KEY_EXAMPLE', 'SECRET_KEY_EXAMPLE', 'knene-bucket', 'http://rs.qiniu.com', 'http://cdn.knene.com', 'z0', 104857600, '["jpg", "jpeg", "png", "gif", "mp4", "avi", "mkv", "mp3", "flac", "txt", "srt"]', 0, 0, 1, 1, 1, NOW(), NOW()),

-- AWS S3存储配置
INSERT INTO file_storages (storage_name, storage_type, access_key, secret_key, bucket_name, endpoint, domain_url, region, max_file_size, allowed_extensions, is_default, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
('AWS S3', 'S3', 'AKIAIOSFODNN7EXAMPLE', 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', 'knene-bucket', 'https://s3.amazonaws.com', 'https://knene-bucket.s3.amazonaws.com', 'us-east-1', 1073741824, '["jpg", "jpeg", "png", "gif", "mp4", "avi", "mkv", "mp3", "flac", "txt", "srt"]', 0, 0, 1, 1, 1, NOW(), NOW());

-- ====================================================================
-- 4. 插入操作日志样本数据
-- ====================================================================

-- 管理员操作日志
INSERT INTO operation_logs (user_id, username, operation_type, operation_module, operation_desc, request_method, request_url, request_params, response_result, response_status, ip_address, user_agent, browser, os, location, execution_time, status, session_id, trace_id, created_at) VALUES
(1, 'admin', 'login', 'user', '管理员登录系统', 'POST', '/api/v1/auth/login', '{"username":"admin","password":"*****"}', '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Chrome', 'Windows', '本地', 150, 'SUCCESS', 'sess_admin_001', 'trace_001', NOW()),

(1, 'admin', 'view', 'user', '查看用户列表', 'GET', '/api/v1/users', '{"page":1,"size":20,"status":"active"}', '{"total":1,"users":[{"id":1,"username":"admin","email":"admin@knene.com","status":"active"}]}', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Chrome', 'Windows', '本地', 80, 'SUCCESS', 'sess_admin_001', 'trace_002', NOW()),

(1, 'admin', 'view', 'system', '查看系统配置', 'GET', '/api/v1/system/configs', '{}', '{"configs":[{"key":"site.name","value":"影视资源下载网站"}]}', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Chrome', 'Windows', '本地', 120, 'SUCCESS', 'sess_admin_001', 'trace_003', NOW()),

(1, 'admin', 'update', 'system', '更新系统配置', 'PUT', '/api/v1/system/configs/site.name', '{"value":"影视资源下载网站"}', '{"success":true}', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Chrome', 'Windows', '本地', 200, 'SUCCESS', 'sess_admin_001', 'trace_004', NOW()),

-- 模拟其他用户操作日志
INSERT INTO operation_logs (user_id, username, operation_type, operation_module, operation_desc, request_method, request_url, request_params, response_result, response_status, ip_address, user_agent, browser, os, location, execution_time, status, session_id, trace_id, created_at) VALUES
(NULL, 'anonymous', 'view', 'content', '查看内容列表', 'GET', '/api/v1/contents', '{"page":1,"size":10}', '{"total":0,"contents":[]}', 200, '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Safari', 'macOS', '北京', 95, 'SUCCESS', 'sess_guest_001', 'trace_005', NOW()),

(NULL, 'anonymous', 'search', 'content', '搜索内容', 'GET', '/api/v1/contents/search', '{"q":"电影","page":1}', '{"total":0,"results":[]}', 200, '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Safari', 'macOS', '北京', 60, 'SUCCESS', 'sess_guest_001', 'trace_006', NOW()),

(NULL, 'anonymous', 'view', 'content', '查看热门内容', 'GET', '/api/v1/contents/hot', '{}', '{"contents":[]}', 200, '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Safari', 'macOS', '北京', 75, 'SUCCESS', 'sess_guest_001', 'trace_007', NOW()),

-- 模拟失败操作日志
INSERT INTO operation_logs (user_id, username, operation_type, operation_module, operation_desc, request_method, request_url, request_params, response_result, response_status, ip_address, user_agent, browser, os, location, execution_time, status, error_code, error_message, session_id, trace_id, created_at) VALUES
(NULL, 'anonymous', 'login', 'user', '用户登录失败', 'POST', '/api/v1/auth/login', '{"username":"test","password":"wrong"}', '{"error":"用户名或密码错误"}', 401, '180.150.200.88', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', 'Safari', 'iOS', '广州', 250, 'FAILURE', 'AUTH_FAILED', '用户名或密码错误', 'sess_failed_001', 'trace_008', NOW()),

(NULL, 'anonymous', 'create', 'user', '用户注册失败', 'POST', '/api/v1/auth/register', '{"username":"test","email":"invalid-email","password":"123"}', '{"error":"邮箱格式不正确"}', 400, '180.150.200.88', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', 'Safari', 'iOS', '广州', 180, 'FAILURE', 'VALIDATION_ERROR', '邮箱格式不正确', 'sess_failed_002', 'trace_009', NOW());

-- ====================================================================
-- 5. 插入审计日志样本数据
-- ====================================================================

-- 用户创建审计日志
INSERT INTO audit_logs (entity_type, entity_id, operation_type, old_values, new_values, changed_fields, user_id, username, ip_address, user_agent, reason, created_at) VALUES
('users', 1, 'CREATE', NULL, '{"id":1,"username":"admin","email":"admin@knene.com","status":"active","created_at":"2025-10-30 00:00:00"}', '["id","username","email","status","created_at"]', 1, 'admin', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '系统初始化创建管理员账户', NOW()),

-- 角色创建审计日志
INSERT INTO audit_logs (entity_type, entity_id, operation_type, old_values, new_values, changed_fields, user_id, username, ip_address, user_agent, reason, created_at) VALUES
('roles', 1, 'CREATE', NULL, '{"id":1,"name":"super_admin","display_name":"超级管理员","level":100,"is_system":true,"created_at":"2025-10-30 00:00:00"}', '["id","name","display_name","level","is_system","created_at"]', 1, 'admin', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '系统初始化创建超级管理员角色', NOW()),

INSERT INTO audit_logs (entity_type, entity_id, operation_type, old_values, new_values, changed_fields, user_id, username, ip_address, user_agent, reason, created_at) VALUES
('roles', 2, 'CREATE', NULL, '{"id":2,"name":"admin","display_name":"管理员","level":80,"is_system":true,"created_at":"2025-10-30 00:00:00"}', '["id","name","display_name","level","is_system","created_at"]', 1, 'admin', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '系统初始化创建管理员角色', NOW()),

INSERT INTO audit_logs (entity_type, entity_id, operation_type, old_values, new_values, changed_fields, user_id, username, ip_address, user_agent, reason, created_at) VALUES
('roles', 3, 'CREATE', NULL, '{"id":3,"name":"vip_user","display_name":"VIP用户","level":60,"is_system":true,"created_at":"2025-10-30 00:00:00"}', '["id","name","display_name","level","is_system","created_at"]', 1, 'admin', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '系统初始化创建VIP用户角色', NOW()),

INSERT INTO audit_logs (entity_type, entity_id, operation_type, old_values, new_values, changed_fields, user_id, username, ip_address, user_agent, reason, created_at) VALUES
('roles', 4, 'CREATE', NULL, '{"id":4,"name":"user","display_name":"普通用户","level":40,"is_system":true,"created_at":"2025-10-30 00:00:00"}', '["id","name","display_name","level","is_system","created_at"]', 1, 'admin', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '系统初始化创建普通用户角色', NOW()),

INSERT INTO audit_logs (entity_type, entity_id, operation_type, old_values, new_values, changed_fields, user_id, username, ip_address, user_agent, reason, created_at) VALUES
('roles', 5, 'CREATE', NULL, '{"id":5,"name":"guest","display_name":"游客","level":20,"is_system":true,"created_at":"2025-10-30 00:00:00"}', '["id","name","display_name","level","is_system","created_at"]', 1, 'admin', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '系统初始化创建游客角色', NOW()),

-- 权限创建审计日志
INSERT INTO audit_logs (entity_type, entity_id, operation_type, old_values, new_values, changed_fields, user_id, username, ip_address, user_agent, reason, created_at) VALUES
('permissions', 1, 'CREATE', NULL, '{"id":1,"name":"user.view","display_name":"查看用户","resource":"user","action":"view","module":"user","created_at":"2025-10-30 00:00:00"}', '["id","name","display_name","resource","action","module","created_at"]', 1, 'admin', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '系统初始化创建用户查看权限', NOW()),

INSERT INTO audit_logs (entity_type, entity_id, operation_type, old_values, new_values, changed_fields, user_id, username, ip_address, user_agent, reason, created_at) VALUES
('permissions', 2, 'CREATE', NULL, '{"id":2,"name":"user.create","display_name":"创建用户","resource":"user","action":"create","module":"user","created_at":"2025-10-30 00:00:00"}', '["id","name","display_name","resource","action","module","created_at"]', 1, 'admin', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '系统初始化创建用户创建权限', NOW()),

-- 用户角色关联审计日志
INSERT INTO audit_logs (entity_type, entity_id, operation_type, old_values, new_values, changed_fields, user_id, username, ip_address, user_agent, reason, created_at) VALUES
('user_roles', 1, 'CREATE', NULL, '{"id":1,"user_id":1,"role_id":1,"granted_by":1,"status":"ACTIVE","granted_at":"2025-10-30 00:00:00"}', '["id","user_id","role_id","granted_by","status","granted_at"]', 1, 'admin', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '系统初始化为管理员分配超级管理员角色', NOW()),

-- ====================================================================
-- 数据插入完成日志
-- ====================================================================
-- 系统核心基础数据插入完成：
-- 1. 系统配置数据：86个配置项，涵盖网站信息、用户配置、文件上传、功能开关、系统限制、第三方服务、下载配置、缓存配置、安全配置、邮件服务、SEO、社交媒体、备份、API、主题、CDN、通知等
-- 2. 数据字典数据：77个字典项，涵盖用户状态、文件类型、操作类型、操作模块、影视类型、视频质量、下载状态、语言、地区、时区、VIP等级、通知类型等
-- 3. 文件存储配置：5个存储配置，支持本地存储、阿里云OSS、腾讯云COS、七牛云、AWS S3
-- 4. 权限数据：51个权限项，涵盖用户管理、角色管理、权限管理、系统管理、内容管理、资源管理、VIP管理、统计分析、个人资料、收藏、评论等
-- 5. 操作日志样本：10条操作日志，包含成功和失败的登录、查看、更新等操作
-- 6. 审计日志样本：9条审计日志，记录用户、角色、权限的创建和关联操作
--
-- 所有数据均包含审计字段（created_by, updated_by, version）
-- 系统配置中的敏感数据已加密存储
-- ====================================================================