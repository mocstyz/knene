/**
 * @fileoverview 文件大小值对象
 * @description 文件大小值对象，提供文件大小的创建、计算、格式化等功能，支持多种存储单位的转换和人类可读的大小显示
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 文件大小值对象，提供文件大小的创建、计算、格式化等功能
export class FileSize {
  private readonly _bytes: number

  // 构造函数，初始化文件大小值对象
  constructor(bytes: number) {
    if (bytes < 0) {
      throw new Error('文件大小不能为负数')
    }
    this._bytes = Math.floor(bytes)
  }

  // 获取字节数
  get bytes(): number {
    return this._bytes
  }

  // 获取千字节数
  get kilobytes(): number {
    return this._bytes / 1024
  }

  // 获取兆字节数
  get megabytes(): number {
    return this._bytes / (1024 * 1024)
  }

  // 获取千兆字节数
  get gigabytes(): number {
    return this._bytes / (1024 * 1024 * 1024)
  }

  // 获取太字节数
  get terabytes(): number {
    return this._bytes / (1024 * 1024 * 1024 * 1024)
  }

  // 比较两个文件大小是否相等
  equals(other: FileSize): boolean {
    return this._bytes === other._bytes
  }

  // 判断当前文件大小是否大于另一个文件大小
  isGreaterThan(other: FileSize): boolean {
    return this._bytes > other._bytes
  }

  // 判断当前文件大小是否小于另一个文件大小
  isLessThan(other: FileSize): boolean {
    return this._bytes < other._bytes
  }

  // 文件大小相加，返回新的文件大小对象
  add(other: FileSize): FileSize {
    return new FileSize(this._bytes + other._bytes)
  }

  // 文件大小相减，返回新的文件大小对象，最小为0
  subtract(other: FileSize): FileSize {
    return new FileSize(Math.max(0, this._bytes - other._bytes))
  }

  // 乘以倍数，返回新的文件大小对象
  multiply(factor: number): FileSize {
    if (factor < 0) {
      throw new Error('乘数不能为负数')
    }
    return new FileSize(this._bytes * factor)
  }

  // 格式化为人类可读的大小格式
  toHumanReadable(): string {
    if (this._bytes === 0) return '0 B'

    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = this._bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    const formattedSize =
      unitIndex === 0
        ? size.toString()
        : size.toFixed(2).replace(/\.?0+$/, '')

    return `${formattedSize} ${units[unitIndex]}`
  }

  // 获取最合适的单位
  getBestUnit(): { value: number; unit: string } {
    if (this._bytes === 0) return { value: 0, unit: 'B' }

    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = this._bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return { value: size, unit: units[unitIndex] }
  }

  // 转换为字符串
  toString(): string {
    return this.toHumanReadable()
  }

  // ========== 静态工厂方法 ==========

  // 从字节创建文件大小对象
  static fromBytes(bytes: number): FileSize {
    return new FileSize(bytes)
  }

  // 从千字节创建文件大小对象
  static fromKilobytes(kb: number): FileSize {
    return new FileSize(kb * 1024)
  }

  // 从兆字节创建文件大小对象
  static fromMegabytes(mb: number): FileSize {
    return new FileSize(mb * 1024 * 1024)
  }

  // 从千兆字节创建文件大小对象
  static fromGigabytes(gb: number): FileSize {
    return new FileSize(gb * 1024 * 1024 * 1024)
  }

  // 从太字节创建文件大小对象
  static fromTerabytes(tb: number): FileSize {
    return new FileSize(tb * 1024 * 1024 * 1024 * 1024)
  }

  // 从字符串解析文件大小对象
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

  // 创建零文件大小对象
  static zero(): FileSize {
    return new FileSize(0)
  }

  // 计算平均文件大小
  static average(fileSizes: FileSize[]): FileSize {
    if (fileSizes.length === 0) return FileSize.zero()

    const totalBytes = fileSizes.reduce((sum, size) => sum + size._bytes, 0)
    return new FileSize(totalBytes / fileSizes.length)
  }
}
