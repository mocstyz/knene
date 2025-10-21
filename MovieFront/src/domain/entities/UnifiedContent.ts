/**
 * @fileoverview 统一内容领域实体定义
 * @description 定义统一内容接口和业务逻辑，为所有内容类型（影片、写真、合集等）提供统一的业务状态计算和标签生成
 * @created 2025-01-25 14:30:00
 * @updated 2025-01-25 14:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 统一内容业务状态接口，定义所有内容类型的通用业务状态
export interface UnifiedContentBusinessState {
  /** 是否为新内容（24小时内发布） */
  isNew: boolean
  /** 是否为VIP专享内容 */
  isVip: boolean
  /** NEW标签类型 */
  newType: 'hot' | 'latest' | null
  /** 生成的标签列表 */
  tags: string[]
  /** 是否为热门内容 */
  isHot: boolean
  /** 是否为精选内容 */
  isFeatured: boolean
}

// 统一内容基础接口，定义所有内容类型的通用属性
export interface UnifiedContentBase {
  /** 内容唯一标识 */
  id: string
  /** 内容标题 */
  title: string
  /** 内容描述 */
  description: string
  /** 封面图片URL */
  imageUrl: string
  /** 内容类型 */
  type: 'Movie' | 'Photo' | 'Collection' | 'Topic'
  /** 浏览次数 */
  viewCount: number
  /** 下载次数 */
  downloadCount: number
  /** 评分 */
  rating: number
  /** 发布日期 */
  publishDate: Date
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
}

// 统一内容业务接口，继承基础接口并添加业务状态
export interface UnifiedContentItem extends UnifiedContentBase, UnifiedContentBusinessState {
  /** 内容元数据，根据类型不同包含不同信息 */
  metadata?: {
    // 影片特有属性
    genres?: string[]
    director?: string
    cast?: string[]
    duration?: number
    quality?: string
    
    // 写真特有属性
    model?: string
    photographer?: string
    location?: string
    
    // 合集特有属性
    movieCount?: number
    curator?: string
    genre?: string
    
    // 通用扩展属性
    [key: string]: any
  }
}

// 统一内容业务规则类，提供统一的业务逻辑计算
export class UnifiedContentBusinessRules {
  /**
   * 计算是否为新内容（24小时内发布）
   */
  static isNew(publishDate: Date): boolean {
    const now = new Date()
    const hoursDiff = (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60)
    return hoursDiff <= 24
  }

  /**
   * 获取NEW标签类型
   */
  static getNewType(publishDate: Date, viewCount: number): 'hot' | 'latest' | null {
    if (!this.isNew(publishDate)) return null
    // 根据浏览量判断是热门还是最新
    return viewCount > 1000 ? 'hot' : 'latest'
  }

  /**
   * 判断是否为热门内容
   */
  static isHot(viewCount: number, downloadCount: number, rating: number): boolean {
    return viewCount > 1000 || downloadCount > 100 || rating >= 8.0
  }

  /**
   * 生成基础标签列表
   */
  static generateBaseTags(
    isVip: boolean,
    isNew: boolean,
    isFeatured: boolean,
    type: string,
    customTags: string[] = []
  ): string[] {
    const tags: string[] = [...customTags]
    if (isVip) tags.push('VIP')
    if (isNew) tags.push('NEW')
    if (isFeatured) tags.push('精选')
    tags.push(type)
    return tags
  }

  /**
   * 从领域实体转换为统一内容项
   */
  static fromMovie(movie: any): UnifiedContentItem {
    return {
      id: movie.id,
      title: movie.title,
      description: movie.description,
      imageUrl: movie.poster,
      type: 'Movie',
      viewCount: movie.downloadCount, // 影片使用下载次数作为浏览次数
      downloadCount: movie.downloadCount,
      rating: movie.rating,
      publishDate: movie.releaseDate,
      createdAt: movie.detail.createdAt,
      updatedAt: movie.detail.updatedAt,
      isNew: movie.isNew(),
      isVip: movie.isVipContent(),
      newType: movie.getNewType(),
      tags: movie.generateTags(),
      isHot: movie.isHot(),
      isFeatured: movie.isFeatured,
      metadata: {
        genres: movie.genres.map((g: any) => g.name),
        director: movie.detail.director,
        cast: movie.detail.cast,
        duration: movie.detail.duration,
        quality: movie.detail.quality.length > 0 ? movie.detail.quality[0].resolution : undefined
      }
    }
  }

  /**
   * 从写真实体转换为统一内容项
   */
  static fromPhoto(photo: any): UnifiedContentItem {
    return {
      id: photo.id,
      title: photo.title,
      description: photo.description,
      imageUrl: photo.coverImage,
      type: 'Photo',
      viewCount: photo.viewCount,
      downloadCount: photo.downloadCount,
      rating: photo.rating,
      publishDate: photo.publishDate,
      createdAt: photo.detail.createdAt,
      updatedAt: photo.detail.updatedAt,
      isNew: photo.isNew(),
      isVip: photo.isVipContent(),
      newType: photo.getNewType(),
      tags: photo.generateTags(),
      isHot: photo.isHot(),
      isFeatured: photo.isFeatured,
      metadata: {
        model: photo.model,
        photographer: photo.photographer,
        location: photo.detail.location
      }
    }
  }

  /**
   * 从合集实体转换为统一内容项
   */
  static fromCollection(collection: any): UnifiedContentItem {
    return {
      id: collection.id,
      title: collection.title,
      description: collection.description,
      imageUrl: collection.coverImage,
      type: 'Collection',
      viewCount: collection.viewCount,
      downloadCount: collection.downloadCount,
      rating: collection.rating,
      publishDate: collection.publishDate,
      createdAt: collection.detail.createdAt,
      updatedAt: collection.detail.updatedAt,
      isNew: collection.isNew(),
      isVip: collection.isVipContent(),
      newType: collection.getNewType(),
      tags: collection.generateTags(),
      isHot: collection.isHot(),
      isFeatured: collection.isFeatured,
      metadata: {
        movieCount: collection.movieCount,
        curator: collection.curator,
        genre: collection.genre
      }
    }
  }

  /**
   * 验证统一内容项的完整性
   */
  static validateUnifiedContent(item: UnifiedContentItem): boolean {
    return !!(
      item.id &&
      item.title &&
      item.imageUrl &&
      item.type &&
      typeof item.viewCount === 'number' &&
      typeof item.downloadCount === 'number' &&
      typeof item.rating === 'number' &&
      item.publishDate instanceof Date &&
      typeof item.isNew === 'boolean' &&
      typeof item.isVip === 'boolean' &&
      Array.isArray(item.tags)
    )
  }
}

// 统一内容工厂类，负责创建和管理统一内容项
export class UnifiedContentFactory {
  /**
   * 从任意领域实体创建统一内容项
   */
  static createFromEntity(entity: any): UnifiedContentItem | null {
    if (!entity) return null

    // 根据实体类型选择转换方法
    if (entity.constructor.name === 'Movie' || entity.detail?.genres) {
      return UnifiedContentBusinessRules.fromMovie(entity)
    }
    
    if (entity.constructor.name === 'Photo' || entity.detail?.model) {
      return UnifiedContentBusinessRules.fromPhoto(entity)
    }
    
    if (entity.constructor.name === 'Collection' || entity.detail?.movieIds) {
      return UnifiedContentBusinessRules.fromCollection(entity)
    }

    return null
  }

  /**
   * 批量转换实体列表为统一内容项列表
   */
  static createListFromEntities(entities: any[]): UnifiedContentItem[] {
    return entities
      .map(entity => this.createFromEntity(entity))
      .filter((item): item is UnifiedContentItem => 
        item !== null && UnifiedContentBusinessRules.validateUnifiedContent(item)
      )
  }

  /**
   * 创建空的统一内容项（用于占位或默认值）
   */
  static createEmpty(type: 'Movie' | 'Photo' | 'Collection' | 'Topic'): UnifiedContentItem {
    const now = new Date()
    return {
      id: '',
      title: '',
      description: '',
      imageUrl: '',
      type,
      viewCount: 0,
      downloadCount: 0,
      rating: 0,
      publishDate: now,
      createdAt: now,
      updatedAt: now,
      isNew: false,
      isVip: false,
      newType: null,
      tags: [],
      isHot: false,
      isFeatured: false,
      metadata: {}
    }
  }
}
