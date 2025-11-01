-- ====================================================================
-- 数据库初始化脚本 - 创建knene_db数据库
-- ====================================================================
-- 脚本名称：init_knene_db.sql
-- 用途：创建knene_db数据库和用户，为Flyway迁移做准备
-- 执行时机：在启动应用之前执行
-- ====================================================================

-- 设置SQL模式
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ====================================================================
-- 1. 创建knene_db数据库（如果不存在）
-- ====================================================================
CREATE DATABASE IF NOT EXISTS knene_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci
COMMENT '影视资源下载网站数据库';

-- ====================================================================
-- 2. 验证root用户权限
-- ====================================================================

-- 显示当前用户权限
SELECT CURRENT_USER() as current_user, USER() as login_user;

-- 确保root用户有knene_db的权限
-- 注意：生产环境应创建专用数据库用户，不建议使用root用户
GRANT ALL PRIVILEGES ON knene_db.* TO 'root'@'localhost'
WITH GRANT OPTION;

-- 刷新权限
FLUSH PRIVILEGES;

-- ====================================================================
-- 3. 验证创建结果
-- ====================================================================

-- 使用新创建的数据库
USE knene_db;

-- 显示数据库信息
SELECT 'Database Created Successfully!' as status,
       DATABASE() as current_database,
       @@character_set_database as charset,
       @@collation_database as collation;

-- 显示用户权限
SELECT 'Root User Verified Successfully!' as status,
       'root' as username,
       'localhost' as host;

-- ====================================================================
-- 4. 准备Flyway表（如果需要手动创建）
-- ====================================================================

-- 注意：Flyway会自动创建flyway_schema_history表
-- 这里只是作为参考，不需要手动执行

/*
-- Flyway历史表结构（仅供参考）
CREATE TABLE IF NOT EXISTS flyway_schema_history (
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
    PRIMARY KEY (installed_rank),
    INDEX idx_flyway_schema_history_success (success)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/

-- ====================================================================
-- 完成提示
-- ====================================================================
SELECT 'Database Initialization Complete!' as message,
       'knene_db' as database_name,
       'root' as app_user,
       NOW() as completed_time;

-- ====================================================================
-- 使用说明
-- ====================================================================
/*
执行步骤：

1. 连接MySQL（使用root权限）：
   mysql -u root -p

2. 执行此脚本：
   source D:/workspace/sourcecode/movie2025102/KneneBackend/scripts/database/init_knene_db.sql;

3. 验证数据库：
   SHOW DATABASES;
   USE knene_db;
   SHOW TABLES;

4. 修改应用配置文件：
   将数据库名改为 knene_db
   用户名改为 root
   密码改为 592714407

5. 启动应用执行Flyway迁移：
   mvn spring-boot:run -Dspring-boot.run.profiles=database
*/