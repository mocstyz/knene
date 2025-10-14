/**
 * @fileoverview 专题列表组件
 * @description 遵循DDD架构原则，提供专题列表的展示功能，支持分页、网格布局等功能
 * 封装分页逻辑和网格布局，简化页面组件的复杂度
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Button } from '@components/atoms'
import { TopicCard } from '@components/domains'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 专题数据类型定义
 */
export interface Topic {
  id: string
  title: string
  imageUrl: string
  description?: string
  type?: 'Movie' | 'TV Show' | 'Collection'
  isNew?: boolean
  newType?: 'new' | 'update' | 'today' | 'latest'
}

/**
 * 分页配置类型
 */
export interface PaginationConfig {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage?: number
}

/**
 * 响应式网格列配置
 */
export type ResponsiveColumns = {
  sm?: number
  md?: number
  lg?: number
  xl?: number
  '2xl'?: number
}

/**
 * 专题列表组件属性接口
 */
export interface TopicListProps {
  /** 专题数据列表 */
  topics: Topic[]
  /** 分页配置 */
  pagination?: PaginationConfig
  /** 布局变体 */
  variant?: 'grid' | 'list'
  /** 响应式网格列配置 */
  columns?: ResponsiveColumns
  /** 自定义CSS类名 */
  className?: string
  /** 是否显示专题卡片悬停效果 */
  hoverEffect?: boolean
  /** 是否显示悬停遮罩 */
  showHoverOverlay?: boolean
  /** 专题卡片点击事件 */
  onTopicClick?: (topic: Topic) => void
  /** 列表标题 */
  title?: string
  /** 是否显示更多链接 */
  showMoreLink?: boolean
  /** 更多链接URL */
  moreLinkUrl?: string
  /** 更多链接文本 */
  moreLinkText?: string
}

/**
 * 专题列表组件
 *
 * 提供专题列表的完整展示功能，包含分页控制、网格布局和交互效果
 */
const TopicList: React.FC<TopicListProps> = ({
  topics,
  pagination,
  variant = 'grid',
  columns = { sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6 },
  className,
  hoverEffect = true,
  onTopicClick,
  title,
  showMoreLink = false,
  moreLinkUrl,
  moreLinkText = '查看更多',
}) => {
  // 生成响应式网格类名
  const getGridClasses = () => {
    const columnClasses = []

    if (columns.sm) columnClasses.push(`sm:grid-cols-${columns.sm}`)
    if (columns.md) columnClasses.push(`md:grid-cols-${columns.md}`)
    if (columns.lg) columnClasses.push(`lg:grid-cols-${columns.lg}`)
    if (columns.xl) columnClasses.push(`xl:grid-cols-${columns.xl}`)
    if (columns['2xl']) columnClasses.push(`2xl:grid-cols-${columns['2xl']}`)

    return columnClasses.join(' ')
  }

  // 生成分页可见页码逻辑
  const getVisiblePages = () => {
    if (!pagination) return []

    const { currentPage, totalPages } = pagination
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      // 如果总页数不超过7页，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 总页数超过7页时的智能显示逻辑
      if (currentPage <= 4) {
        // 当前页在前面时：1 2 3 4 5 ... last
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        // 当前页在后面时：1 ... last-4 last-3 last-2 last-1 last
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // 当前页在中间时：1 ... current-1 current current+1 ... last
        pages.push(1)
        pages.push('...')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  // 处理分页事件
  const handlePageChange = (page: number) => {
    pagination?.onPageChange(page)
  }

  const handlePreviousPage = () => {
    if (pagination && pagination.currentPage > 1) {
      pagination.onPageChange(pagination.currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (pagination && pagination.currentPage < pagination.totalPages) {
      pagination.onPageChange(pagination.currentPage + 1)
    }
  }

  // 获取当前页显示的数据
  const getCurrentPageTopics = () => {
    if (!pagination) return topics

    const { currentPage, itemsPerPage = 12 } = pagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return topics.slice(startIndex, endIndex)
  }

  return (
    <div className={cn('w-full space-y-8', className)}>
      {/* 标题区域 */}
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-text-light dark:text-text-dark tracking-light text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            {title}
          </h2>
          {showMoreLink && moreLinkUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(moreLinkUrl, '_self')}
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              {moreLinkText}
            </Button>
          )}
        </div>
      )}

      {/* 专题网格 */}
      {variant === 'grid' && (
        <div className={cn('grid grid-cols-1 gap-4', getGridClasses())}>
          {getCurrentPageTopics().map(topic => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onClick={() => onTopicClick?.(topic)}
              hoverEffect={hoverEffect}
            />
          ))}
        </div>
      )}

      {/* 列表布局 */}
      {variant === 'list' && (
        <div className="space-y-4">
          {getCurrentPageTopics().map(topic => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onClick={() => onTopicClick?.(topic)}
              hoverEffect={hoverEffect}
            />
          ))}
        </div>
      )}

      {/* 分页组件 */}
      {pagination && (
        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
          {/* 上一页按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreviousPage}
            disabled={pagination.currentPage === 1}
            className="h-8 w-8 rounded-full p-0 focus:ring-0 focus:ring-offset-0 sm:h-10 sm:w-10"
          >
            <svg
              className="h-4 w-4 sm:h-4.5 sm:w-4.5"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
            </svg>
          </Button>

          {/* 页码按钮 */}
          <div className="flex items-center space-x-1">
            {getVisiblePages().map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-1 text-sm text-gray-500 dark:text-gray-400 sm:px-2"
                  >
                    ...
                  </span>
                )
              }

              return (
                <Button
                  key={page}
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(page as number)}
                  className={cn(
                    'h-8 w-8 rounded-full p-0 text-xs focus:ring-0 focus:ring-offset-0 sm:h-10 sm:w-10 sm:text-sm',
                    pagination.currentPage === page
                      ? 'bg-green-100 text-green-900 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  )}
                >
                  {page}
                </Button>
              )
            })}
          </div>

          {/* 下一页按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={pagination.currentPage === pagination.totalPages}
            className="h-8 w-8 rounded-full p-0 focus:ring-0 focus:ring-offset-0 sm:h-10 sm:w-10"
          >
            <svg
              className="h-4 w-4 sm:h-4.5 sm:w-4.5"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
            </svg>
          </Button>
        </div>
      )}
    </div>
  )
}

export default TopicList
