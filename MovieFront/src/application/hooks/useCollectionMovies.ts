/**
 * @fileoverview 合集影片数据获取Hook
 * @description 合集影片数据获取的标准化Hook实现，遵循DDD架构原则
 *              通过应用服务层获取数据，提供统一的数据获取接口和状态管理
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { CollectionMovieApplicationService, type CollectionMovieQueryOptions } from '../services/CollectionMovieApplicationService'
import { useImageService } from '@presentation/hooks/image'
import type { MovieDetail, CollectionItem } from '@types-movie'

// 合集影片Hook状态接口
export interface UseCollectionMoviesState {
  movies: MovieDetail[]
  collectionInfo: CollectionItem | null
  loading: boolean
  error: string | null
  total: number
  hasMore: boolean
  isPageChanging: boolean
}

// 合集影片Hook操作接口
export interface UseCollectionMoviesActions {
  refresh: () => Promise<void>
  loadMore: () => Promise<void>
  updateOptions: (newOptions: Partial<CollectionMovieQueryOptions>) => void
}

// 合集影片Hook返回值接口
export interface UseCollectionMoviesReturn extends UseCollectionMoviesState, UseCollectionMoviesActions { }

// 合集影片Hook选项接口
export interface UseCollectionMoviesOptions {
  collectionId: string
  page?: number
  pageSize?: number
  sortBy?: 'latest' | 'rating' | 'title' | 'top-rated'
  autoLoad?: boolean
  enableImageOptimization?: boolean
}

// 合集影片数据获取Hook
export const useCollectionMovies = (options: UseCollectionMoviesOptions): UseCollectionMoviesReturn => {
  const {
    collectionId,
    page: initialPage = 1,
    pageSize = 12,
    sortBy = 'latest',
    autoLoad = true,
    enableImageOptimization = true
  } = options

  const applicationService = useMemo(() => new CollectionMovieApplicationService(), [])
  const { getMoviePoster } = useImageService()

  const [movies, setMovies] = useState<MovieDetail[]>([])
  const [collectionInfo, setCollectionInfo] = useState<CollectionItem | null>(null)
  const [loading, setLoading] = useState<boolean>(autoLoad)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(initialPage)
  const [isPageChanging, setIsPageChanging] = useState<boolean>(autoLoad)
  const [queryOptions, setQueryOptions] = useState<CollectionMovieQueryOptions>({
    collectionId,
    page: initialPage,
    pageSize,
    sortBy
  })

  const queryOptionsRef = useRef<CollectionMovieQueryOptions>(queryOptions)
  const abortControllerRef = useRef<AbortController | null>(null)

  const hasMore = useMemo(() => {
    return movies.length < total && movies.length > 0
  }, [movies.length, total])

  // 获取合集影片数据
  const fetchMoviesWithOptions = useCallback(async (
    fetchOptions: CollectionMovieQueryOptions,
    append: boolean = false
  ) => {
    try {
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      setLoading(true)
      setError(null)
      if (!append) {
        setIsPageChanging(true)
        setMovies([])
      }

      console.log('🎬 [useCollectionMovies] 开始获取合集影片数据', {
        fetchOptions,
        append,
        isPageChanging: !append
      })

      const startTime = Date.now()
      const minLoadingTime = 5000

      const result = await applicationService.getCollectionMovies(fetchOptions)

      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime)

      if (remainingTime > 0) {
        console.log(`🎬 [useCollectionMovies] 等待 ${remainingTime}ms 以确保骨架屏可见`)
        await new Promise(resolve => setTimeout(resolve, remainingTime))
      }

      if (abortController.signal.aborted) {
        console.log('🎬 [useCollectionMovies] 请求已取消')
        return
      }

      const optimizedMovies = enableImageOptimization
        ? result.movies.map((movie: MovieDetail) => ({
          ...movie,
          imageUrl: getMoviePoster(movie.imageUrl, {
            width: 400,
            height: 600,
            quality: 85
          })
        }))
        : result.movies

      if (append) {
        setMovies(prev => [...prev, ...optimizedMovies])
      } else {
        setMovies(optimizedMovies)
      }

      if (fetchOptions.page) {
        setCurrentPage(fetchOptions.page)
      }

      if (!append || total === 0) {
        setTotal(result.total)
      }

      if (!collectionInfo && result.collectionInfo) {
        setCollectionInfo(result.collectionInfo)
      }

      console.log('🎬 [useCollectionMovies] 数据获取成功', {
        fetchedCount: result.movies.length,
        optimizedCount: optimizedMovies.length,
        currentPage: fetchOptions.page
      })

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('🎬 [useCollectionMovies] 请求被取消')
        return
      }

      const errorMessage = err instanceof Error ? err.message : '获取合集影片数据失败'
      setError(errorMessage)
      console.error('🎬 [useCollectionMovies] 数据获取失败', err)
    } finally {
      setLoading(false)
      setIsPageChanging(false)
      abortControllerRef.current = null
    }
  }, [applicationService, getMoviePoster, enableImageOptimization, total, collectionInfo])

  // 刷新数据
  const refresh = useCallback(async () => {
    const refreshOptions = { ...queryOptionsRef.current, page: 1 }
    setCurrentPage(1)
    setMovies([])
    setTotal(0)
    await fetchMoviesWithOptions(refreshOptions, false)
  }, [fetchMoviesWithOptions])

  // 加载更多数据
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) {
      console.log('🎬 [useCollectionMovies] 跳过加载更多', { loading, hasMore })
      return
    }

    const nextPage = currentPage + 1
    const loadMoreOptions = { ...queryOptionsRef.current, page: nextPage }
    setCurrentPage(nextPage)
    await fetchMoviesWithOptions(loadMoreOptions, true)
  }, [loading, hasMore, currentPage, fetchMoviesWithOptions])

  // 更新查询选项
  const updateOptions = useCallback((newOptions: Partial<CollectionMovieQueryOptions>) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      console.log('🎬 [useCollectionMovies] 取消之前的请求')
    }

    const updatedOptions = { ...queryOptionsRef.current, ...newOptions }

    const isPageChange = newOptions.page !== undefined &&
      newOptions.page !== queryOptionsRef.current.page

    if (isPageChange) {
      console.log('🎬 [useCollectionMovies] 页面切换', {
        oldPage: queryOptionsRef.current.page,
        newPage: newOptions.page
      })
      if (newOptions.page !== undefined) {
        setCurrentPage(newOptions.page)
      }
    } else if (newOptions.sortBy !== undefined) {
      console.log('🎬 [useCollectionMovies] 排序变化', {
        sortBy: newOptions.sortBy
      })
      updatedOptions.page = 1
      setCurrentPage(1)
      setTotal(0)
    }

    queryOptionsRef.current = updatedOptions

    console.log('🎬 [useCollectionMovies] 更新查询选项', {
      oldOptions: queryOptionsRef.current,
      newOptions,
      updatedOptions
    })

    fetchMoviesWithOptions(updatedOptions, false)
  }, [fetchMoviesWithOptions])

  // 自动加载数据
  useEffect(() => {
    if (autoLoad && collectionId) {
      fetchMoviesWithOptions(queryOptionsRef.current, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    movies,
    collectionInfo,
    loading,
    error,
    total,
    hasMore,
    isPageChanging,
    refresh,
    loadMore,
    updateOptions
  }
}
