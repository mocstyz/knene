/**
 * @fileoverview 首页最新更新模块组件
 * @description 首页最新更新模块的领域组件，展示最新更新的内容。
 * 负责最新更新数据的展示、交互和布局，遵循DDD架构的领域组件规范。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { MovieList, type SimpleMovieItem } from '@components/domains'
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
 * 首页最新更新模块组件属性接口
 */
export interface LatestSectionProps {
  /** 最新更新数据列表 */
  latestItems: LatestItem[]
  /** 是否显示更多链接 */
  showMoreLink?: boolean
  /** 更多链接URL */
  moreLinkUrl?: string
  /** 更多链接文本 */
  moreLinkText?: string
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
  }
  /** 是否显示评分 */
  showRating?: boolean
  /** 是否显示质量标签 */
  showQuality?: boolean
}

/**
 * 首页最新更新模块组件
 *
 * 负责首页最新更新模块的完整功能实现，包括：
 * - 最新更新卡片的网格布局展示
 * - 点击交互和导航
 * - 响应式布局适配
 * - 更多链接跳转
 * - 评分和质量显示控制
 */
const LatestSection: React.FC<LatestSectionProps> = ({
  latestItems,
  showMoreLink = false,
  moreLinkUrl = '#',
  moreLinkText = 'More >',
  onLatestClick,
  className,
  variant = 'grid',
  columns = {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 6,
    xl: 6,
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
        <h2 className="text-2xl font-bold">最新更新</h2>
        {showMoreLink && (
          <a
            href={moreLinkUrl}
            className="text-primary transition-colors hover:underline"
          >
            {moreLinkText}
          </a>
        )}
      </div>

      {/* 最新更新列表 */}
      <MovieList
        movies={latestItems}
        showMoreLink={false}
        cardVariant="simple"
        variant={variant}
        columns={columns}
        onMovieClick={
          onLatestClick
            ? (item: SimpleMovieItem) => onLatestClick(item as LatestItem)
            : undefined
        }
        cardConfig={{
          showRatingBadge: showRating,
          showQualityBadge: showQuality,
          showVipBadge: true,
          showNewBadge: true,
          // 不硬编码newBadgeType，让组件根据数据中的newType动态显示
        }}
      />
    </section>
  )
}

export default LatestSection
