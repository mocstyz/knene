/**
 * @fileoverview 首页影片合集模块组件
 * @description 首页影片合集模块的领域组件，使用BaseSection + CollectionList组合架构。
 * 遵循自包含组件设计原则，提供完整的影片合集模块功能。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 2.0.0
 */

import { BaseSection } from '@components/domains/shared'
import {
  CollectionList,
  type CollectionItem,
} from '@components/domains/collections'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 首页影片合集模块组件属性接口
 */
export interface CollectionSectionProps {
  /** 影片合集数据列表 */
  collections: CollectionItem[]
  /** 是否显示更多链接 */
  showMoreLink?: boolean
  /** 更多链接URL */
  moreLinkUrl?: string
  /** 更多链接文本 */
  moreLinkText?: string
  /** 影片合集卡片点击事件 */
  onCollectionClick?: (collection: CollectionItem) => void
  /** 自定义CSS类名 */
  className?: string
  /** 布局变体 */
  variant?: 'grid' | 'carousel'
  /** 响应式列数配置 */
  columns?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  /** 是否显示VIP标签 */
  showVipBadge?: boolean
  /** 是否显示新片标签 */
  showNewBadge?: boolean
}

/**
 * 首页影片合集模块组件
 *
 * 使用BaseSection + CollectionList组合架构：
 * - BaseSection提供统一的Section布局
 * - CollectionList提供影片合集列表渲染
 * - 保持现有的props接口，确保向后兼容
 */
const CollectionSection: React.FC<CollectionSectionProps> = ({
  collections,
  showMoreLink = false,
  moreLinkUrl = '#',
  moreLinkText = 'More >',
  onCollectionClick,
  className,
  variant = 'grid',
  columns = {
    xs: 1,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 3,
  },
  showVipBadge = true,
  showNewBadge = true,
}) => {
  return (
    <BaseSection
      title="影片合集"
      showMoreLink={showMoreLink}
      moreLinkUrl={moreLinkUrl}
      moreLinkText={moreLinkText}
      className={className}
    >
      <CollectionList
        collections={collections}
        onCollectionClick={onCollectionClick}
        variant={variant}
        columns={columns}
        cardConfig={{
          showVipBadge,
          showNewBadge,
          aspectRatio: 'portrait',
          hoverEffect: true,
        }}
      />
    </BaseSection>
  )
}

export { CollectionSection }
export default CollectionSection
