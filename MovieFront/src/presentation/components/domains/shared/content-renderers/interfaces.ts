/**
 * @fileoverview 内容渲染器抽象接口定义
 * @description 定义内容渲染器的抽象接口，支持多种内容类型的统一渲染。
 *              遵循依赖倒置原则，高层模块不依赖低层模块，都依赖于抽象。
 *              内容渲染器架构模式包含抽象接口定义、具体实现类、工厂模式、注册机制等。
 * @created 2025-10-16 11:30:16
 * @updated 2025-10-20 14:07:15
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'

// 基础内容类型定义

// 统一内容项基础接口，所有内容类型都必须实现此基础接口
export interface BaseContentItem {
  /** 内容唯一标识符 */
  id: string
  /** 内容标题 */
  title: string
  /** 内容类型标识符 */
  contentType: ContentTypeId
  /** 内容描述（可选） */
  description?: string
  /** 主图片URL */
  imageUrl: string
  /** 图片alt文本 */
  alt?: string
  /** 创建时间 */
  createdAt?: string
  /** 更新时间 */
  updatedAt?: string
}

// 内容类型标识符类型，使用联合类型确保类型安全
export type ContentTypeId =
  | 'movie'
  | 'photo'
  | 'collection'
  | 'video'
  | 'article'
  | 'live'

// 渲染器配置接口，控制渲染器的行为和显示选项
export interface RendererConfig {
  /** 是否启用悬停效果 */
  hoverEffect?: boolean
  /** 宽高比 */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape'
  /** 是否显示VIP徽章 */
  showVipBadge?: boolean
  /** 是否显示新内容徽章 */
  showNewBadge?: boolean
  /** 是否显示质量徽章 */
  showQualityBadge?: boolean
  /** 是否显示评分徽章 */
  showRatingBadge?: boolean
  /** 组件尺寸 */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** 自定义CSS类名 */
  className?: string
  /** 点击事件处理器 */
  onClick?: (item: BaseContentItem) => void
  /** 额外选项 */
  extraOptions?: Record<string, any>
  /** 是否显示标题 */
  showTitle?: boolean
  /** 是否显示描述 */
  showDescription?: boolean
}

// 内容渲染器抽象接口

// 内容渲染器抽象接口，定义所有内容渲染器必须实现的方法
export interface ContentRenderer {
  /** 渲染器支持的内容类型 */
  readonly contentType: ContentTypeId

  /** 渲染器名称，用于调试和日志 */
  readonly name: string

  /** 渲染器版本，用于兼容性检查 */
  readonly version: string

  /**
   * 检查是否支持渲染指定的内容项
   * @param item 内容项
   * @returns 是否支持渲染
   */
  canRender(item: BaseContentItem): boolean

  /**
   * 渲染内容项为React组件
   * @param item 要渲染的内容项
   * @param config 渲染器配置
   * @returns React组件
   */
  render(item: BaseContentItem, config?: RendererConfig): React.ReactElement

  /**
   * 获取渲染器的默认配置
   * @returns 默认配置对象
   */
  getDefaultConfig(): Partial<RendererConfig>

  /**
   * 验证内容项是否符合渲染器要求
   * @param item 要验证的内容项
   * @returns 验证结果
   */
  validateItem(item: BaseContentItem): ValidationResult

  /**
   * 获取渲染器支持的配置选项
   * @returns 支持的配置选项列表
   */
  getSupportedConfigOptions(): string[]
}

// 验证结果接口

/**
 * 内容项验证结果
 */
export interface ValidationResult {
  /** 是否验证通过 */
  isValid: boolean
  /** 错误信息列表 */
  errors: string[]
  /** 警告信息列表 */
  warnings: string[]
}

// 渲染器注册信息接口

/**
 * 渲染器注册信息
 */
export interface RendererRegistration {
  /** 内容类型ID */
  contentType: ContentTypeId
  /** 渲染器实例 */
  renderer: ContentRenderer
  /** 注册时间 */
  registeredAt: Date
  /** 注册者信息 */
  registrar?: string
  /** 是否启用 */
  enabled: boolean
  /** 优先级（数字越大优先级越高） */
  priority: number
}

// 工厂接口定义

/**
 * 内容渲染器工厂接口
 * 定义渲染器创建和管理的标准方法
 */
export interface ContentRendererFactory {
  /**
   * 注册新的内容渲染器
   * @param renderer 渲染器实例
   * @param options 注册选项
   */
  register(renderer: ContentRenderer, options?: RegistrationOptions): void

  /**
   * 注销内容渲染器
   * @param contentType 内容类型ID
   */
  unregister(contentType: ContentTypeId): void

  /**
   * 根据内容类型获取渲染器
   * @param contentType 内容类型ID
   * @returns 渲染器实例或null
   */
  getRenderer(contentType: ContentTypeId): ContentRenderer | null

  /**
   * 根据内容项自动选择最佳渲染器
   * @param item 内容项
   * @returns 最佳渲染器或null
   */
  getBestRenderer(item: BaseContentItem): ContentRenderer | null

  /**
   * 获取所有已注册的渲染器
   * @returns 渲染器列表
   */
  getAllRenderers(): ContentRenderer[]

  /**
   * 获取已注册的内容类型列表
   * @returns 内容类型ID列表
   */
  getRegisteredContentTypes(): ContentTypeId[]

  /**
   * 检查指定内容类型是否已注册
   * @param contentType 内容类型ID
   * @returns 是否已注册
   */
  isRegistered(contentType: ContentTypeId): boolean

  /**
   * 检查渲染器是否可用（别名方法）
   * @param contentType 内容类型ID
   * @returns 是否可用
   */
  hasRenderer(contentType: ContentTypeId): boolean

  /**
   * 获取所有可用的内容类型（别名方法）
   * @returns 内容类型ID列表
   */
  getAvailableContentTypes(): ContentTypeId[]

  /**
   * 渲染内容项
   * @param item 内容项
   * @param config 渲染配置
   * @returns 渲染结果
   */
  render(item: BaseContentItem, config?: RendererConfig): React.ReactElement
}

// 注册选项接口

/**
 * 渲染器注册选项
 */
export interface RegistrationOptions {
  /** 注册者信息 */
  registrar?: string
  /** 是否立即启用 */
  enabled?: boolean
  /** 优先级 */
  priority?: number
  /** 是否覆盖已存在的渲染器 */
  override?: boolean
}

// 扩展的内容项接口（可选实现）

/**
 * 扩展内容项接口
 * 提供更丰富的内容属性
 */
export interface ExtendedContentItem extends BaseContentItem {
  /** 内容标签 */
  tags?: string[]
  /** 内容分类 */
  category?: string
  /** 内容语言 */
  language?: string
  /** 地区信息 */
  region?: string
  /** 是否为VIP内容 */
  isVip?: boolean
  /** 是否为新内容 */
  isNew?: boolean
  /** 新片类型 */
  newType?: 'hot' | 'latest' | null // 新项目类型标识，对齐统一类型系统
  /** 评分信息 */
  rating?: number
  /** 评分颜色 */
  ratingColor?: string
  /** 质量信息 */
  quality?: string
  /** 文件大小 */
  fileSize?: string
  /** 下载次数 */
  downloadCount?: number
  /** 观看次数 */
  viewCount?: number
  /** 点赞数 */
  likeCount?: number
  /** 自定义元数据 */
  metadata?: Record<string, any>
}

// 类型守卫函数

/**
 * 检查对象是否为有效的内容项
 */
export function isContentItem(obj: any): obj is BaseContentItem {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.contentType === 'string' &&
    typeof obj.imageUrl === 'string'
  )
}

/**
 * 检查对象是否为扩展内容项
 */
export function isExtendedContentItem(obj: any): obj is ExtendedContentItem {
  return (
    isContentItem(obj) &&
    ((obj as ExtendedContentItem).tags !== undefined ||
      (obj as ExtendedContentItem).rating !== undefined ||
      (obj as ExtendedContentItem).isVip !== undefined)
  )
}

/**
 * 检查内容类型ID是否有效
 */
export function isValidContentType(
  contentType: any
): contentType is ContentTypeId {
  const validTypes: ContentTypeId[] = [
    'movie',
    'photo',
    'collection',
    'video',
    'article',
    'live',
  ]
  return validTypes.includes(contentType)
}
