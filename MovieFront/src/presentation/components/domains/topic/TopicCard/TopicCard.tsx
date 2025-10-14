/**
 * @fileoverview 专题卡片组件
 * @description 遵循组合式架构：ImageLayer + TopicLayer + VipBadgeLayer
 * 替换原有的SpecialCollectionCard，符合DDD架构规范
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { ImageLayer } from '@components/layers/ImageLayer'
import { NewBadgeLayer } from '@components/layers/NewBadgeLayer'
import { TopicLayer } from '@components/layers/TopicLayer'
import { VipBadgeLayer } from '@components/layers/VipBadgeLayer'
import { cn } from '@utils/cn'
import React from 'react'

export interface TopicCardProps {
  /** 专题数据 */
  topic: {
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
  /** 悬停效果 */
  hoverEffect?: boolean
}

/**
 * 专题卡片组件
 *
 * 采用组合式架构设计，由以下层次组成：
 * - ImageLayer: 图片显示层
 * - TopicLayer: 专题信息层
 * - VipBadgeLayer: VIP徽章层
 */
const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  onClick,
  className,
  aspectRatio = 'portrait',
  showVipBadge = true,
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
    <div
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-lg shadow-md',
        getAspectRatioClass(),
        hoverEffect &&
          'transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]',
        className
      )}
      onClick={onClick}
    >
      {/* 图片层 */}
      <ImageLayer
        src={topic.imageUrl}
        alt={topic.alt || topic.title}
        aspectRatio="custom"
        objectFit="cover"
        hoverScale={hoverEffect}
        fallbackType="gradient"
      />

      {/* 顶部标签层 - 与MovieLayer保持一致的布局 */}
      <div className="absolute left-2 right-2 top-2 z-10 flex justify-between">
        {/* New badge - top-left */}
        <NewBadgeLayer
          isNew={topic.isNew ?? true}
          newType={topic.newType ?? 'new'}
          position="top-left"
          size="responsive"
          variant="default"
          animated={false}
        />
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

      {/* 专题信息层 */}
      <TopicLayer
        topic={topic}
        onClick={onClick}
        contentPosition="bottom-left"
        showGradient={true}
        gradientIntensity="medium"
        hoverEffect={{
          enabled: true,
          hoverColor: 'red',
          transitionDuration: '200ms'
        }}
      />
    </div>
  )
}

export { TopicCard }
export default TopicCard
