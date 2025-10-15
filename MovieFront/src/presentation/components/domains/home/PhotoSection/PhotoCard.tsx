/**
 * @fileoverview 写真卡片组件
 * @description 专门为写真模块设计的简单卡片组件，只显示图片、标题和类型。
 * 遵循DDD架构原则，使用PhotoItem类型，提供简洁的视觉效果。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'
import { cn } from '@utils/cn'
import type { PhotoItem } from '@types-movie/movie.types'

/**
 * 写真卡片组件属性接口
 */
export interface PhotoCardProps {
  /** 写真数据 */
  photo: PhotoItem
  /** 点击事件处理 */
  onClick?: (photo: PhotoItem) => void
  /** 自定义CSS类名 */
  className?: string
  /** 是否显示VIP标签 */
  showVipBadge?: boolean
  /** 是否显示质量标签 */
  showQualityBadge?: boolean
  /** 质量标签文本 */
  qualityText?: string
}

/**
 * 写真卡片组件
 *
 * 专门为写真模块设计的简单卡片，只显示：
 * - 图片封面
 * - 标题
 * - 类型（Movie/TV Show）
 * - VIP标签（可选）
 * - 质量标签（可选）
 */
const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onClick,
  className,
  showVipBadge = true,
  showQualityBadge = true,
  qualityText,
}) => {
  const handleClick = () => {
    onClick?.(photo)
  }

  // 获取质量标签文本
  const getQualityText = () => {
    if (qualityText) return qualityText
    return (photo as any).formatType || photo.quality
  }

  return (
    <div
      className={cn('cursor-pointer space-y-2 group', className)}
      onClick={handleClick}
    >
      {/* 图片卡片区域 */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md">
        <img
          src={photo.imageUrl}
          alt={photo.alt || `${photo.title} 写真`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* 底部渐变遮罩 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

        {/* 顶部标签层 */}
        <div className="absolute left-2 right-2 top-2 z-10 flex justify-between">
          {/* 质量标签 - 右上角 */}
          {showQualityBadge && getQualityText() && (
            <div className="ml-auto bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
              {getQualityText()}
            </div>
          )}
        </div>

        {/* 底部标签层 */}
        <div className="absolute bottom-2 right-2 z-10">
          {showVipBadge && (
            <div className="bg-red-500 px-2 py-1 text-xs font-medium text-white">
              VIP
            </div>
          )}
        </div>
      </div>

      {/* 信息区域 - 只有标题和类型 */}
      <div className="space-y-1">
        {/* 标题 - 固定颜色，不根据评分变化 */}
        <h3 className="line-clamp-1 text-sm font-medium text-gray-900 transition-colors duration-200 group-hover:text-red-500 dark:text-white">
          {photo.title}
        </h3>

        {/* 类型 */}
        <p className="text-xs text-gray-500 transition-colors duration-200 group-hover:text-red-500">
          {photo.type}
        </p>
      </div>
    </div>
  )
}

export default PhotoCard
