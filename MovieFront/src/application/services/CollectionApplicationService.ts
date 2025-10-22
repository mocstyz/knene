/**
 * @fileoverview 合集应用服务
 * @description 处理合集相关的业务逻辑，包括合集详情获取、合集影片列表等功能，遵循DDD架构和Repository模式
 * @author mosctz
 * @since 1.0.0
 * @version 2.0.0
 */

import type { CollectionDetail } from '@domain/entities/Collection'
import type { BaseMovieItem, MovieDetail } from '@types-movie'
import type { CollectionItem } from '@types-movie'
import type { ICollectionRepository } from '@infrastructure/repositories/ICollectionRepository'
import { CollectionRepository } from '@infrastructure/repositories/CollectionRepository'
import type { CollectionQueryParams, CollectionFilterParams } from '@infrastructure/api/interfaces/ICollectionApi'

// 分页参数接口，定义分页查询的参数
export interface PaginationParams {
  page: number // 页码，从1开始
  pageSize: number // 每页数量
  sortBy?: 'title' | 'year' | 'rating' | 'createdAt' // 排序字段
  sortOrder?: 'asc' | 'desc' // 排序方向
}

// 分页响应接口，定义分页查询的响应结构
export interface PaginatedResponse<T> {
  items: T[] // 当前页数据
  total: number // 总条数
  page: number // 当前页码
  pageSize: number // 每页数量
  totalPages: number // 总页数
  hasNext: boolean // 是否有下一页
  hasPrev: boolean // 是否有上一页
}

// 合集影片列表响应类型，专用于合集详情页面的影片列表
export type CollectionMoviesResponse = PaginatedResponse<BaseMovieItem>

// 合集应用服务，处理合集相关的业务逻辑和数据转换，遵循DDD架构和Repository模式
export class CollectionApplicationService {
  private collectionRepository: ICollectionRepository

  constructor() {
    this.collectionRepository = new CollectionRepository()
  }

  // 获取合集详情信息，通过Repository层访问数据
  async getCollectionDetail(collectionId: string): Promise<CollectionItem> {
    try {
      return await this.collectionRepository.getCollectionDetail(collectionId)
    } catch (error) {
      console.error(`Failed to get collection detail for ${collectionId}:`, error)
      throw new Error(`无法获取合集详情: ${collectionId}`)
    }
  }

  // 获取合集影片列表，支持分页
  async getCollectionMovies(
    collectionId: string,
    params: PaginationParams
  ): Promise<PaginatedResponse<MovieDetail>> {
    try {
      const queryParams: CollectionQueryParams = {
        page: params.page,
        pageSize: params.pageSize,
        sortBy: params.sortBy === 'title' ? 'title' : 
               params.sortBy === 'rating' ? 'rating' : 'latest'
      }

      const result = await this.collectionRepository.getCollectionMovies(collectionId, queryParams)
      
      // 转换为应用层的分页响应格式
      return {
        items: result.data,
        total: result.pagination.total,
        page: result.pagination.currentPage,
        pageSize: result.pagination.pageSize,
        totalPages: result.pagination.totalPages,
        hasNext: result.pagination.hasNext,
        hasPrev: result.pagination.hasPrev
      }
    } catch (error) {
      console.error(`Failed to get collection movies for ${collectionId}:`, error)
      throw new Error(`无法获取合集影片列表: ${collectionId}`)
    }
  }

  // 获取合集列表，支持分页和筛选
  async getCollections(params?: {
    page?: number
    pageSize?: number
    category?: string
    sortBy?: string
    featured?: boolean
  }): Promise<PaginatedResponse<CollectionItem>> {
    try {
      const queryParams: CollectionQueryParams = {
        page: params?.page || 1,
        pageSize: params?.pageSize || 12,
        category: params?.category,
        sortBy: params?.sortBy as any || 'latest',
        featured: params?.featured
      }

      const result = await this.collectionRepository.getCollections(queryParams)
      
      return {
        items: result.data,
        total: result.pagination.total,
        page: result.pagination.currentPage,
        pageSize: result.pagination.pageSize,
        totalPages: result.pagination.totalPages,
        hasNext: result.pagination.hasNext,
        hasPrev: result.pagination.hasPrev
      }
    } catch (error) {
      console.error('Failed to get collections:', error)
      throw new Error('无法获取合集列表')
    }
  }

  // 获取热门合集
  async getHotCollections(limit = 6): Promise<CollectionItem[]> {
    try {
      return await this.collectionRepository.getHotCollections(limit)
    } catch (error) {
      console.error('Failed to get hot collections:', error)
      throw new Error('无法获取热门合集')
    }
  }

  // 获取最新合集
  async getLatestCollections(limit = 6): Promise<CollectionItem[]> {
    try {
      return await this.collectionRepository.getLatestCollections(limit)
    } catch (error) {
      console.error('Failed to get latest collections:', error)
      throw new Error('无法获取最新合集')
    }
  }

  // 搜索合集
  async searchCollections(
    query: string, 
    filters?: CollectionFilterParams
  ): Promise<PaginatedResponse<CollectionItem>> {
    try {
      const result = await this.collectionRepository.searchCollections(query, filters)
      
      return {
        items: result.data,
        total: result.pagination.total,
        page: result.pagination.currentPage,
        pageSize: result.pagination.pageSize,
        totalPages: result.pagination.totalPages,
        hasNext: result.pagination.hasNext,
        hasPrev: result.pagination.hasPrev
      }
    } catch (error) {
      console.error('Failed to search collections:', error)
      throw new Error('搜索合集失败')
    }
  }

  // 检查合集是否存在
  async existsCollection(id: string): Promise<boolean> {
    try {
      return await this.collectionRepository.existsCollection(id)
    } catch (error) {
      console.error(`Failed to check collection existence for ${id}:`, error)
      return false
    }
  }

  // 获取合集统计信息
  async getCollectionStats(id: string): Promise<{
    movieCount: number
    viewCount: number
    favoriteCount: number
    rating: number
  }> {
    try {
      return await this.collectionRepository.getCollectionStats(id)
    } catch (error) {
      console.error(`Failed to get collection stats for ${id}:`, error)
      return {
        movieCount: 0,
        viewCount: 0,
        favoriteCount: 0,
        rating: 0
      }
    }
  }
}