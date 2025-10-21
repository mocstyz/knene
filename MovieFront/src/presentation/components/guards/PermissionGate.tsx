/**
 * @fileoverview 权限门控组件
 * @description 基于新的状态管理架构，使用TanStack Query管理用户认证状态，提供细粒度的权限控制功能。
 *              支持基于权限标识符、用户角色、匹配模式的多维度权限验证，以及账户状态检查和自定义回退内容。
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-21 11:48:25
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { useAuth } from '@application/hooks/useAuth'
import React from 'react'

// 权限门控组件属性接口，定义细粒度权限控制的配置选项
interface PermissionGateProps {
  children: React.ReactNode // 子组件内容，权限验证通过时渲染
  permissions?: string[] // 要求的权限列表，默认为空数组（无权限要求）
  roles?: string[] // 要求的角色列表，默认为空数组（无角色要求）
  requireAll?: boolean // 权限匹配模式，true为全匹配，false为任一匹配，默认false
  fallback?: React.ReactNode // 权限验证失败时显示的回退内容，默认null
  showFallback?: boolean // 是否显示回退内容，默认true
}

// 权限门控组件，提供基于权限标识符和用户角色的细粒度访问控制
const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permissions = [],
  roles = [],
  requireAll = false,
  fallback = null,
  showFallback = true,
}) => {
  const { user, isAuthenticated } = useAuth()

  // 身份认证检查 - 确保用户已登录并且用户信息有效
  if (!isAuthenticated || !user) {
    return showFallback ? <>{fallback}</> : null
  }

  // 权限验证初始化 - 默认设置权限验证通过
  let hasPermission = true

  // 权限标识符验证 - 检查用户是否拥有所需的权限
  if (permissions.length > 0) {
    const userPermissions = user.permissions || []

    if (requireAll) {
      // 全匹配模式 - 必须拥有所有指定权限
      hasPermission = permissions.every(permission =>
        userPermissions.includes(permission)
      )
    } else {
      // 任一匹配模式 - 拥有任一权限即可
      hasPermission = permissions.some(permission =>
        userPermissions.includes(permission)
      )
    }
  }

  // 用户角色验证 - 检查用户角色是否满足要求（仅在权限验证通过时执行）
  if (roles.length > 0 && hasPermission) {
    if (requireAll) {
      // 全匹配模式 - 必须拥有所有指定角色（通常不使用）
      hasPermission = roles.includes(user.role)
    } else {
      // 任一匹配模式 - 拥有任一角色即可
      hasPermission = roles.includes(user.role)
    }
  }

  // 账户状态验证 - 确保用户账户处于激活状态
  if (hasPermission && user.status !== 'active') {
    hasPermission = false
  }

  // 内容渲染控制 - 根据权限验证结果决定渲染内容
  if (hasPermission) {
    return <>{children}</>
  }

  // 权限验证失败 - 显示回退内容或返回null
  return showFallback ? <>{fallback}</> : null
}

export default PermissionGate
