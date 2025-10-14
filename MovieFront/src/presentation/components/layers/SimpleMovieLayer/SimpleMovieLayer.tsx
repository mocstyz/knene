/**
 * @fileoverview 简化电影层组件
 * @description 提供简化版的电影展示逻辑，遵循组合式架构原则。
 * 专为SimpleMovieCard设计，包含基本的图片、标题、评分和VIP标识。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import {
  ImageLayer,
  NewBadgeLayer,
  QualityBadgeLayer,
  RatingBadgeLayer,
  TitleLayer,
  VipBadgeLayer,
} from '@components/layers'
import { getOverlayGradient } from '@tokens/design-system'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 简化电影层组件属性接口
 */
export interface SimpleMovieLayerProps {
  /** 电影数据 */
  movie: {
    title: string
    type: 'Movie' | 'TV Show'
    rating: string
    poster: string
    alt?: string
  }
  /** 自定义CSS类名 */
  className?: string
  /** 评分颜色 */
  ratingColor?: 'purple' | 'red' | 'white' | 'default'
  /** 是否显示VIP标签 */
  showVipBadge?: boolean
  /** 是否显示评分标签 */
  showRatingBadge?: boolean
  /** 是否显示质量标签 */
  showQualityBadge?: boolean
  /** 质量标签文本 */
  qualityText?: string
  /** 是否显示新片标签 */
  showNewBadge?: boolean
  /** 新片类型 */
  newBadgeType?: 'new' | 'update' | 'today' | 'latest'
  /** 是否支持图片悬停效果 */
  imageHoverEffect?: boolean
  /** 标题hover效果配置 */
  titleHoverEffect?: {
    /** 是否启用hover效果 */
    enabled?: boolean
    /** hover时的颜色 */
    hoverColor?: 'red' | 'primary' | 'blue' | 'green'
    /** 过渡动画时长 */
    transitionDuration?: string
  }
  /** 副标题hover效果配置 */
  subtitleHoverEffect?: {
    /** 是否启用hover效果 */
    enabled?: boolean
    /** hover时的颜色 */
    hoverColor?: 'red' | 'primary' | 'blue' | 'green'
    /** 过渡动画时长 */
    transitionDuration?: string
  }
}

/**
 * 简化电影层组件
 *
 * 提供简化版的电影展示功能，组合多个Layer组件。
 */
const SimpleMovieLayer: React.FC<SimpleMovieLayerProps> = ({
  movie,
  className,
  ratingColor = 'purple',
  showVipBadge = true,
  showRatingBadge = true,
  showQualityBadge = true,
  qualityText,
  showNewBadge = false,
  newBadgeType = 'new',
  imageHoverEffect = true,
  titleHoverEffect = { enabled: true, hoverColor: 'red', transitionDuration: '200ms' },
  subtitleHoverEffect = { enabled: true, hoverColor: 'red', transitionDuration: '200ms' },
}) => {
  // 评分颜色映射 - 使用组件变体Token系统
  const getRatingTextColor = () => {
    switch (ratingColor) {
      case 'red':
        return 'red'
      case 'white':
        return 'white'
      case 'purple':
        return 'purple'
      default:
        return 'default'
    }
  }

  return (
    <div className={`group space-y-3 ${className}`}>
      {/* 图片卡片区域 - 独立的阴影卡片 */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md">
        <ImageLayer
          src={movie.poster}
          alt={movie.alt || `${movie.title} ${movie.type} poster`}
          aspectRatio="custom"
          objectFit="cover"
          hoverScale={imageHoverEffect}
          fallbackType="gradient"
        />

        {/* 底部渐变遮罩 - 使用统一的渐变Token系统 */}
        <div className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-1/3',
          getOverlayGradient('medium') // 对应原来的 from-black/50 via-black/20 to-transparent
        )} />

        {/* 顶部标签层 */}
        <div className="absolute left-2 right-2 top-2 z-10 flex justify-between">
          {/* New badge - top-left */}
          {showNewBadge && (
            <NewBadgeLayer
              isNew={true}
              newType={newBadgeType}
              position="top-left"
              size="responsive"
              variant="default"
              animated={false}
            />
          )}
          {/* Quality badge - top-right */}
          {showQualityBadge && qualityText && (
            <QualityBadgeLayer
              quality={qualityText}
              position="top-right"
              displayType="layer"
              variant="default"
            />
          )}
        </div>

        {/* 底部标签层 */}
        <div className="absolute bottom-2 left-2 right-2 z-10 flex justify-between">
          {showRatingBadge && (
            <RatingBadgeLayer
              rating={movie.rating}
              position="bottom-left"
              variant="compact"
              showIcon={false}
              textColor={getRatingTextColor() as any}
            />
          )}
          {showVipBadge && (
            <VipBadgeLayer
              isVip={true}
              position="bottom-right"
              variant="compact"
              text="VIP"
            />
          )}
        </div>
      </div>

      {/* 信息区域 - 独立容器，无阴影 */}
      <div className="space-y-1">
        {/* 标题 */}
        <TitleLayer
          title={movie.title}
          variant="primary"
          size="sm"
          maxLines={1}
          color="primary"
          weight="semibold"
          hoverEffect={titleHoverEffect}
        />

        {/* 类型 */}
        <p className={cn(
          'text-xs text-gray-500 dark:text-gray-400 transition-colors',
          subtitleHoverEffect?.enabled && 'duration-[200ms]',
          subtitleHoverEffect?.enabled && 'group-hover:text-red-500'
        )}>
          {movie.type}
        </p>
      </div>
    </div>
  )
}

export default SimpleMovieLayer
