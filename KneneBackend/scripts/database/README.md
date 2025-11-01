# 数据库初始化指南

## 📋 概述

本文档说明如何初始化影视资源下载网站的数据库，包括创建数据库、用户配置和执行Flyway迁移脚本。

## 🎯 前置条件

### 环境要求
- MySQL 8.0 或更高版本
- Java 21 或更高版本
- Maven 3.8 或更高版本

### 权限要求
- MySQL管理员权限（创建数据库和用户）
- 数据库连接权限

---

## 🚀 快速开始

### 第一步：准备MySQL数据库

1. **启动MySQL服务**
```bash
# Windows
net start mysql

# macOS/Linux
sudo systemctl start mysql
# 或
brew services start mysql
```

2. **连接MySQL**
```bash
mysql -u root -p
```

3. **执行初始化脚本**
```sql
-- 在MySQL命令行中执行
source D:/workspace/sourcecode/movie2025102/KneneBackend/scripts/database/setup_database.sql;
```

### 第二步：配置应用连接

1. **修改应用配置**
编辑 `src/main/resources/application-database.yml`：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/knene_db?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: knene_app
    password: knene_app_2025
```

2. **验证配置**
```bash
# 测试数据库连接
mvn spring-boot:run -Dspring-boot.run.profiles=database
```

### 第三步：执行Flyway迁移

1. **启动应用执行迁移**
```bash
# 使用database profile启动应用
mvn spring-boot:run -Dspring-boot.run.profiles=database

# 或者在IDE中启动时设置VM选项：
# -Dspring.profiles.active=database
```

2. **验证迁移结果**
```sql
-- 连接数据库验证表是否创建成功
USE knene_db;
SHOW TABLES;
```

---

## 📊 迁移脚本说明

### V1.1.1__Create_user_permission_core_tables.sql
**功能**：创建用户权限核心表
- users - 用户基础信息表
- user_profiles - 用户扩展信息表
- roles - 角色定义表
- permissions - 权限定义表

**特点**：
- 严格遵循数据库设计规范
- 完整的约束和索引设计
- 支持软删除和审计功能
- 高性能索引策略

### V1.1.2__Insert_user_permission_core_data.sql
**功能**：插入基础数据
- 5个系统角色（超级管理员、管理员、VIP用户、普通用户、游客）
- 51个系统权限（涵盖所有核心功能）
- 1个默认管理员账户

**默认账户信息**：
- 用户名：admin
- 密码：admin123
- 邮箱：admin@knene.com

---

## 🔍 验证步骤

### 1. 验证表结构
```sql
-- 查看所有表
SHOW TABLES;

-- 查看表结构
DESC users;
DESC user_profiles;
DESC roles;
DESC permissions;
```

### 2. 验证基础数据
```sql
-- 查看角色数据
SELECT * FROM roles;

-- 查看权限数据
SELECT * FROM permissions LIMIT 10;

-- 查看管理员账户
SELECT id, username, email, status FROM users WHERE username = 'admin';
```

### 3. 验证Flyway历史
```sql
-- 查看迁移历史
SELECT * FROM flyway_schema_history;
```

---

## 🛠️ 故障排除

### 常见问题

#### 1. 连接失败
**问题**：无法连接到数据库
**解决方案**：
```bash
# 检查MySQL服务状态
net start mysql

# 检查端口占用
netstat -an | findstr 3306

# 验证用户权限
mysql -u knene_app -p knene_db
```

#### 2. 迁移失败
**问题**：Flyway迁移执行失败
**解决方案**：
```sql
-- 查看Flyway历史表
SELECT * FROM flyway_schema_history;

-- 手动标记迁移为成功（谨慎使用）
INSERT INTO flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success)
VALUES (1, '1.1.1', 'Create user permission core tables', 'SQL', 'V1.1.1__Create_user_permission_core_tables.sql', 1234567890, 'knene_app', NOW(), 1000, TRUE);
```

#### 3. 权限问题
**问题**：用户权限不足
**解决方案**：
```sql
-- 重新授权
GRANT ALL PRIVILEGES ON knene_db.* TO 'knene_app'@'localhost';
FLUSH PRIVILEGES;
```

#### 4. 字符集问题
**问题**：中文字符乱码
**解决方案**：
```sql
-- 检查数据库字符集
SHOW VARIABLES LIKE 'character_set_%';

-- 修改连接URL
jdbc:mysql://localhost:3306/knene_db?useUnicode=true&characterEncoding=utf8mb4
```

---

## 🔄 开发环境配置

### 开发环境配置文件
创建 `application-dev.yml`：
```yaml
spring:
  profiles:
    active: dev
  datasource:
    url: jdbc:mysql://localhost:3306/knene_db?useUnicode=true&characterEncoding=utf8mb4&serverTimezone=Asia/Shanghai
    username: knene_app
    password: knene_app_2025
  flyway:
    enabled: true
    locations: classpath:db/migration
```

### IDE配置
在IDE中设置环境变量：
```
SPRING_PROFILES_ACTIVE=database
```

---

## 📝 生产环境注意事项

### 安全配置
1. **修改默认密码**
```sql
-- 修改应用用户密码
ALTER USER 'knene_app'@'localhost' IDENTIFIED BY 'your_secure_password';
```

2. **限制数据库访问**
```sql
-- 只允许特定IP访问
CREATE USER 'knene_app'@'192.168.1.%' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON knene_db.* TO 'knene_app'@'192.168.1.%';
```

### 性能优化
1. **调整连接池配置**
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 50
      minimum-idle: 10
```

2. **优化MySQL配置**
```ini
# my.cnf 配置
[mysqld]
innodb_buffer_pool_size = 1G
max_connections = 200
query_cache_size = 64M
```

---

## 📚 相关文档

- [数据库设计规范](../../../doc/database/schema/schema_design_standards.md)
- [数据库命名规范](../../../doc/database/naming_conventions.md)
- [数据完整性规则](../../../doc/database/data_integrity_rules.md)
- [索引设计指导原则](../../../doc/database/index/index_design_guidelines.md)
- [Flyway迁移指南](../../../doc/database/migration/flyway_migration_guide.md)
- [用户权限核心表设计](../../../doc/database/schema/user_permission_core_tables.md)

---

## 🆘 技术支持

如果遇到问题，请：
1. 查看应用日志：`logs/application.log`
2. 检查MySQL错误日志
3. 参考相关文档
4. 联系数据库团队

---

*最后更新：2025-10-30*