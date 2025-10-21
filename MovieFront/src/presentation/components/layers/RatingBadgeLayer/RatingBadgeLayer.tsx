/**
 * @fileoverview 评分标签层组件
 * @description 提供统一的评分标签显示逻辑，遵循DRY原则和组件变体Token系统，支持多种评分颜色和样式变体
 *              可在各种卡片组件中复用，响应式设计，移动端优先，使用组件变体Token系统统一样式管理
 * @created 2025-10-20 17:37:48
 * @updated 2025-10-21 16:21:08
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import {
  badgeLayerVariants,
  type BadgeLayerPosition,
  type BadgeLayerVariant,
  type BadgeLayerSize,
  type BadgeLayerRatingColor,
} from '@tokens/design-system'
import { cn } from '@utils/cn'
import { formatAndValidateRating } from '@utils/formatters'
import React from 'react'

// 获取评分颜色样式函数，根据评分返回对应的颜色类型，使用组件变体Token系统
const getRatingColorClass = (rating: number): BadgeLayerRatingColor => {
  if (rating >= 8.5) return 'green'
  if (rating >= 7.5) return 'blue'
  if (rating >= 6.5) return 'yellow'
  if (rating >= 5.5) return 'orange'
  return 'red'
}

// 评分标签层组件属性接口，定义评分标签的配置选项
export interface RatingBadgeLayerProps {
  rating?: number | string // 评分值 (0-10) 或字符串评分，默认0
  className?: string // 自定义CSS类名
  position?: BadgeLayerPosition // 标签位置，默认'bottom-left'
  size?: BadgeLayerSize // 标签尺寸，默认'responsive'
  variant?: BadgeLayerVariant // 标签变体，默认'default'
  textColor?: BadgeLayerRatingColor // 强制指定文本颜色类型，覆盖自动计算的评分颜色
  backgroundColor?: string // 自定义背景色
}

// 评分标签层组件，提供统一的评分标签显示，使用组件变体Token系统，支持多种位置和样式变体，响应式设计，移动端优先
const RatingBadgeLayer: React.FC<RatingBadgeLayerProps> = ({
  rating = 0,
  className,
  position = 'bottom-left',
  size = 'responsive',
  variant = 'default',
  textColor,
  backgroundColor,
}) => {
  // 使用评分验证和格式化函数
  const ratingResult = formatAndValidateRating(rating)

  // 如果评分无效，不显示标签
  if (!ratingResult.isValid) {
    return null
  }

  // 确定文本颜色 - 使用组件变体Token系统
  const finalTextColor =
    textColor ||
    (ratingResult.numericValue
      ? getRatingColorClass(ratingResult.numericValue)
      : 'white')

  // 使用组件变体Token系统组合CSS类名
  const badgeClasses = cn(
    badgeLayerVariants.base,
    badgeLayerVariants.position[position],
    badgeLayerVariants.size[size],
    badgeLayerVariants.variant.rating[variant],
    badgeLayerVariants.ratingColor[finalTextColor],
    // 如果指定了自定义背景色，覆盖默认背景
    backgroundColor && `!${backgroundColor}`,
    className
  )

  return <div className={badgeClasses}>{ratingResult.displayText}</div>
}

export default RatingBadgeLayer
