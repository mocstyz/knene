/**
 * @fileoverview 文本悬停效果层组件
 * @description 提供统一的文本悬停变色效果，遵循DRY原则。
 * 专门处理文本hover变红效果，可在各种文本组件中复用。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'

/**
 * 文本悬停效果层组件属性接口
 */
export interface TextHoverLayerProps {
  /** 自定义CSS类名 */
  className?: string
  /** hover颜色 */
  hoverColor?: 'red' | 'primary' | 'blue' | 'green' | 'yellow'
  /** 过渡动画时长 */
  duration?: 'fast' | 'normal' | 'slow'
  /** 是否禁用hover效果 */
  disabled?: boolean
  /** 目标元素选择器 */
  target?: 'title' | 'subtitle' | 'category' | 'all'
}

/**
 * 文本悬停效果层组件
 *
 * 提供统一的文本悬停变色功能，支持多种颜色和动画效果。
 */
const TextHoverLayer: React.FC<TextHoverLayerProps> = ({
  className,
  hoverColor = 'red',
  duration = 'normal',
  disabled = false,
  target = 'all',
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

  // 目标元素选择器
  const targetClasses = {
    title: '', // 直接应用到文本元素
    subtitle: '',
    category: '',
    all: 'group-hover:text-red-500', // 默认全部文本
  }

  // 基础过渡效果
  const baseClasses = 'transition-colors'

  // 组合CSS类名
  const hoverClasses = cn(
    baseClasses,
    durationClasses[duration],
    target !== 'all' ? targetClasses[target] : colorClasses[hoverColor],
    disabled && 'pointer-events-none',
    className
  )

  return <div className={hoverClasses} />
}

export default TextHoverLayer