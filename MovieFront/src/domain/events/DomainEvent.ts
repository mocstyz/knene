/**
 * 领域事件基类
 * 定义领域事件的基本结构和行为
 */
export abstract class DomainEvent {
  public readonly occurredOn: Date
  public readonly eventId: string
  public readonly aggregateId: string
  public readonly version: number

  constructor(aggregateId: string, version: number = 1) {
    this.aggregateId = aggregateId
    this.version = version
    this.occurredOn = new Date()
    this.eventId = this.generateEventId()
  }

  private generateEventId(): string {
    return `${this.constructor.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 获取事件名称
  abstract getEventName(): string

  // 获取事件数据
  abstract getEventData(): unknown

  // 获取事件元数据
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

  // 获取额外元数据（子类可重写）
  protected getAdditionalMetadata(): Record<string, unknown> {
    return {}
  }

  // 序列化事件
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
      occurredOn: this.occurredOn.toISOString(),
      data: this.getEventData(),
      metadata: this.getEventMetadata(),
    }
  }

  // 验证事件数据
  protected validateEventData(data: unknown): void {
    // 基础验证，子类可重写
    if (data === null || data === undefined) {
      throw new Error('事件数据不能为空')
    }
  }

  // 比较事件是否相等
  equals(other: DomainEvent): boolean {
    return this.eventId === other.eventId
  }

  // 检查事件是否过期
  isExpired(maxAgeMs: number = 24 * 60 * 60 * 1000): boolean {
    return Date.now() - this.occurredOn.getTime() > maxAgeMs
  }

  // 获取事件年龄
  getAge(): number {
    return Date.now() - this.occurredOn.getTime()
  }

  getAgeInMinutes(): number {
    return this.getAge() / (1000 * 60)
  }

  getAgeInHours(): number {
    return this.getAgeInMinutes() / 60
  }

  getAgeInDays(): number {
    return this.getAgeInHours() / 24
  }
}

/**
 * 领域事件接口
 */
export interface IDomainEvent {
  readonly eventId: string
  readonly eventName: string
  readonly aggregateId: string
  readonly version: number
  readonly occurredOn: Date
  readonly data: unknown
  readonly metadata: unknown
}

/**
 * 事件处理器接口
 */
export interface IEventHandler<T extends DomainEvent = DomainEvent> {
  handle(event: T): Promise<void>
  readonly eventType: string
}

/**
 * 事件总线接口
 */
export interface IEventBus {
  publish<T extends DomainEvent>(event: T): Promise<void>
  publishBatch(events: DomainEvent[]): Promise<void>
  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: IEventHandler<T>
  ): void
  unsubscribe(eventType: string, handler: IEventHandler): void
}

/**
 * 聚合根接口
 */
export interface IAggregateRoot {
  readonly id: string
  readonly version: number
  getUncommittedEvents(): DomainEvent[]
  markEventsAsCommitted(): void
  loadFromHistory(events: DomainEvent[]): void
}

/**
 * 事件溯源接口
 */
export interface IEventStore {
  saveEvents(
    aggregateId: string,
    events: DomainEvent[],
    expectedVersion?: number
  ): Promise<void>
  getEvents(aggregateId: string, fromVersion?: number): Promise<DomainEvent[]>
  getEventsByType(
    eventType: string,
    fromTimestamp?: Date
  ): Promise<DomainEvent[]>
  getSnapshot(aggregateId: string): Promise<unknown | null>
  saveSnapshot(
    aggregateId: string,
    snapshot: unknown,
    version: number
  ): Promise<void>
}

/**
 * 事件流接口
 */
export interface IEventStream {
  getStreamId(): string
  getEvents(): DomainEvent[]
  getCurrentVersion(): number
  addEvent(event: DomainEvent): void
  clearEvents(): void
}
