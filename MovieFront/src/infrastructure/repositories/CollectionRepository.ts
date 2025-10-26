/**
 * @fileoverview Collection Repository实现类
 * @description 实现专题合集数据访问层，遵循DDD Repository模式，通过API服务工厂获取数据源
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import type { CollectionItem } from '@types-movie'
import type { MovieDetail } from '@types-movie'
import type { ICollectionRepository } from './ICollectionRepository'
import type { 
  CollectionQueryParams, 
  CollectionFilterParams, 
  PaginatedResponse 
} from '@infrastructure/api/interfaces/ICollectionApi'
import { createCollectionApiService } from '@infrastructure/services/ApiServiceFactory'
import { MOVIE_ENDPOINTS } from '@infrastructure/api/endpoints'

// Collection Repository实现类
export class CollectionRepository implements ICollectionRepository {
  private apiService = createCollectionApiService()
  
  // 获取专题合集列表
  async getCollections(params?: CollectionQueryParams): Promise<PaginatedResponse<CollectionItem>> {
    const { page = 1, pageSize = 12, category, sortBy = 'latest', featured } = params || {}
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    // 确保baseUrl是完整的URL或者正确的相对路径
    const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `${window.location.origin}${baseUrl}`
    const apiUrl = new URL(MOVIE_ENDPOINTS.COLLECTIONS, fullBaseUrl)
    
    // 添加查询参数
    apiUrl.searchParams.append('page', page.toString())
    apiUrl.searchParams.append('limit', pageSize.toString())
    if (category) apiUrl.searchParams.append('category', category)
    if (sortBy) apiUrl.searchParams.append('sortBy', sortBy)
    if (featured !== undefined) apiUrl.searchParams.append('featured', featured.toString())

    try {
      const response = await fetch(apiUrl.toString())
      
      if (!response.ok) {
        throw new Error(`Failed to fetch collections: ${response.status}`)
      }

      const data = await response.json()
      return this.transformCollectionsResponse(data)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('Development: API not available, using mock data for collections')
      } else {
        console.error('Error fetching collections:', error)
      }
      
      // 返回空的分页响应
      return {
        data: [],
        pagination: {
          currentPage: 1,
          pageSize: pageSize,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    }
  }

  // 获取专题合集详情
  async getCollectionDetail(id: string): Promise<CollectionItem> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    // 确保baseUrl是完整的URL或者正确的相对路径
    const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `${window.location.origin}${baseUrl}`
    const apiUrl = new URL(`${MOVIE_ENDPOINTS.COLLECTIONS}/${id}`, fullBaseUrl)

    try {
      const response = await fetch(apiUrl.toString())
      
      if (!response.ok) {
        throw new Error(`Failed to fetch collection detail: ${response.status}`)
      }

      const data = await response.json()
      return this.transformCollectionItem(data)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log(`🎬 [CollectionRepository] Development: API not available, using mock data for collection ${id}`)
        
        // 使用Mock数据服务
        const { mockDataService } = await import('@application/services/MockDataService')
        console.log(`🎬 [CollectionRepository] Calling getMockCollectionDetail with id:`, id, typeof id)
        const mockCollection = mockDataService.getMockCollectionDetail(id)
        console.log(`🎬 [CollectionRepository] Mock collection result:`, mockCollection)
        
        if (mockCollection) {
          return mockCollection
        }
        
        // 如果mock数据中也没有，返回默认合集
        return {
          id,
          title: `合集 ${id}`,
          type: 'Collection' as const,
          contentType: 'collection' as const,
          imageUrl: 'https://picsum.photos/400/600?random=1',
          description: '这是一个示例合集',
          alt: `合集 ${id} 封面`,
          movieCount: 0,
          category: '默认分类',
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isFeatured: false,
          rating: '0'
        }
      } else {
        console.error('Error fetching collection detail:', error)
      }
      
      throw new Error(`Collection with id ${id} not found`)
    }
  }

  // 获取专题合集中的影片列表
  async getCollectionMovies(
    collectionId: string, 
    params?: CollectionQueryParams
  ): Promise<PaginatedResponse<MovieDetail>> {
    const { page = 1, pageSize = 12, sortBy = 'latest' } = params || {}
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    // 确保baseUrl是完整的URL或者正确的相对路径
    const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `${window.location.origin}${baseUrl}`
    const apiUrl = new URL(
      `${MOVIE_ENDPOINTS.COLLECTIONS}/${collectionId}/movies`, 
      fullBaseUrl
    )
    
    apiUrl.searchParams.append('page', page.toString())
    apiUrl.searchParams.append('limit', pageSize.toString())

    try {
      const response = await fetch(apiUrl.toString())
      
      if (!response.ok) {
        throw new Error(`Failed to fetch collection movies: ${response.status}`)
      }

      const data = await response.json()
      return this.transformMoviesResponse(data)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log(`🎬 [CollectionRepository] Development: API not available, using mock data for collection ${collectionId} movies`)
        
        // 使用Mock数据服务
        const { mockDataService } = await import('@application/services/MockDataService')
        console.log(`🎬 [CollectionRepository] Calling getMockCollectionMovies with:`, { collectionId, page, pageSize })
        const mockResult = mockDataService.getMockCollectionMovies({
          collectionId,
          page,
          pageSize
        })
        console.log(`🎬 [CollectionRepository] Mock result:`, { moviesCount: mockResult.movies.length, total: mockResult.total })
        
        const totalPages = Math.ceil(mockResult.total / pageSize)
        
        return {
          data: mockResult.movies,
          pagination: {
            currentPage: page,
            pageSize: pageSize,
            total: mockResult.total,
            totalPages: totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      } else {
        console.error('Error fetching collection movies:', error)
      }
      
      // 返回空的分页响应
      return {
        data: [],
        pagination: {
          currentPage: 1,
          pageSize: pageSize,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    }
  }

  // 获取热门专题合集
  async getHotCollections(limit = 6): Promise<CollectionItem[]> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    // 确保baseUrl是完整的URL或者正确的相对路径
    const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `${window.location.origin}${baseUrl}`
    const apiUrl = new URL(`${MOVIE_ENDPOINTS.COLLECTIONS}/hot`, fullBaseUrl)
    apiUrl.searchParams.append('limit', limit.toString())

    try {
      const response = await fetch(apiUrl.toString())
      
      if (!response.ok) {
        throw new Error(`Failed to fetch hot collections: ${response.status}`)
      }

      const data = await response.json()
      return data.map((item: any) => this.transformCollectionItem(item))
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('Development: API not available, using mock data for hot collections')
      } else {
        console.error('Error fetching hot collections:', error)
      }
      return []
    }
  }

  // 获取最新专题合集
  async getLatestCollections(limit = 6): Promise<CollectionItem[]> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    // 确保baseUrl是完整的URL或者正确的相对路径
    const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `${window.location.origin}${baseUrl}`
    const apiUrl = new URL(`${MOVIE_ENDPOINTS.COLLECTIONS}/latest`, fullBaseUrl)
    apiUrl.searchParams.append('limit', limit.toString())

    try {
      const response = await fetch(apiUrl.toString())
      
      if (!response.ok) {
        throw new Error(`Failed to fetch latest collections: ${response.status}`)
      }

      const data = await response.json()
      return data.map((item: any) => this.transformCollectionItem(item))
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('Development: API not available, using mock data for latest collections')
      } else {
        console.error('Error fetching latest collections:', error)
      }
      return []
    }
  }

  // 搜索专题合集
  async searchCollections(
    query: string, 
    filters?: CollectionFilterParams
  ): Promise<PaginatedResponse<CollectionItem>> {
    const { category, sortBy = 'relevance' } = filters || {}
    const page = 1
    const pageSize = 12
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    // 确保baseUrl是完整的URL或者正确的相对路径
    const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `${window.location.origin}${baseUrl}`
    const apiUrl = new URL(`${MOVIE_ENDPOINTS.COLLECTIONS}/search`, fullBaseUrl)
    
    apiUrl.searchParams.append('q', query)
    if (filters?.category) apiUrl.searchParams.append('category', filters.category)
    if (filters?.year) apiUrl.searchParams.append('year', filters.year.toString())
    if (filters?.rating) apiUrl.searchParams.append('rating', filters.rating.toString())

    try {
      const response = await fetch(apiUrl.toString())
      
      if (!response.ok) {
        throw new Error(`Failed to search collections: ${response.status}`)
      }

      const data = await response.json()
      return this.transformCollectionsResponse(data)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('Development: API not available, using mock data for search collections')
      } else {
        console.error('Error searching collections:', error)
      }
      
      return {
        data: [],
        pagination: {
          currentPage: 1,
          pageSize: 12,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    }
  }

  // 获取推荐专题合集
  async getRecommendedCollections(limit = 6): Promise<CollectionItem[]> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    // 确保baseUrl是完整的URL或者正确的相对路径
    const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `${window.location.origin}${baseUrl}`
    const apiUrl = new URL(`${MOVIE_ENDPOINTS.COLLECTIONS}/recommended`, fullBaseUrl)
    apiUrl.searchParams.append('limit', limit.toString())

    try {
      const response = await fetch(apiUrl.toString())
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recommended collections: ${response.status}`)
      }

      const data = await response.json()
      return data.map((item: any) => this.transformCollectionItem(item))
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('Development: API not available, using mock data for recommended collections')
      } else {
        console.error('Error fetching recommended collections:', error)
      }
      return []
    }
  }

  // 获取分类专题合集
  async getCollectionsByCategory(
    category: string, 
    params?: CollectionQueryParams
  ): Promise<PaginatedResponse<CollectionItem>> {
    return this.getCollections({ 
      page: params?.page || 1,
      pageSize: params?.pageSize || 12,
      category,
      sortBy: params?.sortBy,
      featured: params?.featured,
      filters: params?.filters
    })
  }

  // 检查专题合集是否存在
  async existsCollection(id: string): Promise<boolean> {
    try {
      await this.getCollectionDetail(id)
      return true
    } catch {
      return false
    }
  }

  // 获取专题合集统计信息
  async getCollectionStats(id: string): Promise<{
    movieCount: number
    viewCount: number
    favoriteCount: number
    rating: number
  }> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    // 确保baseUrl是完整的URL或者正确的相对路径
    const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `${window.location.origin}${baseUrl}`
    const apiUrl = new URL(`${MOVIE_ENDPOINTS.COLLECTIONS}/${id}/stats`, fullBaseUrl)

    try {
      const response = await fetch(apiUrl.toString())
      
      if (!response.ok) {
        throw new Error(`Failed to fetch collection stats: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log(`Development: API not available, using mock stats for collection ${id}`)
      } else {
        console.error('Error fetching collection stats:', error)
      }
      
      // 返回默认统计信息
      return {
        movieCount: 0,
        viewCount: 0,
        favoriteCount: 0,
        rating: 0
      }
    }
  }

  // 转换API响应为分页集合响应
  private transformCollectionsResponse(apiData: any): PaginatedResponse<CollectionItem> {
    return {
      data: (apiData.data || apiData.collections || []).map((item: any) => 
        this.transformCollectionItem(item)
      ),
      pagination: {
        currentPage: apiData.pagination?.page || 1,
        pageSize: apiData.pagination?.limit || 12,
        total: apiData.pagination?.total || 0,
        totalPages: apiData.pagination?.totalPages || 0,
        hasNext: apiData.pagination?.hasNext || false,
        hasPrev: apiData.pagination?.hasPrev || false
      }
    }
  }

  // 转换API响应为分页影片响应
  private transformMoviesResponse(apiData: any): PaginatedResponse<MovieDetail> {
    return {
      data: (apiData.data || apiData.movies || []).map((item: any) => ({
        id: item.id || item._id,
        title: item.title || item.name,
        type: item.type === 'series' ? 'TV Show' : 'Movie',
        rating: item.rating?.toString() || '0.0',
        imageUrl: item.poster || item.imageUrl || item.coverImage,
        ratingColor: 'white',
        quality: item.quality || 'HD',
        alt: item.alt || `${item.title || item.name} poster`,
        genres: item.genres || [],
        year: item.year || new Date().getFullYear(),
        duration: item.duration || '120分钟',
        description: item.description || item.summary || '',
        director: item.director || '未知导演',
        cast: item.cast || [],
        country: item.country || '未知',
        language: item.language || '中文',
        // VIP相关字段 - 确保从Mock数据或API响应中传递
        isVip: item.isVip !== undefined ? item.isVip : false,
        isNew: item.isNew !== undefined ? item.isNew : false,
        newType: item.newType || null,
        // 统计字段
        viewCount: item.viewCount,
        downloadCount: item.downloadCount,
        likeCount: item.likeCount,
        favoriteCount: item.favoriteCount
      })),
      pagination: {
        currentPage: apiData.pagination?.page || 1,
        pageSize: apiData.pagination?.limit || 20,
        total: apiData.pagination?.total || 0,
        totalPages: apiData.pagination?.totalPages || 0,
        hasNext: apiData.pagination?.hasNext || false,
        hasPrev: apiData.pagination?.hasPrev || false
      }
    }
  }

  // 转换单个集合项为CollectionItem
  private transformCollectionItem(item: any): CollectionItem {
    return {
      id: item.id || item._id,
      title: item.title || item.name,
      type: 'Collection' as const,
      contentType: 'collection' as const,
      imageUrl: item.poster || item.imageUrl || item.coverImage,
      description: item.description || item.summary,
      alt: item.alt || `${item.title || item.name} poster`,
      movieCount: item.movieCount || 0,
      category: item.category || '未分类',
      tags: item.tags || [],
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
      isFeatured: item.featured || false,
      rating: item.rating?.toString() || '0',
      // VIP相关字段 - 确保从Mock数据或API响应中传递
      isVip: item.isVip !== undefined ? item.isVip : true, // 合集默认为VIP
      isNew: item.isNew !== undefined ? item.isNew : false,
      newType: item.newType || null,
      // 统计字段
      viewCount: item.viewCount,
      downloadCount: item.downloadCount,
      likeCount: item.likeCount,
      favoriteCount: item.favoriteCount
    }
  }


}