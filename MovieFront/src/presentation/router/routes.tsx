/**
 * @fileoverview 应用路由配置
 * @description 组合所有路由模块，创建路由器实例
 * @author mosctz
 * @since 2.0.0
 * @version 2.0.0
 */

import { createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import React, { Suspense } from 'react'

// 导入路由模块
import { getAuthRoutes } from './modules/authRoutes.tsx'
import { getUserRoutes } from './modules/userRoutes.tsx'
import { getMovieRoutes } from './modules/movieRoutes.tsx'
import { getPhotoRoutes } from './modules/photoRoutes.tsx'
import { getCollectionRoutes } from './modules/collectionRoutes.tsx'
import { getContentRoutes } from './modules/contentRoutes.tsx'
import { getAdminRoutes } from './modules/adminRoutes.tsx'
import { getTestRoutes } from './modules/testRoutes.tsx'
import { getErrorRoutes } from './modules/errorRoutes.tsx'

// 导入首页组件
const HomePage = React.lazy(() => import('@pages/home/HomePage'))
const ErrorPage = React.lazy(() => import('@pages/error/ErrorPage'))

// Suspense 包装器
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Suspense fallback={null}>{children}</Suspense>

// 组合所有路由配置
const routeConfig: RouteObject[] = [
  // 首页路由
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <HomePage />
      </SuspenseWrapper>
    ),
    errorElement: <ErrorPage />,
  },

  // 功能路由模块
  ...getAuthRoutes(),
  ...getUserRoutes(),
  ...getMovieRoutes(),
  ...getPhotoRoutes(),
  ...getCollectionRoutes(),
  ...getContentRoutes(),
  ...getAdminRoutes(),
  ...getTestRoutes(),

  // 错误路由
  ...getErrorRoutes(),
]

// 创建路由器实例
export const router = createBrowserRouter(routeConfig)
