/**
 * @fileoverview 列表页骨架屏组件
 * @description 用于列表页的完整加载占位符,包含页面标题、内容网格和分页器
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'
import { SkeletonPageHeader } from './SkeletonPageHeader'
import { SkeletonCardGrid, type ResponsiveColumnsConfig } from './SkeletonCardGrid'
import { SkeletonPagination } from './SkeletonPagination'

export interface SkeletonListPageProps {
  showPageHeader?: boolean
  cardCount?: number
  columns?: ResponsiveColumnsConfig
  showPagination?: boolean
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape'
  className?: string
  disableAnimation?: boolean
}

// 列表页骨架屏组件,包含标题、内容网格和分页器
export const SkeletonListPage: React.FC<SkeletonListPageProps> = ({
  showPageHeader = true,
  cardCount = 12,
  columns = { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
  showPagination = true,
  aspectRatio = 'portrait',
  className,
  disableAnimation,
}) => {
  return (
    <div className={cn('container mx-auto px-4 pb-8 pt-24 sm:px-6 lg:px-8', className)}>
      {/* 页面标题 */}
      {showPageHeader && (
        <SkeletonPageHeader disableAnimation={disableAnimation} />
      )}

      {/* 内容网格 */}
      <SkeletonCardGrid
        count={cardCount}
        columns={columns}
        aspectRatio={aspectRatio}
        disableAnimation={disableAnimation}
      />

      {/* 分页器 */}
      {showPagination && (
        <SkeletonPagination
          mode="full"
          disableAnimation={disableAnimation}
        />
      )}
    </div>
  )
}

export default SkeletonListPage
