/**
 * @fileoverview 文本骨架屏组件
 * @description 用于标题、段落等文本内容的加载占位符
 * @author MovieFront Team
 * @since 1.0.0
 * @version 1.0.0
 */

import { Skeleton } from '@radix-ui/themes'
import { cn } from '@utils/cn'
import React from 'react'

export interface SkeletonTextProps {
  /**
   * 宽度（Tailwind 类名或百分比）
   */
  width?: string
  
  /**
   * 高度（Tailwind 类名）
   */
  height?: string
  
  /**
   * 自定义类名
   */
  className?: string
  
  /**
   * 行数（用于段落）
   */
  lines?: number
}

/**
 * 文本骨架屏组件
 * 
 * 用于标题、段落等文本内容的加载占位符
 * 
 * @example
 * ```tsx
 * // 标题
 * <SkeletonText width="w-1/2" height="h-8" />
 * 
 * // 段落（多行）
 * <SkeletonText lines={3} />
 * 
 * // 自定义宽度
 * <SkeletonText width="60%" height="h-6" />
 * ```
 */
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  width = 'w-full',
  height = 'h-4',
  className,
  lines = 1,
}) => {
  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            className={cn(
              height,
              index === lines - 1 ? 'w-4/5' : 'w-full',
              'rounded',
              className
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <Skeleton
      className={cn(height, width, 'rounded', className)}
      style={width.includes('%') ? { width } : undefined}
    />
  )
}

export default SkeletonText
