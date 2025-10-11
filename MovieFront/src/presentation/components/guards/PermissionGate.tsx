/**
 * @fileoverview 权限门控组件
 * @description 基于新的状态管理架构，使用TanStack Query管理用户认证状态
 */

import { useAuth } from '@application/hooks/useAuth'
import React from 'react'

interface PermissionGateProps {
  children: React.ReactNode
  permissions?: string[]
  roles?: string[]
  requireAll?: boolean
  fallback?: React.ReactNode
  showFallback?: boolean
}

const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permissions = [],
  roles = [],
  requireAll = false,
  fallback = null,
  showFallback = true,
}) => {
  const { user, isAuthenticated } = useAuth()

  // 如果未认证，不显示内容
  if (!isAuthenticated || !user) {
    return showFallback ? <>{fallback}</> : null
  }

  // 检查权限
  let hasPermission = true

  if (permissions.length > 0) {
    const userPermissions = user.permissions || []

    if (requireAll) {
      // 需要所有权限
      hasPermission = permissions.every(permission =>
        userPermissions.includes(permission)
      )
    } else {
      // 需要任一权限
      hasPermission = permissions.some(permission =>
        userPermissions.includes(permission)
      )
    }
  }

  // 检查角色
  if (roles.length > 0 && hasPermission) {
    if (requireAll) {
      // 需要所有角色（通常不会用到）
      hasPermission = roles.includes(user.role)
    } else {
      // 需要任一角色
      hasPermission = roles.includes(user.role)
    }
  }

  // 检查用户状态
  if (hasPermission && user.status !== 'active') {
    hasPermission = false
  }

  // 根据权限检查结果渲染内容
  if (hasPermission) {
    return <>{children}</>
  }

  return showFallback ? <>{fallback}</> : null
}

export default PermissionGate
