-- ====================================================================
-- VIP业务表结构和数据完整性验证脚本（优化版）
-- ====================================================================
-- 版本：V2.1.4-OPTIMIZED
-- 描述：全面验证VIP业务相关表的创建情况、数据完整性和业务逻辑
-- 作者：数据库团队
-- 日期：2025-10-30
-- 验证级别：Level 1 + Level 2（基础数据 + 业务逻辑）
-- ====================================================================

-- 设置SQL模式
SET NAMES utf8mb4;

SELECT '=== VIP业务表验证开始（优化版）===' as verification_status;

-- ====================================================================
-- 1. 验证表是否创建成功（Level 1）
-- ====================================================================

SELECT '1. 检查VIP业务相关表是否存在...' as check_step;

SELECT
    TABLE_NAME as table_name,
    TABLE_COMMENT as table_description,
    TABLE_ROWS as estimated_rows,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as size_mb,
    ROUND((DATA_LENGTH / 1024 / 1024), 2) as data_size_mb,
    ROUND((INDEX_LENGTH / 1024 / 1024), 2) as index_size_mb,
    ENGINE as storage_engine,
    TABLE_COLLATION as collation
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME IN (
        'vip_plans', 'vip_memberships', 'vip_benefits', 'membership_benefits',
        'orders', 'order_items', 'payment_records', 'payment_methods',
        'coupons', 'user_coupons', 'promotions', 'referral_codes',
        'vip_business_statistics'
    )
ORDER BY TABLE_NAME;

-- ====================================================================
-- 2. 验证VIP套餐表（Level 1 + Level 2）
-- ====================================================================

SELECT '2. 验证VIP套餐表数据...' as check_step;

-- 基础统计
SELECT
    COUNT(*) as total_plans,
    COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_plans,
    COUNT(CASE WHEN is_featured = TRUE THEN 1 END) as featured_plans,
    COUNT(CASE WHEN plan_level = 1 THEN 1 END) as level1_plans,
    COUNT(CASE WHEN plan_level = 2 THEN 1 END) as level2_plans,
    COUNT(CASE WHEN plan_level = 3 THEN 1 END) as level3_plans,
    MIN(current_price) as min_price,
    MAX(current_price) as max_price,
    ROUND(AVG(current_price), 2) as avg_price,
    COUNT(CASE WHEN is_trial_available = TRUE THEN 1 END) as trial_available_plans,
    COUNT(CASE WHEN auto_renewal_enabled = TRUE THEN 1 END) as auto_renewal_plans
FROM vip_plans
WHERE deleted_at IS NULL;

-- 价格合理性检查（Level 2）
SELECT
    'Price validation' as validation_name,
    COUNT(*) as invalid_pricing,
    'Plans with pricing issues' as description
FROM vip_plans
WHERE (current_price <= 0 OR original_price <= 0 OR current_price > original_price)
    AND deleted_at IS NULL
UNION ALL
SELECT
    'Duration validation' as validation_name,
    COUNT(*) as invalid_duration,
    'Plans with invalid duration' as description
FROM vip_plans
WHERE (duration_days <= 0 OR duration_days > 3650)
    AND deleted_at IS NULL
UNION ALL
SELECT
    'Level consistency validation' as validation_name,
    COUNT(*) as inconsistent_levels,
    'Plans with inconsistent level pricing' as description
FROM vip_plans vp1
JOIN vip_plans vp2 ON vp1.plan_level < vp2.plan_level
WHERE vp1.current_price > vp2.current_price
    AND vp1.deleted_at IS NULL
    AND vp2.deleted_at IS NULL;

-- 套餐活跃度分析（Level 2）
SELECT
    plan_code,
    plan_name,
    plan_level,
    current_price,
    duration_days,
    is_active,
    is_featured,
    is_trial_available,
    auto_renewal_enabled,
    CASE
        WHEN is_active = TRUE AND is_featured = TRUE THEN 'High Priority'
        WHEN is_active = TRUE AND is_featured = FALSE THEN 'Standard'
        WHEN is_active = FALSE THEN 'Inactive'
        ELSE 'Unknown'
    END as priority_level,
    ROUND(COALESCE(current_price / NULLIF(duration_days, 0), 0) * 30, 2) as monthly_equivalent_price
FROM vip_plans
WHERE deleted_at IS NULL
ORDER BY plan_level, monthly_equivalent_price;

-- ====================================================================
-- 3. 验证VIP会员表（Level 1 + Level 2）
-- ====================================================================

SELECT '3. 验证VIP会员表数据...' as check_step;

-- 基础统计
SELECT
    COUNT(*) as total_memberships,
    COUNT(DISTINCT user_id) as unique_vip_users,
    COUNT(CASE WHEN membership_status = 'active' THEN 1 END) as active_memberships,
    COUNT(CASE WHEN membership_status = 'expired' THEN 1 END) as expired_memberships,
    COUNT(CASE WHEN membership_status = 'cancelled' THEN 1 END) as cancelled_memberships,
    COUNT(CASE WHEN membership_status = 'suspended' THEN 1 END) as suspended_memberships,
    COUNT(CASE WHERE auto_renewal = TRUE THEN 1 END) as auto_renewal_enabled,
    COUNT(CASE WHERE is_trial = TRUE THEN 1 END) as trial_memberships,
    COUNT(CASE WHERE end_date >= CURRENT_DATE THEN 1 END) as currently_valid_memberships
FROM vip_memberships
WHERE deleted_at IS NULL;

-- 会员状态趋势分析（Level 2）
SELECT
    DATE(created_at) as membership_date,
    COUNT(*) as new_memberships,
    COUNT(CASE WHEN membership_status = 'active' THEN 1 END) as active_count,
    COUNT(CASE WHEN is_trial = TRUE THEN 1 END) as trial_count,
    ROUND(AVG(CASE WHEN plan_id IS NOT NULL
        THEN (SELECT current_price FROM vip_plans WHERE id = plan_id)
        ELSE NULL END), 2) as avg_plan_price
FROM vip_memberships
WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
    AND deleted_at IS NULL
GROUP BY DATE(created_at)
ORDER BY membership_date DESC
LIMIT 7;

-- 会员活跃度分析（Level 2）
SELECT
    vp.plan_name,
    vm.plan_level,
    COUNT(vm.id) as membership_count,
    COUNT(CASE WHEN vm.membership_status = 'active' THEN 1 END) as active_count,
    COUNT(CASE WHEN vm.auto_renewal = TRUE THEN 1 END) as auto_renewal_count,
    ROUND(AVG(DATEDIFF(vm.end_date, vm.start_date)), 2) as avg_duration_days,
    ROUND(AVG(CASE WHEN vm.membership_status = 'active'
        THEN DATEDIFF(vm.end_date, CURRENT_DATE)
        ELSE NULL END), 2) as avg_remaining_days
FROM vip_memberships vm
LEFT JOIN vip_plans vp ON vm.plan_id = vp.id
WHERE vm.deleted_at IS NULL
GROUP BY vp.plan_name, vm.plan_level
ORDER BY membership_count DESC;

-- 业务逻辑验证（Level 2）
SELECT
    'Membership consistency validation' as validation_name,
    COUNT(*) as inconsistent_records,
    'Memberships with inconsistent dates' as description
FROM vip_memberships
WHERE (end_date <= start_date OR start_date > CURRENT_DATE)
    AND deleted_at IS NULL
UNION ALL
SELECT
    'Trial period validation' as validation_name,
    COUNT(*) as invalid_trials,
    'Trial memberships with invalid duration' as description
FROM vip_memberships
WHERE is_trial = TRUE
    AND DATEDIFF(end_date, start_date) > 30
    AND deleted_at IS NULL
UNION ALL
SELECT
    'Plan reference validation' as validation_name,
    COUNT(*) as orphaned_memberships,
    'Memberships with invalid plan reference' as description
FROM vip_memberships vm
LEFT JOIN vip_plans vp ON vm.plan_id = vp.id
WHERE vp.id IS NULL AND vm.plan_id IS NOT NULL
    AND vm.deleted_at IS NULL;

-- ====================================================================
-- 4. 验证订单相关表（Level 1 + Level 2）
-- ====================================================================

SELECT '4. 验证订单相关表数据...' as check_step;

-- 订单基础统计
SELECT
    COUNT(*) as total_orders,
    COUNT(DISTINCT user_id) as unique_customers,
    COUNT(CASE WHEN order_status = 'pending' THEN 1 END) as pending_orders,
    COUNT(CASE WHEN order_status = 'paid' THEN 1 END) as paid_orders,
    COUNT(CASE WHEN order_status = 'completed' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN order_status = 'cancelled' THEN 1 END) as cancelled_orders,
    COUNT(CASE WHEN order_status = 'refunded' THEN 1 END) as refunded_orders,
    COUNT(CASE WHEN order_type = 'vip_membership' THEN 1 END) as vip_orders,
    COUNT(CASE WHEN order_type = 'renewal' THEN 1 END) as renewal_orders,
    SUM(total_amount) as total_revenue,
    ROUND(AVG(total_amount), 2) as avg_order_value
FROM orders
WHERE deleted_at IS NULL;

-- 订单状态分布（Level 2）
SELECT
    order_status,
    COUNT(*) as order_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM orders WHERE deleted_at IS NULL), 2) as percentage,
    ROUND(AVG(total_amount), 2) as avg_amount,
    SUM(total_amount) as total_amount
FROM orders
WHERE deleted_at IS NULL
GROUP BY order_status
ORDER BY order_count DESC;

-- 订单支付方式分析（Level 2）
SELECT
    pm.method_name,
    COUNT(o.id) as order_count,
    ROUND(COUNT(o.id) * 100.0 / (SELECT COUNT(*) FROM orders WHERE deleted_at IS NULL), 2) as percentage,
    SUM(o.total_amount) as total_amount,
    ROUND(AVG(o.total_amount), 2) as avg_amount
FROM orders o
LEFT JOIN payment_methods pm ON o.payment_method_id = pm.id
WHERE o.deleted_at IS NULL
    AND pm.deleted_at IS NULL
GROUP BY pm.method_name
ORDER BY order_count DESC;

-- 订单业务逻辑验证（Level 2）
SELECT
    'Order amount validation' as validation_name,
    COUNT(*) as invalid_orders,
    'Orders with invalid amounts' as description
FROM orders
WHERE (total_amount <= 0 OR total_amount > 999999.99)
    AND deleted_at IS NULL
UNION ALL
SELECT
    'Order date consistency' as validation_name,
    COUNT(*) as inconsistent_orders,
    'Orders with inconsistent dates' as description
FROM orders
WHERE (order_date > paid_date OR (paid_date IS NOT NULL AND order_date > paid_date))
    AND deleted_at IS NULL
UNION ALL
SELECT
    'Payment method validation' as validation_name,
    COUNT(*) as invalid_payment_methods,
    'Orders with invalid payment methods' as description
FROM orders o
LEFT JOIN payment_methods pm ON o.payment_method_id = pm.id
WHERE o.payment_method_id IS NOT NULL
    AND pm.id IS NULL
    AND o.deleted_at IS NULL;

-- 订单项详细统计
SELECT
    COUNT(*) as total_order_items,
    COUNT(DISTINCT order_id) as orders_with_items,
    COUNT(CASE WHEN item_type = 'vip_plan' THEN 1 END) as vip_plan_items,
    COUNT(CASE WHEN item_type = 'coupon' THEN 1 END) as coupon_items,
    COUNT(CASE WHEN item_type = 'extension' THEN 1 END) as extension_items,
    AVG(unit_price) as avg_unit_price,
    AVG(quantity) as avg_quantity
FROM order_items
WHERE deleted_at IS NULL;

-- ====================================================================
-- 5. 验证支付记录表（Level 1 + Level 2）
-- ====================================================================

SELECT '5. 验证支付记录表数据...' as check_step;

-- 支付基础统计
SELECT
    COUNT(*) as total_payments,
    COUNT(DISTINCT order_id) as orders_with_payments,
    COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending_payments,
    COUNT(CASE WHEN payment_status = 'processing' THEN 1 END) as processing_payments,
    COUNT(CASE WHEN payment_status = 'success' THEN 1 END) as successful_payments,
    COUNT(CASE WHEN payment_status = 'failed' THEN 1 END) as failed_payments,
    COUNT(CASE WHEN payment_status = 'refunded' THEN 1 END) as refunded_payments,
    SUM(amount) as total_payment_amount,
    ROUND(AVG(amount), 2) as avg_payment_amount,
    COUNT(CASE WHEN transaction_id IS NOT NULL AND transaction_id != '' THEN 1 END) as payments_with_transaction_id
FROM payment_records
WHERE deleted_at IS NULL;

-- 支付成功率分析（Level 2）
SELECT
    DATE(created_at) as payment_date,
    COUNT(*) as total_payments,
    COUNT(CASE WHEN payment_status = 'success' THEN 1 END) as successful_payments,
    COUNT(CASE WHEN payment_status = 'failed' THEN 1 END) as failed_payments,
    ROUND(COUNT(CASE WHEN payment_status = 'success' THEN 1 END) * 100.0 / COUNT(*), 2) as success_rate,
    ROUND(AVG(CASE WHEN payment_status = 'success' THEN amount ELSE NULL END), 2) as avg_successful_amount
FROM payment_records
WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
    AND deleted_at IS NULL
GROUP BY DATE(created_at)
ORDER BY payment_date DESC;

-- 支付方式成功率分析（Level 2）
SELECT
    pm.method_name,
    COUNT(pr.id) as total_payments,
    COUNT(CASE WHEN pr.payment_status = 'success' THEN 1 END) as successful_payments,
    COUNT(CASE WHEN pr.payment_status = 'failed' THEN 1 END) as failed_payments,
    ROUND(COUNT(CASE WHEN pr.payment_status = 'success' THEN 1 END) * 100.0 / COUNT(pr.id), 2) as success_rate,
    ROUND(AVG(CASE WHEN pr.payment_status = 'success' THEN pr.amount ELSE NULL END), 2) as avg_successful_amount
FROM payment_records pr
JOIN payment_methods pm ON pr.payment_method_id = pm.id
WHERE pr.deleted_at IS NULL
    AND pm.deleted_at IS NULL
GROUP BY pm.method_name
ORDER BY success_rate DESC;

-- 支付业务逻辑验证（Level 2）
SELECT
    'Payment amount validation' as validation_name,
    COUNT(*) as invalid_payments,
    'Payments with invalid amounts' as description
FROM payment_records
WHERE (amount <= 0 OR amount > 999999.99)
    AND deleted_at IS NULL
UNION ALL
SELECT
    'Payment date logic' as validation_name,
    COUNT(*) as illogical_payments,
    'Payments with illogical dates' as description
FROM payment_records
WHERE (created_at > paid_at OR (paid_at IS NOT NULL AND created_at > paid_at))
    AND deleted_at IS NULL
UNION ALL
SELECT
    'Transaction ID uniqueness' as validation_name,
    COUNT(*) as duplicate_transactions,
    'Payments with duplicate transaction IDs' as description
FROM payment_records
WHERE transaction_id IS NOT NULL
    AND transaction_id != ''
    AND deleted_at IS NULL
GROUP BY transaction_id
HAVING COUNT(*) > 1;

-- ====================================================================
-- 6. 验证优惠券系统（Level 1 + Level 2）
-- ====================================================================

SELECT '6. 验证优惠券系统数据...' as check_step;

-- 优惠券基础统计
SELECT
    COUNT(*) as total_coupons,
    COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_coupons,
    COUNT(CASE WHEN coupon_type = 'percentage' THEN 1 END) as percentage_coupons,
    COUNT(CASE WHEN coupon_type = 'fixed' THEN 1 END) as fixed_coupons,
    COUNT(CASE WHEN coupon_type = 'free_trial' THEN 1 END) as free_trial_coupons,
    COUNT(CASE WHERE usage_limit IS NOT NULL THEN 1 END) as coupons_with_limit,
    COUNT(CASE WHERE start_date <= CURRENT_DATE AND (end_date >= CURRENT_DATE OR end_date IS NULL) THEN 1 END) as currently_valid_coupons,
    COUNT(CASE WHERE start_date > CURRENT_DATE THEN 1 END) as upcoming_coupons,
    COUNT(CASE WHERE end_date < CURRENT_DATE THEN 1 END) as expired_coupons
FROM coupons
WHERE deleted_at IS NULL;

-- 用户优惠券使用统计（Level 2）
SELECT
    COUNT(*) as total_user_coupons,
    COUNT(DISTINCT user_id) as users_with_coupons,
    COUNT(CASE WHEN usage_status = 'available' THEN 1 END) as available_coupons,
    COUNT(CASE WHEN usage_status = 'used' THEN 1 END) as used_coupons,
    COUNT(CASE WHEN usage_status = 'expired' THEN 1 END) as expired_user_coupons,
    COUNT(CASE WHEN usage_status = 'cancelled' THEN 1 END) as cancelled_coupons,
    COUNT(CASE WHERE used_at IS NOT NULL THEN 1 END) as coupons_with_usage_record
FROM user_coupons
WHERE deleted_at IS NULL;

-- 优惠券使用率分析（Level 2）
SELECT
    c.coupon_code,
    c.coupon_name,
    c.discount_value,
    c.coupon_type,
    COUNT(uc.id) as total_distributed,
    COUNT(CASE WHEN uc.usage_status = 'used' THEN 1 END) as total_used,
    COUNT(CASE WHEN uc.usage_status = 'available' THEN 1 END) as still_available,
    ROUND(COUNT(CASE WHEN uc.usage_status = 'used' THEN 1 END) * 100.0 / NULLIF(COUNT(uc.id), 0), 2) as usage_rate,
    ROUND(AVG(CASE WHEN uc.usage_status = 'used' AND uc.used_at IS NOT NULL
        THEN DATEDIFF(uc.used_at, uc.created_at)
        ELSE NULL END), 2) as avg_days_to_use
FROM coupons c
LEFT JOIN user_coupons uc ON c.id = uc.coupon_id
WHERE c.deleted_at IS NULL
    AND uc.deleted_at IS NULL
GROUP BY c.id, c.coupon_code, c.coupon_name, c.discount_value, c.coupon_type
HAVING COUNT(uc.id) > 0
ORDER BY usage_rate DESC;

-- 优惠券业务逻辑验证（Level 2）
SELECT
    'Coupon discount validation' as validation_name,
    COUNT(*) as invalid_discounts,
    'Coupons with invalid discount values' as description
FROM coupons
WHERE (coupon_type = 'percentage' AND (discount_value <= 0 OR discount_value > 100))
    OR (coupon_type = 'fixed' AND discount_value <= 0)
    AND deleted_at IS NULL
UNION ALL
SELECT
    'Coupon date logic' as validation_name,
    COUNT(*) as invalid_dates,
    'Coupons with invalid date ranges' as description
FROM coupons
WHERE start_date >= end_date
    AND deleted_at IS NULL
UNION ALL
SELECT
    'Usage limit validation' as validation_name,
    COUNT(*) as invalid_limits,
    'Coupons with invalid usage limits' as description
FROM coupons
WHERE usage_limit <= 0
    AND usage_limit IS NOT NULL
    AND deleted_at IS NULL;

-- ====================================================================
-- 7. 验证推广和推荐码系统（Level 1 + Level 2）
-- ====================================================================

SELECT '7. 验证推广和推荐码系统数据...' as check_step;

-- 推广活动统计
SELECT
    COUNT(*) as total_promotions,
    COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_promotions,
    COUNT(CASE WHEN promotion_type = 'discount' THEN 1 END) as discount_promotions,
    COUNT(CASE WHEN promotion_type = 'cashback' THEN 1 END) as cashback_promotions,
    COUNT(CASE WHEN promotion_type = 'referral' THEN 1 END) as referral_promotions,
    COUNT(CASE WHERE start_date <= CURRENT_DATE AND (end_date >= CURRENT_DATE OR end_date IS NULL) THEN 1 END) as ongoing_promotions
FROM promotions
WHERE deleted_at IS NULL;

-- 推荐码统计
SELECT
    COUNT(*) as total_referral_codes,
    COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_referral_codes,
    COUNT(DISTINCT referrer_id) as active_referrers,
    COUNT(DISTINCT referred_user_id) as total_referred_users,
    COUNT(CASE WHEN referral_status = 'pending' THEN 1 END) as pending_referrals,
    COUNT(CASE WHEN referral_status = 'completed' THEN 1 END) as completed_referrals,
    COUNT(CASE WHEN referral_status = 'rewarded' THEN 1 END) as rewarded_referrals,
    SUM(referral_reward_amount) as total_rewards_paid
FROM referral_codes
WHERE deleted_at IS NULL;

-- 推荐效果分析（Level 2）
SELECT
    u.username as referrer_username,
    COUNT(rc.id) as total_referrals,
    COUNT(CASE WHEN rc.referral_status = 'completed' THEN 1 END) as successful_referrals,
    COUNT(CASE WHEN rc.referral_status = 'rewarded' THEN 1 END) as rewarded_referrals,
    SUM(rc.referral_reward_amount) as total_earned,
    ROUND(COUNT(CASE WHEN rc.referral_status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(rc.id), 0), 2) as success_rate,
    MAX(rc.created_at) as last_referral_date
FROM referral_codes rc
JOIN users u ON rc.referrer_id = u.id
WHERE rc.deleted_at IS NULL
    AND u.deleted_at IS NULL
GROUP BY rc.referrer_id, u.username
HAVING COUNT(rc.id) > 0
ORDER BY successful_referrals DESC
LIMIT 10;

-- ====================================================================
-- 8. 验证VIP业务统计表（Level 1 + Level 2）
-- ====================================================================

SELECT '8. 验证VIP业务统计表数据...' as check_step;

SELECT
    COUNT(*) as total_statistics_records,
    COUNT(DISTINCT DATE(statistics_date)) as unique_dates,
    COUNT(DISTINCT statistics_type) as statistic_types,
    MAX(statistics_date) as latest_date,
    MIN(statistics_date) as earliest_date,
    SUM(CASE WHEN numeric_value IS NOT NULL THEN 1 ELSE 0 END) as numeric_records,
    SUM(CASE WHEN text_value IS NOT NULL THEN 1 ELSE 0 END) as text_records
FROM vip_business_statistics
WHERE deleted_at IS NULL;

-- 统计数据类型分析
SELECT
    statistics_type,
    COUNT(*) as record_count,
    COUNT(DISTINCT DATE(statistics_date)) as days_covered,
    MAX(CASE WHEN numeric_value IS NOT NULL THEN numeric_value ELSE 0 END) as max_numeric_value,
    MIN(CASE WHEN numeric_value IS NOT NULL THEN numeric_value ELSE 0 END) as min_numeric_value,
    ROUND(AVG(CASE WHEN numeric_value IS NOT NULL THEN numeric_value ELSE NULL END), 2) as avg_numeric_value
FROM vip_business_statistics
WHERE deleted_at IS NULL
GROUP BY statistics_type
ORDER BY record_count DESC;

-- ====================================================================
-- 9. 数据一致性检查（Level 2）
-- ====================================================================

SELECT '9. 执行数据一致性检查...' as check_step;

-- 订单与支付记录一致性
SELECT
    'Order-Payment consistency' as check_name,
    COUNT(*) as inconsistent_orders
FROM orders o
LEFT JOIN payment_records pr ON o.id = pr.order_id
WHERE o.order_status = 'paid'
    AND (pr.id IS NULL OR pr.payment_status != 'success')
    AND o.deleted_at IS NULL;

-- 会员与订单一致性
SELECT
    'Membership-Order consistency' as check_name,
    COUNT(*) as orphaned_memberships
FROM vip_memberships vm
LEFT JOIN orders o ON vm.order_id = o.id
WHERE vm.order_id IS NOT NULL
    AND (o.id IS NULL OR o.deleted_at IS NOT NULL)
    AND vm.deleted_at IS NULL;

-- 用户优惠券与优惠券一致性
SELECT
    'UserCoupon-Coupon consistency' as check_name,
    COUNT(*) as orphaned_user_coupons
FROM user_coupons uc
LEFT JOIN coupons c ON uc.coupon_id = c.id
WHERE c.id IS NULL
    AND uc.deleted_at IS NULL;

-- 推荐码与用户一致性
SELECT
    'Referral-User consistency' as check_name,
    COUNT(*) as invalid_referrals
FROM referral_codes rc
LEFT JOIN users u1 ON rc.referrer_id = u1.id
LEFT JOIN users u2 ON rc.referred_user_id = u2.id
WHERE (u1.id IS NULL OR u2.id IS NULL)
    AND rc.deleted_at IS NULL;

-- ====================================================================
-- 10. 性能和容量分析（Level 2）
-- ====================================================================

SELECT '10. 执行性能和容量分析...' as check_step;

-- 表大小和增长分析
SELECT
    TABLE_NAME as table_name,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as total_size_mb,
    ROUND((DATA_LENGTH / 1024 / 1024), 2) as data_size_mb,
    ROUND((INDEX_LENGTH / 1024 / 1024), 2) as index_size_mb,
    TABLE_ROWS as estimated_rows,
    ROUND((INDEX_LENGTH / DATA_LENGTH) * 100, 2) as index_percentage,
    CREATE_TIME as created_time,
    UPDATE_TIME as last_updated
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME IN (
        'vip_plans', 'vip_memberships', 'orders', 'payment_records',
        'coupons', 'user_coupons', 'referral_codes'
    )
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;

-- 高价值表增长分析
SELECT
    'orders' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 END) as last_day,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as last_week,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as last_month
FROM orders
WHERE deleted_at IS NULL

UNION ALL

SELECT
    'payment_records' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 END) as last_day,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as last_week,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as last_month
FROM payment_records
WHERE deleted_at IS NULL

UNION ALL

SELECT
    'user_coupons' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 END) as last_day,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as last_week,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as last_month
FROM user_coupons
WHERE deleted_at IS NULL;

-- ====================================================================
-- 11. 安全性检查（Level 2）
-- ====================================================================

SELECT '11. 执行安全性检查...' as check_step;

-- 支付安全检查
SELECT
    'High value payment check' as security_check,
    COUNT(*) as high_value_payments,
    'Payments exceeding 10,000' as description
FROM payment_records
WHERE amount > 10000
    AND payment_status = 'success'
    AND deleted_at IS NULL

UNION ALL

SELECT
    'Duplicate payment check' as security_check,
    COUNT(*) as potential_duplicates,
    'Potential duplicate payments within 5 minutes' as description
FROM payment_records pr1
JOIN payment_records pr2 ON pr1.order_id = pr2.order_id
    AND pr1.id < pr2.id
    AND ABS(TIMESTAMPDIFF(SECOND, pr1.created_at, pr2.created_at)) <= 300
WHERE pr1.payment_status = 'success'
    AND pr2.payment_status = 'success'
    AND pr1.deleted_at IS NULL
    AND pr2.deleted_at IS NULL

UNION ALL

SELECT
    'Referral abuse check' as security_check,
    COUNT(*) as suspicious_referrals,
    'Users with excessive referrals (>50)' as description
FROM referral_codes
WHERE referrer_id IS NOT NULL
    AND deleted_at IS NULL
GROUP BY referrer_id
HAVING COUNT(*) > 50;

-- 优惠券欺诈检查
SELECT
    'Coupon abuse check' as security_check,
    COUNT(*) as abusive_users,
    'Users using excessive coupons (>20)' as description
FROM user_coupons
WHERE usage_status = 'used'
    AND deleted_at IS NULL
GROUP BY user_id
HAVING COUNT(*) > 20;

-- ====================================================================
-- 12. 业务KPI指标（Level 2）
-- ====================================================================

SELECT '12. 计算业务KPI指标...' as check_step;

-- VIP业务核心指标
SELECT
    'Active VIP Users' as kpi_name,
    COUNT(DISTINCT vm.user_id) as kpi_value,
    'Current active VIP subscribers' as kpi_description
FROM vip_memberships vm
WHERE vm.membership_status = 'active'
    AND vm.end_date >= CURRENT_DATE
    AND vm.deleted_at IS NULL

UNION ALL

SELECT
    'Monthly Recurring Revenue (MRR)' as kpi_name,
    ROUND(SUM(
        CASE
            WHEN vp.current_price IS NOT NULL AND vm.membership_status = 'active'
            AND vm.end_date >= CURRENT_DATE
            THEN (vp.current_price / NULLIF(vp.duration_days, 0)) * 30
            ELSE 0
        END
    ), 2) as kpi_value,
    'Estimated monthly recurring revenue' as kpi_description
FROM vip_memberships vm
LEFT JOIN vip_plans vp ON vm.plan_id = vp.id
WHERE vm.deleted_at IS NULL
    AND vp.deleted_at IS NULL

UNION ALL

SELECT
    'Average Revenue Per User (ARPU)' as kpi_name,
    ROUND(
        COALESCE(
            (SELECT SUM(total_amount) FROM orders WHERE order_status = 'paid' AND deleted_at IS NULL) /
            NULLIF((SELECT COUNT(DISTINCT user_id) FROM vip_memberships WHERE deleted_at IS NULL), 0), 0
        ), 2
    ) as kpi_value,
    'Average revenue per VIP user' as kpi_description

UNION ALL

SELECT
    'Payment Success Rate' as kpi_name,
    ROUND(
        COALESCE(
            (SELECT COUNT(*) FROM payment_records WHERE payment_status = 'success' AND deleted_at IS NULL) * 100.0 /
            NULLIF((SELECT COUNT(*) FROM payment_records WHERE deleted_at IS NULL), 0), 0
        ), 2
    ) as kpi_value,
    'Overall payment success rate percentage' as kpi_description

UNION ALL

SELECT
    'Coupon Usage Rate' as kpi_name,
    ROUND(
        COALESCE(
            (SELECT COUNT(*) FROM user_coupons WHERE usage_status = 'used' AND deleted_at IS NULL) * 100.0 /
            NULLIF((SELECT COUNT(*) FROM user_coupons WHERE deleted_at IS NULL), 0), 0
        ), 2
    ) as kpi_value,
    'Coupon usage rate percentage' as kpi_description;

-- ====================================================================
-- 13. 验证结果汇总和健康评分
-- ====================================================================

SELECT '13. 生成验证结果汇总...' as check_step;

-- 健康评分计算
SELECT
    'VIP Business Verification Summary' as summary_type,
    (SELECT COUNT(*) FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME IN (
         'vip_plans', 'vip_memberships', 'vip_benefits', 'membership_benefits',
         'orders', 'order_items', 'payment_records', 'payment_methods',
         'coupons', 'user_coupons', 'promotions', 'referral_codes',
         'vip_business_statistics'
     )) as total_tables_found,

    -- 基础数据统计
    (SELECT COUNT(*) FROM vip_plans WHERE is_active = TRUE AND deleted_at IS NULL) as active_vip_plans,
    (SELECT COUNT(*) FROM vip_memberships WHERE membership_status = 'active' AND deleted_at IS NULL) as active_memberships,
    (SELECT COUNT(*) FROM orders WHERE order_status = 'paid' AND deleted_at IS NULL) as paid_orders,
    (SELECT COUNT(*) FROM payment_records WHERE payment_status = 'success' AND deleted_at IS NULL) as successful_payments,
    (SELECT COUNT(*) FROM coupons WHERE is_active = TRUE AND deleted_at IS NULL) as active_coupons,

    -- 业务质量指标
    (SELECT COUNT(*) FROM vip_plans WHERE is_active = TRUE AND deleted_at IS NULL) as available_plans,
    (SELECT COUNT(DISTINCT user_id) FROM vip_memberships WHERE membership_status = 'active' AND deleted_at IS NULL) as active_vip_users,
    COALESCE((SELECT SUM(total_amount) FROM orders WHERE order_status = 'paid' AND deleted_at IS NULL), 0) as total_revenue,
    COALESCE(ROUND(
        (SELECT COUNT(*) FROM payment_records WHERE payment_status = 'success' AND deleted_at IS NULL) * 100.0 /
        NULLIF((SELECT COUNT(*) FROM payment_records WHERE deleted_at IS NULL), 0), 2
    ), 0) as payment_success_rate,

    -- 健康评分 (0-100)
    CASE
        WHEN (SELECT COUNT(*) FROM information_schema.TABLES
              WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME IN (
                  'vip_plans', 'vip_memberships', 'vip_benefits', 'membership_benefits',
                  'orders', 'order_items', 'payment_records', 'payment_methods',
                  'coupons', 'user_coupons', 'promotions', 'referral_codes',
                  'vip_business_statistics'
              )) = 13
             AND (SELECT COUNT(*) FROM vip_plans WHERE is_active = TRUE AND deleted_at IS NULL) >= 3
             AND (SELECT COUNT(*) FROM vip_memberships WHERE membership_status = 'active' AND deleted_at IS NULL) > 0
             AND (SELECT COUNT(*) FROM payment_methods WHERE is_active = TRUE AND deleted_at IS NULL) >= 2
             AND COALESCE(ROUND(
                 (SELECT COUNT(*) FROM payment_records WHERE payment_status = 'success' AND deleted_at IS NULL) * 100.0 /
                 NULLIF((SELECT COUNT(*) FROM payment_records WHERE deleted_at IS NULL), 0), 2
             ), 0) >= 90
        THEN 95
        WHEN (SELECT COUNT(*) FROM information_schema.TABLES
              WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME IN (
                  'vip_plans', 'vip_memberships', 'vip_benefits', 'membership_benefits',
                  'orders', 'order_items', 'payment_records', 'payment_methods',
                  'coupons', 'user_coupons', 'promotions', 'referral_codes',
                  'vip_business_statistics'
              )) >= 10
             AND (SELECT COUNT(*) FROM vip_plans WHERE is_active = TRUE AND deleted_at IS NULL) >= 2
             AND (SELECT COUNT(*) FROM payment_methods WHERE is_active = TRUE AND deleted_at IS NULL) >= 1
        THEN 80
        WHEN (SELECT COUNT(*) FROM information_schema.TABLES
              WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME IN (
                  'vip_plans', 'vip_memberships', 'vip_benefits', 'membership_benefits',
                  'orders', 'order_items', 'payment_records', 'payment_methods',
                  'coupons', 'user_coupons', 'promotions', 'referral_codes',
                  'vip_business_statistics'
              )) >= 7
             AND (SELECT COUNT(*) FROM vip_plans WHERE deleted_at IS NULL) >= 1
        THEN 60
        ELSE 30
    END as health_score,

    -- 业务就绪状态
    CASE
        WHEN (SELECT COUNT(*) FROM information_schema.TABLES
              WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME IN (
                  'vip_plans', 'vip_memberships', 'vip_benefits', 'membership_benefits',
                  'orders', 'order_items', 'payment_records', 'payment_methods',
                  'coupons', 'user_coupons', 'promotions', 'referral_codes',
                  'vip_business_statistics'
              )) = 13
             AND (SELECT COUNT(*) FROM vip_plans WHERE is_active = TRUE AND deleted_at IS NULL) >= 3
             AND (SELECT COUNT(*) FROM payment_methods WHERE is_active = TRUE AND deleted_at IS NULL) >= 2
             AND (SELECT COUNT(*) FROM coupons WHERE is_active = TRUE AND deleted_at IS NULL) >= 5
             AND COALESCE(ROUND(
                 (SELECT COUNT(*) FROM payment_records WHERE payment_status = 'success' AND deleted_at IS NULL) * 100.0 /
                 NULLIF((SELECT COUNT(*) FROM payment_records WHERE deleted_at IS NULL), 0), 2
             ), 0) >= 90
        THEN '✅ VIP业务模块已完全就绪，可以投入生产使用'
        WHEN (SELECT COUNT(*) FROM information_schema.TABLES
              WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME IN (
                  'vip_plans', 'vip_memberships', 'vip_benefits', 'membership_benefits',
                  'orders', 'order_items', 'payment_records', 'payment_methods',
                  'coupons', 'user_coupons', 'promotions', 'referral_codes',
                  'vip_business_statistics'
              )) >= 10
             AND (SELECT COUNT(*) FROM vip_plans WHERE is_active = TRUE AND deleted_at IS NULL) >= 2
        THEN '⚠️ VIP业务模块基本就绪，需要完善部分功能'
        WHEN (SELECT COUNT(*) FROM information_schema.TABLES
              WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME IN (
                  'vip_plans', 'vip_memberships', 'vip_benefits', 'membership_benefits',
                  'orders', 'order_items', 'payment_records', 'payment_methods',
                  'coupons', 'user_coupons', 'promotions', 'referral_codes',
                  'vip_business_statistics'
              )) >= 7
        THEN '🔧 VIP业务模块部分就绪，需要补充核心表和数据'
        ELSE '❌ VIP业务模块未就绪，需要检查表创建和数据初始化'
    END as business_readiness_status;

SELECT '=== VIP业务表验证完成（优化版）===' as verification_status;