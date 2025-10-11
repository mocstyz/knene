/**
 * @fileoverview 访客路由组件
 * @description 基于新的状态管理架构，使用TanStack Query管理用户认证状态
 */

import { useAuth } from '@application/hooks/useAuth'
import { LoadingSpinner } from '@components/atoms'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface GuestRouteProps {
  children: React.ReactNode
  redirectPath?: string
}

const GuestRoute: React.FC<GuestRouteProps> = ({
  children,
  redirectPath = '/dashboard',
}) => {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  // 如果正在加载用户信息，显示加载状态
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">正在检查登录状态...</p>
        </div>
      </div>
    )
  }

  // 如果已认证，重定向到指定页面或从state中获取的原始页面
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || redirectPath
    return <Navigate to={from} replace />
  }

  // 未认证，渲染子组件（登录/注册页面）
  return <>{children}</>
}

export default GuestRoute
