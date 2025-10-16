/**
 * @fileoverview 热门列表组件
 * @description 热门专用的列表组件，继承BaseList的通用布局功能，专注于24小时内热门内容的展示。
 * 遵循组合式架构：BaseSection + HotList + MovieCard(simple变体)
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { BaseList, EmptyState } from '@components/domains/shared'
import { MovieCard } from '@components/domains/movie'
import type { HotItem } from '@infrastructure/repositories/HomeRepository'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 热门列表组件属性接口
 */
export interface HotListProps {
  /** 热门数据列表 */
  hotItems: HotItem[]
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
  /** 卡片配置 */
  cardConfig?: {
    /** 是否显示评分标签 */
    showRatingBadge?: boolean
    /** 是否显示质量标签 */
    showQualityBadge?: boolean
    /** 是否显示VIP标签 */
    showVipBadge?: boolean
    /** 是否显示新片标签 */
    showNewBadge?: boolean
    /** 宽高比 */
    aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape'
    /** 悬停效果 */
    hoverEffect?: boolean
  }
}

/**
 * 热门列表组件
 *
 * 采用组合式架构设计：
 * - BaseList: 提供通用的列表布局和响应式网格
 * - MovieCard: 提供电影卡片展示，使用simple变体
 * - 专注于热门数据的展示逻辑
 */
const HotList: React.FC<HotListProps> = ({
  hotItems,
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
  cardConfig = {
    showRatingBadge: true,
    showQualityBadge: true,
    showVipBadge: true,
    showNewBadge: true,
    aspectRatio: 'portrait',
    hoverEffect: true,
  },
}) => {
  // 防御性检查 - 如果hotItems是undefined或空数组，显示空状态
  if (!hotItems || !Array.isArray(hotItems) || hotItems.length === 0) {
    return (
      <EmptyState
        message="暂无数据"
        className={className}
        size="md"
        variant="center"
      />
    )
  }

  return (
    <BaseList
      variant={variant}
      columns={columns}
      className={className}
      gap="md"
    >
      {hotItems.map((item: HotItem) => (
        <MovieCard
          key={item.id}
          movie={{
            ...item,
            poster: item.imageUrl,
            rating: parseFloat(item.rating) || undefined,
          }}
          variant="default"
          showVipBadge={cardConfig.showVipBadge}
          showNewBadge={cardConfig.showNewBadge}
          showRatingBadge={cardConfig.showRatingBadge}
          showQualityBadge={cardConfig.showQualityBadge}
          hoverEffect={cardConfig.hoverEffect}
          onPlay={() => onHotClick?.(item)}
        />
      ))}
    </BaseList>
  )
}

export { HotList }
export default HotList
