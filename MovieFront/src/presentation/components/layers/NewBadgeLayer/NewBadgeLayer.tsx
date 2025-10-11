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
  | 'new' // 新片
  | 'update' // 新更新
  | 'today' // 今日新增
  | 'latest' // 最新
  | 'hot' // 热门
  | 'exclusive' // 独家

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
  newType = 'new',
  className,
  position = 'top-left',
  size = 'responsive',
  variant: _variant,
  text,
  animated = true,
  animationType = 'pulse',
  colorVariant: _colorVariant,
}) => {
  // 如果不是新片，不显示标签
  if (!isNew) {
    return null
  }

  // 获取新片类型对应的文本
  const getNewTypeText = (type: NewBadgeType): string => {
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
    // 添加红色背景样式，与其他标签保持一致的透明度
    'bg-red-500/80 dark:bg-red-600/80 text-white dark:text-gray-100',
    // 动画效果
    animated && animationType === 'pulse' && 'animate-pulse',
    animated && animationType === 'bounce' && 'animate-bounce',
    className
  )

  return <div className={badgeClasses}>{displayText}</div>
}

export default NewBadgeLayer
