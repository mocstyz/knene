/**
 * @fileoverview 合集领域组件统一导出
 * @description 提供合集相关组件的统一导出入口，遵循@别名导入导出规范。
 *              所有合集相关的组件都通过此文件进行导出，确保导入路径的一致性。
 * @created 2025-01-21 15:50:00
 * @updated 2025-01-21 15:50:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 合集影片列表组件导出
export { default as CollectionMovieList } from './CollectionMovieList'
export type { CollectionMovieListProps, PaginationConfig } from './CollectionMovieList'
