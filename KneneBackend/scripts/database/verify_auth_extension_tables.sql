-- ====================================================================
-- 认证扩展表数据库验证脚本
-- ====================================================================
-- 版本：V1.0.0
-- 描述：验证登录历史、令牌管理、邮箱验证等认证扩展表的完整性和业务逻辑
-- 作者：数据库团队
-- 日期：2025-10-30
-- 验证级别：Level 1 + Level 2（基础验证 + 业务逻辑验证）
-- 自动执行：迁移后自动执行
-- 报告格式：详细统计报告
-- 错误处理：记录警告继续
-- ====================================================================

-- 设置SQL模式
SET NAMES utf8mb4;

-- 定义变量
SET @verification_start_time = NOW();
SET @current_verification_id = CONCAT('VERIF_AUTH_', DATE_FORMAT(NOW(), '%Y%m%d_%H%i%s'), '_', CONNECTION_ID());
SET @total_errors = 0;
SET @total_warnings = 0;
SET @total_checks = 0;

SELECT '=== 认证扩展表数据库验证开始 ===' as verification_status;
SELECT CONCAT('验证ID: ', @current_verification_id) as verification_info;
SELECT CONCAT('开始时间: ', @verification_start_time) as verification_info;

-- ====================================================================
-- 1. 基础信息检查
-- ====================================================================

SELECT '1. 检查认证扩展表是否存在...' as check_step;

-- 创建临时结果表
CREATE TEMPORARY TABLE temp_verification_results (
    check_item VARCHAR(200),
    table_name VARCHAR(100),
    warning_level ENUM('CRITICAL', 'ERROR', 'WARN', 'INFO'),
    error_message TEXT,
    suggested_action TEXT,
    check_count INT DEFAULT 1,
    affected_record_count INT DEFAULT 0
) ENGINE=MEMORY;

-- 检查认证扩展表是否存在
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
        'refresh_tokens', 'login_history', 'email_verifications',
        'password_resets', 'failed_login_attempts', 'user_lockouts',
        'security_questions', 'user_security_answers'
    )
ORDER BY TABLE_NAME;

-- ====================================================================
-- 2. Level 1: 基础数据验证
-- ====================================================================

SELECT '2. 执行Level 1基础数据验证...' as check_step;

-- 2.1 刷新令牌表验证
SELECT '2.1 验证刷新令牌表基础数据...' as sub_step;

-- 检查刷新令牌表数据完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '刷新令牌表数据完整性检查',
    'refresh_tokens',
    CASE
        WHEN COUNT(*) = 0 THEN 'INFO'
        WHEN COUNT(CASE WHEN token IS NULL OR token = '' THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN user_id IS NULL THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN expires_at IS NULL THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN created_at IS NULL THEN 1 END) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('记录数: ', COUNT(*),
           '，空令牌: ', COUNT(CASE WHEN token IS NULL OR token = '' THEN 1 END),
           '，无用户ID: ', COUNT(CASE WHEN user_id IS NULL THEN 1 END),
           '，无过期时间: ', COUNT(CASE WHEN expires_at IS NULL THEN 1 END)),
    CASE
        WHEN COUNT(CASE WHEN token IS NULL OR token = '' THEN 1 END) > 0 THEN '修复空令牌记录'
        WHEN COUNT(CASE WHEN user_id IS NULL THEN 1 END) > 0 THEN '修复无用户ID的令牌'
        WHEN COUNT(CASE WHEN expires_at IS NULL THEN 1 END) > 0 THEN '设置令牌过期时间'
        ELSE '刷新令牌表数据正常'
    END,
    COUNT(CASE WHEN token IS NULL OR token = '' THEN 1 END) +
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) +
    COUNT(CASE WHEN expires_at IS NULL THEN 1 END)
FROM refresh_tokens;

-- 检查过期令牌清理情况
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '过期令牌清理检查',
    'refresh_tokens',
    CASE
        WHEN expired_tokens > total_tokens * 0.5 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('过期令牌数: ', expired_tokens, '，总数: ', total_tokens, '，过期率: ', ROUND(expired_tokens * 100.0 / total_tokens, 2), '%'),
    CASE
        WHEN expired_tokens > total_tokens * 0.5 THEN '建议清理过期令牌以释放存储空间'
        ELSE '过期令牌数量正常'
    END,
    expired_tokens
FROM (
    SELECT
        COUNT(*) as total_tokens,
        COUNT(CASE WHEN expires_at < NOW() THEN 1 END) as expired_tokens
    FROM refresh_tokens
) token_expiry_check;

-- 检查令牌唯一性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '刷新令牌唯一性检查',
    'refresh_tokens',
    CASE
        WHEN COUNT(*) - COUNT(DISTINCT token) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('发现 ', COUNT(*) - COUNT(DISTINCT token), ' 个重复的令牌'),
    CASE
        WHEN COUNT(*) - COUNT(DISTINCT token) > 0 THEN '查找并修复重复的令牌记录'
        ELSE '令牌唯一性良好'
    END,
    COUNT(*) - COUNT(DISTINCT token)
FROM refresh_tokens;

-- 2.2 登录历史表验证
SELECT '2.2 验证登录历史表基础数据...' as sub_step;

-- 检查登录历史表数据完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '登录历史表数据完整性检查',
    'login_history',
    CASE
        WHEN COUNT(*) = 0 THEN 'INFO'
        WHEN COUNT(CASE WHEN user_id IS NULL THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN login_time IS NULL THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN ip_address IS NULL THEN 1 END) THEN 'ERROR'
        WHEN COUNT(CASE WHEN user_agent IS NULL THEN 1 END) > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('记录数: ', COUNT(*),
           '，无用户ID: ', COUNT(CASE WHEN user_id IS NULL THEN 1 END),
           '，无登录时间: ', COUNT(CASE WHEN login_time IS NULL THEN 1 END),
           '，无IP地址: ', COUNT(CASE WHEN ip_address IS NULL THEN 1 END),
           '，无User-Agent: ', COUNT(CASE WHEN user_agent IS NULL THEN 1 END)),
    CASE
        WHEN COUNT(CASE WHEN user_id IS NULL THEN 1 END) > 0 THEN '修复无用户ID的登录记录'
        WHEN COUNT(CASE WHEN login_time IS NULL THEN 1 END) > 0 THEN '设置登录时间'
        WHEN COUNT(CASE WHEN ip_address IS NULL THEN 1 END) > 0 THEN '补充IP地址信息'
        WHEN COUNT(CASE WHEN user_agent IS NULL THEN 1 END) > 0 THEN '补充User-Agent信息'
        ELSE '登录历史表数据正常'
    END,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) +
    COUNT(CASE WHEN login_time IS NULL THEN 1 END) +
    COUNT(CASE WHEN ip_address IS NULL THEN 1 END) +
    COUNT(CASE WHEN user_agent IS NULL THEN 1 END)
FROM login_history;

-- 检查登录时间序列完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '登录历史时间序列检查',
    'login_history',
    CASE
        WHEN future_logins > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN login_time > NOW() THEN 1 END) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('未来时间记录: ', future_logins, '，时间顺序错误: ', time_order_errors),
    CASE
        WHEN future_logins > 0 OR time_order_errors > 0 THEN '修复登录时间逻辑错误'
        ELSE '登录历史时间序列正常'
    END,
    future_logins + time_order_errors
FROM (
    SELECT
        COUNT(CASE WHEN login_time > NOW() THEN 1 END) as future_logins,
        COUNT(CASE WHEN LAG(login_time) OVER (ORDER BY login_time) > login_time THEN 1 END) as time_order_errors
    FROM login_history
) time_sequence_check;

-- 检查登录历史数据量是否合理
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '登录历史数据量检查',
    'login_history',
    CASE
        WHEN total_records = 0 THEN 'INFO'
        WHEN recent_logins > 10000 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('总记录数: ', total_records, '，最近30天记录数: ', recent_logins),
    CASE
        WHEN recent_logins > 10000 THEN '登录历史记录过多，建议定期清理'
        ELSE '登录历史数据量正常'
    END,
    recent_logins
FROM (
    SELECT
        COUNT(*) as total_records,
        COUNT(CASE WHEN login_time >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as recent_logins
    FROM login_history
) volume_check;

-- 2.3 邮箱验证表验证
SELECT '2.3 验证邮箱验证表基础数据...' as sub_step;

-- 检查邮箱验证表数据完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '邮箱验证表数据完整性检查',
    'email_verifications',
    CASE
        WHEN COUNT(*) = 0 THEN 'INFO'
        WHEN COUNT(CASE WHEN user_id IS NULL THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN verification_code IS NULL OR verification_code = '' THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN created_at IS NULL THEN 1 END) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('记录数: ', COUNT(*),
           '，无用户ID: ', COUNT(CASE WHEN user_id IS NULL THEN 1 END),
           '，无邮箱: ', COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END),
           '，无验证码: ', COUNT(CASE WHEN verification_code IS NULL OR verification_code = '' THEN 1 END)),
    CASE
        WHEN COUNT(CASE WHEN user_id IS NULL THEN 1 END) > 0 THEN '修复无用户ID的验证记录'
        WHEN COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) > 0 THEN '修复空邮箱记录'
        WHEN COUNT(CASE WHEN verification_code IS NULL OR verification_code = '' THEN 1 END) > 0 THEN '生成验证码'
        ELSE '邮箱验证表数据正常'
    END,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) +
    COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) +
    COUNT(CASE WHEN verification_code IS NULL OR verification_code = '' THEN 1 END)
FROM email_verifications;

-- 检查验证码格式和长度
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '验证码格式和长度检查',
    'email_verifications',
    CASE
        WHEN COUNT(CASE WHEN LENGTH(verification_code) < 6 OR LENGTH(verification_code) > 10 THEN 1 END) > 0 THEN 'WARN'
        WHEN COUNT(CASE WHEN verification_code REGEXP '[^A-Za-z0-9]' THEN 1 END) > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('长度异常验证码数: ', COUNT(CASE WHEN LENGTH(verification_code) < 6 OR LENGTH(verification_code) > 10 THEN 1 END),
           '，包含特殊字符: ', COUNT(CASE WHEN verification_code REGEXP '[^A-Za-z0-9]' THEN 1 END)),
    CASE
        WHEN COUNT(CASE WHEN LENGTH(verification_code) < 6 OR LENGTH(verification_code) > 10 THEN 1 END) > 0 THEN '调整验证码长度为6-10位'
        WHEN COUNT(CASE WHEN verification_code REGEXP '[^A-Za-z0-9]' THEN 1 END) > 0 THEN '使用纯数字字母验证码'
        ELSE '验证码格式正常'
    END,
    COUNT(CASE WHEN LENGTH(verification_code) < 6 OR LENGTH(verification_code) > 10 THEN 1 END) +
    COUNT(CASE WHEN verification_code REGEXP '[^A-Za-z0-9]' THEN 1 END)
FROM email_verifications
WHERE verification_code IS NOT NULL;

-- 检查过期验证码清理情况
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '过期验证码清理检查',
    'email_verifications',
    CASE
        WHEN expired_verifications > total_verifications * 0.7 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('过期验证码数: ', expired_verifications, '，总数: ', total_verifications, '，过期率: ', ROUND(expired_verifications * 100.0 / total_verifications, 2), '%'),
    CASE
        WHEN expired_verifications > total_verifications * 0.7 THEN '建议清理过期验证码以释放存储空间'
        ELSE '过期验证码数量正常'
    END,
    expired_verifications
FROM (
    SELECT
        COUNT(*) as total_verifications,
        COUNT(CASE WHEN expires_at < NOW() THEN 1 END) as expired_verifications
    FROM email_verifications
) verification_expiry_check;

-- 2.4 密码重置表验证
SELECT '2.4 验证密码重置表基础数据...' as sub_step;

-- 检查密码重置表数据完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '密码重置表数据完整性检查',
    'password_resets',
    CASE
        WHEN COUNT(*) = 0 THEN 'INFO'
        WHEN COUNT(CASE WHEN user_id IS NULL THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN reset_token IS NULL OR reset_token = '' THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN expires_at IS NULL THEN 1 END) THEN 'ERROR'
        WHEN COUNT(CASE WHEN created_at IS NULL THEN 1 END) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('记录数: ', COUNT(*),
           '，无用户ID: ', COUNT(CASE WHEN user_id IS NULL THEN 1 END),
           '，无重置令牌: ', COUNT(CASE WHEN reset_token IS NULL OR reset_token = '' THEN 1 END),
           '，无过期时间: ', COUNT(CASE WHEN expires_at IS NULL THEN 1 END)),
    CASE
        WHEN COUNT(CASE WHEN user_id IS NULL THEN 1 END) > 0 THEN '修复无用户ID的重置记录'
        WHEN COUNT(CASE WHEN reset_token IS NULL OR reset_token = '' THEN 1 END) > 0 THEN '生成重置令牌'
        WHEN COUNT(CASE WHEN expires_at IS NULL THEN 1 END) > 0 THEN '设置重置令牌过期时间'
        ELSE '密码重置表数据正常'
    END,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) +
    COUNT(CASE WHEN reset_token IS NULL OR reset_token = '' THEN 1 END) +
    COUNT(CASE WHEN expires_at IS NULL THEN 1 END)
FROM password_resets;

-- 检查重置令牌唯一性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '重置令牌唯一性检查',
    'password_resets',
    CASE
        WHEN COUNT(*) - COUNT(DISTINCT reset_token) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('发现 ', COUNT(*) - COUNT(DISTINCT reset_token), ' 个重复的重置令牌'),
    CASE
        WHEN COUNT(*) - COUNT(DISTINCT reset_token) > 0 THEN '查找并修复重复的重置令牌记录'
        ELSE '重置令牌唯一性良好'
    END,
    COUNT(*) - COUNT(DISTINCT reset_token)
FROM password_resets;

-- 2.5 登录失败记录表验证
SELECT '2.5 验证登录失败记录表基础数据...' as sub_step;

-- 检查登录失败记录表数据完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '登录失败记录表数据完整性检查',
    'failed_login_attempts',
    CASE
        WHEN COUNT(*) = 0 THEN 'INFO'
        WHEN COUNT(CASE WHEN user_id IS NULL THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN ip_address IS NULL THEN 1 END) THEN 'ERROR'
        WHEN COUNT(CASE WHEN failed_at IS NULL THEN 1 END) THEN 'ERROR'
        WHEN COUNT(CASE WHEN failure_reason IS NULL OR failure_reason = '' THEN 1 END) > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('记录数: ', COUNT(*),
           '，无用户ID: ', COUNT(CASE WHEN user_id IS NULL THEN 1 END),
           '，无IP地址: ', COUNT(CASE WHEN ip_address IS NULL THEN 1 END),
           '，无失败时间: ', COUNT(CASE WHEN failed_at IS NULL THEN 1 END),
           '，无失败原因: ', COUNT(CASE WHEN failure_reason IS NULL OR failure_reason = '' THEN 1 END)),
    CASE
        WHEN COUNT(CASE WHEN user_id IS NULL THEN 1 END) > 0 THEN '修复无用户ID的失败记录'
        WHEN COUNT(CASE WHEN ip_address IS NULL THEN 1 END) THEN '补充IP地址信息'
        WHEN COUNT(CASE WHEN failed_at IS NULL THEN 1 END) THEN '设置失败时间'
        WHEN COUNT(CASE WHEN failure_reason IS NULL OR failure_reason = '' THEN 1 END) THEN '补充失败原因'
        ELSE '登录失败记录表数据正常'
    END,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) +
    COUNT(CASE WHEN ip_address IS NULL THEN 1 END) +
    COUNT(CASE WHEN failed_at IS NULL THEN 1 END) +
    COUNT(CASE WHEN failure_reason IS NULL OR failure_reason = '' THEN 1 END)
FROM failed_login_attempts;

-- 检查失败原因分类
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '登录失败原因分类检查',
    'failed_login_attempts',
    CASE
        WHEN unknown_reasons > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('未知失败原因数: ', unknown_reasons, '，总失败数: ', total_failures),
    CASE
        WHEN unknown_reasons > 0 THEN '完善失败原因分类'
        ELSE '失败原因分类正常'
    END,
    unknown_reasons
FROM (
    SELECT
        COUNT(*) as total_failures,
        COUNT(CASE WHEN failure_reason IS NULL OR failure_reason = '' OR failure_reason NOT IN ('Invalid credentials', 'Account locked', 'Account not verified', 'Too many attempts') THEN 1 END) as unknown_reasons
    FROM failed_login_attempts
) failure_reason_check;

-- 2.6 用户锁定表验证
SELECT '2.6 验证用户锁定表基础数据...' as sub_step;

-- 检查用户锁定表数据完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '用户锁定表数据完整性检查',
    'user_lockouts',
    CASE
        WHEN COUNT(*) = 0 THEN 'INFO'
        WHEN COUNT(CASE WHEN user_id IS NULL THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN lock_reason IS NULL OR lock_reason = '' THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN locked_at IS NULL THEN 1 END) THEN 'ERROR'
        WHEN COUNT(CASE WHEN lock_until IS NULL THEN 1 END) THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('记录数: ', COUNT(*),
           '，无用户ID: ', COUNT(CASE WHEN user_id IS NULL THEN 1 END),
           '，无锁定原因: ', COUNT(CASE WHEN lock_reason IS NULL OR lock_reason = '' THEN 1 END),
           '，无锁定时间: ', COUNT(CASE WHEN locked_at IS NULL THEN 1 END),
           '无解锁时间: ', COUNT(CASE WHEN lock_until IS NULL THEN 1 END)),
    CASE
        WHEN COUNT(CASE WHEN user_id IS NULL THEN 1 END) > 0 THEN '修复无用户ID的锁定记录'
        WHEN COUNT(CASE WHEN lock_reason IS NULL OR lock_reason = '' THEN 1 END) THEN '补充锁定原因'
        WHEN COUNT(CASE WHEN locked_at IS NULL THEN 1 END) THEN '设置锁定时间'
        WHEN COUNT(CASE WHEN lock_until IS NULL THEN 1 END) THEN '设置解锁时间'
        ELSE '用户锁定表数据正常'
    END,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) +
    COUNT(CASE WHEN lock_reason IS NULL OR lock_reason = '' THEN 1 END) +
    COUNT(CASE WHEN locked_at IS NULL THEN 1 END) +
    COUNT(CASE WHEN lock_until IS NULL THEN 1 END)
FROM user_lockouts;

-- 检查过期锁定状态
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '过期锁定状态检查',
    'user_lockouts',
    CASE
        WHEN expired_locks > 0 THEN 'INFO'
        ELSE 'INFO'
    END,
    CONCAT('过期锁定数: ', expired_locks, '，当前锁定数: ', active_locks),
    CASE
        WHEN expired_locks > 0 THEN '有 ', expired_locks, ' 个用户锁定已过期，可以考虑自动解锁'
        ELSE '锁定状态正常'
    END,
    expired_locks
FROM (
    SELECT
        COUNT(CASE WHEN lock_until < NOW() THEN 1 END) as expired_locks,
        COUNT(CASE WHEN lock_until >= NOW() THEN 1 END) as active_locks
    FROM user_lockouts
) lock_status_check;

-- 2.7 安全问题和答案表验证（如果存在）
SELECT '2.7 验证安全问题和答案表基础数据...' as sub_step;

-- 检查表是否存在
SET @security_questions_exists = (SELECT COUNT(*) FROM information_schema.TABLES
                                    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'security_questions');

SET @security_answers_exists = (SELECT COUNT(*) FROM information_schema.TABLES
                                    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user_security_answers');

-- 检查安全问题表
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '安全问题表数据完整性检查',
    'security_questions',
    CASE
        WHEN @security_questions_exists = 0 THEN 'INFO'
        WHEN COUNT(*) = 0 THEN 'INFO'
        WHEN COUNT(CASE WHEN question_text IS NULL OR question_text = '' THEN 1 END) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('安全问题表状态: ',
           CASE WHEN @security_questions_exists = 0 THEN '表不存在'
                WHEN COUNT(*) = 0 THEN '表为空'
                ELSE CONCAT('正常，记录数: ', COUNT(*))
           END),
    CASE
        WHEN COUNT(CASE WHEN question_text IS NULL OR question_text = '' THEN 1 END) > 0 THEN '修复空问题文本'
        ELSE '安全问题表正常'
    END,
    CASE WHEN @security_questions_exists = 0 THEN 0 ELSE COUNT(CASE WHEN question_text IS NULL OR question_text = '' THEN 1 END) END
FROM security_questions
WHERE @security_questions_exists = 1;

-- 检查用户安全答案表
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '用户安全答案表数据完整性检查',
    'user_security_answers',
    CASE
        WHEN @security_answers_exists = 0 THEN 'INFO'
        WHEN COUNT(*) = 0 THEN 'INFO'
        WHEN COUNT(CASE WHEN user_id IS NULL THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN question_id IS NULL THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN answer_text IS NULL OR answer_text = '' THEN 1 END) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('用户安全答案表状态: ',
           CASE WHEN @security_answers_exists = 0 THEN '表不存在'
                WHEN COUNT(*) = 0 THEN '表为空'
                ELSE CONCAT('正常，记录数: ', COUNT(*))
           END),
    CASE
        WHEN COUNT(CASE WHEN user_id IS NULL THEN 1 END) > 0 THEN '修复无用户ID的答案记录'
        WHEN COUNT(CASE WHEN question_id IS NULL THEN 1 END) > 0 THEN '修复无问题ID的答案'
        WHEN COUNT(CASE WHEN answer_text IS NULL OR answer_text = '' THEN 1 END) > 0 THEN '修复空答案文本'
        ELSE '用户安全答案表正常'
    END,
    CASE WHEN @security_answers_exists = 0 THEN 0 ELSE COUNT(CASE WHEN user_id IS NULL THEN 1 END) + COUNT(CASE WHEN question_id IS NULL THEN 1 END) + COUNT(CASE WHEN answer_text IS NULL OR answer_text = '' THEN 1 END) END
FROM user_security_answers
WHERE @security_answers_exists = 1;

-- ====================================================================
-- 3. Level 2: 业务规则验证
-- ====================================================================

SELECT '3. 执行Level 2业务规则验证...' as check_step;

-- 3.1 认证流程完整性验证
SELECT '3.1 验证认证流程完整性...' as sub_step;

-- 检查用户的认证方式完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '用户认证方式完整性检查',
    'users',
    CASE
        WHEN users_without_auth > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('没有认证方式的用户数: ', users_without_auth),
    CASE
        WHEN users_without_auth > 0 THEN '为这些用户设置认证方式'
        ELSE '用户认证方式完整'
    END,
    users_without_auth
FROM (
    SELECT
        COUNT(*) as total_users,
        COUNT(CASE WHEN password_hash IS NULL OR password_hash = '' THEN 1 END) as users_without_auth
    FROM users
) auth_completeness;

-- 检查邮箱验证覆盖率
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '邮箱验证覆盖率检查',
    'users',
    CASE
        WHEN email_verified_users < total_users * 0.5 THEN 'WARN'
        WHEN email_verified_users = 0 AND total_users > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('邮箱已验证用户: ', email_verified_users, '，总用户数: ', total_users, '，覆盖率: ', ROUND(email_verified_users * 100.0 / total_users, 2), '%'),
    CASE
        WHEN email_verified_users = 0 AND total_users > 0 THEN '所有用户都未验证邮箱，需要强制验证'
        WHEN email_verified_users < total_users * 0.5 THEN '邮箱验证覆盖率偏低，建议推广验证'
        ELSE '邮箱验证覆盖率良好'
    END,
    total_users - email_verified_users
FROM (
    SELECT
        COUNT(*) as total_users,
        COUNT(CASE WHEN u.email_verified = 1 THEN 1 END) as email_verified_users
    FROM users u
) email_coverage_check;

-- 3.2 登录安全性验证
SELECT '3.2 验证登录安全性...' as sub_step;

-- 检查异常登录模式
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '异常登录模式检查',
    'cross_module',
    CASE
        WHEN suspicious_logins > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('可疑登录次数: ', suspicious_logins),
    CASE
        WHEN suspicious_logins > 0 THEN '加强可疑IP的监控和安全措施'
        ELSE '登录模式正常'
    END,
    suspicious_logins
FROM (
    SELECT COUNT(*) as suspicious_logins
    FROM login_history lh
    JOIN failed_login_attempts fla ON lh.ip_address = fla.ip_address
    WHERE fla.failure_count >= 5
    AND lh.login_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
) suspicious_login_check;

-- 检查暴力破解攻击模式
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '暴力破解攻击模式检查',
    'cross_module',
    CASE
        WHEN brute_force_attempts > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('疑似暴力破解尝试: ', brute_force_attempts),
    CASE
        WHEN brute_force_attempts > 0 THEN '对目标IP实施临时封禁'
        ELSE '未发现暴力破解攻击'
    END,
    brute_force_attempts
FROM (
    SELECT COUNT(*) as brute_force_attempts
    FROM failed_login_attempts fla
    WHERE fla.failure_count >= 10
    AND fla.failed_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
) brute_force_check;

-- 检查登录时间分布异常
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '登录时间分布异常检查',
    'cross_module',
    CASE
        WHEN off_hours_logins > total_logins * 0.3 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('非工作时间登录: ', off_hours_logins, '，总登录: ', total_logins, '，非工作时间登录率: ', ROUND(off_hours_logins * 100.0 / total_logins, 2), '%'),
    CASE
        WHEN off_hours_logins > total_logins * 0.3 THEN '检查非工作时间登录的合理性'
        ELSE '登录时间分布正常'
    END,
    off_hours_logins
FROM (
    SELECT
        COUNT(*) as total_logins,
        COUNT(CASE WHEN HOUR(login_time) < 6 OR HOUR(login_time) > 22 THEN 1 END) as off_hours_logins
    FROM login_history
    WHERE login_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
) login_time_distribution;

-- 3.3 令牌管理安全性验证
SELECT '3.3 验证令牌管理安全性...' as sub_step;

-- 检查令牌泄露风险
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, extended_data, suggested_action, affected_record_count)
SELECT
    '令牌泄露风险检查',
    'refresh_tokens',
    CASE
        WHEN same_ip_multiple_tokens > 0 THEN 'ERROR'
        WHEN wide_ip_tokens > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('同IP多令牌: ', same_ip_multiple_tokens, '，广域IP令牌: ', wide_ip_tokens),
    CASE
        WHEN same_ip_multiple_tokens > 0 THEN '可能存在令牌泄露风险，建议强制登出相关用户'
        WHEN wide_ip_tokens > 0 THEN '检查广域IP令牌的合理性'
        ELSE '令牌使用模式正常'
    END,
    JSON_OBJECT('same_ip_multiple_tokens', same_ip_multiple_tokens, 'wide_ip_tokens', wide_ip_tokens) as extended_data,
    1
FROM (
    SELECT
        COUNT(CASE WHEN token_count > 1 THEN 1 END) as same_ip_multiple_tokens,
        COUNT(CASE WHEN ip_location = 'Wide' THEN 1 END) as wide_ip_tokens
    FROM (
        SELECT
            ip_address,
            COUNT(*) as token_count,
            CASE
                WHEN SUBSTRING_INDEX(ip_address, '.', 1) = SUBSTRING_INDEX(ip_address, '.', 2) THEN 'Local'
                WHEN SUBSTRING_INDEX(ip_address, '.', 1) = '10' OR SUBSTRING_INDEX(ip_address, '.', 1) = '192' THEN 'Private'
                ELSE 'Wide'
            END as ip_location
        FROM refresh_tokens rt
        JOIN (
            SELECT user_id, MAX(created_at) as latest_created
            FROM refresh_tokens
            WHERE expires_at > NOW()
            GROUP BY user_id
        ) latest_tokens ON rt.user_id = latest_tokens.user_id AND rt.created_at = latest_tokens.latest_created
        GROUP BY ip_address
    ) token_analysis
) token_leakage_check;

-- 检查令牌生命周期管理
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '令牌生命周期管理检查',
    'refresh_tokens',
    CASE
        WHEN very_long_lived_tokens > 0 THEN 'WARN'
        WHEN very_short_lived_tokens > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('超长生命周期令牌: ', very_long_lived_tokens, '，超短生命周期令牌: ', very_short_lived_tokens),
    CASE
        WHEN very_long_lived_tokens > 0 THEN '调整令牌生命周期策略，缩短过期时间'
        WHEN very_short_lived_tokens > 0 THEN '检查令牌过期时间设置是否合理'
        ELSE '令牌生命周期管理正常'
    END,
    very_long_lived_tokens + very_short_lived_tokens
FROM (
    SELECT
        COUNT(CASE WHEN DATEDIFF(expires_at, created_at) > 90 THEN 1 END) as very_long_lived_tokens,
        COUNT(CASE WHEN DATEDIFF(expires_at, created_at) < 1 THEN 1 END) as very_short_lived_tokens
    FROM refresh_tokens
    WHERE expires_at > NOW()
) token_lifecycle_check;

-- 3.4 密码重置安全性验证
SELECT '3.4 验证密码重置安全性...' as sub_step;

-- 检查密码重令码强度
INSERT INTO temp_verification_results (check_class, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '密码重置令码强度检查',
    'password_resets',
    CASE
        WHEN weak_tokens > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('弱重置令牌数: ', weak_tokens, '，总令牌数: ', total_tokens),
    CASE
        WHEN weak_tokens > 0 THEN '加强重置令牌复杂度要求'
        ELSE '重置令码强度正常'
    END,
    weak_tokens
FROM (
    SELECT
        COUNT(*) as total_tokens,
        COUNT(CASE WHEN LENGTH(reset_token) < 32 OR reset_token REGEXP '[a-zA-Z]' THEN 1 END) as weak_tokens
    FROM password_resets
) token_strength_check;

-- 检查密码重置请求频率
INSERT INTO_temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '密码重置请求频率检查',
    'password_resets',
    CASE
        WHEN high_frequency_resets > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('高频重置请求用户数: ', high_frequency_resets, '，总重置请求数: ', total_resets),
    CASE
        WHEN high_frequency_resets > 0 THEN '对高频重置请求的用户实施限制'
        ELSE '重置请求频率正常'
    END,
    high_frequency_resets
FROM (
    SELECT
        COUNT(*) as total_resets,
        COUNT(CASE WHEN request_count >= 5 THEN 1 END) as high_frequency_resets
    FROM (
        SELECT user_id, COUNT(*) as request_count
        FROM password_resets
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        GROUP BY user_id
    ) reset_frequency
) frequency_check;

-- 3.5 用户锁定机制验证
SELECT '3.5 验证用户锁定机制...' as sub_step;

-- 检查锁定策略的一致性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '用户锁定策略一致性检查',
    'cross_module',
    CASE
        WHEN inconsistent_locks > 0 THEN 'ERROR'
        WHEN permanent_locks > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('不一致的锁定记录: ', inconsistent_locks, '，永久锁定用户数: ', permanent_locks),
    CASE
        WHEN inconsistent_locks > 0 THEN '修复锁定状态不一致问题'
        WHEN permanent_locks > 0 THEN '检查永久锁定用户的处理策略'
        ELSE '锁定策略一致性良好'
    END,
    inconsistent_locks + permanent_locks
FROM (
    SELECT
        COUNT(CASE WHEN ul.lock_until < NOW() AND ul.is_active = 1 THEN 1 END) as inconsistent_locks,
        COUNT(CASE WHEN ul.lock_until IS NULL AND ul.is_active = 1 THEN 1 END) as permanent_locks
    FROM user_lockouts ul
        JOIN users u ON ul.user_id = u.id
    WHERE u.status = 'active'
) lock_strategy_check;

-- 检查自动解锁机制
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '自动解锁机制检查',
    'user_lockouts',
    CASE
        WHEN expired_unlocks = 0 AND expired_locks_available > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('过期未解锁数: ', expired_unlocks, '，过期总锁数: ', expired_locks_available),
    CASE
        WHEN expired_unlocks = 0 AND expired_locks_available > 0 THEN '实现自动解锁机制或手动处理过期锁定'
        ELSE '自动解锁机制正常'
    END,
    expired_unlocks
FROM (
    SELECT
        COUNT(CASE WHEN lock_until < NOW() AND is_active = 1 THEN 1 END) as expired_locks_available
    FROM user_lockouts
) auto_unlock_check;

-- ====================================================================
-- 4. 跨模块关联验证
-- ====================================================================

SELECT '4. 执行跨模块关联验证...' as check_step;

-- 检查认证相关表与用户表的一致性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '认证相关表与用户表一致性检查',
    'cross_module',
    CASE
        WHEN orphaned_auth_records > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('认证相关表孤立记录数: ', orphaned_auth_records),
    CASE
        WHEN orphaned_auth_records > 0 THEN '清理认证相关表中的孤立记录'
        ELSE '认证相关表与用户表一致性良好'
    END,
    orphaned_auth_records
FROM (
    SELECT
        (SELECT COUNT(*) FROM refresh_tokens WHERE user_id NOT IN (SELECT id FROM users)) +
        (SELECT COUNT(*) FROM login_history WHERE user_id NOT IN (SELECT id FROM users)) +
        (SELECT COUNT(*) FROM email_verifications WHERE user_id NOT IN (SELECT id FROM users)) +
        (SELECT COUNT(*) FROM password_resets WHERE user_id NOT IN (SELECT id FROM users)) +
        (SELECT COUNT(*) FROM failed_login_attempts WHERE user_id NOT IN (SELECT id FROM users)) +
        (SELECT COUNT(*) FROM user_lockouts WHERE user_id NOT IN (SELECT id FROM users))
        as orphaned_auth_records
) auth_consistency_check;

-- 检查登录失败与用户锁定的关联
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '登录失败与用户锁定关联检查',
    'cross_module',
    CASE
        WHEN locked_users_without_failures > 0 THEN 'WARN'
        WHEN failed_users_not_locked > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('被锁定但无失败记录用户: ', locked_users_without_failures, '，有失败记录但未被锁定用户: ', failed_users_not_locked),
    CASE
        WHEN locked_users_without_failures > 0 THEN '检查用户锁定的触发机制'
        WHEN failed_users_not_locked > 0 THEN '检查自动锁定机制的执行'
        ELSE '登录失败与用户锁定关联正常'
    END,
    locked_users_without_failures + failed_users_not_locked
FROM (
    SELECT
        (SELECT COUNT(*) FROM user_lockouts ul WHERE ul.is_active = 1
         AND ul.user_id NOT IN (SELECT user_id FROM failed_login_attempts WHERE failure_count >= 3)) as locked_users_without_failures,
        (SELECT COUNT(DISTINCT user_id) FROM failed_login_attempts WHERE failure_count >= 3
         AND user_id NOT IN (SELECT user_id FROM user_lockouts WHERE is_active = 1)) as failed_users_not_locked
    ) lock_failure_association_check;

-- ====================================================================
-- 5. 性能和质量检查
-- ====================================================================

SELECT '5. 执行性能和质量检查...' as check_step;

-- 检查认证相关表的性能指标
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '认证相关表性能分析',
    TABLE_NAME,
    CASE
        WHEN (DATA_LENGTH + INDEX_LENGTH) > 1024 * 1024 * 1024 THEN 'WARN'  -- 大于1GB
        WHEN INDEX_LENGTH > DATA_LENGTH * 2 THEN 'WARN'           -- 索引过大
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
    END,
    1
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME IN (
        'refresh_tokens', 'login_history', 'email_verifications',
        'password_resets', 'failed_login_attempts', 'user_lockouts',
        'security_questions', 'user_security_answers'
    )
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;

-- 检查高频访问表的索引优化
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '高频访问表索引优化检查',
    'auth_tables',
    CASE
        WHEN login_history_without_indexes > 0 THEN 'WARN'
        WHEN refresh_tokens_without_indexes > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('login_history无索引: ', login_history_without_indexes,
           '，refresh_tokens无索引: ', refresh_tokens_without_indexes),
    CASE
        WHEN login_history_without_indexes > 0 THEN '为login_history表添加适当的索引'
        WHEN refresh_tokens_without_indexes > 0 THEN '为refresh_tokens表添加适当的索引'
        ELSE '索引优化良好'
    END,
    login_history_without_indexes + refresh_tokens_without_indexes
FROM (
    SELECT
        (SELECT 0 as login_history_without_indexes FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'login_history'
         AND TABLE_NAME NOT IN (SELECT TABLE_NAME FROM information_schema.STATISTICS
         WHERE TABLE_SCHEMA = DATABASE() AND INDEX_NAME != 'PRIMARY')) +
        (SELECT 0 as refresh_tokens_without_indexes FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'refresh_tokens'
         AND TABLE_NAME NOT IN (SELECT TABLE_NAME FROM information_schema.STATISTICS
         WHERE TABLE_SCHEMA = DATABASE() AND INDEX_NAME != 'PRIMARY'))
    ) index_optimization_check;

-- ====================================================================
-- 6. 问题汇总和报告
-- ====================================================================

SELECT '6. 生成验证报告...' as check_step;

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
    check_count,
    affected_record_count
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

-- 按表分类的问题统计
SELECT
    table_name,
    COUNT(*) as total_issues,
    COUNT(CASE WHEN warning_level = 'CRITICAL' THEN 1 END) as critical_issues,
    COUNT(CASE WHEN warning_level = 'ERROR' THEN 1 END) as error_issues,
    COUNT(CASE WHEN warning_level = 'WARN' THEN 1 END) as warning_issues,
    COUNT(CASE WHEN warning_level = 'INFO' THEN 1 END) as info_issues
FROM temp_verification_results
GROUP BY table_name
ORDER BY (critical_issues * 10 + error_issues * 5 + warning_issues * 1) DESC;

-- 按检查类型分类的问题统计
SELECT
    SUBSTRING_INDEX(check_item, ' ', 1) as check_category,
    COUNT(*) as total_issues,
    COUNT(CASE WHEN warning_level = 'CRITICAL' THEN 1 END) as critical_issues,
    COUNT(CASE WHEN warning_level = 'ERROR' THEN 1 END) as error_issues,
    COUNT(CASE WHEN warning_level = 'WARN' THEN 1 END) as warning_issues
FROM temp_verification_results
GROUP BY SUBSTRING_INDEX(check_item, ' ', 1)
ORDER BY total_issues DESC;

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

-- 认证系统数据量统计
SELECT
    '验证完成报告' as report_section,
    '认证系统数据量统计' as metric_name,
    '活跃刷新令牌数' as active_tokens,
    '今日登录次数' as today_logins,
    '待验证邮箱数' as pending_verifications,
    '待处理密码重置数' as pending_resets,
    '活跃用户锁定数' as active_lockouts
FROM (
    SELECT
        (SELECT COUNT(*) FROM refresh_tokens WHERE expires_at > NOW()) as active_tokens,
        (SELECT COUNT(*) FROM login_history WHERE DATE(login_time) = CURDATE()) as today_logins,
        (SELECT COUNT(*) FROM email_verifications WHERE status = 'pending' AND expires_at > NOW()) as pending_verifications,
        (SELECT COUNT(*) FROM password_resets WHERE status = 'pending' AND expires_at > NOW()) as pending_resets,
        (SELECT COUNT(*) FROM user_lockouts WHERE is_active = 1 AND lock_until > NOW()) as active_lockouts
) auth_stats;

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

-- 认证安全健康度评估
SELECT
    '认证安全健康度评估' as assessment_category,
    '令牌管理安全' as domain,
    CASE
        WHEN token_security_issues = 0 THEN '健康'
        WHEN token_security_issues > 0 AND token_security_issues < 3 THEN '需要注意'
        ELSE '有问题'
    END as health_status,
    CONCAT('令牌安全问题数: ', token_security_issues) as details
FROM (
    SELECT COUNT(*) as token_security_issues
    FROM temp_verification_results
    WHERE table_name = 'refresh_tokens' AND warning_level != 'INFO'
) token_security_assessment;

SELECT
    '认证安全健康度评估' as assessment_category,
    '登录安全监控' as domain,
    CASE
        WHEN login_security_issues = 0 THEN '健康'
        WHEN login_security_issues > 0 AND login_security_issues < 5 THEN '需要注意'
        ELSE '有问题'
    END as health_status,
    CONCAT('登录安全问题数: ', login_security_issues) as details
FROM (
    SELECT COUNT(*) as login_security_issues
    FROM temp_verification_results
    WHERE (table_name = 'login_history' OR table_name = 'failed_login_attempts') AND warning_level != 'INFO'
) login_security_assessment;

SELECT
    '认证安全健康度评估' as assessment_category,
    '密码重置安全' as domain,
    CASE
        WHEN reset_security_issues = 0 THEN '健康'
        WHEN reset_security_issues > 0 AND reset_security_issues < 3 THEN '需要注意'
        ELSE '有问题'
    END as health_status,
    CONCAT('密码重置安全问题数: ', reset_security_issues) as details
FROM (
    SELECT COUNT(*) as reset_security_issues
    FROM temp_verification_results
    WHERE table_name = 'password_resets' AND warning_level != 'INFO'
) reset_security_assessment;

-- 清理临时表
DROP TEMPORARY TABLE IF EXISTS temp_verification_results;

-- 验证完成标记
SET @verification_end_time = NOW();
SELECT '=== 认证扩展表数据库验证完成 ===' as verification_status;
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