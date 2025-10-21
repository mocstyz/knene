/**
 * @fileoverview Mock API服务实现
 * @description 提供独立的Mock API服务，模拟真实后端API响应，支持Collection和Home相关的所有API操作，遵循前后端分离规范
 * @created 2025-01-21 11:00:00
 * @updated 2025-01-21 11:00:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import type { ICollectionApi, CollectionQueryParams, CollectionFilterParams, PaginatedResponse, ApiResponse } from './interfaces/ICollectionApi'
import type { IHomeApi, HomeDataResponse, TopicsQueryParams, PhotosQueryParams, LatestUpdatesQueryParams, HotContentQueryParams } from './interfaces/IHomeApi'
import type { CollectionItem } from '@types-movie'
import type { PhotoItem, LatestItem, MovieDetail } from '@types-movie'
import type { HotItem } from '@infrastructure/repositories/HomeRepository'
import { mockDataService } from '@application/services/MockDataService'

// Mock API延迟配置，模拟真实网络请求延迟
const MOCK_API_DELAY = {
  min: 100, // 最小延迟100ms
  max: 500  // 最大延迟500ms
}

// 模拟网络延迟的工具函数
const simulateNetworkDelay = (): Promise<void> => {
  const delay = Math.random() * (MOCK_API_DELAY.max - MOCK_API_DELAY.min) + MOCK_API_DELAY.min
  return new Promise(resolve => setTimeout(resolve, delay))
}

// 创建成功的API响应格式
const createSuccessResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  code: 200,
  data,
  message: 'Success',
  timestamp: Date.now()
})

// 创建错误的API响应格式
const createErrorResponse = (message: string, code = 500): ApiResponse<never> => ({
  success: false,
  code,
  data: null as never,
  message,
  timestamp: Date.now()
})

// Mock Collection API服务实现
export class MockCollectionApiService implements ICollectionApi {
  
  // 获取专题合集列表，支持分页和筛选
  async getCollections(params?: CollectionQueryParams): Promise<ApiResponse<PaginatedResponse<CollectionItem>>> {
    await simulateNetworkDelay()
    
    try {
      const { page = 1, pageSize = 12, category, sortBy = 'latest', featured } = params || {}
      
      // 生成Mock数据
      const allCollections = mockDataService.getMockTopics(50) // 生成足够的数据用于分页
      
      // 筛选逻辑
      let filteredCollections = allCollections
      
      if (category) {
        filteredCollections = filteredCollections.filter(item => 
          item.description?.includes(category) || item.title.includes(category)
        )
      }
      
      if (featured !== undefined) {
        filteredCollections = filteredCollections.filter((_, index) => 
          featured ? index % 3 === 0 : index % 3 !== 0
        )
      }
      
      // 排序逻辑
      if (sortBy === 'popular') {
        filteredCollections.sort(() => Math.random() - 0.5) // 随机排序模拟热度
      } else if (sortBy === 'latest') {
        filteredCollections.reverse() // 最新排序
      }
      
      // 分页逻辑
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedData = filteredCollections.slice(startIndex, endIndex)
      
      // 转换为CollectionItem格式
      const collections: CollectionItem[] = paginatedData.map(topic => ({
        id: topic.id,
        title: topic.title,
        type: 'Collection' as const,
        contentType: 'collection' as const,
        imageUrl: topic.imageUrl,
        description: topic.description || '',
        alt: topic.alt || `${topic.title} poster`,
        movieCount: Math.floor(Math.random() * 50) + 10,
        category: category || '默认分类',
        tags: ['热门', '推荐'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFeatured: featured || false,
        rating: (Math.random() * 4 + 6).toFixed(1)
      }))
      
      const response: PaginatedResponse<CollectionItem> = {
        data: collections,
        pagination: {
          currentPage: page,
          pageSize: pageSize,
          total: filteredCollections.length,
          totalPages: Math.ceil(filteredCollections.length / pageSize),
          hasNext: endIndex < filteredCollections.length,
          hasPrev: page > 1
        }
      }
      
      return createSuccessResponse(response)
    } catch (error) {
      return createErrorResponse('Failed to fetch collections')
    }
  }

  // 根据ID获取专题合集详情
  async getCollectionDetail(id: string): Promise<ApiResponse<any>> {
    await simulateNetworkDelay()
    
    try {
      const collections = mockDataService.getMockTopics(1)
      if (collections.length === 0) {
        return createErrorResponse(`Collection with id ${id} not found`, 404)
      }
      
      const topic = collections[0]
      const collection: any = {
        id,
        title: topic.title,
        type: 'Collection' as const,
        imageUrl: topic.imageUrl,
        description: topic.description || `详细描述：${topic.title}`,
        alt: topic.alt || `${topic.title} poster`,
        movieCount: Math.floor(Math.random() * 50) + 10,
        category: '精选合集',
        tags: ['热门', '推荐', '精选'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        featured: true,
        viewCount: Math.floor(Math.random() * 10000),
        rating: Math.random() * 4 + 6,
        // CollectionDetail 特有属性
        coverImage: topic.imageUrl,
        movieIds: Array.from({ length: Math.floor(Math.random() * 20) + 5 }, (_, i) => `movie-${i + 1}`),
        genre: '动作/科幻',
        publishDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        creator: '系统管理员',
        collectionDescription: `${topic.title}的详细描述，包含丰富的内容和背景信息。`,
        itemCount: Math.floor(Math.random() * 50) + 10,
        totalDuration: Math.floor(Math.random() * 500) + 100,
        updateFrequency: '每周更新',
        lastUpdated: new Date().toISOString(),
        subscriptionCount: Math.floor(Math.random() * 1000) + 100,
        movies: [] // 可以根据需要填充电影数据
      }
      
      return createSuccessResponse(collection)
    } catch (error) {
      return createErrorResponse('Failed to fetch collection detail')
    }
  }

  // 获取专题合集中的影片列表
  async getCollectionMovies(collectionId: string, params?: CollectionQueryParams): Promise<ApiResponse<PaginatedResponse<MovieDetail>>> {
    await simulateNetworkDelay()
    
    try {
      const { page = 1, pageSize = 20 } = params || {}
      
      // 生成Mock影片数据
      const movies = mockDataService.generateMockMovies(50)
      
      // 分页逻辑
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedMovies = movies.slice(startIndex, endIndex)
      
      // 转换为MovieDetail格式
      const movieDetails: MovieDetail[] = paginatedMovies.map(movie => ({
        id: movie.id,
        title: movie.title,
        type: 'Movie' as const,
        rating: movie.rating.toString(),
        imageUrl: movie.detail.poster,
        ratingColor: movie.rating >= 9 ? 'purple' : movie.rating >= 7 ? 'red' : 'white',
        quality: movie.detail.quality[0]?.resolution || 'HD',
        alt: `${movie.title} poster`,
        genres: movie.genres,
        year: movie.year,
        duration: movie.duration,
        description: movie.description,
        director: movie.director,
        cast: movie.actors || [],
        country: movie.detail.country,
        language: movie.language
      }))
      
      const response: PaginatedResponse<MovieDetail> = {
        data: movieDetails,
        pagination: {
          currentPage: page,
          pageSize: pageSize,
          total: movies.length,
          totalPages: Math.ceil(movies.length / pageSize),
          hasNext: endIndex < movies.length,
          hasPrev: page > 1
        }
      }
      
      return createSuccessResponse(response)
    } catch (error) {
      return createErrorResponse('Failed to fetch collection movies')
    }
  }

  // 获取热门专题合集
  async getHotCollections(limit?: number): Promise<ApiResponse<CollectionItem[]>> {
    await simulateNetworkDelay()
    
    try {
      const topics = mockDataService.getMockTopics(limit || 6)
      const collections: CollectionItem[] = topics.map(topic => ({
        id: topic.id,
        title: topic.title,
        type: 'Collection' as const,
        contentType: 'collection' as const,
        imageUrl: topic.imageUrl,
        description: topic.description || '',
        alt: topic.alt || `${topic.title} poster`,
        movieCount: Math.floor(Math.random() * 50) + 10,
        category: '热门合集',
        tags: ['热门', '推荐'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFeatured: true,
        rating: (Math.random() * 2 + 8).toFixed(1) // 热门合集评分更高 8-10
      }))
      
      return createSuccessResponse(collections)
    } catch (error) {
      return createErrorResponse('Failed to fetch hot collections')
    }
  }

  // 获取最新专题合集
  async getLatestCollections(limit?: number): Promise<ApiResponse<CollectionItem[]>> {
    await simulateNetworkDelay()
    
    try {
      const topics = mockDataService.getMockTopics(limit || 6)
      const collections: CollectionItem[] = topics.map(topic => ({
        id: topic.id,
        title: topic.title,
        type: 'Collection' as const,
        contentType: 'collection' as const,
        imageUrl: topic.imageUrl,
        description: topic.description || '',
        alt: topic.alt || `${topic.title} poster`,
        movieCount: Math.floor(Math.random() * 30) + 5,
        category: '最新合集',
        tags: ['最新', '推荐'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFeatured: false,
        rating: (Math.random() * 4 + 6).toFixed(1)
      }))
      
      return createSuccessResponse(collections)
    } catch (error) {
      return createErrorResponse('Failed to fetch latest collections')
    }
  }

  // 搜索专题合集
  async searchCollections(keyword: string, params?: CollectionQueryParams): Promise<ApiResponse<PaginatedResponse<CollectionItem>>> {
    await simulateNetworkDelay()
    
    try {
      const allTopics = mockDataService.getMockTopics(30)
      
      // 搜索逻辑
      const filteredTopics = allTopics.filter(topic => 
        topic.title.toLowerCase().includes(keyword.toLowerCase()) ||
        topic.description?.toLowerCase().includes(keyword.toLowerCase())
      )
      
      // 应用筛选条件
      let finalTopics = filteredTopics
      if (params?.filters?.category) {
        finalTopics = finalTopics.filter(topic => 
          topic.description?.includes(params.filters!.category!)
        )
      }
      
      const collections: CollectionItem[] = finalTopics.map(topic => ({
        id: topic.id,
        title: topic.title,
        type: 'Collection' as const,
        contentType: 'collection' as const,
        imageUrl: topic.imageUrl,
        description: topic.description || '',
        alt: topic.alt || `${topic.title} poster`,
        movieCount: Math.floor(Math.random() * 50) + 10,
        category: params?.filters?.category || '搜索结果',
        tags: ['搜索', '匹配'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFeatured: false,
        rating: (Math.random() * 4 + 6).toFixed(1)
      }))
      
      const response: PaginatedResponse<CollectionItem> = {
        data: collections,
        pagination: {
          currentPage: 1,
          pageSize: collections.length,
          total: collections.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      }
      
      return createSuccessResponse(response)
    } catch (error) {
      return createErrorResponse('Failed to search collections')
    }
  }
}

// Mock Home API服务实现
export class MockHomeApiService implements IHomeApi {
  
  // 获取首页完整数据
  async getHomeData(): Promise<ApiResponse<HomeDataResponse>> {
    await simulateNetworkDelay()
    
    try {
      const homeData = mockDataService.generateMockHomeData()
      
      // 转换为HomeDataResponse格式
      const collections: CollectionItem[] = homeData.topics.map(topic => ({
        id: topic.id,
        title: topic.title,
        type: 'Collection' as const,
        contentType: 'collection' as const,
        imageUrl: topic.imageUrl,
        description: topic.description || '',
        alt: topic.alt || `${topic.title} poster`,
        movieCount: Math.floor(Math.random() * 50) + 10,
        category: '首页推荐',
        tags: ['推荐', '热门'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFeatured: true,
        rating: (Math.random() * 4 + 6).toFixed(1)
      }))
      
      const response: HomeDataResponse = {
        collections,
        photos: homeData.photos,
        latestUpdates: homeData.latestUpdates,
        hotDaily: homeData.hotDaily
      }
      
      return createSuccessResponse(response)
    } catch (error) {
      return createErrorResponse('Failed to fetch home data')
    }
  }

  // 获取专题合集列表
  async getTopics(params?: TopicsQueryParams): Promise<ApiResponse<CollectionItem[]>> {
    await simulateNetworkDelay()
    
    try {
      const { limit = 12, featured, sortBy = 'latest' } = params || {}
      const topics = mockDataService.getMockTopics(limit)
      
      const collections: CollectionItem[] = topics.map(topic => ({
        id: topic.id,
        title: topic.title,
        type: 'Collection' as const,
        contentType: 'collection' as const,
        imageUrl: topic.imageUrl,
        description: topic.description || '',
        alt: topic.alt || `${topic.title} poster`,
        movieCount: Math.floor(Math.random() * 50) + 10,
        category: '专题合集',
        tags: ['专题', '推荐'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFeatured: featured || false,
        rating: (Math.random() * 4 + 6).toFixed(1)
      }))
      
      return createSuccessResponse(collections)
    } catch (error) {
      return createErrorResponse('Failed to fetch topics')
    }
  }

  // 获取写真内容列表
  async getPhotos(params?: PhotosQueryParams): Promise<ApiResponse<PhotoItem[]>> {
    await simulateNetworkDelay()
    
    try {
      const { limit = 15 } = params || {}
      const photos = mockDataService.getMockPhotos(limit)
      return createSuccessResponse(photos)
    } catch (error) {
      return createErrorResponse('Failed to fetch photos')
    }
  }

  // 获取最新更新列表
  async getLatestUpdates(params?: LatestUpdatesQueryParams): Promise<ApiResponse<LatestItem[]>> {
    await simulateNetworkDelay()
    
    try {
      const { limit = 20 } = params || {}
      const latestUpdates = mockDataService.getMockLatestUpdates(limit)
      return createSuccessResponse(latestUpdates)
    } catch (error) {
      return createErrorResponse('Failed to fetch latest updates')
    }
  }

  // 获取热门内容列表
  async getHotContent(params?: HotContentQueryParams): Promise<ApiResponse<HotItem[]>> {
    await simulateNetworkDelay()
    
    try {
      const { limit = 18 } = params || {}
      const hotContent = mockDataService.getMockHotDaily(limit)
      return createSuccessResponse(hotContent)
    } catch (error) {
      return createErrorResponse('Failed to fetch hot content')
    }
  }

  // 获取每日热门推荐
  async getDailyHot(limit?: number): Promise<ApiResponse<HotItem[]>> {
    return this.getHotContent({ limit })
  }

  // 获取精选专题
  async getFeaturedTopics(limit?: number): Promise<ApiResponse<CollectionItem[]>> {
    return this.getTopics({ limit, featured: true })
  }

  // 获取最新写真
  async getLatestPhotos(limit?: number): Promise<ApiResponse<PhotoItem[]>> {
    return this.getPhotos({ limit })
  }
}

// 导出Mock API服务实例
export const mockCollectionApiService = new MockCollectionApiService()
export const mockHomeApiService = new MockHomeApiService()