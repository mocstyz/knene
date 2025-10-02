import { Movie, MovieFilters } from '@/application/stores/movieStore'

// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// HTTP客户端配置
class HttpClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // 添加认证令牌
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

const httpClient = new HttpClient(API_BASE_URL)

/**
 * 影片API服务
 */
export class MovieApi {
  /**
   * 获取影片列表
   */
  static async getMovies(params?: {
    page?: number
    limit?: number
    filters?: MovieFilters
    sort?: string
  }): Promise<{ movies: Movie[]; total: number; page: number; totalPages: number }> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.sort) queryParams.append('sort', params.sort)
    
    // 添加过滤参数
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.append(key, value.toString())
        }
      })
    }

    // 构建API端点 - 暂时未使用，为将来的真实API调用预留
    // const endpoint = `/movies${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    // 模拟API响应
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 这里应该返回真实的API数据
    return {
      movies: [], // 实际应该从API获取
      total: 0,
      page: params?.page || 1,
      totalPages: 0
    }
  }

  /**
   * 获取影片详情
   */
  static async getMovieById(id: string): Promise<Movie> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 模拟API调用
    return httpClient.get<Movie>(`/movies/${id}`)
  }

  /**
   * 搜索影片
   */
  static async searchMovies(query: string, params?: {
    page?: number
    limit?: number
  }): Promise<{ movies: Movie[]; total: number; page: number; totalPages: number }> {
    const queryParams = new URLSearchParams()
    queryParams.append('q', query)
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    await new Promise(resolve => setTimeout(resolve, 400))
    
    return httpClient.get<{ movies: Movie[]; total: number; page: number; totalPages: number }>(
      `/movies/search?${queryParams.toString()}`
    )
  }

  /**
   * 获取推荐影片
   */
  static async getRecommendations(userId?: string, limit: number = 10): Promise<Movie[]> {
    const queryParams = new URLSearchParams()
    if (userId) queryParams.append('userId', userId)
    queryParams.append('limit', limit.toString())

    await new Promise(resolve => setTimeout(resolve, 600))
    
    return httpClient.get<Movie[]>(`/movies/recommendations?${queryParams.toString()}`)
  }

  /**
   * 获取热门影片
   */
  static async getTrendingMovies(limit: number = 10): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return httpClient.get<Movie[]>(`/movies/trending?limit=${limit}`)
  }

  /**
   * 获取最新影片
   */
  static async getLatestMovies(limit: number = 10): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return httpClient.get<Movie[]>(`/movies/latest?limit=${limit}`)
  }

  /**
   * 获取高分影片
   */
  static async getTopRatedMovies(limit: number = 10): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return httpClient.get<Movie[]>(`/movies/top-rated?limit=${limit}`)
  }

  /**
   * 获取影片分类
   */
  static async getGenres(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return httpClient.get<string[]>('/movies/genres')
  }

  /**
   * 按分类获取影片
   */
  static async getMoviesByGenre(genre: string, params?: {
    page?: number
    limit?: number
  }): Promise<{ movies: Movie[]; total: number; page: number; totalPages: number }> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    await new Promise(resolve => setTimeout(resolve, 400))
    
    return httpClient.get<{ movies: Movie[]; total: number; page: number; totalPages: number }>(
      `/movies/genre/${genre}?${queryParams.toString()}`
    )
  }

  /**
   * 获取相似影片
   */
  static async getSimilarMovies(movieId: string, limit: number = 6): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return httpClient.get<Movie[]>(`/movies/${movieId}/similar?limit=${limit}`)
  }

  /**
   * 添加到收藏
   */
  static async addToFavorites(movieId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return httpClient.post<void>('/user/favorites', { movieId })
  }

  /**
   * 从收藏中移除
   */
  static async removeFromFavorites(movieId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return httpClient.delete<void>(`/user/favorites/${movieId}`)
  }

  /**
   * 获取用户收藏列表
   */
  static async getFavorites(): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return httpClient.get<Movie[]>('/user/favorites')
  }

  /**
   * 添加到最近观看
   */
  static async addToRecentlyViewed(movieId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return httpClient.post<void>('/user/recently-viewed', { movieId })
  }

  /**
   * 获取最近观看列表
   */
  static async getRecentlyViewed(): Promise<Movie[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return httpClient.get<Movie[]>('/user/recently-viewed')
  }

  /**
   * 评分影片
   */
  static async rateMovie(movieId: string, rating: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return httpClient.post<void>(`/movies/${movieId}/rate`, { rating })
  }

  /**
   * 获取影片评分
   */
  static async getMovieRating(movieId: string): Promise<{ rating: number; userRating?: number }> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return httpClient.get<{ rating: number; userRating?: number }>(`/movies/${movieId}/rating`)
  }

  /**
   * 获取影片统计信息
   */
  static async getMovieStats(movieId: string): Promise<{
    views: number
    downloads: number
    favorites: number
    ratings: number
    averageRating: number
  }> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return httpClient.get<{
      views: number
      downloads: number
      favorites: number
      ratings: number
      averageRating: number
    }>(`/movies/${movieId}/stats`)
  }

  /**
   * 报告影片问题
   */
  static async reportMovie(movieId: string, issue: {
    type: 'broken_link' | 'wrong_info' | 'copyright' | 'other'
    description: string
  }): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return httpClient.post<void>(`/movies/${movieId}/report`, issue)
  }

  /**
   * 获取影片下载链接
   */
  static async getDownloadUrl(movieId: string, quality: string): Promise<{
    url: string
    expiresAt: string
    fileSize: number
    fileName: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return httpClient.post<{
      url: string
      expiresAt: string
      fileSize: number
      fileName: string
    }>(`/movies/${movieId}/download`, { quality })
  }

  /**
   * 验证下载权限
   */
  static async validateDownloadPermission(movieId: string, quality: string): Promise<{
    canDownload: boolean
    reason?: string
    requiredSubscription?: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return httpClient.get<{
      canDownload: boolean
      reason?: string
      requiredSubscription?: string
    }>(`/movies/${movieId}/download/validate?quality=${quality}`)
  }
}

// 导出HTTP客户端供其他API使用
export { httpClient }