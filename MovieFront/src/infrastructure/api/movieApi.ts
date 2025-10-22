/**
 * @fileoverview 影片相关API服务
 * @description 处理影片列表、详情、搜索、分类等API调用，提供完整的影片数据服务。
 *              支持影片数据获取、搜索筛选、推荐系统、用户收藏和观看历史等功能。
 *              遵循RESTful设计原则，提供高性能和可扩展的影片管理API。
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { apiClient } from '@infrastructure/api/ApiClient'

// Movie类型定义 - 影片数据结构，与movieStore保持一致
export interface Movie {
  id: string // 影片唯一标识
  title: string // 影片标题
  description: string // 影片描述
  poster: string // 海报URL
  backdrop?: string // 背景图URL
  genres: string[] // 影片类型
  rating: number // 评分
  year: number // 上映年份
  duration: number // 时长（分钟）
  director?: string // 导演
  actors?: string[] // 主演列表
  qualities?: string[] // 可用质量
  views?: number // 观看次数
  quality?: 'HD' | '4K' | 'BluRay' | 'WebRip' // 主要质量
  size?: string // 文件大小
  downloadCount?: number // 下载次数
  releaseDate?: Date // 上映日期
  country?: string // 制片国家
  language?: string // 语言
  subtitles?: string[] // 字幕语言
  trailerUrl?: string // 预告片URL
  imdbId?: string // IMDB ID
  tmdbId?: string // TMDB ID
}

// 搜索参数接口 - 定义影片搜索的筛选条件
export interface SearchParams {
  query?: string // 搜索关键词
  genre?: string // 影片类型
  year?: number // 上映年份
  rating?: number // 最低评分
  quality?: string // 质量要求
  language?: string // 语言
  sortBy?: 'title' | 'year' | 'rating' | 'downloadCount' | 'releaseDate' // 排序字段
  sortOrder?: 'asc' | 'desc' // 排序方向
  page?: number // 页码
  limit?: number // 每页数量
}

// 辅助函数 - 提取API响应数据，统一处理响应格式
const extractData = async <T>(promise: Promise<{ data: T }>): Promise<T> => {
  const response = await promise
  return response.data
}

// 分页响应接口 - 定义分页数据的标准格式
export interface PaginatedResponse<T> {
  items: T[] // 数据列表
  total: number // 总条数
  page: number // 当前页码
  pageSize: number // 每页条数
  totalPages: number // 总页数
}

// 影片API服务类 - 提供影片相关的所有API调用方法
export class MovieApiService {
  // 获取影片详情 - 根据影片ID获取完整信息
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

  // 获取影片列表 - 支持分页和多种筛选条件
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

  // 获取特色影片 - 获取首页展示的特色推荐影片
  static async getFeaturedMovies(limit: number = 10): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    return extractData(
      apiClient.get<Movie[]>(`/movies/featured?limit=${limit}`)
    )
  }

  // 获取影片详情（别名方法） - 提供与getMovieById相同的功能
  static async getMovieDetail(id: string): Promise<Movie> {
    return this.getMovieById(id)
  }

  // 获取推荐影片 - 根据用户偏好和观看历史推荐相关影片
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

  // 获取热门影片 - 获取当前热门趋势的影片
  static async getHotMovies(limit: number = 10): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    return extractData(
      apiClient.get<Movie[]>(`/movies/hot?limit=${limit}`)
    )
  }

  // 获取最新影片 - 获取最新添加的影片
  static async getLatestMovies(limit: number = 10): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    return extractData(apiClient.get<Movie[]>(`/movies/latest?limit=${limit}`))
  }

  // 获取高评分影片 - 根据时间周期获取高评分影片
  static async getTopRatedMovies(
    period: 'day' | 'week' | 'month' = 'week'
  ): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    return extractData(
      apiClient.get<Movie[]>(`/movies/top-rated?period=${period}`)
    )
  }

  // 获取影片分类 - 获取所有可用的影片类型
  static async getGenres(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200))

    return extractData(apiClient.get<string[]>('/movies/genres'))
  }

  // 获取用户收藏列表 - 获取当前用户收藏的影片
  static async getFavorites(): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 400))

    return extractData(apiClient.get<Movie[]>('/user/favorites'))
  }

  // 获取最近观看列表 - 获取用户最近观看的影片历史
  static async getRecentlyViewed(): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    return extractData(apiClient.get<Movie[]>('/user/recently-viewed'))
  }

  // 搜索影片 - 根据关键词和筛选条件搜索影片
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

  // 获取影片分类 - 获取影片的分类标签
  static async getCategories(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200))

    return extractData(apiClient.get<string[]>('/movies/categories'))
  }

  // 获取相关影片 - 根据影片ID获取相关推荐的影片
  static async getRelatedMovies(movieId: string): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    return extractData(apiClient.get<Movie[]>(`/movies/${movieId}/related`))
  }

  // 获取用户评分 - 获取影片的平均评分和用户的个人评分
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
