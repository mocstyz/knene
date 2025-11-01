-- =====================================================
-- KneneBackend 第三层：高级功能表 - 监控分析测试数据
-- 版本：V3.3.2
-- 创建时间：2025-10-30
-- 说明：严格按照数据库架构规范插入测试数据，遵循20个规范文档要求
-- =====================================================

-- 设置字符集和排序规则
SET NAMES utf8mb4;

-- ----------------------------
-- 搜索日志表测试数据
-- ----------------------------
INSERT INTO `search_logs` (`session_id`, `user_id`, `user_type`, `search_type`, `search_keyword`, `search_keyword_original`, `search_keyword_normalized`, `search_language`, `search_engine`, `search_category_id`, `search_category_name`, `search_filters`, `search_sort`, `search_sort_order`, `search_scope`, `page_number`, `page_size`, `result_count`, `result_ids`, `search_time_seconds`, `cache_hit`, `suggestion_used`, `auto_correct_enabled`, `auto_correct_applied`, `semantic_search_enabled`, `voice_search`, `image_search`, `search_intent`, `intent_confidence`, `user_location`, `ip_address`, `user_agent`, `device_type`, `browser_type`, `os_type`, `search_quality_score`, `result_relevance_score`, `user_satisfaction_score`, `click_through_rate`, `conversion_rate`, `bounce_rate`, `search_success`, `no_results_found`, `error_occurred`, `search_session_id`, `search_sequence_number`, `refined_search`, `personalization_enabled`, `machine_learning_model`, `popularity_score`, `trending_score`, `keyword_category`, `commercial_intent`, `informational_intent`, `transactional_intent`, `created_at`) VALUES
('sess_12345', 1, 2, 1, '沙丘', '沙丘', '沙丘', 'zh-CN', 'elasticsearch', 1, 'Movies', '{"quality": ["4K", "2160p"], "year": "2024"}', 'relevance', 'desc', 'all', 1, 20, 15, '[1, 2, 3, 4, 5]', 0.245, 0, 0, 1, 0, 0, 0, 0, 'download', 85.5, '北京', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'desktop', 'Chrome', 'Windows', 92.3, 88.7, 4, 68.5, 12.3, 0, 1, 0, 0, 'search_sess_001', 1, 0, 1, 'bert_v2', 856.2, 89.5, 'movies', 1, 1, 0, NOW()),
('sess_12346', 2, 1, 2, 'Oppenheimer 2023', 'oppenheimer 2023', 'Oppenheimer 2023', 'en', 'elasticsearch', 1, 'Movies', '{"resolution": ["1080p", "4K"], "audio": ["lossless"]}', 'date', 'desc', 'torrents', 1, 20, 8, '[6, 7, 8, 9, 10]', 0.156, 1, 0, 1, 0, 0, 0, 0, 'info', 78.2, '上海', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'desktop', 'Safari', 'macOS', 88.6, 85.2, 5, 72.1, 8.9, 0, 1, 0, 0, 'search_sess_002', 1, 0, 1, 'bert_v2', 1245.8, 92.3, 'movies', 0, 1, 0, NOW()),
('sess_12347', NULL, 3, 1, 'Stranger Things', 'stranger things', 'Stranger Things', 'en', 'elasticsearch', 2, 'TV Series', '{"season": "4", "quality": ["1080p"]}', 'popularity', 'desc', 'all', 1, 20, 25, '[11, 12, 13, 14, 15]', 0.189, 0, 1, 1, 0, 0, 0, 0, 'browse', 65.3, '广州', '192.168.1.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'mobile', 'Safari', 'iOS', 78.9, 76.5, 3, 45.2, 5.6, 1, 1, 0, 0, 'search_sess_003', 1, 0, 1, 'bert_v2', 2145.6, 78.9, 'tv', 0, 1, 0, NOW()),
('sess_12348', 3, 2, 3, '4K 电影', '4k 电影', '4K 电影', 'zh-CN', 'mysql', 1, 'Movies', '{"year": ["2023", "2024"], "genre": ["科幻", "动作"]}', 'rating', 'desc', 'movies', 1, 20, 12, '[16, 17, 18, 19, 20]', 0.423, 0, 0, 1, 0, 0, 0, 0, 'download', 91.2, '深圳', '192.168.1.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'desktop', 'Chrome', 'Windows', 95.6, 92.1, 5, 82.3, 15.7, 0, 1, 0, 0, 'search_sess_004', 1, 0, 1, 'bert_v2', 1876.3, 85.4, 'movies', 1, 0, 1, NOW()),
('sess_12349', 4, 1, 1, '流浪地球2', '流浪地球2', '流浪地球2', 'zh-CN', 'elasticsearch', 1, 'Movies', '{"quality": ["4K", "2160p"], "audio": ["中文"]}', 'date', 'desc', 'all', 1, 20, 6, '[21, 22, 23, 24, 25]', 0.167, 1, 0, 1, 0, 0, 0, 0, 'download', 88.9, '成都', '192.168.1.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0', 'desktop', 'Firefox', 'Windows', 86.7, 83.4, 4, 76.8, 9.2, 0, 1, 0, 0, 'search_sess_005', 1, 0, 1, 'bert_v2', 2341.7, 91.2, 'movies', 1, 1, 1, NOW()),
('sess_12350', NULL, 3, 1, 'batman', 'BATMAN', 'batman', 'en', 'elasticsearch', 1, 'Movies', '{}', 'relevance', 'desc', 'all', 1, 20, 0, '[]', 0.098, 0, 0, 1, 1, 0, 0, 0, 'browse', 45.2, '杭州', '192.168.1.105', 'Mozilla/5.0 (Android 14; Mobile; rv:109.0) Gecko/109.0 Firefox/119.0', 'mobile', 'Firefox', 'Android', 65.3, 0.0, 1, 0.0, 0.0, 1, 0, 1, 0, 'search_sess_006', 1, 0, 1, 'bert_v2', 654.3, 56.7, 'movies', 0, 1, 0, NOW()),
('sess_12351', 5, 2, 4, '科幻', '科幻', '科幻', 'zh-CN', 'elasticsearch', NULL, NULL, '{"min_rating": 8.0}', 'popularity', 'desc', 'all', 1, 20, 18, '[26, 27, 28, 29, 30]', 0.134, 0, 0, 1, 0, 0, 0, 0, 'browse', 72.8, '南京', '192.168.1.106', 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'tablet', 'Safari', 'iPadOS', 82.4, 79.1, 3, 63.5, 7.8, 0, 1, 0, 0, 'search_sess_007', 1, 0, 1, 'bert_v2', 1543.2, 88.9, 'genre', 0, 1, 0, NOW()),
('sess_12352', 6, 4, 1, '4K', '4k', '4K', 'en', 'elasticsearch', NULL, NULL, '{"year": "2024", "type": "movies"}', 'date', 'desc', 'torrents', 1, 20, 22, '[31, 32, 33, 34, 35]', 0.278, 1, 1, 1, 0, 0, 0, 0, 'download', 89.7, '武汉', '192.168.1.107', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', 'desktop', 'Chrome', 'Linux', 87.9, 84.6, 4, 79.2, 11.4, 0, 1, 0, 0, 'search_sess_008', 1, 0, 1, 'bert_v2', 987.6, 76.5, 'quality', 1, 0, 1, NOW());

-- ----------------------------
-- 用户统计表测试数据
-- ----------------------------
INSERT INTO `user_statistics` (`user_id`, `statistics_date`, `statistics_type`, `period_start_date`, `period_end_date`, `activity_status`, `activity_score`, `login_count`, `login_duration_minutes`, `avg_login_duration_minutes`, `last_login_time`, `page_views_count`, `unique_pages_viewed`, `avg_session_duration_seconds`, `bounce_rate`, `search_count`, `search_success_count`, `search_success_rate`, `avg_search_time_seconds`, `download_count`, `download_success_count`, `download_success_rate`, `download_size_bytes`, `avg_download_speed_mbps`, `comment_count`, `like_count`, `share_count`, `favorite_count`, `rating_count`, `avg_rating_given`, `vip_purchase_count`, `vip_revenue_amount`, `vip_usage_statistics`, `points_earned`, `points_spent`, `points_balance`, `signin_count`, `continuous_signin_days`, `user_segment`, `user_tier`, `user_engagement_score`, `user_loyalty_score`, `user_value_score`, `churn_risk_score`, `predicted_churn_probability`, `retention_probability`, `net_promoter_score`, `user_satisfaction_score`, `growth_potential`, `influence_score`, `content_created_count`, `feature_usage_statistics`, `created_by`) VALUES
(1, CURDATE(), 1, CURDATE(), CURDATE(), 1, 92.5, 3, 180, 60, DATE_SUB(NOW(), INTERVAL 2 HOUR), 45, 12, 360, 15.5, 8, 7, 87.5, 0.234, 5, 4, 80.0, 125829120000, 8.5, 3, 12, 2, 8, 6, 4.2, 1, 88.00, '{"download_count": 15, "search_count": 25, "feature_usage": {"advanced_search": 8, "filter": 12}}', 150, 50, 2150, 1, 1, 'vip', 'gold', 88.6, 85.3, 92.1, 15.2, 8.5, 91.5, 1, 4, 2, 75.4, 0, '{"search": 25, "download": 15, "comment": 3, "share": 2}', 1),
(2, CURDATE(), 1, CURDATE(), CURDATE(), 1, 78.3, 2, 90, 45, DATE_SUB(NOW(), INTERVAL 6 HOUR), 28, 8, 245, 22.1, 5, 4, 80.0, 0.189, 2, 2, 100.0, 53687091200, 6.2, 1, 5, 1, 3, 2, 4.0, 0, 0.00, '{"download_count": 5, "search_count": 8, "feature_usage": {"basic_search": 5, "filter": 3}}', 80, 30, 1250, 1, 1, 'active', 'silver', 75.8, 72.6, 78.3, 28.7, 12.3, 87.7, 0, 3, 1, 45.2, 0, '{"search": 8, "download": 5, "comment": 1, "favorite": 3}', 1),
(3, CURDATE(), 1, CURDATE(), CURDATE(), 1, 95.8, 5, 300, 60, DATE_SUB(NOW(), INTERVAL 30 MINUTE), 125, 35, 420, 8.7, 15, 14, 93.3, 0.156, 12, 11, 91.7, 343597383680, 12.3, 8, 25, 6, 18, 12, 4.6, 2, 176.00, '{"download_count": 28, "search_count": 45, "feature_usage": {"advanced_search": 20, "filter": 25, "batch_download": 5}}', 280, 80, 3200, 1, 1, 'power', 'platinum', 94.2, 91.7, 95.8, 5.8, 2.1, 97.9, 2, 5, 2, 89.6, 1, '{"search": 45, "download": 28, "comment": 8, "share": 6}', 1),
(4, CURDATE(), 1, CURDATE(), CURDATE(), 2, 45.2, 0, 0, 0, DATE_SUB(NOW(), INTERVAL 3 DAY), 0, 0, 0, 0.0, 0, 0, 0.0, 0.000, 0, 0, 0.0, 0, 0.0, 0, 0, 0, 0, 0.0, 0, 0, 0, 0.00, '{}', 0, 0, 500, 0, 0, 'churned', 'bronze', 42.3, 38.9, 45.2, 78.5, 45.2, 54.8, -1, 2, 0, 12.3, 0, '{}', 1),
(5, CURDATE(), 1, CURDATE(), CURDATE(), 3, 65.7, 1, 30, 30, DATE_SUB(NOW(), INTERVAL 1 HOUR), 15, 5, 180, 0.0, 3, 2, 66.7, 0.312, 1, 1, 100.0, 21474836480, 4.8, 0, 2, 0, 1, 1, 5.0, 0, 0.00, '{"download_count": 3, "search_count": 5, "feature_usage": {"basic_search": 3, "filter": 2}}', 50, 10, 550, 1, 1, 'new', 'bronze', 62.8, 60.2, 65.7, 35.6, 8.9, 91.1, 1, 4, 1, 28.9, 0, '{"search": 5, "download": 3, "comment": 0, "favorite": 1}', 1),
(1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1, 88.9, 2, 150, 75, DATE_SUB(NOW(), INTERVAL 1 DAY), 38, 10, 320, 18.2, 6, 5, 83.3, 0.267, 3, 3, 100.0, 85899345920, 7.9, 2, 8, 1, 5, 4, 4.5, 0, 0.00, '{"download_count": 8, "search_count": 15, "feature_usage": {"advanced_search": 6, "filter": 9}}', 120, 40, 2000, 1, 1, 'vip', 'gold', 85.2, 82.7, 88.9, 18.9, 6.7, 93.3, 1, 4, 2, 72.8, 0, '{"search": 15, "download": 8, "comment": 2, "share": 1}', 1),
(2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1, 82.1, 3, 135, 45, DATE_SUB(NOW(), INTERVAL 1 DAY), 32, 9, 280, 16.8, 7, 6, 85.7, 0.201, 3, 2, 66.7, 75161927680, 8.2, 1, 6, 1, 4, 2, 3.8, 0, 0.00, '{"download_count": 7, "search_count": 12, "feature_usage": {"basic_search": 7, "filter": 5}}', 90, 25, 1195, 1, 1, 'active', 'silver', 79.6, 76.3, 82.1, 24.3, 9.2, 90.8, 0, 3, 1, 48.6, 0, '{"search": 12, "download": 7, "comment": 1, "favorite": 4}', 1),
(3, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1, 93.4, 4, 240, 60, DATE_SUB(NOW(), INTERVAL 1 DAY), 98, 28, 380, 9.5, 18, 17, 94.4, 0.145, 10, 9, 90.0, 295279001600, 11.7, 6, 22, 4, 15, 10, 4.7, 1, 88.00, '{"download_count": 25, "search_count": 38, "feature_usage": {"advanced_search": 18, "filter": 20, "batch_download": 3}}', 250, 70, 2950, 1, 1, 'power', 'platinum', 91.8, 89.2, 93.4, 7.2, 2.8, 96.5, 2, 5, 2, 86.4, 1, '{"search": 38, "download": 25, "comment": 6, "share": 4}', 1);

-- =====================================================
-- 测试数据插入完成说明
-- =====================================================
-- 本迁移脚本插入了第三层高级功能表中的监控分析测试数据：
-- 1. search_logs表：8条搜索日志数据，涵盖不同用户类型和搜索场景
-- 2. user_statistics表：8条用户统计数据，包含当日和昨日数据
--
-- 测试数据特点：
-- 严格遵循20个规范文档要求，确保数据完整性和一致性
-- 涵盖不同用户类型（VIP、普通用户、游客、管理员）
-- 模拟真实的搜索行为和用户活动模式
-- 包含详细的搜索性能指标和质量评估
-- 提供多维度的用户行为分析和统计
-- 模拟各种业务场景（成功、失败、跳出等）
-- 包含完整的用户画像和分群数据
-- 提供丰富的性能指标和满意度评估
-- 支持不同设备和浏览器的使用分析
-- 包含详细的用户价值评估和预测数据
-- =====================================================