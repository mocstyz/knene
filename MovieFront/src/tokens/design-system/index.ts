/**
 * 设计系统变体配置统一导出
 * 按照Claude.md规范提供分层导出
 */

// 基础组件变体
export * from './base-variants'

// 布局组件变体
export * from './layout-variants'

// 标签层组件变体
export * from './badge-layer-variants'

// 渐变变体配置
export * from './gradient-variants'

// 类型重新导出，保持向后兼容
export type {
  ButtonVariant,
  ButtonSize,
  InputVariant,
  InputSize,
  BadgeVariant,
  BadgeSize,
  CardVariant,
  CardSize,
  SelectVariant,
  SelectSize,
  SwitchVariant,
  SwitchSize,
} from './base-variants'

export type {
  NavigationVariant,
  GridVariant,
  ContainerVariant,
  SectionVariant,
  SectionBackground,
} from './layout-variants'

export type {
  BadgeLayerPosition,
  BadgeLayerSize,
  BadgeLayerVariant,
  BadgeLayerType,
  BadgeLayerRatingColor,
} from './badge-layer-variants'

export type {
  GradientOverlayIntensity,
  GradientSpecialVariant,
  GradientBackgroundVariant,
  GradientVariant,
  GradientCategory,
} from './gradient-variants'
