/**
 * @fileoverview Movie列表项渲染组件
 * @description 负责单个Movie列表项的渲染逻辑，支持多种卡片变体。
 * 遵循DDD架构的组件拆分原则，将渲染逻辑从主组件中分离。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { MovieCard, SimpleMovieCard } from '@components/domains/movie/MovieCard'
import { TopicCard } from '@components/domains/topic/TopicCard'
import type { BaseMovieItem } from '@types-movie/movie.types'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * Movie列表项渲染组件属性接口
 */
export interface MovieListItemProps {
  /** 电影数据 */
  movie: BaseMovieItem
  /** 卡片变体 */
  cardVariant: 'default' | 'simple' | 'topic' | 'featured' | 'list' | 'detailed'
  /** 布局变体 */
  variant: 'grid' | 'list' | 'carousel'
  /** 点击回调 */
  onMovieClick?: (movie: BaseMovieItem) => void
  /** 卡片配置 */
  cardConfig?: {
    showRatingBadge?: boolean
    showQualityBadge?: boolean
    showVipBadge?: boolean
    showNewBadge?: boolean
    qualityText?: string
    newBadgeType?: 'new' | 'update' | 'today' | 'latest'
  }
  /** 自定义CSS类名 */
  className?: string
}

/**
 * Movie列表项渲染组件
 *
 * 负责渲染单个电影列表项，支持多种卡片类型和配置。
 */
const MovieListItem: React.FC<MovieListItemProps> = ({
  movie,
  cardVariant,
  variant,
  onMovieClick,
  cardConfig,
  className,
}) => {
  const itemClasses = cn(
    variant === 'list' ? '' : 'group space-y-2',
    cardVariant === 'topic' && 'aspect-square h-full w-full',
    className
  )

  const handleClick = () => {
    onMovieClick?.(movie)
  }

  // 渲染专题卡片
  if (cardVariant === 'topic') {
    return (
      <div className={itemClasses}>
        <TopicCard
          topic={{
            id: movie.id,
            title: movie.title,
            description: movie.description,
            imageUrl: movie.imageUrl,
            alt: movie.alt,
          }}
          onClick={handleClick}
          aspectRatio="square"
          showVipBadge={true}
          hoverEffect={true}
        />
      </div>
    )
  }

  // 渲染简化卡片
  if (cardVariant === 'simple') {
    return (
      <div className={itemClasses}>
        <SimpleMovieCard
          movie={{
            title: movie.title,
            type: movie.type === 'Collection' ? 'Movie' : movie.type,
            rating: movie.rating,
            poster: movie.imageUrl,
            alt: movie.alt,
          }}
          ratingColor={movie.ratingColor}
          onClick={handleClick}
          showRatingBadge={cardConfig?.showRatingBadge ?? true}
          showVipBadge={cardConfig?.showVipBadge ?? true}
          showQualityBadge={cardConfig?.showQualityBadge ?? true}
          qualityText={
            cardConfig?.qualityText ||
            (movie as any).formatType ||
            movie.quality
          }
          showNewBadge={cardConfig?.showNewBadge ?? false}
          newBadgeType={
            cardConfig?.newBadgeType || (movie as any).newType || 'new'
          }
        />
      </div>
    )
  }

  // 渲染默认卡片
  return (
    <div className={itemClasses}>
      <MovieCard
        movie={{
          id: movie.id,
          title: movie.title,
          poster: movie.imageUrl,
          year: 2024, // 默认年份
          rating: parseFloat(movie.rating),
          duration: 120, // 默认时长（分钟）
          genres: [movie.type],
          description: movie.description || `${movie.title} - ${movie.type}`,
          alt: movie.alt,
          quality: movie.quality,
          // 映射ratingColor到rating属性
          ...(movie.ratingColor && {
            rating: movie.ratingColor === 'default' ? 7.0 : 8.0,
          }),
        }}
        variant={cardVariant}
        onPlay={handleClick}
      />
    </div>
  )
}

export default MovieListItem
