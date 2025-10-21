/**
 * @fileoverview 路由守卫和权限管理模块统一导出
 * @description 统一导出所有路由守卫组件、权限常量和权限检查工具函数，提供完整的访问控制解决方案。
 *              包含基础认证守卫、管理员权限守卫、访客专用守卫、细粒度权限控制守卫以及权限检查工具函数。
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-21 11:46:37
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 导出路由守卫组件
export { default as ProtectedRoute } from './ProtectedRoute'
export { default as AdminRoute } from './AdminRoute'
export { default as GuestRoute } from './GuestRoute'
export { default as PermissionGate } from './PermissionGate'

// 系统权限常量定义，包含用户管理、影片管理、下载管理、系统管理和内容管理五大模块的权限标识
export const PERMISSIONS = {
  // 用户管理权限 - 控制用户相关操作的访问权限
  USER_VIEW: 'user:view', // 查看用户信息
  USER_CREATE: 'user:create', // 创建新用户
  USER_UPDATE: 'user:update', // 更新用户信息
  USER_DELETE: 'user:delete', // 删除用户账户

  // 影片管理权限 - 控制影片相关操作的访问权限
  MOVIE_VIEW: 'movie:view', // 查看影片内容
  MOVIE_CREATE: 'movie:create', // 创建新影片
  MOVIE_UPDATE: 'movie:update', // 更新影片信息
  MOVIE_DELETE: 'movie:delete', // 删除影片内容
  MOVIE_MODERATE: 'movie:moderate', // 影片内容审核

  // 下载管理权限 - 控制下载相关操作的访问权限
  DOWNLOAD_VIEW: 'download:view', // 查看下载记录
  DOWNLOAD_CREATE: 'download:create', // 创建下载任务
  DOWNLOAD_MANAGE: 'download:manage', // 管理下载任务
  DOWNLOAD_UNLIMITED: 'download:unlimited', // 无限制下载权限

  // 系统管理权限 - 控制系统级配置和监控的访问权限
  SYSTEM_CONFIG: 'system:config', // 系统配置管理
  SYSTEM_MONITOR: 'system:monitor', // 系统监控查看
  SYSTEM_BACKUP: 'system:backup', // 系统备份操作

  // 内容管理权限 - 控制内容发布和审核的访问权限
  CONTENT_MODERATE: 'content:moderate', // 内容审核管理
  CONTENT_PUBLISH: 'content:publish', // 内容发布权限
  CONTENT_FEATURE: 'content:feature', // 内容推荐权限
} as const

// 用户角色常量定义，定义系统中的用户角色层级和权限级别
export const ROLES = {
  USER: 'user', // 普通用户角色
  VIP: 'vip', // VIP用户角色
  MODERATOR: 'moderator', // 内容审核员角色
  ADMIN: 'admin', // 管理员角色
  SUPER_ADMIN: 'super_admin', // 超级管理员角色
} as const

// 权限检查工具函数 - 检查用户是否拥有指定权限，支持全匹配和任一匹配模式
export const hasPermission = (
  userPermissions: string[], // 用户拥有的权限列表
  requiredPermissions: string[], // 需要检查的权限列表
  requireAll = false // 是否要求拥有所有权限，默认false（任一权限匹配即可）
): boolean => {
  if (requireAll) {
    // 全匹配模式 - 必须拥有所有指定权限
    return requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    )
  }
  // 任一匹配模式 - 拥有任一权限即可
  return requiredPermissions.some(permission =>
    userPermissions.includes(permission)
  )
}

// 角色检查工具函数 - 检查用户角色是否在允许的角色列表中
export const hasRole = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole)
}

// 角色层级检查函数 - 基于角色层级检查用户是否具有访问目标角色资源的权限
export const hasRoleAccess = (
  userRole: keyof typeof ROLES, // 用户当前角色
  targetRole: keyof typeof ROLES // 目标要求的角色
): boolean => {
  // 定义角色权限层级，从低到高排序
  const roleHierarchy = [
    ROLES.USER,
    ROLES.VIP,
    ROLES.MODERATOR,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
  ]

  const userRoleIndex = roleHierarchy.indexOf(ROLES[userRole])
  const targetRoleIndex = roleHierarchy.indexOf(ROLES[targetRole])

  // 用户角色层级大于等于目标角色层级时允许访问
  return userRoleIndex >= targetRoleIndex
}
