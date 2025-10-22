/**
 * @fileoverview LatestUpdate领域渲染器导出
 * @description 包含movie-renderer等业务特定的渲染器组件。
 *              提供latestupdate领域相关渲染器的统一导出入口，
 *              基于内容渲染器抽象层，支持电影内容的特化渲染。
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

export { MovieContentRenderer, isMovieContentItem, createMovieContentItem } from './movie-renderer'
export type { MovieContentItem } from './movie-renderer'
