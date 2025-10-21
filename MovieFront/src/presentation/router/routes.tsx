/**
 * @fileoverview 应用路由配置
 * @description 定义应用的所有路由配置，包含路由守卫、权限控制、懒加载等配置，支持管理员、用户、访客等不同角色的访问控制
 * @created 2025-10-21 11:01:39
 * @updated 2025-10-21 15:17:14
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { ProtectedRoute, AdminRoute, GuestRoute } from '@components/guards'
import React, { Suspense } from 'react'
import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from 'react-router-dom'

// 加载中组件
const LoadingSpinner: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
  </div>
)

// Suspense 包装器
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>

// 懒加载页面组件
const HomePage = React.lazy(() => import('@pages/home/HomePage'))

// 认证页面
const LoginPage = React.lazy(() => import('@pages/auth/LoginPage'))
const RegisterPage = React.lazy(() => import('@pages/auth/RegisterPage'))
const ForgotPasswordPage = React.lazy(
  () => import('@pages/auth/ForgotPasswordPage')
)
const ResetPasswordPage = React.lazy(
  () => import('@pages/auth/ResetPasswordPage')
)

// 用户页面
const UserDashboardPage = React.lazy(() => import('@pages/user/DashboardPage'))
const UserProfilePage = React.lazy(() => import('@pages/user/ProfilePage'))
const UserSettingsPage = React.lazy(() => import('@pages/user/SettingsPage'))
const UserDownloadsPage = React.lazy(() => import('@pages/user/DownloadsPage'))
const UserFavoritesPage = React.lazy(() => import('@pages/user/FavoritesPage'))
const UserMessagesPage = React.lazy(() => import('@pages/user/MessagesPage'))

// 影片页面
const MovieDetailPage = React.lazy(() => import('@pages/movie/MovieDetailPage'))
const MovieSearchPage = React.lazy(() => import('@pages/movie/MovieSearchPage'))
const MovieCategoryPage = React.lazy(
  () => import('@pages/movie/MovieCategoryPage')
)

// 专题页面
const SpecialCollectionsPage = React.lazy(
  () => import('@pages/special/SpecialCollectionsPage')
)

// 合集页面
const CollectionDetailPage = React.lazy(
  () => import('@pages/collection/CollectionDetailPage')
)

// 管理员页面
const AdminDashboardPage = React.lazy(
  () => import('@pages/admin/DashboardPage')
)
const AdminUsersPage = React.lazy(() => import('@pages/admin/UsersPage'))
const AdminMoviesPage = React.lazy(() => import('@pages/admin/MoviesPage'))
const AdminSystemPage = React.lazy(() => import('@pages/admin/SystemPage'))

// 测试页面
const ThemeTestPage = React.lazy(() => import('@pages/test/ThemeTestPage'))
const BadgeTestPage = React.lazy(() => import('@pages/test/BadgeTestPage'))

// 错误页面
const NotFoundPage = React.lazy(() => import('@pages/error/NotFoundPage'))
const ErrorPage = React.lazy(() => import('@pages/error/ErrorPage'))

// 路由配置
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

  // 认证相关路由
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

  // 用户相关路由
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

  // 影片相关路由
  {
    path: '/movie',
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

  // 专题路由
  {
    path: '/special/collections',
    element: (
      <SuspenseWrapper>
        <SpecialCollectionsPage />
      </SuspenseWrapper>
    ),
  },

  // 合集详情路由
  {
    path: '/collection/:collectionId',
    element: (
      <SuspenseWrapper>
        <CollectionDetailPage />
      </SuspenseWrapper>
    ),
  },

  // 管理员相关路由
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

  // 测试页面路由
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

  // 错误页面路由
  {
    path: '/404',
    element: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]

// 创建路由器实例
export const router: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter(routeConfig)

// 路由常量
export const ROUTES = {
  HOME: '/',

  // 认证路由
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // 用户路由
  USER: {
    DASHBOARD: '/user/dashboard',
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
    DOWNLOADS: '/user/downloads',
    FAVORITES: '/user/favorites',
    MESSAGES: '/user/messages',
  },

  // 影片路由
  MOVIE: {
    DETAIL: (id: string) => `/movie/${id}`,
    SEARCH: '/movie/search',
    CATEGORY: (category: string) => `/movie/category/${category}`,
  },

  // 专题路由
  SPECIAL: {
    COLLECTIONS: '/special/collections',
  },

  // 合集路由
  COLLECTION: {
    DETAIL: (id: string) => `/collection/${id}`,
  },

  // 管理员路由
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    MOVIES: '/admin/movies',
    SYSTEM: '/admin/system',
  },

  // 错误页面
  NOT_FOUND: '/404',
} as const
