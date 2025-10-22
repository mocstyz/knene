/**
 * @fileoverview 首页应用服务，处理首页相关的业务逻辑和数据转换
 * @description 首页应用服务，协调Repository层访问数据，提供完整的首页数据管理功能
 *              遵循DDD架构模式，封装首页相关的所有业务逻辑
 * @created 2025-10-19 13:03:50
 * @updated 2025-10-21 14:54:26
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */
import { IHomeRepository, HomeRepository } from '@infrastructure/repositories'
import type { CollectionItem, PhotoItem, LatestItem, BaseMovieItem } from '@/types/movie.types'

// 首页数据响应接口
export interface HomeDataResponse {
  collections: CollectionItem[]
  photos: PhotoItem[]
  latestUpdates: LatestItem[]
  hotDaily: BaseMovieItem[]
}

// 首页数据查询参数接口
export interface HomeDataParams {
  collectionsLimit?: number
  photosLimit?: number
  latestLimit?: number
  hotLimit?: number
}

// 首页应用服务类，通过Repository层访问数据，遵循DDD架构
export class HomeApplicationService {
  private homeRepository: IHomeRepository

  constructor() {
    this.homeRepository = new HomeRepository()
  }

  // 获取完整首页数据，通过Repository层访问数据
  async getHomeData(params?: HomeDataParams): Promise<HomeDataResponse> {
    try {
      return await this.homeRepository.getHomeData({
        collectionsLimit: params?.collectionsLimit || 3,
        photosLimit: params?.photosLimit || 6,
        latestLimit: params?.latestLimit || 6,
        hotLimit: params?.hotLimit || 6
      })
    } catch (error) {
      console.error('Failed to get home data:', error)
      throw new Error('无法获取首页数据')
    }
  }

  // 获取影片合集数据，通过Repository层访问数据
  async getCollections(limit = 3): Promise<CollectionItem[]> {
    try {
      return await this.homeRepository.getCollections({ limit })
    } catch (error) {
      console.error('Failed to get collections:', error)
      throw new Error('无法获取影片合集数据')
    }
  }

  // 获取写真数据，通过Repository层访问数据
  async getPhotos(limit = 6): Promise<PhotoItem[]> {
    try {
      return await this.homeRepository.getPhotos({ limit })
    } catch (error) {
      console.error('Failed to get photos:', error)
      throw new Error('无法获取写真数据')
    }
  }

  // 获取最新更新数据，通过Repository层访问数据
  async getLatestUpdates(limit = 6): Promise<LatestItem[]> {
    try {
      return await this.homeRepository.getLatestUpdates({ limit })
    } catch (error) {
      console.error('Failed to get latest updates:', error)
      throw new Error('无法获取最新更新数据')
    }
  }

  // 获取24小时热门数据，通过Repository层访问数据
  async getHotDaily(limit = 6): Promise<BaseMovieItem[]> {
    try {
      return await this.homeRepository.getHotContent({ limit })
    } catch (error) {
      console.error('Failed to get hot daily:', error)
      throw new Error('无法获取24小时热门数据')
    }
  }

  // 获取精选合集，通过Repository层访问数据
  async getFeaturedCollections(limit = 3): Promise<CollectionItem[]> {
    try {
      return await this.homeRepository.getFeaturedCollections(limit)
    } catch (error) {
      console.error('Failed to get featured collections:', error)
      throw new Error('无法获取精选合集')
    }
  }

  // 获取最新写真，通过Repository层访问数据
  async getLatestPhotos(limit = 6): Promise<PhotoItem[]> {
    try {
      return await this.homeRepository.getLatestPhotos(limit)
    } catch (error) {
      console.error('Failed to get latest photos:', error)
      throw new Error('无法获取最新写真')
    }
  }

  // 获取横幅数据，通过Repository层访问数据
  async getBannerData(): Promise<any[]> {
    try {
      return await this.homeRepository.getBannerData()
    } catch (error) {
      console.error('Failed to get banner data:', error)
      return []
    }
  }

  // 获取公告数据，通过Repository层访问数据
  async getAnnouncements(): Promise<any[]> {
    try {
      return await this.homeRepository.getAnnouncements()
    } catch (error) {
      console.error('Failed to get announcements:', error)
      return []
    }
  }

  // 获取网站统计信息，通过Repository层访问数据
  async getSiteStats(): Promise<{
    totalMovies: number
    totalCollections: number
    totalPhotos: number
    totalUsers: number
    todayVisits: number
  }> {
    try {
      return await this.homeRepository.getSiteStats()
    } catch (error) {
      console.error('Failed to get site stats:', error)
      return {
        totalMovies: 0,
        totalCollections: 0,
        totalPhotos: 0,
        totalUsers: 0,
        todayVisits: 0
      }
    }
  }

  // 刷新缓存，通过Repository层执行
  async refreshCache(): Promise<void> {
    try {
      await this.homeRepository.refreshCache()
    } catch (error) {
      console.error('Failed to refresh cache:', error)
      throw new Error('刷新缓存失败')
    }
  }
}

// 创建单例实例
export const homeApplicationService = new HomeApplicationService()
