/**
 * @fileoverview 首页热门模块组件
 * @description 首页24小时热门模块的领域组件，使用BaseSection + HotList组合架构。
 * 遵循自包含组件设计原则，提供完整的热门模块功能。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 2.0.0
 */

import { HotList } from '@components/domains/hot/HotList'
import { BaseSection } from '@components/domains/shared'
import type { HotItem } from '@infrastructure/repositories/HomeRepository'
import React from 'react'


/**
 * 首页热门模块组件属性接口
 */
export interface HotSectionProps {
  /** 热门数据列表 */
  hotItems: HotItem[]
  /** 是否显示更多链接 */
  showMoreLink?: boolean
  /** 更多链接URL */
  moreLinkUrl?: string
  /** 更多链接文本 */
  moreLinkText?: string
  /** 热门卡片点击事件 */
  onHotClick?: (item: HotItem) => void
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
 * 首页热门模块组件
 *
 * 使用BaseSection + HotList组合架构：
 * - BaseSection提供统一的Section布局
 * - HotList提供热门列表渲染
 * - 保持现有的props接口，确保向后兼容
 */
const HotSection: React.FC<HotSectionProps> = ({
  hotItems,
  showMoreLink = false,
  moreLinkUrl = '#',
  moreLinkText = 'More >',
  onHotClick,
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
  showRatingBadge = true,
  showQualityBadge = true,
  showVipBadge = true,
  showNewBadge = true,
}) => {
  return (
    <BaseSection
      title="24小时热门"
      showMoreLink={showMoreLink}
      moreLinkUrl={moreLinkUrl}
      moreLinkText={moreLinkText}
      className={className}
    >
      <HotList
        hotItems={hotItems}
        onHotClick={onHotClick}
        variant={variant}
        columns={columns}
        cardConfig={{
          showRatingBadge,
          showQualityBadge,
          showVipBadge,
          showNewBadge,
          aspectRatio: 'portrait',
          hoverEffect: true,
        }}
      />
    </BaseSection>
  )
}

export { HotSection }
export default HotSection
