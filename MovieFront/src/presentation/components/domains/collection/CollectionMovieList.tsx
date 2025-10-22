/**
 * @fileoverview 合集影片列表组件
 * @description 专用于合集详情页面的影片列表组件，基于BaseList + MixedContentList + 内容渲染器系统实现。
 *              遵循自包含组件设计原则和组件最大化复用原则，复用现有的MixedContentList架构。
 *              提供完整的影片列表展示功能，包括响应式网格布局、分页导航、空状态处理和加载状态管理。
 * @author mosctz
 * @since 1.0.0
 * @version 1.1.0
 */

import { BaseList, MixedContentList } from '@components/domains/shared'
import { Button } from '@components/atoms'
import { cn } from '@utils/cn'
import { RESPONSIVE_CONFIGS } from '@tokens/responsive-configs'
import type { BaseMovieItem } from '@types-movie'
import type { BaseContentItem } from '@components/domains/shared/content-renderers'
import React from 'react'

// 分页配置接口，定义分页功能的完整配置参数
export interface PaginationConfig {
  currentPage: number // 当前页码
  totalPages: number // 总页数
  pageSize: number // 每页显示数量
  total: number // 总条数
  onPageChange: (page: number) => void // 页码变更回调
}

// 合集影片列表组件属性接口，定义组件的所有配置选项
export interface CollectionMovieListProps {
  movies: BaseMovieItem[] // 影片数据列表
  pagination?: PaginationConfig // 分页配置，可选
  loading?: boolean // 加载状态
  emptyMessage?: string // 空状态提示文本
  className?: string // 自定义CSS类名
  onMovieClick?: (movie: BaseMovieItem) => void // 影片点击回调
  showPagination?: boolean // 是否显示分页组件
}

// 合集影片列表组件，基于MixedContentList架构实现，提供完整的影片列表展示和分页导航功能
const CollectionMovieList: React.FC<CollectionMovieListProps> = ({
  movies,
  pagination,
  loading = false,
  emptyMessage = '暂无影片',
  className,
  onMovieClick,
  showPagination = true,
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

  // 分页按钮渲染 - 生成页码按钮列表
  const renderPaginationButtons = () => {
    if (!pagination || pagination.totalPages <= 1) return null

    const { currentPage, totalPages, onPageChange } = pagination
    const buttons: React.ReactNode[] = []

    // 生成页码按钮
    for (let page = 1; page <= totalPages; page++) {
      buttons.push(
        <Button
          key={page}
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page)}
          className={cn(
            'h-8 w-8 rounded-full p-0 text-sm focus:ring-0 focus:ring-offset-0 sm:h-10 sm:w-10',
            currentPage === page
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          {page}
        </Button>
      )
    }

    return buttons
  }

  // 组件容器样式类 - 统一的组件布局样式
  const containerClasses = cn('space-y-6', className)

  return (
    <div className={containerClasses}>
      {/* 影片网格列表 - 使用MixedContentList复用现有架构 */}
      <MixedContentList
        items={contentItems}
        columns={RESPONSIVE_CONFIGS.collection}
        loading={loading}
        emptyState={{ message: emptyMessage }}
        onItemClick={handleItemClick}
        allowedContentTypes={['movie']}
        enableFilter={true}
        rendererConfigs={{
          movie: {
            hoverEffect: true,
            showVipBadge: true,
            showQualityBadge: true,
            showRatingBadge: true,
            showNewBadge: true,
          }
        }}
      />

      {/* 分页组件 */}
      {showPagination && pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
          {/* 上一页按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="h-8 w-8 rounded-full p-0 focus:ring-0 focus:ring-offset-0 sm:h-10 sm:w-10"
            aria-label="上一页"
          >
            <svg
              className="h-4 w-4 sm:h-4.5 sm:w-4.5"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
            </svg>
          </Button>

          {/* 页码按钮 */}
          <div className="flex items-center space-x-1">
            {renderPaginationButtons()}
          </div>

          {/* 下一页按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="h-8 w-8 rounded-full p-0 focus:ring-0 focus:ring-offset-0 sm:h-10 sm:w-10"
            aria-label="下一页"
          >
            <svg
              className="h-4 w-4 sm:h-4.5 sm:w-4.5"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M74.34,53.66a8,8,0,0,1,11.32-11.32l80,80a8,8,0,0,1,0,11.32l-80,80a8,8,0,0,1-11.32-11.32L164.69,128Z" />
            </svg>
          </Button>
        </div>
      )}

      {/* 分页信息 */}
      {showPagination && pagination && (
        <div className="flex items-center justify-center text-sm text-gray-500">
          <span>
            第 {pagination.currentPage} 页，共 {pagination.totalPages} 页
            {pagination.total > 0 && (
              <>，总计 {pagination.total} 部影片</>
            )}
          </span>
        </div>
      )}
    </div>
  )
}

export default CollectionMovieList
