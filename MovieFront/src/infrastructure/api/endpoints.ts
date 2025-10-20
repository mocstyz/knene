/**
 * @fileoverview API端点配置管理
 * @description 定义所有API接口的路径和参数，提供统一的端点管理和URL构建功能。
 *              包含认证、用户、影片、下载、消息、管理员、文件上传、通知、搜索和统计等模块。
 *              遵循RESTful设计规范，提供类型安全的端点配置和动态URL构建能力。
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-19 15:06:15
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// API端点基础URL配置 - 支持环境变量覆盖
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 认证相关端点配置 - 包含用户认证、密码管理、邮箱验证、用户信息和社交登录
export const AUTH_ENDPOINTS = {
  // 用户认证相关
  LOGIN: '/auth/login', // 用户登录
  LOGOUT: '/auth/logout', // 用户登出
  REGISTER: '/auth/register', // 用户注册
  REFRESH_TOKEN: '/auth/refresh', // 刷新访问令牌

  // 密码管理相关
  FORGOT_PASSWORD: '/auth/forgot-password', // 忘记密码
  RESET_PASSWORD: '/auth/reset-password', // 重置密码
  CHANGE_PASSWORD: '/auth/change-password', // 修改密码

  // 邮箱验证相关
  SEND_VERIFICATION: '/auth/send-verification', // 发送验证邮件
  VERIFY_EMAIL: '/auth/verify-email', // 验证邮箱

  // 用户信息相关
  PROFILE: '/auth/profile', // 获取用户信息
  UPDATE_PROFILE: '/auth/profile', // 更新用户信息

  // 社交登录相关
  GOOGLE_LOGIN: '/auth/google', // Google登录
  GITHUB_LOGIN: '/auth/github', // GitHub登录
} as const

// 用户相关端点配置 - 包含用户管理、偏好设置、收藏、观看历史、下载历史和用户统计
export const USER_ENDPOINTS = {
  // 用户管理相关
  USERS: '/users', // 用户列表
  USER_BY_ID: (id: string) => `/users/${id}`, // 根据ID获取用户
  USER_PROFILE: (id: string) => `/users/${id}/profile`, // 获取用户资料

  // 用户偏好设置相关
  PREFERENCES: '/users/preferences', // 获取偏好设置
  UPDATE_PREFERENCES: '/users/preferences', // 更新偏好设置

  // 用户收藏相关
  FAVORITES: '/users/favorites', // 获取收藏列表
  ADD_FAVORITE: '/users/favorites', // 添加收藏
  REMOVE_FAVORITE: (movieId: string) => `/users/favorites/${movieId}`, // 取消收藏

  // 观看历史相关
  WATCH_HISTORY: '/users/watch-history', // 获取观看历史
  ADD_WATCH_HISTORY: '/users/watch-history', // 添加观看记录
  CLEAR_WATCH_HISTORY: '/users/watch-history', // 清空观看历史

  // 下载历史相关
  DOWNLOAD_HISTORY: '/users/download-history', // 获取下载历史

  // 用户统计相关
  STATS: '/users/stats', // 获取用户统计信息
} as const

// 影片相关端点配置 - 包含影片管理、搜索、分类、标签、评分、评论、推荐系统、影片资源和影片统计
export const MOVIE_ENDPOINTS = {
  // 影片管理相关
  MOVIES: '/movies', // 影片列表
  MOVIE_BY_ID: (id: string) => `/movies/${id}`, // 根据ID获取影片
  MOVIE_DETAILS: (id: string) => `/movies/${id}/details`, // 获取影片详情

  // 影片搜索相关
  SEARCH: '/movies/search', // 搜索影片
  SEARCH_SUGGESTIONS: '/movies/search/suggestions', // 搜索建议

  // 影片分类相关
  CATEGORIES: '/movies/categories', // 获取影片分类
  MOVIES_BY_CATEGORY: (categoryId: string) => `/movies/categories/${categoryId}`, // 根据分类获取影片

  // 影片标签相关
  GENRES: '/movies/genres', // 获取影片标签
  MOVIES_BY_GENRE: (genre: string) => `/movies/genres/${genre}`, // 根据标签获取影片

  // 影片评分相关
  RATINGS: (movieId: string) => `/movies/${movieId}/ratings`, // 获取影片评分
  ADD_RATING: (movieId: string) => `/movies/${movieId}/ratings`, // 添加影片评分
  UPDATE_RATING: (movieId: string, ratingId: string) => `/movies/${movieId}/ratings/${ratingId}`, // 更新影片评分

  // 影片评论相关
  COMMENTS: (movieId: string) => `/movies/${movieId}/comments`, // 获取影片评论
  ADD_COMMENT: (movieId: string) => `/movies/${movieId}/comments`, // 添加影片评论
  UPDATE_COMMENT: (movieId: string, commentId: string) => `/movies/${movieId}/comments/${commentId}`, // 更新影片评论
  DELETE_COMMENT: (movieId: string, commentId: string) => `/movies/${movieId}/comments/${commentId}`, // 删除影片评论

  // 推荐系统相关
  RECOMMENDATIONS: '/movies/recommendations', // 获取推荐影片
  SIMILAR_MOVIES: (movieId: string) => `/movies/${movieId}/similar`, // 获取相似影片
  TRENDING: '/movies/trending', // 获取热门影片
  POPULAR: '/movies/popular', // 获取流行影片
  LATEST: '/movies/latest', // 获取最新影片

  // 影片资源相关
  DOWNLOAD_LINKS: (movieId: string) => `/movies/${movieId}/download-links`, // 获取下载链接
  STREAMING_LINKS: (movieId: string) => `/movies/${movieId}/streaming-links`, // 获取流媒体链接
  SUBTITLES: (movieId: string) => `/movies/${movieId}/subtitles`, // 获取字幕文件

  // 影片统计相关
  STATS: (movieId: string) => `/movies/${movieId}/stats`, // 获取影片统计
  INCREMENT_VIEW: (movieId: string) => `/movies/${movieId}/view`, // 增加观看次数
  INCREMENT_DOWNLOAD: (movieId: string) => `/movies/${movieId}/download`, // 增加下载次数
} as const

// 下载相关端点配置 - 包含下载管理、下载操作、下载状态、下载队列、下载历史和下载统计
export const DOWNLOAD_ENDPOINTS = {
  // 下载管理相关
  DOWNLOADS: '/downloads', // 下载列表
  DOWNLOAD_BY_ID: (id: string) => `/downloads/${id}`, // 根据ID获取下载

  // 下载操作相关
  START_DOWNLOAD: '/downloads/start', // 开始下载
  PAUSE_DOWNLOAD: (id: string) => `/downloads/${id}/pause`, // 暂停下载
  RESUME_DOWNLOAD: (id: string) => `/downloads/${id}/resume`, // 恢复下载
  CANCEL_DOWNLOAD: (id: string) => `/downloads/${id}/cancel`, // 取消下载
  RETRY_DOWNLOAD: (id: string) => `/downloads/${id}/retry`, // 重试下载

  // 下载状态相关
  DOWNLOAD_STATUS: (id: string) => `/downloads/${id}/status`, // 获取下载状态
  DOWNLOAD_PROGRESS: (id: string) => `/downloads/${id}/progress`, // 获取下载进度

  // 下载队列相关
  QUEUE: '/downloads/queue', // 获取下载队列
  QUEUE_STATUS: '/downloads/queue/status', // 获取队列状态

  // 下载历史相关
  HISTORY: '/downloads/history', // 获取下载历史
  CLEAR_HISTORY: '/downloads/history', // 清空下载历史

  // 下载统计相关
  STATS: '/downloads/stats', // 获取下载统计
} as const

// 消息相关端点配置 - 包含消息管理、收件箱、消息操作、消息状态、批量操作和消息统计
export const MESSAGE_ENDPOINTS = {
  // 消息管理相关
  MESSAGES: '/messages', // 消息列表
  MESSAGE_BY_ID: (id: string) => `/messages/${id}`, // 根据ID获取消息

  // 收件箱相关
  INBOX: '/messages/inbox', // 收件箱
  SENT: '/messages/sent', // 已发送
  DRAFTS: '/messages/drafts', // 草稿箱
  TRASH: '/messages/trash', // 垃圾箱

  // 消息操作相关
  SEND_MESSAGE: '/messages/send', // 发送消息
  REPLY_MESSAGE: (id: string) => `/messages/${id}/reply`, // 回复消息
  FORWARD_MESSAGE: (id: string) => `/messages/${id}/forward`, // 转发消息

  // 消息状态相关
  MARK_READ: (id: string) => `/messages/${id}/read`, // 标记已读
  MARK_UNREAD: (id: string) => `/messages/${id}/unread`, // 标记未读
  ARCHIVE: (id: string) => `/messages/${id}/archive`, // 归档消息
  DELETE: (id: string) => `/messages/${id}`, // 删除消息

  // 批量操作相关
  BULK_OPERATIONS: '/messages/bulk', // 批量操作
  BULK_READ: '/messages/bulk/read', // 批量标记已读
  BULK_DELETE: '/messages/bulk/delete', // 批量删除
  BULK_ARCHIVE: '/messages/bulk/archive', // 批量归档

  // 消息统计相关
  STATS: '/messages/stats', // 消息统计
  UNREAD_COUNT: '/messages/unread-count', // 未读数量
} as const

// 管理员相关端点配置 - 包含管理员认证、用户管理、影片管理、批量上传、内容审核、系统配置、系统监控、数据分析和报告管理
export const ADMIN_ENDPOINTS = {
  // 管理员认证相关
  LOGIN: '/admin/auth/login', // 管理员登录
  LOGOUT: '/admin/auth/logout', // 管理员登出
  PROFILE: '/admin/auth/profile', // 管理员资料

  // 用户管理相关
  USERS: '/admin/users', // 用户管理列表
  USER_BY_ID: (id: string) => `/admin/users/${id}`, // 根据ID获取用户
  CREATE_USER: '/admin/users', // 创建用户
  UPDATE_USER: (id: string) => `/admin/users/${id}`, // 更新用户
  DELETE_USER: (id: string) => `/admin/users/${id}`, // 删除用户
  ACTIVATE_USER: (id: string) => `/admin/users/${id}/activate`, // 激活用户
  DEACTIVATE_USER: (id: string) => `/admin/users/${id}/deactivate`, // 停用用户

  // 影片管理相关
  MOVIES: '/admin/movies', // 影片管理列表
  MOVIE_BY_ID: (id: string) => `/admin/movies/${id}`, // 根据ID获取影片
  CREATE_MOVIE: '/admin/movies', // 创建影片
  UPDATE_MOVIE: (id: string) => `/admin/movies/${id}`, // 更新影片
  DELETE_MOVIE: (id: string) => `/admin/movies/${id}`, // 删除影片
  APPROVE_MOVIE: (id: string) => `/admin/movies/${id}/approve`, // 审核通过影片
  REJECT_MOVIE: (id: string) => `/admin/movies/${id}/reject`, // 审核拒绝影片

  // 批量上传相关
  BULK_UPLOAD: '/admin/movies/bulk-upload', // 批量上传
  UPLOAD_STATUS: (batchId: string) => `/admin/movies/bulk-upload/${batchId}/status`, // 上传状态

  // 内容审核相关
  PENDING_REVIEWS: '/admin/content/pending', // 待审核内容
  APPROVE_CONTENT: (id: string) => `/admin/content/${id}/approve`, // 审核通过
  REJECT_CONTENT: (id: string) => `/admin/content/${id}/reject`, // 审核拒绝

  // 系统配置相关
  CONFIG: '/admin/config', // 系统配置
  UPDATE_CONFIG: '/admin/config', // 更新配置

  // 系统监控相关
  SYSTEM_STATS: '/admin/system/stats', // 系统统计
  SERVER_STATUS: '/admin/system/status', // 服务器状态
  LOGS: '/admin/system/logs', // 系统日志

  // 数据分析相关
  ANALYTICS: '/admin/analytics', // 数据分析
  USER_ANALYTICS: '/admin/analytics/users', // 用户分析
  MOVIE_ANALYTICS: '/admin/analytics/movies', // 影片分析
  DOWNLOAD_ANALYTICS: '/admin/analytics/downloads', // 下载分析

  // 报告管理相关
  REPORTS: '/admin/reports', // 报告列表
  GENERATE_REPORT: '/admin/reports/generate', // 生成报告
  REPORT_BY_ID: (id: string) => `/admin/reports/${id}`, // 根据ID获取报告
} as const

// 文件上传相关端点配置 - 包含文件上传、文件管理和文件信息
export const UPLOAD_ENDPOINTS = {
  // 文件上传相关
  UPLOAD: '/upload', // 文件上传
  UPLOAD_AVATAR: '/upload/avatar', // 头像上传
  UPLOAD_MOVIE_POSTER: '/upload/movie/poster', // 影片海报上传
  UPLOAD_MOVIE_BACKDROP: '/upload/movie/backdrop', // 影片背景图上传
  UPLOAD_SUBTITLE: '/upload/subtitle', // 字幕文件上传

  // 文件管理相关
  FILES: '/files', // 文件列表
  FILE_BY_ID: (id: string) => `/files/${id}`, // 根据ID获取文件
  DELETE_FILE: (id: string) => `/files/${id}`, // 删除文件

  // 文件信息相关
  FILE_INFO: (id: string) => `/files/${id}/info`, // 获取文件信息
  FILE_URL: (id: string) => `/files/${id}/url`, // 获取文件URL
} as const

// 通知相关端点配置 - 包含通知管理、通知操作、通知设置、推送通知和通知统计
export const NOTIFICATION_ENDPOINTS = {
  // 通知管理相关
  NOTIFICATIONS: '/notifications', // 通知列表
  NOTIFICATION_BY_ID: (id: string) => `/notifications/${id}`, // 根据ID获取通知

  // 通知操作相关
  MARK_READ: (id: string) => `/notifications/${id}/read`, // 标记已读
  MARK_ALL_READ: '/notifications/read-all', // 全部标记已读
  DELETE: (id: string) => `/notifications/${id}`, // 删除通知
  CLEAR_ALL: '/notifications/clear', // 清空所有通知

  // 通知设置相关
  SETTINGS: '/notifications/settings', // 通知设置
  UPDATE_SETTINGS: '/notifications/settings', // 更新设置

  // 推送通知相关
  SUBSCRIBE_PUSH: '/notifications/push/subscribe', // 订阅推送
  UNSUBSCRIBE_PUSH: '/notifications/push/unsubscribe', // 取消订阅

  // 通知统计相关
  STATS: '/notifications/stats', // 通知统计
  UNREAD_COUNT: '/notifications/unread-count', // 未读数量
} as const

// 搜索相关端点配置 - 包含全局搜索、搜索建议、高级搜索、搜索历史和热门搜索
export const SEARCH_ENDPOINTS = {
  // 全局搜索相关
  GLOBAL: '/search', // 全局搜索
  MOVIES: '/search/movies', // 影片搜索
  USERS: '/search/users', // 用户搜索

  // 搜索建议相关
  SUGGESTIONS: '/search/suggestions', // 搜索建议
  AUTOCOMPLETE: '/search/autocomplete', // 自动完成

  // 高级搜索相关
  ADVANCED: '/search/advanced', // 高级搜索
  FILTERS: '/search/filters', // 搜索过滤器

  // 搜索历史相关
  HISTORY: '/search/history', // 搜索历史
  CLEAR_HISTORY: '/search/history', // 清空历史

  // 热门搜索相关
  TRENDING: '/search/trending', // 热门搜索
  POPULAR: '/search/popular', // 流行搜索
} as const

// 统计相关端点配置 - 包含全局统计、用户统计、影片统计、下载统计和系统统计
export const STATS_ENDPOINTS = {
  // 全局统计相关
  GLOBAL: '/stats', // 全局统计
  DASHBOARD: '/stats/dashboard', // 仪表盘统计

  // 用户统计相关
  USERS: '/stats/users', // 用户统计
  USER_ACTIVITY: '/stats/users/activity', // 用户活动统计

  // 影片统计相关
  MOVIES: '/stats/movies', // 影片统计
  MOVIE_POPULARITY: '/stats/movies/popularity', // 影片热度统计

  // 下载统计相关
  DOWNLOADS: '/stats/downloads', // 下载统计
  DOWNLOAD_TRENDS: '/stats/downloads/trends', // 下载趋势统计

  // 系统统计相关
  SYSTEM: '/stats/system', // 系统统计
  PERFORMANCE: '/stats/performance', // 性能统计
} as const

// 构建完整的API URL - 将端点路径与基础URL合并
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`
}

// 构建带参数的URL - 支持查询参数和数组参数
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

// 统一导出所有端点配置 - 提供集中访问入口
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

// 端点函数类型定义 - 支持动态参数的端点函数
export type EndpointFunction = (...args: string[]) => string
// 端点配置类型定义 - 端点配置的数据结构
export type EndpointConfig = Record<string, string | EndpointFunction>