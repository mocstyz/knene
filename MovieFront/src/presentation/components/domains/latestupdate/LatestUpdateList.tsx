/**
 * @fileoverview 最新更新列表组件
 * @description 基于内容渲染器抽象层的最新更新列表组件，支持多种内容类型的混合展示。
 * 使用MixedContentList实现真正的内容类型无关渲染，支持电影、写真、合集等混合内容。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 2.0.0
 */

import { MixedContentList } from '@components/domains/shared'
import {
  BaseContentItem,
  MovieContentItem,
  PhotoContentItem,
  CollectionContentItem,
  RendererConfig,
  isMovieContentItem,
  isPhotoContentItem,
  isCollectionContentItem,
} from '@components/domains/shared/content-renderers'
import type { LatestItem as BaseLatestItem } from '@types-movie/movie.types'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 扩展的最新更新项目接口
 * 支持多种内容类型的最新更新项目
 */
export interface LatestItem extends BaseLatestItem {
  /** 内容类型 - 用于内容渲染器选择 */
  contentType?: 'movie' | 'photo' | 'collection'
  /** 最新更新模块特定属性可以在这里扩展 */
  /** 更新时间 */
  updatedAt?: string
  /** 更新类型 */
  updateType?: 'new' | 'update' | 'episode' | 'version'
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
  /** 是否启用混合内容模式 */
  enableMixedContent?: boolean
  /** 允许的内容类型列表 */
  allowedContentTypes?: string[]
  /** 是否显示内容类型标签 */
  showContentTypeLabels?: boolean
  /** 调试模式 */
  debug?: boolean
}

/**
 * 最新更新列表组件
 *
 * 采用内容渲染器架构设计：
 * - MixedContentList: 提供统一的混合内容渲染
 * - 支持电影、写真、合集等多种内容类型
 * - 自动选择最佳渲染器进行内容展示
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
  enableMixedContent = true,
  allowedContentTypes = ['movie', 'photo', 'collection'],
  showContentTypeLabels = false,
  debug = false,
}) => {
  // 转换最新更新数据为统一内容项格式
  const convertToContentItems = (items: LatestItem[]): BaseContentItem[] => {
    return items.map(item => {
      // 根据数据特征推断内容类型
      let contentType: 'movie' | 'photo' | 'collection' = 'movie' // 默认为电影

      if (item.contentType) {
        contentType = item.contentType
      } else {
        // 由于LatestItem接口没有formatType和itemCount属性，无法基于数据特征自动推断
        // 这里简化逻辑，默认都作为movie处理，实际项目中可以根据其他特征判断
        contentType = 'movie'
      }

      // 构建基础内容项
      const baseContentItem: BaseContentItem = {
        id: item.id,
        title: item.title,
        contentType,
        description: item.description,
        imageUrl: item.imageUrl,
        alt: item.alt,
        createdAt: item.updatedAt || new Date().toISOString(),
      }

      // 根据内容类型添加特定属性
      if (contentType === 'movie') {
        const movieItem: MovieContentItem = {
          ...baseContentItem,
          contentType: 'movie',
          year: undefined, // LatestItem doesn't have year property
          rating: item.rating ? parseFloat(item.rating) : undefined,
          ratingColor:
            item.ratingColor === 'purple'
              ? 'red'
              : item.ratingColor === 'white'
                ? 'default'
                : item.ratingColor || 'default',
          quality: item.quality,
          isNew: item.isNew,
          newType: item.newType || 'new', // LatestItem has newType property
          isVip: true, // 默认为VIP
        }
        return movieItem
      } else if (contentType === 'photo') {
        const photoItem: PhotoContentItem = {
          ...baseContentItem,
          contentType: 'photo',
          formatType: undefined, // LatestItem doesn't have formatType property
          rating: item.rating ? parseFloat(item.rating) : undefined,
          isNew: item.isNew,
          newType: item.newType || 'new',
          isVip: true,
        }
        return photoItem
      } else if (contentType === 'collection') {
        const collectionItem: CollectionContentItem = {
          ...baseContentItem,
          contentType: 'collection',
          collectionDescription: item.description,
          itemCount: undefined, // LatestItem doesn't have itemCount property
          isNew: item.isNew,
          newType: item.newType || 'new',
          isVip: true,
        }
        return collectionItem
      }

      return baseContentItem
    })
  }

  // 转换数据
  const contentItems = convertToContentItems(latestItems || [])

  // 构建渲染器配置
  const defaultRendererConfig: Partial<RendererConfig> = {
    hoverEffect: cardConfig.hoverEffect,
    aspectRatio: cardConfig.aspectRatio,
    showVipBadge: cardConfig.showVipBadge,
    showNewBadge: cardConfig.showNewBadge,
    showQualityBadge: cardConfig.showQualityBadge,
    showRatingBadge: cardConfig.showRatingBadge,
  }

  // 内容类型特定的渲染器配置
  const rendererConfigs: Record<string, Partial<RendererConfig>> = {
    movie: {
      ...defaultRendererConfig,
      extraOptions: {
        showYear: true,
        showDuration: true,
        showGenres: false,
      },
    },
    photo: {
      ...defaultRendererConfig,
      showRatingBadge: false, // 写真默认不显示评分
      extraOptions: {
        showModel: true,
        showResolution: true,
        titleHoverEffect: true,
      },
    },
    collection: {
      ...defaultRendererConfig,
      showQualityBadge: false, // 合集默认不显示质量徽章
      extraOptions: {
        showItemCount: true,
        showCreator: true,
        showTags: false,
      },
    },
  }

  if (debug) {
    console.log('LatestUpdateList: Debug info:', {
      originalItems: latestItems?.length || 0,
      convertedItems: contentItems.length,
      byContentType: contentItems.reduce(
        (acc, item) => {
          acc[item.contentType] = (acc[item.contentType] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      ),
      enableMixedContent,
      allowedContentTypes,
    })
  }

  // 如果没有启用混合内容模式，回退到传统渲染方式
  if (!enableMixedContent) {
    // 这里可以保留原有的MovieCard渲染逻辑作为fallback
    // 但为了演示新架构，我们仍然使用MixedContentList
    return (
      <MixedContentList
        items={contentItems}
        onItemClick={item => {
          // Find the original LatestItem that corresponds to this BaseContentItem
          const originalLatestItem = latestItems.find(
            latestItem => latestItem.id === item.id
          )
          if (originalLatestItem) {
            onLatestClick?.(originalLatestItem)
          }
        }}
        className={className}
        variant={variant}
        columns={columns}
        defaultRendererConfig={defaultRendererConfig}
        rendererConfigs={rendererConfigs}
        enableFilter={true}
        allowedContentTypes={allowedContentTypes}
        showContentTypeLabels={showContentTypeLabels}
        debug={debug}
        emptyState={{
          message: '暂无最新更新内容',
          description: '目前没有最新的更新内容，请稍后再来查看',
        }}
      />
    )
  }

  // 使用混合内容列表渲染
  return (
    <MixedContentList
      items={contentItems}
      onItemClick={item => {
        // Find the original LatestItem that corresponds to this BaseContentItem
        const originalLatestItem = latestItems.find(
          latestItem => latestItem.id === item.id
        )
        if (originalLatestItem) {
          onLatestClick?.(originalLatestItem)
        }
      }}
      className={className}
      variant={variant}
      columns={columns}
      defaultRendererConfig={defaultRendererConfig}
      rendererConfigs={rendererConfigs}
      enableFilter={true}
      allowedContentTypes={allowedContentTypes}
      showContentTypeLabels={showContentTypeLabels}
      debug={debug}
      emptyState={{
        message: '暂无最新更新内容',
        description: '目前没有最新的更新内容，请稍后再来查看',
      }}
    />
  )
}

export { LatestUpdateList }
export default LatestUpdateList
