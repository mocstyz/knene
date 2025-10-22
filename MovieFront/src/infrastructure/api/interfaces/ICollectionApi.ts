/**
 * @fileoverview Collection API接口定义
 * @description 定义影片合集相关的API接口，遵循DDD Repository模式和前后端分离规范，提供合集列表获取、详情查询、影片列表管理等核心功能，支持完整的分页和筛选机制
 * @created 2025-01-21 10:30:00
 * @updated 2025-01-21 10:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import type { CollectionItem } from '@types-movie'
import type { CollectionDetail } from '@domain/entities/Collection'
import type { BaseMovieItem } from '@types-movie'

// 分页请求参数接口，定义通用的分页查询参数
export interface PaginationParams {
  page: number // 页码，从1开始
  pageSize: number // 每页数量，默认20
}

// 分页响应数据接口，定义通用的分页响应结构
export interface PaginatedResponse<T> {
  data: T[] // 数据列表
  pagination: {
    currentPage: number // 当前页码
    pageSize: number // 每页数量
    total: number // 总记录数
    totalPages: number // 总页数
    hasNext: boolean // 是否有下一页
    hasPrev: boolean // 是否有上一页
  }
}

// API响应基础接口，定义统一的API响应结构
export interface ApiResponse<T = any> {
  code: number // 响应状态码
  message: string // 响应消息
  data: T // 响应数据
  success: boolean // 请求成功标识
  timestamp: number // 时间戳
}

// 合集筛选参数接口，定义合集查询的筛选条件
export interface CollectionFilterParams {
  categoryId?: string // 分类ID
  category?: string // 分类名称
  tags?: string[] // 标签列表
  year?: number // 年份筛选
  rating?: number // 评分筛选
  dateRange?: {
    startDate: string // 开始日期
    endDate: string // 结束日期
  }
  sortBy?: 'latest' | 'top-rated' | 'rating' | 'title' // 排序方式
  sortOrder?: 'asc' | 'desc' // 排序方向
}

// 合集查询参数接口，结合分页和筛选参数
export interface CollectionQueryParams extends PaginationParams {
  category?: string // 分类筛选
  sortBy?: 'latest' | 'top-rated' | 'rating' | 'title' // 排序方式
  featured?: boolean // 是否为精选合集
  filters?: CollectionFilterParams // 筛选条件
}

// Collection API接口定义，定义所有合集相关的API操作
export interface ICollectionApi {
  // 获取合集列表，支持分页和筛选条件
  getCollections(params?: CollectionQueryParams): Promise<ApiResponse<PaginatedResponse<CollectionItem>>>

  // 获取合集详情信息
  getCollectionDetail(collectionId: string): Promise<ApiResponse<CollectionDetail>>

  // 获取合集内影片列表，支持分页查询
  getCollectionMovies(
    collectionId: string, 
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<BaseMovieItem>>>

  // 获取热门合集列表
  getHotCollections(limit?: number): Promise<ApiResponse<CollectionItem[]>>

  // 获取最新合集列表
  getLatestCollections(limit?: number): Promise<ApiResponse<CollectionItem[]>>

  // 搜索合集，支持关键词搜索和筛选
  searchCollections(
    keyword: string, 
    params?: CollectionQueryParams
  ): Promise<ApiResponse<PaginatedResponse<CollectionItem>>>
}