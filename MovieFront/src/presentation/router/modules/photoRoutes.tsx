/**
 * @fileoverview 写真路由模块
 * @description 定义写真相关的所有路由配置
 * @author mosctz
 * @since 2.0.0
 * @version 2.0.0
 */

import React, { Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'

// 懒加载组件
const PhotoListPage = React.lazy(() => import('@pages/photo/PhotoListPage'))
const PhotoDetailPage = React.lazy(() => import('@pages/photo/PhotoDetailPage'))

// Suspense 包装器
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Suspense fallback={null}>{children}</Suspense>

/**
 * 获取写真路由配置
 */
export const getPhotoRoutes = (): RouteObject[] => [
  {
    path: '/photos',
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <PhotoListPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ':id',
        element: (
          <SuspenseWrapper>
            <PhotoDetailPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]
