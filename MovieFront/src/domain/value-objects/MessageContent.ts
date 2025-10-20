/**
 * @fileoverview 消息内容值对象
 * @description 消息内容值对象，封装消息文本内容、附件、提及和话题标签等功能，提供消息内容的创建、验证、格式化和搜索功能
 * @created 2025-10-09 13:10:49
 * @updated 2025-10-19 10:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 消息内容值对象，封装消息文本内容、附件、提及和话题标签等功能
export class MessageContent {
  constructor(
    public readonly text: string,
    public readonly attachments: MessageAttachment[] = [],
    public readonly mentions: string[] = [],
    public readonly hashtags: string[] = []
  ) {
    this.validateContent()
  }

  // 验证消息内容的完整性和合规性
  private validateContent(): void {
    if (!this.text || this.text.trim().length === 0) {
      throw new Error('消息内容不能为空')
    }

    if (this.text.length > 4000) {
      throw new Error('消息内容过长，最多4000个字符')
    }

    if (this.attachments.length > 10) {
      throw new Error('附件数量过多，最多10个附件')
    }

    // 验证提及的用户
    for (const mention of this.mentions) {
      if (!mention || mention.trim().length === 0) {
        throw new Error('提及的用户名不能为空')
      }
    }

    // 验证话题标签
    for (const hashtag of this.hashtags) {
      if (!hashtag || hashtag.trim().length === 0) {
        throw new Error('话题标签不能为空')
      }

      if (hashtag.length > 50) {
        throw new Error('话题标签过长，最多50个字符')
      }
    }
  }

  // 检查消息是否为空
  isEmpty(): boolean {
    return this.text.trim().length === 0 && this.attachments.length === 0
  }

  // 检查是否有附件
  hasAttachments(): boolean {
    return this.attachments.length > 0
  }

  // 检查是否有提及
  hasMentions(): boolean {
    return this.mentions.length > 0
  }

  // 检查是否有话题标签
  hasHashtags(): boolean {
    return this.hashtags.length > 0
  }

  // 检查文本是否包含指定内容
  containsText(searchText: string): boolean {
    return this.text.toLowerCase().includes(searchText.toLowerCase())
  }

  // 检查是否提及指定用户
  containsMention(username: string): boolean {
    return this.mentions.some(
      mention => mention.toLowerCase() === username.toLowerCase()
    )
  }

  // 检查是否包含指定话题标签
  containsHashtag(hashtag: string): boolean {
    return this.hashtags.some(
      tag => tag.toLowerCase() === hashtag.toLowerCase()
    )
  }

  // 获取单词数量
  getWordCount(): number {
    return this.text.trim().split(/\s+/).length
  }

  // 获取字符数量
  getCharacterCount(): number {
    return this.text.length
  }

  // 获取附件总大小
  getTotalAttachmentSize(): number {
    return this.attachments.reduce(
      (total, attachment) => total + attachment.size,
      0
    )
  }

  // 获取图片附件
  getImageAttachments(): MessageAttachment[] {
    return this.attachments.filter(attachment => attachment.isImage())
  }

  // 获取视频附件
  getVideoAttachments(): MessageAttachment[] {
    return this.attachments.filter(attachment => attachment.isVideo())
  }

  // 获取文档附件
  getDocumentAttachments(): MessageAttachment[] {
    return this.attachments.filter(attachment => attachment.isDocument())
  }

  // 获取纯文本内容（移除格式化）
  getPlainText(): string {
    return this.text
      .replace(/@\w+/g, '') // 移除提及
      .replace(/#\w+/g, '') // 移除话题标签
      .trim()
  }

  // 格式化显示内容
  getFormattedContent(): string {
    let formatted = this.text

    // 格式化提及
    for (const mention of this.mentions) {
      const mentionRegex = new RegExp(`@${mention}`, 'gi')
      formatted = formatted.replace(mentionRegex, `[@${mention}]`)
    }

    // 格式化话题标签
    for (const hashtag of this.hashtags) {
      const hashtagRegex = new RegExp(`#${hashtag}`, 'gi')
      formatted = formatted.replace(hashtagRegex, `[#${hashtag}]`)
    }

    return formatted
  }

  // 获取内容摘要
  getSummary(maxLength: number = 100): string {
    const plainText = this.getPlainText()
    if (plainText.length <= maxLength) {
      return plainText
    }
    return `${plainText.substring(0, maxLength - 3)  }...`
  }

  // 检查内容是否包含敏感词
  containsSensitiveWords(sensitiveWords: string[]): boolean {
    const lowerText = this.text.toLowerCase()
    return sensitiveWords.some(word =>
      lowerText.includes(word.toLowerCase())
    )
  }

  // 转换为JSON格式
  toJSON(): {
    text: string
    attachments: MessageAttachment[]
    mentions: string[]
    hashtags: string[]
  } {
    return {
      text: this.text,
      attachments: this.attachments,
      mentions: this.mentions,
      hashtags: this.hashtags
    }
  }

  // 转换为字符串
  toString(): string {
    return this.text
  }

  // ========== 静态工厂方法 ==========

  // 创建纯文本消息
  static fromText(text: string): MessageContent {
    return new MessageContent(text)
  }

  // 创建带附件的消息
  static withAttachments(
    text: string,
    attachments: MessageAttachment[]
  ): MessageContent {
    return new MessageContent(text, attachments)
  }

  // 创建带提及的消息
  static withMentions(
    text: string,
    mentions: string[]
  ): MessageContent {
    return new MessageContent(text, [], mentions)
  }

  // 创建带话题标签的消息
  static withHashtags(
    text: string,
    hashtags: string[]
  ): MessageContent {
    return new MessageContent(text, [], [], hashtags)
  }

  // 从JSON创建消息内容
  static fromJSON(json: {
    text: string
    attachments?: MessageAttachment[]
    mentions?: string[]
    hashtags?: string[]
  }): MessageContent {
    return new MessageContent(
      json.text,
      json.attachments || [],
      json.mentions || [],
      json.hashtags || []
    )
  }

  // 验证消息内容是否有效
  static isValid(text: string): boolean {
    try {
      new MessageContent(text)
      return true
    } catch {
      return false
    }
  }

  // 解析文本中的提及和话题标签
  static parseContent(text: string): {
    text: string
    mentions: string[]
    hashtags: string[]
  } {
    const mentions: string[] = []
    const hashtags: string[] = []

    // 解析提及 @username
    const mentionRegex = /@(\w+)/g
    let mentionMatch
    while ((mentionMatch = mentionRegex.exec(text)) !== null) {
      const username = mentionMatch[1]
      if (!mentions.includes(username)) {
        mentions.push(username)
      }
    }

    // 解析话题标签 #hashtag
    const hashtagRegex = /#(\w+)/g
    let hashtagMatch
    while ((hashtagMatch = hashtagRegex.exec(text)) !== null) {
      const tag = hashtagMatch[1]
      if (!hashtags.includes(tag)) {
        hashtags.push(tag)
      }
    }

    return { text, mentions, hashtags }
  }

  // 从原始文本创建消息内容（自动解析提及和话题标签）
  static fromRawText(rawText: string): MessageContent {
    const parsed = MessageContent.parseContent(rawText)
    return new MessageContent(
      parsed.text,
      [],
      parsed.mentions,
      parsed.hashtags
    )
  }
}

// 消息附件接口
export interface MessageAttachment {
  id: string
  name: string
  type: string
  size: number
  url: string

  // 检查是否为图片
  isImage(): boolean

  // 检查是否为视频
  isVideo(): boolean

  // 检查是否为文档
  isDocument(): boolean

  // 获取格式化的文件大小
  getFormattedSize(): string

  // 获取文件扩展名
  getFileExtension(): string
}

// 图片附件类
export class ImageAttachment implements MessageAttachment {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly size: number,
    public readonly url: string,
    public readonly width?: number,
    public readonly height?: number,
    public readonly alt?: string
  ) {}

  get type(): string {
    return 'image'
  }

  isImage(): boolean {
    return true
  }

  isVideo(): boolean {
    return false
  }

  isDocument(): boolean {
    return false
  }

  getFormattedSize(): string {
    return this.formatFileSize(this.size)
  }

  getFileExtension(): string {
    const lastDot = this.name.lastIndexOf('.')
    return lastDot !== -1 ? this.name.substring(lastDot + 1).toLowerCase() : ''
  }

  // 获取图片宽高比
  getAspectRatio(): number {
    if (!this.width || !this.height) return 0
    return this.width / this.height
  }

  // 检查是否为横向图片
  isLandscape(): boolean {
    return this.getAspectRatio() > 1
  }

  // 检查是否为纵向图片
  isPortrait(): boolean {
    return this.getAspectRatio() < 1
  }

  private formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }
}

// 文档附件类
export class DocumentAttachment implements MessageAttachment {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly size: number,
    public readonly url: string,
    public readonly mimeType?: string
  ) {}

  get type(): string {
    return 'document'
  }

  isImage(): boolean {
    return false
  }

  isVideo(): boolean {
    return false
  }

  isDocument(): boolean {
    return true
  }

  getFormattedSize(): string {
    return this.formatFileSize(this.size)
  }

  getFileExtension(): string {
    const lastDot = this.name.lastIndexOf('.')
    return lastDot !== -1 ? this.name.substring(lastDot + 1).toLowerCase() : ''
  }

  // 检查是否为PDF文档
  isPDF(): boolean {
    return this.getFileExtension() === 'pdf'
  }

  // 检查是否为Word文档
  isWord(): boolean {
    const ext = this.getFileExtension()
    return ['doc', 'docx'].includes(ext)
  }

  // 检查是否为Excel文档
  isExcel(): boolean {
    const ext = this.getFileExtension()
    return ['xls', 'xlsx'].includes(ext)
  }

  private formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }
}