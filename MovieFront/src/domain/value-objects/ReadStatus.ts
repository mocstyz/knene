/**
 * @fileoverview 消息读取状态值对象
 * @description 消息读取状态值对象，管理消息的已读/未读状态，包括读取时间、读取者等信息的跟踪和管理
 * @created 2025-10-09 13:10:49
 * @updated 2025-10-19 10:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 消息读取状态值对象，管理消息的已读/未读状态
export class ReadStatus {
  constructor(
    public readonly isRead: boolean,
    public readonly readAt?: Date,
    public readonly readBy?: string
  ) {
    this.validateReadStatus()
  }

  // 验证读取状态
  private validateReadStatus(): void {
    if (this.isRead && !this.readAt) {
      throw new Error('已读消息必须包含读取时间')
    }

    if (this.readAt && this.readAt > new Date()) {
      throw new Error('读取时间不能是未来时间')
    }
  }

  // 标记为已读
  markAsRead(readBy?: string): ReadStatus {
    if (this.isRead) {
      return this
    }

    return new ReadStatus(true, new Date(), readBy)
  }

  // 标记为未读
  markAsUnread(): ReadStatus {
    if (!this.isRead) {
      return this
    }

    return new ReadStatus(false)
  }

  // 获取读取时间差（毫秒）
  getTimeSinceRead(): number | null {
    if (!this.isRead || !this.readAt) {
      return null
    }

    return Date.now() - this.readAt.getTime()
  }

  // 获取读取时间差（小时）
  getTimeSinceReadInHours(): number | null {
    const timeSince = this.getTimeSinceRead()
    if (timeSince === null) return null
    return timeSince / (1000 * 60 * 60)
  }

  // 获取读取时间差（天数）
  getTimeSinceReadInDays(): number | null {
    const timeSince = this.getTimeSinceRead()
    if (timeSince === null) return null
    return timeSince / (1000 * 60 * 60 * 24)
  }

  // 获取读取状态文本
  getStatusText(): string {
    return this.isRead ? '已读' : '未读'
  }

  // 获取读取状态图标
  getStatusIcon(): string {
    return this.isRead ? '✓' : '○'
  }

  // 获取读取状态颜色
  getStatusColor(): string {
    return this.isRead ? 'text-gray-500' : 'text-blue-600'
  }

  // 检查是否为最近读取（24小时内）
  isRecentlyRead(): boolean {
    if (!this.isRead || !this.readAt) return false

    const hoursSince = this.getTimeSinceReadInHours()
    return hoursSince !== null && hoursSince <= 24
  }

  // 检查是否为刚读取（1小时内）
  isJustRead(): boolean {
    if (!this.isRead || !this.readAt) return false

    const hoursSince = this.getTimeSinceReadInHours()
    return hoursSince !== null && hoursSince <= 1
  }

  // 检查是否为重要消息（已读且有时间记录）
  isImportant(): boolean {
    return this.isRead && !!this.readAt && !!this.readBy
  }

  // 获取格式化的读取时间
  getFormattedReadTime(): string {
    if (!this.readAt) return ''

    const now = new Date()
    const diffInHours = this.getTimeSinceReadInHours() || 0

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((this.getTimeSinceRead() || 0) / (1000 * 60))
      return diffInMinutes <= 1 ? '刚刚' : `${diffInMinutes}分钟前`
    }

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}小时前`
    }

    if (diffInHours < 24 * 7) {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}天前`
    }

    // 超过一周显示具体日期
    return this.readAt.toLocaleDateString('zh-CN')
  }

  // 检查读取者是否为指定用户
  isReadBy(userId: string): boolean {
    return this.isRead && this.readBy === userId
  }

  // 更新读取者
  updateReader(newReader: string): ReadStatus {
    if (!this.isRead) {
      throw new Error('未读消息不能更新读取者')
    }

    return new ReadStatus(true, this.readAt, newReader)
  }

  // 比较两个读取状态
  compare(other: ReadStatus): number {
    // 已读优先于未读
    if (this.isRead !== other.isRead) {
      return this.isRead ? -1 : 1
    }

    // 如果都是已读，比较读取时间
    if (this.isRead && other.isRead && this.readAt && other.readAt) {
      return other.readAt.getTime() - this.readAt.getTime()
    }

    return 0
  }

  // 转换为JSON格式
  toJSON(): {
    isRead: boolean
    readAt?: string
    readBy?: string
  } {
    return {
      isRead: this.isRead,
      readAt: this.readAt?.toISOString(),
      readBy: this.readBy
    }
  }

  // 转换为字符串
  toString(): string {
    if (!this.isRead) return '未读'
    if (!this.readAt) return '已读'
    return `已读于 ${this.getFormattedReadTime()}`
  }

  // ========== 静态工厂方法 ==========

  // 创建未读状态
  static unread(): ReadStatus {
    return new ReadStatus(false)
  }

  // 创建已读状态
  static read(readBy?: string): ReadStatus {
    return new ReadStatus(true, new Date(), readBy)
  }

  // 创建指定时间的已读状态
  static readAt(readAt: Date, readBy?: string): ReadStatus {
    return new ReadStatus(true, readAt, readBy)
  }

  // 从JSON创建读取状态
  static fromJSON(json: {
    isRead: boolean
    readAt?: string
    readBy?: string
  }): ReadStatus {
    return new ReadStatus(
      json.isRead,
      json.readAt ? new Date(json.readAt) : undefined,
      json.readBy
    )
  }

  // 批量标记为已读
  static markMultipleAsRead(
    statuses: ReadStatus[],
    readBy?: string
  ): ReadStatus[] {
    return statuses.map(status => status.markAsRead(readBy))
  }

  // 批量标记为未读
  static markMultipleAsUnread(statuses: ReadStatus[]): ReadStatus[] {
    return statuses.map(status => status.markAsUnread())
  }

  // 统计已读数量
  static countRead(statuses: ReadStatus[]): number {
    return statuses.filter(status => status.isRead).length
  }

  // 统计未读数量
  static countUnread(statuses: ReadStatus[]): number {
    return statuses.filter(status => !status.isRead).length
  }

  // 获取未读状态列表
  static getUnread(statuses: ReadStatus[]): ReadStatus[] {
    return statuses.filter(status => !status.isRead)
  }

  // 获取已读状态列表
  static getRead(statuses: ReadStatus[]): ReadStatus[] {
    return statuses.filter(status => status.isRead)
  }

  // 获取最近读取的状态列表
  static getRecentlyRead(statuses: ReadStatus[], hours: number = 24): ReadStatus[] {
    return statuses.filter(status => {
      if (!status.isRead || !status.readAt) return false

      const hoursSince = status.getTimeSinceReadInHours()
      return hoursSince !== null && hoursSince <= hours
    })
  }

  // 按读取时间排序
  static sortByReadTime(statuses: ReadStatus[]): ReadStatus[] {
    return [...statuses].sort((a, b) => a.compare(b))
  }

  // 按读取时间倒序排序
  static sortByReadTimeDesc(statuses: ReadStatus[]): ReadStatus[] {
    return [...statuses].sort((a, b) => b.compare(a))
  }

  // 获取指定用户的已读状态
  static getReadByUser(statuses: ReadStatus[], userId: string): ReadStatus[] {
    return statuses.filter(status => status.isReadBy(userId))
  }

  // 计算读取率
  static calculateReadRate(statuses: ReadStatus[]): number {
    if (statuses.length === 0) return 0
    const readCount = ReadStatus.countRead(statuses)
    return Math.round((readCount / statuses.length) * 100)
  }

  // 获取读取率文本
  static getReadRateText(statuses: ReadStatus[]): string {
    const rate = ReadStatus.calculateReadRate(statuses)
    return `${rate}% (${ReadStatus.countRead(statuses)}/${statuses.length})`
  }

  // 检查是否有未读消息
  static hasUnread(statuses: ReadStatus[]): boolean {
    return statuses.some(status => !status.isRead)
  }

  // 检查是否全部已读
  static isAllRead(statuses: ReadStatus[]): boolean {
    return statuses.every(status => status.isRead)
  }
}