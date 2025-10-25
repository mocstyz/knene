/**
 * @fileoverview 数据转换工具函数
 * @description 提供各种数据格式之间的转换功能，支持统一内容项到各种特定类型的转换，包含合集、写真、最新更新、热门等类型的数据转换工具，以及批量转换和过滤转换功能
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { ContentTransformationService } from '@application/services/ContentTransformationService'
import type { 
  CollectionItem,
  PhotoItem, 
  LatestItem, 
  BaseMovieItem,
  HotItem,
  UnifiedContentItem
} from '@types-movie'

// 将UnifiedContentItem转换为CollectionItem
export function toCollectionItem(item: UnifiedContentItem): CollectionItem {
  return {
    id: item.id,
    title: item.title,
    type: 'Collection' as const,
    contentType: 'collection' as const,
    description: item.description || '',
    imageUrl: item.imageUrl,
    alt: item.alt || item.title,
    isNew: item.isNew || false,
    newType: item.newType || 'latest',
    isVip: item.isVip || false,
    rating: item.rating?.toString() || '0',
    movieCount: item.viewCount || 0,
    category: '默认分类',
    tags: item.tags || [],
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
    isFeatured: item.isFeatured || false
  }
}

// 批量转换UnifiedContentItem数组为CollectionItem数组
export function toCollectionItems(items: UnifiedContentItem[]): CollectionItem[] {
  return items.map(toCollectionItem)
}

// 过滤并转换为CollectionItem数组，支持自定义过滤条件
export function filterAndConvertToCollectionItems(
  items: UnifiedContentItem[], // 源数据数组
  filter?: (item: UnifiedContentItem) => boolean // 可选的过滤函数
): CollectionItem[] {
  const filteredItems = filter ? items.filter(filter) : items
  return toCollectionItems(filteredItems)
}

// 将UnifiedContentItem转换为PhotoItem
export function toPhotoItem(item: UnifiedContentItem): PhotoItem {
  // 根据contentType映射到正确的type
  let type: 'Movie' | 'TV Show' | 'Collection' | 'Photo' = 'Photo'
  let contentType: 'movie' | 'photo' | 'collection' = 'photo'
  
  if (item.contentType === 'movie') {
    type = 'Movie'
    contentType = 'movie'
  } else if (item.contentType === 'photo') {
    type = 'Photo'
    contentType = 'photo'
  } else if (item.contentType === 'collection') {
    type = 'Collection'
    contentType = 'collection'
  }

  return {
    id: item.id,
    title: item.title,
    type: type, // 根据contentType动态设置
    contentType: contentType, // 保留contentType字段用于渲染器选择（只包含支持的类型）
    description: item.description,
    imageUrl: item.imageUrl,
    alt: item.alt || item.title,
    isVip: item.isVip || false, // 保留VIP属性
    isNew: item.isNew || false, // 保留NEW属性
    newType: item.newType || 'latest', // 保留newType属性
    rating: item.rating ? String(item.rating) : '',
    ratingColor: item.ratingColor as 'purple' | 'red' | 'white' | 'default' | undefined,
    quality: item.quality,
    // PhotoItem特有属性，从metadata中提取或设置默认值
    formatType: item.metadata?.formatType || 'JPEG高',
    genres: item.metadata?.genres || [],
  }
}

// 批量转换UnifiedContentItem数组为PhotoItem数组
export function toPhotoItems(items: UnifiedContentItem[]): PhotoItem[] {
  return items.map(toPhotoItem)
}

// 将UnifiedContentItem转换为LatestItem
export function toLatestItem(item: UnifiedContentItem): LatestItem {
  // 根据contentType映射到正确的type
  let type: 'Movie' | 'TV Show' | 'Collection' | 'Photo' = 'Movie'
  let contentType: 'movie' | 'photo' | 'collection' = 'movie'
  
  if (item.contentType === 'movie') {
    type = 'Movie'
    contentType = 'movie'
  } else if (item.contentType === 'photo') {
    type = 'Photo'
    contentType = 'photo'
  } else if (item.contentType === 'collection') {
    type = 'Collection'
    contentType = 'collection'
  }

  return {
    id: item.id,
    title: item.title,
    type: type, // 根据contentType设置正确的type
    contentType: contentType, // 保留contentType字段用于渲染器选择（只包含支持的类型）
    description: item.description,
    imageUrl: item.imageUrl,
    alt: item.alt || item.title,
    rating: item.rating ? String(item.rating) : '',
    ratingColor: item.ratingColor as 'purple' | 'red' | 'white' | 'default' | undefined,
    quality: item.quality,
    isNew: item.isNew,
    newType: item.newType,
    isVip: item.isVip,
    // LatestItem特有属性，从metadata中提取或设置默认值
    genres: item.metadata?.genres || [],
    movieCount: contentType === 'collection' ? item.viewCount : undefined, // 合集显示影片数量
  }
}

// 批量转换UnifiedContentItem数组为LatestItem数组
export function toLatestItems(items: UnifiedContentItem[]): LatestItem[] {
  return items.map(toLatestItem)
}

// 将统一内容项转换为HotItem，使用新的内容转换服务进行转换
export function toHotItem(item: UnifiedContentItem): HotItem {
  return ContentTransformationService.transformUnifiedToHot(item)
}

// 批量转换UnifiedContentItem数组为HotItem数组
export function toHotItems(items: UnifiedContentItem[]): HotItem[] {
  return items.map(toHotItem)
}