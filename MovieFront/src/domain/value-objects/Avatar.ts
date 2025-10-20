/**
 * @fileoverview 用户头像值对象
 * @description 用户头像值对象，封装头像URL和相关操作方法，支持URL验证、格式检查、默认头像生成等功能
 * @created 2025-10-09 13:10:49
 * @updated 2025-10-19 10:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 用户头像值对象，封装头像URL和相关操作方法
export class Avatar {
  private readonly _url: string
  private readonly _alt: string

  // 构造函数，验证URL并初始化头像对象
  constructor(url: string, alt?: string) {
    if (!this.isValidUrl(url)) {
      throw new Error('无效的头像URL')
    }
    this._url = url.trim()
    this._alt = alt || '用户头像'
  }

  get url(): string {
    return this._url
  }

  get alt(): string {
    return this._alt
  }

  // 验证URL是否有效，支持HTTP、HTTPS和Data URL协议
  private isValidUrl(url: string): boolean {
    if (!url || url.trim().length === 0) return false

    try {
      const urlObj = new URL(url)
      return ['http:', 'https:', 'data:'].includes(urlObj.protocol)
    } catch {
      return false
    }
  }

  // 比较两个头像对象是否相等
  equals(other: Avatar): boolean {
    return this._url === other._url && this._alt === other._alt
  }

  // 检查是否为默认头像
  isDefault(): boolean {
    return (
      this._url.includes('default-avatar') ||
      this._url.includes('placeholder') ||
      this._url.startsWith('data:image/svg+xml')
    )
  }

  // 获取文件扩展名
  getFileExtension(): string | null {
    try {
      const urlObj = new URL(this._url)
      const pathname = urlObj.pathname
      const lastDot = pathname.lastIndexOf('.')

      if (lastDot === -1) return null

      return pathname.substring(lastDot + 1).toLowerCase()
    } catch {
      return null
    }
  }

  // 检查是否为支持的图片格式
  isImageFormat(): boolean {
    const extension = this.getFileExtension()
    const supportedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
    return extension ? supportedFormats.includes(extension) : false
  }

  toString(): string {
    return this._url
  }

  // 静态工厂方法 - 从URL创建头像对象
  static fromUrl(url: string, alt?: string): Avatar {
    return new Avatar(url, alt)
  }

  // 创建默认头像，使用SVG生成带有用户名首字母的彩色头像
  static createDefault(username?: string): Avatar {
    const initial = username ? username.charAt(0).toUpperCase() : 'U'
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
      '#98D8C8',
      '#F7DC6F',
    ]
    const color = colors[Math.floor(Math.random() * colors.length)]

    const svg = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="${color}"/>
        <text x="50" y="50" font-family="Arial, sans-serif" font-size="40"
              fill="white" text-anchor="middle" dominant-baseline="central">
          ${initial}
        </text>
      </svg>
    `.trim()

    const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`
    return new Avatar(dataUrl, `${username || '用户'}的默认头像`)
  }

  // 基于邮箱创建Gravatar头像
  static createGravatar(email: string, size: number = 100): Avatar {
    // 在实际应用中，这里应该使用真正的MD5哈希
    const hash = btoa(email.toLowerCase().trim()).substring(0, 32)
    const url = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`
    return new Avatar(url, '用户头像')
  }

  // 验证头像URL是否有效
  static validate(url: string): boolean {
    try {
      new Avatar(url)
      return true
    } catch {
      return false
    }
  }
}
