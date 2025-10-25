/**
 * @fileoverview 统一Mock数据管理服务
 * @description 提供统一的Mock数据生成和管理功能，支持多种内容类型的Mock数据生成，确保前后端分离开发的数据一致性
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
import type { CollectionItem, PhotoItem, LatestItem, BaseMovieItem } from '@types-movie'
import type { HotItem } from '@types-movie'

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

  // 生成Mock合集数据，创建指定数量的合集实体并转换为CollectionItem格式
  public generateMockCollections(count: number = 12): Collection[] {
    const cacheKey = `collections_${count}`
    
    // 缓存检查 - 避免重复生成相同数据
    if (this.mockDataCache.has(cacheKey)) {
      return this.mockDataCache.get(cacheKey)
    }

    const collections = Array.from({ length: count }, (_, index) => {
      const id = `collection_${index + 1}`
      
      // 生成最近30天内的随机发布时间
      const daysAgo = Math.random() * 30 // 0-30天前
      const publishDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      
      // 计算是否为新内容（24小时内）
      const isNew = daysAgo < 1
      
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
        viewCount: Math.floor(Math.random() * 50000) + 1000, // 观看次数
        downloadCount: Math.floor(Math.random() * 5000) + 50,
        likeCount: Math.floor(Math.random() * 5000) + 100, // 点赞数
        favoriteCount: Math.floor(Math.random() * 2000) + 50, // 收藏数
        rating: Math.random() * 4 + 6,
        ratingCount: Math.floor(Math.random() * 1000) + 10,
        isVipRequired: Math.random() > 0.7,
        isExclusive: Math.random() > 0.8,
        isNew: isNew, // 24小时内
        newType: isNew ? 'latest' : null, // 统一使用latest样式
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
      
      // 生成最近30天内的随机发布时间
      const daysAgo = Math.random() * 30 // 0-30天前
      const publishDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      
      // 计算是否为新内容（24小时内）
      const isNew = daysAgo < 1
      
      const movieDetail: MovieDetail = {
        id,
        title: new Title(`热门影片 ${index + 1}`),
        description: `这是第${index + 1}部热门影片的描述`,
        poster: `https://picsum.photos/300/450?random=${index + 100}`,
        genres: [new Genre(genres)],
        duration: new Duration(90 + Math.floor(Math.random() * 60)), // 90-150分钟
        releaseDate: new ReleaseDate(publishDate.toISOString().split('T')[0]),
        rating,
        ratingCount: Math.floor(Math.random() * 1000) + 100,
        director: `导演${index + 1}`,
        cast: [`演员${index + 1}`, `演员${index + 2}`],
        country: '中国',
        language: '中文',
        subtitles: ['中文', '英文'],
        quality: [
          new MovieQuality('HD', 'MP4', parseFloat((Math.random() * 3 + 1).toFixed(1)) * 1024 * 1024 * 1024, 'https://example.com/download')
        ],
        fileSize: parseFloat((Math.random() * 3 + 1).toFixed(1)),
        downloadCount: Math.floor(Math.random() * 10000),
        viewCount: Math.floor(Math.random() * 50000) + 1000, // 观看次数
        likeCount: Math.floor(Math.random() * 5000) + 100, // 点赞数
        favoriteCount: Math.floor(Math.random() * 2000) + 50, // 收藏数
        createdAt: publishDate,
        updatedAt: publishDate
      }
      
      return new Movie(
        movieDetail,
        [], // MovieCategory[]
        [], // MovieRating[]
        true, // isActive
        Math.random() > 0.8, // isFeatured
        isVip, // isVipRequired
        isNew, // isNew - 24小时内
        'latest' // newType - 统一使用latest样式
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
      
      // 生成最近30天内的随机发布时间
      const daysAgo = Math.random() * 30 // 0-30天前
      const publishDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      
      // 计算是否为新内容（24小时内）
      const isNew = daysAgo < 1
      
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
        publishDate: new ReleaseDate(publishDate.toISOString().split('T')[0]),
        viewCount: Math.floor(Math.random() * 50000) + 1000, // 观看次数
        downloadCount: Math.floor(Math.random() * 5000) + 100,
        likeCount: Math.floor(Math.random() * 5000) + 100, // 点赞数
        favoriteCount: Math.floor(Math.random() * 2000) + 50, // 收藏数
        rating: parseFloat((Math.random() * 3 + 7).toFixed(1)),
        ratingCount: Math.floor(Math.random() * 500),
        isVipRequired: isVip,
        createdAt: publishDate,
        updatedAt: publishDate
      }
      
      return new Photo(
        photoDetail,
        [], // PhotoCategory[]
        [], // PhotoRating[]
        true, // isActive
        Math.random() > 0.7, // isFeatured
        isNew, // isNew - 24小时内
        'latest' // newType - 统一使用latest样式
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
      return ContentTransformationService.transformUnifiedToCollection(unifiedItem)
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

  // 获取转换后的Mock最新更新数据，返回LatestItem格式用于前端展示（混合类型：影片、写真、合集）
  public getMockLatestUpdates(count: number = 6): LatestItem[] {
    // 生成大量数据（各50个）
    const movies = this.generateMockMovies(50)
    const photos = this.generateMockPhotos(50)
    const collections = this.generateMockCollections(50)
    
    // 转换为统一格式
    const movieItems = ContentTransformationService.transformMovieListToUnified(movies)
    const photoItems = ContentTransformationService.transformPhotoListToUnified(photos)
    const collectionItems = ContentTransformationService.transformCollectionListToUnified(collections)
    
    // 合并所有数据
    const allItems = [...movieItems, ...photoItems, ...collectionItems]
    
    // 按发布时间排序（最新的在前）
    const sorted = allItems.sort((a, b) => 
      new Date(b.publishDate || 0).getTime() - new Date(a.publishDate || 0).getTime()
    )
    
    // 取最新的N个
    const latest = sorted.slice(0, count)
    
    // 转换为LatestItem
    return ContentTransformationService.transformUnifiedListToLatest(latest)
  }

  // 获取转换后的Mock 7天最热门数据，返回HotItem格式用于前端展示（混合类型：影片、写真、合集）
  public getMockWeeklyHot(count: number = 6): HotItem[] {
    // 生成大量数据（各50个）
    const movies = this.generateMockMovies(50)
    const photos = this.generateMockPhotos(50)
    const collections = this.generateMockCollections(50)
    
    // 转换为统一格式
    const movieItems = ContentTransformationService.transformMovieListToUnified(movies)
    const photoItems = ContentTransformationService.transformPhotoListToUnified(photos)
    const collectionItems = ContentTransformationService.transformCollectionListToUnified(collections)
    
    // 合并所有数据
    const allItems = [...movieItems, ...photoItems, ...collectionItems]
    
    // 过滤：只保留7天内的内容
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const withinSevenDays = allItems.filter(item => {
      const publishTime = new Date(item.publishDate || 0).getTime()
      return publishTime >= sevenDaysAgo
    })
    
    // 计算热度分数：观看次数 * 1 + 点赞数 * 5 + 收藏数 * 10
    const withHotScore = withinSevenDays.map(item => ({
      ...item,
      hotScore: (item.viewCount || 0) * 1 + (item.likeCount || 0) * 5 + (item.favoriteCount || 0) * 10
    }))
    
    // 按热度排序（最热的在前）
    const sorted = withHotScore.sort((a, b) => b.hotScore - a.hotScore)
    
    // 取最热的N个（如果不足N个，返回实际数量）
    const hot = sorted.slice(0, count)
    
    // 转换为HotItem
    return ContentTransformationService.transformUnifiedListToWeeklyHot(hot)
  }
  
  // 保留旧方法名以兼容现有代码
  public getMockHotDaily(count: number = 6): HotItem[] {
    return this.getMockWeeklyHot(count)
  }

  // 获取扩展的Mock专题数据，支持更多配置选项和筛选条件
  public getExtendedMockCollections(options: {
    count?: number
    category?: string
    includeVipOnly?: boolean
  } = {}): CollectionItem[] {
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
        return ContentTransformationService.transformUnifiedToCollection(unifiedItem)
      })
  }

  // 获取扩展的Mock写真数据，支持更多配置选项和筛选条件
  public getExtendedMockPhotos(options: {
    count?: number
    category?: string
    includeVipOnly?: boolean
  } = {}): PhotoItem[] {
    const { count = 12, category, includeVipOnly = false } = options
    let photos = this.generateMockPhotos(count * 2) // 生成更多数据用于筛选

    // 分类筛选 - 根据指定分类过滤写真
    if (category) {
      photos = photos.filter((_, index) => {
        const categories = ['风景', '人物', '建筑', '动物', '艺术']
        return categories[index % 5] === category
      })
    }

    // VIP筛选 - 根据VIP状态过滤
    if (includeVipOnly) {
      photos = photos.filter((_, index) => index % 5 === 0) // 简化的VIP筛选逻辑
    }

    return photos
      .slice(0, count)
      .map(photo => {
        const unifiedItem = ContentTransformationService.transformPhotoToUnified(photo)
        return ContentTransformationService.transformUnifiedToPhoto(unifiedItem)
      })
  }

  // 生成Mock首页完整数据，返回HomeDataResponse格式用于首页展示
  public generateMockHomeData(): { collections: CollectionItem[], photos: PhotoItem[], latestUpdates: LatestItem[], hotDaily: HotItem[] } {
    const cacheKey = 'home_data'
    
    if (this.mockDataCache.has(cacheKey)) {
      return this.mockDataCache.get(cacheKey)
    }

    const homeData = {
      collections: this.getMockCollections(12),
      photos: this.getMockPhotos(15),
      latestUpdates: this.getMockLatestUpdates(20),
      hotDaily: this.getMockHotDaily(18)
    }

    this.mockDataCache.set(cacheKey, homeData)
    return homeData
  }

  // 获取单个合集详情，根据ID返回对应的合集信息
  public getMockCollectionDetail(collectionId: string): CollectionItem | null {
    const collections = this.generateMockCollections(50)
    const collection = collections.find(c => c.id === collectionId)
    
    if (!collection) {
      return null
    }

    const unifiedItem = ContentTransformationService.transformCollectionToUnified(collection)
    return ContentTransformationService.transformUnifiedToCollection(unifiedItem)
  }

  // 获取合集中的影片列表，支持分页
  public getMockCollectionMovies(options: {
    collectionId: string
    page?: number
    pageSize?: number
  }): { movies: import('@types-movie').MovieDetail[], total: number } {
    const { collectionId, page = 1, pageSize = 12 } = options
    
    // 为每个合集生成固定的影片列表（基于collectionId生成种子）
    const collectionIndex = parseInt(collectionId.replace('collection_', '')) || 1
    const totalMovies = 20 + (collectionIndex % 30) // 每个合集20-50部影片
    
    // 生成该合集的所有影片
    const allMovies = Array.from({ length: totalMovies }, (_, index) => {
      const movieIndex = collectionIndex * 100 + index + 1
      const id = `movie_${movieIndex}`
      const genres = ['动作', '喜剧', '剧情', '科幻', '恐怖', '爱情', '悬疑'][index % 7]
      const releaseYear = 2024 - Math.floor(Math.random() * 5)
      const rating = parseFloat((Math.random() * 4 + 6).toFixed(1))
      
      return {
        id,
        title: `合集${collectionIndex}-影片${index + 1}`,
        type: 'Movie' as const,
        rating: rating.toString(),
        ratingColor: 'white' as const,
        imageUrl: `https://picsum.photos/400/600?random=${movieIndex}`,
        quality: ['4K', 'HD', '1080P', '720P'][index % 4],
        alt: `合集${collectionIndex}-影片${index + 1} 海报`,
        genres: [genres],
        year: releaseYear,
        duration: 90 + Math.floor(Math.random() * 60),
        description: `这是合集${collectionIndex}中的第${index + 1}部影片`,
        director: `导演${index + 1}`,
        cast: [`演员${index + 1}`, `演员${index + 2}`],
        country: '中国',
        language: '中文'
      }
    })

    // 分页处理
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedMovies = allMovies.slice(startIndex, endIndex)

    return {
      movies: paginatedMovies,
      total: totalMovies
    }
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
