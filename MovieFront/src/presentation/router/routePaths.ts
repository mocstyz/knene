/**
 * @fileoverview 路由路径常量定义
 * @description 集中管理所有路由路径，提供类型安全的路径生成函数
 * @author mosctz
 * @since 2.0.0
 * @version 2.0.0
 */

export const ROUTES = {
  HOME: '/',

  // 影片路由
  MOVIES: {
    DETAIL: (id: number | string) => `/movies/${id}`,
    SEARCH: '/movies/search',
    CATEGORY: (cat: string) => `/movies/category/${cat}`,
  },

  // 合集路由
  COLLECTIONS: {
    LIST: '/collections',
    DETAIL: (id: number | string) => `/collections/${id}`,
  },

  // 写真路由
  PHOTOS: {
    LIST: '/photos',
    DETAIL: (id: number | string) => `/photos/${id}`,
  },

  // 发现/浏览路由
  LATEST: '/latest',
  HOT: {
    WEEKLY: '/hot/weekly',
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

  // 认证路由
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
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
