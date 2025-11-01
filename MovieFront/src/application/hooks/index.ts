// 用户认证相关Hooks导出
// 包含用户身份验证、权限管理、个人资料管理等功能
export * from './useAuth'

// 影片管理相关Hooks导出
// 包含影片数据获取、搜索、分类、推荐等功能
export * from './useMovies'

// 下载管理相关Hooks导出
// 包含下载任务管理、进度跟踪、状态控制等功能
export * from './useDownloads'

// 主题管理相关Hooks导出
// 包含主题切换、系统主题检测、样式适配等功能
export * from './useTheme'

// 评分颜色计算Hook导出
// 提供基于评分的颜色计算功能，支持主题适配
export * from './useRatingColor'

// 专题合集相关Hooks导出
// 包含专题合集数据获取、筛选、排序等功能
export * from './useSpecialCollections'

// 合集影片相关Hooks导出
// 包含合集影片列表获取、分页等功能
export * from './useCollectionMovies'

// 最新更新列表相关Hooks导出
// 包含最新更新内容列表获取、分页、排序等功能
export * from './useLatestUpdateList'

// 热门内容列表相关Hooks导出
// 包含热门内容列表获取、分页、时间周期筛选等功能
export * from './useHotList'

// 查询客户端和查询键导出
// 提供统一的查询客户端配置和查询键管理
export { queryClient, QUERY_KEYS } from '@application/services/queryClient'