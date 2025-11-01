/**
 * @fileoverview 内容浏览路由模块
 * @description 定义内容浏览相关的所有路由配置（最新更新、热门内容）
 * @author mosctz
 * @since 2.0.0
 * @version 2.0.0
 */

import React, { Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'

// 懒加载组件
const LatestUpdateListPage = React.lazy(() => import('@pages/latestupdate/LatestUpdateListPage'))
const HotListPage = React.lazy(() => import('@pages/hot/HotListPage'))

// Suspense 包装器
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Suspense fallback={null}>{children}</Suspense>

/**
 * 获取内容浏览路由配置
 */
export const getContentRoutes = (): RouteObject[] => [
  {
    path: '/latest',
    element: (
      <SuspenseWrapper>
        <LatestUpdateListPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/hot/weekly',
    element: (
      <SuspenseWrapper>
        <HotListPage />
      </SuspenseWrapper>
    ),
  },
]
