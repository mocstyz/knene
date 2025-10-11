/**
 * @fileoverview 简化电影卡片分子组件
 * @description 遵循组合式架构原则，SimpleMovieLayer提供完整的电影展示功能。
 * 提供简化版的电影信息展示功能，专为首页展示设计。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 2.0.0
 */

import { SimpleMovieLayer } from '@components/layers'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 简化电影卡片组件属性接口
 */
export interface SimpleMovieCardProps {
  /** 电影数据对象 */
  movie: {
    title: string
    type: 'Movie' | 'TV Show'
    rating: string
    poster: string
    alt?: string
  }
  /** 评分颜色 */
  ratingColor?: 'purple' | 'red' | 'white' | 'default'
  /** 自定义CSS类名 */
  className?: string
  /** 是否支持悬停效果 */
  hoverEffect?: boolean
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
  /** 点击回调 */
  onClick?: (movie: any) => void
}

/**
 * 简化电影卡片组件
 *
 * 使用 SimpleMovieLayer 的组合式架构，
 * 提供简化版的电影展示功能。
 */
const SimpleMovieCard: React.FC<SimpleMovieCardProps> = ({
  movie,
  ratingColor = 'purple',
  className,
  hoverEffect = true,
  showVipBadge = true,
  showRatingBadge = true,
  showQualityBadge = true,
  qualityText,
  showNewBadge = true,
  newBadgeType = 'new',
  onClick,
}) => {
  return (
    <div
      className={cn(
        'group cursor-pointer space-y-3',
        onClick &&
          'transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]',
        className
      )}
      onClick={() => onClick?.(movie)}
    >
      <SimpleMovieLayer
        movie={{
          title: movie.title,
          type: movie.type,
          rating: movie.rating,
          poster: movie.poster,
          alt: movie.alt,
        }}
        ratingColor={ratingColor}
        hoverEffect={hoverEffect}
        showVipBadge={showVipBadge}
        showRatingBadge={showRatingBadge}
        showQualityBadge={showQualityBadge}
        qualityText={qualityText}
        showNewBadge={showNewBadge}
        newBadgeType={newBadgeType}
      />
    </div>
  )
}

export { SimpleMovieCard }
