export enum DownloadStatus {
  PENDING = 'pending',
  DOWNLOADING = 'downloading',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export class DownloadStatusValue {
  constructor(private readonly _status: DownloadStatus) {}

  get status(): DownloadStatus {
    return this._status
  }

  equals(other: DownloadStatusValue): boolean {
    return this._status === other._status
  }

  isActive(): boolean {
    return this._status === DownloadStatus.DOWNLOADING || 
           this._status === DownloadStatus.PENDING
  }

  isCompleted(): boolean {
    return this._status === DownloadStatus.COMPLETED
  }

  isFailed(): boolean {
    return this._status === DownloadStatus.FAILED
  }

  canStart(): boolean {
    return this._status === DownloadStatus.PENDING || 
           this._status === DownloadStatus.PAUSED
  }

  canPause(): boolean {
    return this._status === DownloadStatus.DOWNLOADING
  }

  canResume(): boolean {
    return this._status === DownloadStatus.PAUSED
  }

  canCancel(): boolean {
    return this._status !== DownloadStatus.COMPLETED
  }

  canRetry(): boolean {
    return this._status === DownloadStatus.FAILED
  }

  getDisplayText(): string {
    switch (this._status) {
      case DownloadStatus.PENDING:
        return '等待下载'
      case DownloadStatus.DOWNLOADING:
        return '正在下载'
      case DownloadStatus.PAUSED:
        return '已暂停'
      case DownloadStatus.COMPLETED:
        return '下载完成'
      case DownloadStatus.FAILED:
        return '下载失败'
      case DownloadStatus.CANCELLED:
        return '已取消'
      default:
        return '未知状态'
    }
  }

  getColor(): string {
    switch (this._status) {
      case DownloadStatus.PENDING:
        return 'text-yellow-600'
      case DownloadStatus.DOWNLOADING:
        return 'text-blue-600'
      case DownloadStatus.PAUSED:
        return 'text-orange-600'
      case DownloadStatus.COMPLETED:
        return 'text-green-600'
      case DownloadStatus.FAILED:
        return 'text-red-600'
      case DownloadStatus.CANCELLED:
        return 'text-gray-600'
      default:
        return 'text-gray-400'
    }
  }

  toString(): string {
    return this._status
  }

  static pending(): DownloadStatusValue {
    return new DownloadStatusValue(DownloadStatus.PENDING)
  }

  static downloading(): DownloadStatusValue {
    return new DownloadStatusValue(DownloadStatus.DOWNLOADING)
  }

  static paused(): DownloadStatusValue {
    return new DownloadStatusValue(DownloadStatus.PAUSED)
  }

  static completed(): DownloadStatusValue {
    return new DownloadStatusValue(DownloadStatus.COMPLETED)
  }

  static failed(): DownloadStatusValue {
    return new DownloadStatusValue(DownloadStatus.FAILED)
  }

  static cancelled(): DownloadStatusValue {
    return new DownloadStatusValue(DownloadStatus.CANCELLED)
  }
}