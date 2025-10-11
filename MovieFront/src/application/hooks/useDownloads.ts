import {
  QUERY_KEYS,
  createQueryOptions,
} from '@application/services/queryClient'
import {
  useDownloadStore,
  type DownloadTask,
} from '@application/stores/downloadStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// 下载API服务
const downloadApi = {
  // 获取所有下载任务
  getDownloads: async (): Promise<DownloadTask[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return useDownloadStore.getState().downloads
  },

  // 获取活跃下载
  getActiveDownloads: async (): Promise<DownloadTask[]> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const downloads = useDownloadStore.getState().downloads
    return downloads.filter(
      d => d.status === 'downloading' || d.status === 'pending'
    )
  },

  // 获取下载历史
  getDownloadHistory: async (): Promise<DownloadTask[]> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const downloads = useDownloadStore.getState().downloads
    return downloads.filter(
      d => d.status === 'completed' || d.status === 'failed'
    )
  },

  // 开始下载
  startDownload: async (
    movieId: string,
    quality: string = 'HD'
  ): Promise<DownloadTask> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return useDownloadStore.getState().startDownload(movieId, quality)
  },

  // 暂停下载
  pauseDownload: async (downloadId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    useDownloadStore.getState().pauseDownload(downloadId)
  },

  // 恢复下载
  resumeDownload: async (downloadId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    useDownloadStore.getState().resumeDownload(downloadId)
  },

  // 取消下载
  cancelDownload: async (downloadId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    useDownloadStore.getState().cancelDownload(downloadId)
  },

  // 重试下载
  retryDownload: async (downloadId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    useDownloadStore.getState().retryDownload(downloadId)
  },

  // 删除下载记录
  removeDownload: async (downloadId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    useDownloadStore.getState().removeDownload(downloadId)
  },

  // 清空下载历史
  clearHistory: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const downloads = useDownloadStore.getState().downloads
    const historyIds = downloads
      .filter(d => d.status === 'completed' || d.status === 'failed')
      .map(d => d.id)

    historyIds.forEach(id => {
      useDownloadStore.getState().removeDownload(id)
    })
  },

  // 获取下载统计
  getDownloadStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const store = useDownloadStore.getState()
    store.calculateStats()
    return store.stats
  },

  // 批量操作
  batchOperation: async (
    downloadIds: string[],
    operation: 'pause' | 'resume' | 'cancel' | 'remove'
  ): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400))

    const store = useDownloadStore.getState()
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

// 获取所有下载任务
export const useDownloads = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DOWNLOADS.LIST,
    queryFn: downloadApi.getDownloads,
    ...createQueryOptions.realtime,
  })
}

// 获取活跃下载
export const useActiveDownloads = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DOWNLOADS.ACTIVE,
    queryFn: downloadApi.getActiveDownloads,
    ...createQueryOptions.realtime,
    refetchInterval: 1000, // 每秒更新一次活跃下载状态
  })
}

// 获取下载历史
export const useDownloadHistory = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DOWNLOADS.HISTORY,
    queryFn: downloadApi.getDownloadHistory,
    ...createQueryOptions.user,
  })
}

// 获取下载统计
export const useDownloadStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DOWNLOADS.STATS,
    queryFn: downloadApi.getDownloadStats,
    ...createQueryOptions.realtime,
  })
}

// 开始下载
export const useStartDownload = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ movieId, quality }: { movieId: string; quality?: string }) =>
      downloadApi.startDownload(movieId, quality),
    onSuccess: () => {
      // 更新下载相关查询缓存
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.LIST })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.ACTIVE })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.STATS })
    },
  })
}

// 暂停下载
export const usePauseDownload = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (downloadId: string) => downloadApi.pauseDownload(downloadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.LIST })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.ACTIVE })
    },
  })
}

// 恢复下载
export const useResumeDownload = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (downloadId: string) => downloadApi.resumeDownload(downloadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.LIST })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.ACTIVE })
    },
  })
}

// 取消下载
export const useCancelDownload = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (downloadId: string) => downloadApi.cancelDownload(downloadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.LIST })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.ACTIVE })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.STATS })
    },
  })
}

// 重试下载
export const useRetryDownload = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (downloadId: string) => downloadApi.retryDownload(downloadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.LIST })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.ACTIVE })
    },
  })
}

// 删除下载记录
export const useRemoveDownload = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (downloadId: string) => downloadApi.removeDownload(downloadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.LIST })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.HISTORY })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.STATS })
    },
  })
}

// 清空下载历史
export const useClearDownloadHistory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => downloadApi.clearHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.LIST })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.HISTORY })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.STATS })
    },
  })
}

// 批量操作下载
export const useBatchDownloadOperation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      downloadIds,
      operation,
    }: {
      downloadIds: string[]
      operation: 'pause' | 'resume' | 'cancel' | 'remove'
    }) => downloadApi.batchOperation(downloadIds, operation),
    onSuccess: () => {
      // 更新所有下载相关查询缓存
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.LIST })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.ACTIVE })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.HISTORY })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOWNLOADS.STATS })
    },
  })
}

// 获取特定下载任务状态
export const useDownloadStatus = (downloadId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.DOWNLOADS.STATUS(downloadId),
    queryFn: async () => {
      const downloads = await downloadApi.getDownloads()
      return downloads.find(d => d.id === downloadId)
    },
    enabled: !!downloadId,
    ...createQueryOptions.realtime,
    refetchInterval: 1000, // 每秒更新状态
  })
}

// 检查是否可以下载
export const useCanDownload = (movieId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.DOWNLOADS.CAN_DOWNLOAD(movieId),
    queryFn: async () => {
      const downloads = await downloadApi.getDownloads()
      const existingDownload = downloads.find(d => d.movieId === movieId)

      // 如果已经有下载任务且状态为完成或正在下载，则不能重复下载
      if (
        existingDownload &&
        (existingDownload.status === 'completed' ||
          existingDownload.status === 'downloading')
      ) {
        return false
      }

      return true
    },
    enabled: !!movieId,
    ...createQueryOptions.user,
  })
}
