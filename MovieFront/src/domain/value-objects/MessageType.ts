/**
 * @fileoverview 消息类型值对象
 * @description 消息类型值对象，定义不同类型的消息及其权限属性，提供消息类型的创建、验证和权限管理功能
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 消息类型值对象，定义不同类型的消息及其权限属性
export class MessageType {
  public readonly type: string
  public readonly canReply: boolean
  public readonly canForward: boolean
  public readonly canDelete: boolean
  public readonly expiresAfter?: number // 消息过期时间（毫秒）

  constructor(
    type: string,
    canReply: boolean = true,
    canForward: boolean = true,
    canDelete: boolean = true,
    expiresAfter?: number
  ) {
    this.validateType(type)
    this.type = type
    this.canReply = canReply
    this.canForward = canForward
    this.canDelete = canDelete
    this.expiresAfter = expiresAfter
  }

  // 验证消息类型格式
  private validateType(type: string): void {
    if (!type || type.trim().length === 0) {
      throw new Error('消息类型不能为空')
    }

    if (type.length > 50) {
      throw new Error('消息类型名称过长，最多50个字符')
    }

    // 只允许字母、数字、下划线
    if (!/^[a-zA-Z0-9_]+$/.test(type)) {
      throw new Error('消息类型只能包含字母、数字和下划线')
    }
  }

  // 检查是否为系统消息
  isSystemMessage(): boolean {
    return this.type === 'system'
  }

  // 检查是否为用户消息
  isUserMessage(): boolean {
    return !this.isSystemMessage()
  }

  // 检查消息是否已过期
  isExpired(createdAt: Date): boolean {
    if (!this.expiresAfter) return false
    const now = new Date()
    const diff = now.getTime() - createdAt.getTime()
    return diff > this.expiresAfter
  }

  // 检查是否可以编辑
  canEdit(): boolean {
    return this.canDelete && this.isUserMessage()
  }

  // 检查是否可以收藏
  canFavorite(): boolean {
    return this.isUserMessage()
  }

  // 检查是否可以举报
  canReport(): boolean {
    return this.isUserMessage()
  }

  // 检查是否为下载消息
  isDownloadMessage(): boolean {
    return this.type.startsWith('download') || this.type === 'download'
  }

  // 检查是否为影片消息
  isMovieMessage(): boolean {
    return this.type.startsWith('movie') || this.type === 'movie'
  }

  // 检查是否为账户消息
  isAccountMessage(): boolean {
    return this.type.startsWith('account') || this.type === 'account' || this.type.startsWith('security')
  }

  // 比较两个消息类型是否相等
  equals(other: MessageType): boolean {
    return this.type === other.type
  }

  // 获取显示名称
  getDisplayName(): string {
    const displayNames: Record<string, string> = {
      text: '文本消息',
      image: '图片消息',
      video: '视频消息',
      audio: '语音消息',
      file: '文件消息',
      system: '系统消息',
      notification: '通知消息',
      warning: '警告消息',
      error: '错误消息'
    }
    return displayNames[this.type] || this.type
  }

  // 获取类型图标
  getIcon(): string {
    const icons: Record<string, string> = {
      text: '💬',
      image: '🖼️',
      video: '🎬',
      audio: '🎵',
      file: '📎',
      system: '⚙️',
      notification: '🔔',
      warning: '⚠️',
      error: '❌'
    }
    return icons[this.type] || '📝'
  }

  // 获取类型描述
  getDescription(): string {
    const descriptions: Record<string, string> = {
      text: '纯文本消息内容',
      image: '包含图片的消息',
      video: '包含视频的消息',
      audio: '包含语音的消息',
      file: '包含文件附件的消息',
      system: '系统自动生成的消息',
      notification: '系统通知消息',
      warning: '系统警告消息',
      error: '系统错误消息'
    }
    return descriptions[this.type] || '未知类型的消息'
  }

  // 转换为JSON格式
  toJSON(): {
    type: string
    canReply: boolean
    canForward: boolean
    canDelete: boolean
    expiresAfter?: number
  } {
    return {
      type: this.type,
      canReply: this.canReply,
      canForward: this.canForward,
      canDelete: this.canDelete,
      expiresAfter: this.expiresAfter
    }
  }

  // 转换为字符串
  toString(): string {
    return this.type
  }

  // ========== 静态工厂方法 ==========

  // 创建文本消息类型
  static text(): MessageType {
    return new MessageType('text', true, true, true)
  }

  // 创建图片消息类型
  static image(): MessageType {
    return new MessageType('image', true, true, true)
  }

  // 创建视频消息类型
  static video(): MessageType {
    return new MessageType('video', true, false, true)
  }

  // 创建语音消息类型
  static audio(): MessageType {
    return new MessageType('audio', true, false, true)
  }

  // 创建文件消息类型
  static file(): MessageType {
    return new MessageType('file', true, true, true)
  }

  // 创建系统消息类型
  static system(): MessageType {
    return new MessageType('system', false, false, false)
  }

  // 创建通知消息类型
  static notification(): MessageType {
    return new MessageType('notification', false, true, false, 7 * 24 * 60 * 60 * 1000) // 7天过期
  }

  // 创建警告消息类型
  static warning(): MessageType {
    return new MessageType('warning', false, true, false, 24 * 60 * 60 * 1000) // 1天过期
  }

  // 错误消息类型
  static error(): MessageType {
    return new MessageType('error', false, false, false, 60 * 60 * 1000) // 1小时过期
  }

  // 安全警告消息类型
  static security(warningType: 'login' | 'password' | 'device'): MessageType {
    return new MessageType(`security_${warningType}`, false, false, false, 7 * 24 * 60 * 60 * 1000) // 7天过期
  }

  // 创建自定义消息类型
  static custom(
    type: string,
    options: {
      canReply?: boolean
      canForward?: boolean
      canDelete?: boolean
      expiresAfter?: number
    } = {}
  ): MessageType {
    return new MessageType(
      type,
      options.canReply,
      options.canForward,
      options.canDelete,
      options.expiresAfter
    )
  }

  // 从JSON创建消息类型
  static fromJSON(json: {
    type: string
    canReply?: boolean
    canForward?: boolean
    canDelete?: boolean
    expiresAfter?: number
  }): MessageType {
    return new MessageType(
      json.type,
      json.canReply,
      json.canForward,
      json.canDelete,
      json.expiresAfter
    )
  }

  // 验证消息类型是否有效
  static isValid(type: string): boolean {
    try {
      new MessageType(type)
      return true
    } catch {
      return false
    }
  }

  // 获取所有可用的消息类型
  static getAllTypes(): MessageType[] {
    return [
      MessageType.text(),
      MessageType.image(),
      MessageType.video(),
      MessageType.audio(),
      MessageType.file(),
      MessageType.system(),
      MessageType.notification(),
      MessageType.warning(),
      MessageType.error()
    ]
  }

  // 根据类型查找消息类型
  static findByType(type: string): MessageType | null {
    const allTypes = MessageType.getAllTypes()
    return allTypes.find(messageType => messageType.type === type) || null
  }

  // 获取用户可发送的消息类型
  static getUserSendableTypes(): MessageType[] {
    return MessageType.getAllTypes().filter(type => type.isUserMessage())
  }

  // 获取系统消息类型
  static getSystemTypes(): MessageType[] {
    return MessageType.getAllTypes().filter(type => type.isSystemMessage())
  }

  // 搜索消息类型
  static search(keyword: string): MessageType[] {
    const lowerKeyword = keyword.toLowerCase()
    return MessageType.getAllTypes().filter(type =>
      type.type.toLowerCase().includes(lowerKeyword) ||
      type.getDisplayName().toLowerCase().includes(lowerKeyword) ||
      type.getDescription().toLowerCase().includes(lowerKeyword)
    )
  }
}
