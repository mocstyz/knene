/**
 * @fileoverview 测试路由模块
 * @description 定义测试页面相关的所有路由配置
 * @author mosctz
 * @since 2.0.0
 * @version 2.0.0
 */

import React, { Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'

// 懒加载组件
const ThemeTestPage = React.lazy(() => import('@pages/test/ThemeTestPage'))
const BadgeTestPage = React.lazy(() => import('@pages/test/BadgeTestPage'))

// Suspense 包装器
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Suspense fallback={null}>{children}</Suspense>

/**
 * 获取测试路由配置
 */
export const getTestRoutes = (): RouteObject[] => [
  {
    path: '/test/theme',
    element: (
      <SuspenseWrapper>
        <ThemeTestPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/test/badge',
    element: (
      <SuspenseWrapper>
        <BadgeTestPage />
      </SuspenseWrapper>
    ),
  },
]
