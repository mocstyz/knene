/**
 * @fileoverview VIP标签层组件
 * @description 提供统一的VIP标签显示逻辑，遵循DRY原则和组件变体Token系统，可在各种卡片组件中复用，显示VIP状态标识
 *              支持多种位置、尺寸和变体配置，使用组件变体Token系统统一样式管理，响应式设计，移动端优先
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

// VIP标签层组件属性接口，定义VIP标签的配置选项
export interface VipBadgeLayerProps {
  isVip?: boolean // 是否为VIP内容，默认true
  className?: string // 自定义CSS类名
  position?: BadgeLayerPosition // 标签位置，默认'bottom-right'
  size?: BadgeLayerSize // 标签尺寸，默认'responsive'
  variant?: BadgeLayerVariant // 标签变体，默认'default'
  text?: string // 自定义标签文本，默认'VIP'
}

// VIP标签层组件，提供统一的VIP标签显示，使用组件变体Token系统，支持多种位置和样式变体，响应式设计，移动端优先
const VipBadgeLayer: React.FC<VipBadgeLayerProps> = ({
  isVip = true,
  className,
  position = 'bottom-right',
  size = 'responsive',
  variant = 'default',
  text = 'VIP',
}) => {
  // 条件渲染 - 如果不是VIP内容，不显示标签
  if (!isVip) {
    return null
  }

  // 使用组件变体Token系统组合CSS类名 - 统一样式管理
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
