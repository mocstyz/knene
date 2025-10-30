-- ====================================================================
-- [模块名称] 数据库验证脚本模板
-- ====================================================================
-- 版本：V[版本号]
-- 描述：验证[模块名称]相关表的完整性和业务逻辑
-- 作者：数据库团队
-- 日期：[创建日期]
-- 验证级别：[Level 1/2/3]
-- 自动执行：迁移后自动执行
-- 报告格式：详细统计报告
-- 错误处理：记录警告继续
-- ====================================================================

-- 设置SQL模式
SET NAMES utf8mb4;

-- 定义变量
SET @verification_start_time = NOW();
SET @current_verification_id = CONCAT('VERIF_', DATE_FORMAT(NOW(), '%Y%m%d_%H%i%s'), '_', CONNECTION_ID());
SET @total_errors = 0;
SET @total_warnings = 0;
SET @total_checks = 0;

SELECT '=== [模块名称]数据库验证开始 ===' as verification_status;
SELECT CONCAT('验证ID: ', @current_verification_id) as verification_info;
SELECT CONCAT('开始时间: ', @verification_start_time) as verification_info;

-- ====================================================================
-- 1. 基础信息检查
-- ====================================================================

SELECT '1. 检查相关表是否存在...' as check_step;

-- 创建临时结果表
CREATE TEMPORARY TABLE temp_verification_results (
    check_item VARCHAR(200),
    table_name VARCHAR(100),
    warning_level ENUM('CRITICAL', 'ERROR', 'WARN', 'INFO'),
    error_message TEXT,
    suggested_action TEXT,
    check_count INT DEFAULT 1
) ENGINE=MEMORY;

-- 检查相关表是否存在
SELECT
    TABLE_NAME as table_name,
    TABLE_COMMENT as table_description,
    TABLE_ROWS as estimated_rows,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as size_mb,
    CREATE_TIME as created_at,
    UPDATE_TIME as updated_at
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME IN (
        -- 这里填入需要验证的表名列表
        'table1', 'table2', 'table3'
    )
ORDER BY TABLE_NAME;

-- ====================================================================
-- 2. Level 1: 基础数据验证
-- ====================================================================

SELECT '2. 执行Level 1基础数据验证...' as check_step;

-- 2.1 检查数据完整性
SELECT '2.1 检查数据完整性...' as sub_step;

-- 示例：检查必填字段完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action)
SELECT
    '必填字段完整性检查',
    'users',
    CASE
        WHEN COUNT(*) = 0 THEN 'CRITICAL'
        WHEN COUNT(CASE WHEN username IS NULL OR username = '' THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('发现 ', COUNT(CASE WHEN username IS NULL OR username = '' THEN 1 END), ' 个空用户名，',
           COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END), ' 个空邮箱'),
    CASE
        WHEN COUNT(*) = 0 THEN '立即检查用户表数据导入过程'
        WHEN COUNT(CASE WHEN username IS NULL OR username = '' THEN 1 END) > 0 THEN '修复空用户名记录'
        WHEN COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) > 0 THEN '修复空邮箱记录'
        ELSE '数据完整性良好'
    END
FROM users;

-- 2.2 检查外键约束完整性
SELECT '2.2 检查外键约束完整性...' as sub_step;

-- 示例：检查外键完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action)
SELECT
    '外键约束完整性检查',
    'user_roles',
    CASE
        WHEN COUNT(CASE WHEN user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM users) THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN role_id IS NOT NULL AND role_id NOT IN (SELECT id FROM roles) THEN 1 END) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('发现 ', COUNT(CASE WHEN user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM users) THEN 1 END), ' 个无效用户ID，',
           COUNT(CASE WHEN role_id IS NOT NULL AND role_id NOT IN (SELECT id FROM roles) THEN 1 END), ' 个无效角色ID'),
    CASE
        WHEN COUNT(CASE WHEN user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM users) THEN 1 END) > 0 THEN '清理无效用户ID或恢复对应的用户记录'
        WHEN COUNT(CASE WHEN role_id IS NOT NULL AND role_id NOT IN (SELECT id FROM roles) THEN 1 END) > 0 THEN '清理无效角色ID或恢复对应的角色记录'
        ELSE '外键关系完整性良好'
    END
FROM user_roles;

-- 2.3 检查数据格式正确性
SELECT '2.3 检查数据格式正确性...' as sub_step;

-- 示例：检查邮箱格式
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action)
SELECT
    '邮箱格式验证',
    'users',
    CASE
        WHEN COUNT(CASE WHEN email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' THEN 1 END) > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('发现 ', COUNT(CASE WHEN email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' THEN 1 END), ' 个格式不正确的邮箱'),
    CASE
        WHEN COUNT(CASE WHEN email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' THEN 1 END) > 0 THEN '修复邮箱格式或联系用户更新'
        ELSE '邮箱格式正确'
    END
FROM users;

-- 2.4 检查唯一性约束
SELECT '2.4 检查唯一性约束...' as sub_step;

-- 示例：检查用户名唯一性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action)
SELECT
    '用户名唯一性检查',
    'users',
    CASE
        WHEN COUNT(*) - COUNT(DISTINCT username) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('发现 ', COUNT(*) - COUNT(DISTINCT username), ' 个重复的用户名'),
    CASE
        WHEN COUNT(*) - COUNT(DISTINCT username) > 0 THEN '查找并修复重复的用户名记录'
        ELSE '用户名唯一性良好'
    END
FROM users;

-- ====================================================================
-- 3. Level 2: 业务规则验证（如果适用）
-- ====================================================================

SELECT '3. 执行Level 2业务规则验证...' as check_step;

-- 3.1 检查业务逻辑一致性
SELECT '3.1 检查业务逻辑一致性...' as sub_step;

-- 示例：检查用户状态与权限的一致性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action)
SELECT
    '用户状态与权限一致性检查',
    'users',
    CASE
        WHEN COUNT(CASE WHEN status = 'inactive' AND id IN (SELECT user_id FROM user_roles WHERE role_id IN (SELECT id FROM roles WHERE name = 'admin')) THEN 1 END) > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('发现 ', COUNT(CASE WHEN status = 'inactive' AND id IN (SELECT user_id FROM user_roles WHERE role_id IN (SELECT id FROM roles WHERE name = 'admin')) THEN 1 END), ' 个非活跃状态的管理员用户'),
    CASE
        WHEN COUNT(CASE WHEN status = 'inactive' AND id IN (SELECT user_id FROM user_roles WHERE role_id IN (SELECT id FROM roles WHERE name = 'admin')) THEN 1 END) > 0 THEN '检查非活跃管理员账户的处理策略'
        ELSE '用户状态与权限一致性良好'
    END
FROM users;

-- 3.2 检查时间序列一致性
SELECT '3.2 检查时间序列一致性...' as sub_step;

-- 示例：检查创建时间和更新时间的逻辑性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action)
SELECT
    '时间序列逻辑性检查',
    'users',
    CASE
        WHEN COUNT(CASE WHEN created_at > updated_at THEN 1 END) > 0 THEN 'WARN'
        WHEN COUNT(CASE WHEN updated_at IS NULL AND created_at < DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 END) > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('发现 ', COUNT(CASE WHEN created_at > updated_at THEN 1 END), ' 个创建时间晚于更新时间的记录，',
           COUNT(CASE WHEN updated_at IS NULL AND created_at < DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 END), ' 个长时间未更新的记录'),
    CASE
        WHEN COUNT(CASE WHEN created_at > updated_at THEN 1 END) > 0 THEN '修复时间逻辑错误'
        WHEN COUNT(CASE WHEN updated_at IS NULL AND created_at < DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 END) > 0 THEN '检查长时间未更新的记录'
        ELSE '时间序列逻辑性良好'
    END
FROM users;

-- ====================================================================
-- 4. Level 3: 高级分析验证（如果适用）
-- ====================================================================

SELECT '4. 执行Level 3高级分析验证...' as check_step;

-- 4.1 数据增长模式分析
SELECT '4.1 数据增长模式分析...' as sub_step;

-- 示例：分析用户注册趋势
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action)
SELECT
    '用户注册趋势分析',
    'users',
    CASE
        WHEN recent_registrations = 0 THEN 'WARN'
        WHEN recent_registrations < AVG_registrations * 0.5 THEN 'WARN'
        WHEN recent_registrations > AVG_registrations * 2 THEN 'INFO'
        ELSE 'INFO'
    END,
    CONCAT('最近7天注册用户数: ', recent_registrations, '，平均每日注册数: ', ROUND(AVG_registrations, 2)),
    CASE
        WHEN recent_registrations = 0 THEN '检查用户注册功能是否正常'
        WHEN recent_registrations < AVG_registrations * 0.5 THEN '考虑用户增长放缓的原因'
        WHEN recent_registrations > AVG_registrations * 2 THEN '用户增长良好，可考虑营销策略优化'
        ELSE '用户增长趋势正常'
    END
FROM (
    SELECT
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as recent_registrations,
        COUNT(*) / DATEDIFF(NOW(), MIN(created_at)) as AVG_registrations
    FROM users
    WHERE created_at IS NOT NULL
) AS trend_analysis;

-- 4.2 用户行为模式验证
SELECT '4.2 用户行为模式验证...' as sub_step;

-- 示例：分析用户活跃度
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action)
SELECT
    '用户活跃度分析',
    'users',
    CASE
        WHEN inactive_users > total_users * 0.8 THEN 'WARN'
        WHEN inactive_users > total_users * 0.5 THEN 'INFO'
        ELSE 'INFO'
    END,
    CONCAT('非活跃用户数: ', inactive_users, '，总用户数: ', total_users, '，非活跃率: ', ROUND(inactive_users * 100.0 / total_users, 2), '%'),
    CASE
        WHEN inactive_users > total_users * 0.8 THEN '用户活跃度过低，需要提升用户粘性'
        WHEN inactive_users > total_users * 0.5 THEN '考虑用户召回策略'
        ELSE '用户活跃度正常'
    END
FROM (
    SELECT
        COUNT(*) as total_users,
        COUNT(CASE WHEN last_login_at < DATE_SUB(NOW(), INTERVAL 30 DAY) OR last_login_at IS NULL THEN 1 END) as inactive_users
    FROM users
    WHERE status = 'active'
) AS activity_analysis;

-- ====================================================================
-- 5. 跨模块关联验证
-- ====================================================================

SELECT '5. 执行跨模块关联验证...' as check_step;

-- 示例：检查与其他模块的数据一致性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action)
SELECT
    '跨模块数据一致性检查',
    'users',
    CASE
        WHEN COUNT(CASE WHEN id NOT IN (SELECT user_id FROM [其他模块表] WHERE user_id IS NOT NULL) AND [相关条件] THEN 1 END) > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('发现 ', COUNT(CASE WHEN id NOT IN (SELECT user_id FROM [其他模块表] WHERE user_id IS NOT NULL) AND [相关条件] THEN 1 END), ' 个跨模块数据不一致的记录'),
    '检查相关模块的数据同步状态'
FROM users;

-- ====================================================================
-- 6. 性能和质量检查
-- ====================================================================

SELECT '6. 执行性能和质量检查...' as check_step;

-- 6.1 表大小和索引分析
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action)
SELECT
    '表性能分析',
    TABLE_NAME,
    CASE
        WHEN (DATA_LENGTH + INDEX_LENGTH) > 1024 * 1024 * 1024 THEN 'WARN' -- 大于1GB
        WHEN INDEX_LENGTH > DATA_LENGTH * 2 THEN 'WARN' -- 索引过大
        WHEN TABLE_ROWS = 0 AND DATA_LENGTH > 1024 * 1024 THEN 'WARN' -- 空表但占用空间大
        ELSE 'INFO'
    END,
    CONCAT('表大小: ', ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024, 2), 'MB，',
           '数据大小: ', ROUND(DATA_LENGTH / 1024 / 1024, 2), 'MB，',
           '索引大小: ', ROUND(INDEX_LENGTH / 1024 / 1024, 2), 'MB，',
           '估计行数: ', TABLE_ROWS),
    CASE
        WHEN (DATA_LENGTH + INDEX_LENGTH) > 1024 * 1024 * 1024 THEN '考虑数据分区或归档策略'
        WHEN INDEX_LENGTH > DATA_LENGTH * 2 THEN '优化索引设计'
        WHEN TABLE_ROWS = 0 AND DATA_LENGTH > 1024 * 1024 THEN '检查表是否有未清理的数据'
        ELSE '表性能正常'
    END
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME IN (
        -- 这里填入需要验证的表名列表
        'table1', 'table2', 'table3'
    );

-- ====================================================================
-- 7. 问题汇总和报告
-- ====================================================================

SELECT '7. 生成验证报告...' as check_step;

-- 统计验证结果
SELECT
    warning_level,
    COUNT(*) as issue_count,
    COUNT(DISTINCT table_name) as affected_tables,
    GROUP_CONCAT(DISTINCT table_name) as table_list
FROM temp_verification_results
WHERE warning_level != 'INFO'
GROUP BY warning_level
ORDER BY
    CASE warning_level
        WHEN 'CRITICAL' THEN 1
        WHEN 'ERROR' THEN 2
        WHEN 'WARN' THEN 3
        ELSE 4
    END;

-- 详细问题列表
SELECT
    warning_level,
    table_name,
    check_item,
    error_message,
    suggested_action,
    check_count
FROM temp_verification_results
WHERE warning_level != 'INFO'
ORDER BY
    CASE warning_level
        WHEN 'CRITICAL' THEN 1
        WHEN 'ERROR' THEN 2
        WHEN 'WARN' THEN 3
        ELSE 4
    END,
    table_name,
    check_item;

-- 计算总体健康评分
SELECT
    '验证完成报告' as report_section,
    '总体健康评分' as metric_name,
    ROUND(
        CASE
            WHEN (SELECT COUNT(*) FROM temp_verification_results) = 0 THEN 100
            ELSE (1 - (
                (SELECT COUNT(*) FROM temp_verification_results WHERE warning_level = 'CRITICAL') * 10 +
                (SELECT COUNT(*) FROM temp_verification_results WHERE warning_level = 'ERROR') * 5 +
                (SELECT COUNT(*) FROM temp_verification_results WHERE warning_level = 'WARN') * 1
            ) / (SELECT COUNT(*) FROM temp_verification_results)
        ) * 100, 2
    ) as metric_value,
    CASE
        WHEN (SELECT COUNT(*) FROM temp_verification_results WHERE warning_level = 'CRITICAL') > 0 THEN 'CRITICAL'
        WHEN (SELECT COUNT(*) FROM temp_verification_results WHERE warning_level = 'ERROR') > 0 THEN 'ERROR'
        WHEN (SELECT COUNT(*) FROM temp_verification_results WHERE warning_level = 'WARN') > 0 THEN 'WARN'
        ELSE 'INFO'
    END as warning_level;

-- 执行时间统计
SELECT
    '验证完成报告' as report_section,
    '总执行时间（秒）' as metric_name,
    TIMESTAMPDIFF(SECOND, @verification_start_time, NOW()) as metric_value,
    CASE
        WHEN TIMESTAMPDIFF(SECOND, @verification_start_time, NOW()) > 300 THEN 'WARN'
        ELSE 'INFO'
    END as warning_level;

-- 检查项目统计
SELECT
    '验证完成报告' as report_section,
    '总检查项目数' as metric_name,
    COUNT(*) as metric_value,
    'INFO' as warning_level
FROM temp_verification_results;

-- 改进建议汇总
SELECT
    '改进建议' as suggestion_category,
    COUNT(*) as suggestion_count,
    GROUP_CONCAT(DISTINCT suggested_action SEPARATOR '; ') as suggestions
FROM temp_verification_results
WHERE warning_level IN ('ERROR', 'WARN')
GROUP BY warning_level
ORDER BY
    CASE warning_level
        WHEN 'ERROR' THEN 1
        WHEN 'WARN' THEN 2
        ELSE 3
    END;

-- 清理临时表
DROP TEMPORARY TABLE IF EXISTS temp_verification_results;

-- 验证完成标记
SET @verification_end_time = NOW();
SELECT '=== [模块名称]数据库验证完成 ===' as verification_status;
SELECT CONCAT('验证ID: ', @current_verification_id) as verification_info;
SELECT CONCAT('开始时间: ', @verification_start_time) as verification_info;
SELECT CONCAT('结束时间: ', @verification_end_time) as verification_info;
SELECT CONCAT('总耗时: ', TIMESTAMPDIFF(SECOND, @verification_start_time, @verification_end_time), ' 秒') as verification_info;

-- 生成最终状态
SELECT
    CASE
        WHEN (SELECT COUNT(*) FROM temp_verification_results WHERE warning_level = 'CRITICAL') > 0 THEN '❌ 验证失败 - 发现严重问题'
        WHEN (SELECT COUNT(*) FROM temp_verification_results WHERE warning_level = 'ERROR') > 0 THEN '⚠️  验证完成 - 发现错误'
        WHEN (SELECT COUNT(*) FROM temp_verification_results WHERE warning_level = 'WARN') > 0 THEN '✅ 验证完成 - 发现警告'
        ELSE '✅ 验证完成 - 一切正常'
    END as final_status;