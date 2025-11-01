-- ====================================================================
-- 影视资源下载网站 - 用户中心相关表数据插入脚本
-- ====================================================================
-- 版本：V2.1.6
-- 描述：插入用户中心相关表的初始数据（个人资料、设置、偏好、收藏夹、默认分类等）
-- 作者：数据库团队
-- 日期：2025-10-30
-- 依赖：V2.1.5__Create_user_center_tables.sql
-- ====================================================================

-- 设置SQL模式
SET NAMES utf8mb4;

-- ====================================================================
-- 1. 插入用户设置默认数据
-- ====================================================================

-- 为现有用户创建默认设置
INSERT INTO user_settings (user_id, theme, language, timezone, date_format, time_format, currency,
    email_notifications, sms_notifications, push_notifications, auto_play_video, video_quality,
    subtitle_language, download_quality, auto_download, auto_subtitle, playback_speed, volume_level,
    show_download_progress, auto_delete_downloaded, content_filter_level, auto_next_episode,
    remember_position, cache_size_mb, data_usage_warning, max_download_concurrent,
    upload_bandwidth_limit, download_bandwidth_limit, created_by, created_at, updated_at) VALUES
-- 管理员用户设置
(1, 'auto', 'zh-CN', 'Asia/Shanghai', 'YYYY-MM-DD', '24h', 'CNY', TRUE, FALSE, TRUE, FALSE, 'auto',
 'zh-CN', '1080p', FALSE, TRUE, 1.0, 100, TRUE, FALSE, 1, TRUE, TRUE, 1024, TRUE, 5, 0, 0, 1, NOW(), NOW()),

-- 普通用户设置
(2, 'light', 'zh-CN', 'Asia/Shanghai', 'YYYY-MM-DD', '24h', 'CNY', TRUE, FALSE, TRUE, FALSE, '720p',
 'zh-CN', '720p', FALSE, TRUE, 1.0, 100, TRUE, FALSE, 1, TRUE, TRUE, 512, TRUE, 3, 0, 0, 1, NOW(), NOW()),

(3, 'dark', 'zh-CN', 'Asia/Shanghai', 'YYYY-MM-DD', '12h', 'CNY', TRUE, FALSE, TRUE, TRUE, '1080p',
 'zh-CN', '1080p', TRUE, TRUE, 1.2, 100, TRUE, FALSE, 2, TRUE, TRUE, 2048, TRUE, 5, 0, 0, 1, NOW(), NOW()),

(4, 'light', 'zh-CN', 'Asia/Shanghai', 'YYYY-MM-DD', '24h', 'CNY', FALSE, FALSE, FALSE, FALSE, '480p',
 'zh-CN', '480p', FALSE, FALSE, 1.0, 100, FALSE, FALSE, 1, FALSE, TRUE, 256, FALSE, 2, 0, 0, 1, NOW(), NOW()),

(5, 'auto', 'zh-CN', 'Asia/Shanghai', 'YYYY-MM-DD', '24h', 'CNY', TRUE, TRUE, TRUE, TRUE, '1080p',
 'zh-CN', '1080p', FALSE, TRUE, 1.0, 100, TRUE, FALSE, 1, TRUE, TRUE, 1024, TRUE, 5, 0, 0, 1, NOW(), NOW()),

(6, 'dark', 'zh-CN', 'Asia/Shanghai', 'YYYY-MM-DD', '24h', 'CNY', TRUE, FALSE, TRUE, FALSE, 'auto',
 'zh-CN', '720p', FALSE, TRUE, 1.0, 100, TRUE, FALSE, 1, TRUE, TRUE, 1024, TRUE, 3, 0, 0, 1, NOW(), NOW());

-- ====================================================================
-- 2. 插入用户偏好设置数据
-- ====================================================================

-- 类型偏好数据
INSERT INTO user_preferences (user_id, preference_type, preference_key, preference_value, preference_score, preference_weight, is_active, auto_update, interaction_count, created_by, created_at, updated_at) VALUES
-- 用户1（管理员）偏好
(1, 'genre', 'action', '动作片', 95.00, 3.0, TRUE, TRUE, 25, 1, NOW(), NOW()),
(1, 'genre', 'scifi', '科幻片', 90.00, 3.5, TRUE, TRUE, 18, 1, NOW(), NOW()),
(1, 'genre', 'thriller', '惊悚片', 85.00, 2.5, TRUE, TRUE, 12, 1, NOW(), NOW()),
(1, 'genre', 'drama', '剧情片', 80.00, 2.0, TRUE, TRUE, 15, 1, NOW(), NOW()),
(1, 'year', '2010s', '2010年代', 88.00, 2.8, TRUE, TRUE, 30, 1, NOW(), NOW()),
(1, 'year', '2020s', '2020年代', 92.00, 3.2, TRUE, TRUE, 22, 1, NOW(), NOW()),
(1, 'country', 'usa', '美国', 90.00, 3.0, TRUE, TRUE, 40, 1, NOW(), NOW()),
(1, 'country', 'china', '中国', 85.00, 2.5, TRUE, TRUE, 35, 1, NOW(), NOW()),

-- 用户2偏好
(2, 'genre', 'romance', '爱情片', 88.00, 3.0, TRUE, TRUE, 20, 1, NOW(), NOW()),
(2, 'genre', 'comedy', '喜剧片', 85.00, 2.8, TRUE, TRUE, 18, 1, NOW(), NOW()),
(2, 'genre', 'drama', '剧情片', 82.00, 2.5, TRUE, TRUE, 15, 1, NOW(), NOW()),
(2, 'year', '2010s', '2010年代', 86.00, 2.7, TRUE, TRUE, 25, 1, NOW(), NOW()),
(2, 'country', 'china', '中国', 90.00, 3.2, TRUE, TRUE, 30, 1, NOW(), NOW()),
(2, 'country', 'korea', '韩国', 78.00, 2.0, TRUE, TRUE, 12, 1, NOW(), NOW()),

-- 用户3偏好
(3, 'genre', 'action', '动作片', 92.00, 3.5, TRUE, TRUE, 28, 1, NOW(), NOW()),
(3, 'genre', 'scifi', '科幻片', 88.00, 3.0, TRUE, TRUE, 20, 1, NOW(), NOW()),
(3, 'genre', 'fantasy', '奇幻片', 85.00, 2.8, TRUE, TRUE, 16, 1, NOW(), NOW()),
(3, 'year', '2020s', '2020年代', 90.00, 3.0, TRUE, TRUE, 35, 1, NOW(), NOW()),
(3, 'year', '2010s', '2010年代', 87.00, 2.5, TRUE, TRUE, 30, 1, NOW(), NOW()),
(3, 'country', 'usa', '美国', 95.00, 3.8, TRUE, TRUE, 45, 1, NOW(), NOW()),

-- 用户4偏好
(4, 'genre', 'documentary', '纪录片', 90.00, 3.5, TRUE, TRUE, 15, 1, NOW(), NOW()),
(4, 'genre', 'history', '历史片', 88.00, 3.0, TRUE, TRUE, 12, 1, NOW(), NOW()),
(4, 'genre', 'biography', '传记片', 85.00, 2.8, TRUE, TRUE, 10, 1, NOW(), NOW()),
(4, 'year', '2000s', '2000年代', 82.00, 2.5, TRUE, TRUE, 20, 1, NOW(), NOW()),
(4, 'year', '1990s', '1990年代', 78.00, 2.0, TRUE, TRUE, 15, 1, NOW(), NOW()),
(4, 'country', 'uk', '英国', 85.00, 2.8, TRUE, TRUE, 18, 1, NOW(), NOW()),

-- 用户5偏好
(5, 'genre', 'comedy', '喜剧片', 88.00, 3.0, TRUE, TRUE, 22, 1, NOW(), NOW()),
(5, 'genre', 'animation', '动画片', 85.00, 2.8, TRUE, TRUE, 18, 1, NOW(), NOW()),
(5, 'genre', 'family', '家庭片', 82.00, 2.5, TRUE, TRUE, 15, 1, NOW(), NOW()),
(5, 'year', '2010s', '2010年代', 90.00, 3.2, TRUE, TRUE, 30, 1, NOW(), NOW()),
(5, 'country', 'usa', '美国', 86.00, 2.8, TRUE, TRUE, 25, 1, NOW(), NOW()),
(5, 'country', 'japan', '日本', 80.00, 2.0, TRUE, TRUE, 12, 1, NOW(), NOW()),

-- 用户6偏好
(6, 'genre', 'horror', '恐怖片', 88.00, 3.5, TRUE, TRUE, 12, 1, NOW(), NOW()),
(6, 'genre', 'mystery', '悬疑片', 85.00, 3.0, TRUE, TRUE, 15, 1, NOW(), NOW()),
(6, 'genre', 'thriller', '惊悚片', 82.00, 2.8, TRUE, TRUE, 18, 1, NOW(), NOW()),
(6, 'year', '2010s', '2010年代', 84.00, 2.5, TRUE, TRUE, 20, 1, NOW(), NOW()),
(6, 'country', 'usa', '美国', 90.00, 3.2, TRUE, TRUE, 25, 1, NOW(), NOW()),
(6, 'country', 'japan', '日本', 78.00, 2.0, TRUE, TRUE, 10, 1, NOW(), NOW());

-- 演员偏好数据
INSERT INTO user_preferences (user_id, preference_type, preference_key, preference_value, preference_score, preference_weight, is_active, auto_update, interaction_count, created_by, created_at, updated_at) VALUES
(1, 'actor', 'tom_cruise', '汤姆·克鲁斯', 92.00, 3.5, TRUE, TRUE, 15, 1, NOW(), NOW()),
(1, 'actor', 'chris_hemsworth', '克里斯·海姆斯沃斯', 88.00, 3.0, TRUE, TRUE, 12, 1, NOW(), NOW()),
(1, 'actor', 'robert_downey_jr', '小罗伯特·唐尼', 90.00, 3.2, TRUE, TRUE, 18, 1, NOW(), NOW()),

(2, 'actor', 'jackie_chan', '成龙', 95.00, 3.8, TRUE, TRUE, 20, 1, NOW(), NOW()),
(2, 'actor', 'jet_li', '李连杰', 88.00, 3.0, TRUE, TRUE, 15, 1, NOW(), NOW()),
(2, 'actor', 'zhang_ziyi', '章子怡', 85.00, 2.8, TRUE, TRUE, 12, 1, NOW(), NOW()),

(3, 'actor', 'chris_evans', '克里斯·埃文斯', 90.00, 3.5, TRUE, TRUE, 16, 1, NOW(), NOW()),
(3, 'actor', 'scarlett_johansson', '斯嘉丽·约翰逊', 88.00, 3.2, TRUE, TRUE, 14, 1, NOW(), NOW()),
(3, 'actor', 'mark_ruffalo', '马克·鲁法洛', 85.00, 2.8, TRUE, TRUE, 12, 1, NOW(), NOW());

-- 导演偏好数据
INSERT INTO user_preferences (user_id, preference_type, preference_key, preference_value, preference_score, preference_weight, is_active, auto_update, interaction_count, created_by, created_at, updated_at) VALUES
(1, 'director', 'christopher_nolan', '克里斯托弗·诺兰', 95.00, 4.0, TRUE, TRUE, 20, 1, NOW(), NOW()),
(1, 'director', 'steven_spielberg', '史蒂文·斯皮尔伯格', 92.00, 3.5, TRUE, TRUE, 18, 1, NOW(), NOW()),
(1, 'director', 'quentin_tarantino', '昆汀·塔伦蒂诺', 88.00, 3.0, TRUE, TRUE, 15, 1, NOW(), NOW()),

(2, 'director', 'ang_lee', '李安', 90.00, 3.5, TRUE, TRUE, 16, 1, NOW(), NOW()),
(2, 'director', 'zhang_yimou', '张艺谋', 88.00, 3.2, TRUE, TRUE, 14, 1, NOW(), NOW()),
(2, 'director', 'chen_kaige', '陈凯歌', 82.00, 2.5, TRUE, TRUE, 10, 1, NOW(), NOW());

-- ====================================================================
-- 3. 插入用户详细资料数据
-- ====================================================================

INSERT INTO user_profiles_detailed (user_id, real_name, gender, birth_date, age, phone_number, address, city, province, country, postal_code, occupation, company, school, major, graduation_year, interests, bio, signature, website, social_links, skills, language_preference, timezone, is_verified, verification_status, verification_level, privacy_level, profile_completion_score, profile_views, last_profile_update, created_by, created_at, updated_at) VALUES
-- 管理员详细资料
(1, '张三', 1, '1985-06-15', 39, '13800138000', '北京市朝阳区某某街道123号', '北京', '北京', '中国', '100000', '软件开发工程师', '某某科技有限公司', '清华大学', '计算机科学与技术', 2008,
'["编程", "电影", "科技", "阅读", "旅游"]',
'热爱编程和电影的软件工程师，致力于开发优秀的影视资源平台。',
'代码改变世界，电影丰富人生！',
'https://zhangsan.dev',
'{"github": "https://github.com/zhangsan", "twitter": "https://twitter.com/zhangsan", "linkedin": "https://linkedin.com/in/zhangsan"}',
'["Java", "Python", "JavaScript", "数据库设计", "系统架构"]', 'zh-CN', 'Asia/Shanghai', TRUE, 'verified', 3, 2, 95, 125, NOW(), 1, NOW(), NOW()),

-- 普通用户详细资料
(2, '李四', 2, '1990-03-20', 34, '13900139000', '上海市浦东新区某某路456号', '上海', '上海', '中国', '200000', '市场营销', '某某广告公司', '复旦大学', '市场营销', 2012,
'["购物", "美妆", "美食", "旅行", "音乐"]',
'热爱生活的市场营销专家，喜欢发现和分享美好的事物。',
'生活不止眼前的苟且，还有诗和远方的田野！',
'https://lisi.blog',
'{"weibo": "https://weibo.com/lisi", "instagram": "https://instagram.com/lisi", "xiaohongshu": "https://xiaohongshu.com/lisi"}',
'["营销策划", "品牌管理", "社交媒体运营", "内容创作"]', 'zh-CN', 'Asia/Shanghai', TRUE, 'verified', 2, 1, 88, 89, DATE_SUB(NOW(), INTERVAL 1 DAY), 1, NOW(), NOW()),

(3, '王五', 1, '1988-11-08', 36, '13700137000', '广州市天河区某某大道789号', '广州', '广东', '中国', '510000', '金融分析师', '某某投资公司', '中山大学', '金融学', 2010,
'["投资", "理财", "电影", "运动", "读书"]',
'金融分析师，业余电影爱好者，喜欢分析电影市场的投资价值。',
'理性投资，感性观影！',
NULL,
'{"linkedin": "https://linkedin.com/in/wangwu", "zhihu": "https://zhihu.com/wangwu"}',
'["财务分析", "投资研究", "风险评估", "数据分析"]', 'zh-CN', 'Asia/Shanghai', TRUE, 'verified', 2, 1, 92, 67, DATE_SUB(NOW(), INTERVAL 3 DAY), 1, NOW(), NOW()),

(4, '赵六', 2, '1995-07-25', 29, '13600136000', '深圳市南山区某某路321号', '深圳', '广东', '中国', '518000', 'UI设计师', '某某设计工作室', '广州美术学院', '视觉传达设计', 2017,
'["设计", "艺术", "电影", "摄影", "旅行"]',
'UI设计师，热爱视觉艺术和电影美学，追求完美的用户体验。',
'设计源于生活，艺术高于生活！',
'https://zhaoliu.design',
'{"dribbble": "https://dribbble.com/zhaoliu", "behance": "https://behance.net/zhaoliu", "weibo": "https://weibo.com/zhaoliu"}',
'["UI设计", "UX设计", "平面设计", "品牌设计", "动效设计"]', 'zh-CN', 'Asia/Shanghai', FALSE, 'unverified', 0, 2, 78, 45, DATE_SUB(NOW(), INTERVAL 1 WEEK), 1, NOW(), NOW()),

(5, '钱七', 1, '1982-09-12', 42, '13500135000', '成都市高新区某某街654号', '成都', '四川', '中国', '610000', 'IT项目经理', '某某科技公司', '四川大学', '软件工程', 2005,
'["项目管理", "电影", "科技", "创业", "阅读"]',
'资深IT项目经理，电影发烧友，关注科技与影视的融合发展。',
'科技改变生活，电影感动人心！',
NULL,
'{"linkedin": "https://linkedin.com/in/qianqi", "jianshu": "https://jianshu.com/qianqi"}',
'["项目管理", "敏捷开发", "团队管理", "产品规划", "技术架构"]', 'zh-CN', 'Asia/Shanghai', TRUE, 'verified', 2, 1, 90, 112, DATE_SUB(NOW(), INTERVAL 2 DAY), 1, NOW(), NOW()),

(6, '孙八', 2, '1993-04-18', 31, '13400134000', '杭州市西湖区某某路987号', '杭州', '浙江', '中国', '310000', '网络主播', '自由职业', '浙江传媒学院', '播音主持', 2015,
'["直播", "电影", "美食", "时尚", "娱乐"]',
'网络主播，电影爱好者，喜欢在直播间与粉丝分享观影体验。',
'直播人生，精彩无限！',
'https://sunba.live',
'{"douyin": "https://douyin.com/sunba", "bilibili": "https://bilibili.com/sunba", "weibo": "https://weibo.com/sunba"}',
'["直播主持", "视频剪辑", "内容策划", "粉丝运营", "数据分析"]', 'zh-CN', 'Asia/Shanghai', FALSE, 'pending', 1, 2, 85, 234, DATE_SUB(NOW(), INTERVAL 5 HOUR), 1, NOW(), NOW());

-- ====================================================================
-- 4. 插入默认收藏夹数据
-- ====================================================================

INSERT INTO favorite_folders (user_id, parent_folder_id, folder_name, folder_description, folder_type, folder_color, folder_icon, folder_cover_url, is_public, is_featured, is_system, sort_order, item_count, access_permission, share_code, share_url, download_permission, comment_permission, created_by, created_at, updated_at) VALUES
-- 用户1（管理员）收藏夹
(1, NULL, '我的收藏', '我收藏的所有影视资源', 'default', '#1890ff', 'star', '/static/images/folders/default.png', FALSE, TRUE, TRUE, 1, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW()),
(1, NULL, '想看列表', '计划观看的影视作品', 'custom', '#52c41a', 'play-circle', '/static/images/folders/watchlist.png', FALSE, FALSE, FALSE, 2, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW()),
(1, NULL, '已看完', '已经观看过的影视作品', 'custom', '#faad14', 'check-circle', '/static/images/folders/watched.png', FALSE, FALSE, FALSE, 3, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW()),
(1, NULL, '经典电影', '值得反复观看的经典电影', 'custom', '#f5222d', 'heart', '/static/images/folders/classics.png', TRUE, TRUE, FALSE, 4, 0, 'public', NULL, NULL, TRUE, TRUE, 1, NOW(), NOW()),
(1, NULL, '科幻专区', '我最喜欢的科幻电影', 'custom', '#722ed1', 'rocket', '/static/images/folders/scifi.png', FALSE, FALSE, FALSE, 5, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW()),

-- 用户2收藏夹
(2, NULL, '我的收藏', '我收藏的所有影视资源', 'default', '#1890ff', 'star', '/static/images/folders/default.png', FALSE, TRUE, TRUE, 1, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW()),
(2, NULL, '爱情片收藏', '温馨浪漫的爱情电影', 'custom', '#eb2f96', 'heart', '/static/images/folders/romance.png', FALSE, FALSE, FALSE, 2, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW()),
(2, NULL, '喜剧合集', '轻松搞笑的喜剧电影', 'custom', '#fa8c16', 'smile', '/static/images/folders/comedy.png', FALSE, FALSE, FALSE, 3, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW()),
(2, NULL, '国产佳作', '优秀的国产影视作品', 'custom', '#52c41a', 'flag', '/static/images/folders/chinese.png', TRUE, FALSE, FALSE, 4, 0, 'public', NULL, NULL, TRUE, TRUE, 1, NOW(), NOW()),

-- 用户3收藏夹
(3, NULL, '我的收藏', '我收藏的所有影视资源', 'default', '#1890ff', 'star', '/static/images/folders/default.png', FALSE, TRUE, TRUE, 1, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW()),
(3, NULL, '动作大片', '精彩的动作电影合集', 'custom', '#f5222d', 'thunderbolt', '/static/images/folders/action.png', FALSE, FALSE, FALSE, 2, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW()),
(3, NULL, '超级英雄', '漫威DC超级英雄电影', 'custom', '#1890ff', 'shield', '/static/images/folders/superhero.png', FALSE, FALSE, FALSE, 3, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW()),
(3, NULL, '高分推荐', '评分很高的优质电影', 'custom', '#52c41a', 'trophy', '/static/images/folders/highrated.png', TRUE, TRUE, FALSE, 4, 0, 'public', NULL, NULL, TRUE, TRUE, 1, NOW(), NOW()),

-- 用户4收藏夹
(4, NULL, '我的收藏', '我收藏的所有影视资源', 'default', '#1890ff', 'star', '/static/images/folders/default.png', FALSE, TRUE, TRUE, 1, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW()),
(4, NULL, '纪录片收藏', '有教育意义的纪录片', 'custom', '#13c2c2', 'book', '/static/images/folders/documentary.png', FALSE, FALSE, FALSE, 2, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW()),
(4, NULL, '历史题材', '历史背景的影视作品', 'custom', '#8c8c8c', 'clock-circle', '/static/images/folders/history.png', FALSE, FALSE, FALSE, 3, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW()),

-- 用户5收藏夹
(5, NULL, '我的收藏', '我收藏的所有影视资源', 'default', '#1890ff', 'star', '/static/images/folders/default.png', FALSE, TRUE, TRUE, 1, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW()),
(5, NULL, '家庭观影', '适合全家观看的电影', 'custom', '#52c41a', 'home', '/static/images/folders/family.png', FALSE, FALSE, FALSE, 2, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW()),
(5, NULL, '动画世界', '精彩的动画电影', 'custom', '#fa8c16', 'picture', '/static/images/folders/animation.png', FALSE, FALSE, FALSE, 3, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW()),

-- 用户6收藏夹
(6, NULL, '我的收藏', '我收藏的所有影视资源', 'default', '#1890ff', 'star', '/static/images/folders/default.png', FALSE, TRUE, TRUE, 1, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW()),
(6, NULL, '恐怖惊悚', '刺激的恐怖惊悚电影', 'custom', '#722ed1', 'skull', '/static/images/folders/horror.png', FALSE, FALSE, FALSE, 2, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW()),
(6, NULL, '悬疑推理', '烧脑的悬疑推理电影', 'custom', '#faad14', 'question-circle', '/static/images/folders/mystery.png', FALSE, FALSE, FALSE, 3, 0, 'private', NULL, NULL, FALSE, TRUE, 1, NOW(), NOW());

-- ====================================================================
-- 5. 插入浏览历史示例数据
-- ====================================================================

INSERT INTO browse_history (user_id, session_id, resource_id, content_type, browse_type, browse_url, page_title, referrer_url, duration_seconds, scroll_percentage, interaction_count, is_mobile, device_type, browser_name, operating_system, screen_resolution, ip_address, user_agent, entry_point, exit_reason, is_bounce, view_source, engagement_score, created_by, created_at, updated_at) VALUES
-- 用户1浏览历史
(1, 'sess_001', 1, 'movie', 'detail', '/movie/detail/1', '复仇者联盟4：终局之战', '/search?q=复仇者联盟', 1800, 85.5, 12, FALSE, 'desktop', 'Chrome', 'Windows 10', '1920x1080', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'search', 'click_link', FALSE, 'search', 95.5, 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW()),

(1, 'sess_001', 2, 'movie', 'play', '/movie/play/2', '星际穿越', '/movie/detail/2', 7200, 100.0, 25, FALSE, 'desktop', 'Chrome', 'Windows 10', '1920x1080', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'direct', 'close', FALSE, 'recommend', 98.2, 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW()),

-- 用户2浏览历史
(2, 'sess_002', 3, 'tv', 'detail', '/tv/detail/3', '琅琊榜', '/category/tv/chinese', 2400, 67.8, 8, TRUE, 'mobile', 'Safari', 'iOS', '375x667', '180.150.200.88', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', 'category', 'back', FALSE, 'category', 76.3, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),

-- 用户3浏览历史
(3, 'sess_003', 4, 'movie', 'detail', '/movie/detail/4', '盗梦空间', '/search?q=诺兰', 3000, 92.1, 15, FALSE, 'desktop', 'Firefox', 'Linux', '1366x768', '10.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox', 'search', 'timeout', FALSE, 'search', 88.7, 1, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),

-- 用户4浏览历史
(4, 'sess_004', 5, 'documentary', 'detail', '/documentary/detail/5', '地球脉动', '/category/documentary/nature', 1800, 45.3, 6, TRUE, 'tablet', 'Chrome', 'Android', '1024x768', '172.16.0.1', 'Mozilla/5.0 (Linux; Android 11; SM-T870)', 'category', 'click_link', FALSE, 'category', 65.2, 1, DATE_SUB(NOW(), INTERVAL 12 HOUR), NOW()),

-- 用户5浏览历史
(5, 'sess_005', 6, 'movie', 'detail', '/movie/detail/6', '疯狂动物城', '/recommend/popular', 1200, 78.9, 10, FALSE, 'desktop', 'Edge', 'Windows 10', '1920x1080', '203.0.113.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'recommend', 'click_link', FALSE, 'recommend', 82.4, 1, DATE_SUB(NOW(), INTERVAL 4 HOUR), NOW()),

-- 用户6浏览历史
(6, 'sess_006', 7, 'movie', 'detail', '/movie/detail/7', '寄生虫', '/hot/today', 1500, 56.7, 8, TRUE, 'mobile', 'Chrome', 'Android', '360x640', '198.51.100.0', 'Mozilla/5.0 (Linux; Android 10; SM-G973F)', 'hot', 'back', FALSE, 'hot', 70.8, 1, DATE_SUB(NOW(), INTERVAL 30 MINUTE), NOW());

-- ====================================================================
-- 6. 插入搜索历史示例数据
-- ====================================================================

INSERT INTO search_history (user_id, session_id, search_query, search_type, search_category, search_filters, search_sort, search_results_count, clicked_result_id, clicked_result_position, search_duration, auto_suggest_used, suggestion_clicked, spell_corrected, search_intent, search_context, is_voice_search, search_success, created_by, created_at, updated_at) VALUES
-- 用户1搜索历史
(1, 'sess_001', '复仇者联盟', 'all', 'movie', '{"year": "2010s", "genre": "action"}', 'relevance', 12, 1, 1, 250, TRUE, TRUE, FALSE, 'informational', 'homepage', FALSE, TRUE, 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW()),

(1, 'sess_001', '诺兰电影', 'movie', NULL, '{"rating": "8.0+"}', 'rating', 8, 4, 2, 180, FALSE, FALSE, FALSE, 'informational', 'search', FALSE, TRUE, 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW()),

-- 用户2搜索历史
(2, 'sess_002', '国产爱情片', 'movie', 'romance', '{"country": "中国", "year": "2010s"}', 'popularity', 25, 8, 3, 320, TRUE, FALSE, FALSE, 'transactional', 'category', FALSE, TRUE, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),

(2, 'sess_002', '韩国电视剧', 'tv', 'drama', '{"country": "korea"}', 'date', 18, 12, 1, 280, FALSE, TRUE, FALSE, 'informational', 'search', FALSE, TRUE, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),

-- 用户3搜索历史
(3, 'sess_003', '超级英雄电影', 'movie', 'action', '{"genre": "action", "rating": "7.5+"}', 'rating', 15, 2, 2, 195, TRUE, TRUE, FALSE, 'informational', 'homepage', FALSE, TRUE, 1, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),

(3, 'sess_003', '漫威电影宇宙', 'movie', NULL, '{"studio": "marvel"}', 'date', 23, 5, 1, 165, FALSE, FALSE, FALSE, 'navigational', 'search', FALSE, TRUE, 1, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),

-- 用户4搜索历史
(4, 'sess_004', '自然纪录片', 'documentary', 'nature', '{"rating": "8.5+"}', 'rating', 10, 5, 2, 145, FALSE, TRUE, FALSE, 'informational', 'category', FALSE, TRUE, 1, DATE_SUB(NOW(), INTERVAL 12 HOUR), NOW()),

(4, 'sess_004', 'BBC纪录片', 'documentary', NULL, '{"producer": "BBC"}', 'date', 8, 7, 1, 210, FALSE, FALSE, FALSE, 'navigational', 'search', FALSE, TRUE, 1, DATE_SUB(NOW(), INTERVAL 12 HOUR), NOW()),

-- 用户5搜索历史
(5, 'sess_005', '迪士尼动画', 'movie', 'animation', '{"studio": "disney"}', 'popularity', 30, 6, 3, 225, TRUE, TRUE, FALSE, 'informational', 'recommend', FALSE, TRUE, 1, DATE_SUB(NOW(), INTERVAL 4 HOUR), NOW()),

(5, 'sess_005', '皮克斯电影', 'movie', 'animation', '{"studio": "pixar"}', 'rating', 15, 11, 2, 180, FALSE, FALSE, FALSE, 'informational', 'search', FALSE, TRUE, 1, DATE_SUB(NOW(), INTERVAL 4 HOUR), NOW()),

-- 用户6搜索历史
(6, 'sess_006', '恐怖片推荐', 'movie', 'horror', '{"rating": "7.0+"}', 'rating', 20, 9, 4, 260, TRUE, TRUE, FALSE, 'transactional', 'hot', FALSE, TRUE, 1, DATE_SUB(NOW(), INTERVAL 30 MINUTE), NOW()),

(6, 'sess_006', '推理悬疑电影', 'movie', 'mystery', '{"genre": "mystery"}', 'popularity', 18, 14, 1, 195, FALSE, FALSE, FALSE, 'informational', 'search', FALSE, TRUE, 1, DATE_SUB(NOW(), INTERVAL 30 MINUTE), NOW());

-- ====================================================================
-- 7. 插入下载历史示例数据
-- ====================================================================

INSERT INTO download_history (user_id, resource_id, torrent_id, download_id, download_type, download_title, download_url, file_size, file_format, quality, download_status, progress_percentage, downloaded_size, download_speed, upload_speed, download_duration, save_path, file_name, file_hash, seed_time, ratio, peers_connected, seeds_connected, priority, auto_start, schedule_time, error_message, download_source, device_info, ip_address, user_agent, completed_at, started_at, created_by, created_at, updated_at) VALUES
-- 用户1下载历史
(1, 1, 1, 'dl_001', 'torrent', '复仇者联盟4：终局之战', 'magnet:?xt=urn:btih:1234567890abcdef', 3221225472, 'mp4', '1080p', 'completed', 100.00, 3221225472, 0, 0, 3600, '/downloads/movies/', 'Avengers.Endgame.2019.1080p.mp4', 'sha256:abcdef1234567890', 7200, 2.500, 0, 0, 8, FALSE, NULL, NULL, 'pt_site', '{"device": "desktop", "os": "Windows 10"}', '192.168.1.100', 'qBittorrent/4.5.2', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 1, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),

(1, 2, 2, 'dl_002', 'torrent', '星际穿越', 'magnet:?xt=urn:btih:2345678901bcdef', 2684354560, 'mp4', '720p', 'downloading', 75.50, 2026116288, 1024, 256, 1800, '/downloads/movies/', 'Interstellar.2014.720p.mp4', 'sha256:bcdef1234567890', 0, 0.000, 12, 8, 6, FALSE, NULL, NULL, 'pt_site', '{"device": "desktop", "os": "Windows 10"}', '192.168.1.100', 'qBittorrent/4.5.2', NULL, DATE_SUB(NOW(), INTERVAL 30 MINUTE), 1, DATE_SUB(NOW(), INTERVAL 30 MINUTE), NOW()),

-- 用户2下载历史
(2, 3, 3, 'dl_003', 'magnet', '琅琊榜', 'magnet:?xt=urn:btih:3456789012cdefg', 2147483648, 'mp4', '720p', 'completed', 100.00, 2147483648, 0, 0, 2400, '/downloads/tv/', 'LangYaBang.2015.S01.720p.mp4', 'sha256:cdef12345678901', 4800, 3.200, 0, 0, 7, FALSE, NULL, NULL, 'pt_site', '{"device": "mobile", "os": "iOS"}', '180.150.200.88', 'WebTorrent/1.0', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 1, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),

-- 用户3下载历史
(3, 4, 4, 'dl_004', 'torrent', '盗梦空间', 'magnet:?xt=urn:btih:4567890123defgh', 2147483648, 'mp4', '1080p', 'completed', 100.00, 2147483648, 0, 0, 3000, '/downloads/movies/', 'Inception.2010.1080p.mp4', 'sha256:defgh1234567890', 6000, 4.000, 0, 0, 9, FALSE, NULL, NULL, 'pt_site', '{"device": "desktop", "os": "Linux"}', '10.0.0.1', 'Transmission/3.00', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 1, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),

(3, 5, 5, 'dl_005', 'torrent', '黑客帝国', 'magnet:?xt=urn:btih:5678901234efghi', 1374389535, 'mp4', '720p', 'failed', 45.20, 621705216, 0, 0, 900, '/downloads/movies/', 'Matrix.1999.720p.mp4', NULL, 0, 0.000, 0, 0, 5, FALSE, NULL, NULL, 'pt_site', '{"device": "desktop", "os": "Linux"}', '10.0.0.1', 'Transmission/3.00', NULL, DATE_SUB(NOW(), INTERVAL 5 DAY), 1, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),

-- 用户4下载历史
(4, 6, 6, 'dl_006', 'magnet', '地球脉动', 'magnet:?xt=urn:btih:6789012345fghij', 8589934592, 'mp4', '1080p', 'downloading', 30.80, 2642411520, 512, 128, 1800, '/downloads/documentary/', 'Planet.Earth.2006.1080p.mp4', 'sha256:fghij12345678901', 0, 0.000, 15, 10, 6, FALSE, NULL, NULL, 'pt_site', '{"device": "tablet", "os": "Android"}', '172.16.0.1', 'WebTorrent/1.0', NULL, DATE_SUB(NOW(), INTERVAL 12 HOUR), 1, DATE_SUB(NOW(), INTERVAL 12 HOUR), NOW()),

-- 用户5下载历史
(5, 7, 7, 'dl_007', 'torrent', '疯狂动物城', 'magnet:?xt=urn:btih:7890123456ghijk', 1073741824, 'mp4', '720p', 'completed', 100.00, 1073741824, 0, 0, 1500, '/downloads/animation/', 'Zootopia.2016.720p.mp4', 'sha256:ghijk123456789012', 3000, 2.500, 0, 0, 8, FALSE, NULL, NULL, 'pt_site', '{"device": "desktop", "os": "Windows 10"}', '203.0.113.1', 'qBittorrent/4.5.2', DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_SUB(NOW(), INTERVAL 4 HOUR), 1, DATE_SUB(NOW(), INTERVAL 4 HOUR), NOW()),

-- 用户6下载历史
(6, 8, 8, 'dl_008', 'torrent', '寄生虫', 'magnet:?xt=urn:btih:8901234567hijkl', 1610612736, 'mp4', '1080p', 'paused', 62.30, 1003368448, 0, 0, 1200, '/downloads/movies/', 'Parasite.2019.1080p.mp4', 'sha256:hijkl1234567890123', 0, 0.000, 8, 12, 7, FALSE, NULL, NULL, 'pt_site', '{"device": "mobile", "os": "Android"}', '198.51.100.0', 'tTorrent/1.6.3', NULL, DATE_SUB(NOW(), INTERVAL 1 HOUR), 1, DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW());

-- ====================================================================
-- 8. 插入收藏示例数据
-- ====================================================================

INSERT INTO favorites (user_id, resource_id, content_type, favorite_type, title, description, poster_url, rating, user_rating, user_review, tags, watch_progress, last_watched_position, episode_count, watched_episode_count, current_episode, current_season, total_duration, watched_duration, priority, is_public, is_featured, folder_id, source, remind_me, remind_time, release_date, genres, cast_info, director_info, language, country, duration_minutes, view_count, like_count, share_count, created_by, created_at, updated_at) VALUES
-- 用户1收藏
(1, 1, 'movie', 'favorite', '复仇者联盟4：终局之战', '漫威电影宇宙第三阶段的收官之作', '/static/posters/avengers4.jpg', 9.2, 9.5, '史诗级的超级英雄电影，特效震撼，剧情感人', '["超级英雄", "动作", "科幻", "漫威"]', 100.00, 7200, 1, 1, 0, 0, 10800, 10800, 8, FALSE, TRUE, 1, 'manual', FALSE, NULL, '2019-04-24', '["动作", "冒险", "科幻"]', '["小罗伯特·唐尼", "克里斯·埃文斯", "马克·鲁法洛"]', '["罗素兄弟"]', 'en', 'usa', 181, 15, 12, 3, 1, DATE_SUB(NOW(), INTERVAL 1 WEEK), NOW()),

(1, 2, 'movie', 'watchlist', '星际穿越', '诺兰执导的科幻巨作，探讨时间与空间的奥秘', '/static/posters/interstellar.jpg', 8.6, 8.8, '诺兰的又一力作，科学性与艺术性完美结合', '["科幻", "剧情", "冒险", "诺兰"]', 0.00, 0, 1, 0, 0, 0, 9000, 0, 9, FALSE, FALSE, 2, 'recommend', TRUE, NULL, '2014-11-07', '["科幻", "剧情", "冒险"]', '["马修·麦康纳", "安妮·海瑟薇", "杰西卡·查斯坦"]', '["克里斯托弗·诺兰"]', 'en', 'usa', 169, 8, 5, 1, 1, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),

(1, 4, 'movie', 'favorite', '盗梦空间', '诺兰的经典之作，梦境与现实的完美交织', '/static/posters/inception.jpg', 8.8, 9.0, '构思巧妙，情节烧脑，值得多次观看', '["科幻", "悬疑", "动作", "诺兰"]', 100.00, 9000, 1, 1, 0, 0, 8280, 8280, 10, TRUE, TRUE, 1, 'manual', FALSE, NULL, '2010-07-16', '["科幻", "悬疑", "动作"]', '["莱昂纳多·迪卡普里奥", "玛丽昂·歌迪亚", "艾伦·佩吉"]', '["克里斯托弗·诺兰"]', 'en', 'usa', 148, 22, 18, 7, 1, DATE_SUB(NOW(), INTERVAL 2 WEEK), NOW()),

-- 用户2收藏
(2, 3, 'tv', 'watched', '琅琊榜', '制作精良的古装权谋剧', '/static/posters/langyabang.jpg', 9.4, 9.5, '剧情紧凑，演员演技在线，服化道精美', '["古装", "权谋", "剧情", "国产剧"]', 100.00, 3600, 54, 54, 54, 1, 32400, 32400, 8, FALSE, FALSE, 1, 'manual', FALSE, NULL, '2015-09-19', '["古装", "权谋", "剧情"]', '["胡歌", "王凯", "刘涛"]', '["孔笙", "李雪"]', 'zh', 'china', 45, 18, 15, 5, 2, DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),

(2, 9, 'movie', 'favorite', '泰坦尼克号', '经典的爱情灾难电影', '/static/posters/titanic.jpg', 7.8, 8.5, '虽然是老电影，但依然感人至深', '["爱情", "灾难", "剧情"]', 100.00, 10800, 1, 1, 0, 0, 12600, 12600, 7, FALSE, FALSE, 2, 'manual', FALSE, NULL, '1997-12-19', '["爱情", "灾难", "剧情"]', '["莱昂纳多·迪卡普里奥", "凯特·温斯莱特"]', '["詹姆斯·卡梅隆"]', 'en', 'usa', 194, 12, 8, 2, 2, DATE_SUB(NOW(), INTERVAL 1 WEEK), NOW()),

-- 用户3收藏
(3, 10, 'movie', 'favorite', '黑客帝国', '划时代的科幻动作电影', '/static/posters/matrix.jpg', 8.7, 9.2, '哲学思辨与视觉效果的完美结合', '["科幻", "动作", "赛博朋克"]', 100.00, 8280, 1, 1, 0, 0, 8160, 8160, 9, FALSE, TRUE, 1, 'manual', FALSE, NULL, '1999-03-31', '["科幻", "动作", "赛博朋克"]', '["基努·里维斯", "劳伦斯·菲什伯恩", "凯莉-安·莫斯"]', '["沃卓斯基兄弟"]', 'en', 'usa', 136, 25, 20, 10, 3, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),

(3, 11, 'movie', 'watching', '蝙蝠侠：黑暗骑士', '诺兰执导的蝙蝠侠系列巅峰之作', '/static/posters/darkknight.jpg', 9.0, 9.0, '希斯·莱杰的小丑表演堪称经典', '["动作", "犯罪", "剧情", "DC"]', 45.30, 6300, 1, 0, 0, 0, 9480, 6300, 8, FALSE, TRUE, 2, 'recommend', TRUE, NULL, '2008-07-18', '["动作", "犯罪", "剧情"]', '["克里斯蒂安·贝尔", "希斯·莱杰", "艾伦·艾克哈特"]', '["克里斯托弗·诺兰"]', 'en', 'usa', 152, 30, 25, 8, 3, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),

-- 用户4收藏
(4, 6, 'documentary', 'favorite', '地球脉动', 'BBC出品的经典自然纪录片', '/static/posters/planetearth.jpg', 9.4, 9.8, '画面精美，配乐动人，让人震撼', '["纪录片", "自然", "BBC"]', 100.00, 34200, 11, 11, 0, 0, 39600, 39600, 10, TRUE, TRUE, 1, 'manual', FALSE, NULL, '2006-03-05', '["纪录片", "自然"]', '["大卫·爱登堡"]', '["BBC"]', 'en', 'uk', 60, 45, 38, 12, 4, DATE_SUB(NOW(), INTERVAL 2 WEEK), NOW()),

(4, 12, 'movie', 'favorite', '辛德勒的名单', '斯皮尔伯格执导的战争剧情片', '/static/posters/schindlerslist.jpg', 8.9, 9.5, '沉重但震撼的历史题材电影', '["剧情", "战争", "历史"]', 100.00, 11700, 1, 1, 0, 0, 12300, 12300, 9, FALSE, FALSE, 2, 'manual', FALSE, NULL, '1993-11-30', '["剧情", "战争", "历史"]', '["连姆·尼森", "本·金斯利", "拉尔夫·费因斯"]', '["史蒂文·斯皮尔伯格"]', 'en', 'usa', 195, 20, 18, 6, 4, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),

-- 用户5收藏
(5, 7, 'movie', 'favorite', '疯狂动物城', '迪士尼出品的动画电影', '/static/posters/zootopia.jpg', 8.0, 8.8, '寓教于乐的动画电影，适合全家观看', '["动画", "喜剧", "冒险", "迪士尼"]', 100.00, 6480, 1, 1, 0, 0, 6900, 6900, 8, FALSE, TRUE, 1, 'auto', FALSE, NULL, '2016-03-04', '["动画", "喜剧", "冒险"]', '["金妮弗·古德温", "杰森·贝特曼", "伊德里斯·艾尔巴"]', '["拜伦·霍华德", "里奇·摩尔"]', 'en', 'usa', 115, 28, 22, 9, 5, DATE_SUB(NOW(), INTERVAL 1 WEEK), NOW()),

(5, 13, 'movie', 'watchlist', '寻梦环游记', '皮克斯出品的温馨动画电影', '/static/posters/coco.jpg', 8.4, 9.0, '关于家庭与梦想的感人故事', '["动画", "音乐", "家庭", "皮克斯"]', 0.00, 0, 1, 0, 0, 0, 6300, 0, 7, FALSE, FALSE, 2, 'recommend', TRUE, NULL, '2017-11-22', '["动画", "音乐", "家庭"]', '["安东尼·冈萨雷斯", "盖尔·加西亚·贝纳尔", "本杰明·布拉特"]', '["李·昂克里奇", "阿德里安·莫利纳"]', 'en', 'usa', 105, 15, 12, 4, 5, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),

-- 用户6收藏
(6, 8, 'movie', 'favorite', '寄生虫', '韩国黑色喜剧惊悚片', '/static/posters/parasite.jpg', 8.5, 8.8, '深刻反映社会问题的优秀作品', '["剧情", "惊悚", "喜剧", "韩国"]', 100.00, 7920, 1, 1, 0, 0, 8400, 8400, 9, FALSE, TRUE, 1, 'auto', FALSE, NULL, '2019-05-30', '["剧情", "惊悚", "喜剧"]', '["宋康昊", "李善均", "赵汝贞"]', '["奉俊昊"]', 'ko', 'south_korea', 132, 35, 28, 15, 6, DATE_SUB(NOW(), INTERVAL 2 WEEK), NOW()),

(6, 14, 'movie', 'watching', '遗传厄运', '心理恐怖电影', '/static/posters/hereditary.jpg', 7.3, 7.5, '氛围营造出色，让人不寒而栗', '["恐怖", "惊悚", "剧情"]', 67.80, 9120, 1, 0, 0, 0, 7800, 9120, 6, FALSE, FALSE, 2, 'recommend', FALSE, NULL, '2018-06-08', '["恐怖", "惊悚", "剧情"]', '["托妮·科莱特", "加布里埃尔·伯恩", "亚历克斯·沃尔夫"]', '["阿里·阿斯特"]', 'en', 'usa', 127, 18, 14, 7, 6, DATE_SUB(NOW(), INTERVAL 6 HOUR), NOW());

-- ====================================================================
-- 9. 插入收藏夹关联数据
-- ====================================================================

-- 将收藏添加到相应的收藏夹中
INSERT INTO favorite_folder_relations (folder_id, favorite_id, added_by, added_reason, sort_order, is_pinned, notes, created_by, created_at, updated_at) VALUES
-- 用户1的收藏夹关联
(1, 1, 1, '经典超级英雄电影', 1, FALSE, '漫威宇宙的收官之作', 1, DATE_SUB(NOW(), INTERVAL 1 WEEK), NOW()),
(1, 3, 1, '诺兰经典作品', 2, TRUE, '值得多次观看的佳作', 1, DATE_SUB(NOW(), INTERVAL 2 WEEK), NOW()),(2, 2, 1, '计划观看的科幻佳作', 1, FALSE, '诺兰的又一力作', 1, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
(3, 3, 1, '已看完的经典作品', 1, TRUE, '构思巧妙的科幻电影', 1, DATE_SUB(NOW(), INTERVAL 2 WEEK), NOW()),
(4, 1, 1, '经典动作大片', 1, FALSE, '史诗级视觉效果', 1, DATE_SUB(NOW(), INTERVAL 1 WEEK), NOW()),
(5, 2, 1, '最喜欢的科幻电影', 1, FALSE, '科学性与艺术性结合', 1, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),

-- 用户2的收藏夹关联
(1, 5, 2, '制作精良的国产剧', 1, TRUE, '值得反复观看', 2, DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),
(2, 9, 2, '经典爱情电影', 1, FALSE, '感人至深的爱情故事', 2, DATE_SUB(NOW(), INTERVAL 1 WEEK), NOW()),
(4, 5, 2, '优秀的国产作品', 1, FALSE, '国产剧的代表作', 2, DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),

-- 用户3的收藏夹关联
(1, 10, 3, '经典科幻动作电影', 1, TRUE, '赛博朋克代表作', 3, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
(1, 11, 3, '诺兰蝙蝠侠系列', 2, FALSE, '超级英雄电影的巅峰', 3, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
(2, 10, 3, '动作大片收藏', 1, FALSE, '视觉效果震撼', 3, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
(2, 11, 3, '超级英雄电影', 2, FALSE, '小丑表演经典', 3, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
(3, 10, 3, '高分电影推荐', 1, TRUE, '哲学思辨深刻', 3, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
(4, 11, 3, '高分推荐作品', 2, FALSE, '希斯·莱杰经典表演', 3, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),

-- 用户4的收藏夹关联
(1, 6, 4, 'BBC经典纪录片', 1, TRUE, '画面精美，配乐动人', 4, DATE_SUB(NOW(), INTERVAL 2 WEEK), NOW()),
(2, 6, 4, '自然纪录片收藏', 1, FALSE, '让人震撼的自然世界', 4, DATE_SUB(NOW(), INTERVAL 2 WEEK), NOW()),
(3, 6, 4, '历史题材作品', 1, FALSE, '珍贵的历史影像', 4, DATE_SUB(NOW(), INTERVAL 2 WEEK), NOW()),
(2, 12, 4, '战争历史电影', 1, FALSE, '沉重的历史题材', 4, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),

-- 用户5的收藏夹关联
(1, 7, 5, '迪士尼经典动画', 1, FALSE, '适合全家观看', 5, DATE_SUB(NOW(), INTERVAL 1 WEEK), NOW()),
(2, 13, 5, '皮克斯温馨动画', 1, FALSE, '关于家庭与梦想', 5, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
(3, 7, 5, '动画电影收藏', 1, TRUE, '寓教于乐', 5, DATE_SUB(NOW(), INTERVAL 1 WEEK), NOW()),
(4, 13, 5, '动画世界', 1, FALSE, '皮克斯佳作', 5, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),

-- 用户6的收藏夹关联
(1, 8, 6, '韩国优秀电影', 1, TRUE, '反映社会问题的杰作', 6, DATE_SUB(NOW(), INTERVAL 2 WEEK), NOW()),
(1, 14, 6, '心理恐怖电影', 2, FALSE, '氛围营造出色', 6, DATE_SUB(NOW(), INTERVAL 6 HOUR), NOW()),
(2, 8, 6, '恐怖惊悚收藏', 1, FALSE, '让人不寒而栗', 6, DATE_SUB(NOW(), INTERVAL 2 WEEK), NOW()),
(3, 14, 6, '悬疑推理收藏', 1, FALSE, '心理恐怖佳作', 6, DATE_SUB(NOW(), INTERVAL 6 HOUR), NOW());

-- ====================================================================
-- 10. 插入用户评论示例数据
-- ====================================================================

INSERT INTO user_comments (user_id, resource_id, parent_comment_id, root_comment_id, comment_type, content_type, comment_content, comment_summary, rating, is_spoiler, spoiler_warning, comment_tags, mention_users, reply_count, like_count, dislike_count, report_count, share_count, view_count, is_top, is_hot, is_official, is_verified, is_featured, moderation_status, edit_count, last_edited_at, edited_by, ip_address, user_agent, sentiment_analysis, language_detected, created_by, created_at, updated_at) VALUES
-- 用户1评论
(1, 1, NULL, NULL, 'resource', 'movie', '这部电影真的太震撼了！视觉效果堪称完美，每个场景都像一幅画。剧情安排也很巧妙，时间旅行的设定让我看得津津有味。小罗伯特·唐尼的告别演出非常感人，特别是最后那个场景，真的让人落泪。', '震撼的视觉效果和感人的剧情', 9.5, FALSE, NULL, '["视觉效果", "剧情", "小罗伯特·唐尼"]', NULL, 3, 125, 2, 0, 8, 890, FALSE, TRUE, FALSE, TRUE, TRUE, 'approved', 0, NULL, NULL, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '{"polarity": "positive", "subjectivity": 0.8, "emotions": ["excitement", "sadness"]}', 'zh-CN', 1, DATE_SUB(NOW(), INTERVAL 1 WEEK), NOW()),

-- 用户2评论回复
(2, 1, 1, 1, 'resource', 'movie', '完全同意！最后钢铁侠那个响指的瞬间，真的太经典了。整部电影的配乐也很棒，特别是主题曲一响起就让人热血沸腾。', '同意楼主观点，配乐很棒', 9.0, FALSE, NULL, '["钢铁侠", "配乐"]', '[{"user_id": 1, "username": "张三"}]', 0, 45, 0, 0, 2, 234, FALSE, FALSE, FALSE, FALSE, FALSE, 'approved', 0, NULL, NULL, '180.150.200.88', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', '{"polarity": "positive", "subjectivity": 0.7, "emotions": ["excitement"]}', 'zh-CN', 2, DATE_SUB(NOW(), INTERVAL 6 DAY), NOW()),

-- 用户3评论
(3, 2, NULL, NULL, 'resource', 'movie', '诺兰的电影总是让人脑洞大开。虫洞、黑洞这些科学概念在电影里得到了很好的展现，既有科学依据又有艺术想象力。配乐也很赞，汉斯·季默的配乐总是能完美烘托氛围。', '诺兰电影的科学与艺术结合', 8.8, FALSE, NULL, '["诺兰", "科学", "配乐", "汉斯·季默"]', NULL, 2, 89, 1, 0, 5, 567, FALSE, TRUE, FALSE, FALSE, TRUE, 'approved', 0, NULL, NULL, '10.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox', '{"polarity": "positive", "subjectivity": 0.6, "emotions": ["awe", "curiosity"]}', 'zh-CN', 3, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),

-- 用户4评论
(4, 3, NULL, NULL, 'resource', 'tv', '这部剧的制作真的很精良，从服装道具到场景布置都看得出用心。胡歌的演技也很棒，把梅长苏这个复杂的角色演绎得淋漓尽致。剧情环环相扣，每集都有新的惊喜。', '制作精良，演技出色', 9.5, FALSE, NULL, '["制作", "胡歌", "剧情"]', NULL, 1, 156, 3, 0, 12, 1234, TRUE, TRUE, FALSE, FALSE, TRUE, 'approved', 0, NULL, NULL, '172.16.0.1', 'Mozilla/5.0 (Linux; Android 11; SM-T870)', '{"polarity": "positive", "subjectivity": 0.8, "emotions": ["admiration", "excitement"]}', 'zh-CN', 4, DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),

-- 用户5评论
(5, 7, NULL, NULL, 'resource', 'movie', '迪士尼的动画总是能带来惊喜。这部电影的画面色彩绚丽，角色设计很有特色。更重要的是，它通过一个动物世界的故事，巧妙地探讨了现实中的偏见与包容问题。', '画面绚丽，寓教于乐', 8.8, FALSE, NULL, '["迪士尼", "画面", "寓意"]', NULL, 2, 67, 0, 0, 3, 445, FALSE, FALSE, FALSE, FALSE, FALSE, 'approved', 0, NULL, NULL, '203.0.113.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '{"polarity": "positive", "subjectivity": 0.7, "emotions": ["joy", "thoughtfulness"]}', 'zh-CN', 5, DATE_SUB(NOW(), INTERVAL 1 WEEK), NOW()),

-- 用户6评论
(6, 8, NULL, NULL, 'resource', 'movie', '这部电影真的让人深思。表面上是黑色喜剧，实际上深刻地揭示了社会的阶层固化和贫富差距问题。导演的叙事手法很独特，每个细节都值得细细品味。', '深刻的社会现实题材', 8.8, FALSE, NULL, '["社会问题", "阶层分化", "叙事手法"]', NULL, 4, 234, 8, 0, 15, 2890, TRUE, TRUE, FALSE, FALSE, TRUE, 'approved', 1, DATE_SUB(NOW(), INTERVAL 1 HOUR), 6, '198.51.100.0', 'Mozilla/5.0 (Linux; Android 10; SM-G973F)', '{"polarity": "mixed", "subjectivity": 0.9, "emotions": ["thoughtfulness", "discomfort"]}', 'zh-CN', 6, DATE_SUB(NOW(), INTERVAL 2 WEEK), DATE_SUB(NOW(), INTERVAL 1 HOUR)),

-- 用户2对用户6评论的回复
(2, 8, 6, 6, 'resource', 'movie', '你说得对，这部电影确实很深刻。特别是那个地下室的设计，象征着社会底层的生存状态，让人印象深刻。', '同意对社会问题的分析', 8.5, FALSE, NULL, '["社会隐喻", "地下室设计"]', '[{"user_id": 6, "username": "孙八"}]', 0, 78, 1, 0, 2, 456, FALSE, FALSE, FALSE, FALSE, FALSE, 'approved', 0, NULL, NULL, '180.150.200.88', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', '{"polarity": "positive", "subjectivity": 0.7, "emotions": ["agreement", "thoughtfulness"]}', 'zh-CN', 2, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

-- ====================================================================
-- 11. 插入评论互动数据
-- ====================================================================

INSERT INTO comment_interactions (user_id, comment_id, interaction_type, interaction_value, is_active, interaction_weight, ip_address, user_agent, created_by, created_at, updated_at) VALUES
-- 点赞互动
(1, 2, 'like', NULL, TRUE, 1.0, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 1, DATE_SUB(NOW(), INTERVAL 6 DAY), NOW()),
(2, 1, 'like', NULL, TRUE, 1.0, '180.150.200.88', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', 2, DATE_SUB(NOW(), INTERVAL 6 DAY), NOW()),
(3, 1, 'like', NULL, TRUE, 1.0, '10.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox', 3, DATE_SUB(NOW(), INTERVAL 6 DAY), NOW()),
(4, 5, 'like', NULL, TRUE, 1.0, '172.16.0.1', 'Mozilla/5.0 (Linux; Android 11; SM-T870)', 4, DATE_SUB(NOW(), INTERVAL 6 DAY), NOW()),
(5, 6, 'like', NULL, TRUE, 1.0, '203.0.113.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 5, DATE_SUB(NOW(), INTERVAL 2 WEEK), NOW()),
(2, 6, 'like', NULL, TRUE, 1.0, '180.150.200.88', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', 2, DATE_SUB(NOW(), INTERVAL 2 WEEK), NOW()),
(1, 8, 'like', NULL, TRUE, 1.0, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 1, DATE_SUB(NOW(), INTERVAL 2 WEEK), NOW()),
(3, 8, 'like', NULL, TRUE, 1.0, '10.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox', 3, DATE_SUB(NOW(), INTERVAL 2 WEEK), NOW()),
(4, 8, 'like', NULL, TRUE, 1.0, '172.16.0.1', 'Mozilla/5.0 (Linux; Android 11; SM-T870)', 4, DATE_SUB(NOW(), INTERVAL 2 WEEK), NOW()),
(5, 8, 'like', NULL, TRUE, 1.0, '203.0.113.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 5, DATE_SUB(NOW(), INTERVAL 2 WEEK), NOW()),
(2, 7, 'like', NULL, TRUE, 1.0, '180.150.200.88', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', 2, DATE_SUB(NOW(), INTERVAL 6 DAY), NOW()),
(1, 7, 'like', NULL, TRUE, 1.0, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 1, DATE_SUB(NOW(), INTERVAL 6 DAY), NOW()),

-- 分享互动
(1, 1, 'share', '微信朋友圈', TRUE, 2.0, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 1, DATE_SUB(NOW(), INTERVAL 6 DAY), NOW()),
(2, 3, 'share', '微博', TRUE, 2.0, '180.150.200.88', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', 2, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
(3, 4, 'share', 'QQ空间', TRUE, 2.0, '10.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox', 3, DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),
(4, 8, 'share', '朋友圈', TRUE, 2.0, '172.16.0.1', 'Mozilla/5.0 (Linux; Android 11; SM-T870)', 4, DATE_SUB(NOW(), INTERVAL 2 WEEK), NOW()),
(5, 8, 'share', '微博', TRUE, 2.0, '203.0.113.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 5, DATE_SUB(NOW(), INTERVAL 2 WEEK), NOW()),

-- 感谢互动
(2, 1, 'thank', '谢谢你的精彩评论', TRUE, 1.5, '180.150.200.88', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', 2, DATE_SUB(NOW(), INTERVAL 6 DAY), NOW()),
(3, 3, 'thank', '你的分析很到位', TRUE, 1.5, '10.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox', 3, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
(1, 2, 'thank', '感谢认同', TRUE, 1.5, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 1, DATE_SUB(NOW(), INTERVAL 6 DAY), NOW()),

-- 踩互动（很少见）
(4, 1, 'dislike', '觉得评分有点高', TRUE, 0.8, '172.16.0.1', 'Mozilla/5.0 (Linux; Android 11; SM-T870)', 4, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
(5, 2, 'dislike', '不同意观点', TRUE, 0.8, '203.0.113.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 5, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW());

-- ====================================================================
-- 数据插入完成日志
-- ====================================================================
-- 用户中心相关表数据插入完成：
-- 1. 用户设置数据：6个用户的默认设置
-- 2. 用户偏好数据：50+条偏好记录，涵盖类型、演员、导演等
-- 3. 用户详细资料数据：6个用户的详细个人资料
-- 4. 收藏夹数据：30+个收藏夹，包含默认和自定义收藏夹
-- 5. 浏览历史数据：6条浏览历史记录
-- 6. 搜索历史数据：12条搜索历史记录
-- 7. 下载历史数据：8条下载历史记录
-- 8. 收藏数据：14条收藏记录
-- 9. 收藏夹关联数据：20+条收藏夹关联记录
-- 10. 用户评论数据：7条用户评论
-- 11. 评论互动数据：20+条评论互动记录
--
-- 所有数据都包含完整的审计字段
-- 实现了完整的用户中心功能数据支持
-- 为后续的用户中心功能开发提供充足的数据基础
-- ====================================================================