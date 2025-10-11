/**
 * 电影质量值对象
 * 封装电影质量相关的属性和验证逻辑
 */
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

  // 验证方法
  private validateResolution(resolution: string): void {
    const validResolutions = ['720p', '1080p', '4K', 'HD', 'SD']
    if (!validResolutions.includes(resolution)) {
      throw new Error(
        `无效的分辨率: ${resolution}. 支持的分辨率: ${validResolutions.join(', ')}`
      )
    }
  }

  private validateFormat(format: string): void {
    const validFormats = ['MP4', 'MKV', 'AVI', 'MOV', 'WEBM']
    if (!validFormats.includes(format)) {
      throw new Error(
        `无效的格式: ${format}. 支持的格式: ${validFormats.join(', ')}`
      )
    }
  }

  private validateSize(size: number): void {
    if (size <= 0) {
      throw new Error('文件大小必须大于0')
    }

    if (size > 100 * 1024 * 1024 * 1024) {
      // 100GB
      throw new Error('文件大小不能超过100GB')
    }
  }

  private validateUrl(url: string): void {
    if (!url || url.trim().length === 0) {
      throw new Error('下载URL不能为空')
    }

    try {
      new URL(url)
    } catch {
      throw new Error('无效的URL格式')
    }
  }

  private validateMagnetLink(magnetLink?: string): void {
    if (magnetLink && !magnetLink.startsWith('magnet:')) {
      throw new Error('无效的磁力链接格式')
    }
  }

  private validateQuality(quality: number): void {
    if (quality < 1 || quality > 10) {
      throw new Error('质量评分必须在1-10之间')
    }
  }

  // 业务方法
  isHighQuality(): boolean {
    return this.quality >= 8
  }

  isHD(): boolean {
    return this.resolution === '1080p' || this.resolution === '4K'
  }

  is4K(): boolean {
    return this.resolution === '4K'
  }

  isStandardDefinition(): boolean {
    return this.resolution === 'SD' || this.resolution === 'HD'
  }

  getFormattedSize(): string {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = this.size
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  getDownloadSpeed(): string {
    // 基于种子数估算下载速度
    if (!this.seeders) return '未知'

    if (this.seeders > 1000) return '极快'
    if (this.seeders > 500) return '很快'
    if (this.seeders > 100) return '快'
    if (this.seeders > 50) return '中等'
    if (this.seeders > 10) return '慢'
    return '很慢'
  }

  getHealth(): 'excellent' | 'good' | 'fair' | 'poor' {
    if (!this.seeders) return 'poor'

    const ratio = this.leechers ? this.seeders / this.leechers : this.seeders

    if (this.seeders > 100 && ratio > 2) return 'excellent'
    if (this.seeders > 50 && ratio > 1) return 'good'
    if (this.seeders > 10 && ratio > 0.5) return 'fair'
    return 'poor'
  }

  getHealthColor(): string {
    const health = this.getHealth()
    const colors = {
      excellent: 'green',
      good: 'blue',
      fair: 'yellow',
      poor: 'red',
    }
    return colors[health]
  }

  getRank(): number {
    // 综合评分：质量 + 分辨率 + 种子数
    let rank = this.quality

    // 分辨率加分
    const resolutionBonus = {
      '4K': 3,
      '1080p': 2,
      '720p': 1,
      HD: 0.5,
      SD: 0,
    }
    rank += resolutionBonus[this.resolution] || 0

    // 种子数加分
    if (this.seeders) {
      if (this.seeders > 1000) rank += 2
      else if (this.seeders > 100) rank += 1
      else if (this.seeders > 10) rank += 0.5
    }

    return Math.round(rank * 10) / 10
  }

  isRecommendedForDownload(): boolean {
    return (
      this.isHighQuality() &&
      this.isHD() &&
      this.getHealth() !== 'poor' &&
      this.size < 10 * 1024 * 1024 * 1024
    ) // 小于10GB
  }

  getCompatibility(): {
    mobile: boolean
    tablet: boolean
    desktop: boolean
    smartTV: boolean
  } {
    return {
      mobile: this.format === 'MP4' || this.format === 'WEBM',
      tablet:
        this.format === 'MP4' ||
        this.format === 'WEBM' ||
        this.format === 'MOV',
      desktop: true, // 所有格式都支持桌面
      smartTV:
        this.format === 'MP4' || this.format === 'MKV' || this.format === 'AVI',
    }
  }

  // 比较方法
  isBetterThan(other: MovieQuality): boolean {
    return this.getRank() > other.getRank()
  }

  isSameQuality(other: MovieQuality): boolean {
    return this.resolution === other.resolution && this.format === other.format
  }

  // 静态工厂方法
  static create720pMP4(
    size: number,
    downloadUrl: string,
    quality: number = 6
  ): MovieQuality {
    return new MovieQuality(
      '720p',
      'MP4',
      size,
      downloadUrl,
      undefined,
      undefined,
      undefined,
      quality
    )
  }

  static create1080pMP4(
    size: number,
    downloadUrl: string,
    quality: number = 8
  ): MovieQuality {
    return new MovieQuality(
      '1080p',
      'MP4',
      size,
      downloadUrl,
      undefined,
      undefined,
      undefined,
      quality
    )
  }

  static create4KMP4(
    size: number,
    downloadUrl: string,
    quality: number = 10
  ): MovieQuality {
    return new MovieQuality(
      '4K',
      'MP4',
      size,
      downloadUrl,
      undefined,
      undefined,
      undefined,
      quality
    )
  }

  static createFromTorrent(
    resolution: '720p' | '1080p' | '4K' | 'HD' | 'SD',
    format: 'MP4' | 'MKV' | 'AVI' | 'MOV' | 'WEBM',
    size: number,
    magnetLink: string,
    seeders: number,
    leechers: number,
    quality: number = 7
  ): MovieQuality {
    return new MovieQuality(
      resolution,
      format,
      size,
      '', // 磁力链接版本可能没有直接下载链接
      magnetLink,
      seeders,
      leechers,
      quality
    )
  }

  // 预定义的质量选项
  static readonly QUALITY_OPTIONS = {
    SD_PIRATE: {
      resolution: 'SD' as const,
      format: 'MP4' as const,
      quality: 4,
    },
    HD_720P: {
      resolution: '720p' as const,
      format: 'MP4' as const,
      quality: 6,
    },
    HD_1080P: {
      resolution: '1080p' as const,
      format: 'MP4' as const,
      quality: 8,
    },
    UHD_4K: { resolution: '4K' as const, format: 'MP4' as const, quality: 10 },
  } as const

  // 工具方法
  static getQualityLevel(resolution: string): number {
    const levels = {
      SD: 1,
      HD: 2,
      '720p': 3,
      '1080p': 4,
      '4K': 5,
    }
    return levels[resolution as keyof typeof levels] || 0
  }

  static estimateDownloadSize(
    resolution: '720p' | '1080p' | '4K' | 'HD' | 'SD',
    duration: number // 分钟
  ): number {
    const bitrates = {
      SD: 800, // kbps
      HD: 1200, // kbps
      '720p': 2000, // kbps
      '1080p': 5000, // kbps
      '4K': 15000, // kbps
    }

    const bitrate = bitrates[resolution] || 2000
    const sizeBits = bitrate * 1000 * duration * 60 // 转换为位
    return Math.round(sizeBits / 8) // 转换为字节
  }

  static getBestQuality(qualities: MovieQuality[]): MovieQuality | null {
    if (qualities.length === 0) return null

    return qualities.reduce((best, current) =>
      current.getRank() > best.getRank() ? current : best
    )
  }

  static filterByDevice(
    qualities: MovieQuality[],
    device: 'mobile' | 'tablet' | 'desktop' | 'smartTV'
  ): MovieQuality[] {
    return qualities.filter(quality => {
      const compatibility = quality.getCompatibility()
      return compatibility[device]
    })
  }

  // 序列化方法
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
      quality: this.quality,
    }
  }

  static fromJSON(data: {
    resolution: string
    format: string
    size: number
    downloadUrl: string
    magnetLink?: string
    seeders?: number
    leechers?: number
    quality: number
  }): MovieQuality {
    return new MovieQuality(
      data.resolution as '720p' | '1080p' | '4K' | 'HD' | 'SD',
      data.format as 'MP4' | 'MKV' | 'AVI' | 'MOV' | 'WEBM',
      data.size,
      data.downloadUrl,
      data.magnetLink,
      data.seeders,
      data.leechers,
      data.quality
    )
  }

  // 字符串表示
  toString(): string {
    const sizeStr = this.getFormattedSize()
    const healthStr = this.seeders ? ` (${this.getHealth()})` : ''
    return `${this.resolution} ${this.format} - ${sizeStr}${healthStr}`
  }

  // 获取显示标签
  getDisplayLabel(): string {
    const labels = {
      '4K': '4K超清',
      '1080p': '1080P高清',
      '720p': '720P标清',
      HD: '高清',
      SD: '标清',
    }
    return labels[this.resolution] || this.resolution
  }

  // 获取推荐度描述
  getRecommendationText(): string {
    if (this.isRecommendedForDownload()) {
      return '推荐下载'
    } else if (this.isHighQuality()) {
      return '高质量'
    } else if (this.isHD()) {
      return '高清'
    } else {
      return '标清'
    }
  }
}
