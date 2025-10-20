/**
 * @fileoverview 电影质量值对象
 * @description 电影质量值对象，封装电影的分辨率、格式、文件大小、下载链接等质量相关属性，提供电影质量的创建、验证、比较和展示功能
 * @created 2025-10-09 13:10:49
 * @updated 2025-10-19 10:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 电影质量值对象，封装电影的分辨率、格式、文件大小、下载链接等质量相关属性
export class MovieQuality {
  public readonly resolution: '720p' | '1080p' | '4K' | 'HD' | 'SD'
  public readonly format: 'MP4' | 'MKV' | 'AVI' | 'MOV' | 'WEBM'
  public readonly size: number // 字节
  public readonly downloadUrl: string
  public readonly magnetLink?: string
  public readonly seeders?: number
  public readonly leechers?: number
  public readonly quality: number // 1-10的质量评分

  constructor(
    resolution: '720p' | '1080p' | '4K' | 'HD' | 'SD',
    format: 'MP4' | 'MKV' | 'AVI' | 'MOV' | 'WEBM',
    size: number,
    downloadUrl: string,
    magnetLink?: string,
    seeders?: number,
    leechers?: number,
    quality: number = 8
  ) {
    this.validateResolution(resolution)
    this.validateFormat(format)
    this.validateSize(size)
    this.validateUrl(downloadUrl)
    this.validateMagnetLink(magnetLink)
    this.validateQuality(quality)

    this.resolution = resolution
    this.format = format
    this.size = size
    this.downloadUrl = downloadUrl
    this.magnetLink = magnetLink
    this.seeders = seeders
    this.leechers = leechers
    this.quality = quality
  }

  // 验证分辨率
  private validateResolution(resolution: string): void {
    const validResolutions = ['720p', '1080p', '4K', 'HD', 'SD']
    if (!validResolutions.includes(resolution)) {
      throw new Error(
        `无效的分辨率: ${resolution}. 支持的分辨率: ${validResolutions.join(', ')}`
      )
    }
  }

  // 验证格式
  private validateFormat(format: string): void {
    const validFormats = ['MP4', 'MKV', 'AVI', 'MOV', 'WEBM']
    if (!validFormats.includes(format)) {
      throw new Error(
        `无效的格式: ${format}. 支持的格式: ${validFormats.join(', ')}`
      )
    }
  }

  // 验证文件大小
  private validateSize(size: number): void {
    if (size <= 0) {
      throw new Error('文件大小必须大于0')
    }
    if (size > 100 * 1024 * 1024 * 1024) { // 100GB
      throw new Error('文件大小不能超过100GB')
    }
  }

  // 验证下载URL
  private validateUrl(url: string): void {
    if (!url || url.trim().length === 0) {
      throw new Error('下载URL不能为空')
    }
    try {
      new URL(url)
    } catch {
      throw new Error('无效的下载URL格式')
    }
  }

  // 验证磁力链接
  private validateMagnetLink(magnetLink?: string): void {
    if (!magnetLink) return

    if (!magnetLink.startsWith('magnet:')) {
      throw new Error('磁力链接必须以magnet:开头')
    }
  }

  // 验证质量评分
  private validateQuality(quality: number): void {
    if (quality < 1 || quality > 10) {
      throw new Error('质量评分必须在1-10之间')
    }
  }

  // 获取格式化的文件大小
  getFormattedSize(): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = this.size
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

  // 获取质量等级
  getQualityLevel(): 'low' | 'medium' | 'high' | 'ultra' {
    if (this.quality >= 9) return 'ultra'
    if (this.quality >= 7) return 'high'
    if (this.quality >= 5) return 'medium'
    return 'low'
  }

  // 获取质量等级文本
  getQualityLevelText(): string {
    const levels = {
      low: '低质量',
      medium: '中等质量',
      high: '高质量',
      ultra: '超高质量'
    }
    return levels[this.getQualityLevel()]
  }

  // 获取质量颜色
  getQualityColor(): string {
    const level = this.getQualityLevel()
    const colors = {
      low: 'text-red-600',
      medium: 'text-yellow-600',
      high: 'text-blue-600',
      ultra: 'text-green-600'
    }
    return colors[level]
  }

  // 检查是否有磁力链接
  hasMagnetLink(): boolean {
    return !!this.magnetLink
  }

  // 检查是否有种子信息
  hasSeeders(): boolean {
    return this.seeders !== undefined && this.seeders > 0
  }

  // 检查是否热门（种子数多）
  isPopular(): boolean {
    return this.seeders !== undefined && this.seeders > 100
  }

  // 获取健康度（种子数/下载者比例）
  getHealth(): 'excellent' | 'good' | 'fair' | 'poor' {
    if (!this.hasSeeders() || !this.leechers) return 'poor'

    const ratio = this.seeders! / this.leechers
    if (ratio > 5) return 'excellent'
    if (ratio > 2) return 'good'
    if (ratio > 0.5) return 'fair'
    return 'poor'
  }

  // 获取健康度文本
  getHealthText(): string {
    const healthTexts = {
      excellent: '优秀',
      good: '良好',
      fair: '一般',
      poor: '较差'
    }
    return healthTexts[this.getHealth()]
  }

  // 获取健康度颜色
  getHealthColor(): string {
    const healthColors = {
      excellent: 'text-green-600',
      good: 'text-blue-600',
      fair: 'text-yellow-600',
      poor: 'text-red-600'
    }
    return healthColors[this.getHealth()]
  }

  // 比较质量（返回哪个更好）
  compareQuality(other: MovieQuality): number {
    // 首先比较质量评分
    if (this.quality !== other.quality) {
      return this.quality - other.quality
    }

    // 然后比较分辨率
    const resolutionOrder = ['SD', 'HD', '720p', '1080p', '4K']
    const thisIndex = resolutionOrder.indexOf(this.resolution)
    const otherIndex = resolutionOrder.indexOf(other.resolution)
    return thisIndex - otherIndex
  }

  // 检查是否比另一个质量更好
  isBetterThan(other: MovieQuality): boolean {
    return this.compareQuality(other) > 0
  }

  // 检查是否适合流媒体播放
  isSuitableForStreaming(): boolean {
    return this.format === 'MP4' && this.size < 5 * 1024 * 1024 * 1024 // 5GB
  }

  // 检查是否适合移动设备
  isSuitableForMobile(): boolean {
    return this.size < 2 * 1024 * 1024 * 1024 && // 2GB
           ['MP4', 'WEBM'].includes(this.format)
  }

  // 获取推荐设备
  getRecommendedDevices(): string[] {
    const devices: string[] = []

    if (this.isSuitableForMobile()) {
      devices.push('手机', '平板')
    }

    if (this.resolution !== 'SD' && this.resolution !== 'HD') {
      devices.push('电脑', '电视')
    }

    if (this.resolution === '4K') {
      devices.push('4K电视', '投影仪')
    }

    return devices.length > 0 ? devices : ['通用设备']
  }

  // 转换为JSON格式
  toJSON(): {
    resolution: string
    format: string
    size: number
    downloadUrl: string
    magnetLink?: string
    seeders?: number
    leechers?: number
    quality: number
  } {
    return {
      resolution: this.resolution,
      format: this.format,
      size: this.size,
      downloadUrl: this.downloadUrl,
      magnetLink: this.magnetLink,
      seeders: this.seeders,
      leechers: this.leechers,
      quality: this.quality
    }
  }

  // 转换为字符串
  toString(): string {
    return `${this.resolution} ${this.format} (${this.getFormattedSize()})`
  }

  // ========== 静态工厂方法 ==========

  // 创建720p质量
  static create720p(
    format: 'MP4' | 'MKV' | 'AVI' | 'MOV' | 'WEBM',
    size: number,
    downloadUrl: string,
    options: {
      magnetLink?: string
      seeders?: number
      leechers?: number
      quality?: number
    } = {}
  ): MovieQuality {
    return new MovieQuality(
      '720p',
      format,
      size,
      downloadUrl,
      options.magnetLink,
      options.seeders,
      options.leechers,
      options.quality || 7
    )
  }

  // 创建1080p质量
  static create1080p(
    format: 'MP4' | 'MKV' | 'AVI' | 'MOV' | 'WEBM',
    size: number,
    downloadUrl: string,
    options: {
      magnetLink?: string
      seeders?: number
      leechers?: number
      quality?: number
    } = {}
  ): MovieQuality {
    return new MovieQuality(
      '1080p',
      format,
      size,
      downloadUrl,
      options.magnetLink,
      options.seeders,
      options.leechers,
      options.quality || 8
    )
  }

  // 创建4K质量
  static create4K(
    format: 'MP4' | 'MKV' | 'AVI' | 'MOV' | 'WEBM',
    size: number,
    downloadUrl: string,
    options: {
      magnetLink?: string
      seeders?: number
      leechers?: number
      quality?: number
    } = {}
  ): MovieQuality {
    return new MovieQuality(
      '4K',
      format,
      size,
      downloadUrl,
      options.magnetLink,
      options.seeders,
      options.leechers,
      options.quality || 9
    )
  }

  // 从JSON创建电影质量
  static fromJSON(json: {
    resolution: string
    format: string
    size: number
    downloadUrl: string
    magnetLink?: string
    seeders?: number
    leechers?: number
    quality?: number
  }): MovieQuality {
    return new MovieQuality(
      json.resolution as any,
      json.format as any,
      json.size,
      json.downloadUrl,
      json.magnetLink,
      json.seeders,
      json.leechers,
      json.quality || 8
    )
  }

  // 验证电影质量数据
  static isValid(data: {
    resolution: string
    format: string
    size: number
    downloadUrl: string
  }): boolean {
    try {
      new MovieQuality(
        data.resolution as any,
        data.format as any,
        data.size,
        data.downloadUrl
      )
      return true
    } catch {
      return false
    }
  }

  // 比较多个质量并返回最好的
  static getBestQuality(qualities: MovieQuality[]): MovieQuality | null {
    if (qualities.length === 0) return null
    return qualities.reduce((best, current) =>
      current.isBetterThan(best) ? current : best
    )
  }

  // 按质量排序
  static sortByQuality(qualities: MovieQuality[]): MovieQuality[] {
    return [...qualities].sort((a, b) => b.compareQuality(a))
  }

  // 过滤适合流媒体的质量
  static filterForStreaming(qualities: MovieQuality[]): MovieQuality[] {
    return qualities.filter(quality => quality.isSuitableForStreaming())
  }

  // 过滤适合移动设备的质量
  static filterForMobile(qualities: MovieQuality[]): MovieQuality[] {
    return qualities.filter(quality => quality.isSuitableForMobile())
  }
}