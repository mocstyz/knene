-- ====================================================================
-- 影视资源下载网站 - 认证扩展相关表创建脚本
-- ====================================================================
-- 版本：V2.1.1
-- 描述：创建认证扩展相关表（令牌管理、登录历史、权限管理、安全相关表）
-- 作者：数据库团队
-- 日期：2025-10-30
-- 依赖：V1.1.4__Insert_system_core_data.sql
-- 修改历史：
--   V2.1.1 - 初始版本，创建认证扩展相关表
-- ====================================================================

-- 设置SQL模式
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ====================================================================
-- 1. 令牌管理相关表
-- ====================================================================

-- 刷新令牌表
CREATE TABLE refresh_tokens (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    token_hash VARCHAR(255) NOT NULL COMMENT '令牌哈希值',
    token_series VARCHAR(100) NOT NULL COMMENT '令牌系列号',
    expires_at TIMESTAMP NOT NULL COMMENT '过期时间',
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否已撤销',
    revoked_at TIMESTAMP NULL DEFAULT NULL COMMENT '撤销时间',
    revoked_by BIGINT UNSIGNED NULL DEFAULT NULL COMMENT '撤销人ID',
    ip_address VARCHAR(45) NULL DEFAULT NULL COMMENT '创建时IP地址',
    user_agent TEXT NULL DEFAULT NULL COMMENT '用户代理信息',
    device_fingerprint VARCHAR(255) NULL DEFAULT NULL COMMENT '设备指纹',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_refresh_tokens_user_id (user_id),
    INDEX idx_refresh_tokens_series (token_series),
    INDEX idx_refresh_tokens_expires_at (expires_at),
    INDEX idx_refresh_tokens_is_active (is_active),
    INDEX idx_refresh_tokens_created_at (created_at),
    CONSTRAINT fk_refresh_tokens_user_id_users_id
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_refresh_tokens_expires_at_future CHECK (expires_at > created_at),
    CONSTRAINT chk_refresh_tokens_revoked_order CHECK ((is_revoked = FALSE) OR (revoked_at IS NOT NULL))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='刷新令牌表';

-- 邮箱验证表
CREATE TABLE email_verifications (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    email VARCHAR(255) NOT NULL COMMENT '邮箱地址',
    verification_token VARCHAR(255) NOT NULL COMMENT '验证令牌',
    token_hash VARCHAR(255) NOT NULL COMMENT '令牌哈希值',
    verification_type ENUM('registration', 'email_change', 'password_reset') NOT NULL COMMENT '验证类型',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否已验证',
    verified_at TIMESTAMP NULL DEFAULT NULL COMMENT '验证时间',
    expires_at TIMESTAMP NOT NULL COMMENT '过期时间',
    attempts TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '尝试次数',
    max_attempts TINYINT UNSIGNED NOT NULL DEFAULT 5 COMMENT '最大尝试次数',
    is_locked BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否锁定',
    locked_at TIMESTAMP NULL DEFAULT NULL COMMENT '锁定时间',
    ip_address VARCHAR(45) NULL DEFAULT NULL COMMENT '请求IP地址',
    user_agent TEXT NULL DEFAULT NULL COMMENT '用户代理信息',
    old_email VARCHAR(255) NULL DEFAULT NULL COMMENT '旧邮箱（邮箱变更时使用）',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_email_verifications_user_id (user_id),
    INDEX idx_email_verifications_email (email),
    INDEX idx_email_verifications_token_hash (token_hash),
    INDEX idx_email_verifications_type (verification_type),
    INDEX idx_email_verifications_expires_at (expires_at),
    INDEX idx_email_verifications_is_verified (is_verified),
    INDEX idx_email_verifications_created_at (created_at),
    CONSTRAINT fk_email_verifications_user_id_users_id
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_email_verifications_expires_at_future CHECK (expires_at > created_at),
    CONSTRAINT chk_email_verifications_attempts_limit CHECK (attempts <= max_attempts),
    CONSTRAINT uk_email_verifications_user_email_type UNIQUE (user_id, email, verification_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='邮箱验证表';

-- 密码重置表
CREATE TABLE password_resets (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    email VARCHAR(255) NOT NULL COMMENT '邮箱地址',
    reset_token VARCHAR(255) NOT NULL COMMENT '重置令牌',
    token_hash VARCHAR(255) NOT NULL COMMENT '令牌哈希值',
    is_used BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否已使用',
    used_at TIMESTAMP NULL DEFAULT NULL COMMENT '使用时间',
    expires_at TIMESTAMP NOT NULL COMMENT '过期时间',
    attempts TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '尝试次数',
    max_attempts TINYINT UNSIGNED NOT NULL DEFAULT 3 COMMENT '最大尝试次数',
    is_locked BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否锁定',
    locked_at TIMESTAMP NULL DEFAULT NULL COMMENT '锁定时间',
    ip_address VARCHAR(45) NULL DEFAULT NULL COMMENT '请求IP地址',
    user_agent TEXT NULL DEFAULT NULL COMMENT '用户代理信息',
    new_password_hash VARCHAR(255) NULL DEFAULT NULL COMMENT '新密码哈希',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_password_resets_user_id (user_id),
    INDEX idx_password_resets_email (email),
    INDEX idx_password_resets_token_hash (token_hash),
    INDEX idx_password_resets_expires_at (expires_at),
    INDEX idx_password_resets_is_used (is_used),
    INDEX idx_password_resets_created_at (created_at),
    CONSTRAINT fk_password_resets_user_id_users_id
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_password_resets_expires_at_future CHECK (expires_at > created_at),
    CONSTRAINT chk_password_resets_attempts_limit CHECK (attempts <= max_attempts),
    CONSTRAINT uk_password_resets_user_token UNIQUE (user_id, reset_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='密码重置表';

-- ====================================================================
-- 2. 登录历史相关表
-- ====================================================================

-- 登录历史表
CREATE TABLE login_history (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    user_id BIGINT UNSIGNED NULL DEFAULT NULL COMMENT '用户ID（可为空，用于记录登录失败的尝试）',
    username VARCHAR(255) NOT NULL COMMENT '用户名',
    email VARCHAR(255) NULL DEFAULT NULL COMMENT '邮箱地址',
    login_type ENUM('password', 'social', 'sso', 'token') NOT NULL DEFAULT 'password' COMMENT '登录类型',
    login_status ENUM('success', 'failed', 'blocked') NOT NULL COMMENT '登录状态',
    failure_reason VARCHAR(100) NULL DEFAULT NULL COMMENT '失败原因',
    ip_address VARCHAR(45) NOT NULL COMMENT 'IP地址',
    user_agent TEXT NULL DEFAULT NULL COMMENT '用户代理信息',
    browser VARCHAR(100) NULL DEFAULT NULL COMMENT '浏览器',
    os VARCHAR(100) NULL DEFAULT NULL COMMENT '操作系统',
    device VARCHAR(100) NULL DEFAULT NULL COMMENT '设备类型',
    location VARCHAR(255) NULL DEFAULT NULL COMMENT '地理位置',
    is_new_device BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否新设备',
    session_id VARCHAR(255) NULL DEFAULT NULL COMMENT '会话ID',
    fingerprint VARCHAR(255) NULL DEFAULT NULL COMMENT '设备指纹',
    login_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
    logout_at TIMESTAMP NULL DEFAULT NULL COMMENT '登出时间',
    session_duration INT UNSIGNED NULL DEFAULT NULL COMMENT '会话持续时间（秒）',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否活跃会话',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_login_history_user_id (user_id),
    INDEX idx_login_history_username (username),
    INDEX idx_login_history_email (email),
    INDEX idx_login_history_login_type (login_type),
    INDEX idx_login_history_login_status (login_status),
    INDEX idx_login_history_ip_address (ip_address),
    INDEX idx_login_history_login_at (login_at),
    INDEX idx_login_history_is_active (is_active),
    INDEX idx_login_history_fingerprint (fingerprint),
    CONSTRAINT fk_login_history_user_id_users_id
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_login_history_logout_after_login CHECK ((logout_at IS NULL) OR (logout_at >= login_at)),
    CONSTRAINT chk_login_history_session_duration_positive CHECK ((session_duration IS NULL) OR (session_duration > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='登录历史表';

-- 登录尝试记录表
CREATE TABLE login_attempts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    user_id BIGINT UNSIGNED NULL DEFAULT NULL COMMENT '用户ID',
    username VARCHAR(255) NOT NULL COMMENT '用户名',
    email VARCHAR(255) NULL DEFAULT NULL COMMENT '邮箱地址',
    ip_address VARCHAR(45) NOT NULL COMMENT 'IP地址',
    user_agent TEXT NULL DEFAULT NULL COMMENT '用户代理信息',
    attempt_type ENUM('login', 'register', 'password_reset', 'email_verify') NOT NULL COMMENT '尝试类型',
    attempt_status ENUM('success', 'failed', 'blocked', 'captcha_required') NOT NULL COMMENT '尝试状态',
    failure_reason VARCHAR(100) NULL DEFAULT NULL COMMENT '失败原因',
    captcha_passed BOOLEAN NULL DEFAULT NULL COMMENT '是否通过验证码',
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否被阻止',
    block_reason VARCHAR(255) NULL DEFAULT NULL COMMENT '阻止原因',
    block_expires_at TIMESTAMP NULL DEFAULT NULL COMMENT '阻止过期时间',
    attempt_count TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '尝试次数',
    location VARCHAR(255) NULL DEFAULT NULL COMMENT '地理位置',
    fingerprint VARCHAR(255) NULL DEFAULT NULL COMMENT '设备指纹',
    attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '尝试时间',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_login_attempts_user_id (user_id),
    INDEX idx_login_attempts_username (username),
    INDEX idx_login_attempts_email (email),
    INDEX idx_login_attempts_ip_address (ip_address),
    INDEX idx_login_attempts_attempt_type (attempt_type),
    INDEX idx_login_attempts_attempt_status (attempt_status),
    INDEX idx_login_attempts_is_blocked (is_blocked),
    INDEX idx_login_attempts_block_expires_at (block_expires_at),
    INDEX idx_login_attempts_attempted_at (attempted_at),
    INDEX idx_login_attempts_fingerprint (fingerprint),
    CONSTRAINT fk_login_attempts_user_id_users_id
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_login_attempts_block_expires_future CHECK ((block_expires_at IS NULL) OR (block_expires_at > attempted_at))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='登录尝试记录表';

-- ====================================================================
-- 3. 权限管理扩展表
-- ====================================================================

-- 用户权限表（直接权限分配）
CREATE TABLE user_permissions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    permission_id BIGINT UNSIGNED NOT NULL COMMENT '权限ID',
    granted_by BIGINT UNSIGNED NOT NULL COMMENT '授权人ID',
    grant_type ENUM('direct', 'temporary', 'emergency') NOT NULL DEFAULT 'direct' COMMENT '授权类型',
    granted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '授权时间',
    expires_at TIMESTAMP NULL DEFAULT NULL COMMENT '过期时间',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    reason VARCHAR(500) NULL DEFAULT NULL COMMENT '授权原因',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_user_permissions_user_id (user_id),
    INDEX idx_user_permissions_permission_id (permission_id),
    INDEX idx_user_permissions_granted_by (granted_by),
    INDEX idx_user_permissions_grant_type (grant_type),
    INDEX idx_user_permissions_expires_at (expires_at),
    INDEX idx_user_permissions_is_active (is_active),
    INDEX idx_user_permissions_granted_at (granted_at),
    CONSTRAINT fk_user_permissions_user_id_users_id
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_permissions_permission_id_permissions_id
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_permissions_granted_by_users_id
        FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_user_permissions_granted_order CHECK ((expires_at IS NULL) OR (expires_at >= granted_at)),
    CONSTRAINT uk_user_permissions_user_permission UNIQUE (user_id, permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户权限表';

-- 权限分组表
CREATE TABLE permission_groups (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    group_code VARCHAR(100) NOT NULL COMMENT '分组代码',
    group_name VARCHAR(255) NOT NULL COMMENT '分组名称',
    description TEXT NULL DEFAULT NULL COMMENT '分组描述',
    parent_id BIGINT UNSIGNED NULL DEFAULT NULL COMMENT '父分组ID',
    group_level TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '分组层级',
    sort_order INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '排序',
    icon VARCHAR(100) NULL DEFAULT NULL COMMENT '图标',
    color VARCHAR(20) NULL DEFAULT NULL COMMENT '颜色',
    is_system BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否系统分组',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    created_by BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    updated_by BIGINT UNSIGNED NOT NULL COMMENT '更新人ID',
    version INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '版本号',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_permission_groups_group_code (group_code),
    INDEX idx_permission_groups_parent_id (parent_id),
    INDEX idx_permission_groups_group_level (group_level),
    INDEX idx_permission_groups_sort_order (sort_order),
    INDEX idx_permission_groups_is_system (is_system),
    INDEX idx_permission_groups_is_active (is_active),
    INDEX idx_permission_groups_created_at (created_at),
    CONSTRAINT fk_permission_groups_parent_id_permission_groups_id
        FOREIGN KEY (parent_id) REFERENCES permission_groups(id) ON DELETE CASCADE,
    CONSTRAINT fk_permission_groups_created_by_users_id
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_permission_groups_updated_by_users_id
        FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_permission_groups_level_positive CHECK (group_level > 0),
    CONSTRAINT uk_permission_groups_group_code UNIQUE (group_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限分组表';

-- 权限分组关联表
CREATE TABLE permission_group_relations (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    group_id BIGINT UNSIGNED NOT NULL COMMENT '分组ID',
    permission_id BIGINT UNSIGNED NOT NULL COMMENT '权限ID',
    created_by BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (id),
    INDEX idx_permission_group_relations_group_id (group_id),
    INDEX idx_permission_group_relations_permission_id (permission_id),
    INDEX idx_permission_group_relations_created_at (created_at),
    CONSTRAINT fk_permission_group_relations_group_id_permission_groups_id
        FOREIGN KEY (group_id) REFERENCES permission_groups(id) ON DELETE CASCADE,
    CONSTRAINT fk_permission_group_relations_permission_id_permissions_id
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_permission_group_relations_created_by_users_id
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_permission_group_relations_group_permission UNIQUE (group_id, permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限分组关联表';

-- ====================================================================
-- 4. 安全相关表
-- ====================================================================

-- 登录失败记录表
CREATE TABLE failed_login_attempts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    user_id BIGINT UNSIGNED NULL DEFAULT NULL COMMENT '用户ID',
    username VARCHAR(255) NOT NULL COMMENT '用户名',
    email VARCHAR(255) NULL DEFAULT NULL COMMENT '邮箱地址',
    ip_address VARCHAR(45) NOT NULL COMMENT 'IP地址',
    user_agent TEXT NULL DEFAULT NULL COMMENT '用户代理信息',
    failure_type ENUM('invalid_credentials', 'account_locked', 'account_disabled', 'account_expired', 'ip_blocked', 'captcha_failed') NOT NULL COMMENT '失败类型',
    failure_reason VARCHAR(255) NOT NULL COMMENT '失败原因',
    captcha_required BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否需要验证码',
    captcha_provided BOOLEAN NULL DEFAULT NULL COMMENT '是否提供验证码',
    captcha_correct BOOLEAN NULL DEFAULT NULL COMMENT '验证码是否正确',
    location VARCHAR(255) NULL DEFAULT NULL COMMENT '地理位置',
    fingerprint VARCHAR(255) NULL DEFAULT NULL COMMENT '设备指纹',
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否被阻止',
    block_duration INT UNSIGNED NULL DEFAULT NULL COMMENT '阻止时长（分钟）',
    block_expires_at TIMESTAMP NULL DEFAULT NULL COMMENT '阻止过期时间',
    attempt_count INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '连续失败次数',
    attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '尝试时间',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_failed_login_attempts_user_id (user_id),
    INDEX idx_failed_login_attempts_username (username),
    INDEX idx_failed_login_attempts_email (email),
    INDEX idx_failed_login_attempts_ip_address (ip_address),
    INDEX idx_failed_login_attempts_failure_type (failure_type),
    INDEX idx_failed_login_attempts_is_blocked (is_blocked),
    INDEX idx_failed_login_attempts_block_expires_at (block_expires_at),
    INDEX idx_failed_login_attempts_attempted_at (attempted_at),
    INDEX idx_failed_login_attempts_fingerprint (fingerprint),
    CONSTRAINT fk_failed_login_attempts_user_id_users_id
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_failed_login_attempts_block_duration_positive CHECK ((block_duration IS NULL) OR (block_duration > 0)),
    CONSTRAINT chk_failed_login_attempts_block_expires_future CHECK ((block_expires_at IS NULL) OR (block_expires_at > attempted_at))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='登录失败记录表';

-- 用户锁定记录表
CREATE TABLE user_lockouts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    lock_type ENUM('password_failed', 'account_suspension', 'admin_action', 'security_risk') NOT NULL COMMENT '锁定类型',
    lock_reason VARCHAR(500) NOT NULL COMMENT '锁定原因',
    is_permanent BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否永久锁定',
    lock_duration INT UNSIGNED NULL DEFAULT NULL COMMENT '锁定时长（分钟）',
    locked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '锁定时间',
    expires_at TIMESTAMP NULL DEFAULT NULL COMMENT '解锁时间',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    unlock_reason VARCHAR(500) NULL DEFAULT NULL COMMENT '解锁原因',
    unlocked_at TIMESTAMP NULL DEFAULT NULL COMMENT '解锁时间',
    unlocked_by BIGINT UNSIGNED NULL DEFAULT NULL COMMENT '解锁人ID',
    ip_address VARCHAR(45) NULL DEFAULT NULL COMMENT '触发锁定的IP地址',
    user_agent TEXT NULL DEFAULT NULL COMMENT '用户代理信息',
    failed_attempts INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '失败尝试次数',
    created_by BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    updated_by BIGINT UNSIGNED NULL DEFAULT NULL COMMENT '更新人ID',
    version INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '版本号',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_user_lockouts_user_id (user_id),
    INDEX idx_user_lockouts_lock_type (lock_type),
    INDEX idx_user_lockouts_is_active (is_active),
    INDEX idx_user_lockouts_is_permanent (is_permanent),
    INDEX idx_user_lockouts_locked_at (locked_at),
    INDEX idx_user_lockouts_expires_at (expires_at),
    INDEX idx_user_lockouts_unlocked_at (unlocked_at),
    INDEX idx_user_lockouts_ip_address (ip_address),
    CONSTRAINT fk_user_lockouts_user_id_users_id
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_lockouts_unlocked_by_users_id
        FOREIGN KEY (unlocked_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_user_lockouts_created_by_users_id
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_lockouts_updated_by_users_id
        FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_user_lockouts_duration_positive CHECK ((lock_duration IS NULL) OR (lock_duration > 0)),
    CONSTRAINT chk_user_lockouts_expires_after_locked CHECK ((expires_at IS NULL) OR (expires_at >= locked_at)),
    CONSTRAINT chk_user_lockouts_unlock_after_locked CHECK ((unlocked_at IS NULL) OR (unlocked_at >= locked_at)),
    CONSTRAINT uk_user_lockouts_user_active UNIQUE (user_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户锁定记录表';

-- 安全问题表
CREATE TABLE security_questions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    question_key VARCHAR(100) NOT NULL COMMENT '问题键名',
    question_text VARCHAR(500) NOT NULL COMMENT '问题内容',
    question_category ENUM('personal', 'preference', 'security', 'custom') NOT NULL DEFAULT 'security' COMMENT '问题分类',
    sort_order INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '排序',
    difficulty_level TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '难度等级（1-5）',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    created_by BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
    updated_by BIGINT UNSIGNED NOT NULL COMMENT '更新人ID',
    version INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '版本号',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_security_questions_question_key (question_key),
    INDEX idx_security_questions_question_category (question_category),
    INDEX idx_security_questions_difficulty_level (difficulty_level),
    INDEX idx_security_questions_sort_order (sort_order),
    INDEX idx_security_questions_is_active (is_active),
    CONSTRAINT fk_security_questions_created_by_users_id
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_security_questions_updated_by_users_id
        FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_security_questions_difficulty_range CHECK (difficulty_level BETWEEN 1 AND 5),
    CONSTRAINT uk_security_questions_question_key UNIQUE (question_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='安全问题表';

-- 用户安全问题答案表
CREATE TABLE user_security_answers (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    question_id BIGINT UNSIGNED NOT NULL COMMENT '问题ID',
    answer_hash VARCHAR(255) NOT NULL COMMENT '答案哈希值',
    salt VARCHAR(100) NOT NULL COMMENT '盐值',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否已验证',
    verified_at TIMESTAMP NULL DEFAULT NULL COMMENT '验证时间',
    verification_attempts TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '验证尝试次数',
    max_attempts TINYINT UNSIGNED NOT NULL DEFAULT 3 COMMENT '最大验证尝试次数',
    is_locked BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否锁定',
    locked_at TIMESTAMP NULL DEFAULT NULL COMMENT '锁定时间',
    last_used_at TIMESTAMP NULL DEFAULT NULL COMMENT '最后使用时间',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_user_security_answers_user_id (user_id),
    INDEX idx_user_security_answers_question_id (question_id),
    INDEX idx_user_security_answers_is_verified (is_verified),
    INDEX idx_user_security_answers_is_locked (is_locked),
    INDEX idx_user_security_answers_last_used_at (last_used_at),
    INDEX idx_user_security_answers_created_at (created_at),
    CONSTRAINT fk_user_security_answers_user_id_users_id
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_security_answers_question_id_security_questions_id
        FOREIGN KEY (question_id) REFERENCES security_questions(id) ON DELETE CASCADE,
    CONSTRAINT chk_user_security_answers_attempts_limit CHECK (verification_attempts <= max_attempts),
    CONSTRAINT uk_user_security_answers_user_question UNIQUE (user_id, question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户安全问题答案表';

-- ====================================================================
-- 恢复外键约束
-- ====================================================================
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- 创建触发器：登录成功时清理失败记录
-- ====================================================================
DELIMITER $$

CREATE TRIGGER tr_login_history_after_insert_clean_failed_attempts
AFTER INSERT ON login_history
FOR EACH ROW
BEGIN
    IF NEW.login_status = 'success' AND NEW.user_id IS NOT NULL THEN
        -- 清理该用户和IP的失败登录记录
        DELETE FROM failed_login_attempts
        WHERE user_id = NEW.user_id
        AND ip_address = NEW.ip_address
        AND is_active = TRUE;

        -- 解锁用户账户（如果存在）
        UPDATE user_lockouts
        SET is_active = FALSE,
            unlocked_at = NOW(),
            unlock_reason = '登录成功自动解锁',
            updated_at = NOW()
        WHERE user_id = NEW.user_id
        AND is_active = TRUE
        AND lock_type = 'password_failed';
    END IF;
END$$

DELIMITER ;

-- ====================================================================
-- 表创建完成日志
-- ====================================================================
-- 认证扩展相关表创建完成：
-- 1. 令牌管理表：refresh_tokens（刷新令牌）、email_verifications（邮箱验证）、password_resets（密码重置）
-- 2. 登录历史表：login_history（登录历史）、login_attempts（登录尝试）
-- 3. 权限管理表：user_permissions（用户权限）、permission_groups（权限分组）、permission_group_relations（权限分组关联）
-- 4. 安全相关表：failed_login_attempts（登录失败）、user_lockouts（用户锁定）、security_questions（安全问题）、user_security_answers（用户安全问题答案）
--
-- 所有表都包含完整的审计字段和索引
-- 实现了完整的认证安全机制和权限管理扩展
-- ====================================================================