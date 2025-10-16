/**
 * @fileoverview 首页写真模块组件
 * @description 首页写真模块的领域组件，使用BaseSection + PhotoList组合架构。
 * 遵循自包含组件设计原则，提供完整的写真模块功能。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 2.0.0
 */

import { BaseSection } from '@components/domains/shared'
import { PhotoList, type PhotoItem } from '@components/domains/photo'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 首页写真模块组件属性接口
 */
export interface PhotoSectionProps {
  /** 写真数据列表 */
  photos: PhotoItem[]
  /** 是否显示更多链接 */
  showMoreLink?: boolean
  /** 更多链接URL */
  moreLinkUrl?: string
  /** 更多链接文本 */
  moreLinkText?: string
  /** 写真卡片点击事件 */
  onPhotoClick?: (photo: PhotoItem) => void
  /** 自定义CSS类名 */
  className?: string
  /** 布局变体 */
  variant?: 'grid' | 'list'
  /** 响应式列数配置 */
  columns?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    xxl?: number
  }
  /** 是否显示评分标签 */
  showRatingBadge?: boolean
  /** 是否显示质量标签 */
  showQualityBadge?: boolean
  /** 是否显示VIP标签 */
  showVipBadge?: boolean
  /** 是否显示新片标签 */
  showNewBadge?: boolean
}

/**
 * 首页写真模块组件
 *
 * 使用BaseSection + PhotoList组合架构：
 * - BaseSection提供统一的Section布局
 * - PhotoList提供写真列表渲染
 * - 保持现有的props接口，确保向后兼容
 */
const PhotoSection: React.FC<PhotoSectionProps> = ({
  photos,
  showMoreLink = false,
  moreLinkUrl = '#',
  moreLinkText = 'More >',
  onPhotoClick,
  className,
  variant = 'grid',
  columns = {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 4,
    xl: 5,
    xxl: 6,
  },
  showRatingBadge = false,
  showQualityBadge = true,
  showVipBadge = true,
  showNewBadge = true,
}) => {
  return (
    <BaseSection
      title="写真"
      showMoreLink={showMoreLink}
      moreLinkUrl={moreLinkUrl}
      moreLinkText={moreLinkText}
      className={className}
    >
      <PhotoList
        photos={photos}
        onPhotoClick={onPhotoClick}
        variant={variant}
        columns={columns}
        cardConfig={{
          showVipBadge,
          showNewBadge,
          showQualityBadge,
          showRatingBadge,
          aspectRatio: 'portrait',
          hoverEffect: true,
          titleHoverEffect: true,
        }}
      />
    </BaseSection>
  )
}

export { PhotoSection }
export default PhotoSection
