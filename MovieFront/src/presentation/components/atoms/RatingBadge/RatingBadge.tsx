import { cn } from '@utils/cn'
import React from 'react'

export interface RatingBadgeProps {
  rating: string
  color?: 'purple' | 'red' | 'white' | 'yellow' | 'green' | 'default'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  color = 'default',
  size = 'sm',
  className,
}) => {
  const colorClasses = {
    purple: 'text-purple-400',
    red: 'text-red-500',
    white: 'text-white',
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    default: 'text-purple-400',
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  return (
    <div
      className={cn(
        'absolute bottom-2 left-2 z-10 rounded-md bg-black/70 font-bold',
        colorClasses[color],
        sizeClasses[size],
        className
      )}
    >
      {rating}
    </div>
  )
}

export { RatingBadge }
