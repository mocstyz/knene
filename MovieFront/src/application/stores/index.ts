// 统一导出所有状态管理stores
export * from './userStore'
export * from './downloadStore'

// 重新导出常用的选择器和类型，解决导出歧义
export type { User } from './userStore'
export type { Movie, MovieFilters } from './movieStore'
export type { DownloadTask, DownloadStats } from './downloadStore'
export { DownloadStatus } from './downloadStore'

// 明确导出选择器，避免命名冲突
export { selectIsLoading as selectUserIsLoading } from './userStore'
export { selectIsLoading as selectMovieIsLoading } from './movieStore'

// 单独导出movieStore，避免selectIsLoading冲突
export { 
  useMovieStore,
  selectMovies,
  selectFeaturedMovies,
  selectSearchResults,
  selectFavoriteMovies,
  selectSearchQuery
} from './movieStore'