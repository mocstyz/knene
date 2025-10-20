/**
 * @fileoverview 领域事件统一导出
 * @description 统一导出领域事件相关的类、接口和类型定义，包括基础事件框架和影片相关事件
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-19 13:56:30
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

export { DomainEvent } from './DomainEvent'
export type {
  IDomainEvent,
  IEventHandler,
  IEventBus,
  IAggregateRoot,
  IEventStore,
  IEventStream,
} from './DomainEvent'
export {
  MovieCreatedEvent,
  MovieUpdatedEvent,
  MovieRatedEvent,
  MovieDownloadedEvent,
  MovieFavoritedEvent,
  MovieViewedEvent,
  MovieCategoryChangedEvent,
  MovieRecommendedEvent,
  MovieSearchedEvent,
  MovieEventFactory,
} from './MovieEvents'
