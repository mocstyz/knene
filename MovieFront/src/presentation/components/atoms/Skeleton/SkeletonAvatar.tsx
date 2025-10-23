/**
 * @fileoverview 头像骨架屏组件
 * @description 用于用户头像、演员头像等圆形/方形头像的加载占位符
 * @author MovieFront Team
 * @since 1.0.0
 * @version 1.0.0
 */

import { Skeleton } from '@radix-ui/themes'
import { cn } from '@utils/cn'
import React from 'react'

export interface SkeletonAvatarProps {
  /**
   * 尺寸
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  
  /**
   * 形状
   */
  shape?: 'circle' | 'square'
  
  /**
   * 自定义类名
   */
  className?: string
  
  /**
   * 是否显示名称骨架屏
   */
  showName?: boolean
}

/**
 * 头像骨架屏组件
 * 
 * 用于用户头像、演员头像等的加载占位符
 * 
 * @example
 * ```tsx
 * // 圆形头像
 * <SkeletonAvatar />
 * 
 * // 方形头像
 * <SkeletonAvatar shape="square" />
 * 
 * // 带名称
 * <SkeletonAvatar showName />
 * 
 * // 大尺寸
 * <SkeletonAvatar size="xl" />
 * ```
 */
export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 'md',
  shape = 'circle',
  className,
  showName = false,
}) => {
  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  }[size]

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-lg'

  return (
    <div className="flex items-center gap-3">
      <Skeleton className={cn(sizeClass, shapeClass, className)} />
      
      {showName && (
        <div className="space-y-1">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
      )}
    </div>
  )
}

export default SkeletonAvatar
