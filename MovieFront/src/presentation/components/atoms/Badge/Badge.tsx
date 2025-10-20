/**
 * @fileoverview 基础标签原子组件
 * @description 提供统一的标签显示功能，支持多种变体、尺寸和形状，遵循组件变体Token系统，可在各种场景中复用，使用Tailwind CSS实现样式管理
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-19 15:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'

// 标签组件属性接口，定义标签组件的所有配置选项
export interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' // 标签变体类型
  size?: 'sm' | 'md' | 'lg' // 标签尺寸预设
  shape?: 'rounded' | 'pill' // 标签形状，圆角或胶囊形
  children: React.ReactNode // 标签内容
  className?: string // 自定义CSS类名
}

// 基础标签组件，提供统一的标签显示功能，支持多种变体、尺寸和形状
const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  shape = 'rounded',
  children,
  className,
}) => {
  // 基础样式类配置，定义标签组件的通用样式
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-semibold whitespace-nowrap',
    'transition-colors duration-200',
  ]

  // 变体样式映射配置，定义不同类型标签对应的颜色样式
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 border border-gray-300',
    primary: 'bg-blue-100 text-blue-800 border border-blue-300',
    secondary: 'bg-purple-100 text-purple-800 border border-purple-300',
    success: 'bg-green-100 text-green-800 border border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    danger: 'bg-red-100 text-red-800 border border-red-300',
    info: 'bg-cyan-100 text-cyan-800 border border-cyan-300',
  }

  // 尺寸样式映射配置，定义不同尺寸对应的内边距和字体大小
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-2.5 py-1 text-sm',
  }

  // 形状样式映射配置，定义不同形状对应的圆角样式
  const shapeClasses = {
    rounded: 'rounded-md',
    pill: 'rounded-full',
  }

  // 渲染标签组件 - 合并所有样式类并应用子元素
  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        shapeClasses[shape],
        className
      )}
    >
      {children}
    </span>
  )
}

export { Badge }
