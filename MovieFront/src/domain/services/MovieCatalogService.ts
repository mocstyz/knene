/**
 * @fileoverview 影片目录领域服务
 * @description 处理影片分类、搜索、推荐等业务逻辑，提供完整的影片目录管理功能。
 *              包括影片过滤、搜索、排序、推荐、相似影片查找、热门影片、最新影片、分组统计等功能。
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { MovieFilters } from '@application/stores/movieStore'
import { Movie } from '@domain/entities/Movie'

// 影片目录领域服务，处理影片分类、搜索、推荐等业务逻辑
export class MovieCatalogService {
  // 过滤影片列表，根据多种条件（类型、年份、评分、质量、语言）筛选影片
  static filterMovies(movies: Movie[], filters: MovieFilters): Movie[] {
    let filteredMovies = [...movies]

    // 按类型过滤
    if (filters.genre && filters.genre !== 'all') {
      filteredMovies = filteredMovies.filter(movie =>
        movie.genres.includes(filters.genre!)
      )
    }

    // 按年份过滤
    if (filters.year) {
      filteredMovies = filteredMovies.filter(
        movie => movie.year === filters.year
      )
    }

    // 按评分过滤
    if (filters.rating) {
      filteredMovies = filteredMovies.filter(
        movie => movie.rating >= filters.rating!
      )
    }

    // 按质量过滤
    if (filters.quality && filters.quality !== 'all') {
      filteredMovies = filteredMovies.filter(movie =>
        movie.qualities?.includes(filters.quality!)
      )
    }

    // 按语言过滤
    if (filters.language && filters.language !== 'all') {
      filteredMovies = filteredMovies.filter(
        movie => movie.language === filters.language
      )
    }

    return filteredMovies
  }

  // 搜索影片，在影片标题、描述、导演、演员、类型中进行全文搜索
  static searchMovies(movies: Movie[], query: string): Movie[] {
    if (!query.trim()) {
      return movies
    }

    const searchTerm = query.toLowerCase().trim()

    return movies.filter(movie => {
      // 搜索标题
      if (movie.title.toLowerCase().includes(searchTerm)) {
        return true
      }

      // 搜索描述
      if (movie.description.toLowerCase().includes(searchTerm)) {
        return true
      }

      // 搜索导演
      if (movie.director?.toLowerCase().includes(searchTerm)) {
        return true
      }

      // 搜索演员
      if (
        movie.actors?.some((actor: string) =>
          actor.toLowerCase().includes(searchTerm)
        )
      ) {
        return true
      }

      // 搜索类型
      if (
        movie.genres.some((genre: string) =>
          genre.toLowerCase().includes(searchTerm)
        )
      ) {
        return true
      }

      return false
    })
  }

  // 排序影片列表，支持按标题、年份、评分、时长、发布日期、热度排序
  static sortMovies(movies: Movie[], sortBy: string): Movie[] {
    const sortedMovies = [...movies]

    switch (sortBy) {
      case 'title':
        return sortedMovies.sort((a, b) => a.title.localeCompare(b.title))

      case 'year':
        return sortedMovies.sort((a, b) => b.year - a.year)

      case 'rating':
        return sortedMovies.sort((a, b) => b.rating - a.rating)

      case 'duration':
        return sortedMovies.sort((a, b) => b.duration - a.duration)

      case 'releaseDate':
        return sortedMovies.sort((a, b) => {
          const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0
          const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0
          return dateB - dateA
        })

      case 'popularity':
        return sortedMovies.sort((a, b) => (b.views || 0) - (a.views || 0))

      default:
        return sortedMovies
    }
  }

  // 获取推荐影片，基于用户偏好和历史行为推荐个性化影片
  static getRecommendations(
    allMovies: Movie[],
    userFavorites: string[],
    recentlyViewed: string[],
    limit: number = 10
  ): Movie[] {
    // 获取用户喜欢的类型
    const favoriteGenres = this.getUserPreferredGenres(allMovies, userFavorites)

    // 过滤掉已收藏和最近观看的影片
    const candidateMovies = allMovies.filter(
      movie =>
        !userFavorites.includes(movie.id) && !recentlyViewed.includes(movie.id)
    )

    // 计算推荐分数
    const scoredMovies = candidateMovies.map(movie => ({
      movie,
      score: this.calculateRecommendationScore(
        movie,
        favoriteGenres,
        recentlyViewed
      ),
    }))

    // 按分数排序并返回前N个
    return scoredMovies
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.movie)
  }

  // 获取用户偏好的类型，统计用户收藏影片的类型分布
  private static getUserPreferredGenres(
    movies: Movie[],
    favoriteIds: string[]
  ): Map<string, number> {
    const genreCount = new Map<string, number>()

    favoriteIds.forEach(id => {
      const movie = movies.find(m => m.id === id)
      if (movie) {
        movie.genres.forEach((genre: string) => {
          genreCount.set(genre, (genreCount.get(genre) || 0) + 1)
        })
      }
    })

    return genreCount
  }

  // 计算推荐分数，综合考虑评分、类型匹配、热度、新片、质量等因素
  private static calculateRecommendationScore(
    movie: Movie,
    preferredGenres: Map<string, number>,
    _recentlyViewed: string[]
  ): number {
    let score = 0

    // 基础分数（评分 * 10）
    score += movie.rating * 10

    // 类型匹配分数
    movie.genres.forEach((genre: string) => {
      const genreScore = preferredGenres.get(genre) || 0
      score += genreScore * 20
    })

    // 热门程度分数
    score += Math.log((movie.views || 0) + 1) * 5

    // 新片加分
    const releaseYear = movie.year
    const currentYear = new Date().getFullYear()
    if (currentYear - releaseYear <= 2) {
      score += 10
    }

    // 高质量加分
    if (movie.qualities?.includes('4K')) {
      score += 5
    } else if (movie.qualities?.includes('1080P')) {
      score += 3
    }

    return score
  }

  // 获取相似影片，基于类型、年份、导演、演员、评分等因素计算相似度
  static getSimilarMovies(
    targetMovie: Movie,
    allMovies: Movie[],
    limit: number = 6
  ): Movie[] {
    const similarMovies = allMovies
      .filter(movie => movie.id !== targetMovie.id)
      .map(movie => ({
        movie,
        similarity: this.calculateSimilarity(targetMovie, movie),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.movie)

    return similarMovies
  }

  // 计算影片相似度，综合考虑类型、年份、导演、演员、评分的匹配度
  private static calculateSimilarity(movie1: Movie, movie2: Movie): number {
    let similarity = 0

    // 类型相似度
    const commonGenres = movie1.genres.filter((genre: string) =>
      movie2.genres.includes(genre)
    )
    similarity += commonGenres.length * 20

    // 年份相似度
    const yearDiff = Math.abs(movie1.year - movie2.year)
    if (yearDiff <= 2) {
      similarity += 15
    } else if (yearDiff <= 5) {
      similarity += 10
    }

    // 导演相同
    if (movie1.director === movie2.director) {
      similarity += 25
    }

    // 演员相同
    const commonActors = (movie1.actors || []).filter((actor: string) =>
      (movie2.actors || []).includes(actor)
    )
    similarity += commonActors.length * 10

    // 评分相似度
    const ratingDiff = Math.abs(movie1.rating - movie2.rating)
    if (ratingDiff <= 0.5) {
      similarity += 10
    } else if (ratingDiff <= 1.0) {
      similarity += 5
    }

    return similarity
  }

  // 获取热门影片，结合观看次数和评分权重计算综合热度
  static getHotMovies(movies: Movie[], limit: number = 10): Movie[] {
    return movies
      .sort((a, b) => {
        // 综合评分：观看次数 + 评分权重
        const scoreA = (a.views || 0) + a.rating * 1000
        const scoreB = (b.views || 0) + b.rating * 1000
        return scoreB - scoreA
      })
      .slice(0, limit)
  }

  // 获取最新影片，按发布日期排序返回最近添加的影片
  static getLatestMovies(movies: Movie[], limit: number = 10): Movie[] {
    return movies
      .filter(movie => movie.releaseDate) // 过滤掉没有发布日期的影片
      .sort(
        (a, b) =>
          new Date(b.releaseDate!).getTime() -
          new Date(a.releaseDate!).getTime()
      )
      .slice(0, limit)
  }

  // 获取高分影片，筛选并返回评分7分以上的优质影片
  static getTopRatedMovies(movies: Movie[], limit: number = 10): Movie[] {
    return movies
      .filter(movie => movie.rating >= 7.0) // 只显示7分以上的影片
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
  }

  // 按类型分组影片，将影片按类型归类组织便于分类浏览
  static groupMoviesByGenre(movies: Movie[]): Map<string, Movie[]> {
    const genreMap = new Map<string, Movie[]>()

    movies.forEach(movie => {
      movie.genres.forEach((genre: string) => {
        if (!genreMap.has(genre)) {
          genreMap.set(genre, [])
        }
        genreMap.get(genre)!.push(movie)
      })
    })

    return genreMap
  }

  // 获取所有可用的类型，提取影片库中所有不重复的类型标签
  static getAllGenres(movies: Movie[]): string[] {
    const genreSet = new Set<string>()

    movies.forEach(movie => {
      movie.genres.forEach((genre: string) => {
        genreSet.add(genre)
      })
    })

    return Array.from(genreSet).sort()
  }

  // 获取所有可用的年份，提取影片库中所有不重复的年份并按降序排列
  static getAllYears(movies: Movie[]): number[] {
    const yearSet = new Set<number>()

    movies.forEach(movie => {
      yearSet.add(movie.year)
    })

    return Array.from(yearSet).sort((a, b) => b - a)
  }

  // 验证影片数据，检查影片各项必填字段和数据格式的完整性
  static validateMovieData(movie: Partial<Movie>): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (!movie.detail?.title?.value?.trim()) {
      errors.push('影片标题不能为空')
    }

    if (!movie.detail?.description?.trim()) {
      errors.push('影片描述不能为空')
    }

    if (!movie.detail?.poster?.trim()) {
      errors.push('影片海报不能为空')
    }

    if (!movie.detail?.director?.trim()) {
      errors.push('导演信息不能为空')
    }

    if (!movie.detail?.cast || movie.detail.cast.length === 0) {
      errors.push('演员信息不能为空')
    }

    if (!movie.detail?.genres || movie.detail.genres.length === 0) {
      errors.push('影片类型不能为空')
    }

    const movieYear = movie.detail?.releaseDate?.year
    if (
      !movieYear ||
      movieYear < 1900 ||
      movieYear > new Date().getFullYear() + 5
    ) {
      errors.push('影片年份不正确')
    }

    if (
      !movie.detail?.duration?.minutes ||
      movie.detail.duration.minutes <= 0
    ) {
      errors.push('影片时长必须大于0')
    }

    if (
      movie.detail?.rating !== undefined &&
      (movie.detail.rating < 0 || movie.detail.rating > 10)
    ) {
      errors.push('影片评分必须在0-10之间')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
