/**
 * @fileoverview 影片合集列表组件
 * @description 影片合集专用的列表组件，已重构为使用内容渲染器系统。
 *              使用BaseList提供布局，内容渲染器提供合集卡片渲染。
 *              遵循自包含组件设计原则，提供完整的影片合集列表功能。
 *              支持响应式布局、分页、空状态处理和多种显示变体。
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Button } from '@components/atoms'
import { createCollectionContentItem } from '@components/domains/collections/renderers'
import {
  BaseList,
  EmptyState,
  type ResponsiveColumnsConfig,
} from '@components/domains/shared'
import {
  createRendererConfig,
  type RendererConfig,
  type BaseContentItem,
} from '@components/domains/shared/content-renderers'
import { contentRendererFactory } from '@components/domains/shared/content-renderers'
import { RESPONSIVE_CONFIGS } from '@tokens/responsive-configs'
import { cn } from '@utils/cn'
import type { CollectionItem } from '@types-movie'
import React from 'react'

// 影片合集数据类型定义，描述合集的基本信息和类型标识
export interface Collection {
  id: string
  title: string
  imageUrl: string
  description?: string
  type?: 'Movie' | 'TV Show' | 'Collection' // 合集类型标识
  isNew?: boolean
  newType?: 'hot' | 'latest' | null // 新合集类型标识，对齐统一类型系统
}

// 分页配置类型，定义列表分页的基本参数和回调
export interface PaginationConfig {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void // 页码变更回调函数
  itemsPerPage?: number
}

// 影片合集列表组件属性接口，定义CollectionList组件的所有配置选项，支持多种布局变体、响应式列数配置、卡片样式定制和分页功能，提供完整的影片合集展示和交互能力
export interface CollectionListProps {
  collections: CollectionItem[]
  pagination?: PaginationConfig
  onCollectionClick?: (collection: CollectionItem) => void // 影片合集卡片点击事件
  className?: string
  variant?: 'grid' | 'list' // 布局变体
  columns?: ResponsiveColumnsConfig // 响应式列数配置
  cardConfig?: {
    showVipBadge?: boolean // 是否显示VIP标签
    showNewBadge?: boolean // 是否显示新片标签
    aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' // 宽高比配置
    hoverEffect?: boolean // 悬停效果开关
  } // 卡片配置选项
  title?: string
  showMoreLink?: boolean
  moreLinkUrl?: string
  moreLinkText?: string
  loading?: boolean // 加载状态，用于显示加载指示器
  serverPaginated?: boolean // 新增：由服务端/Hook已完成分页时不再二次切片
  isPageChanging?: boolean // 页面切换状态标志，用于优先显示骨架屏
}

// 影片合集列表组件，提供影片合集的完整列表功能，使用内容渲染器系统支持多种布局和交互，使用BaseList提供统一布局，使用CollectionContentRenderer提供影片合集卡片渲染，支持响应式列数配置，自包含的交互和视觉效果，使用统一的内容渲染器架构，支持扩展和定制
const CollectionList: React.FC<CollectionListProps> = ({
  collections,
  cardConfig,
  onCollectionClick,
  variant = 'grid',
  columns = RESPONSIVE_CONFIGS.collection,
  className,
  title,
  showMoreLink,
  moreLinkUrl,
  moreLinkText, // 移除硬编码默认值，使用BaseSection的默认值
  pagination,
  loading = false, // 加载状态，默认为false
  serverPaginated = false, // 新增：默认关闭，保持原行为
  isPageChanging = false, // 页面切换状态，默认为false
}) => {
  // 防御性检查 - 只在非加载状态且数据为空时显示空状态
  if (!loading && !isPageChanging && (!collections || !Array.isArray(collections) || collections.length === 0)) {
    return <EmptyState message="暂无数据" />
  }

  // 获取合集内容渲染器 - 使用工厂模式获取专用渲染器
  const collectionRenderer = contentRendererFactory.getRenderer('collection')

  // 构建渲染器配置 - 根据组件props创建统一的渲染配置
  const rendererConfig = createRendererConfig({
    hoverEffect: cardConfig?.hoverEffect ?? true,
    showVipBadge: cardConfig?.showVipBadge ?? true,
    showNewBadge: cardConfig?.showNewBadge ?? true,
    showQualityBadge: false,
    showRatingBadge: false,
    aspectRatio: cardConfig?.aspectRatio ?? 'square',
    onClick: onCollectionClick as ((item: BaseContentItem) => void) | undefined,
  })

  // 获取当前页显示的数据 - 根据分页配置计算显示范围
  const getCurrentPageCollections = () => {
    // 如果正在加载或页面切换，返回空数组以触发骨架屏
    if (loading || isPageChanging) return []
    
    if (!pagination || serverPaginated) return collections

    const { currentPage, itemsPerPage = 12 } = pagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return collections.slice(startIndex, endIndex)
  }

  return (
    <div className={cn('w-full space-y-8', className)}>
      {/* 标题区域 - 显示列表标题和更多链接 */}
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

      {/* 影片合集列表 - 使用内容渲染器系统渲染合集卡片 */}
      <BaseList
        items={getCurrentPageCollections()}
        variant={variant}
        columns={columns}
        loading={loading} // 传递加载状态给BaseList
        isPageChanging={isPageChanging} // 传递页面切换状态给BaseList
        className="collection-list-container"
        renderItem={(collection) => {
          // 数据转换 - 将CollectionItem转换为CollectionContentItem格式
          const collectionContentItem = createCollectionContentItem({
            id: collection.id,
            title: collection.title,
            imageUrl: collection.imageUrl,
            alt: collection.alt,
            description: collection.description,
            isNew: collection.isNew,
            newType: collection.newType,
            isVip: collection.isVip || false, // 从原始数据中获取VIP状态
          })

          // 渲染合集项目 - 使用内容渲染器统一渲染
          return collectionRenderer?.render(
            collectionContentItem,
            rendererConfig
          )
        }}
      />

      {/* 分页组件 - 提供页码导航功能 */}
      {pagination && (
        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
          {/* 上一页按钮 - 导航到前一页 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1 || loading || isPageChanging}
            className={cn(
              "h-8 w-8 rounded-full p-0 focus:ring-0 focus:ring-offset-0 sm:h-10 sm:w-10",
              (loading || isPageChanging) && "opacity-50 cursor-not-allowed"
            )}
          >
            <svg
              className="h-4 w-4 sm:h-4.5 sm:w-4.5"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
            </svg>
          </Button>

          {/* 页码按钮 - 显示所有页码并支持直接跳转 */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              page => (
                <Button
                  key={page}
                  variant="ghost"
                  size="sm"
                  onClick={() => pagination.onPageChange(page)}
                  disabled={loading || isPageChanging}
                  className={cn(
                    'h-8 w-8 rounded-full p-0 text-xs focus:ring-0 focus:ring-offset-0 sm:h-10 sm:w-10 sm:text-sm',
                    pagination.currentPage === page
                      ? 'bg-green-100 text-green-900 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                    (loading || isPageChanging) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          {/* 下一页按钮 - 导航到后一页 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages || loading || isPageChanging}
            className={cn(
              "h-8 w-8 rounded-full p-0 focus:ring-0 focus:ring-offset-0 sm:h-10 sm:w-10",
              (loading || isPageChanging) && "opacity-50 cursor-not-allowed"
            )}
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
