/**
 * @fileoverview 基础列表组件
 * @description 提供统一的列表布局和响应式网格功能，支持加载状态和空状态，遵循自包含组件设计原则
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

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
  showEmptyState = true,
  emptyText = "暂无数据",
  className,
  renderItem,
}: BaseListProps<T>) => {
  // 生成响应式列数CSS类名 - 根据各断点配置生成对应的grid样式类
  const generateColumnsClasses = (cols: ResponsiveColumnsConfig): string => {
    const classes: string[] = []

    if (cols.xs) classes.push(`grid-cols-${cols.xs}`)
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`)
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`)
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`)
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`)
    if (cols.xxl) classes.push(`xxl:grid-cols-${cols.xxl}`)

    return classes.join(' ')
  }

  // 加载状态 - 只在初次加载且无数据时显示骨架屏，分页时保持数据显示
  if (loading && (!items || items.length === 0)) {
    return (
      <div className={cn(
        "grid gap-4 sm:gap-6",
        generateColumnsClasses(columns),
        className
      )}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[3/4]"
          />
        ))}
      </div>
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
