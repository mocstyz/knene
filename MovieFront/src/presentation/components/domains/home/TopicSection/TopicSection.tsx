/**
 * @fileoverview 首页专题模块组件
 * @description 首页专题模块的领域组件，展示精选的专题卡片。
 * 负责专题数据的展示、交互和布局，遵循DDD架构的领域组件规范。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { MovieList } from '@components/domains'
import type {
  SimpleMovieItem,
  TopicItem as BaseTopicItem,
} from '@types-movie/movie.types'
import { cn } from '@utils/cn'
import { Link } from 'react-router-dom'
import React from 'react'

/**
 * 专题项目接口 - 扩展基础接口
 */
export interface TopicItem extends BaseTopicItem {
  /** 专题特定属性可以在这里扩展 */
}

/**
 * 首页专题模块组件属性接口
 */
export interface TopicSectionProps {
  /** 专题数据列表 */
  topics: TopicItem[]
  /** 是否显示更多链接 */
  showMoreLink?: boolean
  /** 更多链接URL */
  moreLinkUrl?: string
  /** 更多链接文本 */
  moreLinkText?: string
  /** 专题卡片点击事件 */
  onTopicClick?: (topic: TopicItem) => void
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
}

/**
 * 首页专题模块组件
 *
 * 负责首页专题模块的完整功能实现，包括：
 * - 专题卡片的网格布局展示
 * - 点击交互和导航
 * - 响应式布局适配
 * - 更多链接跳转
 */
const TopicSection: React.FC<TopicSectionProps> = ({
  topics,
  showMoreLink = false,
  moreLinkUrl = '#',
  moreLinkText = 'More >',
  onTopicClick,
  className,
  variant = 'grid',
  columns = {
    xs: 1,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 3,
  },
}) => {
  // 容器样式类
  const containerClasses = cn('space-y-4 min-w-[320px]', className)

  return (
    <section className={containerClasses}>
      {/* 标题和更多链接 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">专题</h2>
        {showMoreLink && (
          <Link
            to={moreLinkUrl}
            className="text-primary transition-colors hover:underline"
          >
            {moreLinkText}
          </Link>
        )}
      </div>

      {/* 专题列表 - 将 TopicItem 转换为 SimpleMovieItem */}
      <MovieList
        movies={topics.map(
          (topic): SimpleMovieItem => ({
            id: topic.id,
            title: topic.title,
            type: topic.type,
            rating: '', // 专题不需要评分
            imageUrl: topic.imageUrl,
            description: topic.description,
            alt: topic.alt,
          })
        )}
        showMoreLink={false}
        cardVariant="topic"
        variant={variant}
        columns={columns}
        onMovieClick={
          onTopicClick
            ? (item: SimpleMovieItem) =>
                onTopicClick({
                  id: item.id,
                  title: item.title,
                  type: item.type,
                  imageUrl: item.imageUrl,
                  description: item.description,
                  alt: item.alt,
                } as TopicItem)
            : undefined
        }
      />
    </section>
  )
}

export default TopicSection
