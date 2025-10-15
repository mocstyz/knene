/**
 * 事件总线基础设施
 * 实现领域事件的发布订阅机制，支持跨组件通信和领域事件处理
 */

export interface DomainEvent {
  type: string
  payload: unknown
  aggregateId?: string
  version?: number
  timestamp: Date
  correlationId?: string
  causationId?: string
}

export interface EventHandler<T extends DomainEvent = DomainEvent> {
  handle(event: T): void | Promise<void>
}

export interface EventSubscription {
  unsubscribe(): void
}

export interface EventBusOptions {
  enablePersistence?: boolean
  enableCrossPageSync?: boolean
  maxRetries?: number
  retryDelay?: number
}

/**
 * 事件总线类
 * 提供事件发布、订阅、持久化和跨页面同步功能
 */
export class EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map()
  private eventHistory: DomainEvent[] = []
  private broadcastChannel?: BroadcastChannel
  private options: Required<EventBusOptions>

  // 为未来优化保留的字段
  private _isProcessing = false
  private _eventQueue: DomainEvent[] = []

  constructor(options: EventBusOptions = {}) {
    this.options = {
      enablePersistence: true,
      enableCrossPageSync: true,
      maxRetries: 3,
      retryDelay: 1000,
      ...options,
    } as Required<EventBusOptions>

    this.setupCrossPageSync()
    this.setupPersistence()
    this.setupErrorHandling()
  }

  /**
   * 发布事件
   */
  async publish<T extends DomainEvent>(event: T): Promise<void> {
    // 添加时间戳和相关ID
    const enrichedEvent: T = {
      ...event,
      timestamp: event.timestamp || new Date(),
      correlationId: event.correlationId || this.generateId(),
      causationId: event.causationId,
    }

    // 添加到事件历史
    if (this.options.enablePersistence) {
      this.eventHistory.push(enrichedEvent)
      this.persistEvent(enrichedEvent)
    }

    // 跨页面同步
    if (this.options.enableCrossPageSync && this.broadcastChannel) {
      this.broadcastChannel.postMessage(enrichedEvent)
    }

    // 处理事件
    await this.processEvent(enrichedEvent)
  }

  /**
   * 订阅事件
   */
  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): EventSubscription {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set())
    }

    const handlers = this.handlers.get(eventType)!
    handlers.add(handler as EventHandler)

    return {
      unsubscribe: () => {
        handlers.delete(handler as EventHandler)
        if (handlers.size === 0) {
          this.handlers.delete(eventType)
        }
      },
    }
  }

  /**
   * 订阅多个事件类型
   */
  subscribeToMultiple<T extends DomainEvent>(
    eventTypes: string[],
    handler: EventHandler<T>
  ): EventSubscription {
    const subscriptions = eventTypes.map(eventType =>
      this.subscribe(eventType, handler)
    )

    return {
      unsubscribe: () => {
        subscriptions.forEach(sub => sub.unsubscribe())
      },
    }
  }

  /**
   * 一次性订阅
   */
  subscribeOnce<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): EventSubscription {
    const subscription = this.subscribe(eventType, {
      handle: async (event: T) => {
        await handler.handle(event)
        subscription.unsubscribe()
      },
    })

    return subscription
  }

  /**
   * 条件订阅
   */
  subscribeWhen<T extends DomainEvent>(
    eventType: string,
    condition: (event: T) => boolean,
    handler: EventHandler<T>
  ): EventSubscription {
    return this.subscribe(eventType, {
      handle: async (event: T) => {
        if (condition(event)) {
          await handler.handle(event)
        }
      },
    })
  }

  /**
   * 获取事件历史
   */
  getEventHistory(
    eventType?: string,
    aggregateId?: string,
    limit?: number
  ): DomainEvent[] {
    let events = this.eventHistory

    if (eventType) {
      events = events.filter(event => event.type === eventType)
    }

    if (aggregateId) {
      events = events.filter(event => event.aggregateId === aggregateId)
    }

    if (limit) {
      events = events.slice(-limit)
    }

    return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }

  /**
   * 清除事件历史
   */
  clearEventHistory(eventType?: string, aggregateId?: string): void {
    if (!eventType && !aggregateId) {
      this.eventHistory = []
      this.clearPersistedEvents()
      return
    }

    this.eventHistory = this.eventHistory.filter(event => {
      if (eventType && event.type === eventType) return false
      if (aggregateId && event.aggregateId === aggregateId) return false
      return true
    })

    this.persistEventHistory()
  }

  /**
   * 重放事件
   */
  async replayEvents(
    eventType?: string,
    aggregateId?: string,
    fromTimestamp?: Date
  ): Promise<void> {
    const events = this.getEventHistory(eventType, aggregateId)
    const filteredEvents = fromTimestamp
      ? events.filter(event => event.timestamp >= fromTimestamp)
      : events

    for (const event of filteredEvents) {
      await this.processEvent(event)
    }
  }

  /**
   * 获取订阅统计
   */
  getSubscriptionStats(): Record<string, number> {
    const stats: Record<string, number> = {}

    this.handlers.forEach((handlers, eventType) => {
      stats[eventType] = handlers.size
    })

    return stats
  }

  /**
   * 销毁事件总线
   */
  destroy(): void {
    this.handlers.clear()
    this.eventHistory = []

    if (this.broadcastChannel) {
      this.broadcastChannel.close()
    }

    this.clearPersistedEvents()
  }

  /**
   * 处理事件
   */
  private async processEvent(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.type)
    if (!handlers || handlers.size === 0) {
      return
    }

    // 并行处理所有处理器
    const promises = Array.from(handlers).map(handler =>
      this.executeHandler(handler, event)
    )

    await Promise.allSettled(promises)
  }

  /**
   * 执行事件处理器（带重试机制）
   */
  private async executeHandler(
    handler: EventHandler,
    event: DomainEvent,
    attempt = 1
  ): Promise<void> {
    try {
      await handler.handle(event)
    } catch (error) {
      console.error(`Event handler failed for ${event.type}:`, error)

      if (attempt < this.options.maxRetries) {
        await this.delay(this.options.retryDelay * attempt)
        return this.executeHandler(handler, event, attempt + 1)
      }

      // 发布错误事件
      this.publish({
        type: 'EventHandlerFailed',
        payload: {
          originalEvent: event,
          error: error instanceof Error ? error.message : String(error),
          attempts: attempt,
        },
        timestamp: new Date(),
      })
    }
  }

  /**
   * 设置跨页面同步
   */
  private setupCrossPageSync(): void {
    if (
      !this.options.enableCrossPageSync ||
      typeof BroadcastChannel === 'undefined'
    ) {
      return
    }

    this.broadcastChannel = new BroadcastChannel('domain-events')

    this.broadcastChannel.addEventListener('message', event => {
      const domainEvent = event.data as DomainEvent
      this.handleIncomingEvent(domainEvent)
    })

    // 页面可见性变化时同步事件
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.syncEventsFromStorage()
      }
    })
  }

  /**
   * 处理来自其他页面的事件
   */
  private async handleIncomingEvent(event: DomainEvent): Promise<void> {
    // 避免重复处理
    const isDuplicate = this.eventHistory.some(
      existingEvent =>
        existingEvent.correlationId === event.correlationId &&
        existingEvent.timestamp.getTime() === event.timestamp.getTime()
    )

    if (isDuplicate) {
      return
    }

    // 添加到历史记录
    this.eventHistory.push(event)

    // 处理事件
    await this.processEvent(event)
  }

  /**
   * 设置持久化
   */
  private setupPersistence(): void {
    if (!this.options.enablePersistence) {
      return
    }

    // 从localStorage恢复事件历史
    this.loadPersistedEvents()

    // 定期清理过期事件
    setInterval(() => {
      this.cleanupExpiredEvents()
    }, 60000) // 每分钟清理一次
  }

  /**
   * 持久化事件
   */
  private persistEvent(event: DomainEvent): void {
    try {
      const storedEvents = JSON.parse(
        localStorage.getItem('event-bus-history') || '[]'
      )

      storedEvents.push({
        ...event,
        timestamp: event.timestamp.toISOString(),
      })

      // 只保留最近1000个事件
      const recentEvents = storedEvents.slice(-1000)
      localStorage.setItem('event-bus-history', JSON.stringify(recentEvents))
    } catch (error) {
      console.warn('Failed to persist event:', error)
    }
  }

  /**
   * 持久化事件历史
   */
  private persistEventHistory(): void {
    try {
      const eventsToStore = this.eventHistory.map(event => ({
        ...event,
        timestamp: event.timestamp.toISOString(),
      }))

      localStorage.setItem('event-bus-history', JSON.stringify(eventsToStore))
    } catch (error) {
      console.warn('Failed to persist event history:', error)
    }
  }

  /**
   * 加载持久化的事件
   */
  private loadPersistedEvents(): void {
    try {
      const storedEvents = JSON.parse(
        localStorage.getItem('event-bus-history') || '[]'
      )

      this.eventHistory = storedEvents.map(
        (event: DomainEvent & { timestamp: string }) => ({
          ...event,
          timestamp: new Date(event.timestamp),
        })
      )
    } catch (error) {
      console.warn('Failed to load persisted events:', error)
      this.eventHistory = []
    }
  }

  /**
   * 清除持久化的事件
   */
  private clearPersistedEvents(): void {
    localStorage.removeItem('event-bus-history')
  }

  /**
   * 从存储同步事件
   */
  private async syncEventsFromStorage(): Promise<void> {
    const storedEvents = JSON.parse(
      localStorage.getItem('cross-page-events') || '[]'
    )

    for (const eventData of storedEvents) {
      const event = {
        ...eventData,
        timestamp: new Date(eventData.timestamp),
      } as DomainEvent

      await this.handleIncomingEvent(event)
    }

    localStorage.removeItem('cross-page-events')
  }

  /**
   * 清理过期事件
   */
  private cleanupExpiredEvents(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    this.eventHistory = this.eventHistory.filter(
      event => event.timestamp > oneDayAgo
    )

    this.persistEventHistory()
  }

  /**
   * 设置错误处理
   */
  private setupErrorHandling(): void {
    window.addEventListener('unhandledrejection', event => {
      console.error('Unhandled promise rejection in EventBus:', event.reason)
    })
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// 创建默认事件总线实例
export const eventBus = new EventBus()
