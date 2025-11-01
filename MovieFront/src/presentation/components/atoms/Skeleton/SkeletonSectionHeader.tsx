/**
 * @fileoverview Section 标题骨架屏组件
 * @description 用于首页 Section 标题区域的加载占位符,包含标题和"查看更多"链接
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'
import { SkeletonText } from './SkeletonText'

export interface SkeletonSectionHeaderProps {
  showMoreLink?: boolean
  className?: string
  disableAnimation?: boolean
}

// Section 标题骨架屏组件,用于首页 Section 标题区域
export const SkeletonSectionHeader: React.FC<SkeletonSectionHeaderProps> = ({
  showMoreLink = true,
  className,
  disableAnimation,
}) => {
  return (
    <div className={cn('flex items-center justify-between mb-6', className)}>
      {/* Section 标题 */}
      <SkeletonText
        width={150}
        height={28}
        disableAnimation={disableAnimation}
      />
      
      {/* "查看更多"链接 */}
      {showMoreLink && (
        <SkeletonText
          width={80}
          height={20}
          disableAnimation={disableAnimation}
        />
      )}
    </div>
  )
}

export default SkeletonSectionHeader
