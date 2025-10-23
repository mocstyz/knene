/**
 * @fileoverview Hero 区域骨架屏组件
 * @description 用于首页 Hero 轮播区域的加载占位符
 * @author MovieFront Team
 * @since 1.0.0
 * @version 1.0.0
 */

import { Skeleton } from '@radix-ui/themes'
import { cn } from '@utils/cn'
import React from 'react'

export interface SkeletonHeroProps {
  /**
   * 高度（Tailwind 类名）
   */
  height?: string
  
  /**
   * 自定义类名
   */
  className?: string
  
  /**
   * 是否显示标题和描述
   */
  showContent?: boolean
}

/**
 * Hero 区域骨架屏组件
 * 
 * 用于首页 Hero 轮播区域的加载占位符
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <SkeletonHero />
 * 
 * // 自定义高度
 * <SkeletonHero height="h-96" />
 * 
 * // 带内容区域
 * <SkeletonHero showContent />
 * ```
 */
export const SkeletonHero: React.FC<SkeletonHeroProps> = ({
  height = 'h-[500px]',
  className,
  showContent = true,
}) => {
  return (
    <div className={cn('relative w-full', height, className)}>
      {/* 背景图骨架屏 */}
      <Skeleton className="absolute inset-0 rounded-lg" />
      
      {/* 内容区域骨架屏 */}
      {showContent && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-2xl space-y-4 px-4">
            {/* 标题 */}
            <Skeleton className="h-12 w-3/4 rounded" />
            
            {/* 描述 */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-full rounded" />
              <Skeleton className="h-6 w-5/6 rounded" />
            </div>
            
            {/* 按钮组 */}
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32 rounded-lg" />
              <Skeleton className="h-12 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SkeletonHero
