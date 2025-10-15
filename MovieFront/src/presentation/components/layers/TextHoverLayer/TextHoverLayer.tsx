/**
 * @fileoverview 文本悬停效果层组件
 * @description 提供统一的文本悬停变色效果，遵循DRY原则。
 * 作为包装器组件，可在各种文本组件中复用，配合CardHoverLayer使用。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 2.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'

/**
 * 文本悬停效果层组件属性接口
 */
export interface TextHoverLayerProps {
  /** 子元素 */
  children: React.ReactNode
  /** 自定义CSS类名 */
  className?: string
  /** hover颜色 */
  hoverColor?: 'red' | 'primary' | 'blue' | 'green' | 'yellow'
  /** 过渡动画时长 */
  duration?: 'fast' | 'normal' | 'slow'
  /** 是否禁用hover效果 */
  disabled?: boolean
  /** 文本元素标签类型 */
  as?: 'span' | 'p' | 'div'
  /** 是否启用缩放效果 */
  enableScale?: boolean
  /** 缩放比例 */
  scale?: 'sm' | 'md' | 'lg'
}

/**
 * 文本悬停效果层组件
 *
 * 提供统一的文本悬停功能，支持变色和缩放效果。
 * 作为包装器组件，配合CardHoverLayer的group-hover机制使用。
 */
const TextHoverLayer: React.FC<TextHoverLayerProps> = ({
  children,
  className,
  hoverColor = 'red',
  duration = 'normal',
  disabled = false,
  as: Component = 'span',
  enableScale = false,
  scale = 'md',
}) => {
  // hover颜色样式映射 - 完全保持现有的text-red-500效果
  const colorClasses = {
    red: 'group-hover:text-red-500', // 保持现有效果
    primary: 'group-hover:text-primary',
    blue: 'group-hover:text-blue-500',
    green: 'group-hover:text-green-500',
    yellow: 'group-hover:text-yellow-500',
  }

  // 过渡动画时长样式映射
  const durationClasses = {
    fast: 'duration-200', // 保持现有效果
    normal: 'duration-300',
    slow: 'duration-500',
  }

  // 缩放效果样式映射
  const scaleClasses = {
    sm: 'group-hover:scale-105',
    md: 'group-hover:scale-105',
    lg: 'group-hover:scale-110',
  }

  // 基础过渡效果
  const baseClasses = 'transition-all inline-block'

  // 组合CSS类名
  const hoverClasses = cn(
    baseClasses,
    durationClasses[duration],
    colorClasses[hoverColor],
    enableScale && scaleClasses[scale],
    disabled && 'pointer-events-none',
    className
  )

  return (
    <Component className={hoverClasses}>
      {children}
    </Component>
  )
}

export default TextHoverLayer