/**
 * @fileoverview Hot领域模块导出
 * @description 导出所有hot领域的组件和类型，包括HotSection和HotList组件。
 *              提供统一的模块导出入口，方便其他模块引用hot相关的功能组件。
 * @created 2025-10-16 11:21:33
 * @updated 2025-10-20 14:07:15
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

export { HotList } from './HotList'
export { HotSection } from './HotSection'
export type { HotListProps } from './HotList'
export type { HotSectionProps } from './HotSection'
export type { HotItem } from '@infrastructure/repositories/HomeRepository'
