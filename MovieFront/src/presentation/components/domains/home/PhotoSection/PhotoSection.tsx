/**
 * @fileoverview 首页写真模块组件
 * @description 首页写真模块的领域组件，展示电影写真内容。
 * 负责写真数据的展示、交互和布局，遵循DDD架构的领域组件规范。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { MovieList, type SimpleMovieItem } from '@components/domains'
import type { PhotoItem as BasePhotoItem } from '@types-movie/movie.types'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 写真项目接口 - 扩展基础接口
 */
export interface PhotoItem extends BasePhotoItem {
  /** 写真模块特定属性可以在这里扩展 */
}

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
  }
  /** 是否显示评分 */
  showRating?: boolean
}

/**
 * 首页写真模块组件
 *
 * 负责首页写真模块的完整功能实现，包括：
 * - 写真卡片的网格布局展示
 * - 点击交互和导航
 * - 响应式布局适配
 * - 更多链接跳转
 * - 评分显示控制
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
    lg: 6,
    xl: 6,
  },
  showRating = false,
}) => {
  // 容器样式类
  const containerClasses = cn('space-y-4 min-w-[320px]', className)

  return (
    <section className={containerClasses}>
      {/* 标题和更多链接 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">写真</h2>
        {showMoreLink && (
          <a
            href={moreLinkUrl}
            className="text-primary transition-colors hover:underline"
          >
            {moreLinkText}
          </a>
        )}
      </div>

      {/* 写真列表 */}
      <MovieList
        movies={photos}
        showMoreLink={false}
        cardVariant="simple"
        variant={variant}
        columns={columns}
        onMovieClick={
          onPhotoClick
            ? (item: SimpleMovieItem) => onPhotoClick(item as PhotoItem)
            : undefined
        }
        cardConfig={{
          showRatingBadge: showRating, // 根据参数决定是否显示评分标签
          showQualityBadge: true, // 显示质量标签（格式类型）
          showVipBadge: true, // 显示VIP标签
          // 不硬编码qualityText，让组件根据数据中的formatType动态显示
        }}
      />
    </section>
  )
}

export default PhotoSection
