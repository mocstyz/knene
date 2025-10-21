/**
 * @fileoverview Home Repository接口定义
 * @description 定义首页数据访问层接口，遵循DDD Repository模式，提供首页各区块数据的访问抽象层，支持Mock和真实API的无缝切换
 * @created 2025-01-21 10:45:00
 * @updated 2025-01-21 10:45:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import type { CollectionItem } from '@types-movie'
import type { PhotoItem, LatestItem } from '@/types/movie.types'
import type { HotItem } from '@infrastructure/repositories/HomeRepository'
import type { 
  HomeDataResponse,
  HomeDataParams,
  TopicsQueryParams,
  PhotosQueryParams,
  LatestUpdatesQueryParams,
  HotContentQueryParams
} from '@infrastructure/api/interfaces/IHomeApi'

// Home Repository接口，定义首页数据访问层的所有操作
export interface IHomeRepository {
  // 获取首页完整数据，一次性返回所有区块内容
  getHomeData(params?: HomeDataParams): Promise<HomeDataResponse>

  // 获取专题合集列表，支持筛选和排序
  getTopics(params?: TopicsQueryParams): Promise<CollectionItem[]>

  // 获取写真内容列表，支持质量和方向筛选
  getPhotos(params?: PhotosQueryParams): Promise<PhotoItem[]>

  // 获取最新更新列表，支持时间范围和内容类型筛选
  getLatestUpdates(params?: LatestUpdatesQueryParams): Promise<LatestItem[]>

  // 获取热门内容列表，支持统计周期和评分筛选
  getHotContent(params?: HotContentQueryParams): Promise<HotItem[]>

  // 获取每日热门推荐，返回精选的热门内容
  getDailyHot(limit?: number): Promise<HotItem[]>

  // 获取精选专题，返回编辑推荐的专题合集
  getFeaturedTopics(limit?: number): Promise<CollectionItem[]>

  // 获取最新写真，返回最近上传的写真内容
  getLatestPhotos(limit?: number): Promise<PhotoItem[]>

  // 获取轮播图数据，用于首页banner展示
  getBannerData(): Promise<{
    id: string
    title: string
    description: string
    imageUrl: string
    linkUrl: string
    priority: number
  }[]>

  // 获取公告信息，用于首页公告展示
  getAnnouncements(): Promise<{
    id: string
    title: string
    content: string
    type: 'info' | 'warning' | 'success' | 'error'
    publishTime: string
    isImportant: boolean
  }[]>

  // 获取网站统计信息，用于首页数据展示
  getSiteStats(): Promise<{
    totalMovies: number
    totalCollections: number
    totalPhotos: number
    totalUsers: number
    todayVisits: number
  }>

  // 刷新首页缓存，用于数据更新后的缓存清理
  refreshCache(): Promise<void>
}