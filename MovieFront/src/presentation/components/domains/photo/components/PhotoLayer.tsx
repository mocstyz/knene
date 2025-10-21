/**
 * @fileoverview 写真层组件
 * @description 提供写真特化的内容展示逻辑，遵循组合式架构原则。
 *              包含写真特有的元素组合，提供完整的写真展示功能。
 *              参考MovieLayer的分离式布局设计，确保标题和分类显示在卡片下方。
 *              支持多种显示变体，包含图片、标题、标签、操作按钮等完整的写真信息展示。
 * @created 2025-10-20 14:04:05
 * @updated 2025-10-20 14:07:15
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
  TitleLayer,
  VipBadgeLayer,
  CardHoverLayer,
  TextHoverLayer,
} from '@components/layers'
import {
  getOverlayGradient,
} from '@tokens/design-system'
import { cn } from '@utils/cn'
import React from 'react'

// 写真层组件属性接口，定义写真层组件的所有配置选项
export interface PhotoLayerProps {
  photo: {
    id: string
    title: string
    imageUrl: string
    alt?: string
    tags?: string[]
    formatType?: 'JPEG高' | 'PNG' | 'WebP' | 'GIF' | 'BMP'
    resolution?: string
    fileSize?: string
    camera?: string
    location?: string
    shootDate?: string
    model?: string
    photographer?: string
    rating?: number
    isNew?: boolean
    newType?: 'hot' | 'latest' | null // 新项目类型标识，对齐统一类型系统
  } // 写真数据
  className?: string // 自定义CSS类名
  variant?: 'default' | 'detailed' | 'featured' | 'list' // 写真变体
  onView?: (photoId: string) => void // 查看按钮点击回调
  onDownload?: (photoId: string) => void // 下载按钮点击回调
  onFavorite?: (photoId: string) => void // 收藏按钮点击回调
  isFavorited?: boolean // 是否已收藏
  showHover?: boolean // 是否显示悬停效果
  showVipBadge?: boolean // 是否显示VIP标签
  showQualityBadge?: boolean // 是否显示质量标签
  showNewBadge?: boolean // 是否显示新片标签
  newBadgeType?: 'hot' | 'latest' | null // 新片类型，对齐统一类型系统
  isVip?: boolean // 是否为VIP内容
  isNew?: boolean // 是否为新内容
}

// 写真层组件，提供写真特化的内容展示功能，组合多个Layer组件，采用分离式布局
const PhotoLayer: React.FC<PhotoLayerProps> = ({
  photo,
  variant = 'default',
  onView,
  onDownload,
  onFavorite,
  isFavorited = false,
  showHover = true,
  showVipBadge = true,
  showQualityBadge = true,
  showNewBadge = true,
  newBadgeType = 'latest',
  isVip = false,
  isNew = false,
  className,
}) => {
  // 调试输出：检查PhotoLayer接收到的数据（所有变体）
  console.log('PhotoLayer - Received props (all variants):', {
    variant,
    photoId: photo.id,
    photoTitle: photo.title,
    photoIsNew: photo.isNew,
    photoNewType: photo.newType,
    propsIsNew: isNew,
    propsNewBadgeType: newBadgeType,
    showNewBadge,
    renderCondition: showNewBadge && (photo.isNew || isNew)
  })

  // 列表变体的特殊处理
  if (variant === 'list') {
    // 调试输出：检查PhotoLayer接收到的数据
  console.log('PhotoLayer - Received props:', {
    photoId: photo.id,
    photoTitle: photo.title,
    photoIsNew: photo.isNew,
    photoNewType: photo.newType,
    propsIsNew: isNew,
    propsNewBadgeType: newBadgeType,
    showNewBadge
  })

  return (
      <div className={cn('flex gap-4 p-4', className)}>
        {/* 左侧图片 */}
        <div className="relative h-28 w-20 flex-shrink-0">
          <ImageLayer
            src={photo.imageUrl}
            alt={photo.alt || photo.title}
            aspectRatio="custom"
            objectFit="cover"
            fallbackType="gradient"
          />
        </div>

        {/* 右侧内容 */}
        <div className="min-w-0 flex-1">
          {/* 标题 */}
          <TitleLayer
            title={photo.title}
            variant="primary"
            size="sm"
            maxLines={1}
            color="primary"
            weight="bold"
            clickable={!!onView}
            onClick={() => onView?.(photo.id)}
          />

          {/* 分类信息 - 使用tags作为分类 */}
          <MetadataLayer
            genres={photo.tags}
            variant="horizontal"
            maxGenres={3}
          />

          {/* 操作按钮 */}
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => onView?.(photo.id)}
            >
              <Icon name="eye" size="xs" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onDownload?.(photo.id)}
            >
              <Icon name="download" size="xs" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // 默认和特色变体的处理 - 分离式布局
  return (
    <CardHoverLayer
      scale={showHover ? 'md' : 'none'}
      duration="normal"
      enableShadow={false}
      disabled={!showHover}
      className={className}
    >
      <div className="space-y-3">
        {/* 图片卡片区域 - 独立的阴影卡片 */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md">
          <ImageLayer
            src={photo.imageUrl}
            alt={photo.alt || photo.title}
            aspectRatio="custom"
            objectFit="cover"
            hoverScale={false} // 由CardHoverLayer统一处理
            fallbackType="gradient"
          />

          {/* 底部渐变遮罩 - 使用统一的渐变Token系统，与MovieLayer保持一致 */}
          <div
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-0 h-1/3',
              getOverlayGradient('medium') // 对应原来的 from-black/50 via-black/20 to-transparent
            )}
          />

          {/* 标签层 */}
          <div className="absolute left-2 right-2 top-2 z-10 flex justify-between">
            {/* New badge - top-left */}
            {showNewBadge && (photo.isNew || isNew) && (
              <NewBadgeLayer
                isNew={true}
                newType={photo.newType || newBadgeType}
                position="top-left"
                size="responsive"
                variant="default"
                animated={false}
              />
            )}
            <div className="flex gap-2">
              {/* Quality badge - top-right */}
              {showQualityBadge && photo.formatType && (
                <QualityBadgeLayer
                  quality={photo.formatType}
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
                  onClick={() => onFavorite?.(photo.id)}
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
            {/* VIP badge - bottom-right */}
            {showVipBadge && isVip && (
              <VipBadgeLayer
                isVip={true}
                position="bottom-right"
                variant="default"
              />
            )}
          </div>
        </div>

        {/* 信息区域 - 独立容器，无阴影 */}
        <div className="space-y-2">
          {/* 标题 - 使用TitleLayer的hoverEffect配置 */}
          <TitleLayer
            title={photo.title}
            variant="primary"
            size="lg"
            maxLines={1}
            color="primary"
            weight="bold"
            clickable={!!onView}
            onClick={() => onView?.(photo.id)}
            hoverEffect={{
              enabled: showHover,
              hoverColor: 'red',
              transitionDuration: '200ms'
            }}
          />

          {/* 分类信息 - 使用tags作为分类 */}
          <MetadataLayer 
            genres={photo.tags} 
            variant="compact" 
            maxGenres={3} 
          />
        </div>
      </div>
    </CardHoverLayer>
  )
}

export default PhotoLayer
