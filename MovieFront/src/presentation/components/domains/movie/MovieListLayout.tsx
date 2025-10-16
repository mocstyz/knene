/**
 * @fileoverview Movie列表布局组件
 * @description 负责Movie列表的布局逻辑，包括网格、列表和轮播布局。
 * 遵循DDD架构的组件拆分原则，将布局逻辑从主组件中分离。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'

/**
 * Movie列表布局组件属性接口
 */
export interface MovieListLayoutProps {
  /** 布局变体 */
  variant: 'grid' | 'list' | 'carousel'
  /** 响应式列数配置 */
  columns?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    xxl?: number
  }
  /** 自定义CSS类名 */
  className?: string
  /** 子元素 */
  children: React.ReactNode
}

/**
 * Movie列表布局组件
 *
 * 负责提供统一的列表布局逻辑，支持网格、列表和轮播三种布局模式。
 */
const MovieListLayout: React.FC<MovieListLayoutProps> = ({
  variant,
  columns,
  className,
  children,
}) => {
  // 使用columns参数动态生成响应式网格类
  const effectiveColumns = columns || {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 4,
    xl: 5,
    xxl: 6,
  }

  // 构建响应式网格类 - 严格遵循CLAUDE.md规范中的网格系统规范
  const gridClasses = cn(
    'gap-4 sm:gap-6 lg:gap-8',
    `grid grid-cols-${effectiveColumns.xs} sm:grid-cols-${effectiveColumns.sm} md:grid-cols-${effectiveColumns.md} lg:grid-cols-${effectiveColumns.lg} xl:grid-cols-${effectiveColumns.xl} xxl:grid-cols-${effectiveColumns.xxl}`
  )

  // 构建列表类
  const listClasses = cn(
    'space-y-4',
    variant === 'list' && 'divide-y divide-gray-200 dark:divide-gray-700'
  )

  // 轮播类
  const carouselClasses = cn(
    'flex space-x-4 overflow-x-auto pb-4 scrollbar-hide',
    'snap-x snap-mandatory',
    'scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'
  )

  const layoutClasses = {
    grid: gridClasses,
    list: listClasses,
    carousel: carouselClasses,
  }

  return <div className={cn(layoutClasses[variant], className)}>{children}</div>
}

export { MovieListLayout }
export default MovieListLayout
