/**
 * @fileoverview 写真领域实体定义
 * @description 定义写真相关的领域实体和业务逻辑，包含写真详情、分类、标签等核心实体，以及写真实体的完整业务方法
 * @created 2025-01-25 14:30:00
 * @updated 2025-01-25 14:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { ReleaseDate } from '@domain/value-objects/ReleaseDate'
import { Title } from '@domain/value-objects/Title'

// 写真详情接口，包含写真的完整信息描述
export interface PhotoDetail {
  id: string // 写真唯一标识
  title: Title // 写真标题值对象
  description: string // 写真描述
  coverImage: string // 封面图片URL
  images: string[] // 写真图片列表
  tags: string[] // 标签列表
  photographer?: string // 摄影师
  model: string // 模特名称
  location?: string // 拍摄地点
  publishDate: ReleaseDate // 发布日期值对象
  viewCount: number // 浏览次数
  downloadCount: number // 下载次数
  rating: number // 平均评分
  ratingCount: number // 评分数量
  isVipRequired: boolean // 是否需要VIP权限
  createdAt: Date // 创建时间
  updatedAt: Date // 更新时间
}

// 写真分类接口，定义写真分类的层级结构
export interface PhotoCategory {
  id: string // 分类唯一标识
  name: string // 分类名称
  slug: string // 分类别名（用于URL）
  description?: string // 分类描述
  parentId?: string // 父分类ID，支持层级结构
  order: number // 排序权重
}

// 写真评分接口，记录用户对写真的评分和评价
export interface PhotoRating {
  userId: string // 用户ID
  photoId: string // 写真ID
  rating: number // 评分值（1-10）
  review?: string // 评价内容
  createdAt: Date // 评分时间
}

// 写真领域实体类，包含完整的业务逻辑和规则
export class Photo {
  constructor(
    public readonly detail: PhotoDetail, // 写真详情信息
    public readonly categories: PhotoCategory[] = [], // 写真分类列表
    public readonly ratings: PhotoRating[] = [], // 用户评分列表
    public readonly isActive: boolean = true, // 是否激活状态
    public readonly isFeatured: boolean = false // 是否为精选写真
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
    return tags
  }

  // 业务规则：是否为热门内容
  public isHot(): boolean {
    return this.detail.viewCount > 1000 || this.detail.downloadCount > 100
  }

  // 更新写真详情
  updateDetail(
    updates: Partial<Omit<PhotoDetail, 'id' | 'createdAt' | 'updatedAt'>>
  ): Photo {
    return new Photo(
      { ...this.detail, ...updates, updatedAt: new Date() },
      this.categories,
      this.ratings,
      this.isActive,
      this.isFeatured
    )
  }

  // 增加浏览次数
  incrementViewCount(): Photo {
    return this.updateDetail({
      viewCount: this.detail.viewCount + 1
    })
  }

  // 增加下载次数
  incrementDownloadCount(): Photo {
    return this.updateDetail({
      downloadCount: this.detail.downloadCount + 1
    })
  }

  // 设置精选状态
  setFeatured(featured: boolean): Photo {
    return new Photo(
      this.detail,
      this.categories,
      this.ratings,
      this.isActive,
      featured
    )
  }

  // 激活写真
  activate(): Photo {
    return new Photo(
      this.detail,
      this.categories,
      this.ratings,
      true,
      this.isFeatured
    )
  }

  // 停用写真
  deactivate(): Photo {
    return new Photo(
      this.detail,
      this.categories,
      this.ratings,
      false,
      this.isFeatured
    )
  }

  // 获取平均评分
  getAverageRating(): number {
    return this.detail.rating
  }

  // 添加评分
  addRating(rating: PhotoRating): Photo {
    const newRatings = [...this.ratings, rating]
    const totalRating = newRatings.reduce((sum, r) => sum + r.rating, 0)
    const averageRating = totalRating / newRatings.length

    return new Photo(
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
  addCategory(category: PhotoCategory): Photo {
    if (this.hasCategory(category.id)) {
      return this
    }
    return new Photo(
      this.detail,
      [...this.categories, category],
      this.ratings,
      this.isActive,
      this.isFeatured
    )
  }

  // 移除分类
  removeCategory(categoryId: string): Photo {
    return new Photo(
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

  get model() {
    return this.detail.model
  }

  get photographer() {
    return this.detail.photographer
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

  // 静态工厂方法
  static create(
    id: string,
    title: Title,
    description: string,
    coverImage: string,
    images: string[],
    model: string,
    publishDate: ReleaseDate,
    isVipRequired: boolean = false
  ): Photo {
    const detail: PhotoDetail = {
      id,
      title,
      description,
      coverImage,
      images,
      tags: [],
      model,
      publishDate,
      viewCount: 0,
      downloadCount: 0,
      rating: 0,
      ratingCount: 0,
      isVipRequired,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return new Photo(detail)
  }
}