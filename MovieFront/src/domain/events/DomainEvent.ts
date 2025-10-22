/**
 * @fileoverview 领域事件基础框架定义
 * @description 定义领域事件的基本结构、行为和相关接口，提供完整的事件驱动架构基础设施
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 领域事件抽象基类，定义所有领域事件的基本结构和行为
export abstract class DomainEvent {
  public readonly occurredOn: Date // 事件发生时间
  public readonly eventId: string // 事件唯一标识
  public readonly aggregateId: string // 聚合根ID
  public readonly version: number // 事件版本号

  constructor(aggregateId: string, version: number = 1) { // 默认版本为1
    this.aggregateId = aggregateId
    this.version = version
    this.occurredOn = new Date()
    this.eventId = this.generateEventId()
  }

  // 生成唯一的事件ID - 结合类名、时间戳和随机数
  private generateEventId(): string {
    return `${this.constructor.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 获取事件名称 - 子类必须实现
  abstract getEventName(): string

  // 获取事件数据 - 子类必须实现
  abstract getEventData(): unknown

  // 获取事件元数据 - 包含基础信息和额外元数据
  getEventMetadata(): {
    eventId: string
    eventName: string
    aggregateId: string
    version: number
    occurredOn: Date
    [key: string]: unknown
  } {
    return {
      eventId: this.eventId,
      eventName: this.getEventName(),
      aggregateId: this.aggregateId,
      version: this.version,
      occurredOn: this.occurredOn,
      ...this.getAdditionalMetadata(),
    }
  }

  // 获取额外元数据 - 子类可重写添加自定义元数据
  protected getAdditionalMetadata(): Record<string, unknown> {
    return {}
  }

  // 序列化事件为JSON对象 - 用于持久化或网络传输
  toJSON(): {
    eventId: string
    eventName: string
    aggregateId: string
    version: number
    occurredOn: string
    data: unknown
    metadata: unknown
  } {
    return {
      eventId: this.eventId,
      eventName: this.getEventName(),
      aggregateId: this.aggregateId,
      version: this.version,
      occurredOn: this.occurredOn.toISOString(), // ISO格式时间字符串
      data: this.getEventData(),
      metadata: this.getEventMetadata(),
    }
  }

  // 验证事件数据 - 基础验证，子类可重写添加特定验证逻辑
  protected validateEventData(data: unknown): void {
    if (data === null || data === undefined) {
      throw new Error('事件数据不能为空')
    }
  }

  // 比较两个事件是否相等 - 基于事件ID判断
  equals(other: DomainEvent): boolean {
    return this.eventId === other.eventId
  }

  // 检查事件是否过期 - 默认24小时过期
  isExpired(maxAgeMs: number = 24 * 60 * 60 * 1000): boolean {
    return Date.now() - this.occurredOn.getTime() > maxAgeMs
  }

  // 获取事件年龄（毫秒） - 从发生时间到当前时间的差值
  getAge(): number {
    return Date.now() - this.occurredOn.getTime()
  }

  // 获取事件年龄（分钟）
  getAgeInMinutes(): number {
    return this.getAge() / (1000 * 60)
  }

  // 获取事件年龄（小时）
  getAgeInHours(): number {
    return this.getAgeInMinutes() / 60
  }

  // 获取事件年龄（天）
  getAgeInDays(): number {
    return this.getAgeInHours() / 24
  }
}

// 领域事件接口，定义事件的基本契约
export interface IDomainEvent {
  readonly eventId: string // 事件唯一标识
  readonly eventName: string // 事件名称
  readonly aggregateId: string // 聚合根ID
  readonly version: number // 事件版本
  readonly occurredOn: Date // 事件发生时间
  readonly data: unknown // 事件数据
  readonly metadata: unknown // 事件元数据
}

// 事件处理器接口，定义事件处理的契约
export interface IEventHandler<T extends DomainEvent = DomainEvent> {
  handle(event: T): Promise<void> // 处理事件的方法
  readonly eventType: string // 处理的事件类型
}

// 事件总线接口，定义事件发布和订阅的契约
export interface IEventBus {
  publish<T extends DomainEvent>(event: T): Promise<void> // 发布单个事件
  publishBatch(events: DomainEvent[]): Promise<void> // 批量发布事件
  subscribe<T extends DomainEvent>( // 订阅特定类型的事件
    eventType: string,
    handler: IEventHandler<T>
  ): void
  unsubscribe(eventType: string, handler: IEventHandler): void // 取消订阅
}

// 聚合根接口，定义聚合根的事件管理能力
export interface IAggregateRoot {
  readonly id: string // 聚合根唯一标识
  readonly version: number // 当前版本号
  getUncommittedEvents(): DomainEvent[] // 获取未提交的事件
  markEventsAsCommitted(): void // 标记事件为已提交
  loadFromHistory(events: DomainEvent[]): void // 从历史事件加载状态
}

// 事件存储接口，定义事件持久化的契约
export interface IEventStore {
  saveEvents( // 保存事件到存储
    aggregateId: string,
    events: DomainEvent[],
    expectedVersion?: number
  ): Promise<void>
  getEvents(aggregateId: string, fromVersion?: number): Promise<DomainEvent[]> // 获取聚合根的事件
  getEventsByType( // 按类型获取事件
    eventType: string,
    fromTimestamp?: Date
  ): Promise<DomainEvent[]>
  getSnapshot(aggregateId: string): Promise<unknown | null> // 获取聚合根快照
  saveSnapshot( // 保存聚合根快照
    aggregateId: string,
    snapshot: unknown,
    version: number
  ): Promise<void>
}

// 事件流接口，定义事件流的管理契约
export interface IEventStream {
  getStreamId(): string // 获取流ID
  getEvents(): DomainEvent[] // 获取流中的所有事件
  getCurrentVersion(): number // 获取当前版本
  addEvent(event: DomainEvent): void // 添加事件到流中
  clearEvents(): void // 清空流中的事件
}
