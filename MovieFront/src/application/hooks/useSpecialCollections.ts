/**
 * @fileoverview 专题合集数据获取Hook
 * @description 专题合集数据获取的标准化Hook实现，遵循DDD架构原则，
 *              通过应用服务层获取数据，提供统一的数据获取接口和状态管理，
 *              支持分页、筛选、排序等功能，确保数据流的一致性和可维护性
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
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
  isPageChanging: boolean // 页面切换状态标志
}

// 专题合集Hook操作接口，定义Hook返回的操作方法
export interface UseSpecialCollectionsActions {
  refresh: () => Promise<void> // 刷新数据
  loadMore: () => Promise<void> // 加载更多数据
  updateOptions: (newOptions: Partial<SpecialCollectionQueryOptions>) => void // 更新查询选项
}

// 专题合集Hook返回值接口，组合状态和操作
export interface UseSpecialCollectionsReturn extends UseSpecialCollectionsState, UseSpecialCollectionsActions { }

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
  const [loading, setLoading] = useState<boolean>(autoLoad) // 如果自动加载，初始状态为 loading
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(initialPage)
  const [isPageChanging, setIsPageChanging] = useState<boolean>(autoLoad) // 如果自动加载，初始状态为页面切换中
  const [queryOptions, setQueryOptions] = useState<SpecialCollectionQueryOptions>({
    page: initialPage,
    pageSize,
    category,
    sortBy,
    includeVipOnly
  })

  // 使用 useRef 存储稳定的查询参数引用，避免触发不必要的 useEffect
  const queryOptionsRef = useRef<SpecialCollectionQueryOptions>(queryOptions)

  // 请求取消控制器，用于取消过时的请求
  const abortControllerRef = useRef<AbortController | null>(null)

  // 计算是否还有更多数据
  const hasMore = useMemo(() => {
    return collections.length < total && collections.length > 0
  }, [collections.length, total])

  /**
   * 获取专题合集数据（重构版本）
   * 
   * 支持请求取消和状态管理，防止竞态条件
   * 
   * @param fetchOptions 查询选项
   * @param append 是否追加到现有数据（用于分页加载）
   */
  const fetchCollectionsWithOptions = useCallback(async (
    fetchOptions: SpecialCollectionQueryOptions,
    append: boolean = false
  ) => {
    try {
      // 创建新的 AbortController 并存储到 ref
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      // 在数据加载前设置 loading=true、error=null 和 isPageChanging=true（如果不是追加模式）
      setLoading(true)
      setError(null)
      if (!append) {
        setIsPageChanging(true)
        setCollections([]) // 清空现有数据，确保骨架屏显示
      }

      console.log('🎬 [useSpecialCollections] 开始获取专题合集数据', {
        fetchOptions,
        append,
        isPageChanging: !append
      })

      // 记录开始时间，确保骨架屏至少显示 500ms
      const startTime = Date.now()
      const minLoadingTime = 500 // 最小加载时间（毫秒）

      // 通过应用服务获取数据
      // 注意：当前 applicationService 可能不支持 signal，这里为未来扩展预留
      const fetchedCollections = await applicationService.getSpecialCollections(fetchOptions)

      // 计算已经过去的时间
      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime)

      // 如果加载太快，等待剩余时间以确保骨架屏可见
      if (remainingTime > 0) {
        console.log(`🎬 [useSpecialCollections] 等待 ${remainingTime}ms 以确保骨架屏可见`)
        await new Promise(resolve => setTimeout(resolve, remainingTime))
      }

      // 检查请求是否被取消，如果是则提前返回
      if (abortController.signal.aborted) {
        console.log('🎬 [useSpecialCollections] 请求已取消')
        return
      }

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

      // 数据加载成功后更新 collections 和 currentPage
      if (append) {
        setCollections(prev => [...prev, ...optimizedCollections])
      } else {
        setCollections(optimizedCollections)
      }

      // 更新当前页码
      if (fetchOptions.page) {
        setCurrentPage(fetchOptions.page)
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
        currentPage: fetchOptions.page
      })

    } catch (err) {
      // 捕获 AbortError 并忽略，其他错误正常处理
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('🎬 [useSpecialCollections] 请求被取消')
        return
      }

      const errorMessage = err instanceof Error ? err.message : '获取专题合集数据失败'
      setError(errorMessage)
      console.error('🎬 [useSpecialCollections] 数据获取失败', err)
    } finally {
      // 在 finally 块中设置 loading=false 和 isPageChanging=false
      setLoading(false)
      setIsPageChanging(false)
      abortControllerRef.current = null
    }
  }, [applicationService, getCollectionCover, enableImageOptimization, total])

  /**
   * 刷新数据 - 重新加载第一页数据
   */
  const refresh = useCallback(async () => {
    const refreshOptions = { ...queryOptionsRef.current, page: 1 }
    setCurrentPage(1)
    setCollections([]) // 清空现有数据
    setTotal(0)
    await fetchCollectionsWithOptions(refreshOptions, false)
  }, [fetchCollectionsWithOptions])

  /**
   * 加载更多数据 - 加载下一页数据
   */
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) {
      console.log('🎬 [useSpecialCollections] 跳过加载更多', { loading, hasMore })
      return
    }

    const nextPage = currentPage + 1
    const loadMoreOptions = { ...queryOptionsRef.current, page: nextPage }
    setCurrentPage(nextPage)
    await fetchCollectionsWithOptions(loadMoreOptions, true)
  }, [loading, hasMore, currentPage, fetchCollectionsWithOptions])

  /**
   * 更新查询选项 - 更新筛选、排序等参数并重新加载数据
   */
  const updateOptions = useCallback((newOptions: Partial<SpecialCollectionQueryOptions>) => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      console.log('🎬 [useSpecialCollections] 取消之前的请求')
    }

    const updatedOptions = { ...queryOptionsRef.current, ...newOptions }

    // 检测是否是页面切换操作（page 参数变化）
    const isPageChange = newOptions.page !== undefined &&
      newOptions.page !== queryOptionsRef.current.page

    if (isPageChange) {
      // 页面切换：更新页码（数据清空由 fetchCollectionsWithOptions 处理）
      console.log('🎬 [useSpecialCollections] 页面切换', {
        oldPage: queryOptionsRef.current.page,
        newPage: newOptions.page
      })
      if (newOptions.page !== undefined) {
        setCurrentPage(newOptions.page)
      }
    } else if (newOptions.category !== undefined ||
      newOptions.sortBy !== undefined ||
      newOptions.includeVipOnly !== undefined) {
      // 筛选/排序变化：重置页码和总数（数据清空由 fetchCollectionsWithOptions 处理）
      console.log('🎬 [useSpecialCollections] 筛选/排序变化', {
        category: newOptions.category,
        sortBy: newOptions.sortBy,
        includeVipOnly: newOptions.includeVipOnly
      })
      updatedOptions.page = 1
      setCurrentPage(1)
      setTotal(0)
    }

    // 更新 queryOptionsRef.current 而不是触发 state 更新
    queryOptionsRef.current = updatedOptions

    console.log('🎬 [useSpecialCollections] 更新查询选项', {
      oldOptions: queryOptionsRef.current,
      newOptions,
      updatedOptions
    })

    // 手动调用 fetchCollectionsWithOptions 触发数据加载
    fetchCollectionsWithOptions(updatedOptions, false)
  }, [fetchCollectionsWithOptions])

  // 自动加载数据 - 只在组件挂载时执行一次初始加载
  useEffect(() => {
    if (autoLoad) {
      fetchCollectionsWithOptions(queryOptionsRef.current, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 返回Hook状态和操作方法
  return {
    // 状态
    collections,
    loading,
    error,
    total,
    hasMore,
    isPageChanging,
    // 操作方法
    refresh,
    loadMore,
    updateOptions
  }
}