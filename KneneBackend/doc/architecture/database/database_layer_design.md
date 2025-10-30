# 数据库分层设计

## 🗄️ 数据库分层架构设计

本文档描述影视资源下载网站的数据库分层设计原则和实施策略，支持增量式开发和渐进式完善。

---

## 🎯 设计原则

### 1. 核心表优先原则
- **核心基础表先行**：用户、权限、配置等核心表优先设计和实现
- **渐进式扩展**：边开发边完善数据库设计，随业务需求演进
- **测试数据驱动**：每个模块设计完成后立即插入测试数据
- **版本化管理**：通过Flyway等工具管理数据库变更

### 2. 依赖关系原则
- **技术依赖优先**：数据库设计严格按照技术依赖关系进行
- **业务支撑导向**：数据库设计优先支撑基础架构和核心业务
- **可扩展性考虑**：预留扩展空间，支持未来业务发展
- **性能优先考虑**：设计时考虑查询性能和扩展性能

### 3. 数据完整性原则
- **约束先行**：外键约束、唯一约束、检查约束在设计阶段确定
- **数据一致性**：通过数据库约束保证数据一致性
- **索引策略**：根据查询模式设计合理的索引策略
- **事务边界**：明确事务边界，保证数据操作的原子性

---

## 📊 三层数据库架构

### 第一层：核心基础表（阶段1.1设计）

#### 设计目标
为所有业务功能提供基础数据支撑，是整个系统的数据基础。

#### 核心表设计

##### 1. 用户权限核心表
```sql
-- 用户基础信息表
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
    status ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE' COMMENT '用户状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP NULL COMMENT '删除时间',

    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户基础信息表';

-- 用户扩展信息表
CREATE TABLE user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar_url VARCHAR(500) COMMENT '头像URL',
    gender ENUM('MALE', 'FEMALE', 'UNKNOWN') DEFAULT 'UNKNOWN' COMMENT '性别',
    birth_date DATE COMMENT '出生日期',
    bio TEXT COMMENT '个人简介',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户扩展信息表';

-- 角色定义表
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE COMMENT '角色名称',
    role_code VARCHAR(50) NOT NULL UNIQUE COMMENT '角色代码',
    description VARCHAR(200) COMMENT '角色描述',
    is_system TINYINT(1) DEFAULT 0 COMMENT '是否系统角色',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_role_code (role_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色定义表';

-- 权限定义表
CREATE TABLE permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(100) NOT NULL COMMENT '权限名称',
    permission_code VARCHAR(100) NOT NULL UNIQUE COMMENT '权限代码',
    resource_type VARCHAR(50) COMMENT '资源类型',
    action VARCHAR(50) COMMENT '操作类型',
    description VARCHAR(200) COMMENT '权限描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_permission_code (permission_code),
    INDEX idx_resource_type (resource_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限定义表';
```

##### 2. 系统基础表
```sql
-- 系统配置表
CREATE TABLE system_configs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    config_type ENUM('STRING', 'NUMBER', 'BOOLEAN', 'JSON') DEFAULT 'STRING' COMMENT '配置类型',
    description VARCHAR(200) COMMENT '配置描述',
    is_public TINYINT(1) DEFAULT 0 COMMENT '是否公开',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_config_key (config_key),
    INDEX idx_is_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

-- 数据字典表
CREATE TABLE dictionaries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dict_type VARCHAR(50) NOT NULL COMMENT '字典类型',
    dict_key VARCHAR(100) NOT NULL COMMENT '字典键',
    dict_value VARCHAR(200) NOT NULL COMMENT '字典值',
    dict_label VARCHAR(100) COMMENT '字典标签',
    sort_order INT DEFAULT 0 COMMENT '排序',
    is_active TINYINT(1) DEFAULT 1 COMMENT '是否启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    UNIQUE KEY uk_dict_type_key (dict_type, dict_key),
    INDEX idx_dict_type (dict_type),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据字典表';

-- 文件存储配置表
CREATE TABLE file_storages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    storage_type ENUM('LOCAL', 'OSS', 'COS', 'QINIU') NOT NULL COMMENT '存储类型',
    storage_name VARCHAR(100) NOT NULL COMMENT '存储名称',
    access_key VARCHAR(200) COMMENT '访问密钥',
    secret_key VARCHAR(200) COMMENT '安全密钥',
    bucket_name VARCHAR(100) COMMENT '桶名称',
    endpoint VARCHAR(200) COMMENT '访问端点',
    domain_url VARCHAR(200) COMMENT '访问域名',
    is_default TINYINT(1) DEFAULT 0 COMMENT '是否默认',
    is_active TINYINT(1) DEFAULT 1 COMMENT '是否启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_storage_type (storage_type),
    INDEX idx_is_default (is_default),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件存储配置表';
```

##### 3. 审计日志表
```sql
-- 操作日志表
CREATE TABLE operation_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT COMMENT '用户ID',
    operation_type VARCHAR(50) NOT NULL COMMENT '操作类型',
    operation_module VARCHAR(50) NOT NULL COMMENT '操作模块',
    operation_desc VARCHAR(200) COMMENT '操作描述',
    request_method VARCHAR(10) COMMENT '请求方法',
    request_url VARCHAR(500) COMMENT '请求URL',
    request_params TEXT COMMENT '请求参数',
    response_result TEXT COMMENT '响应结果',
    ip_address VARCHAR(50) COMMENT 'IP地址',
    user_agent TEXT COMMENT '用户代理',
    execution_time INT COMMENT '执行时间(ms)',
    status ENUM('SUCCESS', 'FAILURE') NOT NULL COMMENT '执行状态',
    error_message TEXT COMMENT '错误信息',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_operation_type (operation_type),
    INDEX idx_operation_module (operation_module),
    INDEX idx_created_at (created_at),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';

-- 审计日志表
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL COMMENT '实体类型',
    entity_id BIGINT NOT NULL COMMENT '实体ID',
    operation_type ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL COMMENT '操作类型',
    old_values JSON COMMENT '旧值',
    new_values JSON COMMENT '新值',
    changed_fields JSON COMMENT '变更字段',
    user_id BIGINT COMMENT '操作用户ID',
    ip_address VARCHAR(50) COMMENT 'IP地址',
    user_agent TEXT COMMENT '用户代理',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_operation_type (operation_type),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='审计日志表';
```

### 第二层：业务功能表（按阶段设计）

#### 阶段2：认证权限表
```sql
-- 用户角色关联表
CREATE TABLE user_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    granted_by BIGINT COMMENT '授权人ID',
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '授权时间',
    expires_at TIMESTAMP NULL COMMENT '过期时间',
    is_active TINYINT(1) DEFAULT 1 COMMENT '是否启用',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY uk_user_role (user_id, role_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- 角色权限关联表
CREATE TABLE role_permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT NOT NULL COMMENT '角色ID',
    permission_id BIGINT NOT NULL COMMENT '权限ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY uk_role_permission (role_id, permission_id),
    INDEX idx_role_id (role_id),
    INDEX idx_permission_id (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色权限关联表';
```

#### 阶段3：VIP业务表
```sql
-- 会员信息表
CREATE TABLE vip_memberships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    plan_id BIGINT NOT NULL COMMENT '套餐ID',
    start_date TIMESTAMP NOT NULL COMMENT '开始时间',
    end_date TIMESTAMP NOT NULL COMMENT '结束时间',
    status ENUM('ACTIVE', 'EXPIRED', 'CANCELLED') DEFAULT 'ACTIVE' COMMENT '状态',
    auto_renew TINYINT(1) DEFAULT 0 COMMENT '自动续费',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_end_date (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员信息表';

-- 订单主表
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(50) NOT NULL UNIQUE COMMENT '订单号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    plan_id BIGINT NOT NULL COMMENT '套餐ID',
    amount DECIMAL(10,2) NOT NULL COMMENT '订单金额',
    status ENUM('PENDING', 'PAID', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING' COMMENT '订单状态',
    payment_method VARCHAR(50) COMMENT '支付方式',
    paid_at TIMESTAMP NULL COMMENT '支付时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_order_no (order_no),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单主表';
```

#### 阶段4：用户中心表
```sql
-- 收藏主表
CREATE TABLE favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    resource_type ENUM('MOVIE', 'ARTICLE', 'WIKI') NOT NULL COMMENT '资源类型',
    resource_id BIGINT NOT NULL COMMENT '资源ID',
    folder_id BIGINT COMMENT '收藏夹ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_resource (user_id, resource_type, resource_id),
    INDEX idx_user_id (user_id),
    INDEX idx_resource (resource_type, resource_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏主表';

-- 下载历史表
CREATE TABLE download_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    resource_id BIGINT NOT NULL COMMENT '资源ID',
    download_url VARCHAR(500) COMMENT '下载链接',
    file_size BIGINT COMMENT '文件大小',
    download_status ENUM('PENDING', 'DOWNLOADING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING' COMMENT '下载状态',
    download_time TIMESTAMP NULL COMMENT '下载时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_resource_id (resource_id),
    INDEX idx_status (download_status),
    INDEX idx_download_time (download_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='下载历史表';
```

### 第三层：高级功能表（按需设计）

#### PT站点集成表
```sql
-- PT站点信息表
CREATE TABLE pt_sites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    site_name VARCHAR(100) NOT NULL COMMENT '站点名称',
    site_url VARCHAR(200) NOT NULL COMMENT '站点URL',
    login_url VARCHAR(200) COMMENT '登录URL',
    is_active TINYINT(1) DEFAULT 1 COMMENT '是否启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_site_name (site_name),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='PT站点信息表';

-- 种子文件表
CREATE TABLE torrent_files (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    info_hash VARCHAR(40) NOT NULL UNIQUE COMMENT 'Info哈希',
    title VARCHAR(500) NOT NULL COMMENT '标题',
    file_size BIGINT COMMENT '文件大小',
    file_count INT COMMENT '文件数量',
    category VARCHAR(100) COMMENT '分类',
    upload_time TIMESTAMP NULL COMMENT '上传时间',
    seeders INT DEFAULT 0 COMMENT '做种数',
    leechers INT DEFAULT 0 COMMENT '下载数',
    completed INT DEFAULT 0 COMMENT '完成数',
    health_score DECIMAL(5,2) COMMENT '健康度评分',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_info_hash (info_hash),
    INDEX idx_title (title),
    INDEX idx_category (category),
    INDEX idx_upload_time (upload_time),
    INDEX idx_health_score (health_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='种子文件表';
```

---

## 🔧 数据库设计规范

### 1. 命名规范

#### 表命名规范
- **小写字母+下划线**：`user_profiles`、`operation_logs`
- **使用复数形式**：`users`、`roles`、`permissions`
- **前缀标识**：临时表使用`tmp_`前缀，历史表使用`his_`前缀
- **长度限制**：表名长度不超过30个字符

#### 字段命名规范
- **小写字母+下划线**：`user_id`、`created_at`、`is_active`
- **有意义的名称**：避免使用`col1`、`field2`等无意义名称
- **类型后缀**：URL字段以`_url`结尾，时间字段以`_at`或`_time`结尾
- **布尔字段**：使用`is_`或`has_`前缀

#### 索引命名规范
- **主键索引**：`pk_表名`，如`pk_users`
- **唯一索引**：`uk_表名_字段名`，如`uk_users_username`
- **普通索引**：`idx_表名_字段名`，如`idx_users_email`
- **复合索引**：`idx_表名_字段1_字段2`，如`idx_operation_logs_user_type`

### 2. 字段设计规范

#### 通用字段
```sql
-- 主键字段
id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID'

-- 用户关联字段
user_id BIGINT COMMENT '用户ID'

-- 时间字段
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
deleted_at TIMESTAMP NULL COMMENT '删除时间（软删除）'

-- 状态字段
status ENUM('ACTIVE', 'INACTIVE', 'DELETED') DEFAULT 'ACTIVE' COMMENT '状态'
is_active TINYINT(1) DEFAULT 1 COMMENT '是否启用'
is_deleted TINYINT(1) DEFAULT 0 COMMENT '是否删除'

-- 排序字段
sort_order INT DEFAULT 0 COMMENT '排序'
```

#### 字段类型规范
- **主键**：使用`BIGINT AUTO_INCREMENT`
- **状态枚举**：使用`ENUM`类型，值使用大写
- **金额字段**：使用`DECIMAL(10,2)`确保精度
- **文本大字段**：使用`TEXT`类型
- **JSON字段**：使用`JSON`类型存储结构化数据
- **时间字段**：使用`TIMESTAMP`类型

### 3. 约束设计规范

#### 主键约束
- 每个表必须有主键
- 推荐使用自增BIGINT作为主键
- 主键字段命名为`id`

#### 外键约束
- 外键字段命名：`关联表_id`，如`user_id`
- 外键约束命名：`fk_表名_字段名_引用表名_引用字段`
- 删除策略：根据业务逻辑选择`CASCADE`、`SET NULL`或`RESTRICT`

#### 唯一约束
- 业务唯一字段必须建立唯一约束
- 唯一约束命名：`uk_表名_字段名`
- 复合唯一约束：多个字段组合的唯一性

#### 检查约束
- 枚举值检查：`status IN ('ACTIVE', 'INACTIVE')`
- 数值范围检查：`age BETWEEN 0 AND 150`
- 字符串长度检查：`LENGTH(username) BETWEEN 3 AND 50`

---

## 📈 性能优化策略

### 1. 索引策略

#### 必须索引的字段
```sql
-- 主键字段（自动索引）
PRIMARY KEY (id)

-- 外键字段
INDEX idx_user_id (user_id)
INDEX idx_role_id (role_id)

-- 唯一字段
UNIQUE INDEX uk_username (username)
UNIQUE INDEX uk_email (email)

-- 查询频繁字段
INDEX idx_status (status)
INDEX idx_created_at (created_at)
```

#### 复合索引设计
```sql
-- 用户操作日志查询
INDEX idx_user_type_created (user_id, operation_type, created_at)

-- 订单状态查询
INDEX idx_user_status_created (user_id, status, created_at)

-- 收藏资源查询
INDEX idx_user_resource_type (user_id, resource_type, created_at)
```

#### 覆盖索引优化
```sql
-- 用户列表查询（只需要基础信息）
INDEX idx_user_list (id, username, email, status, created_at)

-- 操作日志统计（只需要统计信息）
INDEX idx_operation_stats (operation_type, status, created_at)
```

### 2. 查询优化

#### 避免的性能问题
```sql
-- ❌ 避免SELECT *
SELECT * FROM users WHERE status = 'ACTIVE';

-- ✅ 只查询需要的字段
SELECT id, username, email, created_at
FROM users
WHERE status = 'ACTIVE'
LIMIT 20;
```

#### 合理使用EXISTS
```sql
-- ❌ 子查询可能导致性能问题
SELECT * FROM users u
WHERE u.id IN (SELECT ur.user_id FROM user_roles ur WHERE ur.role_id = 1);

-- ✅ 使用EXISTS替代IN
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = u.id AND ur.role_id = 1
);
```

#### 分页查询优化
```sql
-- ❌ 深分页性能问题
SELECT * FROM users ORDER BY created_at DESC LIMIT 10000, 20;

-- ✅ 使用ID范围优化
SELECT * FROM users
WHERE id < (SELECT id FROM users ORDER BY created_at DESC LIMIT 10000, 1)
ORDER BY created_at DESC
LIMIT 20;
```

---

## 🔄 版本管理策略

### 1. Flyway版本控制

#### 版本命名规范
- **格式**：`V{序号}__{描述}.sql`
- **序号**：使用数字序列，如`1.1.1`、`1.1.2`
- **描述**：使用下划线分隔，如`Create_core_tables`

#### 版本管理示例
```sql
-- V1.1.1__Create_core_tables.sql
-- 核心基础表创建

-- V1.1.2__Insert_core_data.sql
-- 核心基础数据插入

-- V1.2.1__Create_auth_tables.sql
-- 认证权限表创建

-- V1.2.2__Insert_auth_data.sql
-- 认证权限数据插入
```

### 2. 回滚策略

#### 重要变更回滚脚本
```sql
-- R1.1.1__Drop_core_tables.sql
-- 核心基础表回滚（谨慎使用）

-- R1.2.1__Drop_auth_tables.sql
-- 认证权限表回滚
```

#### 回滚策略制定
1. **备份重要数据**：执行前备份相关表数据
2. **分步回滚**：按依赖关系分步骤执行回滚
3. **验证回滚**：确保回滚后数据一致性
4. **通知相关方**：回滚前通知所有相关人员

---

**文档维护**：数据库设计文档随架构演进持续更新
**最后更新**：2024-10-29
**维护人员**：相笑与春风