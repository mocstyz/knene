/**
 * @fileoverview Domains领域模块统一导出
 * @description 导出所有领域组件和类型，统一管理domains层的对外接口
 *
 * 架构说明：
 * - latestupdate: 最新更新内容领域(24小时内的更新)
 * - hot: 24小时热门内容领域
 * - collections: 影片合集领域
 * - photo: 写真图片领域
 * - movie: 影片内容领域
 * - shared: 共享基础组件
 *
 * 迁移说明：
 * - home目录已删除，组件已迁移到对应领域
 * - LatestSection → @components/domains/latestupdate
 * - TopSection → @components/domains/hot (原top已重命名为hot)
 * - CollectionSection → @components/domains/collections
 * - PhotoSection → @components/domains/photo
 */

// LatestUpdate领域 - 最新更新内容(24小时内的更新)
export { LatestUpdateSection, LatestUpdateList } from './latestupdate'
export type {
  LatestUpdateSectionProps,
  LatestUpdateListProps,
  LatestItem,
} from './latestupdate'

// Hot领域 - 24小时热门内容
export { HotSection, HotList } from './hot'
export type { HotSectionProps, HotListProps } from './hot'
export type { HotItem } from '@infrastructure/repositories/HomeRepository'

// Collections领域 - 影片合集内容
export {
  CollectionCard,
  CollectionList,
  CollectionSection,
} from './collections'
export { CollectionCard as SpecialCollectionCard } from './collections/CollectionCard'
export type { CollectionCardProps } from './collections/CollectionCard'
export type {
  CollectionItem,
  PaginationConfig,
  CollectionListProps,
} from './collections/CollectionList'
export type { CollectionSectionProps } from './collections/CollectionSection'

// Photo领域 - 写真图片
export { PhotoCard, PhotoList, PhotoSection } from './photo'
export type {
  PhotoCardProps,
  PhotoItem as PhotoItemType,
} from './photo/PhotoCard'
export type { PhotoListProps } from './photo/PhotoList'
export type { PhotoSectionProps } from './photo/PhotoSection'
export type { PhotoItem } from '@types-movie/movie.types'

// Movie领域 - 影片内容
export { MovieCard, MovieList } from './movie'
export type { BaseMovieItem } from '@types-movie/movie.types'
export type { MovieCardProps } from './movie/MovieCard'
export type { MovieListProps } from './movie/MovieList'

// Shared领域 - 基础组件
export { BaseSection, BaseList } from './shared'
export type { BaseSectionProps, BaseListProps } from './shared'
