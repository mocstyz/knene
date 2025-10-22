/**
 * @fileoverview 统一接口类型定义
 * @description 定义统一的Section Props和Card Config接口，消除重复代码，提高一致性，包含基础接口、扩展接口、具体业务接口、类型守卫和工具函数，支持多种布局变体和配置选项
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import type { BaseContentItem } from '@components/domains/shared/content-renderers'
import type { CollectionItem } from '@types-movie'
import type { HotItem } from '@types-movie'
import type { PhotoItem, LatestItem } from '@types-movie'

// 统一卡片配置接口，定义所有卡片组件的通用配置选项
export interface UnifiedCardConfig {
  variant?: 'grid' | 'list' // 布局变体
  columns?: {
    xs?: number // 超小屏幕 (< 640px)
    sm?: number // 小屏幕 (>= 640px)
    md?: number // 中等屏幕 (>= 768px)
    lg?: number // 大屏幕 (>= 1024px)
    xl?: number // 超大屏幕 (>= 1280px)
    xxl?: number // 超超大屏幕 (>= 1536px)
  }
  showVipBadge?: boolean // 是否显示VIP标签
  showNewBadge?: boolean // 是否显示新片标签
  showQualityBadge?: boolean // 是否显示质量标签
  showRatingBadge?: boolean // 是否显示评分标签
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' // 卡片宽高比
  hoverEffect?: boolean // 悬停效果
  titleHoverEffect?: boolean // 标题悬停效果
  className?: string // 自定义CSS类名
}

// 基础Section Props接口，所有Section组件的通用属性基类
export interface BaseSectionProps<T = BaseContentItem> {
  data: T[] // 数据列表
  title?: string // Section标题
  showMoreLink?: boolean // 是否显示更多链接
  moreLinkUrl?: string // 更多链接URL
  moreLinkText?: string // 更多链接文本
  onItemClick?: (item: T) => void // 项目点击事件处理器
  className?: string // 自定义CSS类名
  variant?: 'grid' | 'list' // 布局变体
  columns?: {
    xs?: number // 超小屏幕 (< 640px)
    sm?: number // 小屏幕 (>= 640px)
    md?: number // 中等屏幕 (>= 768px)
    lg?: number // 大屏幕 (>= 1024px)
    xl?: number // 超大屏幕 (>= 1280px)
    xxl?: number // 超超大屏幕 (>= 1536px)
  }
  cardConfig?: UnifiedCardConfig // 卡片配置
}

// 扩展的Section Props接口，为特定业务场景提供额外配置选项
export interface ExtendedSectionProps<T = BaseContentItem> extends BaseSectionProps<T> {
  debug?: boolean // 是否启用调试模式
  virtualScroll?: boolean // 是否启用虚拟滚动
  loading?: boolean // 加载状态
  error?: string | null // 错误状态
  emptyState?: {
    message?: string
    action?: {
      text: string
      onClick: () => void
    }
  }
  performance?: {
    lazyLoad?: boolean // 是否启用懒加载
    preloadCount?: number // 预加载项目数量
    enableCache?: boolean // 是否启用缓存
  }
}

// 影片合集Section Props接口，继承基础接口，添加合集特有配置
export interface CollectionSectionProps extends BaseSectionProps<CollectionItem> {
  data: CollectionItem[] // 统一数据列表
  onCollectionClick?: (collection: CollectionItem) => void // 影片合集卡片点击事件
}

// 写真Section Props接口，继承基础接口，添加写真特有配置
export interface PhotoSectionProps extends BaseSectionProps<PhotoItem> {
  data: PhotoItem[] // 统一数据列表
  onPhotoClick?: (photo: PhotoItem) => void // 写真卡片点击事件
}

// 最新更新Section Props接口，继承基础接口，添加最新更新特有配置
export interface LatestUpdateSectionProps extends BaseSectionProps<LatestItem> {
  data: LatestItem[] // 统一数据列表
  onLatestClick?: (item: LatestItem) => void // 最新更新卡片点击事件
}

// 热门Section Props接口，继承基础接口，添加热门特有配置
export interface HotSectionProps extends BaseSectionProps<HotItem> {
  data: HotItem[] // 统一数据列表
  onHotClick?: (item: HotItem) => void // 热门卡片点击事件
}

// 检查是否为有效的响应式列数配置
export function isValidColumnsConfig(config: unknown): config is UnifiedCardConfig['columns'] {
  if (!config || typeof config !== 'object') {
    return false
  }

  const configObj = config as Record<string, unknown>
  return Object.keys(configObj).every(key => {
    const value = configObj[key]
    return typeof value === 'number' && value > 0
  })
}

// 创建默认的卡片配置
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

// 创建默认的列数配置
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

// 合并Section Props配置，将默认配置和用户配置进行深度合并，确保配置的完整性和一致性
export function mergeSectionProps<T>(
  defaultProps: Partial<BaseSectionProps<T>>, // 默认配置
  userProps: Partial<BaseSectionProps<T>> // 用户自定义配置
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
