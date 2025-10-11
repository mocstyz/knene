/**
 * @fileoverview 客户端影片状态管理 - 仅管理客户端影片UI状态
 * @description 管理影片浏览、收藏、最近观看等本地状态，不涉及API调用
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// 影片接口（由TanStack Query管理的数据）
export interface Movie {
  id: string
  title: string
  description: string
  poster: string
  backdrop?: string
  genres: string[]
  rating: number
  year: number
  duration: number
  director?: string
  actors?: string[]
  qualities?: string[]
  views?: number
  quality?: 'HD' | '4K' | 'BluRay' | 'WebRip'
  size?: string
  downloadCount?: number
  releaseDate?: Date
  country?: string
  language?: string
  subtitles?: string[]
  trailerUrl?: string
  imdbId?: string
  tmdbId?: string
}

// 搜索过滤器接口
export interface MovieFilters {
  genre?: string
  year?: number
  rating?: number
  quality?: string
  language?: string
  sortBy?: 'title' | 'year' | 'rating' | 'downloadCount' | 'releaseDate'
  sortOrder?: 'asc' | 'desc'
}

// 客户端影片状态管理接口
interface MovieClientState {
  // 本地数据
  recentlyViewedMovieIds: string[]
  favoriteMovieIds: string[]
  watchLaterMovieIds: string[]

  // 浏览历史（本地存储）
  browseHistory: Array<{
    movieId: string
    timestamp: number
    viewType: 'list' | 'detail' | 'search'
  }>

  // UI状态
  gridView: boolean
  showFilters: boolean
  activeGenre: string | null
  sortBy: MovieFilters['sortBy']
  sortOrder: MovieFilters['sortOrder']

  // 临时数据
  tempSearchData: {
    lastQuery?: string
    lastFilters?: MovieFilters
    scrollPosition?: number
  }

  // 客户端操作（不涉及API）
  addToRecentlyViewed: (movieId: string) => void
  removeFromRecentlyViewed: (movieId: string) => void
  addToFavorites: (movieId: string) => void
  removeFromFavorites: (movieId: string) => void
  addToWatchLater: (movieId: string) => void
  removeFromWatchLater: (movieId: string) => void
  setGridView: (gridView: boolean) => void
  setShowFilters: (show: boolean) => void
  setActiveGenre: (genre: string | null) => void
  setSortBy: (sortBy: MovieFilters['sortBy']) => void
  setSortOrder: (sortOrder: MovieFilters['sortOrder']) => void
  setTempSearchData: (data: Partial<MovieClientState['tempSearchData']>) => void
  clearTempSearchData: () => void
  clearBrowseHistory: () => void
  clearRecentlyViewed: () => void
  isInFavorites: (movieId: string) => boolean
  isInWatchLater: (movieId: string) => boolean
  getRecentlyViewedIds: (limit?: number) => string[]
}

// 创建客户端影片状态管理store
export const useMovieClientStore = create<MovieClientState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        recentlyViewedMovieIds: [],
        favoriteMovieIds: [],
        watchLaterMovieIds: [],
        browseHistory: [],

        gridView: true,
        showFilters: false,
        activeGenre: null,
        sortBy: 'title',
        sortOrder: 'asc',

        tempSearchData: {},

        // 添加到最近观看
        addToRecentlyViewed: movieId =>
          set(state => {
            const filtered = state.recentlyViewedMovieIds.filter(
              id => id !== movieId
            )
            return {
              recentlyViewedMovieIds: [movieId, ...filtered].slice(0, 50), // 最多保存50个
              browseHistory: [
                {
                  movieId,
                  timestamp: Date.now(),
                  viewType: 'detail',
                },
                ...state.browseHistory.slice(0, 99), // 最多保存100条历史记录
              ],
            }
          }),

        // 从最近观看中移除
        removeFromRecentlyViewed: movieId =>
          set(state => ({
            recentlyViewedMovieIds: state.recentlyViewedMovieIds.filter(
              id => id !== movieId
            ),
          })),

        // 添加到收藏
        addToFavorites: movieId =>
          set(state => ({
            favoriteMovieIds: state.favoriteMovieIds.includes(movieId)
              ? state.favoriteMovieIds
              : [...state.favoriteMovieIds, movieId],
          })),

        // 从收藏中移除
        removeFromFavorites: movieId =>
          set(state => ({
            favoriteMovieIds: state.favoriteMovieIds.filter(
              id => id !== movieId
            ),
          })),

        // 添加到稍后观看
        addToWatchLater: movieId =>
          set(state => ({
            watchLaterMovieIds: state.watchLaterMovieIds.includes(movieId)
              ? state.watchLaterMovieIds
              : [...state.watchLaterMovieIds, movieId],
          })),

        // 从稍后观看中移除
        removeFromWatchLater: movieId =>
          set(state => ({
            watchLaterMovieIds: state.watchLaterMovieIds.filter(
              id => id !== movieId
            ),
          })),

        // 设置网格视图
        setGridView: gridView => set({ gridView }),

        // 设置过滤器显示
        setShowFilters: showFilters => set({ showFilters }),

        // 设置活动分类
        setActiveGenre: genre => set({ activeGenre: genre }),

        // 设置排序方式
        setSortBy: sortBy => set({ sortBy }),

        // 设置排序顺序
        setSortOrder: sortOrder => set({ sortOrder }),

        // 设置临时搜索数据
        setTempSearchData: data =>
          set(state => ({
            tempSearchData: { ...state.tempSearchData, ...data },
          })),

        // 清除临时搜索数据
        clearTempSearchData: () => set({ tempSearchData: {} }),

        // 清除浏览历史
        clearBrowseHistory: () => set({ browseHistory: [] }),

        // 清除最近观看
        clearRecentlyViewed: () => set({ recentlyViewedMovieIds: [] }),

        // 检查是否在收藏中
        isInFavorites: movieId => {
          return get().favoriteMovieIds.includes(movieId)
        },

        // 检查是否在稍后观看中
        isInWatchLater: movieId => {
          return get().watchLaterMovieIds.includes(movieId)
        },

        // 获取最近观看的影片ID
        getRecentlyViewedIds: (limit = 10) => {
          return get().recentlyViewedMovieIds.slice(0, limit)
        },
      }),
      {
        name: 'movie-client-storage',
        partialize: state => ({
          recentlyViewedMovieIds: state.recentlyViewedMovieIds,
          favoriteMovieIds: state.favoriteMovieIds,
          watchLaterMovieIds: state.watchLaterMovieIds,
          gridView: state.gridView,
          activeGenre: state.activeGenre,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
        }),
      }
    ),
    {
      name: 'movie-client-store',
    }
  )
)

// 选择器函数
export const selectRecentlyViewedMovieIds = (state: MovieClientState) =>
  state.recentlyViewedMovieIds
export const selectFavoriteMovieIds = (state: MovieClientState) =>
  state.favoriteMovieIds
export const selectWatchLaterMovieIds = (state: MovieClientState) =>
  state.watchLaterMovieIds
export const selectGridView = (state: MovieClientState) => state.gridView
export const selectShowFilters = (state: MovieClientState) => state.showFilters
export const selectActiveGenre = (state: MovieClientState) => state.activeGenre
export const selectSortBy = (state: MovieClientState) => state.sortBy
export const selectSortOrder = (state: MovieClientState) => state.sortOrder

// 兼容性导出（保持向后兼容）
export const useMovieStore = useMovieClientStore
