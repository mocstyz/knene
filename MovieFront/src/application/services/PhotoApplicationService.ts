/**
 * @fileoverview 写真应用服务
 * @description 写真业务逻辑的应用服务层实现，负责协调写真相关的业务用例，支持分页、筛选、排序等功能
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { BaseApplicationService } from '@application/services/BaseApplicationService'
import type { PhotoItem } from '@types-movie'

// 写真查询参数接口
export interface PhotoQueryOptions {
  page?: number
  pageSize?: number
  category?: string
  sortBy?: 'latest' | 'popular' | 'rating'
  includeVipOnly?: boolean
}

// 写真分页响应接口
export interface PhotoPageResponse {
  items: PhotoItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 写真应用服务类，负责写真相关的业务逻辑协调
export class PhotoApplicationService extends BaseApplicationService {
  
  // 获取写真列表
  async getPhotos(options: PhotoQueryOptions = {}): Promise<PhotoItem[]> {
    const { page = 1, pageSize = 12, category, sortBy = 'latest', includeVipOnly = false } = options
    
    return this.fetchWithFallback(
      // 真实API调用（待后端实现）
      async () => {
        throw new Error('真实API尚未实现')
      },
      // Mock数据回退机制
      () => {
        console.log('📸 [PhotoApplicationService] 使用Mock数据获取写真', {
          page,
          pageSize,
          category,
          sortBy,
          includeVipOnly
        })
        
        // 使用MockDataService获取写真数据
        const mockPhotos = this.mockDataService.getExtendedMockPhotos({
          count: pageSize * 10, // 生成足够的数据用于分页和筛选
          category,
          includeVipOnly
        })
        
        // 排序处理
        let sortedPhotos = [...mockPhotos]
        switch (sortBy) {
          case 'popular':
            // 按热度排序（模拟）
            sortedPhotos.sort(() => Math.random() - 0.5)
            break
          case 'rating':
            // 按评分排序
            sortedPhotos.sort((a, b) => {
              const ratingA = a.rating ? parseFloat(a.rating) : 0
              const ratingB = b.rating ? parseFloat(b.rating) : 0
              return ratingB - ratingA
            })
            break
          case 'latest':
          default:
            // 按最新排序（默认）
            break
        }
        
        // 分页处理
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        const paginatedPhotos = sortedPhotos.slice(startIndex, endIndex)
        
        console.log('📸 [PhotoApplicationService] Mock数据处理完成', {
          totalGenerated: mockPhotos.length,
          afterSorting: sortedPhotos.length,
          afterPagination: paginatedPhotos.length,
          startIndex,
          endIndex
        })
        
        return paginatedPhotos
      },
      `获取写真列表[页码:${page}, 每页:${pageSize}]`
    )
  }
  
  // 获取写真分页数据
  async getPhotosWithPagination(options: PhotoQueryOptions = {}): Promise<PhotoPageResponse> {
    const { page = 1, pageSize = 12 } = options
    
    return this.fetchWithFallback(
      // 真实API调用（待后端实现）
      async () => {
        throw new Error('真实API尚未实现')
      },
      // Mock数据回退机制
      () => {
        // 获取总数据用于计算分页信息
        const allPhotos = this.mockDataService.getExtendedMockPhotos({
          count: 120, // 模拟总共120个写真
          category: options.category,
          includeVipOnly: options.includeVipOnly
        })
        
        // 获取当前页数据
        const items = this.mockDataService.getExtendedMockPhotos({
          count: pageSize * 10,
          category: options.category,
          includeVipOnly: options.includeVipOnly
        }).slice((page - 1) * pageSize, page * pageSize)
        
        const total = allPhotos.length
        const totalPages = Math.ceil(total / pageSize)
        
        return {
          items,
          total,
          page,
          pageSize,
          totalPages
        }
      },
      `获取写真分页数据[页码:${page}, 每页:${pageSize}]`
    )
  }
  
  // 获取写真总数
  async getPhotosCount(options: Omit<PhotoQueryOptions, 'page' | 'pageSize'> = {}): Promise<number> {
    return this.fetchWithFallback(
      // 真实API调用（待后端实现）
      async () => {
        throw new Error('真实API尚未实现')
      },
      // Mock数据回退机制
      () => {
        const allPhotos = this.mockDataService.getExtendedMockPhotos({
          count: 120, // 模拟总数
          category: options.category,
          includeVipOnly: options.includeVipOnly
        })
        return allPhotos.length
      },
      '获取写真总数'
    )
  }
}
