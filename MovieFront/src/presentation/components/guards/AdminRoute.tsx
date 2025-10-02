import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUserStore } from '@/application/stores'
import { LoadingSpinner } from '@/components/atoms'

interface AdminRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'super_admin'
  fallbackPath?: string
}

const AdminRoute: React.FC<AdminRouteProps> = ({
  children,
  requiredRole = 'admin',
  fallbackPath = '/auth/login'
}) => {
  const location = useLocation()
  const { user, isAuthenticated, isLoading } = useUserStore()

  // 如果正在加载用户信息，显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">正在验证管理员权限...</p>
        </div>
      </div>
    )
  }

  // 如果未认证，重定向到登录页面
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={fallbackPath}
        state={{ from: location }}
        replace
      />
    )
  }

  // 检查是否为管理员
  const isAdmin = user.role === 'admin' || user.role === 'super_admin'
  if (!isAdmin) {
    return (
      <Navigate
        to="/unauthorized"
        state={{ 
          from: location, 
          message: '您没有访问管理后台的权限' 
        }}
        replace
      />
    )
  }

  // 检查特定管理员角色
  if (requiredRole === 'super_admin' && user.role !== 'super_admin') {
    return (
      <Navigate
        to="/admin/unauthorized"
        state={{ 
          from: location, 
          message: '此功能仅限超级管理员访问' 
        }}
        replace
      />
    )
  }

  // 检查管理员账户状态
  if (user.status !== 'active') {
    return (
      <Navigate
        to="/admin/account-inactive"
        state={{ from: location }}
        replace
      />
    )
  }

  // 通过所有检查，渲染子组件
  return <>{children}</>
}

export default AdminRoute