/**
 * @fileoverview Domains领域模块统一导出
 * @description 导出所有领域组件和类型，统一管理domains层的对外接口
 */

// Home领域
export { TopicSection } from './home/TopicSection'
export { PhotoSection } from './home/PhotoSection'
export { LatestSection } from './home/LatestSection'
export { TopSection } from './home/TopSection'

// Topic领域
export { TopicCard } from './topic/TopicCard'
export { TopicList } from './topic/TopicList'
export { TopicCard as SpecialCollectionCard } from './topic/TopicCard'

// Movie领域
export { MovieCard } from './movie/MovieCard'
export { MovieList } from './movie/MovieList'
export type { BaseMovieItem } from './movie/MovieList'

// 导出类型
export type { TopicSectionProps, TopicItem } from './home/TopicSection'
export type { PhotoSectionProps, PhotoItem } from './home/PhotoSection'
export type { LatestSectionProps, LatestItem } from './home/LatestSection'
export type { TopSectionProps, TopItem } from './home/TopSection'

export type { TopicCardProps } from './topic/TopicCard'

export type {
  Topic,
  PaginationConfig,
  ResponsiveColumns,
  TopicListProps,
} from './topic/TopicList'

export type { MovieCardProps } from './movie/MovieCard'

export type { MovieListProps } from './movie/MovieList'
