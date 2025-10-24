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

// 影片合集列表组件属性接口，定义CollectionList组件的所有配置选项，支持多种布局变体、响应式列数配置、卡片样式定制，提供完整的影片合集展示和交互能力
export interface CollectionListProps {
  collections: CollectionItem[]
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
  loading?: boolean
  isPageChanging?: boolean
}

// 影片合集列表组件，提供影片合集的完整列表功能，使用内容渲染器系统支持多种布局和交互
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
  moreLinkText,
  loading = false,
  isPageChanging = false,
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
        items={collections}
        variant={variant}
        columns={columns}
        loading={loading}
        isPageChanging={isPageChanging}
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
    </div>
  )
}

export { CollectionList }
export default CollectionList
