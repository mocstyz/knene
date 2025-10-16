/**
 * @fileoverview 最新更新列表组件
 * @description 最新更新专用的列表组件，继承BaseList的通用布局功能，专注于最新更新内容的展示。
 * 遵循组合式架构：BaseSection + LatestList + MovieCard(simple变体)
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { BaseList, EmptyState } from '@components/domains/shared'
import { MovieCard } from '@components/domains/movie'
import type { LatestItem as BaseLatestItem } from '@types-movie/movie.types'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 最新更新项目接口 - 扩展基础接口
 */
export interface LatestItem extends BaseLatestItem {
  /** 最新更新模块特定属性可以在这里扩展 */
}

/**
 * 最新更新列表组件属性接口
 */
export interface LatestUpdateListProps {
  /** 最新更新数据列表 */
  latestItems: LatestItem[]
  /** 最新更新卡片点击事件 */
  onLatestClick?: (item: LatestItem) => void
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
 * 最新更新列表组件
 *
 * 采用组合式架构设计：
 * - BaseList: 提供通用的列表布局和响应式网格
 * - MovieCard: 提供电影卡片展示，使用simple变体
 * - 专注于最新更新数据的展示逻辑
 */
const LatestUpdateList: React.FC<LatestUpdateListProps> = ({
  latestItems,
  onLatestClick,
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
  // 防御性检查 - 如果latestItems是undefined或空数组，显示空状态
  if (!latestItems || !Array.isArray(latestItems) || latestItems.length === 0) {
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
      {latestItems.map((item: LatestItem) => (
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
          onPlay={() => onLatestClick?.(item)}
        />
      ))}
    </BaseList>
  )
}

export { LatestUpdateList }
export default LatestUpdateList
