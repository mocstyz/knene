import { Movie } from '@domain/entities/Movie'
import { DomainEvent } from '@domain/events/DomainEvent'

/**
 * 电影相关领域事件
 */

/**
 * 电影创建事件
 */
export class MovieCreatedEvent extends DomainEvent {
  constructor(
    public readonly movie: Movie,
    public readonly createdBy: string
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

/**
 * 电影更新事件
 */
export class MovieUpdatedEvent extends DomainEvent {
  constructor(
    public readonly movie: Movie,
    public readonly updatedFields: string[],
    public readonly updatedBy: string
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
      changes: this.getMovieChanges(),
    }
  }

  protected getAdditionalMetadata(): Record<string, unknown> {
    return {
      movieTitle: this.movie.detail.title,
      updatedFieldsCount: this.updatedFields.length,
      updatedBy: this.updatedBy,
    }
  }

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

/**
 * 电影评分事件
 */
export class MovieRatedEvent extends DomainEvent {
  constructor(
    public readonly movie: Movie,
    public readonly userId: string,
    public readonly rating: number,
    public readonly previousRating?: number
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
      newAverageRating: this.movie.detail.rating,
      totalRatings: this.movie.detail.ratingCount,
    }
  }

  protected getAdditionalMetadata(): Record<string, unknown> {
    return {
      movieTitle: this.movie.detail.title,
      isNewRating: !this.previousRating,
      ratingChange: this.previousRating
        ? this.rating - this.previousRating
        : this.rating,
    }
  }
}

/**
 * 电影下载事件
 */
export class MovieDownloadedEvent extends DomainEvent {
  constructor(
    public readonly movie: Movie,
    public readonly userId: string,
    public readonly downloadQuality: string,
    public readonly downloadFormat: string
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
      totalDownloads: this.movie.detail.downloadCount,
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

/**
 * 电影收藏事件
 */
export class MovieFavoritedEvent extends DomainEvent {
  constructor(
    public readonly movie: Movie,
    public readonly userId: string,
    public readonly action: 'added' | 'removed'
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

/**
 * 电影观看事件
 */
export class MovieViewedEvent extends DomainEvent {
  constructor(
    public readonly movie: Movie,
    public readonly userId: string,
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
      isCompleted: this.watchProgress && this.watchProgress >= 0.9,
      watchDurationMinutes: this.watchDuration
        ? Math.floor(this.watchDuration / 60)
        : undefined,
    }
  }
}

/**
 * 电影分类变更事件
 */
export class MovieCategoryChangedEvent extends DomainEvent {
  constructor(
    public readonly movie: Movie,
    public readonly oldCategories: string[],
    public readonly newCategories: string[],
    public readonly changedBy: string
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
      addedCategories: this.newCategories.filter(
        cat => !this.oldCategories.includes(cat)
      ),
      removedCategories: this.oldCategories.filter(
        cat => !this.newCategories.includes(cat)
      ),
    }
  }

  protected getAdditionalMetadata(): Record<string, unknown> {
    return {
      movieTitle: this.movie.detail.title,
      categoriesChanged:
        this.oldCategories.length !== this.newCategories.length,
      addedCount: this.newCategories.filter(
        cat => !this.oldCategories.includes(cat)
      ).length,
      removedCount: this.oldCategories.filter(
        cat => !this.newCategories.includes(cat)
      ).length,
    }
  }
}

/**
 * 电影推荐事件
 */
export class MovieRecommendedEvent extends DomainEvent {
  constructor(
    public readonly movie: Movie,
    public readonly userId: string,
    public readonly recommendationReason: string,
    public readonly recommendationScore: number
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
      isHighlyRecommended: this.recommendationScore >= 0.8,
    }
  }
}

/**
 * 电影搜索事件
 */
export class MovieSearchedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly searchQuery: string,
    public readonly searchFilters: Record<string, unknown>,
    public readonly resultCount: number,
    public readonly searchDuration: number
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
      hasFilters: Object.keys(this.searchFilters || {}).length > 0,
      isSuccessful: this.resultCount > 0,
      searchType: this.determineSearchType(),
    }
  }

  private determineSearchType(): string {
    if (!this.searchQuery) return 'browse'
    if (this.searchQuery.includes('@')) return 'director_search'
    if (this.searchQuery.length < 3) return 'quick_search'
    return 'full_search'
  }
}

/**
 * 电影事件工厂
 */
export class MovieEventFactory {
  static createMovieCreated(
    movie: Movie,
    createdBy: string
  ): MovieCreatedEvent {
    return new MovieCreatedEvent(movie, createdBy)
  }

  static createMovieUpdated(
    movie: Movie,
    updatedFields: string[],
    updatedBy: string
  ): MovieUpdatedEvent {
    return new MovieUpdatedEvent(movie, updatedFields, updatedBy)
  }

  static createMovieRated(
    movie: Movie,
    userId: string,
    rating: number,
    previousRating?: number
  ): MovieRatedEvent {
    return new MovieRatedEvent(movie, userId, rating, previousRating)
  }

  static createMovieDownloaded(
    movie: Movie,
    userId: string,
    quality: string,
    format: string
  ): MovieDownloadedEvent {
    return new MovieDownloadedEvent(movie, userId, quality, format)
  }

  static createMovieFavorited(
    movie: Movie,
    userId: string,
    action: 'added' | 'removed'
  ): MovieFavoritedEvent {
    return new MovieFavoritedEvent(movie, userId, action)
  }

  static createMovieViewed(
    movie: Movie,
    userId: string,
    watchDuration?: number,
    watchProgress?: number
  ): MovieViewedEvent {
    return new MovieViewedEvent(movie, userId, watchDuration, watchProgress)
  }

  static createMovieRecommended(
    movie: Movie,
    userId: string,
    reason: string,
    score: number
  ): MovieRecommendedEvent {
    return new MovieRecommendedEvent(movie, userId, reason, score)
  }

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
