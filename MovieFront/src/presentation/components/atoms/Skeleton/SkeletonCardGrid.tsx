/**
 * @fileoverview 卡片网格骨架屏组件
 * @description 用于卡片网格布局的加载占位符,支持响应式列数配置
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'
import { SkeletonCard } from './SkeletonCard'

// 响应式列数配置接口
export interface ResponsiveColumnsConfig {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  xxl?: number
}

export interface SkeletonCardGridProps {
  count?: number
  columns?: ResponsiveColumnsConfig
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape'
  showTitle?: boolean
  showDescription?: boolean
  className?: string
  disableAnimation?: boolean
}

// 生成响应式列数CSS类名
const generateColumnsClasses = (cols: ResponsiveColumnsConfig): string => {
  const classes: string[] = []

  const colsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }

  const smColsMap: Record<number, string> = {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
    5: 'sm:grid-cols-5',
    6: 'sm:grid-cols-6',
  }

  const mdColsMap: Record<number, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
  }

  const lgColsMap: Record<number, string> = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
  }

  const xlColsMap: Record<number, string> = {
    1: 'xl:grid-cols-1',
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
    5: 'xl:grid-cols-5',
    6: 'xl:grid-cols-6',
  }

  const xxlColsMap: Record<number, string> = {
    1: 'xxl:grid-cols-1',
    2: 'xxl:grid-cols-2',
    3: 'xxl:grid-cols-3',
    4: 'xxl:grid-cols-4',
    5: 'xxl:grid-cols-5',
    6: 'xxl:grid-cols-6',
  }

  if (cols.xs && colsMap[cols.xs]) classes.push(colsMap[cols.xs])
  if (cols.sm && smColsMap[cols.sm]) classes.push(smColsMap[cols.sm])
  if (cols.md && mdColsMap[cols.md]) classes.push(mdColsMap[cols.md])
  if (cols.lg && lgColsMap[cols.lg]) classes.push(lgColsMap[cols.lg])
  if (cols.xl && xlColsMap[cols.xl]) classes.push(xlColsMap[cols.xl])
  if (cols.xxl && xxlColsMap[cols.xxl]) classes.push(xxlColsMap[cols.xxl])

  return classes.join(' ')
}

// 卡片网格骨架屏组件,支持响应式布局
export const SkeletonCardGrid: React.FC<SkeletonCardGridProps> = ({
  count = 12,
  columns = { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
  aspectRatio = 'portrait',
  showTitle = false,
  showDescription = false,
  className,
  disableAnimation,
}) => {
  return (
    <div className={cn('grid gap-4 sm:gap-6', generateColumnsClasses(columns), className)}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard
          key={index}
          aspectRatio={aspectRatio}
          showTitle={showTitle}
          showDescription={showDescription}
          disableAnimation={disableAnimation}
        />
      ))}
    </div>
  )
}

export default SkeletonCardGrid
