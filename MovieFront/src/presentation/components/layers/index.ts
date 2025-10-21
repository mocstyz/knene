/**
 * @fileoverview 可复用层组件统一导出
 * @description 统一导出所有可复用层组件，遵循DDD架构的分层设计原则，提供完整的视觉元素展示功能。
 *              包含基础UI元素、交互效果、元数据展示和电影专用组件，支持模块化组合和复用。
 * @created 2025-10-21 11:57:48
 * @updated 2025-10-21 16:21:08
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 导出业务层组件 - 提供完整的基础视觉元素集合
export { VipBadgeLayer } from './VipBadgeLayer'
export { RatingBadgeLayer } from './RatingBadgeLayer'
export { QualityBadgeLayer } from './QualityBadgeLayer'
export { NewBadgeLayer } from './NewBadgeLayer'
export { HoverInteractionLayer } from './HoverInteractionLayer'
export { CardHoverLayer } from './CardHoverLayer'
export { TextHoverLayer } from './TextHoverLayer'
export { ImageLayer } from './ImageLayer'
export { TitleLayer } from './TitleLayer'
export { MetadataLayer } from './MetadataLayer'
export { MovieLayer } from './MovieLayer'

// 导出类型定义 - 提供完整的TypeScript类型支持
export type { VipBadgeLayerProps } from './VipBadgeLayer'
export type { RatingBadgeLayerProps } from './RatingBadgeLayer'
export type { QualityBadgeLayerProps } from './QualityBadgeLayer'
export type { NewBadgeLayerProps, NewBadgeType } from './NewBadgeLayer'
export type { HoverInteractionLayerProps } from './HoverInteractionLayer'
export type { CardHoverLayerProps } from './CardHoverLayer'
export type { TextHoverLayerProps } from './TextHoverLayer'
export type { ImageLayerProps } from './ImageLayer'
export type { TitleLayerProps } from './TitleLayer'
export type { MetadataLayerProps } from './MetadataLayer'
export type { MovieLayerProps } from './MovieLayer'