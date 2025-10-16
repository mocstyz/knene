/**
 * @fileoverview 写真卡片组件
 * @description 遵循组合式架构：CardHoverLayer + ImageLayer + TitleLayer + VipBadgeLayer + NewBadgeLayer + QualityBadgeLayer + TextHoverLayer
 * 与MovieCard保持相同的视觉风格，但使用更精细的Layer组合
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { CardHoverLayer } from '@components/layers/CardHoverLayer'
import { ImageLayer } from '@components/layers/ImageLayer'
import { NewBadgeLayer } from '@components/layers/NewBadgeLayer'
import { QualityBadgeLayer } from '@components/layers/QualityBadgeLayer'
import { TextHoverLayer } from '@components/layers/TextHoverLayer'
import { TitleLayer } from '@components/layers/TitleLayer'
import { VipBadgeLayer } from '@components/layers/VipBadgeLayer'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 写真项目接口
 */
export interface PhotoItem {
  id: string
  title: string
  description?: string
  imageUrl: string
  alt?: string
  isNew?: boolean
  newType?: 'new' | 'update' | 'today' | 'latest'
  quality?: string
  formatType?: string
  rating?: number
  ratingColor?:
    | 'default'
    | 'green'
    | 'blue'
    | 'cyan'
    | 'yellow'
    | 'orange'
    | 'red'
  isVip?: boolean
}

/**
 * 写真卡片组件属性接口
 */
export interface PhotoCardProps {
  /** 写真数据 */
  photo: PhotoItem
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
  /** 是否显示质量徽章 */
  showQualityBadge?: boolean
  /** 是否显示评分徽章 */
  showRatingBadge?: boolean
  /** 悬停效果 */
  hoverEffect?: boolean
  /** 标题悬停效果 */
  titleHoverEffect?: boolean
}

/**
 * 写真卡片组件
 *
 * 采用组合式架构设计，由以下层次组成：
 * - CardHoverLayer: 卡片悬停效果层
 * - ImageLayer: 图片显示层
 * - TitleLayer: 标题信息层
 * - VipBadgeLayer: VIP徽章层
 * - NewBadgeLayer: 新片徽章层
 * - QualityBadgeLayer: 质量徽章层
 * - TextHoverLayer: 文本悬停效果层
 */
const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onClick,
  className,
  aspectRatio = 'portrait',
  showVipBadge = true,
  showNewBadge = true,
  showQualityBadge = true,
  showRatingBadge = false,
  hoverEffect = true,
  titleHoverEffect = true,
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
          src={photo.imageUrl}
          alt={photo.alt || photo.title}
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
              isNew={photo.isNew ?? true}
              newType={photo.newType ?? 'new'}
              position="top-left"
              size="responsive"
              variant="default"
              animated={false}
            />
          )}
          {/* 质量徽章 - top-right */}
          {showQualityBadge && photo.formatType && (
            <QualityBadgeLayer
              quality={photo.formatType}
              position="top-right"
              variant="default"
              size="responsive"
            />
          )}
        </div>

        {/* 底部标签层 - 与MovieLayer保持一致的布局 */}
        <div className="absolute bottom-2 left-2 right-2 z-10 flex justify-between">
          {/* 评分徽章 - bottom-left */}
          {showRatingBadge && photo.rating && (
            <div className="rounded bg-black/60 px-2 py-1 text-xs font-bold text-white">
              {photo.rating.toFixed(1)}
            </div>
          )}
          {/* VIP徽章层 - bottom-right */}
          {showVipBadge && (
            <VipBadgeLayer
              isVip={photo.isVip ?? true}
              position="bottom-right"
              variant="default"
            />
          )}
        </div>

        {/* 标题信息层 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
          <TextHoverLayer hoverColor="red" duration="fast" enableScale={false}>
            <TitleLayer
              title={photo.title}
              variant="overlay"
              size="md"
              maxLines={2}
              color="white"
              weight="medium"
              align="left"
              hoverEffect={{
                enabled: titleHoverEffect,
                hoverColor: 'red',
                transitionDuration: '200ms',
              }}
            />
          </TextHoverLayer>
        </div>
      </div>
    </CardHoverLayer>
  )
}

export { PhotoCard }
export default PhotoCard
