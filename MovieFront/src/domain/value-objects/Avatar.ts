export class Avatar {
  private readonly _url: string
  private readonly _alt: string

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

  private isValidUrl(url: string): boolean {
    if (!url || url.trim().length === 0) return false

    try {
      const urlObj = new URL(url)
      return ['http:', 'https:', 'data:'].includes(urlObj.protocol)
    } catch {
      return false
    }
  }

  equals(other: Avatar): boolean {
    return this._url === other._url && this._alt === other._alt
  }

  isDefault(): boolean {
    return (
      this._url.includes('default-avatar') ||
      this._url.includes('placeholder') ||
      this._url.startsWith('data:image/svg+xml')
    )
  }

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

  isImageFormat(): boolean {
    const extension = this.getFileExtension()
    const supportedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
    return extension ? supportedFormats.includes(extension) : false
  }

  toString(): string {
    return this._url
  }

  // 静态工厂方法
  static fromUrl(url: string, alt?: string): Avatar {
    return new Avatar(url, alt)
  }

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

  static createGravatar(email: string, size: number = 100): Avatar {
    // 在实际应用中，这里应该使用真正的MD5哈希
    const hash = btoa(email.toLowerCase().trim()).substring(0, 32)
    const url = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`
    return new Avatar(url, '用户头像')
  }

  static validate(url: string): boolean {
    try {
      new Avatar(url)
      return true
    } catch {
      return false
    }
  }
}
