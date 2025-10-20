/**
 * @fileoverview Photo领域渲染器导出
 * @description 包含photo-renderer等业务特定的渲染器组件。
 *              提供photo领域相关渲染器的统一导出入口，
 *              基于内容渲染器抽象层，支持写真内容的特化渲染。
 * @created 2025-10-20 14:04:05
 * @updated 2025-10-20 14:07:15
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

export { PhotoContentRenderer, isPhotoContentItem, createPhotoContentItem } from './photo-renderer'
export type { PhotoContentItem } from './photo-renderer'