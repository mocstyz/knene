/**
 * @fileoverview 影片路由模块
 * @description 定义影片相关的所有路由配置
 * @author mosctz
 * @since 2.0.0
 * @version 2.0.0
 */

import React, { Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'

// 懒加载组件
const MovieDetailPage = React.lazy(() => import('@pages/movie/MovieDetailPage'))
const MovieSearchPage = React.lazy(() => import('@pages/movie/MovieSearchPage'))
const MovieCategoryPage = React.lazy(
  () => import('@pages/movie/MovieCategoryPage')
)

// Suspense 包装器
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Suspense fallback={null}>{children}</Suspense>

/**
 * 获取影片路由配置
 */
export const getMovieRoutes = (): RouteObject[] => [
  {
    path: '/movies',
    children: [
      {
        path: ':id',
        element: (
          <SuspenseWrapper>
            <MovieDetailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'search',
        element: (
          <SuspenseWrapper>
            <MovieSearchPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'category/:category',
        element: (
          <SuspenseWrapper>
            <MovieCategoryPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]
