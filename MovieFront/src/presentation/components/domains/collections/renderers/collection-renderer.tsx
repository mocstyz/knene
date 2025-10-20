/**
 * @fileoverview 合集内容渲染器实现
 * @description 基于内容渲染器抽象层的合集内容渲染器。
 *              使用现有的CollectionLayer组件进行渲染，与CollectionCard保持一致的功能。
 * @created 2025-10-19 16:45:28
 * @updated 2025-10-19 16:45:28
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */


import { CollectionLayer } from '@components/domains/collections/components'
import {
  BaseContentRenderer,
  BaseContentItem,
  ContentRenderer,
  RendererConfig,
  ValidationResult,
} from '@components/domains/shared/content-renderers'
import { CardHoverLayer, ImageLayer, NewBadgeLayer, VipBadgeLayer } from '@components/layers'
import { cn } from '@utils/cn'
import React from 'react'

// 合集内容项接口，扩展基础内容项，添加合集特有属性
export interface CollectionContentItem extends BaseContentItem {
  contentType: 'collection' // 内容类型固定为 'collection'
  collectionDescription?: string // 合集描述
  itemCount?: number // 合集中的项目数量
  collectionType?: 'movie' | 'photo' | 'mixed' // 合集类型
  category?: string // 合集分类
  creator?: string // 创建者
  tags?: string[] // 合集标签
  coverImages?: string[] // 合集封面图片列表
  totalDuration?: number // 合集播放时长（分钟）
  totalSize?: string // 合集总大小
  rating?: number // 合集评分
  viewCount?: number // 观看次数
  favoriteCount?: number // 收藏次数
  isFeatured?: boolean // 是否为精选合集
  isVip?: boolean // 是否为VIP内容
  isNew?: boolean // 是否为新合集
  newType?: 'hot' | 'latest' | null // 新合集类型，对齐统一类型系统
  publishDate?: string // 发布日期
  lastUpdated?: string // 最后更新时间
}

// 合集内容渲染器，使用CollectionLayer组件渲染合集内容
export class CollectionContentRenderer extends BaseContentRenderer {
  public readonly contentType = 'collection' as const
  public readonly name: string = 'CollectionContentRenderer'
  public readonly version: string = '1.0.0'

  // 具体的渲染实现方法，根据合集内容项和配置渲染React组件
  protected doRender(
    item: BaseContentItem, // 预处理后的合集内容项
    config: RendererConfig // 合并后的配置
  ): React.ReactElement {
    const collectionItem = item as CollectionContentItem

    return (
      <div
        className={this.getClassName(config)}
        style={this.getStyle(config)}
        onClick={this.createClickHandler(collectionItem, config)}
      >
        <CollectionLayer
          collection={{
            id: collectionItem.id,
            title: collectionItem.title,
            description: collectionItem.description,
            imageUrl: collectionItem.imageUrl,
            alt: collectionItem.alt,
          }}
          aspectRatio={config.aspectRatio}
          showHover={config.hoverEffect}
          showVipBadge={config.showVipBadge}
          showNewBadge={config.showNewBadge}
          isVip={collectionItem.isVip}
          isNew={collectionItem.isNew}
          newBadgeType={collectionItem.newType || 'latest'}
          hoverEffect={{
            enabled: config.hoverEffect,
            hoverColor: 'red',
            transitionDuration: '200ms',
          }}
        />
      </div>
    )
  }

  // 验证合集特定字段，检查内容项的有效性和完整性
  protected validateSpecificFields(item: BaseContentItem): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // 合集特定验证
    if (item.contentType !== 'collection') {
      errors.push(
        `Invalid content type: expected 'collection', got '${item.contentType}'`
      )
    }

    const collectionItem = item as CollectionContentItem

    // 检查项目数量
    if (collectionItem.itemCount !== undefined) {
      if (collectionItem.itemCount < 0) {
        errors.push(`Invalid item count: ${collectionItem.itemCount}`)
      } else if (collectionItem.itemCount === 0) {
        warnings.push('Collection has no items')
      }
    }

    // 检查合集类型
    if (collectionItem.collectionType) {
      const validTypes = ['movie', 'photo', 'mixed']
      if (!validTypes.includes(collectionItem.collectionType)) {
        warnings.push(`Unknown collection type: ${collectionItem.collectionType}`)
      }
    }

    // 检查评分范围
    if (collectionItem.rating !== undefined) {
      if (collectionItem.rating < 0 || collectionItem.rating > 10) {
        errors.push(`Invalid rating: ${collectionItem.rating} (must be 0-10)`)
      }
    }

    // 检查统计数据
    if (collectionItem.viewCount !== undefined && collectionItem.viewCount < 0) {
      warnings.push(`Invalid view count: ${collectionItem.viewCount}`)
    }

    if (collectionItem.favoriteCount !== undefined && collectionItem.favoriteCount < 0) {
      warnings.push(`Invalid favorite count: ${collectionItem.favoriteCount}`)
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // 预处理合集内容项，设置默认值和数据标准化
  protected preprocessItem(
    item: BaseContentItem, // 原始内容项
    config: RendererConfig // 渲染配置
  ): BaseContentItem {
    const collectionItem = { ...item } as CollectionContentItem

    // 设置默认值
    if (!collectionItem.tags) {
      collectionItem.tags = []
    }

    return collectionItem
  }

  // 获取合集渲染器的默认配置，提供合集专用的默认设置
  public getDefaultConfig(): Partial<RendererConfig> {
    return {
      ...super.getDefaultConfig(),
      aspectRatio: 'square' as const,
      showVipBadge: true,
      showNewBadge: true,
      showTitle: true,
      showDescription: true,
      hoverEffect: true,
      showRatingBadge: false, // 合集不显示评分标签
      className: 'collection-content-renderer',
    }
  }

  // 获取合集渲染器支持的配置选项，返回所有支持的配置项列表
  public getSupportedConfigOptions(): string[] {
    return [
      ...super.getSupportedConfigOptions(),
      'showStats',
      'showMetadata',
      'showItemCount',
      'showCreator',
      'showCategory',
      'showDuration',
      'showFileSize',
      'collectionType',
      'overlayStyle',
    ]
  }

  // 创建错误状态的合集组件，当合集渲染出错时显示错误信息
  protected renderErrorItem(
    item: BaseContentItem, // 出错的合集内容项
    config?: RendererConfig, // 渲染配置
    errors: string[] = [] // 错误信息列表
  ): React.ReactElement {
    const collectionItem = item as CollectionContentItem
    const finalConfig = this.mergeConfig(config)

    return (
      <div
        className={this.getClassName(finalConfig)}
        style={this.getStyle(finalConfig)}
        onClick={this.createClickHandler(collectionItem, finalConfig)}
      >
        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 p-4 text-center dark:bg-gray-800">
          {/* 错误图标 */}
          <div className="mb-3 text-red-500">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>

          {/* 合集标题 */}
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            {collectionItem.title || 'Unknown Collection'}
          </h3>

          {/* 合集信息 */}
          {collectionItem.itemCount !== undefined && (
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              {collectionItem.itemCount} 项
            </p>
          )}

          {collectionItem.category && (
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              分类: {collectionItem.category}
            </p>
          )}

          {/* 错误信息 */}
          {errors.length > 0 && (
            <div className="mt-3 rounded bg-red-50 p-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}

          {/* 操作按钮 */}
          {finalConfig.onClick && (
            <button
              onClick={e => {
                e.stopPropagation()
                finalConfig.onClick?.(collectionItem)
              }}
              className="mt-4 rounded bg-blue-500 px-3 py-1 text-xs text-white transition-colors hover:bg-blue-600"
            >
              查看合集
            </button>
          )}
        </div>
      </div>
    )
  }

  // 获取合集专用的CSS类名，生成合集渲染器的样式类
  public getClassName(config: RendererConfig): string {
    return cn(
      super.getClassName(config),
      'collection-content-renderer'
    )
  }
}

// ============================================================================
// 类型守卫函数
// ============================================================================

// 检查内容项是否为合集内容项，通过类型守卫验证数据结构
export function isCollectionContentItem(
  item: any
): item is CollectionContentItem {
  return (
    item &&
    typeof item === 'object' &&
    item.contentType === 'collection' &&
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.imageUrl === 'string'
  )
}

// 创建合集内容项，根据输入数据创建标准的合集内容项对象
export function createCollectionContentItem(
  data: Partial<CollectionContentItem> & { id: string; title: string; imageUrl: string }
): CollectionContentItem {
  return {
    contentType: 'collection',
    ...data,
  }
}

// ============================================================================
// 导出
// ============================================================================

export default CollectionContentRenderer