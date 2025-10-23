/**
 * @fileoverview 卡片骨架屏组件
 * @description 用于电影、视频、写真、合集等卡片的加载占位符
 * @author MovieFront Team
 * @since 1.0.0
 * @version 1.0.0
 */

import { Skeleton } from '@radix-ui/themes'
import { cn } from '@utils/cn'
import React from 'react'

export interface SkeletonCardProps {
  /**
   * 宽高比
   * - square: 1:1 (正方形)
   * - video: 16:9 (视频)
   * - portrait: 3:4 (竖版海报)
   * - landscape: 4:3 (横版)
   */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape'
  
  /**
   * 自定义类名
   */
  className?: string
  
  /**
   * 是否显示标题骨架屏
   */
  showTitle?: boolean
  
  /**
   * 是否显示描述骨架屏
   */
  showDescription?: boolean
}

/**
 * 卡片骨架屏组件
 * 
 * 用于列表、网格等场景的卡片加载占位符
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <SkeletonCard aspectRatio="portrait" />
 * 
 * // 带标题和描述
 * <SkeletonCard 
 *   aspectRatio="portrait" 
 *   showTitle 
 *   showDescription 
 * />
 * ```
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  aspectRatio = 'portrait',
  className,
  showTitle = false,
  showDescription = false,
}) => {
  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
  }[aspectRatio]

  return (
    <div className="space-y-2">
      {/* 主图骨架屏 - 使用 div 包裹以确保 aspect-ratio 生效 */}
      <div className={cn(aspectRatioClass, 'w-full rounded-lg overflow-hidden', className)}>
        <Skeleton className="w-full h-full" />
      </div>
      
      {/* 标题骨架屏 */}
      {showTitle && (
        <Skeleton className="h-5 w-3/4 rounded" />
      )}
      
      {/* 描述骨架屏 */}
      {showDescription && (
        <div className="space-y-1">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
      )}
    </div>
  )
}

export default SkeletonCard
