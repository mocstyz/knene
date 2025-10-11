/**
 * 消息类型值对象
 * 定义不同类型的消息及其属性
 */
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

  // 业务方法
  isSystemMessage(): boolean {
    return this.type === 'system'
  }

  isUserMessage(): boolean {
    return !this.isSystemMessage()
  }

  isNotification(): boolean {
    return this.type.startsWith('notification_')
  }

  isDownloadMessage(): boolean {
    return this.type === 'download'
  }

  isMovieMessage(): boolean {
    return this.type === 'movie'
  }

  isAccountMessage(): boolean {
    return this.type === 'account'
  }

  isSecurityMessage(): boolean {
    return this.type.startsWith('security_')
  }

  hasExpired(createdAt: Date): boolean {
    if (!this.expiresAfter) {
      return false
    }

    return Date.now() - createdAt.getTime() > this.expiresAfter
  }

  getExpirationTime(createdAt: Date): Date | null {
    if (!this.expiresAfter) {
      return null
    }

    return new Date(createdAt.getTime() + this.expiresAfter)
  }

  getDisplayName(): string {
    const displayNames: Record<string, string> = {
      text: '普通消息',
      system: '系统消息',
      notification_general: '一般通知',
      notification_download: '下载通知',
      notification_movie: '电影推荐',
      notification_account: '账户通知',
      download: '下载消息',
      movie: '电影消息',
      account: '账户消息',
      security_login: '登录提醒',
      security_password: '密码变更',
      security_device: '设备管理',
      welcome: '欢迎消息',
      announcement: '公告',
      warning: '警告',
      error: '错误',
      success: '成功',
    }

    return displayNames[this.type] || this.type
  }

  getIcon(): string {
    const iconMap: Record<string, string> = {
      text: 'message-circle',
      system: 'info',
      notification_general: 'bell',
      notification_download: 'download',
      notification_movie: 'film',
      notification_account: 'user',
      download: 'download-cloud',
      movie: 'play-circle',
      account: 'user-circle',
      security_login: 'shield',
      security_password: 'key',
      security_device: 'smartphone',
      welcome: 'heart',
      announcement: 'megaphone',
      warning: 'alert-triangle',
      error: 'x-circle',
      success: 'check-circle',
    }

    return iconMap[this.type] || 'message-circle'
  }

  getColor(): string {
    const colorMap: Record<string, string> = {
      text: 'blue',
      system: 'gray',
      notification_general: 'blue',
      notification_download: 'green',
      notification_movie: 'purple',
      notification_account: 'orange',
      download: 'green',
      movie: 'purple',
      account: 'orange',
      security_login: 'red',
      security_password: 'red',
      security_device: 'yellow',
      welcome: 'pink',
      announcement: 'indigo',
      warning: 'yellow',
      error: 'red',
      success: 'green',
    }

    return colorMap[this.type] || 'blue'
  }

  // 静态工厂方法
  static text(): MessageType {
    return new MessageType('text', true, true, true)
  }

  static system(): MessageType {
    return new MessageType('system', false, false, false)
  }

  static notification(
    type: 'general' | 'download' | 'movie' | 'account'
  ): MessageType {
    return new MessageType(
      `notification_${type}`,
      false,
      false,
      true,
      7 * 24 * 60 * 60 * 1000
    ) // 7天过期
  }

  static download(): MessageType {
    return new MessageType(
      'download',
      false,
      false,
      true,
      30 * 24 * 60 * 60 * 1000
    ) // 30天过期
  }

  static movie(): MessageType {
    return new MessageType('movie', true, true, true, 90 * 24 * 60 * 60 * 1000) // 90天过期
  }

  static account(): MessageType {
    return new MessageType(
      'account',
      true,
      false,
      true,
      365 * 24 * 60 * 60 * 1000
    ) // 1年过期
  }

  static security(type: 'login' | 'password' | 'device'): MessageType {
    return new MessageType(
      `security_${type}`,
      false,
      false,
      false,
      180 * 24 * 60 * 60 * 1000
    ) // 180天过期
  }

  static welcome(): MessageType {
    return new MessageType(
      'welcome',
      false,
      false,
      false,
      30 * 24 * 60 * 60 * 1000
    ) // 30天过期
  }

  static announcement(): MessageType {
    return new MessageType(
      'announcement',
      false,
      true,
      false,
      60 * 24 * 60 * 60 * 1000
    ) // 60天过期
  }

  static warning(): MessageType {
    return new MessageType(
      'warning',
      false,
      false,
      true,
      7 * 24 * 60 * 60 * 1000
    ) // 7天过期
  }

  static error(): MessageType {
    return new MessageType(
      'error',
      false,
      false,
      true,
      30 * 24 * 60 * 60 * 1000
    ) // 30天过期
  }

  static success(): MessageType {
    return new MessageType(
      'success',
      false,
      false,
      true,
      7 * 24 * 60 * 60 * 1000
    ) // 7天过期
  }

  static fromString(type: string): MessageType {
    switch (type) {
      case 'text':
        return MessageType.text()
      case 'system':
        return MessageType.system()
      case 'download':
        return MessageType.download()
      case 'movie':
        return MessageType.movie()
      case 'account':
        return MessageType.account()
      case 'welcome':
        return MessageType.welcome()
      case 'announcement':
        return MessageType.announcement()
      case 'warning':
        return MessageType.warning()
      case 'error':
        return MessageType.error()
      case 'success':
        return MessageType.success()
      default:
        if (type.startsWith('notification_')) {
          const notificationType = type.replace('notification_', '') as
            | 'general'
            | 'download'
            | 'movie'
            | 'account'
          return MessageType.notification(notificationType)
        }

        if (type.startsWith('security_')) {
          const securityType = type.replace('security_', '') as
            | 'login'
            | 'password'
            | 'device'
          return MessageType.security(securityType)
        }

        // 默认返回文本消息类型
        return MessageType.text()
    }
  }

  // 预定义的消息类型
  static readonly TYPES = {
    TEXT: 'text',
    SYSTEM: 'system',
    NOTIFICATION_GENERAL: 'notification_general',
    NOTIFICATION_DOWNLOAD: 'notification_download',
    NOTIFICATION_MOVIE: 'notification_movie',
    NOTIFICATION_ACCOUNT: 'notification_account',
    DOWNLOAD: 'download',
    MOVIE: 'movie',
    ACCOUNT: 'account',
    SECURITY_LOGIN: 'security_login',
    SECURITY_PASSWORD: 'security_password',
    SECURITY_DEVICE: 'security_device',
    WELCOME: 'welcome',
    ANNOUNCEMENT: 'announcement',
    WARNING: 'warning',
    ERROR: 'error',
    SUCCESS: 'success',
  } as const

  // 验证方法
  static isValidType(type: string): boolean {
    return (
      Object.values(MessageType.TYPES).includes(type as any) ||
      type.startsWith('notification_') ||
      type.startsWith('security_')
    )
  }

  static getAllTypes(): string[] {
    return Object.values(MessageType.TYPES)
  }

  static getSystemTypes(): string[] {
    return [
      MessageType.TYPES.SYSTEM,
      MessageType.TYPES.NOTIFICATION_GENERAL,
      MessageType.TYPES.NOTIFICATION_DOWNLOAD,
      MessageType.TYPES.NOTIFICATION_MOVIE,
      MessageType.TYPES.NOTIFICATION_ACCOUNT,
      MessageType.TYPES.DOWNLOAD,
      MessageType.TYPES.MOVIE,
      MessageType.TYPES.ACCOUNT,
      MessageType.TYPES.SECURITY_LOGIN,
      MessageType.TYPES.SECURITY_PASSWORD,
      MessageType.TYPES.SECURITY_DEVICE,
      MessageType.TYPES.WELCOME,
      MessageType.TYPES.ANNOUNCEMENT,
      MessageType.TYPES.WARNING,
      MessageType.TYPES.ERROR,
      MessageType.TYPES.SUCCESS,
    ]
  }

  static getUserTypes(): string[] {
    return [MessageType.TYPES.TEXT]
  }
}
