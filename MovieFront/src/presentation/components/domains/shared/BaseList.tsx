import { RESPONSIVE_CONFIGS } from '@tokens/responsive-configs'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * @fileoverview 基础列表组件
 * @description 提供统一的列表布局和响应式网格功能，支持加载状态和空状态
 * 
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

/**
 * 响应式列数配置接口
 */
export interface ResponsiveColumnsConfig {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  xxl?: number
}

interface BaseListProps<T = any> {
  /**
   * 列表数据
   */
  items: T[]
  
  /**
   * 响应式列数配置
   * @default RESPONSIVE_CONFIGS.baseList
   */
  columns?: ResponsiveColumnsConfig
  
  /**
   * 列表变体
   * @default 'grid'
   */
  variant?: 'grid' | 'list'
  
  /**
   * 是否显示加载状态
   * @default false
   */
  loading?: boolean
  
  /**
   * 是否显示空状态
   * @default true
   */
  showEmptyState?: boolean
  
  /**
   * 空状态文本
   * @default "暂无数据"
   */
  emptyText?: string
  
  /**
   * 自定义CSS类名
   */
  className?: string
  
  /**
   * 渲染单个项目的函数
   */
  renderItem: (item: T, index: number) => React.ReactNode
}

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
  /**
   * 生成响应式列数CSS类名
   */
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

  // 加载状态
  if (loading) {
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

  // 空状态
  if (showEmptyState && (!items || items.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-lg">{emptyText}</p>
      </div>
    )
  }

  // 列表模式
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

  // 网格模式（默认）
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
