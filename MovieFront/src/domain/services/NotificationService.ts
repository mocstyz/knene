/**
 * @fileoverview 消息通知领域服务
 * @description 处理消息发送、通知管理和消息路由，提供完整的消息通知体系支持。
 *              包括系统通知、下载通知、电影推荐通知、批量通知、消息管理、会话创建等功能。
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import {
  Message,
  MessageThreadManager,
  Notification,
  MessageThread,
} from '@domain/entities/Message'
import { MessageContent } from '@domain/value-objects/MessageContent'
import { MessageType } from '@domain/value-objects/MessageType'

// 消息通知领域服务，处理消息发送、通知管理和消息路由
export class NotificationService {
  // 发送系统通知，创建消息和通知对象并进行投递
  static async sendSystemNotification(
    userId: string,
    title: string,
    content: string,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Promise<{
    message: Message
    notification: Notification
  }> {
    try {
      // 数据构建 - 创建系统消息对象
      const messageId = this.generateId()
      const message = Message.createSystemMessage(
        messageId,
        userId,
        `${title}\n\n${content}`,
        priority
      )

      // 数据构建 - 创建通知对象
      const notificationId = this.generateId()
      const notification = this.createNotification(
        notificationId,
        userId,
        title,
        content,
        this.getNotificationTypeFromPriority(priority),
        priority
      )

      // 业务逻辑 - 投递消息和通知
      await this.deliverMessage(message)
      await this.deliverNotification(notification)

      return { message, notification }
    } catch (error) {
      console.error('发送系统通知失败:', error)
      throw error
    }
  }

  // 发送下载通知，创建下载状态相关的消息
  static async sendDownloadNotification(
    userId: string,
    movieTitle: string,
    status: 'completed' | 'failed' | 'started',
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Promise<Message> {
    try {
      const messageId = this.generateId()
      const message = Message.createDownloadNotification(
        messageId,
        userId,
        movieTitle,
        status,
        priority
      )

      await this.deliverMessage(message)
      return message
    } catch (error) {
      console.error('发送下载通知失败:', error)
      throw error
    }
  }

  // 发送电影推荐通知，基于用户偏好和历史记录推送相关影片
  static async sendMovieRecommendation(
    userId: string,
    movieTitle: string,
    reason: string,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Promise<Message> {
    try {
      const messageId = this.generateId()
      const message = Message.createMovieRecommendation(
        messageId,
        userId,
        movieTitle,
        reason,
        priority
      )

      await this.deliverMessage(message)
      return message
    } catch (error) {
      console.error('发送电影推荐失败:', error)
      throw error
    }
  }

  // 批量发送通知，支持多用户同时推送相同内容并跟踪失败记录
  static async sendBulkNotification(
    userIds: string[],
    title: string,
    content: string,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Promise<{
    messages: Message[]
    notifications: Notification[]
    failures: { userId: string; error: string }[]
  }> {
    const results = {
      messages: [] as Message[],
      notifications: [] as Notification[],
      failures: [] as { userId: string; error: string }[],
    }

    for (const userId of userIds) {
      try {
        const { message, notification } = await this.sendSystemNotification(
          userId,
          title,
          content,
          priority
        )
        results.messages.push(message)
        results.notifications.push(notification)
      } catch (error) {
        results.failures.push({
          userId,
          error: error instanceof Error ? error.message : '未知错误',
        })
      }
    }

    return results
  }

  // 获取用户未读消息数量，按消息类型分类统计便于消息管理
  static async getUnreadMessageCount(userId: string): Promise<{
    totalMessages: number
    systemMessages: number
    downloadMessages: number
    movieMessages: number
    accountMessages: number
    urgentMessages: number
  }> {
    try {
      // 这里应该从仓储层获取数据
      const userMessages = await this.getUserMessages(userId)
      const unreadMessages = userMessages.filter(msg => !msg.isRead())

      return {
        totalMessages: unreadMessages.length,
        systemMessages: unreadMessages.filter(msg =>
          msg.detail.type.isSystemMessage()
        ).length,
        downloadMessages: unreadMessages.filter(msg =>
          msg.detail.type.isDownloadMessage()
        ).length,
        movieMessages: unreadMessages.filter(msg =>
          msg.detail.type.isMovieMessage()
        ).length,
        accountMessages: unreadMessages.filter(msg =>
          msg.detail.type.isAccountMessage()
        ).length,
        urgentMessages: unreadMessages.filter(msg => msg.isUrgent()).length,
      }
    } catch (error) {
      console.error('获取未读消息数量失败:', error)
      throw error
    }
  }

  // 标记消息为已读，验证消息所有权和权限确保操作安全性
  static async markMessageAsRead(
    messageId: string,
    userId: string
  ): Promise<Message> {
    try {
      const message = await this.getMessageById(messageId)
      if (!message) {
        throw new Error('消息不存在')
      }

      if (message.detail.receiverId !== userId) {
        throw new Error('无权限操作此消息')
      }

      const readMessage = message.markAsRead()
      await this.saveMessage(readMessage)

      return readMessage
    } catch (error) {
      console.error('标记消息已读失败:', error)
      throw error
    }
  }

  // 批量标记消息为已读，处理多个消息并跟踪成功失败的执行结果
  static async markMessagesAsRead(
    messageIds: string[],
    userId: string
  ): Promise<{
    successful: string[]
    failed: { messageId: string; error: string }[]
  }> {
    const results = {
      successful: [] as string[],
      failed: [] as { messageId: string; error: string }[],
    }

    for (const messageId of messageIds) {
      try {
        await this.markMessageAsRead(messageId, userId)
        results.successful.push(messageId)
      } catch (error) {
        results.failed.push({
          messageId,
          error: error instanceof Error ? error.message : '未知错误',
        })
      }
    }

    return results
  }

  // 删除过期消息，基于消息类型和创建时间自动清理过期内容
  static async cleanupExpiredMessages(): Promise<number> {
    try {
      const allMessages = await this.getAllMessages()
      const expiredMessages = allMessages.filter(msg =>
        msg.detail.type.isExpired(msg.detail.createdAt)
      )

      let deletedCount = 0
      for (const message of expiredMessages) {
        try {
          await this.deleteMessage(message.detail.id)
          deletedCount++
        } catch (error) {
          console.error(`删除过期消息失败 ${message.detail.id}:`, error)
        }
      }

      return deletedCount
    } catch (error) {
      console.error('清理过期消息失败:', error)
      throw error
    }
  }

  // 创建消息会话，支持多用户会话管理和初始消息设置
  static async createMessageThread(
    participants: string[],
    subject?: string,
    initialMessage?: {
      senderId: string
      content: string
    }
  ): Promise<{
    thread: MessageThreadManager
    message?: Message
  }> {
    try {
      const threadId = this.generateId()
      const thread = MessageThreadManager.create(
        threadId,
        participants,
        subject
      )

      let message: Message | undefined
      if (initialMessage) {
        const messageId = this.generateId()
        message = Message.create(
          messageId,
          threadId,
          initialMessage.senderId,
          participants.find(p => p !== initialMessage.senderId)!,
          new MessageContent(initialMessage.content),
          MessageType.text()
        )
      }

      // 保存会话和消息
      await this.saveMessageThread(thread)
      if (message) {
        await this.saveMessage(message)
      }

      return { thread: new MessageThreadManager(thread), message }
    } catch (error) {
      console.error('创建消息会话失败:', error)
      throw error
    }
  }

  // 发送安全警告，针对登录、密码、设备等安全事件发送高优先级警告
  static async sendSecurityWarning(
    userId: string,
    warningType: 'login' | 'password' | 'device',
    details: string
  ): Promise<Message> {
    try {
      const messageId = this.generateId()
      const type = MessageType.security(warningType)

      const content = this.generateSecurityWarningContent(warningType, details)
      const message = Message.create(
        messageId,
        `security-${userId}`,
        'system',
        userId,
        new MessageContent(content),
        type,
        'high'
      )

      await this.deliverMessage(message)
      return message
    } catch (error) {
      console.error('发送安全警告失败:', error)
      throw error
    }
  }

  // 私有辅助方法

  // 生成唯一消息ID标识符
  private static generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 创建通知对象，封装通知的基本属性和状态
  private static createNotification(
    id: string,
    userId: string,
    title: string,
    content: string,
    type: 'system' | 'download' | 'movie' | 'account' | 'social',
    priority: 'low' | 'normal' | 'high' | 'urgent'
  ): Notification {
    return {
      id,
      userId,
      title,
      content,
      type,
      priority,
      isRead: false,
      createdAt: new Date(),
    }
  }

  // 根据优先级映射通知类型，高优先级作为系统通知
  private static getNotificationTypeFromPriority(
    priority: 'low' | 'normal' | 'high' | 'urgent'
  ): 'system' | 'download' | 'movie' | 'account' | 'social' {
    // 根据优先级确定通知类型
    switch (priority) {
      case 'urgent':
      case 'high':
        return 'system' // 高优先级通知作为系统通知
      case 'normal':
        return 'account' // 普通通知作为账户通知
      case 'low':
        return 'social' // 低优先级通知作为社交通知
      default:
        return 'system'
    }
  }

  // 投递消息到用户，调用消息基础设施服务进行消息分发
  private static async deliverMessage(message: Message): Promise<void> {
    // 这里应该调用消息基础设施服务
    console.log(
      `投递消息: ${message.detail.id} 到 ${message.detail.receiverId}`
    )
  }

  // 投递通知到用户设备，调用通知基础设施服务进行推送
  private static async deliverNotification(
    notification: Notification
  ): Promise<void> {
    // 这里应该调用通知基础设施服务
    console.log(`投递通知: ${notification.id} 到 ${notification.userId}`)
  }

  // 保存消息到数据库，调用消息仓储进行持久化存储
  private static async saveMessage(message: Message): Promise<void> {
    // 这里应该调用消息仓储
    console.log(`保存消息: ${message.detail.id}`)
  }

  // 保存消息会话到数据库，调用会话仓储进行持久化存储
  private static async saveMessageThread(thread: MessageThread): Promise<void> {
    // 这里应该调用会话仓储
    console.log(`保存消息会话: ${thread.id}`)
  }

  // 从数据库获取用户的所有消息，调用消息仓储进行数据查询
  private static async getUserMessages(_userId: string): Promise<Message[]> {
    // 这里应该从消息仓储获取
    return []
  }

  // 根据消息ID从数据库获取单条消息，调用消息仓储进行精确查询
  private static async getMessageById(
    _messageId: string
  ): Promise<Message | null> {
    // 这里应该从消息仓储获取
    return null
  }

  // 从数据库获取所有消息，用于过期消息清理等批量操作
  private static async getAllMessages(): Promise<Message[]> {
    // 这里应该从消息仓储获取
    return []
  }

  // 从数据库删除消息，调用消息仓储进行数据删除操作
  private static async deleteMessage(messageId: string): Promise<void> {
    // 这里应该调用消息仓储
    console.log(`删除消息: ${messageId}`)
  }

  // 生成安全警告消息内容，根据警告类型使用对应的消息模板
  private static generateSecurityWarningContent(
    warningType: 'login' | 'password' | 'device' | 'suspicious',
    details: string
  ): string {
    const templates = {
      login: `登录安全提醒\n\n${details}\n\n如果这不是您本人的操作，请立即修改密码并联系客服。`,
      password: `密码变更提醒\n\n${details}\n\n如果这不是您本人的操作，请立即联系客服。`,
      device: `新设备登录提醒\n\n${details}\n\n如果这不是您本人的操作，请立即修改密码。`,
      suspicious: `账户安全警告\n\n${details}\n\n我们检测到可疑活动，请检查您的账户安全设置。`,
    }

    return templates[warningType] || `安全提醒\n\n${details}`
  }
}
