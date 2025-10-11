/**
 * NavigationMenu模块导出
 *
 * 使用复合组件模式，支持：
 * 1. 完整导航菜单使用
 * 2. 单独子组件使用
 * 3. 灵活的样式配置
 */

// 主要组件
export { default as NavigationMenu } from './NavigationMenu'
export { default as HomeMenu } from './HomeMenu'
export { default as MediaMenu } from './MediaMenu'
export { default as MoreMenu } from './MoreMenu'

// 类型定义
export type { NavigationMenuProps } from './NavigationMenu'

export type { HomeMenuProps, HomeMenuItem, FeaturedContent } from './HomeMenu'

export type {
  MediaMenuProps,
  MediaMenuConfig,
  MediaMenuItem,
} from './MediaMenu'

export type { MoreMenuProps, MoreMenuItem } from './MoreMenu'

// 设计令牌和类型
export {
  navigationVariants,
  navigationThemes,
  navigationSizes,
  navigationAnimations,
  pageConfigs,
  createNavigationStyles,
} from './designTokens'

export type {
  NavigationVariant,
  NavigationTheme,
  NavigationSize,
  NavigationAnimation,
} from './designTokens'
