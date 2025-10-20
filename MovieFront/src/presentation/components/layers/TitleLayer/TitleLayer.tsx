/**
 * @fileoverview 标题显示层组件
 * @description 提供统一的标题显示逻辑，遵循DRY原则。
 * 支持多种标题样式、截断处理和交互行为，可在各种卡片组件中复用。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'

/**
 * 标题显示层组件属性接口
 */
export interface TitleLayerProps {
  /** 标题文本 */
  title: string
  /** 自定义CSS类名 */
  className?: string
  /** 标题变体 */
  variant?:
    | 'primary'
    | 'secondary'
    | 'overlay'
    | 'compact'
    | 'topic'
    | 'movie'
    | 'photo'
    | 'ranking'
  /** 标题大小 */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  /** 文本截断行数 */
  maxLines?: 1 | 2 | 3 | 4
  /** 文本对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 标题颜色 */
  color?: 'primary' | 'secondary' | 'white' | 'gray' | 'rating'
  /** 评分值（用于动态颜色） */
  rating?: number
  /** 字体粗细 */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  /** 是否可点击 */
  clickable?: boolean
  /** 点击事件处理 */
  onClick?: () => void
  /** 是否显示渐变遮罩 */
  showGradient?: boolean
  /** hover效果配置 */
  hoverEffect?: {
    /** 是否启用hover效果 */
    enabled?: boolean
    /** hover时的颜色 */
    hoverColor?: 'red' | 'primary' | 'blue' | 'green'
    /** 过渡动画时长 */
    transitionDuration?: string
  }
}

/**
 * 标题显示层组件
 *
 * 提供统一的标题显示功能，支持多种样式变体和交互行为。
 */
const TitleLayer: React.FC<TitleLayerProps> = ({
  title,
  className,
  variant = 'primary',
  size = 'md',
  maxLines = 1,
  align = 'left',
  color = 'primary',
  rating,
  weight = 'normal',
  clickable = false,
  onClick,
  showGradient = false,
  hoverEffect = {
    enabled: false,
    hoverColor: 'red',
    transitionDuration: '200ms',
  },
}) => {
  // 字体粗细样式映射
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  // 变体样式映射
  const variantClasses = {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-700 dark:text-gray-300',
    overlay: 'text-white',
    compact: 'text-gray-900 dark:text-white',
    // 业务领域特定变体
    topic: 'text-white font-bold',
    movie: 'text-gray-900 dark:text-white font-medium',
    photo: 'text-gray-800 dark:text-gray-200',
    ranking: 'text-primary font-semibold',
  }

  // 大小样式映射
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  }

  // 对齐样式映射
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  // 颜色样式映射
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'text-gray-900 dark:text-white'
      case 'secondary':
        return 'text-gray-700 dark:text-gray-300'
      case 'white':
        return 'text-white'
      case 'gray':
        return 'text-gray-600 dark:text-gray-400'
      case 'rating':
        return getRatingColorClass(rating || 0)
      default:
        return 'text-gray-900 dark:text-white'
    }
  }

  // 评分颜色逻辑（复用现有逻辑）
  const getRatingColorClass = (rating: number): string => {
    if (rating >= 9) return 'text-green-400'
    if (rating >= 8) return 'text-blue-400'
    if (rating >= 7) return 'text-cyan-400'
    if (rating >= 6) return 'text-yellow-400'
    if (rating >= 5) return 'text-orange-400'
    if (rating >= 4) return 'text-red-400'
    return 'text-gray-400'
  }

  // 文本截断样式
  const truncateClasses = {
    1: 'overflow-hidden text-ellipsis whitespace-nowrap',
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
  }

  // 可点击样式
  const clickableClasses = clickable
    ? 'cursor-pointer transition-colors duration-200'
    : ''

  // hover效果样式 - 支持父容器hover
  const getHoverClasses = () => {
    if (!hoverEffect?.enabled) return ''

    const durationClass = hoverEffect.transitionDuration
      ? `duration-[${hoverEffect.transitionDuration}]`
      : 'duration-200'

    switch (hoverEffect.hoverColor) {
      case 'red':
        return `transition-colors ${durationClass} group-hover:text-red-500`
      case 'primary':
        return `transition-colors ${durationClass} group-hover:text-primary`
      case 'blue':
        return `transition-colors ${durationClass} group-hover:text-blue-500`
      case 'green':
        return `transition-colors ${durationClass} group-hover:text-green-500`
      default:
        return `transition-colors ${durationClass} group-hover:text-red-500`
    }
  }

  // 组合CSS类名
  const titleClasses = cn(
    weightClasses[weight],
    variantClasses[variant],
    sizeClasses[size],
    alignClasses[align],
    getColorClasses(),
    truncateClasses[maxLines],
    clickableClasses,
    getHoverClasses(),
    className
  )

  // 处理点击事件
  const handleClick = () => {
    if (clickable && onClick) {
      onClick()
    }
  }

  return (
    <div className="relative">
      <h3 className={titleClasses} onClick={handleClick}>
        {title}
      </h3>
      {showGradient && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-950" />
      )}
    </div>
  )
}

export default TitleLayer
