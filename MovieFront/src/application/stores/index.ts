// 分别导出各个store，避免命名冲突
export {
  useUserClientStore as useUserStore,
  selectIsAuthenticated,
  selectCurrentUserId,
  selectSessionExpiry,
  selectIsProfileMenuOpen,
  selectTempFormData,
} from './userStore'

export {
  useUIStore,
  selectTheme,
  selectSidebarOpen,
  selectSidebarCollapsed,
  selectSelectedMovieId,
  selectSearchQuery,
  selectCurrentFilters,
  selectCurrentPage,
} from './uiStore'

export {
  useDownloadClientStore as useDownloadStore,
  selectIsDownloadPanelOpen,
  selectActiveTab,
  selectDownloadFilters,
  selectSelectedDownloadIds,
  selectTempDownloadData,
  selectNotificationsEnabled,
} from './downloadClientStore'

export {
  useMovieClientStore as useMovieStore,
  selectRecentlyViewedMovieIds,
  selectFavoriteMovieIds,
  selectWatchLaterMovieIds,
  selectGridView,
  selectShowFilters,
  selectActiveGenre,
  selectSortBy,
  selectSortOrder,
} from './movieStore'

// 重新导出常用的类型
export type { User } from './userStore'
export type { Movie, MovieFilters } from './movieStore'
export type { DownloadTask, DownloadStats } from './downloadStore'
export { DownloadStatus } from './downloadStore'
