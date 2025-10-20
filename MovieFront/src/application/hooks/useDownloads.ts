/**
 * @fileoverview 下载管理相关Hooks - 基于TanStack Query的下载任务状态管理
 * @description 提供完整的下载功能，包括任务管理、状态监控、批量操作等服务端状态管理。
 * 遵循DDD架构原则，作为应用层Hook协调下载领域的业务逻辑。
 * 集成TanStack Query实现实时状态更新、缓存管理、乐观更新等高级功能。
 * 
 * @author mosctz
 * @version 1.2.0
 * @created 2025-10-09 13:10:49
 * @updated 2025-10-17 17:00:38
 */

import {
  QUERY_KEYS,
  createQueryOptions,
} from '@application/services/queryClient'
import {
  useDownloadStore,
  type DownloadTask,
} from '@application/stores/downloadStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// 下载API服务对象 - 封装所有下载相关的API调用，提供统一的数据访问接口
const downloadApi = {
  // 获取所有下载任务
  getDownloads: async (): Promise<DownloadTask[]> => {
    // 模拟网络延迟 - 实际项目中应替换为真实API调用
    await new Promise(resolve => setTimeout(resolve, 300))
    return useDownloadStore.getState().downloads
  },

  // 获取活跃下载任务 - 正在进行或等待中的下载任务
  getActiveDownloads: async (): Promise<DownloadTask[]> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const downloads = useDownloadStore.getState().downloads
    // 过滤条件 - 仅返回正在下载或等待中的任务
    return downloads.filter(
      d => d.status === 'downloading' || d.status === 'pending'
    )
  },

  // 获取下载历史记录 - 已完成或失败的下载任务
  getDownloadHistory: async (): Promise<DownloadTask[]> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const downloads = useDownloadStore.getState().downloads
    // 过滤条件 - 仅返回已完成或失败的任务
    return downloads.filter(
      d => d.status === 'completed' || d.status === 'failed'
    )
  },

  // 开始新的下载任务
  startDownload: async (
    movieId: string,
    quality: string = 'HD'
  ): Promise<DownloadTask> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return useDownloadStore.getState().startDownload(movieId, quality)
  },

  // 暂停指定下载任务
  pauseDownload: async (downloadId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    useDownloadStore.getState().pauseDownload(downloadId)
  },

  // 恢复指定下载任务
  resumeDownload: async (downloadId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    useDownloadStore.getState().resumeDownload(downloadId)
  },

  // 取消指定下载任务
  cancelDownload: async (downloadId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    useDownloadStore.getState().cancelDownload(downloadId)
  },

  // 重试失败的下载任务
  retryDownload: async (downloadId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    useDownloadStore.getState().retryDownload(downloadId)
  },

  // 删除下载记录
  removeDownload: async (downloadId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    useDownloadStore.getState().removeDownload(downloadId)
  },

  // 清空所有下载历史记录 - 仅清除已完成和失败的下载记录，不影响正在进行的任务
  clearHistory: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const downloads = useDownloadStore.getState().downloads
    // 筛选历史记录 - 仅处理已完成或失败的任务
    const historyIds = downloads
      .filter(d => d.status === 'completed' || d.status === 'failed')
      .map(d => d.id)

    // 批量删除历史记录
    historyIds.forEach(id => {
      useDownloadStore.getState().removeDownload(id)
    })
  },

  // 获取下载统计信息
  getDownloadStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const store = useDownloadStore.getState()
    // 触发统计计算 - 更新最新的统计数据
    store.calculateStats()
    return store.stats
  },

  // 批量操作下载任务
  batchOperation: async (
    downloadIds: string[],
    operation: 'pause' | 'resume' | 'cancel' | 'remove'
  ): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400))

    const store = useDownloadStore.getState()
    // 批量执行操作 - 遍历所有指定的下载任务
    downloadIds.forEach(id => {
      switch (operation) {
        case 'pause':
          store.pauseDownload(id)
          break
        case 'resume':
          store.resumeDownload(id)
          break
        case 'cancel':
          store.cancelDownload(id)
          break
        case 'remove':
          store.removeDownload(id)
          break
      }
    })
  },
}

// 获取所有下载任务Hook - 提供完整的下载任务列表，支持实时更新和缓存管理
export const useDownloads = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DOWNLOADS.LIST,
    queryFn: downloadApi.getDownloads,
    ...createQueryOptions.realtime, // 实时更新配置
  })
}

// 获取活跃下载任务Hook - 提供正在进行或等待中的下载任务，支持高频率实时更新
export const useActiveDownloads = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DOWNLOADS.ACTIVE,
    queryFn: downloadApi.getActiveDownloads,
    ...createQueryOptions.realtime,
    refetchInterval: 1000, // 性能优化 - 每秒更新一次活跃下载状态
  })
}

// 获取下载历史记录Hook - 提供已完成和失败的下载任务历史，使用用户级缓存策略
export const useDownloadHistory = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DOWNLOADS.HISTORY,
    queryFn: downloadApi.getDownloadHistory,
    ...createQueryOptions.user, // 用户级缓存策略
  })
}

// 获取下载统计信息Hook - 提供下载任务的统计数据，包括总数、成功率、速度等指标
export const useDownloadStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DOWNLOADS.STATS,
    queryFn: downloadApi.getDownloadStats,
    ...createQueryOptions.realtime,
  })
}

// 开始下载Hook - 创建新的下载任务，支持指定下载质量
export const useStartDownload = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ movieId, quality }: { movieId: string; quality?: string }) =>
      downloadApi.startDownload(movieId, quality),
    onSuccess: () => {
      // 缓存更新 - 刷新下载相关的所有查询缓存
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.LIST })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.ACTIVE })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.STATS })
    },
  })
}

// 暂停下载Hook - 暂停指定的下载任务，保持任务状态和进度信息
export const usePauseDownload = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (downloadId: string) => downloadApi.pauseDownload(downloadId),
    onSuccess: () => {
      // 缓存更新 - 刷新任务列表和活跃下载
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.LIST })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.ACTIVE })
    },
  })
}

// 恢复下载Hook - 恢复已暂停的下载任务，从上次停止的位置继续下载
export const useResumeDownload = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (downloadId: string) => downloadApi.resumeDownload(downloadId),
    onSuccess: () => {
      // 缓存更新 - 刷新任务列表和活跃下载
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.LIST })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.ACTIVE })
    },
  })
}

// 取消下载Hook - 取消正在进行或等待中的下载任务，清理相关资源
export const useCancelDownload = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (downloadId: string) => downloadApi.cancelDownload(downloadId),
    onSuccess: () => {
      // 缓存更新 - 刷新任务列表、活跃下载和统计信息
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.LIST })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.ACTIVE })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.STATS })
    },
  })
}

// 重试下载Hook - 重新启动失败的下载任务，重置错误状态并重新开始下载
export const useRetryDownload = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (downloadId: string) => downloadApi.retryDownload(downloadId),
    onSuccess: () => {
      // 缓存更新 - 刷新任务列表和活跃下载
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.LIST })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.ACTIVE })
    },
  })
}

// 删除下载记录Hook - 永久删除下载任务记录，包括相关的文件和元数据
export const useRemoveDownload = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (downloadId: string) => downloadApi.removeDownload(downloadId),
    onSuccess: () => {
      // 缓存更新 - 刷新所有下载相关查询
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.LIST })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.HISTORY })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.STATS })
    },
  })
}

// 清空下载历史Hook - 批量删除所有已完成和失败的下载记录，不影响正在进行的任务
export const useClearDownloadHistory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => downloadApi.clearHistory(),
    onSuccess: () => {
      // 缓存更新 - 刷新所有下载相关查询
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.LIST })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.HISTORY })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.STATS })
    },
  })
}

// 批量下载操作Hook - 对多个下载任务执行相同的操作，提高操作效率
export const useBatchDownloadOperation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      downloadIds,
      operation,
    }: {
      downloadIds: string[] // 要操作的下载任务ID数组
      operation: 'pause' | 'resume' | 'cancel' | 'remove' // 操作类型
    }) => downloadApi.batchOperation(downloadIds, operation),
    onSuccess: () => {
      // 缓存更新 - 批量操作后刷新所有相关查询缓存
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.LIST })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.ACTIVE })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.HISTORY })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.STATS })
    },
  })
}

// 获取特定下载任务状态Hook - 实时监控指定下载任务的状态变化，支持高频率更新
export const useDownloadStatus = (downloadId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.DOWNLOADS.STATUS(downloadId),
    queryFn: async () => {
      const downloads = await downloadApi.getDownloads()
      // 数据过滤 - 查找指定ID的下载任务
      return downloads.find(d => d.id === downloadId)
    },
    enabled: !!downloadId, // 防御性检查 - 仅在有下载ID时启用查询
    ...createQueryOptions.realtime,
    refetchInterval: 1000, // 性能优化 - 每秒更新状态
  })
}

// 检查是否可以下载Hook - 验证指定影片是否可以开始新的下载任务
export const useCanDownload = (movieId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.DOWNLOADS.CAN_DOWNLOAD(movieId),
    queryFn: async () => {
      const downloads = await downloadApi.getDownloads()
      // 查找现有下载任务
      const existingDownload = downloads.find(d => d.movieId === movieId)

      // 业务规则 - 如果已有完成或正在下载的任务，则不能重复下载
      if (
        existingDownload &&
        (existingDownload.status === 'completed' ||
          existingDownload.status === 'downloading')
      ) {
        return false
      }

      return true
    },
    enabled: !!movieId, // 防御性检查 - 仅在有影片ID时启用查询
    ...createQueryOptions.user, // 用户级缓存策略
  })
}
