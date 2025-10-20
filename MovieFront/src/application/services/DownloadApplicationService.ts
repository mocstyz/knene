/**
 * @fileoverview 下载应用服务
 * @description 协调下载相关业务流程，编排权限校验、配额检查、调度与事件记录
 * @created 2025-10-09 13:10:49
 * @updated 2025-10-19 12:55:27
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */
import { Download, DownloadTask } from '@domain/entities/Download'
import { DownloadScheduler } from '@domain/services/DownloadScheduler'
import { DownloadSpeed } from '@domain/value-objects/DownloadSpeed'
import { DownloadStatusValue } from '@domain/value-objects/DownloadStatus'
import { FileSize } from '@domain/value-objects/FileSize'

// Store types
type StoreUser = import('@application/stores/userStore').User
type StoreMovie = import('@application/stores/movieStore').Movie

// 下载应用服务类，协调下载相关业务流程，编排权限校验、配额检查、调度与事件记录
export class DownloadApplicationService {
  // 创建下载任务的完整流程，包含权限验证、配额检查、重复检查等步骤
  static async createDownloadTask(params: {
    userId: string
    movieId: string
    quality: string
    format: string
    priority?: 'low' | 'normal' | 'high' // 下载优先级，影响调度顺序
  }): Promise<{
    download: Download | null
    requiresLogin: boolean
    message: string
  }> {
    try {
      // 权限验证 - 检查用户登录状态和下载权限
      const authResult = await this.validateDownloadPermission(params.userId)

      if (!authResult.allowed) {
        return {
          download: null,
          requiresLogin: true,
          message: authResult.message || '请先登录后再下载',
        }
      }

      // 配额检查 - 验证用户下载配额和系统资源
      const quotaResult = await this.checkDownloadQuota(params.userId)

      if (!quotaResult.allowed) {
        return {
          download: null,
          requiresLogin: false,
          message: quotaResult.message || '下载配额已用完，请升级套餐',
        }
      }

      // 重复检查 - 避免相同内容的重复下载任务
      const existingDownload = await this.findExistingDownload(params)
      if (existingDownload) {
        return {
          download: existingDownload,
          requiresLogin: false,
          message: '该影片已在下载队列中',
        }
      }

      // 创建下载实体 - 根据参数创建领域下载对象
      const download = await this.createDownloadEntity(params)

      // 加入调度队列 - 将下载任务添加到调度器等待执行
      await DownloadScheduler.addToQueue(download)

      // 更新统计信息 - 记录用户下载行为数据
      await this.updateDownloadStats(params.userId, 'created')

      // 记录业务事件 - 用于审计和分析
      await this.recordDownloadEvent('download_created', {
        userId: params.userId,
        movieId: params.movieId,
        quality: params.quality,
      })

      return {
        download,
        requiresLogin: false,
        message: '下载任务已创建，即将开始下载',
      }
    } catch (error) {
      console.error('创建下载任务失败:', error)
      throw error
    }
  }

  // 暂停正在进行的下载任务，包含权限验证和状态检查
  static async pauseDownload(
    downloadId: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // 权限和存在性验证 - 确保下载任务存在且用户有权限操作
      const download = await this.getDownloadById(downloadId)
      if (!download) {
        throw new Error('下载任务不存在')
      }

      if (download.detail.userId !== userId) {
        throw new Error('无权限操作此下载任务')
      }

      // 状态检查 - 只有正在下载的任务才能暂停
      if (download.detail.status !== 'downloading') {
        return {
          success: false,
          message: '只能暂停正在下载的任务',
        }
      }

      // 调度器操作 - 通知调度器暂停实际的下载进程
      await DownloadScheduler.pauseDownload(downloadId)

      // 状态更新 - 更新领域对象状态并持久化
      const pausedDownload = download.pause()
      await this.saveDownload(pausedDownload)

      // 业务事件记录 - 记录暂停操作用于审计
      await this.recordDownloadEvent('download_paused', {
        downloadId,
        userId,
      })

      return {
        success: true,
        message: '下载已暂停',
      }
    } catch (error) {
      console.error('暂停下载失败:', error)
      throw error
    }
  }

  // 恢复已暂停的下载任务，包含权限验证和状态检查
  static async resumeDownload(
    downloadId: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // 1. 验证用户权限
      const download = await this.getDownloadById(downloadId)
      if (!download) {
        throw new Error('下载任务不存在')
      }

      if (download.detail.userId !== userId) {
        throw new Error('无权限操作此下载任务')
      }

      // 2. 检查下载状态
      if (download.detail.status !== 'paused') {
        return {
          success: false,
          message: '只能恢复已暂停的任务',
        }
      }

      // 3. 恢复下载
      await DownloadScheduler.resumeDownload(downloadId)

      // 4. 更新下载状态
      const resumedDownload = download.resume()
      await this.saveDownload(resumedDownload)

      // 5. 记录事件
      await this.recordDownloadEvent('download_resumed', {
        downloadId,
        userId,
      })

      return {
        success: true,
        message: '下载已恢复',
      }
    } catch (error) {
      console.error('恢复下载失败:', error)
      throw error
    }
  }

  // 取消下载任务，清理临时文件并更新用户统计
  static async cancelDownload(
    downloadId: string,
    userId: string,
    reason?: string // 取消原因，用于日志记录和用户通知
  ): Promise<{ success: boolean; message: string }> {
    try {
      // 1. 验证用户权限
      const download = await this.getDownloadById(downloadId)
      if (!download) {
        throw new Error('下载任务不存在')
      }

      if (download.detail.userId !== userId) {
        throw new Error('无权限操作此下载任务')
      }

      // 2. 检查下载状态
      if (download.detail.status === 'completed') {
        return {
          success: false,
          message: '无法取消已完成的下载',
        }
      }

      // 3. 从调度队列移除
      await DownloadScheduler.removeFromQueue(downloadId)

      // 4. 取消下载
      const canceledDownload = download.cancel()
      await DownloadApplicationService.saveDownload(canceledDownload)

      // 5. 清理临时文件
      await this.cleanupDownloadFiles(downloadId)

      // 6. 更新用户下载统计
      await this.updateDownloadStats(userId, 'canceled')

      // 7. 记录事件
      await this.recordDownloadEvent('download_canceled', {
        downloadId,
        userId,
        reason,
      })

      return {
        success: true,
        message: '下载已取消',
      }
    } catch (error) {
      console.error('取消下载失败:', error)
      throw error
    }
  }

  // 获取用户下载历史记录，支持过滤和分页，包含统计数据
  static async getUserDownloadHistory(
    userId: string,
    filters?: {
      status?: string
      dateRange?: { start: Date; end: Date } // 日期范围筛选
      limit?: number // 返回记录数限制
      offset?: number // 分页偏移量
    }
  ): Promise<{
    downloads: Download[]
    total: number
    stats: {
      totalDownloads: number
      completedDownloads: number
      totalSize: number
      averageSpeed: number
    }
  }> {
    try {
      // 1. 获取用户下载列表
      const allDownloads = await this.getUserDownloads(userId)

      // 2. 应用过滤条件
      let filteredDownloads = allDownloads

      if (filters?.status) {
        filteredDownloads = filteredDownloads.filter(
          d => d.detail.status === filters.status
        )
      }

      if (filters?.dateRange) {
        filteredDownloads = filteredDownloads.filter(d => {
          const downloadDate = new Date(d.detail.createdAt)
          return (
            downloadDate >= filters.dateRange!.start &&
            downloadDate <= filters.dateRange!.end
          )
        })
      }

      // 3. 分页处理
      const total = filteredDownloads.length
      const limit = filters?.limit || 20
      const offset = filters?.offset || 0

      const paginatedDownloads = filteredDownloads
        .sort(
          (a, b) =>
            new Date(b.detail.createdAt).getTime() -
            new Date(a.detail.createdAt).getTime()
        )
        .slice(offset, offset + limit)

      // 4. 计算统计数据
      const stats = this.calculateDownloadStats(allDownloads)

      return {
        downloads: paginatedDownloads,
        total,
        stats,
      }
    } catch (error) {
      console.error('获取下载历史失败:', error)
      throw error
    }
  }

  // 批量操作下载任务，支持暂停、恢复、取消、重试等操作
  static async batchDownloadOperation(params: {
    userId: string
    downloadIds: string[] // 要批量操作的下载任务ID列表
    operation: 'pause' | 'resume' | 'cancel' | 'retry' // 批量操作类型
  }): Promise<{
    successful: string[]
    failed: { downloadId: string; error: string }[]
    message: string
  }> {
    try {
      // 初始化批量操作结果容器
      const results = {
        successful: [] as string[],
        failed: [] as { downloadId: string; error: string }[],
      }

      // 逐个处理下载任务 - 确保单个任务失败不影响其他任务
      for (const downloadId of params.downloadIds) {
        try {
          // 根据操作类型执行相应的方法调用
          switch (params.operation) {
            case 'pause':
              await this.pauseDownload(downloadId, params.userId)
              break
            case 'resume':
              await this.resumeDownload(downloadId, params.userId)
              break
            case 'cancel':
              await this.cancelDownload(downloadId, params.userId)
              break
            case 'retry':
              await this.retryDownload(downloadId)
              break
          }
          // 记录成功的操作
          results.successful.push(downloadId)
        } catch (error) {
          // 记录失败的操作，继续处理其他任务
          results.failed.push({
            downloadId,
            error: error instanceof Error ? error.message : '未知错误',
          })
        }
      }

      // 返回批量操作结果汇总
      return {
        ...results,
        message: `批量操作完成：成功 ${results.successful.length} 个，失败 ${results.failed.length} 个`,
      }
    } catch (error) {
      console.error('批量操作失败:', error)
      throw error
    }
  }

  // 私有辅助方法
  private static async validateDownloadPermission(userId: string): Promise<{
    allowed: boolean
    message?: string
  }> {
    // 检查用户是否已登录
    if (!userId) {
      return { allowed: false, message: '请先登录' }
    }

    // 检查用户账户状态
    const user = await this.getUserById(userId)
    if (!user || user.status !== 'active') {
      return { allowed: false, message: '账户已被禁用' }
    }

    // 检查用户订阅状态
    if (
      user.subscription?.type === 'free' &&
      (await this.getTodayDownloadCount(userId)) >= 5
    ) {
      return { allowed: false, message: '基础用户每日下载限制为5个' }
    }

    return { allowed: true }
  }

  private static async checkDownloadQuota(userId: string): Promise<{
    allowed: boolean
    message?: string
  }> {
    const user = await this.getUserById(userId)
    if (!user) {
      return { allowed: false, message: '用户不存在' }
    }

    // 检查磁盘空间
    const availableSpace = await this.getAvailableDiskSpace()
    if (availableSpace < 1024 * 1024 * 1024) {
      // 小于1GB
      return { allowed: false, message: '磁盘空间不足' }
    }

    return { allowed: true }
  }

  private static async findExistingDownload(params: {
    userId: string
    movieId: string
    quality: string
    format: string
  }): Promise<Download | null> {
    const userDownloads = await this.getUserDownloads(params.userId)
    return (
      userDownloads.find(
        d =>
          d.detail.movieId === params.movieId &&
          d.detail.quality === params.quality &&
          d.detail.format === params.format &&
          ['pending', 'downloading', 'paused'].includes(d.detail.status)
      ) || null
    )
  }

  private static async createDownloadEntity(params: {
    userId: string
    movieId: string
    quality: string
    format: string
    priority?: 'low' | 'normal' | 'high'
  }): Promise<Download> {
    const movie = await this.getMovieById(params.movieId)
    if (!movie) {
      throw new Error('电影不存在')
    }

    // 检查请求的质量格式是否在电影的质量列表中
    const qualityString = `${params.quality}_${params.format}`
    const hasQuality = movie.qualities?.includes(qualityString)

    if (!hasQuality) {
      throw new Error('所选质量格式不可用')
    }

    const priorityMap = { low: 3, normal: 5, high: 8 }

    return Download.create(
      `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      params.userId,
      params.movieId,
      movie.title,
      params.quality,
      params.format,
      `https://example.com/download/${params.movieId}/${qualityString}`, // 模拟下载链接
      new FileSize(1024 * 1024 * 1024), // 模拟1GB大小
      undefined, // magnetLink
      priorityMap[params.priority || 'normal']
    )
  }

  private static async updateDownloadStats(
    userId: string,
    action: string
  ): Promise<void> {
    // 更新用户下载统计
    console.log(`更新下载统计: ${userId} - ${action}`)
  }

  private static async recordDownloadEvent(
    event: string,
    metadata: Record<string, unknown>
  ): Promise<void> {
    // 记录下载事件
    console.log(`记录下载事件: ${event}`, metadata)
  }

  private static async getDownloadById(
    downloadId: string
  ): Promise<Download | null> {
    // 从仓储获取下载
    const { useDownloadStore } = await import(
      '@application/stores/downloadStore'
    )
    const downloads = useDownloadStore.getState().downloads
    const downloadTask = downloads.find(d => d.id === downloadId)

    if (!downloadTask) return null

    // 转换 DownloadTask 到 Domain Download
    return this.convertTaskToDownload(downloadTask)
  }

  private static async saveDownload(download: Download): Promise<void> {
    // 保存下载到仓储 - 这里模拟保存操作
    console.log(`保存下载任务: ${download.detail.movieTitle}`)
    // 在实际实现中，这里会调用API将下载保存到数据库
  }

  private static async cleanupDownloadFiles(downloadId: string): Promise<void> {
    // 清理下载相关文件
    console.log(`清理下载文件: ${downloadId}`)
  }

  private static async getUserDownloads(userId: string): Promise<Download[]> {
    const { useDownloadStore } = await import(
      '@application/stores/downloadStore'
    )
    const storeDownloads = useDownloadStore.getState().downloads
    return storeDownloads
      .filter(d => d.userId === userId)
      .map(d => this.convertStoreDownloadToDomain(d))
  }

  private static calculateDownloadStats(downloads: Download[]): {
    totalDownloads: number
    completedDownloads: number
    totalSize: number
    averageSpeed: number
  } {
    const totalDownloads = downloads.length
    const completedDownloads = downloads.filter(
      d => d.detail.status === 'completed'
    ).length
    const totalSize = downloads.reduce(
      (sum, d) => sum + (d.detail.fileSize || 0),
      0
    )
    const averageSpeed =
      downloads.length > 0
        ? downloads.reduce((sum, d) => sum + (d.detail.speed?.value || 0), 0) /
          downloads.length
        : 0

    return {
      totalDownloads,
      completedDownloads,
      totalSize,
      averageSpeed,
    }
  }

  private static async retryDownload(downloadId: string): Promise<void> {
    const download = await this.getDownloadById(downloadId)
    if (!download) {
      throw new Error('下载任务不存在')
    }

    const retriedDownload = download.retry()
    await this.saveDownload(retriedDownload)
    await DownloadScheduler.addToQueue(retriedDownload)
  }

  private static async getUserById(_userId: string): Promise<StoreUser | null> {
    // 这里应该通过TanStack Query获取用户数据
    // 暂时返回null，表示用户数据需要从服务端状态获取
    return null
  }

  private static async getMovieById(
    _movieId: string
  ): Promise<StoreMovie | undefined> {
    // 这里应该通过TanStack Query获取影片数据
    // 暂时返回undefined，表示影片数据需要从服务端状态获取
    return undefined
  }

  private static async getTodayDownloadCount(userId: string): Promise<number> {
    // 获取用户今日下载次数
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const userDownloads = await this.getUserDownloads(userId)
    return userDownloads.filter(d => new Date(d.detail.createdAt) >= today)
      .length
  }

  private static async getAvailableDiskSpace(): Promise<number> {
    // 获取可用磁盘空间（字节）
    // 这里应该调用系统API获取，暂时返回模拟值
    return 50 * 1024 * 1024 * 1024 // 50GB
  }

  private static convertTaskToDownload(task: unknown): Download {
    // 数据转换 - 将store中的DownloadTask转换为Domain层的Download对象
    const taskData = task as Record<string, unknown>
    const domainTask: DownloadTask = {
      id: taskData.id as string,
      userId: taskData.userId as string,
      movieId: taskData.movieId as string,
      movieTitle: taskData.movieTitle as string,
      quality: taskData.quality as string,
      format: taskData.format as string,
      downloadUrl: taskData.downloadUrl as string,
      magnetLink: taskData.magnetLink as string | undefined,
      status: this.convertStatusToDomain(taskData.status as string), // 状态枚举转换
      progress: taskData.progress as number,
      downloadedSize: new FileSize(taskData.downloadedSize as number), // 封装为值对象
      totalSize: new FileSize(taskData.totalSize as number), // 封装为值对象
      speed: new DownloadSpeed(taskData.speed as number), // 封装为值对象
      estimatedTimeRemaining: taskData.estimatedTimeRemaining as number,
      startedAt: taskData.startedAt as Date,
      completedAt: taskData.completedAt as Date | undefined,
      pausedAt: taskData.pausedAt as Date | undefined,
      errorMessage: taskData.errorMessage as string | undefined,
      retryCount: taskData.retryCount as number,
      maxRetries: taskData.maxRetries as number,
      priority: taskData.priority as number,
      createdAt: taskData.createdAt as Date,
      updatedAt: taskData.updatedAt as Date,
    }

    // 创建领域对象 - 封装业务逻辑和状态
    return new Download(domainTask)
  }

  private static convertStoreDownloadToDomain(
    storeDownload: unknown
  ): Download {
    // 将 Store Download 转换为 Domain Download
    const downloadData = storeDownload as Record<string, unknown>
    const domainTask: DownloadTask = {
      id: downloadData.id as string,
      userId: downloadData.userId as string,
      movieId: downloadData.movieId as string,
      movieTitle: downloadData.movieTitle as string,
      quality: downloadData.quality as string,
      format: downloadData.format as string,
      downloadUrl: downloadData.downloadUrl as string,
      magnetLink: downloadData.magnetLink as string | undefined,
      status: this.convertStatusToDomain(downloadData.status as string),
      progress: downloadData.progress as number,
      downloadedSize: new FileSize(downloadData.downloadedSize as number),
      totalSize: new FileSize(downloadData.totalSize as number),
      speed: new DownloadSpeed(downloadData.speed as number),
      estimatedTimeRemaining: downloadData.estimatedTimeRemaining as number,
      startedAt: downloadData.startedAt as Date,
      completedAt: downloadData.completedAt as Date | undefined,
      pausedAt: downloadData.pausedAt as Date | undefined,
      errorMessage: downloadData.errorMessage as string | undefined,
      retryCount: downloadData.retryCount as number,
      maxRetries: downloadData.maxRetries as number,
      priority: downloadData.priority as number,
      createdAt: downloadData.createdAt as Date,
      updatedAt: downloadData.updatedAt as Date,
    }

    return new Download(domainTask)
  }

  private static convertStatusToDomain(
    status: string | DownloadStatusValue
  ): DownloadStatusValue {
    // 如果已经是DownloadStatusValue，直接返回
    if (typeof status !== 'string') {
      return status
    }

    // 转换状态枚举
    switch (status) {
      case 'pending':
        return DownloadStatusValue.pending()
      case 'downloading':
        return DownloadStatusValue.downloading()
      case 'paused':
        return DownloadStatusValue.paused()
      case 'completed':
        return DownloadStatusValue.completed()
      case 'failed':
        return DownloadStatusValue.failed()
      case 'cancelled':
        return DownloadStatusValue.cancelled()
      default:
        return DownloadStatusValue.pending()
    }
  }
}
