/**
 * @fileoverview 合集路由模块
 * @description 定义合集相关的所有路由配置
 * @author mosctz
 * @since 2.0.0
 * @version 2.0.0
 */

import React, { Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'

// 懒加载组件
const CollectionsListPage = React.lazy(
  () => import('@pages/collections/CollectionsListPage')
)
const CollectionDetailPage = React.lazy(
  () => import('@pages/collections/CollectionDetailPage')
)

// Suspense 包装器
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Suspense fallback={null}>{children}</Suspense>

/**
 * 获取合集路由配置
 */
export const getCollectionRoutes = (): RouteObject[] => [
  {
    path: '/collections',
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <CollectionsListPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ':id',
        element: (
          <SuspenseWrapper>
            <CollectionDetailPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]
