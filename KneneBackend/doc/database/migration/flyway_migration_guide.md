# Flyway版本管理指南

## 📈 Flyway数据库版本管理指南

本文档详细定义影视资源下载网站项目的数据库版本管理策略，使用Flyway工具进行数据库迁移管理，确保数据库结构变更的可追溯性、可重复性和团队协作效率。

---

## 🎯 Flyway版本管理目标与原则

### 1.1.1 阶段目标
为项目第一阶段建立完整的数据库版本管理体系，包括：
- Flyway配置和集成
- 版本命名规范
- 迁移脚本编写规范
- 回滚策略制定

### 版本管理原则

#### 版本可追溯性原则
- **版本递增**：版本号必须严格递增，不能跳跃
- **变更记录**：每个版本都有明确的变更描述
- **执行日志**：完整记录每次迁移的执行情况
- **作者追踪**：明确记录变更的作者和时间

#### 环境一致性原则
- **多环境支持**：支持开发、测试、生产环境的版本管理
- **重复执行**：相同版本在不同环境可以重复执行
- **状态同步**：保持各环境的数据库结构同步
- **数据保护**：生产环境数据变更的额外保护

#### 团队协作原则
- **分支管理**：支持多分支开发的数据库版本管理
- **冲突解决**：提供版本冲突的解决方案
- **代码审查**：迁移脚本需要经过代码审查
- **自动化集成**：与CI/CD流程无缝集成

---

## ⚙️ Flyway配置与集成

### 1. Maven依赖配置

#### 核心依赖
```xml
<!-- Flyway核心依赖 -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
    <version>9.22.3</version>
</dependency>

<!-- Flyway MySQL支持 -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId>
    <version>9.22.3</version>
</dependency>

<!-- Spring Boot Flyway自动配置 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-flyway</artifactId>
</dependency>
```

#### Maven插件配置
```xml
<build>
    <plugins>
        <!-- Flyway Maven插件 -->
        <plugin>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-maven-plugin</artifactId>
            <version>9.22.3</version>
            <configuration>
                <!-- 数据库配置 -->
                <url>jdbc:mysql://localhost:3306/knene_dev</url>
                <user>root</user>
                <password>password</password>

                <!-- Flyway配置 -->
                <locations>
                    <location>classpath:db/migration</location>
                </locations>
                <baselineOnMigrate>true</baselineOnMigrate>
                <baselineVersion>1.0.0</baselineVersion>
                <validateOnMigrate>true</validateOnMigrate>
                <cleanDisabled>false</cleanDisabled>

                <!-- 表配置 -->
                <table>flyway_schema_history</table>
                <placeholders>
                    <placeholder.database.prefix>knene_</placeholder.database.prefix>
                </placeholders>
            </configuration>
        </plugin>
    </plugins>
</build>
```

### 2. Spring Boot配置

#### application.yml配置
```yaml
# Flyway配置
spring:
  flyway:
    # 是否启用Flyway
    enabled: true

    # 迁移脚本位置
    locations:
      - classpath:db/migration

    # 数据库配置
    url: jdbc:mysql://localhost:3306/knene_dev?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    user: root
    password: password

    # Flyway表配置
    table: flyway_schema_history
    baseline-on-migrate: true
    baseline-version: 1.0.0

    # 验证配置
    validate-on-migrate: true
    clean-disabled: false

    # 占位符配置
    placeholders:
      database.prefix: knene_
      env: dev

    # 执行配置
    out-of-order: false
    ignore-future-migrations: false

    # 调试配置
    clean-disabled: false
    validate-on-migrate: true

    # 批处理配置
    batch: true

    # 环境特定配置
  profiles:
    dev:
      flyway:
        locations: classpath:db/migration/dev
    test:
      flyway:
        locations: classpath:db/migration/test
        clean-disabled: false
    prod:
      flyway:
        locations: classpath:db/migration/prod
        clean-disabled: true
        validate-on-migrate: true
        ignore-future-migrations: false
```

#### Flyway配置类
```java
@Configuration
@EnableConfigurationProperties(FlywayProperties.class)
public class FlywayConfig {

    @Bean
    @ConfigurationProperties(prefix = "spring.flyway")
    public Flyway flyway(DataSource dataSource) {
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .baselineOnMigrate(true)
                .baselineVersion("1.0.0")
                .validateOnMigrate(true)
                .cleanDisabled(false)
                .table("flyway_schema_history")
                .placeholders(Map.of(
                        "database.prefix", "knene_",
                        "env", "dev"
                ))
                .load();

        return flyway;
    }

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy(Flyway flyway) {
        return new FlywayMigrationStrategy() {
            @Override
            public void migrate(Flyway flyway) {
                try {
                    // 执行迁移前的验证
                    validateBeforeMigrate();

                    // 执行迁移
                    flyway.migrate();

                    // 执行迁移后的验证
                    validateAfterMigrate();

                } catch (Exception e) {
                    // 迁移失败处理
                    handleMigrationFailure(e);
                    throw e;
                }
            }

            private void validateBeforeMigrate() {
                // 迁移前验证逻辑
                log.info("开始执行数据库迁移前验证...");
            }

            private void validateAfterMigrate() {
                // 迁移后验证逻辑
                log.info("数据库迁移完成，开始执行后验证...");
            }

            private void handleMigrationFailure(Exception e) {
                // 迁移失败处理逻辑
                log.error("数据库迁移失败: {}", e.getMessage(), e);
            }
        };
    }
}
```

---

## 📝 版本命名规范

### 1. 版本号格式

#### 基本格式规范
```
格式：V{主版本}.{次版本}.{修订号}__{描述}.sql

示例：
V1.1.1__Create_core_tables.sql
V1.1.2__Insert_core_data.sql
V1.2.1__Create_auth_tables.sql
V1.2.2__Insert_auth_data.sql
V1.3.1__Create_vip_tables.sql
V1.3.2__Insert_vip_data.sql
```

#### 版本号说明
- **主版本**：重大架构变更，通常不兼容的更新
- **次版本**：新功能添加，保持向后兼容
- **修订号**：Bug修复和小改进
- **描述**：简要描述本次变更的内容，使用下划线分隔单词

#### 版本号递增规则
```sql
-- ✅ 正确的版本递增
V1.1.1 → V1.1.2 → V1.1.3 → V1.2.0 → V1.2.1 → V2.0.0

-- ❌ 错误的版本跳跃
V1.1.1 → V1.1.3（跳跃了V1.1.2）
V1.1.2 → V2.0.0（直接跳到主版本）

-- ✅ 合理的功能版本递增
V1.1.1__Create_core_tables.sql
V1.1.2__Create_indexes.sql
V1.1.3__Insert_sample_data.sql
V1.2.0__Add_user_authentication.sql（新功能版本）
```

### 2. 文件命名示例

#### 核心功能版本
```sql
-- 数据库基础架构
V1.1.1__Create_core_tables.sql
V1.1.2__Create_core_indexes.sql
V1.1.3__Insert_core_data.sql
V1.1.4__Create_core_constraints.sql

-- 用户认证功能
V1.2.1__Create_user_auth_tables.sql
V1.2.2__Create_user_auth_indexes.sql
V1.2.3__Insert_user_auth_data.sql

-- VIP功能
V1.3.1__Create_vip_tables.sql
V1.3.2__Create_vip_indexes.sql
V1.3.3__Insert_vip_data.sql

-- 资源管理功能
V1.4.1__Create_resource_tables.sql
V1.4.2__Create_resource_indexes.sql
V1.4.3__Insert_resource_data.sql
```

#### 修复和优化版本
```sql
-- Bug修复版本
V1.1.5__Fix_user_table_constraints.sql
V1.2.4__Fix_auth_token_validation.sql

-- 性能优化版本
V1.3.4__Optimize_resource_queries.sql
V1.4.5__Add_missing_indexes.sql

-- 数据迁移版本
V1.5.1__Migrate_user_data_structure.sql
V1.5.2__Update_resource_categorization.sql
```

### 3. 回滚脚本命名

#### 回滚脚本格式
```
格式：R{版本号}__{描述}.sql

示例：
R1.1.1__Drop_core_tables.sql
R1.2.1__Drop_user_auth_tables.sql
R1.3.1__Drop_vip_tables.sql
```

#### 回滚脚本示例
```sql
-- R1.1.1__Drop_core_tables.sql
-- 警告：此操作将删除所有核心表数据，请谨慎执行

-- 删除外键约束
ALTER TABLE user_profiles DROP FOREIGN KEY IF EXISTS fk_user_profiles_user_id_users_id;
ALTER TABLE articles DROP FOREIGN KEY IF EXISTS fk_articles_author_id_users_id;

-- 删除表
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS permissions;
```

---

## 🔧 迁移脚本编写规范

### 1. 脚本结构规范

#### 基本脚本结构
```sql
-- =====================================================
-- 版本：V1.1.1
-- 描述：创建核心基础表
-- 作者：开发团队
-- 创建时间：2024-10-30
-- 环境：ALL
-- =====================================================

-- 设置SQL模式
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';

-- 开始事务
START TRANSACTION;

-- 创建用户表
CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名',
    `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
    `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希',
    `status` ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE' COMMENT '用户状态',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    -- 索引
    INDEX `idx_users_username` (`username`),
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_status` (`status`),
    INDEX `idx_users_created_at` (`created_at`),

    -- 唯一约束
    CONSTRAINT `uk_users_username` UNIQUE (`username`),
    CONSTRAINT `uk_users_email` UNIQUE (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户基础信息表';

-- 提交事务
COMMIT;

-- 验证脚本执行结果
SELECT 'V1.1.1: users表创建成功' as result;
```

#### 数据插入脚本结构
```sql
-- =====================================================
-- 版本：V1.1.2
-- 描述：插入核心基础数据
-- 作者：开发团队
-- 创建时间：2024-10-30
-- 环境：ALL
-- =====================================================

-- 开始事务
START TRANSACTION;

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
('资源下载', 'RESOURCE_DOWNLOAD', 'RESOURCE', 'DOWNLOAD', '下载资源文件'),
('资源上传', 'RESOURCE_UPLOAD', 'RESOURCE', 'UPLOAD', '上传资源文件');

-- 插入系统配置
INSERT INTO `${database.prefix}system_configs` (`config_key`, `config_value`, `config_type`, `description`, `is_public`) VALUES
('site.name', '影视资源下载网站', 'STRING', '网站名称', 1),
('site.description', '提供高质量影视资源下载服务', 'STRING', '网站描述', 1),
('user.default_avatar', '/static/images/default-avatar.png', 'STRING', '用户默认头像', 1),
('upload.max_file_size', '104857600', 'NUMBER', '最大文件上传大小（字节）', 0),
('security.password_min_length', '6', 'NUMBER', '密码最小长度', 0);

-- 提交事务
COMMIT;

-- 验证插入结果
SELECT
    COUNT(*) as role_count
FROM roles
WHERE is_system = 1;

SELECT
    COUNT(*) as permission_count
FROM permissions;

SELECT
    COUNT(*) as config_count
FROM `${database.prefix}system_configs`;
```

### 2. 脚本编写最佳实践

#### 使用占位符
```sql
-- 使用环境相关的占位符
CREATE TABLE `${database.prefix}users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名',
    `environment` VARCHAR(20) DEFAULT '${env}' COMMENT '环境标识'
);

-- 在配置文件中定义占位符
spring:
  flyway:
    placeholders:
      database.prefix: knene_
      env: dev
```

#### 条件执行
```sql
-- 根据数据库版本执行不同逻辑
-- MySQL 8.0+ 支持的功能
-- SET @mysql_version = SELECT VERSION();
-- SET @major_version = SUBSTRING_INDEX(@mysql_version, '.', 1);

-- IF @major_version >= 8 THEN
--     -- MySQL 8.0+ 特有功能
--     CREATE INDEX idx_users_email_function ((LOWER(email)));
-- ELSE
--     -- MySQL 5.7 兼容方案
--     CREATE INDEX idx_users_email ON users(email);
-- END IF;

-- 检查表是否存在再创建
SET @dbname = DATABASE();
SET @tablename = '${database.prefix}users';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
  ) > 0,
  'SELECT 1',
  CONCAT('CREATE TABLE `${database.prefix}users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4')
));

PREPARE createIfNotExists FROM @preparedStatement;
EXECUTE createIfNotExists;
DEALLOCATE PREPARE createIfNotExists;
```

#### 错误处理
```sql
-- 使用存储过程进行错误处理
DELIMITER $$
CREATE PROCEDURE sp_safe_migration()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- 执行迁移逻辑
    CREATE TABLE IF NOT EXISTS `${database.prefix}users` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `username` VARCHAR(50) NOT NULL UNIQUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    COMMIT;
END$$
DELIMITER ;

-- 执行安全迁移
CALL sp_safe_migration();
DROP PROCEDURE sp_safe_migration;
```

### 3. 数据迁移脚本

#### 结构变更迁移
```sql
-- V1.5.1__Add_user_profile_fields.sql
-- 添加用户资料字段

START TRANSACTION;

-- 添加新字段
ALTER TABLE `${database.prefix}users`
ADD COLUMN `nickname` VARCHAR(50) COMMENT '昵称' AFTER `email`,
ADD COLUMN `avatar_url` VARCHAR(500) COMMENT '头像URL' AFTER `nickname`,
ADD COLUMN `phone` VARCHAR(20) COMMENT '手机号' AFTER `avatar_url`;

-- 添加索引
ALTER TABLE `${database.prefix}users`
ADD INDEX `idx_users_phone` (`phone`);

-- 设置默认值
UPDATE `${database.prefix}users`
SET `nickname` = `username`
WHERE `nickname` IS NULL;

COMMIT;
```

#### 数据迁移
```sql
-- V1.5.2__Migrate_user_profile_data.sql
-- 迁移用户资料数据

START TRANSACTION;

-- 创建新的用户资料表
CREATE TABLE `${database.prefix}user_profiles_new` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `nickname` VARCHAR(50) COMMENT '昵称',
    `avatar_url` VARCHAR(500) COMMENT '头像URL',
    `phone` VARCHAR(20) COMMENT '手机号',
    `bio` TEXT COMMENT '个人简介',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    CONSTRAINT `uk_user_profiles_new_user_id` UNIQUE (`user_id`),
    CONSTRAINT `fk_user_profiles_new_user_id_users_id`
        FOREIGN KEY (`user_id`) REFERENCES `${database.prefix}users`(`id`)
        ON DELETE CASCADE,

    INDEX `idx_user_profiles_new_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户扩展信息表（新）';

-- 迁移数据
INSERT INTO `${database.prefix}user_profiles_new` (`user_id`, `nickname`, `avatar_url`, `phone`)
SELECT
    `id`,
    `nickname`,
    `avatar_url`,
    `phone`
FROM `${database.prefix}users`
WHERE `nickname` IS NOT NULL OR `avatar_url` IS NOT NULL OR `phone` IS NOT NULL;

-- 重命名表
RENAME TABLE `${database.prefix}user_profiles` TO `${database.prefix}user_profiles_old`;
RENAME TABLE `${database.prefix}user_profiles_new` TO `${database.prefix}user_profiles`;

-- 删除用户表中的冗余字段（可选，根据业务需求决定）
-- ALTER TABLE `${database.prefix}users` DROP COLUMN `nickname`, DROP COLUMN `avatar_url`, DROP COLUMN `phone`;

COMMIT;
```

---

## 🔄 回滚策略制定

### 1. 回滚脚本编写

#### 安全回滚脚本
```sql
-- R1.1.1__Drop_core_tables.sql
-- 核心表回滚脚本

-- 设置安全检查
SET FOREIGN_KEY_CHECKS = 0;

-- 警告：此操作将删除所有数据
-- 确认当前环境是否为开发环境
SET @current_env = '${env}';
IF @current_env = 'prod' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '生产环境禁止执行回滚操作';
END IF;

-- 记录回滚操作
INSERT INTO `${database.prefix}operation_logs` (`operation_type`, `description`, `created_by`, `created_at`)
VALUES ('ROLLBACK', '回滚到V1.1.1之前版本，删除所有核心表', 'system', NOW());

-- 删除索引（先删除索引，再删除表）
DROP INDEX IF EXISTS `idx_users_username` ON `${database.prefix}users`;
DROP INDEX IF EXISTS `idx_users_email` ON `${database.prefix}users`;
DROP INDEX IF EXISTS `idx_users_status` ON `${database.prefix}users`;
DROP INDEX IF EXISTS `idx_users_created_at` ON `${database.prefix}users`;

-- 删除表（按照依赖关系的逆序）
DROP TABLE IF EXISTS `${database.prefix}user_profiles`;
DROP TABLE IF EXISTS `${database.prefix}articles`;
DROP TABLE IF EXISTS `${database.prefix}categories`;
DROP TABLE IF EXISTS `${database.prefix}permissions`;
DROP TABLE IF EXISTS `${database.prefix}roles`;
DROP TABLE IF EXISTS `${database.prefix}users`;

-- 恢复外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- 验证回滚结果
SELECT 'R1.1.1: 核心表回滚完成' as result;
```

#### 数据回滚脚本
```sql
-- R1.1.2__Remove_core_data.sql
-- 核心数据回滚脚本

START TRANSACTION;

-- 记录回滚操作
INSERT INTO `${database.prefix}operation_logs` (`operation_type`, `description`, `created_by`, `created_at`)
VALUES ('ROLLBACK', '回滚V1.1.2版本，删除核心基础数据', 'system', NOW());

-- 删除插入的数据（按照依赖关系的逆序）
DELETE FROM `${database.prefix}system_configs` WHERE `config_key` IN (
    'site.name', 'site.description', 'user.default_avatar',
    'upload.max_file_size', 'security.password_min_length'
);

DELETE FROM `${database.prefix}permissions` WHERE `permission_code` IN (
    'USER_MANAGE', 'ROLE_MANAGE', 'PERMISSION_MANAGE',
    'RESOURCE_VIEW', 'RESOURCE_DOWNLOAD', 'RESOURCE_UPLOAD'
);

DELETE FROM `${database.prefix}roles` WHERE `role_code` IN (
    'SUPER_ADMIN', 'ADMIN', 'VIP', 'USER'
);

COMMIT;

-- 验证回滚结果
SELECT
    (SELECT COUNT(*) FROM `${database.prefix}roles`) as roles_count,
    (SELECT COUNT(*) FROM `${database.prefix}permissions`) as permissions_count,
    (SELECT COUNT(*) FROM `${database.prefix}system_configs`) as configs_count;
```

### 2. 回滚执行策略

#### 环境安全检查
```sql
-- 创建回滚安全检查存储过程
DELIMITER $$
CREATE PROCEDURE sp_safe_rollback(IN target_version VARCHAR(20))
BEGIN
    DECLARE current_env VARCHAR(20);
    DECLARE is_prod_env BOOLEAN DEFAULT FALSE;
    DECLARE backup_exists BOOLEAN DEFAULT FALSE;

    -- 检查当前环境
    SET current_env = (SELECT config_value FROM `${database.prefix}system_configs`
                      WHERE config_key = 'environment');

    -- 检查是否为生产环境
    SET is_prod_env = (current_env = 'prod' OR current_env = 'production');

    -- 检查备份是否存在
    SET backup_exists = EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = DATABASE()
        AND table_name LIKE '%_backup_%'
    );

    -- 安全检查
    IF is_prod_env THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '生产环境禁止执行回滚操作';
    END IF;

    IF NOT backup_exists THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '未找到备份表，无法安全执行回滚';
    END IF;

    -- 记录回滚意图
    INSERT INTO `${database.prefix}operation_logs`
    (`operation_type`, `description`, `created_by`, `created_at`)
    VALUES
    ('ROLLBACK_ATTEMPT', CONCAT('尝试回滚到版本: ', target_version), 'system', NOW());

    SELECT CONCAT('安全检查通过，准备回滚到版本: ', target_version) as result;
END$$
DELIMITER ;
```

#### 自动回滚机制
```java
@Component
public class FlywayRollbackService {

    private final Flyway flyway;
    private final DataSource dataSource;

    @Autowired
    public FlywayRollbackService(Flyway flyway, DataSource dataSource) {
        this.flyway = flyway;
        this.dataSource = dataSource;
    }

    /**
     * 执行安全回滚
     */
    @Transactional
    public void safeRollback(String targetVersion) {
        try {
            // 1. 安全检查
            performSafetyChecks();

            // 2. 创建备份
            createBackup();

            // 3. 执行回滚
            executeRollback(targetVersion);

            // 4. 验证回滚结果
            validateRollbackResult();

        } catch (Exception e) {
            log.error("回滚操作失败: {}", e.getMessage(), e);
            // 回滚失败时恢复备份
            restoreFromBackup();
            throw new RuntimeException("回滚操作失败，已恢复备份", e);
        }
    }

    private void performSafetyChecks() {
        // 检查当前环境
        String currentEnv = getCurrentEnvironment();
        if ("prod".equals(currentEnv) || "production".equals(currentEnv)) {
            throw new RuntimeException("生产环境禁止执行回滚操作");
        }

        // 检查是否有备份
        if (!backupExists()) {
            throw new RuntimeException("未找到备份，无法安全执行回滚");
        }
    }

    private void createBackup() {
        try (Connection conn = dataSource.getConnection()) {
            ScriptRunner scriptRunner = new ScriptRunner(conn);

            // 执行备份脚本
            String backupScript = generateBackupScript();
            scriptRunner.runScript(new StringReader(backupScript));

            log.info("数据库备份创建完成");
        } catch (Exception e) {
            throw new RuntimeException("创建备份失败", e);
        }
    }

    private void executeRollback(String targetVersion) {
        // 执行回滚脚本
        List<String> rollbackScripts = findRollbackScripts(targetVersion);

        try (Connection conn = dataSource.getConnection()) {
            ScriptRunner scriptRunner = new ScriptRunner(conn);

            for (String script : rollbackScripts) {
                scriptRunner.runScript(new StringReader(script));
                log.info("执行回滚脚本: {}", script);
            }

        } catch (Exception e) {
            throw new RuntimeException("执行回滚脚本失败", e);
        }
    }

    private void validateRollbackResult() {
        // 验证回滚后的数据库状态
        try {
            flyway.validate();
            log.info("回滚结果验证通过");
        } catch (Exception e) {
            throw new RuntimeException("回滚结果验证失败", e);
        }
    }

    private String generateBackupScript() {
        StringBuilder script = new StringBuilder();

        // 为每个表创建备份
        List<String> tables = getAllTableNames();

        for (String table : tables) {
            script.append(String.format(
                "CREATE TABLE `%s_backup_%s` AS SELECT * FROM `%s`;\n",
                table,
                System.currentTimeMillis(),
                table
            ));
        }

        return script.toString();
    }
}
```

---

## 🚀 版本管理最佳实践

### 1. 开发流程规范

#### 分支开发策略
```bash
# 主分支结构
main                    # 生产环境分支
├── develop            # 开发环境分支
├── feature/user-auth  # 功能开发分支
├── feature/vip-system # 功能开发分支
└── hotfix/bug-fix     # 紧急修复分支

# 版本管理流程
# 1. 从develop创建功能分支
git checkout develop
git checkout -b feature/user-auth

# 2. 在功能分支中创建迁移脚本
# db/migration/V1.2.1__Create_user_auth_tables.sql

# 3. 功能开发完成后合并到develop
git checkout develop
git merge feature/user-auth

# 4. develop分支测试通过后合并到main
git checkout main
git merge develop

# 5. 打标签
git tag -a v1.2.0 -m "Release version 1.2.0"
```

#### 代码审查清单
```markdown
## Flyway迁移脚本审查清单

### 基础检查
- [ ] 文件命名符合规范
- [ ] 版本号递增正确
- [ ] 描述清晰准确
- [ ] 环境标识正确

### 脚本内容检查
- [ ] SQL语法正确
- [ ] 使用事务保护
- [ ] 错误处理完善
- [ ] 占位符使用正确

### 业务逻辑检查
- [ ] 表结构设计合理
- [ ] 索引设计优化
- [ ] 约束设置正确
- [ ] 数据迁移安全

### 性能影响检查
- [ ] 大表操作有优化
- [ ] 锁定时间可控
- [ ] 执行计划合理
- [ ] 回滚方案完备

### 测试验证检查
- [ ] 开发环境测试通过
- [ ] 测试环境验证通过
- [ ] 性能测试完成
- [ ] 回滚测试完成
```

### 2. 环境管理策略

#### 多环境配置
```yaml
# application-dev.yml
spring:
  profiles:
    active: dev
  flyway:
    locations: classpath:db/migration/dev
    clean-disabled: false
    placeholders:
      env: dev

# application-test.yml
spring:
  profiles:
    active: test
  flyway:
    locations: classpath:db/migration/test
    clean-disabled: false
    placeholders:
      env: test

# application-prod.yml
spring:
  profiles:
    active: prod
  flyway:
    locations: classpath:db/migration/prod
    clean-disabled: true
    validate-on-migrate: true
    placeholders:
      env: prod
```

#### 环境特定迁移
```sql
-- V1.2.1__Create_user_auth_tables.sql
-- 适用于所有环境的基础表创建

CREATE TABLE `${database.prefix}users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- dev/V1.2.2__Add_test_data.sql
-- 开发环境测试数据

INSERT INTO `${database.prefix}users` (`username`, `email`) VALUES
('testuser1', 'test1@example.com'),
('testuser2', 'test2@example.com');

-- prod/V1.2.3__Add_production_indexes.sql
-- 生产环境特定索引

ALTER TABLE `${database.prefix}users`
ADD INDEX `idx_users_email_prod` (`email`);
```

### 3. 监控与告警

#### 迁移执行监控
```java
@Component
@Slf4j
public class FlywayMigrationMonitor {

    private final Flyway flyway;
    private final MeterRegistry meterRegistry;

    @EventListener
    public void handleMigrationEvent(FlywayMigrationEvent event) {
        try {
            // 记录迁移指标
            recordMigrationMetrics(event);

            // 发送迁移通知
            sendMigrationNotification(event);

            // 检查迁移健康状态
            checkMigrationHealth(event);

        } catch (Exception e) {
            log.error("迁移监控处理失败: {}", e.getMessage(), e);
        }
    }

    private void recordMigrationMetrics(FlywayMigrationEvent event) {
        // 记录迁移次数
        meterRegistry.counter("flyway.migration.count",
                "version", event.getVersion(),
                "state", event.getState().name())
                .increment();

        // 记录迁移执行时间
        meterRegistry.timer("flyway.migration.duration",
                "version", event.getVersion())
                .record(event.getExecutionTime(), TimeUnit.MILLISECONDS);
    }

    private void sendMigrationNotification(FlywayMigrationEvent event) {
        String message = String.format("数据库迁移: 版本 %s, 状态: %s, 耗时: %dms",
                event.getVersion(),
                event.getState().name(),
                event.getExecutionTime());

        if (event.getState() == MigrationState.FAILED) {
            // 发送失败告警
            sendAlert(message, event.getException());
        } else {
            // 发送成功通知
            log.info(message);
        }
    }

    private void checkMigrationHealth(FlywayMigrationEvent event) {
        if (event.getState() == MigrationState.FAILED) {
            // 健康检查失败
            meterRegistry.gauge("flyway.health.status", 0);
        } else {
            // 健康检查成功
            meterRegistry.gauge("flyway.health.status", 1);
        }
    }
}
```

#### 迁移状态检查
```sql
-- 创建迁移状态检查视图
CREATE VIEW `${database.prefix}v_migration_status` AS
SELECT
    version,
    description,
    type,
    script,
    installed_on,
    execution_time,
    success
FROM `${database.prefix}flyway_schema_history`
ORDER BY installed_rank DESC;

-- 定期检查迁移状态
SELECT
    version,
    description,
    CASE
        WHEN success = 1 THEN 'SUCCESS'
        ELSE 'FAILED'
    END as status,
    installed_on,
    execution_time
FROM `${database.prefix}v_migration_status`
WHERE installed_on >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY installed_on DESC;
```

---

## 📋 版本管理检查清单

### 设计阶段检查
- [ ] **版本规划**
  - [ ] 版本号命名规范正确
  - [ ] 版本递增策略合理
  - [ ] 功能模块划分清晰
  - [ ] 依赖关系明确

- [ ] **迁移脚本设计**
  - [ ] 脚本结构规范统一
  - [ ] 错误处理机制完善
  - [ ] 回滚方案完备
  - [ ] 性能影响评估

### 开发阶段检查
- [ ] **脚本编写规范**
  - [ ] SQL语法正确无误
  - [ ] 事务使用合理
  - [ ] 占位符使用正确
  - [ ] 注释说明清晰

- [ ] **测试验证**
  - [ ] 开发环境测试通过
  - [ ] 功能验证完整
  - [ ] 性能测试达标
  - [ ] 回滚测试通过

### 部署阶段检查
- [ ] **环境配置**
  - [ ] 多环境配置正确
  - [ ] 占位符替换成功
  - [ ] 数据库连接正常
  - [ ] 权限设置合理

- [ ] **执行监控**
  - [ ] 迁移执行状态监控
  - [ ] 错误告警机制健全
  - [ ] 执行日志记录完整
  - [ ] 健康状态检查正常

### 维护阶段检查
- [ ] **版本管理**
  - [ ] 版本历史记录完整
  - [ ] 标签管理规范
  - [ ] 分支策略执行
  - [ ] 代码审查到位

- [ ] **文档维护**
  - [ ] 变更记录及时更新
  - [ ] 操作文档完整
  - [ ] 故障处理预案
  - [ ] 团队培训到位

---

## 🛠️ Flyway工具使用指南

### 1. Maven命令使用

#### 常用Maven命令
```bash
# 清理数据库（删除所有对象）
mvn flyway:clean

# 验证迁移脚本
mvn flyway:validate

# 执行迁移
mvn flyway:migrate

# 查看当前状态
mvn flyway:info

# 查看迁移历史
mvn flyway:history

# 基线化现有数据库
mvn flyway:baseline

# 修复失败的迁移
mvn flyway:repair

# 环境特定配置
mvn flyway:migrate -Dflyway.configFiles=application-test.yml
```

#### 命令使用示例
```bash
# 开发环境使用
mvn flyway:migrate -Dflyway.placeholders.env=dev

# 生产环境使用（带额外验证）
mvn flyway:validate
mvn flyway:migrate -Dflyway.placeholders.env=prod

# 查看迁移信息
mvn flyway:info -Dflyway.table=flyway_schema_history

# 基线化现有数据库
mvn flyway:baseline -Dflyway.baselineVersion=1.0.0 -Dflyway.baselineDescription="Initial baseline"
```

### 2. Spring Boot集成使用

#### 自动配置使用
```java
@RestController
@RequestMapping("/api/database")
public class DatabaseController {

    private final Flyway flyway;

    @Autowired
    public DatabaseController(Flyway flyway) {
        this.flyway = flyway;
    }

    /**
     * 获取迁移信息
     */
    @GetMapping("/migrations")
    public ResponseEntity<List<MigrationInfo>> getMigrations() {
        List<MigrationInfo> migrations = flyway.info().all();
        return ResponseEntity.ok(migrations);
    }

    /**
     * 执行迁移（仅开发环境）
     */
    @PostMapping("/migrate")
    public ResponseEntity<String> migrate() {
        String currentEnv = getCurrentEnvironment();
        if ("prod".equals(currentEnv)) {
            return ResponseEntity.badRequest().body("生产环境禁止手动执行迁移");
        }

        try {
            MigrationResult result = flyway.migrate();
            return ResponseEntity.ok("迁移执行成功: " + result.migrationsExecuted);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("迁移执行失败: " + e.getMessage());
        }
    }

    /**
     * 验证数据库状态
     */
    @GetMapping("/validate")
    public ResponseEntity<String> validate() {
        try {
            flyway.validate();
            return ResponseEntity.ok("数据库验证通过");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("数据库验证失败: " + e.getMessage());
        }
    }
}
```

### 3. 故障排除指南

#### 常见问题解决
```bash
# 1. 迁移失败后的修复
mvn flyway:repair

# 2. 检查迁移状态
mvn flyway:info

# 3. 清理并重新开始（仅开发环境）
mvn flyway:clean
mvn flyway:migrate

# 4. 手动解决版本冲突
# 查看当前版本
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;

# 手动删除失败的迁移记录
DELETE FROM flyway_schema_history WHERE version = '1.2.3' AND success = 0;

# 重新执行迁移
mvn flyway:migrate
```

#### 调试技巧
```sql
-- 启用Flyway调试日志
-- 在application.yml中添加
logging:
  level:
    org.flywaydb: DEBUG

-- 查看迁移执行详情
SELECT
    version,
    description,
    type,
    script,
    installed_on,
    execution_time,
    success
FROM flyway_schema_history
ORDER BY installed_rank DESC;

-- 检查失败的迁移
SELECT
    version,
    description,
    script,
    installed_on,
    execution_time
FROM flyway_schema_history
WHERE success = 0
ORDER BY installed_on DESC;
```

---

**文档维护**：Flyway版本管理指南随数据库版本管理实践持续更新
**最后更新**：2024-10-30
**维护人员**：开发团队