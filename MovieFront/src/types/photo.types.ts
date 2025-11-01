/**
 * @fileoverview Photo相关类型定义
 * @description 定义写真详情页面相关的类型和接口
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import type { ResourceInfo, Screenshot, Comment } from './movie.types'

// 写真详情接口
export interface PhotoDetail {
  id: string
  title: string
  year: number
  imageUrl: string
  type: 'Photo'
  screenshots: Screenshot[] // 写真图片集合
  resource?: ResourceInfo // 资源信息
  thankYouCount: number
  isThankYouActive: boolean
  isFavorited: boolean
}
