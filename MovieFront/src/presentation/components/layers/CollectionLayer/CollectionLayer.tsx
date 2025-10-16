/**
 * @fileoverview 影片合集层组件
 * @description 提供影片合集卡片的内容展示逻辑，遵循组合式架构原则。
 * 包含影片合集标题、描述、渐变背景等影片合集特有元素，提供完整的影片合集展示功能。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { TextHoverLayer, TitleLayer } from '@components/layers'
import {
  getOverlayGradient,
  type GradientOverlayIntensity,
} from '@tokens/design-system'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 影片合集层组件属性接口
 */
export interface CollectionLayerProps {
  /** 影片合集数据 */
  collection: {
    id: string
    title: string
    description?: string
    imageUrl: string
    alt?: string
  }
  /** 自定义CSS类名 */
  className?: string
  /** 内容位置 */
  contentPosition?: 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center'
  /** 是否显示渐变遮罩 */
  showGradient?: boolean
  /** 渐变强度 */
  gradientIntensity?: GradientOverlayIntensity | 'light' | 'medium' | 'strong'
  /** 点击事件处理 */
  onClick?: (id: string) => void
  /** hover效果配置 */
  hoverEffect?: {
    /** 是否启用hover效果 */
    enabled?: boolean
    /** hover时的颜色 */
    hoverColor?: 'red' | 'primary' | 'blue' | 'green'
    /** 过渡动画时长 */
    transitionDuration?: string
  }
}

/**
 * 影片合集层组件
 *
 * 提供影片合集卡片的内容展示功能，包含标题、描述和渐变背景。
 */
const CollectionLayer: React.FC<CollectionLayerProps> = ({
  collection,
  className,
  contentPosition = 'bottom-left',
  showGradient = true,
  gradientIntensity = 'strong',
  onClick,
  hoverEffect,
}) => {
  // 内容位置样式映射
  const positionClasses = {
    'bottom-left': 'absolute bottom-0 left-0 p-6',
    'bottom-center': 'absolute bottom-0 left-0 right-0 p-6 text-center',
    'bottom-right': 'absolute bottom-0 right-0 p-6 text-right',
    center: 'absolute inset-0 flex items-center justify-center p-6 text-center',
  }

  // 映射原有的渐变强度到新的Token系统
  const mapGradientIntensity = (
    intensity: GradientOverlayIntensity | 'light' | 'medium' | 'strong'
  ): GradientOverlayIntensity => {
    switch (intensity) {
      case 'light':
        return 'subtle' // 对应原来的 from-black/40 via-black/10 to-transparent
      case 'strong':
        return 'heavy' // 对应原来的 from-black/80 via-black/40 to-transparent
      case 'medium':
        return 'strong' // 对应原来的 from-black/60 via-black/20 to-transparent
      case 'subtle':
      case 'intense':
      case 'heavy':
        return intensity // 已经是新格式的，直接返回
      default:
        return 'strong' // 默认使用中等强度
    }
  }

  // 获取映射后的渐变强度
  const mappedIntensity = mapGradientIntensity(gradientIntensity)

  // 标题宽度限制样式
  const titleWidthClasses = {
    'bottom-left': 'w-full overflow-hidden',
    'bottom-center': 'w-full overflow-hidden',
    'bottom-right': 'w-full overflow-hidden ml-auto text-right',
    center: 'w-full overflow-hidden',
  }

  // 处理点击事件
  const handleClick = () => {
    onClick?.(collection.id)
  }

  return (
    <>
      {/* 渐变遮罩 - 使用统一的渐变Token系统 */}
      {showGradient && (
        <div
          className={cn(
            'absolute inset-0',
            getOverlayGradient(mappedIntensity)
          )}
        />
      )}

      {/* 影片合集内容 */}
      <div
        className={cn(
          positionClasses[contentPosition],
          className,
          'w-full max-w-full overflow-hidden'
        )}
      >
        <div className={titleWidthClasses[contentPosition]}>
          <TitleLayer
            title={collection.title}
            variant="overlay"
            size="2xl"
            maxLines={1}
            align={contentPosition === 'bottom-right' ? 'right' : 'left'}
            color="white"
            weight="bold"
            clickable={!!onClick}
            onClick={handleClick}
            hoverEffect={hoverEffect}
          />
        </div>

        {collection.description && (
          <TextHoverLayer
            hoverColor={hoverEffect?.hoverColor || 'red'}
            duration={
              hoverEffect?.transitionDuration === '200ms' ? 'fast' : 'normal'
            }
            className={cn(
              'mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-gray-200',
              titleWidthClasses[contentPosition]
            )}
            disabled={!hoverEffect?.enabled}
          >
            {collection.description}
          </TextHoverLayer>
        )}
      </div>
    </>
  )
}

export default CollectionLayer
