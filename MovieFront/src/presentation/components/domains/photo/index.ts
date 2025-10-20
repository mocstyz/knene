/**
 * @fileoverview Photo领域模块导出
 * @description 导出所有photo领域的组件和类型，包括PhotoSection和PhotoList组件。
 *              提供统一的模块导出入口，方便其他模块引用photo相关的功能组件。
 *              PhotoCard已被内容渲染器系统替代，移除相关导出。
 * @created 2025-10-16 11:21:33
 * @updated 2025-10-20 14:07:15
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 导出组件
export { PhotoList } from './PhotoList'
export { PhotoSection } from './PhotoSection'

// 导出类型，PhotoItem类型保留，因为它仍然被其他地方使用
export type { PhotoItem } from '@types-movie'
export type { PhotoListProps } from './PhotoList'
export type { PhotoSectionProps } from './PhotoSection'
