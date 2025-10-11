/**
 * @fileoverview Query Client配置服务
 * @description 应用层的数据获取配置服务，基于TanStack Query提供统一的数据缓存、
 * 重试机制和错误处理策略。为整个应用提供高效、可靠的数据管理能力。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.2.0
 */

import type { MovieFilters } from '@application/stores/movieStore'
import { QueryClient } from '@tanstack/react-query'

/**
 * 创建Query Client实例
 *
 * 配置全局的查询和变更选项，包括缓存策略、重试机制和错误处理
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 数据缓存时间（5分钟）
      staleTime: 5 * 60 * 1000,
      // 缓存保持时间（10分钟）
      gcTime: 10 * 60 * 1000,
      // 重试配置
      retry: (failureCount, error) => {
        // 对于4xx错误不重试
        if ('status' in error) {
          const status = (error as { status?: number }).status
          if (status && status >= 400 && status < 500) {
            return false
          }
        }
        // 最多重试3次
        return failureCount < 3
      },
      // 重试延迟（指数退避）
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      // 窗口重新获得焦点时重新获取数据
      refetchOnWindowFocus: false,
      // 网络重连时重新获取数据
      refetchOnReconnect: true,
      // 组件挂载时重新获取数据
      refetchOnMount: true,
    },
    mutations: {
      // 变更重试配置
      retry: 1,
      // 变更重试延迟
      retryDelay: 1000,
    },
  },
})

/**
 * Query Keys 常量
 *
 * 定义所有查询键，确保查询键的一致性和可维护性
 */
export const QUERY_KEYS = {
  // 用户相关
  USER: {
    PROFILE: ['user', 'profile'] as const,
    PREFERENCES: ['user', 'preferences'] as const,
    SUBSCRIPTION: ['user', 'subscription'] as const,
  },

  // 影片相关
  MOVIES: {
    LIST: (page?: number, filters?: MovieFilters) =>
      ['movies', 'list', { page, filters }] as const,
    DETAIL: (id: string) => ['movies', 'detail', id] as const,
    FEATURED: ['movies', 'featured'] as const,
    SEARCH: (query: string, filters?: MovieFilters) =>
      ['movies', 'search', { query, filters }] as const,
    CATEGORIES: ['movies', 'categories'] as const,
    RECOMMENDATIONS: (userId?: string) =>
      ['movies', 'recommendations', userId] as const,
    INFINITE: (filters?: MovieFilters) =>
      ['movies', 'infinite', { filters }] as const,
  },

  // 下载相关
  DOWNLOADS: {
    LIST: ['downloads', 'list'] as const,
    ACTIVE: ['downloads', 'active'] as const,
    HISTORY: ['downloads', 'history'] as const,
    STATS: ['downloads', 'stats'] as const,
    STATUS: (downloadId: string) =>
      ['downloads', 'status', downloadId] as const,
    CAN_DOWNLOAD: (movieId: string) =>
      ['downloads', 'can-download', movieId] as const,
  },

  // 收藏相关
  FAVORITES: {
    LIST: ['favorites', 'list'] as const,
    CHECK: (movieId: string) => ['favorites', 'check', movieId] as const,
  },

  // 最近观看相关
  RECENTLY_VIEWED: {
    LIST: ['recently-viewed', 'list'] as const,
    ADD: (movieId: string) => ['recently-viewed', 'add', movieId] as const,
  },

  // 消息相关
  MESSAGES: {
    LIST: ['messages', 'list'] as const,
    UNREAD_COUNT: ['messages', 'unread-count'] as const,
    THREAD: (threadId: string) => ['messages', 'thread', threadId] as const,
  },

  // 系统相关
  SYSTEM: {
    CONFIG: ['system', 'config'] as const,
    STATS: ['system', 'stats'] as const,
    HEALTH: ['system', 'health'] as const,
  },
} as const

/**
 * 错误处理函数
 * @param error 查询错误对象
 * @returns {string} 返回用户友好的错误消息
 */
export const handleQueryError = (error: unknown): string => {
  console.error('Query error:', error)

  if (error instanceof Error) {
    // 网络错误
    if (error.message.includes('fetch')) {
      return '网络连接失败，请检查网络设置'
    }

    // 超时错误
    if (error.message.includes('timeout')) {
      return '请求超时，请稍后重试'
    }

    return error.message
  }

  return '未知错误，请稍后重试'
}

/**
 * 成功处理函数
 * @param data 查询返回的数据
 * @param message 可选的成功消息
 * @returns {unknown} 返回原始数据
 */
export const handleQuerySuccess = (
  data: unknown,
  message?: string
): unknown => {
  if (message) {
    console.log('Query success:', message, data)
  }
  return data
}

/**
 * 预定义的查询选项
 *
 * 提供不同场景下的查询配置模板
 */
export const createQueryOptions = {
  // 实时数据查询（短缓存时间）
  realtime: {
    staleTime: 0,
    gcTime: 1 * 60 * 1000, // 1分钟
    refetchInterval: 30 * 1000, // 30秒自动刷新
  },

  // 静态数据查询（长缓存时间）
  static: {
    staleTime: 60 * 60 * 1000, // 1小时
    gcTime: 24 * 60 * 60 * 1000, // 24小时
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },

  // 用户相关数据查询
  user: {
    staleTime: 5 * 60 * 1000, // 5分钟
    gcTime: 30 * 60 * 1000, // 30分钟
    refetchOnWindowFocus: true,
  },

  // 搜索结果查询
  search: {
    staleTime: 2 * 60 * 1000, // 2分钟
    gcTime: 10 * 60 * 1000, // 10分钟
    refetchOnWindowFocus: false,
  },
}
