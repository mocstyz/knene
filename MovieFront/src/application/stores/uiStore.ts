/**
 * @fileoverview 客户端UI状态管理 - 仅管理UI交互状态
 * @description 管理主题、侧边栏、模态框、表单等纯客户端状态
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// UI状态接口
interface UIState {
  // 主题相关
  theme: 'light' | 'dark' | 'inherit'
  sidebarOpen: boolean
  sidebarCollapsed: boolean

  // 模态框状态
  loginModalOpen: boolean
  registerModalOpen: boolean
  movieDetailModalOpen: boolean
  searchModalOpen: boolean

  // 当前选中的内容
  selectedMovieId: string | null
  selectedCategory: string | null

  // 搜索和过滤状态
  searchQuery: string
  currentFilters: Record<string, any>

  // 表单状态
  isSearchFocused: boolean

  // 页面状态
  currentPage: number
  scrollTop: number

  // 加载状态（纯UI）
  isMenuOpen: boolean
  isDropdownOpen: string | null

  // 操作
  setTheme: (theme: 'light' | 'dark' | 'inherit') => void
  setSidebarOpen: (open: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setLoginModalOpen: (open: boolean) => void
  setRegisterModalOpen: (open: boolean) => void
  setMovieDetailModalOpen: (open: boolean) => void
  setSearchModalOpen: (open: boolean) => void
  setSelectedMovieId: (movieId: string | null) => void
  setSelectedCategory: (category: string | null) => void
  setSearchQuery: (query: string) => void
  setCurrentFilters: (filters: Record<string, any>) => void
  setIsSearchFocused: (focused: boolean) => void
  setCurrentPage: (page: number) => void
  setScrollTop: (scrollTop: number) => void
  setIsMenuOpen: (open: boolean) => void
  setIsDropdownOpen: (dropdownId: string | null) => void

  // 组合操作
  openMovieDetail: (movieId: string) => void
  closeAllModals: () => void
  resetFilters: () => void
  toggleSidebar: () => void
}

// 创建UI状态管理store
export const useUIStore = create<UIState>()(
  devtools(
    persist(
      set => ({
        // 初始状态
        theme: 'dark' as const,
        sidebarOpen: true,
        sidebarCollapsed: false,

        loginModalOpen: false,
        registerModalOpen: false,
        movieDetailModalOpen: false,
        searchModalOpen: false,

        selectedMovieId: null,
        selectedCategory: null,

        searchQuery: '',
        currentFilters: {},

        isSearchFocused: false,

        currentPage: 1,
        scrollTop: 0,

        isMenuOpen: false,
        isDropdownOpen: null,

        // 设置主题
        setTheme: theme => set({ theme }),

        // 设置侧边栏状态
        setSidebarOpen: open => set({ sidebarOpen: open }),
        setSidebarCollapsed: collapsed => set({ sidebarCollapsed: collapsed }),

        // 设置模态框状态
        setLoginModalOpen: open => set({ loginModalOpen: open }),
        setRegisterModalOpen: open => set({ registerModalOpen: open }),
        setMovieDetailModalOpen: open => set({ movieDetailModalOpen: open }),
        setSearchModalOpen: open => set({ searchModalOpen: open }),

        // 设置选中状态
        setSelectedMovieId: movieId => set({ selectedMovieId: movieId }),
        setSelectedCategory: category => set({ selectedCategory: category }),

        // 设置搜索和过滤
        setSearchQuery: query => set({ searchQuery: query }),
        setCurrentFilters: filters => set({ currentFilters: filters }),

        // 设置表单状态
        setIsSearchFocused: focused => set({ isSearchFocused: focused }),

        // 设置页面状态
        setCurrentPage: page => set({ currentPage: page }),
        setScrollTop: scrollTop => set({ scrollTop }),

        // 设置菜单状态
        setIsMenuOpen: open => set({ isMenuOpen: open }),
        setIsDropdownOpen: dropdownId => set({ isDropdownOpen: dropdownId }),

        // 组合操作
        openMovieDetail: movieId =>
          set({
            selectedMovieId: movieId,
            movieDetailModalOpen: true,
          }),

        closeAllModals: () =>
          set({
            loginModalOpen: false,
            registerModalOpen: false,
            movieDetailModalOpen: false,
            searchModalOpen: false,
          }),

        resetFilters: () =>
          set({
            currentFilters: {},
            selectedCategory: null,
            searchQuery: '',
          }),

        toggleSidebar: () =>
          set(state => ({
            sidebarOpen: !state.sidebarOpen,
          })),
      }),
      {
        name: 'ui-storage',
        partialize: state => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
          sidebarCollapsed: state.sidebarCollapsed,
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
)

// 选择器函数
export const selectTheme = (state: UIState) => state.theme
export const selectSidebarOpen = (state: UIState) => state.sidebarOpen
export const selectSidebarCollapsed = (state: UIState) => state.sidebarCollapsed
export const selectSelectedMovieId = (state: UIState) => state.selectedMovieId
export const selectSearchQuery = (state: UIState) => state.searchQuery
export const selectCurrentFilters = (state: UIState) => state.currentFilters
export const selectCurrentPage = (state: UIState) => state.currentPage
