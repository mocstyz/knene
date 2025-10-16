/**
 * @fileoverview 热门列表组件
 * @description 基于内容渲染器抽象层的热门列表组件，支持多种内容类型的混合展示。
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
import type { HotItem } from '@infrastructure/repositories/HomeRepository'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 扩展的热门项目接口
 * 支持多种内容类型的热门项目
 */
export interface HotItemExtended extends HotItem {
  /** 内容类型 - 用于内容渲染器选择 */
  contentType?: 'movie' | 'photo' | 'collection'
  /** 热度排名 */
  rank?: number
  /** 热度分数 */
  hotScore?: number
  /** 24小时内访问次数 */
  viewCount24h?: number
  /** 上升排名 */
  rankChange?: number
}

/**
 * 热门列表组件属性接口
 */
export interface HotListProps {
  /** 热门数据列表 */
  hotItems: HotItem[]
  /** 热门卡片点击事件 */
  onHotClick?: (item: HotItem) => void
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
  /** 是否显示热度排名 */
  showRank?: boolean
  /** 是否显示热度分数 */
  showHotScore?: boolean
  /** 调试模式 */
  debug?: boolean
}

/**
 * 热门列表组件
 *
 * 采用内容渲染器架构设计：
 * - MixedContentList: 提供统一的混合内容渲染
 * - 支持电影、写真、合集等多种内容类型
 * - 自动选择最佳渲染器进行内容展示
 * - 支持热度排名和热度分数显示
 */
const HotList: React.FC<HotListProps> = ({
  hotItems,
  onHotClick,
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
  showRank = true,
  showHotScore = false,
  debug = false,
}) => {
  // 转换热门数据为统一内容项格式
  const convertToContentItems = (items: HotItem[]): BaseContentItem[] => {
    return items.map((item, index) => {
      // 根据数据特征推断内容类型
      let contentType: 'movie' | 'photo' | 'collection' = 'movie' // 默认为电影

      const extendedItem = item as HotItemExtended
      if (extendedItem.contentType) {
        contentType = extendedItem.contentType
      } else {
        // 基于数据特征自动推断内容类型
        if (item.formatType || isPhotoContentItem(item)) {
          contentType = 'photo'
        } else if (item.itemCount || isCollectionContentItem(item)) {
          contentType = 'collection'
        } else {
          contentType = 'movie'
        }
      }

      // 构建基础内容项
      const baseContentItem: BaseContentItem = {
        id: item.id,
        title: item.title,
        contentType,
        description: item.description,
        imageUrl: item.imageUrl,
        alt: item.alt,
        createdAt: new Date().toISOString(),
      }

      // 根据内容类型添加特定属性
      if (contentType === 'movie') {
        const movieItem: MovieContentItem = {
          ...baseContentItem,
          contentType: 'movie',
          year: item.year,
          rating: item.rating ? parseFloat(item.rating) : undefined,
          ratingColor: item.ratingColor === 'purple' ? 'red' :
                       item.ratingColor === 'white' ? 'default' :
                       item.ratingColor || 'default',
          quality: item.quality,
          isNew: item.isNew,
          newType: item.newType || 'new',
          isVip: true, // 默认为VIP
        }
        return movieItem
      } else if (contentType === 'photo') {
        const photoItem: PhotoContentItem = {
          ...baseContentItem,
          contentType: 'photo',
          formatType: item.formatType,
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
          itemCount: item.itemCount,
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
  const contentItems = convertToContentItems(hotItems || [])

  // 构建渲染器配置
  const defaultRendererConfig: Partial<RendererConfig> = {
    hoverEffect: cardConfig.hoverEffect,
    aspectRatio: cardConfig.aspectRatio,
    showVipBadge: cardConfig.showVipBadge,
    showNewBadge: cardConfig.showNewBadge,
    showQualityBadge: cardConfig.showQualityBadge,
    showRatingBadge: cardConfig.showRatingBadge,
    extraOptions: {
      showRank: showRank,
      showHotScore: showHotScore,
    },
  }

  // 内容类型特定的渲染器配置
  const rendererConfigs: Record<string, Partial<RendererConfig>> = {
    movie: {
      ...defaultRendererConfig,
      extraOptions: {
        showYear: true,
        showDuration: true,
        showGenres: false,
        showRank: showRank,
        showHotScore: showHotScore,
      },
    },
    photo: {
      ...defaultRendererConfig,
      showRatingBadge: false, // 写真默认不显示评分
      extraOptions: {
        showModel: true,
        showResolution: true,
        titleHoverEffect: true,
        showRank: showRank,
        showHotScore: showHotScore,
      },
    },
    collection: {
      ...defaultRendererConfig,
      showQualityBadge: false, // 合集默认不显示质量徽章
      extraOptions: {
        showItemCount: true,
        showCreator: true,
        showTags: false,
        showRank: showRank,
        showHotScore: showHotScore,
      },
    },
  }

  if (debug) {
    console.log('HotList: Debug info:', {
      originalItems: hotItems?.length || 0,
      convertedItems: contentItems.length,
      byContentType: contentItems.reduce((acc, item) => {
        acc[item.contentType] = (acc[item.contentType] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      enableMixedContent,
      allowedContentTypes,
      showRank,
      showHotScore,
    })
  }

  // 使用混合内容列表渲染
  return (
    <MixedContentList
      items={contentItems}
      onItemClick={onHotClick}
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
        message: '暂无热门内容',
        description: '目前没有24小时内的热门内容，请稍后再来查看',
      }}
    />
  )
}

export { HotList }
export default HotList
