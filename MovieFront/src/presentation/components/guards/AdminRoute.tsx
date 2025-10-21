/**
 * @fileoverview 管理员路由组件
 * @description 基于新的状态管理架构，使用TanStack Query管理用户认证状态，提供完整的权限验证和访问控制功能。
 *              支持多层级权限检查，包括基础认证、管理员角色验证、特定权限要求以及账户状态验证。
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-21 11:40:59
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { useAuth } from '@application/hooks/useAuth'
import { LoadingSpinner } from '@components/atoms'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

// 管理员路由组件属性接口，定义权限验证和访问控制的配置选项
interface AdminRouteProps {
  children: React.ReactNode // 子组件内容
  requiredRole?: 'admin' | 'super_admin' // 要求的管理员角色级别，默认'admin'
  fallbackPath?: string // 权限验证失败时的重定向路径，默认'/auth/login'
}

// 管理员路由守卫组件，提供多层级权限验证和访问控制功能
const AdminRoute: React.FC<AdminRouteProps> = ({
  children,
  requiredRole = 'admin',
  fallbackPath = '/auth/login',
}) => {
  const location = useLocation()
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth()

  // 加载状态处理 - 正在获取用户认证信息时显示加载动画
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">正在验证管理员权限...</p>
        </div>
      </div>
    )
  }

  // 身份认证验证 - 检查用户是否已登录和认证信息是否有效
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // 管理员权限验证 - 确保用户具有管理员角色权限
  if (!isAdmin) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          from: location,
          message: '您没有访问管理后台的权限',
        }}
        replace
      />
    )
  }

  // 角色级别验证 - 检查是否满足特定的管理员角色要求
  if (requiredRole === 'super_admin' && user.role !== 'super_admin') {
    return (
      <Navigate
        to="/admin/unauthorized"
        state={{
          from: location,
          message: '此功能仅限超级管理员访问',
        }}
        replace
      />
    )
  }

  // 账户状态验证 - 确保管理员账户处于激活状态
  if (user.status !== 'active') {
    return (
      <Navigate
        to="/admin/account-inactive"
        state={{ from: location }}
        replace
      />
    )
  }

  // 权限验证通过 - 所有检查通过后渲染受保护的子组件
  return <>{children}</>
}

export default AdminRoute
