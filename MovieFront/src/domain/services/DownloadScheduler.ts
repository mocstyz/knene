/**
 * @fileoverview 下载调度领域服务
 * @description 下载管理领域的核心服务，处理下载任务的调度、优先级管理和资源分配。
 * 负责下载队列管理、并发控制、重试机制和下载统计等核心业务逻辑。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.2.0
 */

import { Download, DownloadTask } from '@domain/entities/Download'
import { DownloadStatus } from '@domain/value-objects/DownloadStatus'

/**
 * 下载调度领域服务
 *
 * 领域服务：处理下载任务的调度、优先级管理和资源分配
 */
export class DownloadScheduler {
  /** 最大并发下载数 */
  private static readonly MAX_CONCURRENT_DOWNLOADS = 3
  /** 重试延迟时间（毫秒） */
  private static readonly RETRY_DELAYS = [1000, 3000, 5000, 10000]

  /**
   * 检查是否可以开始新的下载
   * @param activeDownloads 当前活跃的下载任务列表
   * @returns {boolean} 如果可以开始新下载则返回true
   */
  static canStartDownload(activeDownloads: DownloadTask[]): boolean {
    const runningCount = activeDownloads.filter(
      task =>
        task.status.status === DownloadStatus.DOWNLOADING ||
        task.status.status === DownloadStatus.PENDING
    ).length

    return runningCount < this.MAX_CONCURRENT_DOWNLOADS
  }

  /**
   * 获取下一个待下载任务
   * @param downloads 下载任务列表
   * @returns {DownloadTask|null} 返回优先级最高的待下载任务，如果没有则返回null
   */
  static getNextDownloadTask(downloads: DownloadTask[]): DownloadTask | null {
    // 按优先级和创建时间排序
    const pendingTasks = downloads
      .filter(task => task.status.status === DownloadStatus.PENDING)
      .sort((a, b) => {
        // 优先级高的先下载
        if (a.priority !== b.priority) {
          return (
            this.getPriorityValue(b.priority) -
            this.getPriorityValue(a.priority)
          )
        }
        // 相同优先级按创建时间排序
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })

    return pendingTasks[0] || null
  }

  /**
   * 获取优先级数值
   * @param priority 优先级值
   * @returns {number} 返回处理后的优先级数值，默认为5
   */
  private static getPriorityValue(priority: number): number {
    // priority是数字类型，直接返回
    return priority || 5 // 默认优先级为5
  }

  /**
   * 计算下载优先级
   * @param movieId 电影ID
   * @param userPreferences 用户偏好设置（可选）
   * @param movieData 电影数据（可选）
   * @returns {number} 返回计算出的优先级（1-10）
   */
  static calculatePriority(
    movieId: string,
    userPreferences?: Record<string, unknown>,
    movieData?: Record<string, unknown>
  ): number {
    let score = 0

    // 用户收藏的影片优先级更高
    const favorites = userPreferences?.favorites as string[] | undefined
    if (favorites && Array.isArray(favorites) && favorites.includes(movieId)) {
      score += 20
    }

    // 高评分影片优先级更高
    const rating = movieData?.rating as number | undefined
    if (rating && rating >= 8.0) {
      score += 15
    } else if (rating && rating >= 7.0) {
      score += 10
    }

    // 新片优先级更高
    const currentYear = new Date().getFullYear()
    const year = movieData?.year as number | undefined
    if (year && year >= currentYear - 1) {
      score += 10
    }

    // 热门影片优先级更高
    const views = movieData?.views as number | undefined
    if (views && views > 10000) {
      score += 10
    }

    // 返回数字优先级，范围1-10
    return Math.min(10, Math.max(1, Math.ceil(score / 5)))
  }

  /**
   * 验证下载任务
   */
  static validateDownloadTask(task: Partial<DownloadTask>): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (!task.movieId) {
      errors.push('影片ID不能为空')
    }

    if (!task.quality) {
      errors.push('下载质量不能为空')
    } else if (!['SD', 'HD', '4K'].includes(task.quality)) {
      errors.push('下载质量格式不正确')
    }

    if (!task.movieTitle) {
      errors.push('电影标题不能为空')
    }

    if (!task.totalSize || task.totalSize.bytes <= 0) {
      errors.push('文件大小必须大于0')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * 计算预估下载时间
   */
  static estimateDownloadTime(fileSize: number, averageSpeed: number): number {
    if (averageSpeed <= 0) {
      return 0
    }

    // 预估时间（秒）= 文件大小（字节）/ 平均速度（字节/秒）
    return Math.ceil(fileSize / averageSpeed)
  }

  /**
   * 计算剩余时间
   */
  static calculateRemainingTime(
    fileSize: number,
    downloadedSize: number,
    currentSpeed: number
  ): number {
    if (currentSpeed <= 0 || downloadedSize >= fileSize) {
      return 0
    }

    const remainingSize = fileSize - downloadedSize
    return Math.ceil(remainingSize / currentSpeed)
  }

  /**
   * 格式化时间
   */

  /**
   * 检查存储空间
   */
  static checkStorageSpace(
    requiredSpace: number
  ): Promise<{ hasSpace: boolean; availableSpace: number }> {
    return new Promise(resolve => {
      // 模拟检查存储空间
      setTimeout(() => {
        const availableSpace = 50 * 1024 * 1024 * 1024 // 模拟50GB可用空间
        resolve({
          hasSpace: availableSpace >= requiredSpace,
          availableSpace,
        })
      }, 100)
    })
  }

  /**
   * 获取重试延迟时间
   */
  static getRetryDelay(retryCount: number): number {
    const index = Math.min(retryCount, this.RETRY_DELAYS.length - 1)
    return this.RETRY_DELAYS[index]
  }

  /**
   * 检查是否应该重试
   */
  static shouldRetry(task: DownloadTask, maxRetries: number = 3): boolean {
    return (
      task.retryCount < maxRetries &&
      task.status.status === DownloadStatus.FAILED
    )
  }

  /**
   * 生成下载URL
   */
  static generateDownloadUrl(movieId: string, quality: string): string {
    // 在实际应用中，这应该调用后端API获取真实的下载链接
    const baseUrl = 'https://api.moviesite.com/download'
    const timestamp = Date.now()
    const token = this.generateDownloadToken(movieId, quality, timestamp)

    return `${baseUrl}/${movieId}?quality=${quality}&token=${token}&ts=${timestamp}`
  }

  /**
   * 生成下载令牌
   */
  private static generateDownloadToken(
    movieId: string,
    quality: string,
    timestamp: number
  ): string {
    // 简单的令牌生成逻辑，实际应用中应该使用更安全的方法
    const data = `${movieId}_${quality}_${timestamp}`
    return btoa(data).replace(/[+/=]/g, '')
  }

  /**
   * 验证下载权限
   */
  static validateDownloadPermission(
    _movieId: string,
    quality: string,
    userPermissions: string[]
  ): { canDownload: boolean; reason?: string } {
    // 检查基本下载权限
    if (!userPermissions.includes('download_basic')) {
      return {
        canDownload: false,
        reason: '您没有下载权限，请升级账户',
      }
    }

    // 检查高清下载权限
    if (quality === 'HD' && !userPermissions.includes('download_hd')) {
      return {
        canDownload: false,
        reason: '您没有高清下载权限，请升级到高级会员',
      }
    }

    // 检查4K下载权限
    if (quality === '4K' && !userPermissions.includes('download_4k')) {
      return {
        canDownload: false,
        reason: '您没有4K下载权限，请升级到VIP会员',
      }
    }

    return { canDownload: true }
  }

  /**
   * 获取推荐的下载质量
   */
  static getRecommendedQuality(
    availableQualities: string[],
    _userPreferences: Record<string, unknown>,
    networkSpeed: number
  ): string {
    // 根据网络速度推荐质量
    if (networkSpeed < 1024 * 1024) {
      // < 1MB/s
      return availableQualities.includes('SD') ? 'SD' : availableQualities[0]
    } else if (networkSpeed < 5 * 1024 * 1024) {
      // < 5MB/s
      return availableQualities.includes('HD') ? 'HD' : availableQualities[0]
    } else {
      return availableQualities.includes('4K')
        ? '4K'
        : availableQualities.includes('HD')
          ? 'HD'
          : availableQualities[0]
    }
  }

  /**
   * 计算下载统计
   */
  static calculateDownloadStats(downloads: DownloadTask[]) {
    const stats = {
      total: downloads.length,
      completed: 0,
      failed: 0,
      downloading: 0,
      pending: 0,
      paused: 0,
      totalSize: 0,
      downloadedSize: 0,
      averageSpeed: 0,
    }

    let totalSpeed = 0
    let activeDownloads = 0

    downloads.forEach(download => {
      stats.totalSize += download.totalSize?.bytes || 0
      stats.downloadedSize +=
        ((download.totalSize?.bytes || 0) * download.progress) / 100

      switch (download.status.status) {
        case DownloadStatus.COMPLETED:
          stats.completed++
          break
        case DownloadStatus.FAILED:
          stats.failed++
          break
        case DownloadStatus.DOWNLOADING:
          stats.downloading++
          totalSpeed += download.speed.bytesPerSecond
          activeDownloads++
          break
        case DownloadStatus.PENDING:
          stats.pending++
          break
        case DownloadStatus.PAUSED:
          stats.paused++
          break
      }
    })

    stats.averageSpeed = activeDownloads > 0 ? totalSpeed / activeDownloads : 0

    return stats
  }

  // 添加缺失的静态方法
  static addToQueue(download: Download): Promise<void> {
    return new Promise(resolve => {
      // 模拟添加到队列
      console.log(`下载任务已添加到队列: ${download.detail.movieTitle}`)
      resolve()
    })
  }

  static pauseDownload(downloadId: string): Promise<void> {
    return new Promise(resolve => {
      // 模拟暂停下载
      console.log(`下载任务已暂停: ${downloadId}`)
      resolve()
    })
  }

  static resumeDownload(downloadId: string): Promise<void> {
    return new Promise(resolve => {
      // 模拟恢复下载
      console.log(`下载任务已恢复: ${downloadId}`)
      resolve()
    })
  }

  static removeFromQueue(downloadId: string): Promise<void> {
    return new Promise(resolve => {
      // 模拟从队列移除
      console.log(`下载任务已移除: ${downloadId}`)
      resolve()
    })
  }
}
