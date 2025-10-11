import { MessageContent } from '@domain/value-objects'
import { MessageType } from '@domain/value-objects'
import { ReadStatus } from '@domain/value-objects'

export interface MessageDetail {
  id: string
  threadId: string
  senderId: string
  receiverId: string
  content: MessageContent
  type: MessageType
  readStatus: ReadStatus
  priority: 'low' | 'normal' | 'high' | 'urgent'
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
  readAt?: Date
}

export interface MessageThread {
  id: string
  participants: string[]
  subject?: string
  lastMessageAt: Date
  messageCount: number
  unreadCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  title: string
  content: string
  type: 'system' | 'download' | 'movie' | 'account' | 'social'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  isRead: boolean
  actionUrl?: string
  actionText?: string
  metadata?: Record<string, unknown>
  expiresAt?: Date
  createdAt: Date
  readAt?: Date
}

export class Message {
  constructor(
    public readonly detail: MessageDetail,
    public readonly thread?: MessageThread
  ) {}

  // 业务方法
  markAsRead(): Message {
    if (this.detail.readStatus.isRead) {
      return this
    }

    return new Message(
      {
        ...this.detail,
        readStatus: new ReadStatus(true),
        readAt: new Date(),
        updatedAt: new Date(),
      },
      this.thread
    )
  }

  markAsUnread(): Message {
    if (!this.detail.readStatus.isRead) {
      return this
    }

    return new Message(
      {
        ...this.detail,
        readStatus: new ReadStatus(false),
        readAt: undefined,
        updatedAt: new Date(),
      },
      this.thread
    )
  }

  updateContent(newContent: MessageContent): Message {
    return new Message(
      {
        ...this.detail,
        content: newContent,
        updatedAt: new Date(),
      },
      this.thread
    )
  }

  updatePriority(newPriority: 'low' | 'normal' | 'high' | 'urgent'): Message {
    return new Message(
      {
        ...this.detail,
        priority: newPriority,
        updatedAt: new Date(),
      },
      this.thread
    )
  }

  addMetadata(key: string, value: unknown): Message {
    return new Message(
      {
        ...this.detail,
        metadata: {
          ...this.detail.metadata,
          [key]: value,
        },
        updatedAt: new Date(),
      },
      this.thread
    )
  }

  // 查询方法
  isRead(): boolean {
    return this.detail.readStatus.isRead
  }

  isHighPriority(): boolean {
    return this.detail.priority === 'high' || this.detail.priority === 'urgent'
  }

  isUrgent(): boolean {
    return this.detail.priority === 'urgent'
  }

  getAge(): number {
    return Date.now() - this.detail.createdAt.getTime()
  }

  getAgeInHours(): number {
    return this.getAge() / (1000 * 60 * 60)
  }

  getAgeInDays(): number {
    return this.getAgeInHours() / 24
  }

  isOlderThan(days: number): boolean {
    return this.getAgeInDays() > days
  }

  canReply(): boolean {
    return this.detail.type.canReply && (this.thread?.isActive ?? false)
  }

  canEdit(): boolean {
    // 消息发送后30分钟内可以编辑
    return this.getAgeInHours() < 0.5
  }

  canDelete(): boolean {
    // 消息发送后24小时内可以删除
    return this.getAgeInHours() < 24
  }

  // 静态工厂方法
  static create(
    id: string,
    threadId: string,
    senderId: string,
    receiverId: string,
    content: MessageContent,
    type: MessageType,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Message {
    return new Message({
      id,
      threadId,
      senderId,
      receiverId,
      content,
      type,
      readStatus: new ReadStatus(false),
      priority,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static createSystemMessage(
    id: string,
    receiverId: string,
    content: string,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Message {
    return Message.create(
      id,
      `system-${id}`,
      'system',
      receiverId,
      new MessageContent(content),
      new MessageType('system', false),
      priority
    )
  }

  static createDownloadNotification(
    id: string,
    receiverId: string,
    movieTitle: string,
    status: 'completed' | 'failed' | 'started',
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Message {
    const content = this.generateDownloadMessageContent(movieTitle, status)
    const type = new MessageType('download', false)

    return Message.create(
      id,
      `download-${receiverId}`,
      'system',
      receiverId,
      new MessageContent(content),
      type,
      priority
    )
  }

  static createMovieRecommendation(
    id: string,
    receiverId: string,
    movieTitle: string,
    reason: string,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Message {
    const content = `为您推荐电影《${movieTitle}》${reason ? `：${reason}` : ''}`
    const type = new MessageType('movie', true)

    return Message.create(
      id,
      `recommendation-${receiverId}`,
      'system',
      receiverId,
      new MessageContent(content),
      type,
      priority
    )
  }

  private static generateDownloadMessageContent(
    movieTitle: string,
    status: string
  ): string {
    switch (status) {
      case 'completed':
        return `电影《${movieTitle}》下载完成，可以在本地播放了！`
      case 'failed':
        return `电影《${movieTitle}》下载失败，请检查网络连接后重试`
      case 'started':
        return `电影《${movieTitle}》开始下载`
      default:
        return `电影《${movieTitle}》下载状态更新：${status}`
    }
  }
}

export class MessageThreadManager {
  constructor(private readonly thread: MessageThread) {}

  addMessage(message: Message): MessageThread {
    return {
      ...this.thread,
      lastMessageAt: message.detail.createdAt,
      messageCount: this.thread.messageCount + 1,
      unreadCount: message.detail.readStatus.isRead
        ? this.thread.unreadCount
        : this.thread.unreadCount + 1,
      updatedAt: new Date(),
    }
  }

  markAllAsRead(): MessageThread {
    return {
      ...this.thread,
      unreadCount: 0,
      updatedAt: new Date(),
    }
  }

  addParticipant(userId: string): MessageThread {
    if (this.thread.participants.includes(userId)) {
      return this.thread
    }

    return {
      ...this.thread,
      participants: [...this.thread.participants, userId],
      updatedAt: new Date(),
    }
  }

  removeParticipant(userId: string): MessageThread {
    return {
      ...this.thread,
      participants: this.thread.participants.filter(id => id !== userId),
      updatedAt: new Date(),
    }
  }

  updateSubject(newSubject: string): MessageThread {
    return {
      ...this.thread,
      subject: newSubject,
      updatedAt: new Date(),
    }
  }

  archive(): MessageThread {
    return {
      ...this.thread,
      isActive: false,
      updatedAt: new Date(),
    }
  }

  activate(): MessageThread {
    return {
      ...this.thread,
      isActive: true,
      updatedAt: new Date(),
    }
  }

  hasParticipant(userId: string): boolean {
    return this.thread.participants.includes(userId)
  }

  isUnread(): boolean {
    return this.thread.unreadCount > 0
  }

  getParticipantCount(): number {
    return this.thread.participants.length
  }

  isGroupChat(): boolean {
    return this.thread.participants.length > 2
  }

  // 静态工厂方法
  static create(
    id: string,
    participants: string[],
    subject?: string
  ): MessageThread {
    return {
      id,
      participants,
      subject,
      lastMessageAt: new Date(),
      messageCount: 0,
      unreadCount: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  static createDirectMessage(
    id: string,
    userId1: string,
    userId2: string
  ): MessageThread {
    return this.create(id, [userId1, userId2])
  }

  static createGroupChat(
    id: string,
    participants: string[],
    subject: string
  ): MessageThread {
    if (participants.length < 3) {
      throw new Error('群聊至少需要3个参与者')
    }

    return this.create(id, participants, subject)
  }
}
