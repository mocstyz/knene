/**
 * @fileoverview Domains领域模块统一导出
 * @description 导出所有领域组件和类型，统一管理domains层的对外接口
 *
 * 架构说明：
 * - latestupdate: 最新更新内容领域(24小时内的更新)
 * - hot: 24小时热门内容领域
 * - collections: 影片合集领域
 * - photo: 写真图片领域
 * - shared: 共享基础组件和内容渲染器系统
 *
 * 迁移说明：
 * - home目录已删除，组件已迁移到对应领域
 * - LatestSection → @components/domains/latestupdate
 * - TopSection → @components/domains/hot (原top已重命名为hot)
 * - CollectionSection → @components/domains/collections
 * - PhotoSection → @components/domains/photo
 *
 * 重构说明：
 * - movie目录已删除，已被内容渲染器系统替代
 * - MovieList、MovieCard等组件已被MixedContentList替代
 * - 热门和最新更新模块现在支持混合内容展示
 */

// LatestUpdate领域 - 最新更新内容(24小时内的更新)
export { LatestUpdateSection, LatestUpdateList } from './latestupdate'
export type {
  LatestUpdateSectionProps,
  LatestUpdateListProps,
} from './latestupdate'

// Hot领域 - 24小时热门内容
export { HotSection, HotList } from './hot'
export type { HotSectionProps, HotListProps } from './hot'
export type { HotItem } from '@infrastructure/repositories/HomeRepository'

// Collections领域 - 影片合集内容
// CollectionCard已被内容渲染器系统替代，移除导出
export { CollectionList, CollectionSection } from './collections'
export type {
  CollectionItem,
  PaginationConfig,
  CollectionListProps,
} from './collections/CollectionList'
export type { CollectionSectionProps } from './collections/CollectionSection'

// Photo领域 - 写真图片
// PhotoCard已被内容渲染器系统替代，移除导出
export { PhotoList, PhotoSection } from './photo'
export type { PhotoListProps } from './photo/PhotoList'
export type { PhotoSectionProps } from './photo/PhotoSection'
export type { PhotoItem } from '@types-movie'

// Movie领域已被删除 - 影片内容展示已由内容渲染器系统替代
// 热门和最新更新模块现在使用MixedContentList支持混合内容
export type { BaseMovieItem } from '@types-movie'

// Shared领域 - 基础组件和内容渲染器系统
export { BaseSection, BaseList, MixedContentList } from './shared'
export type {
  BaseSectionComponentProps,
  MixedContentListProps,
} from './shared'
// 导出整个内容渲染器系统
export * from './shared/content-renderers'
