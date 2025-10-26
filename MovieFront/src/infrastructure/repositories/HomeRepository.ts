/**
 * @fileoverview 首页数据仓储实现
 * @description 首页数据仓储实现，遵循DDD Repository模式，通过API服务工厂获取数据源
 *              提供首页数据的获取和转换功能，包括专题、写真、最新更新、热门内容等模块
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
import { environmentConfig } from '@infrastructure/config/EnvironmentConfig'
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
  hotDaily: HotItem[]
}

// 首页仓储实现类
export class HomeRepository implements IHomeRepository {
  // 验证内容项数据完整性
  private validateContentItem(item: any, type: string): boolean {
    const requiredFields = ['id', 'title', 'imageUrl']
    const missingFields: string[] = []

    for (const field of requiredFields) {
      if (!item[field]) {
        missingFields.push(field)
      }
    }

    // 检查isVip字段（必填）
    if (item.isVip === undefined || item.isVip === null) {
      missingFields.push('isVip')
    }

    if (missingFields.length > 0) {
      console.warn(`⚠️ [HomeRepository] ${type}数据缺失字段:`, {
        id: item.id || 'unknown',
        title: item.title || 'unknown',
        missingFields
      })
      return false
    }

    return true
  }

  // 验证并修复数据（回退逻辑）
  private validateAndFixData<T extends { id: string; title: string; isVip?: boolean }>(items: T[], type: string): T[] {
    return items.map(item => {
      // 验证数据
      this.validateContentItem(item, type)

      // 回退逻辑：确保isVip字段存在
      if (item.isVip === undefined || item.isVip === null) {
        console.warn(`⚠️ [HomeRepository] ${type}数据缺失isVip字段，使用回退值false:`, item.id)
        return { ...item, isVip: false as any }
      }

      return item
    })
  }

  // 获取首页所有模块数据
  async getHomeData(params: ApiHomeDataParams = {}): Promise<HomeDataResponse> {
    const {
      collectionsLimit = 3,
      photosLimit = 6,
      latestLimit = 6,
      hotLimit = 6,
      includeRatings = true,
      imageQuality = 'medium'
    } = params

    // 检查是否启用Mock数据
    if (environmentConfig.isMockEnabled()) {
      console.log('🔧 使用Mock数据模式 - getHomeData')

      // 直接使用Mock数据服务，无需转换
      const collections = mockDataService.getMockCollections(collectionsLimit)
      const photos = mockDataService.getMockPhotos(photosLimit)
      const latestUpdates = mockDataService.getMockLatestUpdates(latestLimit)
      const hotDaily = mockDataService.getMockHotDaily(hotLimit)

      // 验证数据完整性
      const result = {
        collections: this.validateAndFixData(collections, 'Collection'),
        photos: this.validateAndFixData(photos, 'Photo'),
        latestUpdates: this.validateAndFixData(latestUpdates, 'LatestUpdate'),
        hotDaily: this.validateAndFixData(hotDaily, 'HotDaily'),
      }

      console.log('📦 [HomeRepository] Mock数据准备完成（已验证）:', {
        collections: result.collections?.length || 0,
        photos: result.photos?.length || 0,
        latestUpdates: result.latestUpdates?.length || 0,
        hotDaily: result.hotDaily?.length || 0
      })

      return result
    }

    // 构建API URL
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    // 确保baseUrl是完整的URL或者正确的相对路径
    const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `${window.location.origin}${baseUrl}`
    const apiUrl = new URL(MOVIE_ENDPOINTS.HOT, fullBaseUrl)

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
      console.error('Error fetching home data:', error)

      // API调用失败时的回退处理
      if (environmentConfig.isDevelopment()) {
        console.log('Development: API调用失败，回退到Mock数据')

        // 直接使用Mock数据服务作为回退，并验证数据完整性
        const collections = mockDataService.getMockCollections(collectionsLimit)
        const photos = mockDataService.getMockPhotos(photosLimit)
        const latestUpdates = mockDataService.getMockLatestUpdates(latestLimit)
        const hotDaily = mockDataService.getMockHotDaily(hotLimit)

        return {
          collections: this.validateAndFixData(collections, 'Collection'),
          photos: this.validateAndFixData(photos, 'Photo'),
          latestUpdates: this.validateAndFixData(latestUpdates, 'LatestUpdate'),
          hotDaily: this.validateAndFixData(hotDaily, 'HotDaily'),
        }
      }

      // 生产环境抛出错误
      throw error
    }
  }

  // 获取专题合集数据
  async getCollections(params?: CollectionsQueryParams): Promise<CollectionItem[]> {
    const {
      limit = 8,
      offset = 0,
      category,
      featured = false,
      sortBy = 'latest'
    } = params || {}

    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    // 确保baseUrl是完整的URL或者正确的相对路径
    const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `${window.location.origin}${baseUrl}`
    const apiUrl = new URL(MOVIE_ENDPOINTS.COLLECTIONS, fullBaseUrl)

    // 添加查询参数
    apiUrl.searchParams.append('limit', limit.toString())
    apiUrl.searchParams.append('offset', offset.toString())
    if (category) apiUrl.searchParams.append('category', category)
    if (featured) apiUrl.searchParams.append('featured', 'true')
    if (sortBy) apiUrl.searchParams.append('sortBy', sortBy)

    try {
      const response = await fetch(apiUrl.toString())

      if (!response.ok) {
        throw new Error(`Failed to fetch collections: ${response.status}`)
      }

      const data = await response.json()

      // 后端API数据格式转换
      return this.transformCollections(data)
    } catch (error) {
      console.error('Error fetching collections:', error)

      // API调用失败时的回退处理
      if (environmentConfig.isDevelopment()) {
        console.log('Development: API调用失败，回退到Mock数据 - Collections')

        // 直接使用Mock数据服务作为回退，并验证数据完整性
        const collections = mockDataService.getMockCollections(limit)
        return this.validateAndFixData(collections, 'Collection')
      }

      // 生产环境抛出错误
      throw error
    }
  }

  // 获取写真内容数据
  async getPhotos(params?: PhotosQueryParams): Promise<PhotoItem[]> {
    const {
      limit = 12,
      offset = 0,
      category,
      quality = 'all',
      orientation = 'all'
    } = params || {}

    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    // 确保baseUrl是完整的URL或者正确的相对路径
    const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `${window.location.origin}${baseUrl}`
    const apiUrl = new URL(MOVIE_ENDPOINTS.PHOTOS, fullBaseUrl)

    // 添加查询参数
    apiUrl.searchParams.append('limit', limit.toString())
    apiUrl.searchParams.append('offset', offset.toString())
    if (category) apiUrl.searchParams.append('category', category)
    if (quality !== 'all') apiUrl.searchParams.append('quality', quality)
    if (orientation !== 'all') apiUrl.searchParams.append('orientation', orientation)

    try {
      const response = await fetch(apiUrl.toString())

      if (!response.ok) {
        throw new Error(`Failed to fetch photos: ${response.status}`)
      }

      const data = await response.json()

      // 后端API数据格式转换
      return this.transformPhotos(data)
    } catch (error) {
      console.error('Error fetching photos:', error)

      // API调用失败时的回退处理
      if (environmentConfig.isDevelopment()) {
        console.log('Development: API调用失败，回退到Mock数据 - Photos')

        // 使用Mock数据服务作为回退，并验证数据完整性
        const photos = mockDataService.getMockPhotos(limit)
        return this.validateAndFixData(photos, 'Photo')
      }

      // 生产环境抛出错误
      throw error
    }
  }

  // 获取最新更新数据
  async getLatestUpdates(params?: LatestUpdatesQueryParams): Promise<LatestItem[]> {
    const limit = params?.limit || 6
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    // 确保baseUrl是完整的URL或者正确的相对路径
    const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `${window.location.origin}${baseUrl}`
    const apiUrl = new URL(
      MOVIE_ENDPOINTS.LATEST,
      fullBaseUrl
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

  // 获取24小时热门数据
  async getHotDaily(limit = 6): Promise<HotItem[]> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    // 确保baseUrl是完整的URL或者正确的相对路径
    const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `${window.location.origin}${baseUrl}`
    const apiUrl = new URL(
      `${MOVIE_ENDPOINTS.HOT}/daily`,
      fullBaseUrl
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

  // 获取热门内容列表
  async getHotContent(params?: HotContentQueryParams): Promise<HotItem[]> {
    const { limit = 6, period = 'daily', minRating = 0 } = params || {}

    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    // 确保baseUrl是完整的URL或者正确的相对路径
    const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `${window.location.origin}${baseUrl}`
    const apiUrl = new URL(MOVIE_ENDPOINTS.HOT, fullBaseUrl)

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
      } else {
        console.error('Error fetching hot content:', error)
      }
      // 使用Mock数据服务作为回退
      return mockDataService.getMockHotDaily(limit)
    }
  }

  // 获取每日热门推荐
  async getDailyHot(limit = 6): Promise<HotItem[]> {
    return this.getHotContent({ limit, period: 'daily' })
  }

  // 获取精选专题
  async getFeaturedCollections(limit = 3): Promise<CollectionItem[]> {
    return this.getCollections({ limit, featured: true, sortBy: 'featured' })
  }

  // 获取最新写真
  async getLatestPhotos(limit = 6): Promise<PhotoItem[]> {
    return this.getPhotos({ limit, quality: 'all', orientation: 'all' })
  }

  // 获取轮播图数据
  async getBannerData(): Promise<{
    id: string
    title: string
    description: string
    imageUrl: string
    linkUrl: string
    priority: number
  }[]> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    // 确保baseUrl是完整的URL或者正确的相对路径
    const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `${window.location.origin}${baseUrl}`
    const apiUrl = new URL('/banners', fullBaseUrl)

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

  // 获取公告信息
  async getAnnouncements(): Promise<{
    id: string
    title: string
    content: string
    type: 'info' | 'warning' | 'success' | 'error'
    publishTime: string
    isImportant: boolean
  }[]> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    // 确保baseUrl是完整的URL或者正确的相对路径
    const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `${window.location.origin}${baseUrl}`
    const apiUrl = new URL('/announcements', fullBaseUrl)

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

  // 获取网站统计信息
  async getSiteStats(): Promise<{
    totalMovies: number
    totalCollections: number
    totalPhotos: number
    totalUsers: number
    todayVisits: number
  }> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    // 确保baseUrl是完整的URL或者正确的相对路径
    const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `${window.location.origin}${baseUrl}`
    const apiUrl = new URL('/stats', fullBaseUrl)

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

  // 刷新首页缓存
  async refreshCache(): Promise<void> {
    // 在实际实现中，这里会清理相关的缓存
    if (import.meta.env.DEV) {
      console.log('Development: Cache refresh requested')
    }
  }

  // 转换API响应数据
  private transformApiResponse(apiData: any): HomeDataResponse {
    return {
      collections: this.transformCollections(apiData.collections || []),
      photos: this.transformPhotos(apiData.photos || []),
      latestUpdates: this.transformLatestUpdates(apiData.latestUpdates || []),
      hotDaily: this.transformHotDaily(apiData.hotDaily || []),
    }
  }

  // 转换合集数据为CollectionItem类型
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
      isFeatured: collection.featured || false,
      // VIP相关字段 - 确保从Mock数据或API响应中传递
      isVip: collection.isVip !== undefined ? collection.isVip : true, // 合集默认为VIP
      isNew: collection.isNew !== undefined ? collection.isNew : false,
      newType: collection.newType || null,
      // 统计字段
      viewCount: collection.viewCount,
      downloadCount: collection.downloadCount,
      likeCount: collection.likeCount,
      favoriteCount: collection.favoriteCount
    }))
  }

  // 转换写真数据为PhotoItem类型
  private transformPhotos(photos: any[]): PhotoItem[] {
    return photos.map((photo, index) => ({
      id: photo.id || photo._id,
      title: photo.title || photo.name,
      type: photo.type === 'series' ? 'TV Show' : 'Movie',
      rating: photo.rating?.toString() || generateRandomRating(),
      imageUrl: photo.poster || photo.imageUrl || photo.coverImage,
      ratingColor: 'white',
      quality: photo.quality || this.getRandomQuality(),
      formatType:
        (photo.formatType as 'JPEG高' | 'PNG' | 'WebP' | 'GIF' | 'BMP') ||
        'JPEG高',
      alt: photo.alt || `${photo.title || photo.name} poster`,
      genres: photo.genres || this.getRandomGenres(),
      // VIP相关字段 - 确保从Mock数据或API响应中传递
      isVip: photo.isVip !== undefined ? photo.isVip : true, // 写真默认为VIP
      isNew: photo.isNew !== undefined ? photo.isNew : index < 3, // 前3个默认为新内容
      newType: photo.newType || (['hot', 'latest', 'latest'][index % 3] as 'hot' | 'latest' | null),
      // 统计字段
      viewCount: photo.viewCount,
      downloadCount: photo.downloadCount,
      likeCount: photo.likeCount,
      favoriteCount: photo.favoriteCount,
      contentType: 'photo' as const
    }))
  }

  // 转换最新更新数据为LatestItem类型
  private transformLatestUpdates(latest: any[]): LatestItem[] {
    return latest.map((item, index) => ({
      id: item.id || item._id,
      title: item.title || item.name,
      type: item.type === 'series' ? 'TV Show' : 'Movie',
      rating: item.rating?.toString() || generateRandomRating(),
      imageUrl: item.poster || item.imageUrl || item.coverImage,
      ratingColor: 'white',
      quality: item.quality || this.getRandomQuality(),
      alt: item.alt || `${item.title || item.name} poster`,
      genres: item.genres || this.getRandomGenres(),
      // VIP相关字段 - 确保从Mock数据或API响应中传递
      isVip: item.isVip !== undefined ? item.isVip : false, // 最新更新根据数据源决定
      isNew: item.isNew || false,
      newType: (item.newType as 'hot' | 'latest' | null) || 'latest',
      // 统计字段
      viewCount: item.viewCount,
      downloadCount: item.downloadCount,
      likeCount: item.likeCount,
      favoriteCount: item.favoriteCount,
      contentType: item.contentType || (item.type === 'Collection' ? 'collection' : item.type === 'Photo' ? 'photo' : 'movie')
    }))
  }

  // 转换热门数据为HotItem类型
  private transformHotDaily(hotItems: any[]): HotItem[] {
    return hotItems.map((item, index) => ({
      id: item.id || item._id,
      title: item.title || item.name,
      type: item.type === 'series' ? 'TV Show' : 'Movie',
      rating: item.rating?.toString() || generateRandomRating(),
      imageUrl: item.poster || item.imageUrl || item.coverImage,
      ratingColor: 'white',
      quality: item.quality || this.getRandomQuality(),
      alt: item.alt || `${item.title || item.name} poster`,
      genres: item.genres || this.getRandomGenres(),
      rank: index + 1, // 设置排名
      // VIP相关字段 - 确保从Mock数据或API响应中传递
      isVip: item.isVip !== undefined ? item.isVip : false, // 热门内容根据数据源决定
      isNew: item.isNew !== undefined ? item.isNew : false,
      newType: item.newType || null,
      // 统计字段
      viewCount: item.viewCount,
      downloadCount: item.downloadCount,
      likeCount: item.likeCount,
      favoriteCount: item.favoriteCount,
      hotScore: item.hotScore,
      contentType: item.contentType || (item.type === 'Collection' ? 'collection' : item.type === 'Photo' ? 'photo' : 'movie')
    }))
  }



  // 获取随机的影片质量标识
  private getRandomQuality(): string {
    const qualities = ['4K HDR', 'HD', 'Dolby Vision', 'SD', '4K', 'IMAX']
    return qualities[Math.floor(Math.random() * qualities.length)]
  }

  // 获取随机的影片类型列表
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
