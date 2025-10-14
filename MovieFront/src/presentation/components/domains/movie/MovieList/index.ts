export { default as MovieList } from './MovieList'
export { default as MovieListLayout } from './MovieListLayout'
export { default as MovieListItem } from './MovieListItem'
export type { MovieListProps } from './MovieList'
export type { MovieListLayoutProps } from './MovieListLayout'
export type { MovieListItemProps } from './MovieListItem'

// 从@types-movie导出相关类型，移除废弃的类型
export type {
  BaseMovieItem,
  TopicItem,
  PhotoItem,
  LatestItem,
  TopItem,
  CardConfig,
  ResponsiveColumnsConfig,
} from '@types-movie/movie.types'
