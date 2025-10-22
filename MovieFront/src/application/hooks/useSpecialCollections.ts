/**
 * @fileoverview 专题合集数据获取Hook
 * @description 专题合集数据获取的标准化Hook实现，遵循DDD架构原则，
 *              通过应用服务层获取数据，提供统一的数据获取接口和状态管理，
 *              支持分页、筛选、排序等功能，确保数据流的一致性和可维护性
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { SpecialCollectionApplicationService, type SpecialCollectionQueryOptions } from '@application/services/SpecialCollectionApplicationService'
import { useImageService } from '@presentation/hooks/image'
import type { CollectionItem } from '@types-movie'

// 专题合集Hook状态接口，定义Hook返回的状态结构
export interface UseSpecialCollectionsState {
  collections: CollectionItem[] // 合集列表数据
  loading: boolean // 加载状态
  error: string | null // 错误信息
  total: number // 总数量
  hasMore: boolean // 是否还有更多数据
}

// 专题合集Hook操作接口，定义Hook返回的操作方法
export interface UseSpecialCollectionsActions {
  refresh: () => Promise<void> // 刷新数据
  loadMore: () => Promise<void> // 加载更多数据
  updateOptions: (newOptions: Partial<SpecialCollectionQueryOptions>) => void // 更新查询选项
}

// 专题合集Hook返回值接口，组合状态和操作
export interface UseSpecialCollectionsReturn extends UseSpecialCollectionsState, UseSpecialCollectionsActions {}

// 专题合集Hook选项接口，定义Hook的配置参数
export interface UseSpecialCollectionsOptions extends SpecialCollectionQueryOptions {
  autoLoad?: boolean // 是否自动加载数据，默认true
  enableImageOptimization?: boolean // 是否启用图片优化，默认true
}

/**
 * 专题合集数据获取Hook
 * 
 * 提供专题合集数据的获取、状态管理和操作方法，遵循以下设计原则：
 * - 通过应用服务层获取数据，不直接调用基础设施层
 * - 提供完整的加载状态和错误处理
 * - 支持分页、筛选、排序等查询功能
 * - 集成图片服务优化
 * - 提供刷新和加载更多等操作
 * 
 * @param options Hook配置选项
 * @returns UseSpecialCollectionsReturn Hook状态和操作方法
 * 
 * @example
 * ```typescript
 * // 基础用法
 * const { collections, loading, error, refresh } = useSpecialCollections()
 * 
 * // 带分页和筛选
 * const { collections, loading, loadMore, hasMore } = useSpecialCollections({
 *   pageSize: 12,
 *   category: '热门',
 *   sortBy: 'latest'
 * })
 * 
 * // 禁用自动加载
 * const { collections, loading, refresh } = useSpecialCollections({
 *   autoLoad: false
 * })
 * ```
 */
export const useSpecialCollections = (options: UseSpecialCollectionsOptions = {}): UseSpecialCollectionsReturn => {
  const {
    page: initialPage = 1,
    pageSize = 12,
    category,
    sortBy = 'latest',
    includeVipOnly = false,
    autoLoad = true,
    enableImageOptimization = true
  } = options

  // 应用服务实例 - 使用单例模式确保服务一致性
  const applicationService = useMemo(() => new SpecialCollectionApplicationService(), [])
  
  // 图片服务Hook - 用于图片URL优化
  const { getCollectionCover } = useImageService()

  // Hook状态管理
  const [collections, setCollections] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(initialPage)
  const [queryOptions, setQueryOptions] = useState<SpecialCollectionQueryOptions>({
    page: initialPage,
    pageSize,
    category,
    sortBy,
    includeVipOnly
  })

  // 计算是否还有更多数据
  const hasMore = useMemo(() => {
    return collections.length < total && collections.length > 0
  }, [collections.length, total])

  /**
   * 获取专题合集数据
   * 
   * @param options 查询选项
   * @param append 是否追加到现有数据（用于分页加载）
   */
  const fetchCollections = useCallback(async (
    fetchOptions: SpecialCollectionQueryOptions,
    append: boolean = false
  ) => {
    try {
      setLoading(true)
      setError(null)

      console.log('🎬 [useSpecialCollections] 开始获取专题合集数据', {
        fetchOptions,
        append,
        currentCollectionsCount: collections.length
      })

      // 通过应用服务获取数据
      const fetchedCollections = await applicationService.getSpecialCollections(fetchOptions)
      
      // 图片优化处理
      const optimizedCollections = enableImageOptimization 
        ? fetchedCollections.map(collection => ({
            ...collection,
            imageUrl: getCollectionCover(collection.imageUrl, { 
              width: 400, 
              height: 500,
              quality: 85
            })
          }))
        : fetchedCollections

      // 更新状态
      if (append) {
        setCollections(prev => [...prev, ...optimizedCollections])
      } else {
        setCollections(optimizedCollections)
      }

      // 获取总数（仅在首次加载时）
      if (!append || total === 0) {
        const totalCount = await applicationService.getSpecialCollectionsCount({
          category: fetchOptions.category,
          includeVipOnly: fetchOptions.includeVipOnly
        })
        setTotal(totalCount)
      }

      console.log('🎬 [useSpecialCollections] 数据获取成功', {
        fetchedCount: fetchedCollections.length,
        optimizedCount: optimizedCollections.length,
        totalCollections: append ? collections.length + optimizedCollections.length : optimizedCollections.length,
        totalCount: total
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取专题合集数据失败'
      setError(errorMessage)
      console.error('🎬 [useSpecialCollections] 数据获取失败', err)
    } finally {
      setLoading(false)
    }
  }, [applicationService, getCollectionCover, enableImageOptimization])

  /**
   * 刷新数据 - 重新加载第一页数据
   */
  const refresh = useCallback(async () => {
    const refreshOptions = { ...queryOptions, page: 1 }
    setCurrentPage(1)
    setCollections([]) // 清空现有数据
    setTotal(0)
    await fetchCollections(refreshOptions, false)
  }, [queryOptions, fetchCollections])

  /**
   * 加载更多数据 - 加载下一页数据
   */
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) {
      console.log('🎬 [useSpecialCollections] 跳过加载更多', { loading, hasMore })
      return
    }

    const nextPage = currentPage + 1
    const loadMoreOptions = { ...queryOptions, page: nextPage }
    setCurrentPage(nextPage)
    await fetchCollections(loadMoreOptions, true)
  }, [loading, hasMore, currentPage, queryOptions, fetchCollections])

  /**
   * 更新查询选项 - 更新筛选、排序等参数并重新加载数据
   */
  const updateOptions = useCallback((newOptions: Partial<SpecialCollectionQueryOptions>) => {
    const updatedOptions = { ...queryOptions, ...newOptions }
    setQueryOptions(updatedOptions)
    
    // 只有在非分页参数变化时才重置页码和数据
    if (newOptions.category !== undefined || newOptions.sortBy !== undefined || newOptions.includeVipOnly !== undefined) {
      setCurrentPage(1)
      setCollections([]) // 清空现有数据
      setTotal(0)
    } else if (newOptions.page !== undefined) {
      // 分页变化时只更新页码
      setCurrentPage(newOptions.page)
    }
    
    console.log('🎬 [useSpecialCollections] 更新查询选项', {
      oldOptions: queryOptions,
      newOptions,
      updatedOptions
    })
  }, [queryOptions])

  // 自动加载数据 - 当查询选项变化时自动重新加载
  useEffect(() => {
    if (autoLoad) {
      fetchCollections(queryOptions, false)
    }
  }, [queryOptions, fetchCollections, autoLoad])

  // 返回Hook状态和操作方法
  return {
    // 状态
    collections,
    loading,
    error,
    total,
    hasMore,
    // 操作方法
    refresh,
    loadMore,
    updateOptions
  }
}