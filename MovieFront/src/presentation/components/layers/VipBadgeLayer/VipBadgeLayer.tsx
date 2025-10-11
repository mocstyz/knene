/**
 * @fileoverview VIP标签层组件
 * @description 提供统一的VIP标签显示逻辑，遵循DRY原则和组件变体Token系统。
 * 可在各种卡片组件中复用，显示VIP状态标识。
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
 * VIP标签层组件属性接口
 */
export interface VipBadgeLayerProps {
  /** 是否为VIP内容 */
  isVip?: boolean
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
}

/**
 * VIP标签层组件
 *
 * 提供统一的VIP标签显示，使用组件变体Token系统，支持多种位置和样式变体。
 * 响应式设计，移动端优先。
 */
const VipBadgeLayer: React.FC<VipBadgeLayerProps> = ({
  isVip = true,
  className,
  position = 'bottom-right',
  size = 'responsive',
  variant = 'default',
  text = 'VIP',
}) => {
  // 如果不是VIP，不显示标签
  if (!isVip) {
    return null
  }

  // 使用组件变体Token系统组合CSS类名
  const badgeClasses = cn(
    badgeLayerVariants.base,
    badgeLayerVariants.position[position],
    badgeLayerVariants.size[size],
    badgeLayerVariants.variant.vip[variant],
    className
  )

  return <div className={badgeClasses}>{text}</div>
}

export default VipBadgeLayer
