/**
 * @fileoverview 影片质量标签层组件
 * @description 提供统一的影片质量标签显示逻辑，遵循DRY原则和组件变体Token系统，支持多种质量标识和样式变体
 *              可在各种卡片组件中复用，响应式设计，移动端优先，支持layer和badge两种展示类型
 * @created 2025-10-20 17:32:16
 * @updated 2025-10-21 16:21:08
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Badge } from '@components/atoms'
import {
  badgeLayerVariants,
  type BadgeLayerPosition,
  type BadgeLayerVariant,
  type BadgeLayerSize,
} from '@tokens/design-system'
import { cn } from '@utils/cn'
import React from 'react'

// 影片质量标签层组件属性接口，定义质量标签的配置选项
export interface QualityBadgeLayerProps {
  quality?: string // 影片质量信息
  className?: string // 自定义CSS类名
  position?: BadgeLayerPosition // 标签位置，默认'top-left'
  size?: BadgeLayerSize // 标签尺寸，默认'responsive'
  variant?: BadgeLayerVariant // 标签变体，默认'default'
  displayType?: 'layer' | 'badge' // 标签展示类型，默认'layer'
  badgeVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' // Badge组件变体，仅当displayType为'badge'时使用
  badgeSize?: 'sm' | 'md' | 'lg' // Badge组件大小，仅当displayType为'badge'时使用
}

// 影片质量标签层组件，提供统一的影片质量标签显示，使用组件变体Token系统，支持多种位置和样式变体，响应式设计，移动端优先
const QualityBadgeLayer: React.FC<QualityBadgeLayerProps> = ({
  quality,
  className,
  position = 'top-left',
  size = 'responsive',
  variant = 'default',
  displayType = 'layer',
  badgeVariant = 'primary',
  badgeSize = 'sm',
}) => {
  // 如果没有质量信息，不显示标签
  if (!quality || quality.trim() === '') {
    return null
  }

  // 使用组件变体Token系统组合CSS类名 (当displayType为'layer'时)
  const layerClasses = cn(
    badgeLayerVariants.base,
    badgeLayerVariants.position[position],
    badgeLayerVariants.size[size],
    badgeLayerVariants.variant.quality[variant],
    className
  )

  // 根据展示类型返回不同的组件
  switch (displayType) {
    case 'badge':
      return (
        <div
          className={cn(
            'absolute z-10',
            badgeLayerVariants.position[position],
            className
          )}
        >
          <Badge variant={badgeVariant} size={badgeSize}>
            {quality}
          </Badge>
        </div>
      )
    case 'layer':
    default:
      return <div className={layerClasses}>{quality}</div>
  }
}

export default QualityBadgeLayer
