/**
 * @fileoverview 下载速度值对象
 * @description 下载速度值对象，提供速度计算、格式转换、分类判断等功能，支持多种速度单位的转换和比较
 * @created 2025-10-09 13:10:49
 * @updated 2025-10-19 10:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 下载速度值对象，提供速度计算、格式转换、分类判断等功能
export class DownloadSpeed {
  private readonly _bytesPerSecond: number

  // 构造函数，初始化下载速度值对象
  constructor(bytesPerSecond: number) {
    if (bytesPerSecond < 0) {
      throw new Error('下载速度不能为负数')
    }
    this._bytesPerSecond = bytesPerSecond
  }

  get bytesPerSecond(): number {
    return this._bytesPerSecond
  }

  get kilobytesPerSecond(): number {
    return this._bytesPerSecond / 1024
  }

  get megabytesPerSecond(): number {
    return this._bytesPerSecond / (1024 * 1024)
  }

  get gigabytesPerSecond(): number {
    return this._bytesPerSecond / (1024 * 1024 * 1024)
  }

  // 比较两个下载速度是否相等
  equals(other: DownloadSpeed): boolean {
    return this._bytesPerSecond === other._bytesPerSecond
  }

  // 判断当前速度是否大于另一个速度
  isGreaterThan(other: DownloadSpeed): boolean {
    return this._bytesPerSecond > other._bytesPerSecond
  }

  // 判断当前速度是否小于另一个速度
  isLessThan(other: DownloadSpeed): boolean {
    return this._bytesPerSecond < other._bytesPerSecond
  }

  // 速度相加，返回新的速度对象
  add(other: DownloadSpeed): DownloadSpeed {
    return new DownloadSpeed(this._bytesPerSecond + other._bytesPerSecond)
  }

  // 速度乘以倍数，返回新的速度对象
  multiply(factor: number): DownloadSpeed {
    if (factor < 0) {
      throw new Error('乘数不能为负数')
    }
    return new DownloadSpeed(this._bytesPerSecond * factor)
  }

  // 计算预计完成时间，返回毫秒
  calculateETA(remainingBytes: number): number {
    if (this._bytesPerSecond === 0) return Infinity
    return (remainingBytes / this._bytesPerSecond) * 1000 // 返回毫秒
  }

  // 转换为人类可读的速度格式
  toHumanReadable(): string {
    if (this._bytesPerSecond === 0) return '0 B/s'

    const units = ['B/s', 'KB/s', 'MB/s', 'GB/s']
    let speed = this._bytesPerSecond
    let unitIndex = 0

    while (speed >= 1024 && unitIndex < units.length - 1) {
      speed /= 1024
      unitIndex++
    }

    const formattedSpeed =
      unitIndex === 0
        ? speed.toString()
        : speed.toFixed(2).replace(/\.?0+$/, '')

    return `${formattedSpeed} ${units[unitIndex]}`
  }

  // 获取速度分类等级
  getSpeedCategory(): 'slow' | 'medium' | 'fast' | 'very-fast' {
    const mbps = this.megabytesPerSecond

    if (mbps < 0.5) return 'slow'
    if (mbps < 2) return 'medium'
    if (mbps < 10) return 'fast'
    return 'very-fast'
  }

  // 获取速度对应的CSS颜色类名
  getSpeedColor(): string {
    const category = this.getSpeedCategory()

    switch (category) {
      case 'slow':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'fast':
        return 'text-blue-600'
      case 'very-fast':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  toString(): string {
    return this.toHumanReadable()
  }

  // 静态工厂方法
  // 从字节每秒创建速度对象
  static fromBytesPerSecond(bps: number): DownloadSpeed {
    return new DownloadSpeed(bps)
  }

  // 从千字节每秒创建速度对象
  static fromKilobytesPerSecond(kbps: number): DownloadSpeed {
    return new DownloadSpeed(kbps * 1024)
  }

  // 从兆字节每秒创建速度对象
  static fromMegabytesPerSecond(mbps: number): DownloadSpeed {
    return new DownloadSpeed(mbps * 1024 * 1024)
  }

  // 从千兆字节每秒创建速度对象
  static fromGigabytesPerSecond(gbps: number): DownloadSpeed {
    return new DownloadSpeed(gbps * 1024 * 1024 * 1024)
  }

  // 创建零速度对象
  static zero(): DownloadSpeed {
    return new DownloadSpeed(0)
  }

  // 从字符串解析速度对象
  static parse(speedString: string): DownloadSpeed {
    const regex = /^(\d+(?:\.\d+)?)\s*(B\/s|KB\/s|MB\/s|GB\/s)$/i
    const match = speedString.trim().match(regex)

    if (!match) {
      throw new Error('无效的下载速度格式')
    }

    const value = parseFloat(match[1])
    const unit = match[2].toUpperCase()

    switch (unit) {
      case 'B/S':
        return DownloadSpeed.fromBytesPerSecond(value)
      case 'KB/S':
        return DownloadSpeed.fromKilobytesPerSecond(value)
      case 'MB/S':
        return DownloadSpeed.fromMegabytesPerSecond(value)
      case 'GB/S':
        return DownloadSpeed.fromGigabytesPerSecond(value)
      default:
        throw new Error('不支持的下载速度单位')
    }
  }

  // 计算平均速度
  static calculateAverage(speeds: DownloadSpeed[]): DownloadSpeed {
    if (speeds.length === 0) return DownloadSpeed.zero()

    const totalSpeed = speeds.reduce(
      (sum, speed) => sum + speed._bytesPerSecond,
      0
    )

    return new DownloadSpeed(totalSpeed / speeds.length)
  }
}
