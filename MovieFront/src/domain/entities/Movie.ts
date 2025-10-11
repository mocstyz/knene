import { Duration } from '@domain/value-objects/Duration'
import { Genre } from '@domain/value-objects/Genre'
import { MovieQuality } from '@domain/value-objects/MovieQuality'
import { ReleaseDate } from '@domain/value-objects/ReleaseDate'
import { Title } from '@domain/value-objects/Title'

export interface MovieDetail {
  id: string
  title: Title
  originalTitle?: string
  description: string
  poster: string
  backdrop?: string
  trailer?: string
  genres: Genre[]
  duration: Duration
  releaseDate: ReleaseDate
  rating: number
  ratingCount: number
  director: string
  cast: string[]
  country: string
  language: string
  subtitles: string[]
  quality: MovieQuality[]
  fileSize: number
  downloadCount: number
  createdAt: Date
  updatedAt: Date
}

export interface MovieCategory {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  order: number
}

export interface MovieRating {
  userId: string
  movieId: string
  rating: number
  review?: string
  createdAt: Date
}

export class Movie {
  constructor(
    public readonly detail: MovieDetail,
    public readonly categories: MovieCategory[] = [],
    public readonly ratings: MovieRating[] = [],
    public readonly isActive: boolean = true,
    public readonly isFeatured: boolean = false
  ) {}

  // 业务方法
  updateDetail(
    updates: Partial<Omit<MovieDetail, 'id' | 'createdAt' | 'updatedAt'>>
  ): Movie {
    const updatedDetail = {
      ...this.detail,
      ...updates,
      updatedAt: new Date(),
    }

    return new Movie(
      updatedDetail,
      this.categories,
      this.ratings,
      this.isActive,
      this.isFeatured
    )
  }

  getRatingByUser(userId: string): number | undefined {
    const userRating = this.ratings.find(r => r.userId === userId)
    return userRating?.rating
  }

  addRating(rating: MovieRating): Movie {
    const existingRatingIndex = this.ratings.findIndex(
      r => r.userId === rating.userId
    )
    let updatedRatings: MovieRating[]

    if (existingRatingIndex >= 0) {
      // 更新现有评分
      updatedRatings = [...this.ratings]
      updatedRatings[existingRatingIndex] = rating
    } else {
      // 添加新评分
      updatedRatings = [...this.ratings, rating]
    }

    // 重新计算平均评分
    const totalRating = updatedRatings.reduce((sum, r) => sum + r.rating, 0)
    const averageRating = totalRating / updatedRatings.length

    const updatedDetail = {
      ...this.detail,
      rating: Math.round(averageRating * 10) / 10,
      ratingCount: updatedRatings.length,
      updatedAt: new Date(),
    }

    return new Movie(
      updatedDetail,
      this.categories,
      updatedRatings,
      this.isActive,
      this.isFeatured
    )
  }

  addCategory(category: MovieCategory): Movie {
    if (this.categories.some(c => c.id === category.id)) {
      return this
    }

    return new Movie(
      this.detail,
      [...this.categories, category],
      this.ratings,
      this.isActive,
      this.isFeatured
    )
  }

  removeCategory(categoryId: string): Movie {
    return new Movie(
      this.detail,
      this.categories.filter(c => c.id !== categoryId),
      this.ratings,
      this.isActive,
      this.isFeatured
    )
  }

  incrementDownloadCount(): Movie {
    const updatedDetail = {
      ...this.detail,
      downloadCount: this.detail.downloadCount + 1,
      updatedAt: new Date(),
    }

    return new Movie(
      updatedDetail,
      this.categories,
      this.ratings,
      this.isActive,
      this.isFeatured
    )
  }

  setFeatured(featured: boolean): Movie {
    return new Movie(
      this.detail,
      this.categories,
      this.ratings,
      this.isActive,
      featured
    )
  }

  activate(): Movie {
    return new Movie(
      this.detail,
      this.categories,
      this.ratings,
      true,
      this.isFeatured
    )
  }

  deactivate(): Movie {
    return new Movie(
      this.detail,
      this.categories,
      this.ratings,
      false,
      this.isFeatured
    )
  }

  // 查询方法
  getAverageRating(): number {
    return this.detail.rating
  }

  hasCategory(categoryId: string): boolean {
    return this.categories.some(c => c.id === categoryId)
  }

  getQualityOptions(): MovieQuality[] {
    return this.detail.quality
  }

  // 兼容性属性 - 提供对电影数据的直接访问
  get id() {
    return this.detail.id
  }

  get title() {
    return this.detail.title.value
  }

  get downloadUrl() {
    return this.detail.trailer || ''
  }

  get size() {
    return this.detail.fileSize
  }

  getBestQuality(): MovieQuality | undefined {
    const qualityOrder = ['4K', '1080p', '720p', 'HD', 'SD']

    for (const quality of qualityOrder) {
      const found = this.detail.quality.find(q => q.resolution === quality)
      if (found) return found
    }

    return this.detail.quality[0]
  }

  // 兼容性属性 - 用于Domain Services
  get genres(): string[] {
    return this.detail.genres.map(g => g.name)
  }

  get year(): number {
    return this.detail.releaseDate.year
  }

  get director(): string | undefined {
    return this.detail.director
  }

  get actors(): string[] | undefined {
    return this.detail.cast
  }

  get qualities(): string[] | undefined {
    return this.detail.quality.map(q => `${q.resolution}_${q.format}`)
  }

  get rating(): number {
    return this.detail.rating
  }

  // 兼容性属性 - 用于Domain Services
  get description(): string {
    return this.detail.description
  }

  get language(): string {
    return this.detail.language
  }

  get views(): number {
    return this.detail.downloadCount // 使用下载次数作为观看次数的近似值
  }

  get duration(): number {
    return this.detail.duration.minutes
  }

  get releaseDate(): Date {
    return this.detail.releaseDate.date
  }

  // 静态工厂方法
  static create(
    id: string,
    title: Title,
    description: string,
    poster: string,
    genres: Genre[],
    duration: Duration,
    releaseDate: ReleaseDate,
    director: string,
    cast: string[],
    quality: MovieQuality[]
  ): Movie {
    const detail: MovieDetail = {
      id,
      title,
      description,
      poster,
      genres,
      duration,
      releaseDate,
      rating: 0,
      ratingCount: 0,
      director,
      cast,
      country: '',
      language: 'zh-CN',
      subtitles: ['zh-CN'],
      quality,
      fileSize: quality.reduce((sum, q) => sum + q.size, 0),
      downloadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return new Movie(detail, [])
  }
}
