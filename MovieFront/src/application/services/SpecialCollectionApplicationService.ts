/**
 * @fileoverview 专题合集应用服务
 * @description 专题合集业务逻辑的应用服务层实现，负责协调专题合集相关的业务用例，
 *              遵循DDD分层架构原则，提供统一的数据获取和业务逻辑处理接口，
 *              支持Mock数据和真实API的无缝切换
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { BaseApplicationService } from '@application/services/BaseApplicationService'
import type { CollectionItem } from '@types-movie'

// 专题合集查询参数接口，定义获取专题合集时的筛选和分页选项
export interface SpecialCollectionQueryOptions {
  page?: number // 页码，从1开始
  pageSize?: number // 每页数量
  category?: string // 分类筛选
  sortBy?: 'latest' | 'popular' | 'rating' // 排序方式
  includeVipOnly?: boolean // 是否包含VIP专属内容
}

// 专题合集分页响应接口，定义分页数据的返回格式
export interface SpecialCollectionPageResponse {
  items: CollectionItem[] // 合集列表数据
  total: number // 总数量
  page: number // 当前页码
  pageSize: number // 每页数量
  totalPages: number // 总页数
}

/**
 * 专题合集应用服务类
 * 
 * 负责专题合集相关的业务逻辑协调，包括：
 * - 专题合集列表获取
 * - 分页和筛选处理
 * - 数据转换和格式化
 * - Mock数据与真实API的统一接口
 * 
 * 遵循DDD应用服务层职责：
 * - 协调领域服务和基础设施服务
 * - 处理应用级别的业务流程
 * - 提供统一的对外接口
 */
export class SpecialCollectionApplicationService extends BaseApplicationService {
  
  /**
   * 获取专题合集列表
   * 
   * @param options 查询选项，包括分页、筛选、排序等参数
   * @returns Promise<CollectionItem[]> 专题合集列表
   * 
   * @example
   * ```typescript
   * const service = new SpecialCollectionApplicationService()
   * const collections = await service.getSpecialCollections({
   *   page: 1,
   *   pageSize: 12,
   *   category: '热门',
   *   sortBy: 'latest'
   * })
   * ```
   */
  async getSpecialCollections(options: SpecialCollectionQueryOptions = {}): Promise<CollectionItem[]> {
    const { page = 1, pageSize = 12, category, sortBy = 'latest', includeVipOnly = false } = options
    
    return this.fetchWithFallback(
      // 真实API调用（待后端实现）
      async () => {
        // TODO: 实现真实API调用
        // return await this.collectionRepository.getSpecialCollections(options)
        throw new Error('真实API尚未实现')
      },
      // Mock数据回退机制
      () => {
        console.log('🎬 [SpecialCollectionApplicationService] 使用Mock数据获取专题合集', {
          page,
          pageSize,
          category,
          sortBy,
          includeVipOnly
        })
        
        // 使用MockDataService的扩展方法获取专题合集数据
        const mockCollections = this.mockDataService.getExtendedMockCollections({
          count: pageSize * 10, // 生成足够的数据用于分页和筛选
          category,
          includeVipOnly
        })
        
        // 排序处理
        let sortedCollections = [...mockCollections]
        switch (sortBy) {
          case 'popular':
            // 按下载量排序（模拟热门度）
            sortedCollections.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
            break
          case 'rating':
            // 按评分排序
            sortedCollections.sort((a, b) => {
              const ratingA = a.rating ? parseFloat(a.rating) : 0
              const ratingB = b.rating ? parseFloat(b.rating) : 0
              return ratingB - ratingA
            })
            break
          case 'latest':
          default:
            // 按发布时间排序（最新优先）
            sortedCollections.sort((a, b) => {
              const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0
              const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0
              return dateB - dateA
            })
            break
        }
        
        // 分页处理
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        const paginatedCollections = sortedCollections.slice(startIndex, endIndex)
        
        console.log('🎬 [SpecialCollectionApplicationService] Mock数据处理完成', {
          totalGenerated: mockCollections.length,
          afterSorting: sortedCollections.length,
          afterPagination: paginatedCollections.length,
          startIndex,
          endIndex
        })
        
        return paginatedCollections
      },
      `获取专题合集列表[页码:${page}, 每页:${pageSize}]`
    )
  }
  
  /**
   * 获取专题合集分页数据
   * 
   * @param options 查询选项
   * @returns Promise<SpecialCollectionPageResponse> 包含分页信息的响应数据
   * 
   * @example
   * ```typescript
   * const service = new SpecialCollectionApplicationService()
   * const response = await service.getSpecialCollectionsWithPagination({
   *   page: 1,
   *   pageSize: 12
   * })
   * console.log(`共${response.total}个合集，当前第${response.page}页`)
   * ```
   */
  async getSpecialCollectionsWithPagination(options: SpecialCollectionQueryOptions = {}): Promise<SpecialCollectionPageResponse> {
    const { page = 1, pageSize = 12 } = options
    
    return this.fetchWithFallback(
      // 真实API调用（待后端实现）
      async () => {
        // TODO: 实现真实API调用
        throw new Error('真实API尚未实现')
      },
      // Mock数据回退机制
      () => {
        // 获取总数据用于计算分页信息
        const allCollections = this.mockDataService.getExtendedMockCollections({
          count: 120, // 模拟总共120个专题合集
          category: options.category,
          includeVipOnly: options.includeVipOnly
        })
        
        // 获取当前页数据
        const items = this.mockDataService.getExtendedMockCollections({
          count: pageSize * 10, // 生成足够数据用于分页
          category: options.category,
          includeVipOnly: options.includeVipOnly
        }).slice((page - 1) * pageSize, page * pageSize)
        
        const total = allCollections.length
        const totalPages = Math.ceil(total / pageSize)
        
        return {
          items,
          total,
          page,
          pageSize,
          totalPages
        }
      },
      `获取专题合集分页数据[页码:${page}, 每页:${pageSize}]`
    )
  }
  
  /**
   * 获取专题合集总数
   * 
   * @param options 筛选选项
   * @returns Promise<number> 合集总数
   */
  async getSpecialCollectionsCount(options: Omit<SpecialCollectionQueryOptions, 'page' | 'pageSize'> = {}): Promise<number> {
    return this.fetchWithFallback(
      // 真实API调用（待后端实现）
      async () => {
        throw new Error('真实API尚未实现')
      },
      // Mock数据回退机制
      () => {
        const allCollections = this.mockDataService.getExtendedMockCollections({
          count: 120, // 模拟总数
          category: options.category,
          includeVipOnly: options.includeVipOnly
        })
        return allCollections.length
      },
      '获取专题合集总数'
    )
  }
}