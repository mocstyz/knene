import React from 'react'
import { Button, Icon, Badge } from '@/components/atoms'
import { cn } from '@/utils/cn'

export interface MovieCardProps {
  movie: {
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
  variant?: 'default' | 'compact' | 'detailed'
  onPlay?: (movieId: string) => void
  onDownload?: (movieId: string) => void
  onFavorite?: (movieId: string) => void
  onShare?: (movieId: string) => void
  isFavorited?: boolean
  className?: string
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  variant = 'default',
  onPlay,
  onDownload,
  onFavorite,
  onShare,
  isFavorited = false,
  className
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatRating = (rating: number) => {
    return rating.toFixed(1)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(false)
  }

  if (variant === 'compact') {
    return (
      <div className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden',
        'hover:shadow-md transition-shadow duration-200',
        className
      )}>
        <div className="flex">
          <div className="w-20 h-28 relative flex-shrink-0">
            {!imageError ? (
              <img
                src={movie.poster}
                alt={movie.title}
                className={cn(
                  'w-full h-full object-cover transition-opacity duration-200',
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Icon name="film" className="text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1 p-3">
            <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span>{movie.year}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Icon name="star" size="xs" className="text-yellow-400" />
                <span>{formatRating(movie.rating)}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="primary" onClick={() => onPlay?.(movie.id)}>
                <Icon name="play" size="xs" />
              </Button>
              <Button size="sm" variant="secondary" onClick={() => onDownload?.(movie.id)}>
                <Icon name="download" size="xs" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden',
      'hover:shadow-lg transition-all duration-200 hover:-translate-y-1',
      className
    )}>
      {/* 海报区域 */}
      <div className="relative aspect-[2/3] group">
        {!imageError ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-200',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Icon name="film" size="xl" className="text-gray-400" />
          </div>
        )}
        
        {/* 悬浮操作按钮 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onPlay?.(movie.id)}
              icon={<Icon name="play" />}
            >
              播放
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onDownload?.(movie.id)}
              icon={<Icon name="download" />}
            >
              下载
            </Button>
          </div>
        </div>

        {/* 质量标签 */}
        {movie.quality && (
          <div className="absolute top-2 left-2">
            <Badge variant="primary" size="sm">
              {movie.quality}
            </Badge>
          </div>
        )}

        {/* 收藏按钮 */}
        <button
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-200"
          onClick={() => onFavorite?.(movie.id)}
        >
          <Icon
            name="heart"
            size="sm"
            className={isFavorited ? 'text-red-500' : 'text-gray-400'}
          />
        </button>
      </div>

      {/* 信息区域 */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
          {movie.title}
        </h3>

        {/* 基本信息 */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <span>{movie.year}</span>
          <span>•</span>
          <span>{formatDuration(movie.duration)}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Icon name="star" size="sm" className="text-yellow-400" />
            <span className="font-medium">{formatRating(movie.rating)}</span>
          </div>
        </div>

        {/* 类型标签 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {movie.genres.slice(0, 3).map((genre) => (
            <Badge key={genre} variant="secondary" size="sm">
              {genre}
            </Badge>
          ))}
        </div>

        {/* 描述 */}
        {variant === 'detailed' && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {movie.description}
          </p>
        )}

        {/* 导演和演员信息 */}
        {variant === 'detailed' && (movie.director || movie.actors) && (
          <div className="text-xs text-gray-500 mb-3 space-y-1">
            {movie.director && (
              <div>
                <span className="font-medium">导演：</span>
                <span>{movie.director}</span>
              </div>
            )}
            {movie.actors && movie.actors.length > 0 && (
              <div>
                <span className="font-medium">主演：</span>
                <span>{movie.actors.slice(0, 3).join('、')}</span>
              </div>
            )}
          </div>
        )}

        {/* 下载信息 */}
        {(movie.size || movie.downloadCount) && (
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            {movie.size && (
              <span>大小：{movie.size}</span>
            )}
            {movie.downloadCount && (
              <div className="flex items-center gap-1">
                <Icon name="download" size="xs" />
                <span>{movie.downloadCount}</span>
              </div>
            )}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => onPlay?.(movie.id)}
            icon={<Icon name="play" />}
          >
            播放
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload?.(movie.id)}
            icon={<Icon name="download" />}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare?.(movie.id)}
            icon={<Icon name="share" />}
          />
        </div>
      </div>
    </div>
  )
}

export { MovieCard }