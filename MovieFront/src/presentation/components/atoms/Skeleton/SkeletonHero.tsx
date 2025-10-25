/**
 * @fileoverview Hero 区域骨架屏组件
 * @description 用于首页 Hero 轮播区域的加载占位符,使用统一的 shimmer 动画效果
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'
import { SkeletonBase } from './SkeletonBase'
import { SkeletonText } from './SkeletonText'

export interface SkeletonHeroProps {
  height?: string
  className?: string
  showContent?: boolean
  disableAnimation?: boolean
}

// Hero 区域骨架屏组件,用于首页 Hero 轮播区域
export const SkeletonHero: React.FC<SkeletonHeroProps> = ({
  height = 'h-[500px]',
  className,
  showContent = true,
  disableAnimation,
}) => {
  return (
    <div className={cn('relative w-full', height, className)}>
      {/* 背景图骨架屏 */}
      <SkeletonBase
        width="100%"
        height="100%"
        borderRadius={8}
        disableAnimation={disableAnimation}
        className="absolute inset-0"
      />
      
      {/* 内容区域骨架屏 */}
      {showContent && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-2xl space-y-4 px-4 w-full">
            {/* 标题 */}
            <SkeletonText
              width="75%"
              height={48}
              disableAnimation={disableAnimation}
            />
            
            {/* 描述 */}
            <div className="space-y-2">
              <SkeletonText
                width="100%"
                height={24}
                disableAnimation={disableAnimation}
              />
              <SkeletonText
                width="85%"
                height={24}
                disableAnimation={disableAnimation}
              />
            </div>
            
            {/* 按钮组 */}
            <div className="flex gap-4">
              <SkeletonBase
                width={128}
                height={48}
                borderRadius={8}
                disableAnimation={disableAnimation}
              />
              <SkeletonBase
                width={128}
                height={48}
                borderRadius={8}
                disableAnimation={disableAnimation}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SkeletonHero
