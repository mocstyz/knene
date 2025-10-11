export { default as MovieList } from './MovieList'
export { default as MovieListLayout } from './MovieListLayout'
export { default as MovieListItem } from './MovieListItem'
export type { MovieListProps } from './MovieList'
export type { MovieListLayoutProps } from './MovieListLayout'
export type { MovieListItemProps } from './MovieListItem'

// 从@types-movie导出相关类型，保持向后兼容
export type {
  BaseMovieItem,
  SimpleMovieItem, // 向后兼容
  MovieItem, // 向后兼容
  TopicItem,
  PhotoItem,
  LatestItem,
  TopItem,
  CardConfig,
  ResponsiveColumnsConfig,
} from '@types-movie/movie.types'
