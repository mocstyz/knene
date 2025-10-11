/**
 * @fileoverview 下载状态值对象
 * @description 下载管理领域的下载状态值对象，定义下载任务的所有可能状态和状态转换规则。
 * 提供状态验证、显示文本和样式等UI相关功能，确保下载状态的一致性和可追溯性。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.2.0
 */

/**
 * 下载状态枚举
 * 定义下载任务的所有可能状态
 */
export enum DownloadStatus {
  PENDING = 'pending', // 等待下载
  DOWNLOADING = 'downloading', // 正在下载
  PAUSED = 'paused', // 已暂停
  COMPLETED = 'completed', // 下载完成
  FAILED = 'failed', // 下载失败
  CANCELLED = 'cancelled', // 已取消
}

/**
 * 下载状态值对象类
 *
 * 值对象：表示下载任务的状态，包含状态转换逻辑和UI展示功能
 */
export class DownloadStatusValue {
  constructor(private readonly _status: DownloadStatus) {}

  /**
   * 获取状态枚举值
   * @returns {DownloadStatus} 返回下载状态枚举
   */
  get status(): DownloadStatus {
    return this._status
  }

  /**
   * 比较两个下载状态是否相等
   * @param other 要比较的另一个下载状态值对象
   * @returns {boolean} 如果状态相同则返回true
   */
  equals(other: DownloadStatusValue): boolean {
    return this._status === other._status
  }

  /**
   * 检查状态是否为活跃状态
   * @returns {boolean} 如果是等待下载或正在下载状态则返回true
   */
  isActive(): boolean {
    return (
      this._status === DownloadStatus.DOWNLOADING ||
      this._status === DownloadStatus.PENDING
    )
  }

  /**
   * 检查状态是否为已完成状态
   * @returns {boolean} 如果下载已完成则返回true
   */
  isCompleted(): boolean {
    return this._status === DownloadStatus.COMPLETED
  }

  /**
   * 检查状态是否为失败状态
   * @returns {boolean} 如果下载失败则返回true
   */
  isFailed(): boolean {
    return this._status === DownloadStatus.FAILED
  }

  /**
   * 检查是否可以开始下载
   * @returns {boolean} 如果可以开始下载则返回true
   */
  canStart(): boolean {
    return (
      this._status === DownloadStatus.PENDING ||
      this._status === DownloadStatus.PAUSED
    )
  }

  /**
   * 检查是否可以暂停下载
   * @returns {boolean} 如果可以暂停下载则返回true
   */
  canPause(): boolean {
    return this._status === DownloadStatus.DOWNLOADING
  }

  /**
   * 检查是否可以恢复下载
   * @returns {boolean} 如果可以恢复下载则返回true
   */
  canResume(): boolean {
    return this._status === DownloadStatus.PAUSED
  }

  /**
   * 检查是否可以取消下载
   * @returns {boolean} 如果可以取消下载则返回true
   */
  canCancel(): boolean {
    return this._status !== DownloadStatus.COMPLETED
  }

  /**
   * 检查是否可以重试下载
   * @returns {boolean} 如果可以重试下载则返回true
   */
  canRetry(): boolean {
    return this._status === DownloadStatus.FAILED
  }

  /**
   * 获取状态的显示文本
   * @returns {string} 返回状态的中文显示文本
   */
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

  /**
   * 获取状态对应的CSS颜色类
   * @returns {string} 返回状态对应的Tailwind CSS颜色类
   */
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

  /**
   * 转换为字符串表示
   * @returns {string} 返回状态字符串值
   */
  toString(): string {
    return this._status
  }

  // ========== 静态工厂方法 ==========

  /**
   * 创建等待下载状态
   * @returns {DownloadStatusValue} 返回等待下载状态实例
   */
  static pending(): DownloadStatusValue {
    return new DownloadStatusValue(DownloadStatus.PENDING)
  }

  /**
   * 创建正在下载状态
   * @returns {DownloadStatusValue} 返回正在下载状态实例
   */
  static downloading(): DownloadStatusValue {
    return new DownloadStatusValue(DownloadStatus.DOWNLOADING)
  }

  /**
   * 创建已暂停状态
   * @returns {DownloadStatusValue} 返回已暂停状态实例
   */
  static paused(): DownloadStatusValue {
    return new DownloadStatusValue(DownloadStatus.PAUSED)
  }

  /**
   * 创建下载完成状态
   * @returns {DownloadStatusValue} 返回下载完成状态实例
   */
  static completed(): DownloadStatusValue {
    return new DownloadStatusValue(DownloadStatus.COMPLETED)
  }

  /**
   * 创建下载失败状态
   * @returns {DownloadStatusValue} 返回下载失败状态实例
   */
  static failed(): DownloadStatusValue {
    return new DownloadStatusValue(DownloadStatus.FAILED)
  }

  /**
   * 创建已取消状态
   * @returns {DownloadStatusValue} 返回已取消状态实例
   */
  static cancelled(): DownloadStatusValue {
    return new DownloadStatusValue(DownloadStatus.CANCELLED)
  }
}
