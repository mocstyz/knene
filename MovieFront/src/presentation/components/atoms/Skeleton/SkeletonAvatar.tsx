/**
 * @fileoverview 头像骨架屏组件
 * @description 用于用户头像、演员头像等圆形头像的加载占位符,使用统一的 shimmer 动画效果
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'
import { SkeletonCircle } from './SkeletonCircle'

export interface SkeletonAvatarProps {
  size?: string | number
  className?: string
  disableAnimation?: boolean
}

// 头像骨架屏组件,用于用户头像、演员头像等圆形头像
export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 40,
  className,
  disableAnimation,
}) => {
  return (
    <SkeletonCircle
      size={size}
      className={className}
      disableAnimation={disableAnimation}
    />
  )
}

export default SkeletonAvatar
