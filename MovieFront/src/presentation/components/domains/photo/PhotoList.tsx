/**
 * @fileoverview 写真列表组件
 * @description 写真专用的列表组件，已重构为使用内容渲染器系统。
 * 使用BaseList提供布局，内容渲染器提供写真卡片渲染。
 * 遵循自包含组件设计原则，提供完整的写真列表功能。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 2.0.0
 */

import { createPhotoContentItem } from '@components/domains/photo/renderers'
import {
  BaseList,
  EmptyState,
  type ResponsiveColumnsConfig,
} from '@components/domains/shared'
import {
  createRendererConfig,
  type RendererConfig,
} from '@components/domains/shared/content-renderers'
import { contentRendererFactory } from '@components/domains/shared/content-renderers'
import type { PhotoItem } from '@types-movie'
import { cn } from '@utils/cn'
import React from 'react'


/**
 * 写真列表组件属性接口
 */
export interface PhotoListProps {
  /** 写真数据列表 */
  photos: PhotoItem[]
  /** 写真卡片点击事件 */
  onPhotoClick?: (photo: PhotoItem) => void
  /** 自定义CSS类名 */
  className?: string
  /** 布局变体 */
  variant?: 'grid' | 'list'
  /** 响应式列数配置 */
  columns?: ResponsiveColumnsConfig
  /** 卡片配置 */
  cardConfig?: {
    /** 是否显示VIP标签 */
    showVipBadge?: boolean
    /** 是否显示新片标签 */
    showNewBadge?: boolean
    /** 是否显示质量标签 */
    showQualityBadge?: boolean
    /** 是否显示评分标签 */
    showRatingBadge?: boolean
    /** 宽高比 */
    aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape'
    /** 悬停效果 */
    hoverEffect?: boolean
    /** 标题悬停效果 */
    titleHoverEffect?: boolean
  }
}

/**
 * 写真列表组件
 *
 * 提供写真的完整列表功能，使用内容渲染器系统：
 * - 使用BaseList提供统一布局
 * - 使用PhotoContentRenderer提供写真卡片渲染
 * - 支持响应式列数配置
 * - 自包含的交互和视觉效果
 * - 使用统一的内容渲染器架构，支持扩展和定制
 */
const PhotoList: React.FC<PhotoListProps> = ({
  photos,
  cardConfig,
  columns,
  onPhotoClick,
  className,
  variant = 'grid',
}) => {
  // 添加调试日志
  console.log('📸 [PhotoList] Received photos:', {
    length: photos?.length || 0,
    photos: photos,
    isArray: Array.isArray(photos),
    isEmpty: !photos || photos.length === 0
  })

  // 防御性检查
  if (!photos || !Array.isArray(photos) || photos.length === 0) {
    console.log('📸 [PhotoList] Showing empty state - no photos')
    return <EmptyState message="暂无数据" />
  }

  // 获取写真内容渲染器
  const photoRenderer = contentRendererFactory.getRenderer('photo')

  // 根据配置创建渲染器配置
  const rendererConfig = createRendererConfig({
    hoverEffect: cardConfig?.hoverEffect ?? true,
    showVipBadge: cardConfig?.showVipBadge ?? true,
    showNewBadge: cardConfig?.showNewBadge ?? true,
    showQualityBadge: cardConfig?.showQualityBadge ?? true,
    showRatingBadge: cardConfig?.showRatingBadge ?? false,
    aspectRatio: cardConfig?.aspectRatio ?? 'portrait',
    onClick: item => {
      // Find the original PhotoItem that corresponds to this BaseContentItem
      const originalPhotoItem = photos.find(photo => photo.id === item.id)
      if (originalPhotoItem) {
        onPhotoClick?.(originalPhotoItem)
      }
    },
  })

  return (
    <BaseList
      items={photos}
      variant={variant}
      columns={columns}
      className={className}
      renderItem={(photo) => {
        // 调试输出：检查写真数据
        console.log('PhotoList - Processing photo:', {
          id: photo.id,
          title: photo.title,
          isNew: photo.isNew,
          newType: photo.newType,
          hasIsNew: 'isNew' in photo,
          hasNewType: 'newType' in photo
        })

        // 将PhotoItem转换为PhotoContentItem
        const photoContentItem = createPhotoContentItem({
          id: photo.id,
          title: photo.title,
          imageUrl: photo.imageUrl, // PhotoItem has imageUrl property
          alt: photo.alt,
          description: photo.description,
          isNew: photo.isNew,
          newType: photo.newType,
          isVip: true, // Default to true for PhotoItem
          rating: photo.rating ? parseFloat(photo.rating) : undefined,
          ratingColor:
            photo.ratingColor === 'purple' ||
            photo.ratingColor === 'red' ||
            photo.ratingColor === 'white'
              ? 'default'
              : photo.ratingColor || 'default',
          formatType: photo.formatType,
        })

        // 调试输出：检查转换后的数据
        console.log('PhotoList - Created photoContentItem:', {
          id: photoContentItem.id,
          title: photoContentItem.title,
          isNew: photoContentItem.isNew,
          newType: photoContentItem.newType
        })

        // 使用内容渲染器渲染写真项目
        return photoRenderer?.render(photoContentItem, rendererConfig)
      }}
    />
  )
}

export { PhotoList }
export default PhotoList
