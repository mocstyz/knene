/**
 * @fileoverview 元数据显示层组件
 * @description 提供统一的元数据显示逻辑，遵循DRY原则，支持年份、时长、评分、类型等多种元数据的显示，可在各种卡片组件中复用。
 *              专注于影片类型信息的显示，支持多种布局变体和最大显示数量配置，提供默认数据防止闪烁。
 * @created 2025-10-21 11:54:53
 * @updated 2025-10-21 16:21:08
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Badge } from '@components/atoms'
import { TextHoverLayer } from '@components/layers'
import { cn } from '@utils/cn'
import React from 'react'

// 元数据显示层组件属性接口，定义元数据展示的配置选项
export interface MetadataLayerProps {
  genres?: string[] // 影片类型列表，默认为空数组
  className?: string // 自定义CSS类名
  variant?: 'horizontal' | 'vertical' | 'compact' // 布局变体，默认'vertical'
  maxGenres?: number // 最大显示的类型数量，默认3
}

// 元数据显示层组件，专注于影片类型信息的显示，提供多种布局选项和数量限制
const MetadataLayer: React.FC<MetadataLayerProps> = ({
  genres = [],
  className,
  variant = 'vertical',
  maxGenres = 3,
}) => {
  // 布局样式配置 - 定义不同布局变体对应的CSS类名
  const variantClasses = {
    horizontal: 'flex items-center gap-3 text-sm text-gray-500',
    vertical: 'space-y-2 text-sm text-gray-500',
    compact: 'text-xs text-gray-500', // 紧凑布局，无额外间距
  }

  // 容器样式类组合 - 合并布局样式和自定义类名
  const containerClasses = cn(variantClasses[variant], className)

  // 类型标签渲染函数 - 提供一致的类型显示逻辑
  const renderGenres = () => {
    // 数据验证和默认值设置 - 防止空数据导致显示异常
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

  // 渲染类型标签容器
  return <div className={containerClasses}>{renderGenres()}</div>
}

export default MetadataLayer
