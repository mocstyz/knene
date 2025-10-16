/**
 * @fileoverview 写真内容渲染器实现
 * @description 基于内容渲染器抽象层的写真内容渲染器。
 * 使用现有的Layer组件组合进行渲染，与PhotoCard保持一致的功能。
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
import { MovieLayer } from '@components/layers/MovieLayer'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 写真内容项接口
 * 扩展基础内容项，添加写真特有属性
 */
export interface PhotoContentItem extends BaseContentItem {
  /** 内容类型固定为 'photo' */
  contentType: 'photo'
  /** 图片格式类型 */
  formatType?: 'JPEG高' | 'PNG' | 'WebP' | 'GIF' | 'BMP'
  /** 图片分辨率 */
  resolution?: string
  /** 图片大小 */
  fileSize?: string
  /** 图片宽高比 */
  imageAspectRatio?: string
  /** 拍摄设备 */
  camera?: string
  /** 拍摄地点 */
  location?: string
  /** 拍摄时间 */
  shootDate?: string
  /** 模特信息 */
  model?: string
  /** 摄影师 */
  photographer?: string
  /** 图片标签 */
  tags?: string[]
  /** 评分 */
  rating?: number
  /** 评分颜色 */
  ratingColor?:
    | 'default'
    | 'green'
    | 'blue'
    | 'cyan'
    | 'yellow'
    | 'orange'
    | 'red'
  /** 是否为新内容 */
  isNew?: boolean
  /** 新片类型 */
  newType?: 'new' | 'update' | 'today' | 'latest'
  /** 是否为VIP内容 */
  isVip?: boolean
  /** 是否包含成人内容 */
  isAdult?: boolean
}

/**
 * 写真内容渲染器
 * 使用Layer组件组合渲染写真内容
 */
export class PhotoContentRenderer extends BaseContentRenderer {
  public readonly contentType = 'photo' as const
  public readonly name: string = 'PhotoContentRenderer'
  public readonly version: string = '1.0.0'

  /**
   * 具体的渲染实现方法
   * @param item 预处理后的写真内容项
   * @param config 合并后的配置
   * @returns React组件
   */
  protected doRender(
    item: BaseContentItem,
    config: RendererConfig
  ): React.ReactElement {
    const photoItem = item as PhotoContentItem

    return (
      <div
        className={this.getClassName(config)}
        style={this.getStyle(config)}
        onClick={this.createClickHandler(photoItem, config)}
      >
        <MovieLayer
          movie={{
            id: photoItem.id,
            title: photoItem.title,
            poster: photoItem.imageUrl,
            alt: photoItem.alt,
            // 将写真的formatType作为质量标签显示
            quality: photoItem.formatType,
            // 将写真的tags作为分类显示
            genres: photoItem.tags,
          }}
          variant="default"
          onPlay={() => config.onClick?.(photoItem)}
          showHover={config.hoverEffect}
          showVipBadge={config.showVipBadge}
          showQualityBadge={config.showQualityBadge}
          showRatingBadge={false}  // 写真不显示评分标签
          showNewBadge={config.showNewBadge}
          newBadgeType={photoItem.newType}
          qualityText={photoItem.formatType}  // 显示图片格式（如：JPEG高、PNG、WebP）
        />
      </div>
    )
  }

  /**
   * 验证写真特定字段
   * @param item 要验证的内容项
   * @returns 验证结果
   */
  protected validateSpecificFields(item: BaseContentItem): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // 写真特定验证
    if (item.contentType !== 'photo') {
      errors.push(
        `Invalid content type: expected 'photo', got '${item.contentType}'`
      )
    }

    const photoItem = item as PhotoContentItem

    // 检查图片格式
    if (photoItem.formatType) {
      const validFormats = ['JPEG高', 'PNG', 'WebP', 'GIF', 'BMP']
      if (!validFormats.includes(photoItem.formatType)) {
        warnings.push(`Unknown image format: ${photoItem.formatType}`)
      }
    }

    // 检查评分范围
    if (photoItem.rating !== undefined) {
      if (photoItem.rating < 0 || photoItem.rating > 10) {
        errors.push(`Invalid rating: ${photoItem.rating} (must be 0-10)`)
      }
    }

    // 检查评分颜色
    if (photoItem.ratingColor) {
      const validColors = [
        'default',
        'green',
        'blue',
        'cyan',
        'yellow',
        'orange',
        'red',
      ]
      if (!validColors.includes(photoItem.ratingColor)) {
        warnings.push(`Unknown rating color: ${photoItem.ratingColor}`)
      }
    }

    // 检查新片类型
    if (photoItem.newType) {
      const validNewTypes = ['new', 'update', 'today', 'latest']
      if (!validNewTypes.includes(photoItem.newType)) {
        warnings.push(`Unknown new type: ${photoItem.newType}`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  /**
   * 预处理写真内容项
   * @param item 原始内容项
   * @param config 渲染配置
   * @returns 预处理后的内容项
   */
  protected preprocessItem(
    item: BaseContentItem,
    config: RendererConfig
  ): BaseContentItem {
    const photoItem = item as PhotoContentItem

    // 数据标准化和默认值设置 - 只设置BaseContentItem中存在的属性
    return {
      ...photoItem,
    }
  }

  /**
   * 获取写真渲染器的默认配置
   * @returns 默认配置对象
   */
  public getDefaultConfig(): Partial<RendererConfig> {
    return {
      ...super.getDefaultConfig(),
      aspectRatio: 'portrait',
      showVipBadge: true,
      showNewBadge: true,
      showQualityBadge: true,
      showRatingBadge: false, // 写真不显示评分标签
      hoverEffect: true,
    }
  }

  /**
   * 获取写真渲染器支持的配置选项
   * @returns 支持的配置选项列表
   */
  public getSupportedConfigOptions(): string[] {
    return [
      ...super.getSupportedConfigOptions(),
      'showModel',
      'showPhotographer',
      'showResolution',
      'showLocation',
      'showTags',
      'showShootDate',
      'showCamera',
      'showAdultWarning',
      'ratingColor',
      'titleHoverEffect',
    ]
  }

  /**
   * 创建错误状态的写真组件
   * @param item 出错的写真内容项
   * @param config 渲染配置
   * @param errors 错误信息列表
   * @returns 错误状态的React组件
   */
  protected renderErrorItem(
    item: BaseContentItem,
    config?: RendererConfig,
    errors: string[] = []
  ): React.ReactElement {
    const photoItem = item as PhotoContentItem
    const finalConfig = this.mergeConfig(config)
    const aspectRatioClass = this.getAspectRatioClass(
      finalConfig.aspectRatio || 'portrait'
    )

    return (
      <div
        className={cn(
          'relative cursor-pointer overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800',
          aspectRatioClass,
          finalConfig.className
        )}
        onClick={this.createClickHandler(photoItem, finalConfig)}
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* 写真标题 */}
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            {photoItem.title || 'Unknown Photo'}
          </h3>

          {/* 模特信息 */}
          {photoItem.model && (
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              模特: {photoItem.model}
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
                finalConfig.onClick?.(photoItem)
              }}
              className="mt-4 rounded bg-blue-500 px-3 py-1 text-xs text-white transition-colors hover:bg-blue-600"
            >
              查看详情
            </button>
          )}
        </div>
      </div>
    )
  }

  /**
   * 获取写真专用的CSS类名
   * @param config 渲染配置
   * @returns CSS类名字符串
   */
  protected getClassName(config: RendererConfig): string {
    const baseClasses = super.getClassName(config)
    const photoSpecificClasses = [
      'photo-content-renderer',
      'cursor-pointer',
      'group',
      'transition-transform',
      'duration-200',
      'hover:scale-[1.02]',
      'active:scale-[0.98]',
    ]

    return `${baseClasses} ${photoSpecificClasses.join(' ')}`
  }
}

// ============================================================================
// 类型守卫函数
// ============================================================================

/**
 * 检查内容项是否为写真内容项
 */
export function isPhotoContentItem(item: any): item is PhotoContentItem {
  return (
    item &&
    typeof item === 'object' &&
    item.contentType === 'photo' &&
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.imageUrl === 'string'
  )
}

/**
 * 创建写真内容项
 */
export function createPhotoContentItem(
  data: Partial<PhotoContentItem>
): PhotoContentItem {
  return {
    id: '',
    title: '',
    contentType: 'photo',
    imageUrl: '',
    ...data,
  }
}

// ============================================================================
// 导出
// ============================================================================

export default PhotoContentRenderer
