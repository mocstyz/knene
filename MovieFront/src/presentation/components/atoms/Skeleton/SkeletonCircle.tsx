/**
 * @fileoverview 圆形骨架屏组件
 * @description 圆形骨架屏,用于头像、图标等圆形元素的加载占位符
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'
import { SkeletonBase } from './SkeletonBase'

export interface SkeletonCircleProps {
  size?: string | number
  className?: string
  disableAnimation?: boolean
}

// 圆形骨架屏组件,用于头像、图标等圆形元素
export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = 40,
  className,
  disableAnimation,
}) => {
  return (
    <SkeletonBase
      width={size}
      height={size}
      borderRadius="50%"
      className={className}
      disableAnimation={disableAnimation}
    />
  )
}

export default SkeletonCircle
