/**
 * @fileoverview 文本骨架屏组件
 * @description 用于文本内容的加载占位符,支持单行和多行文本,使用统一的 shimmer 动画效果
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'
import { SkeletonBase } from './SkeletonBase'

export interface SkeletonTextProps {
  lines?: number
  width?: string | number | Array<string | number>
  height?: string | number
  spacing?: string | number
  className?: string
  disableAnimation?: boolean
}

// 文本骨架屏组件,支持单行和多行文本
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 1,
  width = '100%',
  height = 16,
  spacing = 8,
  className,
  disableAnimation,
}) => {
  // 多行文本
  if (lines > 1) {
    const widths = Array.isArray(width) ? width : Array(lines).fill(width)
    
    return (
      <div className={cn('space-y-2', className)} style={{ gap: typeof spacing === 'number' ? `${spacing}px` : spacing }}>
        {Array.from({ length: lines }).map((_, index) => {
          const lineWidth = widths[index] || width
          return (
            <SkeletonBase
              key={index}
              width={Array.isArray(lineWidth) ? lineWidth[0] : lineWidth}
              height={height}
              borderRadius={4}
              disableAnimation={disableAnimation}
            />
          )
        })}
      </div>
    )
  }

  // 单行文本
  return (
    <SkeletonBase
      width={Array.isArray(width) ? width[0] : width}
      height={height}
      borderRadius={4}
      className={className}
      disableAnimation={disableAnimation}
    />
  )
}

export default SkeletonText
