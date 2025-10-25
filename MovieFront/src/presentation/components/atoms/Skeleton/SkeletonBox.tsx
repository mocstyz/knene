/**
 * @fileoverview 矩形骨架屏组件
 * @description 基础矩形骨架屏,最灵活的原子组件,可用于构建各种形状的骨架屏
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'
import { SkeletonBase, type SkeletonBaseProps } from './SkeletonBase'

export interface SkeletonBoxProps extends Omit<SkeletonBaseProps, 'children'> {}

// 矩形骨架屏组件,用于构建各种形状的骨架屏
export const SkeletonBox: React.FC<SkeletonBoxProps> = (props) => {
  return <SkeletonBase {...props} />
}

export default SkeletonBox
