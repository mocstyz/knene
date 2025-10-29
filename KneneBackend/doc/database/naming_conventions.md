# 数据库命名规范

## 📝 数据库命名规范文档

本文档详细定义影视资源下载网站数据库设计的命名规范，确保数据库对象的一致性和可维护性。

---

## 🎯 命名规范总览

### 核心原则
- **一致性原则**：同类对象使用相同的命名模式
- **可读性原则**：命名要清晰表达对象的含义
- **简洁性原则**：在保证可读性的前提下尽量简洁
- **标准化原则**：遵循业界和团队约定的命名标准

### 命名格式标准
- **使用小写字母**：所有数据库对象名使用小写字母
- **下划线分隔**：使用下划线(_)分隔单词，不使用驼峰或连字符
- **避免缩写**：除非是通用缩写，否则不使用缩写
- **长度限制**：名称长度不超过64个字符

---

## 📊 表命名规范

### 1. 表命名格式

#### 基本格式
```sql
-- 格式：{实体名称}[s]
-- 说明：使用复数形式表示集合

-- 示例
users                    # 用户表
roles                    # 角色表
permissions             # 权限表
articles                 # 文章表
categories              # 分类表
comments                # 评论表
orders                  # 订单表
payments                # 支付记录表
files                   # 文件表
downloads               # 下载记录表
```

#### 带前缀的表命名
```sql
-- 临时表：tmp_前缀
tmp_user_import          # 临时用户导入表
tmp_file_processing     # 临时文件处理表
tmp_data_migration      # 临时数据迁移表

-- 历史表：his_前缀
his_user_login_2023      # 2023年用户登录历史
his_order_completed      # 已完成订单历史
his_payment_failed       # 支付失败历史

-- 日志表：log_前缀
log_operation            # 操作日志表
log_login                # 登录日志表
log_error                # 错误日志表
log_system               # 系统日志表

-- 缓存表：cache_前缀
cache_user_session       # 用户会话缓存表
cache_system_config      # 系统配置缓存表
cache_hot_resource       # 热门资源缓存表
```

#### 关联表命名
```sql
-- 格式：{主表名}_{关联表名}[s]
-- 说明：多对多关系或一对多关系的关联表

-- 多对多关系
user_roles               # 用户-角色关联表
role_permissions         # 角色-权限关联表
user_permissions         # 用户-权限关联表
article_tags             # 文章-标签关联表
resource_categories      # 资源-分类关联表

-- 一对多关系的明细表
order_items              # 订单明细表
payment_records          # 支付记录表
download_history         # 下载历史表
operation_logs           # 操作日志表
audit_trails             # 审计轨迹表
```

### 2. 表命名规范详细说明

#### 实体名称规范
```sql
-- 用户相关
users                    # 用户基础信息表
user_profiles           # 用户扩展信息表
user_settings           # 用户设置表
user_preferences         # 用户偏好表

-- 权限相关
roles                    # 角色定义表
permissions             # 权限定义表
role_permissions         # 角色权限关联表
user_roles               # 用户角色关联表

-- 内容相关
articles                 # 文章表
categories              # 分类表
tags                     # 标签表
comments                # 评论表
wiki_entries             # 知识库条目表

-- 业务相关
resources                # 资源表
torrent_files            # 种子文件表
pt_sites                 # PT站点表
vip_memberships         # VIP会员表
orders                  # 订单表
payments                # 支付记录表

-- 系统相关
system_configs           # 系统配置表
dictionaries             # 数据字典表
file_storages            # 文件存储表
operation_logs           # 操作日志表
audit_trails             # 审计轨迹表
```

#### 特殊情况处理
```sql
-- 避免使用保留字
-- ❌ 错误：使用SQL保留字
order                   # ❌ ORDER是SQL保留字
group                   # ❌ GROUP是SQL保留字
user                    # ❌ 在某些数据库中可能是保留字

-- ✅ 正确：使用替代名称
orders                  # ✅ 使用复数形式
user_groups             # ✅ 添加上下文词汇
users                   # ✅ 在MySQL中可以使用，但仍建议检查

-- 长名称处理
-- ❌ 错误：名称过长
user_login_history_record_statistics # ❌ 超过64字符限制

-- ✅ 正确：适当简化或缩写
user_login_history      # ✅ 简化冗余词汇
login_statistics        # ✅ 保留核心含义
user_login_stats        # ✅ 使用通用缩写(stats=statistics)
```

---

## 🔧 字段命名规范

### 1. 主键字段命名

#### 主键字段
```sql
-- 标准主键
id                       # 标准主键字段名（推荐）

-- 带表名前缀的主键（不推荐）
user_id                  # 在users表中作为主键（不推荐）
article_id               # 在articles表中作为主键（不推荐）

-- 联合主键
user_id, role_id         # 在user_roles表中的联合主键
resource_id, category_id # 在resource_categories表中的联合主键
```

#### 业务主键
```sql
-- 某些表可能需要业务主键
username                 # 用户名作为业务主键（唯一）
email                    # 邮箱作为业务主键（唯一）
order_no                 # 订单号作为业务主键（唯一）
payment_no               # 支付单号作为业务主键（唯一）
tracking_no              # 快递单号作为业务主键（唯一）
```

### 2. 外键字段命名

#### 标准外键命名
```sql
-- 格式：{关联表名}_id
-- 说明：关联表的字段名 + _id 后缀

-- 用户相关外键
user_id                  # 关联users表
created_by               # 创建人，关联users表
updated_by               # 更新人，关联users表
approved_by              # 审批人，关联users表

-- 角色权限外键
role_id                  # 关联roles表
permission_id            # 关联permissions表

-- 内容相关外键
article_id               # 关联articles表
category_id              # 关联categories表
tag_id                   # 关联tags表
parent_id                # 关联同级表（如分类的父分类）

-- 业务相关外键
resource_id              # 关联resources表
order_id                 # 关联orders表
payment_id               # 关联payments表
file_id                  # 关联files表
site_id                  # 关联pt_sites表
```

#### 外键字段说明
```sql
-- 明确表达关联关系
user_id                  # ✅ 明确：关联用户表
uid                      # ❌ 不明确：uid可能指多种ID
type_id                  # ❌ 不明确：不知道关联哪个类型表

-- 使用完整表名前缀
resource_category_id     # ✅ 明确：关联resource_categories表
res_cat_id               # ❌ 不明确：缩写不够清晰
rc_id                    # ❌ 不明确：缩写无法理解
```

### 3. 业务字段命名

#### 基础信息字段
```sql
-- 用户信息
username                 # 用户名
email                    # 邮箱地址
phone                    # 手机号码
nickname                 # 昵称
real_name                # 真实姓名
avatar_url               # 头像URL
gender                   # 性别
birth_date               # 出生日期
age                      # 年龄
address                  # 地址
location                 # 所在地
website                  # 个人网站
bio                      # 个人简介
signature               # 个人签名
```

#### 状态和类型字段
```sql
-- 状态字段（使用status后缀）
user_status              # 用户状态
account_status           # 账户状态
order_status             # 订单状态
payment_status           # 支付状态
file_status              # 文件状态
resource_status          # 资源状态
login_status             # 登录状态
operation_status         # 操作状态

-- 类型字段（使用type后缀）
user_type                # 用户类型
account_type             # 账户类型
file_type                # 文件类型
resource_type            # 资源类型
operation_type           # 操作类型
log_type                 # 日志类型
notification_type        # 通知类型
```

#### 布尔字段命名
```sql
-- 使用is_或has_前缀
is_active                # 是否激活
is_enabled               # 是否启用
is_deleted               # 是否删除
is_verified              # 是否已验证
is_published             # 是否已发布
is_visible               # 是否可见
is_public                # 是否公开
is_system                # 是否系统级
is_default               # 是否默认
has_permission           # 是否有权限
has_role                 # 是否有角色
has_access               # 是否有访问权限

-- 状态标记字段
enabled                  # 启用状态（推荐使用is_enabled）
disabled                 # 禁用状态（不推荐，建议使用is_enabled）
deleted                  # 删除状态（推荐使用is_deleted）
active                   # 激活状态（推荐使用is_active）
inactive                 # 非激活状态（推荐使用is_active的反义词）
```

#### 时间字段命名
```sql
-- 标准时间字段（使用_at或_time后缀）
created_at               # 创建时间
updated_at               # 更新时间
deleted_at               # 删除时间（软删除）
login_at                 # 登录时间
logout_at                # 登出时间
approved_at              # 审批时间
rejected_at              # 拒绝时间
published_at             # 发布时间
expired_at               # 过期时间
start_at                 # 开始时间
end_at                   # 结束时间
due_at                   # 截止时间

-- 具体业务时间字段
register_time            # 注册时间
login_time               # 登录时间
last_login_at            # 最后登录时间
payment_time             # 支付时间
upload_time              # 上传时间
download_time            # 下载时间
modify_time              # 修改时间
access_time              # 访问时间
```

#### 数值字段命名
```sql
-- 计数字段
count                    # 数量
total                    # 总数
amount                   # 金额
quantity                 # 数量
number                   # 编号
score                    # 分数
rating                   # 评分
weight                   # 权重
level                    # 等级
order                    # 顺序
rank                     # 排名

-- 具体业务计数字段
login_count              # 登录次数
download_count           # 下载次数
view_count               # 查看次数
like_count               # 点赞次数
comment_count            # 评论次数
share_count              # 分享次数
file_size                # 文件大小
page_size                # 页面大小
max_size                 # 最大尺寸
min_size                 # 最小尺寸

-- 带单位的数值字段
file_size_bytes          # 文件大小（字节）
duration_seconds         # 持续时间（秒）
price_cents              # 价格（分）
bandwidth_mbps           # 带宽（Mbps）
storage_gb               # 存储空间（GB）
```

#### 文本字段命名
```sql
-- 短文本字段（使用VARCHAR）
title                    # 标题
name                     # 名称
label                    # 标签
description              # 描述
content                  # 内容
summary                  # 摘要
keyword                  # 关键词
tag                      # 标签
category                 # 分类
type                     # 类型
status                   # 状态
url                      # 网址
path                     # 路径
code                     # 代码
key                      # 键
value                    # 值
remark                   # 备注
note                     # 笔记

-- 长文本字段（使用TEXT）
content                  # 内容（长文本）
description              # 描述（长文本）
details                  # 详情（长文本）
configuration           # 配置（JSON格式）
metadata                 # 元数据（JSON格式）
settings                # 设置（JSON格式）
parameters              # 参数（JSON格式）
```

### 4. 索引字段命名

#### 主键索引
```sql
-- 自动生成，无需手动命名
-- MySQL会自动创建名为PRIMARY的主键索引
```

#### 唯一索引
```sql
-- 格式：uk_{表名}_{字段名}
-- 说明：唯一索引使用uk_前缀 + 表名 + 字段名

-- 单字段唯一索引
uk_users_username        # 用户表的用户名唯一索引
uk_users_email          # 用户表的邮箱唯一索引
uk_roles_role_code       # 角色表的角色代码唯一索引
uk_configs_config_key    # 配置表的配置键唯一索引

-- 联合唯一索引
uk_user_roles_user_role  # 用户角色表的用户ID和角色ID联合唯一索引
uk_article_tags_article_tag  # 文章标签表的文章ID和标签ID联合唯一索引
uk_resource_categories_resource_category  # 资源分类表的资源ID和分类ID联合唯一索引
```

#### 普通索引
```sql
-- 格式：idx_{表名}_{字段名}
-- 说明：普通索引使用idx_前缀 + 表名 + 字段名

-- 单字段索引
idx_users_status         # 用户表的状态索引
idx_users_created_at     # 用户表的创建时间索引
idx_articles_category_id # 文章表的分类ID索引
idx_orders_user_id       # 订单表的用户ID索引
idx_files_file_size      # 文件表的大小索引

-- 联合索引
idx_users_status_created # 用户表的状态和创建时间联合索引
idx_articles_category_status  # 文章表的分类和状态联合索引
idx_orders_user_status   # 订单表的用户和状态联合索引
idx_files_type_size      # 文件表的类型和大小联合索引
```

#### 前缀索引
```sql
-- 格式：idx_{表名}_{字段名}_prefix
-- 说明：前缀索引使用_prefix后缀

idx_articles_title_prefix      # 文章表标题的前缀索引
idx_content_body_prefix         # 内容表正文的前缀索引
idx_users_email_prefix          # 用户表邮箱的前缀索引
```

---

## 🔗 约束命名规范

### 1. 主键约束
```sql
-- 格式：pk_{表名}
-- 说明：主键约束使用pk_前缀 + 表名

-- 示例
CONSTRAINT pk_users PRIMARY KEY (id)
CONSTRAINT pk_articles PRIMARY KEY (id)
CONSTRAINT pk_user_roles PRIMARY KEY (user_id, role_id)
```

### 2. 外键约束
```sql
-- 格式：fk_{表名}_{字段名}_{引用表名}_{引用字段}
-- 说明：外键约束使用fk_前缀 + 表名_字段名_引用表名_引用字段

-- 单字段外键
CONSTRAINT fk_user_profiles_user_id_users_id
    FOREIGN KEY (user_id) REFERENCES users(id)

CONSTRAINT fk_articles_user_id_users_id
    FOREIGN KEY (user_id) REFERENCES users(id)

CONSTRAINT fk_comments_article_id_articles_id
    FOREIGN KEY (article_id) REFERENCES articles(id)

-- 多字段外键
CONSTRAINT fk_order_items_order_id_orders_id
    FOREIGN KEY (order_id) REFERENCES orders(id)

CONSTRAINT fk_user_roles_user_id_users_id
    FOREIGN KEY (user_id) REFERENCES users(id)
```

### 3. 唯一约束
```sql
-- 格式：uk_{表名}_{字段名}
-- 说明：唯一约束使用uk_前缀 + 表名 + 字段名

-- 单字段唯一约束
CONSTRAINT uk_users_username UNIQUE (username)
CONSTRAINT uk_users_email UNIQUE (email)
CONSTRAINT uk_roles_role_code UNIQUE (role_code)

-- 联合唯一约束
CONSTRAINT uk_user_roles_user_role UNIQUE (user_id, role_id)
CONSTRAINT uk_article_tags_article_tag UNIQUE (article_id, tag_id)
CONSTRAINT uk_resource_categories_resource_category UNIQUE (resource_id, category_id)
```

### 4. 检查约束
```sql
-- 格式：chk_{表名}_{检查内容}
-- 说明：检查约束使用chk_前缀 + 表名 + 检查内容

-- 数值范围检查
CONSTRAINT chk_users_age_range CHECK (age BETWEEN 0 AND 150)
CONSTRAINT chk_orders_amount_positive CHECK (amount > 0)
CONSTRAINT chk_files_size_positive CHECK (file_size >= 0)

-- 枚举值检查
CONSTRAINT chk_users_status_valid CHECK (status IN ('ACTIVE', 'INACTIVE', 'BANNED'))
CONSTRAINT chk_articles_type_valid CHECK (type IN ('NEWS', 'BLOG', 'TUTORIAL'))
CONSTRAINT chk_files_category_valid CHECK (category IN ('IMAGE', 'VIDEO', 'DOCUMENT'))

-- 字符串格式检查
CONSTRAINT chk_users_email_format CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
CONSTRAINT chk_users_phone_format CHECK (phone REGEXP '^1[3-9]\\d{9}$')
CONSTRAINT chk_users_username_length CHECK (CHAR_LENGTH(username) BETWEEN 3 AND 50)
```

---

## 📁 数据库对象命名

### 1. 数据库命名
```sql
-- 格式：{项目名}_{环境}
-- 说明：项目名 + 环境标识

-- 示例
knene_dev                # 开发环境数据库
knene_test               # 测试环境数据库
knene_staging            # 预发布环境数据库
knene_prod               # 生产环境数据库
```

### 2. 视图命名
```sql
-- 格式：v_{功能描述}
-- 说明：视图使用v_前缀 + 功能描述

-- 示例
v_user_profile          # 用户资料视图
v_article_summary       # 文章摘要视图
v_order_statistics      # 订单统计视图
v_daily_report          # 日报视图
v_active_users          # 活跃用户视图
v_popular_resources     # 热门资源视图
```

### 3. 存储过程命名
```sql
-- 格式：sp_{功能描述}
-- 说明：存储过程使用sp_前缀 + 功能描述

-- 示例
sp_create_user          # 创建用户
sp_update_password      # 更新密码
sp_generate_report      # 生成报表
sp_cleanup_logs         # 清理日志
sp_calculate_statistics # 计算统计数据
```

### 4. 函数命名
```sql
-- 格式：fn_{功能描述}
-- 说明：函数使用fn_前缀 + 功能描述

-- 示例
fn_check_username       # 检查用户名
fn_generate_token       # 生成令牌
fn_calculate_age        # 计算年龄
fn_format_file_size     # 格式化文件大小
fn_encrypt_password     # 加密密码
```

### 5. 触发器命名
```sql
-- 格式：tr_{表名}_{操作}_{时机}
-- 说明：触发器使用tr_前缀 + 表名 + 操作 + 时机

-- 示例
tr_users_before_insert      # 用户表插入前触发器
tr_users_after_update       # 用户表更新后触发器
tr_orders_before_delete     # 订单表删除前触发器
tr_operation_logs_after_insert  # 操作日志表插入后触发器
```

---

## 🔍 SQL语句命名规范

### 1. 别名命名
```sql
-- 表别名：使用简短但清晰的别名
-- 字段别名：使用有意义的别名

-- 示例
SELECT
    u.id,
    u.username,
    u.email,
    p.nickname,
    p.avatar_url
FROM users u
LEFT JOIN user_profiles p ON u.id = p.user_id
WHERE u.status = 'ACTIVE'
ORDER BY u.created_at DESC;

-- ✅ 推荐：使用简短但清晰的别名
users AS u
user_profiles AS p
articles AS a
categories AS c
orders AS o
payments AS pay

-- ❌ 不推荐：使用无意义或过长的别名
users AS u1
user_profiles AS up
articles AS article_table
categories AS cat
orders AS order_table
payments AS payment_records
```

### 2. 公共表表达式(CTE)命名
```sql
-- 格式：{描述}_cte
-- 说明：CTE使用描述性名称 + _cte后缀

-- 示例
WITH active_users_cte AS (
    SELECT id, username, created_at
    FROM users
    WHERE status = 'ACTIVE'
    AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
),
user_orders_cte AS (
    SELECT user_id, COUNT(*) as order_count
    FROM orders
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY user_id
)
SELECT
    a.username,
    COALESCE(o.order_count, 0) as order_count
FROM active_users_cte a
LEFT JOIN user_orders_cte o ON a.id = o.user_id
ORDER BY a.created_at DESC;
```

---

## 📋 命名规范检查清单

### 表命名检查
- [ ] **表名格式检查**
  - [ ] 使用小写字母
  - [ ] 使用下划线分隔单词
  - [ ] 使用复数形式
  - [ ] 名称长度合理（不超过64字符）
  - [ ] 避免使用SQL保留字

- [ ] **表名含义检查**
  - [ ] 名称清晰表达表含义
  - [ ] 相关表命名风格一致
  - [ ] 特殊表使用正确前缀（tmp_, his_, log_等）

### 字段命名检查
- [ ] **字段格式检查**
  - [ ] 使用小写字母
  - [ ] 使用下划线分隔单词
  - [ ] 避免使用缩写（除非通用缩写）
  - [ ] 字段名有明确含义

- [ ] **字段类型检查**
  - [ ] 主键字段命名正确
  - [ ] 外键字段命名规范
  - [ ] 布尔字段使用is_/has_前缀
  - [ ] 时间字段使用_at/_time后缀

- [ ] **字段含义检查**
  - [ ] 字段名准确表达含义
  - [ ] 相关字段命名风格一致
  - [ ] 避免歧义性命名
  - [ ] 业务字段命名规范

### 索引命名检查
- [ ] **索引格式检查**
  - [ ] 主键索引自动创建（无需检查）
  - [ ] 唯一索引使用uk_前缀
  - [ ] 普通索引使用idx_前缀
  - [ ] 索引名称包含表名和字段名

- [ ] **索引设计检查**
  - [ ] 避免重复索引
  - [ ] 复合索引字段顺序合理
  - [ ] 索引命名清晰明确
  - [ ] 前缀索引使用正确

### 约束命名检查
- [ ] **约束格式检查**
  - [ ] 主键约束使用pk_前缀
  - [ ] 外键约束使用fk_前缀
  - [ ] 唯一约束使用uk_前缀
  - [ ] 检查约束使用chk_前缀

- [ ] **约束内容检查**
  - [ ] 外键约束包含完整信息
  - [ ] 唯一约束覆盖业务规则
  - [ ] 检查约束验证数据有效性
  - [ ] 约束命名清晰明确

---

## 🔧 命名规范实施建议

### 1. 团队协作
- **统一标准**：团队所有成员遵循相同的命名规范
- **代码审查**：在代码审查中检查命名规范的遵循情况
- **文档同步**：命名规范文档与实际数据库结构保持同步
- **定期培训**：定期对团队进行命名规范培训

### 2. 工具支持
- **IDE插件**：使用支持SQL格式化和命名检查的IDE插件
- **代码生成器**：配置代码生成器遵循团队命名规范
- **数据库工具**：使用支持命名规范的数据库管理工具
- **自动化检查**：建立自动化的命名规范检查机制

### 3. 质量保证
- **设计阶段**：在数据库设计阶段严格遵循命名规范
- **实施阶段**：在实施阶段持续检查命名规范的执行
- **维护阶段**：在维护阶段保持命名规范的一致性
- **优化阶段**：在优化阶段考虑命名规范的影响

---

**文档维护**：命名规范文档随数据库设计演进持续更新
**最后更新**：2024-10-29
**维护人员**：开发团队