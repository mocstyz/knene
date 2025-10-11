/**
 * @fileoverview 元数据显示层组件
 * @description 提供统一的元数据显示逻辑，遵循DRY原则。
 * 支持年份、时长、评分、类型等多种元数据的显示，可在各种卡片组件中复用。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Badge, Icon } from '@components/atoms'
import { cn } from '@utils/cn'
import { formatDuration, formatRating } from '@utils/formatters'
import React from 'react'

/**
 * 元数据显示层组件属性接口
 */
export interface MetadataLayerProps {
  /** 年份 */
  year?: number
  /** 时长（分钟） */
  duration?: number
  /** 评分 */
  rating?: number
  /** 类型列表 */
  genres?: string[]
  /** 导演 */
  director?: string
  /** 主演列表 */
  actors?: string[]
  /** 文件大小 */
  size?: string
  /** 下载次数 */
  downloadCount?: number
  /** 自定义CSS类名 */
  className?: string
  /** 布局变体 */
  variant?: 'horizontal' | 'vertical' | 'compact'
  /** 显示的元数据项 */
  showItems?: {
    year?: boolean
    duration?: boolean
    rating?: boolean
    genres?: boolean
    director?: boolean
    actors?: boolean
    size?: boolean
    downloadCount?: boolean
  }
  /** 最大显示的类型数量 */
  maxGenres?: number
  /** 最大显示的主演数量 */
  maxActors?: number
}

/**
 * 元数据显示层组件
 *
 * 提供统一的元数据显示功能，支持多种布局和显示配置。
 */
const MetadataLayer: React.FC<MetadataLayerProps> = ({
  year,
  duration,
  rating,
  genres = [],
  director,
  actors = [],
  size,
  downloadCount,
  className,
  variant = 'horizontal',
  showItems = {
    year: true,
    duration: true,
    rating: true,
    genres: true,
    director: false,
    actors: false,
    size: false,
    downloadCount: false,
  },
  maxGenres = 3,
  maxActors = 3,
}) => {
  // 布局样式映射
  const variantClasses = {
    horizontal: 'flex items-center gap-3 text-sm text-gray-500',
    vertical: 'space-y-2 text-sm text-gray-500',
    compact: 'flex items-center gap-2 text-xs text-gray-500',
  }

  // 评分颜色逻辑
  const getRatingColorClass = (rating: number): string => {
    if (rating >= 9) return 'text-green-400'
    if (rating >= 8) return 'text-blue-400'
    if (rating >= 7) return 'text-cyan-400'
    if (rating >= 6) return 'text-yellow-400'
    if (rating >= 5) return 'text-orange-400'
    if (rating >= 4) return 'text-red-400'
    return 'text-gray-400'
  }

  // 组合CSS类名
  const containerClasses = cn(variantClasses[variant], className)

  // 渲染年份
  const renderYear = () => {
    if (!showItems.year || !year) return null
    return <span>{year}</span>
  }

  // 渲染时长
  const renderDuration = () => {
    if (!showItems.duration || !duration) return null
    return <span>{formatDuration(duration)}</span>
  }

  // 渲染评分
  const renderRating = () => {
    if (!showItems.rating || !rating) return null
    return (
      <div
        className={cn('flex items-center gap-1', getRatingColorClass(rating))}
      >
        <Icon name="star" size="sm" />
        <span className="font-medium">{formatRating(rating)}</span>
      </div>
    )
  }

  // 渲染类型标签
  const renderGenres = () => {
    if (!showItems.genres || genres.length === 0) return null

    const displayGenres = genres.slice(0, maxGenres)

    return (
      <div className="flex flex-wrap gap-1">
        {displayGenres.map(genre => (
          <Badge key={genre} variant="secondary" size="sm">
            {genre}
          </Badge>
        ))}
      </div>
    )
  }

  // 渲染导演
  const renderDirector = () => {
    if (!showItems.director || !director) return null
    return (
      <div className="text-xs text-gray-500">
        <span className="font-medium">导演：</span>
        <span>{director}</span>
      </div>
    )
  }

  // 渲染主演
  const renderActors = () => {
    if (!showItems.actors || actors.length === 0) return null

    const displayActors = actors.slice(0, maxActors)

    return (
      <div className="text-xs text-gray-500">
        <span className="font-medium">主演：</span>
        <span>{displayActors.join('、')}</span>
      </div>
    )
  }

  // 渲染文件大小
  const renderSize = () => {
    if (!showItems.size || !size) return null
    return <span>大小：{size}</span>
  }

  // 渲染下载次数
  const renderDownloadCount = () => {
    if (!showItems.downloadCount || !downloadCount) return null
    return (
      <div className="flex items-center gap-1">
        <Icon name="download" size="xs" />
        <span>{downloadCount}</span>
      </div>
    )
  }

  // 水平布局的内容
  const horizontalContent = (
    <>
      {renderYear()}
      {year && duration && <span>•</span>}
      {renderDuration()}
      {(year || duration) && rating && <span>•</span>}
      {renderRating()}
    </>
  )

  // 垂直布局的内容
  const verticalContent = (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {renderYear()}
        {year && duration && <span>•</span>}
        {renderDuration()}
        {(year || duration) && rating && <span>•</span>}
        {renderRating()}
      </div>
      {renderGenres()}
      {renderDirector()}
      {renderActors()}
    </div>
  )

  // 紧凑布局的内容
  const compactContent = (
    <>
      {renderYear()}
      {year && duration && <span>•</span>}
      {renderDuration()}
      {(year || duration) && rating && <span>•</span>}
      {renderRating()}
    </>
  )

  // 根据布局变体渲染内容
  const renderContent = () => {
    switch (variant) {
      case 'horizontal':
        return horizontalContent
      case 'vertical':
        return verticalContent
      case 'compact':
        return compactContent
      default:
        return horizontalContent
    }
  }

  return (
    <div className={containerClasses}>
      {renderContent()}
      {variant === 'horizontal' && (
        <>
          {(size || downloadCount) && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              {renderSize()}
              {renderDownloadCount()}
            </div>
          )}
        </>
      )}
      {variant === 'vertical' && (
        <div className="space-y-1">
          {renderSize()}
          {renderDownloadCount()}
        </div>
      )}
    </div>
  )
}

export default MetadataLayer
