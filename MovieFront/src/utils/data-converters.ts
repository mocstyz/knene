/**
 * @fileoverview 数据转换工具函数
 * @description 提供各种数据格式之间的转换功能，支持统一内容项到各种特定类型的转换
 * @created 2025-01-25 14:30:00
 * @updated 2025-01-25 14:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { ContentTransformationService } from '@application/services/ContentTransformationService'
import type { 
  UnifiedContentItem, 
  TopicItem, 
  PhotoItem, 
  LatestItem 
} from '@types-movie'
import type { HotItem } from '@infrastructure/repositories/HomeRepository'
import type { CollectionItem } from '@components/domains/collections'

/**
 * 将UnifiedContentItem转换为CollectionItem
 */
export function toCollectionItem(item: UnifiedContentItem): CollectionItem {
  return {
    id: item.id,
    title: item.title,
    description: item.description || '',
    imageUrl: item.imageUrl,
    alt: item.alt || item.title,
    isNew: item.isNew || false,
    newType: item.newType || 'latest',
    isVip: item.isVip || false,
  }
}

/**
 * 批量转换UnifiedContentItem数组为CollectionItem数组
 */
export function toCollectionItems(items: UnifiedContentItem[]): CollectionItem[] {
  return items.map(toCollectionItem)
}

/**
 * 过滤并转换为CollectionItem数组
 */
export function filterAndConvertToCollectionItems(
  items: UnifiedContentItem[],
  filter?: (item: UnifiedContentItem) => boolean
): CollectionItem[] {
  const filteredItems = filter ? items.filter(filter) : items
  return toCollectionItems(filteredItems)
}

/**
 * 将UnifiedContentItem转换为PhotoItem
 */
export function toPhotoItem(item: UnifiedContentItem): PhotoItem {
  return {
    id: item.id,
    title: item.title,
    type: 'Movie' as const, // 添加必需的type属性
    description: item.description,
    imageUrl: item.imageUrl,
    alt: item.alt || item.title,
    // tags: item.tags, // PhotoItem不包含tags属性，移除此行
    // isVip: item.isVip, // PhotoItem不包含isVip属性，移除此行
    // isNew: item.isNew, // HotItem不包含isNew属性，移除此行
    // newType: item.newType, // HotItem不包含newType属性，移除此行
    rating: item.rating ? String(item.rating) : '',
    ratingColor: item.ratingColor as 'purple' | 'red' | 'white' | 'default' | undefined,
    quality: item.quality,
    // PhotoItem特有属性，从metadata中提取或设置默认值
    formatType: item.metadata?.formatType || 'JPEG高',
    genres: item.metadata?.genres || [],
  }
}

/**
 * 批量转换UnifiedContentItem数组为PhotoItem数组
 */
export function toPhotoItems(items: UnifiedContentItem[]): PhotoItem[] {
  return items.map(toPhotoItem)
}

/**
 * 将UnifiedContentItem转换为LatestItem
 */
export function toLatestItem(item: UnifiedContentItem): LatestItem {
  return {
    id: item.id,
    title: item.title,
    type: 'Movie' as const, // 添加必需的type属性
    description: item.description,
    imageUrl: item.imageUrl,
    alt: item.alt || item.title,
    // tags: item.tags, // LatestItem不包含tags属性，移除此行
    // isVip: item.isVip, // LatestItem不包含isVip属性，移除此行
    // isNew: item.isNew, // HotItem不包含isNew属性，移除此行
    // newType: item.newType, // HotItem不包含newType属性，移除此行
    rating: item.rating ? String(item.rating) : '',
    ratingColor: item.ratingColor as 'purple' | 'red' | 'white' | 'default' | undefined,
    quality: item.quality,
    // LatestItem特有属性，从metadata中提取或设置默认值
    genres: item.metadata?.genres || [],
  }
}

/**
 * 批量转换UnifiedContentItem数组为LatestItem数组
 */
export function toLatestItems(items: UnifiedContentItem[]): LatestItem[] {
  return items.map(toLatestItem)
}

/**
 * 将统一内容项转换为HotItem
 * 使用新的内容转换服务进行转换
 */
export function toHotItem(item: UnifiedContentItem): HotItem {
  return ContentTransformationService.transformUnifiedToHot(item)
}

/**
 * 批量转换UnifiedContentItem数组为HotItem数组
 */
export function toHotItems(items: UnifiedContentItem[]): HotItem[] {
  return items.map(toHotItem)
}