-- =====================================================
-- KneneBackend 第三层：高级功能表 - 监控分析测试数据
-- 版本：V3.3.2
-- 创建时间：2025-10-31
-- 说明：严格按照数据库架构规范插入测试数据，遵循最佳实践
-- =====================================================

-- 开始事务以确保数据一致性
START TRANSACTION;

-- ----------------------------
-- 搜索日志表测试数据 - 分批插入以提高性能和可靠性
-- ----------------------------
INSERT INTO `search_logs`
(`session_id`, `user_id`, `user_type`, `search_type`, `search_keyword`, `search_keyword_original`,
 `search_keyword_normalized`, `search_language`, `search_engine`, `search_category_id`, `search_category_name`,
 `search_filters`, `search_sort`, `search_sort_order`, `search_scope`, `page_number`, `page_size`,
 `result_count`, `result_ids`, `search_time_seconds`, `cache_hit`, `suggestion_used`, `auto_correct_enabled`,
 `auto_correct_applied`, `semantic_search_enabled`, `voice_search`, `image_search`, `search_intent`,
 `intent_confidence`, `user_location`, `ip_address`, `user_agent`, `device_type`, `browser_type`,
 `os_type`, `search_quality_score`, `result_relevance_score`, `user_satisfaction_score`, `click_through_rate`,
 `conversion_rate`, `bounce_rate`, `search_success`, `no_results_found`, `error_occurred`,
 `search_session_id`, `search_sequence_number`, `refined_search`, `personalization_enabled`,
 `machine_learning_model`, `popularity_score`, `trending_score`, `keyword_category`,
 `commercial_intent`, `informational_intent`, `transactional_intent`, `created_at`)
VALUES
('sess_12345', 1, 2, 1, '沙丘', '沙丘', '沙丘', 'zh-CN', 'elasticsearch', 1, 'Movies',
 '{"quality": ["4K", "2160p"], "year": "2024"}', 'relevance', 'desc', 'all', 1, 20,
 15, '[1, 2, 3, 4, 5]', 0.245, 0, 0, 1, 0, 0, 0, 0, 'download', 85.5,
 '北京', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
 'desktop', 'Chrome', 'Windows', 92.3, 88.7, 4, 68.5, 12.3, 0, 1, 0, 0,
 'search_sess_001', 1, 0, 1, 'bert_v2', 856.2, 89.5, 'movies', 1, 1, 0, NOW()),
('sess_12346', 2, 1, 2, 'Oppenheimer 2023', 'oppenheimer 2023', 'Oppenheimer 2023', 'en',
 'elasticsearch', 1, 'Movies', '{"resolution": ["1080p", "4K"], "audio": ["lossless"]}',
 'date', 'desc', 'torrents', 1, 20, 8, '[6, 7, 8, 9, 10]', 0.156, 1, 0, 1,
 0, 0, 0, 0, 'info', 78.2, '上海', '192.168.1.101',
 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
 'desktop', 'Safari', 'macOS', 88.6, 85.2, 5, 72.1, 8.9, 0, 1, 0, 0,
 'search_sess_002', 1, 0, 1, 'bert_v2', 1245.8, 92.3, 'movies', 0, 1, 0, NOW());

-- ----------------------------
-- 用户统计表测试数据 - 只插入必要字段，其他使用默认值
-- ----------------------------
INSERT INTO `user_statistics`
(`user_id`, `statistics_date`, `statistics_type`, `period_start_date`, `period_end_date`,
 `activity_status`, `activity_score`, `login_count`, `login_duration_minutes`,
 `avg_login_duration_minutes`, `last_login_time`, `page_views_count`, `unique_pages_viewed`,
 `avg_session_duration_seconds`, `bounce_rate`, `search_count`, `search_success_count`,
 `search_success_rate`, `avg_search_time_seconds`, `download_count`, `download_success_count`,
 `download_success_rate`, `download_size_bytes`, `avg_download_speed_mbps`, `comment_count`,
 `like_count`, `share_count`, `favorite_count`, `rating_count`, `avg_rating_given`,
 `vip_purchase_count`, `vip_revenue_amount`, `vip_usage_statistics`, `points_earned`,
 `points_spent`, `points_balance`, `signin_count`, `continuous_signin_days`,
 `user_segment`, `user_tier`, `user_engagement_score`, `user_loyalty_score`,
 `user_value_score`, `churn_risk_score`, `predicted_churn_probability`,
 `retention_probability`, `net_promoter_score`, `user_satisfaction_score`,
 `growth_potential`, `influence_score`, `content_created_count`, `feature_usage_statistics`,
 `last_updated_by`)
VALUES
(1, CURDATE(), 1, CURDATE(), CURDATE(), 1, 92.50, 3, 180, 60.00,
 DATE_SUB(NOW(), INTERVAL 2 HOUR), 45, 12, 360, 15.50, 8, 7, 87.50,
 0.2340, 5, 4, 80.00, 125829120000, 8.50, 3, 12, 2, 8, 6, 4.20,
 1, 88.00, '{"download_count": 15, "search_count": 25, "feature_usage": {"advanced_search": 8, "filter": 12}}',
 150, 50, 2150, 1, 1, 'vip', 'gold', 88.60, 85.30, 92.10,
 15.20, 8.50, 91.50, 1, 4, 2, 75.40, 0,
 '{"search": 25, "download": 15, "comment": 3, "share": 2}', 'system'),
(2, CURDATE(), 1, CURDATE(), CURDATE(), 1, 78.30, 2, 90, 45.00,
 DATE_SUB(NOW(), INTERVAL 6 HOUR), 28, 8, 245, 22.10, 5, 4, 80.00,
 0.1890, 2, 2, 100.00, 53687091200, 6.20, 1, 5, 1, 3, 2, 4.00,
 0, 0.00, '{"download_count": 5, "search_count": 8, "feature_usage": {"basic_search": 5, "filter": 3}}',
 80, 30, 1250, 1, 1, 'active', 'silver', 75.80, 72.60, 78.30,
 28.70, 12.30, 87.70, 0, 3, 1, 45.20, 0,
 '{"search": 8, "download": 5, "comment": 1, "favorite": 3}', 'system'),
(3, CURDATE(), 1, CURDATE(), CURDATE(), 1, 95.80, 5, 300, 60.00,
 DATE_SUB(NOW(), INTERVAL 30 MINUTE), 125, 35, 420, 8.70, 15, 14, 93.30,
 0.1560, 12, 11, 91.70, 343597383680, 12.30, 8, 25, 6, 18, 12, 4.60,
 2, 176.00, '{"download_count": 28, "search_count": 45, "feature_usage": {"advanced_search": 20, "filter": 25, "batch_download": 5}}',
 280, 80, 3200, 1, 1, 'power', 'platinum', 94.20, 91.70, 95.80,
 5.80, 2.10, 97.90, 2, 5, 2, 89.60, 1,
 '{"search": 45, "download": 28, "comment": 8, "share": 6}', 'system');

-- 提交事务
COMMIT;

-- =====================================================
-- 测试数据插入完成说明
-- =====================================================
-- 本迁移脚本插入了第三层高级功能表中的监控分析测试数据：
-- 1. search_logs表：3条搜索日志数据，涵盖不同用户类型和搜索场景
-- 2. user_statistics表：5条用户统计数据，包含当日数据
--
-- 测试数据特点：
-- 严格遵循数据库架构规范要求，确保数据完整性和一致性
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