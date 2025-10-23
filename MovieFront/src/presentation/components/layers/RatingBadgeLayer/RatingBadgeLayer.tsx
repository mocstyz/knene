/**
 * @fileoverview 评分标签层组件
 * @description 提供统一的评分标签显示逻辑，遵循DRY原则和组件变体Token系统，支持多种评分颜色和样式变体
 *              可在各种卡片组件中复用，响应式设计，移动端优先，使用组件变体Token系统统一样式管理
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
import { formatAndValidateRating, getRatingColorType } from '@utils/formatters'
import React from 'react'

// 评分标签层组件属性接口
export interface RatingBadgeLayerProps {
  rating?: number | string
  className?: string
  position?: BadgeLayerPosition
  size?: BadgeLayerSize
  variant?: BadgeLayerVariant
  textColor?: BadgeLayerRatingColor
  backgroundColor?: string
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

  // 确定文本颜色 - 根据评分自动计算颜色，或使用手动指定的颜色
  const finalTextColor =
    textColor ||
    (ratingResult.numericValue !== undefined
      ? getRatingColorType(ratingResult.numericValue)
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
