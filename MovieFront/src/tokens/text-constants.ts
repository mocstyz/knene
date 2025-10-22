/**
 * @fileoverview 文本常量系统
 * @description 统一管理应用中所有的文本常量，避免重复定义和不一致问题，遵循DDD架构原则，按业务领域组织文本常量
 * @created 2025-10-21 12:25:27
 * @updated 2025-10-22 09:53:05
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 通用UI文本常量，包含操作按钮、状态文本、导航文本等通用界面文本
export const UI_TEXT = {
  // 操作按钮相关文本
  ACTIONS: {
    MORE: '更多 >',
    VIEW_MORE: '查看更多',
    VIEW_ALL: '查看全部',
    LOAD_MORE: '加载更多',
    EXPAND: '展开',
    COLLAPSE: '收起',
    CONFIRM: '确认',
    CANCEL: '取消',
    SUBMIT: '提交',
    RESET: '重置',
    SAVE: '保存',
    DELETE: '删除',
    EDIT: '编辑',
    ADD: '添加',
    SEARCH: '搜索',
    FILTER: '筛选',
    SORT: '排序',
  },

  // 状态相关文本
  STATUS: {
    LOADING: '加载中...',
    EMPTY: '暂无数据',
    ERROR: '加载失败',
    SUCCESS: '操作成功',
    FAILED: '操作失败',
    PROCESSING: '处理中...',
    COMPLETED: '已完成',
    PENDING: '待处理',
  },

  // 导航相关文本
  NAVIGATION: {
    HOME: '首页',
    BACK: '返回',
    NEXT: '下一步',
    PREVIOUS: '上一步',
    CLOSE: '关闭',
    MENU: '菜单',
  },
} as const

// 影片相关文本常量，包含影片标签、操作和状态文本
export const MOVIE_TEXT = {
  LABELS: {
    TITLE: '影片标题',
    DESCRIPTION: '影片描述',
    CATEGORY: '分类',
    RATING: '评分',
    RELEASE_DATE: '上映时间',
    DURATION: '时长',
    DIRECTOR: '导演',
    ACTORS: '演员',
    TAGS: '标签',
  },

  // 影片操作相关文本
  ACTIONS: {
    WATCH: '观看',
    DOWNLOAD: '下载',
    FAVORITE: '收藏',
    SHARE: '分享',
    RATE: '评分',
    COMMENT: '评论',
  },

  // 影片状态相关文本
  STATUS: {
    NEW: '最新',
    HOT: '热门',
    RECOMMENDED: '推荐',
    VIP_ONLY: 'VIP专享',
    FREE: '免费',
    COMING_SOON: '即将上映',
  },
} as const

// 用户相关文本常量，包含用户资料、操作和状态文本
export const USER_TEXT = {
  PROFILE: {
    USERNAME: '用户名',
    EMAIL: '邮箱',
    PASSWORD: '密码',
    AVATAR: '头像',
    NICKNAME: '昵称',
    PHONE: '手机号',
    BIRTHDAY: '生日',
    GENDER: '性别',
  },

  // 用户操作相关文本
  ACTIONS: {
    LOGIN: '登录',
    LOGOUT: '退出登录',
    REGISTER: '注册',
    FORGOT_PASSWORD: '忘记密码',
    CHANGE_PASSWORD: '修改密码',
    UPDATE_PROFILE: '更新资料',
  },

  // 用户状态相关文本
  STATUS: {
    ONLINE: '在线',
    OFFLINE: '离线',
    VIP: 'VIP会员',
    NORMAL: '普通用户',
    BANNED: '已封禁',
  },
} as const

// 下载相关文本常量，包含下载标签、状态和操作文本
export const DOWNLOAD_TEXT = {
  LABELS: {
    DOWNLOAD_HISTORY: '下载历史',
    DOWNLOAD_QUEUE: '下载队列',
    DOWNLOAD_SPEED: '下载速度',
    FILE_SIZE: '文件大小',
    PROGRESS: '下载进度',
  },

  // 下载状态相关文本
  STATUS: {
    DOWNLOADING: '下载中',
    PAUSED: '已暂停',
    COMPLETED: '已完成',
    FAILED: '下载失败',
    WAITING: '等待中',
  },

  // 下载操作相关文本
  ACTIONS: {
    START_DOWNLOAD: '开始下载',
    PAUSE_DOWNLOAD: '暂停下载',
    RESUME_DOWNLOAD: '继续下载',
    CANCEL_DOWNLOAD: '取消下载',
    RETRY_DOWNLOAD: '重试下载',
  },
} as const

// 消息相关文本常量，包含消息标签、状态和操作文本
export const MESSAGE_TEXT = {
  LABELS: {
    INBOX: '收件箱',
    SENT: '已发送',
    DRAFTS: '草稿箱',
    TRASH: '回收站',
    SUBJECT: '主题',
    CONTENT: '内容',
    SENDER: '发送者',
    RECIPIENT: '接收者',
    SEND_TIME: '发送时间',
  },

  // 消息状态相关文本
  STATUS: {
    UNREAD: '未读',
    READ: '已读',
    REPLIED: '已回复',
    FORWARDED: '已转发',
    ARCHIVED: '已归档',
  },

  // 消息操作相关文本
  ACTIONS: {
    SEND: '发送',
    REPLY: '回复',
    FORWARD: '转发',
    DELETE: '删除',
    ARCHIVE: '归档',
    MARK_AS_READ: '标记为已读',
    MARK_AS_UNREAD: '标记为未读',
  },
} as const

// 页面标题文本常量，定义所有页面的标题文本
export const PAGE_TITLES = {
  HOME: '首页',
  MOVIES: '影片',
  CATEGORIES: '分类',
  SEARCH: '搜索',
  USER_PROFILE: '个人中心',
  SETTINGS: '设置',
  DOWNLOADS: '下载管理',
  MESSAGES: '消息中心',
  ADMIN: '管理后台',
  HELP: '帮助中心',
  ABOUT: '关于我们',
} as const

// 错误消息文本常量，包含网络、验证和业务相关错误文本
export const ERROR_TEXT = {
  // 网络相关错误文本
  NETWORK: {
    CONNECTION_FAILED: '网络连接失败，请检查网络设置',
    TIMEOUT: '请求超时，请稍后重试',
    SERVER_ERROR: '服务器错误，请稍后重试',
    NOT_FOUND: '请求的资源不存在',
    UNAUTHORIZED: '未授权访问，请先登录',
    FORBIDDEN: '权限不足，无法访问',
  },

  // 验证相关错误文本
  VALIDATION: {
    REQUIRED_FIELD: '此字段为必填项',
    INVALID_EMAIL: '请输入有效的邮箱地址',
    INVALID_PASSWORD: '密码长度至少8位，包含字母和数字',
    PASSWORD_MISMATCH: '两次输入的密码不一致',
    INVALID_PHONE: '请输入有效的手机号码',
    FILE_TOO_LARGE: '文件大小超出限制',
    INVALID_FILE_TYPE: '不支持的文件类型',
  },

  // 业务相关错误文本
  BUSINESS: {
    DOWNLOAD_LIMIT_EXCEEDED: '下载次数已达上限',
    VIP_REQUIRED: '此功能需要VIP会员',
    INSUFFICIENT_BALANCE: '余额不足',
    ACCOUNT_SUSPENDED: '账户已被暂停',
    CONTENT_NOT_AVAILABLE: '内容暂时不可用',
  },
} as const

// 成功消息文本常量，包含用户、下载、消息和通用成功文本
export const SUCCESS_TEXT = {
  // 用户相关成功文本
  USER: {
    LOGIN_SUCCESS: '登录成功',
    REGISTER_SUCCESS: '注册成功',
    PROFILE_UPDATED: '资料更新成功',
    PASSWORD_CHANGED: '密码修改成功',
  },

  // 下载相关成功文本
  DOWNLOAD: {
    DOWNLOAD_STARTED: '下载已开始',
    DOWNLOAD_COMPLETED: '下载完成',
    DOWNLOAD_PAUSED: '下载已暂停',
  },

  // 消息相关成功文本
  MESSAGE: {
    MESSAGE_SENT: '消息发送成功',
    MESSAGE_DELETED: '消息删除成功',
    MESSAGE_ARCHIVED: '消息归档成功',
  },

  // 通用成功文本
  GENERAL: {
    OPERATION_SUCCESS: '操作成功',
    SAVE_SUCCESS: '保存成功',
    DELETE_SUCCESS: '删除成功',
    UPDATE_SUCCESS: '更新成功',
  },
} as const

// 类型导出
// UI文本键类型，确保类型安全
export type UITextKeys = keyof typeof UI_TEXT
// 影片文本键类型，确保类型安全
export type MovieTextKeys = keyof typeof MOVIE_TEXT
// 用户文本键类型，确保类型安全
export type UserTextKeys = keyof typeof USER_TEXT
// 下载文本键类型，确保类型安全
export type DownloadTextKeys = keyof typeof DOWNLOAD_TEXT
// 消息文本键类型，确保类型安全
export type MessageTextKeys = keyof typeof MESSAGE_TEXT
// 页面标题键类型，确保类型安全
export type PageTitleKeys = keyof typeof PAGE_TITLES
// 错误文本键类型，确保类型安全
export type ErrorTextKeys = keyof typeof ERROR_TEXT
// 成功文本键类型，确保类型安全
export type SuccessTextKeys = keyof typeof SUCCESS_TEXT
