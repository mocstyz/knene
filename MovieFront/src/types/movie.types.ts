/**
 * @fileoverview Movie相关类型定义
 * @description 定义Movie相关的基础类型和接口，遵循DDD架构的类型设计原则。
 * 将复杂的接口拆分为多个基础接口组合，提高可维护性和扩展性。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// ============================================================================
// 基础接口定义 - 拆分复杂接口为可复用的基础接口
// ============================================================================

/**
 * 基础媒体项目接口
 * 所有媒体类型的通用属性
 */
export interface BaseMediaItem {
  /** 唯一标识符 */
  id: string
  /** 标题 */
  title: string
  /** 媒体类型 */
  type: 'Movie' | 'TV Show' | 'Collection'
  /** 描述信息 */
  description?: string
}

/**
 * 媒体图片接口
 * 处理图片相关的属性
 */
export interface MediaImageItem {
  /** 图片URL */
  imageUrl: string
  /** 图片alt文本 */
  alt?: string
}

/**
 * 媒体评分接口
 * 处理评分相关的属性
 */
export interface MediaRatingItem {
  /** 评分值 */
  rating: string
  /** 评分颜色 */
  ratingColor?: 'purple' | 'red' | 'white' | 'default'
}

/**
 * 媒体质量接口
 * 处理质量相关的属性
 */
export interface MediaQualityItem {
  /** 质量标识 */
  quality?: string
}

/**
 * 媒体状态接口
 * 处理状态相关的属性
 */
export interface MediaStatusItem {
  /** 是否为新内容（24小时内发布） */
  isNew?: boolean
  /** 是否为VIP专享内容 */
  isVip?: boolean
  /** NEW标签类型 */
  newType?: 'hot' | 'latest' | null
  /** 标签列表 */
  tags?: string[]
  /** 是否为热门内容 */
  isHot?: boolean
  /** 是否为精选内容 */
  isFeatured?: boolean
}

/**
 * 媒体格式接口
 * 处理格式相关的属性（如写真模块的图片格式）
 */
export interface MediaFormatItem {
  /** 图片格式类型 */
  formatType?: 'JPEG高' | 'PNG' | 'WebP' | 'GIF' | 'BMP'
}

/**
 * 媒体排名接口
 * 处理排名相关的属性
 */
export interface MediaRankItem {
  /** 排名 */
  rank?: number
}

// ============================================================================
// 组合接口定义 - 通过基础接口组合成业务接口
// ============================================================================

/**
 * 基础电影项目接口
 * 组合了基础媒体、图片、评分、质量接口
 */
export interface BaseMovieItem
  extends BaseMediaItem,
    MediaImageItem,
    MediaRatingItem,
    MediaQualityItem {
  /** 电影类型/分类 */
  genres?: string[]
}

/**
 * 完整电影项目接口
 * 包含所有电影相关属性
 */
export interface FullMovieItem
  extends BaseMovieItem,
    MediaStatusItem,
    MediaFormatItem {}

/**
 * 专题项目接口
 * 专题专用的接口组合
 */
export interface TopicItem extends BaseMediaItem, MediaImageItem, MediaStatusItem {
  /** 专题类型固定为Collection */
  type: 'Collection'
  /** 是否为VIP内容 */
  isVip?: boolean
}

/**
 * 写真项目接口
 * 写真专用的接口组合
 */
export interface PhotoItem
  extends BaseMovieItem,
    MediaStatusItem,
    MediaFormatItem {}

/**
 * 最新更新项目接口
 * 最新更新专用的接口组合
 */
export interface LatestItem extends BaseMovieItem, MediaStatusItem {}

/**
 * TOP项目接口
 * TOP排名专用的接口组合
 */
export interface TopItem extends BaseMovieItem, MediaRankItem {}

// ============================================================================
// 内容渲染器类型集成
// ============================================================================

/**
 * 统一内容项接口
 * 定义所有内容类型的统一数据结构，包含完整的业务状态字段
 */
export interface UnifiedContentItem {
  /** 内容唯一标识 */
  id: string
  /** 内容标题 */
  title: string
  /** 内容类型 */
  contentType: 'movie' | 'photo' | 'collection' | 'video' | 'article' | 'live'
  /** 内容描述 */
  description?: string
  /** 图片URL */
  imageUrl: string
  /** 图片alt文本 */
  alt?: string
  /** 创建时间 */
  createdAt?: string
  /** 更新时间 */
  updatedAt?: string
  /** 标签列表 */
  tags?: string[]
  /** 是否为VIP专享内容 */
  isVip?: boolean
  /** 是否为新内容（24小时内发布） */
  isNew?: boolean
  /** NEW标签类型 */
  newType?: 'hot' | 'latest' | null
  /** 评分 */
  rating?: number
  /** 评分颜色 */
  ratingColor?: string
  /** 质量标识 */
  quality?: string
  /** 是否为热门内容 */
  isHot?: boolean
  /** 是否为精选内容 */
  isFeatured?: boolean
  /** 浏览次数 */
  viewCount?: number
  /** 下载次数 */
  downloadCount?: number
  /** 发布日期 */
  publishDate?: string
  /** 内容元数据 */
  metadata?: Record<string, any>
}

// ============================================================================
// 混合内容类型定义
// ============================================================================

/**
 * 混合内容项目接口
 * 支持在最新更新和热门模块中混合展示不同类型的内容
 */
export interface MixedContentItem extends BaseMovieItem, MediaStatusItem {
  /** 内容类型 - 用于内容渲染器选择 */
  contentType?: 'movie' | 'photo' | 'collection'
  /** 更新时间 */
  updatedAt?: string
  /** 更新类型 */
  updateType?: 'new' | 'update' | 'episode' | 'version'
  /** 热度排名 */
  rank?: number
  /** 热度分数 */
  hotScore?: number
  /** 24小时内访问次数 */
  viewCount24h?: number
  /** 上升排名 */
  rankChange?: number
}

// ============================================================================
// 内容类型推断工具
// ============================================================================

/**
 * 内容类型推断函数
 * 基于数据特征自动推断内容类型
 */
export function inferContentType(item: any): 'movie' | 'photo' | 'collection' {
  // 优先检查显式的contentType字段
  if (item.contentType) {
    return item.contentType
  }

  // 检查type字段（Mock数据中的标识）
  if (item.type === 'Collection') {
    return 'collection'
  }

  // 检查写真特征
  if (item.formatType || item.resolution || item.model || item.photographer) {
    return 'photo'
  }

  // 检查合集特征
  if (item.itemCount || item.collectionDescription || item.creator) {
    return 'collection'
  }

  // 默认为电影
  return 'movie'
}

/**
 * 检查是否为混合内容项
 */
export function isMixedContentItem(item: any): item is MixedContentItem {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    typeof item.title === 'string'
  )
}

/**
 * 转换为统一内容项格式
 */
export function toUnifiedContentItem(item: any): UnifiedContentItem & { contentType: 'movie' | 'photo' | 'collection' | 'video' | 'article' | 'live' } {
  const contentType = item.contentType || inferContentType(item)

  return {
    id: item.id,
    title: item.title,
    contentType,
    description: item.description,
    imageUrl: item.imageUrl,
    alt: item.alt,
    createdAt: item.createdAt || item.updatedAt,
    updatedAt: item.updatedAt,
    tags: item.tags,
    isVip: item.isVip ?? false,
    isNew: item.isNew,
    newType: item.newType || 'new',
    rating: item.rating ? parseFloat(item.rating) : undefined,
    ratingColor: item.ratingColor,
    quality: item.quality,
    metadata: {
      ...item.metadata,
      originalType: contentType,
      sourceData: item,
    },
  }
}

// ============================================================================
// 迁移完成说明
// ============================================================================

/**
 * SimpleMovieItem和MovieItem接口已完全移除
 * 请使用以下具体类型替代：
 * - BaseMovieItem: 基础电影项目
 * - FullMovieItem: 完整电影项目
 * - TopicItem: 专题项目
 * - PhotoItem: 写真项目
 * - LatestItem: 最新更新项目
 * - TopItem: TOP排名项目
 * - UnifiedContentItem: 统一内容项目（与内容渲染器系统集成）
 * - MixedContentItem: 混合内容项目（支持多类型混合展示）
 *
 * 内容渲染器系统集成完成时间：2025-10-16
 * 遵循DDD架构原则，使用领域专用类型
 * 支持企业级内容渲染器抽象层架构
 */

// ============================================================================
// 配置接口定义
// ============================================================================

/**
 * 响应式列数配置接口
 */
export interface ResponsiveColumnsConfig {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

/**
 * 卡片配置接口
 * 定义卡片组件的显示配置选项
 */
export interface CardConfig {
  /** 是否显示评分徽章 */
  showRatingBadge?: boolean
  /** 是否显示质量徽章 */
  showQualityBadge?: boolean
  /** 是否显示VIP徽章 */
  showVipBadge?: boolean
  /** 是否显示NEW徽章 */
  showNewBadge?: boolean
  /** 是否显示热门徽章 */
  showHotBadge?: boolean
  /** 是否显示精选徽章 */
  showFeaturedBadge?: boolean
  /** 质量文本 */
  qualityText?: string
  /** NEW徽章类型 */
  newBadgeType?: 'hot' | 'latest'
}

// ============================================================================
// 类型守卫函数
// ============================================================================

/**
 * 检查是否为专题项目
 */
export function isTopicItem(item: any): item is TopicItem {
  return item && item.type === 'Collection'
}

/**
 * 检查是否为写真项目
 */
export function isPhotoItem(item: any): item is PhotoItem {
  return item && 'formatType' in item
}

/**
 * 检查是否为最新项目
 */
export function isLatestItem(item: any): item is LatestItem {
  return item && ('isNew' in item || 'newType' in item)
}

/**
 * 检查是否为TOP项目
 */
export function isTopItem(item: any): item is TopItem {
  return item && 'rank' in item
}
