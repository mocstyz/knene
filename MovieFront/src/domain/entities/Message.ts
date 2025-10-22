/**
 * @fileoverview 消息领域实体定义
 * @description 消息管理领域的核心实体，包含消息详情、消息线程和通知等实体，实现完整的消息生命周期管理
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { MessageContent } from '@domain/value-objects'
import { MessageType } from '@domain/value-objects'
import { ReadStatus } from '@domain/value-objects'

// 消息详情接口，定义单条消息的完整信息结构
export interface MessageDetail {
  id: string // 消息唯一标识
  threadId: string // 消息线程ID
  senderId: string // 发送者ID
  receiverId: string // 接收者ID
  content: MessageContent // 消息内容值对象
  type: MessageType // 消息类型值对象
  readStatus: ReadStatus // 已读状态值对象
  priority: 'low' | 'normal' | 'high' | 'urgent' // 消息优先级
  metadata?: Record<string, unknown> // 元数据信息
  createdAt: Date // 创建时间
  updatedAt: Date // 更新时间
  readAt?: Date // 已读时间
}

// 消息线程接口，定义消息会话的线程信息
export interface MessageThread {
  id: string // 线程唯一标识
  participants: string[] // 参与者ID列表
  subject?: string // 线程主题
  lastMessageAt: Date // 最后一条消息时间
  messageCount: number // 消息总数
  unreadCount: number // 未读消息数
  isActive: boolean // 是否活跃状态
  createdAt: Date // 创建时间
  updatedAt: Date // 更新时间
}

// 通知接口，定义系统通知的结构信息
export interface Notification {
  id: string // 通知唯一标识
  userId: string // 用户ID
  title: string // 通知标题
  content: string // 通知内容
  type: 'system' | 'download' | 'movie' | 'account' | 'social' // 通知类型
  priority: 'low' | 'normal' | 'high' | 'urgent' // 通知优先级
  isRead: boolean // 是否已读
  actionUrl?: string // 操作链接URL
  actionText?: string // 操作按钮文本
  metadata?: Record<string, unknown> // 元数据信息
  expiresAt?: Date // 过期时间
  createdAt: Date // 创建时间
  readAt?: Date // 已读时间
}

// 消息领域实体类，封装消息的业务逻辑和数据管理
export class Message {
  constructor(
    public readonly detail: MessageDetail, // 消息详情信息
    public readonly thread?: MessageThread // 消息线程信息（可选）
  ) {}

  // 标记消息为已读 - 更新已读状态并记录阅读时间
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

  // 标记消息为未读 - 清除已读状态和阅读时间
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

  // 更新消息内容 - 只能在允许编辑的时间内修改
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

  // 更新消息优先级 - 调整消息的紧急程度
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

  // 添加元数据 - 在现有元数据基础上添加新的键值对
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

  // 查询方法区域 - 提供消息状态和属性的便捷查询接口
  isRead(): boolean {
    return this.detail.readStatus.isRead
  }

  // 检查是否为高优先级消息
  isHighPriority(): boolean {
    return this.detail.priority === 'high' || this.detail.priority === 'urgent'
  }

  // 检查是否为紧急消息
  isUrgent(): boolean {
    return this.detail.priority === 'urgent'
  }

  // 获取消息年龄（毫秒） - 从创建时间到当前时间的差值
  getAge(): number {
    return Date.now() - this.detail.createdAt.getTime()
  }

  // 获取消息年龄（小时）
  getAgeInHours(): number {
    return this.getAge() / (1000 * 60 * 60)
  }

  // 获取消息年龄（天）
  getAgeInDays(): number {
    return this.getAgeInHours() / 24
  }

  // 检查消息是否超过指定天数
  isOlderThan(days: number): boolean {
    return this.getAgeInDays() > days
  }

  // 检查是否可以回复 - 需要消息类型支持且线程活跃
  canReply(): boolean {
    return this.detail.type.canReply && (this.thread?.isActive ?? false)
  }

  // 检查是否可以编辑 - 消息发送后30分钟内可以编辑
  canEdit(): boolean {
    return this.getAgeInHours() < 0.5
  }

  // 检查是否可以删除 - 消息发送后24小时内可以删除
  canDelete(): boolean {
    return this.getAgeInHours() < 24
  }

  // 静态工厂方法 - 创建新的消息实例，默认为未读状态
  static create(
    id: string,
    threadId: string,
    senderId: string,
    receiverId: string,
    content: MessageContent,
    type: MessageType,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal' // 默认普通优先级
  ): Message {
    return new Message({
      id,
      threadId,
      senderId,
      receiverId,
      content,
      type,
      readStatus: new ReadStatus(false), // 默认未读状态
      priority,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  // 创建系统消息 - 由系统发送的通知类消息
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

  // 创建下载通知 - 关于下载状态变化的通知消息
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

  // 创建影片推荐消息 - 向用户推荐相关影片的消息
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

  // 生成下载消息内容 - 根据下载状态生成相应的提示文本
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

// 消息线程管理器类，负责管理消息线程的业务逻辑和状态变更
export class MessageThreadManager {
  constructor(private readonly thread: MessageThread) {}

  // 添加消息到线程 - 更新最后消息时间、消息计数和未读计数
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

  // 标记线程中所有消息为已读 - 将未读计数重置为0
  markAllAsRead(): MessageThread {
    return {
      ...this.thread,
      unreadCount: 0,
      updatedAt: new Date(),
    }
  }

  // 添加参与者到线程 - 避免重复添加相同用户
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

  // 从线程中移除参与者 - 根据用户ID移除指定参与者
  removeParticipant(userId: string): MessageThread {
    return {
      ...this.thread,
      participants: this.thread.participants.filter(id => id !== userId),
      updatedAt: new Date(),
    }
  }

  // 更新线程主题 - 修改会话的主题标题
  updateSubject(newSubject: string): MessageThread {
    return {
      ...this.thread,
      subject: newSubject,
      updatedAt: new Date(),
    }
  }

  // 归档线程 - 将线程状态设置为非活跃
  archive(): MessageThread {
    return {
      ...this.thread,
      isActive: false,
      updatedAt: new Date(),
    }
  }

  // 激活线程 - 将线程状态设置为活跃
  activate(): MessageThread {
    return {
      ...this.thread,
      isActive: true,
      updatedAt: new Date(),
    }
  }

  // 检查线程是否包含指定参与者
  hasParticipant(userId: string): boolean {
    return this.thread.participants.includes(userId)
  }

  // 检查线程是否有未读消息
  isUnread(): boolean {
    return this.thread.unreadCount > 0
  }

  // 获取参与者数量
  getParticipantCount(): number {
    return this.thread.participants.length
  }

  // 检查是否为群聊 - 参与者超过2人的会话为群聊
  isGroupChat(): boolean {
    return this.thread.participants.length > 2
  }

  // 静态工厂方法 - 创建新的消息线程
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
      messageCount: 0, // 初始消息数为0
      unreadCount: 0, // 初始未读数为0
      isActive: true, // 初始状态为活跃
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  // 创建直接消息线程 - 两人之间的私聊线程
  static createDirectMessage(
    id: string,
    userId1: string,
    userId2: string
  ): MessageThread {
    return this.create(id, [userId1, userId2])
  }

  // 创建群聊线程 - 多人参与的群组会话，至少需要3个参与者
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
