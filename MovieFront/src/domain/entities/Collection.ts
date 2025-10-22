/**
 * @fileoverview 影片合集领域实体定义
 * @description 定义影片合集相关的领域实体和业务逻辑，包含合集详情、分类、标签等核心实体，以及合集实体的完整业务方法
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { ReleaseDate } from '@domain/value-objects/ReleaseDate'
import { Title } from '@domain/value-objects/Title'

// 影片合集详情接口，包含合集的完整信息描述
export interface CollectionDetail {
  id: string // 合集唯一标识
  title: Title // 合集标题值对象
  description: string // 合集描述
  coverImage: string // 封面图片URL
  movieIds: string[] // 包含的影片ID列表
  tags: string[] // 标签列表
  genre: string // 合集类型（如：动作、喜剧、科幻等）
  curator?: string // 策展人/编辑者
  publishDate: ReleaseDate // 发布日期值对象
  viewCount: number // 浏览次数
  downloadCount: number // 下载次数
  rating: number // 平均评分
  ratingCount: number // 评分数量
  isVipRequired: boolean // 是否需要VIP权限
  isExclusive: boolean // 是否为独家合集
  createdAt: Date // 创建时间
  updatedAt: Date // 更新时间
}

// 影片合集分类接口，定义合集分类的层级结构
export interface CollectionCategory {
  id: string // 分类唯一标识
  name: string // 分类名称
  slug: string // 分类别名（用于URL）
  description?: string // 分类描述
  parentId?: string // 父分类ID，支持层级结构
  order: number // 排序权重
}

// 影片合集评分接口，记录用户对合集的评分和评价
export interface CollectionRating {
  userId: string // 用户ID
  collectionId: string // 合集ID
  rating: number // 评分值（1-10）
  review?: string // 评价内容
  createdAt: Date // 评分时间
}

// 影片合集领域实体类，包含完整的业务逻辑和规则
export class Collection {
  constructor(
    public readonly detail: CollectionDetail, // 合集详情信息
    public readonly categories: CollectionCategory[] = [], // 合集分类列表
    public readonly ratings: CollectionRating[] = [], // 用户评分列表
    public readonly isActive: boolean = true, // 是否激活状态
    public readonly isFeatured: boolean = false // 是否为精选合集
  ) {}

  // 业务规则：是否显示NEW标签（24小时内发布）
  public isNew(): boolean {
    const now = new Date()
    const hoursDiff = (now.getTime() - this.detail.publishDate.date.getTime()) / (1000 * 60 * 60)
    return hoursDiff <= 24
  }

  // 业务规则：是否为VIP专享内容
  public isVipContent(): boolean {
    return this.detail.isVipRequired
  }

  // 业务规则：获取NEW标签类型
  public getNewType(): 'hot' | 'latest' | null {
    if (!this.isNew()) return null
    // 根据浏览量判断是热门还是最新
    return this.detail.viewCount > 1000 ? 'hot' : 'latest'
  }

  // 业务规则：生成标签列表
  public generateTags(): string[] {
    const tags: string[] = [...this.detail.tags]
    if (this.isVipContent()) tags.push('VIP')
    if (this.isNew()) tags.push('NEW')
    if (this.isFeatured) tags.push('精选')
    if (this.detail.isExclusive) tags.push('独家')
    return tags
  }

  // 业务规则：是否为热门内容
  public isHot(): boolean {
    return this.detail.viewCount > 1000 || this.detail.downloadCount > 100
  }

  // 业务规则：获取合集大小（包含影片数量）
  public getSize(): number {
    return this.detail.movieIds.length
  }

  // 业务规则：是否为大型合集
  public isLargeCollection(): boolean {
    return this.getSize() >= 10
  }

  // 更新合集详情
  updateDetail(
    updates: Partial<Omit<CollectionDetail, 'id' | 'createdAt' | 'updatedAt'>>
  ): Collection {
    return new Collection(
      { ...this.detail, ...updates, updatedAt: new Date() },
      this.categories,
      this.ratings,
      this.isActive,
      this.isFeatured
    )
  }

  // 增加浏览次数
  incrementViewCount(): Collection {
    return this.updateDetail({
      viewCount: this.detail.viewCount + 1
    })
  }

  // 增加下载次数
  incrementDownloadCount(): Collection {
    return this.updateDetail({
      downloadCount: this.detail.downloadCount + 1
    })
  }

  // 设置精选状态
  setFeatured(featured: boolean): Collection {
    return new Collection(
      this.detail,
      this.categories,
      this.ratings,
      this.isActive,
      featured
    )
  }

  // 激活合集
  activate(): Collection {
    return new Collection(
      this.detail,
      this.categories,
      this.ratings,
      true,
      this.isFeatured
    )
  }

  // 停用合集
  deactivate(): Collection {
    return new Collection(
      this.detail,
      this.categories,
      this.ratings,
      false,
      this.isFeatured
    )
  }

  // 添加影片到合集
  addMovie(movieId: string): Collection {
    if (this.hasMovie(movieId)) {
      return this
    }
    return this.updateDetail({
      movieIds: [...this.detail.movieIds, movieId]
    })
  }

  // 从合集中移除影片
  removeMovie(movieId: string): Collection {
    return this.updateDetail({
      movieIds: this.detail.movieIds.filter(id => id !== movieId)
    })
  }

  // 检查是否包含指定影片
  hasMovie(movieId: string): boolean {
    return this.detail.movieIds.includes(movieId)
  }

  // 获取平均评分
  getAverageRating(): number {
    return this.detail.rating
  }

  // 添加评分
  addRating(rating: CollectionRating): Collection {
    const newRatings = [...this.ratings, rating]
    const totalRating = newRatings.reduce((sum, r) => sum + r.rating, 0)
    const averageRating = totalRating / newRatings.length

    return new Collection(
      {
        ...this.detail,
        rating: averageRating,
        ratingCount: newRatings.length,
        updatedAt: new Date()
      },
      this.categories,
      newRatings,
      this.isActive,
      this.isFeatured
    )
  }

  // 添加分类
  addCategory(category: CollectionCategory): Collection {
    if (this.hasCategory(category.id)) {
      return this
    }
    return new Collection(
      this.detail,
      [...this.categories, category],
      this.ratings,
      this.isActive,
      this.isFeatured
    )
  }

  // 移除分类
  removeCategory(categoryId: string): Collection {
    return new Collection(
      this.detail,
      this.categories.filter(c => c.id !== categoryId),
      this.ratings,
      this.isActive,
      this.isFeatured
    )
  }

  // 检查是否包含指定分类
  hasCategory(categoryId: string): boolean {
    return this.categories.some(c => c.id === categoryId)
  }

  // 获取器方法
  get id() {
    return this.detail.id
  }

  get title() {
    return this.detail.title.value
  }

  get coverImage() {
    return this.detail.coverImage
  }

  get genre() {
    return this.detail.genre
  }

  get curator() {
    return this.detail.curator
  }

  get tags() {
    return this.generateTags()
  }

  get viewCount() {
    return this.detail.viewCount
  }

  get downloadCount() {
    return this.detail.downloadCount
  }

  get rating() {
    return this.detail.rating
  }

  get description() {
    return this.detail.description
  }

  get publishDate() {
    return this.detail.publishDate.date
  }

  get movieCount() {
    return this.getSize()
  }

  // 静态工厂方法
  static create(
    id: string,
    title: Title,
    description: string,
    coverImage: string,
    genre: string,
    publishDate: ReleaseDate,
    isVipRequired: boolean = false,
    isExclusive: boolean = false
  ): Collection {
    const detail: CollectionDetail = {
      id,
      title,
      description,
      coverImage,
      movieIds: [],
      tags: [],
      genre,
      publishDate,
      viewCount: 0,
      downloadCount: 0,
      rating: 0,
      ratingCount: 0,
      isVipRequired,
      isExclusive,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return new Collection(detail)
  }
}
