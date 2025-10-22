/**
 * @fileoverview 分类标签组件
 * @description 提供统一的分类标签显示功能，支持多种业务场景和样式变体。可用于电影类型、专题分类、内容标签等各种分类场景。
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-19 15:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'

// 分类标签组件属性接口，定义标签的各种样式和行为配置
export interface CategoryLabelProps {
  label: string // 标签文本内容
  className?: string // 自定义CSS类名
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline' // 标签变体样式
  size?: 'xs' | 'sm' | 'md' | 'lg' // 标签大小
  business?: 'movie' | 'collection' | 'photo' | 'ranking' | 'vip' // 业务场景类型，覆盖variant样式
  bordered?: boolean // 是否显示边框
  clickable?: boolean // 是否可点击
  onClick?: () => void // 点击事件处理函数
  prefix?: React.ReactNode // 前缀图标
  suffix?: React.ReactNode // 后缀图标
  badge?: boolean // 是否显示为徽章样式（圆角）
}

// 分类标签组件，提供统一的分类标签显示功能，支持多种样式变体和业务场景
const CategoryLabel: React.FC<CategoryLabelProps> = ({
  label,
  className,
  variant = 'default',
  size = 'sm',
  business,
  bordered = false,
  clickable = false,
  onClick,
  prefix,
  suffix,
  badge = false,
}) => {
  // 大小样式映射表 - 定义不同尺寸的内边距和字体大小
  const sizeClasses = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-sm px-2.5 py-1',
    md: 'text-base px-3 py-1.5',
    lg: 'text-lg px-4 py-2',
  }

  // 变体样式映射表 - 定义不同颜色主题的背景和文字颜色
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    secondary: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    outline: 'bg-transparent border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
  }

  // 业务场景样式映射表 - 定义特定业务场景的专用样式
  const businessClasses = {
    movie: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    collection: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    photo: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    ranking: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    vip: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-medium',
  }

  // 根据配置计算边框样式类名
  const borderClasses = bordered ? 'border border-current/20' : ''

  // 根据可点击配置计算交互样式类名 - 包含悬停缩放和阴影效果
  const clickableClasses = clickable
    ? 'cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95'
    : ''

  // 根据徽章配置计算圆角样式类名
  const badgeClasses = badge ? 'rounded-full' : 'rounded'

  // 组合最终的CSS类名 - 合并基础样式、尺寸、变体、边框、交互等样式
  const labelClasses = cn(
    'inline-flex items-center gap-1 font-medium transition-colors',
    sizeClasses[size],
    business ? businessClasses[business] : variantClasses[variant],
    borderClasses,
    clickableClasses,
    badgeClasses,
    className
  )

  // 安全处理点击事件 - 只有在可点击且有回调函数时才触发
  const handleClick = () => {
    if (clickable && onClick) {
      onClick()
    }
  }

  return (
    <span className={labelClasses} onClick={handleClick}>
      {prefix && <span className="flex-shrink-0">{prefix}</span>}
      <span className="truncate">{label}</span>
      {suffix && <span className="flex-shrink-0">{suffix}</span>}
    </span>
  )
}

export default CategoryLabel
