-- ====================================================================
-- 数据库验证系统表创建脚本
-- ====================================================================
-- 版本：V1.1.5
-- 描述：创建数据库验证结果存储和管理相关表
-- 作者：数据库团队
-- 日期：2025-10-30
-- 依赖：V1.1.4__Insert_system_core_data.sql
-- ====================================================================

-- 设置SQL模式
SET NAMES utf8mb4;

-- 开始事务
START TRANSACTION;

-- ====================================================================
-- 1. 验证执行记录表
-- ====================================================================

-- 验证执行记录主表
CREATE TABLE verification_executions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    execution_id VARCHAR(50) NOT NULL UNIQUE COMMENT '执行ID（格式：VERIF_YYYYMMDD_HHMMSS_connectionId）',
    execution_type ENUM('migration', 'startup', 'scheduled', 'manual') NOT NULL COMMENT '执行类型',
    trigger_source VARCHAR(100) NOT NULL COMMENT '触发来源（迁移版本、应用启动、定时任务、手动执行）',
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '开始时间',
    end_time TIMESTAMP NULL COMMENT '结束时间',
    execution_duration_seconds INT NULL COMMENT '执行时长（秒）',
    total_checks INT DEFAULT 0 COMMENT '总检查项数',
    critical_issues INT DEFAULT 0 COMMENT '严重问题数',
    error_issues INT DEFAULT 0 COMMENT '错误问题数',
    warning_issues INT DEFAULT 0 COMMENT '警告问题数',
    info_issues INT DEFAULT 0 COMMENT '信息提示数',
    health_score DECIMAL(5,2) NULL COMMENT '健康评分（0-100）',
    execution_status ENUM('running', 'completed', 'failed', 'cancelled') DEFAULT 'running' COMMENT '执行状态',
    error_message TEXT NULL COMMENT '执行错误信息',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_execution_id (execution_id),
    INDEX idx_execution_type (execution_type),
    INDEX idx_start_time (start_time),
    INDEX idx_execution_status (execution_status),
    INDEX idx_health_score (health_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='验证执行记录表';

-- ====================================================================
-- 2. 验证结果详情表
-- ====================================================================

-- 验证结果详情表
CREATE TABLE verification_results (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    execution_id VARCHAR(50) NOT NULL COMMENT '执行ID（关联verification_executions表）',
    module_name VARCHAR(100) NOT NULL COMMENT '模块名称（如：core_tables, auth_extension等）',
    table_name VARCHAR(100) NULL COMMENT '表名（如果验证针对特定表）',
    check_item VARCHAR(200) NOT NULL COMMENT '检查项目名称',
    warning_level ENUM('critical', 'error', 'warn', 'info') NOT NULL COMMENT '警告级别',
    check_category VARCHAR(100) NOT NULL COMMENT '检查分类（如：数据完整性、业务逻辑、性能等）',
    error_message TEXT NOT NULL COMMENT '错误或问题描述',
    suggested_action TEXT NULL COMMENT '建议的修复或优化措施',
    check_count INT DEFAULT 1 COMMENT '问题出现次数',
    affected_record_count INT NULL COMMENT '影响的记录数',
    additional_data JSON NULL COMMENT '额外的检查数据（如统计值、查询结果等）',
    fix_status ENUM('pending', 'in_progress', 'resolved', 'ignored', 'false_positive') DEFAULT 'pending' COMMENT '修复状态',
    assigned_to VARCHAR(100) NULL COMMENT '分配给的负责人',
    fix_notes TEXT NULL COMMENT '修复备注',
    fixed_at TIMESTAMP NULL COMMENT '修复时间',
    fixed_by VARCHAR(100) NULL COMMENT '修复人',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (execution_id) REFERENCES verification_executions(execution_id) ON DELETE CASCADE,
    INDEX idx_execution_id (execution_id),
    INDEX idx_module_name (module_name),
    INDEX idx_table_name (table_name),
    INDEX idx_warning_level (warning_level),
    INDEX idx_check_category (check_category),
    INDEX idx_fix_status (fix_status),
    INDEX idx_created_at (created_at),
    INDEX idx_composite_lookup (execution_id, warning_level, fix_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='验证结果详情表';

-- ====================================================================
-- 3. 验证配置表
-- ====================================================================

-- 验证配置表
CREATE TABLE verification_configurations (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键名',
    config_value TEXT NOT NULL COMMENT '配置值',
    config_type ENUM('string', 'integer', 'boolean', 'json') NOT NULL DEFAULT 'string' COMMENT '配置值类型',
    description TEXT NULL COMMENT '配置描述',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    environment ENUM('all', 'dev', 'test', 'prod') DEFAULT 'all' COMMENT '适用环境',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_config_key (config_key),
    INDEX idx_is_active (is_active),
    INDEX idx_environment (environment)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='验证配置表';

-- ====================================================================
-- 4. 验证脚本管理表
-- ====================================================================

-- 验证脚本管理表
CREATE TABLE verification_scripts (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    script_name VARCHAR(100) NOT NULL UNIQUE COMMENT '脚本名称',
    script_path VARCHAR(500) NOT NULL COMMENT '脚本文件路径',
    module_name VARCHAR(100) NOT NULL COMMENT '所属模块',
    script_version VARCHAR(20) NOT NULL COMMENT '脚本版本',
    verification_level ENUM('level1', 'level2', 'level3') NOT NULL COMMENT '验证级别',
    execution_order INT DEFAULT 0 COMMENT '执行顺序（数字越小越先执行）',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    auto_execute BOOLEAN DEFAULT TRUE COMMENT '是否自动执行',
    execution_frequency ENUM('on_demand', 'migration', 'startup', 'daily', 'weekly', 'monthly') DEFAULT 'on_demand' COMMENT '执行频率',
    last_execution_id VARCHAR(50) NULL COMMENT '最后一次执行ID',
    last_execution_time TIMESTAMP NULL COMMENT '最后一次执行时间',
    last_success_time TIMESTAMP NULL COMMENT '最后一次成功执行时间',
    execution_count INT DEFAULT 0 COMMENT '执行次数',
    success_count INT DEFAULT 0 COMMENT '成功次数',
    failure_count INT DEFAULT 0 COMMENT '失败次数',
    average_duration_seconds DECIMAL(8,2) NULL COMMENT '平均执行时长（秒）',
    description TEXT NULL COMMENT '脚本描述',
    dependencies TEXT NULL COMMENT '依赖的其他脚本（JSON格式）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_script_name (script_name),
    INDEX idx_module_name (module_name),
    INDEX idx_verification_level (verification_level),
    INDEX idx_is_active (is_active),
    INDEX idx_auto_execute (auto_execute),
    INDEX idx_execution_frequency (execution_frequency),
    INDEX idx_last_execution_time (last_execution_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='验证脚本管理表';

-- ====================================================================
-- 5. 验证告警记录表
-- ====================================================================

-- 验证告警记录表
CREATE TABLE verification_alerts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    execution_id VARCHAR(50) NOT NULL COMMENT '执行ID',
    alert_type ENUM('critical_issue', 'execution_failure', 'performance_degradation', 'trend_anomaly') NOT NULL COMMENT '告警类型',
    alert_level ENUM('high', 'medium', 'low') NOT NULL COMMENT '告警级别',
    title VARCHAR(200) NOT NULL COMMENT '告警标题',
    message TEXT NOT NULL COMMENT '告警消息',
    affected_modules JSON NULL COMMENT '影响的模块列表',
    issue_count INT DEFAULT 0 COMMENT '问题数量',
    alert_data JSON NULL COMMENT '告警相关数据',
    notification_sent BOOLEAN DEFAULT FALSE COMMENT '是否已发送通知',
    notification_channels JSON NULL COMMENT '通知渠道列表（email, sms, webhook等）',
    notification_time TIMESTAMP NULL COMMENT '通知发送时间',
    acknowledged BOOLEAN DEFAULT FALSE COMMENT '是否已确认',
    acknowledged_by VARCHAR(100) NULL COMMENT '确认人',
    acknowledged_at TIMESTAMP NULL COMMENT '确认时间',
    resolution_status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open' COMMENT '解决状态',
    resolution_notes TEXT NULL COMMENT '解决方案备注',
    resolved_at TIMESTAMP NULL COMMENT '解决时间',
    resolved_by VARCHAR(100) NULL COMMENT '解决人',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (execution_id) REFERENCES verification_executions(execution_id) ON DELETE CASCADE,
    INDEX idx_execution_id (execution_id),
    INDEX idx_alert_type (alert_type),
    INDEX idx_alert_level (alert_level),
    INDEX idx_resolution_status (resolution_status),
    INDEX idx_notification_sent (notification_sent),
    INDEX idx_created_at (created_at),
    INDEX idx_composite_status (resolution_status, alert_level, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='验证告警记录表';

-- ====================================================================
-- 6. 验证统计汇总表
-- ====================================================================

-- 验证统计汇总表
CREATE TABLE verification_statistics (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    stat_date DATE NOT NULL COMMENT '统计日期',
    module_name VARCHAR(100) NOT NULL COMMENT '模块名称',
    total_executions INT DEFAULT 0 COMMENT '总执行次数',
    successful_executions INT DEFAULT 0 COMMENT '成功执行次数',
    failed_executions INT DEFAULT 0 COMMENT '失败执行次数',
    average_health_score DECIMAL(5,2) DEFAULT 0.00 COMMENT '平均健康评分',
    total_issues_detected INT DEFAULT 0 COMMENT '发现的总问题数',
    critical_issues_detected INT DEFAULT 0 COMMENT '发现的严重问题数',
    error_issues_detected INT DEFAULT 0 COMMENT '发现的错误问题数',
    warning_issues_detected INT DEFAULT 0 COMMENT '发现的警告问题数',
    average_execution_duration DECIMAL(8,2) DEFAULT 0.00 COMMENT '平均执行时长（秒）',
    issues_resolved INT DEFAULT 0 COMMENT '已解决的问题数',
    issues_pending INT DEFAULT 0 COMMENT '待解决的问题数',
    trend_analysis JSON NULL COMMENT '趋势分析数据',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_date_module (stat_date, module_name),
    INDEX idx_stat_date (stat_date),
    INDEX idx_module_name (module_name),
    INDEX idx_total_executions (total_executions),
    INDEX idx_average_health_score (average_health_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='验证统计汇总表';

-- ====================================================================
-- 7. 插入初始配置数据
-- ====================================================================

-- 插入验证配置数据
INSERT INTO verification_configurations (config_key, config_value, config_type, description, environment) VALUES
('verification.enabled', 'true', 'boolean', '是否启用数据库验证功能', 'all'),
('verification.auto.execute.on.migration', 'true', 'boolean', '迁移后是否自动执行验证', 'all'),
('verification.auto.execute.on.startup', 'false', 'boolean', '应用启动时是否自动执行验证', 'all'),
('verification.health.score.threshold.critical', '60.0', 'string', '健康评分严重阈值（低于此值触发严重告警）', 'all'),
('verification.health.score.threshold.warning', '80.0', 'string', '健康评分警告阈值（低于此值触发警告）', 'all'),
('verification.execution.timeout.seconds', '300', 'string', '验证脚本执行超时时间（秒）', 'all'),
('verification.max.retry.count', '3', 'string', '验证失败最大重试次数', 'all'),
('verification.alert.email.enabled', 'true', 'boolean', '是否启用邮件告警', 'all'),
('verification.alert.email.recipients', '["admin@example.com", "dba@example.com"]', 'json', '邮件告警接收人列表', 'all'),
('verification.alert.sms.enabled', 'false', 'boolean', '是否启用短信告警', 'prod'),
('verification.alert.webhook.enabled', 'false', 'boolean', '是否启用Webhook告警', 'all'),
('verification.retention.days', '90', 'string', '验证结果保留天数', 'all'),
('verification.statistics.update.enabled', 'true', 'boolean', '是否启用统计更新', 'all'),
('verification.performance.monitoring.enabled', 'true', 'boolean', '是否启用性能监控', 'all'),
('verification.trend.analysis.enabled', 'true', 'boolean', '是否启用趋势分析', 'all'),
('verification.compression.enabled', 'false', 'boolean', '是否启用验证结果压缩存储', 'all');

-- 插入验证脚本管理数据（预注册已有和计划的验证脚本）
INSERT INTO verification_scripts (script_name, script_path, module_name, script_version, verification_level, execution_order, auto_execute, execution_frequency, description) VALUES
('verify_vip_business_tables', 'scripts/database/verify_vip_business_tables.sql', 'vip_business', '1.0.0', 'level3', 10, true, 'migration', 'VIP业务表验证脚本（已存在，需要优化）'),
('verify_core_tables', 'scripts/database/verify_core_tables.sql', 'core_tables', '1.0.0', 'level2', 20, true, 'migration', '核心基础表验证脚本（待创建）'),
('verify_auth_extension_tables', 'scripts/database/verify_auth_extension_tables.sql', 'auth_extension', '1.0.0', 'level2', 30, true, 'migration', '认证扩展表验证脚本（待创建）'),
('verify_user_center_tables', 'scripts/database/verify_user_center_tables.sql', 'user_center', '1.0.0', 'level2', 40, true, 'migration', '用户中心表验证脚本（待创建）'),
('verify_resource_tables', 'scripts/database/verify_resource_tables.sql', 'resource_management', '1.0.0', 'level1', 50, true, 'migration', '资源管理表验证脚本（计划中）'),
('verify_content_tables', 'scripts/database/verify_content_tables.sql', 'content_management', '1.0.0', 'level1', 60, true, 'migration', '内容管理表验证脚本（计划中）');

-- ====================================================================
-- 8. 创建视图
-- ====================================================================

-- 验证执行概览视图
CREATE OR REPLACE VIEW v_verification_execution_overview AS
SELECT
    e.execution_id,
    e.execution_type,
    e.trigger_source,
    e.start_time,
    e.end_time,
    e.execution_duration_seconds,
    e.health_score,
    e.execution_status,
    e.total_checks,
    e.critical_issues,
    e.error_issues,
    e.warning_issues,
    e.info_issues,
    CASE
        WHEN e.critical_issues > 0 THEN 'CRITICAL'
        WHEN e.error_issues > 0 THEN 'ERROR'
        WHEN e.warning_issues > 0 THEN 'WARN'
        ELSE 'INFO'
    END as overall_status,
    r.affected_tables_count,
    r.modules_involved
FROM verification_executions e
LEFT JOIN (
    SELECT
        execution_id,
        COUNT(DISTINCT table_name) as affected_tables_count,
        COUNT(DISTINCT module_name) as modules_involved
    FROM verification_results
    WHERE table_name IS NOT NULL
    GROUP BY execution_id
) r ON e.execution_id = r.execution_id;

-- 最新验证结果视图
CREATE OR REPLACE VIEW v_latest_verification_results AS
SELECT
    vr.*,
    e.start_time as execution_time,
    e.execution_type,
    e.health_score as execution_health_score
FROM verification_results vr
JOIN verification_executions e ON vr.execution_id = e.execution_id
WHERE e.execution_id = (
    SELECT MAX(execution_id)
    FROM verification_executions
    WHERE execution_status = 'COMPLETED'
);

-- 模块验证统计视图
CREATE OR REPLACE VIEW v_module_verification_stats AS
SELECT
    vr.module_name,
    COUNT(DISTINCT vr.execution_id) as total_executions,
    COUNT(DISTINCT CASE WHEN e.execution_status = 'completed' THEN vr.execution_id END) as successful_executions,
    COUNT(DISTINCT CASE WHEN e.execution_status = 'failed' THEN vr.execution_id END) as failed_executions,
    AVG(e.health_score) as average_health_score,
    AVG(e.execution_duration_seconds) as average_duration,
    MAX(e.start_time) as last_execution_time,
    MIN(e.start_time) as first_execution_time
FROM verification_results vr
LEFT JOIN verification_executions e ON vr.execution_id = e.execution_id
GROUP BY vr.module_name;

-- ====================================================================
-- 9. 创建存储过程
-- ====================================================================

DELIMITER //

-- 清理过期验证数据的存储过程
DROP PROCEDURE IF EXISTS CleanupExpiredVerificationData //

CREATE PROCEDURE CleanupExpiredVerificationData()
BEGIN
    DECLARE retention_days INT DEFAULT 90;
    DECLARE cleanup_date DATETIME;

    -- 获取保留天数配置
    SELECT CAST(config_value AS UNSIGNED) INTO retention_days
    FROM verification_configurations
    WHERE config_key = 'verification.retention.days' AND is_active = TRUE
    LIMIT 1;

    SET cleanup_date = DATE_SUB(NOW(), INTERVAL retention_days DAY);

    -- 清理过期的验证执行记录和相关数据
    DELETE FROM verification_results
    WHERE execution_id IN (
        SELECT execution_id FROM verification_executions
        WHERE start_time < cleanup_date
    );

    DELETE FROM verification_alerts
    WHERE execution_id IN (
        SELECT execution_id FROM verification_executions
        WHERE start_time < cleanup_date
    );

    DELETE FROM verification_executions
    WHERE start_time < cleanup_date;

    -- 清理过期的统计数据（保留1年）
    DELETE FROM verification_statistics
    WHERE stat_date < DATE_SUB(CURDATE(), INTERVAL 1 YEAR);

    SELECT CONCAT('清理完成，删除了', ROW_COUNT(), '条过期记录') as result;
END //

-- 更新验证统计的存储过程
DROP PROCEDURE IF EXISTS UpdateVerificationStatistics //

CREATE PROCEDURE UpdateVerificationStatistics(IN stat_date_param DATE)
BEGIN
    -- 插入或更新当天的统计汇总
    INSERT INTO verification_statistics (
        stat_date, module_name, total_executions, successful_executions,
        failed_executions, average_health_score, total_issues_detected,
        critical_issues_detected, error_issues_detected, warning_issues_detected,
        average_execution_duration, issues_resolved, issues_pending
    )
    SELECT
        stat_date_param,
        module_name,
        COUNT(*) as total_executions,
        COUNT(CASE WHEN execution_status = 'COMPLETED' THEN 1 END) as successful_executions,
        COUNT(CASE WHEN execution_status = 'FAILED' THEN 1 END) as failed_executions,
        AVG(health_score) as average_health_score,
        SUM(critical_issues + error_issues + warning_issues + info_issues) as total_issues_detected,
        SUM(critical_issues) as critical_issues_detected,
        SUM(error_issues) as error_issues_detected,
        SUM(warning_issues) as warning_issues_detected,
        AVG(execution_duration_seconds) as average_execution_duration,
        COUNT(CASE WHEN fix_status = 'resolved' THEN 1 END) as issues_resolved,
        COUNT(CASE WHEN fix_status IN ('PENDING', 'in_progress') THEN 1 END) as issues_pending
    FROM verification_executions e
    WHERE DATE(start_time) = stat_date_param
    GROUP BY module_name
    ON DUPLICATE KEY UPDATE
        total_executions = VALUES(total_executions),
        successful_executions = VALUES(successful_executions),
        failed_executions = VALUES(failed_executions),
        average_health_score = VALUES(average_health_score),
        total_issues_detected = VALUES(total_issues_detected),
        critical_issues_detected = VALUES(critical_issues_detected),
        error_issues_detected = VALUES(error_issues_detected),
        warning_issues_detected = VALUES(warning_issues_detected),
        average_execution_duration = VALUES(average_execution_duration),
        issues_resolved = VALUES(issues_resolved),
        issues_pending = VALUES(issues_pending),
        updated_at = CURRENT_TIMESTAMP;

    SELECT CONCAT('统计更新完成，更新了', ROW_COUNT(), '条记录') as result;
END //

DELIMITER ;

-- 提交事务
COMMIT;

-- 验证表创建成功
SELECT '✅ 数据库验证系统表创建完成' as status;
SELECT CONCAT('创建了 7 个表，', (SELECT COUNT(*) FROM verification_configurations), ' 条配置，', (SELECT COUNT(*) FROM verification_scripts), ' 个脚本注册') as details;