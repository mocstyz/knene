/**
 * @fileoverview 用户路由模块
 * @description 定义用户相关的所有路由配置
 * @author mosctz
 * @since 2.0.0
 * @version 2.0.0
 */

import { ProtectedRoute } from '@components/guards'
import React, { Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

// 懒加载组件
const UserDashboardPage = React.lazy(() => import('@pages/user/DashboardPage'))
const UserProfilePage = React.lazy(() => import('@pages/user/ProfilePage'))
const UserSettingsPage = React.lazy(() => import('@pages/user/SettingsPage'))
const UserDownloadsPage = React.lazy(() => import('@pages/user/DownloadsPage'))
const UserFavoritesPage = React.lazy(() => import('@pages/user/FavoritesPage'))
const UserMessagesPage = React.lazy(() => import('@pages/user/MessagesPage'))

// Suspense 包装器
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Suspense fallback={null}>{children}</Suspense>

/**
 * 获取用户路由配置
 */
export const getUserRoutes = (): RouteObject[] => [
  {
    path: '/user',
    element: (
      <ProtectedRoute>
        <div>User Layout</div>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/user/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <SuspenseWrapper>
            <UserDashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'profile',
        element: (
          <SuspenseWrapper>
            <UserProfilePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'settings',
        element: (
          <SuspenseWrapper>
            <UserSettingsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'downloads',
        element: (
          <SuspenseWrapper>
            <UserDownloadsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'favorites',
        element: (
          <SuspenseWrapper>
            <UserFavoritesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'messages',
        element: (
          <SuspenseWrapper>
            <UserMessagesPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]
