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
  TopicItem,
  PhotoItem,
  LatestItem,
  TopItem,
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
  /** 24小时TOP数据 */
  newReleases: TopItem[]
  /** 专题数据 */
  topicsData: TopicItem[]
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
 * 获取首页所需的各类数据，包括专题、写真、最新更新、24小时TOP等模块。
 * 支持加载状态、错误处理和数据重新获取功能。
 *
 * @returns 首页数据和操作方法
 */
export const useHomeData = (): UseHomeDataReturn => {
  const [trendingMovies, setTrendingMovies] = useState<PhotoItem[]>([])
  const [popularMovies, setPopularMovies] = useState<LatestItem[]>([])
  const [newReleases, setNewReleases] = useState<TopItem[]>([])
  const [topicsData, setTopicsData] = useState<TopicItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取图片服务
  const { getMoviePoster, getTopicCover } = useImageService()

  /**
   * 优化图片URL - 为专题数据使用合适的图片尺寸
   */
  const optimizeTopicImages = (topics: TopicItem[]): TopicItem[] => {
    return topics.map(topic => ({
      ...topic,
      imageUrl: getTopicCover(topic.imageUrl, { width: 600, height: 400 }),
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
   * 优化图片URL - 为TOP数据使用合适的图片尺寸
   */
  const optimizeTopImages = (topItems: TopItem[]): TopItem[] => {
    return topItems.map(item => ({
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
      const [topics, photos, latestUpdates, topDaily] = await Promise.all([
        homeApplicationService.getTopics(3),
        homeApplicationService.getPhotos(6),
        homeApplicationService.getLatestUpdates(6),
        homeApplicationService.getTopDaily(6),
      ])

      // 优化图片URL并更新状态
      setTopicsData(optimizeTopicImages(topics))
      setTrendingMovies(optimizePhotoImages(photos))
      setPopularMovies(optimizeLatestImages(latestUpdates))
      setNewReleases(optimizeTopImages(topDaily))
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
    topicsData,
    isLoading,
    error,
    refetch,
  }
}
