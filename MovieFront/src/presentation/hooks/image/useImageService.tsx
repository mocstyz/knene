/**
 * @fileoverview 图片服务React Hook
 * @description 提供便捷的图片操作方法，封装图片服务的业务逻辑。
 * 支持电影海报、专题封面、用户头像等多种业务场景。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import {
  ImageServiceFactory,
  type ImageOptions,
} from '@infrastructure/services/image'
import { useMemo } from 'react'

/**
 * 图片服务Hook返回值
 */
export interface UseImageServiceReturn {
  /**
   * 获取电影海报URL
   * @param movieId 电影ID
   * @param options 图片选项
   * @returns 电影海报URL
   */
  getMoviePoster: (movieId: string, options?: ImageOptions) => string

  /**
   * 获取专题封面URL
   * @param topicId 专题ID
   * @param options 图片选项
   * @returns 专题封面URL
   */
  getTopicCover: (topicId: string, options?: ImageOptions) => string

  /**
   * 获取合集封面URL
   * @param collectionId 合集ID
   * @param options 图片选项
   * @returns 合集封面URL
   */
  getCollectionCover: (collectionId: string, options?: ImageOptions) => string

  /**
   * 获取用户头像URL
   * @param userId 用户ID
   * @param options 图片选项
   * @returns 用户头像URL
   */
  getUserAvatar: (userId: string, options?: ImageOptions) => string

  /**
   * 获取通用图片URL
   * @param seed 图片种子
   * @param options 图片选项
   * @returns 图片URL
   */
  getImageUrl: (seed: string, options?: ImageOptions) => string

  /**
   * 获取优化后的图片URL
   * @param seed 图片种子
   * @param options 图片选项
   * @returns 优化后的图片URL
   */
  getOptimizedUrl: (seed: string, options?: ImageOptions) => string

  /**
   * 获取占位符图片URL
   * @param width 宽度
   * @param height 高度
   * @returns 占位符图片URL
   */
  getPlaceholder: (width?: number, height?: number) => string

  /**
   * 生成响应式图片srcset
   * @param seed 图片种子
   * @param options 图片选项
   * @param sizes 断点配置
   * @returns srcset字符串
   */
  generateSrcSet: (
    seed: string,
    options?: ImageOptions,
    sizes?: number[]
  ) => string
}

/**
 * 图片服务Hook
 *
 * 提供便捷的图片操作方法，支持多种业务场景。
 */
export const useImageService = (): UseImageServiceReturn => {
  const imageService = useMemo(() => ImageServiceFactory.getInstance(), [])

  const getMoviePoster = (movieId: string, options?: ImageOptions): string => {
    // 如果传入的是完整的URL，直接返回
    if (movieId.startsWith('http://') || movieId.startsWith('https://')) {
      return movieId
    }

    // 电影海报默认配置
    const defaultOptions: ImageOptions = {
      width: 400,
      height: 600,
      quality: 85,
      format: 'auto',
      crop: 'cover',
    }

    const mergedOptions = { ...defaultOptions, ...options }
    return imageService.getOptimizedUrl(`movie-${movieId}`, mergedOptions)
  }

  const getTopicCover = (topicId: string, options?: ImageOptions): string => {
    // 如果传入的是完整的URL，直接返回
    if (topicId.startsWith('http://') || topicId.startsWith('https://')) {
      return topicId
    }

    // 专题封面默认配置
    const defaultOptions: ImageOptions = {
      width: 600,
      height: 400,
      quality: 80,
      format: 'auto',
      crop: 'cover',
    }

    const mergedOptions = { ...defaultOptions, ...options }
    return imageService.getOptimizedUrl(`topic-${topicId}`, mergedOptions)
  }

  const getCollectionCover = (
    collectionId: string,
    options?: ImageOptions
  ): string => {
    // 如果传入的是完整的URL，直接返回
    if (collectionId.startsWith('http://') || collectionId.startsWith('https://')) {
      return collectionId
    }

    // 合集封面默认配置
    const defaultOptions: ImageOptions = {
      width: 600,
      height: 400,
      quality: 80,
      format: 'auto',
      crop: 'cover',
    }

    const mergedOptions = { ...defaultOptions, ...options }
    return imageService.getOptimizedUrl(
      `collection-${collectionId}`,
      mergedOptions
    )
  }

  const getUserAvatar = (userId: string, options?: ImageOptions): string => {
    // 用户头像默认配置
    const defaultOptions: ImageOptions = {
      width: 200,
      height: 200,
      quality: 90,
      format: 'auto',
      crop: 'cover',
    }

    const mergedOptions = { ...defaultOptions, ...options }
    return imageService.getOptimizedUrl(`avatar-${userId}`, mergedOptions)
  }

  const getImageUrl = (seed: string, options?: ImageOptions): string => {
    return imageService.getUrl(seed, options)
  }

  const getOptimizedUrl = (seed: string, options?: ImageOptions): string => {
    return imageService.getOptimizedUrl(seed, options)
  }

  const getPlaceholder = (width?: number, height?: number): string => {
    return imageService.getPlaceholder(width, height)
  }

  const generateSrcSet = (
    seed: string,
    options?: ImageOptions,
    sizes?: number[]
  ): string => {
    return imageService.generateSrcSet(seed, options, sizes)
  }

  return {
    getMoviePoster,
    getTopicCover,
    getCollectionCover,
    getUserAvatar,
    getImageUrl,
    getOptimizedUrl,
    getPlaceholder,
    generateSrcSet,
  }
}

export default useImageService
