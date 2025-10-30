# 数据库索引设计指导原则

## 🗄️ 数据库索引设计指导

本文档详细定义影视资源下载网站数据库索引设计的原则、策略和最佳实践，为所有数据库表的索引设计提供指导，确保查询性能和数据访问效率的最优化。

---

## 🎯 索引设计目标与原则

### 1.1.1 阶段目标
为项目第一阶段建立完整的索引设计指导原则，包括：
- 索引设计基本原则
- 索引类型选择策略
- 索引性能优化方法
- 索引维护和管理策略

### 设计原则

#### 性能优先原则
- **查询优化**：索引设计优先考虑常用查询场景的性能优化
- **写入平衡**：在查询性能和写入性能之间找到最佳平衡点
- **资源节约**：避免过度索引，减少存储空间和维护开销

#### 业务导向原则
- **核心业务优先**：为高频访问的核心业务数据优先建立索引
- **用户体验保障**：确保用户常用操作的响应速度
- **业务扩展支持**：为未来业务扩展预留索引优化空间

#### 可维护性原则
- **命名规范**：统一的索引命名规范，便于管理和维护
- **文档完善**：每个索引都有明确的用途和设计说明
- **监控机制**：建立索引使用情况的监控和分析机制

---

## 🔍 索引类型与选择策略

### 1. 索引类型分析

#### 主键索引 (Primary Index)
```sql
-- 自动创建，无需手动定义
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    -- 其他字段...
);
```

**使用场景：**
- 每个表的唯一标识符
- 聚簇索引的数据组织基础
- 其他表的外键关联目标

**设计要点：**
- 使用自增整数作为主键
- 避免使用业务字段作为主键
- 保持主键的稳定性和简洁性

#### 唯一索引 (Unique Index)
```sql
-- 单字段唯一索引
CREATE UNIQUE INDEX uk_users_username ON users(username);
CREATE UNIQUE INDEX uk_users_email ON users(email);

-- 复合唯一索引
CREATE UNIQUE INDEX uk_user_roles_user_role ON user_roles(user_id, role_id);
CREATE UNIQUE INDEX uk_resource_categories_resource_category ON resource_categories(resource_id, category_id);
```

**使用场景：**
- 业务唯一性约束（用户名、邮箱、订单号等）
- 多对多关系的防重复约束
- 业务规则的数据库层面保证

**设计要点：**
- 基于业务规则确定唯一性字段
- 复合唯一索引的字段顺序要合理
- 考虑查询性能和约束效果

#### 普通索引 (Regular Index)
```sql
-- 单字段索引
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_articles_created_at ON articles(created_at);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- 复合索引
CREATE INDEX idx_users_status_created ON users(status, created_at);
CREATE INDEX idx_articles_category_status ON articles(category_id, status);
CREATE INDEX idx_operation_logs_user_type_time ON operation_logs(user_id, operation_type, created_at);
```

**使用场景：**
- 经常作为查询条件的字段
- 排序操作的字段
- 分组查询的字段
- JOIN操作的关联字段

#### 前缀索引 (Prefix Index)
```sql
-- 长字符串字段的前缀索引
CREATE INDEX idx_articles_title_prefix ON articles(title(50));
CREATE INDEX idx_content_body_prefix ON content(body(100));
CREATE INDEX idx_users_email_prefix ON users(email(20));
```

**使用场景：**
- 长文本字段的搜索优化
- 存储空间有限的场景
- 查询精度要求不高的场景

**设计要点：**
- 选择合适的前缀长度
- 平衡查询精度和存储空间
- 考虑字符集的影响

#### 全文索引 (Full-Text Index)
```sql
-- MySQL 5.6+ 支持全文索引
CREATE FULLTEXT INDEX ft_articles_title_content ON articles(title, content);
CREATE FULLTEXT INDEX ft_resources_description ON resources(description);
```

**使用场景：**
- 文章内容的全文搜索
- 资源描述的关键词搜索
- 需要自然语言搜索的场景

---

## 📊 索引设计策略

### 1. 字段选择策略

#### 必须建立索引的字段
```sql
-- 1. 主键字段（自动创建）
-- 2. 外键字段
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_articles_user_id ON articles(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- 3. 唯一字段
CREATE UNIQUE INDEX uk_users_username ON users(username);
CREATE UNIQUE INDEX uk_users_email ON users(email);
CREATE UNIQUE INDEX uk_orders_order_no ON orders(order_no);

-- 4. 高频查询字段
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_resources_type ON resources(resource_type);

-- 5. 时间字段（经常用于范围查询和排序）
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_articles_publish_date ON articles(publish_date);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

#### 条件性索引字段
```sql
-- 根据业务查询模式决定
-- 1. 状态字段（如果有多种状态的查询）
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_downloads_status ON downloads(status);

-- 2. 分类字段（如果经常按分类查询）
CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_resources_category_id ON resources(category_id);
CREATE INDEX idx_files_category_id ON files(category_id);

-- 3. 排序字段（如果经常需要排序）
CREATE INDEX idx_articles_sort_order ON articles(sort_order);
CREATE INDEX idx_comments_created_at ON comments(created_at);
CREATE INDEX idx_resources_download_count ON resources(download_count);
```

### 2. 复合索引设计策略

#### 字段顺序原则
```sql
-- 1. 高选择性字段在前
CREATE INDEX idx_users_status_created ON users(status, created_at);
-- status字段选择性高，放在前面
-- 查询：WHERE status = 'ACTIVE' AND created_at > '2024-01-01'

-- 2. 覆盖常用查询组合
CREATE INDEX idx_operation_logs_user_type_time ON operation_logs(user_id, operation_type, created_at);
-- 覆盖查询：用户操作记录（用户ID + 操作类型 + 时间范围）

-- 3. 考虑排序字段
CREATE INDEX idx_articles_category_status_publish ON articles(category_id, status, publish_date);
-- 覆盖查询：分类文章列表（分类 + 状态 + 发布时间排序）

-- 4. 最左前缀原则
CREATE INDEX idx_orders_user_status_created ON orders(user_id, status, created_at);
-- 可以支持以下查询：
-- WHERE user_id = ? (✓)
-- WHERE user_id = ? AND status = ? (✓)
-- WHERE user_id = ? AND status = ? AND created_at > ? (✓)
-- WHERE status = ? (✗) - 不符合最左前缀原则
```

#### 复合索引设计示例
```sql
-- 用户相关的复合索引
CREATE INDEX idx_users_status_created ON users(status, created_at);
CREATE INDEX idx_users_type_status ON users(user_type, status);
CREATE INDEX idx_users_last_login ON users(last_login_at DESC);

-- 文章相关的复合索引
CREATE INDEX idx_articles_category_status_publish ON articles(category_id, status, publish_date DESC);
CREATE INDEX idx_articles_author_status ON articles(author_id, status);
CREATE INDEX idx_articles_tags_status ON articles(tag_id, status, created_at DESC);

-- 订单相关的复合索引
CREATE INDEX idx_orders_user_status_created ON orders(user_id, status, created_at DESC);
CREATE INDEX idx_orders_status_amount ON orders(status, amount);
CREATE INDEX idx_orders_payment_status ON orders(payment_method, status);

-- 资源相关的复合索引
CREATE INDEX idx_resources_category_type_status ON resources(category_id, resource_type, status);
CREATE INDEX idx_resources_hotness_created ON resources(hotness_score DESC, created_at DESC);
CREATE INDEX idx_resources_size_type ON resources(file_size, resource_type);
```

### 3. 避免过度索引

#### 重复索引识别
```sql
-- ❌ 错误：重复的索引设计
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_status_created ON users(status, created_at);
-- 第一个索引是多余的，复合索引已经可以覆盖单字段查询

-- ❌ 错误：功能重复的索引
CREATE INDEX idx_articles_title ON articles(title);
CREATE INDEX idx_articles_title_prefix ON articles(title(50));
-- 两个索引功能重复，应该选择一个

-- ✅ 正确：合理的索引设计
CREATE INDEX idx_users_status_created ON users(status, created_at);
-- 这个索引可以支持以下查询：
-- WHERE status = ?                    ✓
-- WHERE status = ? AND created_at > ? ✓
-- ORDER BY status, created_at         ✓
```

#### 索引数量控制
```sql
-- 每张表的索引数量建议控制在5个以内
-- 核心业务表可以适当增加，但也不应超过10个

-- users表索引设计示例
CREATE UNIQUE INDEX uk_users_username ON users(username);           -- 业务唯一
CREATE UNIQUE INDEX uk_users_email ON users(email);                 -- 业务唯一
CREATE INDEX idx_users_status ON users(status);                     -- 状态查询
CREATE INDEX idx_users_created_at ON users(created_at);             -- 时间查询
CREATE INDEX idx_users_last_login ON users(last_login_at DESC);    -- 登录查询
-- 总计5个索引，覆盖主要查询场景
```

---

## ⚡ 索引性能优化

### 1. 查询优化策略

#### 索引覆盖查询
```sql
-- 设计覆盖索引，避免回表操作
CREATE INDEX idx_articles_list ON articles(category_id, status, id, title, created_at);
-- 查询时可以直接从索引获取所有需要的数据
SELECT id, title, created_at
FROM articles
WHERE category_id = ? AND status = 'PUBLISHED'
ORDER BY created_at DESC;

-- 用户查询的覆盖索引
CREATE INDEX idx_users_profile ON users(id, username, avatar_url, status);
SELECT id, username, avatar_url, status
FROM users
WHERE id = ?;
```

#### 排序优化
```sql
-- 利用索引进行排序优化
CREATE INDEX idx_articles_category_publish ON articles(category_id, publish_date DESC);
-- 查询可以直接利用索引的有序性
SELECT * FROM articles
WHERE category_id = ?
ORDER BY publish_date DESC;

-- 复合排序优化
CREATE INDEX idx_products_category_price_rating ON products(category_id, price DESC, rating DESC);
-- 支持多字段排序
SELECT * FROM products
WHERE category_id = ?
ORDER BY price DESC, rating DESC;
```

#### 分页优化
```sql
-- 利用索引优化深分页
CREATE INDEX idx_articles_created ON articles(created_at DESC, id);
-- 使用游标分页代替OFFSET
SELECT * FROM articles
WHERE created_at < ? OR (created_at = ? AND id < ?)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

### 2. 写入性能优化

#### 批量插入优化
```sql
-- 临时禁用索引，提升批量插入性能
ALTER TABLE users DISABLE KEYS;
-- 执行批量插入
INSERT INTO users (...) VALUES (...), (...), (...);
-- 重新启用索引
ALTER TABLE users ENABLE KEYS;

-- 使用LOAD DATA INFILE批量导入
LOAD DATA INFILE '/path/to/users.csv'
INTO TABLE users
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n';
```

#### 索引维护策略
```sql
-- 定期分析索引使用情况
ANALYZE TABLE users;
ANALYZE TABLE articles;
ANALYZE TABLE orders;

-- 重建碎片化的索引
ALTER TABLE users ENGINE=InnoDB;
OPTIMIZE TABLE users;

-- 删除未使用的索引
-- 需要通过监控工具分析后确定
DROP INDEX idx_unused_index ON table_name;
```

### 3. 存储空间优化

#### 前缀索引优化
```sql
-- 合理选择前缀长度
-- 通过计算选择最优前缀长度
SELECT
    COUNT(DISTINCT LEFT(title, 10)) / COUNT(DISTINCT title) AS prefix_10_selectivity,
    COUNT(DISTINCT LEFT(title, 20)) / COUNT(DISTINCT title) AS prefix_20_selectivity,
    COUNT(DISTINCT LEFT(title, 50)) / COUNT(DISTINCT title) AS prefix_50_selectivity
FROM articles;

-- 根据选择性创建前缀索引
CREATE INDEX idx_articles_title_prefix ON articles(title(20));
```

#### 索引压缩（MySQL 8.0+）
```sql
-- 使用压缩索引减少存储空间
CREATE INDEX idx_large_text_compressed ON large_table(large_text_column) USING BTREE;
-- MySQL 8.0+支持索引压缩
ALTER TABLE large_table ALGORITHM=INPLACE, LOCK=NONE;
```

---

## 🔧 索引监控与分析

### 1. 索引使用情况监控

#### 查询索引使用统计
```sql
-- MySQL 8.0+ 查看索引使用情况
SELECT
    TABLE_SCHEMA,
    TABLE_NAME,
    INDEX_NAME,
    COUNT_FETCH,
    COUNT_INSERT,
    COUNT_UPDATE,
    COUNT_DELETE
FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE INDEX_NAME IS NOT NULL
ORDER BY COUNT_FETCH DESC;

-- 查看未使用的索引
SELECT
    TABLE_SCHEMA,
    TABLE_NAME,
    INDEX_NAME,
    SEQ_IN_INDEX,
    COLUMN_NAME
FROM information_schema.STATISTICS s
LEFT JOIN performance_schema.table_io_waits_summary_by_index_usage i
    ON s.TABLE_SCHEMA = i.OBJECT_SCHEMA
    AND s.TABLE_NAME = i.OBJECT_NAME
    AND s.INDEX_NAME = i.INDEX_NAME
WHERE i.INDEX_NAME IS NULL
AND s.TABLE_SCHEMA NOT IN ('mysql', 'performance_schema', 'information_schema');
```

#### 慢查询分析
```sql
-- 开启慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2; -- 2秒以上的查询记录为慢查询

-- 查看慢查询
SELECT * FROM mysql.slow_log
WHERE start_time > DATE_SUB(NOW(), INTERVAL 1 DAY)
ORDER BY query_time DESC;

-- 分析慢查询的执行计划
EXPLAIN FORMAT=JSON
SELECT * FROM articles
WHERE category_id = 1 AND status = 'PUBLISHED'
ORDER BY created_at DESC
LIMIT 20;
```

### 2. 索引性能分析

#### 执行计划分析
```sql
-- 查看查询执行计划
EXPLAIN
SELECT * FROM users
WHERE status = 'ACTIVE' AND created_at > '2024-01-01'
ORDER BY last_login_at DESC;

-- 分析执行结果关注点：
-- type: ALL (全表扫描), index (索引扫描), range (范围扫描), ref (索引查找)
-- key: 实际使用的索引
-- rows: 预估扫描的行数
-- Extra: Using index (索引覆盖), Using filesort (需要额外排序), Using temporary (使用临时表)
```

#### 索引选择性分析
```sql
-- 计算字段的选择性（越接近1越好）
SELECT
    COUNT(DISTINCT status) / COUNT(*) AS status_selectivity,
    COUNT(DISTINCT user_type) / COUNT(*) AS user_type_selectivity,
    COUNT(DISTINCT created_at) / COUNT(*) AS created_at_selectivity
FROM users;

-- 分析复合索引的选择性
SELECT
    COUNT(DISTINCT status) / COUNT(*) AS status_selectivity,
    COUNT(DISTINCT CONCAT(status, '_', created_at)) / COUNT(*) AS composite_selectivity
FROM users;
```

### 3. 索引优化建议

#### 基于监控的优化
```sql
-- 定期检查索引碎片
SELECT
    TABLE_NAME,
    INDEX_NAME,
    CARDINALITY,
    SUB_PART,
    NULLABLE,
    INDEX_TYPE
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
ORDER BY TABLE_NAME, SEQ_IN_INDEX;

-- 检查表大小和索引大小
SELECT
    TABLE_NAME,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'Table Size (MB)',
    ROUND((INDEX_LENGTH / 1024 / 1024), 2) AS 'Index Size (MB)',
    ROUND((INDEX_LENGTH / (DATA_LENGTH + INDEX_LENGTH)) * 100, 2) AS 'Index Ratio %'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;
```

---

## 📋 索引设计检查清单

### 设计阶段检查
- [ ] **业务需求分析**
  - [ ] 识别核心查询场景
  - [ ] 分析高频访问路径
  - [ ] 确定性能关键路径

- [ ] **字段选择合理性**
  - [ ] 主键字段选择合适
  - [ ] 外键字段建立索引
  - [ ] 唯一性字段建立唯一索引
  - [ ] 高频查询字段建立索引

- [ ] **索引类型选择**
  - [ ] 根据业务场景选择合适索引类型
  - [ ] 避免不必要的全文索引
  - [ ] 合理使用前缀索引

### 实现阶段检查
- [ ] **索引命名规范**
  - [ ] 唯一索引使用uk_前缀
  - [ ] 普通索引使用idx_前缀
  - [ ] 索引名称包含表名和字段名

- [ ] **复合索引设计**
  - [ ] 字段顺序符合最左前缀原则
  - [ ] 高选择性字段在前
  - [ ] 覆盖主要查询场景

- [ ] **避免过度索引**
  - [ ] 没有重复功能的索引
  - [ ] 索引数量控制在合理范围
  - [ ] 定期清理未使用索引

### 优化阶段检查
- [ ] **性能监控**
  - [ ] 建立索引使用情况监控
  - [ ] 定期分析慢查询日志
  - [ ] 监控索引碎片情况

- [ ] **持续优化**
  - [ ] 根据实际使用情况调整索引
  - [ ] 优化复合索引字段顺序
  - [ ] 及时删除无用索引

### 维护阶段检查
- [ ] **文档维护**
  - [ ] 索引设计文档及时更新
  - [ ] 记录索引变更原因
  - [ ] 维护索引使用统计

- [ ] **定期评估**
  - [ ] 每月评估索引效果
  - [ ] 分析业务变化对索引的影响
  - [ ] 制定索引优化计划

---

## 🛠️ 索引设计工具与技巧

### 1. 索引分析工具

#### MySQL内置工具
```sql
-- SHOW INDEX 查看索引信息
SHOW INDEX FROM users;

-- EXPLAIN 分析查询执行计划
EXPLAIN SELECT * FROM users WHERE status = 'ACTIVE';

-- PROCEDURE ANALYSE 分析表结构
SELECT * FROM users PROCEDURE ANALYSE();

-- INFORMATION_SCHEMA 获取索引统计
SELECT * FROM information_schema.STATISTICS WHERE TABLE_NAME = 'users';
```

#### 第三方工具
- **pt-index-usage** (Percona Toolkit): 分析索引使用情况
- **MySQL Enterprise Monitor**: 官方监控工具
- **Prometheus + Grafana**: 开源监控方案
- **JetBrains DataGrip**: IDE内置的索引分析工具

### 2. 索引设计技巧

#### 基于查询模式设计
```sql
-- 分析查询模式，设计对应索引
-- 常见查询1: 用户登录
SELECT * FROM users WHERE username = ? AND password_hash = ?;
-- 对应索引: UNIQUE INDEX uk_users_username ON users(username);

-- 常见查询2: 获取用户文章列表
SELECT * FROM articles WHERE user_id = ? AND status = 'PUBLISHED' ORDER BY created_at DESC;
-- 对应索引: INDEX idx_articles_user_status_created ON articles(user_id, status, created_at DESC);

-- 常见查询3: 搜索文章
SELECT * FROM articles WHERE title LIKE ? AND status = 'PUBLISHED';
-- 对应索引: INDEX idx_articles_title_status ON articles(title, status);
```

#### 基于数据特征设计
```sql
-- 根据数据分布特征设计索引
-- 高基数字段适合放在复合索引前面
SELECT
    COUNT(DISTINCT status) AS status_count,
    COUNT(DISTINCT user_id) AS user_id_count,
    COUNT(DISTINCT created_at) AS created_at_count
FROM articles;

-- 根据选择性调整索引顺序
-- 如果user_id选择性更高，应该放在前面
CREATE INDEX idx_articles_user_status ON articles(user_id, status);
```

---

**文档维护**：索引设计指导文档随数据库设计和业务发展持续更新
**最后更新**：2025-10-30
**维护人员**：相笑与春风