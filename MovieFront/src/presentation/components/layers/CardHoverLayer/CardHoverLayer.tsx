/**
 * @fileoverview 卡片悬停效果层组件
 * @description 提供统一的卡片悬停缩放效果，遵循DRY原则。
 * 专门处理卡片整体缩放效果，可在各种卡片组件中复用。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'

/**
 * 卡片悬停效果层组件属性接口
 */
export interface CardHoverLayerProps {
  /** 自定义CSS类名 */
  className?: string
  /** 缩放比例 */
  scale?: 'none' | 'sm' | 'md' | 'lg'
  /** 过渡动画时长 */
  duration?: 'fast' | 'normal' | 'slow'
  /** 是否启用阴影效果 */
  enableShadow?: boolean
  /** 是否禁用hover效果 */
  disabled?: boolean
  /** 子元素 */
  children?: React.ReactNode
}

/**
 * 卡片悬停效果层组件
 *
 * 提供统一的卡片悬停缩放功能，支持多种缩放比例和动画效果。
 * 使用CSS group-hover机制，确保高性能和一致性。
 */
const CardHoverLayer: React.FC<CardHoverLayerProps> = ({
  className,
  scale = 'md',
  duration = 'normal',
  enableShadow = false,
  disabled = false,
  children,
}) => {
  // 缩放比例样式映射 - 保持原有的scale-105效果
  const scaleClasses = {
    none: '',
    sm: 'group-hover:scale-105',
    md: 'group-hover:scale-105', // 保持现有效果
    lg: 'group-hover:scale-110',
  }

  // 过渡动画时长样式映射
  const durationClasses = {
    fast: 'duration-200',
    normal: 'duration-300', // 保持现有效果
    slow: 'duration-500',
  }

  // 完全移除阴影效果
  const shadowClasses = ''

  // 基础过渡效果
  const baseClasses = 'group cursor-pointer'

  // 组合CSS类名
  const hoverClasses = cn(
    baseClasses,
    disabled && 'pointer-events-none cursor-default',
    className
  )

  const childClasses = cn(
    'transition-transform',
    durationClasses[duration],
    scaleClasses[scale],
    shadowClasses,
    // 添加边缘优化，防止缩放时出现白线
    'backface-hidden transform-gpu will-change-transform'
  )

  return (
    <div className={hoverClasses}>
      <div className={childClasses}>{children}</div>
    </div>
  )
}

export default CardHoverLayer
