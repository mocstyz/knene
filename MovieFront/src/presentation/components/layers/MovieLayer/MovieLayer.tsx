/**
 * @fileoverview 电影层组件
 * @description 提供电影特化的内容展示逻辑，遵循组合式架构原则。
 * 包含电影特有的元素组合，提供完整的电影展示功能。
 *
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
import { getOverlayGradient } from '@tokens/design-system'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 电影层组件属性接口
 */
export interface MovieLayerProps {
  /** 电影数据 */
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
  /** 自定义CSS类名 */
  className?: string
  /** 电影变体 */
  variant?: 'default' | 'detailed' | 'featured' | 'list'
  /** 播放按钮点击回调 */
  onPlay?: (movieId: string) => void
  /** 下载按钮点击回调 */
  onDownload?: (movieId: string) => void
  /** 收藏按钮点击回调 */
  onFavorite?: (movieId: string) => void
  /** 是否已收藏 */
  isFavorited?: boolean
  /** 是否显示悬停效果 */
  showHover?: boolean
  /** 是否显示VIP标签 */
  showVipBadge?: boolean
  /** 是否显示质量标签 */
  showQualityBadge?: boolean
  /** 是否显示评分标签 */
  showRatingBadge?: boolean
  /** 是否显示新片标签 */
  showNewBadge?: boolean
}

/**
 * 电影层组件
 *
 * 提供电影特化的内容展示功能，组合多个Layer组件。
 */
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
}) => {
  // 列表变体的特殊处理
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
            color="primary"
            clickable={!!onPlay}
            onClick={() => onPlay?.(movie.id)}
          />

          {/* 元数据 */}
          <MetadataLayer
            year={movie.year}
            duration={movie.duration}
            rating={movie.rating}
            variant="horizontal"
            showItems={{
              year: true,
              duration: true,
              rating: true,
              genres: false,
              director: false,
              actors: false,
              size: false,
              downloadCount: false,
            }}
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

  // 默认和特色变体的处理
  return (
    <div className="group space-y-3">
      {/* 图片卡片区域 - 独立的阴影卡片 */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md">
        <ImageLayer
          src={movie.poster}
          alt={movie.alt || movie.title}
          aspectRatio="custom"
          objectFit="cover"
          hoverScale={showHover}
          fallbackType="gradient"
        />

        {/* 底部渐变遮罩 - 使用统一的渐变Token系统 */}
        <div className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-1/3',
          getOverlayGradient('medium') // 对应原来的 from-black/50 via-black/20 to-transparent
        )} />

        {/* 标签层 */}
        <div className="absolute left-2 right-2 top-2 z-10 flex justify-between">
          {/* New badge - top-left */}
          {showNewBadge && (
            <NewBadgeLayer
              isNew={true}
              newType="new"
              position="top-left"
              size="responsive"
              variant="default"
              animated={false}
            />
          )}
          <div className="flex gap-2">
            {/* Quality badge - top-right */}
            {showQualityBadge && movie.quality && (
              <QualityBadgeLayer
                quality={movie.quality}
                position="top-right"
                displayType="layer"
                variant="default"
              />
            )}
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

        {/* 底部标签层 */}
        <div className="absolute bottom-2 left-2 right-2 z-10 flex justify-between">
          {showRatingBadge && movie.rating && (
            <RatingBadgeLayer
              rating={movie.rating}
              position="bottom-left"
              variant="default"
              showIcon={false}
            />
          )}
          {showVipBadge && (
            <VipBadgeLayer
              isVip={true}
              position="bottom-right"
              variant="default"
            />
          )}
        </div>
      </div>

      {/* 信息区域 - 独立容器，无阴影 */}
      <div className="space-y-3">
        {/* 标题 */}
        <TitleLayer
          title={movie.title}
          variant="primary"
          size="lg"
          maxLines={1}
          color="primary"
          clickable={!!onPlay}
          onClick={() => onPlay?.(movie.id)}
        />

        {/* 元数据 */}
        <MetadataLayer
          year={movie.year}
          duration={movie.duration}
          rating={movie.rating}
          genres={movie.genres}
          variant="vertical"
          showItems={{
            year: true,
            duration: true,
            rating: true,
            genres: true,
            director: variant === 'featured',
            actors: variant === 'featured',
            size: !!movie.size,
            downloadCount: !!movie.downloadCount,
          }}
        />

        {/* 特色变体的额外内容 */}
        {variant === 'featured' && (
          <>
            {/* 描述 */}
            {movie.description && (
              <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                {movie.description}
              </p>
            )}

            {/* 导演和演员 */}
            {(movie.director || movie.actors) && (
              <div className="mb-3 space-y-1 text-xs text-gray-500">
                {movie.director && (
                  <div>
                    <span className="font-medium">导演：</span>
                    <span>{movie.director}</span>
                  </div>
                )}
                {movie.actors && movie.actors.length > 0 && (
                  <div>
                    <span className="font-medium">主演：</span>
                    <span>{movie.actors.slice(0, 3).join('、')}</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* 文件大小和下载次数 */}
        {(movie.size || movie.downloadCount) && (
          <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
            {movie.size && <span>大小：{movie.size}</span>}
            {movie.downloadCount && (
              <div className="flex items-center gap-1">
                <Icon name="download" size="xs" />
                <span>{movie.downloadCount}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieLayer
