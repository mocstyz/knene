/**
 * @fileoverview 设计系统变体配置统一导出
 * @description 设计系统变体配置的统一导出入口，按照分层导出原则提供所有变体配置
 *              包括基础组件变体、布局组件变体、标签层组件变体、渐变变体配置等，
 *              提供完整的类型定义和向后兼容性支持
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 基础组件变体导出 - 导出Button、Input、Badge、Card、Select、Switch、TextLink等基础组件的变体配置
export * from './base-variants'

// 布局组件变体导出 - 导出导航、网格、容器、区块等布局组件的变体配置
export * from './layout-variants'

// 标签层组件变体导出 - 导出VIP、评分、质量等标签层组件的变体配置
export * from './badge-layer-variants'

// 渐变变体配置导出 - 导出遮罩、特殊效果、背景等渐变变体配置
export * from './gradient-variants'

// 基础组件类型重新导出 - 保持向后兼容性，导出所有基础组件的类型定义
export type {
  ButtonVariant, // 按钮变体类型
  ButtonSize, // 按钮尺寸类型
  InputVariant, // 输入框变体类型
  InputSize, // 输入框尺寸类型
  BadgeVariant, // 徽章变体类型
  BadgeSize, // 徽章尺寸类型
  CardVariant, // 卡片变体类型
  CardSize, // 卡片尺寸类型
  SelectVariant, // 选择器变体类型
  SelectSize, // 选择器尺寸类型
  SwitchVariant, // 开关变体类型
  SwitchSize, // 开关尺寸类型
} from './base-variants'

// 布局组件类型重新导出 - 导出布局组件相关的类型定义
export type {
  NavigationVariant, // 导航变体类型
  GridVariant, // 网格变体类型
  ContainerVariant, // 容器变体类型
  SectionVariant, // 区块变体类型
  SectionBackground, // 区块背景类型
} from './layout-variants'

// 标签层组件类型重新导出 - 导出标签层组件相关的类型定义
export type {
  BadgeLayerPosition, // 标签层位置类型
  BadgeLayerSize, // 标签层尺寸类型
  BadgeLayerVariant, // 标签层变体类型
  BadgeLayerType, // 标签层类型
  BadgeLayerRatingColor, // 评分颜色类型
} from './badge-layer-variants'

// 渐变变体类型重新导出 - 导出渐变相关的类型定义
export type {
  GradientOverlayIntensity, // 遮罩渐变强度类型
  GradientSpecialVariant, // 特殊效果渐变类型
  GradientBackgroundVariant, // 背景渐变类型
  GradientVariant, // 渐变类型联合
  GradientCategory, // 渐变类别类型
} from './gradient-variants'
