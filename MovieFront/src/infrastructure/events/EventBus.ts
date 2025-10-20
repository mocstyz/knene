/**
 * @fileoverview 事件总线基础设施
 * @description 实现领域事件的发布订阅机制，支持跨组件通信和领域事件处理。
 *              提供事件持久化、跨页面同步、重试机制和错误处理等完整功能。
 *              遵循DDD架构中的事件驱动设计模式，支持事件溯源和分布式追踪。
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-19 15:06:15
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 领域事件接口，定义领域事件的标准结构，支持事件溯源和分布式追踪
export interface DomainEvent {
  type: string // 事件类型，用于标识不同的业务事件
  payload: unknown // 事件载荷，包含事件相关的业务数据
  aggregateId?: string // 聚合根ID，关联到具体的业务实体
  version?: number // 事件版本，支持事件演进和兼容性管理
  timestamp: Date // 事件时间戳，记录事件发生时间
  correlationId?: string // 关联ID，用于追踪相关的业务流程
  causationId?: string // 因果ID，记录触发当前事件的源头事件
}

// 事件处理器接口，定义事件处理器的标准契约
export interface EventHandler<T extends DomainEvent = DomainEvent> {
  handle(event: T): void | Promise<void> // 处理领域事件的方法，支持同步和异步处理
}

// 事件订阅接口，提供事件订阅的管理能力
export interface EventSubscription {
  unsubscribe(): void // 取消事件订阅的方法
}

// 事件总线配置选项接口，定义事件总线的可配置参数
export interface EventBusOptions {
  enablePersistence?: boolean // 是否启用事件持久化
  enableCrossPageSync?: boolean // 是否启用跨页面事件同步
  maxRetries?: number // 事件处理失败的最大重试次数
  retryDelay?: number // 重试延迟时间（毫秒）
}

// 事件总线类，提供完整的事件发布订阅基础设施，支持企业级特性
export class EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map() // 事件处理器映射表
  private eventHistory: DomainEvent[] = [] // 事件历史记录
  private broadcastChannel?: BroadcastChannel // 跨页面广播频道
  private options: Required<EventBusOptions> // 配置选项

  // 为未来优化保留的字段 - 支持事件队列和批处理
  private _isProcessing = false // 处理状态标识
  private _eventQueue: DomainEvent[] = [] // 事件队列

  constructor(options: EventBusOptions = {}) {
    // 设置默认配置 - 提供企业级的默认值
    this.options = {
      enablePersistence: true, // 默认启用持久化
      enableCrossPageSync: true, // 默认启用跨页面同步
      maxRetries: 3, // 默认重试3次
      retryDelay: 1000, // 默认延迟1秒
      ...options,
    } as Required<EventBusOptions>

    this.setupCrossPageSync() // 设置跨页面同步
    this.setupPersistence() // 设置事件持久化
    this.setupErrorHandling() // 设置错误处理机制
  }

  // 发布领域事件，支持事件增强、持久化和跨页面同步
  async publish<T extends DomainEvent>(event: T): Promise<void> {
    // 事件增强 - 添加时间戳和追踪ID
    const enrichedEvent: T = {
      ...event,
      timestamp: event.timestamp || new Date(),
      correlationId: event.correlationId || this.generateId(),
      causationId: event.causationId,
    }

    // 持久化处理 - 将事件保存到历史记录
    if (this.options.enablePersistence) {
      this.eventHistory.push(enrichedEvent)
      this.persistEvent(enrichedEvent)
    }

    // 跨页面同步 - 广播事件到其他页面实例
    if (this.options.enableCrossPageSync && this.broadcastChannel) {
      this.broadcastChannel.postMessage(enrichedEvent)
    }

    // 事件处理 - 执行所有注册的事件处理器
    await this.processEvent(enrichedEvent)
  }

  // 订阅特定类型的领域事件，返回可管理的订阅对象
  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): EventSubscription {
    // 初始化事件类型处理器集合
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set())
    }

    const handlers = this.handlers.get(eventType)!
    handlers.add(handler as EventHandler)

    // 返回订阅管理对象，支持取消订阅
    return {
      unsubscribe: () => {
        handlers.delete(handler as EventHandler)
        // 清理空的处理器集合
        if (handlers.size === 0) {
          this.handlers.delete(eventType)
        }
      },
    }
  }

  // 订阅多个事件类型，使用同一处理器处理不同类型的事件
  subscribeToMultiple<T extends DomainEvent>(
    eventTypes: string[],
    handler: EventHandler<T>
  ): EventSubscription {
    const subscriptions = eventTypes.map(eventType =>
      this.subscribe(eventType, handler)
    )

    return {
      unsubscribe: () => {
        // 批量取消所有订阅
        subscriptions.forEach(sub => sub.unsubscribe())
      },
    }
  }

  // 一次性事件订阅，事件触发后自动取消订阅
  subscribeOnce<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): EventSubscription {
    const subscription = this.subscribe(eventType, {
      handle: async (event: T) => {
        await handler.handle(event)
        subscription.unsubscribe() // 事件处理后自动取消订阅
      },
    })

    return subscription
  }

  // 条件性事件订阅，只有满足条件的事件才会触发处理器
  subscribeWhen<T extends DomainEvent>(
    eventType: string,
    condition: (event: T) => boolean,
    handler: EventHandler<T>
  ): EventSubscription {
    return this.subscribe(eventType, {
      handle: async (event: T) => {
        // 条件检查 - 满足条件才执行处理器
        if (condition(event)) {
          await handler.handle(event)
        }
      },
    })
  }

  // 获取事件历史，支持按类型、聚合根ID和数量限制进行筛选
  getEventHistory(
    eventType?: string,
    aggregateId?: string,
    limit?: number
  ): DomainEvent[] {
    let events = this.eventHistory

    // 按事件类型筛选
    if (eventType) {
      events = events.filter(event => event.type === eventType)
    }

    // 按聚合根ID筛选
    if (aggregateId) {
      events = events.filter(event => event.aggregateId === aggregateId)
    }

    // 限制返回数量
    if (limit) {
      events = events.slice(-limit)
    }

    // 按时间戳排序
    return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }

  // 清除事件历史，支持选择性清除和批量清理
  clearEventHistory(eventType?: string, aggregateId?: string): void {
    if (!eventType && !aggregateId) {
      // 全量清除
      this.eventHistory = []
      this.clearPersistedEvents()
      return
    }

    // 选择性清除 - 保留不符合条件的事件
    this.eventHistory = this.eventHistory.filter(event => {
      if (eventType && event.type === eventType) return false
      if (aggregateId && event.aggregateId === aggregateId) return false
      return true
    })

    this.persistEventHistory() // 持久化更新后的事件历史
  }

  // 重放历史事件，支持从指定时间点开始重放
  async replayEvents(
    eventType?: string,
    aggregateId?: string,
    fromTimestamp?: Date
  ): Promise<void> {
    const events = this.getEventHistory(eventType, aggregateId)
    const filteredEvents = fromTimestamp
      ? events.filter(event => event.timestamp >= fromTimestamp)
      : events

    // 按顺序重放事件
    for (const event of filteredEvents) {
      await this.processEvent(event)
    }
  }

  // 获取订阅统计信息，提供事件订阅的监控数据
  getSubscriptionStats(): Record<string, number> {
    const stats: Record<string, number> = {}

    this.handlers.forEach((handlers, eventType) => {
      stats[eventType] = handlers.size
    })

    return stats
  }

  // 销毁事件总线，清理所有资源和订阅
  destroy(): void {
    this.handlers.clear() // 清理所有事件处理器
    this.eventHistory = [] // 清空事件历史

    // 关闭跨页面广播频道
    if (this.broadcastChannel) {
      this.broadcastChannel.close()
    }

    this.clearPersistedEvents() // 清理持久化数据
  }

  // 处理领域事件，并行执行所有注册的事件处理器
  private async processEvent(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.type)
    if (!handlers || handlers.size === 0) {
      return
    }

    // 并行处理所有事件处理器
    const promises = Array.from(handlers).map(handler =>
      this.executeHandler(handler, event)
    )

    await Promise.allSettled(promises) // 确保所有处理器都执行完成
  }

  // 执行事件处理器，包含重试机制和错误处理
  private async executeHandler(
    handler: EventHandler,
    event: DomainEvent,
    attempt = 1
  ): Promise<void> {
    try {
      await handler.handle(event)
    } catch (error) {
      console.error(`Event handler failed for ${event.type}:`, error)

      // 重试机制 - 指数退避策略
      if (attempt < this.options.maxRetries) {
        await this.delay(this.options.retryDelay * attempt)
        return this.executeHandler(handler, event, attempt + 1)
      }

      // 发布错误事件 - 记录处理失败的事件
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

  // 设置跨页面事件同步，使用BroadcastChannel API实现多页面通信
  private setupCrossPageSync(): void {
    if (
      !this.options.enableCrossPageSync ||
      typeof BroadcastChannel === 'undefined'
    ) {
      return
    }

    this.broadcastChannel = new BroadcastChannel('domain-events')

    // 监听来自其他页面的事件
    this.broadcastChannel.addEventListener('message', event => {
      const domainEvent = event.data as DomainEvent
      this.handleIncomingEvent(domainEvent)
    })

    // 页面可见性变化时同步事件 - 页面重新激活时同步
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.syncEventsFromStorage()
      }
    })
  }

  // 处理来自其他页面的领域事件，包含重复检测机制
  private async handleIncomingEvent(event: DomainEvent): Promise<void> {
    // 重复检测 - 避免重复处理同一事件
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

  // 设置事件持久化，支持localStorage存储和自动清理机制
  private setupPersistence(): void {
    if (!this.options.enablePersistence) {
      return
    }

    // 从localStorage恢复事件历史
    this.loadPersistedEvents()

    // 定期清理过期事件 - 防止存储空间无限增长
    setInterval(() => {
      this.cleanupExpiredEvents()
    }, 60000) // 每分钟清理一次
  }

  // 持久化单个事件到localStorage，包含大小限制保护
  private persistEvent(event: DomainEvent): void {
    try {
      const storedEvents = JSON.parse(
        localStorage.getItem('event-bus-history') || '[]'
      )

      storedEvents.push({
        ...event,
        timestamp: event.timestamp.toISOString(),
      })

      // 大小限制 - 只保留最近1000个事件
      const recentEvents = storedEvents.slice(-1000)
      localStorage.setItem('event-bus-history', JSON.stringify(recentEvents))
    } catch (error) {
      console.warn('Failed to persist event:', error)
    }
  }

  // 持久化完整的事件历史到localStorage
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

  // 从localStorage加载持久化的事件历史，支持错误恢复
  private loadPersistedEvents(): void {
    try {
      const storedEvents = JSON.parse(
        localStorage.getItem('event-bus-history') || '[]'
      )

      // 转换时间戳格式
      this.eventHistory = storedEvents.map(
        (event: DomainEvent & { timestamp: string }) => ({
          ...event,
          timestamp: new Date(event.timestamp),
        })
      )
    } catch (error) {
      console.warn('Failed to load persisted events:', error)
      this.eventHistory = [] // 失败时重置为空历史
    }
  }

  // 清除localStorage中的持久化事件
  private clearPersistedEvents(): void {
    localStorage.removeItem('event-bus-history')
  }

  // 从存储同步跨页面事件，处理页面重新激活时的数据同步
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

  // 清理过期事件，防止存储空间无限增长
  private cleanupExpiredEvents(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    this.eventHistory = this.eventHistory.filter(
      event => event.timestamp > oneDayAgo
    )

    this.persistEventHistory() // 更新持久化存储
  }

  // 设置全局错误处理，捕获未处理的Promise拒绝
  private setupErrorHandling(): void {
    window.addEventListener('unhandledrejection', event => {
      console.error('Unhandled promise rejection in EventBus:', event.reason)
    })
  }

  // 生成唯一的关联ID，用于事件追踪
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // 延迟函数，用于重试机制中的等待
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// 创建默认事件总线实例，全局单例模式使用
export const eventBus = new EventBus()
