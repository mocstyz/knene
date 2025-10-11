/**
 * @fileoverview 专题领域组件导出
 * @description 统一导出专题相关的所有组件
 */

export { TopicCard } from './TopicCard'
export { TopicList } from './TopicList'

export type { TopicCardProps } from './TopicCard'
export type {
  Topic,
  PaginationConfig,
  ResponsiveColumns,
  TopicListProps,
} from './TopicList'

// 向后兼容：保留SpecialCollectionCard导出，实际使用TopicCard
export { TopicCard as SpecialCollectionCard } from './TopicCard'
