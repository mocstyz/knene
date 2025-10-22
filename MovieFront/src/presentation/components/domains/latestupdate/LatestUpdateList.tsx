/**
 * @fileoverview 最新更新列表组件
 * @description 基于内容渲染器抽象层的最新更新列表组件，支持多种内容类型的混合展示。
 *              使用MixedContentList实现真正的内容类型无关渲染，支持电影、写真、合集等混合内容。
 *              采用内容渲染器架构设计，自动选择最佳渲染器进行内容展示。
 * @author mosctz
 * @since 1.0.0
 * @version 2.0.0
 */

import { MixedContentList } from '@components/domains/shared'
import { BaseList } from '@components/domains/shared'
import {
  RendererConfig,
  BaseContentItem,
} from '@components/domains/shared/content-renderers'
import type { LatestItem } from '@types-movie'
import { toUnifiedContentItem } from '@types-movie'
import type { UnifiedCardConfig } from '@types-unified'
import React, { useMemo } from 'react'

// 最新更新列表组件属性接口，定义最新更新列表组件的所有配置选项
export interface LatestUpdateListProps {
  latestItems: LatestItem[] // 最新更新数据列表
  onLatestClick?: (item: LatestItem) => void // 最新更新卡片点击事件
  className?: string // 自定义CSS类名
  variant?: 'grid' | 'list' // 布局变体
  columns?: {
    xs?: number // 超小屏幕列数
    sm?: number // 小屏幕列数
    md?: number // 中等屏幕列数
    lg?: number // 大屏幕列数
    xl?: number // 超大屏幕列数
    xxl?: number // 超超大屏幕列数
  } // 响应式列数配置
  cardConfig?: {
    showRatingBadge?: boolean // 是否显示评分标签
    showQualityBadge?: boolean // 是否显示质量标签
    showVipBadge?: boolean // 是否显示VIP标签
    showNewBadge?: boolean // 是否显示新片标签
    aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' // 宽高比
    hoverEffect?: boolean // 悬停效果
  } // 卡片配置
  enableMixedContent?: boolean // 是否启用混合内容模式
  allowedContentTypes?: string[] // 允许的内容类型列表
  showContentTypeLabels?: boolean // 是否显示内容类型标签
  debug?: boolean // 调试模式
}

// 最新更新列表组件，采用内容渲染器架构设计，使用MixedContentList提供统一的混合内容渲染
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
  // 转换最新更新数据为统一内容项格式 - 使用useMemo缓存
  const contentItems = useMemo(() => {
    return (latestItems || []).map(toUnifiedContentItem)
  }, [latestItems]) as BaseContentItem[]

  // 构建渲染器配置 - 使用useMemo缓存
  const { defaultRendererConfig, rendererConfigs } = useMemo(() => {
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

    return { defaultRendererConfig, rendererConfigs }
  }, [cardConfig])

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
        onItemClick={(item: BaseContentItem) => {
          // 查找与当前BaseContentItem对应的原始LatestItem
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
          message: '暂无数据',
        }}
      />
    )
  }

  // 使用混合内容列表渲染
  return (
    <MixedContentList
      items={contentItems}
      onItemClick={item => {
        // 查找与当前BaseContentItem对应的原始LatestItem
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
        message: '暂无数据',
      }}
    />
  )
}

export { LatestUpdateList }
export default LatestUpdateList
