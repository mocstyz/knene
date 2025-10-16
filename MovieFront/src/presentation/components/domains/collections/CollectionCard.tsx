/**
 * @fileoverview 影片合集卡片组件
 * @description 遵循组合式架构：ImageLayer + CollectionLayer + VipBadgeLayer
 * 替换原有的SpecialCollectionCard，符合DDD架构规范
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { CardHoverLayer } from '@components/layers/CardHoverLayer'
import { ImageLayer } from '@components/layers/ImageLayer'
import { NewBadgeLayer } from '@components/layers/NewBadgeLayer'
import { TextHoverLayer } from '@components/layers/TextHoverLayer'
import { CollectionLayer } from '@components/layers/CollectionLayer'
import { VipBadgeLayer } from '@components/layers/VipBadgeLayer'
import { cn } from '@utils/cn'
import React from 'react'

export interface CollectionCardProps {
  /** 影片合集数据 */
  collection: {
    id: string
    title: string
    description?: string
    imageUrl: string
    alt?: string
    isNew?: boolean
    newType?: 'new' | 'update' | 'today' | 'latest'
  }
  /** 点击事件 */
  onClick?: () => void
  /** 自定义CSS类名 */
  className?: string
  /** 宽高比 */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape'
  /** 是否显示VIP徽章 */
  showVipBadge?: boolean
  /** 是否显示新片徽章 */
  showNewBadge?: boolean
  /** 悬停效果 */
  hoverEffect?: boolean
}

/**
 * 影片合集卡片组件
 *
 * 采用组合式架构设计，由以下层次组成：
 * - ImageLayer: 图片显示层
 * - CollectionLayer: 影片合集信息层
 * - VipBadgeLayer: VIP徽章层
 */
const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onClick,
  className,
  aspectRatio = 'portrait',
  showVipBadge = true,
  showNewBadge = true,
  hoverEffect = true,
}) => {
  // 根据宽高比获取对应的CSS类
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square'
      case 'video':
        return 'aspect-video'
      case 'portrait':
        return 'aspect-[2/3]'
      case 'landscape':
        return 'aspect-[16/9]'
      default:
        return 'aspect-square'
    }
  }

  return (
    <CardHoverLayer scale="sm" duration="fast">
      <div
        className={cn(
          'relative cursor-pointer overflow-hidden rounded-lg shadow-md group',
          getAspectRatioClass(),
          'active:scale-[0.98]',
          className
        )}
        onClick={onClick}
      >
        {/* 图片层 */}
        <ImageLayer
          src={collection.imageUrl}
          alt={collection.alt || collection.title}
          aspectRatio="custom"
          objectFit="cover"
          hoverScale={false} // 禁用内部hover，使用CardHoverLayer
          fallbackType="gradient"
        />

        {/* 顶部标签层 - 与MovieLayer保持一致的布局 */}
        <div className="absolute left-2 right-2 top-2 z-10 flex justify-between">
          {/* New badge - top-left */}
          {showNewBadge && (
            <NewBadgeLayer
              isNew={collection.isNew ?? true}
              newType={collection.newType ?? 'new'}
              position="top-left"
              size="responsive"
              variant="default"
              animated={false}
            />
          )}
          {/* 右侧预留位置，保持布局一致性 */}
          <div className="w-6" />
        </div>

        {/* 底部标签层 - 与MovieLayer保持一致的布局 */}
        <div className="absolute bottom-2 left-2 right-2 z-10 flex justify-between">
          {/* 左侧预留位置，保持布局一致性 */}
          <div className="w-6" />
          {/* VIP徽章层 - bottom-right */}
          {showVipBadge && (
            <VipBadgeLayer
              isVip={true}
              position="bottom-right"
              variant="default"
            />
          )}
        </div>

        {/* 影片合集信息层 */}
        <CollectionLayer
          collection={collection}
          onClick={onClick}
          contentPosition="bottom-left"
          showGradient={true}
          gradientIntensity="medium"
          hoverEffect={{
            enabled: true, // 启用内部hover
            hoverColor: 'red',
            transitionDuration: '200ms',
          }}
        />
      </div>
    </CardHoverLayer>
  )
}

export { CollectionCard }
export default CollectionCard
