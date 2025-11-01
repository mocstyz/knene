/**
 * @fileoverview 管理员路由模块
 * @description 定义管理员相关的所有路由配置
 * @author mosctz
 * @since 2.0.0
 * @version 2.0.0
 */

import { AdminRoute } from '@components/guards'
import React, { Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

// 懒加载组件
const AdminDashboardPage = React.lazy(
  () => import('@pages/admin/DashboardPage')
)
const AdminUsersPage = React.lazy(() => import('@pages/admin/UsersPage'))
const AdminMoviesPage = React.lazy(() => import('@pages/admin/MoviesPage'))
const AdminSystemPage = React.lazy(() => import('@pages/admin/SystemPage'))

// Suspense 包装器
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Suspense fallback={null}>{children}</Suspense>

/**
 * 获取管理员路由配置
 */
export const getAdminRoutes = (): RouteObject[] => [
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <div>Admin Layout</div>
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <SuspenseWrapper>
            <AdminDashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'users',
        element: (
          <SuspenseWrapper>
            <AdminUsersPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'movies',
        element: (
          <SuspenseWrapper>
            <AdminMoviesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'system',
        element: (
          <SuspenseWrapper>
            <AdminSystemPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]
