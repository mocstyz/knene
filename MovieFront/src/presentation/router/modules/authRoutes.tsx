/**
 * @fileoverview 认证路由模块
 * @description 定义认证相关的所有路由配置
 * @author mosctz
 * @since 2.0.0
 * @version 2.0.0
 */

import { GuestRoute } from '@components/guards'
import React, { Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'

// 懒加载组件
const LoginPage = React.lazy(() => import('@pages/auth/LoginPage'))
const RegisterPage = React.lazy(() => import('@pages/auth/RegisterPage'))
const ForgotPasswordPage = React.lazy(
  () => import('@pages/auth/ForgotPasswordPage')
)
const ResetPasswordPage = React.lazy(
  () => import('@pages/auth/ResetPasswordPage')
)

// Suspense 包装器
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Suspense fallback={null}>{children}</Suspense>

/**
 * 获取认证路由配置
 */
export const getAuthRoutes = (): RouteObject[] => [
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: (
          <GuestRoute>
            <SuspenseWrapper>
              <LoginPage />
            </SuspenseWrapper>
          </GuestRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestRoute>
            <SuspenseWrapper>
              <RegisterPage />
            </SuspenseWrapper>
          </GuestRoute>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <GuestRoute>
            <SuspenseWrapper>
              <ForgotPasswordPage />
            </SuspenseWrapper>
          </GuestRoute>
        ),
      },
      {
        path: 'reset-password',
        element: (
          <SuspenseWrapper>
            <ResetPasswordPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]
