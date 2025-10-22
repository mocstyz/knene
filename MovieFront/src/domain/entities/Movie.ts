/**
 * @fileoverview 影片领域实体定义
 * @description 定义影片相关的领域实体和业务逻辑，包含影片详情、分类、评分等核心实体，以及影片实体的完整业务方法
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Duration } from '@domain/value-objects/Duration'
import { Genre } from '@domain/value-objects/Genre'
import { MovieQuality } from '@domain/value-objects/MovieQuality'
import { ReleaseDate } from '@domain/value-objects/ReleaseDate'
import { Title } from '@domain/value-objects/Title'

// 影片详情接口，包含影片的完整信息描述
export interface MovieDetail {
  id: string // 影片唯一标识
  title: Title // 影片标题值对象
  originalTitle?: string // 原始标题
  description: string // 影片描述
  poster: string // 海报图片URL
  backdrop?: string // 背景图片URL
  trailer?: string // 预告片URL
  genres: Genre[] // 影片类型列表
  duration: Duration // 影片时长值对象
  releaseDate: ReleaseDate // 上映日期值对象
  rating: number // 平均评分
  ratingCount: number // 评分数量
  director: string // 导演
  cast: string[] // 演员列表
  country: string // 制片国家
  language: string // 语言
  subtitles: string[] // 字幕列表
  quality: MovieQuality[] // 可用质量选项
  fileSize: number // 文件大小
  downloadCount: number // 下载次数
  createdAt: Date // 创建时间
  updatedAt: Date // 更新时间
}

// 影片分类接口，定义影片分类的层级结构
export interface MovieCategory {
  id: string // 分类唯一标识
  name: string // 分类名称
  slug: string // 分类别名（用于URL）
  description?: string // 分类描述
  parentId?: string // 父分类ID，支持层级结构
  order: number // 排序权重
}

// 影片评分接口，记录用户对影片的评分和评价
export interface MovieRating {
  userId: string // 用户ID
  movieId: string // 影片ID
  rating: number // 评分值（1-10）
  review?: string // 评价内容
  createdAt: Date // 评分时间
}

// 影片领域实体类，封装影片的业务逻辑和数据管理
export class Movie {
  constructor(
    public readonly detail: MovieDetail, // 影片详情信息
    public readonly categories: MovieCategory[] = [], // 影片分类列表
    public readonly ratings: MovieRating[] = [], // 用户评分列表
    public readonly isActive: boolean = true, // 是否激活状态
    public readonly isFeatured: boolean = false, // 是否为精选影片
    public readonly isVipRequired: boolean = false // 是否需要VIP权限
  ) {}

  // 业务规则：是否显示NEW标签（24小时内发布）
  public isNew(): boolean {
    const now = new Date()
    const hoursDiff = (now.getTime() - this.detail.createdAt.getTime()) / (1000 * 60 * 60)
    return hoursDiff <= 24
  }

  // 业务规则：是否为VIP专享内容
  public isVipContent(): boolean {
    return this.isVipRequired
  }

  // 业务规则：获取NEW标签类型
  public getNewType(): 'hot' | 'latest' | null {
    if (!this.isNew()) return null
    // 根据下载量判断是热门还是最新
    return this.detail.downloadCount > 1000 ? 'hot' : 'latest'
  }

  // 业务规则：生成标签列表
  public generateTags(): string[] {
    const tags: string[] = [...this.detail.genres.map(g => g.name)]
    if (this.isVipContent()) tags.push('VIP')
    if (this.isNew()) tags.push('NEW')
    if (this.isFeatured) tags.push('精选')
    if (this.detail.quality.length > 0) tags.push(this.detail.quality[0].resolution)
    return tags
  }

  // 业务规则：是否为热门内容
  public isHot(): boolean {
    return this.detail.downloadCount > 1000 || this.detail.rating >= 8.0
  }

  // 业务规则：是否为高质量影片
  public isHighQuality(): boolean {
    return this.detail.quality.some(q => q.resolution === '4K' || q.resolution === '1080p')
  }

  // 更新影片详情 - 返回新的Movie实例保证不可变性
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

  // 获取指定用户的评分 - 返回用户对该影片的评分或undefined
  getRatingByUser(userId: string): number | undefined {
    const userRating = this.ratings.find(r => r.userId === userId)
    return userRating?.rating
  }

  // 添加或更新用户评分 - 自动重新计算平均评分并返回新的Movie实例
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

    // 重新计算平均评分 - 保留一位小数
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

  // 添加影片分类 - 避免重复添加相同分类
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

  // 移除影片分类 - 根据分类ID移除指定分类
  removeCategory(categoryId: string): Movie {
    return new Movie(
      this.detail,
      this.categories.filter(c => c.id !== categoryId),
      this.ratings,
      this.isActive,
      this.isFeatured
    )
  }

  // 增加下载次数 - 用于统计影片热度
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

  // 设置精选状态 - 控制影片是否在首页推荐展示
  setFeatured(featured: boolean): Movie {
    return new Movie(
      this.detail,
      this.categories,
      this.ratings,
      this.isActive,
      featured,
      this.isVipRequired
    )
  }

  // 设置VIP权限要求
  setVipRequired(vipRequired: boolean): Movie {
    return new Movie(
      this.detail,
      this.categories,
      this.ratings,
      this.isActive,
      this.isFeatured,
      vipRequired
    )
  }

  // 激活影片 - 将影片状态设置为激活
  activate(): Movie {
    return new Movie(
      this.detail,
      this.categories,
      this.ratings,
      true,
      this.isFeatured,
      this.isVipRequired
    )
  }

  // 停用影片 - 将影片状态设置为停用
  deactivate(): Movie {
    return new Movie(
      this.detail,
      this.categories,
      this.ratings,
      false,
      this.isFeatured,
      this.isVipRequired
    )
  }

  // 查询方法区域 - 提供影片信息的便捷访问接口
  getAverageRating(): number {
    return this.detail.rating
  }

  // 检查是否包含指定分类 - 根据分类ID判断影片是否属于该分类
  hasCategory(categoryId: string): boolean {
    return this.categories.some(c => c.id === categoryId)
  }

  // 获取可用质量选项 - 返回影片支持的所有质量版本
  getQualityOptions(): MovieQuality[] {
    return this.detail.quality
  }

  // 兼容性属性访问器 - 提供对影片数据的直接访问，保持与现有代码的兼容性
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

  // 获取最佳质量 - 按照质量优先级返回最优版本
  getBestQuality(): MovieQuality | undefined {
    const qualityOrder = ['4K', '1080p', '720p', 'HD', 'SD']

    for (const quality of qualityOrder) {
      const found = this.detail.quality.find(q => q.resolution === quality)
      if (found) return found
    }

    return this.detail.quality[0]
  }

  // 兼容性属性 - 用于Domain Services的便捷访问
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

  get downloadCount() {
    return this.detail.downloadCount
  }

  get quality() {
    return this.detail.quality
  }

  get tags() {
    return this.generateTags()
  }

  // 静态工厂方法 - 创建新的影片实例，使用默认值初始化影片详情
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
      rating: 0, // 初始评分为0
      ratingCount: 0, // 初始评分数量为0
      director,
      cast,
      country: '', // 默认国家为空
      language: 'zh-CN', // 默认语言为中文
      subtitles: ['zh-CN'], // 默认中文字幕
      quality,
      fileSize: quality.reduce((sum, q) => sum + q.size, 0), // 计算所有质量文件总大小
      downloadCount: 0, // 初始下载次数为0
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return new Movie(detail, [])
  }
}
