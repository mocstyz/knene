// MovieCard已被内容渲染器系统替代，移除导出
export { MovieList } from './MovieList'
export { MovieListLayout } from './MovieListLayout'
export { MovieListItem } from './MovieListItem'

// 导出类型
// MovieCardProps已被内容渲染器系统替代，移除导出
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
