/**
 * @fileoverview 基础List组件
 * @description 通用的列表布局组件，为各种卡片列表提供统一的网格布局。
 * 支持响应式列数配置、多种布局变体和自包含的视觉效果。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import type { ReactNode } from 'react'
import React from 'react'

/**
 * 响应式列数配置接口
 */
export interface ResponsiveColumnsConfig {
  /** 超小屏幕列数 */
  xs?: number
  /** 小屏幕列数 */
  sm?: number
  /** 中等屏幕列数 */
  md?: number
  /** 大屏幕列数 */
  lg?: number
  /** 超大屏幕列数 */
  xl?: number
  /** 超超大屏幕列数 */
  xxl?: number
}

/**
 * 基础List组件属性接口
 */
export interface BaseListProps {
  /** 子元素内容（卡片列表） */
  children: ReactNode
  /** 布局变体 */
  variant?: 'grid' | 'list' | 'carousel'
  /** 响应式列数配置 */
  columns?: ResponsiveColumnsConfig
  /** 自定义CSS类名 */
  className?: string
  /** 网格间距配置 */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * 基础List组件
 *
 * 提供统一的列表布局：
 * - 响应式网格布局
 * - 多种间距配置
 * - 列表和网格变体支持
 * - 自包含的完整布局效果
 */
const BaseList: React.FC<BaseListProps> = ({
  children,
  variant = 'grid',
  columns = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  },
  className,
  gap = 'md',
}) => {
  // 生成响应式列数CSS类
  const generateColumnsClasses = (cols: ResponsiveColumnsConfig): string => {
    const classes: string[] = []

    if (cols.xs) classes.push(`grid-cols-${cols.xs}`)
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`)
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`)
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`)
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`)
    if (cols.xxl) classes.push(`2xl:grid-cols-${cols.xxl}`)

    return classes.join(' ')
  }

  // 间距配置映射
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2 sm:gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
    xl: 'gap-8 sm:gap-10',
  }

  // 根据变体生成基础样式类
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'grid':
        return `grid ${generateColumnsClasses(columns)} ${gapClasses[gap]}`
      case 'list':
        return `flex flex-col ${gapClasses[gap]}`
      case 'carousel':
        return 'flex overflow-x-auto space-x-4 pb-4'
      default:
        return `grid ${generateColumnsClasses(columns)} ${gapClasses[gap]}`
    }
  }

  // 容器样式类
  const containerClasses = cn(getVariantClasses(), className)

  return <div className={containerClasses}>{children}</div>
}

export { BaseList }
export default BaseList
