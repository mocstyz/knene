/**
 * @fileoverview 合集内容渲染器实现
 * @description 基于内容渲染器抽象层的合集内容渲染器。
 * 使用现有的CollectionLayer组件进行渲染，与CollectionCard保持一致的功能。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */


import { BaseContentRenderer } from '@components/domains/shared/content-renderers/base-renderer'
import type {
  BaseContentItem,
  RendererConfig,
  ValidationResult,
} from '@components/domains/shared/content-renderers/interfaces'
import { CollectionLayer } from '@components/layers/CollectionLayer'
import { ImageLayer } from '@components/layers/ImageLayer'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 合集内容项接口
 * 扩展基础内容项，添加合集特有属性
 */
export interface CollectionContentItem extends BaseContentItem {
  /** 内容类型固定为 'collection' */
  contentType: 'collection'
  /** 合集描述 */
  collectionDescription?: string
  /** 合集中的项目数量 */
  itemCount?: number
  /** 合集类型 */
  collectionType?: 'movie' | 'photo' | 'mixed'
  /** 合集分类 */
  category?: string
  /** 创建者 */
  creator?: string
  /** 合集标签 */
  tags?: string[]
  /** 合集封面图片列表 */
  coverImages?: string[]
  /** 合集播放时长（分钟） */
  totalDuration?: number
  /** 合集总大小 */
  totalSize?: string
  /** 合集评分 */
  rating?: number
  /** 合集观看次数 */
  viewCount?: number
  /** 合集收藏次数 */
  favoriteCount?: number
  /** 是否为精选合集 */
  isFeatured?: boolean
  /** 是否为VIP合集 */
  isVip?: boolean
  /** 是否为新合集 */
  isNew?: boolean
  /** 新合集类型 */
  newType?: 'new' | 'update' | 'today' | 'latest'
  /** 合集发布时间 */
  publishDate?: string
  /** 合集最后更新时间 */
  lastUpdated?: string
}

/**
 * 合集内容渲染器
 * 使用CollectionLayer组件渲染合集内容
 */
export class CollectionContentRenderer extends BaseContentRenderer {
  public readonly contentType = 'collection' as const
  public readonly name: string = 'CollectionContentRenderer'
  public readonly version: string = '1.0.0'

  /**
   * 具体的渲染实现方法
   * @param item 预处理后的合集内容项
   * @param config 合并后的配置
   * @returns React组件
   */
  protected doRender(
    item: BaseContentItem,
    config: RendererConfig
  ): React.ReactElement {
    const collectionItem = item as CollectionContentItem

    return (
      <div
        className={cn(
          'collection-content-renderer relative cursor-pointer overflow-hidden rounded-lg transition-transform duration-200 group hover:scale-[1.02] active:scale-[0.98]',
          config.className
        )}
        onClick={this.createClickHandler(collectionItem, config)}
      >
        {/* 背景图片层 */}
        <ImageLayer
          src={collectionItem.imageUrl}
          alt={collectionItem.alt || collectionItem.title}
          aspectRatio={config.aspectRatio || 'portrait'}
          objectFit="cover"
          hoverScale={config.hoverEffect}
          className="absolute inset-0"
        />

        {/* 合集内容覆盖层 */}
        <CollectionLayer
          collection={{
            id: collectionItem.id,
            title: collectionItem.title,
            description:
              collectionItem.collectionDescription ||
              collectionItem.description,
            imageUrl: collectionItem.imageUrl,
            alt: collectionItem.alt,
          }}
          className="relative z-10"
          onClick={() => config.onClick?.(collectionItem)}
          showGradient={true}
          gradientIntensity="strong"
          contentPosition="bottom-left"
          hoverEffect={{
            enabled: config.hoverEffect,
            hoverColor: 'red',
            transitionDuration: '200ms',
          }}
        />
      </div>
    )
  }

  /**
   * 验证合集特定字段
   * @param item 要验证的内容项
   * @returns 验证结果
   */
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

    // 检查项目数量是否合理
    if (collectionItem.itemCount !== undefined) {
      if (collectionItem.itemCount <= 0) {
        errors.push(
          `Invalid item count: ${collectionItem.itemCount} (must be positive)`
        )
      } else if (collectionItem.itemCount > 10000) {
        warnings.push(`Suspicious item count: ${collectionItem.itemCount}`)
      }
    }

    // 检查合集类型
    if (collectionItem.collectionType) {
      const validTypes = ['movie', 'photo', 'mixed']
      if (!validTypes.includes(collectionItem.collectionType)) {
        warnings.push(
          `Unknown collection type: ${collectionItem.collectionType}`
        )
      }
    }

    // 检查评分范围
    if (collectionItem.rating !== undefined) {
      if (collectionItem.rating < 0 || collectionItem.rating > 10) {
        errors.push(`Invalid rating: ${collectionItem.rating} (must be 0-10)`)
      }
    }

    // 检查新片类型
    if (collectionItem.newType) {
      const validNewTypes = ['new', 'update', 'today', 'latest']
      if (!validNewTypes.includes(collectionItem.newType)) {
        warnings.push(`Unknown new type: ${collectionItem.newType}`)
      }
    }

    // 检查日期格式
    if (collectionItem.publishDate) {
      const publishDate = new Date(collectionItem.publishDate)
      if (isNaN(publishDate.getTime())) {
        errors.push(`Invalid publish date: ${collectionItem.publishDate}`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  /**
   * 预处理合集内容项
   * @param item 原始内容项
   * @param config 渲染配置
   * @returns 预处理后的内容项
   */
  protected preprocessItem(
    item: BaseContentItem,
    config: RendererConfig
  ): BaseContentItem {
    const collectionItem = item as CollectionContentItem

    // 数据标准化和默认值设置 - 只设置BaseContentItem中存在的属性
    return {
      ...collectionItem,
    }
  }

  /**
   * 获取合集渲染器的默认配置
   * @returns 默认配置对象
   */
  public getDefaultConfig(): Partial<RendererConfig> {
    return {
      ...super.getDefaultConfig(),
      aspectRatio: 'portrait',
      showVipBadge: true,
      showNewBadge: true,
      showQualityBadge: false, // 合集通常不显示质量徽章
      showRatingBadge: true,
      hoverEffect: true,
      extraOptions: {
        showItemCount: true,
        showCreator: true,
        showTags: false,
        showCategory: false,
      },
    }
  }

  /**
   * 获取合集渲染器支持的配置选项
   * @returns 支持的配置选项列表
   */
  public getSupportedConfigOptions(): string[] {
    return [
      ...super.getSupportedConfigOptions(),
      'showItemCount',
      'showCreator',
      'showTags',
      'showCategory',
      'showDescription',
      'showPublishDate',
      'showViewCount',
      'showFavoriteCount',
      'collectionType',
      'newType',
    ]
  }

  /**
   * 创建错误状态的合集组件
   * @param item 出错的合集内容项
   * @param config 渲染配置
   * @param errors 错误信息列表
   * @returns 错误状态的React组件
   */
  protected renderErrorItem(
    item: BaseContentItem,
    config?: RendererConfig,
    errors: string[] = []
  ): React.ReactElement {
    const collectionItem = item as CollectionContentItem
    const finalConfig = this.mergeConfig(config)

    return (
      <div
        className={cn(
          'relative aspect-[2/3] cursor-pointer overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800',
          finalConfig.className
        )}
        onClick={this.createClickHandler(collectionItem, finalConfig)}
      >
        <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
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

          {/* 创建者信息 */}
          {collectionItem.creator && (
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              创建者: {collectionItem.creator}
            </p>
          )}

          {/* 项目数量 */}
          {collectionItem.itemCount && (
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              {collectionItem.itemCount} 个项目
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

  /**
   * 获取合集专用的CSS类名
   * @param config 渲染配置
   * @returns CSS类名字符串
   */
  protected getClassName(config: RendererConfig): string {
    const baseClasses = super.getClassName(config)
    const collectionSpecificClasses = [
      'collection-content-renderer',
      'transition-all',
      'duration-200',
    ]

    return `${baseClasses} ${collectionSpecificClasses.join(' ')}`
  }
}

// ============================================================================
// 类型守卫函数
// ============================================================================

/**
 * 检查内容项是否为合集内容项
 */
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

/**
 * 创建合集内容项
 */
export function createCollectionContentItem(
  data: Partial<CollectionContentItem>
): CollectionContentItem {
  return {
    id: '',
    title: '',
    contentType: 'collection',
    imageUrl: '',
    ...data,
  }
}

// ============================================================================
// 导出
// ============================================================================

export default CollectionContentRenderer
