/**
 * @fileoverview 首页数据Hook
 * @description 使用DDD架构的应用服务层获取首页数据，支持后端API和Mock数据降级。
 * 集成配置化图片服务，所有图片都通过Picsum API获取，确保开发环境的稳定性。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { homeApplicationService } from '@application/services/HomeApplicationService'
import type {
  CollectionItem,
  PhotoItem,
  LatestItem,
  HotItem,
} from '@components/domains'
import { useImageService } from '@presentation/hooks/image'
import { useState, useEffect } from 'react'

/**
 * 首页数据Hook返回值
 */
export interface UseHomeDataReturn {
  /** 写真数据 */
  trendingMovies: PhotoItem[]
  /** 最新更新数据 */
  popularMovies: LatestItem[]
  /** 24小时热门数据 */
  newReleases: HotItem[]
  /** 影片合集数据 */
  collectionsData: CollectionItem[]
  /** 加载状态 */
  isLoading: boolean
  /** 错误信息 */
  error: string | null
  /** 重新加载数据 */
  refetch: () => Promise<void>
}

/**
 * 首页数据Hook
 *
 * 获取首页所需的各类数据，包括影片合集、写真、最新更新、24小时TOP等模块。
 * 支持加载状态、错误处理和数据重新获取功能。
 *
 * @returns 首页数据和操作方法
 */
export const useHomeData = (): UseHomeDataReturn => {
  const [trendingMovies, setTrendingMovies] = useState<PhotoItem[]>([])
  const [popularMovies, setPopularMovies] = useState<LatestItem[]>([])
  const [newReleases, setNewReleases] = useState<HotItem[]>([])
  const [collectionsData, setCollectionsData] = useState<CollectionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取图片服务
  const { getMoviePoster, getCollectionCover } = useImageService()

  /**
   * 优化图片URL - 为影片合集数据使用合适的图片尺寸
   */
  const optimizeCollectionImages = (
    collections: CollectionItem[]
  ): CollectionItem[] => {
    return collections.map(collection => ({
      ...collection,
      imageUrl: getCollectionCover(collection.imageUrl, {
        width: 600,
        height: 400,
      }),
    }))
  }

  /**
   * 优化图片URL - 为写真数据使用合适的图片尺寸
   */
  const optimizePhotoImages = (photos: PhotoItem[]): PhotoItem[] => {
    return photos.map(photo => ({
      ...photo,
      imageUrl: getMoviePoster(photo.imageUrl, { width: 400, height: 600 }),
    }))
  }

  /**
   * 优化图片URL - 为最新更新数据使用合适的图片尺寸
   */
  const optimizeLatestImages = (latest: LatestItem[]): LatestItem[] => {
    return latest.map(item => ({
      ...item,
      imageUrl: getMoviePoster(item.imageUrl, { width: 400, height: 600 }),
    }))
  }

  /**
   * 优化图片URL - 为热门数据使用合适的图片尺寸
   */
  const optimizeHotImages = (hotItems: HotItem[]): HotItem[] => {
    return hotItems.map(item => ({
      ...item,
      imageUrl: getMoviePoster(item.imageUrl, { width: 400, height: 600 }),
    }))
  }

  /**
   * 加载首页数据
   * Repository已返回正确的领域类型，只需进行图片优化
   */
  const loadHomeData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // 并行获取所有模块数据，Repository已返回具体的领域类型
      const [collections, photos, latestUpdates, hotDaily] = await Promise.all([
        homeApplicationService.getCollections(3),
        homeApplicationService.getPhotos(6),
        homeApplicationService.getLatestUpdates(6),
        homeApplicationService.getHotDaily(6),
      ])

      // 优化图片URL并更新状态
      setCollectionsData(optimizeCollectionImages(collections))
      setTrendingMovies(optimizePhotoImages(photos))
      setPopularMovies(optimizeLatestImages(latestUpdates))
      setNewReleases(optimizeHotImages(hotDaily))
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Failed to load home data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 重新加载数据
   */
  const refetch = async () => {
    await loadHomeData()
  }

  // 组件挂载时自动加载数据
  useEffect(() => {
    loadHomeData()
  }, [])

  return {
    trendingMovies,
    popularMovies,
    newReleases,
    collectionsData,
    isLoading,
    error,
    refetch,
  }
}
