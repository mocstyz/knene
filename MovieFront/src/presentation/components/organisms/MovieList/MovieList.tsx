import React from 'react'
import { MovieCard } from '@/components/molecules/MovieCard'
import { Button, Icon } from '@/components/atoms'
import { cn } from '@/utils/cn'

export interface Movie {
  id: string
  title: string
  poster: string
  year: number
  rating: number
  duration: number
  genres: string[]
  description: string
  director?: string
  actors?: string[]
  quality?: 'HD' | '4K' | 'BluRay' | 'WebRip'
  size?: string
  downloadCount?: number
}

export interface MovieListProps {
  movies: Movie[]
  loading?: boolean
  error?: string | null
  hasMore?: boolean
  layout?: 'grid' | 'list'
  variant?: 'default' | 'compact' | 'detailed'
  favoriteMovies?: string[]
  onMoviePlay?: (movieId: string) => void
  onMovieDownload?: (movieId: string) => void
  onMovieFavorite?: (movieId: string) => void
  onMovieShare?: (movieId: string) => void
  onLoadMore?: () => void
  onRetry?: () => void
  className?: string
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  loading = false,
  error = null,
  hasMore = false,
  layout = 'grid',
  variant = 'default',
  favoriteMovies = [],
  onMoviePlay,
  onMovieDownload,
  onMovieFavorite,
  onMovieShare,
  onLoadMore,
  onRetry,
  className
}) => {
  // 空状态
  if (!loading && movies.length === 0 && !error) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="max-w-md mx-auto">
          <Icon name="film" size="xl" className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            暂无影片
          </h3>
          <p className="text-gray-500">
            没有找到符合条件的影片，请尝试其他搜索条件
          </p>
        </div>
      </div>
    )
  }

  // 错误状态
  if (error) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="max-w-md mx-auto">
          <Icon name="x" size="xl" className="text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            加载失败
          </h3>
          <p className="text-gray-500 mb-4">
            {error}
          </p>
          {onRetry && (
            <Button variant="primary" onClick={onRetry}>
              重试
            </Button>
          )}
        </div>
      </div>
    )
  }

  // 网格布局样式
  const gridClasses = {
    default: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6',
    compact: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
    detailed: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
  }

  // 列表布局样式
  const listClasses = 'space-y-4'

  return (
    <div className={cn('w-full', className)}>
      {/* 影片列表 */}
      <div className={layout === 'grid' ? gridClasses[variant] : listClasses}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            variant={layout === 'list' ? 'compact' : variant}
            isFavorited={favoriteMovies.includes(movie.id)}
            onPlay={onMoviePlay}
            onDownload={onMovieDownload}
            onFavorite={onMovieFavorite}
            onShare={onMovieShare}
          />
        ))}
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center gap-3">
            <Icon name="loading" className="animate-spin text-blue-600" />
            <span className="text-gray-600">加载中...</span>
          </div>
        </div>
      )}

      {/* 加载更多按钮 */}
      {!loading && hasMore && onLoadMore && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={onLoadMore}
            icon={<Icon name="plus" />}
          >
            加载更多
          </Button>
        </div>
      )}

      {/* 没有更多内容提示 */}
      {!loading && !hasMore && movies.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">已显示全部内容</p>
        </div>
      )}
    </div>
  )
}

export { MovieList }