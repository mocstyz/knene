import React from 'react'
import { cn } from '@/utils/cn'

export interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  shape?: 'rounded' | 'pill'
  children: React.ReactNode
  className?: string
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  shape = 'rounded',
  children,
  className
}) => {
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium whitespace-nowrap',
    'transition-colors duration-200'
  ]

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 border border-gray-300',
    primary: 'bg-blue-100 text-blue-800 border border-blue-300',
    secondary: 'bg-purple-100 text-purple-800 border border-purple-300',
    success: 'bg-green-100 text-green-800 border border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    danger: 'bg-red-100 text-red-800 border border-red-300',
    info: 'bg-cyan-100 text-cyan-800 border border-cyan-300'
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  const shapeClasses = {
    rounded: 'rounded-md',
    pill: 'rounded-full'
  }

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        shapeClasses[shape],
        className
      )}
    >
      {children}
    </span>
  )
}

export { Badge }