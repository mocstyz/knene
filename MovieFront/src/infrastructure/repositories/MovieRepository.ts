/**
 * @fileoverview 影片仓储接口定义
 * @description 定义影片相关的数据访问接口，包含影片的创建、查询、更新、删除、搜索等操作规范
 * @created 2025-10-15 14:40:00
 * @updated 2025-10-19 10:25:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Movie } from '@domain/entities/Movie'

// 影片仓储接口，定义影片数据访问规范
export interface MovieRepository {
  // 创建新影片
  create(movie: Movie): Promise<Movie>
  // 根据ID查找影片
  findById(id: string): Promise<Movie | null>
  // 根据条件查找影片列表
  findAll(filters?: {
    genre?: string // 影片类型
    year?: number // 上映年份
    rating?: number // 评分
    search?: string // 搜索关键词
  }): Promise<Movie[]>
  // 查找推荐影片
  findFeatured(): Promise<Movie[]>
  // 根据类型查找影片
  findByGenre(genre: string): Promise<Movie[]>
  // 搜索影片
  search(query: string): Promise<Movie[]>
  // 更新影片信息
  update(movie: Movie): Promise<Movie>
  // 删除影片
  delete(id: string): Promise<boolean>
  // 获取影片统计信息
  getMovieStats(): Promise<{
    total: number // 总数
    byGenre: Record<string, number> // 按类型统计
    byYear: Record<string, number> // 按年份统计
  }>
}
