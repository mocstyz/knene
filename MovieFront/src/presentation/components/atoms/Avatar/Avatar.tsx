import React from 'react'
import { cn } from '@/utils/cn'
import { Icon } from '@/components/atoms/Icon'

export interface AvatarProps {
  src?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shape?: 'circle' | 'square'
  fallback?: string
  className?: string
  onClick?: () => void
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  shape = 'circle',
  fallback,
  className,
  onClick
}) => {
  const [imageError, setImageError] = React.useState(false)
  const [imageLoaded, setImageLoaded] = React.useState(false)

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  }

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg'
  }

  const baseClasses = [
    'inline-flex items-center justify-center',
    'bg-gray-100 text-gray-600 font-medium',
    'overflow-hidden transition-all duration-200',
    'border-2 border-gray-200'
  ]

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(false)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  const renderFallback = () => {
    if (fallback) {
      return <span className="select-none">{fallback}</span>
    }
    
    return <Icon name="user" size={size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : 'md'} />
  }

  const avatarClasses = cn(
    baseClasses,
    sizeClasses[size],
    shapeClasses[shape],
    onClick && 'cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-2',
    className
  )

  return (
    <div className={avatarClasses} onClick={onClick}>
      {src && !imageError ? (
        <>
          <img
            src={src}
            alt={alt}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-200',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              {renderFallback()}
            </div>
          )}
        </>
      ) : (
        renderFallback()
      )}
    </div>
  )
}

export { Avatar }