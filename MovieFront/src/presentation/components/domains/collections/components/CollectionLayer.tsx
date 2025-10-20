/**
 * @fileoverview 影片合集层组件
 * @description 提供影片合集卡片的内容展示逻辑，遵循组合式架构原则。
 *              包含影片合集标题、描述、渐变背景等影片合集特有元素，提供完整的影片合集展示功能。
 *              修复hover效果问题：使用CardHoverLayer包装完整卡片结构，与写真/电影区块保持一致。
 * @created 2025-10-19 16:45:28
 * @updated 2025-10-19 16:45:28
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { ImageLayer, TextHoverLayer, TitleLayer, CardHoverLayer, VipBadgeLayer, NewBadgeLayer } from '@components/layers'
import {
  getOverlayGradient,
  type GradientOverlayIntensity,
} from '@tokens/design-system'
import { cn } from '@utils/cn'
import React from 'react'

// 影片合集层组件属性接口，定义合集卡片的所有配置选项，包括内容数据、样式配置、交互效果等
export interface CollectionLayerProps {
  collection: {
    id: string
    title: string
    description?: string
    imageUrl: string
    alt?: string
  }
  className?: string
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' // 宽高比配置
  contentPosition?: 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center' // 内容位置
  showGradient?: boolean // 是否显示渐变遮罩
  gradientIntensity?: GradientOverlayIntensity | 'light' | 'medium' | 'strong' // 渐变强度
  onClick?: (id: string) => void // 点击事件处理
  hoverEffect?: {
    enabled?: boolean // 是否启用hover效果
    hoverColor?: 'red' | 'primary' | 'blue' | 'green' // hover时的颜色
    transitionDuration?: string // 过渡动画时长
  }
  showHover?: boolean // 是否显示悬停效果
  showVipBadge?: boolean // 是否显示VIP标签
  showNewBadge?: boolean // 是否显示NEW标签
  isVip?: boolean // 是否为VIP内容
  isNew?: boolean // 是否为新内容
  newBadgeType?: 'new' | 'hot' | 'update' | 'today' | 'latest' // NEW标签类型
}

// 影片合集层组件，提供影片合集卡片的内容展示功能，包含标题、描述和渐变背景，使用CardHoverLayer包装完整卡片结构，确保整体hover效果一致性
const CollectionLayer: React.FC<CollectionLayerProps> = ({
  collection,
  className,
  aspectRatio = 'square',
  contentPosition = 'bottom-left',
  showGradient = true,
  gradientIntensity = 'strong',
  onClick,
  hoverEffect,
  showHover = true,
  showVipBadge = false,
  showNewBadge = false,
  isVip = false,
  isNew = false,
  newBadgeType = 'new',
}) => {
  // 宽高比样式映射
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[2/3]',
    landscape: 'aspect-[3/2]',
  }

  // 内容位置样式映射
  const positionClasses = {
    'bottom-left': 'absolute bottom-0 left-0 p-6 flex flex-col justify-end',
    'bottom-center': 'absolute bottom-0 left-0 right-0 p-6 text-center flex flex-col justify-end',
    'bottom-right': 'absolute bottom-0 right-0 p-6 text-right flex flex-col justify-end',
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
    <CardHoverLayer
      scale={showHover ? 'md' : 'none'}
      duration="normal"
      enableShadow={false}
      disabled={!showHover}
      className={className}
    >
      <div className="space-y-3">
        {/* 图片卡片区域 - 独立的阴影卡片 */}
        <div className={cn("relative overflow-hidden rounded-lg shadow-md", aspectRatioClasses[aspectRatio])}>
          <ImageLayer
            src={collection.imageUrl}
            alt={collection.alt || collection.title}
            aspectRatio="custom"
            objectFit="cover"
            hoverScale={false} // 由CardHoverLayer统一处理
            fallbackType="gradient"
          />

          {/* 渐变遮罩 - 使用统一的渐变Token系统 */}
          {showGradient && (
            <div
              className={cn(
                'absolute inset-0',
                getOverlayGradient(mappedIntensity)
              )}
            />
          )}

          {/* 顶部标签层 */}
          <div className="absolute left-2 right-2 top-2 z-10 flex justify-between">
            {/* New badge - top-left */}
            {showNewBadge && isNew && (
              <NewBadgeLayer
                isNew={true}
                newType={newBadgeType}
                position="top-left"
                size="responsive"
                variant="default"
                animated={false}
              />
            )}
          </div>

          {/* 底部标签层 */}
          <div className="absolute bottom-2 left-2 right-2 z-10 flex justify-between">
            <div></div>
            {/* VIP badge - bottom-right */}
            {showVipBadge && isVip && (
              <VipBadgeLayer
                isVip={true}
                position="bottom-right"
                variant="default"
              />
            )}
          </div>

          {/* 影片合集内容 */}
          <div
            className={cn(
              positionClasses[contentPosition],
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
        </div>
      </div>
    </CardHoverLayer>
  )
}

export default CollectionLayer