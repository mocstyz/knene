/**
 * @fileoverview Movie列表项渲染组件
 * @description 负责单个Movie列表项的渲染逻辑，支持多种卡片变体。
 * 遵循DDD架构的组件拆分原则，将渲染逻辑从主组件中分离。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { MovieCard } from '@components/domains/movie/MovieCard'
import { CollectionCard } from '@components/domains/collections/CollectionCard'
import {
  CardHoverLayer,
  ImageLayer,
  NewBadgeLayer,
  QualityBadgeLayer,
  RatingBadgeLayer,
  TextHoverLayer,
  TitleLayer,
  VipBadgeLayer,
} from '@components/layers'
import { getOverlayGradient } from '@tokens/design-system'
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
    variant === 'list' ? '' : 'space-y-2',
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
        <CollectionCard
          collection={{
            id: movie.id,
            title: movie.title,
            description: movie.description,
            imageUrl: movie.imageUrl,
            alt: movie.alt,
            isNew: (movie as any).isNew ?? true,
            newType: (movie as any).newType ?? 'new',
          }}
          onClick={handleClick}
          aspectRatio="square"
          showVipBadge={cardConfig?.showVipBadge ?? true}
          hoverEffect={true}
        />
      </div>
    )
  }

  // 渲染简化卡片 - 使用现有标签组件组合
  if (cardVariant === 'simple') {
    return (
      <CardHoverLayer scale="md" duration="fast">
        <div
          className={cn('cursor-pointer', 'active:scale-[0.98]', itemClasses)}
          onClick={handleClick}
        >
          {/* 图片卡片区域 */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md">
            <ImageLayer
              src={movie.imageUrl}
              alt={movie.alt || `${movie.title} poster`}
              aspectRatio="custom"
              objectFit="cover"
              hoverScale={false} // 禁用内部hover，使用CardHoverLayer
              fallbackType="gradient"
            />

            {/* 底部渐变遮罩 */}
            <div
              className={cn(
                'pointer-events-none absolute inset-x-0 bottom-0 h-1/3',
                getOverlayGradient('medium')
              )}
            />

            {/* 顶部标签层 */}
            <div className="absolute left-2 right-2 top-2 z-10 flex justify-between">
              {/* 新片标签 - 左上角 */}
              {cardConfig?.showNewBadge && (
                <NewBadgeLayer
                  isNew={true}
                  newType={
                    cardConfig?.newBadgeType || (movie as any).newType || 'new'
                  }
                  position="top-left"
                  size="responsive"
                  variant="default"
                  animated={false}
                />
              )}
              {/* 质量标签 - 右上角 */}
              {cardConfig?.showQualityBadge && (
                <QualityBadgeLayer
                  quality={
                    cardConfig?.qualityText ||
                    (movie as any).formatType ||
                    movie.quality
                  }
                  position="top-right"
                  displayType="layer"
                  variant="default"
                />
              )}
            </div>

            {/* 底部标签层 */}
            <div className="absolute bottom-2 left-2 right-2 z-10 flex justify-between">
              {/* 评分标签 - 左下角 */}
              {cardConfig?.showRatingBadge && (
                <RatingBadgeLayer
                  rating={movie.rating}
                  position="bottom-left"
                  variant="compact"
                  textColor={movie.ratingColor as any}
                />
              )}
              {/* VIP标签 - 右下角 */}
              {cardConfig?.showVipBadge && (
                <VipBadgeLayer
                  isVip={true}
                  position="bottom-right"
                  variant="compact"
                  text="VIP"
                />
              )}
            </div>
          </div>

          {/* 信息区域 - 只显示标题和类型 */}
          <div className="space-y-1">
            {/* 标题 */}
            <TitleLayer
              title={movie.title}
              variant="primary"
              size="sm"
              maxLines={1}
              color="primary"
              weight="semibold"
              hoverEffect={{
                enabled: true, // 启用内部hover
                hoverColor: 'red',
                transitionDuration: '200ms',
              }}
            />

            {/* 类型 */}
            <TextHoverLayer
              hoverColor="red"
              duration="fast"
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              {movie.type === 'Collection' ? 'Movie' : movie.type}
            </TextHoverLayer>
          </div>
        </div>
      </CardHoverLayer>
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

export { MovieListItem }
export default MovieListItem
