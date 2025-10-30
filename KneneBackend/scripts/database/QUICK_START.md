# 🚀 数据库快速启动指南

## 🎯 重要说明
**必须先创建数据库，再执行Flyway迁移！**

## 📋 执行步骤

### 第1步：启动MySQL服务
```bash
# Windows
net start mysql

# 检查MySQL是否运行
netstat -an | findstr 3306
```

### 第2步：创建knene_db数据库
```bash
# 连接MySQL（使用root权限）
mysql -u root -p

# 在MySQL命令行中执行数据库初始化脚本
source D:/workspace/sourcecode/movie2025102/KneneBackend/scripts/database/init_knene_db.sql;
```

**或者直接执行：**
```bash
mysql -u root -p592714407 < D:/workspace/sourcecode/movie2025102/KneneBackend/scripts/database/init_knene_db.sql
```

### 第3步：验证数据库创建
```sql
-- 查看数据库
SHOW DATABASES;

-- 使用knene_db数据库
USE knene_db;

-- 查看用户权限
SHOW GRANTS FOR 'knene_user'@'localhost';
```

### 第4步：启动Spring Boot应用
```bash
# 进入项目目录
cd D:/workspace/sourcecode/movie2025102/KneneBackend

# 启动应用（使用database profile）
mvn spring-boot:run -Dspring-boot.run.profiles=database

# 或者在IDE中设置环境变量：SPRING_PROFILES_ACTIVE=database
```

### 第5步：验证迁移结果
```sql
-- 连接knene_db数据库
mysql -u root -p592714407 knene_db

-- 查看创建的表
SHOW TABLES;

-- 查看管理员账户
SELECT id, username, email, status, created_at FROM users WHERE username = 'admin';

-- 查看Flyway迁移历史
SELECT * FROM flyway_schema_history;
```

## 🎯 预期结果

### 数据库信息
- **数据库名称**：knene_db
- **用户名**：root
- **密码**：592714407
- **字符集**：utf8mb4

### 创建的表
- users - 用户基础信息表
- user_profiles - 用户扩展信息表
- roles - 角色定义表
- permissions - 权限定义表
- flyway_schema_history - Flyway迁移历史表

### Druid监控面板
- **访问地址**：http://localhost:8080/api/druid/
- **用户名**：admin
- **密码**：admin
- **功能**：查看SQL监控、连接池状态、慢SQL分析等

### 默认账户
- **用户名**：admin
- **密码**：admin123
- **邮箱**：admin@knene.com

## 🔧 配置详情

### 数据库连接配置
```yaml
spring:
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    url: jdbc:mysql://localhost:3306/knene_db?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: 592714407
    druid:
      initial-size: 5
      min-idle: 5
      max-active: 20
      max-wait: 60000
      validation-query: SELECT 1
      test-while-idle: true
```

### Flyway配置
```yaml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
```

## ⚠️ 常见问题

### 1. 数据库连接失败
**问题**：Access denied for user 'root'@'localhost'
**解决**：
```sql
-- 重新授权
GRANT ALL PRIVILEGES ON knene_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Flyway迁移失败
**问题**：Table 'knene_db.flyway_schema_history' doesn't exist
**解决**：
```sql
-- 手动创建Flyway表（一般不需要）
USE knene_db;
CREATE TABLE flyway_schema_history (
    installed_rank INT NOT NULL,
    version VARCHAR(50),
    description VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL,
    script VARCHAR(1000) NOT NULL,
    checksum INT,
    installed_by VARCHAR(100) NOT NULL,
    installed_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    execution_time INT NOT NULL,
    success BOOLEAN NOT NULL,
    PRIMARY KEY (installed_rank)
);
```

### 3. 表已存在错误
**问题**：Table 'users' already exists
**解决**：
```sql
-- 删除已存在的表（谨慎操作！）
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS permissions;
```

## 📚 完整文档
- [数据库设计规范](../../../doc/database/schema/schema_design_standards.md)
- [用户权限核心表设计](../../../doc/database/schema/user_permission_core_tables.md)
- [数据库初始化指南](README.md)

---

**记住：先执行init_knene_db.sql创建数据库，再启动应用执行Flyway迁移！** 🎯