/**
 * @fileoverview 分页类型定义
 * @description 统一的分页类型定义系统，提供完整的分页配置、响应数据和显示模式类型
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 分页配置接口，定义分页组件的核心配置参数
export interface PaginationConfig {
  currentPage: number
  totalPages: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

// 分页显示模式
export type PaginationMode = 'simple' | 'full' | 'compact'

// 分页组件变体样式
export type PaginationVariant = 'default' | 'primary' | 'ghost'

// 分页组件尺寸
export type PaginationSize = 'sm' | 'md' | 'lg'

// 分页响应数据接口，统一的API分页响应格式
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// 分页元信息接口，用于计算和显示分页信息
export interface PaginationMeta {
  currentPage: number
  pageSize: number
  total: number
  totalPages: number
  startIndex: number
  endIndex: number
  hasNext: boolean
  hasPrev: boolean
}

// 页码项类型，用于页码列表生成
export type PageItem = number | 'ellipsis'
