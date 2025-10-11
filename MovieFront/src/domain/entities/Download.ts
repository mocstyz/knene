/**
 * @fileoverview 下载实体
 * @description 下载管理领域的核心实体，包含下载任务的完整信息和业务逻辑。
 * 实现了下载任务的完整生命周期管理，包括创建、开始、暂停、恢复、取消和完成等功能。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.2.0
 */

import { DownloadSpeed } from '@domain/value-objects/DownloadSpeed'
import { DownloadStatusValue } from '@domain/value-objects/DownloadStatus'
import { FileSize } from '@domain/value-objects/FileSize'

/**
 * 下载任务接口
 * 定义下载任务的完整信息
 */
export interface DownloadTask {
  id: string
  userId: string
  movieId: string
  movieTitle: string
  quality: string
  format: string
  downloadUrl: string
  magnetLink?: string
  status: DownloadStatusValue
  progress: number
  downloadedSize: FileSize
  totalSize: FileSize
  speed: DownloadSpeed
  estimatedTimeRemaining?: number
  startedAt?: Date
  completedAt?: Date
  pausedAt?: Date
  errorMessage?: string
  retryCount: number
  maxRetries: number
  priority: number
  createdAt: Date
  updatedAt: Date
}

/**
 * 下载历史接口
 * 定义已完成下载的历史记录信息
 */
export interface DownloadHistory {
  id: string
  userId: string
  movieId: string
  movieTitle: string
  quality: string
  format: string
  fileSize: FileSize
  downloadPath: string
  completedAt: Date
  downloadDuration: number
  averageSpeed: DownloadSpeed
}

/**
 * 下载实体类
 *
 * 聚合根：下载管理领域的核心实体，包含下载任务的完整信息和业务规则
 *
 * @param task 下载任务信息
 * @param history 下载历史记录（仅在下载完成时存在）
 */
export class Download {
  constructor(
    public readonly task: DownloadTask,
    public readonly history?: DownloadHistory
  ) {}

  /**
   * 兼容性属性 - 提供对任务数据的直接访问
   * @returns {Object} 下载详细信息的扁平化对象
   */
  get detail(): {
    id: string
    userId: string
    movieId: string
    movieTitle: string
    quality: string
    format: string
    fileSize: number
    downloadedSize: number
    downloadUrl: string
    savePath?: string
    status: string
    progress: number
    speed?: {
      value: number
      unit: string
    }
    estimatedTimeRemaining?: number
    startedAt?: Date
    completedAt?: Date
    pausedAt?: Date
    error?: string
    retryCount: number
    maxRetries: number
    priority: number
    createdAt: Date
    updatedAt: Date
  } {
    return {
      id: this.task.id,
      userId: this.task.userId,
      movieId: this.task.movieId,
      movieTitle: this.task.movieTitle,
      quality: this.task.quality,
      format: this.task.format,
      fileSize: this.task.totalSize.bytes,
      downloadedSize: this.task.downloadedSize.bytes,
      downloadUrl: this.task.downloadUrl,
      savePath: this.history?.downloadPath,
      status: this.task.status.status,
      progress: this.task.progress,
      speed:
        this.task.speed.bytesPerSecond > 0
          ? {
              value: this.task.speed.bytesPerSecond,
              unit: 'B/s',
            }
          : undefined,
      estimatedTimeRemaining: this.task.estimatedTimeRemaining,
      startedAt: this.task.startedAt,
      completedAt: this.task.completedAt,
      pausedAt: this.task.pausedAt,
      error: this.task.errorMessage,
      retryCount: this.task.retryCount,
      maxRetries: this.task.maxRetries,
      priority: this.task.priority,
      createdAt: this.task.createdAt,
      updatedAt: this.task.updatedAt,
    }
  }

  // ========== 业务方法 ==========

  /**
   * 开始下载任务
   * @returns {Download} 返回状态为下载中的新Download实例
   * @throws {Error} 如果任务状态不允许开始下载
   */
  start(): Download {
    if (!this.task.status.canStart()) {
      throw new Error('只能启动待下载或已暂停的任务')
    }

    const updatedTask = {
      ...this.task,
      status: DownloadStatusValue.downloading(),
      startedAt: this.task.startedAt || new Date(),
      pausedAt: undefined,
      updatedAt: new Date(),
    }

    return new Download(updatedTask, this.history)
  }

  /**
   * 暂停下载任务
   * @returns {Download} 返回状态为已暂停的新Download实例
   * @throws {Error} 如果任务不是正在下载状态
   */
  pause(): Download {
    if (this.task.status !== DownloadStatusValue.downloading()) {
      throw new Error('只能暂停正在下载的任务')
    }

    const updatedTask = {
      ...this.task,
      status: DownloadStatusValue.paused(),
      pausedAt: new Date(),
      updatedAt: new Date(),
    }

    return new Download(updatedTask, this.history)
  }

  /**
   * 恢复下载任务
   * @returns {Download} 返回状态为下载中的新Download实例
   * @throws {Error} 如果任务不是已暂停状态
   */
  resume(): Download {
    if (this.task.status !== DownloadStatusValue.paused()) {
      throw new Error('只能恢复已暂停的任务')
    }

    const updatedTask = {
      ...this.task,
      status: DownloadStatusValue.downloading(),
      pausedAt: undefined,
      updatedAt: new Date(),
    }

    return new Download(updatedTask, this.history)
  }

  /**
   * 取消下载任务
   * @returns {Download} 返回状态为已取消的新Download实例
   * @throws {Error} 如果任务已经完成
   */
  cancel(): Download {
    if (this.task.status === DownloadStatusValue.completed()) {
      throw new Error('不能取消已完成的任务')
    }

    const updatedTask = {
      ...this.task,
      status: DownloadStatusValue.cancelled(),
      updatedAt: new Date(),
    }

    return new Download(updatedTask, this.history)
  }

  updateProgress(
    downloadedSize: FileSize,
    speed: DownloadSpeed,
    estimatedTimeRemaining?: number
  ): Download {
    if (this.task.status !== DownloadStatusValue.downloading()) {
      return this
    }

    const progress = Math.min(
      100,
      (downloadedSize.bytes / this.task.totalSize.bytes) * 100
    )

    const updatedTask = {
      ...this.task,
      progress: Math.round(progress * 100) / 100,
      downloadedSize,
      speed,
      estimatedTimeRemaining,
      updatedAt: new Date(),
    }

    return new Download(updatedTask, this.history)
  }

  complete(downloadPath: string): Download {
    if (this.task.status !== DownloadStatusValue.downloading()) {
      throw new Error('只能完成正在下载的任务')
    }

    const completedAt = new Date()
    const downloadDuration = this.task.startedAt
      ? completedAt.getTime() - this.task.startedAt.getTime()
      : 0

    const averageSpeed =
      downloadDuration > 0
        ? new DownloadSpeed(
            (this.task.totalSize.bytes / downloadDuration) * 1000
          )
        : new DownloadSpeed(0)

    const updatedTask = {
      ...this.task,
      status: DownloadStatusValue.completed(),
      progress: 100,
      downloadedSize: this.task.totalSize,
      completedAt,
      updatedAt: new Date(),
    }

    const history: DownloadHistory = {
      id: this.task.id,
      userId: this.task.userId,
      movieId: this.task.movieId,
      movieTitle: this.task.movieTitle,
      quality: this.task.quality,
      format: this.task.format,
      fileSize: this.task.totalSize,
      downloadPath,
      completedAt,
      downloadDuration,
      averageSpeed,
    }

    return new Download(updatedTask, history)
  }

  fail(errorMessage: string): Download {
    const updatedTask = {
      ...this.task,
      status: DownloadStatusValue.failed(),
      errorMessage,
      retryCount: this.task.retryCount + 1,
      updatedAt: new Date(),
    }

    return new Download(updatedTask, this.history)
  }

  retry(): Download {
    if (this.task.status !== DownloadStatusValue.failed()) {
      throw new Error('只能重试失败的任务')
    }

    if (this.task.retryCount >= this.task.maxRetries) {
      throw new Error('已达到最大重试次数')
    }

    const updatedTask = {
      ...this.task,
      status: DownloadStatusValue.pending(),
      errorMessage: undefined,
      updatedAt: new Date(),
    }

    return new Download(updatedTask, this.history)
  }

  setPriority(priority: number): Download {
    const updatedTask = {
      ...this.task,
      priority: Math.max(0, Math.min(10, priority)),
      updatedAt: new Date(),
    }

    return new Download(updatedTask, this.history)
  }

  // 查询方法
  isActive(): boolean {
    return (
      this.task.status === DownloadStatusValue.downloading() ||
      this.task.status === DownloadStatusValue.pending()
    )
  }

  canRetry(): boolean {
    return (
      this.task.status === DownloadStatusValue.failed() &&
      this.task.retryCount < this.task.maxRetries
    )
  }

  getProgressPercentage(): number {
    return this.task.progress
  }

  getEstimatedTimeRemaining(): string {
    if (!this.task.estimatedTimeRemaining) return '未知'

    const seconds = Math.floor(this.task.estimatedTimeRemaining / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}小时${minutes % 60}分钟`
    } else if (minutes > 0) {
      return `${minutes}分钟${seconds % 60}秒`
    } else {
      return `${seconds}秒`
    }
  }

  // 静态工厂方法
  static create(
    id: string,
    userId: string,
    movieId: string,
    movieTitle: string,
    quality: string,
    format: string,
    downloadUrl: string,
    totalSize: FileSize,
    magnetLink?: string,
    priority: number = 5
  ): Download {
    const task: DownloadTask = {
      id,
      userId,
      movieId,
      movieTitle,
      quality,
      format,
      downloadUrl,
      magnetLink,
      status: DownloadStatusValue.pending(),
      progress: 0,
      downloadedSize: new FileSize(0),
      totalSize,
      speed: new DownloadSpeed(0),
      retryCount: 0,
      maxRetries: 3,
      priority,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return new Download(task)
  }
}
