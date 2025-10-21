/**
 * @fileoverview 元数据显示层组件
 * @description 提供统一的元数据显示逻辑，遵循DRY原则。
 * 支持年份、时长、评分、类型等多种元数据的显示，可在各种卡片组件中复用。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Badge } from '@components/atoms'
import { TextHoverLayer } from '@components/layers'
import { cn } from '@utils/cn'
import React from 'react'

/**
 * 元数据显示层组件属性接口
 */
export interface MetadataLayerProps {
  /** 类型列表 */
  genres?: string[]
  /** 自定义CSS类名 */
  className?: string
  /** 布局变体 */
  variant?: 'horizontal' | 'vertical' | 'compact'
  /** 最大显示的类型数量 */
  maxGenres?: number
}

/**
 * 元数据显示层组件
 *
 * 仅显示电影类型信息。
 */
const MetadataLayer: React.FC<MetadataLayerProps> = ({
  genres = [],
  className,
  variant = 'vertical',
  maxGenres = 3,
}) => {
  // 布局样式映射
  const variantClasses = {
    horizontal: 'flex items-center gap-3 text-sm text-gray-500',
    vertical: 'space-y-2 text-sm text-gray-500',
    compact: 'text-xs text-gray-500', // 紧凑布局，无额外间距
  }

  // 组合CSS类名
  const containerClasses = cn(variantClasses[variant], className)

  // 渲染类型标签
  const renderGenres = () => {
    // 如果没有genres数据，使用默认的第一个分类，避免随机生成导致的闪烁
    const genresToDisplay =
      !genres || !Array.isArray(genres) || genres.length === 0
        ? ['剧情'] // 使用固定的默认分类，避免随机闪烁
        : genres.slice(0, 1) // 只显示第一个分类

    return (
      <TextHoverLayer
        hoverColor="red"
        duration="fast"
        className="text-sm text-gray-500"
      >
        {genresToDisplay[0]}
      </TextHoverLayer>
    )
  }

  return <div className={containerClasses}>{renderGenres()}</div>
}

export default MetadataLayer
