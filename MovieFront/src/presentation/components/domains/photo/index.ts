/**
 * @fileoverview Photo领域模块导出
 * @description 导出所有photo领域的组件和类型
 */

// PhotoCard已被内容渲染器系统替代，移除导出
export { PhotoList } from './PhotoList'
export { PhotoSection } from './PhotoSection'

// 导出类型
// PhotoCardProps已被内容渲染器系统替代，移除导出
// PhotoItem类型保留，因为它仍然被其他地方使用
export type { PhotoItem } from '@types-movie/movie.types'
export type { PhotoListProps } from './PhotoList'
export type { PhotoSectionProps } from './PhotoSection'

// 提供默认导出以支持动态导入
// PhotoCard已被内容渲染器系统替代，移除导出
