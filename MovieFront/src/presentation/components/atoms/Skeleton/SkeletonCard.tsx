/**
 * @fileoverview 卡片骨架屏组件
 * @description 用于电影、视频、写真、合集等卡片的加载占位符,使用统一的 shimmer 动画效果
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'
import { SkeletonBase } from './SkeletonBase'
import { SkeletonText } from './SkeletonText'

export interface SkeletonCardProps {
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape'
  className?: string
  showTitle?: boolean
  showDescription?: boolean
  disableAnimation?: boolean
}

// 卡片骨架屏组件,用于列表、网格等场景的卡片加载占位符
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  aspectRatio = 'portrait',
  className,
  showTitle = false,
  showDescription = false,
  disableAnimation,
}) => {
  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
  }[aspectRatio]

  return (
    <div className="space-y-2">
      {/* 主图骨架屏 */}
      <div className={cn(aspectRatioClass, 'w-full rounded-lg overflow-hidden', className)}>
        <SkeletonBase
          width="100%"
          height="100%"
          borderRadius={8}
          disableAnimation={disableAnimation}
        />
      </div>
      
      {/* 标题骨架屏 */}
      {showTitle && (
        <SkeletonText
          width="75%"
          height={20}
          disableAnimation={disableAnimation}
        />
      )}
      
      {/* 描述骨架屏 */}
      {showDescription && (
        <div className="space-y-1">
          <SkeletonText
            width="100%"
            height={16}
            disableAnimation={disableAnimation}
          />
          <SkeletonText
            width="66%"
            height={16}
            disableAnimation={disableAnimation}
          />
        </div>
      )}
    </div>
  )
}

export default SkeletonCard
