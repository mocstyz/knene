/**
 * @fileoverview 影片领域事件定义
 * @description 定义影片相关的所有领域事件类，包括创建、更新、评分、下载、收藏、观看、分类变更、推荐和搜索等事件
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Movie } from '@domain/entities/Movie'
import { DomainEvent } from '@domain/events/DomainEvent'

// 影片创建事件 - 当新影片被创建时触发
export class MovieCreatedEvent extends DomainEvent {
  constructor(
    public readonly movie: Movie, // 创建的影片实体
    public readonly createdBy: string // 创建者用户ID
  ) {
    super(movie.detail.id)
  }

  getEventName(): string {
    return 'MovieCreated'
  }

  getEventData(): unknown {
    return {
      movieId: this.movie.detail.id,
      title: this.movie.detail.title,
      genres: this.movie.detail.genres,
      director: this.movie.detail.director,
      releaseDate: this.movie.detail.releaseDate,
      createdBy: this.createdBy,
    }
  }

  protected getAdditionalMetadata(): Record<string, unknown> {
    return {
      movieTitle: this.movie.detail.title,
      movieGenres: this.movie.detail.genres.join(', '),
      movieDirector: this.movie.detail.director,
    }
  }
}

// 影片更新事件 - 当影片信息被修改时触发
export class MovieUpdatedEvent extends DomainEvent {
  constructor(
    public readonly movie: Movie, // 更新的影片实体
    public readonly updatedFields: string[], // 更新的字段列表
    public readonly updatedBy: string // 更新者用户ID
  ) {
    super(movie.detail.id)
  }

  getEventName(): string {
    return 'MovieUpdated'
  }

  getEventData(): unknown {
    return {
      movieId: this.movie.detail.id,
      title: this.movie.detail.title,
      updatedFields: this.updatedFields,
      updatedBy: this.updatedBy,
      changes: this.getMovieChanges(), // 具体的变更内容
    }
  }

  protected getAdditionalMetadata(): Record<string, unknown> {
    return {
      movieTitle: this.movie.detail.title,
      updatedFieldsCount: this.updatedFields.length,
      updatedBy: this.updatedBy,
    }
  }

  // 获取具体的影片变更内容 - 根据更新字段提取相应的新值
  private getMovieChanges(): Record<string, unknown> {
    const changes: Record<string, unknown> = {}

    if (this.updatedFields.includes('rating')) {
      changes.rating = this.movie.detail.rating
      changes.ratingCount = this.movie.detail.ratingCount
    }

    if (this.updatedFields.includes('downloadCount')) {
      changes.downloadCount = this.movie.detail.downloadCount
    }

    if (this.updatedFields.includes('isActive')) {
      changes.isActive = this.movie.isActive
    }

    if (this.updatedFields.includes('isFeatured')) {
      changes.isFeatured = this.movie.isFeatured
    }

    return changes
  }
}

// 影片评分事件 - 当用户对影片进行评分时触发
export class MovieRatedEvent extends DomainEvent {
  constructor(
    public readonly movie: Movie, // 被评分的影片实体
    public readonly userId: string, // 评分用户ID
    public readonly rating: number, // 评分值
    public readonly previousRating?: number // 之前的评分（用于更新评分）
  ) {
    super(movie.detail.id)
  }

  getEventName(): string {
    return 'MovieRated'
  }

  getEventData(): unknown {
    return {
      movieId: this.movie.detail.id,
      movieTitle: this.movie.detail.title,
      userId: this.userId,
      rating: this.rating,
      previousRating: this.previousRating,
      newAverageRating: this.movie.detail.rating, // 更新后的平均评分
      totalRatings: this.movie.detail.ratingCount, // 总评分数量
    }
  }

  protected getAdditionalMetadata(): Record<string, unknown> {
    return {
      movieTitle: this.movie.detail.title,
      isNewRating: !this.previousRating, // 是否为新评分
      ratingChange: this.previousRating // 评分变化值
        ? this.rating - this.previousRating
        : this.rating,
    }
  }
}

// 影片下载事件 - 当用户下载影片时触发
export class MovieDownloadedEvent extends DomainEvent {
  constructor(
    public readonly movie: Movie, // 被下载的影片实体
    public readonly userId: string, // 下载用户ID
    public readonly downloadQuality: string, // 下载质量
    public readonly downloadFormat: string // 下载格式
  ) {
    super(movie.detail.id)
  }

  getEventName(): string {
    return 'MovieDownloaded'
  }

  getEventData(): unknown {
    return {
      movieId: this.movie.detail.id,
      movieTitle: this.movie.detail.title,
      userId: this.userId,
      downloadQuality: this.downloadQuality,
      downloadFormat: this.downloadFormat,
      totalDownloads: this.movie.detail.downloadCount, // 总下载次数
    }
  }

  protected getAdditionalMetadata(): Record<string, unknown> {
    return {
      movieTitle: this.movie.detail.title,
      downloadQuality: this.downloadQuality,
      downloadFormat: this.downloadFormat,
    }
  }
}

// 影片收藏事件 - 当用户添加或移除收藏时触发
export class MovieFavoritedEvent extends DomainEvent {
  constructor(
    public readonly movie: Movie, // 收藏的影片实体
    public readonly userId: string, // 操作用户ID
    public readonly action: 'added' | 'removed' // 收藏动作
  ) {
    super(movie.detail.id)
  }

  getEventName(): string {
    return 'MovieFavorited'
  }

  getEventData(): unknown {
    return {
      movieId: this.movie.detail.id,
      movieTitle: this.movie.detail.title,
      userId: this.userId,
      action: this.action,
      genres: this.movie.detail.genres,
      director: this.movie.detail.director,
    }
  }

  protected getAdditionalMetadata(): Record<string, unknown> {
    return {
      movieTitle: this.movie.detail.title,
      action: this.action,
      movieGenres: this.movie.detail.genres.join(', '),
    }
  }
}

// 影片观看事件 - 当用户观看影片时触发
export class MovieViewedEvent extends DomainEvent {
  constructor(
    public readonly movie: Movie, // 观看的影片实体
    public readonly userId: string, // 观看用户ID
    public readonly watchDuration?: number, // 观看时长（秒）
    public readonly watchProgress?: number // 观看进度（0-1）
  ) {
    super(movie.detail.id)
  }

  getEventName(): string {
    return 'MovieViewed'
  }

  getEventData(): unknown {
    return {
      movieId: this.movie.detail.id,
      movieTitle: this.movie.detail.title,
      userId: this.userId,
      watchDuration: this.watchDuration,
      watchProgress: this.watchProgress,
      genres: this.movie.detail.genres,
      rating: this.movie.detail.rating,
    }
  }

  protected getAdditionalMetadata(): Record<string, unknown> {
    return {
      movieTitle: this.movie.detail.title,
      isCompleted: this.watchProgress && this.watchProgress >= 0.9, // 是否观看完成
      watchDurationMinutes: this.watchDuration // 观看时长（分钟）
        ? Math.floor(this.watchDuration / 60)
        : undefined,
    }
  }
}

// 影片分类变更事件 - 当影片分类被修改时触发
export class MovieCategoryChangedEvent extends DomainEvent {
  constructor(
    public readonly movie: Movie, // 分类变更的影片实体
    public readonly oldCategories: string[], // 原分类列表
    public readonly newCategories: string[], // 新分类列表
    public readonly changedBy: string // 修改者用户ID
  ) {
    super(movie.detail.id)
  }

  getEventName(): string {
    return 'MovieCategoryChanged'
  }

  getEventData(): unknown {
    return {
      movieId: this.movie.detail.id,
      movieTitle: this.movie.detail.title,
      oldCategories: this.oldCategories,
      newCategories: this.newCategories,
      changedBy: this.changedBy,
      addedCategories: this.newCategories.filter( // 新增的分类
        cat => !this.oldCategories.includes(cat)
      ),
      removedCategories: this.oldCategories.filter( // 移除的分类
        cat => !this.newCategories.includes(cat)
      ),
    }
  }

  protected getAdditionalMetadata(): Record<string, unknown> {
    return {
      movieTitle: this.movie.detail.title,
      categoriesChanged: // 分类是否发生了变化
        this.oldCategories.length !== this.newCategories.length,
      addedCount: this.newCategories.filter( // 新增分类数量
        cat => !this.oldCategories.includes(cat)
      ).length,
      removedCount: this.oldCategories.filter( // 移除分类数量
        cat => !this.newCategories.includes(cat)
      ).length,
    }
  }
}

// 影片推荐事件 - 当向用户推荐影片时触发
export class MovieRecommendedEvent extends DomainEvent {
  constructor(
    public readonly movie: Movie, // 推荐的影片实体
    public readonly userId: string, // 接收推荐的用户ID
    public readonly recommendationReason: string, // 推荐原因
    public readonly recommendationScore: number // 推荐分数
  ) {
    super(movie.detail.id)
  }

  getEventName(): string {
    return 'MovieRecommended'
  }

  getEventData(): unknown {
    return {
      movieId: this.movie.detail.id,
      movieTitle: this.movie.detail.title,
      userId: this.userId,
      recommendationReason: this.recommendationReason,
      recommendationScore: this.recommendationScore,
      genres: this.movie.detail.genres,
      rating: this.movie.detail.rating,
      director: this.movie.detail.director,
    }
  }

  protected getAdditionalMetadata(): Record<string, unknown> {
    return {
      movieTitle: this.movie.detail.title,
      recommendationScore: this.recommendationScore,
      isHighlyRecommended: this.recommendationScore >= 0.8, // 是否为高推荐度
    }
  }
}

// 影片搜索事件 - 当用户进行影片搜索时触发
export class MovieSearchedEvent extends DomainEvent {
  constructor(
    public readonly userId: string, // 搜索用户ID
    public readonly searchQuery: string, // 搜索关键词
    public readonly searchFilters: Record<string, unknown>, // 搜索过滤器
    public readonly resultCount: number, // 搜索结果数量
    public readonly searchDuration: number // 搜索耗时（毫秒）
  ) {
    super(`search_${userId}_${Date.now()}`)
  }

  getEventName(): string {
    return 'MovieSearched'
  }

  getEventData(): unknown {
    return {
      userId: this.userId,
      searchQuery: this.searchQuery,
      searchFilters: this.searchFilters,
      resultCount: this.resultCount,
      searchDuration: this.searchDuration,
      timestamp: this.occurredOn,
    }
  }

  protected getAdditionalMetadata(): Record<string, unknown> {
    return {
      hasFilters: Object.keys(this.searchFilters || {}).length > 0, // 是否使用了过滤器
      isSuccessful: this.resultCount > 0, // 搜索是否成功
      searchType: this.determineSearchType(), // 搜索类型
    }
  }

  // 判断搜索类型 - 根据查询内容确定搜索类型
  private determineSearchType(): string {
    if (!this.searchQuery) return 'browse' // 浏览模式
    if (this.searchQuery.includes('@')) return 'director_search' // 导演搜索
    if (this.searchQuery.length < 3) return 'quick_search' // 快速搜索
    return 'full_search' // 完整搜索
  }
}

// 影片事件工厂类 - 提供创建各种影片事件的静态方法
export class MovieEventFactory {
  // 创建影片创建事件
  static createMovieCreated(
    movie: Movie,
    createdBy: string
  ): MovieCreatedEvent {
    return new MovieCreatedEvent(movie, createdBy)
  }

  // 创建影片更新事件
  static createMovieUpdated(
    movie: Movie,
    updatedFields: string[],
    updatedBy: string
  ): MovieUpdatedEvent {
    return new MovieUpdatedEvent(movie, updatedFields, updatedBy)
  }

  // 创建影片评分事件
  static createMovieRated(
    movie: Movie,
    userId: string,
    rating: number,
    previousRating?: number
  ): MovieRatedEvent {
    return new MovieRatedEvent(movie, userId, rating, previousRating)
  }

  // 创建影片下载事件
  static createMovieDownloaded(
    movie: Movie,
    userId: string,
    quality: string,
    format: string
  ): MovieDownloadedEvent {
    return new MovieDownloadedEvent(movie, userId, quality, format)
  }

  // 创建影片收藏事件
  static createMovieFavorited(
    movie: Movie,
    userId: string,
    action: 'added' | 'removed'
  ): MovieFavoritedEvent {
    return new MovieFavoritedEvent(movie, userId, action)
  }

  // 创建影片观看事件
  static createMovieViewed(
    movie: Movie,
    userId: string,
    watchDuration?: number,
    watchProgress?: number
  ): MovieViewedEvent {
    return new MovieViewedEvent(movie, userId, watchDuration, watchProgress)
  }

  // 创建影片推荐事件
  static createMovieRecommended(
    movie: Movie,
    userId: string,
    reason: string,
    score: number
  ): MovieRecommendedEvent {
    return new MovieRecommendedEvent(movie, userId, reason, score)
  }

  // 创建影片搜索事件
  static createMovieSearched(
    userId: string,
    query: string,
    filters: Record<string, unknown>,
    resultCount: number,
    duration: number
  ): MovieSearchedEvent {
    return new MovieSearchedEvent(userId, query, filters, resultCount, duration)
  }
}
