export { MovieCard } from './MovieCard'
export { MovieList } from './MovieList'
export { MovieListLayout } from './MovieListLayout'
export { MovieListItem } from './MovieListItem'

// 导出类型
export type { MovieCardProps } from './MovieCard'
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
