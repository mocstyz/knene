/**
 * @fileoverview 新片标签层组件
 * @description 提供统一的新片标签显示逻辑，遵循DRY原则。
 * 支持多种新片标识类型和样式变体，可在各种卡片组件中复用。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import {
  badgeLayerVariants,
  type BadgeLayerPosition,
  type BadgeLayerVariant,
  type BadgeLayerSize,
} from '@tokens/design-system'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 新片类型枚举
 */
export type NewBadgeType = 
  | 'hot' // 热门
  | 'latest' // 最新
  | 'exclusive' // 独家
  | null // 无标签

/**
 * 新片标签层组件属性接口
 */
export interface NewBadgeLayerProps {
  /** 是否显示新片标签 */
  isNew?: boolean
  /** 新片类型 */
  newType?: NewBadgeType
  /** 自定义CSS类名 */
  className?: string
  /** 标签位置 */
  position?: BadgeLayerPosition
  /** 标签尺寸 */
  size?: BadgeLayerSize
  /** 标签变体 */
  variant?: BadgeLayerVariant
  /** 自定义标签文本 */
  text?: string
  /** 是否显示动画效果 */
  animated?: boolean
  /** 动画类型 */
  animationType?: 'pulse' | 'bounce' | 'none'
  /** 背景颜色变体 */
  colorVariant?: 'red' | 'blue' | 'green' | 'purple' | 'orange' | 'gradient'
}

/**
 * 新片标签层组件
 *
 * 提供统一的新片标签显示，支持多种位置、样式和动画效果。
 */
const NewBadgeLayer: React.FC<NewBadgeLayerProps> = ({
  isNew = true,
  newType = 'latest',
  className,
  position = 'top-left',
  size = 'responsive',
  variant: _variant,
  text,
  animated = true,
  animationType = 'pulse',
  colorVariant: _colorVariant,
}) => {
  // 调试输出：检查NewBadgeLayer接收到的props
  console.log('NewBadgeLayer - Received props:', {
    isNew,
    newType,
    position,
    size,
    variant: _variant,
    text,
    animated,
    animationType,
    colorVariant: _colorVariant,
    className
  })

  // 如果不是新片或newType为null，不显示标签
  if (!isNew || newType === null) {
    console.log('NewBadgeLayer - Not rendering: isNew is false or newType is null')
    return null
  }

  // 获取新片类型对应的文本
  const getNewTypeText = (_type: NewBadgeType): string => {
    if (_type === null) return ''
    // 统一返回 'new'，确保所有新片标签显示相同的文本
    return 'new'
  }

  // 获取标签显示文本
  const displayText = text || getNewTypeText(newType)

  // 使用组件变体Token系统组合CSS类名
  const badgeClasses = cn(
    badgeLayerVariants.base,
    badgeLayerVariants.position[position],
    badgeLayerVariants.size[size],
    badgeLayerVariants.variant.new[
      _variant || ('default' as keyof typeof badgeLayerVariants.variant.new)
    ], // 使用Token系统替代硬编码
    // 动画效果
    animated && animationType === 'pulse' && 'animate-pulse',
    animated && animationType === 'bounce' && 'animate-bounce',
    className
  )

  // 调试输出：检查样式类名和渲染信息
  console.log('NewBadgeLayer - Rendering:', {
    displayText,
    badgeClasses,
    variantUsed: _variant || 'default',
    badgeLayerVariantsNew: badgeLayerVariants.variant.new,
    finalClassName: badgeClasses
  })

  return <div className={badgeClasses}>{displayText}</div>
}

export default NewBadgeLayer
