/**
 * @fileoverview 影片合集列表组件
 * @description 影片合集专用的列表组件，已重构为使用内容渲染器系统。
 * 使用BaseList提供布局，内容渲染器提供合集卡片渲染。
 * 遵循自包含组件设计原则，提供完整的影片合集列表功能。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 3.0.0
 */

import { Button } from '@components/atoms'
import {
  BaseList,
  EmptyState,
  type ResponsiveColumnsConfig,
} from '@components/domains/shared'
import {
  createRendererConfig,
  type RendererConfig,
  createCollectionContentItem,
} from '@components/domains/shared/content-renderers'
import { contentRendererFactory } from '@components/domains/shared/content-renderers/renderer-factory'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 影片合集数据类型定义
 */
export interface Collection {
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
 * 影片合集项目接口
 */
export interface CollectionItem {
  id: string
  title: string
  description?: string
  imageUrl: string
  alt?: string
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
 * 影片合集列表组件属性接口
 */
export interface CollectionListProps {
  /** 影片合集数据列表 */
  collections: CollectionItem[]
  /** 分页配置 */
  pagination?: PaginationConfig
  /** 影片合集卡片点击事件 */
  onCollectionClick?: (collection: CollectionItem) => void
  /** 自定义CSS类名 */
  className?: string
  /** 布局变体 */
  variant?: 'grid' | 'carousel'
  /** 响应式列数配置 */
  columns?: ResponsiveColumnsConfig
  /** 卡片配置 */
  cardConfig?: {
    /** 是否显示VIP标签 */
    showVipBadge?: boolean
    /** 是否显示新片标签 */
    showNewBadge?: boolean
    /** 宽高比 */
    aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape'
    /** 悬停效果 */
    hoverEffect?: boolean
  }
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
 * 影片合集列表组件
 *
 * 提供影片合集的完整列表功能，使用内容渲染器系统：
 * - 使用BaseList提供统一布局
 * - 使用CollectionContentRenderer提供影片合集卡片渲染
 * - 支持响应式列数配置
 * - 自包含的交互和视觉效果
 * - 使用统一的内容渲染器架构，支持扩展和定制
 */
const CollectionList: React.FC<CollectionListProps> = ({
  collections,
  pagination,
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
  cardConfig = {
    showVipBadge: true,
    showNewBadge: true,
    aspectRatio: 'portrait',
    hoverEffect: true,
  },
  title,
  showMoreLink = false,
  moreLinkUrl,
  moreLinkText = '查看更多',
}) => {
  // 防御性检查 - 如果collections是undefined或空数组，显示空状态
  if (!collections || !Array.isArray(collections) || collections.length === 0) {
    return (
      <div className={cn('w-full space-y-8', className)}>
        {title && (
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{title}</h2>
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
        <EmptyState
          message="暂无数据"
          className="w-full"
          size="md"
          variant="center"
        />
      </div>
    )
  }

  // 获取合集内容渲染器
  const collectionRenderer = contentRendererFactory.getRenderer('collection')

  // 根据配置创建渲染器配置
  const rendererConfig = createRendererConfig({
    hoverEffect: cardConfig?.hoverEffect ?? true,
    showVipBadge: cardConfig?.showVipBadge ?? true,
    showNewBadge: cardConfig?.showNewBadge ?? true,
    showQualityBadge: false,
    showRatingBadge: false,
    aspectRatio: cardConfig?.aspectRatio ?? 'portrait',
    onClick: onCollectionClick,
  })

  // 获取当前页显示的数据（如果有分页）
  const getCurrentPageCollections = () => {
    if (!pagination) return collections

    const { currentPage, itemsPerPage = 12 } = pagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return collections.slice(startIndex, endIndex)
  }

  return (
    <div className={cn('w-full space-y-8', className)}>
      {/* 标题区域 */}
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
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

      {/* 影片合集列表 - 使用内容渲染器系统 */}
      <BaseList
        variant={variant}
        columns={columns}
        className="collection-list-container"
        gap="md"
      >
        {getCurrentPageCollections().map(collection => {
          // 将CollectionItem转换为CollectionContentItem
          const collectionContentItem = createCollectionContentItem({
            id: collection.id,
            title: collection.title,
            imageUrl: collection.imageUrl,
            alt: collection.alt,
            description: collection.description,
            isNew: collection.isNew,
            newType: collection.newType,
            isVip: false, // 合集通常不需要VIP标记
          })

          // 使用内容渲染器渲染合集项目
          return (
            <div key={collection.id}>
              {collectionRenderer?.render(
                collectionContentItem,
                rendererConfig
              )}
            </div>
          )
        })}
      </BaseList>

      {/* 分页组件 */}
      {pagination && (
        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
          {/* 上一页按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
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
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              page => (
                <Button
                  key={page}
                  variant="ghost"
                  size="sm"
                  onClick={() => pagination.onPageChange(page)}
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
            )}
          </div>

          {/* 下一页按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
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

export { CollectionList }
export default CollectionList
