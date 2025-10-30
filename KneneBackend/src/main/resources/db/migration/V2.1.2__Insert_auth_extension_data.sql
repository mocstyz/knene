-- ====================================================================
-- 影视资源下载网站 - 认证扩展相关表数据插入脚本
-- ====================================================================
-- 版本：V2.1.2
-- 描述：插入认证扩展相关表的初始数据（权限分组、安全问题等）
-- 作者：数据库团队
-- 日期：2025-10-30
-- 依赖：V2.1.1__Create_auth_extension_tables.sql
-- ====================================================================

-- 设置SQL模式
SET NAMES utf8mb4;

-- ====================================================================
-- 1. 插入权限分组数据
-- ====================================================================

-- 系统管理权限分组
INSERT INTO permission_groups (group_code, group_name, description, parent_id, group_level, sort_order, icon, color, is_system, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
-- 一级分组
('system_management', '系统管理', '系统级别管理权限', NULL, 1, 10, 'settings', '#ff6b6b', 1, 1, 1, 1, 1, NOW(), NOW()),
('user_management', '用户管理', '用户账户管理相关权限', NULL, 1, 20, 'users', '#4ecdc4', 1, 1, 1, 1, 1, NOW(), NOW()),
('content_management', '内容管理', '网站内容管理相关权限', NULL, 1, 30, 'file-text', '#45b7d1', 1, 1, 1, 1, 1, NOW(), NOW()),
('resource_management', '资源管理', '影视资源管理相关权限', NULL, 1, 40, 'database', '#96ceb4', 1, 1, 1, 1, 1, NOW(), NOW()),
('vip_management', 'VIP管理', 'VIP会员管理相关权限', NULL, 1, 50, 'crown', '#ffeaa7', 1, 1, 1, 1, 1, NOW(), NOW()),
('analytics_management', '统计分析', '数据统计分析相关权限', NULL, 1, 60, 'bar-chart', '#dfe6e9', 1, 1, 1, 1, 1, NOW(), NOW()),
('personal_management', '个人管理', '用户个人操作权限', NULL, 1, 70, 'user', '#a29bfe', 1, 1, 1, 1, 1, NOW(), NOW());

-- 获取刚插入的一级分组ID（用于设置二级分组的parent_id）
SET @system_mgmt_id = (SELECT id FROM permission_groups WHERE group_code = 'system_management');
SET @user_mgmt_id = (SELECT id FROM permission_groups WHERE group_code = 'user_management');
SET @content_mgmt_id = (SELECT id FROM permission_groups WHERE group_code = 'content_management');
SET @resource_mgmt_id = (SELECT id FROM permission_groups WHERE group_code = 'resource_management');
SET @vip_mgmt_id = (SELECT id FROM permission_groups WHERE group_code = 'vip_management');
SET @analytics_mgmt_id = (SELECT id FROM permission_groups WHERE group_code = 'analytics_management');
SET @personal_mgmt_id = (SELECT id FROM permission_groups WHERE group_code = 'personal_management');

-- 二级分组 - 系统管理
INSERT INTO permission_groups (group_code, group_name, description, parent_id, group_level, sort_order, icon, color, is_system, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
('system_config', '系统配置', '系统参数配置权限', @system_mgmt_id, 2, 11, 'config', '#ff6b6b', 1, 1, 1, 1, 1, NOW(), NOW()),
('system_monitor', '系统监控', '系统运行监控权限', @system_mgmt_id, 2, 12, 'monitor', '#ff6b6b', 1, 1, 1, 1, 1, NOW(), NOW()),
('system_backup', '备份管理', '数据备份恢复权限', @system_mgmt_id, 2, 13, 'backup', '#ff6b6b', 1, 1, 1, 1, 1, NOW(), NOW()),
('system_security', '安全管理', '系统安全设置权限', @system_mgmt_id, 2, 14, 'shield', '#ff6b6b', 1, 1, 1, 1, 1, NOW(), NOW());

-- 二级分组 - 用户管理
INSERT INTO permission_groups (group_code, group_name, description, parent_id, group_level, sort_order, icon, color, is_system, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
('user_basic', '基础用户管理', '用户基础操作权限', @user_mgmt_id, 2, 21, 'user-plus', '#4ecdc4', 1, 1, 1, 1, 1, NOW(), NOW()),
('user_role', '角色权限', '用户角色分配权限', @user_mgmt_id, 2, 22, 'user-check', '#4ecdc4', 1, 1, 1, 1, 1, NOW(), NOW()),
('user_security', '用户安全', '用户安全管理权限', @user_mgmt_id, 2, 23, 'user-shield', '#4ecdc4', 1, 1, 1, 1, 1, NOW(), NOW()),
('user_audit', '用户审计', '用户操作审计权限', @user_mgmt_id, 2, 24, 'user-audit', '#4ecdc4', 1, 1, 1, 1, 1, NOW(), NOW());

-- 二级分组 - 内容管理
INSERT INTO permission_groups (group_code, group_name, description, parent_id, group_level, sort_order, icon, color, is_system, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
('content_article', '文章管理', '新闻文章管理权限', @content_mgmt_id, 2, 31, 'article', '#45b7d1', 1, 1, 1, 1, 1, NOW(), NOW()),
('content_wiki', '知识库', '帮助文档管理权限', @content_mgmt_id, 2, 32, 'book', '#45b7d1', 1, 1, 1, 1, 1, NOW(), NOW()),
('content_comment', '评论管理', '用户评论管理权限', @content_mgmt_id, 2, 33, 'message-circle', '#45b7d1', 1, 1, 1, 1, 1, NOW(), NOW()),
('content_media', '媒体资源', '媒体文件管理权限', @content_mgmt_id, 2, 34, 'image', '#45b7d1', 1, 1, 1, 1, 1, NOW(), NOW());

-- 二级分组 - 资源管理
INSERT INTO permission_groups (group_code, group_name, description, parent_id, group_level, sort_order, icon, color, is_system, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
('resource_movie', '影视资源', '影视资源管理权限', @resource_mgmt_id, 2, 41, 'film', '#96ceb4', 1, 1, 1, 1, 1, NOW(), NOW()),
('resource_download', '下载管理', '下载任务管理权限', @resource_mgmt_id, 2, 42, 'download', '#96ceb4', 1, 1, 1, 1, 1, NOW(), NOW()),
('resource_quality', '质量管理', '资源质量检查权限', @resource_mgmt_id, 2, 43, 'check-circle', '#96ceb4', 1, 1, 1, 1, 1, NOW(), NOW()),
('resource_category', '分类管理', '资源分类管理权限', @resource_mgmt_id, 2, 44, 'folder', '#96ceb4', 1, 1, 1, 1, 1, NOW(), NOW());

-- 二级分组 - VIP管理
INSERT INTO permission_groups (group_code, group_name, description, parent_id, group_level, sort_order, icon, color, is_system, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
('vip_membership', '会员管理', 'VIP会员管理权限', @vip_mgmt_id, 2, 51, 'vip', '#ffeaa7', 1, 1, 1, 1, 1, NOW(), NOW()),
('vip_payment', '支付管理', '支付订单管理权限', @vip_mgmt_id, 2, 52, 'payment', '#ffeaa7', 1, 1, 1, 1, 1, NOW(), NOW()),
('vip_privilege', '特权管理', 'VIP特权设置权限', @vip_mgmt_id, 2, 53, 'star', '#ffeaa7', 1, 1, 1, 1, 1, NOW(), NOW()),
('vip_analytics', 'VIP统计', 'VIP业务统计分析权限', @vip_mgmt_id, 2, 54, 'analytics', '#ffeaa7', 1, 1, 1, 1, 1, NOW(), NOW());

-- 二级分组 - 统计分析
INSERT INTO permission_groups (group_code, group_name, description, parent_id, group_level, sort_order, icon, color, is_system, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
('analytics_user', '用户统计', '用户行为统计分析权限', @analytics_mgmt_id, 2, 61, 'user-chart', '#dfe6e9', 1, 1, 1, 1, 1, NOW(), NOW()),
('analytics_content', '内容统计', '内容热度统计分析权限', @analytics_mgmt_id, 2, 62, 'content-chart', '#dfe6e9', 1, 1, 1, 1, 1, NOW(), NOW()),
('analytics_business', '业务统计', '业务指标统计分析权限', @analytics_mgmt_id, 2, 63, 'business-chart', '#dfe6e9', 1, 1, 1, 1, 1, NOW(), NOW()),
('analytics_report', '报表管理', '数据报表生成管理权限', @analytics_mgmt_id, 2, 64, 'report', '#dfe6e9', 1, 1, 1, 1, 1, NOW(), NOW());

-- 二级分组 - 个人管理
INSERT INTO permission_groups (group_code, group_name, description, parent_id, group_level, sort_order, icon, color, is_system, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
('personal_profile', '个人资料', '个人资料管理权限', @personal_mgmt_id, 2, 71, 'profile', '#a29bfe', 1, 1, 1, 1, 1, NOW(), NOW()),
('personal_favorite', '收藏管理', '个人收藏管理权限', @personal_mgmt_id, 2, 72, 'favorite', '#a29bfe', 1, 1, 1, 1, 1, NOW(), NOW()),
('personal_download', '下载记录', '下载记录管理权限', @personal_mgmt_id, 2, 73, 'download-history', '#a29bfe', 1, 1, 1, 1, 1, NOW(), NOW()),
('personal_notification', '通知管理', '个人通知管理权限', @personal_mgmt_id, 2, 74, 'notification', '#a29bfe', 1, 1, 1, 1, 1, NOW(), NOW());

-- ====================================================================
-- 2. 插入权限分组关联数据
-- ====================================================================

-- 系统管理分组权限关联
INSERT INTO permission_group_relations (group_id, permission_id, created_by, created_at)
SELECT pg.id, p.id, 1, NOW()
FROM permission_groups pg
CROSS JOIN permissions p
WHERE pg.group_code IN ('system_config', 'system_monitor', 'system_backup', 'system_security')
AND p.module IN ('system', 'role', 'permission');

-- 用户管理分组权限关联
INSERT INTO permission_group_relations (group_id, permission_id, created_by, created_at)
SELECT pg.id, p.id, 1, NOW()
FROM permission_groups pg
CROSS JOIN permissions p
WHERE pg.group_code IN ('user_basic', 'user_role', 'user_security', 'user_audit')
AND p.module IN ('user', 'role', 'permission');

-- 内容管理分组权限关联
INSERT INTO permission_group_relations (group_id, permission_id, created_by, created_at)
SELECT pg.id, p.id, 1, NOW()
FROM permission_groups pg
CROSS JOIN permissions p
WHERE pg.group_code IN ('content_article', 'content_wiki', 'content_comment', 'content_media')
AND p.module IN ('content', 'comment');

-- 资源管理分组权限关联
INSERT INTO permission_group_relations (group_id, permission_id, created_by, created_at)
SELECT pg.id, p.id, 1, NOW()
FROM permission_groups pg
CROSS JOIN permissions p
WHERE pg.group_code IN ('resource_movie', 'resource_download', 'resource_quality', 'resource_category')
AND p.module IN ('resource', 'download');

-- VIP管理分组权限关联
INSERT INTO permission_group_relations (group_id, permission_id, created_by, created_at)
SELECT pg.id, p.id, 1, NOW()
FROM permission_groups pg
CROSS JOIN permissions p
WHERE pg.group_code IN ('vip_membership', 'vip_payment', 'vip_privilege', 'vip_analytics')
AND p.module IN ('vip', 'order', 'payment');

-- 统计分析分组权限关联
INSERT INTO permission_group_relations (group_id, permission_id, created_by, created_at)
SELECT pg.id, p.id, 1, NOW()
FROM permission_groups pg
CROSS JOIN permissions p
WHERE pg.group_code IN ('analytics_user', 'analytics_content', 'analytics_business', 'analytics_report')
AND p.module IN ('analytics', 'report');

-- 个人管理分组权限关联（普通用户权限）
INSERT INTO permission_group_relations (group_id, permission_id, created_by, created_at)
SELECT pg.id, p.id, 1, NOW()
FROM permission_groups pg
CROSS JOIN permissions p
WHERE pg.group_code IN ('personal_profile', 'personal_favorite', 'personal_download', 'personal_notification')
AND p.module IN ('profile', 'favorite', 'download', 'notification')
AND p.action IN ('view', 'create', 'update', 'delete');

-- ====================================================================
-- 3. 插入安全问题数据
-- ====================================================================

INSERT INTO security_questions (question_key, question_text, question_category, sort_order, difficulty_level, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
-- 个人问题（简单）
('pet_name', '您的第一只宠物的名字是什么？', 'personal', 1, 1, 1, 1, 1, 1, NOW(), NOW()),
('elementary_school', '您的小学名称是什么？', 'personal', 2, 1, 1, 1, 1, 1, NOW(), NOW()),
('first_teacher', '您小学班主任的姓氏是什么？', 'personal', 3, 1, 1, 1, 1, 1, NOW(), NOW()),
('childhood_friend', '您童年最好朋友的名字是什么？', 'personal', 4, 1, 1, 1, 1, 1, NOW(), NOW()),
('birth_city', '您的出生城市是哪里？', 'personal', 5, 1, 1, 1, 1, 1, NOW(), NOW()),

-- 偏好问题（中等）
('favorite_color', '您最喜欢的颜色是什么？', 'preference', 11, 2, 1, 1, 1, 1, NOW(), NOW()),
('favorite_food', '您最喜欢的食物是什么？', 'preference', 12, 2, 1, 1, 1, 1, NOW(), NOW()),
('favorite_movie', '您最喜欢的电影是什么？', 'preference', 13, 2, 1, 1, 1, 1, NOW(), NOW()),
('favorite_book', '您最喜欢的书籍是什么？', 'preference', 14, 2, 1, 1, 1, 1, NOW(), NOW()),
('favorite_sport', '您最喜欢的运动是什么？', 'preference', 15, 2, 1, 1, 1, 1, NOW(), NOW()),

-- 安全问题（困难）
('mother_maiden', '您母亲的婚前姓氏是什么？', 'security', 21, 3, 1, 1, 1, 1, NOW(), NOW()),
('first_car', '您的第一辆汽车品牌是什么？', 'security', 22, 3, 1, 1, 1, 1, NOW(), NOW()),
('anniversary_date', '您的结婚纪念日是什么时候？', 'security', 23, 3, 1, 1, 1, 1, NOW(), NOW()),
('first_job', '您的第一份工作公司名称是什么？', 'security', 24, 3, 1, 1, 1, 1, NOW(), NOW()),
('childhood_nickname', '您童年时的小名叫什么？', 'security', 25, 3, 1, 1, 1, 1, NOW(), NOW()),

-- 高级安全问题（很困难）
('bank_branch', '您开第一个银行账户的银行分行在哪个城市？', 'security', 31, 4, 1, 1, 1, 1, NOW(), NOW()),
('first_phone', '您的第一个手机号码后四位是什么？', 'security', 32, 4, 1, 1, 1, 1, NOW(), NOW()),
('passport_number', '您护照号码的最后6位是什么？', 'security', 33, 4, 1, 1, 1, 1, NOW(), NOW()),
('id_card_address', '您身份证地址的街道名称是什么？', 'security', 34, 4, 1, 1, 1, 1, NOW(), NOW()),

-- 自定义问题（用户自定义）
('custom_1', '自定义安全问题1', 'custom', 41, 2, 1, 1, 1, 1, NOW(), NOW()),
('custom_2', '自定义安全问题2', 'custom', 42, 2, 1, 1, 1, 1, NOW(), NOW()),
('custom_3', '自定义安全问题3', 'custom', 43, 2, 1, 1, 1, 1, NOW(), NOW());

-- ====================================================================
-- 4. 插入用户安全问题答案示例数据（仅管理员用户）
-- ====================================================================

-- 为管理员用户设置安全问题答案（示例数据，实际使用时需要用户自行设置）
-- 注意：这里使用简单哈希，实际应用中应使用更安全的哈希算法

INSERT INTO user_security_answers (user_id, question_id, answer_hash, salt, is_verified, verified_at, created_at, updated_at) VALUES
(1, 1, SHA2(CONCAT('admin123', 'salt_admin_1'), 256), 'salt_admin_1', 1, NOW(), NOW(), NOW()),
(1, 6, SHA2(CONCAT('blue', 'salt_admin_2'), 256), 'salt_admin_2', 1, NOW(), NOW(), NOW()),
(1, 11, SHA2(CONCAT('wang', 'salt_admin_3'), 256), 'salt_admin_3', 1, NOW(), NOW(), NOW());

-- ====================================================================
-- 5. 插入登录历史样本数据
-- ====================================================================

-- 管理员成功登录记录
INSERT INTO login_history (user_id, username, email, login_type, login_status, ip_address, user_agent, browser, os, device, location, is_new_device, session_id, fingerprint, login_at, created_at, updated_at) VALUES
(1, 'admin', 'admin@knene.com', 'password', 'success', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Chrome', 'Windows', 'Desktop', '本地', 1, 'sess_admin_001', 'fp_admin_001', NOW(), NOW(), NOW()),

-- 模拟用户登录尝试记录
INSERT INTO login_history (user_id, username, email, login_type, login_status, failure_reason, ip_address, user_agent, browser, os, device, location, is_new_device, session_id, fingerprint, login_at, created_at, updated_at) VALUES
(NULL, 'testuser', 'test@example.com', 'password', 'failed', '用户名或密码错误', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Chrome', 'Windows', 'Desktop', '北京', 1, NULL, 'fp_test_001', NOW(), NOW(), NOW()),

(NULL, 'john_doe', 'john@example.com', 'password', 'failed', '用户名或密码错误', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Safari', 'macOS', 'Desktop', '上海', 1, NULL, 'fp_john_001', NOW(), NOW(), NOW()),

-- 模拟成功登录的访客记录
(NULL, 'guest', NULL, 'password', 'success', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Edge', 'Windows', 'Desktop', '本地', 1, 'sess_guest_001', 'fp_guest_001', NOW(), NOW(), NOW());

-- ====================================================================
-- 6. 插入登录尝试记录样本数据
-- ====================================================================

INSERT INTO login_attempts (user_id, username, email, ip_address, user_agent, attempt_type, attempt_status, failure_reason, captcha_passed, is_blocked, attempt_count, location, fingerprint, attempted_at, created_at, updated_at) VALUES
-- 失败的登录尝试
(NULL, 'testuser', 'test@example.com', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'login', 'failed', '用户名或密码错误', NULL, 0, 1, '北京', 'fp_test_001', NOW(), NOW(), NOW()),

(NULL, 'testuser', 'test@example.com', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'login', 'failed', '用户名或密码错误', NULL, 0, 2, '北京', 'fp_test_001', DATE_SUB(NOW(), INTERVAL 1 MINUTE), NOW(), NOW()),

(NULL, 'testuser', 'test@example.com', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'login', 'blocked', '登录尝试次数过多', NULL, 1, 3, '北京', 'fp_test_001', DATE_SUB(NOW(), INTERVAL 2 MINUTES), NOW(), NOW()),

-- 注册尝试
(NULL, 'newuser', 'newuser@example.com', '180.150.200.88', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', 'register', 'success', NULL, 1, 0, 1, '广州', 'fp_newuser_001', DATE_SUB(NOW(), INTERVAL 30 MINUTE), NOW(), NOW()),

-- 密码重置尝试
(NULL, 'admin', 'admin@knene.com', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'password_reset', 'success', NULL, 1, 0, 1, '本地', 'fp_admin_001', DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW(), NOW());

-- ====================================================================
-- 7. 插入登录失败记录样本数据
-- ====================================================================

INSERT INTO failed_login_attempts (user_id, username, email, ip_address, user_agent, failure_type, failure_reason, captcha_required, captcha_provided, captcha_correct, location, fingerprint, is_blocked, block_duration, block_expires_at, attempt_count, attempted_at, created_at, updated_at) VALUES
-- 连续失败尝试
(NULL, 'malicious_user', 'malicious@example.com', '10.0.0.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'invalid_credentials', '用户名或密码错误', 0, NULL, NULL, '未知', 'fp_malicious_001', 0, NULL, NULL, 1, DATE_SUB(NOW(), INTERVAL 10 MINUTE), NOW(), NOW()),

(NULL, 'malicious_user', 'malicious@example.com', '10.0.0.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'invalid_credentials', '用户名或密码错误', 1, 1, 1, '未知', 'fp_malicious_001', 0, NULL, NULL, 2, DATE_SUB(NOW(), INTERVAL 8 MINUTE), NOW(), NOW()),

(NULL, 'malicious_user', 'malicious@example.com', '10.0.0.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'invalid_credentials', '用户名或密码错误', 1, 1, 0, '未知', 'fp_malicious_001', 1, 30, DATE_ADD(NOW(), INTERVAL 30 MINUTE), 3, DATE_SUB(NOW(), INTERVAL 6 MINUTE), NOW(), NOW()),

-- 账户被锁定的失败尝试
(NULL, 'locked_user', 'locked@example.com', '192.168.1.200', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'account_locked', '账户已被锁定', 0, NULL, NULL, '深圳', 'fp_locked_001', 1, NULL, NULL, 1, DATE_SUB(NOW(), INTERVAL 5 MINUTE), NOW(), NOW());

-- ====================================================================
-- 8. 插入用户锁定记录样本数据
-- ====================================================================

INSERT INTO user_lockouts (user_id, lock_type, lock_reason, is_permanent, lock_duration, locked_at, expires_at, is_active, ip_address, user_agent, failed_attempts, created_by, updated_by, version, created_at, updated_at) VALUES
-- 临时锁定（密码失败次数过多）
(1, 'password_failed', '连续登录失败次数过多', 0, 30, DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 30 MINUTE), 0, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 5, 1, 1, 1, DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW()),

-- 管理员手动锁定
(2, 'admin_action', '管理员手动锁定账户', 1, NULL, DATE_SUB(NOW(), INTERVAL 2 HOUR), NULL, 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 0, 1, 1, 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW()),

-- 安全风险锁定
(3, 'security_risk', '检测到异常登录行为', 0, 120, DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_ADD(NOW(), INTERVAL 1 HOUR), 1, '10.0.0.50', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 10, 1, 1, 1, DATE_SUB(NOW(), INTERVAL 3 HOUR), NOW());

-- ====================================================================
-- 数据插入完成日志
-- ====================================================================
-- 认证扩展相关表数据插入完成：
-- 1. 权限分组数据：25个分组，包含7个一级分组和18个二级分组
-- 2. 权限分组关联数据：根据模块自动关联相应权限
-- 3. 安全问题数据：17个安全问题，涵盖个人、偏好、安全等不同难度等级
-- 4. 用户安全问题答案：为管理员用户设置3个安全问题答案示例
-- 5. 登录历史样本数据：4条登录记录，包含成功和失败案例
-- 6. 登录尝试记录样本数据：5条登录尝试记录，包含不同类型和状态
-- 7. 登录失败记录样本数据：4条失败记录，展示不同失败原因和阻断机制
-- 8. 用户锁定记录样本数据：3条锁定记录，展示不同锁定类型和状态
--
-- 所有数据都包含完整的审计字段
-- 权限分组按照业务模块进行层级化管理
-- 安全问题设置不同难度等级供用户选择
-- ====================================================================