/**
 * @fileoverview 热门内容列表数据获取Hook
 * @description 热门内容列表数据获取的标准化Hook实现，支持分页、时间周期筛选、图片优化等功能，返回BaseContentItem格式的统一数据
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { homeApplicationService } from '@application/services/HomeApplicationService'
import { useImageService } from '@presentation/hooks/image'
import type { BaseContentItem } from '@components/domains/shared/content-renderers'
import { toUnifiedContentItem } from '@types-movie'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

// 热门内容列表查询选项接口
export interface HotListQueryOptions {
  page?: number
  pageSize?: number
  period?: '24hours' | '7days' | '30days'
}

// 热门内容列表Hook状态接口
export interface UseHotListState {
  items: BaseContentItem[]
  loading: boolean
  error: string | null
  total: number
  hasMore: boolean
  isPageChanging: boolean
}

// 热门内容列表Hook操作接口
export interface UseHotListActions {
  refresh: () => Promise<void>
  updateOptions: (newOptions: Partial<HotListQueryOptions>) => void
}

// 热门内容列表Hook返回值接口
export interface UseHotListReturn extends UseHotListState, UseHotListActions {}

// 热门内容列表Hook选项接口
export interface UseHotListOptions extends HotListQueryOptions {
  autoLoad?: boolean
  enableImageOptimization?: boolean
}

// 热门内容列表数据获取Hook，提供完整的数据管理和状态控制
export const useHotList = (options: UseHotListOptions = {}): UseHotListReturn => {
  const {
    page: initialPage = 1,
    pageSize = 12,
    period = '7days',
    autoLoad = true,
    enableImageOptimization = true
  } = options

  // 图片服务Hook
  const { getMoviePoster } = useImageService()

  // Hook状态管理
  const [items, setItems] = useState<BaseContentItem[]>([])
  const [loading, setLoading] = useState<boolean>(autoLoad)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(initialPage)
  const [isPageChanging, setIsPageChanging] = useState<boolean>(autoLoad)
  const [queryOptions, setQueryOptions] = useState<HotListQueryOptions>({
    page: initialPage,
    pageSize,
    period
  })

  // 使用 useRef 存储稳定的查询参数引用
  const queryOptionsRef = useRef<HotListQueryOptions>(queryOptions)

  // 请求取消控制器
  const abortControllerRef = useRef<AbortController | null>(null)

  // 计算是否还有更多数据
  const hasMore = useMemo(() => {
    return items.length < total && items.length > 0
  }, [items.length, total])

  // 获取热门内容数据
  const fetchHotItemsWithOptions = useCallback(async (
    fetchOptions: HotListQueryOptions
  ) => {
    try {
      // 创建新的 AbortController
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      setLoading(true)
      setError(null)
      setIsPageChanging(true)
      setItems([])

      console.log('🔥 [useHotList] 开始获取热门内容数据', {
        fetchOptions,
        isPageChanging: true
      })

      // 记录开始时间，确保骨架屏至少显示 5000ms
      const startTime = Date.now()
      const minLoadingTime = 5000

      // 通过应用服务获取数据
      // 注意：获取大量数据用于前端分页，实际应该由后端API支持分页参数
      const allHotItems = await homeApplicationService.getHotDaily(300)

      // 计算分页数据
      const startIndex = ((fetchOptions.page || 1) - 1) * (fetchOptions.pageSize || 12)
      const endIndex = startIndex + (fetchOptions.pageSize || 12)
      const paginatedData = allHotItems.slice(startIndex, endIndex)

      // 计算已经过去的时间
      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime)

      // 如果加载太快，等待剩余时间
      if (remainingTime > 0) {
        console.log(`🔥 [useHotList] 等待 ${remainingTime}ms 以确保骨架屏可见`)
        await new Promise(resolve => setTimeout(resolve, remainingTime))
      }

      // 检查请求是否被取消
      if (abortController.signal.aborted) {
        console.log('🔥 [useHotList] 请求已取消')
        return
      }

      // 转换为统一的BaseContentItem格式
      const unifiedItems = paginatedData.map(toUnifiedContentItem)

      // 图片优化处理
      const optimizedItems = enableImageOptimization
        ? unifiedItems.map(item => {
            const isFullUrl = item.imageUrl.startsWith('http://') || item.imageUrl.startsWith('https://')
            return {
              ...item,
              imageUrl: isFullUrl ? item.imageUrl : getMoviePoster(item.imageUrl, {
                width: 400,
                height: 600,
                quality: 85
              })
            }
          })
        : unifiedItems

      // 更新数据
      setItems(optimizedItems)

      // 更新当前页码
      if (fetchOptions.page) {
        setCurrentPage(fetchOptions.page)
      }

      // 设置总数
      setTotal(allHotItems.length)

      console.log('🔥 [useHotList] 数据获取成功', {
        fetchedCount: paginatedData.length,
        optimizedCount: optimizedItems.length,
        currentPage: fetchOptions.page,
        total: allHotItems.length,
        period: fetchOptions.period
      })

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('🔥 [useHotList] 请求被取消')
        return
      }

      const errorMessage = err instanceof Error ? err.message : '获取热门内容数据失败'
      setError(errorMessage)
      console.error('🔥 [useHotList] 数据获取失败', err)
    } finally {
      setLoading(false)
      setIsPageChanging(false)
      abortControllerRef.current = null
    }
  }, [getMoviePoster, enableImageOptimization])

  // 刷新数据
  const refresh = useCallback(async () => {
    const refreshOptions = { ...queryOptionsRef.current, page: 1 }
    setCurrentPage(1)
    setItems([])
    setTotal(0)
    await fetchHotItemsWithOptions(refreshOptions)
  }, [fetchHotItemsWithOptions])

  // 更新查询选项
  const updateOptions = useCallback((newOptions: Partial<HotListQueryOptions>) => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      console.log('🔥 [useHotList] 取消之前的请求')
    }

    const updatedOptions = { ...queryOptionsRef.current, ...newOptions }

    // 检测是否是页面切换操作
    const isPageChange = newOptions.page !== undefined &&
      newOptions.page !== queryOptionsRef.current.page

    if (isPageChange) {
      console.log('🔥 [useHotList] 页面切换', {
        oldPage: queryOptionsRef.current.page,
        newPage: newOptions.page
      })
      if (newOptions.page !== undefined) {
        setCurrentPage(newOptions.page)
      }
    } else if (newOptions.period !== undefined) {
      console.log('🔥 [useHotList] 时间周期变化', {
        period: newOptions.period
      })
      updatedOptions.page = 1
      setCurrentPage(1)
      setTotal(0)
    }

    // 更新 queryOptionsRef.current
    queryOptionsRef.current = updatedOptions

    console.log('🔥 [useHotList] 更新查询选项', {
      oldOptions: queryOptionsRef.current,
      newOptions,
      updatedOptions
    })

    // 手动调用 fetchHotItemsWithOptions 触发数据加载
    fetchHotItemsWithOptions(updatedOptions)
  }, [fetchHotItemsWithOptions])

  // 自动加载数据
  useEffect(() => {
    if (autoLoad) {
      fetchHotItemsWithOptions(queryOptionsRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    // 状态
    items,
    loading,
    error,
    total,
    hasMore,
    isPageChanging,
    // 操作方法
    refresh,
    updateOptions
  }
}
