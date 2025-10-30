# 数据完整性规则

## 🛡️ 数据完整性规则文档

本文档详细定义影视资源下载网站数据库的数据完整性规则，包括实体完整性、域完整性、引用完整性和用户自定义完整性约束，确保数据的准确性、一致性和可靠性。

---

## 🎯 数据完整性目标与原则

### 1.1.1 阶段目标
为项目第一阶段建立完整的数据完整性规则体系，包括：
- 实体完整性约束规则
- 域完整性验证规则
- 引用完整性约束规则
- 用户自定义业务规则

### 完整性原则

#### 数据准确性原则
- **数据有效性**：确保存储的数据符合业务规则和格式要求
- **数据一致性**：保证相关数据之间的逻辑一致性
- **数据完整性**：防止不完整或不正确的数据进入数据库

#### 业务规则约束原则
- **业务逻辑体现**：通过数据库约束体现核心业务规则
- **数据关系维护**：维护实体间的正确关联关系
- **异常数据处理**：建立异常数据的检测和处理机制

#### 可维护性原则
- **约束清晰明确**：每个约束都有明确的业务含义
- **变更可追踪**：数据完整性变更可以被追踪和审计
- **错误可定位**：数据完整性错误可以被快速定位和修复

---

## 🔒 实体完整性规则

### 1. 主键约束规则

#### 主键设计规范
```sql
-- 每个表必须有主键
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    -- 其他字段...
);

-- 联合主键（仅用于多对多关联表）
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

#### 主键约束规则
- **唯一性**：主键值必须唯一标识表中的每一行
- **非空性**：主键列不允许NULL值
- **稳定性**：主键值不应轻易更改
- **简洁性**：主键应尽可能简洁，避免使用复合主键（关联表除外）

#### 主键生成策略
```sql
-- 使用AUTO_INCREMENT自增主键
CREATE TABLE articles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    -- 其他字段...
);

-- 使用UUID作为主键（特殊情况）
CREATE TABLE files (
    id CHAR(36) DEFAULT (UUID()) PRIMARY KEY COMMENT '文件ID',
    filename VARCHAR(255) NOT NULL COMMENT '文件名',
    -- 其他字段...
);
```

### 2. 唯一性约束规则

#### 业务唯一性约束
```sql
-- 用户名唯一性
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    email VARCHAR(100) NOT NULL COMMENT '邮箱',
    -- 唯一性约束
    CONSTRAINT uk_users_username UNIQUE (username),
    CONSTRAINT uk_users_email UNIQUE (email)
);

-- 订单号唯一性
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    order_no VARCHAR(32) NOT NULL COMMENT '订单号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    -- 唯一性约束
    CONSTRAINT uk_orders_order_no UNIQUE (order_no)
);
```

#### 复合唯一性约束
```sql
-- 用户角色关联唯一性（一个用户不能重复拥有相同角色）
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT uk_user_roles_user_role UNIQUE (user_id, role_id)
);

-- 文章标签唯一性（一篇文章不能重复添加相同标签）
CREATE TABLE article_tags (
    article_id BIGINT NOT NULL COMMENT '文章ID',
    tag_id BIGINT NOT NULL COMMENT '标签ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (article_id, tag_id),
    CONSTRAINT uk_article_tags_article_tag UNIQUE (article_id, tag_id)
);

-- 资源分类唯一性（一个资源在同一个分类下只能存在一次）
CREATE TABLE resource_categories (
    resource_id BIGINT NOT NULL COMMENT '资源ID',
    category_id BIGINT NOT NULL COMMENT '分类ID',
    is_primary TINYINT(1) DEFAULT 0 COMMENT '是否主分类',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (resource_id, category_id),
    CONSTRAINT uk_resource_categories_resource_category UNIQUE (resource_id, category_id)
);
```

#### 唯一性约束设计原则
- **业务规则体现**：唯一性约束应直接反映业务规则
- **性能考虑**：过多唯一性约束可能影响插入性能
- **复合字段顺序**：复合唯一约束的字段顺序应符合查询模式

---

## 🔢 域完整性规则

### 1. 数据类型约束

#### 基本数据类型约束
```sql
-- 字符串长度约束
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    email VARCHAR(100) NOT NULL COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '手机号',
    nickname VARCHAR(50) COMMENT '昵称',
    bio TEXT COMMENT '个人简介'
);

-- 数值范围约束
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    name VARCHAR(200) NOT NULL COMMENT '商品名称',
    price DECIMAL(10,2) NOT NULL COMMENT '价格',
    stock INT UNSIGNED DEFAULT 0 COMMENT '库存数量',
    weight DECIMAL(8,3) COMMENT '重量（千克）'
);

-- 日期时间约束
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    event_name VARCHAR(200) NOT NULL COMMENT '事件名称',
    start_time TIMESTAMP NOT NULL COMMENT '开始时间',
    end_time TIMESTAMP NOT NULL COMMENT '结束时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
);
```

#### 枚举类型约束
```sql
-- 状态枚举约束
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    status ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE' COMMENT '用户状态',
    user_type ENUM('ADMIN', 'VIP', 'USER') DEFAULT 'USER' COMMENT '用户类型',
    gender ENUM('MALE', 'FEMALE', 'UNKNOWN') DEFAULT 'UNKNOWN' COMMENT '性别'
);

-- 文章类型约束
CREATE TABLE articles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    type ENUM('NEWS', 'BLOG', 'TUTORIAL', 'ANNOUNCEMENT') NOT NULL COMMENT '文章类型',
    status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') DEFAULT 'DRAFT' COMMENT '文章状态',
    visibility ENUM('PUBLIC', 'PRIVATE', 'MEMBERS_ONLY') DEFAULT 'PUBLIC' COMMENT '可见性'
);

-- 订单状态约束
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    order_no VARCHAR(32) NOT NULL COMMENT '订单号',
    status ENUM('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING' COMMENT '订单状态',
    payment_method ENUM('ALIPAY', 'WECHAT', 'BANK_CARD', 'BALANCE') COMMENT '支付方式'
);
```

### 2. 检查约束规则

#### 数值范围检查
```sql
-- 年龄范围检查
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    age TINYINT COMMENT '年龄',
    CONSTRAINT chk_users_age_range CHECK (age BETWEEN 0 AND 150),
    CONSTRAINT chk_users_age_positive CHECK (age IS NULL OR age > 0)
);

-- 金额和数量检查
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    order_no VARCHAR(32) NOT NULL COMMENT '订单号',
    amount DECIMAL(10,2) NOT NULL COMMENT '订单金额',
    quantity INT NOT NULL DEFAULT 1 COMMENT '商品数量',
    CONSTRAINT chk_orders_amount_positive CHECK (amount > 0),
    CONSTRAINT chk_orders_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_orders_amount_limit CHECK (amount <= 999999.99)
);

-- 评分范围检查
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    resource_id BIGINT NOT NULL COMMENT '资源ID',
    rating TINYINT NOT NULL COMMENT '评分（1-5分）',
    CONSTRAINT chk_reviews_rating_range CHECK (rating BETWEEN 1 AND 5)
);
```

#### 字符串格式检查
```sql
-- 用户名格式检查
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    email VARCHAR(100) NOT NULL COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '手机号',
    CONSTRAINT chk_users_username_length CHECK (CHAR_LENGTH(username) BETWEEN 3 AND 50),
    CONSTRAINT chk_users_username_format CHECK (username REGEXP '^[a-zA-Z0-9_]+$'),
    CONSTRAINT chk_users_email_format CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_users_phone_format CHECK (phone IS NULL OR phone REGEXP '^1[3-9]\\d{9}$')
);

-- 密码强度检查
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
    -- 注意：实际密码强度检查应在应用层进行，这里仅作示例
    CONSTRAINT chk_users_password_length CHECK (CHAR_LENGTH(password_hash) >= 60) -- bcrypt哈希长度
);

-- URL格式检查
CREATE TABLE resources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    download_url VARCHAR(1000) COMMENT '下载链接',
    image_url VARCHAR(1000) COMMENT '图片链接',
    CONSTRAINT chk_resources_download_url_format CHECK (
        download_url IS NULL OR
        download_url REGEXP '^https?://[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-\\.,@?^=%&:/~\\+#]*[\\w\\-\\@?^=%&/~\\+#])?$'
    ),
    CONSTRAINT chk_resources_image_url_format CHECK (
        image_url IS NULL OR
        image_url REGEXP '^https?://[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-\\.,@?^=%&:/~\\+#]*[\\w\\-\\@?^=%&/~\\+#])?$'
    )
);
```

#### 日期时间检查
```sql
-- 出生日期合理性检查
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    birth_date DATE COMMENT '出生日期',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    CONSTRAINT chk_users_birth_date_valid CHECK (
        birth_date IS NULL OR
        (birth_date < CURDATE() AND birth_date > '1900-01-01')
    ),
    CONSTRAINT chk_users_birth_date_created CHECK (
        birth_date IS NULL OR
        birth_date < DATE(created_at)
    )
);

-- 活动时间逻辑检查
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    event_name VARCHAR(200) NOT NULL COMMENT '事件名称',
    start_time TIMESTAMP NOT NULL COMMENT '开始时间',
    end_time TIMESTAMP NOT NULL COMMENT '结束时间',
    registration_deadline TIMESTAMP COMMENT '报名截止时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    CONSTRAINT chk_events_time_logic CHECK (start_time < end_time),
    CONSTRAINT chk_events_registration_deadline CHECK (
        registration_deadline IS NULL OR
        registration_deadline < start_time
    ),
    CONSTRAINT chk_events_future_start CHECK (start_time > created_at)
);
```

#### 业务逻辑检查
```sql
-- VIP到期时间检查
CREATE TABLE vip_memberships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    start_date DATE NOT NULL COMMENT '开始日期',
    end_date DATE NOT NULL COMMENT '结束日期',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    CONSTRAINT chk_vip_date_logic CHECK (start_date < end_date),
    CONSTRAINT chk_vip_duration_limit CHECK (
        DATEDIFF(end_date, start_date) BETWEEN 1 AND 3650 -- 1天到10年
    )
);

-- 文件大小和类型检查
CREATE TABLE files (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    filename VARCHAR(255) NOT NULL COMMENT '文件名',
    file_size BIGINT NOT NULL COMMENT '文件大小（字节）',
    file_type VARCHAR(50) NOT NULL COMMENT '文件类型',
    mime_type VARCHAR(100) COMMENT 'MIME类型',
    CONSTRAINT chk_files_size_positive CHECK (file_size > 0),
    CONSTRAINT chk_files_size_limit CHECK (file_size <= 10737418240), -- 10GB限制
    CONSTRAINT chk_files_type_valid CHECK (
        file_type IN ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'ARCHIVE', 'TORRENT')
    )
);

-- 下载次数限制检查
CREATE TABLE user_download_limits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    download_date DATE NOT NULL COMMENT '下载日期',
    download_count INT NOT NULL DEFAULT 0 COMMENT '下载次数',
    max_daily_limit INT NOT NULL DEFAULT 10 COMMENT '每日限制',
    CONSTRAINT chk_download_count_valid CHECK (download_count >= 0),
    CONSTRAINT chk_download_count_limit CHECK (download_count <= max_daily_limit),
    CONSTRAINT chk_daily_limit_reasonable CHECK (max_daily_limit BETWEEN 1 AND 1000)
);
```

---

## 🔗 引用完整性规则

### 1. 外键约束规则

#### 基本外键约束
```sql
-- 用户资料表引用用户表
CREATE TABLE user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar_url VARCHAR(500) COMMENT '头像URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- 外键约束
    CONSTRAINT fk_user_profiles_user_id_users_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE -- 级联删除
        ON UPDATE CASCADE -- 级联更新
);

-- 文章表引用用户表
CREATE TABLE articles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    author_id BIGINT NOT NULL COMMENT '作者ID',
    category_id BIGINT COMMENT '分类ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    -- 外键约束
    CONSTRAINT fk_articles_author_id_users_id
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE RESTRICT -- 限制删除（有文章时不能删除用户）
        ON UPDATE CASCADE,

    CONSTRAINT fk_articles_category_id_categories_id
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL -- 设置为NULL（删除分类时文章分类设为空）
        ON UPDATE CASCADE
);
```

#### 外键删除策略
```sql
-- CASCADE: 级联删除
CREATE TABLE user_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    session_token VARCHAR(255) NOT NULL COMMENT '会话令牌',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    CONSTRAINT fk_user_sessions_user_id_users_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE -- 用户删除时，会话记录也删除
);

-- RESTRICT: 限制删除
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    order_no VARCHAR(32) NOT NULL COMMENT '订单号',
    amount DECIMAL(10,2) NOT NULL COMMENT '金额',
    status ENUM('PENDING', 'PAID', 'CANCELLED') DEFAULT 'PENDING' COMMENT '状态',
    CONSTRAINT fk_orders_user_id_users_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT -- 用户有待处理订单时不能删除
);

-- SET NULL: 设置为NULL
CREATE TABLE articles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    author_id BIGINT NOT NULL COMMENT '作者ID',
    reviewer_id BIGINT COMMENT '审核人ID',
    CONSTRAINT fk_articles_author_id_users_id
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE RESTRICT, -- 作者删除限制

    CONSTRAINT fk_articles_reviewer_id_users_id
        FOREIGN KEY (reviewer_id)
        REFERENCES users(id)
        ON DELETE SET NULL -- 审核人删除时设为NULL
);
```

### 2. 自引用外键规则

#### 层次结构约束
```sql
-- 分类表的层次结构
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    name VARCHAR(100) NOT NULL COMMENT '分类名称',
    parent_id BIGINT COMMENT '父分类ID',
    level INT DEFAULT 1 COMMENT '层级',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    -- 自引用外键约束
    CONSTRAINT fk_categories_parent_id_categories_id
        FOREIGN KEY (parent_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT -- 有子分类时不能删除
        ON UPDATE CASCADE,

    -- 检查约束防止循环引用
    CONSTRAINT chk_categories_parent_not_self CHECK (parent_id IS NULL OR parent_id != id)
);

-- 评论表的层次结构
CREATE TABLE comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    content TEXT NOT NULL COMMENT '评论内容',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    resource_id BIGINT NOT NULL COMMENT '资源ID',
    parent_id BIGINT COMMENT '父评论ID',
    level INT DEFAULT 1 COMMENT '层级',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    -- 外键约束
    CONSTRAINT fk_comments_user_id_users_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comments_resource_id_resources_id
        FOREIGN KEY (resource_id)
        REFERENCES resources(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comments_parent_id_comments_id
        FOREIGN KEY (parent_id)
        REFERENCES comments(id)
        ON DELETE CASCADE,

    -- 检查约束
    CONSTRAINT chk_comments_parent_not_self CHECK (parent_id IS NULL OR parent_id != id),
    CONSTRAINT chk_comments_level_limit CHECK (level BETWEEN 1 AND 10)
);
```

### 3. 多表关联约束

#### 复杂业务场景约束
```sql
-- 订单和订单明细的关联约束
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    order_no VARCHAR(32) NOT NULL COMMENT '订单号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '总金额',
    status ENUM('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    CONSTRAINT uk_orders_order_no UNIQUE (order_no),
    CONSTRAINT fk_orders_user_id_users_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);

CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    order_id BIGINT NOT NULL COMMENT '订单ID',
    resource_id BIGINT NOT NULL COMMENT '资源ID',
    quantity INT NOT NULL DEFAULT 1 COMMENT '数量',
    price DECIMAL(10,2) NOT NULL COMMENT '单价',
    total_price DECIMAL(10,2) NOT NULL COMMENT '小计',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    -- 外键约束
    CONSTRAINT fk_order_items_order_id_orders_id
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_items_resource_id_resources_id
        FOREIGN KEY (resource_id)
        REFERENCES resources(id)
        ON DELETE RESTRICT,

    -- 检查约束
    CONSTRAINT chk_order_items_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_order_items_price_positive CHECK (price > 0),
    CONSTRAINT chk_order_items_total_calculated CHECK (total_price = quantity * price)
);

-- 用户角色权限的多重关联
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    email VARCHAR(100) NOT NULL COMMENT '邮箱',
    status ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    CONSTRAINT uk_users_username UNIQUE (username),
    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    role_name VARCHAR(50) NOT NULL COMMENT '角色名称',
    role_code VARCHAR(50) NOT NULL COMMENT '角色代码',
    description VARCHAR(200) COMMENT '描述',
    is_system TINYINT(1) DEFAULT 0 COMMENT '是否系统角色',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    CONSTRAINT uk_roles_role_code UNIQUE (role_code)
);

CREATE TABLE permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    permission_name VARCHAR(100) NOT NULL COMMENT '权限名称',
    permission_code VARCHAR(100) NOT NULL COMMENT '权限代码',
    resource_type VARCHAR(50) COMMENT '资源类型',
    action VARCHAR(50) COMMENT '操作类型',
    description VARCHAR(200) COMMENT '描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    CONSTRAINT uk_permissions_permission_code UNIQUE (permission_code)
);

CREATE TABLE user_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    granted_by BIGINT COMMENT '授权人ID',
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '授权时间',
    expires_at TIMESTAMP NULL COMMENT '过期时间',
    CONSTRAINT uk_user_roles_user_role UNIQUE (user_id, role_id),
    CONSTRAINT fk_user_roles_user_id_users_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role_id_roles_id
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_granted_by_users_id
        FOREIGN KEY (granted_by)
        REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT chk_user_roles_expiry_future CHECK (
        expires_at IS NULL OR expires_at > granted_at
    )
);

CREATE TABLE role_permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    permission_id BIGINT NOT NULL COMMENT '权限ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    CONSTRAINT uk_role_permissions_role_permission UNIQUE (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role_id_roles_id
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_permission_id_permissions_id
        FOREIGN KEY (permission_id)
        REFERENCES permissions(id)
        ON DELETE CASCADE
);
```

---

## 🎯 用户自定义完整性规则

### 1. 业务规则约束

#### 用户业务规则
```sql
-- 用户登录失败次数限制
CREATE TABLE user_login_attempts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT COMMENT '用户ID（NULL表示未注册用户）',
    ip_address VARCHAR(50) NOT NULL COMMENT 'IP地址',
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '尝试时间',
    success TINYINT(1) DEFAULT 0 COMMENT '是否成功',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_login_attempts_user_time (user_id, attempt_time),
    INDEX idx_user_login_attempts_ip_time (ip_address, attempt_time)
);

-- 用户每日下载限制
CREATE TABLE user_daily_downloads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    download_date DATE NOT NULL COMMENT '下载日期',
    download_count INT NOT NULL DEFAULT 0 COMMENT '下载次数',
    max_daily_limit INT NOT NULL DEFAULT 10 COMMENT '每日限制',
    last_download_time TIMESTAMP NULL COMMENT '最后下载时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    CONSTRAINT uk_user_daily_downloads_user_date UNIQUE (user_id, download_date),
    CONSTRAINT fk_user_daily_downloads_user_id_users_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_user_daily_downloads_count_valid CHECK (download_count >= 0),
    CONSTRAINT chk_user_daily_downloads_count_limit CHECK (download_count <= max_daily_limit),
    CONSTRAINT chk_user_daily_downloads_limit_reasonable CHECK (max_daily_limit > 0)
);

-- VIP用户特权规则
CREATE TABLE user_privileges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    privilege_type ENUM('DOWNLOAD_LIMIT', 'AD_FREE', 'PREMIUM_CONTENT', 'FAST_DOWNLOAD') NOT NULL COMMENT '特权类型',
    privilege_value VARCHAR(100) COMMENT '特权值',
    is_active TINYINT(1) DEFAULT 1 COMMENT '是否激活',
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '授权时间',
    expires_at TIMESTAMP NULL COMMENT '过期时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    CONSTRAINT uk_user_privileges_user_type UNIQUE (user_id, privilege_type),
    CONSTRAINT fk_user_privileges_user_id_users_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_user_privileges_expiry_logic CHECK (
        expires_at IS NULL OR expires_at > granted_at
    ),
    CONSTRAINT chk_user_privileges_vip_download_limit CHECK (
        privilege_type != 'DOWNLOAD_LIMIT' OR
        (privilege_value REGEXP '^[0-9]+$' AND CAST(privilege_value AS UNSIGNED) > 0)
    )
);
```

#### 资源业务规则
```sql
-- 资源下载规则
CREATE TABLE resource_download_rules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    resource_id BIGINT NOT NULL COMMENT '资源ID',
    user_type ENUM('FREE', 'VIP', 'ADMIN') NOT NULL COMMENT '用户类型',
    download_limit INT DEFAULT 0 COMMENT '下载次数限制（0表示无限制）',
    cooldown_minutes INT DEFAULT 0 COMMENT '冷却时间（分钟）',
    size_limit_mb INT DEFAULT 0 COMMENT '大小限制（MB，0表示无限制）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    CONSTRAINT uk_resource_download_rules_resource_user UNIQUE (resource_id, user_type),
    CONSTRAINT fk_resource_download_rules_resource_id_resources_id
        FOREIGN KEY (resource_id)
        REFERENCES resources(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_resource_download_rules_positive CHECK (
        download_limit >= 0 AND cooldown_minutes >= 0 AND size_limit_mb >= 0
    )
);

-- 资源评分规则
CREATE TABLE resource_ratings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    resource_id BIGINT NOT NULL COMMENT '资源ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    rating TINYINT NOT NULL COMMENT '评分（1-5）',
    review TEXT COMMENT '评价内容',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    CONSTRAINT uk_resource_ratings_resource_user UNIQUE (resource_id, user_id),
    CONSTRAINT fk_resource_ratings_resource_id_resources_id
        FOREIGN KEY (resource_id)
        REFERENCES resources(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_resource_ratings_user_id_users_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_resource_ratings_rating_range CHECK (rating BETWEEN 1 AND 5)
);

-- 资源标签规则
CREATE TABLE resource_tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    resource_id BIGINT NOT NULL COMMENT '资源ID',
    tag_id BIGINT NOT NULL COMMENT '标签ID',
    weight DECIMAL(3,2) DEFAULT 1.0 COMMENT '权重（0.1-1.0）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    CONSTRAINT uk_resource_tags_resource_tag UNIQUE (resource_id, tag_id),
    CONSTRAINT fk_resource_tags_resource_id_resources_id
        FOREIGN KEY (resource_id)
        REFERENCES resources(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_resource_tags_tag_id_tags_id
        FOREIGN KEY (tag_id)
        REFERENCES tags(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_resource_tags_weight_range CHECK (weight BETWEEN 0.1 AND 1.0)
);
```

### 2. 数据一致性规则

#### 统计数据一致性
```sql
-- 资源统计信息表
CREATE TABLE resource_statistics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    resource_id BIGINT NOT NULL COMMENT '资源ID',
    download_count INT DEFAULT 0 COMMENT '下载次数',
    view_count INT DEFAULT 0 COMMENT '查看次数',
    like_count INT DEFAULT 0 COMMENT '点赞次数',
    comment_count INT DEFAULT 0 COMMENT '评论次数',
    average_rating DECIMAL(3,2) DEFAULT 0.0 COMMENT '平均评分',
    rating_count INT DEFAULT 0 COMMENT '评分人数',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
    CONSTRAINT uk_resource_statistics_resource_id UNIQUE (resource_id),
    CONSTRAINT fk_resource_statistics_resource_id_resources_id
        FOREIGN KEY (resource_id)
        REFERENCES resources(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_resource_statistics_counts_non_negative CHECK (
        download_count >= 0 AND view_count >= 0 AND like_count >= 0 AND
        comment_count >= 0 AND rating_count >= 0
    ),
    CONSTRAINT chk_resource_statistics_rating_range CHECK (
        average_rating BETWEEN 0.0 AND 5.0
    )
);

-- 用户统计信息表
CREATE TABLE user_statistics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    total_downloads INT DEFAULT 0 COMMENT '总下载次数',
    total_uploaded INT DEFAULT 0 COMMENT '总上传次数',
    total_comments INT DEFAULT 0 COMMENT '总评论次数',
    total_likes_given INT DEFAULT 0 COMMENT '总点赞次数',
    total_likes_received INT DEFAULT 0 COMMENT '总被点赞次数',
    reputation_score DECIMAL(8,2) DEFAULT 0.0 COMMENT '信誉分数',
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后活动时间',
    CONSTRAINT uk_user_statistics_user_id UNIQUE (user_id),
    CONSTRAINT fk_user_statistics_user_id_users_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_user_statistics_counts_non_negative CHECK (
        total_downloads >= 0 AND total_uploaded >= 0 AND total_comments >= 0 AND
        total_likes_given >= 0 AND total_likes_received >= 0
    ),
    CONSTRAINT chk_user_statistics_reputation_range CHECK (
        reputation_score BETWEEN 0.0 AND 999999.99
    )
);
```

### 3. 触发器约束

#### 自动维护统计数据
```sql
-- 资源统计数据更新触发器
DELIMITER $$
CREATE TRIGGER tr_resource_download_after_insert
AFTER INSERT ON resource_downloads
FOR EACH ROW
BEGIN
    -- 更新资源下载统计
    INSERT INTO resource_statistics (resource_id, download_count)
    VALUES (NEW.resource_id, 1)
    ON DUPLICATE KEY UPDATE
        download_count = download_count + 1,
        last_updated = CURRENT_TIMESTAMP;

    -- 更新用户下载统计
    INSERT INTO user_statistics (user_id, total_downloads)
    VALUES (NEW.user_id, 1)
    ON DUPLICATE KEY UPDATE
        total_downloads = total_downloads + 1,
        last_activity = CURRENT_TIMESTAMP;
END$$
DELIMITER ;

-- 评论统计更新触发器
DELIMITER $$
CREATE TRIGGER tr_comments_after_insert
AFTER INSERT ON comments
FOR EACH ROW
BEGIN
    -- 更新资源评论统计
    INSERT INTO resource_statistics (resource_id, comment_count)
    VALUES (NEW.resource_id, 1)
    ON DUPLICATE KEY UPDATE
        comment_count = comment_count + 1,
        last_updated = CURRENT_TIMESTAMP;

    -- 更新用户评论统计
    INSERT INTO user_statistics (user_id, total_comments)
    VALUES (NEW.user_id, 1)
    ON DUPLICATE KEY UPDATE
        total_comments = total_comments + 1,
        last_activity = CURRENT_TIMESTAMP;
END$$
DELIMITER ;

-- 评分统计更新触发器
DELIMITER $$
CREATE TRIGGER tr_resource_ratings_after_insert
AFTER INSERT ON resource_ratings
FOR EACH ROW
BEGIN
    -- 计算新的平均评分
    SELECT
        COUNT(*) as total_ratings,
        AVG(rating) as avg_rating
    INTO @total_count, @avg_rating
    FROM resource_ratings
    WHERE resource_id = NEW.resource_id;

    -- 更新资源评分统计
    INSERT INTO resource_statistics (resource_id, rating_count, average_rating)
    VALUES (NEW.resource_id, @total_count, @avg_rating)
    ON DUPLICATE KEY UPDATE
        rating_count = @total_count,
        average_rating = @avg_rating,
        last_updated = CURRENT_TIMESTAMP;
END$$
DELIMITER ;
```

#### 业务规则验证触发器
```sql
-- 用户状态变更验证触发器
DELIMITER $$
CREATE TRIGGER tr_users_before_update
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    -- 如果用户状态被设为BANNED，检查是否有未完成的订单
    IF NEW.status = 'BANNED' AND OLD.status != 'BANNED' THEN
        IF EXISTS (
            SELECT 1 FROM orders
            WHERE user_id = NEW.id AND status IN ('PENDING', 'PAID', 'SHIPPED')
        ) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = '用户有待处理订单，不能封禁';
        END IF;
    END IF;

    -- 如果用户状态从非激活变为激活，设置最后登录时间
    IF NEW.status = 'ACTIVE' AND OLD.status != 'ACTIVE' THEN
        SET NEW.last_login_at = CURRENT_TIMESTAMP;
    END IF;
END$$
DELIMITER ;

-- 资源发布验证触发器
DELIMITER $$
CREATE TRIGGER tr_resources_before_update
BEFORE UPDATE ON resources
FOR EACH ROW
BEGIN
    -- 如果资源状态从草稿变为发布，验证必要字段
    IF NEW.status = 'PUBLISHED' AND OLD.status != 'PUBLISHED' THEN
        IF NEW.title IS NULL OR NEW.description IS NULL OR NEW.download_url IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = '发布资源必须填写标题、描述和下载链接';
        END IF;

        -- 设置发布时间
        SET NEW.published_at = CURRENT_TIMESTAMP;
    END IF;

    -- 如果资源状态从发布变为其他状态，更新发布时间
    IF OLD.status = 'PUBLISHED' AND NEW.status != 'PUBLISHED' THEN
        SET NEW.unpublished_at = CURRENT_TIMESTAMP;
    END IF;
END$$
DELIMITER ;
```

---

## 📊 数据完整性验证

### 1. 完整性检查脚本

#### 定期完整性检查
```sql
-- 检查孤立记录（没有对应主表记录的外键引用）
SELECT
    'user_profiles' as table_name,
    COUNT(*) as orphan_count
FROM user_profiles up
LEFT JOIN users u ON up.user_id = u.id
WHERE u.id IS NULL

UNION ALL

SELECT
    'articles' as table_name,
    COUNT(*) as orphan_count
FROM articles a
LEFT JOIN users u ON a.author_id = u.id
WHERE u.id IS NULL

UNION ALL

SELECT
    'resource_downloads' as table_name,
    COUNT(*) as orphan_count
FROM resource_downloads rd
LEFT JOIN users u ON rd.user_id = u.id
LEFT JOIN resources r ON rd.resource_id = r.id
WHERE u.id IS NULL OR r.id IS NULL;

-- 检查数据范围异常
SELECT
    'users' as table_name,
    'age' as field_name,
    COUNT(*) as anomaly_count
FROM users
WHERE age < 0 OR age > 150

UNION ALL

SELECT
    'orders' as table_name,
    'amount' as field_name,
    COUNT(*) as anomaly_count
FROM orders
WHERE amount <= 0

UNION ALL

SELECT
    'resource_ratings' as table_name,
    'rating' as field_name,
    COUNT(*) as anomaly_count
FROM resource_ratings
WHERE rating NOT IN (1,2,3,4,5);

-- 检查统计数据一致性
SELECT
    rs.resource_id,
    rs.download_count as stats_downloads,
    COALESCE(rd.actual_downloads, 0) as actual_downloads,
    ABS(rs.download_count - COALESCE(rd.actual_downloads, 0)) as difference
FROM resource_statistics rs
LEFT JOIN (
    SELECT resource_id, COUNT(*) as actual_downloads
    FROM resource_downloads
    GROUP BY resource_id
) rd ON rs.resource_id = rd.resource_id
WHERE ABS(rs.download_count - COALESCE(rd.actual_downloads, 0)) > 0
ORDER BY difference DESC;
```

### 2. 数据修复脚本

#### 修复孤立记录
```sql
-- 删除孤立的用户资料记录
DELETE up FROM user_profiles up
LEFT JOIN users u ON up.user_id = u.id
WHERE u.id IS NULL;

-- 修复孤立的文章记录（设置作者为系统用户）
UPDATE articles a
LEFT JOIN users u ON a.author_id = u.id
SET a.author_id = 1, a.updated_at = CURRENT_TIMESTAMP
WHERE u.id IS NULL;

-- 修复孤立的资源下载记录
DELETE rd FROM resource_downloads rd
LEFT JOIN users u ON rd.user_id = u.id
LEFT JOIN resources r ON rd.resource_id = r.id
WHERE u.id IS NULL OR r.id IS NULL;
```

#### 修复统计数据
```sql
-- 重新计算资源统计数据
UPDATE resource_statistics rs
SET
    download_count = (
        SELECT COUNT(*) FROM resource_downloads rd
        WHERE rd.resource_id = rs.resource_id
    ),
    view_count = (
        SELECT COUNT(*) FROM resource_views rv
        WHERE rv.resource_id = rs.resource_id
    ),
    comment_count = (
        SELECT COUNT(*) FROM comments c
        WHERE c.resource_id = rs.resource_id
    ),
    average_rating = (
        SELECT COALESCE(AVG(rating), 0) FROM resource_ratings rr
        WHERE rr.resource_id = rs.resource_id
    ),
    rating_count = (
        SELECT COUNT(*) FROM resource_ratings rr
        WHERE rr.resource_id = rs.resource_id
    ),
    last_updated = CURRENT_TIMESTAMP;

-- 重新计算用户统计数据
UPDATE user_statistics us
SET
    total_downloads = (
        SELECT COUNT(*) FROM resource_downloads rd
        WHERE rd.user_id = us.user_id
    ),
    total_comments = (
        SELECT COUNT(*) FROM comments c
        WHERE c.user_id = us.user_id
    ),
    total_likes_given = (
        SELECT COUNT(*) FROM comment_likes cl
        WHERE cl.user_id = us.user_id
    ),
    last_activity = (
        SELECT GREATEST(
            COALESCE(MAX(rd.created_at), '1970-01-01'),
            COALESCE(MAX(c.created_at), '1970-01-01'),
            COALESCE(MAX(cl.created_at), '1970-01-01')
        ) FROM (
            SELECT MAX(created_at) as created_at FROM resource_downloads rd WHERE rd.user_id = us.user_id
            UNION ALL
            SELECT MAX(created_at) as created_at FROM comments c WHERE c.user_id = us.user_id
            UNION ALL
            SELECT MAX(created_at) as created_at FROM comment_likes cl WHERE cl.user_id = us.user_id
        ) recent_activities
    );
```

---

## 📋 数据完整性检查清单

### 设计阶段检查
- [ ] **实体完整性设计**
  - [ ] 每个表都有合适的主键
  - [ ] 业务唯一性字段建立唯一约束
  - [ ] 主键选择符合业务需求
  - [ ] 联合主键仅用于关联表

- [ ] **域完整性设计**
  - [ ] 数据类型选择合适
  - [ ] 字段长度设置合理
  - [ ] 枚举字段覆盖所有业务状态
  - [ ] 检查约束体现业务规则

- [ ] **引用完整性设计**
  - [ ] 外键约束建立正确
  - [ ] 删除策略符合业务需求
  - [ ] 自引用外键防止循环
  - [ ] 多表关联逻辑清晰

### 实现阶段检查
- [ ] **约束命名规范**
  - [ ] 主键约束使用pk_前缀
  - [ ] 外键约束使用fk_前缀
  - [ ] 唯一约束使用uk_前缀
  - [ ] 检查约束使用chk_前缀

- [ ] **业务规则实现**
  - [ ] 检查约束覆盖核心业务规则
  - [ ] 触发器实现复杂业务逻辑
  - [ ] 存储过程封装业务操作
  - [ ] 错误处理机制完善

### 验证阶段检查
- [ ] **完整性验证**
  - [ ] 无孤立记录存在
  - [ ] 数据范围符合约束
  - [ ] 统计数据准确一致
  - [ ] 业务逻辑正确执行

- [ ] **性能影响评估**
  - [ ] 约束对性能影响可接受
  - [ ] 触发器执行效率合理
  - [ ] 索引支持约束检查
  - [ ] 批量操作优化到位

### 维护阶段检查
- [ ] **监控机制**
  - [ ] 约束违规监控到位
  - [ ] 数据质量定期检查
  - [ ] 完整性验证自动化
  - [ ] 异常告警机制建立

- [ ] **文档维护**
  - [ ] 完整性规则文档完整
  - [ ] 约束变更记录清晰
  - [ ] 验证脚本可重用
  - [ ] 修复方案可执行

---

## 🛠️ 完整性管理工具

### 1. 完整性检查工具

#### MySQL内置工具
```sql
-- CHECK TABLE 检查表完整性
CHECK TABLE users, articles, orders;

-- ANALYZE TABLE 更新表统计信息
ANALYZE TABLE users, articles, orders;

-- OPTIMIZE TABLE 优化表结构
OPTIMIZE TABLE users, articles, orders;

-- REPAIR TABLE 修复损坏的表
REPAIR TABLE corrupted_table;
```

#### 自定义检查脚本
```sql
-- 创建完整性检查存储过程
DELIMITER $$
CREATE PROCEDURE sp_check_data_integrity()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE table_name VARCHAR(255);
    DECLARE check_count INT;

    -- 创建结果表
    CREATE TEMPORARY TABLE IF NOT EXISTS integrity_results (
        table_name VARCHAR(255),
        check_type VARCHAR(100),
        issue_count INT,
        issue_description TEXT
    );

    -- 检查孤立记录
    -- 检查用户资料
    SELECT COUNT(*) INTO check_count
    FROM user_profiles up
    LEFT JOIN users u ON up.user_id = u.id
    WHERE u.id IS NULL;

    IF check_count > 0 THEN
        INSERT INTO integrity_results VALUES
        ('user_profiles', 'orphan_records', check_count, '用户资料记录没有对应的用户记录');
    END IF;

    -- 检查文章作者
    SELECT COUNT(*) INTO check_count
    FROM articles a
    LEFT JOIN users u ON a.author_id = u.id
    WHERE u.id IS NULL;

    IF check_count > 0 THEN
        INSERT INTO integrity_results VALUES
        ('articles', 'orphan_records', check_count, '文章记录没有对应的作者记录');
    END IF;

    -- 返回检查结果
    SELECT * FROM integrity_results WHERE issue_count > 0;

    -- 清理临时表
    DROP TEMPORARY TABLE integrity_results;
END$$
DELIMITER ;

-- 执行完整性检查
CALL sp_check_data_integrity();
```

### 2. 完整性修复工具

#### 自动修复脚本
```sql
-- 创建数据修复存储过程
DELIMITER $$
CREATE PROCEDURE sp_repair_data_integrity()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE repair_count INT DEFAULT 0;

    -- 修复孤儿记录
    -- 删除没有用户的用户资料
    DELETE FROM user_profiles
    WHERE user_id NOT IN (SELECT id FROM users);
    SET repair_count = repair_count + ROW_COUNT();

    -- 修复没有作者的文章（设置为系统用户）
    UPDATE articles
    SET author_id = 1, updated_at = CURRENT_TIMESTAMP
    WHERE author_id NOT IN (SELECT id FROM users);
    SET repair_count = repair_count + ROW_COUNT();

    -- 重新计算统计数据
    -- 更新资源统计
    UPDATE resource_statistics rs
    SET download_count = (
        SELECT COUNT(*) FROM resource_downloads rd
        WHERE rd.resource_id = rs.resource_id
    ),
    last_updated = CURRENT_TIMESTAMP;

    -- 返回修复结果
    SELECT CONCAT('修复了 ', repair_count, ' 条数据记录') as repair_result;
END$$
DELIMITER ;

-- 执行数据修复
CALL sp_repair_data_integrity();
```

---

**文档维护**：数据完整性规则文档随数据库设计和业务规则演进持续更新
**最后更新**：2024-10-30
**维护人员**：开发团队