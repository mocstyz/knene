/**
 * @fileoverview 内容渲染器基础抽象类
 * @description 提供内容渲染器的通用实现，减少具体实现类的重复代码。
 *              实现模板方法模式，定义算法骨架，子类实现具体步骤。
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import type {
  ContentRenderer,
  BaseContentItem,
  RendererConfig,
  ValidationResult,
  ContentTypeId,
} from '@components/domains/shared/content-renderers/interfaces'
import React from 'react'

// 内容渲染器基础抽象类，提供通用的渲染器实现模板
export abstract class BaseContentRenderer implements ContentRenderer {
  // 子类必须实现的内容类型
  public abstract readonly contentType: ContentTypeId

  // 渲染器名称，默认使用类名
  public readonly name: string

  // 渲染器版本，默认为1.0.0
  public readonly version: string = '1.0.0'

  // 构造函数
  constructor(name?: string, version?: string) {
    this.name = name || this.constructor.name
    this.version = version || '1.0.0'
  }

  // 检查是否支持渲染指定的内容项
  public canRender(item: BaseContentItem): boolean {
    // 基础检查：内容类型匹配
    if (item.contentType !== this.contentType) {
      return false
    }

    // 调用具体实现的验证方法
    const validation = this.validateItem(item)
    return validation.isValid
  }

  // 渲染内容项为React组件，使用模板方法模式，定义渲染流程
  public render(
    item: BaseContentItem,
    config?: RendererConfig
  ): React.ReactElement {
    // 验证内容项
    const validation = this.validateItem(item)
    if (!validation.isValid) {
      console.error(
        `Renderer ${this.name}: Cannot render invalid item:`,
        validation.errors
      )
      return this.renderErrorItem(item, config, validation.errors)
    }

    // 获取合并后的配置
    const finalConfig = this.mergeConfig(config)

    // 预处理内容项
    const processedItem = this.preprocessItem(item, finalConfig)

    // 调用具体渲染方法
    try {
      return this.doRender(processedItem, finalConfig)
    } catch (error) {
      console.error(`Renderer ${this.name}: Error rendering item:`, error)
      return this.renderErrorItem(processedItem, finalConfig, [String(error)])
    }
  }

  // 获取渲染器的默认配置
  public getDefaultConfig(): Partial<RendererConfig> {
    return {
      hoverEffect: true,
      aspectRatio: 'portrait',
      showVipBadge: true,
      showNewBadge: true,
      showQualityBadge: true,
      showRatingBadge: true,
      size: 'md',
    }
  }

  // 验证内容项是否符合渲染器要求
  public validateItem(item: BaseContentItem): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // 基础验证
    if (!item.id) {
      errors.push('Missing required field: id')
    }
    if (!item.title) {
      errors.push('Missing required field: title')
    }
    if (!item.imageUrl) {
      errors.push('Missing required field: imageUrl')
    }
    if (!item.contentType) {
      errors.push('Missing required field: contentType')
    }

    // 类型特定验证
    const specificValidation = this.validateSpecificFields(item)
    errors.push(...specificValidation.errors)
    warnings.push(...specificValidation.warnings)

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // 获取渲染器支持的配置选项
  public getSupportedConfigOptions(): string[] {
    return [
      'hoverEffect',
      'aspectRatio',
      'showVipBadge',
      'showNewBadge',
      'showQualityBadge',
      'showRatingBadge',
      'size',
      'className',
      'onClick',
      'extraOptions',
    ]
  }

  // 抽象方法 - 子类必须实现

  // 具体的渲染实现方法，子类必须实现此方法来提供具体的渲染逻辑
  protected abstract doRender(
    item: BaseContentItem,
    config: RendererConfig
  ): React.ReactElement

  // 验证特定字段的抽象方法，子类可以重写此方法来添加特定于内容类型的验证逻辑
  protected validateSpecificFields(item: BaseContentItem): ValidationResult {
    return { isValid: true, errors: [], warnings: [] }
  }

  // 预处理内容项的抽象方法，子类可以重写此方法来预处理内容项数据
  protected preprocessItem(
    item: BaseContentItem,
    config: RendererConfig
  ): BaseContentItem {
    // 默认不做任何预处理
    return item
  }

  // 通用方法 - 子类可以重写

  // 渲染错误内容项，当内容项验证失败或渲染出错时使用
  protected renderErrorItem(
    item: BaseContentItem,
    config?: RendererConfig,
    errors: string[] = []
  ): React.ReactElement {
    const finalConfig = this.mergeConfig(config)

    return React.createElement(
      'div',
      {
        className: this.getClassName(finalConfig),
        style: this.getStyle(finalConfig),
      },
      React.createElement(
        'div',
        {
          className:
            'flex flex-col items-center justify-center p-4 text-center',
        },
        React.createElement(
          'div',
          { className: 'mb-2 text-red-500' },
          React.createElement(
            'svg',
            {
              className: 'h-8 w-8',
              fill: 'none',
              stroke: 'currentColor',
              viewBox: '0 0 24 24',
            },
            React.createElement('path', {
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: 2,
              d: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            })
          )
        ),
        React.createElement(
          'h3',
          { className: 'mb-1 font-medium text-gray-900 dark:text-gray-100' },
          item.title || 'Unknown Item'
        ),
        errors.length > 0 &&
          React.createElement(
            'p',
            { className: 'text-xs text-red-500' },
            errors[0]
          )
      )
    )
  }

  // 合并配置对象
  public mergeConfig(config?: RendererConfig): RendererConfig {
    const defaultConfig = this.getDefaultConfig()
    return {
      ...defaultConfig,
      ...config,
      extraOptions: {
        ...defaultConfig.extraOptions,
        ...config?.extraOptions,
      },
    } as RendererConfig
  }

  // 获取CSS类名
  public getClassName(config: RendererConfig): string {
    const baseClasses = [
      'content-renderer',
      `content-renderer-${this.contentType}`,
      `content-renderer-${config.size || 'md'}`,
    ]

    if (config.hoverEffect) {
      baseClasses.push('content-renderer-hover')
    }

    if (config.className) {
      baseClasses.push(config.className)
    }

    return baseClasses.join(' ')
  }

  // 获取内联样式
  public getStyle(config: RendererConfig): React.CSSProperties {
    const style: React.CSSProperties = {}

    // 设置宽高比
    if (config.aspectRatio) {
      const aspectRatios = {
        square: '1 / 1',
        video: '16 / 9',
        portrait: '2 / 3',
        landscape: '16 / 9',
      }
      style.aspectRatio = aspectRatios[config.aspectRatio]
    }

    return style
  }

  // 创建点击处理器
  public createClickHandler(
    item: BaseContentItem,
    config: RendererConfig
  ): () => void {
    return () => {
      if (config.onClick) {
        config.onClick(item)
      }
    }
  }

  // 获取内容项的显示标题
  protected getDisplayTitle(item: BaseContentItem): string {
    return item.title || 'Untitled'
  }

  // 获取内容项的显示描述
  protected getDisplayDescription(item: BaseContentItem): string {
    return item.description || ''
  }

  // 获取内容项的显示图片URL
  protected getDisplayImageUrl(item: BaseContentItem): string {
    return item.imageUrl || ''
  }

  // 获取内容项的显示Alt文本
  protected getDisplayAltText(item: BaseContentItem): string {
    return item.alt || item.title || 'Content image'
  }
}
