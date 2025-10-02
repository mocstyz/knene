import { DownloadStatus } from '../value-objects/DownloadStatus'
import { FileSize } from '../value-objects/FileSize'
import { DownloadSpeed } from '../value-objects/DownloadSpeed'

export interface DownloadTask {
  id: string
  userId: string
  movieId: string
  movieTitle: string
  quality: string
  format: string
  downloadUrl: string
  magnetLink?: string
  status: DownloadStatus
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

export class Download {
  constructor(
    public readonly task: DownloadTask,
    public readonly history?: DownloadHistory
  ) {}

  // 业务方法
  start(): Download {
    if (this.task.status !== DownloadStatus.PENDING && this.task.status !== DownloadStatus.PAUSED) {
      throw new Error('只能启动待下载或已暂停的任务')
    }

    const updatedTask = {
      ...this.task,
      status: DownloadStatus.DOWNLOADING,
      startedAt: this.task.startedAt || new Date(),
      pausedAt: undefined,
      updatedAt: new Date()
    }

    return new Download(updatedTask, this.history)
  }

  pause(): Download {
    if (this.task.status !== DownloadStatus.DOWNLOADING) {
      throw new Error('只能暂停正在下载的任务')
    }

    const updatedTask = {
      ...this.task,
      status: DownloadStatus.PAUSED,
      pausedAt: new Date(),
      updatedAt: new Date()
    }

    return new Download(updatedTask, this.history)
  }

  resume(): Download {
    if (this.task.status !== DownloadStatus.PAUSED) {
      throw new Error('只能恢复已暂停的任务')
    }

    const updatedTask = {
      ...this.task,
      status: DownloadStatus.DOWNLOADING,
      pausedAt: undefined,
      updatedAt: new Date()
    }

    return new Download(updatedTask, this.history)
  }

  cancel(): Download {
    if (this.task.status === DownloadStatus.COMPLETED) {
      throw new Error('不能取消已完成的任务')
    }

    const updatedTask = {
      ...this.task,
      status: DownloadStatus.CANCELLED,
      updatedAt: new Date()
    }

    return new Download(updatedTask, this.history)
  }

  updateProgress(
    downloadedSize: FileSize,
    speed: DownloadSpeed,
    estimatedTimeRemaining?: number
  ): Download {
    if (this.task.status !== DownloadStatus.DOWNLOADING) {
      return this
    }

    const progress = Math.min(100, (downloadedSize.bytes / this.task.totalSize.bytes) * 100)

    const updatedTask = {
      ...this.task,
      progress: Math.round(progress * 100) / 100,
      downloadedSize,
      speed,
      estimatedTimeRemaining,
      updatedAt: new Date()
    }

    return new Download(updatedTask, this.history)
  }

  complete(downloadPath: string): Download {
    if (this.task.status !== DownloadStatus.DOWNLOADING) {
      throw new Error('只能完成正在下载的任务')
    }

    const completedAt = new Date()
    const downloadDuration = this.task.startedAt 
      ? completedAt.getTime() - this.task.startedAt.getTime()
      : 0

    const averageSpeed = downloadDuration > 0 
      ? new DownloadSpeed((this.task.totalSize.bytes / downloadDuration) * 1000)
      : new DownloadSpeed(0)

    const updatedTask = {
      ...this.task,
      status: DownloadStatus.COMPLETED,
      progress: 100,
      downloadedSize: this.task.totalSize,
      completedAt,
      updatedAt: new Date()
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
      averageSpeed
    }

    return new Download(updatedTask, history)
  }

  fail(errorMessage: string): Download {
    const updatedTask = {
      ...this.task,
      status: DownloadStatus.FAILED,
      errorMessage,
      retryCount: this.task.retryCount + 1,
      updatedAt: new Date()
    }

    return new Download(updatedTask, this.history)
  }

  retry(): Download {
    if (this.task.status !== DownloadStatus.FAILED) {
      throw new Error('只能重试失败的任务')
    }

    if (this.task.retryCount >= this.task.maxRetries) {
      throw new Error('已达到最大重试次数')
    }

    const updatedTask = {
      ...this.task,
      status: DownloadStatus.PENDING,
      errorMessage: undefined,
      updatedAt: new Date()
    }

    return new Download(updatedTask, this.history)
  }

  setPriority(priority: number): Download {
    const updatedTask = {
      ...this.task,
      priority: Math.max(0, Math.min(10, priority)),
      updatedAt: new Date()
    }

    return new Download(updatedTask, this.history)
  }

  // 查询方法
  isActive(): boolean {
    return this.task.status === DownloadStatus.DOWNLOADING || 
           this.task.status === DownloadStatus.PENDING
  }

  canRetry(): boolean {
    return this.task.status === DownloadStatus.FAILED && 
           this.task.retryCount < this.task.maxRetries
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
      status: DownloadStatus.PENDING,
      progress: 0,
      downloadedSize: new FileSize(0),
      totalSize,
      speed: new DownloadSpeed(0),
      retryCount: 0,
      maxRetries: 3,
      priority,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return new Download(task)
  }
}