/**
 * @fileoverview 卡片悬停效果层组件
 * @description 提供统一的卡片悬停缩放效果，遵循DRY原则，专门处理卡片整体缩放效果，可在各种卡片组件中复用。
 *              支持多种缩放比例、动画时长配置、阴影效果控制和禁用状态，提供高性能的CSS group-hover机制。
 * @created 2025-10-21 11:53:35
 * @updated 2025-10-21 16:21:08
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'

// 卡片悬停效果层组件属性接口，定义悬停效果的配置选项
export interface CardHoverLayerProps {
  className?: string // 自定义CSS类名
  scale?: 'none' | 'sm' | 'md' | 'lg' // 缩放比例，默认'md'
  duration?: 'fast' | 'normal' | 'slow' // 过渡动画时长，默认'normal'
  enableShadow?: boolean // 是否启用阴影效果，默认false
  disabled?: boolean // 是否禁用hover效果，默认false
  children?: React.ReactNode // 子元素内容
}

// 卡片悬停效果层组件，提供统一的卡片悬停缩放功能，支持多种缩放比例和动画效果，使用CSS group-hover机制确保高性能和一致性
const CardHoverLayer: React.FC<CardHoverLayerProps> = ({
  className,
  scale = 'md',
  duration = 'normal',
  enableShadow = false,
  disabled = false,
  children,
}) => {
  // 缩放比例样式配置 - 定义不同缩放级别对应的CSS类名
  const scaleClasses = {
    none: '',
    sm: 'group-hover:scale-105',
    md: 'group-hover:scale-105', // 保持现有效果
    lg: 'group-hover:scale-110',
  }

  // 过渡动画时长配置 - 定义不同动画速度对应的CSS类名
  const durationClasses = {
    fast: 'duration-200',
    normal: 'duration-300', // 保持现有效果
    slow: 'duration-500',
  }

  // 阴影效果配置 - 当前版本完全移除阴影效果
  const shadowClasses = ''

  // 基础容器样式 - 设置group类和指针样式
  const baseClasses = 'group cursor-pointer'

  // 外层容器样式类组合 - 合并基础样式、禁用状态和自定义类名
  const hoverClasses = cn(
    baseClasses,
    disabled && 'pointer-events-none cursor-default',
    className
  )

  // 内层子元素样式类组合 - 合并过渡动画、缩放效果和性能优化类名
  const childClasses = cn(
    'transition-transform',
    durationClasses[duration],
    scaleClasses[scale],
    shadowClasses,
    // 性能优化 - 防止缩放时出现白线和提升渲染性能
    'backface-hidden transform-gpu will-change-transform'
  )

  return (
    <div className={hoverClasses}>
      <div className={childClasses}>{children}</div>
    </div>
  )
}

export default CardHoverLayer
