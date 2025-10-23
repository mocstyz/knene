/**
 * @fileoverview 标题显示层组件
 * @description 提供统一的标题显示逻辑，遵循DRY原则，支持多种标题样式、截断处理和交互行为，可在各种卡片组件中复用
 *              包含多种文本变体、尺寸配置、颜色主题、字体权重、最大行数限制和点击交互，提供完整的标题展示解决方案
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import { getRatingTextColorClass } from '@utils/formatters'
import React from 'react'

// 标题显示层组件属性接口，定义标题显示的完整配置选项
export interface TitleLayerProps {
  title: string // 标题文本
  className?: string // 自定义CSS类名
  variant?: 'primary' | 'secondary' | 'overlay' | 'compact' | 'collection' | 'movie' | 'photo' | 'ranking' // 标题变体，默认'primary'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' // 标题大小，默认'md'
  maxLines?: 1 | 2 | 3 | 4 // 文本截断行数，默认1
  align?: 'left' | 'center' | 'right' // 文本对齐方式，默认'left'
  color?: 'primary' | 'secondary' | 'white' | 'gray' | 'rating' // 标题颜色，默认'primary'
  rating?: number // 评分值，用于动态颜色
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' // 字体粗细，默认'normal'
  clickable?: boolean // 是否可点击，默认false
  onClick?: () => void // 点击事件处理
  showGradient?: boolean // 是否显示渐变遮罩，默认false
  hoverEffect?: { // hover效果配置
    enabled?: boolean // 是否启用hover效果
    hoverColor?: 'red' | 'primary' | 'blue' | 'green' // hover时的颜色
    transitionDuration?: string // 过渡动画时长
  }
}

// 标题显示层组件，提供统一的标题显示功能，支持多种样式变体和交互行为
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
  // 字体粗细样式映射 - 定义不同字体粗细对应的CSS类名
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  // 变体样式映射 - 定义不同标题变体对应的CSS类名
  const variantClasses = {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-700 dark:text-gray-300',
    overlay: 'text-white',
    compact: 'text-gray-900 dark:text-white',
    // 业务领域特定变体
    collection: 'text-white font-bold',
    movie: 'text-gray-900 dark:text-white font-medium',
    photo: 'text-gray-800 dark:text-gray-200',
    ranking: 'text-primary font-semibold',
  }

  // 尺寸样式映射 - 定义不同标题尺寸对应的CSS类名
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  }

  // 对齐样式映射 - 定义不同对齐方式对应的CSS类名
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  // 颜色样式映射函数 - 根据颜色配置返回对应的CSS类名
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
        // 根据评分值动态返回颜色
        return rating !== undefined
          ? getRatingTextColorClass(rating)
          : 'text-white dark:text-white'
      default:
        return 'text-gray-900 dark:text-white'
    }
  }

  // 文本截断样式映射 - 定义不同行数对应的截断CSS类名
  const truncateClasses = {
    1: 'overflow-hidden text-ellipsis whitespace-nowrap',
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
  }

  // 可点击样式配置 - 根据clickable状态返回对应的CSS类名
  const clickableClasses = clickable
    ? 'cursor-pointer transition-colors duration-200'
    : ''

  // hover效果样式函数 - 支持父容器hover，返回对应的CSS类名
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

  // 组合CSS类名 - 合并所有样式相关的CSS类名
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
