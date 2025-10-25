/**
 * @fileoverview 访客路由守卫组件
 * @description 基于新的状态管理架构，使用TanStack Query管理用户认证状态，专用于保护访客专用页面。
 *              确保已登录用户无法访问登录、注册等访客页面，自动重定向到用户仪表板或原始目标页面。
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { useAuth } from '@application/hooks/useAuth'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

// 访客路由组件属性接口，定义访客专用页面的路由守卫配置
interface GuestRouteProps {
  children: React.ReactNode // 子组件内容，通常为登录或注册页面
  redirectPath?: string // 已登录用户重定向的目标路径，默认'/dashboard'
}

// 访客路由守卫组件，保护登录、注册等访客专用页面，防止已登录用户访问
const GuestRoute: React.FC<GuestRouteProps> = ({
  children,
  redirectPath = '/dashboard',
}) => {
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  // 访客保护验证 - 已登录用户重定向到目标页面，避免访问访客专用页面
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || redirectPath
    return <Navigate to={from} replace />
  }

  // 访客状态确认 - 未登录用户允许访问登录、注册等访客专用页面
  return <>{children}</>
}

export default GuestRoute
