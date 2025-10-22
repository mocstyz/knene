/**
 * @fileoverview 首页数据仓储实现
 * @description 首页数据仓储实现，遵循DDD Repository模式，通过API服务工厂获取数据源
 *              提供首页数据的获取和转换功能，包括专题、写真、最新更新、热门内容等模块
 * @created 2025-10-19 15:42:00
 * @updated 2025-10-21 15:02:41
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */
import { IHomeRepository } from './IHomeRepository'
import { apiClient } from '@infrastructure/api/ApiClient'
import { buildUrlWithParams } from '@infrastructure/api/endpoints'
import { generateRandomRating } from '@utils/formatters'
import { MOVIE_ENDPOINTS } from '@infrastructure/api/endpoints'
import { mockDataService } from '@application/services/MockDataService'
import { ContentTransformationService } from '@application/services/ContentTransformationService'
import { toCollectionItems } from '@utils/data-converters'
import type { 
  CollectionItem,
  PhotoItem, 
  LatestItem, 
  BaseMovieItem,
  HotItem,
  UnifiedContentItem
} from '@types-movie'
import type { 
  HomeDataParams as ApiHomeDataParams,
  CollectionsQueryParams, 
  PhotosQueryParams, 
  LatestUpdatesQueryParams,
  HotContentQueryParams
} from '@infrastructure/api/interfaces/IHomeApi'

// 首页数据查询参数接口
export interface HomeDataParams {
  collectionsLimit?: number
  photosLimit?: number
  latestLimit?: number
  hotLimit?: number
}

// 首页数据响应接口
export interface HomeDataResponse {
  collections: CollectionItem[]
  photos: PhotoItem[]
  latestUpdates: LatestItem[]
  hotDaily: BaseMovieItem[]
}

// 首页仓储实现类，提供首页数据的获取和转换功能
export class HomeRepository implements IHomeRepository {
  // 获取首页所有模块数据，支持配置参数和错误处理
  async getHomeData(params: ApiHomeDataParams = {}): Promise<HomeDataResponse> {
    const { 
      collectionsLimit = 3,
      photosLimit = 6, 
      latestLimit = 6,
      hotLimit = 6,
      includeRatings = true, 
      imageQuality = 'medium' 
    } = params

    // 构建API URL
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    const apiUrl = new URL(
      MOVIE_ENDPOINTS.HOT,
      window.location.origin + baseUrl
    )

    // 添加查询参数
    apiUrl.searchParams.append('collectionsLimit', collectionsLimit.toString())
    apiUrl.searchParams.append('photosLimit', photosLimit.toString())
    apiUrl.searchParams.append('latestLimit', latestLimit.toString())
    apiUrl.searchParams.append('hotLimit', hotLimit.toString())
    apiUrl.searchParams.append('includeRatings', includeRatings.toString())
    apiUrl.searchParams.append('imageQuality', imageQuality)

    try {
      const response = await fetch(apiUrl.toString())

      if (!response.ok) {
        throw new Error(`Failed to fetch home data: ${response.status}`)
      }

      const data = await response.json()

      // 后端API数据格式转换
      return this.transformApiResponse(data)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('Development: API not available, using mock data for home data')
      } else {
        console.error('Error fetching home data:', error)
      }

      // 如果API调用失败，使用Mock数据服务
      const mockData = mockDataService.generateMockHomeData()
      
      // 将CollectionItem[]转换为CollectionItem[]
      const collections = toCollectionItems(
        ContentTransformationService.transformUnifiedListToCollections(
          ContentTransformationService.transformCollectionListToUnified(
            mockDataService.generateMockCollections(collectionsLimit)
          )
        ).map(collection => ({
          id: collection.id,
          title: collection.title,
          contentType: 'collection' as const,
          description: collection.description,
          imageUrl: collection.imageUrl,
          alt: collection.alt,
          isNew: collection.isNew,
          newType: collection.newType,
          isVip: collection.isVip,
          tags: collection.tags
        }))
      )
      
      return {
        collections,
        photos: mockDataService.getMockPhotos(photosLimit),
        latestUpdates: mockDataService.getMockLatestUpdates(latestLimit),
        hotDaily: mockDataService.getMockHotDaily(hotLimit),
      }
    }
  }

  // 获取专题数据，支持数量限制和错误处理
  async getCollections(params?: CollectionsQueryParams): Promise<CollectionItem[]> {
    const limit = params?.limit || 3
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    const apiUrl = new URL(
      `${MOVIE_ENDPOINTS.CATEGORIES}/collections`,
      window.location.origin + baseUrl
    )
    apiUrl.searchParams.append('limit', limit.toString())

    try {
      const response = await fetch(apiUrl.toString())

      if (!response.ok) {
        throw new Error(`Failed to fetch collections: ${response.status}`)
      }

      const data = await response.json()
      return this.transformCollections(data)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('Development: API not available, using mock data for collections')
      } else {
        console.error('Error fetching collections:', error)
      }
      // 使用正确的数据转换流程
      return toCollectionItems(
        ContentTransformationService.transformUnifiedListToCollections(
          ContentTransformationService.transformCollectionListToUnified(
            mockDataService.generateMockCollections(limit)
          )
        ).map(collection => ({
          id: collection.id,
          title: collection.title,
          contentType: 'collection' as const,
          description: collection.description,
          imageUrl: collection.imageUrl,
          alt: collection.alt,
          isNew: collection.isNew,
          newType: collection.newType,
          isVip: collection.isVip,
          tags: collection.tags
        }))
      )
    }
  }

  // 获取写真内容列表
  async getPhotos(params?: PhotosQueryParams): Promise<PhotoItem[]> {
    const limit = params?.limit || 6
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    const apiUrl = new URL(
      `${MOVIE_ENDPOINTS.CATEGORIES}/photos`,
      window.location.origin + baseUrl
    )
    apiUrl.searchParams.append('limit', limit.toString())

    try {
      const response = await fetch(apiUrl.toString())

      if (!response.ok) {
        throw new Error(`Failed to fetch photos: ${response.status}`)
      }

      const data = await response.json()
      return this.transformPhotos(data)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('Development: API not available, using mock data for photos')
      } else {
        console.error('Error fetching photos:', error)
      }
      // 使用Mock数据服务作为回退
      return mockDataService.getMockPhotos(limit)
    }
  }

  // 获取最新更新数据，支持数量限制和错误处理
  async getLatestUpdates(params?: LatestUpdatesQueryParams): Promise<LatestItem[]> {
    const limit = params?.limit || 6
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    const apiUrl = new URL(
      MOVIE_ENDPOINTS.LATEST,
      window.location.origin + baseUrl
    )
    apiUrl.searchParams.append('limit', limit.toString())

    try {
      const response = await fetch(apiUrl.toString())

      if (!response.ok) {
        throw new Error(`Failed to fetch latest updates: ${response.status}`)
      }

      const data = await response.json()
      return this.transformLatestUpdates(data)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('Development: API not available, using mock data for latest updates')
      } else {
        console.error('Error fetching latest updates:', error)
      }
      // 使用Mock数据服务作为回退
      return mockDataService.getMockLatestUpdates(limit)
    }
  }

  // 获取24小时热门数据，支持数量限制和错误处理
  async getHotDaily(limit = 6): Promise<HotItem[]> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    const apiUrl = new URL(
      `${MOVIE_ENDPOINTS.HOT}/daily`,
      window.location.origin + baseUrl
    )
    apiUrl.searchParams.append('limit', limit.toString())

    try {
      const response = await fetch(apiUrl.toString())

      if (!response.ok) {
        throw new Error(`Failed to fetch hot daily: ${response.status}`)
      }

      const data = await response.json()
      return this.transformHotDaily(data)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('Development: API not available, using mock data for hot daily')
      } else {
        console.error('Error fetching hot daily:', error)
      }
      // 使用Mock数据服务作为回退
      return mockDataService.getMockHotDaily(limit)
    }
  }

  // 获取热门内容列表，支持统计周期和评分筛选
  async getHotContent(params?: HotContentQueryParams): Promise<HotItem[]> {
    const { limit = 6, period = 'daily', minRating = 0 } = params || {}
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    const apiUrl = new URL(MOVIE_ENDPOINTS.HOT, window.location.origin + baseUrl)
    
    apiUrl.searchParams.append('limit', limit.toString())
    apiUrl.searchParams.append('period', period)
    apiUrl.searchParams.append('minRating', minRating.toString())

    try {
      const response = await fetch(apiUrl.toString())
      if (!response.ok) {
        throw new Error(`Failed to fetch hot content: ${response.status}`)
      }
      const data = await response.json()
      return this.transformHotDaily(data.items || [])
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('Development: API not available, using mock data for hot content')
      }
      return []
    }
  }

  // 获取每日热门推荐，返回精选的热门内容
  async getDailyHot(limit = 6): Promise<HotItem[]> {
    return this.getHotContent({ limit, period: 'daily' })
  }

  // 获取精选专题，返回编辑推荐的专题合集
  async getFeaturedCollections(limit = 3): Promise<CollectionItem[]> {
    return this.getCollections({ limit, featured: true, sortBy: 'featured' })
  }

  // 获取最新写真，返回最近上传的写真内容
  async getLatestPhotos(limit = 6): Promise<PhotoItem[]> {
    return this.getPhotos({ limit, quality: 'all', orientation: 'all' })
  }

  // 获取轮播图数据，用于首页banner展示
  async getBannerData(): Promise<{
    id: string
    title: string
    description: string
    imageUrl: string
    linkUrl: string
    priority: number
  }[]> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    const apiUrl = new URL('/banners', window.location.origin + baseUrl)

    try {
      const response = await fetch(apiUrl.toString())
      if (!response.ok) {
        throw new Error(`Failed to fetch banner data: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('Development: API not available, using mock banner data')
      }
      return []
    }
  }

  // 获取公告信息，用于首页公告展示
  async getAnnouncements(): Promise<{
    id: string
    title: string
    content: string
    type: 'info' | 'warning' | 'success' | 'error'
    publishTime: string
    isImportant: boolean
  }[]> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    const apiUrl = new URL('/announcements', window.location.origin + baseUrl)

    try {
      const response = await fetch(apiUrl.toString())
      if (!response.ok) {
        throw new Error(`Failed to fetch announcements: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('Development: API not available, using mock announcements')
      }
      return []
    }
  }

  // 获取网站统计信息，用于首页数据展示
  async getSiteStats(): Promise<{
    totalMovies: number
    totalCollections: number
    totalPhotos: number
    totalUsers: number
    todayVisits: number
  }> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    const apiUrl = new URL('/stats', window.location.origin + baseUrl)

    try {
      const response = await fetch(apiUrl.toString())
      if (!response.ok) {
        throw new Error(`Failed to fetch site stats: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('Development: API not available, using mock stats')
      }
      return {
        totalMovies: 0,
        totalCollections: 0,
        totalPhotos: 0,
        totalUsers: 0,
        todayVisits: 0
      }
    }
  }

  // 刷新首页缓存，用于数据更新后的缓存清理
  async refreshCache(): Promise<void> {
    // 在实际实现中，这里会清理相关的缓存
    if (import.meta.env.DEV) {
      console.log('Development: Cache refresh requested')
    }
  }

  // 转换API响应数据为前端统一格式
  private transformApiResponse(apiData: any): HomeDataResponse {
    return {
      collections: this.transformCollections(apiData.collections || []),
      photos: this.transformPhotos(apiData.photos || []),
      latestUpdates: this.transformLatestUpdates(apiData.latestUpdates || []),
      hotDaily: this.transformHotDaily(apiData.hotDaily || []),
    }
  }

  // 转换合集数据为CollectionItem类型，处理字段映射和默认值
  private transformCollections(collections: any[]): CollectionItem[] {
    return collections.map(collection => ({
      id: collection.id || collection._id,
      title: collection.title || collection.name,
      type: 'Collection' as const,
      contentType: 'collection' as const,
      imageUrl: collection.poster || collection.imageUrl || collection.coverImage,
      description: collection.description || collection.summary,
      alt: collection.alt || `${collection.title || collection.name} poster`,
      rating: collection.rating?.toString() || '0',
      movieCount: collection.movieCount || 0,
      category: collection.category || '默认分类',
      tags: collection.tags || [],
      createdAt: collection.createdAt || new Date().toISOString(),
      updatedAt: collection.updatedAt || new Date().toISOString(),
      isFeatured: collection.featured || false
    }))
  }

  // 转换写真数据为PhotoItem类型，处理评分、质量、类型等字段
  private transformPhotos(photos: any[]): PhotoItem[] {
    return photos.map((photo, index) => ({
      id: photo.id || photo._id,
      title: photo.title || photo.name,
      type: photo.type === 'series' ? 'TV Show' : 'Movie',
      rating: photo.rating?.toString() || generateRandomRating(),
      imageUrl: photo.poster || photo.imageUrl || photo.coverImage,
      ratingColor: this.getRatingColor(photo.rating),
      quality: photo.quality || this.getRandomQuality(),
      formatType:
        (photo.formatType as 'JPEG高' | 'PNG' | 'WebP' | 'GIF' | 'BMP') ||
        'JPEG高',
      alt: photo.alt || `${photo.title || photo.name} poster`,
      genres: photo.genres || this.getRandomGenres(),
      // 添加NEW标签相关属性
      isNew: photo.isNew !== undefined ? photo.isNew : index < 3, // 前3个默认为新内容
      newType: photo.newType || (['hot', 'latest', 'latest'][index % 3] as 'hot' | 'latest' | null),
    }))
  }

  // 转换最新更新数据为LatestItem类型，处理新片状态和更新类型
  private transformLatestUpdates(latest: any[]): LatestItem[] {
    return latest.map(item => ({
      id: item.id || item._id,
      title: item.title || item.name,
      type: item.type === 'series' ? 'TV Show' : 'Movie',
      rating: item.rating?.toString() || generateRandomRating(),
      imageUrl: item.poster || item.imageUrl || item.coverImage,
      ratingColor: this.getRatingColor(item.rating),
      quality: item.quality || this.getRandomQuality(),
      alt: item.alt || `${item.title || item.name} poster`,
      genres: item.genres || this.getRandomGenres(),
      isNew: item.isNew || Math.random() > 0.7, // 随机设置新片状态
      newType:
        (item.newType as 'hot' | 'latest' | null) ||
        (Math.random() > 0.5 ? 'latest' : 'hot'),
    }))
  }

  // 转换热门数据为HotItem类型，添加排名信息
  private transformHotDaily(hotItems: any[]): HotItem[] {
    return hotItems.map((item, index) => ({
      id: item.id || item._id,
      title: item.title || item.name,
      type: item.type === 'series' ? 'TV Show' : 'Movie',
      rating: item.rating?.toString() || generateRandomRating(),
      imageUrl: item.poster || item.imageUrl || item.coverImage,
      ratingColor: this.getRatingColor(item.rating),
      quality: item.quality || this.getRandomQuality(),
      alt: item.alt || `${item.title || item.name} poster`,
      genres: item.genres || this.getRandomGenres(),
      rank: index + 1, // 设置排名
    }))
  }

  // 根据评分返回对应的颜色标识
  private getRatingColor(
    rating?: number
  ): 'purple' | 'red' | 'white' | 'default' {
    if (!rating) return 'default'
    if (rating >= 9) return 'purple'
    if (rating >= 7) return 'red'
    return 'white'
  }

  // 获取随机的影片质量标识，作为数据缺失时的fallback
  private getRandomQuality(): string {
    const qualities = ['4K HDR', 'HD', 'Dolby Vision', 'SD', '4K', 'IMAX']
    return qualities[Math.floor(Math.random() * qualities.length)]
  }

  // 获取随机的影片类型列表，作为数据缺失时的fallback
  private getRandomGenres(): string[] {
    const allGenres = [
      '动作',
      '科幻',
      '剧情',
      '喜剧',
      '惊悚',
      '恐怖',
      '爱情',
      '动画',
      '冒险',
      '悬疑',
      '犯罪',
      '战争',
      '历史',
      '传记',
      '音乐',
      '家庭',
      '西部',
      '奇幻',
      '运动',
      '纪录片',
    ]

    // 随机选择1-3个类型
    const numGenres = Math.floor(Math.random() * 3) + 1
    const shuffled = [...allGenres].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, numGenres)
  }
}
