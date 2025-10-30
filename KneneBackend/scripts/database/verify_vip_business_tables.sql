-- ====================================================================
-- VIP业务表结构和数据完整性验证脚本
-- ====================================================================
-- 版本：V2.1.4
-- 描述：验证VIP业务相关表的创建情况和数据完整性
-- 作者：数据库团队
-- 日期：2025-10-30
-- ====================================================================

-- 设置SQL模式
SET NAMES utf8mb4;

SELECT '=== VIP业务表验证开始 ===' as verification_status;

-- ====================================================================
-- 1. 验证表是否创建成功
-- ====================================================================

SELECT '1. 检查VIP业务相关表是否存在...' as check_step;

SELECT
    TABLE_NAME as table_name,
    TABLE_COMMENT as table_description,
    TABLE_ROWS as estimated_rows,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as size_mb
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
-- 2. 验证VIP套餐表
-- ====================================================================

SELECT '2. 验证VIP套餐表数据...' as check_step;

SELECT
    COUNT(*) as total_plans,
    COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_plans,
    COUNT(CASE WHEN is_featured = 1 THEN 1 END) as featured_plans,
    COUNT(CASE WHEN plan_level = 1 THEN 1 END) as level1_plans,
    COUNT(CASE WHEN plan_level = 2 THEN 1 END) as level2_plans,
    COUNT(CASE WHEN plan_level = 3 THEN 1 END) as level3_plans,
    MIN(current_price) as min_price,
    MAX(current_price) as max_price,
    AVG(current_price) as avg_price
FROM vip_plans;

-- 详细套餐信息
SELECT
    plan_code,
    plan_name,
    plan_level,
    duration_days,
    original_price,
    current_price,
    is_active,
    is_featured
FROM vip_plans
ORDER BY plan_level, current_price;

-- ====================================================================
-- 3. 验证VIP权益表
-- ====================================================================

SELECT '3. 验证VIP权益表数据...' as check_step;

SELECT
    COUNT(*) as total_benefits,
    COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_benefits,
    COUNT(DISTINCT benefit_type) as benefit_types
FROM vip_benefits;

-- 权益类型分布
SELECT
    benefit_type,
    COUNT(*) as benefit_count,
    COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_count
FROM vip_benefits
GROUP BY benefit_type
ORDER BY benefit_count DESC;

-- ====================================================================
-- 4. 验证会员权益关联表
-- ====================================================================

SELECT '4. 验证会员权益关联表数据...' as check_step;

SELECT
    COUNT(*) as total_associations,
    COUNT(CASE WHEN is_included = 1 THEN 1 END) as included_associations,
    COUNT(DISTINCT plan_id) as plans_with_benefits,
    COUNT(DISTINCT benefit_id) as benefits_assigned
FROM membership_benefits;

-- 每个套餐的权益数量
SELECT
    vp.plan_name,
    vp.plan_level,
    COUNT(mpb.id) as benefit_count,
    COUNT(CASE WHEN mpb.is_included = 1 THEN 1 END) as included_count
FROM vip_plans vp
LEFT JOIN membership_benefits mpb ON vp.id = mpb.plan_id
GROUP BY vp.id, vp.plan_name, vp.plan_level
ORDER BY vp.plan_level, benefit_count DESC;

-- ====================================================================
-- 5. 验证支付方式表
-- ====================================================================

SELECT '5. 验证支付方式表数据...' as check_step;

SELECT
    COUNT(*) as total_methods,
    COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_methods,
    COUNT(DISTINCT method_type) as method_types,
    COUNT(DISTINCT provider_code) as providers
FROM payment_methods;

-- 支付方式分布
SELECT
    method_type,
    COUNT(*) as method_count,
    COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_count,
    GROUP_CONCAT(provider_code) as providers
FROM payment_methods
GROUP BY method_type
ORDER BY method_count DESC;

-- ====================================================================
-- 6. 验证优惠券表
-- ====================================================================

SELECT '6. 验证优惠券表数据...' as check_step;

SELECT
    COUNT(*) as total_coupons,
    COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_coupons,
    COUNT(CASE WHEN is_public = 1 THEN 1 END) as public_coupons,
    COUNT(DISTINCT coupon_type) as coupon_types,
    SUM(used_count) as total_used
FROM coupons;

-- 优惠券类型分布
SELECT
    coupon_type,
    COUNT(*) as coupon_count,
    AVG(discount_percentage) as avg_discount_percentage,
    AVG(discount_value) as avg_discount_value,
    SUM(used_count) as total_used
FROM coupons
GROUP BY coupon_type
ORDER BY coupon_count DESC;

-- ====================================================================
-- 7. 验证促销活动表
-- ====================================================================

SELECT '7. 验证促销活动表数据...' as check_step;

SELECT
    COUNT(*) as total_promotions,
    COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_promotions,
    COUNT(CASE WHEN is_featured = 1 THEN 1 END) as featured_promotions,
    COUNT(DISTINCT promotion_type) as promotion_types,
    SUM(participation_count) as total_participations
FROM promotions;

-- 促销活动类型分布
SELECT
    promotion_type,
    COUNT(*) as promotion_count,
    COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_count,
    AVG(priority) as avg_priority
FROM promotions
GROUP BY promotion_type
ORDER BY promotion_count DESC;

-- ====================================================================
-- 8. 验证订单表
-- ====================================================================

SELECT '8. 验证订单表数据...' as check_step;

SELECT
    COUNT(*) as total_orders,
    COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_orders,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT plan_id) as plans_ordered,
    SUM(final_price) as total_revenue,
    AVG(final_price) as avg_order_value
FROM orders;

-- 订单状态分布
SELECT
    status,
    COUNT(*) as order_count,
    SUM(final_price) as total_amount,
    AVG(final_price) as avg_amount
FROM orders
GROUP BY status
ORDER BY order_count DESC;

-- ====================================================================
-- 9. 验证支付记录表
-- ====================================================================

SELECT '9. 验证支付记录表数据...' as check_step;

SELECT
    COUNT(*) as total_payments,
    COUNT(CASE WHEN payment_status = 'success' THEN 1 END) as successful_payments,
    COUNT(CASE WHEN payment_status = 'failed' THEN 1 END) as failed_payments,
    COUNT(DISTINCT payment_method) as payment_methods_used,
    COUNT(CASE WHEN callback_received = 1 THEN 1 END) as callbacks_received,
    SUM(amount) as total_payment_amount
FROM payment_records;

-- 支付方式使用统计
SELECT
    payment_method,
    COUNT(*) as payment_count,
    COUNT(CASE WHEN payment_status = 'success' THEN 1 END) as success_count,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount
FROM payment_records
GROUP BY payment_method
ORDER BY payment_count DESC;

-- ====================================================================
-- 10. 验证VIP会员表
-- ====================================================================

SELECT '10. 验证VIP会员表数据...' as check_step;

SELECT
    COUNT(*) as total_memberships,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_memberships,
    COUNT(CASE WHEN auto_renew = 1 THEN 1 END) as auto_renew_memberships,
    COUNT(DISTINCT user_id) as unique_vip_users,
    COUNT(DISTINCT plan_id) as subscribed_plans,
    AVG(total_paid) as avg_total_paid
FROM vip_memberships;

-- 会员状态分布
SELECT
    status,
    COUNT(*) as membership_count,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(total_paid) as avg_paid
FROM vip_memberships
GROUP BY status
ORDER BY membership_count DESC;

-- ====================================================================
-- 11. 验证用户优惠券表
-- ====================================================================

SELECT '11. 验证用户优惠券表数据...' as check_step;

SELECT
    COUNT(*) as total_user_coupons,
    COUNT(CASE WHEN status = 'available' THEN 1 END) as available_coupons,
    COUNT(CASE WHEN status = 'used' THEN 1 END) as used_coupons,
    COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_coupons,
    COUNT(DISTINCT user_id) as users_with_coupons,
    COUNT(DISTINCT coupon_id) as distributed_coupon_types
FROM user_coupons;

-- 用户优惠券状态分布
SELECT
    status,
    COUNT(*) as coupon_count,
    COUNT(DISTINCT user_id) as unique_users
FROM user_coupons
GROUP BY status
ORDER BY coupon_count DESC;

-- ====================================================================
-- 12. 验证VIP业务统计表
-- ====================================================================

SELECT '12. 验证VIP业务统计表数据...' as check_step;

SELECT
    COUNT(*) as total_statistics,
    COUNT(DISTINCT stat_type) as stat_types,
    COUNT(DISTINCT stat_date) as unique_dates,
    SUM(new_memberships) as total_new_memberships,
    SUM(active_memberships) as total_active_memberships,
    SUM(total_revenue) as total_recorded_revenue,
    AVG(conversion_rate) as avg_conversion_rate,
    AVG(retention_rate) as avg_retention_rate
FROM vip_business_statistics;

-- 统计类型分布
SELECT
    stat_type,
    COUNT(*) as record_count,
    AVG(new_memberships) as avg_new_memberships,
    AVG(total_revenue) as avg_revenue,
    MAX(stat_date) as latest_date,
    MIN(stat_date) as earliest_date
FROM vip_business_statistics
GROUP BY stat_type
ORDER BY stat_type;

-- ====================================================================
-- 13. 数据完整性检查
-- ====================================================================

SELECT '13. 数据完整性检查...' as check_step;

-- 检查外键约束完整性
SELECT
    'vip_memberships' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN user_id IS NOT NULL AND user_id IN (SELECT id FROM users) THEN 1 END) as valid_user_refs,
    COUNT(CASE WHEN plan_id IS NOT NULL AND plan_id IN (SELECT id FROM vip_plans) THEN 1 END) as valid_plan_refs
FROM vip_memberships

UNION ALL

SELECT
    'orders' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN user_id IS NOT NULL AND user_id IN (SELECT id FROM users) THEN 1 END) as valid_user_refs,
    COUNT(CASE WHEN plan_id IS NOT NULL AND plan_id IN (SELECT id FROM vip_plans) THEN 1 END) as valid_plan_refs
FROM orders

UNION ALL

SELECT
    'payment_records' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN order_id IS NOT NULL AND order_id IN (SELECT id FROM orders) THEN 1 END) as valid_order_refs,
    NULL as valid_plan_refs
FROM payment_records

UNION ALL

SELECT
    'user_coupons' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN user_id IS NOT NULL AND user_id IN (SELECT id FROM users) THEN 1 END) as valid_user_refs,
    COUNT(CASE WHEN coupon_id IS NOT NULL AND coupon_id IN (SELECT id FROM coupons) THEN 1 END) as valid_coupon_refs
FROM user_coupons;

-- ====================================================================
-- 14. 业务逻辑验证
-- ====================================================================

SELECT '14. 业务逻辑验证...' as check_step;

-- 检查订单与支付记录的一致性
SELECT
    'Order-Payment Consistency Check' as check_name,
    COUNT(CASE WHEN o.final_price != pr.amount THEN 1 END) as amount_mismatch,
    COUNT(CASE WHEN o.status = 'paid' AND pr.payment_status != 'success' THEN 1 END) as status_mismatch,
    COUNT(CASE WHEN o.status = 'paid' AND pr.id IS NULL THEN 1 END) as missing_payment
FROM orders o
LEFT JOIN payment_records pr ON o.id = pr.order_id
WHERE o.status = 'paid';

-- 检查会员与订单的一致性
SELECT
    'Membership-Order Consistency Check' as check_name,
    COUNT(*) as total_memberships,
    COUNT(CASE WHEN vm.total_paid != o.final_price THEN 1 END) as amount_mismatch
FROM vip_memberships vm
JOIN orders o ON vm.user_id = o.user_id AND o.status = 'paid';

-- 检查优惠券使用限制
SELECT
    'Coupon Usage Limit Check' as check_name,
    COUNT(*) as total_coupons,
    COUNT(CASE WHEN c.usage_limit IS NOT NULL AND c.usage_limit < c.used_count THEN 1 END) as exceeded_usage_limit
FROM coupons c;

-- ====================================================================
-- 15. 性能检查
-- ====================================================================

SELECT '15. 性能检查...' as check_step;

-- 检查表大小和索引使用情况
SELECT
    TABLE_NAME as table_name,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as total_size_mb,
    ROUND((DATA_LENGTH / 1024 / 1024), 2) as data_size_mb,
    ROUND((INDEX_LENGTH / 1024 / 1024), 2) as index_size_mb,
    TABLE_ROWS as estimated_rows,
    ROUND(((INDEX_LENGTH / DATA_LENGTH) * 100), 2) as index_percentage
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME IN (
        'vip_plans', 'vip_memberships', 'vip_benefits', 'membership_benefits',
        'orders', 'order_items', 'payment_records', 'payment_methods',
        'coupons', 'user_coupons', 'promotions', 'referral_codes',
        'vip_business_statistics'
    )
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;

-- ====================================================================
-- 验证完成总结
-- ====================================================================

SELECT '=== VIP业务表验证完成 ===' as verification_status;

SELECT
    'VIP业务表验证总结' as summary_type,
    CONCAT('成功创建 ', COUNT(*), ' 张VIP业务相关表') as summary_result
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME IN (
        'vip_plans', 'vip_memberships', 'vip_benefits', 'membership_benefits',
        'orders', 'order_items', 'payment_records', 'payment_methods',
        'coupons', 'user_coupons', 'promotions', 'referral_codes',
        'vip_business_statistics'
    );

SELECT
    '数据完整性检查结果' as summary_type,
    CASE
        WHEN (
            SELECT COUNT(*) FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME IN (
                'vip_plans', 'vip_memberships', 'vip_benefits', 'membership_benefits',
                'orders', 'order_items', 'payment_records', 'payment_methods',
                'coupons', 'user_coupons', 'promotions', 'referral_codes',
                'vip_business_statistics'
            )
        ) = 13 THEN '✅ 所有表创建成功'
        ELSE '❌ 部分表创建失败'
    END as summary_result;

SELECT
    '数据插入验证结果' as summary_type,
    CASE
        WHEN (SELECT COUNT(*) FROM vip_plans) >= 5 THEN '✅ VIP套餐数据正常'
        ELSE '❌ VIP套餐数据不足'
    END as summary_result;

SELECT
    '业务就绪状态' as summary_type,
    CASE
        WHEN (
            (SELECT COUNT(*) FROM vip_plans WHERE is_active = 1) >= 3
            AND (SELECT COUNT(*) FROM payment_methods WHERE is_active = 1) >= 2
            AND (SELECT COUNT(*) FROM coupons WHERE is_active = 1) >= 5
        ) THEN '✅ VIP业务模块已就绪，可以开始功能开发'
        ELSE '⚠️  需要补充部分基础数据'
    END as summary_result;