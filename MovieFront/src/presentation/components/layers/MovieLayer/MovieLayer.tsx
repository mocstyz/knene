/**
 * @fileoverview 电影层组件
 * @description 提供电影特化的内容展示逻辑，遵循组合式架构原则，包含电影特有的元素组合，提供完整的电影展示功能。
 *              支持多种显示变体、完整的交互回调、自定义标签控制和评分颜色配置，提供自包含的视觉效果。
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Button, Icon } from '@components/atoms'
import {
  ImageLayer,
  MetadataLayer,
  NewBadgeLayer,
  QualityBadgeLayer,
  RatingBadgeLayer,
  TitleLayer,
  VipBadgeLayer,
} from '@components/layers'
import {
  getOverlayGradient,
  type BadgeLayerRatingColor,
} from '@tokens/design-system'
import { cn } from '@utils/cn'
import React from 'react'

// 电影层组件属性接口
export interface MovieLayerProps {
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
  className?: string
  variant?: 'default' | 'detailed' | 'featured' | 'list'
  onPlay?: (movieId: string) => void
  onDownload?: (movieId: string) => void
  onFavorite?: (movieId: string) => void
  isFavorited?: boolean
  showHover?: boolean
  showVipBadge?: boolean
  showQualityBadge?: boolean
  showRatingBadge?: boolean
  showNewBadge?: boolean
  newBadgeType?: 'hot' | 'latest' | null
  qualityText?: string
  isVip?: boolean // 添加isVip prop，用于控制VIP标签显示
  isNew?: boolean // 添加isNew prop，用于控制NEW标签显示
}

// 电影层组件，提供电影特化的内容展示功能，组合多个Layer组件实现完整的电影卡片效果
const MovieLayer: React.FC<MovieLayerProps> = ({
  movie,
  variant = 'default',
  onPlay,
  onDownload,
  onFavorite,
  isFavorited = false,
  showHover = true,
  showVipBadge = true,
  showQualityBadge = true,
  showRatingBadge = true,
  showNewBadge = true,
  newBadgeType = 'latest',
  qualityText,
  isVip = false, // 默认为false，由数据源决定
  isNew = false, // 默认为false，由数据源决定
}) => {
  // 列表变体处理 - 专门为列表布局优化的横向排列显示
  if (variant === 'list') {
    return (
      <div className="flex gap-4 p-4">
        {/* 左侧图片 */}
        <div className="relative h-28 w-20 flex-shrink-0">
          <ImageLayer
            src={movie.poster}
            alt={movie.alt || movie.title}
            aspectRatio="custom"
            objectFit="cover"
            fallbackType="gradient"
          />
        </div>

        {/* 右侧内容 */}
        <div className="min-w-0 flex-1">
          {/* 标题 */}
          <TitleLayer
            title={movie.title}
            variant="primary"
            size="sm"
            maxLines={1}
            color="rating"
            rating={movie.rating}
            weight="bold"
            clickable={!!onPlay}
            onClick={() => onPlay?.(movie.id)}
          />

          {/* 分类信息 */}
          <MetadataLayer
            genres={movie.genres}
            variant="horizontal"
            maxGenres={3}
          />

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => onPlay?.(movie.id)}
            >
              <Icon name="play" size="xs" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onDownload?.(movie.id)}
            >
              <Icon name="download" size="xs" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // 默认和特色变体处理 - 提供完整的卡片式布局，包含图片区域和信息区域
  return (
    <div className="space-y-3 group">
      {/* 图片卡片区域 - 独立的阴影卡片容器 */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md">
        <ImageLayer
          src={movie.poster}
          alt={movie.alt || movie.title}
          aspectRatio="custom"
          objectFit="cover"
          hoverScale={showHover}
          fallbackType="gradient"
        />

        {/* 底部渐变遮罩 - 使用统一的渐变Token系统实现视觉过渡效果 */}
        <div
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 h-1/3',
            getOverlayGradient('medium') // 对应原来的 from-black/50 via-black/20 to-transparent
          )}
        />

        {/* 顶部标签层 - 位置固定在卡片顶部两侧 */}
        <div className="absolute left-2 right-2 top-2 z-10 flex justify-between">
          {/* 新片标签 - 左上角位置，根据isNew prop决定显示 */}
          {showNewBadge && isNew && (
            <NewBadgeLayer
              isNew={isNew}
              newType={newBadgeType}
              position="top-left"
              size="responsive"
              variant="default"
              animated={false}
            />
          )}
          <div className="flex gap-2">
            {/* 质量标签 - 右上角位置 */}
            {showQualityBadge && (qualityText || movie.quality) && (
              <QualityBadgeLayer
                quality={qualityText || movie.quality}
                position="top-right"
                displayType="layer"
                variant="default"
              />
            )}
            {/* 特色变体的收藏按钮 - 仅在featured变体时显示 */}
            {variant === 'featured' && (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-white bg-opacity-80 p-1.5 transition-all duration-200 hover:bg-opacity-100"
                onClick={() => onFavorite?.(movie.id)}
              >
                <Icon
                  name="heart"
                  size="sm"
                  className={isFavorited ? 'text-red-500' : 'text-gray-400'}
                />
              </Button>
            )}
          </div>
        </div>

        {/* 底部标签层 - 位置固定在卡片底部两侧 */}
        <div className="absolute bottom-2 left-2 right-2 z-10 flex justify-between">
          {/* 评分标签 - 左下角位置，根据rating字段决定显示 */}
          {showRatingBadge && movie.rating && (
            <RatingBadgeLayer
              rating={movie.rating}
              position="bottom-left"
              variant="default"
            />
          )}
          {/* VIP标签 - 右下角位置，根据isVip prop决定显示 */}
          {showVipBadge && isVip && (
            <VipBadgeLayer
              isVip={isVip}
              position="bottom-right"
              variant="default"
            />
          )}
        </div>
      </div>

      {/* 信息区域 - 独立容器，与图片区域分离 */}
      <div className="space-y-2">
        {/* 标题区域 - 支持点击播放 */}
        <TitleLayer
          title={movie.title}
          variant="primary"
          size="lg"
          maxLines={1}
          color="rating"
          rating={movie.rating}
          weight="bold"
          clickable={!!onPlay}
          onClick={() => onPlay?.(movie.id)}
        />

        {/* 分类信息区域 - 紧凑布局显示 */}
        <MetadataLayer genres={movie.genres} variant="compact" maxGenres={3} />
      </div>
    </div>
  )
}

export default MovieLayer
