import { MovieFilters } from '@application/stores/movieStore'
import { Movie as DomainMovie } from '@domain/entities/Movie'
import { MovieRepository } from '@infrastructure/repositories/MovieRepository'

/**
 * 电影仓储实现
 * 负责电影数据的持久化和查询
 */
export class MovieRepositoryImpl implements MovieRepository {
  private cache = new Map<string, DomainMovie>()
  private cacheExpiry = new Map<string, number>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

  /**
   * 获取认证令牌
   */
  private getAuthToken(): string {
    return localStorage.getItem('authToken') || ''
  }

  /**
   * 根据ID查找电影
   */
  async findById(id: string): Promise<DomainMovie | null> {
    try {
      // 1. 检查缓存
      const cached = this.getFromCache(id)
      if (cached) return cached

      // 2. 从API获取数据
      const response = await fetch(`/api/movies/${id}`)
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`获取电影失败: ${response.statusText}`)
      }

      const movieData = await response.json()
      const movie = this.mapToMovieEntity(movieData)

      // 3. 缓存结果
      this.setCache(id, movie)

      return movie
    } catch (error) {
      console.error('查找电影失败:', error)
      throw error
    }
  }

  /**
   * 获取所有电影
   */
  async findAll(): Promise<DomainMovie[]> {
    try {
      const response = await fetch('/api/movies')
      if (!response.ok) {
        throw new Error(`获取电影列表失败: ${response.statusText}`)
      }

      const moviesData = await response.json()
      return moviesData.map((data: any) => this.mapToMovieEntity(data))
    } catch (error) {
      console.error('获取电影列表失败:', error)
      throw error
    }
  }

  /**
   * 保存电影
   */
  async save(movie: DomainMovie): Promise<DomainMovie> {
    try {
      const movieData = this.mapFromMovieEntity(movie)

      const response = await fetch(`/api/movies/${movie.detail.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
      })

      if (!response.ok) {
        throw new Error(`保存电影失败: ${response.statusText}`)
      }

      const savedMovieData = await response.json()
      const savedMovie = this.mapToMovieEntity(savedMovieData)

      // 更新缓存
      this.setCache(movie.detail.id, savedMovie)

      return savedMovie
    } catch (error) {
      console.error('保存电影失败:', error)
      throw error
    }
  }

  /**
   * 删除电影
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`删除电影失败: ${response.statusText}`)
      }

      // 清除缓存
      this.clearCache(id)
      return true
    } catch (error) {
      console.error('删除电影失败:', error)
      throw error
    }
  }

  /**
   * 按类型查找电影
   */
  async findByGenre(genre: string): Promise<DomainMovie[]> {
    try {
      const response = await fetch(
        `/api/movies?genre=${encodeURIComponent(genre)}`
      )
      if (!response.ok) {
        throw new Error(`按类型查找电影失败: ${response.statusText}`)
      }

      const moviesData = await response.json()
      return moviesData.map((data: any) => this.mapToMovieEntity(data))
    } catch (error) {
      console.error('按类型查找电影失败:', error)
      throw error
    }
  }

  /**
   * 按年份查找电影
   */
  async findByYear(year: number): Promise<DomainMovie[]> {
    try {
      const response = await fetch(`/api/movies?year=${year}`)
      if (!response.ok) {
        throw new Error(`按年份查找电影失败: ${response.statusText}`)
      }

      const moviesData = await response.json()
      return moviesData.map((data: any) => this.mapToMovieEntity(data))
    } catch (error) {
      console.error('按年份查找电影失败:', error)
      throw error
    }
  }

  /**
   * 搜索电影
   */
  async search(query: string): Promise<DomainMovie[]> {
    try {
      const response = await fetch(
        `/api/movies/search?q=${encodeURIComponent(query)}`
      )
      if (!response.ok) {
        throw new Error(`搜索电影失败: ${response.statusText}`)
      }

      const moviesData = await response.json()
      return moviesData.map((data: any) => this.mapToMovieEntity(data))
    } catch (error) {
      console.error('搜索电影失败:', error)
      throw error
    }
  }

  /**
   * 按过滤条件查找电影
   */
  async findByFilters(
    filters: MovieFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    movies: DomainMovie[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      const params = new URLSearchParams()

      if (filters.genre && filters.genre !== 'all') {
        params.append('genre', filters.genre)
      }
      if (filters.year) {
        params.append('year', filters.year.toString())
      }
      if (filters.rating) {
        params.append('rating', filters.rating.toString())
      }
      if (filters.quality && filters.quality !== 'all') {
        params.append('quality', filters.quality)
      }
      if (filters.language && filters.language !== 'all') {
        params.append('language', filters.language)
      }

      params.append('page', page.toString())
      params.append('limit', limit.toString())

      const response = await fetch(`/api/movies?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`按条件查找电影失败: ${response.statusText}`)
      }

      const result = await response.json()

      return {
        movies: result.movies.map((data: any) => this.mapToMovieEntity(data)),
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      }
    } catch (error) {
      console.error('按条件查找电影失败:', error)
      throw error
    }
  }

  // 私有辅助方法

  /**
   * 从缓存获取数据
   */
  private getFromCache(id: string): DomainMovie | null {
    const cached = this.cache.get(id)
    const expiry = this.cacheExpiry.get(id)

    if (cached && expiry && Date.now() < expiry) {
      return cached
    }

    // 缓存过期，清除
    this.cache.delete(id)
    this.cacheExpiry.delete(id)
    return null
  }

  /**
   * 设置缓存
   */
  private setCache(id: string, movie: DomainMovie): void {
    this.cache.set(id, movie)
    this.cacheExpiry.set(id, Date.now() + this.CACHE_DURATION)
  }

  /**
   * 清除缓存
   */
  private clearCache(id: string): void {
    this.cache.delete(id)
    this.cacheExpiry.delete(id)
  }

  /**
   * 将API数据映射为电影实体
   * 注意：这是一个简化的实现，实际应该根据DomainMovie构造函数来创建
   */
  private mapToMovieEntity(data: any): DomainMovie {
    // 这里需要根据DomainMovie的实际构造方法来实现
    // 暂时返回一个简单的对象，后续需要完善
    return {
      detail: {
        id: data.id,
        title: data.title,
        originalTitle: data.originalTitle,
        description: data.description,
        poster: data.poster,
        backdrop: data.backdrop,
        trailer: data.trailer,
        genres: data.genres || [],
        duration: data.duration,
        releaseDate: data.releaseDate,
        rating: data.rating || 0,
        ratingCount: data.ratingCount || 0,
        director: data.director,
        cast: data.cast || [],
        country: data.country,
        language: data.language,
        subtitles: data.subtitles || [],
        quality: data.quality || [],
        fileSize: data.fileSize || 0,
        downloadCount: data.downloadCount || 0,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      },
      categories: data.categories || [],
      ratings: data.ratings || [],
      isActive: data.isActive !== false,
      isFeatured: data.isFeatured || false,
    } as DomainMovie
  }

  /**
   * 创建电影
   */
  async create(movie: DomainMovie): Promise<DomainMovie> {
    try {
      const movieData = this.mapFromMovieEntity(movie)

      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(movieData),
      })

      if (!response.ok) {
        throw new Error(`创建电影失败: ${response.statusText}`)
      }

      const createdData = await response.json()
      const createdMovie = this.mapToMovieEntity(createdData)

      // 缓存新电影
      this.setCache(createdMovie.detail.id, createdMovie)

      return createdMovie
    } catch (error) {
      console.error('创建电影失败:', error)
      throw error
    }
  }

  /**
   * 查找推荐电影
   */
  async findFeatured(): Promise<DomainMovie[]> {
    try {
      const response = await fetch('/api/movies/featured', {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`获取推荐电影失败: ${response.statusText}`)
      }

      const result = await response.json()
      return result.movies.map((data: any) => this.mapToMovieEntity(data))
    } catch (error) {
      console.error('获取推荐电影失败:', error)
      return []
    }
  }

  /**
   * 更新电影
   */
  async update(movie: DomainMovie): Promise<DomainMovie> {
    try {
      const movieData = this.mapFromMovieEntity(movie)

      const response = await fetch(`/api/movies/${movie.detail.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(movieData),
      })

      if (!response.ok) {
        throw new Error(`更新电影失败: ${response.statusText}`)
      }

      const updatedData = await response.json()
      const updatedMovie = this.mapToMovieEntity(updatedData)

      // 更新缓存
      this.setCache(updatedMovie.detail.id, updatedMovie)

      return updatedMovie
    } catch (error) {
      console.error('更新电影失败:', error)
      throw error
    }
  }

  /**
   * 获取电影统计信息
   */
  async getMovieStats(): Promise<{
    total: number
    byGenre: Record<string, number>
    byYear: Record<string, number>
  }> {
    try {
      const response = await fetch('/api/movies/stats', {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`获取电影统计失败: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('获取电影统计失败:', error)
      return {
        total: 0,
        byGenre: {},
        byYear: {},
      }
    }
  }

  /**
   * 将电影实体映射为API数据格式
   */
  private mapFromMovieEntity(movie: DomainMovie): any {
    return {
      id: movie.detail.id,
      title: movie.detail.title,
      description: movie.detail.description,
      poster: movie.detail.poster,
      backdrop: movie.detail.backdrop,
      trailer: movie.detail.trailer,
      genres: movie.detail.genres,
      duration: movie.detail.duration,
      releaseDate: movie.detail.releaseDate,
      rating: movie.detail.rating,
      ratingCount: movie.detail.ratingCount,
      director: movie.detail.director,
      cast: movie.detail.cast,
      country: movie.detail.country,
      language: movie.detail.language,
      subtitles: movie.detail.subtitles,
      quality: movie.detail.quality,
      fileSize: movie.detail.fileSize,
      downloadCount: movie.detail.downloadCount,
      isActive: movie.isActive,
      isFeatured: movie.isFeatured,
      updatedAt: new Date().toISOString(),
    }
  }
}
