/**
 * @fileoverview 导航菜单模块导出
 * @description 统一导出NavigationMenu复合组件及其子组件、类型定义和设计令牌，支持完整的导航菜单功能和灵活的样式配置
 * @created 2025-10-20 18:08:17
 * @updated 2025-10-21 11:12:43
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 导出主要导航组件 - 使用复合组件模式，支持完整导航菜单和单独子组件使用
export { default as NavigationMenu } from './NavigationMenu'
export { default as HomeMenu } from './HomeMenu'
export { default as MediaMenu } from './MediaMenu'
export { default as MoreMenu } from './MoreMenu'

// 导出主导航菜单类型定义
export type { NavigationMenuProps } from './NavigationMenu'

// 导出首页菜单相关类型定义
export type { HomeMenuProps, HomeMenuItem, FeaturedContent } from './HomeMenu'

// 导出媒体菜单相关类型定义
export type {
  MediaMenuProps,
  MediaMenuConfig,
  MediaMenuItem,
} from './MediaMenu'

// 导出更多菜单相关类型定义
export type { MoreMenuProps, MoreMenuItem } from './MoreMenu'

// 导出设计令牌配置和样式生成器
export {
  navigationVariants, // 导航变体配置
  navigationThemes, // 导航主题配置
  navigationSizes, // 导航尺寸配置
  navigationAnimations, // 导航动画配置
  pageConfigs, // 页面配置示例
  createNavigationStyles, // 样式生成器函数
} from './designTokens'

// 导出设计令牌相关类型定义
export type {
  NavigationVariant, // 导航变体类型
  NavigationTheme, // 导航主题类型
  NavigationSize, // 导航尺寸类型
  NavigationAnimation, // 导航动画类型
} from './designTokens'
