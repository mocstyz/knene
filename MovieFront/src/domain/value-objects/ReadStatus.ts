/**
 * 消息读取状态值对象
 * 管理消息的已读/未读状态
 */
export class ReadStatus {
  constructor(
    public readonly isRead: boolean,
    public readonly readAt?: Date,
    public readonly readBy?: string
  ) {
    this.validateReadStatus()
  }

  private validateReadStatus(): void {
    if (this.isRead && !this.readAt) {
      throw new Error('已读消息必须包含读取时间')
    }

    if (this.readAt && this.readAt > new Date()) {
      throw new Error('读取时间不能是未来时间')
    }
  }

  // 业务方法
  markAsRead(readBy?: string): ReadStatus {
    if (this.isRead) {
      return this
    }

    return new ReadStatus(true, new Date(), readBy)
  }

  markAsUnread(): ReadStatus {
    if (!this.isRead) {
      return this
    }

    return new ReadStatus(false)
  }

  getTimeSinceRead(): number | null {
    if (!this.isRead || !this.readAt) {
      return null
    }

    return Date.now() - this.readAt.getTime()
  }

  getTimeSinceReadInHours(): number | null {
    const timeSince = this.getTimeSinceRead()
    return timeSince ? timeSince / (1000 * 60 * 60) : null
  }

  getTimeSinceReadInDays(): number | null {
    const hoursSince = this.getTimeSinceReadInHours()
    return hoursSince ? hoursSince / 24 : null
  }

  isReadRecently(hours: number = 24): boolean {
    if (!this.isRead || !this.readAt) {
      return false
    }

    const hoursSince = this.getTimeSinceReadInHours()
    return hoursSince !== null && hoursSince <= hours
  }

  isReadLongAgo(days: number = 7): boolean {
    if (!this.isRead || !this.readAt) {
      return false
    }

    const daysSince = this.getTimeSinceReadInDays()
    return daysSince !== null && daysSince > days
  }

  getFormattedReadTime(): string | null {
    if (!this.readAt) {
      return null
    }

    const now = new Date()
    const diffMs = now.getTime() - this.readAt.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) {
      return '刚刚'
    } else if (diffMins < 60) {
      return `${diffMins}分钟前`
    } else if (diffHours < 24) {
      return `${diffHours}小时前`
    } else if (diffDays < 7) {
      return `${diffDays}天前`
    } else {
      return this.readAt.toLocaleDateString('zh-CN')
    }
  }

  getReadAtDisplay(): string | null {
    if (!this.readAt) {
      return null
    }

    const now = new Date()
    const isToday = this.readAt.toDateString() === now.toDateString()
    const isYesterday =
      new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() ===
      this.readAt.toDateString()

    if (isToday) {
      return `今天 ${this.readAt.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
    } else if (isYesterday) {
      return `昨天 ${this.readAt.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return this.readAt.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
  }

  // 静态工厂方法
  static unread(): ReadStatus {
    return new ReadStatus(false)
  }

  static read(readBy?: string): ReadStatus {
    return new ReadStatus(true, new Date(), readBy)
  }

  static readAt(readAt: Date, readBy?: string): ReadStatus {
    return new ReadStatus(true, readAt, readBy)
  }

  // 验证方法
  static isValidReadStatus(isRead: boolean, readAt?: Date): boolean {
    if (isRead && !readAt) {
      return false
    }

    if (readAt && readAt > new Date()) {
      return false
    }

    return true
  }

  // 比较方法
  isSameStatus(other: ReadStatus): boolean {
    return (
      this.isRead === other.isRead &&
      this.readAt?.getTime() === other.readAt?.getTime() &&
      this.readBy === other.readBy
    )
  }

  // 序列化方法
  toJSON(): {
    isRead: boolean
    readAt?: string
    readBy?: string
  } {
    return {
      isRead: this.isRead,
      readAt: this.readAt?.toISOString(),
      readBy: this.readBy,
    }
  }

  static fromJSON(data: {
    isRead: boolean
    readAt?: string
    readBy?: string
  }): ReadStatus {
    const readAt = data.readAt ? new Date(data.readAt) : undefined
    return new ReadStatus(data.isRead, readAt, data.readBy)
  }
}
