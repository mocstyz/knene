/**
 * @fileoverview 统一接口类型定义
 * @description 定义统一的Section Props和Card Config接口，消除重复代码，提高一致性
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import type { CollectionItem } from '@types-movie'
import type { BaseContentItem } from '@components/domains/shared/content-renderers'
import type { HotItem } from '@infrastructure/repositories/HomeRepository'
import type { PhotoItem, LatestItem } from '@types-movie'

/**
 * 统一卡片配置接口
 * 定义所有卡片组件的通用配置选项
 */
export interface UnifiedCardConfig {
  /** 布局变体 */
  variant?: 'grid' | 'list'
  /** 响应式列数配置 */
  columns?: {
    /** 超小屏幕 (< 640px) */
    xs?: number
    /** 小屏幕 (>= 640px) */
    sm?: number
    /** 中等屏幕 (>= 768px) */
    md?: number
    /** 大屏幕 (>= 1024px) */
    lg?: number
    /** 超大屏幕 (>= 1280px) */
    xl?: number
    /** 超超大屏幕 (>= 1536px) */
    xxl?: number
  }
  /** 是否显示VIP标签 */
  showVipBadge?: boolean
  /** 是否显示新片标签 */
  showNewBadge?: boolean
  /** 是否显示质量标签 */
  showQualityBadge?: boolean
  /** 是否显示评分标签 */
  showRatingBadge?: boolean
  /** 卡片宽高比 */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape'
  /** 悬停效果 */
  hoverEffect?: boolean
  /** 标题悬停效果 */
  titleHoverEffect?: boolean
  /** 自定义CSS类名 */
  className?: string
}

/**
 * 基础Section Props接口
 * 所有Section组件的通用属性基类
 */
export interface BaseSectionProps<T = BaseContentItem> {
  /** 数据列表 */
  data: T[]
  /** Section标题 */
  title?: string
  /** 是否显示更多链接 */
  showMoreLink?: boolean
  /** 更多链接URL */
  moreLinkUrl?: string
  /** 更多链接文本 */
  moreLinkText?: string
  /** 项目点击事件处理器 */
  onItemClick?: (item: T) => void
  /** 自定义CSS类名 */
  className?: string
  /** 布局变体 */
  variant?: 'grid' | 'list'
  /** 响应式列数配置 */
  columns?: {
    /** 超小屏幕 (< 640px) */
    xs?: number
    /** 小屏幕 (>= 640px) */
    sm?: number
    /** 中等屏幕 (>= 768px) */
    md?: number
    /** 大屏幕 (>= 1024px) */
    lg?: number
    /** 超大屏幕 (>= 1280px) */
    xl?: number
    /** 超超大屏幕 (>= 1536px) */
    xxl?: number
  }
  /** 卡片配置 */
  cardConfig?: UnifiedCardConfig
}

/**
 * 扩展的Section Props接口
 * 为特定业务场景提供额外配置选项
 */
export interface ExtendedSectionProps<T = BaseContentItem> extends BaseSectionProps<T> {
  /** 是否启用调试模式 */
  debug?: boolean
  /** 是否启用虚拟滚动 */
  virtualScroll?: boolean
  /** 加载状态 */
  loading?: boolean
  /** 错误状态 */
  error?: string | null
  /** 空状态配置 */
  emptyState?: {
    message?: string
    action?: {
      text: string
      onClick: () => void
    }
  }
  /** 性能优化配置 */
  performance?: {
    /** 是否启用懒加载 */
    lazyLoad?: boolean
    /** 预加载项目数量 */
    preloadCount?: number
    /** 是否启用缓存 */
    enableCache?: boolean
  }
}

// ============================================================================
// 具体业务接口定义 - 继承基础接口，添加特定属性
// ============================================================================

/**
 * 影片合集Section Props接口
 * 继承基础接口，添加合集特有配置
 */
export interface CollectionSectionProps extends BaseSectionProps<CollectionItem> {
  /** 统一数据列表 */
  data: CollectionItem[]
  /** 影片合集卡片点击事件 */
  onCollectionClick?: (collection: CollectionItem) => void
}

/**
 * 写真Section Props接口
 * 继承基础接口，添加写真特有配置
 */
export interface PhotoSectionProps extends BaseSectionProps<PhotoItem> {
  /** 统一数据列表 */
  data: PhotoItem[]
  /** 写真卡片点击事件 */
  onPhotoClick?: (photo: PhotoItem) => void
}

/**
 * 最新更新Section Props接口
 * 继承基础接口，添加最新更新特有配置
 */
export interface LatestUpdateSectionProps extends BaseSectionProps<LatestItem> {
  /** 统一数据列表 */
  data: LatestItem[]
  /** 最新更新卡片点击事件 */
  onLatestClick?: (item: LatestItem) => void
}

/**
 * 热门Section Props接口
 * 继承基础接口，添加热门特有配置
 */
export interface HotSectionProps extends BaseSectionProps<HotItem> {
  /** 统一数据列表 */
  data: HotItem[]
  /** 热门卡片点击事件 */
  onHotClick?: (item: HotItem) => void
}

// ============================================================================
// 类型守卫和工具函数
// ============================================================================

/**
 * 检查是否为有效的响应式列数配置
 */
export function isValidColumnsConfig(config: unknown): config is UnifiedCardConfig['columns'] {
  if (!config || typeof config !== 'object' || config === null) {
    return false
  }
  
  const configObj = config as Record<string, unknown>
  return Object.keys(configObj).every(key => {
    const value = configObj[key]
    return typeof value === 'number' && value > 0
  })
}

/**
 * 创建默认的卡片配置
 */
export function createDefaultCardConfig(overrides?: Partial<UnifiedCardConfig>): UnifiedCardConfig {
  return {
    showVipBadge: true,
    showNewBadge: true,
    showQualityBadge: true,
    showRatingBadge: true,
    aspectRatio: 'portrait',
    hoverEffect: true,
    titleHoverEffect: true,
    ...overrides,
  }
}

/**
 * 创建默认的列数配置
 */
export function createDefaultColumnsConfig(overrides?: Partial<UnifiedCardConfig['columns']>): UnifiedCardConfig['columns'] {
  return {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 4,
    xl: 5,
    xxl: 6,
    ...overrides,
  }
}

/**
 * 合并Section Props配置
 */
export function mergeSectionProps<T>(
  defaultProps: Partial<BaseSectionProps<T>>,
  userProps: Partial<BaseSectionProps<T>>
): BaseSectionProps<T> {
  return {
    data: userProps.data || defaultProps.data || [],
    ...defaultProps,
    ...userProps,
    cardConfig: {
      ...createDefaultCardConfig(),
      ...defaultProps.cardConfig,
      ...userProps.cardConfig,
    },
    columns: {
      ...createDefaultColumnsConfig(),
      ...defaultProps.columns,
      ...userProps.columns,
    },
  } as BaseSectionProps<T>
}
