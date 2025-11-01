/**
 * @fileoverview 写真内容渲染器实现
 * @description 基于内容渲染器抽象层的写真内容渲染器。
 *              使用现有的Layer组件组合进行渲染，与PhotoCard保持一致的功能。
 *              提供写真内容的完整渲染逻辑，包括数据验证、预处理、错误处理等功能。
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */


import { PhotoLayer } from '@components/domains/photo/components'
import {
  BaseContentRenderer,
  BaseContentItem,
  ContentRenderer,
  RendererConfig,
  ValidationResult,
} from '@components/domains/shared/content-renderers'
import { cn } from '@utils/cn'
import React from 'react'

// 写真内容项接口，扩展基础内容项，添加写真特有属性
export interface PhotoContentItem extends BaseContentItem {
  contentType: 'photo' // 内容类型固定为 'photo'
  formatType?: 'JPEG高' | 'PNG' | 'WebP' | 'GIF' | 'BMP' // 图片格式类型
  resolution?: string // 图片分辨率
  fileSize?: string // 图片大小
  imageAspectRatio?: string // 图片宽高比
  camera?: string // 拍摄设备
  location?: string // 拍摄地点
  shootDate?: string // 拍摄时间
  model?: string // 模特信息
  photographer?: string // 摄影师
  tags?: string[] // 图片标签
  rating?: number // 评分
  ratingColor?: 'default' | 'green' | 'blue' | 'cyan' | 'yellow' | 'orange' | 'red' // 评分颜色
  isNew?: boolean // 是否为新内容
  newType?: 'hot' | 'latest' | null // 新项目类型标识，对齐统一类型系统
  isVip?: boolean // 是否为VIP内容
  isAdult?: boolean // 是否包含成人内容
}

// 写真内容渲染器，使用Layer组件组合渲染写真内容
export class PhotoContentRenderer extends BaseContentRenderer {
  public readonly contentType = 'photo' as const
  public readonly name: string = 'PhotoContentRenderer'
  public readonly version: string = '1.0.0'

  // 具体的渲染实现方法，使用PhotoLayer组件渲染写真内容
  protected doRender(
    item: BaseContentItem,
    config: RendererConfig
  ): React.ReactElement {
    const photoItem = item as PhotoContentItem

    // 调试输出：检查渲染器接收到的数据
    console.log('PhotoRenderer - Rendering photo:', {
      id: photoItem.id,
      title: photoItem.title,
      isNew: photoItem.isNew,
      newType: photoItem.newType,
      showNewBadge: config.showNewBadge
    })

    return (
      <div
        className={this.getClassName(config)}
        style={this.getStyle(config)}
        onClick={this.createClickHandler(photoItem, config)}
      >
        <PhotoLayer
          photo={{
            id: photoItem.id,
            title: photoItem.title,
            imageUrl: photoItem.imageUrl,
            alt: photoItem.alt,
            tags: photoItem.tags,
            formatType: photoItem.formatType,
            resolution: photoItem.resolution,
            fileSize: photoItem.fileSize,
            camera: photoItem.camera,
            location: photoItem.location,
            shootDate: photoItem.shootDate,
            model: photoItem.model,
            photographer: photoItem.photographer,
            rating: photoItem.rating,
            isNew: photoItem.isNew,
            newType: photoItem.newType,
          }}
          variant="default"
          showHover={config.hoverEffect}
          showVipBadge={config.showVipBadge}
          showQualityBadge={config.showQualityBadge}
          showNewBadge={config.showNewBadge}
          showMetadata={config.showMetadata}
          newBadgeType={photoItem.newType || 'latest'}
          isVip={photoItem.isVip}
          isNew={photoItem.isNew || false}
        />
      </div>
    )
  }

  // 验证写真特定字段，检查写真数据的合理性和完整性
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
      const validNewTypes = ['hot', 'latest']
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

  // 预处理写真内容项，进行数据标准化和默认值设置
  protected preprocessItem(
    item: BaseContentItem,
    config: RendererConfig
  ): BaseContentItem {
    const photoItem = { ...item } as PhotoContentItem

    // 设置默认值
    if (!photoItem.tags) {
      photoItem.tags = []
    }

    // 将quality字段映射到formatType字段（用于显示质量标签）
    // 如果formatType不存在，尝试从quality或metadata.formatType获取
    if (!photoItem.formatType) {
      // 优先使用metadata.formatType
      if ((item as any).metadata?.formatType) {
        photoItem.formatType = (item as any).metadata.formatType as 'JPEG高' | 'PNG' | 'WebP' | 'GIF' | 'BMP'
      }
      // 其次使用quality字段
      else if ((item as any).quality) {
        photoItem.formatType = (item as any).quality as 'JPEG高' | 'PNG' | 'WebP' | 'GIF' | 'BMP'
      }
      // 最后使用默认值
      else {
        photoItem.formatType = 'JPEG高'
      }
    }

    return photoItem
  }

  // 获取默认配置，返回写真专用的默认设置
  public getDefaultConfig(): Partial<RendererConfig> {
    return {
      aspectRatio: 'portrait',
      hoverEffect: true,
      showVipBadge: true,
      showQualityBadge: true,
      showNewBadge: true,
      showTitle: true,
      showDescription: false,
      showRatingBadge: false, // 写真不显示评分标签
      className: '',
    }
  }

  // 获取支持的配置选项，返回所有支持的配置项列表
  public getSupportedConfigOptions(): string[] {
    return [
      'aspectRatio',
      'hoverEffect',
      'showVipBadge',
      'showQualityBadge',
      'showNewBadge',
      'showTitle',
      'showDescription',
      'className',
      'size',
      'onClick',
      'onView',
      'onDownload',
      'onFavorite',
    ]
  }

  // 渲染错误状态的内容项，当渲染出错时显示错误信息
  protected renderErrorItem(
    item: BaseContentItem,
    config?: RendererConfig,
    errors: string[] = []
  ): React.ReactElement {
    const finalConfig = { ...this.getDefaultConfig(), ...config }

    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-red-300 bg-red-50 p-4 text-center',
          this.getAspectRatioClass(finalConfig.aspectRatio || '2/3'),
          finalConfig.className
        )}
      >
        <div className="mb-2 text-red-500">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div className="text-sm font-medium text-red-700">写真渲染错误</div>
        <div className="mt-1 text-xs text-red-600">
          {errors.length > 0 ? errors[0] : '未知错误'}
        </div>
        {item.title && (
          <div className="mt-2 text-xs text-gray-500">
            标题: {item.title}
          </div>
        )}
      </div>
    )
  }

  // 获取宽高比CSS类名，根据宽高比返回对应的CSS类名
  protected getAspectRatioClass(aspectRatio: string): string {
    const ratioMap: Record<string, string> = {
      '1/1': 'aspect-square',
      '2/3': 'aspect-[2/3]',
      '3/4': 'aspect-[3/4]',
      '4/3': 'aspect-[4/3]',
      '16/9': 'aspect-video',
      '3/2': 'aspect-[3/2]',
    }

    return ratioMap[aspectRatio] || 'aspect-[2/3]'
  }

  // 获取组件CSS类名，返回合并后的CSS类名
  public getClassName(config: RendererConfig): string {
    return cn(
      super.getClassName(config),
      'photo-content-renderer'
    )
  }
}

// 类型守卫函数，检查内容项是否为写真内容项
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

// 创建写真内容项的工厂函数，用于创建新的写真内容项
export function createPhotoContentItem(
  data: Partial<PhotoContentItem> & { id: string; title: string; imageUrl: string }
): PhotoContentItem {
  return {
    contentType: 'photo',
    ...data,
  }
}

export default PhotoContentRenderer
