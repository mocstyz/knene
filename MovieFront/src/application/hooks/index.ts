/**
 * @fileoverview 应用层Hooks统一导出模块 - DDD架构应用层Hook集合
 * @description 统一导出所有应用层Hooks，包括用户认证、影片管理、下载管理、主题管理等核心业务逻辑Hook。
 * 遵循 DDD 架构原则，Hooks位于应用层负责协调不同领域的业务逻辑，提供统一的业务操作接口。
 * 
 * 架构设计：
 * - 应用层Hook：协调领域服务和基础设施层
 * - 业务逻辑封装：将复杂的业务流程封装为可复用的Hook
 * - 状态管理集成：整合Zustand和TanStack Query的状态管理
 * - 类型安全：提供完整的TypeScript类型定义
 * 
 * 使用方式：
 * - 组件中直接导入所需Hook
 * - 遵循Hook使用规则和最佳实践
 * - 利用Hook的组合能力构建复杂业务逻辑
 *
 * @author mosctz
 * @version 1.0.0
 */

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

// 查询客户端和查询键导出
// 提供统一的查询客户端配置和查询键管理
export { queryClient, QUERY_KEYS } from '@application/services/queryClient'
