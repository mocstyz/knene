/**
 * @fileoverview 首页数据仓储接口
 * @description 定义首页数据的获取规范，支持专题、写真、最新更新、24小时热门等模块。
 * 遵循DDD架构中的仓储模式，抽象数据访问层。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { MOVIE_ENDPOINTS } from '@infrastructure/api/endpoints'
import { generateRandomRating } from '@utils/formatters'
import type {
  TopicItem,
  PhotoItem,
  LatestItem,
  BaseMovieItem,
} from '@types-movie/movie.types'

/**
 * 热门项目接口 - 扩展基础接口
 */
export interface HotItem extends BaseMovieItem {
  /** 排名 */
  rank?: number
}

/**
 * 首页数据响应接口
 * 使用具体的领域类型，遵循DDD架构原则
 */
export interface HomeDataResponse {
  /** 专题数据 */
  topics: TopicItem[]
  /** 写真数据 */
  photos: PhotoItem[]
  /** 最新更新数据 */
  latestUpdates: LatestItem[]
  /** 24小时热门数据 */
  hotDaily: HotItem[]
}

/**
 * 首页数据获取参数
 */
export interface HomeDataParams {
  /** 每个模块返回的数据数量限制 */
  limit?: number
  /** 是否包含评分信息 */
  includeRatings?: boolean
  /** 图片质量配置 */
  imageQuality?: 'low' | 'medium' | 'high'
}

/**
 * 首页仓储接口
 * 使用具体的领域类型，遵循DDD架构原则
 */
export interface IHomeRepository {
  /**
   * 获取首页所有模块数据
   * @param params 获取参数
   * @returns 首页数据响应
   */
  getHomeData(params?: HomeDataParams): Promise<HomeDataResponse>

  /**
   * 获取专题数据
   * @param limit 数量限制
   * @returns 专题列表
   */
  getTopics(limit?: number): Promise<TopicItem[]>

  /**
   * 获取写真数据
   * @param limit 数量限制
   * @returns 写真列表
   */
  getPhotos(limit?: number): Promise<PhotoItem[]>

  /**
   * 获取最新更新数据
   * @param limit 数量限制
   * @returns 最新更新列表
   */
  getLatestUpdates(limit?: number): Promise<LatestItem[]>

  /**
   * 获取24小时热门数据
   * @param limit 数量限制
   * @returns 热门列表
   */
  getHotDaily(limit?: number): Promise<HotItem[]>
}

/**
 * 首页仓储实现类
 */
export class HomeRepository implements IHomeRepository {
  /**
   * 获取首页所有模块数据
   */
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
      console.error('Error fetching home data:', error)

      // 如果API调用失败，返回空数据
      return {
        topics: [],
        photos: [],
        latestUpdates: [],
        hotDaily: [],
      }
    }
  }

  /**
   * 获取专题数据
   */
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
      console.error('Error fetching topics:', error)
      return []
    }
  }

  /**
   * 获取写真数据
   */
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
      console.error('Error fetching photos:', error)
      return []
    }
  }

  /**
   * 获取最新更新数据
   */
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
      console.error('Error fetching latest updates:', error)
      return []
    }
  }

  /**
   * 获取24小时热门数据
   */
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
      console.error('Error fetching hot daily:', error)
      return []
    }
  }

  /**
   * 转换API响应数据为前端格式
   */
  private transformApiResponse(apiData: any): HomeDataResponse {
    return {
      topics: this.transformTopics(apiData.topics || []),
      photos: this.transformPhotos(apiData.photos || []),
      latestUpdates: this.transformLatestUpdates(apiData.latestUpdates || []),
      hotDaily: this.transformHotDaily(apiData.hotDaily || []),
    }
  }

  /**
   * 转换专题数据 - 直接返回TopicItem类型
   */
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

  /**
   * 转换写真数据 - 直接返回PhotoItem类型
   */
  private transformPhotos(photos: any[]): PhotoItem[] {
    return photos.map(photo => ({
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
    }))
  }

  /**
   * 转换最新更新数据 - 直接返回LatestItem类型
   */
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
        (item.newType as 'new' | 'update' | 'today' | 'latest') ||
        (Math.random() > 0.5 ? 'new' : 'update'),
    }))
  }

  /**
   * 转换热门数据 - 直接返回HotItem类型
   */
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

  /**
   * 根据评分获取颜色
   */
  private getRatingColor(
    rating?: number
  ): 'purple' | 'red' | 'white' | 'default' {
    if (!rating) return 'default'
    if (rating >= 9) return 'purple'
    if (rating >= 7) return 'red'
    return 'white'
  }

  /**
   * 获取随机质量（作为fallback）
   */
  private getRandomQuality(): string {
    const qualities = ['4K HDR', 'HD', 'Dolby Vision', 'SD', '4K', 'IMAX']
    return qualities[Math.floor(Math.random() * qualities.length)]
  }

  /**
   * 获取随机类型（作为fallback）
   */
  private getRandomGenres(): string[] {
    const allGenres = [
      '动作', '科幻', '剧情', '喜剧', '惊悚', '恐怖', '爱情', '动画',
      '冒险', '悬疑', '犯罪', '战争', '历史', '传记', '音乐', '家庭',
      '西部', '奇幻', '运动', '纪录片'
    ]

    // 随机选择1-3个类型
    const numGenres = Math.floor(Math.random() * 3) + 1
    const shuffled = [...allGenres].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, numGenres)
  }
}
