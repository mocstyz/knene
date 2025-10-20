/**
 * @fileoverview 图片显示层组件
 * @description 提供统一的图片显示逻辑，遵循DRY原则。
 * 支持多种图片加载状态、错误处理和样式变体，可在各种卡片组件中复用。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Icon } from '@components/atoms'
import { cn } from '@utils/cn'
import React, { useState } from 'react'

/**
 * 图片显示层组件属性接口
 */
export interface ImageLayerProps {
  /** 图片URL */
  src: string
  /** 图片alt文本 */
  alt: string
  /** 自定义CSS类名 */
  className?: string
  /** 宽高比 */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | 'custom'
  /** 对象适配方式 */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  /** 是否支持悬停缩放 */
  hoverScale?: boolean
  /** 缩放比例，默认1.05 */
  scaleRatio?: number
  /** 是否启用边缘优化 */
  enableEdgeOptimization?: boolean
  /** 错误占位符类型 */
  fallbackType?: 'icon' | 'gradient' | 'solid'
  /** 错误占位符颜色 */
  fallbackColor?: string
  /** 图片加载成功回调 */
  onLoad?: () => void
  /** 图片加载失败回调 */
  onError?: () => void
  /** 自定义错误占位符 */
  customFallback?: React.ReactNode
}

/**
 * 图片显示层组件
 *
 * 提供统一的图片显示功能，支持加载状态、错误处理和多种样式变体。
 */
const ImageLayer: React.FC<ImageLayerProps> = ({
  src,
  alt,
  className,
  aspectRatio = 'portrait',
  objectFit = 'cover',
  hoverScale = true,
  scaleRatio = 1.05,
  enableEdgeOptimization = true,
  fallbackType = 'icon',
  fallbackColor = 'bg-gray-200',
  onLoad,
  onError,
  customFallback,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // 宽高比样式映射
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[2/3]',
    landscape: 'aspect-[16/9]',
    custom: '',
  }

  // 对象适配样式
  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  }

  // 悬停缩放效果 - 动态缩放比例避免边缘溢出
  const scaleClass = scaleRatio !== 1.05 ? `group-hover:scale-[${scaleRatio}]` : 'group-hover:scale-105'
  const hoverClasses = hoverScale
    ? `transition-transform duration-300 ${scaleClass} will-change-transform`
    : ''

  // 图片加载状态样式
  const imageClasses = cn(
    'h-full w-full',
    aspectRatioClasses[aspectRatio],
    objectFitClasses[objectFit],
    hoverClasses,
    imageLoaded ? 'opacity-100' : 'opacity-0',
    'transition-opacity duration-200',
    // 添加抗锯齿和边缘优化
    enableEdgeOptimization ? 'antialiased backface-hidden' : '',
    className
  )

  // 错误占位符样式
  const fallbackClasses = cn(
    'flex h-full w-full items-center justify-center',
    aspectRatioClasses[aspectRatio],
    fallbackColor,
    className
  )

  // 处理图片加载成功
  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
    onLoad?.()
  }

  // 处理图片加载失败
  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(false)
    onError?.()
  }

  // 渲染错误占位符
  const renderFallback = () => {
    if (customFallback) {
      return customFallback
    }

    switch (fallbackType) {
      case 'icon':
        return (
          <div className={fallbackClasses}>
            <Icon name="film" size="xl" className="text-gray-400" />
          </div>
        )
      case 'gradient':
        return (
          <div
            className={cn(
              fallbackClasses,
              'bg-gradient-to-br from-gray-200 to-gray-300'
            )}
          >
            <Icon name="image" size="xl" className="text-gray-400" />
          </div>
        )
      case 'solid':
        return (
          <div className={fallbackClasses}>
            <span className="text-sm text-gray-400">暂无图片</span>
          </div>
        )
      default:
        return (
          <div className={fallbackClasses}>
            <Icon name="film" size="xl" className="text-gray-400" />
          </div>
        )
    }
  }

  return (
    <>
      {!imageError && (
        <img
          src={src}
          alt={alt}
          className={imageClasses}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
      {imageError && renderFallback()}
    </>
  )
}

export default ImageLayer
