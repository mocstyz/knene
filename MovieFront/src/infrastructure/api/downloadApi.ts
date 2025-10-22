/**
 * @fileoverview 下载API服务
 * @description 处理下载任务管理的所有API调用，包括下载列表获取、任务控制。
 *              支持开始、暂停、恢复、取消等完整的下载生命周期管理。
 *              提供进度监控、权限验证、配置管理和存储空间管理等功能。
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import {
  DownloadTask,
  DownloadStatus,
  DownloadStats,
} from '@application/stores/downloadStore'
import { httpClient } from '@infrastructure/api/movieApi'

// 下载API服务类 - 提供完整的下载管理功能
export class DownloadApi {
  // 获取用户下载列表 - 支持按状态、页码、排序等条件筛选
  static async getDownloads(params?: {
    status?: DownloadStatus
    page?: number
    limit?: number
    sortBy?: 'createdAt' | 'progress' | 'speed'
    sortOrder?: 'asc' | 'desc'
  }): Promise<{
    downloads: DownloadTask[]
    total: number
    page: number
    totalPages: number
  }> {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder)

    await new Promise(resolve => setTimeout(resolve, 400))

    const response = await httpClient.get<{
      downloads: DownloadTask[]
      total: number
      page: number
      totalPages: number
    }>(`/downloads?${queryParams.toString()}`)
    return response.data
  }

  // 获取活跃下载任务 - 获取当前正在进行的下载任务列表
  static async getActiveDownloads(): Promise<DownloadTask[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const response = await httpClient.get<DownloadTask[]>('/downloads/active')
    return response.data
  }

  // 获取下载历史 - 获取已完成或取消的下载历史记录
  static async getDownloadHistory(params?: {
    page?: number
    limit?: number
    dateFrom?: string
    dateTo?: string
  }): Promise<{
    downloads: DownloadTask[]
    total: number
    page: number
    totalPages: number
  }> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom)
    if (params?.dateTo) queryParams.append('dateTo', params.dateTo)

    await new Promise(resolve => setTimeout(resolve, 500))

    const response = await httpClient.get<{
      downloads: DownloadTask[]
      total: number
      page: number
      totalPages: number
    }>(`/downloads/history?${queryParams.toString()}`)
    return response.data
  }

  // 获取下载统计信息 - 获取用户的下载统计数据和汇总信息
  static async getDownloadStats(): Promise<DownloadStats> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const response = await httpClient.get<DownloadStats>('/downloads/stats')
    return response.data
  }

  // 开始下载任务 - 创建并启动新的下载任务
  static async startDownload(
    movieId: string,
    quality: string
  ): Promise<DownloadTask> {
    await new Promise(resolve => setTimeout(resolve, 600))

    const response = await httpClient.post<DownloadTask>('/downloads/start', {
      movieId,
      quality,
    })
    return response.data
  }

  // 暂停下载任务 - 暂停指定的下载任务
  static async pauseDownload(downloadId: string): Promise<DownloadTask> {
    await new Promise(resolve => setTimeout(resolve, 200))

    const response = await httpClient.put<DownloadTask>(
      `/downloads/${downloadId}/pause`
    )
    return response.data
  }

  // 恢复下载任务 - 恢复已暂停的下载任务
  static async resumeDownload(downloadId: string): Promise<DownloadTask> {
    await new Promise(resolve => setTimeout(resolve, 200))

    const response = await httpClient.put<DownloadTask>(
      `/downloads/${downloadId}/resume`
    )
    return response.data
  }

  // 取消下载任务 - 取消指定的下载任务并清理临时文件
  static async cancelDownload(downloadId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))

    await httpClient.delete<void>(`/downloads/${downloadId}`)
  }

  // 重试下载任务 - 重新开始失败的下载任务
  static async retryDownload(downloadId: string): Promise<DownloadTask> {
    await new Promise(resolve => setTimeout(resolve, 400))

    const response = await httpClient.post<DownloadTask>(
      `/downloads/${downloadId}/retry`
    )
    return response.data
  }

  // 删除下载记录 - 从历史记录中删除下载任务
  static async removeDownload(downloadId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200))

    await httpClient.delete<void>(`/downloads/${downloadId}/record`)
  }

  // 批量操作下载任务 - 对多个下载任务执行批量操作
  static async batchOperation(
    downloadIds: string[],
    operation: 'pause' | 'resume' | 'cancel' | 'retry' | 'remove'
  ): Promise<{
    success: string[]
    failed: Array<{ id: string; error: string }>
  }> {
    await new Promise(resolve => setTimeout(resolve, 800))

    const response = await httpClient.post<{
      success: string[]
      failed: Array<{ id: string; error: string }>
    }>('/downloads/batch', {
      downloadIds,
      operation,
    })
    return response.data
  }

  // 清空下载历史 - 清除所有下载历史记录
  static async clearHistory(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400))

    await httpClient.delete<void>('/downloads/history')
  }

  // 获取下载进度更新 - 批量获取多个下载任务的实时进度信息
  static async getProgressUpdates(downloadIds: string[]): Promise<
    Array<{
      id: string
      progress: number
      speed: number
      remainingTime: number
      status: DownloadStatus
    }>
  > {
    await new Promise(resolve => setTimeout(resolve, 100))

    const response = await httpClient.post<
      Array<{
        id: string
        progress: number
        speed: number
        remainingTime: number
        status: DownloadStatus
      }>
    >('/downloads/progress', { downloadIds })
    return response.data
  }

  // 获取可用下载链接 - 获取指定影片的所有可用下载链接
  static async getDownloadLinks(movieId: string): Promise<
    Array<{
      quality: string
      size: number
      format: string
      url: string
      expires: string
    }>
  > {
    await new Promise(resolve => setTimeout(resolve, 500))

    const response = await httpClient.get<
      Array<{
        quality: string
        size: number
        format: string
        url: string
        expires: string
      }>
    >(`/downloads/links/${movieId}`)
    return response.data
  }

  // 验证下载权限 - 检查用户是否有权限下载指定影片
  static async validateDownloadPermission(movieId: string): Promise<{
    allowed: boolean
    reason?: string
    remainingDownloads?: number
    resetDate?: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const response = await httpClient.get<{
      allowed: boolean
      reason?: string
      remainingDownloads?: number
      resetDate?: string
    }>(`/downloads/validate/${movieId}`)
    return response.data
  }

  // 获取下载配置 - 获取用户的下载设置和系统配置
  static async getDownloadConfig(): Promise<{
    maxConcurrentDownloads: number
    maxDownloadSpeed: number
    allowedQualities: string[]
    storageLimit: number
    autoRetryCount: number
    retryDelay: number
  }> {
    await new Promise(resolve => setTimeout(resolve, 200))

    const response = await httpClient.get<{
      maxConcurrentDownloads: number
      maxDownloadSpeed: number
      allowedQualities: string[]
      storageLimit: number
      autoRetryCount: number
      retryDelay: number
    }>('/downloads/config')
    return response.data
  }

  // 更新下载配置 - 更新用户的下载设置和偏好
  static async updateDownloadConfig(config: {
    maxConcurrentDownloads?: number
    maxDownloadSpeed?: number
    autoRetryCount?: number
    retryDelay?: number
  }): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400))

    await httpClient.put<void>('/downloads/config', config)
  }

  // 获取存储空间信息 - 获取下载目录的存储使用情况
  static async getStorageInfo(): Promise<{
    used: number
    total: number
    available: number
    downloads: Array<{
      id: string
      movieTitle: string
      size: number
      path: string
    }>
  }> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const response = await httpClient.get<{
      used: number
      total: number
      available: number
      downloads: Array<{
        id: string
        movieTitle: string
        size: number
        path: string
      }>
    }>('/downloads/storage')
    return response.data
  }

  // 清理存储空间 - 删除指定的下载文件以释放存储空间
  static async cleanupStorage(options?: {
    removeCompleted?: boolean
    removeFailed?: boolean
    olderThanDays?: number
  }): Promise<{
    cleaned: number
    freedSpace: number
    removedFiles: string[]
  }> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const response = await httpClient.post<{
      cleaned: number
      freedSpace: number
      removedFiles: string[]
    }>('/downloads/cleanup', options)
    return response.data
  }

  // 导出下载记录 - 将下载历史导出为指定格式的文件
  static async exportDownloadHistory(format: 'json' | 'csv' | 'xlsx'): Promise<{
    url: string
    filename: string
    expires: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 800))

    const response = await httpClient.post<{
      url: string
      filename: string
      expires: string
    }>('/downloads/export', { format })
    return response.data
  }

  // 获取下载速度测试 - 测试用户的下载速度和网络连接质量
  static async testDownloadSpeed(): Promise<{
    speed: number
    latency: number
    server: string
    timestamp: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const response = await httpClient.get<{
      speed: number
      latency: number
      server: string
      timestamp: string
    }>('/downloads/speed-test')
    return response.data
  }

  // 获取下载队列状态 - 获取当前下载队列的运行状态和统计信息
  static async getQueueStatus(): Promise<{
    active: number
    waiting: number
    paused: number
    maxConcurrent: number
    totalBandwidth: number
    estimatedWaitTime: number
  }> {
    await new Promise(resolve => setTimeout(resolve, 200))

    const response = await httpClient.get<{
      active: number
      waiting: number
      paused: number
      maxConcurrent: number
      totalBandwidth: number
      estimatedWaitTime: number
    }>('/downloads/queue-status')
    return response.data
  }

  // 重新排序下载队列 - 调整下载任务的排队顺序
  static async reorderQueue(downloadIds: string[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))

    await httpClient.put<void>('/downloads/reorder', { downloadIds })
  }

  // 设置下载优先级 - 调整指定下载任务的优先级
  static async setPriority(
    downloadId: string,
    priority: 'low' | 'normal' | 'high'
  ): Promise<DownloadTask> {
    await new Promise(resolve => setTimeout(resolve, 200))

    const response = await httpClient.put<DownloadTask>(
      `/downloads/${downloadId}/priority`,
      {
        priority,
      }
    )
    return response.data
  }
}
