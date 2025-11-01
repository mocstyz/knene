-- ====================================================================
-- 影视资源下载网站 - 用户权限核心数据插入脚本
-- ====================================================================
-- 版本：V1.1.2
-- 描述：插入用户权限核心基础数据（默认角色、权限、管理员账户、关联关系、登录历史）
-- 作者：数据库团队
-- 日期：2025-10-30
-- 依赖：V1.1.1__Create_user_permission_core_tables.sql
-- ====================================================================

-- 设置SQL模式
SET NAMES utf8mb4;

-- ====================================================================
-- 1. 插入系统角色数据
-- ====================================================================

-- 超级管理员角色
INSERT INTO roles (id, name, display_name, description, level, is_system, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
(1, 'super_admin', '超级管理员', '拥有系统所有权限的超级管理员角色', 100, TRUE, TRUE, 1, 1, 1, NOW(), NOW());

-- 管理员角色
INSERT INTO roles (id, name, display_name, description, level, is_system, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
(2, 'admin', '管理员', '拥有系统管理权限的管理员角色', 80, TRUE, TRUE, 1, 1, 1, NOW(), NOW());

-- VIP用户角色
INSERT INTO roles (id, name, display_name, description, level, is_system, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
(3, 'vip_user', 'VIP用户', '拥有VIP特权权限的付费用户角色', 60, TRUE, TRUE, 1, 1, 1, NOW(), NOW());

-- 普通用户角色
INSERT INTO roles (id, name, display_name, description, level, is_system, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
(4, 'user', '普通用户', '拥有基础权限的普通用户角色', 40, TRUE, TRUE, 1, 1, 1, NOW(), NOW());

-- 游客角色
INSERT INTO roles (id, name, display_name, description, level, is_system, is_active, created_by, updated_by, version, created_at, updated_at) VALUES
(5, 'guest', '游客', '仅拥有浏览权限的未登录用户角色', 20, TRUE, TRUE, 1, 1, 1, NOW(), NOW());

-- ====================================================================
-- 2. 插入系统权限数据
-- ====================================================================

-- 用户管理权限
INSERT INTO permissions (id, name, display_name, description, resource, action, module, is_system, created_by, updated_by, version, created_at, updated_at) VALUES
-- 用户基础操作权限
(1, 'user.view', '查看用户', '查看用户基本信息和列表', 'user', 'view', 'user', TRUE, 1, 1, 1, NOW(), NOW()),
(2, 'user.create', '创建用户', '创建新用户账户', 'user', 'create', 'user', TRUE, 1, 1, 1, NOW(), NOW()),
(3, 'user.update', '更新用户', '更新用户基本信息', 'user', 'update', 'user', TRUE, 1, 1, 1, NOW(), NOW()),
(4, 'user.delete', '删除用户', '删除用户账户', 'user', 'delete', 'user', TRUE, 1, 1, 1, NOW(), NOW()),
(5, 'user.manage', '管理用户', '用户账户的完整管理权限', 'user', 'manage', 'user', TRUE, 1, 1, 1, NOW(), NOW()),

-- 用户状态管理权限
(6, 'user.activate', '激活用户', '激活用户账户', 'user', 'activate', 'user', TRUE, 1, 1, 1, NOW(), NOW()),
(7, 'user.suspend', '暂停用户', '暂停用户账户', 'user', 'suspend', 'user', TRUE, 1, 1, 1, NOW(), NOW()),
(8, 'user.unlock', '解锁用户', '解锁被锁定的用户账户', 'user', 'unlock', 'user', TRUE, 1, 1, 1, NOW(), NOW()),

-- 角色管理权限
(9, 'role.view', '查看角色', '查看角色信息和列表', 'role', 'view', 'role', TRUE, 1, 1, 1, NOW(), NOW()),
(10, 'role.create', '创建角色', '创建新角色', 'role', 'create', 'role', TRUE, 1, 1, 1, NOW(), NOW()),
(11, 'role.update', '更新角色', '更新角色信息', 'role', 'update', 'role', TRUE, 1, 1, 1, NOW(), NOW()),
(12, 'role.delete', '删除角色', '删除角色', 'role', 'delete', 'role', TRUE, 1, 1, 1, NOW(), NOW()),
(13, 'role.assign', '分配角色', '为用户分配角色', 'role', 'assign', 'role', TRUE, 1, 1, 1, NOW(), NOW()),

-- 权限管理权限
(14, 'permission.view', '查看权限', '查看权限信息和列表', 'permission', 'view', 'permission', TRUE, 1, 1, 1, NOW(), NOW()),
(15, 'permission.create', '创建权限', '创建新权限', 'permission', 'create', 'permission', TRUE, 1, 1, 1, NOW(), NOW()),
(16, 'permission.update', '更新权限', '更新权限信息', 'permission', 'update', 'permission', TRUE, 1, 1, 1, NOW(), NOW()),
(17, 'permission.delete', '删除权限', '删除权限', 'permission', 'delete', 'permission', TRUE, 1, 1, 1, NOW(), NOW()),
(18, 'permission.assign', '分配权限', '为角色分配权限', 'permission', 'assign', 'permission', TRUE, 1, 1, 1, NOW(), NOW()),

-- 系统管理权限
(19, 'system.config', '系统配置', '系统配置管理权限', 'system', 'config', 'system', TRUE, 1, 1, 1, NOW(), NOW()),
(20, 'system.monitor', '系统监控', '系统运行状态监控权限', 'system', 'monitor', 'system', TRUE, 1, 1, 1, NOW(), NOW()),
(21, 'system.backup', '系统备份', '系统数据备份权限', 'system', 'backup', 'system', TRUE, 1, 1, 1, NOW(), NOW()),
(22, 'system.restore', '系统恢复', '系统数据恢复权限', 'system', 'restore', 'system', TRUE, 1, 1, 1, NOW(), NOW()),

-- 日志查看权限
(23, 'log.view', '查看日志', '查看系统日志', 'log', 'view', 'log', TRUE, 1, 1, 1, NOW(), NOW()),
(24, 'log.export', '导出日志', '导出系统日志', 'log', 'export', 'log', TRUE, 1, 1, 1, NOW(), NOW()),
(25, 'log.delete', '删除日志', '删除系统日志', 'log', 'delete', 'log', TRUE, 1, 1, 1, NOW(), NOW()),

-- 内容管理权限
(26, 'content.view', '查看内容', '查看内容信息', 'content', 'view', 'content', TRUE, 1, 1, 1, NOW(), NOW()),
(27, 'content.create', '创建内容', '创建新内容', 'content', 'create', 'content', TRUE, 1, 1, 1, NOW(), NOW()),
(28, 'content.update', '更新内容', '更新内容信息', 'content', 'update', 'content', TRUE, 1, 1, 1, NOW(), NOW()),
(29, 'content.delete', '删除内容', '删除内容', 'content', 'delete', 'content', TRUE, 1, 1, 1, NOW(), NOW()),
(30, 'content.publish', '发布内容', '发布内容', 'content', 'publish', 'content', TRUE, 1, 1, 1, NOW(), NOW()),
(31, 'content.audit', '审核内容', '审核内容', 'content', 'audit', 'content', TRUE, 1, 1, 1, NOW(), NOW()),

-- 资源管理权限
(32, 'resource.view', '查看资源', '查看资源信息', 'resource', 'view', 'resource', TRUE, 1, 1, 1, NOW(), NOW()),
(33, 'resource.download', '下载资源', '下载资源文件', 'resource', 'download', 'resource', TRUE, 1, 1, 1, NOW(), NOW()),
(34, 'resource.upload', '上传资源', '上传资源文件', 'resource', 'upload', 'resource', TRUE, 1, 1, 1, NOW(), NOW()),
(35, 'resource.manage', '管理资源', '资源管理权限', 'resource', 'manage', 'resource', TRUE, 1, 1, 1, NOW(), NOW()),

-- VIP管理权限
(36, 'vip.view', '查看VIP', '查看VIP信息', 'vip', 'view', 'vip', TRUE, 1, 1, 1, NOW(), NOW()),
(37, 'vip.create', '创建VIP', '创建VIP会员', 'vip', 'create', 'vip', TRUE, 1, 1, 1, NOW(), NOW()),
(38, 'vip.update', '更新VIP', '更新VIP信息', 'vip', 'update', 'vip', TRUE, 1, 1, 1, NOW(), NOW()),
(39, 'vip.delete', '删除VIP', '删除VIP会员', 'vip', 'delete', 'vip', TRUE, 1, 1, 1, NOW(), NOW()),

-- 统计分析权限
(40, 'analytics.view', '查看统计', '查看统计数据', 'analytics', 'view', 'analytics', TRUE, 1, 1, 1, NOW(), NOW()),
(41, 'analytics.export', '导出统计', '导出统计数据', 'analytics', 'export', 'analytics', TRUE, 1, 1, 1, NOW(), NOW()),

-- 基础用户权限
(42, 'profile.view', '查看资料', '查看个人资料', 'profile', 'view', 'profile', TRUE, 1, 1, 1, NOW(), NOW()),
(43, 'profile.update', '更新资料', '更新个人资料', 'profile', 'update', 'profile', TRUE, 1, 1, 1, NOW(), NOW()),
(44, 'profile.avatar', '更换头像', '更换个人头像', 'profile', 'avatar', 'profile', TRUE, 1, 1, 1, NOW(), NOW()),

-- 收藏权限
(45, 'favorite.view', '查看收藏', '查看收藏列表', 'favorite', 'view', 'favorite', TRUE, 1, 1, 1, NOW(), NOW()),
(46, 'favorite.create', '添加收藏', '添加收藏', 'favorite', 'create', 'favorite', TRUE, 1, 1, 1, NOW(), NOW()),
(47, 'favorite.delete', '删除收藏', '删除收藏', 'favorite', 'delete', 'favorite', TRUE, 1, 1, 1, NOW(), NOW()),

-- 评论权限
(48, 'comment.view', '查看评论', '查看评论内容', 'comment', 'view', 'comment', TRUE, 1, 1, 1, NOW(), NOW()),
(49, 'comment.create', '发表评论', '发表评论', 'comment', 'create', 'comment', TRUE, 1, 1, 1, NOW(), NOW()),
(50, 'comment.update', '更新评论', '更新自己的评论', 'comment', 'update', 'comment', TRUE, 1, 1, 1, NOW(), NOW()),
(51, 'comment.delete', '删除评论', '删除自己的评论', 'comment', 'delete', 'comment', TRUE, 1, 1, 1, NOW(), NOW());

-- ====================================================================
-- 3. 创建管理员用户账户
-- ====================================================================

-- 注意：这里的密码是 'admin123' 的BCrypt哈希值
-- 在实际部署时应该使用强密码
INSERT INTO users (id, username, email, password_hash, status, email_verified, created_by, updated_by, version, created_at, updated_at) VALUES
(1, 'admin', 'admin@knene.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'active', TRUE, 1, 1, 1, NOW(), NOW()),
(2, 'testuser', 'testuser@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'active', TRUE, 1, 1, 1, NOW(), NOW()),
(3, 'lockeduser', 'lockeduser@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'active', TRUE, 1, 1, 1, NOW(), NOW()),
(4, 'lisi', 'lisi@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'active', TRUE, 1, 1, 1, NOW(), NOW()),
(5, 'wangwu', 'wangwu@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'active', TRUE, 1, 1, 1, NOW(), NOW()),
(6, 'zhaoliu', 'zhaoliu@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'active', TRUE, 1, 1, 1, NOW(), NOW());

-- 为用户创建用户档案
INSERT INTO user_profiles (id, user_id, nickname, gender, bio, preferences, timezone, language, created_by, updated_by, version, created_at, updated_at) VALUES
(1, 1, '系统管理员', 'unknown', '系统默认管理员账户', '{"theme": "light", "notifications": {"email": true, "push": true}}', 'Asia/Shanghai', 'zh-CN', 1, 1, 1, NOW(), NOW()),
(2, 2, '测试用户', 'unknown', '用于测试功能的普通用户', '{"theme": "dark", "notifications": {"email": false, "push": true}}', 'Asia/Shanghai', 'zh-CN', 1, 1, 1, NOW(), NOW()),
(3, 3, '锁定用户', 'unknown', '用于测试锁定功能的用户', '{"theme": "light", "notifications": {"email": true, "push": false}}', 'Asia/Shanghai', 'zh-CN', 1, 1, 1, NOW(), NOW()),
(4, 4, '李四', 'unknown', '普通用户李四', '{"theme": "light", "notifications": {"email": true, "push": true}}', 'Asia/Shanghai', 'zh-CN', 1, 1, 1, NOW(), NOW()),
(5, 5, '王五', 'unknown', '普通用户王五', '{"theme": "dark", "notifications": {"email": false, "push": true}}', 'Asia/Shanghai', 'zh-CN', 1, 1, 1, NOW(), NOW()),
(6, 6, '赵六', 'unknown', '普通用户赵六', '{"theme": "auto", "notifications": {"email": true, "push": false}}', 'Asia/Shanghai', 'zh-CN', 1, 1, 1, NOW(), NOW());

-- ====================================================================
-- 4. 插入角色权限关联数据
-- ====================================================================

-- 超级管理员拥有所有权限
INSERT INTO role_permissions (role_id, permission_id, granted_by, status, created_by, updated_by, version, created_at, updated_at)
SELECT 1, id, 1, 'active', 1, 1, 1, NOW(), NOW() FROM permissions;

-- 管理员拥有大部分权限（除了系统配置和系统备份恢复）
INSERT INTO role_permissions (role_id, permission_id, granted_by, status, created_by, updated_by, version, created_at, updated_at)
SELECT 2, id, 1, 'active', 1, 1, 1, NOW(), NOW() FROM permissions
WHERE name NOT IN ('system.config', 'system.backup', 'system.restore');

-- VIP用户拥有内容相关权限和基础权限
INSERT INTO role_permissions (role_id, permission_id, granted_by, status, created_by, updated_by, version, created_at, updated_at)
SELECT 3, id, 1, 'active', 1, 1, 1, NOW(), NOW() FROM permissions
WHERE module IN ('content', 'resource', 'favorite', 'comment', 'profile');

-- 普通用户拥有基础权限
INSERT INTO role_permissions (role_id, permission_id, granted_by, status, created_by, updated_by, version, created_at, updated_at)
SELECT 4, id, 1, 'active', 1, 1, 1, NOW(), NOW() FROM permissions
WHERE module IN ('content', 'favorite', 'comment', 'profile') AND action IN ('view', 'create', 'update', 'delete');

-- 游客仅有浏览权限
INSERT INTO role_permissions (role_id, permission_id, granted_by, status, created_by, updated_by, version, created_at, updated_at)
SELECT 5, id, 1, 'active', 1, 1, 1, NOW(), NOW() FROM permissions
WHERE module IN ('content') AND action IN ('view');

-- ====================================================================
-- 5. 插入用户角色关联数据
-- ====================================================================

-- 为管理员分配超级管理员角色
INSERT INTO user_roles (user_id, role_id, granted_by, status, remarks, created_by, updated_by, version, created_at, updated_at) VALUES
(1, 1, 1, 'active', '系统管理员默认拥有超级管理员角色', 1, 1, 1, NOW(), NOW()),
(2, 4, 1, 'active', '测试用户分配普通用户角色', 1, 1, 1, NOW(), NOW()),
(3, 4, 1, 'active', '锁定用户分配普通用户角色', 1, 1, 1, NOW(), NOW()),
(4, 4, 1, 'active', '李四分配普通用户角色', 1, 1, 1, NOW(), NOW()),
(5, 4, 1, 'active', '王五分配普通用户角色', 1, 1, 1, NOW(), NOW()),
(6, 4, 1, 'active', '赵六分配普通用户角色', 1, 1, 1, NOW(), NOW());

-- ====================================================================
-- 6. 插入登录历史示例数据
-- ====================================================================

-- 管理员登录历史示例
INSERT INTO user_login_history (user_id, username, login_type, login_status, ip_address, user_agent, browser, os, location, login_at, logout_at, session_duration, session_id, is_current_session, risk_score, is_suspicious, security_flags, created_at) VALUES
(1, 'admin', 'password', 'success', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Chrome', 'Windows', '本地', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 3600, 'sess_initial_login', FALSE, 0, FALSE, '{"location": "familiar", "device": "familiar", "first_login": true}', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 'admin', 'password', 'success', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Chrome', 'Windows', '本地', DATE_SUB(NOW(), INTERVAL 1 HOUR), NULL, NULL, 'sess_current', TRUE, 0, FALSE, '{"location": "familiar", "device": "familiar"}', DATE_SUB(NOW(), INTERVAL 1 HOUR));

-- ====================================================================
-- 数据插入完成日志
-- ====================================================================
-- 用户权限核心基础数据插入完成：
-- 1. 系统角色数据：5个默认角色（超级管理员、管理员、VIP用户、普通用户、游客）
-- 2. 系统权限数据：51个系统权限，涵盖用户管理、角色管理、权限管理、系统管理、内容管理、资源管理、VIP管理、统计分析、基础用户功能等
-- 3. 管理员账户：1个默认管理员账户（用户名：admin，密码：admin123）
-- 4. 角色权限关联数据：为所有角色分配了对应权限
-- 5. 用户角色关联数据：为管理员分配了超级管理员角色
-- 6. 登录历史数据：管理员登录历史示例数据
--
-- 所有数据均包含审计字段（created_by, updated_by, version）
-- ====================================================================