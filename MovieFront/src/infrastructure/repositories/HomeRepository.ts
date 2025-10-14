/**
 * @fileoverview 首页数据仓储接口
 * @description 定义首页数据的获取规范，支持专题、写真、最新更新、24小时TOP等模块。
 * 遵循DDD架构中的仓储模式，抽象数据访问层。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { MOVIE_ENDPOINTS } from '@infrastructure/api/endpoints'
import { generateRandomRating } from '@utils/formatters'

/**
 * 简单电影项目接口（与MovieList组件保持一致）
 */
export interface SimpleMovieItem {
  id: string
  title: string
  type: 'Movie' | 'TV Show' | 'Collection'
  rating: string
  imageUrl: string
  ratingColor?: 'purple' | 'red' | 'white' | 'default'
  quality?: string
  description?: string
  alt?: string
}

/**
 * 首页数据响应接口
 */
export interface HomeDataResponse {
  /** 专题数据 */
  topics: SimpleMovieItem[]
  /** 写真数据 */
  photos: SimpleMovieItem[]
  /** 最新更新数据 */
  latestUpdates: SimpleMovieItem[]
  /** 24小时TOP数据 */
  topDaily: SimpleMovieItem[]
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
  getTopics(limit?: number): Promise<SimpleMovieItem[]>

  /**
   * 获取写真数据
   * @param limit 数量限制
   * @returns 写真列表
   */
  getPhotos(limit?: number): Promise<SimpleMovieItem[]>

  /**
   * 获取最新更新数据
   * @param limit 数量限制
   * @returns 最新更新列表
   */
  getLatestUpdates(limit?: number): Promise<SimpleMovieItem[]>

  /**
   * 获取24小时TOP数据
   * @param limit 数量限制
   * @returns TOP列表
   */
  getTopDaily(limit?: number): Promise<SimpleMovieItem[]>
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
        topDaily: [],
      }
    }
  }

  /**
   * 获取专题数据
   */
  async getTopics(limit = 3): Promise<SimpleMovieItem[]> {
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
  async getPhotos(limit = 6): Promise<SimpleMovieItem[]> {
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
      return this.transformMovies(data)
    } catch (error) {
      console.error('Error fetching photos:', error)
      return []
    }
  }

  /**
   * 获取最新更新数据
   */
  async getLatestUpdates(limit = 6): Promise<SimpleMovieItem[]> {
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
      return this.transformMovies(data)
    } catch (error) {
      console.error('Error fetching latest updates:', error)
      return []
    }
  }

  /**
   * 获取24小时TOP数据
   */
  async getTopDaily(limit = 6): Promise<SimpleMovieItem[]> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    const apiUrl = new URL(
      `${MOVIE_ENDPOINTS.TRENDING}/daily`,
      window.location.origin + baseUrl
    )
    apiUrl.searchParams.append('limit', limit.toString())

    try {
      const response = await fetch(apiUrl.toString())

      if (!response.ok) {
        throw new Error(`Failed to fetch top daily: ${response.status}`)
      }

      const data = await response.json()
      return this.transformMovies(data)
    } catch (error) {
      console.error('Error fetching top daily:', error)
      return []
    }
  }

  /**
   * 转换API响应数据为前端格式
   */
  private transformApiResponse(apiData: any): HomeDataResponse {
    return {
      topics: this.transformTopics(apiData.topics || []),
      photos: this.transformMovies(apiData.photos || []),
      latestUpdates: this.transformMovies(apiData.latestUpdates || []),
      topDaily: this.transformMovies(apiData.topDaily || []),
    }
  }

  /**
   * 转换专题数据 - 专题不需要评分信息
   */
  private transformTopics(topics: any[]): SimpleMovieItem[] {
    return topics.map(topic => ({
      id: topic.id || topic._id,
      title: topic.title || topic.name,
      type: 'Collection' as const,
      rating: '', // 专题不需要评分信息
      imageUrl: topic.poster || topic.imageUrl || topic.coverImage,
      ratingColor: 'default' as const,
      description: topic.description || topic.summary,
      alt: topic.alt || `${topic.title || topic.name} poster`,
    }))
  }

  /**
   * 转换电影数据
   */
  private transformMovies(movies: any[]): SimpleMovieItem[] {
    return movies.map(movie => ({
      id: movie.id || movie._id,
      title: movie.title || movie.name,
      type: movie.type === 'series' ? 'TV Show' : 'Movie',
      rating: movie.rating?.toString() || generateRandomRating(),
      imageUrl: movie.poster || movie.imageUrl || movie.coverImage,
      ratingColor: this.getRatingColor(movie.rating),
      quality: movie.quality || this.getRandomQuality(),
      description: movie.description || movie.summary,
      alt: movie.alt || `${movie.title || movie.name} poster`,
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
}
