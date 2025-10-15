/**
 * @fileoverview 可复用层组件统一导出
 * @description 统一导出所有可复用层组件，遵循DDD架构的分层设计原则
 */

// 业务层组件
export { VipBadgeLayer } from './VipBadgeLayer'
export { RatingBadgeLayer } from './RatingBadgeLayer'
export { QualityBadgeLayer } from './QualityBadgeLayer'
export { NewBadgeLayer } from './NewBadgeLayer'
export { HoverInteractionLayer } from './HoverInteractionLayer'
export { ImageLayer } from './ImageLayer'
export { TitleLayer } from './TitleLayer'
export { MetadataLayer } from './MetadataLayer'
export { TopicLayer } from './TopicLayer'
export { MovieLayer } from './MovieLayer'

// 类型导出
export type { VipBadgeLayerProps } from './VipBadgeLayer'
export type { RatingBadgeLayerProps } from './RatingBadgeLayer'
export type { QualityBadgeLayerProps } from './QualityBadgeLayer'
export type { NewBadgeLayerProps, NewBadgeType } from './NewBadgeLayer'
export type { HoverInteractionLayerProps } from './HoverInteractionLayer'
export type { ImageLayerProps } from './ImageLayer'
export type { TitleLayerProps } from './TitleLayer'
export type { MetadataLayerProps } from './MetadataLayer'
export type { TopicLayerProps } from './TopicLayer'
export type { MovieLayerProps } from './MovieLayer'
