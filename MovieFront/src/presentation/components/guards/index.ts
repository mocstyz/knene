export { default as ProtectedRoute } from './ProtectedRoute'
export { default as AdminRoute } from './AdminRoute'
export { default as GuestRoute } from './GuestRoute'
export { default as PermissionGate } from './PermissionGate'

// 权限常量
export const PERMISSIONS = {
  // 用户管理
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // 影片管理
  MOVIE_VIEW: 'movie:view',
  MOVIE_CREATE: 'movie:create',
  MOVIE_UPDATE: 'movie:update',
  MOVIE_DELETE: 'movie:delete',
  MOVIE_MODERATE: 'movie:moderate',
  
  // 下载管理
  DOWNLOAD_VIEW: 'download:view',
  DOWNLOAD_CREATE: 'download:create',
  DOWNLOAD_MANAGE: 'download:manage',
  DOWNLOAD_UNLIMITED: 'download:unlimited',
  
  // 系统管理
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_MONITOR: 'system:monitor',
  SYSTEM_BACKUP: 'system:backup',
  
  // 内容管理
  CONTENT_MODERATE: 'content:moderate',
  CONTENT_PUBLISH: 'content:publish',
  CONTENT_FEATURE: 'content:feature'
} as const

// 角色常量
export const ROLES = {
  USER: 'user',
  VIP: 'vip',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
} as const

// 权限检查工具函数
export const hasPermission = (
  userPermissions: string[],
  requiredPermissions: string[],
  requireAll = false
): boolean => {
  if (requireAll) {
    return requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    )
  }
  return requiredPermissions.some(permission =>
    userPermissions.includes(permission)
  )
}

export const hasRole = (
  userRole: string,
  requiredRoles: string[]
): boolean => {
  return requiredRoles.includes(userRole)
}

// 角色层级检查
export const hasRoleAccess = (
  userRole: keyof typeof ROLES,
  targetRole: keyof typeof ROLES
): boolean => {
  const roleHierarchy = [
    ROLES.USER,
    ROLES.VIP,
    ROLES.MODERATOR,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ]
  
  const userRoleIndex = roleHierarchy.indexOf(ROLES[userRole])
  const targetRoleIndex = roleHierarchy.indexOf(ROLES[targetRole])
  
  return userRoleIndex >= targetRoleIndex
}