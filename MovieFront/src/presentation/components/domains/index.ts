// LatestUpdate领域 - 最新更新内容(24小时内的更新)
export { LatestUpdateSection, LatestUpdateList } from './latestupdate'
export type {
  LatestUpdateSectionProps,
  LatestUpdateListProps,
} from './latestupdate'

// Hot领域 - 24小时热门内容
export { HotSection, HotList } from './hot'
export type { HotSectionProps, HotListProps } from './hot'
export type { HotItem } from '@types-movie'

// Collections领域 - 影片合集内容，CollectionCard已被内容渲染器系统替代
export { CollectionList, CollectionSection } from './collections'
export type {
  PaginationConfig,
  CollectionListProps,
} from './collections/CollectionList'
export type { CollectionSectionProps } from './collections/CollectionSection'
export type { CollectionItem } from '@types-movie'

// Photo领域 - 写真图片，PhotoCard已被内容渲染器系统替代
export { PhotoList, PhotoSection } from './photo'
export type { PhotoListProps } from './photo/PhotoList'
export type { PhotoSectionProps } from './photo/PhotoSection'
export type { PhotoItem } from '@types-movie'

// Movie领域已被删除 - 影片内容展示已由内容渲染器系统替代，热门和最新更新模块现在使用MixedContentList支持混合内容
export type { BaseMovieItem } from '@types-movie'

// Shared领域 - 基础组件和内容渲染器系统
export { BaseSection, BaseList, MixedContentList } from './shared'
export type {
  BaseSectionComponentProps,
  MixedContentListProps,
} from './shared'

// 导出整个内容渲染器系统
export * from './shared/content-renderers'