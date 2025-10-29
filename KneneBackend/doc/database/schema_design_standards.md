# 数据库架构规范制定

## 🗄️ 数据库架构规范

本文档定义影视资源下载网站的数据库架构规范，为所有数据库设计提供标准和约束，确保数据库设计的一致性和可维护性。

---

## 🎯 设计目标与原则

### 1.1.1 阶段目标
为项目第一阶段（数据层与基础架构）建立完整的数据库架构规范，包括：
- 表结构设计规范
- 索引设计指导原则
- 数据完整性规范
- 版本管理策略

### 设计原则

#### 标准化原则
- **命名统一**：采用统一的命名规范，提高可读性
- **结构一致**：相同类型表采用一致的结构设计
- **文档完善**：每个设计决策都有明确的文档记录

#### 性能优先原则
- **查询优化**：设计时考虑查询性能和索引效率
- **扩展性考虑**：为未来数据量增长预留扩展空间
- **并发支持**：支持高并发访问场景

#### 数据完整性原则
- **约束先行**：通过数据库约束保证数据完整性
- **一致性保证**：确保关联数据的一致性
- **可追溯性**：支持数据变更的追踪和审计

---

## 📋 表结构设计规范

### 1. 基础规范

#### 表命名规范
```sql
-- 规范格式：小写字母 + 下划线
users                    # ✅ 正确
user_profiles            # ✅ 正确
UserProfiles            # ❌ 错误：使用驼峰命名
user-profiles           # ❌ 错误：使用连字符

-- 使用复数形式
users                   # ✅ 正确：用户表
roles                   # ✅ 正确：角色表
user                    # ❌ 错误：使用单数形式

-- 长度限制：不超过30个字符
user_operation_logs     # ✅ 正确：18个字符
user_login_history_records # ❌ 错误：超过30个字符

-- 特殊表前缀
tmp_user_import          # ✅ 临时表使用tmp_前缀
his_user_login_2023     # ✅ 历史表使用his_前缀
log_operation_backup    # ✅ 日志备份表
```

#### 字段命名规范
```sql
-- 基础格式：小写字母 + 下划线
username                # ✅ 正确
created_at              # ✅ 正确
userName                # ❌ 错误：使用驼峰命名
created-at              # ❌ 错误：使用连字符

-- 有意义的字段名
user_id                 # ✅ 正确：用户ID
file_size               # ✅ 正确：文件大小
uid                     # ❌ 错误：缩写不够明确
fs                      # ❌ 错误：无意义缩写

-- 类型后缀规范
avatar_url              # ✅ URL字段使用_url后缀
login_time              # ✅ 时间字段使用_time后缀
file_count              # ✅ 数量字段使用_count后缀
is_active               # ✅ 布尔字段使用is_前缀
has_permission          # ✅ 布尔字段使用has_前缀

-- 关联字段命名
user_id                 # ✅ 关联users表
role_id                 # ✅ 关联roles表
created_by              # ✅ 创建人关联
updated_by              # ✅ 更新人关联
```

#### 字段类型规范
```sql
-- 主键字段
id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID'

-- 用户关联字段
user_id BIGINT NOT NULL COMMENT '用户ID'

-- 状态字段
status ENUM('ACTIVE', 'INACTIVE', 'DELETED') DEFAULT 'ACTIVE' COMMENT '状态'
is_active TINYINT(1) DEFAULT 1 COMMENT '是否启用'
is_deleted TINYINT(1) DEFAULT 0 COMMENT '是否删除'

-- 时间字段
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
deleted_at TIMESTAMP NULL COMMENT '删除时间（软删除）'
login_time TIMESTAMP NULL COMMENT '登录时间'
expire_time TIMESTAMP NULL COMMENT '过期时间'

-- 字符串字段
username VARCHAR(50) NOT NULL COMMENT '用户名'           # 用户名：3-50字符
email VARCHAR(100) NOT NULL COMMENT '邮箱'               # 邮箱：最大100字符
title VARCHAR(200) COMMENT '标题'                       # 标题：最大200字符
description TEXT COMMENT '描述'                         # 描述：长文本

-- 数值字段
age TINYINT UNSIGNED COMMENT '年龄'                      # 年龄：0-255
score DECIMAL(5,2) COMMENT '评分'                       # 评分：精度为5，小数位2
amount DECIMAL(10,2) NOT NULL COMMENT '金额'             # 金额：支持大额交易
file_size BIGINT COMMENT '文件大小(字节)'                # 文件大小：支持大文件

-- JSON字段
metadata JSON COMMENT '元数据'                          # 结构化数据
settings JSON COMMENT '设置信息'                        # 配置信息
```

### 2. 通用字段设计

#### 每张表必须包含的字段
```sql
CREATE TABLE `example_table` (
    -- 主键字段（必须）
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',

    -- 业务字段（根据表功能定义）
    `name` VARCHAR(100) NOT NULL COMMENT '名称',

    -- 审计字段（必须）
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `created_by` BIGINT COMMENT '创建人ID',
    `updated_by` BIGINT COMMENT '更新人ID',

    -- 软删除字段（推荐）
    `deleted_at` TIMESTAMP NULL COMMENT '删除时间',
    `is_deleted` TINYINT(1) DEFAULT 0 COMMENT '是否删除',

    -- 版本控制字段（乐观锁，推荐）
    `version` INT DEFAULT 0 COMMENT '版本号',

    -- 业务状态字段（根据业务需要）
    `status` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE' COMMENT '状态',

    -- 扩展字段（根据业务需要）
    `remark` VARCHAR(500) COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='示例表';
```

#### 审计字段说明
```sql
-- 创建相关
created_at              # 记录创建时间，自动设置
created_by              # 记录创建人，关联users表

-- 更新相关
updated_at              # 记录最后更新时间，自动更新
updated_by              # 记录最后更新人，关联users表

-- 删除相关
deleted_at              # 软删除时间，NULL表示未删除
is_deleted              # 软删除标记，0=未删除，1=已删除

-- 版本控制
version                 # 乐观锁版本号，每次更新递增
```

### 3. 业务表设计示例

#### 用户相关表设计
```sql
-- 用户基础信息表
CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    `email` VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希',
    `phone` VARCHAR(20) COMMENT '手机号',
    `avatar_url` VARCHAR(500) COMMENT '头像URL',
    `status` ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE' COMMENT '用户状态',
    `last_login_at` TIMESTAMP NULL COMMENT '最后登录时间',
    `last_login_ip` VARCHAR(50) COMMENT '最后登录IP',
    `login_count` INT DEFAULT 0 COMMENT '登录次数',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` TIMESTAMP NULL COMMENT '删除时间',

    -- 索引
    INDEX `idx_username` (`username`),
    INDEX `idx_email` (`email`),
    INDEX `idx_status` (`status`),
    INDEX `idx_last_login_at` (`last_login_at`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户基础信息表';

-- 用户扩展信息表
CREATE TABLE `user_profiles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `nickname` VARCHAR(50) COMMENT '昵称',
    `gender` ENUM('MALE', 'FEMALE', 'UNKNOWN') DEFAULT 'UNKNOWN' COMMENT '性别',
    `birth_date` DATE COMMENT '出生日期',
    `bio` TEXT COMMENT '个人简介',
    `location` VARCHAR(100) COMMENT '所在地',
    `website` VARCHAR(200) COMMENT '个人网站',
    `company` VARCHAR(100) COMMENT '公司',
    `job_title` VARCHAR(100) COMMENT '职位',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    -- 外键约束
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `uk_user_id` (`user_id`),

    -- 索引
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_nickname` (`nickname`),
    INDEX `idx_location` (`location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户扩展信息表';
```

#### 系统配置表设计
```sql
-- 系统配置表
CREATE TABLE `system_configs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `config_key` VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    `config_value` TEXT COMMENT '配置值',
    `config_type` ENUM('STRING', 'NUMBER', 'BOOLEAN', 'JSON') DEFAULT 'STRING' COMMENT '配置类型',
    `description` VARCHAR(200) COMMENT '配置描述',
    `category` VARCHAR(50) COMMENT '配置分类',
    `is_public` TINYINT(1) DEFAULT 0 COMMENT '是否公开配置',
    `is_encrypted` TINYINT(1) DEFAULT 0 COMMENT '是否加密存储',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    -- 索引
    INDEX `idx_config_key` (`config_key`),
    INDEX `idx_category` (`category`),
    INDEX `idx_is_public` (`is_public`),
    INDEX `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

-- 数据字典表
CREATE TABLE `dictionaries` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `dict_type` VARCHAR(50) NOT NULL COMMENT '字典类型',
    `dict_key` VARCHAR(100) NOT NULL COMMENT '字典键',
    `dict_value` VARCHAR(200) NOT NULL COMMENT '字典值',
    `dict_label` VARCHAR(100) COMMENT '字典标签',
    `dict_group` VARCHAR(50) COMMENT '字典分组',
    `parent_key` VARCHAR(100) COMMENT '父级键',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `is_active` TINYINT(1) DEFAULT 1 COMMENT '是否启用',
    `remark` VARCHAR(500) COMMENT '备注',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    -- 唯一约束
    UNIQUE KEY `uk_dict_type_key` (`dict_type`, `dict_key`),

    -- 索引
    INDEX `idx_dict_type` (`dict_type`),
    INDEX `idx_dict_group` (`dict_group`),
    INDEX `idx_parent_key` (`parent_key`),
    INDEX `idx_sort_order` (`sort_order`),
    INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据字典表';
```

---

## 🔗 索引设计指导原则

### 1. 索引命名规范

#### 索引类型命名
```sql
-- 主键索引（自动创建）
PRIMARY KEY (`id`)

-- 唯一索引
UNIQUE KEY `uk_users_username` (`username`)              # 用户名唯一
UNIQUE KEY `uk_users_email` (`email`)                    # 邮箱唯一
UNIQUE KEY `uk_user_roles_user_role` (`user_id`, `role_id`) # 用户角色联合唯一

-- 普通索引
INDEX `idx_users_status` (`status`)                      # 单字段索引
INDEX `idx_users_created_at` (`created_at`)              # 时间索引
INDEX `idx_users_status_created` (`status`, `created_at`) # 复合索引

-- 前缀索引（长字符串字段）
INDEX `idx_articles_title_prefix` (`title`(50))          # 标题前缀索引
INDEX `idx_users_email_prefix` (`email`(20))             # 邮箱前缀索引
```

#### 索引命名格式
```sql
-- 格式：索引类型_表名_字段名
uk_users_username          # 唯一索引_用户表_用户名字段
idx_operation_logs_user_id  # 普通索引_操作日志表_用户ID字段
idx_files_size_created     # 复合索引_文件表_大小和创建时间
```

### 2. 索引设计策略

#### 必须创建索引的字段
```sql
-- 1. 主键字段（自动创建）
PRIMARY KEY (`id`)

-- 2. 外键字段
INDEX `idx_user_id` (`user_id`)              # 关联查询优化
INDEX `idx_role_id` (`role_id`)              # 关联查询优化
INDEX `fk_files_user_id` (`user_id`)         # 外键字段索引

-- 3. 唯一字段
UNIQUE KEY `uk_username` (`username`)        # 业务唯一性
UNIQUE KEY `uk_email` (`email`)              # 业务唯一性

-- 4. 状态字段（经常作为查询条件）
INDEX `idx_status` (`status`)                # 状态查询优化
INDEX `idx_is_active` (`is_active`)          # 启用状态查询优化

-- 5. 时间字段（经常用于排序和范围查询）
INDEX `idx_created_at` (`created_at`)        # 创建时间排序
INDEX `idx_updated_at` (`updated_at`)        # 更新时间排序
INDEX `idx_login_time` (`login_time`)         # 登录时间查询

-- 6. 排序字段
INDEX `idx_sort_order` (`sort_order`)         # 排序优化
```

#### 复合索引设计原则
```sql
-- 1. 高选择性字段在前
INDEX `idx_users_status_created` (`status`, `created_at`)
-- status字段选择性高，放在前面

-- 2. 覆盖常用查询
INDEX `idx_operation_logs_user_type_created` (`user_id`, `operation_type`, `created_at`)
-- 覆盖：用户操作日志查询（用户ID + 操作类型 + 时间范围）

-- 3. 考虑排序字段
INDEX `idx_articles_category_status_created` (`category`, `status`, `created_at`)
-- 覆盖：分类文章查询（分类 + 状态 + 创建时间排序）

-- 4. 避免重复索引
-- ❌ 错误：重复的单字段索引
INDEX `idx_user_id` (`user_id`)
INDEX `idx_user_id_status` (`user_id`, `status`)

-- ✅ 正确：只需要复合索引
INDEX `idx_user_id_status` (`user_id`, `status`)
-- 单独查询user_id时也可以使用这个索引
```

#### 索引使用场景分析
```sql
-- 1. 精确匹配查询
SELECT * FROM users WHERE username = 'testuser';
-- 需要：idx_username

-- 2. 范围查询
SELECT * FROM users WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31';
-- 需要：idx_created_at

-- 3. 排序查询
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
-- 需要：idx_created_at

-- 4. 分组查询
SELECT status, COUNT(*) FROM users GROUP BY status;
-- 需要：idx_status

-- 5. 复合条件查询
SELECT * FROM users WHERE status = 'ACTIVE' AND created_at > '2024-01-01';
-- 需要：idx_status_created (status在前，created_at在后)

-- 6. JOIN查询
SELECT u.*, p.* FROM users u
JOIN user_profiles p ON u.id = p.user_id
WHERE u.status = 'ACTIVE';
-- 需要：idx_status, idx_user_id (在user_profiles表中)
```

### 3. 索引优化建议

#### 避免过度索引
```sql
-- ❌ 错误：不必要的索引
INDEX `idx_user_id` (`user_id`)                    # 重复，复合索引已包含
INDEX `idx_user_id_status` (`user_id`, `status`)
INDEX `idx_status` (`status`)                      # 重复，复合索引已包含

-- ✅ 正确：合理的索引设计
INDEX `idx_user_id_status` (`user_id`, `status`) # 复合索引可以覆盖两种查询场景
```

#### 前缀索引使用
```sql
-- 长字符串字段使用前缀索引
-- ❌ 错误：对整个长字符串建索引（占用空间大）
INDEX `idx_content` (`content`)                    # content字段很长

-- ✅ 正确：使用前缀索引
INDEX `idx_content_prefix` (`content`(100))         # 只索引前100个字符
```

#### 函数索引（MySQL 8.0+）
```sql
-- 函数索引（MySQL 8.0+支持）
-- 查询时经常使用函数的字段
INDEX `idx_email_lower` ((LOWER(email)))           # 支持大小写不敏感查询
INDEX `idx_phone_clean` ((REPLACE(phone, '-', ''))) # 清理格式的手机号查询
```

---

## 🛡️ 数据完整性规范

### 1. 约束设计

#### 主键约束
```sql
-- 每个表必须有主键
CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    -- 其他字段...
);

-- 联合主键（多对多中间表）
CREATE TABLE `user_roles` (
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `role_id` BIGINT NOT NULL COMMENT '角色ID',
    PRIMARY KEY (`user_id`, `role_id`),
    -- 其他字段...
);
```

#### 外键约束
```sql
-- 外键约束命名规范：fk_表名_字段名_引用表名_引用字段
CREATE TABLE `user_profiles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    -- 其他字段...

    -- 外键约束
    CONSTRAINT `fk_user_profiles_user_id_users_id`
        FOREIGN KEY (`user_id`)
        REFERENCES `users`(`id`)
        ON DELETE CASCADE          -- 级联删除
        ON UPDATE CASCADE          -- 级联更新
);

-- 外键删除策略说明
-- ON DELETE CASCADE：级联删除，当主表记录删除时，从表记录也删除
-- ON DELETE SET NULL：设置为NULL，当主表记录删除时，从表字段设置为NULL
-- ON DELETE RESTRICT：限制删除，当从表存在关联记录时，不允许删除主表记录
```

#### 唯一约束
```sql
-- 业务唯一性约束
CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名',
    `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
    -- 其他字段...

    -- 唯一约束
    CONSTRAINT `uk_users_username` UNIQUE (`username`),
    CONSTRAINT `uk_users_email` UNIQUE (`email`)
);

-- 联合唯一约束
CREATE TABLE `user_permissions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `permission_id` BIGINT NOT NULL COMMENT '权限ID',
    -- 其他字段...

    -- 联合唯一约束
    CONSTRAINT `uk_user_permissions_user_permission`
        UNIQUE (`user_id`, `permission_id`)
);
```

#### 检查约束
```sql
-- 数据有效性检查约束
CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `age` TINYINT COMMENT '年龄',
    `score` DECIMAL(5,2) COMMENT '评分',
    `status` VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    -- 其他字段...

    -- 检查约束
    CONSTRAINT `chk_users_age_range` CHECK (`age` BETWEEN 0 AND 150),
    CONSTRAINT `chk_users_score_range` CHECK (`score` BETWEEN 0.0 AND 10.0),
    CONSTRAINT `chk_users_status_valid` CHECK (`status` IN ('ACTIVE', 'INACTIVE', 'BANNED'))
);
```

### 2. 默认值设计

#### 时间字段默认值
```sql
-- 创建时间默认当前时间
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'

-- 更新时间自动更新
`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'

-- 布尔字段默认值
`is_active` TINYINT(1) DEFAULT 1 COMMENT '是否启用'
`is_deleted` TINYINT(1) DEFAULT 0 COMMENT '是否删除'

-- 状态字段默认值
`status` ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE' COMMENT '用户状态'

-- 数值字段默认值
`sort_order` INT DEFAULT 0 COMMENT '排序'
`login_count` INT DEFAULT 0 COMMENT '登录次数'
`version` INT DEFAULT 0 COMMENT '版本号'
```

#### 枚举字段默认值
```sql
-- 性别枚举
`gender` ENUM('MALE', 'FEMALE', 'UNKNOWN') DEFAULT 'UNKNOWN' COMMENT '性别'

-- 文件状态枚举
`file_status` ENUM('UPLOADING', 'PROCESSING', 'COMPLETED', 'FAILED') DEFAULT 'UPLOADING' COMMENT '文件状态'

-- 支付状态枚举
`payment_status` ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') DEFAULT 'PENDING' COMMENT '支付状态'
```

### 3. 数据完整性验证

#### 业务规则验证
```sql
-- 用户名长度限制
CONSTRAINT `chk_users_username_length` CHECK (CHAR_LENGTH(`username`) BETWEEN 3 AND 50)

-- 邮箱格式验证（MySQL 8.0+）
CONSTRAINT `chk_users_email_format` CHECK (`email` REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')

-- 手机号格式验证
CONSTRAINT `chk_users_phone_format` CHECK (`phone` REGEXP '^1[3-9]\\d{9}$')

-- 年龄范围验证
CONSTRAINT `chk_users_age_range` CHECK (`age` BETWEEN 0 AND 150)
```

#### 关联数据一致性
```sql
-- 用户删除时检查是否有相关数据
-- 通过应用层逻辑控制，或者在删除前进行检查
DELIMITER $$
CREATE TRIGGER `before_user_delete`
BEFORE DELETE ON `users`
FOR EACH ROW
BEGIN
    -- 检查用户是否有未完成的订单
    IF EXISTS (SELECT 1 FROM `orders` WHERE `user_id` = OLD.id AND `status` = 'PENDING') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '用户有待处理的订单，无法删除';
    END IF;
END$$
DELIMITER ;
```

---

## 📈 版本管理策略

### 1. Flyway版本控制

#### 版本命名规范
```sql
-- 版本格式：V{主版本}.{次版本}.{修订号}__{描述}.sql
-- 示例：
V1.1.1__Create_core_tables.sql           # 创建核心基础表
V1.1.2__Insert_core_data.sql            # 插入核心数据
V1.2.1__Create_auth_tables.sql           # 创建认证权限表
V1.2.2__Insert_auth_data.sql             # 插入认证权限数据
V1.3.1__Create_vip_tables.sql            # 创建VIP业务表
V1.3.2__Insert_vip_data.sql              # 插入VIP业务数据
```

#### 版本管理原则
```sql
-- 1. 版本号必须递增，不能跳跃
V1.1.1 → V1.1.2 → V1.1.3        # ✅ 正确
V1.1.1 → V1.1.3                 # ❌ 错误：跳跃了V1.1.2

-- 2. 版本描述清晰明确
V1.1.1__Create_user_tables.sql        # ✅ 清楚：创建用户表
V1.1.2__Update_table_structure.sql    # ✅ 清楚：更新表结构
V1.1.3__Add_indexes.sql                # ✅ 清楚：添加索引
V1.1.4__Fix_bug.sql                    # ✅ 清楚：修复bug
V1.1.5__Database_changes.sql           # ❌ 不清楚：描述过于笼统

-- 3. 每个版本文件只包含相关的变更
-- ✅ 正确：一个文件只处理用户表
V1.1.1__Create_user_tables.sql
-- CREATE TABLE users (...)

-- ✅ 正确：一个文件只处理索引
V1.1.2__Add_user_indexes.sql
-- ALTER TABLE users ADD INDEX idx_username (username);

-- ❌ 错误：一个文件包含不相关的变更
V1.1.3__Mixed_changes.sql
-- CREATE TABLE roles (...);
-- ALTER TABLE users ADD COLUMN phone VARCHAR(20);
-- CREATE INDEX idx_email ON users(email);
```

#### 迁移脚本示例
```sql
-- V1.1.1__Create_core_tables.sql
-- 创建核心基础表

-- 用户表
CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    `email` VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希',
    `status` ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE' COMMENT '用户状态',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX `idx_username` (`username`),
    INDEX `idx_email` (`email`),
    INDEX `idx_status` (`status`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户基础信息表';

-- 角色表
CREATE TABLE `roles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `role_name` VARCHAR(50) NOT NULL UNIQUE COMMENT '角色名称',
    `role_code` VARCHAR(50) NOT NULL UNIQUE COMMENT '角色代码',
    `description` VARCHAR(200) COMMENT '角色描述',
    `is_system` TINYINT(1) DEFAULT 0 COMMENT '是否系统角色',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX `idx_role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色定义表';

-- 权限表
CREATE TABLE `permissions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `permission_name` VARCHAR(100) NOT NULL COMMENT '权限名称',
    `permission_code` VARCHAR(100) NOT NULL UNIQUE COMMENT '权限代码',
    `resource_type` VARCHAR(50) COMMENT '资源类型',
    `action` VARCHAR(50) COMMENT '操作类型',
    `description` VARCHAR(200) COMMENT '权限描述',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX `idx_permission_code` (`permission_code`),
    INDEX `idx_resource_type` (`resource_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限定义表';
```

### 2. 回滚策略

#### 回滚脚本命名
```sql
-- 回滚脚本格式：R{版本号}__{描述}.sql
-- 示例：
R1.1.1__Drop_core_tables.sql            # 删除核心基础表（谨慎使用）
R1.2.1__Drop_auth_tables.sql            # 删除认证权限表
R1.3.1__Drop_vip_tables.sql             # 删除VIP业务表
```

#### 回滚策略制定
```sql
-- R1.1.1__Drop_core_tables.sql
-- 删除核心基础表的回滚脚本（谨慎使用）

-- 警告：此操作将删除所有数据，请确保已备份重要数据

-- 删除外键约束
ALTER TABLE `user_profiles` DROP FOREIGN KEY IF EXISTS `fk_user_profiles_user_id_users_id`;

-- 删除表
DROP TABLE IF EXISTS `user_profiles`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `users`;

-- 重置Flyway版本表（如果需要）
-- DELETE FROM `flyway_schema_history` WHERE `version` = '1.1.1';
```

#### 安全回滚流程
```sql
-- 1. 数据备份（重要：执行前必须备份数据）
-- mysqldump -u username -p database_name > backup_before_rollback.sql

-- 2. 检查依赖关系
-- 确认没有其他表依赖要回滚的表
SHOW CREATE TABLE `related_table`;

-- 3. 分步回滚
-- 按照依赖关系的逆序执行回滚
-- 先删除子表，再删除父表

-- 4. 验证回滚结果
-- 确认数据库结构符合预期
SHOW TABLES;
```

### 3. 测试数据管理

#### 测试数据插入脚本
```sql
-- V1.1.2__Insert_core_data.sql
-- 插入核心基础数据

-- 插入默认角色
INSERT INTO `roles` (`role_name`, `role_code`, `description`, `is_system`) VALUES
('超级管理员', 'SUPER_ADMIN', '系统超级管理员，拥有所有权限', 1),
('管理员', 'ADMIN', '系统管理员，拥有大部分权限', 1),
('VIP用户', 'VIP', '付费VIP用户，拥有特殊权限', 0),
('普通用户', 'USER', '普通注册用户，拥有基础权限', 0);

-- 插入系统权限
INSERT INTO `permissions` (`permission_name`, `permission_code`, `resource_type`, `action`, `description`) VALUES
('用户管理', 'USER_MANAGE', 'USER', 'MANAGE', '管理用户信息'),
('角色管理', 'ROLE_MANAGE', 'ROLE', 'MANAGE', '管理角色信息'),
('权限管理', 'PERMISSION_MANAGE', 'PERMISSION', 'MANAGE', '管理权限信息'),
('资源查看', 'RESOURCE_VIEW', 'RESOURCE', 'VIEW', '查看资源信息'),
('资源下载', 'RESOURCE_DOWNLOAD', 'RESOURCE', 'DOWNLOAD', '下载资源文件');

-- 插入系统配置
INSERT INTO `system_configs` (`config_key`, `config_value`, `config_type`, `description`, `is_public`) VALUES
('site.name', '影视资源下载网站', 'STRING', '网站名称', 1),
('site.description', '提供高质量影视资源下载服务', 'STRING', '网站描述', 1),
('user.default_avatar', '/static/images/default-avatar.png', 'STRING', '用户默认头像', 1),
('upload.max_file_size', '104857600', 'NUMBER', '最大文件上传大小（字节）', 0),
('security.password_min_length', '6', 'NUMBER', '密码最小长度', 0);

-- 插入数据字典
INSERT INTO `dictionaries` (`dict_type`, `dict_key`, `dict_value`, `dict_label`, `dict_group`, `sort_order`) VALUES
('USER_STATUS', 'ACTIVE', 'ACTIVE', '正常', '用户状态', 1),
('USER_STATUS', 'INACTIVE', 'INACTIVE', '未激活', '用户状态', 2),
('USER_STATUS', 'BANNED', 'BANNED', '已封禁', '用户状态', 3),
('FILE_STATUS', 'UPLOADING', 'UPLOADING', '上传中', '文件状态', 1),
('FILE_STATUS', 'PROCESSING', 'PROCESSING', '处理中', '文件状态', 2),
('FILE_STATUS', 'COMPLETED', 'COMPLETED', '已完成', '文件状态', 3),
('FILE_STATUS', 'FAILED', 'FAILED', '失败', '文件状态', 4);
```

#### 测试数据清理脚本
```sql
-- V1.1.3__Clean_test_data.sql
-- 清理测试数据（仅在测试环境执行）

-- 仅在测试环境执行
-- SELECT IF(@@ENVIRONMENT = 'test', 'OK', 'SKIP') as execute_status;

-- 清理测试用户数据（保留系统用户）
DELETE FROM `users`
WHERE `username` LIKE 'test_%'
AND `id` > 1000;

-- 重置自增ID（可选，谨慎使用）
-- ALTER TABLE `users` AUTO_INCREMENT = 1001;

-- 清理测试配置
DELETE FROM `system_configs`
WHERE `config_key` LIKE 'test_%';

-- 清理测试字典数据
DELETE FROM `dictionaries`
WHERE `dict_type` LIKE 'TEST_%';
```

---

## ✅ 设计检查清单

### 1.1.1阶段设计完成检查

#### 表结构设计检查
- [ ] **命名规范检查**
  - [ ] 所有表名使用小写字母+下划线
  - [ ] 所有字段名使用小写字母+下划线
  - [ ] 表名使用复数形式
  - [ ] 字段名有明确意义
  - [ ] 避免使用缩写（除非是通用缩写）

- [ ] **字段类型检查**
  - [ ] 主键使用BIGINT AUTO_INCREMENT
  - [ ] 枚举字段使用ENUM类型
  - [ ] 金额字段使用DECIMAL类型
  - [ ] 时间字段使用TIMESTAMP类型
  - [ ] 大文本使用TEXT类型

- [ ] **通用字段检查**
  - [ ] 每张表都有主键字段
  - [ ] 每张表都有审计字段（created_at, updated_at）
  - [ ] 相关表都有外键字段
  - [ ] 状态字段有合适的默认值

#### 索引设计检查
- [ ] **必要索引检查**
  - [ ] 主键索引（自动创建）
  - [ ] 外键字段索引
  - [ ] 唯一字段索引
  - [ ] 状态字段索引
  - [ ] 时间字段索引

- [ ] **索引命名检查**
  - [ ] 唯一索引使用uk_前缀
  - [ ] 普通索引使用idx_前缀
  - [ ] 索引名称包含表名和字段名
  - [ ] 索引名称长度合理

- [ ] **索引效率检查**
  - [ ] 避免重复索引
  - [ ] 复合索引字段顺序合理
  - [ ] 长字符串字段使用前缀索引
  - [ ] 考虑覆盖索引优化

#### 约束设计检查
- [ ] **主键约束检查**
  - [ ] 每张表都有主键
  - [ ] 多对多表使用联合主键
  - [ ] 主键字段命名合理

- [ ] **外键约束检查**
  - [ ] 外键约束命名规范
  - [ ] 删除策略合理
  - [ ] 外键字段索引存在
  - [ ] 关联表结构正确

- [ ] **唯一约束检查**
  - [ ] 业务唯一字段有唯一约束
  - [ ] 唯一约束命名规范
  - [ ] 联合唯一约束合理

#### 数据完整性检查
- [ ] **默认值检查**
  - [ ] 时间字段有合适的默认值
  - [ ] 布尔字段有合适的默认值
  - [ ] 状态字段有合适的默认值
  - [ ] 枚举字段有合适的默认值

- [ ] **检查约束检查**
  - [ ] 数值范围检查
  - [ ] 字符串长度检查
  - [ ] 枚举值有效性检查
  - [ ] 业务规则验证

#### 版本管理检查
- [ ] **Flyway脚本检查**
  - [ ] 版本命名规范正确
  - [ ] 版本号递增正确
  - [ ] 版本描述清晰明确
  - [ ] 脚本内容相关性强

- [ ] **回滚策略检查**
  - [ ] 重要变更有回滚脚本
  - [ ] 回滚脚本命名规范
  - [ ] 回滚操作安全性评估
  - [ ] 数据备份策略制定

### 设计文档检查
- [ ] **设计文档完整性**
  - [ ] 表结构设计文档完整
  - [ ] 索引设计文档完整
  - [ ] 约束设计文档完整
  - [ ] 版本管理文档完整

- [ ] **设计文档准确性**
  - [ ] SQL脚本与设计文档一致
  - [ ] 字段类型和长度正确
  - [ ] 索引设计合理
  - [ ] 约束设置正确

---

**文档维护**：数据库架构规范文档随数据库设计演进持续更新
**最后更新**：2024-10-29
**维护人员**：开发团队