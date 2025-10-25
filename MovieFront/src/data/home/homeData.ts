/**
 * @fileoverview 首页数据管理Hook
 * @description 使用DDD架构的应用服务层获取首页数据，包含影片合集、写真、最新更新、24小时热门等模块
 *              集成配置化图片服务，支持加载状态、错误处理和数据重新获取功能
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { homeApplicationService } from '@application/services/HomeApplicationService'
import type {
  PhotoItem,
  HotItem,
} from '@components/domains'
import { useImageService } from '@presentation/hooks/image'
import type { LatestItem, CollectionItem } from '@types-movie'
import { useState, useEffect } from 'react'

// 首页数据Hook返回值接口，包含所有首页模块的数据和状态管理
export interface UseHomeDataReturn {
  photos: PhotoItem[] // 写真数据
  latestUpdates: LatestItem[] // 最新更新数据
  hotDaily: HotItem[] // 24小时热门数据
  collections: CollectionItem[] // 影片合集数据（实际返回CollectionItem类型）
  isLoading: boolean // 加载状态
  error: string | null // 错误信息
  refetch: () => Promise<void> // 重新加载数据
}

// 首页数据管理Hook，提供首页各模块数据的统一获取、状态管理和图片优化功能
export const useHomeData = (): UseHomeDataReturn => {
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [latestUpdates, setLatestUpdates] = useState<LatestItem[]>([])
  const [hotDaily, setHotDaily] = useState<HotItem[]>([])
  const [collections, setCollections] = useState<CollectionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取图片服务实例
  const { getMoviePoster, getCollectionCover } = useImageService()

  // 优化影片合集图片URL - 使用合适的图片尺寸提升加载性能
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

  // 优化写真数据图片URL - 使用竖版尺寸适配写真内容展示
  const optimizePhotoImages = (photos: PhotoItem[]): PhotoItem[] => {
    return photos.map(photo => ({
      ...photo,
      imageUrl: getMoviePoster(photo.imageUrl, { width: 400, height: 600 }),
    }))
  }

  // 优化最新更新图片URL - 使用标准影片海报尺寸
  const optimizeLatestImages = (latest: LatestItem[]): LatestItem[] => {
    return latest.map(item => ({
      ...item,
      imageUrl: getMoviePoster(item.imageUrl, { width: 400, height: 600 }),
    }))
  }

  // 优化热门内容图片URL - 使用标准影片海报尺寸
  const optimizeHotImages = (hotItems: HotItem[]): HotItem[] => {
    return hotItems.map(item => ({
      ...item,
      imageUrl: getMoviePoster(item.imageUrl, { width: 400, height: 600 }),
    }))
  }

  // 加载首页数据 - 使用统一的getHomeData方法获取所有模块数据并进行图片优化处理
  const loadHomeData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // 使用统一的getHomeData方法获取所有模块数据
      const homeData = await homeApplicationService.getHomeData({
        collectionsLimit: 3,
        photosLimit: 6,
        latestLimit: 6,
        hotLimit: 6,
      })

      // 添加5秒延迟以便查看骨架屏效果
      await new Promise(resolve => setTimeout(resolve, 5000))

      // 数据优化和状态更新 - 根据不同模块特点进行图片尺寸优化
      setCollections(optimizeCollectionImages(homeData.collections))
      setPhotos(optimizePhotoImages(homeData.photos))
      setLatestUpdates(optimizeLatestImages(homeData.latestUpdates))
      setHotDaily(optimizeHotImages(homeData.hotDaily))
    } catch (err) {
      // 错误处理 - 提取错误信息并记录日志
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Failed to load home data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // 重新加载数据函数 - 提供手动刷新数据的能力
  const refetch = async () => {
    await loadHomeData()
  }

  // 组件挂载时自动加载数据 - 使用useEffect确保组件渲染后立即获取数据
  useEffect(() => {
    loadHomeData()
  }, [])

  return {
    photos,
    latestUpdates,
    hotDaily,
    collections,
    isLoading,
    error,
    refetch,
  }
}
