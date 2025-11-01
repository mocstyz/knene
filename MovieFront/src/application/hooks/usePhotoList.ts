/**
 * @fileoverview 写真列表数据获取Hook
 * @description 写真列表数据获取的标准化Hook实现，支持分页、筛选、排序、图片优化等功能
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { PhotoApplicationService, type PhotoQueryOptions } from '@application/services/PhotoApplicationService'
import { useImageService } from '@presentation/hooks/image'
import type { PhotoItem } from '@types-movie'

// 写真列表Hook状态接口
export interface UsePhotoListState {
    photos: PhotoItem[]
    loading: boolean
    error: string | null
    total: number
    hasMore: boolean
    isPageChanging: boolean
}

// 写真列表Hook操作接口
export interface UsePhotoListActions {
    refresh: () => Promise<void>
    loadMore: () => Promise<void>
    updateOptions: (newOptions: Partial<PhotoQueryOptions>) => void
}

// 写真列表Hook返回值接口
export interface UsePhotoListReturn extends UsePhotoListState, UsePhotoListActions { }

// 写真列表Hook选项接口
export interface UsePhotoListOptions extends PhotoQueryOptions {
    autoLoad?: boolean
    enableImageOptimization?: boolean
}

// 写真列表数据获取Hook，提供完整的数据管理和状态控制
export const usePhotoList = (options: UsePhotoListOptions = {}): UsePhotoListReturn => {
    const {
        page: initialPage = 1,
        pageSize = 12,
        category,
        sortBy = 'latest',
        includeVipOnly = false,
        autoLoad = true,
        enableImageOptimization = true
    } = options

    // 应用服务实例
    const applicationService = useMemo(() => new PhotoApplicationService(), [])

    // 图片服务Hook
    const { getOptimizedUrl } = useImageService()

    // Hook状态管理
    const [photos, setPhotos] = useState<PhotoItem[]>([])
    const [loading, setLoading] = useState<boolean>(autoLoad)
    const [error, setError] = useState<string | null>(null)
    const [total, setTotal] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(initialPage)
    const [isPageChanging, setIsPageChanging] = useState<boolean>(autoLoad)
    const [queryOptions, setQueryOptions] = useState<PhotoQueryOptions>({
        page: initialPage,
        pageSize,
        category,
        sortBy,
        includeVipOnly
    })

    // 使用 useRef 存储稳定的查询参数引用
    const queryOptionsRef = useRef<PhotoQueryOptions>(queryOptions)

    // 请求取消控制器
    const abortControllerRef = useRef<AbortController | null>(null)

    // 计算是否还有更多数据
    const hasMore = useMemo(() => {
        return photos.length < total && photos.length > 0
    }, [photos.length, total])

    // 获取写真数据
    const fetchPhotosWithOptions = useCallback(async (
        fetchOptions: PhotoQueryOptions,
        append: boolean = false
    ) => {
        try {
            // 创建新的 AbortController
            const abortController = new AbortController()
            abortControllerRef.current = abortController

            setLoading(true)
            setError(null)
            if (!append) {
                setIsPageChanging(true)
                setPhotos([])
            }

            console.log('📸 [usePhotoList] 开始获取写真数据', {
                fetchOptions,
                append,
                isPageChanging: !append
            })

            // 记录开始时间，确保骨架屏至少显示 500ms
            const startTime = Date.now()
            const minLoadingTime = 500

            // 通过应用服务获取数据
            const fetchedPhotos = await applicationService.getPhotos(fetchOptions)

            // 计算已经过去的时间
            const elapsedTime = Date.now() - startTime
            const remainingTime = Math.max(0, minLoadingTime - elapsedTime)

            // 如果加载太快，等待剩余时间
            if (remainingTime > 0) {
                console.log(`📸 [usePhotoList] 等待 ${remainingTime}ms 以确保骨架屏可见`)
                await new Promise(resolve => setTimeout(resolve, remainingTime))
            }

            // 检查请求是否被取消
            if (abortController.signal.aborted) {
                console.log('📸 [usePhotoList] 请求已取消')
                return
            }

            // 图片优化处理
            const optimizedPhotos = enableImageOptimization
                ? fetchedPhotos.map(photo => {
                    // 如果图片URL已经是完整的HTTP(S) URL，则不进行优化
                    const isFullUrl = photo.imageUrl.startsWith('http://') || photo.imageUrl.startsWith('https://')
                    return {
                        ...photo,
                        imageUrl: isFullUrl ? photo.imageUrl : getOptimizedUrl(photo.imageUrl, {
                            width: 400,
                            height: 500,
                            quality: 85
                        })
                    }
                })
                : fetchedPhotos

            // 更新数据
            if (append) {
                setPhotos(prev => [...prev, ...optimizedPhotos])
            } else {
                setPhotos(optimizedPhotos)
            }

            // 更新当前页码
            if (fetchOptions.page) {
                setCurrentPage(fetchOptions.page)
            }

            // 获取总数
            if (!append || total === 0) {
                const totalCount = await applicationService.getPhotosCount({
                    category: fetchOptions.category,
                    includeVipOnly: fetchOptions.includeVipOnly
                })
                setTotal(totalCount)
            }

            console.log('📸 [usePhotoList] 数据获取成功', {
                fetchedCount: fetchedPhotos.length,
                optimizedCount: optimizedPhotos.length,
                currentPage: fetchOptions.page
            })

        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                console.log('📸 [usePhotoList] 请求被取消')
                return
            }

            const errorMessage = err instanceof Error ? err.message : '获取写真数据失败'
            setError(errorMessage)
            console.error('📸 [usePhotoList] 数据获取失败', err)
        } finally {
            setLoading(false)
            setIsPageChanging(false)
            abortControllerRef.current = null
        }
    }, [applicationService, getOptimizedUrl, enableImageOptimization, total])

    // 刷新数据
    const refresh = useCallback(async () => {
        const refreshOptions = { ...queryOptionsRef.current, page: 1 }
        setCurrentPage(1)
        setPhotos([])
        setTotal(0)
        await fetchPhotosWithOptions(refreshOptions, false)
    }, [fetchPhotosWithOptions])

    // 加载更多数据
    const loadMore = useCallback(async () => {
        if (loading || !hasMore) {
            console.log('📸 [usePhotoList] 跳过加载更多', { loading, hasMore })
            return
        }

        const nextPage = currentPage + 1
        const loadMoreOptions = { ...queryOptionsRef.current, page: nextPage }
        setCurrentPage(nextPage)
        await fetchPhotosWithOptions(loadMoreOptions, true)
    }, [loading, hasMore, currentPage, fetchPhotosWithOptions])

    // 更新查询选项
    const updateOptions = useCallback((newOptions: Partial<PhotoQueryOptions>) => {
        // 取消之前的请求
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            console.log('📸 [usePhotoList] 取消之前的请求')
        }

        const updatedOptions = { ...queryOptionsRef.current, ...newOptions }

        // 检测是否是页面切换操作
        const isPageChange = newOptions.page !== undefined &&
            newOptions.page !== queryOptionsRef.current.page

        if (isPageChange) {
            console.log('📸 [usePhotoList] 页面切换', {
                oldPage: queryOptionsRef.current.page,
                newPage: newOptions.page
            })
            if (newOptions.page !== undefined) {
                setCurrentPage(newOptions.page)
            }
        } else if (newOptions.category !== undefined ||
            newOptions.sortBy !== undefined ||
            newOptions.includeVipOnly !== undefined) {
            console.log('📸 [usePhotoList] 筛选/排序变化', {
                category: newOptions.category,
                sortBy: newOptions.sortBy,
                includeVipOnly: newOptions.includeVipOnly
            })
            updatedOptions.page = 1
            setCurrentPage(1)
            setTotal(0)
        }

        // 更新 queryOptionsRef.current
        queryOptionsRef.current = updatedOptions

        console.log('📸 [usePhotoList] 更新查询选项', {
            oldOptions: queryOptionsRef.current,
            newOptions,
            updatedOptions
        })

        // 手动调用 fetchPhotosWithOptions 触发数据加载
        fetchPhotosWithOptions(updatedOptions, false)
    }, [fetchPhotosWithOptions])

    // 自动加载数据
    useEffect(() => {
        if (autoLoad) {
            fetchPhotosWithOptions(queryOptionsRef.current, false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        // 状态
        photos,
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
