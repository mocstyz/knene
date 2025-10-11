/**
 * @fileoverview 受保护路由组件
 * @description 基于新的状态管理架构，使用TanStack Query管理用户认证状态
 */

import { useAuth } from '@application/hooks/useAuth'
import { LoadingSpinner } from '@components/atoms'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: string[]
  fallbackPath?: string
  showLoading?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  fallbackPath = '/auth/login',
  showLoading = true,
}) => {
  const location = useLocation()
  const { user, isAuthenticated, isLoading } = useAuth()

  // 如果正在加载用户信息，显示加载状态
  if (isLoading && showLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">正在验证身份...</p>
        </div>
      </div>
    )
  }

  // 如果未认证，重定向到登录页面
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // 检查权限
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every(permission =>
      user.permissions?.includes(permission)
    )

    if (!hasRequiredPermissions) {
      return (
        <Navigate
          to="/unauthorized"
          state={{ from: location, requiredPermissions }}
          replace
        />
      )
    }
  }

  // 检查用户状态
  if (user.status === 'suspended') {
    return (
      <Navigate to="/account/suspended" state={{ from: location }} replace />
    )
  }

  if (user.status === 'pending_verification') {
    return (
      <Navigate
        to="/auth/verify-email"
        state={{ from: location, email: user.email }}
        replace
      />
    )
  }

  // 通过所有检查，渲染子组件
  return <>{children}</>
}

export default ProtectedRoute
