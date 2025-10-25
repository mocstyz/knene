/**
 * @fileoverview 详情页骨架屏组件
 * @description 用于电影/视频详情页的加载占位符,使用统一的 shimmer 动画效果
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'
import { SkeletonBase } from './SkeletonBase'
import { SkeletonText } from './SkeletonText'
import { SkeletonCircle } from './SkeletonCircle'

export interface SkeletonDetailProps {
  className?: string
  layout?: 'horizontal' | 'vertical'
  showCast?: boolean
  showRecommendations?: boolean
  disableAnimation?: boolean
}

// 详情页骨架屏组件,用于电影/视频详情页
export const SkeletonDetail: React.FC<SkeletonDetailProps> = ({
  className,
  layout = 'horizontal',
  showCast = true,
  showRecommendations = true,
  disableAnimation,
}) => {
  return (
    <div className={cn('space-y-8', className)}>
      {/* 主要信息区域 */}
      <div
        className={cn(
          'flex gap-8',
          layout === 'vertical' ? 'flex-col' : 'flex-col md:flex-row'
        )}
      >
        {/* 封面图 */}
        <div className={cn(layout === 'vertical' ? 'w-full' : 'w-full md:w-1/3')}>
          <SkeletonBase
            width="100%"
            height={0}
            borderRadius={8}
            className="aspect-[2/3]"
            disableAnimation={disableAnimation}
          />
        </div>

        {/* 详情信息 */}
        <div className={cn('flex-1 space-y-6', layout === 'vertical' ? 'w-full' : '')}>
          {/* 标题 */}
          <SkeletonText width="75%" height={40} disableAnimation={disableAnimation} />

          {/* 元数据 */}
          <div className="flex gap-4">
            <SkeletonText width={80} height={24} disableAnimation={disableAnimation} />
            <SkeletonText width={96} height={24} disableAnimation={disableAnimation} />
            <SkeletonText width={64} height={24} disableAnimation={disableAnimation} />
          </div>

          {/* 评分 */}
          <div className="flex items-center gap-4">
            <SkeletonCircle size={48} disableAnimation={disableAnimation} />
            <div className="space-y-2">
              <SkeletonText width={128} height={24} disableAnimation={disableAnimation} />
              <SkeletonText width={96} height={16} disableAnimation={disableAnimation} />
            </div>
          </div>

          {/* 简介 */}
          <div className="space-y-2">
            <SkeletonText width="100%" height={20} disableAnimation={disableAnimation} />
            <SkeletonText width="100%" height={20} disableAnimation={disableAnimation} />
            <SkeletonText width="80%" height={20} disableAnimation={disableAnimation} />
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4">
            <SkeletonBase width={128} height={48} borderRadius={8} disableAnimation={disableAnimation} />
            <SkeletonBase width={128} height={48} borderRadius={8} disableAnimation={disableAnimation} />
            <SkeletonBase width={48} height={48} borderRadius={8} disableAnimation={disableAnimation} />
          </div>
        </div>
      </div>

      {/* 演员列表 */}
      {showCast && (
        <div className="space-y-4">
          <SkeletonText width={128} height={32} disableAnimation={disableAnimation} />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 space-y-2">
                <SkeletonBase width={96} height={128} borderRadius={8} disableAnimation={disableAnimation} />
                <SkeletonText width={96} height={16} disableAnimation={disableAnimation} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 相关推荐 */}
      {showRecommendations && (
        <div className="space-y-4">
          <SkeletonText width={160} height={32} disableAnimation={disableAnimation} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <SkeletonBase
                  width="100%"
                  height={0}
                  borderRadius={8}
                  className="aspect-[2/3]"
                  disableAnimation={disableAnimation}
                />
                <SkeletonText width="100%" height={16} disableAnimation={disableAnimation} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SkeletonDetail
