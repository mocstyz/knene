/**
 * @fileoverview Collections领域组件统一导出
 * @description 导出Collections领域的所有组件和类型，提供统一的导入入口
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 导出组件
export * from './CollectionList'
export * from './CollectionSection'

// 导出渲染器
export * from './renderers'

// 从统一类型定义导出CollectionItem
export type { CollectionItem } from '@types-movie'
