-- ====================================================================
-- 影视资源下载网站 - VIP业务相关表数据插入脚本
-- ====================================================================
-- 版本：V2.1.4
-- 描述：插入VIP业务相关表的初始数据（VIP套餐、支付方式、优惠券、权益等）
-- 作者：数据库团队
-- 日期：2025-10-30
-- 依赖：V2.1.3__Create_vip_business_tables.sql
-- ====================================================================

-- 设置SQL模式
SET NAMES utf8mb4;

-- ====================================================================
-- 1. 插入VIP权益数据
-- ====================================================================

INSERT INTO vip_benefits (benefit_code, benefit_name, benefit_description, benefit_type, benefit_value, benefit_unit, is_unlimited, is_active, sort_order, icon, color, created_by, updated_by, version, created_at, updated_at) VALUES
-- 下载相关权益
('unlimited_download', '无限下载', '无限制下载影视资源', 'download', 'unlimited', '次', 1, 1, 1, 'download', '#ff6b6b', 1, 1, 1, NOW(), NOW()),
('high_speed_download', '高速下载', '享受高速下载通道', 'download', '10240', 'KB/s', 0, 1, 2, 'zap', '#4ecdc4', 1, 1, 1, NOW(), NOW()),
('concurrent_download', '并发下载', '支持多个任务同时下载', 'download', '5', '个', 0, 1, 3, 'layers', '#45b7d1', 1, 1, 1, NOW(), NOW()),
('priority_download', '优先下载', '下载任务优先处理', 'download', '1', '级', 0, 1, 4, 'chevron-up', '#96ceb4', 1, 1, 1, NOW(), NOW()),

-- 内容质量权益
('hd_quality', '高清画质', '支持1080P及以上画质', 'quality', '1080p', '分辨率', 0, 1, 11, 'monitor', '#ffeaa7', 1, 1, 1, NOW(), NOW()),
('uhd_quality', '超清画质', '支持4K超清画质', 'quality', '4k', '分辨率', 0, 1, 12, 'tv', '#dfe6e9', 1, 1, 1, NOW(), NOW()),
('exclusive_content', '独家内容', '访问VIP专属影视资源', 'content', 'exclusive', '类', 0, 1, 13, 'lock', '#a29bfe', 1, 1, 1, NOW(), NOW()),
('early_access', '抢先观看', '新片提前观看权限', 'content', '7', '天', 0, 1, 14, 'clock', '#fd79a8', 1, 1, 1, NOW(), NOW()),

-- 服务权益
('no_ads', '无广告体验', '去除所有广告内容', 'service', '0', '个', 1, 1, 21, 'x-circle', '#e17055', 1, 1, 1, NOW(), NOW()),
('dedicated_support', '专属客服', '24小时专属客服支持', 'service', '24', '小时', 1, 1, 22, 'headphones', '#00b894', 1, 1, 1, NOW(), NOW()),
('cloud_storage', '云端存储', '提供云盘存储空间', 'service', '100', 'GB', 0, 1, 23, 'cloud', '#0984e3', 1, 1, 1, NOW(), NOW()),
('offline_download', '离线下载', '支持离线下载功能', 'service', '10', '部', 0, 1, 24, 'download-cloud', '#6c5ce7', 1, 1, 1, NOW(), NOW()),

-- 特色功能权益
('multi_device', '多设备登录', '支持多设备同时登录', 'feature', '5', '台', 0, 1, 31, 'smartphone', '#00cec9', 1, 1, 1, NOW(), NOW()),
('advanced_search', '高级搜索', '使用高级搜索功能', 'feature', 'unlimited', '次', 1, 1, 32, 'search', '#ff7675', 1, 1, 1, NOW(), NOW()),
('custom_subtitle', '自定义字幕', '支持字幕自定义上传', 'feature', 'unlimited', '个', 1, 1, 33, 'type', '#74b9ff', 1, 1, 1, NOW(), NOW()),
('playback_speed', '倍速播放', '支持视频倍速播放', 'feature', '3.0', '倍', 0, 1, 34, 'fast-forward', '#a29bfe', 1, 1, 1, NOW(), NOW());

-- ====================================================================
-- 2. 插入VIP套餐数据
-- ====================================================================

INSERT INTO vip_plans (plan_code, plan_name, plan_description, plan_level, duration_days, original_price, current_price, discount_percentage, currency, download_quota, download_speed_limit, max_concurrent_downloads, benefits, features, is_active, is_featured, sort_order, badge_url, created_by, updated_by, version, created_at, updated_at) VALUES
-- 月度套餐
('vip_month_basic', 'VIP月卡-基础版', '享受基础VIP权益，适合轻度用户', 1, 30, 30.00, 25.00, 17.00, 'CNY', 100, 2048, 2,
'["unlimited_download", "high_speed_download", "no_ads", "multi_device"]',
'["basic_support", "standard_quality"]',
1, 0, 11, '/static/images/badges/vip-month-basic.png', 1, 1, 1, NOW(), NOW()),

('vip_month_premium', 'VIP月卡-高级版', '享受全面VIP权益，适合重度用户', 2, 30, 50.00, 40.00, 20.00, 'CNY', 500, 5120, 3,
'["unlimited_download", "high_speed_download", "concurrent_download", "priority_download", "hd_quality", "no_ads", "dedicated_support", "multi_device", "advanced_search"]',
'["priority_support", "hd_content", "custom_subtitle"]',
1, 1, 12, '/static/images/badges/vip-month-premium.png', 1, 1, 1, NOW(), NOW()),

-- 季度套餐
('vip_quarter_basic', 'VIP季卡-基础版', '3个月基础VIP，性价比之选', 1, 90, 90.00, 68.00, 24.00, 'CNY', 300, 3072, 2,
'["unlimited_download", "high_speed_download", "no_ads", "multi_device", "cloud_storage"]',
'["basic_support", "standard_quality", "cloud_backup"]',
1, 0, 21, '/static/images/badges/vip-quarter-basic.png', 1, 1, 1, NOW(), NOW()),

('vip_quarter_premium', 'VIP季卡-高级版', '3个月高级VIP，畅享所有权益', 2, 90, 150.00, 108.00, 28.00, 'CNY', 1500, 7168, 4,
'["unlimited_download", "high_speed_download", "concurrent_download", "priority_download", "hd_quality", "exclusive_content", "no_ads", "dedicated_support", "multi_device", "advanced_search", "custom_subtitle", "playback_speed"]',
'["priority_support", "hd_content", "uhd_content", "early_access", "offline_download"]',
1, 1, 22, '/static/images/badges/vip-quarter-premium.png', 1, 1, 1, NOW(), NOW()),

-- 年度套餐
('vip_year_basic', 'VIP年卡-基础版', '全年基础VIP，超值优惠', 1, 365, 360.00, 240.00, 33.00, 'CNY', 1200, 4096, 3,
'["unlimited_download", "high_speed_download", "concurrent_download", "no_ads", "multi_device", "cloud_storage", "advanced_search", "custom_subtitle"]',
'["basic_support", "standard_quality", "cloud_backup", "yearly_bonus"]',
1, 0, 31, '/static/images/badges/vip-year-basic.png', 1, 1, 1, NOW(), NOW()),

('vip_year_premium', 'VIP年卡-高级版', '全年高级VIP，尊享顶级体验', 2, 365, 600.00, 388.00, 35.00, 'CNY', 6000, 10240, 5,
'["unlimited_download", "high_speed_download", "concurrent_download", "priority_download", "hd_quality", "uhd_quality", "exclusive_content", "early_access", "no_ads", "dedicated_support", "multi_device", "advanced_search", "custom_subtitle", "playback_speed", "offline_download"]',
'["priority_support", "hd_content", "uhd_content", "early_access", "cloud_storage", "yearly_bonus", "exclusive_events"]',
1, 1, 32, '/static/images/badges/vip-year-premium.png', 1, 1, 1, NOW(), NOW()),

-- 体验套餐
('vip_trial_7days', 'VIP体验卡-7天', '7天免费体验，感受VIP魅力', 1, 7, 0.00, 0.00, 100.00, 'CNY', 50, 1024, 1,
'["unlimited_download", "no_ads", "multi_device"]',
'["trial_support", "standard_quality"]',
1, 0, 1, '/static/images/badges/vip-trial.png', 1, 1, 1, NOW(), NOW()),

-- 终身套餐
('vip_lifetime', 'VIP终身卡', '一次付费，终身享受VIP权益', 3, 36500, 9999.00, 1999.00, 80.00, 'CNY', 999999, 20480, 10,
'["unlimited_download", "high_speed_download", "concurrent_download", "priority_download", "hd_quality", "uhd_quality", "exclusive_content", "early_access", "no_ads", "dedicated_support", "multi_device", "advanced_search", "custom_subtitle", "playback_speed", "offline_download", "cloud_storage"]',
'["lifetime_support", "all_content", "lifetime_bonus", "exclusive_events", "priority_access"]',
1, 0, 99, '/static/images/badges/vip-lifetime.png', 1, 1, 1, NOW(), NOW());

-- ====================================================================
-- 3. 插入会员权益关联数据
-- ====================================================================

-- 获取套餐ID用于关联
SET @month_basic_id = (SELECT id FROM vip_plans WHERE plan_code = 'vip_month_basic');
SET @month_premium_id = (SELECT id FROM vip_plans WHERE plan_code = 'vip_month_premium');
SET @quarter_basic_id = (SELECT id FROM vip_plans WHERE plan_code = 'vip_quarter_basic');
SET @quarter_premium_id = (SELECT id FROM vip_plans WHERE plan_code = 'vip_quarter_premium');
SET @year_basic_id = (SELECT id FROM vip_plans WHERE plan_code = 'vip_year_basic');
SET @year_premium_id = (SELECT id FROM vip_plans WHERE plan_code = 'vip_year_premium');
SET @trial_id = (SELECT id FROM vip_plans WHERE plan_code = 'vip_trial_7days');
SET @lifetime_id = (SELECT id FROM vip_plans WHERE plan_code = 'vip_lifetime');

-- 月卡基础版权益关联
INSERT INTO membership_benefits (plan_id, benefit_id, benefit_value, is_included, sort_order, created_by, created_at)
SELECT @month_basic_id, id, NULL, 1, 1, 1, NOW()
FROM vip_benefits
WHERE benefit_code IN ('unlimited_download', 'high_speed_download', 'no_ads', 'multi_device');

-- 月卡高级版权益关联
INSERT INTO membership_benefits (plan_id, benefit_id, benefit_value, is_included, sort_order, created_by, created_at)
SELECT @month_premium_id, id, NULL, 1, 1, 1, NOW()
FROM vip_benefits
WHERE benefit_code IN ('unlimited_download', 'high_speed_download', 'concurrent_download', 'priority_download', 'hd_quality', 'no_ads', 'dedicated_support', 'multi_device', 'advanced_search');

-- 季卡基础版权益关联
INSERT INTO membership_benefits (plan_id, benefit_id, benefit_value, is_included, sort_order, created_by, created_at)
SELECT @quarter_basic_id, id, NULL, 1, 1, 1, NOW()
FROM vip_benefits
WHERE benefit_code IN ('unlimited_download', 'high_speed_download', 'no_ads', 'multi_device', 'cloud_storage');

-- 季卡高级版权益关联
INSERT INTO membership_benefits (plan_id, benefit_id, benefit_value, is_included, sort_order, created_by, created_at)
SELECT @quarter_premium_id, id, NULL, 1, 1, 1, NOW()
FROM vip_benefits
WHERE benefit_code IN ('unlimited_download', 'high_speed_download', 'concurrent_download', 'priority_download', 'hd_quality', 'exclusive_content', 'no_ads', 'dedicated_support', 'multi_device', 'advanced_search', 'custom_subtitle', 'playback_speed');

-- 年卡基础版权益关联
INSERT INTO membership_benefits (plan_id, benefit_id, benefit_value, is_included, sort_order, created_by, created_at)
SELECT @year_basic_id, id, NULL, 1, 1, 1, NOW()
FROM vip_benefits
WHERE benefit_code IN ('unlimited_download', 'high_speed_download', 'concurrent_download', 'no_ads', 'multi_device', 'cloud_storage', 'advanced_search', 'custom_subtitle');

-- 年卡高级版权益关联（包含所有权益）
INSERT INTO membership_benefits (plan_id, benefit_id, benefit_value, is_included, sort_order, created_by, created_at)
SELECT @year_premium_id, id, NULL, 1, 1, 1, NOW()
FROM vip_benefits;

-- 体验卡权益关联
INSERT INTO membership_benefits (plan_id, benefit_id, benefit_value, is_included, sort_order, created_by, created_at)
SELECT @trial_id, id, NULL, 1, 1, 1, NOW()
FROM vip_benefits
WHERE benefit_code IN ('unlimited_download', 'no_ads', 'multi_device');

-- 终身卡权益关联（包含所有权益，并且是无限制的）
INSERT INTO membership_benefits (plan_id, benefit_id, benefit_value, is_included, sort_order, created_by, created_at)
SELECT @lifetime_id, id, 'unlimited', 1, 1, 1, NOW()
FROM vip_benefits;

-- ====================================================================
-- 4. 插入支付方式数据
-- ====================================================================

INSERT INTO payment_methods (method_code, method_name, method_type, provider_name, provider_code, description, icon_url, supported_currencies, min_amount, max_amount, fee_rate, fixed_fee, is_active, sort_order, config, created_by, updated_by, version, created_at, updated_at) VALUES
-- 在线支付方式
('alipay_web', '支付宝网页支付', 'online', '支付宝', 'alipay', '使用支付宝扫码或账号密码支付', '/static/images/payment/alipay.png', '["CNY"]', 0.01, 50000.00, 0.006, 0.00, 1, 1, '{"app_id":"2021000000000000","gateway_url":"https://openapi.alipay.com/gateway.do"}', 1, 1, 1, NOW(), NOW()),

('alipay_mobile', '支付宝移动支付', 'online', '支付宝', 'alipay', '使用支付宝手机客户端支付', '/static/images/payment/alipay-mobile.png', '["CNY"]', 0.01, 30000.00, 0.006, 0.00, 1, 2, '{"app_id":"2021000000000000","gateway_url":"https://openapi.alipay.com/gateway.do"}', 1, 1, 1, NOW(), NOW()),

('wechat_web', '微信支付网页', 'online', '微信支付', 'wechat', '使用微信扫码或公众号支付', '/static/images/payment/wechat.png', '["CNY"]', 0.01, 50000.00, 0.006, 0.00, 1, 3, '{"app_id":"wxd678efh567hg6787","mch_id":"1230000001"}', 1, 1, 1, NOW(), NOW()),

('wechat_mobile', '微信支付移动', 'online', '微信支付', 'wechat', '使用微信手机客户端支付', '/static/images/payment/wechat-mobile.png', '["CNY"]', 0.01, 30000.00, 0.006, 0.00, 1, 4, '{"app_id":"wxd678efh567hg6787","mch_id":"1230000001"}', 1, 1, 1, NOW(), NOW()),

-- 银行卡支付
('unionpay', '银联支付', 'online', '中国银联', 'unionpay', '支持各大银行卡支付', '/static/images/payment/unionpay.png', '["CNY"]', 1.00, 100000.00, 0.008, 0.50, 1, 11, '{"merchant_id":"123456789012345","terminal_id":"12345678"}', 1, 1, 1, NOW(), NOW()),

('credit_card', '信用卡支付', 'online', '信用卡通道', 'credit_card', '支持Visa、MasterCard等信用卡', '/static/images/payment/credit-card.png', '["CNY","USD","EUR"]', 1.00, 100000.00, 0.015, 2.00, 1, 12, '{"gateway":"stripe","publishable_key":"pk_test_123456789"}', 1, 1, 1, NOW(), NOW()),

-- 数字钱包
('paypal', 'PayPal支付', 'digital_wallet', 'PayPal', 'paypal', '全球领先的在线支付平台', '/static/images/payment/paypal.png', '["USD","EUR","GBP","CNY"]', 0.10, 10000.00, 0.045, 0.30, 0, 21, '{"client_id":"Abc123def456","mode":"sandbox"}', 1, 1, 1, NOW(), NOW()),

('balance', '余额支付', 'digital_wallet', '系统余额', 'balance', '使用账户余额直接支付', '/static/images/payment/wallet.png', '["CNY"]', 0.01, 10000.00, 0.000, 0.00, 1, 31, '{"auto_topup":false,"min_balance":0.00}', 1, 1, 1, NOW(), NOW()),

-- 礼品卡
('gift_card', '礼品卡支付', 'gift_card', '系统礼品卡', 'gift_card', '使用礼品卡余额支付', '/static/images/payment/gift-card.png', '["CNY"]', 1.00, 10000.00, 0.000, 0.00, 1, 41, '{"validation_required":true,"expiry_check":true}', 1, 1, 1, NOW(), NOW()),

-- 线下支付方式（暂时禁用）
('bank_transfer', '银行转账', 'offline', '银行转账', 'bank_transfer', '通过银行转账方式付款', '/static/images/payment/bank-transfer.png', '["CNY"]', 10.00, 1000000.00, 0.002, 5.00, 0, 91, '{"account_name":"影视资源网站","account_number":"6222020000000000000","bank_name":"工商银行"}', 1, 1, 1, NOW(), NOW());

-- ====================================================================
-- 5. 插入优惠券数据
-- ====================================================================

INSERT INTO coupons (coupon_code, coupon_name, coupon_type, discount_value, discount_percentage, min_order_amount, max_discount_amount, applicable_plans, usage_limit, usage_limit_per_user, valid_from, valid_until, is_active, is_public, description, terms, created_by, updated_by, version, created_at, updated_at) VALUES
-- 新用户专享优惠券
('WELCOME2025', '新用户专享8折券', 'discount_percentage', NULL, 20.00, 30.00, 50.00, '["vip_month_basic", "vip_month_premium", "vip_quarter_basic", "vip_quarter_premium"]', 1000, 1, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 1, 1, '新用户注册后专享，首次购买VIP套餐8折优惠', '仅限新用户首次购买使用，不可与其他优惠叠加使用', 1, 1, 1, NOW(), NOW()),

('FIRSTMONTH10', '首月立减10元', 'fixed_amount', 10.00, NULL, 25.00, 10.00, '["vip_month_basic", "vip_month_premium"]', 5000, 1, '2025-01-01 00:00:00', '2025-06-30 23:59:59', 1, 1, '首次购买月卡立减10元', '仅限月度套餐首单使用', 1, 1, 1, NOW(), NOW()),

-- 节假日优惠券
('SPRING2025', '春节特惠7折券', 'discount_percentage', NULL, 30.00, 50.00, 100.00, '["vip_quarter_basic", "vip_quarter_premium", "vip_year_basic", "vip_year_premium"]', 2000, 2, '2025-01-20 00:00:00', '2025-02-28 23:59:59', 1, 1, '春节期间专享7折优惠', '春节活动期间可使用，每用户限用2张', 1, 1, 1, NOW(), NOW()),

('MAYDAY2025', '五一劳动节特惠', 'discount_percentage', NULL, 25.00, 100.00, 200.00, '["vip_year_basic", "vip_year_premium"]', 500, 1, '2025-04-25 00:00:00', '2025-05-10 23:59:59', 1, 1, '五一劳动节年度套餐75折优惠', '仅限年度套餐使用', 1, 1, 1, NOW(), NOW()),

('NATIONALDAY75', '国庆75折', 'discount_percentage', NULL, 25.00, 50.00, 150.00, '["vip_quarter_basic", "vip_quarter_premium", "vip_year_basic", "vip_year_premium"]', 1000, 2, '2025-09-30 00:00:00', '2025-10-15 23:59:59', 1, 1, '国庆节专享75折优惠', '国庆节活动期间使用', 1, 1, 1, NOW(), NOW()),

-- 限时特价优惠券
('FLASH50', '限时5折特惠', 'discount_percentage', NULL, 50.00, 30.00, 200.00, '["vip_month_premium", "vip_quarter_premium"]', 100, 1, '2025-10-30 00:00:00', '2025-11-05 23:59:59', 1, 1, '限时闪购5折优惠，仅限高级套餐', '闪购活动期间使用，数量有限', 1, 1, 1, NOW(), NOW()),

('QUARTER30', '季度套餐立减30元', 'fixed_amount', 30.00, NULL, 68.00, 30.00, '["vip_quarter_basic", "vip_quarter_premium"]', 2000, 3, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 1, 1, '季度套餐立减30元', '仅限季度套餐使用，每用户限用3张', 1, 1, 1, NOW(), NOW()),

-- 会员专享优惠券
('VIPRENEWAL85', '会员续费85折', 'discount_percentage', NULL, 15.00, 50.00, 300.00, '["vip_month_basic", "vip_month_premium", "vip_quarter_basic", "vip_quarter_premium", "vip_year_basic", "vip_year_premium"]', NULL, 5, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 1, 0, '老会员续费专享85折', '仅限老会员续费使用，不可与新用户优惠叠加', 1, 1, 1, NOW(), NOW()),

('YEAR100OFF', '年卡立减100元', 'fixed_amount', 100.00, NULL, 200.00, 100.00, '["vip_year_basic", "vip_year_premium"]', 500, 2, '2025-06-01 00:00:00', '2025-08-31 23:59:59', 1, 1, '夏季特惠年卡立减100元', '仅限年度套餐使用', 1, 1, 1, NOW(), NOW()),

-- 特殊优惠券
('FRIENDSHIP20', '好友推荐券', 'discount_percentage', NULL, 20.00, 30.00, 60.00, '["vip_month_basic", "vip_month_premium"]', 10000, 1, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 1, 0, '好友推荐专享8折券', '通过好友推荐链接获得', 1, 1, 1, NOW(), NOW()),

('BIRTHDAY88', '生日特惠88折', 'discount_percentage', NULL, 12.00, 50.00, 88.00, '["vip_month_basic", "vip_month_premium", "vip_quarter_basic", "vip_quarter_premium"]', NULL, 1, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 1, 0, '生日月专享88折', '用户生日月专享优惠', 1, 1, 1, NOW(), NOW());

-- ====================================================================
-- 6. 插入促销活动数据
-- ====================================================================

INSERT INTO promotions (promotion_code, promotion_name, promotion_type, description, banner_url, terms, start_time, end_time, target_audience, applicable_plans, discount_rules, participation_limit, participation_count, is_active, is_featured, priority, created_by, updated_by, version, created_at, updated_at) VALUES
-- 新年活动
('NEWYEAR2025', '2025新年特惠', 'discount', '新年新气象，VIP会员超值优惠', '/static/images/promotions/newyear2025.jpg', '活动期间购买VIP套餐享额外95折，可与优惠券叠加使用', '2024-12-25 00:00:00', '2025-01-10 23:59:59', '["all"]', '["vip_month_basic", "vip_month_premium", "vip_quarter_basic", "vip_quarter_premium", "vip_year_basic", "vip_year_premium"]', '{"type":"percentage","value":5,"min_amount":30,"max_discount":200}', 10000, 0, 1, 1, 100, 1, 1, 1, NOW(), NOW()),

-- 春节活动
('SPRINGFESTIVAL', '春节会员嘉年华', 'bundle', '春节会员嘉年华，买一送一超值活动', '/static/images/promotions/spring-festival.jpg', '购买指定套餐送等值时长，限前100名参与', '2025-01-20 00:00:00', '2025-02-15 23:59:59', '["all"]', '["vip_quarter_basic", "vip_quarter_premium", "vip_year_basic"]', '{"type":"buy_one_get_one","gift_duration":"same","eligible_plans":["vip_quarter_basic","vip_quarter_premium","vip_year_basic"]}', 100, 0, 1, 1, 90, 1, 1, 1, NOW(), NOW()),

-- 618购物节活动
('SHOPPING618', '618会员狂欢节', 'flash_sale', '618购物节VIP会员限时特惠', '/static/images/promotions/shopping618.jpg', '6月18日当天限时8折，每日限量50单', '2025-06-10 00:00:00', '2025-06-20 23:59:59', '["all"]', '["vip_month_premium", "vip_quarter_premium", "vip_year_premium"]', '{"type":"flash_sale","discount":20,"daily_limit":50,"start_time":"10:00","end_time":"22:00"}', 500, 0, 1, 1, 85, 1, 1, 1, NOW(), NOW()),

-- 双11活动
('DOUBLE11', '双11会员盛宴', 'seasonal', '双11会员年度最低价，仅限今日', '/static/images/promotions/double11.jpg', '双11当天所有套餐额外立减，全年最低价', '2025-11-01 00:00:00', '2025-11-15 23:59:59', '["all"]', '["vip_month_basic", "vip_month_premium", "vip_quarter_basic", "vip_quarter_premium", "vip_year_basic", "vip_year_premium"]', '{"type":"fixed_discount","amount":"20","min_amount":50,"max_discount":150}', 2000, 0, 1, 1, 95, 1, 1, 1, NOW(), NOW()),

-- 周年庆活动
('ANNIVERSARY3', '网站三周年庆', 'anniversary', '庆祝网站成立三周年，会员超值回馈', '/static/images/promotions/anniversary3.jpg', '周年庆期间所有套餐88折，老用户额外赠送1个月', '2025-10-01 00:00:00', '2025-10-31 23:59:59', '["vip"]', '["vip_month_basic", "vip_month_premium", "vip_quarter_basic", "vip_quarter_premium", "vip_year_basic", "vip_year_premium"]', '{"type":"percentage","value":12,"old_user_bonus":"1_month"}', 3000, 0, 1, 1, 80, 1, 1, 1, NOW(), NOW()),

-- 推荐有礼活动
('REFER_FRIEND', '推荐有礼活动', 'referral', '邀请好友注册购买VIP，双方各得奖励', '/static/images/promotions/refer-friend.jpg', '成功邀请新用户购买VIP套餐，推荐人获得优惠券，被推荐人获得额外折扣', '2025-01-01 00:00:00', '2025-12-31 23:59:59', '["vip"]', '["vip_month_basic", "vip_month_premium", "vip_quarter_basic", "vip_quarter_premium", "vip_year_basic", "vip_year_premium"]', '{"referrer_reward":"coupon_50","referee_reward":"discount_15"}', NULL, 0, 1, 0, 60, 1, 1, 1, NOW(), NOW());

-- ====================================================================
-- 7. 插入推荐码数据（为管理员用户创建）
-- ====================================================================

INSERT INTO referral_codes (user_id, referral_code, referral_link, description, reward_type, reward_value, reward_percentage, max_uses, used_count, valid_from, valid_until, is_active, created_at, updated_at) VALUES
(1, 'VIPADMIN2025', 'https://knene.com/register?ref=VIPADMIN2025', '管理员专属推荐码，邀请好友享特别优惠', 'discount', NULL, 15.00, 100, 0, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 1, NOW(), NOW()),

(1, 'FRIENDVIP88', 'https://knene.com/register?ref=FRIENDVIP88', '朋友专享推荐码，88折优惠', 'discount', NULL, 12.00, 50, 0, '2025-06-01 00:00:00', '2025-12-31 23:59:59', 1, NOW(), NOW()),

(1, 'MOVIE2025', 'https://knene.com/register?ref=MOVIE2025', '影视爱好者推荐码', 'discount', NULL, 10.00, 200, 0, '2025-01-01 00:00:00', '2026-01-01 00:00:00', 1, NOW(), NOW());

-- ====================================================================
-- 8. 插入VIP会员示例数据
-- ====================================================================

-- 为管理员用户创建VIP会员记录（示例）
INSERT INTO vip_memberships (user_id, plan_id, membership_code, membership_level, start_date, end_date, status, auto_renew, renewal_plan_id, payment_method, total_paid, remaining_downloads, benefits_used, notes, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
-- 管理员高级会员
(1, @year_premium_id, CONCAT('VIP', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(1, 6, '0')), 2, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 365 DAY), 'active', 1, @year_premium_id, 'balance', 388.00, 6000,
'{"unlimited_download": true, "hd_quality": true, "uhd_quality": true, "exclusive_content": true}', '系统管理员演示账户', 1, 1, 1, 1, NOW(), NOW()),

-- 为普通用户创建VIP会员记录（示例数据）
-- 这里假设有一些测试用户，实际应用中需要根据真实用户数据调整
(2, @month_basic_id, CONCAT('VIP', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(2, 6, '0')), 1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'active', 0, NULL, 'alipay_web', 25.00, 100,
'{"unlimited_download": true, "no_ads": true}', '普通用户月卡会员', 1, 1, 1, 1, NOW(), NOW()),

(3, @quarter_premium_id, CONCAT('VIP', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(3, 6, '0')), 2, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 90 DAY), 'active', 1, @quarter_premium_id, 'wechat_mobile', 108.00, 1500,
'{"unlimited_download": true, "hd_quality": true, "exclusive_content": true, "advanced_search": true}', '季度高级会员用户', 1, 1, 1, 1, NOW(), NOW());

-- ====================================================================
-- 9. 插入订单示例数据
-- ====================================================================

INSERT INTO orders (order_no, user_id, plan_id, order_type, status, original_price, discount_amount, coupon_amount, final_price, currency, quantity, duration_days, start_date, end_date, notes, paid_at, completed_at, is_active, created_at, updated_at) VALUES
-- 管理员订单
(CONCAT('ORD', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), '001'), 1, @year_premium_id, 'new', 'paid', 600.00, 212.00, 0.00, 388.00, 'CNY', 1, 365, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 365 DAY), '管理员年度高级会员订单', NOW(), NOW(), 1, NOW(), NOW()),

-- 普通用户订单
(CONCAT('ORD', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), '002'), 2, @month_basic_id, 'new', 'paid', 30.00, 5.00, 0.00, 25.00, 'CNY', 1, 30, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), '普通用户月卡订单', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 1, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),

(CONCAT('ORD', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), '003'), 3, @quarter_premium_id, 'new', 'paid', 150.00, 42.00, 0.00, 108.00, 'CNY', 1, 90, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 90 DAY), '季度高级会员订单', DATE_SUB(NOW(), INTERVAL 1 WEEK), DATE_SUB(NOW(), INTERVAL 1 WEEK), 1, DATE_SUB(NOW(), INTERVAL 1 WEEK), NOW()),

-- 赠送订单示例
(CONCAT('ORD', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), '004'), 1, @month_premium_id, 'gift', 'paid', 50.00, 0.00, 0.00, 50.00, 'CNY', 1, 30, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), '管理员赠送的月卡给好友', NOW(), NOW(), 1, NOW(), NOW());

-- ====================================================================
-- 10. 插入支付记录示例数据
-- ====================================================================

INSERT INTO payment_records (order_id, payment_no, payment_method, payment_channel, payment_status, amount, currency, third_party_trade_no, third_party_response, gateway_provider, gateway_response, callback_received, callback_at, verified_at, ip_address, user_agent, created_at, updated_at) VALUES
-- 管理员支付记录
(1, CONCAT('PAY', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), '001'), 'balance', 'web', 'success', 388.00, 'CNY', 'BAL2025103000001', '{"status":"success","transaction_id":"BAL2025103000001"}', 'balance', '{"processed":true,"balance_before":1000.00,"balance_after":612.00}', 1, NOW(), NOW(), '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW(), NOW()),

-- 普通用户支付记录
(2, CONCAT('PAY', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), '002'), 'alipay_web', 'web', 'success', 25.00, 'CNY', '202510302200123456789', '{"trade_status":"TRADE_SUCCESS"}', 'alipay', '{"code":"10000","msg":"Success"}', 1, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),

(3, CONCAT('PAY', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), '003'), 'wechat_mobile', 'mobile', 'success', 108.00, 'CNY', 'wx202510301234567890', '{"result_code":"SUCCESS"}', 'wechat', '{"return_code":"SUCCESS","return_msg":"OK"}', 1, DATE_SUB(NOW(), INTERVAL 1 WEEK), DATE_SUB(NOW(), INTERVAL 1 WEEK), '180.150.200.88', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', DATE_SUB(NOW(), INTERVAL 1 WEEK), NOW()),

(4, CONCAT('PAY', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), '004'), 'gift_card', 'web', 'success', 50.00, 'CNY', 'GIFT2025103000001', '{"status":"success","card_balance":100.00,"remaining_balance":50.00}', 'gift_card', '{"validated":true,"deducted":true}', 1, NOW(), NOW(), '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW(), NOW());

-- ====================================================================
-- 11. 插入用户优惠券示例数据
-- ====================================================================

INSERT INTO user_coupons (user_id, coupon_id, coupon_code, status, received_from, received_at, used_at, used_order_id, expires_at, notes, is_active, created_at, updated_at) VALUES
-- 为管理员用户分配优惠券
(1, (SELECT id FROM coupons WHERE coupon_code = 'WELCOME2025'), 'WELCOME2025', 'available', 'system', NOW(), NULL, NULL, '2025-12-31 23:59:59', '新用户欢迎券', 1, NOW(), NOW()),

(1, (SELECT id FROM coupons WHERE coupon_code = 'VIPRENEWAL85'), 'VIPRENEWAL85', 'available', 'promotion', NOW(), NULL, NULL, '2025-12-31 23:59:59', '会员续费专享券', 1, NOW(), NOW()),

-- 为普通用户分配优惠券
(2, (SELECT id FROM coupons WHERE coupon_code = 'FIRSTMONTH10'), 'FIRSTMONTH10', 'used', 'promotion', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 2, '2025-06-30 23:59:59', '首月立减券已使用', 0, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),

(3, (SELECT id FROM coupons WHERE coupon_code = 'QUARTER30'), 'QUARTER30', 'available', 'gift', NOW(), NULL, NULL, '2025-12-31 23:59:59', '活动赠送的季度套餐优惠券', 1, NOW(), NOW()),

(3, (SELECT id FROM coupons WHERE coupon_code = 'SPRING2025'), 'SPRING2025', 'available', 'promotion', NOW(), NULL, NULL, '2025-02-28 23:59:59', '春节特惠券', 1, NOW(), NOW());

-- ====================================================================
-- 12. 插入VIP业务统计数据
-- ====================================================================

INSERT INTO vip_business_statistics (stat_date, stat_type, new_memberships, active_memberships, expired_memberships, renewed_memberships, total_revenue, average_revenue, conversion_rate, retention_rate, popular_plan_id, plan_distribution, revenue_by_plan, created_by, created_at, updated_at) VALUES
-- 今日统计
(CURDATE(), 'daily', 5, 125, 2, 8, 1250.00, 250.00, 15.50, 85.20, @month_premium_id,
'{"vip_month_basic":45,"vip_month_premium":60,"vip_quarter_basic":15,"vip_quarter_premium":5}',
'{"vip_month_basic":1125.00,"vip_month_premium":2400.00,"vip_quarter_basic":1020.00,"vip_quarter_premium":540.00}',
1, NOW(), NOW()),

-- 昨日统计
(DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'daily', 3, 118, 1, 6, 890.00, 296.67, 14.20, 82.50, @month_basic_id,
'{"vip_month_basic":50,"vip_month_premium":45,"vip_quarter_basic":20,"vip_quarter_premium":3}',
'{"vip_month_basic":1250.00,"vip_month_premium":1800.00,"vip_quarter_basic":1360.00,"vip_quarter_premium":324.00}',
1, NOW(), NOW()),

-- 本周统计
(DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'weekly', 25, 850, 12, 45, 8500.00, 340.00, 16.80, 83.60, @quarter_premium_id,
'{"vip_month_basic":320,"vip_month_premium":280,"vip_quarter_basic":180,"vip_quarter_premium":70}',
'{"vip_month_basic":8000.00,"vip_month_premium":11200.00,"vip_quarter_basic":12240.00,"vip_quarter_premium":7560.00}',
1, NOW(), NOW()),

-- 本月统计
(DATE_FORMAT(CURDATE(), '%Y-%m-01'), 'monthly', 120, 3200, 45, 210, 45000.00, 375.00, 18.50, 84.20, @year_premium_id,
'{"vip_month_basic":1200,"vip_month_premium":1100,"vip_quarter_basic":600,"vip_quarter_premium":250,"vip_year_basic":50}',
'{"vip_month_basic":30000.00,"vip_month_premium":44000.00,"vip_quarter_basic":40800.00,"vip_quarter_premium":27000.00,"vip_year_basic":19400.00}',
1, NOW(), NOW());

-- ====================================================================
-- 数据插入完成日志
-- ====================================================================
-- VIP业务相关表数据插入完成：
-- 1. VIP权益数据：24个权益项，涵盖下载、质量、服务、功能四大类
-- 2. VIP套餐数据：8个套餐，包含月卡、季卡、年卡、体验卡、终身卡等
-- 3. 会员权益关联：为每个套餐配置相应权益，高级套餐包含更多权益
-- 4. 支付方式数据：10种支付方式，支持支付宝、微信、银联、PayPal等
-- 5. 优惠券数据：10种优惠券，包含新用户专享、节假日、限时特价等
-- 6. 促销活动数据：6个活动，涵盖新年、春节、618、双11等重要节日
-- 7. 推荐码数据：为管理员用户创建3个推荐码
-- 8. VIP会员示例：3个会员记录，展示不同类型的会员状态
-- 9. 订单示例数据：4个订单，包含正常订单和赠送订单
-- 10. 支付记录示例：4条支付记录，展示不同支付方式
-- 11. 用户优惠券示例：5条用户优惠券记录
-- 12. VIP业务统计：日、周、月统计数据示例
--
-- 所有数据都包含完整的审计字段
-- 实现了完整的VIP业务流程数据支持
-- 为后续的业务功能开发提供充足的数据基础
-- ====================================================================