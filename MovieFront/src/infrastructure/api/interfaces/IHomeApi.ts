/**
 * @fileoverview Home API接口定义
 * @description 定义首页相关的API接口，遵循DDD Repository模式和前后端分离规范，提供首页数据获取、专题合集、写真内容、最新更新、热门内容等核心功能
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import type { CollectionItem } from '@types-movie'
import type { PhotoItem, LatestItem } from '@types-movie'
import type { HotItem } from '@types-movie'
import type { ApiResponse } from './ICollectionApi'

// 首页数据响应接口，定义首页所有区块的数据结构
export interface HomeDataResponse {
  collections: CollectionItem[] // 专题合集列表
  photos: PhotoItem[] // 写真内容列表
  latestUpdates: LatestItem[] // 最新更新列表
  hotDaily: HotItem[] // 每日热门列表
}

// 首页区块查询参数接口，定义各区块的查询配置
export interface HomeBlockParams {
  limit?: number // 返回数量限制
  offset?: number // 偏移量
  category?: string // 分类筛选
}

// 专题合集查询参数接口，继承基础查询参数
export interface CollectionsQueryParams extends HomeBlockParams {
  featured?: boolean // 是否只返回精选专题
  sortBy?: 'latest' | 'top-rated' | 'featured' // 排序方式
}

// 写真内容查询参数接口，继承基础查询参数
export interface PhotosQueryParams extends HomeBlockParams {
  quality?: 'hd' | '4k' | 'all' // 质量筛选
  orientation?: 'portrait' | 'landscape' | 'all' // 方向筛选
}

// 最新更新查询参数接口，继承基础查询参数
export interface LatestUpdatesQueryParams extends HomeBlockParams {
  timeRange?: '24h' | '7d' | '30d' // 时间范围
  contentType?: 'movie' | 'photo' | 'all' // 内容类型
}

// 热门内容查询参数接口，继承基础查询参数
export interface HotContentQueryParams extends HomeBlockParams {
  period?: 'daily' | 'weekly' | 'monthly' // 统计周期
  minRating?: number // 最低评分
}

// 首页数据查询参数接口，定义获取首页完整数据时的参数配置
export interface HomeDataParams {
  collectionsLimit?: number // 专题合集数量限制
  photosLimit?: number // 写真内容数量限制
  latestLimit?: number // 最新更新数量限制
  hotLimit?: number // 热门内容数量限制
  includeRatings?: boolean // 是否包含评分信息
  imageQuality?: 'low' | 'medium' | 'high' // 图片质量
}

// Home API接口定义，定义所有首页相关的API操作
export interface IHomeApi {
  // 获取首页完整数据，一次性返回所有区块内容
  getHomeData(params?: HomeDataParams): Promise<ApiResponse<HomeDataResponse>>

  // 获取专题合集列表，支持筛选和排序
  getCollections(params?: CollectionsQueryParams): Promise<ApiResponse<CollectionItem[]>>

  // 获取写真内容列表，支持质量和方向筛选
  getPhotos(params?: PhotosQueryParams): Promise<ApiResponse<PhotoItem[]>>

  // 获取最新更新列表，支持时间范围和内容类型筛选
  getLatestUpdates(params?: LatestUpdatesQueryParams): Promise<ApiResponse<LatestItem[]>>

  // 获取热门内容列表，支持统计周期和评分筛选
  getHotContent(params?: HotContentQueryParams): Promise<ApiResponse<HotItem[]>>

  // 获取每日热门推荐，返回精选的热门内容
  getDailyHot(limit?: number): Promise<ApiResponse<HotItem[]>>

  // 获取精选专题，返回编辑推荐的专题合集
  getFeaturedCollections(limit?: number): Promise<ApiResponse<CollectionItem[]>>

  // 获取最新写真，返回最近上传的写真内容
  getLatestPhotos(limit?: number): Promise<ApiResponse<PhotoItem[]>>
}