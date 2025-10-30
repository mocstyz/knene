-- ====================================================================
-- 核心基础表数据库验证脚本
-- ====================================================================
-- 版本：V1.0.0
-- 描述：验证用户权限、系统配置等核心基础表的完整性和业务逻辑
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
SET @current_verification_id = CONCAT('VERIF_CORE_', DATE_FORMAT(NOW(), '%Y%m%d_%H%i%s'), '_', CONNECTION_ID());
SET @total_errors = 0;
SET @total_warnings = 0;
SET @total_checks = 0;

SELECT '=== 核心基础表数据库验证开始 ===' as verification_status;
SELECT CONCAT('验证ID: ', @current_verification_id) as verification_info;
SELECT CONCAT('开始时间: ', @verification_start_time) as verification_info;

-- ====================================================================
-- 1. 基础信息检查
-- ====================================================================

SELECT '1. 检查核心基础表是否存在...' as check_step;

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

-- 检查核心基础表是否存在
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
        'users', 'user_profiles', 'roles', 'permissions',
        'user_roles', 'role_permissions',
        'system_configs', 'dictionaries', 'file_storages',
        'operation_logs', 'audit_logs'
    )
ORDER BY TABLE_NAME;

-- ====================================================================
-- 2. Level 1: 基础数据验证
-- ====================================================================

SELECT '2. 执行Level 1基础数据验证...' as check_step;

-- 2.1 用户表基础验证
SELECT '2.1 验证用户表基础数据...' as sub_step;

-- 检查用户表是否存在数据
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '用户表数据存在性检查',
    'users',
    CASE
        WHEN COUNT(*) = 0 THEN 'CRITICAL'
        ELSE 'INFO'
    END,
    CONCAT('用户表记录数: ', COUNT(*)),
    CASE
        WHEN COUNT(*) = 0 THEN '用户表为空，需要检查数据导入过程'
        ELSE '用户表数据正常'
    END,
    COUNT(*)
FROM users;

-- 检查用户表必填字段完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '用户表必填字段完整性检查',
    'users',
    CASE
        WHEN COUNT(CASE WHEN username IS NULL OR username = '' THEN 1 END) > 0 OR
             COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) > 0 OR
             COUNT(CASE WHEN password_hash IS NULL OR password_hash = '' THEN 1 END) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('发现空用户名: ', COUNT(CASE WHEN username IS NULL OR username = '' THEN 1 END),
           '，空邮箱: ', COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END),
           '，空密码: ', COUNT(CASE WHEN password_hash IS NULL OR password_hash = '' THEN 1 END)),
    CASE
        WHEN COUNT(CASE WHEN username IS NULL OR username = '' THEN 1 END) > 0 OR
             COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) > 0 OR
             COUNT(CASE WHEN password_hash IS NULL OR password_hash = '' THEN 1 END) > 0 THEN '修复空字段或补充必要数据'
        ELSE '用户表必填字段完整性良好'
    END,
    COUNT(CASE WHEN username IS NULL OR username = '' THEN 1 END) +
    COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) +
    COUNT(CASE WHEN password_hash IS NULL OR password_hash = '' THEN 1 END)
FROM users;

-- 检查用户表邮箱格式
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '用户表邮箱格式验证',
    'users',
    CASE
        WHEN COUNT(CASE WHEN email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' THEN 1 END) > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('发现 ', COUNT(CASE WHEN email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' THEN 1 END), ' 个格式不正确的邮箱'),
    CASE
        WHEN COUNT(CASE WHEN email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' THEN 1 END) > 0 THEN '修复邮箱格式或联系用户更新'
        ELSE '邮箱格式正确'
    END,
    COUNT(CASE WHEN email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' THEN 1 END)
FROM users;

-- 检查用户表唯一性约束
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '用户表用户名唯一性检查',
    'users',
    CASE
        WHEN COUNT(*) - COUNT(DISTINCT username) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('发现 ', COUNT(*) - COUNT(DISTINCT username), ' 个重复的用户名'),
    CASE
        WHEN COUNT(*) - COUNT(DISTINCT username) > 0 THEN '查找并修复重复的用户名记录'
        ELSE '用户名唯一性良好'
    END,
    COUNT(*) - COUNT(DISTINCT username)
FROM users;

INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '用户表邮箱唯一性检查',
    'users',
    CASE
        WHEN COUNT(*) - COUNT(DISTINCT email) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('发现 ', COUNT(*) - COUNT(DISTINCT email), ' 个重复的邮箱'),
    CASE
        WHEN COUNT(*) - COUNT(DISTINCT email) > 0 THEN '查找并修复重复的邮箱记录'
        ELSE '邮箱唯一性良好'
    END,
    COUNT(*) - COUNT(DISTINCT email)
FROM users;

-- 2.2 用户档案表验证
SELECT '2.2 验证用户档案表基础数据...' as sub_step;

-- 检查用户档案表与用户表的一致性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '用户档案与用户表一致性检查',
    'user_profiles',
    CASE
        WHEN COUNT(CASE WHEN u.id IS NULL THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN up.id IS NULL THEN 1 END) > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('档案表多余记录: ', COUNT(CASE WHEN u.id IS NULL THEN 1 END),
           '，用户表缺少档案: ', COUNT(CASE WHEN up.id IS NULL THEN 1 END)),
    CASE
        WHEN COUNT(CASE WHEN u.id IS NULL THEN 1 END) > 0 THEN '清理用户档案表中的孤立记录'
        WHEN COUNT(CASE WHEN up.id IS NULL THEN 1 END) > 0 THEN '为缺少档案的用户创建默认档案'
        ELSE '用户档案与用户表一致性良好'
    END,
    COUNT(CASE WHEN u.id IS NULL THEN 1 END) + COUNT(CASE WHEN up.id IS NULL THEN 1 END)
FROM users u
FULL OUTER JOIN user_profiles up ON u.id = up.user_id;

-- 2.3 角色权限表验证
SELECT '2.3 验证角色权限表基础数据...' as sub_step;

-- 检查角色表数据完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '角色表数据完整性检查',
    'roles',
    CASE
        WHEN COUNT(*) = 0 THEN 'CRITICAL'
        WHEN COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('角色记录数: ', COUNT(*), '，空角色名: ', COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END)),
    CASE
        WHEN COUNT(*) = 0 THEN '角色表为空，需要检查初始化脚本'
        WHEN COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END) > 0 THEN '修复空角色名'
        ELSE '角色表数据正常'
    END,
    COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END)
FROM roles;

-- 检查权限表数据完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '权限表数据完整性检查',
    'permissions',
    CASE
        WHEN COUNT(*) = 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('权限记录数: ', COUNT(*), '，空权限名: ', COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END)),
    CASE
        WHEN COUNT(*) = 0 THEN '权限表为空，需要检查初始化脚本'
        WHEN COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END) > 0 THEN '修复空权限名'
        ELSE '权限表数据正常'
    END,
    COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END)
FROM permissions;

-- 检查用户角色关联表一致性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '用户角色关联一致性检查',
    'user_roles',
    CASE
        WHEN COUNT(CASE WHEN u.id IS NULL THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN r.id IS NULL THEN 1 END) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('无效用户ID: ', COUNT(CASE WHEN u.id IS NULL THEN 1 END),
           '，无效角色ID: ', COUNT(CASE WHEN r.id IS NULL THEN 1 END)),
    CASE
        WHEN COUNT(CASE WHEN u.id IS NULL THEN 1 END) > 0 OR COUNT(CASE WHEN r.id IS NULL THEN 1 END) > 0 THEN '清理无效的用户角色关联记录'
        ELSE '用户角色关联一致性良好'
    END,
    COUNT(CASE WHEN u.id IS NULL THEN 1 END) + COUNT(CASE WHEN r.id IS NULL THEN 1 END)
FROM user_roles ur
LEFT JOIN users u ON ur.user_id = u.id
LEFT JOIN roles r ON ur.role_id = r.id;

-- 检查角色权限关联表一致性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '角色权限关联一致性检查',
    'role_permissions',
    CASE
        WHEN COUNT(CASE WHEN r.id IS NULL THEN 1 END) > 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN p.id IS NULL THEN 1 END) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('无效角色ID: ', COUNT(CASE WHEN r.id IS NULL THEN 1 END),
           '，无效权限ID: ', COUNT(CASE WHEN p.id IS NULL THEN 1 END)),
    CASE
        WHEN COUNT(CASE WHEN r.id IS NULL THEN 1 END) > 0 OR COUNT(CASE WHEN p.id IS NULL THEN 1 END) > 0 THEN '清理无效的角色权限关联记录'
        ELSE '角色权限关联一致性良好'
    END,
    COUNT(CASE WHEN r.id IS NULL THEN 1 END) + COUNT(CASE WHEN p.id IS NULL THEN 1 END)
FROM role_permissions rp
LEFT JOIN roles r ON rp.role_id = r.id
LEFT JOIN permissions p ON rp.permission_id = p.id;

-- 2.4 系统配置表验证
SELECT '2.4 验证系统配置表基础数据...' as sub_step;

-- 检查系统配置表数据完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '系统配置表数据完整性检查',
    'system_configs',
    CASE
        WHEN COUNT(*) = 0 THEN 'ERROR'
        WHEN COUNT(CASE WHEN config_key IS NULL OR config_key = '' THEN 1 END) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('配置记录数: ', COUNT(*), '，空配置键: ', COUNT(CASE WHEN config_key IS NULL OR config_key = '' THEN 1 END)),
    CASE
        WHEN COUNT(*) = 0 THEN '系统配置表为空，需要检查初始化脚本'
        WHEN COUNT(CASE WHEN config_key IS NULL OR config_key = '' THEN 1 END) > 0 THEN '修复空配置键'
        ELSE '系统配置表数据正常'
    END,
    COUNT(CASE WHEN config_key IS NULL OR config_key = '' THEN 1 END)
FROM system_configs;

-- 检查数据字典表数据完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '数据字典表数据完整性检查',
    'dictionaries',
    CASE
        WHEN COUNT(*) = 0 THEN 'WARN'
        WHEN COUNT(CASE WHEN dict_type IS NULL OR dict_type = '' THEN 1 END) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('字典记录数: ', COUNT(*), '，空字典类型: ', COUNT(CASE WHEN dict_type IS NULL OR dict_type = '' THEN 1 END)),
    CASE
        WHEN COUNT(*) = 0 THEN '数据字典表为空，可能影响系统功能'
        WHEN COUNT(CASE WHEN dict_type IS NULL OR dict_type = '' THEN 1 END) > 0 THEN '修复空字典类型'
        ELSE '数据字典表数据正常'
    END,
    COUNT(CASE WHEN dict_type IS NULL OR dict_type = '' THEN 1 END)
FROM dictionaries;

-- 2.5 文件存储表验证
SELECT '2.5 验证文件存储表基础数据...' as sub_step;

-- 检查文件存储表数据完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '文件存储表数据完整性检查',
    'file_storages',
    CASE
        WHEN COUNT(*) = 0 THEN 'INFO'
        WHEN COUNT(CASE WHEN file_path IS NULL OR file_path = '' THEN 1 END) > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('存储记录数: ', COUNT(*), '，空文件路径: ', COUNT(CASE WHEN file_path IS NULL OR file_path = '' THEN 1 END)),
    CASE
        WHEN COUNT(CASE WHEN file_path IS NULL OR file_path = '' THEN 1 END) > 0 THEN '修复空文件路径记录'
        ELSE '文件存储表数据正常'
    END,
    COUNT(CASE WHEN file_path IS NULL OR file_path = '' THEN 1 END)
FROM file_storages;

-- 2.6 审计日志表验证
SELECT '2.6 验证审计日志表基础数据...' as sub_step;

-- 检查操作日志表数据完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '操作日志表数据完整性检查',
    'operation_logs',
    CASE
        WHEN COUNT(*) = 0 THEN 'INFO'
        WHEN COUNT(CASE WHEN user_id IS NULL THEN 1 END) > 0 THEN 'WARN'
        WHEN COUNT(CASE WHEN operation_type IS NULL OR operation_type = '' THEN 1 END) > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('日志记录数: ', COUNT(*), '，无用户ID: ', COUNT(CASE WHEN user_id IS NULL THEN 1 END),
           '，无操作类型: ', COUNT(CASE WHEN operation_type IS NULL OR operation_type = '' THEN 1 END)),
    CASE
        WHEN COUNT(*) = 0 THEN '操作日志表为空，可能影响审计功能'
        WHEN COUNT(CASE WHEN user_id IS NULL THEN 1 END) > 0 THEN '检查操作日志记录完整性'
        WHEN COUNT(CASE WHEN operation_type IS NULL OR operation_type = '' THEN 1 END) > 0 THEN '完善操作日志记录'
        ELSE '操作日志表数据正常'
    END,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) + COUNT(CASE WHEN operation_type IS NULL OR operation_type = '' THEN 1 END)
FROM operation_logs;

-- 检查审计日志表数据完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '审计日志表数据完整性检查',
    'audit_logs',
    CASE
        WHEN COUNT(*) = 0 THEN 'INFO'
        WHEN COUNT(CASE WHEN entity_type IS NULL OR entity_type = '' THEN 1 END) > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('审计记录数: ', COUNT(*), '，无实体类型: ', COUNT(CASE WHEN entity_type IS NULL OR entity_type = '' THEN 1 END)),
    CASE
        WHEN COUNT(*) = 0 THEN '审计日志表为空，可能影响审计功能'
        WHEN COUNT(CASE WHEN entity_type IS NULL OR entity_type = '' THEN 1 END) > 0 THEN '完善审计日志记录'
        ELSE '审计日志表数据正常'
    END,
    COUNT(CASE WHEN entity_type IS NULL OR entity_type = '' THEN 1 END)
FROM audit_logs;

-- ====================================================================
-- 3. Level 2: 业务规则验证
-- ====================================================================

SELECT '3. 执行Level 2业务规则验证...' as check_step;

-- 3.1 用户权限业务逻辑验证
SELECT '3.1 验证用户权限业务逻辑...' as sub_step;

-- 检查每个用户是否至少有一个角色
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '用户角色分配检查',
    'users',
    CASE
        WHEN COUNT(CASE WHEN role_count = 0 THEN 1 END) > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('发现 ', COUNT(CASE WHEN role_count = 0 THEN 1 END), ' 个没有分配角色的用户'),
    CASE
        WHEN COUNT(CASE WHEN role_count = 0 THEN 1 END) > 0 THEN '为未分配角色的用户分配默认角色'
        ELSE '所有用户都有角色分配'
    END,
    COUNT(CASE WHEN role_count = 0 THEN 1 END)
FROM (
    SELECT u.id, COUNT(ur.role_id) as role_count
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    GROUP BY u.id
) user_roles_count;

-- 检查每个角色是否至少有一个权限
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '角色权限分配检查',
    'roles',
    CASE
        WHEN COUNT(CASE WHEN permission_count = 0 THEN 1 END) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('发现 ', COUNT(CASE WHEN permission_count = 0 THEN 1 END), ' 个没有分配权限的角色'),
    CASE
        WHEN COUNT(CASE WHEN permission_count = 0 THEN 1 END) > 0 THEN '为未分配权限的角色分配必要权限'
        ELSE '所有角色都有权限分配'
    END,
    COUNT(CASE WHEN permission_count = 0 THEN 1 END)
FROM (
    SELECT r.id, COUNT(rp.permission_id) as permission_count
    FROM roles r
    LEFT JOIN role_permissions rp ON r.id = rp.role_id
    GROUP BY r.id
) role_permissions_count;

-- 检查管理员用户权限完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '管理员用户权限检查',
    'users',
    CASE
        WHEN COUNT(CASE WHEN is_admin = 1 AND role_count = 0 THEN 1 END) > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('发现 ', COUNT(CASE WHEN is_admin = 1 AND role_count = 0 THEN 1 END), ' 个没有管理员角色的用户'),
    CASE
        WHEN COUNT(CASE WHEN is_admin = 1 AND role_count = 0 THEN 1 END) > 0 THEN '为管理员用户分配管理员角色'
        ELSE '管理员用户权限正常'
    END,
    COUNT(CASE WHEN is_admin = 1 AND role_count = 0 THEN 1 END)
FROM (
    SELECT
        u.id,
        CASE WHEN r.name = 'admin' THEN 1 ELSE 0 END as is_admin,
        COUNT(ur.role_id) as role_count
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    GROUP BY u.id
) admin_check;

-- 检查用户状态与权限的一致性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '用户状态与权限一致性检查',
    'users',
    CASE
        WHEN COUNT(CASE WHEN u.status = 'inactive' AND has_admin_role = 1 THEN 1 END) > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('发现 ', COUNT(CASE WHEN u.status = 'inactive' AND has_admin_role = 1 THEN 1 END), ' 个非活跃状态的管理员用户'),
    CASE
        WHEN COUNT(CASE WHEN u.status = 'inactive' AND has_admin_role = 1 THEN 1 END) > 0 THEN '检查非活跃管理员账户的处理策略'
        ELSE '用户状态与权限一致性良好'
    END,
    COUNT(CASE WHEN u.status = 'inactive' AND has_admin_role = 1 THEN 1 END)
FROM (
    SELECT
        u.id,
        u.status,
        CASE WHEN r.name = 'admin' THEN 1 ELSE 0 END as has_admin_role
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
) user_status_check;

-- 3.2 系统配置业务逻辑验证
SELECT '3.2 验证系统配置业务逻辑...' as sub_step;

-- 检查系统配置的完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '关键系统配置检查',
    'system_configs',
    CASE
        WHEN missing_configs > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('缺少 ', missing_configs, ' 个关键配置项'),
    CASE
        WHEN missing_configs > 0 THEN '补充缺少的关键系统配置项'
        ELSE '关键系统配置完整'
    END,
    missing_configs
FROM (
    SELECT
        COUNT(*) as total_configs,
        (
            SELECT COUNT(*)
            FROM system_configs
            WHERE config_key IN (
                'site.name', 'site.version', 'site.email', 'site.timezone',
                'security.password.min_length', 'security.session.timeout',
                'upload.max_file_size', 'upload.allowed_extensions',
                'maintenance.enabled', 'backup.enabled'
            )
        ) as existing_configs,
        (9 - (SELECT COUNT(*) FROM system_configs
            WHERE config_key IN (
                'site.name', 'site.version', 'site.email', 'site.timezone',
                'security.password.min_length', 'security.session.timeout',
                'upload.max_file_size', 'upload.allowed_extensions',
                'maintenance.enabled', 'backup.enabled'
            )
        )) as missing_configs
    FROM system_configs
) config_check;

-- 检查数据字典数据的完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '数据字典数据类型完整性检查',
    'dictionaries',
    CASE
        WHEN dict_types < 5 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('字典类型数量: ', dict_types, '，建议至少5种类型'),
    CASE
        WHEN dict_types < 5 THEN '补充更多字典类型以支持系统功能'
        ELSE '字典类型数量合理'
    END,
    dict_types
FROM (
    SELECT COUNT(DISTINCT dict_type) as dict_types
    FROM dictionaries
) dict_type_check;

-- 3.3 操作日志业务逻辑验证
SELECT '3.3 验证操作日志业务逻辑...' as sub_step;

-- 检查操作日志的时间序列完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '操作日志时间序列检查',
    'operation_logs',
    CASE
        WHEN COUNT(CASE WHEN created_at > updated_at THEN 1 END) > 0 THEN 'ERROR'
        WHEN future_logs > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('时间错误记录: ', COUNT(CASE WHEN created_at > updated_at THEN 1 END),
           '，未来时间记录: ', future_logs),
    CASE
        WHEN COUNT(CASE WHEN created_at > updated_at THEN 1 END) > 0 OR future_logs > 0 THEN '修复操作日志时间逻辑错误'
        ELSE '操作日志时间序列正常'
    END,
    COUNT(CASE WHEN created_at > updated_at THEN 1 END) + future_logs
FROM operation_logs,
    (SELECT COUNT(*) as future_logs FROM operation_logs WHERE created_at > NOW()) future_logs;

-- 检查审计日志覆盖完整性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '审计日志覆盖完整性检查',
    'audit_logs',
    CASE
        WHEN covered_entities < (SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE') * 0.5 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('已审计实体数: ', covered_entities, '，总表数: ', total_tables, '，覆盖率: ', ROUND(covered_entities * 100.0 / total_tables, 2), '%'),
    CASE
        WHEN covered_entities < (SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE') * 0.5 THEN '增加关键表的审计日志记录'
        ELSE '审计日志覆盖情况良好'
    END,
    covered_entities
FROM (
    SELECT
        COUNT(DISTINCT entity_type) as covered_entities,
        (SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE') as total_tables
    FROM audit_logs
) audit_coverage;

-- ====================================================================
-- 4. 跨模块关联验证
-- ====================================================================

SELECT '4. 执行跨模块关联验证...' as check_step;

-- 检查用户相关的数据一致性
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '用户相关数据一致性检查',
    'cross_module',
    CASE
        WHEN inconsistency_count > 0 THEN 'ERROR'
        ELSE 'INFO'
    END,
    CONCAT('发现 ', inconsistency_count, ' 个用户相关数据不一致问题'),
    CASE
        WHEN inconsistency_count > 0 THEN '修复用户相关数据不一致问题'
        ELSE '用户相关数据一致性良好'
    END,
    inconsistency_count
FROM (
    SELECT
        (SELECT COUNT(*) FROM user_profiles WHERE user_id NOT IN (SELECT id FROM users)) +
        (SELECT COUNT(*) FROM user_roles WHERE user_id NOT IN (SELECT id FROM users)) +
        (SELECT COUNT(*) FROM operation_logs WHERE user_id NOT IN (SELECT id FROM users))
    as inconsistency_count
) consistency_check;

-- ====================================================================
-- 5. 性能和质量检查
-- ====================================================================

SELECT '5. 执行性能和质量检查...' as check_step;

-- 检查核心表的性能指标
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '核心表性能分析',
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
        'users', 'user_profiles', 'roles', 'permissions',
        'user_roles', 'role_permissions',
        'system_configs', 'dictionaries', 'file_storages',
        'operation_logs', 'audit_logs'
    )
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;

-- 检查索引使用效率
INSERT INTO temp_verification_results (check_item, table_name, warning_level, error_message, suggested_action, affected_record_count)
SELECT
    '索引使用效率检查',
    'core_tables',
    CASE
        WHEN large_tables_without_primary_key > 0 THEN 'ERROR'
        WHEN tables_without_indexes > 0 THEN 'WARN'
        ELSE 'INFO'
    END,
    CONCAT('无主键表数: ', large_tables_without_primary_key, '，无索引表数: ', tables_without_indexes),
    CASE
        WHEN large_tables_without_primary_key > 0 THEN '为大表添加主键'
        WHEN tables_without_indexes > 0 THEN '为查询频繁的表添加索引'
        ELSE '索引使用效率良好'
    END,
    large_tables_without_primary_key + tables_without_indexes
FROM (
    SELECT
        COUNT(CASE WHEN TABLE_ROWS > 1000 AND TABLE_NAME NOT IN (
            SELECT TABLE_NAME FROM information_schema.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE() AND CONSTRAINT_NAME = 'PRIMARY'
        ) THEN 1 END) as large_tables_without_primary_key,
        COUNT(CASE WHEN TABLE_ROWS > 100 AND TABLE_NAME NOT IN (
            SELECT TABLE_NAME FROM information_schema.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE()
        ) THEN 1 END) as tables_without_indexes
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_TYPE = 'BASE TABLE'
    AND TABLE_NAME IN (
        'users', 'user_profiles', 'roles', 'permissions',
        'user_roles', 'role_permissions',
        'system_configs', 'dictionaries', 'file_storages',
        'operation_logs', 'audit_logs'
    )
) index_efficiency_check;

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

-- 数据量统计
SELECT
    '验证完成报告' as report_section,
    '核心表数据量统计' as metric_name,
    '总用户数' as total_users,
    '总角色数' as total_roles,
    '总权限数' as total_permissions,
    '总配置数' as total_configs,
    '总日志数' as total_logs
FROM (
    SELECT
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM roles) as total_roles,
        (SELECT COUNT(*) FROM permissions) as total_permissions,
        (SELECT COUNT(*) FROM system_configs) as total_configs,
        (SELECT COUNT(*) FROM operation_logs) + (SELECT COUNT(*) FROM audit_logs) as total_logs
) stats;

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

-- 业务健康度评估
SELECT
    '业务健康度评估' as assessment_category,
    '用户权限体系' as domain,
    CASE
        WHEN user_role_issues = 0 AND role_permission_issues = 0 THEN '健康'
        WHEN user_role_issues > 0 OR role_permission_issues > 0 THEN '需要注意'
        ELSE '有问题'
    END as health_status,
    CONCAT('用户-角色问题: ', user_role_issues, '，角色-权限问题: ', role_permission_issues) as details
FROM (
    SELECT
        COUNT(CASE WHEN check_item = '用户角色分配检查' AND warning_level != 'INFO' THEN 1 END) as user_role_issues,
        COUNT(CASE WHEN check_item = '角色权限分配检查' AND warning_level != 'INFO' THEN 1 END) as role_permission_issues
    FROM temp_verification_results
) health_assessment;

SELECT
    '业务健康度评估' as assessment_category,
    '系统配置' as domain,
    CASE
        WHEN config_issues = 0 THEN '健康'
        WHEN config_issues > 0 AND config_issues < 3 THEN '需要注意'
        ELSE '有问题'
    END as health_status,
    CONCAT('配置问题数: ', config_issues) as details
FROM (
    SELECT COUNT(*) as config_issues
    FROM temp_verification_results
    WHERE table_name = 'system_configs' AND warning_level != 'INFO'
) config_health;

SELECT
    '业务健康度评估' as assessment_category,
    '数据完整性' as domain,
    CASE
        WHEN data_integrity_issues = 0 THEN '健康'
        WHEN data_integrity_issues > 0 AND data_integrity_issues < 5 THEN '需要注意'
        ELSE '有问题'
    END as health_status,
    CONCAT('数据完整性问题数: ', data_integrity_issues) as details
FROM (
    SELECT COUNT(*) as data_integrity_issues
    FROM temp_verification_results
    WHERE check_item LIKE '%一致性检查%' AND warning_level != 'INFO'
) integrity_health;

-- 清理临时表
DROP TEMPORARY TABLE IF EXISTS temp_verification_results;

-- 验证完成标记
SET @verification_end_time = NOW();
SELECT '=== 核心基础表数据库验证完成 ===' as verification_status;
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

-- 保存验证结果到数据库（如果验证表存在）
INSERT INTO verification_results (
    execution_id, module_name, table_name, check_item, warning_level,
    check_category, error_message, suggested_action, check_count,
    affected_record_count, created_at
)
SELECT
    @current_verification_id as execution_id,
    'core_tables' as module_name,
    table_name,
    check_item,
    warning_level,
    '基础验证' as check_category,
    error_message,
    suggested_action,
    check_count,
    affected_record_count,
    NOW() as created_at
FROM temp_verification_results;