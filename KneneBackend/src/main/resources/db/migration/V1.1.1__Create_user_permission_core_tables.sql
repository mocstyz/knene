-- ====================================================================
-- 影视资源下载网站 - 用户权限核心表创建脚本
-- ====================================================================
-- 版本：V1.1.1
-- 描述：创建用户权限核心表（users, user_profiles, roles, permissions, user_roles, role_permissions, user_login_history）
-- 作者：数据库团队
-- 日期：2025-10-30
-- 依赖：无
-- ====================================================================

-- 设置SQL模式
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ====================================================================
-- 1. 创建用户基础信息表 (users)
-- ====================================================================
CREATE TABLE users (
    -- 主键字段：遵循自增BIGINT主键规范
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户唯一标识',

    -- 基础认证信息：遵循唯一性约束和字段命名规范
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    email VARCHAR(255) NOT NULL COMMENT '邮箱地址',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希值',

    -- 可选联系信息：遵循字段命名规范和类型规范
    phone VARCHAR(20) NULL COMMENT '手机号码',
    avatar_url VARCHAR(500) NULL COMMENT '头像URL',

    -- 用户状态管理：遵循ENUM类型使用规范
    status ENUM('active', 'inactive', 'suspended', 'deleted') NOT NULL DEFAULT 'inactive' COMMENT '账户状态',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE COMMENT '邮箱是否验证',
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE COMMENT '手机是否验证',

    -- 登录安全信息：遵循时间字段命名规范
    last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
    last_login_ip VARCHAR(45) NULL COMMENT '最后登录IP',
    login_attempts TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '登录尝试次数',
    locked_until TIMESTAMP NULL COMMENT '账户锁定到期时间',

    -- 通用审计字段：遵循通用字段设计规范
    created_by BIGINT UNSIGNED NULL COMMENT '创建人ID',
    updated_by BIGINT UNSIGNED NULL COMMENT '更新人ID',
    version INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '乐观锁版本号',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP NULL COMMENT '删除时间',

    -- 主键约束：遵循主键设计规范
    PRIMARY KEY (id),

    -- 唯一性约束：遵循业务唯一性规则
    UNIQUE KEY uk_users_username (username),
    UNIQUE KEY uk_users_email (email),

    -- 查询索引：遵循索引设计指导原则
    KEY idx_users_status (status),
    KEY idx_users_created_at (created_at),
    KEY idx_users_last_login_at (last_login_at),
    KEY idx_users_email_verified (email_verified),
    KEY idx_users_locked_until (locked_until),
    KEY idx_users_created_by (created_by),
    KEY idx_users_updated_by (updated_by),
    KEY idx_users_version (version),

    -- 数据完整性约束：遵循CHECK约束规范
    CONSTRAINT chk_users_username_length CHECK (CHAR_LENGTH(username) >= 3 AND CHAR_LENGTH(username) <= 50),
    CONSTRAINT chk_users_email_format CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_users_phone_format CHECK (phone IS NULL OR phone REGEXP '^1[3-9]\\d{9}$'),
    CONSTRAINT chk_users_status_valid CHECK (status IN ('active', 'inactive', 'suspended', 'deleted')),
    CONSTRAINT chk_users_login_attempts CHECK (login_attempts <= 10),
    CONSTRAINT chk_users_password_hash_length CHECK (CHAR_LENGTH(password_hash) >= 60)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户基础信息表';

-- ====================================================================
-- 2. 创建用户扩展信息表 (user_profiles)
-- ====================================================================
CREATE TABLE user_profiles (
    -- 主键字段：遵循自增主键规范
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',

    -- 用户关联：遵循外键约束规范
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',

    -- 基本个人信息：遵循字段命名规范
    nickname VARCHAR(50) NULL COMMENT '昵称',
    gender ENUM('male', 'female', 'other', 'unknown') NULL DEFAULT 'unknown' COMMENT '性别',
    birthday DATE NULL COMMENT '生日',
    bio TEXT NULL COMMENT '个人简介',
    location VARCHAR(100) NULL COMMENT '所在地',
    website VARCHAR(255) NULL COMMENT '个人网站',
    company VARCHAR(100) NULL COMMENT '公司',
    occupation VARCHAR(100) NULL COMMENT '职业',

    -- 用户偏好设置：使用JSON类型存储复杂配置
    preferences JSON NULL COMMENT '用户偏好设置',

    -- 系统设置：遵循默认值规范
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Shanghai' COMMENT '时区设置',
    language VARCHAR(10) NOT NULL DEFAULT 'zh-CN' COMMENT '语言设置',

    -- 通用审计字段：遵循通用字段设计规范
    created_by BIGINT UNSIGNED NULL COMMENT '创建人ID',
    updated_by BIGINT UNSIGNED NULL COMMENT '更新人ID',
    version INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '乐观锁版本号',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP NULL COMMENT '删除时间',

    -- 主键约束
    PRIMARY KEY (id),

    -- 唯一性约束：保证与用户表的一对一关系
    UNIQUE KEY uk_user_profiles_user_id (user_id),

    -- 查询索引：支持常用查询场景
    KEY idx_user_profiles_nickname (nickname),
    KEY idx_user_profiles_location (location),
    KEY idx_user_profiles_created_at (created_at),
    KEY idx_user_profiles_gender (gender),
    KEY idx_user_profiles_timezone (timezone),

    -- 外键约束：遵循引用完整性规则
    CONSTRAINT fk_user_profiles_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    -- 数据完整性约束：遵循CHECK约束规范
    CONSTRAINT chk_user_profiles_nickname_length CHECK (nickname IS NULL OR (CHAR_LENGTH(nickname) >= 2 AND CHAR_LENGTH(nickname) <= 50)),
    CONSTRAINT chk_user_profiles_birthday_range CHECK (birthday IS NULL OR birthday BETWEEN '1900-01-01' AND '2030-12-31'),
    CONSTRAINT chk_user_profiles_bio_length CHECK (bio IS NULL OR CHAR_LENGTH(bio) <= 1000),
    CONSTRAINT chk_user_profiles_location_length CHECK (location IS NULL OR CHAR_LENGTH(location) <= 100),
    CONSTRAINT chk_user_profiles_website_format CHECK (website IS NULL OR website REGEXP '^https?://.+'),
    CONSTRAINT chk_user_profiles_company_length CHECK (company IS NULL OR CHAR_LENGTH(company) <= 100),
    CONSTRAINT chk_user_profiles_occupation_length CHECK (occupation IS NULL OR CHAR_LENGTH(occupation) <= 100),
    CONSTRAINT chk_user_profiles_language_valid CHECK (language REGEXP '^[a-z]{2}-[A-Z]{2}$')

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户扩展信息表';

-- ====================================================================
-- 3. 创建角色定义表 (roles)
-- ====================================================================
CREATE TABLE roles (
    -- 主键字段：遵循自增主键规范
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '角色唯一标识',

    -- 角色基本信息：遵循字段命名规范
    name VARCHAR(50) NOT NULL COMMENT '角色名称',
    display_name VARCHAR(100) NOT NULL COMMENT '角色显示名称',
    description TEXT NULL COMMENT '角色描述',

    -- 角色等级：支持角色层次结构
    level TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '角色等级，数字越大权限越高',

    -- 系统标识：区分系统角色和自定义角色
    is_system BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否为系统角色',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否启用',

    -- 通用审计字段：遵循通用字段设计规范
    created_by BIGINT UNSIGNED NULL COMMENT '创建人ID',
    updated_by BIGINT UNSIGNED NULL COMMENT '更新人ID',
    version INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '乐观锁版本号',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP NULL COMMENT '删除时间',

    -- 主键约束
    PRIMARY KEY (id),

    -- 唯一性约束：保证角色名称唯一性
    UNIQUE KEY uk_roles_name (name),
    UNIQUE KEY uk_roles_display_name (display_name),

    -- 查询索引：支持角色管理查询
    KEY idx_roles_level (level),
    KEY idx_roles_is_active (is_active),
    KEY idx_roles_is_system (is_system),
    KEY idx_roles_created_at (created_at),
    KEY idx_roles_level_active (level, is_active),

    -- 数据完整性约束：遵循CHECK约束规范
    CONSTRAINT chk_roles_name_length CHECK (CHAR_LENGTH(name) >= 2 AND CHAR_LENGTH(name) <= 50),
    CONSTRAINT chk_roles_display_name_length CHECK (CHAR_LENGTH(display_name) >= 2 AND CHAR_LENGTH(display_name) <= 100),
    CONSTRAINT chk_roles_description_length CHECK (description IS NULL OR CHAR_LENGTH(description) <= 1000),
    CONSTRAINT chk_roles_level_range CHECK (level <= 100),
    CONSTRAINT chk_roles_name_format CHECK (name REGEXP '^[a-z][a-z0-9_]*$')

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色定义表';

-- ====================================================================
-- 4. 创建权限定义表 (permissions)
-- ====================================================================
CREATE TABLE permissions (
    -- 主键字段：遵循自增主键规范
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '权限唯一标识',

    -- 权限基本信息：遵循字段命名规范
    name VARCHAR(100) NOT NULL COMMENT '权限名称',
    display_name VARCHAR(100) NOT NULL COMMENT '权限显示名称',
    description TEXT NULL COMMENT '权限描述',

    -- 权限模型：资源-操作模型
    resource VARCHAR(50) NOT NULL COMMENT '资源标识',
    action VARCHAR(50) NOT NULL COMMENT '操作标识',
    module VARCHAR(50) NOT NULL COMMENT '模块标识',

    -- 系统标识：区分系统权限和自定义权限
    is_system BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否为系统权限',

    -- 通用审计字段：遵循通用字段设计规范
    created_by BIGINT UNSIGNED NULL COMMENT '创建人ID',
    updated_by BIGINT UNSIGNED NULL COMMENT '更新人ID',
    version INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '乐观锁版本号',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP NULL COMMENT '删除时间',

    -- 主键约束
    PRIMARY KEY (id),

    -- 唯一性约束：保证权限的唯一性
    UNIQUE KEY uk_permissions_name (name),
    UNIQUE KEY uk_permissions_resource_action (resource, action),

    -- 查询索引：支持权限管理查询
    KEY idx_permissions_module (module),
    KEY idx_permissions_resource (resource),
    KEY idx_permissions_action (action),
    KEY idx_permissions_is_system (is_system),
    KEY idx_permissions_created_at (created_at),
    KEY idx_permissions_module_resource (module, resource),
    KEY idx_permissions_resource_action (resource, action),

    -- 数据完整性约束：遵循CHECK约束规范
    CONSTRAINT chk_permissions_name_length CHECK (CHAR_LENGTH(name) >= 3 AND CHAR_LENGTH(name) <= 100),
    CONSTRAINT chk_permissions_display_name_length CHECK (CHAR_LENGTH(display_name) >= 2 AND CHAR_LENGTH(display_name) <= 100),
    CONSTRAINT chk_permissions_description_length CHECK (description IS NULL OR CHAR_LENGTH(description) <= 500),
    CONSTRAINT chk_permissions_resource_format CHECK (resource REGEXP '^[a-z][a-z0-9_]*$'),
    CONSTRAINT chk_permissions_action_format CHECK (action REGEXP '^[a-z][a-z0-9_]*$'),
    CONSTRAINT chk_permissions_module_format CHECK (module REGEXP '^[a-z][a-z0-9_]*$')

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限定义表';

-- ====================================================================
-- 5. 创建用户角色关联表 (user_roles)
-- ====================================================================
CREATE TABLE user_roles (
    -- 主键字段：遵循自增主键规范
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '关联ID',

    -- 关联字段：用户和角色的多对多关系
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    role_id BIGINT UNSIGNED NOT NULL COMMENT '角色ID',

    -- 授权管理：记录授权信息
    granted_by BIGINT UNSIGNED NOT NULL COMMENT '授权人ID',
    granted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '授权时间',
    expires_at TIMESTAMP NULL COMMENT '过期时间（NULL表示永不过期）',

    -- 状态管理：支持关联状态控制
    status ENUM('active', 'inactive', 'expired') NOT NULL DEFAULT 'active' COMMENT '状态',
    remarks VARCHAR(500) NULL COMMENT '备注',

    -- 通用审计字段：遵循通用字段设计规范
    created_by BIGINT UNSIGNED NULL COMMENT '创建人ID',
    updated_by BIGINT UNSIGNED NULL COMMENT '更新人ID',
    version INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '乐观锁版本号',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP NULL COMMENT '删除时间',

    -- 主键约束
    PRIMARY KEY (id),

    -- 唯一性约束：防止重复授权
    UNIQUE KEY uk_user_roles_user_role (user_id, role_id),

    -- 查询索引：支持常用查询场景
    KEY idx_user_roles_user (user_id),
    KEY idx_user_roles_role (role_id),
    KEY idx_user_roles_granted_by (granted_by),
    KEY idx_user_roles_status (status),
    KEY idx_user_roles_expires (expires_at),
    KEY idx_user_roles_granted_at (granted_at),
    KEY idx_user_roles_user_status (user_id, status),
    KEY idx_user_roles_role_status (role_id, status),

    -- 外键约束：遵循引用完整性规则
    CONSTRAINT fk_user_roles_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role_id FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_granted_by FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE RESTRICT,

    -- 数据完整性约束：遵循CHECK约束规范
    CONSTRAINT chk_user_roles_remarks_length CHECK (remarks IS NULL OR CHAR_LENGTH(remarks) <= 500),
    CONSTRAINT chk_user_roles_expires_future CHECK (expires_at IS NULL OR expires_at >= granted_at),
    CONSTRAINT chk_user_roles_status_valid CHECK (status IN ('active', 'inactive', 'expired')),
    CONSTRAINT chk_user_roles_not_delete_active CHECK (deleted_at IS NULL OR status != 'active')

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';

-- ====================================================================
-- 6. 创建角色权限关联表 (role_permissions)
-- ====================================================================
CREATE TABLE role_permissions (
    -- 主键字段：遵循自增主键规范
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '关联ID',

    -- 关联字段：角色和权限的多对多关系
    role_id BIGINT UNSIGNED NOT NULL COMMENT '角色ID',
    permission_id BIGINT UNSIGNED NOT NULL COMMENT '权限ID',

    -- 授权管理：记录授权信息
    granted_by BIGINT UNSIGNED NOT NULL COMMENT '授权人ID',
    granted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '授权时间',

    -- 条件限制：支持权限的条件限制
    conditions JSON NULL COMMENT '权限条件限制（如数据范围、时间限制等）',

    -- 状态管理：支持关联状态控制
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '状态',
    remarks VARCHAR(500) NULL COMMENT '备注',

    -- 通用审计字段：遵循通用字段设计规范
    created_by BIGINT UNSIGNED NULL COMMENT '创建人ID',
    updated_by BIGINT UNSIGNED NULL COMMENT '更新人ID',
    version INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '乐观锁版本号',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP NULL COMMENT '删除时间',

    -- 主键约束
    PRIMARY KEY (id),

    -- 唯一性约束：防止重复授权
    UNIQUE KEY uk_role_permissions_role_permission (role_id, permission_id),

    -- 查询索引：支持常用查询场景
    KEY idx_role_permissions_role (role_id),
    KEY idx_role_permissions_permission (permission_id),
    KEY idx_role_permissions_granted_by (granted_by),
    KEY idx_role_permissions_status (status),
    KEY idx_role_permissions_granted_at (granted_at),
    KEY idx_role_permissions_role_status (role_id, status),
    KEY idx_role_permissions_permission_status (permission_id, status),

    -- 外键约束：遵循引用完整性规则
    CONSTRAINT fk_role_permissions_role_id FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_permission_id FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_granted_by FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE RESTRICT,

    -- 数据完整性约束：遵循CHECK约束规范
    CONSTRAINT chk_role_permissions_remarks_length CHECK (remarks IS NULL OR CHAR_LENGTH(remarks) <= 500),
    CONSTRAINT chk_role_permissions_status_valid CHECK (status IN ('active', 'inactive')),
    CONSTRAINT chk_role_permissions_not_delete_active CHECK (deleted_at IS NULL OR status != 'active')

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表';

-- ====================================================================
-- 7. 创建用户登录历史表 (user_login_history)
-- ====================================================================
CREATE TABLE user_login_history (
    -- 主键字段：遵循自增主键规范
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '登录记录ID',

    -- 用户信息：记录登录用户
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名（冗余字段，防止用户删除后无法追溯）',

    -- 登录信息：记录登录详情
    login_type ENUM('password', 'oauth', 'sso', 'api') NOT NULL DEFAULT 'password' COMMENT '登录类型',
    login_status ENUM('success', 'failed', 'locked', 'disabled') NOT NULL COMMENT '登录状态',
    failure_reason VARCHAR(100) NULL COMMENT '失败原因',

    -- 环境信息：记录登录环境
    ip_address VARCHAR(45) NOT NULL COMMENT 'IP地址',
    user_agent TEXT NULL COMMENT '用户代理',
    device_fingerprint VARCHAR(255) NULL COMMENT '设备指纹',
    browser VARCHAR(50) NULL COMMENT '浏览器',
    os VARCHAR(50) NULL COMMENT '操作系统',
    location VARCHAR(200) NULL COMMENT '登录地点',

    -- 时间信息：记录登录和登出时间
    login_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
    logout_at TIMESTAMP NULL COMMENT '登出时间（NULL表示仍在会话中）',
    session_duration INT UNSIGNED NULL COMMENT '会话持续时间（秒）',

    -- 会话信息：记录会话详情
    session_id VARCHAR(128) NULL COMMENT '会话ID',
    is_current_session BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否为当前会话',

    -- 安全信息：记录安全相关
    risk_score TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '风险评分（0-100）',
    is_suspicious BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否为可疑登录',
    security_flags JSON NULL COMMENT '安全标记（如异地登录、新设备等）',

    -- 审计字段：记录创建信息
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    -- 主键约束
    PRIMARY KEY (id),

    -- 查询索引：支持常用查询场景
    KEY idx_user_login_history_user (user_id),
    KEY idx_user_login_history_username (username),
    KEY idx_user_login_history_status (login_status),
    KEY idx_user_login_history_login_at (login_at),
    KEY idx_user_login_history_ip (ip_address),
    KEY idx_user_login_history_type (login_type),
    KEY idx_user_login_history_session (session_id),
    KEY idx_user_login_history_user_time (user_id, login_at DESC),
    KEY idx_user_login_history_ip_time (ip_address, login_at DESC),
    KEY idx_user_login_history_suspicious (is_suspicious, login_at DESC),
    KEY idx_user_login_history_risk (risk_score, login_at DESC),

    -- 外键约束：遵循引用完整性规则
    CONSTRAINT fk_user_login_history_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    -- 数据完整性约束：遵循CHECK约束规范
    CONSTRAINT chk_user_login_history_username_length CHECK (CHAR_LENGTH(username) >= 3 AND CHAR_LENGTH(username) <= 50),
    CONSTRAINT chk_user_login_history_failure_reason_length CHECK (failure_reason IS NULL OR CHAR_LENGTH(failure_reason) <= 100),
    CONSTRAINT chk_user_login_history_ip_format CHECK (ip_address REGEXP '^([0-9]{1,3}\\.){3}[0-9]{1,3}$' OR ip_address REGEXP '^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$'),
    CONSTRAINT chk_user_login_history_session_duration CHECK (session_duration IS NULL OR session_duration >= 0),
    CONSTRAINT chk_user_login_history_risk_score CHECK (risk_score <= 100),
    CONSTRAINT chk_user_login_history_browser_length CHECK (browser IS NULL OR CHAR_LENGTH(browser) <= 50),
    CONSTRAINT chk_user_login_history_os_length CHECK (os IS NULL OR CHAR_LENGTH(os) <= 50),
    CONSTRAINT chk_user_login_history_location_length CHECK (location IS NULL OR CHAR_LENGTH(location) <= 200),
    CONSTRAINT chk_user_login_history_logout_after_login CHECK (logout_at IS NULL OR logout_at >= login_at)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户登录历史表';

-- 恢复外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- 创建完成日志
-- ====================================================================
-- 用户权限核心表创建完成：
-- 1. users - 用户基础信息表（含审计字段）
-- 2. user_profiles - 用户扩展信息表（含审计字段）
-- 3. roles - 角色定义表（含审计字段）
-- 4. permissions - 权限定义表（含审计字段）
-- 5. user_roles - 用户角色关联表（含审计字段）
-- 6. role_permissions - 角色权限关联表（含审计字段）
-- 7. user_login_history - 用户登录历史表
--
-- 审计字段说明：
-- - created_by: 创建人ID
-- - updated_by: 更新人ID
-- - version: 乐观锁版本号
-- - created_at: 创建时间
-- - updated_at: 更新时间
-- - deleted_at: 删除时间（软删除）
-- ====================================================================