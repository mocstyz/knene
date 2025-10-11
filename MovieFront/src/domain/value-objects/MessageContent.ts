/**
 * 消息内容值对象
 * 封装消息内容及其相关属性
 */
export class MessageContent {
  constructor(
    public readonly text: string,
    public readonly attachments: MessageAttachment[] = [],
    public readonly mentions: string[] = [],
    public readonly hashtags: string[] = []
  ) {
    this.validateContent()
  }

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

  // 业务方法
  isEmpty(): boolean {
    return this.text.trim().length === 0 && this.attachments.length === 0
  }

  hasAttachments(): boolean {
    return this.attachments.length > 0
  }

  hasMentions(): boolean {
    return this.mentions.length > 0
  }

  hasHashtags(): boolean {
    return this.hashtags.length > 0
  }

  containsText(searchText: string): boolean {
    return this.text.toLowerCase().includes(searchText.toLowerCase())
  }

  containsMention(username: string): boolean {
    return this.mentions.some(
      mention => mention.toLowerCase() === username.toLowerCase()
    )
  }

  containsHashtag(hashtag: string): boolean {
    return this.hashtags.some(
      tag => tag.toLowerCase() === hashtag.toLowerCase()
    )
  }

  getWordCount(): number {
    return this.text.trim().split(/\s+/).length
  }

  getCharacterCount(): number {
    return this.text.length
  }

  getTotalAttachmentSize(): number {
    return this.attachments.reduce(
      (total, attachment) => total + attachment.size,
      0
    )
  }

  getImageAttachments(): MessageAttachment[] {
    return this.attachments.filter(attachment => attachment.isImage())
  }

  getVideoAttachments(): MessageAttachment[] {
    return this.attachments.filter(attachment => attachment.isVideo())
  }

  getDocumentAttachments(): MessageAttachment[] {
    return this.attachments.filter(attachment => attachment.isDocument())
  }

  // 格式化方法
  formatText(): string {
    let formattedText = this.text

    // 格式化提及
    for (const mention of this.mentions) {
      const regex = new RegExp(
        `@${mention.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
        'g'
      )
      formattedText = formattedText.replace(regex, `**@${mention}**`)
    }

    // 格式化话题标签
    for (const hashtag of this.hashtags) {
      const regex = new RegExp(
        `#${hashtag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
        'g'
      )
      formattedText = formattedText.replace(regex, `*#${hashtag}*`)
    }

    return formattedText
  }

  getPreview(maxLength: number = 100): string {
    let preview = this.text

    // 移除附件信息
    preview = preview.replace(/\[附件:.+?\]/g, '')

    // 截取指定长度
    if (preview.length > maxLength) {
      preview = `${preview.substring(0, maxLength - 3)}...`
    }

    return preview.trim()
  }

  // 静态工厂方法
  static fromText(text: string): MessageContent {
    return new MessageContent(text.trim())
  }

  static fromTextWithAttachments(
    text: string,
    attachments: MessageAttachment[]
  ): MessageContent {
    return new MessageContent(text.trim(), attachments)
  }

  static fromTextWithMentions(
    text: string,
    mentions: string[]
  ): MessageContent {
    return new MessageContent(text.trim(), [], mentions)
  }

  static parseText(text: string): MessageContent {
    const mentions: string[] = []
    const hashtags: string[] = []

    // 解析提及 (@username)
    const mentionRegex = /@(\w+)/g
    let match
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1])
    }

    // 解析话题标签 (#hashtag)
    const hashtagRegex = /#(\w+)/g
    while ((match = hashtagRegex.exec(text)) !== null) {
      hashtags.push(match[1])
    }

    return new MessageContent(text.trim(), [], mentions, hashtags)
  }

  // 验证方法
  static isValidText(text: string): boolean {
    if (!text || text.trim().length === 0) {
      return false
    }

    if (text.length > 4000) {
      return false
    }

    return true
  }

  static isValidMention(username: string): boolean {
    if (!username || username.trim().length === 0) {
      return false
    }

    if (username.length > 30) {
      return false
    }

    // 只允许字母、数字、下划线
    return /^[a-zA-Z0-9_]+$/.test(username)
  }

  static isValidHashtag(hashtag: string): boolean {
    if (!hashtag || hashtag.trim().length === 0) {
      return false
    }

    if (hashtag.length > 50) {
      return false
    }

    // 只允许字母、数字、中文、下划线
    return /^[\w\u4e00-\u9fa5]+$/.test(hashtag)
  }
}

/**
 * 消息附件值对象
 */
export class MessageAttachment {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly url: string,
    public readonly type: string,
    public readonly size: number,
    public readonly mimeType: string,
    public readonly thumbnailUrl?: string
  ) {
    this.validateAttachment()
  }

  private validateAttachment(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('附件名称不能为空')
    }

    if (!this.url) {
      throw new Error('附件URL不能为空')
    }

    if (!this.type) {
      throw new Error('附件类型不能为空')
    }

    if (this.size < 0) {
      throw new Error('附件大小不能为负数')
    }

    if (this.size > 100 * 1024 * 1024) {
      // 100MB
      throw new Error('附件大小不能超过100MB')
    }
  }

  // 业务方法
  isImage(): boolean {
    return this.mimeType.startsWith('image/')
  }

  isVideo(): boolean {
    return this.mimeType.startsWith('video/')
  }

  isAudio(): boolean {
    return this.mimeType.startsWith('audio/')
  }

  isDocument(): boolean {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
    ]
    return documentTypes.includes(this.mimeType)
  }

  isArchive(): boolean {
    const archiveTypes = [
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/x-tar',
      'application/gzip',
    ]
    return archiveTypes.includes(this.mimeType)
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

  getFileExtension(): string {
    return this.name.split('.').pop() || ''
  }

  getIconType(): string {
    if (this.isImage()) return 'image'
    if (this.isVideo()) return 'video'
    if (this.isAudio()) return 'audio'
    if (this.isDocument()) return 'document'
    if (this.isArchive()) return 'archive'
    return 'file'
  }

  // 静态工厂方法
  static create(
    id: string,
    name: string,
    url: string,
    type: string,
    size: number,
    mimeType: string,
    thumbnailUrl?: string
  ): MessageAttachment {
    return new MessageAttachment(
      id,
      name,
      url,
      type,
      size,
      mimeType,
      thumbnailUrl
    )
  }

  static createImage(
    id: string,
    name: string,
    url: string,
    size: number,
    thumbnailUrl?: string
  ): MessageAttachment {
    return new MessageAttachment(
      id,
      name,
      url,
      'image',
      size,
      'image/jpeg',
      thumbnailUrl
    )
  }

  static createVideo(
    id: string,
    name: string,
    url: string,
    size: number,
    thumbnailUrl?: string
  ): MessageAttachment {
    return new MessageAttachment(
      id,
      name,
      url,
      'video',
      size,
      'video/mp4',
      thumbnailUrl
    )
  }

  static createDocument(
    id: string,
    name: string,
    url: string,
    size: number,
    mimeType: string
  ): MessageAttachment {
    return new MessageAttachment(id, name, url, 'document', size, mimeType)
  }
}
