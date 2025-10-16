/**
 * 组件变体Token系统 - 统一管理组件样式变体
 * 基于Radix UI Themes + Tailwind CSS的简化架构
 */

// 基础设计令牌 - 保留非颜色相关的令牌
export * from './spacing'
export * from './borders'
export * from './animations'
export * from './z-index'

// 选择性导出以避免命名冲突
export * from './typography'
export { responsiveFontSizes as breakpointResponsiveFontSizes } from './breakpoints'
export type { ThemeMode as ShadowThemeMode } from './shadows'

// 颜色工具函数 - 仅保留业务特定颜色
export {
  statusColors,
  gradients,
  getStatusColor,
  getGradientClass,
} from './colors'
export type { StatusColorType, GradientType } from './colors'

// 组件变体配置 - 核心功能
export * from './design-system'
export * from './domains'

// 便捷导出：常用基础组件变体
export {
  buttonVariants,
  inputVariants,
  badgeVariants,
  cardVariants,
  selectVariants,
  switchVariants,
} from './design-system/base-variants'

export {
  navigationVariants,
  gridVariants,
  containerVariants,
} from './design-system/layout-variants'

// 便捷导出：常用业务组件变体
export {
  movieDetailVariants,
  ratingVariants,
  heroVariants,
} from './domains/movie-variants'

export {
  downloadProgressVariants,
  progressVariants,
  downloadButtonVariants,
} from './domains/download-variants'
