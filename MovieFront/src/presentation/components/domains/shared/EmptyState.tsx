/**
 * @fileoverview 通用空状态组件
 * @description 统一的空数据状态展示组件，遵循自包含组件设计原则。
 * 提供一致的空状态视觉效果和用户体验，支持多种变体和自定义配置。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'

/**
 * 空状态组件属性接口
 */
export interface EmptyStateProps {
  /** 空状态消息文本 */
  message?: string
  /** 空状态描述文本 */
  description?: string
  /** 自定义CSS类名 */
  className?: string
  /** 容器样式变体 */
  variant?: 'center' | 'left' | 'right'
  /** 尺寸变体 */
  size?: 'sm' | 'md' | 'lg'
  /** 是否显示图标 */
  showIcon?: boolean
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 文本颜色变体 */
  colorVariant?: 'default' | 'muted' | 'primary'
  /** 垂直内边距 */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * 通用空状态组件
 *
 * 提供统一的空数据状态展示：
 * - 自包含的完整视觉效果
 * - 支持多种布局和样式变体
 * - 可配置的消息和图标
 * - 响应式设计
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  message = '暂无数据',
  description,
  className,
  variant = 'center',
  size = 'md',
  showIcon = false,
  icon,
  colorVariant = 'default',
  padding = 'md',
}) => {
  // 尺寸配置映射
  const sizeClasses = {
    sm: {
      text: 'text-sm',
      icon: 'w-8 h-8',
      container: 'py-4',
    },
    md: {
      text: 'text-base',
      icon: 'w-12 h-12',
      container: 'py-8',
    },
    lg: {
      text: 'text-lg',
      icon: 'w-16 h-16',
      container: 'py-12',
    },
  }

  // 颜色变体配置
  const colorClasses = {
    default: 'text-gray-500 dark:text-gray-400',
    muted: 'text-gray-400 dark:text-gray-500',
    primary: 'text-blue-500 dark:text-blue-400',
  }

  // 布局变体配置
  const layoutClasses = {
    center: 'text-center',
    left: 'text-left',
    right: 'text-right',
  }

  // 内边距配置
  const paddingClasses = {
    none: '',
    sm: 'py-2',
    md: 'py-4',
    lg: 'py-6',
    xl: 'py-8',
  }

  // 容器样式类
  const containerClasses = cn(
    'w-full',
    paddingClasses[padding],
    layoutClasses[variant],
    colorClasses[colorVariant],
    className
  )

  // 默认图标
  const defaultIcon = (
    <svg
      className={cn('h-full w-full', sizeClasses[size].icon)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  )

  return (
    <div className={containerClasses}>
      {/* 图标区域 */}
      {showIcon && (
        <div className={cn('mb-4 flex justify-center', sizeClasses[size].icon)}>
          {icon || defaultIcon}
        </div>
      )}

      {/* 消息文本 */}
      <div className={cn('font-medium', sizeClasses[size].text)}>{message}</div>

      {/* 描述文本 */}
      {description && (
        <div className={cn('mt-2 text-sm', colorClasses.muted)}>
          {description}
        </div>
      )}
    </div>
  )
}

export { EmptyState }
export default EmptyState
