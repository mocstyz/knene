-- ====================================================================
-- 影视资源下载网站 - VIP业务相关表创建脚本
-- ====================================================================
-- 版本：V2.1.3
-- 描述：创建VIP业务相关表（会员管理、订单系统、支付记录、营销活动等）
-- 作者：数据库团队
-- 日期：2025-10-30
-- 依赖：V2.1.2__Insert_auth_extension_data.sql
-- 修改历史：
--   V2.1.3 - 初始版本，创建VIP业务相关表
-- ====================================================================

-- 设置SQL模式
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ====================================================================
-- 1. VIP会员管理相关表
-- ====================================================================

-- VIP套餐表
CREATE TABLE vip_plans (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    plan_code VARCHAR(50) NOT NULL COMMENT '套餐代码',
    plan_name VARCHAR(255) NOT NULL COMMENT '套餐名称',
    plan_description TEXT NULL DEFAULT NULL COMMENT '套餐描述',
    plan_level TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '套餐等级（1-5）',
    duration_days INT UNSIGNED NOT NULL COMMENT '有效天数',
    original_price DECIMAL(10,2) NOT NULL COMMENT '原价',
    current_price DECIMAL(10,2) NOT NULL COMMENT '现价',
    discount_percentage DECIMAL(5,2) NULL DEFAULT NULL COMMENT '折扣百分比',
    currency VARCHAR(3) NOT NULL DEFAULT 'CNY' COMMENT '货币单位',
    download_quota INT UNSIGNED NULL DEFAULT NULL COMMENT '下载配额（次）',
    download_speed_limit INT UNSIGNED NULL DEFAULT NULL COMMENT '下载速度限制（KB/s）',
    max_concurrent_downloads TINYINT UNSIGNED NULL DEFAULT NULL COMMENT '最大并发下载数',
    benefits JSON NULL DEFAULT NULL COMMENT '会员权益（JSON格式）',
    features JSON NULL DEFAULT NULL COMMENT '特色功能（JSON格式）',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否推荐套餐',
    sort_order INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '排序',
    badge_url VARCHAR(500) NULL DEFAULT NULL COMMENT '徽标URL',
    created_by BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    updated_by BIGINT UNSIGNED NOT NULL COMMENT '更新人ID',
    version INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '版本号',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_vip_plans_plan_code (plan_code),
    INDEX idx_vip_plans_plan_level (plan_level),
    INDEX idx_vip_plans_duration_days (duration_days),
    INDEX idx_vip_plans_current_price (current_price),
    INDEX idx_vip_plans_is_active (is_active),
    INDEX idx_vip_plans_is_featured (is_featured),
    INDEX idx_vip_plans_sort_order (sort_order),
    INDEX idx_vip_plans_created_at (created_at),
    CONSTRAINT fk_vip_plans_created_by_users_id
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_vip_plans_updated_by_users_id
        FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_vip_plans_level_range CHECK (plan_level BETWEEN 1 AND 5),
    CONSTRAINT chk_vip_plans_duration_positive CHECK (duration_days > 0),
    CONSTRAINT chk_vip_plans_price_positive CHECK (current_price >= 0 AND original_price >= 0),
    CONSTRAINT chk_vip_plans_discount_range CHECK (discount_percentage IS NULL OR (discount_percentage >= 0 AND discount_percentage <= 100)),
    CONSTRAINT uk_vip_plans_plan_code UNIQUE (plan_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='VIP套餐表';

-- VIP会员表
CREATE TABLE vip_memberships (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    plan_id BIGINT UNSIGNED NOT NULL COMMENT '套餐ID',
    membership_code VARCHAR(100) NOT NULL COMMENT '会员编号',
    membership_level TINYINT UNSIGNED NOT NULL COMMENT '会员等级',
    start_date DATE NOT NULL COMMENT '开始日期',
    end_date DATE NOT NULL COMMENT '结束日期',
    original_end_date DATE NULL DEFAULT NULL COMMENT '原始结束日期（用于续费对比）',
    status ENUM('active', 'expired', 'suspended', 'cancelled', 'pending') NOT NULL DEFAULT 'pending' COMMENT '会员状态',
    auto_renew BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否自动续费',
    renewal_plan_id BIGINT UNSIGNED NULL DEFAULT NULL COMMENT '续费套餐ID',
    payment_method VARCHAR(50) NULL DEFAULT NULL COMMENT '支付方式',
    total_paid DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '累计支付金额',
    remaining_downloads INT UNSIGNED NULL DEFAULT NULL COMMENT '剩余下载次数',
    last_download_at TIMESTAMP NULL DEFAULT NULL COMMENT '最后下载时间',
    benefits_used JSON NULL DEFAULT NULL COMMENT '已使用权益（JSON格式）',
    notes TEXT NULL DEFAULT NULL COMMENT '备注',
    suspended_reason VARCHAR(500) NULL DEFAULT NULL COMMENT '暂停原因',
    cancelled_reason VARCHAR(500) NULL DEFAULT NULL COMMENT '取消原因',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    created_by BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    updated_by BIGINT UNSIGNED NOT NULL COMMENT '更新人ID',
    version INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '版本号',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_vip_memberships_user_id (user_id),
    INDEX idx_vip_memberships_plan_id (plan_id),
    INDEX idx_vip_memberships_membership_code (membership_code),
    INDEX idx_vip_memberships_membership_level (membership_level),
    INDEX idx_vip_memberships_start_date (start_date),
    INDEX idx_vip_memberships_end_date (end_date),
    INDEX idx_vip_memberships_status (status),
    INDEX idx_vip_memberships_auto_renew (auto_renew),
    INDEX idx_vip_memberships_created_at (created_at),
    CONSTRAINT fk_vip_memberships_user_id_users_id
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_vip_memberships_plan_id_vip_plans_id
        FOREIGN KEY (plan_id) REFERENCES vip_plans(id) ON DELETE RESTRICT,
    CONSTRAINT fk_vip_memberships_renewal_plan_id_vip_plans_id
        FOREIGN KEY (renewal_plan_id) REFERENCES vip_plans(id) ON DELETE SET NULL,
    CONSTRAINT fk_vip_memberships_created_by_users_id
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_vip_memberships_updated_by_users_id
        FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_vip_memberships_date_range CHECK (end_date >= start_date),
    CONSTRAINT chk_vip_memberships_level_range CHECK (membership_level BETWEEN 1 AND 5),
    CONSTRAINT chk_vip_memberships_total_paid_positive CHECK (total_paid >= 0),
    CONSTRAINT uk_vip_memberships_user_active UNIQUE (user_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='VIP会员表';

-- VIP权益表
CREATE TABLE vip_benefits (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    benefit_code VARCHAR(100) NOT NULL COMMENT '权益代码',
    benefit_name VARCHAR(255) NOT NULL COMMENT '权益名称',
    benefit_description TEXT NULL DEFAULT NULL COMMENT '权益描述',
    benefit_type ENUM('download', 'speed', 'quality', 'content', 'service', 'feature') NOT NULL COMMENT '权益类型',
    benefit_value VARCHAR(500) NULL DEFAULT NULL COMMENT '权益值',
    benefit_unit VARCHAR(50) NULL DEFAULT NULL COMMENT '权益单位',
    is_unlimited BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否无限',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    sort_order INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '排序',
    icon VARCHAR(100) NULL DEFAULT NULL COMMENT '图标',
    color VARCHAR(20) NULL DEFAULT NULL COMMENT '颜色',
    created_by BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    updated_by BIGINT UNSIGNED NOT NULL COMMENT '更新人ID',
    version INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '版本号',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_vip_benefits_benefit_code (benefit_code),
    INDEX idx_vip_benefits_benefit_type (benefit_type),
    INDEX idx_vip_benefits_is_active (is_active),
    INDEX idx_vip_benefits_sort_order (sort_order),
    CONSTRAINT fk_vip_benefits_created_by_users_id
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_vip_benefits_updated_by_users_id
        FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_vip_benefits_benefit_code UNIQUE (benefit_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='VIP权益表';

-- 会员权益关联表
CREATE TABLE membership_benefits (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    plan_id BIGINT UNSIGNED NOT NULL COMMENT '套餐ID',
    benefit_id BIGINT UNSIGNED NOT NULL COMMENT '权益ID',
    benefit_value VARCHAR(500) NULL DEFAULT NULL COMMENT '权益值（可覆盖默认值）',
    is_included BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否包含该权益',
    sort_order INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '排序',
    created_by BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (id),
    INDEX idx_membership_benefits_plan_id (plan_id),
    INDEX idx_membership_benefits_benefit_id (benefit_id),
    INDEX idx_membership_benefits_is_included (is_included),
    INDEX idx_membership_benefits_sort_order (sort_order),
    CONSTRAINT fk_membership_benefits_plan_id_vip_plans_id
        FOREIGN KEY (plan_id) REFERENCES vip_plans(id) ON DELETE CASCADE,
    CONSTRAINT fk_membership_benefits_benefit_id_vip_benefits_id
        FOREIGN KEY (benefit_id) REFERENCES vip_benefits(id) ON DELETE CASCADE,
    CONSTRAINT fk_membership_benefits_created_by_users_id
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_membership_benefits_plan_benefit UNIQUE (plan_id, benefit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员权益关联表';

-- ====================================================================
-- 2. 订单系统相关表
-- ====================================================================

-- 订单主表
CREATE TABLE orders (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    order_no VARCHAR(64) NOT NULL COMMENT '订单号',
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    plan_id BIGINT UNSIGNED NOT NULL COMMENT '套餐ID',
    order_type ENUM('new', 'renewal', 'upgrade', 'downgrade', 'gift') NOT NULL DEFAULT 'new' COMMENT '订单类型',
    status ENUM('pending', 'paid', 'cancelled', 'refunded', 'expired', 'failed') NOT NULL DEFAULT 'pending' COMMENT '订单状态',
    original_price DECIMAL(10,2) NOT NULL COMMENT '原价',
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '折扣金额',
    coupon_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '优惠券金额',
    final_price DECIMAL(10,2) NOT NULL COMMENT '最终价格',
    currency VARCHAR(3) NOT NULL DEFAULT 'CNY' COMMENT '货币单位',
    quantity INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '数量',
    duration_days INT UNSIGNED NOT NULL COMMENT '有效天数',
    start_date DATE NULL DEFAULT NULL COMMENT '开始日期',
    end_date DATE NULL DEFAULT NULL COMMENT '结束日期',
    gift_to_user_id BIGINT UNSIGNED NULL DEFAULT NULL COMMENT '赠送目标用户ID',
    gift_message VARCHAR(500) NULL DEFAULT NULL COMMENT '赠送留言',
    notes TEXT NULL DEFAULT NULL COMMENT '订单备注',
    cancelled_reason VARCHAR(500) NULL DEFAULT NULL COMMENT '取消原因',
    refunded_amount DECIMAL(10,2) NULL DEFAULT 0.00 COMMENT '退款金额',
    refunded_reason VARCHAR(500) NULL DEFAULT NULL COMMENT '退款原因',
    expires_at TIMESTAMP NULL DEFAULT NULL COMMENT '过期时间',
    paid_at TIMESTAMP NULL DEFAULT NULL COMMENT '支付时间',
    completed_at TIMESTAMP NULL DEFAULT NULL COMMENT '完成时间',
    cancelled_at TIMESTAMP NULL DEFAULT NULL COMMENT '取消时间',
    refunded_at TIMESTAMP NULL DEFAULT NULL COMMENT '退款时间',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_orders_order_no (order_no),
    INDEX idx_orders_user_id (user_id),
    INDEX idx_orders_plan_id (plan_id),
    INDEX idx_orders_order_type (order_type),
    INDEX idx_orders_status (status),
    INDEX idx_orders_final_price (final_price),
    INDEX idx_orders_expires_at (expires_at),
    INDEX idx_orders_paid_at (paid_at),
    INDEX idx_orders_created_at (created_at),
    INDEX idx_orders_gift_to_user_id (gift_to_user_id),
    CONSTRAINT fk_orders_user_id_users_id
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_orders_plan_id_vip_plans_id
        FOREIGN KEY (plan_id) REFERENCES vip_plans(id) ON DELETE RESTRICT,
    CONSTRAINT fk_orders_gift_to_user_id_users_id
        FOREIGN KEY (gift_to_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_orders_final_price_positive CHECK (final_price >= 0),
    CONSTRAINT chk_orders_discount_valid CHECK (discount_amount >= 0 AND discount_amount <= original_price),
    CONSTRAINT chk_orders_coupon_valid CHECK (coupon_amount >= 0),
    CONSTRAINT chk_orders_duration_positive CHECK (duration_days > 0),
    CONSTRAINT chk_orders_date_range CHECK ((start_date IS NULL AND end_date IS NULL) OR (end_date >= start_date)),
    CONSTRAINT uk_orders_order_no UNIQUE (order_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单主表';

-- 订单明细表
CREATE TABLE order_items (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    order_id BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
    item_type ENUM('membership', 'coupon', 'service', 'product') NOT NULL COMMENT '明细类型',
    item_id BIGINT UNSIGNED NULL DEFAULT NULL COMMENT '关联项目ID',
    item_name VARCHAR(255) NOT NULL COMMENT '项目名称',
    item_description TEXT NULL DEFAULT NULL COMMENT '项目描述',
    unit_price DECIMAL(10,2) NOT NULL COMMENT '单价',
    quantity INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '数量',
    total_price DECIMAL(10,2) NOT NULL COMMENT '总价',
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '折扣金额',
    final_price DECIMAL(10,2) NOT NULL COMMENT '最终价格',
    metadata JSON NULL DEFAULT NULL COMMENT '元数据（JSON格式）',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_order_items_order_id (order_id),
    INDEX idx_order_items_item_type (item_type),
    INDEX idx_order_items_item_id (item_id),
    INDEX idx_order_items_final_price (final_price),
    INDEX idx_order_items_created_at (created_at),
    CONSTRAINT fk_order_items_order_id_orders_id
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT chk_order_items_final_price_positive CHECK (final_price >= 0),
    CONSTRAINT chk_order_items_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_order_items_total_price CHECK (total_price = unit_price * quantity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单明细表';

-- 支付记录表
CREATE TABLE payment_records (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    order_id BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
    payment_no VARCHAR(64) NOT NULL COMMENT '支付单号',
    payment_method ENUM('alipay_web', 'alipay_mobile', 'wechat_web', 'wechat_mobile', 'bank_card', 'credit_card', 'paypal', 'balance', 'gift_card', 'unionpay', 'bank_transfer') NOT NULL COMMENT '支付方式',
    payment_channel ENUM('web', 'mobile', 'app', 'api', 'manual') NOT NULL DEFAULT 'web' COMMENT '支付渠道',
    payment_status ENUM('pending', 'processing', 'success', 'failed', 'cancelled', 'refunded', 'partial_refunded') NOT NULL DEFAULT 'pending' COMMENT '支付状态',
    amount DECIMAL(10,2) NOT NULL COMMENT '支付金额',
    currency VARCHAR(3) NOT NULL DEFAULT 'CNY' COMMENT '货币单位',
    third_party_trade_no VARCHAR(255) NULL DEFAULT NULL COMMENT '第三方交易号',
    third_party_response JSON NULL DEFAULT NULL COMMENT '第三方响应数据',
    gateway_provider VARCHAR(50) NULL DEFAULT NULL COMMENT '支付网关提供商',
    gateway_response JSON NULL DEFAULT NULL COMMENT '支付网关响应',
    callback_received BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否收到回调',
    callback_at TIMESTAMP NULL DEFAULT NULL COMMENT '回调时间',
    verified_at TIMESTAMP NULL DEFAULT NULL COMMENT '验证时间',
    failed_reason VARCHAR(500) NULL DEFAULT NULL COMMENT '失败原因',
    refund_amount DECIMAL(10,2) NULL DEFAULT NULL COMMENT '退款金额',
    refund_reason VARCHAR(500) NULL DEFAULT NULL COMMENT '退款原因',
    refunded_at TIMESTAMP NULL DEFAULT NULL COMMENT '退款时间',
    ip_address VARCHAR(45) NULL DEFAULT NULL COMMENT '支付IP地址',
    user_agent TEXT NULL DEFAULT NULL COMMENT '用户代理',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_payment_records_order_id (order_id),
    INDEX idx_payment_records_payment_no (payment_no),
    INDEX idx_payment_records_payment_method (payment_method),
    INDEX idx_payment_records_payment_status (payment_status),
    INDEX idx_payment_records_amount (amount),
    INDEX idx_payment_records_third_party_trade_no (third_party_trade_no),
    INDEX idx_payment_records_callback_received (callback_received),
    INDEX idx_payment_records_created_at (created_at),
    CONSTRAINT fk_payment_records_order_id_orders_id
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT chk_payment_records_amount_positive CHECK (amount > 0),
    CONSTRAINT chk_payment_records_refund_valid CHECK ((refund_amount IS NULL) OR (refund_amount >= 0 AND refund_amount <= amount)),
    CONSTRAINT uk_payment_records_payment_no UNIQUE (payment_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付记录表';

-- 支付方式表
CREATE TABLE payment_methods (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    method_code VARCHAR(50) NOT NULL COMMENT '支付方式代码',
    method_name VARCHAR(255) NOT NULL COMMENT '支付方式名称',
    method_type ENUM('online', 'offline', 'digital_wallet', 'bank_transfer', 'cryptocurrency', 'gift_card') NOT NULL COMMENT '支付方式类型',
    provider_name VARCHAR(255) NULL DEFAULT NULL COMMENT '提供商名称',
    provider_code VARCHAR(100) NULL DEFAULT NULL COMMENT '提供商代码',
    description TEXT NULL DEFAULT NULL COMMENT '描述',
    icon_url VARCHAR(500) NULL DEFAULT NULL COMMENT '图标URL',
    supported_currencies JSON NULL DEFAULT NULL COMMENT '支持的货币（JSON数组）',
    min_amount DECIMAL(10,2) NULL DEFAULT NULL COMMENT '最小金额',
    max_amount DECIMAL(10,2) NULL DEFAULT NULL COMMENT '最大金额',
    fee_rate DECIMAL(5,4) NULL DEFAULT NULL COMMENT '手续费率',
    fixed_fee DECIMAL(10,2) NULL DEFAULT NULL COMMENT '固定手续费',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    sort_order INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '排序',
    config JSON NULL DEFAULT NULL COMMENT '配置信息（JSON格式）',
    created_by BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    updated_by BIGINT UNSIGNED NOT NULL COMMENT '更新人ID',
    version INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '版本号',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_payment_methods_method_code (method_code),
    INDEX idx_payment_methods_method_type (method_type),
    INDEX idx_payment_methods_provider_code (provider_code),
    INDEX idx_payment_methods_is_active (is_active),
    INDEX idx_payment_methods_sort_order (sort_order),
    CONSTRAINT fk_payment_methods_created_by_users_id
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_payment_methods_updated_by_users_id
        FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_payment_methods_fee_rate_valid CHECK (fee_rate IS NULL OR fee_rate >= 0),
    CONSTRAINT chk_payment_methods_fixed_fee_valid CHECK (fixed_fee IS NULL OR fixed_fee >= 0),
    CONSTRAINT chk_payment_methods_amount_range CHECK ((min_amount IS NULL AND max_amount IS NULL) OR (max_amount IS NULL) OR (min_amount IS NULL) OR (max_amount >= min_amount)),
    CONSTRAINT uk_payment_methods_method_code UNIQUE (method_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付方式表';

-- ====================================================================
-- 3. 营销活动相关表
-- ====================================================================

-- 优惠券表
CREATE TABLE coupons (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    coupon_code VARCHAR(50) NOT NULL COMMENT '优惠券代码',
    coupon_name VARCHAR(255) NOT NULL COMMENT '优惠券名称',
    coupon_type ENUM('discount_percentage', 'fixed_amount', 'free_shipping', 'free_trial', 'gift') NOT NULL COMMENT '优惠券类型',
    discount_value DECIMAL(10,2) NULL DEFAULT NULL COMMENT '折扣值',
    discount_percentage DECIMAL(5,2) NULL DEFAULT NULL COMMENT '折扣百分比',
    min_order_amount DECIMAL(10,2) NULL DEFAULT NULL COMMENT '最小订单金额',
    max_discount_amount DECIMAL(10,2) NULL DEFAULT NULL COMMENT '最大折扣金额',
    applicable_plans JSON NULL DEFAULT NULL COMMENT '适用套餐（JSON数组）',
    usage_limit INT UNSIGNED NULL DEFAULT NULL COMMENT '使用次数限制',
    usage_limit_per_user TINYINT UNSIGNED NULL DEFAULT NULL COMMENT '每用户使用次数限制',
    used_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '已使用次数',
    valid_from TIMESTAMP NOT NULL COMMENT '有效期开始时间',
    valid_until TIMESTAMP NOT NULL COMMENT '有效期结束时间',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    is_public BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否公开',
    description TEXT NULL DEFAULT NULL COMMENT '描述',
    terms TEXT NULL DEFAULT NULL COMMENT '使用条款',
    created_by BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    updated_by BIGINT UNSIGNED NOT NULL COMMENT '更新人ID',
    version INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '版本号',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_coupons_coupon_code (coupon_code),
    INDEX idx_coupons_coupon_type (coupon_type),
    INDEX idx_coupons_valid_from (valid_from),
    INDEX idx_coupons_valid_until (valid_until),
    INDEX idx_coupons_is_active (is_active),
    INDEX idx_coupons_is_public (is_public),
    INDEX idx_coupons_used_count (used_count),
    INDEX idx_coupons_created_at (created_at),
    CONSTRAINT fk_coupons_created_by_users_id
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_coupons_updated_by_users_id
        FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_coupons_valid_date_range CHECK (valid_until > valid_from),
    CONSTRAINT chk_coupons_discount_value_positive CHECK ((discount_value IS NULL) OR (discount_value > 0)),
    CONSTRAINT chk_coupons_discount_percentage_range CHECK ((discount_percentage IS NULL) OR (discount_percentage > 0 AND discount_percentage <= 100)),
    CONSTRAINT chk_coupons_usage_limit_valid CHECK ((usage_limit IS NULL) OR (used_count <= usage_limit)),
    CONSTRAINT uk_coupons_coupon_code UNIQUE (coupon_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='优惠券表';

-- 用户优惠券表
CREATE TABLE user_coupons (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    coupon_id BIGINT UNSIGNED NOT NULL COMMENT '优惠券ID',
    coupon_code VARCHAR(50) NOT NULL COMMENT '优惠券代码',
    status ENUM('available', 'used', 'expired', 'cancelled') NOT NULL DEFAULT 'available' COMMENT '状态',
    received_from ENUM('system', 'promotion', 'gift', 'purchase', 'referral') NOT NULL DEFAULT 'system' COMMENT '获取来源',
    received_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '获取时间',
    used_at TIMESTAMP NULL DEFAULT NULL COMMENT '使用时间',
    used_order_id BIGINT UNSIGNED NULL DEFAULT NULL COMMENT '使用订单ID',
    expires_at TIMESTAMP NOT NULL COMMENT '过期时间',
    notes VARCHAR(500) NULL DEFAULT NULL COMMENT '备注',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_user_coupons_user_id (user_id),
    INDEX idx_user_coupons_coupon_id (coupon_id),
    INDEX idx_user_coupons_coupon_code (coupon_code),
    INDEX idx_user_coupons_status (status),
    INDEX idx_user_coupons_received_from (received_from),
    INDEX idx_user_coupons_expires_at (expires_at),
    INDEX idx_user_coupons_used_at (used_at),
    INDEX idx_user_coupons_used_order_id (used_order_id),
    INDEX idx_user_coupons_created_at (created_at),
    CONSTRAINT fk_user_coupons_user_id_users_id
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_coupons_coupon_id_coupons_id
        FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_coupons_used_order_id_orders_id
        FOREIGN KEY (used_order_id) REFERENCES orders(id) ON DELETE SET NULL,
    CONSTRAINT uk_user_coupons_user_coupon UNIQUE (user_id, coupon_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户优惠券表';

-- 促销活动表
CREATE TABLE promotions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    promotion_code VARCHAR(100) NOT NULL COMMENT '活动代码',
    promotion_name VARCHAR(255) NOT NULL COMMENT '活动名称',
    promotion_type ENUM('discount', 'bundle', 'buy_one_get_one', 'flash_sale', 'seasonal', 'referral', 'anniversary') NOT NULL COMMENT '活动类型',
    description TEXT NULL DEFAULT NULL COMMENT '活动描述',
    banner_url VARCHAR(500) NULL DEFAULT NULL COMMENT '横幅图片URL',
    terms TEXT NULL DEFAULT NULL COMMENT '活动条款',
    start_time TIMESTAMP NOT NULL COMMENT '开始时间',
    end_time TIMESTAMP NOT NULL COMMENT '结束时间',
    target_audience JSON NULL DEFAULT NULL COMMENT '目标用户群体（JSON数组）',
    applicable_plans JSON NULL DEFAULT NULL COMMENT '适用套餐（JSON数组）',
    discount_rules JSON NULL DEFAULT NULL COMMENT '折扣规则（JSON格式）',
    participation_limit INT UNSIGNED NULL DEFAULT NULL COMMENT '参与次数限制',
    participation_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '已参与次数',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否推荐活动',
    priority INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '优先级',
    created_by BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    updated_by BIGINT UNSIGNED NOT NULL COMMENT '更新人ID',
    version INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '版本号',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_promotions_promotion_code (promotion_code),
    INDEX idx_promotions_promotion_type (promotion_type),
    INDEX idx_promotions_start_time (start_time),
    INDEX idx_promotions_end_time (end_time),
    INDEX idx_promotions_is_active (is_active),
    INDEX idx_promotions_is_featured (is_featured),
    INDEX idx_promotions_priority (priority),
    INDEX idx_promotions_created_at (created_at),
    CONSTRAINT fk_promotions_created_by_users_id
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_promotions_updated_by_users_id
        FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_promotions_time_range CHECK (end_time > start_time),
    CONSTRAINT chk_promotions_participation_valid CHECK ((participation_limit IS NULL) OR (participation_count <= participation_limit)),
    CONSTRAINT uk_promotions_promotion_code UNIQUE (promotion_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='促销活动表';

-- 推荐码表
CREATE TABLE referral_codes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    user_id BIGINT UNSIGNED NOT NULL COMMENT '推荐人用户ID',
    referral_code VARCHAR(20) NOT NULL COMMENT '推荐码',
    referral_link VARCHAR(500) NULL DEFAULT NULL COMMENT '推荐链接',
    description VARCHAR(500) NULL DEFAULT NULL COMMENT '描述',
    reward_type ENUM('discount', 'cashback', 'points', 'extension') NOT NULL DEFAULT 'discount' COMMENT '奖励类型',
    reward_value DECIMAL(10,2) NULL DEFAULT NULL COMMENT '奖励值',
    reward_percentage DECIMAL(5,2) NULL DEFAULT NULL COMMENT '奖励百分比',
    max_uses INT UNSIGNED NULL DEFAULT NULL COMMENT '最大使用次数',
    used_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '已使用次数',
    valid_from TIMESTAMP NOT NULL COMMENT '有效期开始时间',
    valid_until TIMESTAMP NULL DEFAULT NULL COMMENT '有效期结束时间',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_referral_codes_user_id (user_id),
    INDEX idx_referral_codes_referral_code (referral_code),
    INDEX idx_referral_codes_reward_type (reward_type),
    INDEX idx_referral_codes_valid_from (valid_from),
    INDEX idx_referral_codes_valid_until (valid_until),
    INDEX idx_referral_codes_is_active (is_active),
    INDEX idx_referral_codes_used_count (used_count),
    INDEX idx_referral_codes_created_at (created_at),
    CONSTRAINT fk_referral_codes_user_id_users_id
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_referral_codes_valid_date_range CHECK ((valid_until IS NULL) OR (valid_until > valid_from)),
    CONSTRAINT chk_referral_codes_uses_valid CHECK ((max_uses IS NULL) OR (used_count <= max_uses)),
    CONSTRAINT uk_referral_codes_referral_code UNIQUE (referral_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='推荐码表';

-- ====================================================================
-- 4. 业务统计相关表
-- ====================================================================

-- VIP业务统计表
CREATE TABLE vip_business_statistics (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    stat_date DATE NOT NULL COMMENT '统计日期',
    stat_type ENUM('daily', 'weekly', 'monthly') NOT NULL COMMENT '统计类型',
    new_memberships INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '新增会员数',
    active_memberships INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '活跃会员数',
    expired_memberships INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '过期会员数',
    renewed_memberships INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '续费会员数',
    total_revenue DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '总收入',
    average_revenue DECIMAL(10,2) NULL DEFAULT NULL COMMENT '平均收入',
    conversion_rate DECIMAL(5,2) NULL DEFAULT NULL COMMENT '转化率',
    retention_rate DECIMAL(5,2) NULL DEFAULT NULL COMMENT '留存率',
    popular_plan_id BIGINT UNSIGNED NULL DEFAULT NULL COMMENT '热门套餐ID',
    plan_distribution JSON NULL DEFAULT NULL COMMENT '套餐分布（JSON格式）',
    revenue_by_plan JSON NULL DEFAULT NULL COMMENT '按套餐收入分布（JSON格式）',
    created_by BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_vip_business_statistics_stat_date (stat_date),
    INDEX idx_vip_business_statistics_stat_type (stat_type),
    INDEX idx_vip_business_statistics_created_at (created_at),
    CONSTRAINT fk_vip_business_statistics_popular_plan_id_vip_plans_id
        FOREIGN KEY (popular_plan_id) REFERENCES vip_plans(id) ON DELETE SET NULL,
    CONSTRAINT fk_vip_business_statistics_created_by_users_id
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_vip_business_statistics_date_type UNIQUE (stat_date, stat_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='VIP业务统计表';

-- ====================================================================
-- 恢复外键约束
-- ====================================================================
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- 创建触发器：订单状态变更时更新会员信息
-- ====================================================================
-- 订单支付成功时自动创建或更新会员信息
-- 注意：触发器已移除，因为涉及复杂业务逻辑，建议在应用层处理

-- ====================================================================
-- 表创建完成日志
-- ====================================================================
-- VIP业务相关表创建完成：
-- 1. VIP会员管理表：vip_plans（VIP套餐）、vip_memberships（VIP会员）、vip_benefits（VIP权益）、membership_benefits（会员权益关联）
-- 2. 订单系统表：orders（订单主表）、order_items（订单明细）、payment_records（支付记录）、payment_methods（支付方式）
-- 3. 营销活动表：coupons（优惠券）、user_coupons（用户优惠券）、promotions（促销活动）、referral_codes（推荐码）
-- 4. 业务统计表：vip_business_statistics（VIP业务统计）
--
-- 所有表都包含完整的审计字段和索引
-- 实现了完整的VIP业务流程管理和数据追踪
-- 支持多种支付方式和营销活动
-- 提供详细的业务统计分析功能
-- ====================================================================