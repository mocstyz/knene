/**
 * @fileoverview 首页数据仓储接口
 * @description 定义首页数据的获取规范，支持专题、写真、最新更新、24小时热门等模块。
 * 遵循DDD架构中的仓储模式，抽象数据访问层。
 * @created 2025-10-15 15:00:00
 * @updated 2025-10-19 10:50:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { MOVIE_ENDPOINTS } from '@infrastructure/api/endpoints'
import type {
  TopicItem,
  PhotoItem,
  LatestItem,
  BaseMovieItem,
} from '@types-movie'
import { generateRandomRating } from '@utils/formatters'


// 热门项目接口，扩展基础接口，添加排名功能
export interface HotItem extends BaseMovieItem {
  rank?: number // 排名
}

// 首页数据响应接口，使用具体的领域类型，遵循DDD架构原则
export interface HomeDataResponse {
  topics: TopicItem[] // 专题数据
  photos: PhotoItem[] // 写真数据
  latestUpdates: LatestItem[] // 最新更新数据
  hotDaily: HotItem[] // 24小时热门数据
}

// 首页数据获取参数配置接口
export interface HomeDataParams {
  limit?: number // 每个模块返回的数据数量限制
  includeRatings?: boolean // 是否包含评分信息
  imageQuality?: 'low' | 'medium' | 'high' // 图片质量配置
}

// 首页仓储接口，使用具体的领域类型，遵循DDD架构原则
export interface IHomeRepository {
  // 获取首页所有模块数据
  getHomeData(params?: HomeDataParams): Promise<HomeDataResponse>
  // 获取专题数据
  getTopics(limit?: number): Promise<TopicItem[]>
  // 获取写真数据
  getPhotos(limit?: number): Promise<PhotoItem[]>
  // 获取最新更新数据
  getLatestUpdates(limit?: number): Promise<LatestItem[]>
  // 获取24小时热门数据
  getHotDaily(limit?: number): Promise<HotItem[]>
}

// 首页仓储实现类，提供首页数据的获取和转换功能
export class HomeRepository implements IHomeRepository {
  // 获取首页所有模块数据，支持配置参数和错误处理
  async getHomeData(params: HomeDataParams = {}): Promise<HomeDataResponse> {
    const { limit = 6, includeRatings = true, imageQuality = 'medium' } = params

    // 构建API URL
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    const apiUrl = new URL(
      MOVIE_ENDPOINTS.TRENDING,
      window.location.origin + baseUrl
    )

    // 添加查询参数
    apiUrl.searchParams.append('limit', limit.toString())
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

      // 如果API调用失败，返回空数据
      return {
        topics: [],
        photos: [],
        latestUpdates: [],
        hotDaily: [],
      }
    }
  }

  // 获取专题数据，支持数量限制和错误处理
  async getTopics(limit = 3): Promise<TopicItem[]> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    const apiUrl = new URL(
      `${MOVIE_ENDPOINTS.CATEGORIES}/topics`,
      window.location.origin + baseUrl
    )
    apiUrl.searchParams.append('limit', limit.toString())

    try {
      const response = await fetch(apiUrl.toString())

      if (!response.ok) {
        throw new Error(`Failed to fetch topics: ${response.status}`)
      }

      const data = await response.json()
      return this.transformTopics(data)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('Development: API not available, using mock data for topics')
      } else {
        console.error('Error fetching topics:', error)
      }
      return []
    }
  }

  // 获取写真数据，支持数量限制和错误处理
  async getPhotos(limit = 6): Promise<PhotoItem[]> {
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
      return []
    }
  }

  // 获取最新更新数据，支持数量限制和错误处理
  async getLatestUpdates(limit = 6): Promise<LatestItem[]> {
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
      return []
    }
  }

  // 获取24小时热门数据，支持数量限制和错误处理
  async getHotDaily(limit = 6): Promise<HotItem[]> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    const apiUrl = new URL(
      `${MOVIE_ENDPOINTS.TRENDING}/daily`,
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
      return []
    }
  }

  // 转换API响应数据为前端统一格式
  private transformApiResponse(apiData: any): HomeDataResponse {
    return {
      topics: this.transformTopics(apiData.topics || []),
      photos: this.transformPhotos(apiData.photos || []),
      latestUpdates: this.transformLatestUpdates(apiData.latestUpdates || []),
      hotDaily: this.transformHotDaily(apiData.hotDaily || []),
    }
  }

  // 转换专题数据为TopicItem类型，处理字段映射和默认值
  private transformTopics(topics: any[]): TopicItem[] {
    return topics.map(topic => ({
      id: topic.id || topic._id,
      title: topic.title || topic.name,
      type: 'Collection' as const,
      imageUrl: topic.poster || topic.imageUrl || topic.coverImage,
      description: topic.description || topic.summary,
      alt: topic.alt || `${topic.title || topic.name} poster`,
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
