/**
 * @fileoverview 电影应用服务
 * @description 协调电影相关业务流程，编排搜索、详情、评分与收藏等领域服务
 * @created 2025-10-09 13:10:49
 * @updated 2025-10-19 12:55:27
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */
import {
  MovieFilters,
  Movie as StoreMovie,
} from '@application/stores/movieStore'
import { Movie as DomainMovie } from '@domain/entities/Movie'
import { MovieCatalogService } from '@domain/services/MovieCatalogService'
import {
  Title,
  Genre,
  Duration,
  ReleaseDate,
  MovieQuality,
} from '@domain/value-objects'

// 电影应用服务类，协调电影业务流程，编排多个领域服务
export class MovieApplicationService {
  // 搜索电影的完整业务流程，包含基础搜索、过滤条件、推荐内容等功能
  static async searchMovies(
    query: string,
    filters?: MovieFilters
  ): Promise<{
    movies: StoreMovie[]
    total: number
    suggestions: string[]
    categories: string[]
  }> {
    try {
      // 基础搜索 - 从Store层获取数据并转换为领域对象进行搜索
      const allStoreMovies = await this.getAllMovies()
      const allDomainMovies = this.storeMoviesToDomain(allStoreMovies)
      const searchResults = MovieCatalogService.searchMovies(
        allDomainMovies,
        query
      )

      // 过滤处理 - 根据用户提供的过滤条件筛选搜索结果
      const filteredResults = filters
        ? MovieCatalogService.filterMovies(searchResults, filters)
        : searchResults

      // 数据转换 - 将领域对象转换回Store类型供前端使用
      const filteredStoreMovies = this.domainMoviesToStore(filteredResults)

      // 推荐内容生成 - 基于搜索结果生成搜索建议和分类列表
      const suggestions = this.getSearchSuggestions(query, allStoreMovies)
      const categories = MovieCatalogService.getAllGenres(filteredResults)

      return {
        movies: filteredStoreMovies,
        total: filteredStoreMovies.length,
        suggestions,
        categories,
      }
    } catch (error) {
      console.error('搜索电影失败:', error)
      throw new Error('搜索服务暂时不可用，请稍后重试')
    }
  }

  // 获取电影详情的完整流程，包含推荐电影、相似电影、用户数据等
  static async getMovieDetail(
    movieId: string,
    userId?: string
  ): Promise<{
    movie: StoreMovie
    recommendations: StoreMovie[]
    similarMovies: StoreMovie[]
    userRating?: number
    isFavorite: boolean
  }> {
    try {
      // 1. 获取电影基础信息
      const storeMovie = await this.getMovieById(movieId)
      if (!storeMovie) {
        throw new Error('电影不存在')
      }
      const domainMovie = this.storeMovieToDomain(storeMovie)

      // 2. 获取推荐电影
      const allStoreMovies = await this.getAllMovies()
      const allDomainMovies = this.storeMoviesToDomain(allStoreMovies)
      const userFavorites = userId ? await this.getUserFavorites(userId) : []
      const recentlyViewed = userId ? await this.getRecentlyViewed(userId) : []

      const recommendations = MovieCatalogService.getRecommendations(
        allDomainMovies,
        userFavorites,
        recentlyViewed,
        6
      )

      // 3. 获取相似电影
      const similarMovies = MovieCatalogService.getSimilarMovies(
        domainMovie,
        allDomainMovies,
        6
      )

      // 4. 获取用户相关数据
      const userRating = userId
        ? domainMovie.getRatingByUser(userId)
        : undefined
      const isFavorite = userId ? userFavorites.includes(movieId) : false

      // 5. 转换推荐和相似电影为Store类型
      const recommendationStoreMovies =
        this.domainMoviesToStore(recommendations)
      const similarStoreMovies = this.domainMoviesToStore(similarMovies)

      return {
        movie: storeMovie,
        recommendations: recommendationStoreMovies,
        similarMovies: similarStoreMovies,
        userRating,
        isFavorite,
      }
    } catch (error) {
      console.error('获取电影详情失败:', error)
      throw error
    }
  }

  // 电影评分的完整业务流程，包含验证评分、更新电影评分、记录用户活动
  static async rateMovie(
    movieId: string,
    userId: string,
    rating: number, // 评分值，范围0-10
    review?: string // 用户评价内容，可选
  ): Promise<DomainMovie> {
    try {
      // 数据验证 - 检查评分值是否在有效范围内
      if (rating < 0 || rating > 10) {
        throw new Error('评分必须在0-10之间')
      }

      // 电影存在性验证 - 获取电影信息并转换为领域对象
      const storeMovie = await this.getMovieById(movieId)
      if (!storeMovie) {
        throw new Error('电影不存在')
      }
      const domainMovie = this.storeMovieToDomain(storeMovie)

      // 评分数据创建 - 构建评分对象包含用户、电影、评分和评价内容
      const movieRating = {
        userId,
        movieId,
        rating,
        review,
        createdAt: new Date(),
      }

      // 业务逻辑处理 - 调用领域对象方法添加评分
      const updatedMovie = domainMovie.addRating(movieRating)

      // 数据持久化 - 保存更新后的电影信息到仓储层
      await this.saveMovie(updatedMovie)

      // 用户行为记录 - 记录评分行为用于用户画像分析
      await this.recordUserActivity(userId, 'rate_movie', { movieId, rating })

      return updatedMovie
    } catch (error) {
      console.error('电影评分失败:', error)
      throw error
    }
  }

  // 收藏/取消收藏电影，根据当前状态切换收藏状态并记录用户活动
  static async toggleFavorite(
    movieId: string,
    userId: string
  ): Promise<{ isFavorite: boolean; message: string }> {
    try {
      const storeMovie = await this.getMovieById(movieId)
      if (!storeMovie) {
        throw new Error('电影不存在')
      }

      const userFavorites = await this.getUserFavorites(userId)
      const isCurrentlyFavorite = userFavorites.includes(movieId)

      if (isCurrentlyFavorite) {
        // 取消收藏
        await this.removeFromFavorites(userId, movieId)
        await this.recordUserActivity(userId, 'unfavorite_movie', { movieId })
        return {
          isFavorite: false,
          message: '已取消收藏',
        }
      } else {
        // 添加收藏
        await this.addToFavorites(userId, movieId)
        await this.recordUserActivity(userId, 'favorite_movie', { movieId })
        return {
          isFavorite: true,
          message: '收藏成功',
        }
      }
    } catch (error) {
      console.error('收藏操作失败:', error)
      throw error
    }
  }

  // 获取电影列表，为useMovies hook提供支持，包含过滤和分页功能
  static async getMovies(
    page = 1,
    filters?: MovieFilters
  ): Promise<{ movies: StoreMovie[]; totalPages: number }> {
    try {
      const allStoreMovies = await this.getAllMovies()

      // 应用过滤条件
      let filteredMovies = allStoreMovies
      if (filters) {
        filteredMovies = allStoreMovies.filter(movie => {
          if (filters.genre && !movie.genres.includes(filters.genre))
            return false
          if (filters.year && movie.year !== filters.year) return false
          if (filters.rating && movie.rating < filters.rating) return false
          return true
        })
      }

      // 分页处理
      const pageSize = 12
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedMovies = filteredMovies.slice(startIndex, endIndex)
      const totalPages = Math.ceil(filteredMovies.length / pageSize)

      return {
        movies: paginatedMovies,
        totalPages,
      }
    } catch (error) {
      console.error('获取电影列表失败:', error)
      throw new Error('获取电影列表失败，请稍后重试')
    }
  }

  // 获取个性化推荐，基于用户收藏和浏览历史，失败时返回热门电影作为备选
  static async getPersonalizedRecommendations(
    userId: string,
    limit: number = 10 // 推荐电影数量限制，默认10部
  ): Promise<DomainMovie[]> {
    try {
      const allStoreMovies = await this.getAllMovies()
      const allDomainMovies = this.storeMoviesToDomain(allStoreMovies)
      const userFavorites = await this.getUserFavorites(userId)
      const recentlyViewed = await this.getRecentlyViewed(userId)

      return MovieCatalogService.getRecommendations(
        allDomainMovies,
        userFavorites,
        recentlyViewed,
        limit
      )
    } catch (error) {
      console.error('获取个性化推荐失败:', error)
      // 返回热门电影作为备选
      const trendingStoreMovies = await this.getTrendingMovies(limit)
      return this.storeMoviesToDomain(trendingStoreMovies)
    }
  }

  // 私有辅助方法
  private static async getAllMovies(): Promise<StoreMovie[]> {
    // 这里应该从仓储层获取，暂时返回空数组
    // 实际应该通过TanStack Query获取影片数据
    return []
  }

  private static async getMovieById(
    movieId: string
  ): Promise<StoreMovie | undefined> {
    const allMovies = await this.getAllMovies()
    return allMovies.find(movie => movie.id === movieId)
  }

  private static async getUserFavorites(_userId: string): Promise<string[]> {
    // 这里应该从用户仓储获取，暂时返回空数组
    return []
  }

  private static async getRecentlyViewed(_userId: string): Promise<string[]> {
    // 这里应该从用户活动仓储获取，暂时返回空数组
    return []
  }

  private static async saveMovie(_movie: DomainMovie): Promise<void> {
    // 这里应该通过仓储层保存
    // 暂时为空实现
  }

  private static async addToFavorites(
    _userId: string,
    movieId: string
  ): Promise<void> {
    const { useMovieStore } = await import('@application/stores/movieStore')
    useMovieStore.getState().addToFavorites(movieId)
  }

  private static async removeFromFavorites(
    _userId: string,
    movieId: string
  ): Promise<void> {
    const { useMovieStore } = await import('@application/stores/movieStore')
    useMovieStore.getState().removeFromFavorites(movieId)
  }

  private static async recordUserActivity(
    userId: string,
    action: string,
    metadata: Record<string, unknown>
  ): Promise<void> {
    // 这里应该记录到用户活动仓储
    console.log(`用户活动记录: ${userId} - ${action}`, metadata)
  }

  private static getSearchSuggestions(
    query: string,
    movies: StoreMovie[]
  ): string[] {
    const suggestions = new Set<string>()
    const lowerQuery = query.toLowerCase()

    movies.forEach(movie => {
      // 标题匹配建议
      if (movie.title.toLowerCase().includes(lowerQuery)) {
        suggestions.add(movie.title)
      }

      // 导演建议
      if (movie.director?.toLowerCase().includes(lowerQuery)) {
        suggestions.add(movie.director)
      }

      // 类型建议
      movie.genres.forEach(genre => {
        if (genre.toLowerCase().includes(lowerQuery)) {
          suggestions.add(genre)
        }
      })
    })

    return Array.from(suggestions).slice(0, 5)
  }

  private static async getTrendingMovies(limit: number): Promise<StoreMovie[]> {
    const allStoreMovies = await this.getAllMovies()
    const allDomainMovies = this.storeMoviesToDomain(allStoreMovies)
    const trendingDomainMovies = MovieCatalogService.getTrendingMovies(
      allDomainMovies,
      limit
    )
    return this.domainMoviesToStore(trendingDomainMovies)
  }

  // 数据转换方法 - Store层到Domain层的对象转换
  private static storeMovieToDomain(storeMovie: StoreMovie): DomainMovie {
    // 值对象创建 - 将基础数据类型转换为领域值对象
    const title = new Title(storeMovie.title)
    const genres = storeMovie.genres.map(g => new Genre(g))
    const duration = new Duration(storeMovie.duration)
    const releaseDate = new ReleaseDate(storeMovie.releaseDate || new Date())

    // 质量信息解析 - 将质量字符串解析为MovieQuality值对象
    const qualities: MovieQuality[] = []
    if (storeMovie.qualities) {
      storeMovie.qualities.forEach(q => {
        const [resolution, format] = q.split('_')
        if (resolution && format) {
          const size = 1024 * 1024 * 1024 // 默认1GB
          const downloadUrl = `https://example.com/download/${storeMovie.id}/${q}`
          qualities.push(
            new MovieQuality(
              resolution as '720p' | '1080p' | '4K' | 'HD' | 'SD',
              format as 'MP4' | 'MKV' | 'AVI' | 'MOV' | 'WEBM',
              size,
              downloadUrl
            )
          )
        }
      })
    }

    // 领域对象创建 - 使用工厂方法创建完整的电影领域对象
    return DomainMovie.create(
      storeMovie.id,
      title,
      storeMovie.description,
      storeMovie.poster,
      genres,
      duration,
      releaseDate,
      storeMovie.director || '',
      storeMovie.actors || [],
      qualities
    )
  }

  private static domainMovieToStore(domainMovie: DomainMovie): StoreMovie {
    return {
      id: domainMovie.id,
      title: domainMovie.title,
      description: domainMovie.detail.description,
      poster: domainMovie.detail.poster,
      backdrop: domainMovie.detail.backdrop,
      genres: domainMovie.genres,
      rating: domainMovie.rating,
      year: domainMovie.year,
      duration: domainMovie.duration,
      director: domainMovie.director,
      actors: domainMovie.actors,
      qualities: domainMovie.qualities,
      size: `${domainMovie.detail.fileSize} B`,
      downloadCount: domainMovie.detail.downloadCount,
      releaseDate: domainMovie.releaseDate,
      country: domainMovie.detail.country,
      language: domainMovie.language,
      subtitles: domainMovie.detail.subtitles,
      trailerUrl: domainMovie.detail.trailer,
    }
  }

  private static storeMoviesToDomain(storeMovies: StoreMovie[]): DomainMovie[] {
    return storeMovies.map(movie => this.storeMovieToDomain(movie))
  }

  private static domainMoviesToStore(
    domainMovies: DomainMovie[]
  ): StoreMovie[] {
    return domainMovies.map(movie => this.domainMovieToStore(movie))
  }
}
