export class DownloadSpeed {
  private readonly _bytesPerSecond: number

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

  equals(other: DownloadSpeed): boolean {
    return this._bytesPerSecond === other._bytesPerSecond
  }

  isGreaterThan(other: DownloadSpeed): boolean {
    return this._bytesPerSecond > other._bytesPerSecond
  }

  isLessThan(other: DownloadSpeed): boolean {
    return this._bytesPerSecond < other._bytesPerSecond
  }

  add(other: DownloadSpeed): DownloadSpeed {
    return new DownloadSpeed(this._bytesPerSecond + other._bytesPerSecond)
  }

  multiply(factor: number): DownloadSpeed {
    if (factor < 0) {
      throw new Error('乘数不能为负数')
    }
    return new DownloadSpeed(this._bytesPerSecond * factor)
  }

  calculateETA(remainingBytes: number): number {
    if (this._bytesPerSecond === 0) return Infinity
    return (remainingBytes / this._bytesPerSecond) * 1000 // 返回毫秒
  }

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

  getSpeedCategory(): 'slow' | 'medium' | 'fast' | 'very-fast' {
    const mbps = this.megabytesPerSecond

    if (mbps < 0.5) return 'slow'
    if (mbps < 2) return 'medium'
    if (mbps < 10) return 'fast'
    return 'very-fast'
  }

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
  static fromBytesPerSecond(bps: number): DownloadSpeed {
    return new DownloadSpeed(bps)
  }

  static fromKilobytesPerSecond(kbps: number): DownloadSpeed {
    return new DownloadSpeed(kbps * 1024)
  }

  static fromMegabytesPerSecond(mbps: number): DownloadSpeed {
    return new DownloadSpeed(mbps * 1024 * 1024)
  }

  static fromGigabytesPerSecond(gbps: number): DownloadSpeed {
    return new DownloadSpeed(gbps * 1024 * 1024 * 1024)
  }

  static zero(): DownloadSpeed {
    return new DownloadSpeed(0)
  }

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
