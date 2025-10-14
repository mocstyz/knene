/**
 * @fileoverview 悬停交互层组件
 * @description 提供统一的悬停交互效果逻辑，遵循DRY原则。
 * 支持多种悬停效果和交互行为，可在各种卡片组件中复用。
 * 专注于按钮交互效果（播放、下载、收藏、分享）。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Button, Icon } from '@components/atoms'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 悬停交互层组件属性接口
 */
export interface HoverInteractionLayerProps {
  /** 是否显示播放按钮 */
  showPlayButton?: boolean
  /** 是否显示下载按钮 */
  showDownloadButton?: boolean
  /** 是否显示收藏按钮 */
  showFavoriteButton?: boolean
  /** 是否显示分享按钮 */
  showShareButton?: boolean
  /** 是否已收藏 */
  isFavorited?: boolean
  /** 自定义CSS类名 */
  className?: string
  /** 悬停变体 */
  variant?: 'overlay' | 'scale' | 'fade'
  /** 播放按钮点击回调 */
  onPlay?: () => void
  /** 下载按钮点击回调 */
  onDownload?: () => void
  /** 收藏按钮点击回调 */
  onFavorite?: () => void
  /** 分享按钮点击回调 */
  onShare?: () => void
  /** 自定义按钮组 */
  customButtons?: React.ReactNode
}

/**
 * 悬停交互层组件
 *
 * 提供统一的悬停交互效果，支持多种按钮组合和样式变体。
 */
const HoverInteractionLayer: React.FC<HoverInteractionLayerProps> = ({
  showPlayButton = true,
  showDownloadButton = true,
  showFavoriteButton = false,
  showShareButton = false,
  isFavorited = false,
  className,
  variant = 'overlay',
  onPlay,
  onDownload,
  onFavorite,
  onShare,
  customButtons,
}) => {
  // 变体样式映射
  const variantClasses = {
    overlay:
      'absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 transition-all duration-200 group-hover:bg-opacity-50 group-hover:opacity-100',
    scale:
      'absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105',
    fade: 'absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
  }

  // 组合CSS类名
  const containerClasses = cn(variantClasses[variant], className)

  // 默认按钮组
  const defaultButtons = (
    <div className="flex gap-2">
      {showPlayButton && (
        <Button
          variant="primary"
          size="sm"
          onClick={onPlay}
          icon={<Icon name="play" />}
        >
          播放
        </Button>
      )}
      {showDownloadButton && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onDownload}
          icon={<Icon name="download" />}
        >
          下载
        </Button>
      )}
      {showFavoriteButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onFavorite}
          icon={<Icon name="heart" />}
          className={isFavorited ? 'text-red-500' : ''}
        />
      )}
      {showShareButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
          icon={<Icon name="share" />}
        />
      )}
    </div>
  )

  return (
    <div className={containerClasses}>{customButtons || defaultButtons}</div>
  )
}

export default HoverInteractionLayer
