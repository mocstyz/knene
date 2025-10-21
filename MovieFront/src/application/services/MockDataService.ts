/**
 * @fileoverview 统一Mock数据管理服务
 * @description 提供统一的Mock数据生成和管理功能，支持多种内容类型的Mock数据生成，确保前后端分离开发的数据一致性
 * @created 2025-01-21 10:30:00
 * @updated 2025-01-21 10:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Collection, type CollectionDetail } from '@domain/entities/Collection'
import { Movie, type MovieDetail } from '@domain/entities/Movie'
import { Photo, type PhotoDetail } from '@domain/entities/Photo'
import { Title } from '@domain/value-objects/Title'
import { ReleaseDate } from '@domain/value-objects/ReleaseDate'
import { Duration } from '@domain/value-objects/Duration'
import { Genre } from '@domain/value-objects/Genre'
import { MovieQuality } from '@domain/value-objects/MovieQuality'
import { ContentTransformationService } from '@application/services/ContentTransformationService'
import type { TopicItem, PhotoItem, LatestItem, BaseMovieItem, CollectionItem } from '@types-movie'
import type { HotItem } from '@infrastructure/repositories/HomeRepository'

// Mock数据管理服务，提供统一的Mock数据生成和缓存机制，支持环境配置切换
export class MockDataService {
  private static instance: MockDataService
  private contentTransformationService: ContentTransformationService
  private mockDataCache = new Map<string, any>()

  private constructor() {
    this.contentTransformationService = new ContentTransformationService()
  }

  // 获取单例实例
  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService()
    }
    return MockDataService.instance
  }

  // 生成Mock合集数据，创建指定数量的合集实体并转换为TopicItem格式
  public generateMockCollections(count: number = 12): Collection[] {
    const cacheKey = `collections_${count}`
    
    // 缓存检查 - 避免重复生成相同数据
    if (this.mockDataCache.has(cacheKey)) {
      return this.mockDataCache.get(cacheKey)
    }

    const collections = Array.from({ length: count }, (_, index) => {
      const id = `collection_${index + 1}`
      const publishDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      
      const collectionDetail: CollectionDetail = {
        id,
        title: new Title(`精选合集 ${index + 1}`),
        description: `这是第${index + 1}个精选合集的描述`,
        coverImage: `https://picsum.photos/400/600?random=${index + 1}`,
        movieIds: Array.from({ length: Math.floor(Math.random() * 50) + 10 }, (_, i) => `movie_${i + 1}`),
        tags: ['热门', '推荐', '精选'],
        genre: ['动作', '科幻', '剧情'][index % 3],
        curator: `策展人${index + 1}`,
        publishDate: new ReleaseDate(publishDate),
        viewCount: Math.floor(Math.random() * 10000) + 100,
        downloadCount: Math.floor(Math.random() * 5000) + 50,
        rating: Math.random() * 4 + 6, // 6.0-10.0评分
        ratingCount: Math.floor(Math.random() * 1000) + 10,
        isVipRequired: Math.random() > 0.7, // 30%概率为VIP内容
        isExclusive: Math.random() > 0.8, // 20%概率为独家合集
        createdAt: new Date(publishDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        updatedAt: publishDate
      }
      
      return new Collection(collectionDetail)
    })

    // 缓存生成的数据 - 提升性能
    this.mockDataCache.set(cacheKey, collections)
    return collections
  }

  // 生成Mock影片数据，创建指定数量的影片实体
  public generateMockMovies(count: number = 20): Movie[] {
    const cacheKey = `movies_${count}`
    
    if (this.mockDataCache.has(cacheKey)) {
      return this.mockDataCache.get(cacheKey)
    }

    const movies = Array.from({ length: count }, (_, index) => {
      const id = `movie_${index + 1}`
      const genres = ['动作', '喜剧', '剧情', '科幻', '恐怖'][index % 5]
      const releaseYear = 2024 - Math.floor(Math.random() * 5)
      const rating = parseFloat((Math.random() * 4 + 6).toFixed(1))
      const isVip = Math.random() > 0.7
      
      const movieDetail: MovieDetail = {
        id,
        title: new Title(`热门影片 ${index + 1}`),
        description: `这是第${index + 1}部热门影片的描述`,
        poster: `https://picsum.photos/300/450?random=${index + 100}`,
        genres: [new Genre(genres)],
        duration: new Duration(90 + Math.floor(Math.random() * 60)), // 90-150分钟
        releaseDate: new ReleaseDate(`${releaseYear}-01-01`),
        rating,
        ratingCount: Math.floor(Math.random() * 1000) + 100, // 添加评分数量
        director: `导演${index + 1}`,
        cast: [`演员${index + 1}`, `演员${index + 2}`],
        country: '中国',
        language: '中文',
        subtitles: ['中文', '英文'], // 添加字幕列表
        quality: [
          new MovieQuality('HD', 'MP4', parseFloat((Math.random() * 3 + 1).toFixed(1)) * 1024 * 1024 * 1024, 'https://example.com/download')
        ],
        fileSize: parseFloat((Math.random() * 3 + 1).toFixed(1)),
        downloadCount: Math.floor(Math.random() * 10000),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      return new Movie(
        movieDetail,
        [], // MovieCategory[]
        [], // MovieRating[]
        true, // isActive
        Math.random() > 0.8, // isFeatured - 20%概率为推荐
        isVip // isVipRequired
      )
    })

    this.mockDataCache.set(cacheKey, movies)
    return movies
  }

  // 生成Mock图片数据，创建指定数量的图片实体
  public generateMockPhotos(count: number = 15): Photo[] {
    const cacheKey = `photos_${count}`
    
    if (this.mockDataCache.has(cacheKey)) {
      return this.mockDataCache.get(cacheKey)
    }

    const photos = Array.from({ length: count }, (_, index) => {
      const id = `photo_${index + 1}`
      const category = ['风景', '人物', '建筑', '动物', '艺术'][index % 5]
      const isVip = Math.random() > 0.8
      
      const photoDetail: PhotoDetail = {
        id,
        title: new Title(`精美图片 ${index + 1}`),
        description: `这是第${index + 1}张精美图片的描述`,
        coverImage: `https://picsum.photos/600/400?random=${index + 200}`,
        images: [
          `https://picsum.photos/600/400?random=${index + 200}`,
          `https://picsum.photos/600/400?random=${index + 300}`,
          `https://picsum.photos/600/400?random=${index + 400}`
        ],
        tags: [category, '高清', '精选'],
        photographer: `摄影师${index + 1}`,
        model: `模特${index + 1}`,
        location: `拍摄地${index + 1}`,
        publishDate: new ReleaseDate(new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000)),
        viewCount: Math.floor(Math.random() * 5000),
        downloadCount: Math.floor(Math.random() * 1000),
        rating: parseFloat((Math.random() * 3 + 7).toFixed(1)), // 7.0-10.0评分
        ratingCount: Math.floor(Math.random() * 500),
        isVipRequired: isVip,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      return new Photo(
        photoDetail,
        [], // PhotoCategory[]
        [], // PhotoRating[]
        true, // isActive
        Math.random() > 0.7 // isFeatured - 30%概率为精选
      )
    })

    this.mockDataCache.set(cacheKey, photos)
    return photos
  }

  // 获取转换后的Mock合集数据，返回CollectionItem格式用于前端展示
  public getMockCollections(count: number = 12): CollectionItem[] {
    const collections = this.generateMockCollections(count)
    return collections.map(collection => {
      const unifiedItem = ContentTransformationService.transformCollectionToUnified(collection)
      // 直接使用toCollectionItem转换函数
      return {
        id: unifiedItem.id,
        title: unifiedItem.title,
        type: 'Collection' as const,
        contentType: 'collection' as const,
        description: unifiedItem.description || '',
        imageUrl: unifiedItem.imageUrl,
        alt: unifiedItem.alt || unifiedItem.title,
        isNew: unifiedItem.isNew || false,
        newType: unifiedItem.newType || 'latest',
        isVip: unifiedItem.isVip || false,
        rating: unifiedItem.rating?.toString() || '0',
        movieCount: unifiedItem.viewCount || 0,
        category: '默认分类',
        tags: unifiedItem.tags || [],
        createdAt: unifiedItem.createdAt || new Date().toISOString(),
        updatedAt: unifiedItem.updatedAt || new Date().toISOString(),
        isFeatured: unifiedItem.isFeatured || false
      }
    })
  }

  // 获取转换后的Mock专题数据，返回TopicItem格式用于前端展示
  public getMockTopics(count: number = 12): TopicItem[] {
    const collections = this.generateMockCollections(count)
    return collections.map(collection => {
      const unifiedItem = ContentTransformationService.transformCollectionToUnified(collection)
      return ContentTransformationService.transformUnifiedToTopic(unifiedItem)
    })
  }

  // 获取转换后的Mock写真数据，返回PhotoItem格式用于前端展示
  public getMockPhotos(count: number = 16): PhotoItem[] {
    const photos = this.generateMockPhotos(count)
    return photos.map(photo => {
      const unifiedItem = ContentTransformationService.transformPhotoToUnified(photo)
      return ContentTransformationService.transformUnifiedToPhoto(unifiedItem)
    })
  }

  // 获取转换后的Mock最新更新数据，返回LatestItem格式用于前端展示
  public getMockLatestUpdates(count: number = 20): LatestItem[] {
    const movies = this.generateMockMovies(count)
    const unifiedItems = ContentTransformationService.transformMovieListToUnified(movies)
    return ContentTransformationService.transformUnifiedListToLatest(unifiedItems)
  }

  // 获取转换后的Mock热门数据，返回HotItem格式用于前端展示
  public getMockHotDaily(count: number = 18): HotItem[] {
    const movies = this.generateMockMovies(count)
    const unifiedItems = ContentTransformationService.transformMovieListToUnified(movies)
    return ContentTransformationService.transformUnifiedListToHot(unifiedItems)
  }

  // 获取扩展的Mock专题数据，支持更多配置选项和筛选条件
  public getExtendedMockTopics(options: {
    count?: number
    category?: string
    includeVipOnly?: boolean
  } = {}): TopicItem[] {
    const { count = 12, category, includeVipOnly = false } = options
    let collections = this.generateMockCollections(count * 2) // 生成更多数据用于筛选

    // 分类筛选 - 根据指定分类过滤合集
    if (category) {
      collections = collections.filter(collection => collection.genre === category)
    }

    // VIP筛选 - 根据VIP状态过滤（这里简化处理，实际应该在Collection实体中添加isVip属性）
    if (includeVipOnly) {
      collections = collections.filter((_, index) => index % 3 === 0) // 简化的VIP筛选逻辑
    }

    return collections
      .slice(0, count)
      .map(collection => {
        const unifiedItem = ContentTransformationService.transformCollectionToUnified(collection)
        return ContentTransformationService.transformUnifiedToTopic(unifiedItem)
      })
  }

  // 生成Mock首页完整数据，返回HomeDataResponse格式用于首页展示
  public generateMockHomeData(): { topics: TopicItem[], photos: PhotoItem[], latestUpdates: LatestItem[], hotDaily: HotItem[] } {
    const cacheKey = 'home_data'
    
    if (this.mockDataCache.has(cacheKey)) {
      return this.mockDataCache.get(cacheKey)
    }

    const homeData = {
      topics: this.getMockTopics(12),
      photos: this.getMockPhotos(15),
      latestUpdates: this.getMockLatestUpdates(20),
      hotDaily: this.getMockHotDaily(18)
    }

    this.mockDataCache.set(cacheKey, homeData)
    return homeData
  }

  // 清除缓存，用于开发环境数据刷新或内存管理
  public clearCache(): void {
    this.mockDataCache.clear()
  }

  // 获取缓存统计信息，用于调试和性能监控
  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.mockDataCache.size,
      keys: Array.from(this.mockDataCache.keys())
    }
  }
}

// 导出单例实例，确保全局唯一的Mock数据管理器
export const mockDataService = MockDataService.getInstance()
