/**
 * API端点配置
 * 定义所有API接口的路径和参数，便于统一管理和维护
 */

/**
 * API端点基础配置
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

/**
 * 认证相关端点
 */
export const AUTH_ENDPOINTS = {
  // 用户认证
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',

  // 密码管理
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',

  // 邮箱验证
  SEND_VERIFICATION: '/auth/send-verification',
  VERIFY_EMAIL: '/auth/verify-email',

  // 用户信息
  PROFILE: '/auth/profile',
  UPDATE_PROFILE: '/auth/profile',

  // 社交登录
  GOOGLE_LOGIN: '/auth/google',
  GITHUB_LOGIN: '/auth/github',
} as const

/**
 * 用户相关端点
 */
export const USER_ENDPOINTS = {
  // 用户管理
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
  USER_PROFILE: (id: string) => `/users/${id}/profile`,

  // 用户偏好设置
  PREFERENCES: '/users/preferences',
  UPDATE_PREFERENCES: '/users/preferences',

  // 用户收藏
  FAVORITES: '/users/favorites',
  ADD_FAVORITE: '/users/favorites',
  REMOVE_FAVORITE: (movieId: string) => `/users/favorites/${movieId}`,

  // 观看历史
  WATCH_HISTORY: '/users/watch-history',
  ADD_WATCH_HISTORY: '/users/watch-history',
  CLEAR_WATCH_HISTORY: '/users/watch-history',

  // 下载历史
  DOWNLOAD_HISTORY: '/users/download-history',

  // 用户统计
  STATS: '/users/stats',
} as const

/**
 * 影片相关端点
 */
export const MOVIE_ENDPOINTS = {
  // 影片管理
  MOVIES: '/movies',
  MOVIE_BY_ID: (id: string) => `/movies/${id}`,
  MOVIE_DETAILS: (id: string) => `/movies/${id}/details`,

  // 影片搜索
  SEARCH: '/movies/search',
  SEARCH_SUGGESTIONS: '/movies/search/suggestions',

  // 影片分类
  CATEGORIES: '/movies/categories',
  MOVIES_BY_CATEGORY: (categoryId: string) =>
    `/movies/categories/${categoryId}`,

  // 影片标签
  GENRES: '/movies/genres',
  MOVIES_BY_GENRE: (genre: string) => `/movies/genres/${genre}`,

  // 影片评分
  RATINGS: (movieId: string) => `/movies/${movieId}/ratings`,
  ADD_RATING: (movieId: string) => `/movies/${movieId}/ratings`,
  UPDATE_RATING: (movieId: string, ratingId: string) =>
    `/movies/${movieId}/ratings/${ratingId}`,

  // 影片评论
  COMMENTS: (movieId: string) => `/movies/${movieId}/comments`,
  ADD_COMMENT: (movieId: string) => `/movies/${movieId}/comments`,
  UPDATE_COMMENT: (movieId: string, commentId: string) =>
    `/movies/${movieId}/comments/${commentId}`,
  DELETE_COMMENT: (movieId: string, commentId: string) =>
    `/movies/${movieId}/comments/${commentId}`,

  // 推荐系统
  RECOMMENDATIONS: '/movies/recommendations',
  SIMILAR_MOVIES: (movieId: string) => `/movies/${movieId}/similar`,
  TRENDING: '/movies/trending',
  POPULAR: '/movies/popular',
  LATEST: '/movies/latest',

  // 影片资源
  DOWNLOAD_LINKS: (movieId: string) => `/movies/${movieId}/download-links`,
  STREAMING_LINKS: (movieId: string) => `/movies/${movieId}/streaming-links`,
  SUBTITLES: (movieId: string) => `/movies/${movieId}/subtitles`,

  // 影片统计
  STATS: (movieId: string) => `/movies/${movieId}/stats`,
  INCREMENT_VIEW: (movieId: string) => `/movies/${movieId}/view`,
  INCREMENT_DOWNLOAD: (movieId: string) => `/movies/${movieId}/download`,
} as const

/**
 * 下载相关端点
 */
export const DOWNLOAD_ENDPOINTS = {
  // 下载管理
  DOWNLOADS: '/downloads',
  DOWNLOAD_BY_ID: (id: string) => `/downloads/${id}`,

  // 下载操作
  START_DOWNLOAD: '/downloads/start',
  PAUSE_DOWNLOAD: (id: string) => `/downloads/${id}/pause`,
  RESUME_DOWNLOAD: (id: string) => `/downloads/${id}/resume`,
  CANCEL_DOWNLOAD: (id: string) => `/downloads/${id}/cancel`,
  RETRY_DOWNLOAD: (id: string) => `/downloads/${id}/retry`,

  // 下载状态
  DOWNLOAD_STATUS: (id: string) => `/downloads/${id}/status`,
  DOWNLOAD_PROGRESS: (id: string) => `/downloads/${id}/progress`,

  // 下载队列
  QUEUE: '/downloads/queue',
  QUEUE_STATUS: '/downloads/queue/status',

  // 下载历史
  HISTORY: '/downloads/history',
  CLEAR_HISTORY: '/downloads/history',

  // 下载统计
  STATS: '/downloads/stats',
} as const

/**
 * 消息相关端点
 */
export const MESSAGE_ENDPOINTS = {
  // 消息管理
  MESSAGES: '/messages',
  MESSAGE_BY_ID: (id: string) => `/messages/${id}`,

  // 收件箱
  INBOX: '/messages/inbox',
  SENT: '/messages/sent',
  DRAFTS: '/messages/drafts',
  TRASH: '/messages/trash',

  // 消息操作
  SEND_MESSAGE: '/messages/send',
  REPLY_MESSAGE: (id: string) => `/messages/${id}/reply`,
  FORWARD_MESSAGE: (id: string) => `/messages/${id}/forward`,

  // 消息状态
  MARK_READ: (id: string) => `/messages/${id}/read`,
  MARK_UNREAD: (id: string) => `/messages/${id}/unread`,
  ARCHIVE: (id: string) => `/messages/${id}/archive`,
  DELETE: (id: string) => `/messages/${id}`,

  // 批量操作
  BULK_OPERATIONS: '/messages/bulk',
  BULK_READ: '/messages/bulk/read',
  BULK_DELETE: '/messages/bulk/delete',
  BULK_ARCHIVE: '/messages/bulk/archive',

  // 消息统计
  STATS: '/messages/stats',
  UNREAD_COUNT: '/messages/unread-count',
} as const

/**
 * 管理员相关端点
 */
export const ADMIN_ENDPOINTS = {
  // 管理员认证
  LOGIN: '/admin/auth/login',
  LOGOUT: '/admin/auth/logout',
  PROFILE: '/admin/auth/profile',

  // 用户管理
  USERS: '/admin/users',
  USER_BY_ID: (id: string) => `/admin/users/${id}`,
  CREATE_USER: '/admin/users',
  UPDATE_USER: (id: string) => `/admin/users/${id}`,
  DELETE_USER: (id: string) => `/admin/users/${id}`,
  ACTIVATE_USER: (id: string) => `/admin/users/${id}/activate`,
  DEACTIVATE_USER: (id: string) => `/admin/users/${id}/deactivate`,

  // 影片管理
  MOVIES: '/admin/movies',
  MOVIE_BY_ID: (id: string) => `/admin/movies/${id}`,
  CREATE_MOVIE: '/admin/movies',
  UPDATE_MOVIE: (id: string) => `/admin/movies/${id}`,
  DELETE_MOVIE: (id: string) => `/admin/movies/${id}`,
  APPROVE_MOVIE: (id: string) => `/admin/movies/${id}/approve`,
  REJECT_MOVIE: (id: string) => `/admin/movies/${id}/reject`,

  // 批量上传
  BULK_UPLOAD: '/admin/movies/bulk-upload',
  UPLOAD_STATUS: (batchId: string) =>
    `/admin/movies/bulk-upload/${batchId}/status`,

  // 内容审核
  PENDING_REVIEWS: '/admin/content/pending',
  APPROVE_CONTENT: (id: string) => `/admin/content/${id}/approve`,
  REJECT_CONTENT: (id: string) => `/admin/content/${id}/reject`,

  // 系统配置
  CONFIG: '/admin/config',
  UPDATE_CONFIG: '/admin/config',

  // 系统监控
  SYSTEM_STATS: '/admin/system/stats',
  SERVER_STATUS: '/admin/system/status',
  LOGS: '/admin/system/logs',

  // 数据分析
  ANALYTICS: '/admin/analytics',
  USER_ANALYTICS: '/admin/analytics/users',
  MOVIE_ANALYTICS: '/admin/analytics/movies',
  DOWNLOAD_ANALYTICS: '/admin/analytics/downloads',

  // 报告管理
  REPORTS: '/admin/reports',
  GENERATE_REPORT: '/admin/reports/generate',
  REPORT_BY_ID: (id: string) => `/admin/reports/${id}`,
} as const

/**
 * 文件上传相关端点
 */
export const UPLOAD_ENDPOINTS = {
  // 文件上传
  UPLOAD: '/upload',
  UPLOAD_AVATAR: '/upload/avatar',
  UPLOAD_MOVIE_POSTER: '/upload/movie/poster',
  UPLOAD_MOVIE_BACKDROP: '/upload/movie/backdrop',
  UPLOAD_SUBTITLE: '/upload/subtitle',

  // 文件管理
  FILES: '/files',
  FILE_BY_ID: (id: string) => `/files/${id}`,
  DELETE_FILE: (id: string) => `/files/${id}`,

  // 文件信息
  FILE_INFO: (id: string) => `/files/${id}/info`,
  FILE_URL: (id: string) => `/files/${id}/url`,
} as const

/**
 * 通知相关端点
 */
export const NOTIFICATION_ENDPOINTS = {
  // 通知管理
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_BY_ID: (id: string) => `/notifications/${id}`,

  // 通知操作
  MARK_READ: (id: string) => `/notifications/${id}/read`,
  MARK_ALL_READ: '/notifications/read-all',
  DELETE: (id: string) => `/notifications/${id}`,
  CLEAR_ALL: '/notifications/clear',

  // 通知设置
  SETTINGS: '/notifications/settings',
  UPDATE_SETTINGS: '/notifications/settings',

  // 推送通知
  SUBSCRIBE_PUSH: '/notifications/push/subscribe',
  UNSUBSCRIBE_PUSH: '/notifications/push/unsubscribe',

  // 通知统计
  STATS: '/notifications/stats',
  UNREAD_COUNT: '/notifications/unread-count',
} as const

/**
 * 搜索相关端点
 */
export const SEARCH_ENDPOINTS = {
  // 全局搜索
  GLOBAL: '/search',
  MOVIES: '/search/movies',
  USERS: '/search/users',

  // 搜索建议
  SUGGESTIONS: '/search/suggestions',
  AUTOCOMPLETE: '/search/autocomplete',

  // 高级搜索
  ADVANCED: '/search/advanced',
  FILTERS: '/search/filters',

  // 搜索历史
  HISTORY: '/search/history',
  CLEAR_HISTORY: '/search/history',

  // 热门搜索
  TRENDING: '/search/trending',
  POPULAR: '/search/popular',
} as const

/**
 * 统计相关端点
 */
export const STATS_ENDPOINTS = {
  // 全局统计
  GLOBAL: '/stats',
  DASHBOARD: '/stats/dashboard',

  // 用户统计
  USERS: '/stats/users',
  USER_ACTIVITY: '/stats/users/activity',

  // 影片统计
  MOVIES: '/stats/movies',
  MOVIE_POPULARITY: '/stats/movies/popularity',

  // 下载统计
  DOWNLOADS: '/stats/downloads',
  DOWNLOAD_TRENDS: '/stats/downloads/trends',

  // 系统统计
  SYSTEM: '/stats/system',
  PERFORMANCE: '/stats/performance',
} as const

/**
 * 工具函数：构建完整的API URL
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`
}

/**
 * 工具函数：构建带参数的URL
 */
export const buildUrlWithParams = (
  endpoint: string,
  params: Record<string, any>
): string => {
  const url = new URL(buildApiUrl(endpoint), window.location.origin)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(item => url.searchParams.append(key, String(item)))
      } else {
        url.searchParams.append(key, String(value))
      }
    }
  })

  return url.pathname + url.search
}

/**
 * 导出所有端点
 */
export const ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  MOVIE: MOVIE_ENDPOINTS,
  DOWNLOAD: DOWNLOAD_ENDPOINTS,
  MESSAGE: MESSAGE_ENDPOINTS,
  ADMIN: ADMIN_ENDPOINTS,
  UPLOAD: UPLOAD_ENDPOINTS,
  NOTIFICATION: NOTIFICATION_ENDPOINTS,
  SEARCH: SEARCH_ENDPOINTS,
  STATS: STATS_ENDPOINTS,
} as const

// 导出类型
export type EndpointFunction = (...args: string[]) => string
export type EndpointConfig = Record<string, string | EndpointFunction>
