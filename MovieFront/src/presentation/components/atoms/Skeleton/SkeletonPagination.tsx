/**
 * @fileoverview 分页器骨架屏组件
 * @description 用于分页器的加载占位符,支持简单和完整两种模式
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'
import { SkeletonBase } from './SkeletonBase'

export interface SkeletonPaginationProps {
  mode?: 'simple' | 'full'
  className?: string
  disableAnimation?: boolean
}

// 分页器骨架屏组件
export const SkeletonPagination: React.FC<SkeletonPaginationProps> = ({
  mode = 'full',
  className,
  disableAnimation,
}) => {
  if (mode === 'simple') {
    return (
      <div className={cn('flex items-center justify-center gap-4 mt-8', className)}>
        <SkeletonBase width={80} height={36} borderRadius={8} disableAnimation={disableAnimation} />
        <SkeletonBase width={60} height={36} borderRadius={8} disableAnimation={disableAnimation} />
        <SkeletonBase width={80} height={36} borderRadius={8} disableAnimation={disableAnimation} />
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-center gap-2 mt-8', className)}>
      <SkeletonBase width={36} height={36} borderRadius={8} disableAnimation={disableAnimation} />
      {Array.from({ length: 7 }).map((_, index) => (
        <SkeletonBase
          key={index}
          width={36}
          height={36}
          borderRadius={8}
          disableAnimation={disableAnimation}
        />
      ))}
      <SkeletonBase width={36} height={36} borderRadius={8} disableAnimation={disableAnimation} />
    </div>
  )
}

export default SkeletonPagination
