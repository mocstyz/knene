/**
 * @fileoverview Collection Repository接口定义
 * @description 定义专题合集数据访问层接口，遵循DDD Repository模式，提供数据访问抽象层，支持Mock和真实API的无缝切换
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import type { CollectionItem } from '@types-movie'
import type { MovieDetail } from '@types-movie'
import type { 
  CollectionQueryParams, 
  CollectionFilterParams, 
  PaginatedResponse 
} from '@infrastructure/api/interfaces/ICollectionApi'

// Collection Repository接口，定义专题合集数据访问层的所有操作
export interface ICollectionRepository {
  // 获取专题合集列表，支持分页和筛选
  getCollections(params?: CollectionQueryParams): Promise<PaginatedResponse<CollectionItem>>

  // 根据ID获取专题合集详情
  getCollectionDetail(id: string): Promise<CollectionItem>

  // 获取专题合集中的影片列表，支持分页
  getCollectionMovies(
    collectionId: string, 
    params?: CollectionQueryParams
  ): Promise<PaginatedResponse<MovieDetail>>

  // 获取热门专题合集，按热度排序
  getHotCollections(limit?: number): Promise<CollectionItem[]>

  // 获取最新专题合集，按创建时间排序
  getLatestCollections(limit?: number): Promise<CollectionItem[]>

  // 搜索专题合集，支持关键词和筛选条件
  searchCollections(
    query: string, 
    filters?: CollectionFilterParams
  ): Promise<PaginatedResponse<CollectionItem>>

  // 获取推荐专题合集，基于用户偏好或编辑推荐
  getRecommendedCollections(limit?: number): Promise<CollectionItem[]>

  // 获取分类专题合集，按分类筛选
  getCollectionsByCategory(
    category: string, 
    params?: CollectionQueryParams
  ): Promise<PaginatedResponse<CollectionItem>>

  // 检查专题合集是否存在
  existsCollection(id: string): Promise<boolean>

  // 获取专题合集统计信息（影片数量、观看次数等）
  getCollectionStats(id: string): Promise<{
    movieCount: number
    viewCount: number
    favoriteCount: number
    rating: number
  }>
}
