/**
 * @fileoverview 首页TOP模块组件
 * @description 首页24小时TOP模块的领域组件，展示热门内容。
 * 负责TOP数据的展示、交互和布局，遵循DDD架构的领域组件规范。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { MovieList, type SimpleMovieItem } from '@components/domains'
import type { TopItem as BaseTopItem } from '@types-movie/movie.types'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * TOP项目接口 - 扩展基础接口
 */
export interface TopItem extends BaseTopItem {
  /** TOP模块特定属性可以在这里扩展 */
}

/**
 * 首页TOP模块组件属性接口
 */
export interface TopSectionProps {
  /** TOP数据列表 */
  topItems: TopItem[]
  /** 是否显示更多链接 */
  showMoreLink?: boolean
  /** 更多链接URL */
  moreLinkUrl?: string
  /** 更多链接文本 */
  moreLinkText?: string
  /** TOP卡片点击事件 */
  onTopClick?: (item: TopItem) => void
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
  /** 是否显示评分 */
  showRating?: boolean
  /** 是否显示质量标签 */
  showQuality?: boolean
}

/**
 * 首页TOP模块组件
 *
 * 负责首页24小时TOP模块的完整功能实现，包括：
 * - TOP卡片的网格布局展示
 * - 点击交互和导航
 * - 响应式布局适配
 * - 更多链接跳转
 * - 排名、评分和质量显示控制
 */
const TopSection: React.FC<TopSectionProps> = ({
  topItems,
  showMoreLink = false,
  moreLinkUrl = '#',
  moreLinkText = 'More >',
  onTopClick,
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
  showRating = true,
  showQuality = true,
}) => {
  // 容器样式类
  const containerClasses = cn('space-y-4 min-w-[320px]', className)

  return (
    <section className={containerClasses}>
      {/* 标题和更多链接 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">24小时TOP</h2>
        {showMoreLink && (
          <a
            href={moreLinkUrl}
            className="text-primary transition-colors hover:underline"
          >
            {moreLinkText}
          </a>
        )}
      </div>

      {/* TOP列表 */}
      <MovieList
        movies={topItems}
        showMoreLink={false}
        cardVariant="simple"
        variant={variant}
        columns={columns}
        onMovieClick={
          onTopClick
            ? (item: SimpleMovieItem) => onTopClick(item as TopItem)
            : undefined
        }
        cardConfig={{
          showRatingBadge: showRating,
          showQualityBadge: showQuality,
          showVipBadge: true,
          showNewBadge: true, // 显示新增标签
          // 不硬编码newBadgeType，让组件根据数据中的newType动态显示
        }}
      />
    </section>
  )
}

export default TopSection
