export class FileSize {
  private readonly _bytes: number

  constructor(bytes: number) {
    if (bytes < 0) {
      throw new Error('文件大小不能为负数')
    }
    this._bytes = Math.floor(bytes)
  }

  get bytes(): number {
    return this._bytes
  }

  get kilobytes(): number {
    return this._bytes / 1024
  }

  get megabytes(): number {
    return this._bytes / (1024 * 1024)
  }

  get gigabytes(): number {
    return this._bytes / (1024 * 1024 * 1024)
  }

  get terabytes(): number {
    return this._bytes / (1024 * 1024 * 1024 * 1024)
  }

  equals(other: FileSize): boolean {
    return this._bytes === other._bytes
  }

  isGreaterThan(other: FileSize): boolean {
    return this._bytes > other._bytes
  }

  isLessThan(other: FileSize): boolean {
    return this._bytes < other._bytes
  }

  add(other: FileSize): FileSize {
    return new FileSize(this._bytes + other._bytes)
  }

  subtract(other: FileSize): FileSize {
    return new FileSize(Math.max(0, this._bytes - other._bytes))
  }

  multiply(factor: number): FileSize {
    if (factor < 0) {
      throw new Error('乘数不能为负数')
    }
    return new FileSize(this._bytes * factor)
  }

  getPercentageOf(total: FileSize): number {
    if (total._bytes === 0) return 0
    return (this._bytes / total._bytes) * 100
  }

  toHumanReadable(): string {
    if (this._bytes === 0) return '0 B'

    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = this._bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    const formattedSize = unitIndex === 0 
      ? size.toString() 
      : size.toFixed(2).replace(/\.?0+$/, '')

    return `${formattedSize} ${units[unitIndex]}`
  }

  toString(): string {
    return this.toHumanReadable()
  }

  // 静态工厂方法
  static fromBytes(bytes: number): FileSize {
    return new FileSize(bytes)
  }

  static fromKilobytes(kb: number): FileSize {
    return new FileSize(kb * 1024)
  }

  static fromMegabytes(mb: number): FileSize {
    return new FileSize(mb * 1024 * 1024)
  }

  static fromGigabytes(gb: number): FileSize {
    return new FileSize(gb * 1024 * 1024 * 1024)
  }

  static fromTerabytes(tb: number): FileSize {
    return new FileSize(tb * 1024 * 1024 * 1024 * 1024)
  }

  static zero(): FileSize {
    return new FileSize(0)
  }

  static parse(sizeString: string): FileSize {
    const regex = /^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|TB)$/i
    const match = sizeString.trim().match(regex)

    if (!match) {
      throw new Error('无效的文件大小格式')
    }

    const value = parseFloat(match[1])
    const unit = match[2].toUpperCase()

    switch (unit) {
      case 'B':
        return FileSize.fromBytes(value)
      case 'KB':
        return FileSize.fromKilobytes(value)
      case 'MB':
        return FileSize.fromMegabytes(value)
      case 'GB':
        return FileSize.fromGigabytes(value)
      case 'TB':
        return FileSize.fromTerabytes(value)
      default:
        throw new Error('不支持的文件大小单位')
    }
  }
}