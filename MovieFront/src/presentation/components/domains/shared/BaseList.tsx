/**
 * @fileoverview 基础列表组件
 * @description 提供统一的列表布局和响应式网格功能，支持加载状态和空状态，遵循自包含组件设计原则
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { SkeletonCardGrid } from '@components/atoms/Skeleton'
import { RESPONSIVE_CONFIGS } from '@tokens/responsive-configs'
import { cn } from '@utils/cn'
import React from 'react'

// 响应式列数配置接口，定义各断点下的列数配置格式
export interface ResponsiveColumnsConfig {
  xs?: number // 超小屏幕断点配置
  sm?: number // 小屏幕断点配置
  md?: number // 中等屏幕断点配置
  lg?: number // 大屏幕断点配置
  xl?: number // 超大屏幕断点配置
  xxl?: number // 超超大屏幕断点配置
}

interface BaseListProps<T = any> {
  items: T[] // 列表数据
  columns?: ResponsiveColumnsConfig // 响应式列数配置，默认使用RESPONSIVE_CONFIGS.baseList
  variant?: 'grid' | 'list' // 列表变体，默认网格布局
  loading?: boolean // 是否显示加载状态，默认false
  isPageChanging?: boolean // 页面切换状态标志，用于优先显示骨架屏
  showEmptyState?: boolean // 是否显示空状态，默认true
  emptyText?: string // 空状态文本，默认"暂无数据"
  className?: string // 自定义CSS类名
  renderItem: (item: T, index: number) => React.ReactNode // 渲染单个项目的函数
}

// 基础列表组件，提供统一的列表布局和响应式网格功能，支持加载状态和空状态显示
export const BaseList = <T,>({
  items,
  columns = RESPONSIVE_CONFIGS.baseList,
  variant = 'grid',
  loading = false,
  isPageChanging = false,
  showEmptyState = true,
  emptyText = "暂无数据",
  className,
  renderItem,
}: BaseListProps<T>) => {
  // 生成响应式列数CSS类名 - 使用映射表确保Tailwind JIT能识别
  const generateColumnsClasses = (cols: ResponsiveColumnsConfig): string => {
    const classes: string[] = []

    // 列数到类名的映射表
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

  // 加载状态 - 页面切换时或初次加载且无数据时显示骨架屏
  if (isPageChanging || (loading && (!items || items.length === 0))) {
    return (
      <SkeletonCardGrid
        count={12}
        columns={columns}
        aspectRatio="portrait"
        className={className}
      />
    )
  }

  // 空状态 - 显示无数据提示
  if (showEmptyState && (!items || items.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-lg">{emptyText}</p>
      </div>
    )
  }

  // 列表模式 - 垂直堆叠布局
  if (variant === 'list') {
    return (
      <div className={cn("space-y-4", className)}>
        {items.map((item, index) => (
          <div key={index}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    )
  }

  // 网格模式（默认）- 响应式网格布局
  return (
    <div className={cn(
      "grid gap-4 sm:gap-6",
      generateColumnsClasses(columns),
      className
    )}>
      {items.map((item, index) => (
        <div key={index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}
