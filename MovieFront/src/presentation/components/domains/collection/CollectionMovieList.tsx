/**
 * @fileoverview 合集影片列表组件
 * @description 专用于合集详情页面的影片列表组件，基于BaseList + MixedContentList + 内容渲染器系统实现。
 *              遵循自包含组件设计原则和组件最大化复用原则，复用现有的MixedContentList架构。
 *              提供完整的影片列表展示功能，包括响应式网格布局、分页导航、空状态处理和加载状态管理。
 * @author mosctz
 * @since 1.0.0
 * @version 1.1.0
 */

import { MixedContentList } from '@components/domains/shared'
import { RESPONSIVE_CONFIGS } from '@tokens/responsive-configs'
import type { BaseMovieItem } from '@types-movie'
import type { BaseContentItem } from '@components/domains/shared/content-renderers'
import React from 'react'

// 合集影片列表组件属性接口，定义组件的所有配置选项
export interface CollectionMovieListProps {
  movies: BaseMovieItem[]
  loading?: boolean
  emptyMessage?: string
  className?: string
  onMovieClick?: (movie: BaseMovieItem) => void
}

// 合集影片列表组件，基于MixedContentList架构实现，提供完整的影片列表展示功能
const CollectionMovieList: React.FC<CollectionMovieListProps> = ({
  movies,
  loading = false,
  emptyMessage = '暂无影片',
  className,
  onMovieClick,
}) => {
  // 将MovieContentItem转换为BaseContentItem格式 - 适配MixedContentList的统一接口
  const contentItems: BaseContentItem[] = React.useMemo(() => {
    return movies.map(movie => ({
      ...movie,
      contentType: 'movie' as const,
    }))
  }, [movies])

  // 影片项点击处理 - 统一的影片点击事件处理
  const handleItemClick = (item: BaseContentItem) => {
    // 由于BaseContentItem和BaseMovieItem结构不完全匹配，需要进行数据转换
    const movieItem: BaseMovieItem = {
      id: item.id,
      title: item.title,
      type: 'Movie' as const,
      description: item.description,
      imageUrl: item.imageUrl,
      alt: item.alt,
      rating: '0', // 默认评分
      genres: [], // 默认空数组
    }
    onMovieClick?.(movieItem)
  }

  return (
    <MixedContentList
      items={contentItems}
      columns={RESPONSIVE_CONFIGS.collection}
      loading={loading}
      emptyState={{ message: emptyMessage }}
      onItemClick={handleItemClick}
      allowedContentTypes={['movie']}
      enableFilter={true}
      className={className}
      rendererConfigs={{
        movie: {
          hoverEffect: true,
          showVipBadge: true,
          showQualityBadge: true,
          showRatingBadge: true,
          showNewBadge: true,
        },
      }}
    />
  )
}

export default CollectionMovieList
