/**
 * @fileoverview 基础标签原子组件
 * @description 提供统一的标签显示功能，支持多种变体、尺寸和形状。
 * 遵循组件变体Token系统，可在各种场景中复用。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'

/**
 * 标签组件属性接口
 */
export interface BadgeProps {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
  size?: 'sm' | 'md' | 'lg'
  shape?: 'rounded' | 'pill'
  children: React.ReactNode
  className?: string
}

/**
 * 基础标签组件
 *
 * 提供统一的标签显示功能，支持多种变体、尺寸和形状。
 * 使用Tailwind CSS + clsx工具实现样式管理，遵循响应式设计原则。
 */
const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  shape = 'rounded',
  children,
  className,
}) => {
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-semibold whitespace-nowrap',
    'transition-colors duration-200',
  ]

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 border border-gray-300',
    primary: 'bg-blue-100 text-blue-800 border border-blue-300',
    secondary: 'bg-purple-100 text-purple-800 border border-purple-300',
    success: 'bg-green-100 text-green-800 border border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    danger: 'bg-red-100 text-red-800 border border-red-300',
    info: 'bg-cyan-100 text-cyan-800 border border-cyan-300',
  }

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-2.5 py-1 text-sm',
  }

  const shapeClasses = {
    rounded: 'rounded-md',
    pill: 'rounded-full',
  }

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
