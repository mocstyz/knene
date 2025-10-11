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
  /** 是否为新内容 */
  isNew?: boolean
  /** 新片类型 */
  newType?: 'new' | 'update' | 'today' | 'latest'
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
    MediaQualityItem {}

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
export interface TopicItem extends BaseMediaItem, MediaImageItem {
  /** 专题类型固定为Collection */
  type: 'Collection'
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
// 兼容性接口 - 保持向后兼容
// ============================================================================

/**
 * @deprecated 使用 BaseMovieItem 替代
 * 保留原SimpleMovieItem接口以确保向后兼容
 */
export interface SimpleMovieItem extends FullMovieItem {}

/**
 * @deprecated 使用 FullMovieItem 替代
 * 保留原MovieItem接口以确保向后兼容
 */
export interface MovieItem extends FullMovieItem {}

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
 */
export interface CardConfig {
  /** 是否显示评分标签 */
  showRatingBadge?: boolean
  /** 是否显示质量标签 */
  showQualityBadge?: boolean
  /** 是否显示VIP标签 */
  showVipBadge?: boolean
  /** 是否显示新片标签 */
  showNewBadge?: boolean
  /** 质量标签文本 */
  qualityText?: string
  /** 新片类型 */
  newBadgeType?: 'new' | 'update' | 'today' | 'latest'
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
