/**
 * @fileoverview 共享领域组件统一导出
 * @description 统一导出shared目录下的所有组件和类型，包括BaseSection、BaseList、EmptyState、MixedContentList以及内容渲染器系统
 * @created 2025-10-20 14:07:15
 * @updated 2025-10-20 16:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 导出基础共享组件
export { BaseSection } from './BaseSection'
export { BaseList } from './BaseList'
export { EmptyState } from './EmptyState'
export { MixedContentList } from './MixedContentList'

// 导出内容渲染器系统
export * from './content-renderers'

// 导出组件类型定义
export type { BaseSectionComponentProps } from './BaseSection'
export type { ResponsiveColumnsConfig } from './BaseList'
export type { EmptyStateProps } from './EmptyState'
export type { MixedContentListProps } from './MixedContentList'
