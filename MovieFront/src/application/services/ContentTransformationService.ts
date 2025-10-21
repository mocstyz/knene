/**
 * @fileoverview 内容转换应用服务
 * @description 在应用层统一处理业务状态计算和数据转换，将领域实体转换为统一的内容项格式，确保所有业务逻辑集中管理
 * @created 2025-01-25 14:30:00
 * @updated 2025-01-25 14:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Collection } from '@domain/entities/Collection'
import { Movie } from '@domain/entities/Movie'
import { Photo } from '@domain/entities/Photo'
import { 
  UnifiedContentFactory, 
  UnifiedContentBusinessRules,
  type UnifiedContentItem as DomainUnifiedContentItem 
} from '@domain/entities/UnifiedContent'
import type { HotItem } from '@infrastructure/repositories/HomeRepository'
import type { 
  UnifiedContentItem, 
  TopicItem, 
  PhotoItem, 
  LatestItem, 
  TopItem 
} from '@types-movie'

/**
 * 内容转换应用服务类
 * 负责在应用层进行统一的业务状态计算和数据转换
 */
export class ContentTransformationService {
  /**
   * 将Movie领域实体转换为统一内容项
   */
  static transformMovieToUnified(movie: Movie): UnifiedContentItem {
    return {
      id: movie.id,
      title: movie.title,
      contentType: 'movie',
      description: movie.description,
      imageUrl: movie.detail.poster,
      alt: movie.title,
      createdAt: movie.detail.createdAt.toISOString(),
      updatedAt: movie.detail.updatedAt.toISOString(),
      publishDate: movie.releaseDate.toISOString(),
      tags: movie.generateTags(),
      isVip: movie.isVipContent(),
      isNew: movie.isNew(),
      newType: movie.getNewType(),
      isHot: movie.isHot(),
      isFeatured: movie.isFeatured,
      rating: movie.rating,
      ratingColor: this.getRatingColor(movie.rating),
      quality: movie.quality.length > 0 ? movie.quality[0].resolution : undefined,
      viewCount: movie.downloadCount, // 影片使用下载次数作为浏览次数
      downloadCount: movie.downloadCount,
      metadata: {
        genres: movie.detail.genres.map(g => g.name),
        director: movie.detail.director,
        cast: movie.detail.cast,
        duration: movie.detail.duration.minutes,
        country: movie.detail.country,
        language: movie.detail.language,
        fileSize: movie.detail.fileSize
      }
    }
  }

  /**
   * 将Photo领域实体转换为统一内容项
   */
  static transformPhotoToUnified(photo: Photo): UnifiedContentItem {
    return {
      id: photo.id,
      title: photo.title,
      contentType: 'photo',
      description: photo.description,
      imageUrl: photo.coverImage,
      alt: photo.title,
      createdAt: photo.detail.createdAt.toISOString(),
      updatedAt: photo.detail.updatedAt.toISOString(),
      publishDate: photo.publishDate.toISOString(),
      tags: photo.generateTags(),
      isVip: photo.isVipContent(),
      isNew: photo.isNew(),
      newType: photo.getNewType(),
      isHot: photo.isHot(),
      isFeatured: photo.isFeatured,
      rating: photo.rating,
      ratingColor: this.getRatingColor(photo.rating),
      viewCount: photo.viewCount,
      downloadCount: photo.downloadCount,
      metadata: {
        model: photo.model,
        photographer: photo.photographer,
        location: photo.detail.location,
        imageCount: photo.detail.images.length
      }
    }
  }

  /**
   * 将Collection领域实体转换为统一内容项
   */
  static transformCollectionToUnified(collection: Collection): UnifiedContentItem {
    return {
      id: collection.id,
      title: collection.title,
      contentType: 'collection',
      description: collection.description,
      imageUrl: collection.coverImage,
      alt: collection.title,
      createdAt: collection.detail.createdAt.toISOString(),
      updatedAt: collection.detail.updatedAt.toISOString(),
      publishDate: collection.publishDate.toISOString(),
      tags: collection.generateTags(),
      isVip: collection.isVipContent(),
      isNew: collection.isNew(),
      newType: collection.getNewType(),
      isHot: collection.isHot(),
      isFeatured: collection.isFeatured,
      rating: collection.rating,
      ratingColor: this.getRatingColor(collection.rating),
      viewCount: collection.viewCount,
      downloadCount: collection.downloadCount,
      metadata: {
        movieCount: collection.movieCount,
        curator: collection.curator,
        genre: collection.genre,
        isExclusive: collection.detail.isExclusive
      }
    }
  }

  /**
   * 将统一内容项转换为TopicItem（专题项）
   */
  static transformUnifiedToTopic(unified: UnifiedContentItem): TopicItem {
    return {
      id: unified.id,
      title: unified.title,
      type: 'Collection',
      description: unified.description,
      imageUrl: unified.imageUrl,
      alt: unified.alt,
      isNew: unified.isNew,
      newType: unified.newType === 'hot' ? 'latest' : unified.newType === 'latest' ? 'latest' : undefined,
      isVip: unified.isVip,
      tags: unified.tags || []
    }
  }

  /**
   * 将统一内容项转换为PhotoItem（写真）
   */
  static transformUnifiedToPhoto(unified: UnifiedContentItem): PhotoItem {
    return {
      id: unified.id,
      title: unified.title,
      type: 'Collection', // PhotoItem的type字段只支持'Movie' | 'TV Show' | 'Collection'
      description: unified.description,
      imageUrl: unified.imageUrl,
      alt: unified.alt,
      isNew: unified.isNew,
      newType: unified.newType === 'hot' ? 'latest' : unified.newType === 'latest' ? 'latest' : undefined,
      isVip: unified.isVip,
      rating: unified.rating?.toString() || '0',
      ratingColor: unified.ratingColor as 'purple' | 'red' | 'white' | 'default',
      quality: unified.quality,
      genres: unified.metadata?.genres || [],
      formatType: 'JPEG高' // 默认格式类型
    }
  }

  /**
   * 将统一内容项转换为LatestItem（最新更新）
   */
  static transformUnifiedToLatest(unified: UnifiedContentItem): LatestItem {
    return {
      id: unified.id,
      title: unified.title,
      type: unified.contentType === 'movie' ? 'Movie' : 'Collection', // LatestItem的type字段只支持'Movie' | 'TV Show' | 'Collection'
      description: unified.description,
      imageUrl: unified.imageUrl,
      alt: unified.alt,
      isNew: unified.isNew,
      newType: unified.newType === 'hot' ? 'latest' : unified.newType === 'latest' ? 'latest' : undefined,
      rating: unified.rating?.toString() || '0',
      ratingColor: unified.ratingColor as 'purple' | 'red' | 'white' | 'default',
      quality: unified.quality,
      genres: unified.metadata?.genres || []
    }
  }

  /**
   * 将统一内容项转换为TopItem（热门内容）
   */
  static transformUnifiedToHot(unified: UnifiedContentItem): TopItem {
    return {
      id: unified.id,
      title: unified.title,
      type: 'Movie', // TopItem固定为Movie类型
      description: unified.description,
      imageUrl: unified.imageUrl,
      alt: unified.alt,
      rating: unified.rating?.toString() || '0',
      ratingColor: unified.ratingColor as 'purple' | 'red' | 'white' | 'default',
      quality: unified.quality,
      genres: unified.metadata?.genres || [],
      rank: unified.metadata?.rank || 1
    }
  }

  /**
   * 将统一内容项转换为TopicItem（合集项）
   */
  static transformUnifiedToCollection(unified: UnifiedContentItem): TopicItem {
    return {
      id: unified.id,
      title: unified.title,
      type: 'Collection',
      description: unified.description,
      imageUrl: unified.imageUrl,
      alt: unified.alt,
      isNew: unified.isNew,
      newType: unified.newType === 'hot' ? 'latest' : unified.newType === 'latest' ? 'latest' : undefined,
      isVip: unified.isVip,
      tags: unified.tags || []
    }
  }

  /**
   * 批量转换Movie实体列表为统一内容项列表
   */
  static transformMovieListToUnified(movies: Movie[]): UnifiedContentItem[] {
    return movies.map(movie => this.transformMovieToUnified(movie))
  }

  /**
   * 批量转换Photo实体列表为统一内容项列表
   */
  static transformPhotoListToUnified(photos: Photo[]): UnifiedContentItem[] {
    return photos.map(photo => this.transformPhotoToUnified(photo))
  }

  /**
   * 批量转换Collection实体列表为统一内容项列表
   */
  static transformCollectionListToUnified(collections: Collection[]): UnifiedContentItem[] {
    return collections.map(collection => this.transformCollectionToUnified(collection))
  }

  /**
   * 批量转换统一内容项列表为TopicItem列表
   */
  static transformUnifiedListToTopics(unifiedList: UnifiedContentItem[]): TopicItem[] {
    return unifiedList
      .filter(item => item.contentType === 'collection')
      .map(item => this.transformUnifiedToTopic(item))
  }

  /**
   * 批量转换统一内容项列表为PhotoItem列表
   */
  static transformUnifiedListToPhotos(unifiedList: UnifiedContentItem[]): PhotoItem[] {
    return unifiedList
      .filter(item => item.contentType === 'photo')
      .map(item => this.transformUnifiedToPhoto(item))
  }

  /**
   * 批量转换统一内容项列表为LatestItem列表
   */
  static transformUnifiedListToLatest(unifiedList: UnifiedContentItem[]): LatestItem[] {
    return unifiedList
      .filter(item => item.isNew)
      .sort((a, b) => new Date(b.publishDate || 0).getTime() - new Date(a.publishDate || 0).getTime())
      .map(item => this.transformUnifiedToLatest(item))
  }

  /**
   * 批量转换统一内容项列表为HotItem列表
   */
  static transformUnifiedListToHot(unifiedList: UnifiedContentItem[]): HotItem[] {
    return unifiedList
      .filter(item => item.contentType === 'movie' && item.isHot)
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .map((item, index) => ({
        id: item.id,
        title: item.title,
        type: 'Movie' as const,
        description: item.description,
        imageUrl: item.imageUrl,
        alt: item.alt || item.title,
        rating: item.rating ? String(item.rating) : '',
        ratingColor: item.ratingColor as 'purple' | 'red' | 'white' | 'default' | undefined,
        quality: item.quality,
        genres: item.metadata?.genres || [],
        rank: index + 1, // 添加排名信息
      }))
  }

  /**
   * 根据评分获取评分颜色
   */
  private static getRatingColor(rating: number): string {
    if (rating >= 9.0) return 'purple'
    if (rating >= 8.0) return 'red'
    if (rating >= 7.0) return 'white'
    return 'default'
  }

  /**
   * 验证转换结果的完整性
   */
  static validateTransformation(item: UnifiedContentItem): boolean {
    // 将类型层的UnifiedContentItem转换为领域层的UnifiedContentItem
    const domainItem: DomainUnifiedContentItem = {
      id: item.id,
      title: item.title,
      description: item.description || '',
      imageUrl: item.imageUrl,
      type: item.contentType === 'movie' ? 'Movie' : 
            item.contentType === 'photo' ? 'Photo' : 
            item.contentType === 'collection' ? 'Collection' : 'Topic',
      viewCount: item.viewCount || 0,
      downloadCount: item.downloadCount || 0,
      rating: item.rating || 0,
      publishDate: item.publishDate ? new Date(item.publishDate) : new Date(),
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      isNew: item.isNew || false,
      isVip: item.isVip || false,
      newType: item.newType || null,
      tags: item.tags || [],
      isHot: item.isHot || false,
      isFeatured: item.isFeatured || false,
      metadata: item.metadata
    }
    
    return UnifiedContentBusinessRules.validateUnifiedContent(domainItem)
  }

  /**
   * 混合内容转换 - 将不同类型的领域实体转换为统一格式
   */
  static transformMixedContent(entities: (Movie | Photo | Collection)[]): UnifiedContentItem[] {
    return entities
      .map(entity => {
        if (entity instanceof Movie) {
          return this.transformMovieToUnified(entity)
        }
        if (entity instanceof Photo) {
          return this.transformPhotoToUnified(entity)
        }
        if (entity instanceof Collection) {
          return this.transformCollectionToUnified(entity)
        }
        return null
      })
      .filter((item): item is UnifiedContentItem => item !== null && this.validateTransformation(item))
  }

  /**
   * 根据业务规则过滤内容
   */
  static filterByBusinessRules(
    items: UnifiedContentItem[],
    filters: {
      onlyNew?: boolean
      onlyVip?: boolean
      onlyHot?: boolean
      onlyFeatured?: boolean
      contentTypes?: ('movie' | 'photo' | 'collection')[]
      minRating?: number
    }
  ): UnifiedContentItem[] {
    return items.filter(item => {
      if (filters.onlyNew && !item.isNew) return false
      if (filters.onlyVip && !item.isVip) return false
      if (filters.onlyHot && !item.isHot) return false
      if (filters.onlyFeatured && !item.isFeatured) return false
      if (filters.contentTypes && !filters.contentTypes.includes(item.contentType as any)) return false
      if (filters.minRating && (item.rating || 0) < filters.minRating) return false
      return true
    })
  }

  /**
   * 根据业务规则排序内容
   */
  static sortByBusinessRules(
    items: UnifiedContentItem[],
    sortBy: 'publishDate' | 'rating' | 'viewCount' | 'downloadCount' = 'publishDate',
    order: 'asc' | 'desc' = 'desc'
  ): UnifiedContentItem[] {
    return [...items].sort((a, b) => {
      let aValue: number | string | Date
      let bValue: number | string | Date

      switch (sortBy) {
        case 'publishDate':
          aValue = new Date(a.publishDate || 0).getTime()
          bValue = new Date(b.publishDate || 0).getTime()
          break
        case 'rating':
          aValue = a.rating || 0
          bValue = b.rating || 0
          break
        case 'viewCount':
          aValue = a.viewCount || 0
          bValue = b.viewCount || 0
          break
        case 'downloadCount':
          aValue = a.downloadCount || 0
          bValue = b.downloadCount || 0
          break
        default:
          return 0
      }

      if (order === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })
  }
}
