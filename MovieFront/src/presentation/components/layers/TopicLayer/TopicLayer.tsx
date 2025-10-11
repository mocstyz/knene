/**
 * @fileoverview 专题层组件
 * @description 提供专题卡片的内容展示逻辑，遵循组合式架构原则。
 * 包含专题标题、描述、渐变背景等专题特有元素，提供完整的专题展示功能。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { TitleLayer } from '@components/layers'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 专题层组件属性接口
 */
export interface TopicLayerProps {
  /** 专题数据 */
  topic: {
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
  gradientIntensity?: 'light' | 'medium' | 'strong'
  /** 点击事件处理 */
  onClick?: (id: string) => void
}

/**
 * 专题层组件
 *
 * 提供专题卡片的内容展示功能，包含标题、描述和渐变背景。
 */
const TopicLayer: React.FC<TopicLayerProps> = ({
  topic,
  className,
  contentPosition = 'bottom-left',
  showGradient = true,
  gradientIntensity = 'medium',
  onClick,
}) => {
  // 内容位置样式映射
  const positionClasses = {
    'bottom-left': 'absolute bottom-0 left-0 p-6',
    'bottom-center': 'absolute bottom-0 left-0 right-0 p-6 text-center',
    'bottom-right': 'absolute bottom-0 right-0 p-6 text-right',
    center: 'absolute inset-0 flex items-center justify-center p-6 text-center',
  }

  // 渐变遮罩样式映射
  const gradientClasses = {
    light: 'bg-gradient-to-t from-black/40 via-black/10 to-transparent',
    medium: 'bg-gradient-to-t from-black/60 via-black/20 to-transparent',
    strong: 'bg-gradient-to-t from-black/80 via-black/40 to-transparent',
  }

  // 标题宽度限制样式
  const titleWidthClasses = {
    'bottom-left': 'w-full overflow-hidden',
    'bottom-center': 'w-full overflow-hidden',
    'bottom-right': 'w-full overflow-hidden ml-auto text-right',
    center: 'w-full overflow-hidden',
  }

  // 处理点击事件
  const handleClick = () => {
    onClick?.(topic.id)
  }

  return (
    <>
      {/* 渐变遮罩 */}
      {showGradient && (
        <div
          className={cn('absolute inset-0', gradientClasses[gradientIntensity])}
        />
      )}

      {/* 专题内容 */}
      <div
        className={cn(
          positionClasses[contentPosition],
          className,
          'w-full max-w-full overflow-hidden'
        )}
      >
        <div className={titleWidthClasses[contentPosition]}>
          <TitleLayer
            title={topic.title}
            variant="overlay"
            size="2xl"
            maxLines={1}
            align={contentPosition === 'bottom-right' ? 'right' : 'left'}
            color="white"
            weight="bold"
            clickable={!!onClick}
            onClick={handleClick}
          />
        </div>

        {topic.description && (
          <div
            className={cn(
              'mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-gray-200',
              titleWidthClasses[contentPosition]
            )}
          >
            {topic.description}
          </div>
        )}
      </div>
    </>
  )
}

export default TopicLayer
