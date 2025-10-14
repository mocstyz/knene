/**
 * @fileoverview Movie领域列表组件
 * @description 电影领域的通用列表组件，支持多种布局和配置。
 * 负责电影数据的展示、交互和布局，遵循DDD架构的领域组件规范。
 * 采用组合式架构，将布局逻辑和渲染逻辑分离到独立组件。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 3.0.0
 */

import { TextLink } from '@components/atoms'
import MovieListItem from '@components/domains/movie/MovieList/MovieListItem'
import MovieListLayout from '@components/domains/movie/MovieList/MovieListLayout'
import type {
  BaseMovieItem,
  CardConfig,
  ResponsiveColumnsConfig,
} from '@types-movie/movie.types'
import React from 'react'

/**
 * Movie领域列表组件属性接口
 */
export interface MovieListProps {
  /** 电影数据列表 */
  movies: BaseMovieItem[]
  /** 标题 */
  title?: string
  /** 是否显示更多链接 */
  showMoreLink?: boolean
  /** 更多链接URL */
  moreLinkUrl?: string
  /** 更多链接文本 */
  moreLinkText?: string
  /** 电影卡片点击事件 */
  onMovieClick?: (movie: BaseMovieItem) => void
  /** 自定义CSS类名 */
  className?: string
  /** 布局变体 */
  variant?: 'grid' | 'list' | 'carousel'
  /** 尺寸变体 */
  size?: 'small' | 'medium' | 'large'
  /** 卡片变体 */
  cardVariant?:
    | 'default'
    | 'simple'
    | 'topic'
    | 'featured'
    | 'list'
    | 'detailed'
  /** 响应式列数配置 */
  columns?: ResponsiveColumnsConfig
  /** 卡片配置 - 控制标签显示等 */
  cardConfig?: CardConfig
}

/**
 * Movie领域列表组件
 *
 * 负责电影列表的完整功能实现，采用组合式架构：
 * - MovieListLayout：处理布局逻辑（网格、列表、轮播）
 * - MovieListItem：处理单个项目的渲染逻辑
 * - 支持多种布局变体和卡片类型
 * - 响应式设计和交互处理
 */
const MovieList: React.FC<MovieListProps> = ({
  movies,
  title,
  showMoreLink = false,
  moreLinkUrl = '#',
  moreLinkText = 'More >',
  onMovieClick,
  className,
  variant = 'grid',
  cardVariant = 'simple',
  columns,
  cardConfig,
}) => {
  // 防御性检查 - 如果movies是undefined或空数组，返回空内容
  if (!movies || !Array.isArray(movies) || movies.length === 0) {
    return (
      <section className={className}>
        {title && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{title}</h2>
            {showMoreLink && (
              <TextLink href={moreLinkUrl} variant="primary" size="sm">
                {moreLinkText}
              </TextLink>
            )}
          </div>
        )}
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          暂无数据
        </div>
      </section>
    )
  }

  return (
    <section className={className}>
      {/* 标题和更多链接 */}
      {title && (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          {showMoreLink && (
            <TextLink href={moreLinkUrl} variant="primary" size="sm">
              {moreLinkText}
            </TextLink>
          )}
        </div>
      )}

      {/* 电影列表 - 使用组合式架构 */}
      <MovieListLayout
        variant={variant}
        columns={columns}
        className="movie-list-container"
      >
        {movies.map(movie => (
          <MovieListItem
            key={movie.id}
            movie={movie}
            cardVariant={cardVariant}
            variant={variant}
            onMovieClick={onMovieClick}
            cardConfig={cardConfig}
          />
        ))}
      </MovieListLayout>
    </section>
  )
}

export { MovieList }
export default MovieList
