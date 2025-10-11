/**
 * @fileoverview 影片相关API服务 - 服务端状态管理
 * @description 处理影片列表、详情、搜索、分类等API调用
 */

// Movie类型定义 - 与movieStore保持一致
export interface Movie {
  id: string
  title: string
  description: string
  poster: string
  backdrop?: string
  genres: string[]
  rating: number
  year: number
  duration: number
  director?: string
  actors?: string[]
  qualities?: string[]
  views?: number
  quality?: 'HD' | '4K' | 'BluRay' | 'WebRip'
  size?: string
  downloadCount?: number
  releaseDate?: Date
  country?: string
  language?: string
  subtitles?: string[]
  trailerUrl?: string
  imdbId?: string
  tmdbId?: string
}
import { apiClient } from '@infrastructure/api/ApiClient'

/**
 * 搜索参数接口
 */
export interface SearchParams {
  query?: string
  genre?: string
  year?: number
  rating?: number
  quality?: string
  language?: string
  sortBy?: 'title' | 'year' | 'rating' | 'downloadCount' | 'releaseDate'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// 辅助函数：提取API响应数据
const extractData = async <T>(promise: Promise<{ data: T }>): Promise<T> => {
  const response = await promise
  return response.data
}

// 分页响应接口
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 影片API服务类
 * 提供影片相关的所有API调用方法
 */
export class MovieApiService {
  /**
   * 获取影片详情
   */
  static async getMovieById(id: string): Promise<Movie> {
    await new Promise(resolve => setTimeout(resolve, 300))

    // 模拟数据 - 实际项目中这里会调用真实API
    const mockMovie: Movie = {
      id,
      title: '阿凡达：水之道',
      description:
        '杰克·萨利一家在潘多拉星球上的新冒险，面临新的威胁和挑战。续集在视觉效果上更加震撼，展现了潘多拉星球的水下世界。',
      poster: 'https://via.placeholder.com/300x450/0066cc/ffffff?text=Avatar+2',
      backdrop:
        'https://via.placeholder.com/1920x1080/0066cc/ffffff?text=Avatar+2+Backdrop',
      genres: ['科幻', '冒险', '动作'],
      rating: 8.5,
      year: 2022,
      duration: 192,
      director: '詹姆斯·卡梅隆',
      actors: ['萨姆·沃辛顿', '佐伊·索尔达娜', '西格妮·韦弗'],
      quality: '4K',
      size: '15.2GB',
      downloadCount: 125000,
      releaseDate: new Date('2022-12-16'),
      country: '美国',
      language: '英语',
      subtitles: ['中文', '英文'],
      trailerUrl: 'https://example.com/avatar2-trailer',
      imdbId: 'tt1630029',
      tmdbId: '76600',
    }

    return mockMovie
  }

  /**
   * 获取影片列表
   */
  static async getMovies(
    page: number = 1,
    filters?: SearchParams
  ): Promise<PaginatedResponse<Movie>> {
    await new Promise(resolve => setTimeout(resolve, 400))

    const queryParams = new URLSearchParams()
    queryParams.append('page', page.toString())

    if (filters) {
      if (filters.query) queryParams.append('query', filters.query)
      if (filters.genre) queryParams.append('genre', filters.genre)
      if (filters.year) queryParams.append('year', filters.year.toString())
      if (filters.rating)
        queryParams.append('rating', filters.rating.toString())
      if (filters.quality) queryParams.append('quality', filters.quality)
      if (filters.language) queryParams.append('language', filters.language)
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder)
      if (filters.limit) queryParams.append('limit', filters.limit.toString())
    }

    return extractData(
      apiClient.get<PaginatedResponse<Movie>>(
        `/movies?${queryParams.toString()}`
      )
    )
  }

  /**
   * 获取特色影片
   */
  static async getFeaturedMovies(limit: number = 10): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    return extractData(
      apiClient.get<Movie[]>(`/movies/featured?limit=${limit}`)
    )
  }

  /**
   * 获取影片详情（别名方法）
   */
  static async getMovieDetail(id: string): Promise<Movie> {
    return this.getMovieById(id)
  }

  /**
   * 获取推荐影片
   */
  static async getRecommendations(
    userId?: string,
    limit: number = 10
  ): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 600))

    const queryParams = new URLSearchParams()
    if (userId) queryParams.append('userId', userId)
    queryParams.append('limit', limit.toString())

    return extractData(
      apiClient.get<Movie[]>(
        `/movies/recommendations?${queryParams.toString()}`
      )
    )
  }

  /**
   * 获取热门影片
   */
  static async getTrendingMovies(limit: number = 10): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    return extractData(
      apiClient.get<Movie[]>(`/movies/trending?limit=${limit}`)
    )
  }

  /**
   * 获取最新影片
   */
  static async getLatestMovies(limit: number = 10): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    return extractData(apiClient.get<Movie[]>(`/movies/latest?limit=${limit}`))
  }

  /**
   * 获取高分影片
   */
  static async getTopRatedMovies(limit: number = 10): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    return extractData(
      apiClient.get<Movie[]>(`/movies/top-rated?limit=${limit}`)
    )
  }

  /**
   * 获取影片分类
   */
  static async getGenres(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200))

    return extractData(apiClient.get<string[]>('/movies/genres'))
  }

  /**
   * 获取用户收藏列表
   */
  static async getFavorites(): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 400))

    return extractData(apiClient.get<Movie[]>('/user/favorites'))
  }

  /**
   * 获取最近观看列表
   */
  static async getRecentlyViewed(): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    return extractData(apiClient.get<Movie[]>('/user/recently-viewed'))
  }

  /**
   * 搜索影片
   */
  static async searchMovies(params: {
    query: string
    filters?: SearchParams
  }): Promise<PaginatedResponse<Movie>> {
    await new Promise(resolve => setTimeout(resolve, 400))

    const queryParams = new URLSearchParams()
    queryParams.append('query', params.query)

    if (params.filters) {
      if (params.filters.genre)
        queryParams.append('genre', params.filters.genre)
      if (params.filters.year)
        queryParams.append('year', params.filters.year.toString())
      if (params.filters.rating)
        queryParams.append('rating', params.filters.rating.toString())
      if (params.filters.quality)
        queryParams.append('quality', params.filters.quality)
      if (params.filters.language)
        queryParams.append('language', params.filters.language)
      if (params.filters.sortBy)
        queryParams.append('sortBy', params.filters.sortBy)
      if (params.filters.sortOrder)
        queryParams.append('sortOrder', params.filters.sortOrder)
      if (params.filters.limit)
        queryParams.append('limit', params.filters.limit.toString())
    }

    return extractData(
      apiClient.get<PaginatedResponse<Movie>>(
        `/movies/search?${queryParams.toString()}`
      )
    )
  }

  /**
   * 获取影片分类
   */
  static async getCategories(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200))

    return extractData(apiClient.get<string[]>('/movies/categories'))
  }

  /**
   * 获取相关影片
   */
  static async getRelatedMovies(movieId: string): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    return extractData(apiClient.get<Movie[]>(`/movies/${movieId}/related`))
  }

  /**
   * 获取热门影片
   */
  static async getPopularMovies(
    period: 'day' | 'week' | 'month' = 'week'
  ): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    return extractData(
      apiClient.get<Movie[]>(`/movies/popular?period=${period}`)
    )
  }

  /**
   * 获取用户评分
   */
  static async getUserRating(
    movieId: string
  ): Promise<{ rating: number; userRating?: number }> {
    await new Promise(resolve => setTimeout(resolve, 200))

    return extractData(
      apiClient.get<{ rating: number; userRating?: number }>(
        `/movies/${movieId}/rating`
      )
    )
  }
}

// 导出API客户端和服务实例
export { apiClient as httpClient } from '@infrastructure/api/ApiClient'
export const movieApi = MovieApiService
