/**
 * @fileoverview 头像组件
 * @description 提供用户头像显示功能，支持图片、fallback文本和图标三种显示模式，具备多种尺寸和形状配置选项，集成加载状态和错误处理机制
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Icon } from '@components/atoms/Icon'
import { cn } from '@utils/cn'
import React from 'react'

// 头像组件属性接口，定义头像组件的所有配置选项
export interface AvatarProps {
  src?: string // 头像图片地址
  alt?: string // 图片替代文本，用于无障碍访问
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' // 头像尺寸预设
  shape?: 'circle' | 'square' // 头像形状，圆形或方形
  fallback?: string // 图片加载失败时显示的回退文本
  className?: string // 自定义CSS类名
  onClick?: () => void // 点击事件处理器
}

// 头像组件，提供用户头像显示功能，支持图片加载状态管理和错误处理
const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  shape = 'circle',
  fallback,
  className,
  onClick,
}) => {
  // 图片加载状态管理
  const [imageError, setImageError] = React.useState(false)
  const [imageLoaded, setImageLoaded] = React.useState(false)

  // 尺寸样式映射配置，定义不同尺寸对应的CSS类
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  }

  // 形状样式映射配置，定义不同形状对应的CSS类
  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  }

  // 基础样式类配置，定义头像组件的通用样式
  const baseClasses = [
    'inline-flex items-center justify-center',
    'bg-gray-100 text-gray-600 font-medium',
    'overflow-hidden transition-all duration-200',
    'border-2 border-gray-200',
  ]

  // 图片加载错误处理函数
  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(false)
  }

  // 图片加载成功处理函数
  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  // 渲染回退内容，优先显示文本fallback，否则显示默认用户图标
  const renderFallback = () => {
    if (fallback) {
      return <span className="select-none">{fallback}</span>
    }

    return (
      <Icon
        name="user"
        size={size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : 'md'}
      />
    )
  }

  // 样式类组合 - 合并基础样式、尺寸样式、形状样式和交互样式
  const avatarClasses = cn(
    baseClasses,
    sizeClasses[size],
    shapeClasses[shape],
    onClick &&
      'cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-2',
    className
  )

  // 渲染头像组件 - 根据图片加载状态和错误状态决定显示内容
  return (
    <div className={avatarClasses} onClick={onClick}>
      {src && !imageError ? (
        <>
          <img
            src={src}
            alt={alt}
            className={cn(
              'h-full w-full object-cover transition-opacity duration-200',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          {/* 图片加载期间显示回退内容 */}
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
