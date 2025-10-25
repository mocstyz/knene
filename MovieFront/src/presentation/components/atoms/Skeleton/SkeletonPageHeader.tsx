/**
 * @fileoverview 页面标题骨架屏组件
 * @description 用于列表页面标题区域的加载占位符,包含标题、描述和统计信息
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'
import { SkeletonText } from './SkeletonText'

export interface SkeletonPageHeaderProps {
  showDescription?: boolean
  showStats?: boolean
  className?: string
  disableAnimation?: boolean
}

// 页面标题骨架屏组件,用于列表页面标题区域
export const SkeletonPageHeader: React.FC<SkeletonPageHeaderProps> = ({
  showDescription = false,
  showStats = true,
  className,
  disableAnimation,
}) => {
  return (
    <div className={cn('mb-8 space-y-2', className)}>
      {/* 标题 */}
      <SkeletonText
        width={200}
        height={36}
        disableAnimation={disableAnimation}
      />
      
      {/* 描述 */}
      {showDescription && (
        <SkeletonText
          width={300}
          height={20}
          disableAnimation={disableAnimation}
        />
      )}
      
      {/* 统计信息 */}
      {showStats && (
        <SkeletonText
          width={120}
          height={20}
          disableAnimation={disableAnimation}
        />
      )}
    </div>
  )
}

export default SkeletonPageHeader
