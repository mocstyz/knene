/**
 * @fileoverview 基础受保护路由组件
 * @description 基于新的状态管理架构，使用TanStack Query管理用户认证状态，提供基础的访问控制功能。
 *              支持自定义权限要求、用户状态检查、加载状态显示和权限验证失败时的重定向处理。
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-21 11:50:02
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { useAuth } from '@application/hooks/useAuth'
import { LoadingSpinner } from '@components/atoms'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

// 基础受保护路由组件属性接口，定义基础访问控制的配置选项
interface ProtectedRouteProps {
  children: React.ReactNode // 子组件内容，权限验证通过时渲染
  requiredPermissions?: string[] // 要求的权限列表，默认空数组（无权限要求）
  fallbackPath?: string // 身份验证失败时的重定向路径，默认'/auth/login'
  showLoading?: boolean // 是否显示加载状态，默认true
}

// 基础受保护路由组件，提供基础的访问控制和用户状态验证功能
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  fallbackPath = '/auth/login',
  showLoading = true,
}) => {
  const location = useLocation()
  const { user, isAuthenticated, isLoading } = useAuth()

  // 加载状态处理 - 正在获取用户认证信息时显示加载动画
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

  // 身份认证验证 - 检查用户是否已登录和认证信息是否有效
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // 自定义权限验证 - 检查用户是否拥有访问受保护资源所需的权限
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

  // 账户状态检查 - 暂停状态用户重定向到账户暂停页面
  if (user.status === 'suspended') {
    return (
      <Navigate to="/account/suspended" state={{ from: location }} replace />
    )
  }

  // 邮箱验证状态检查 - 待验证用户重定向到邮箱验证页面
  if (user.status === 'pending_verification') {
    return (
      <Navigate
        to="/auth/verify-email"
        state={{ from: location, email: user.email }}
        replace
      />
    )
  }

  // 权限验证通过 - 所有检查通过后渲染受保护的子组件
  return <>{children}</>
}

export default ProtectedRoute
