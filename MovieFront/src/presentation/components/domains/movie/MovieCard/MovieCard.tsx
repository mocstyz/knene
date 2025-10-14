/**
 * @fileoverview 电影卡片分子组件
 * @description 遵循组合式架构原则，MovieLayer提供完整的电影展示功能。
 * 提供电影信息的完整展示功能，支持多种显示模式和交互效果。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 2.0.0
 */

import { MovieLayer } from '@components/layers'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 电影卡片组件属性接口
 */
export interface MovieCardProps {
  /** 电影数据对象 */
  movie: {
    id: string
    title: string
    poster: string
    year?: number
    rating?: number
    duration?: number
    genres?: string[]
    description?: string
    director?: string
    actors?: string[]
    quality?: string
    size?: string
    downloadCount?: number
    alt?: string
  }
  /** 卡片显示变体 */
  variant?: 'default' | 'detailed' | 'featured' | 'list'
  /** 卡片尺寸 */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** 播放按钮点击回调 */
  onPlay?: (movieId: string) => void
  /** 下载按钮点击回调 */
  onDownload?: (movieId: string) => void
  /** 收藏按钮点击回调 */
  onFavorite?: (movieId: string) => void
  /** 是否已收藏 */
  isFavorited?: boolean
  /** 自定义CSS类名 */
  className?: string
  /** 是否支持悬停效果 */
  hoverEffect?: boolean
  /** 是否显示VIP标签 */
  showVipBadge?: boolean
  /** 是否显示质量标签 */
  showQualityBadge?: boolean
  /** 是否显示评分标签 */
  showRatingBadge?: boolean
  /** 是否显示新片标签 */
  showNewBadge?: boolean
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  variant = 'default',
  onPlay,
  onDownload,
  onFavorite,
  isFavorited = false,
  className,
  hoverEffect = true,
  showVipBadge = true,
  showQualityBadge = true,
  showRatingBadge = true,
  showNewBadge = true,
}) => {
  // 根据变体选择不同的组合策略
  const cardContent = (
    <MovieLayer
      movie={movie}
      variant={variant}
      onPlay={onPlay}
      onDownload={onDownload}
      onFavorite={onFavorite}
      isFavorited={isFavorited}
      showHover={hoverEffect}
      showVipBadge={showVipBadge}
      showQualityBadge={showQualityBadge}
      showRatingBadge={showRatingBadge}
      showNewBadge={showNewBadge}
    />
  )

  // 列表变体使用特殊布局
  if (variant === 'list') {
    return (
      <div
        className={cn(
          'rounded-lg bg-white shadow-md dark:bg-gray-800',
          className
        )}
      >
        {cardContent}
      </div>
    )
  }

  // 其他变体使用无阴影容器包装
  return (
    <div
      className={cn(
        'cursor-pointer space-y-3 group',
        !!onPlay &&
          'transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]',
        className
      )}
      onClick={() => onPlay?.(movie.id)}
    >
      {cardContent}
    </div>
  )
}

export default MovieCard
