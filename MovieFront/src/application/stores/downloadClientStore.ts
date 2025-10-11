/**
 * @fileoverview 客户端下载状态管理 - 仅管理客户端下载UI状态
 * @description 管理下载UI交互状态，不涉及实际下载逻辑
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// 下载状态枚举
export enum DownloadStatus {
  PENDING = 'pending',
  DOWNLOADING = 'downloading',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

// 下载任务接口（由TanStack Query管理）
export interface DownloadTask {
  id: string
  userId: string
  movieId: string
  movieTitle: string
  moviePoster?: string
  quality: string
  format: string
  size: string
  downloadUrl: string
  magnetLink?: string
  status: DownloadStatus
  progress: number
  speed: number
  downloadedSize: number
  totalSize: number
  estimatedTime: number
  estimatedTimeRemaining?: number
  startTime: Date
  startedAt?: Date
  endTime?: Date
  completedAt?: Date
  pausedAt?: Date
  errorMessage?: string
  filePath?: string
  retryCount: number
  maxRetries: number
  priority: number
  createdAt: Date
  updatedAt: Date
  fileName?: string
  fileSize?: number
}

// 客户端下载状态管理接口
interface DownloadClientState {
  // UI状态
  isDownloadPanelOpen: boolean
  isAddDownloadModalOpen: boolean
  activeTab: 'downloading' | 'completed' | 'failed' | 'all'

  // 过滤和排序
  downloadFilters: {
    status?: DownloadStatus
    quality?: string
    sortBy?: 'createdAt' | 'progress' | 'speed' | 'title'
    sortOrder?: 'asc' | 'desc'
  }

  // 设置状态
  showSpeedGraph: boolean
  autoHideCompleted: boolean
  notificationsEnabled: boolean

  // 选中的下载任务
  selectedDownloadIds: string[]

  // 临时数据
  tempDownloadData: {
    movieId?: string
    quality?: string
    format?: string
    downloadPath?: string
  }

  // 客户端操作（不涉及API）
  setDownloadPanelOpen: (open: boolean) => void
  setAddDownloadModalOpen: (open: boolean) => void
  setActiveTab: (tab: DownloadClientState['activeTab']) => void
  setDownloadFilters: (
    filters: Partial<DownloadClientState['downloadFilters']>
  ) => void
  setShowSpeedGraph: (show: boolean) => void
  setAutoHideCompleted: (autoHide: boolean) => void
  setNotificationsEnabled: (enabled: boolean) => void
  setSelectedDownloadIds: (ids: string[]) => void
  setTempDownloadData: (
    data: Partial<DownloadClientState['tempDownloadData']>
  ) => void
  clearTempDownloadData: () => void
  toggleDownloadSelection: (downloadId: string) => void
  selectAllDownloads: (downloadIds: string[]) => void
  clearSelection: () => void
  resetFilters: () => void
}

// 创建客户端下载状态管理store
export const useDownloadClientStore = create<DownloadClientState>()(
  devtools(
    persist(
      set => ({
        // 初始状态
        isDownloadPanelOpen: false,
        isAddDownloadModalOpen: false,
        activeTab: 'downloading',

        downloadFilters: {},

        showSpeedGraph: true,
        autoHideCompleted: false,
        notificationsEnabled: true,

        selectedDownloadIds: [],

        tempDownloadData: {},

        // 设置下载面板状态
        setDownloadPanelOpen: open => set({ isDownloadPanelOpen: open }),

        // 设置添加下载模态框状态
        setAddDownloadModalOpen: open => set({ isAddDownloadModalOpen: open }),

        // 设置活动标签页
        setActiveTab: tab => set({ activeTab: tab }),

        // 设置下载过滤器
        setDownloadFilters: filters =>
          set(state => ({
            downloadFilters: { ...state.downloadFilters, ...filters },
          })),

        // 设置速度图表显示
        setShowSpeedGraph: show => set({ showSpeedGraph: show }),

        // 设置自动隐藏已完成
        setAutoHideCompleted: autoHide => set({ autoHideCompleted: autoHide }),

        // 设置通知启用
        setNotificationsEnabled: enabled =>
          set({ notificationsEnabled: enabled }),

        // 设置选中的下载任务ID
        setSelectedDownloadIds: ids => set({ selectedDownloadIds: ids }),

        // 设置临时下载数据
        setTempDownloadData: data =>
          set(state => ({
            tempDownloadData: { ...state.tempDownloadData, ...data },
          })),

        // 清除临时下载数据
        clearTempDownloadData: () => set({ tempDownloadData: {} }),

        // 切换下载任务选择状态
        toggleDownloadSelection: downloadId =>
          set(state => ({
            selectedDownloadIds: state.selectedDownloadIds.includes(downloadId)
              ? state.selectedDownloadIds.filter(id => id !== downloadId)
              : [...state.selectedDownloadIds, downloadId],
          })),

        // 选择所有下载任务
        selectAllDownloads: downloadIds =>
          set({ selectedDownloadIds: downloadIds }),

        // 清除选择
        clearSelection: () => set({ selectedDownloadIds: [] }),

        // 重置过滤器
        resetFilters: () =>
          set({
            downloadFilters: {},
          }),
      }),
      {
        name: 'download-client-storage',
        partialize: state => ({
          isDownloadPanelOpen: state.isDownloadPanelOpen,
          activeTab: state.activeTab,
          downloadFilters: state.downloadFilters,
          showSpeedGraph: state.showSpeedGraph,
          autoHideCompleted: state.autoHideCompleted,
          notificationsEnabled: state.notificationsEnabled,
        }),
      }
    ),
    {
      name: 'download-client-store',
    }
  )
)

// 选择器函数
export const selectIsDownloadPanelOpen = (state: DownloadClientState) =>
  state.isDownloadPanelOpen
export const selectActiveTab = (state: DownloadClientState) => state.activeTab
export const selectDownloadFilters = (state: DownloadClientState) =>
  state.downloadFilters
export const selectSelectedDownloadIds = (state: DownloadClientState) =>
  state.selectedDownloadIds
export const selectTempDownloadData = (state: DownloadClientState) =>
  state.tempDownloadData
export const selectNotificationsEnabled = (state: DownloadClientState) =>
  state.notificationsEnabled

// 兼容性导出（保持向后兼容）
export const useDownloadStore = useDownloadClientStore
