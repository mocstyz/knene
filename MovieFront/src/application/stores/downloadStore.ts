import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// 下载状态枚举
export enum DownloadStatus {
  PENDING = 'pending',
  DOWNLOADING = 'downloading',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// 下载任务接口
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
  progress: number // 0-100
  speed: number // bytes per second
  downloadedSize: number // bytes
  totalSize: number // bytes
  estimatedTime: number // seconds
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

// 下载统计信息
export interface DownloadStats {
  totalDownloads: number
  completedDownloads: number
  failedDownloads: number
  totalSize: number
  downloadedSize: number
  averageSpeed: number
}

// 下载状态管理接口
interface DownloadState {
  // 状态
  downloads: DownloadTask[]
  activeDownloads: DownloadTask[]
  completedDownloads: DownloadTask[]
  failedDownloads: DownloadTask[]
  
  // 设置
  maxConcurrentDownloads: number
  downloadPath: string
  autoStart: boolean
  
  // 统计
  stats: DownloadStats
  
  // 操作
  startDownload: (movieId: string, quality: string) => Promise<DownloadTask>
  pauseDownload: (downloadId: string) => void
  resumeDownload: (downloadId: string) => void
  cancelDownload: (downloadId: string) => void
  retryDownload: (downloadId: string) => Promise<void>
  removeDownload: (downloadId: string) => void
  clearCompleted: () => void
  clearFailed: () => void
  updateProgress: (downloadId: string, progress: number, speed: number) => void
  setMaxConcurrentDownloads: (max: number) => void
  setDownloadPath: (path: string) => void
  setAutoStart: (autoStart: boolean) => void
  getDownloadById: (id: string) => DownloadTask | undefined
  calculateStats: () => void
  simulateDownloadProgress: (downloadId: string) => void
}

// 模拟影片数据（用于下载）
const mockMovieData: Record<string, { title: string; poster: string; sizes: Record<string, { size: string; url: string }> }> = {
  '1': {
    title: '阿凡达：水之道',
    poster: 'https://via.placeholder.com/300x450/0066cc/ffffff?text=Avatar+2',
    sizes: {
      'HD': { size: '8.5GB', url: 'https://example.com/avatar2-hd.mkv' },
      '4K': { size: '15.2GB', url: 'https://example.com/avatar2-4k.mkv' },
      'BluRay': { size: '25.8GB', url: 'https://example.com/avatar2-bluray.mkv' }
    }
  },
  '2': {
    title: '流浪地球2',
    poster: 'https://via.placeholder.com/300x450/cc6600/ffffff?text=Wandering+Earth+2',
    sizes: {
      'HD': { size: '6.8GB', url: 'https://example.com/wandering-earth-2-hd.mkv' },
      'BluRay': { size: '12.8GB', url: 'https://example.com/wandering-earth-2-bluray.mkv' }
    }
  },
  '3': {
    title: '蜘蛛侠：纵横宇宙',
    poster: 'https://via.placeholder.com/300x450/cc0066/ffffff?text=Spider-Verse',
    sizes: {
      'HD': { size: '5.2GB', url: 'https://example.com/spider-verse-hd.mkv' },
      '4K': { size: '8.5GB', url: 'https://example.com/spider-verse-4k.mkv' }
    }
  }
}

// 创建下载状态管理store
export const useDownloadStore = create<DownloadState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        downloads: [],
        activeDownloads: [],
        completedDownloads: [],
        failedDownloads: [],
        
        maxConcurrentDownloads: 3,
        downloadPath: 'C:\\Downloads\\Movies',
        autoStart: true,
        
        stats: {
          totalDownloads: 0,
          completedDownloads: 0,
          failedDownloads: 0,
          totalSize: 0,
          downloadedSize: 0,
          averageSpeed: 0
        },

        // 开始下载
        startDownload: async (movieId: string, quality: string): Promise<DownloadTask> => {
          const movieData = mockMovieData[movieId]
          if (!movieData || !movieData.sizes[quality]) {
            throw new Error('影片或质量不存在')
          }

          const { activeDownloads, maxConcurrentDownloads } = get()
          if (activeDownloads.length >= maxConcurrentDownloads) {
            throw new Error(`最多只能同时下载 ${maxConcurrentDownloads} 个文件`)
          }

          const sizeData = movieData.sizes[quality]
          const totalSizeBytes = parseFloat(sizeData.size) * (sizeData.size.includes('GB') ? 1024 * 1024 * 1024 : 1024 * 1024)

          const downloadTask: DownloadTask = {
            id: `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: 'current-user', // 临时用户ID
            movieId,
            movieTitle: movieData.title,
            moviePoster: movieData.poster,
            quality,
            format: 'mkv',
            size: sizeData.size,
            downloadUrl: sizeData.url,
            status: DownloadStatus.DOWNLOADING,
            progress: 0,
            speed: 0,
            downloadedSize: 0,
            totalSize: totalSizeBytes,
            estimatedTime: 0,
            startTime: new Date(),
            startedAt: new Date(),
            retryCount: 0,
            maxRetries: 3,
            priority: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
            filePath: `${get().downloadPath}\\${movieData.title} (${quality}).mkv`,
            fileName: `${movieData.title} (${quality}).mkv`,
            fileSize: totalSizeBytes
          }

          set(state => ({
            downloads: [...state.downloads, downloadTask],
            activeDownloads: [...state.activeDownloads, downloadTask]
          }))

          // 模拟下载进度
          get().simulateDownloadProgress(downloadTask.id)
          
          return downloadTask
        },

        // 暂停下载
        pauseDownload: (downloadId: string) => {
          set(state => ({
            downloads: state.downloads.map(download =>
              download.id === downloadId
                ? { ...download, status: DownloadStatus.PAUSED }
                : download
            ),
            activeDownloads: state.activeDownloads.map(download =>
              download.id === downloadId
                ? { ...download, status: DownloadStatus.PAUSED }
                : download
            )
          }))
        },

        // 恢复下载
        resumeDownload: (downloadId: string) => {
          set(state => ({
            downloads: state.downloads.map(download =>
              download.id === downloadId
                ? { ...download, status: DownloadStatus.DOWNLOADING }
                : download
            ),
            activeDownloads: state.activeDownloads.map(download =>
              download.id === downloadId
                ? { ...download, status: DownloadStatus.DOWNLOADING }
                : download
            )
          }))

          // 继续模拟下载进度
          get().simulateDownloadProgress(downloadId)
        },

        // 取消下载
        cancelDownload: (downloadId: string) => {
          set(state => ({
            downloads: state.downloads.map(download =>
              download.id === downloadId
                ? { ...download, status: DownloadStatus.CANCELLED, endTime: new Date() }
                : download
            ),
            activeDownloads: state.activeDownloads.filter(download => download.id !== downloadId)
          }))
        },

        // 重试下载
        retryDownload: async (downloadId: string) => {
          const download = get().getDownloadById(downloadId)
          if (!download) return

          set(state => ({
            downloads: state.downloads.map(d =>
              d.id === downloadId
                ? { 
                    ...d, 
                    status: DownloadStatus.DOWNLOADING, 
                    progress: 0, 
                    downloadedSize: 0,
                    startTime: new Date(),
                    endTime: undefined,
                    errorMessage: undefined
                  }
                : d
            ),
            activeDownloads: [...state.activeDownloads.filter(d => d.id !== downloadId), 
              { ...download, status: DownloadStatus.DOWNLOADING, progress: 0, downloadedSize: 0 }],
            failedDownloads: state.failedDownloads.filter(d => d.id !== downloadId)
          }))

          // 重新开始模拟下载
          get().simulateDownloadProgress(downloadId)
        },

        // 移除下载记录
        removeDownload: (downloadId: string) => {
          set(state => ({
            downloads: state.downloads.filter(download => download.id !== downloadId),
            activeDownloads: state.activeDownloads.filter(download => download.id !== downloadId),
            completedDownloads: state.completedDownloads.filter(download => download.id !== downloadId),
            failedDownloads: state.failedDownloads.filter(download => download.id !== downloadId)
          }))
        },

        // 清除已完成的下载
        clearCompleted: () => {
          set(state => ({
            downloads: state.downloads.filter(download => download.status !== DownloadStatus.COMPLETED),
            completedDownloads: []
          }))
        },

        // 清除失败的下载
        clearFailed: () => {
          set(state => ({
            downloads: state.downloads.filter(download => download.status !== DownloadStatus.FAILED),
            failedDownloads: []
          }))
        },

        // 更新下载进度
        updateProgress: (downloadId: string, progress: number, speed: number) => {
          set(state => {
            const updatedDownloads = state.downloads.map(download => {
              if (download.id === downloadId) {
                const downloadedSize = (progress / 100) * download.totalSize
                const estimatedTime = speed > 0 ? (download.totalSize - downloadedSize) / speed : 0
                
                return {
                  ...download,
                  progress,
                  speed,
                  downloadedSize,
                  estimatedTime
                }
              }
              return download
            })

            const updatedActiveDownloads = state.activeDownloads.map(download => {
              const updated = updatedDownloads.find(d => d.id === download.id)
              return updated || download
            })

            return {
              downloads: updatedDownloads,
              activeDownloads: updatedActiveDownloads
            }
          })
        },

        // 设置最大并发下载数
        setMaxConcurrentDownloads: (max: number) => {
          set({ maxConcurrentDownloads: Math.max(1, Math.min(10, max)) })
        },

        // 设置下载路径
        setDownloadPath: (path: string) => {
          set({ downloadPath: path })
        },

        // 设置自动开始
        setAutoStart: (autoStart: boolean) => {
          set({ autoStart })
        },

        // 根据ID获取下载任务
        getDownloadById: (id: string) => {
          return get().downloads.find(download => download.id === id)
        },

        // 计算统计信息
        calculateStats: () => {
          const { downloads } = get()
          const completed = downloads.filter(d => d.status === DownloadStatus.COMPLETED)
          const failed = downloads.filter(d => d.status === DownloadStatus.FAILED)
          
          const totalSize = downloads.reduce((sum, d) => sum + d.totalSize, 0)
          const downloadedSize = downloads.reduce((sum, d) => sum + d.downloadedSize, 0)
          
          const completedWithTime = completed.filter(d => d.endTime && d.startTime)
          const averageSpeed = completedWithTime.length > 0
            ? completedWithTime.reduce((sum, d) => {
                const duration = (d.endTime!.getTime() - d.startTime.getTime()) / 1000
                return sum + (d.totalSize / duration)
              }, 0) / completedWithTime.length
            : 0

          set({
            stats: {
              totalDownloads: downloads.length,
              completedDownloads: completed.length,
              failedDownloads: failed.length,
              totalSize,
              downloadedSize,
              averageSpeed
            },
            completedDownloads: completed,
            failedDownloads: failed
          })
        },

        // 模拟下载进度（仅用于演示）
        simulateDownloadProgress: (downloadId: string) => {
          const download = get().getDownloadById(downloadId)
          if (!download || download.status !== DownloadStatus.DOWNLOADING) return

          const interval = setInterval(() => {
            const currentDownload = get().getDownloadById(downloadId)
            if (!currentDownload || currentDownload.status !== DownloadStatus.DOWNLOADING) {
              clearInterval(interval)
              return
            }

            const newProgress = Math.min(100, currentDownload.progress + Math.random() * 5)
            const speed = 1024 * 1024 * (0.5 + Math.random() * 2) // 0.5-2.5 MB/s

            get().updateProgress(downloadId, newProgress, speed)

            if (newProgress >= 100) {
              clearInterval(interval)
              
              // 标记为完成
              set(state => ({
                downloads: state.downloads.map(d =>
                  d.id === downloadId
                    ? { ...d, status: DownloadStatus.COMPLETED, endTime: new Date(), progress: 100 }
                    : d
                ),
                activeDownloads: state.activeDownloads.filter(d => d.id !== downloadId)
              }))

              get().calculateStats()
            }
          }, 1000)
        }
      }),
      {
        name: 'download-storage',
        partialize: (state) => ({
          downloads: state.downloads,
          maxConcurrentDownloads: state.maxConcurrentDownloads,
          downloadPath: state.downloadPath,
          autoStart: state.autoStart
        })
      }
    ),
    {
      name: 'download-store'
    }
  )
)

// 选择器函数
export const selectDownloads = (state: DownloadState) => state.downloads
export const selectActiveDownloads = (state: DownloadState) => state.activeDownloads
export const selectCompletedDownloads = (state: DownloadState) => state.completedDownloads
export const selectFailedDownloads = (state: DownloadState) => state.failedDownloads
export const selectDownloadStats = (state: DownloadState) => state.stats