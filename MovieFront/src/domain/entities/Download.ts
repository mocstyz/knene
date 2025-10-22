/**
 * @fileoverview 下载领域实体定义
 * @description 下载管理领域的核心实体，包含下载任务的完整信息和业务逻辑，实现下载任务的完整生命周期管理
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { DownloadSpeed } from '@domain/value-objects/DownloadSpeed'
import { DownloadStatusValue } from '@domain/value-objects/DownloadStatus'
import { FileSize } from '@domain/value-objects/FileSize'

// 下载任务接口，定义下载任务的完整信息结构
export interface DownloadTask {
  id: string // 任务唯一标识
  userId: string // 用户ID
  movieId: string // 影片ID
  movieTitle: string // 影片标题
  quality: string // 下载质量
  format: string // 文件格式
  downloadUrl: string // 下载URL
  magnetLink?: string // 磁力链接（可选）
  status: DownloadStatusValue // 下载状态值对象
  progress: number // 下载进度百分比
  downloadedSize: FileSize // 已下载文件大小
  totalSize: FileSize // 总文件大小
  speed: DownloadSpeed // 当前下载速度
  estimatedTimeRemaining?: number // 预估剩余时间（毫秒）
  startedAt?: Date // 开始下载时间
  completedAt?: Date // 完成下载时间
  pausedAt?: Date // 暂停时间
  errorMessage?: string // 错误信息
  retryCount: number // 当前重试次数
  maxRetries: number // 最大重试次数
  priority: number // 下载优先级（0-10）
  createdAt: Date // 创建时间
  updatedAt: Date // 更新时间
}

// 下载历史接口，定义已完成下载的历史记录信息
export interface DownloadHistory {
  id: string // 历史记录ID
  userId: string // 用户ID
  movieId: string // 影片ID
  movieTitle: string // 影片标题
  quality: string // 下载质量
  format: string // 文件格式
  fileSize: FileSize // 文件大小
  downloadPath: string // 下载保存路径
  completedAt: Date // 完成时间
  downloadDuration: number // 下载耗时（毫秒）
  averageSpeed: DownloadSpeed // 平均下载速度
}

// 下载领域实体类，聚合根：下载管理领域的核心实体，包含下载任务的完整信息和业务规则
export class Download {
  constructor(
    public readonly task: DownloadTask, // 下载任务信息
    public readonly history?: DownloadHistory // 下载历史记录（仅在下载完成时存在）
  ) {}

  // 兼容性属性访问器 - 提供下载详细信息的扁平化对象，保持与现有代码的兼容性
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

  // 开始下载任务 - 将状态设置为下载中并记录开始时间
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

  // 暂停下载任务 - 将状态设置为暂停并记录暂停时间
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

  // 取消下载任务 - 将状态设置为已取消，但不能取消已完成的任务
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

  // 更新下载进度 - 仅在下载状态下更新进度、速度和预估时间
  updateProgress(
    downloadedSize: FileSize,
    speed: DownloadSpeed,
    estimatedTimeRemaining?: number
  ): Download {
    if (this.task.status !== DownloadStatusValue.downloading()) {
      return this
    }

    // 计算下载进度百分比，保留两位小数
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

  // 完成下载任务 - 生成下载历史记录并更新任务状态
  complete(downloadPath: string): Download {
    if (this.task.status !== DownloadStatusValue.downloading()) {
      throw new Error('只能完成正在下载的任务')
    }

    const completedAt = new Date()
    // 计算下载耗时（毫秒）
    const downloadDuration = this.task.startedAt
      ? completedAt.getTime() - this.task.startedAt.getTime()
      : 0

    // 计算平均下载速度
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

    // 创建下载历史记录
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

  // 标记下载失败 - 记录错误信息并增加重试次数
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

  // 重试下载任务 - 检查重试次数限制并将状态设置为待下载
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

  // 设置下载优先级 - 限制优先级范围在0-10之间
  setPriority(priority: number): Download {
    const updatedTask = {
      ...this.task,
      priority: Math.max(0, Math.min(10, priority)),
      updatedAt: new Date(),
    }

    return new Download(updatedTask, this.history)
  }

  // 查询方法区域 - 提供下载任务状态的便捷查询接口
  isActive(): boolean {
    return (
      this.task.status === DownloadStatusValue.downloading() ||
      this.task.status === DownloadStatusValue.pending()
    )
  }

  // 检查是否可以重试 - 判断任务状态和重试次数
  canRetry(): boolean {
    return (
      this.task.status === DownloadStatusValue.failed() &&
      this.task.retryCount < this.task.maxRetries
    )
  }

  // 获取下载进度百分比
  getProgressPercentage(): number {
    return this.task.progress
  }

  // 格式化预估剩余时间 - 将毫秒转换为可读的时间格式
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
    priority: number = 5 // 默认中等优先级
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
      status: DownloadStatusValue.pending(), // 初始状态为待下载
      progress: 0, // 初始进度为0
      downloadedSize: new FileSize(0), // 初始已下载大小为0
      totalSize,
      speed: new DownloadSpeed(0), // 初始下载速度为0
      retryCount: 0, // 初始重试次数为0
      maxRetries: 3, // 默认最大重试次数为3
      priority,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return new Download(task)
  }
}
