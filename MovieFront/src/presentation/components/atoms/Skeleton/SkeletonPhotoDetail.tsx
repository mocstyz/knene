/**
 * @fileoverview 写真详情页骨架屏组件
 * @description 用于写真详情页的完整加载占位符，包括资源信息、写真图片和评论
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'
import { SkeletonBase } from './SkeletonBase'
import { SkeletonText } from './SkeletonText'
import { SkeletonComments } from './SkeletonComments'

export interface SkeletonPhotoDetailProps {
  className?: string
  showPhotos?: boolean
  showComments?: boolean
  photoCount?: number
  disableAnimation?: boolean
}

// 写真详情页骨架屏组件
export const SkeletonPhotoDetail: React.FC<SkeletonPhotoDetailProps> = ({
  className,
  showPhotos = true,
  showComments = true,
  photoCount = 12,
  disableAnimation,
}) => {
  return (
    <div className={cn('space-y-8', className)}>
      {/* 资源信息区域 */}
      <div className="space-y-4">
        {/* 标题和操作按钮 */}
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-3">
            <SkeletonText width="60%" height={28} disableAnimation={disableAnimation} />
            <div className="flex gap-3">
              <SkeletonText width={100} height={20} disableAnimation={disableAnimation} />
              <SkeletonText width={120} height={20} disableAnimation={disableAnimation} />
              <SkeletonText width={80} height={20} disableAnimation={disableAnimation} />
            </div>
          </div>
          <div className="flex gap-2">
            <SkeletonBase width={40} height={40} borderRadius={8} disableAnimation={disableAnimation} />
            <SkeletonBase width={40} height={40} borderRadius={8} disableAnimation={disableAnimation} />
          </div>
        </div>

        {/* 资源详情 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <SkeletonText width={80} height={16} disableAnimation={disableAnimation} />
              <SkeletonText width="100%" height={20} disableAnimation={disableAnimation} />
            </div>
          ))}
        </div>

        {/* 简介 */}
        <div className="space-y-2">
          <SkeletonText width={80} height={20} disableAnimation={disableAnimation} />
          <div className="space-y-1">
            <SkeletonText width="100%" height={18} disableAnimation={disableAnimation} />
            <SkeletonText width="100%" height={18} disableAnimation={disableAnimation} />
            <SkeletonText width="85%" height={18} disableAnimation={disableAnimation} />
          </div>
        </div>
      </div>

      {/* 写真图片区域 */}
      {showPhotos && (
        <div className="space-y-4">
          <SkeletonText width={120} height={24} disableAnimation={disableAnimation} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: photoCount }).map((_, index) => (
              <SkeletonBase
                key={index}
                width="100%"
                height={0}
                borderRadius={8}
                className="aspect-[3/4]"
                disableAnimation={disableAnimation}
              />
            ))}
          </div>
        </div>
      )}

      {/* 评论区域 */}
      {showComments && (
        <SkeletonComments
          commentCount={3}
          showReplies={true}
          disableAnimation={disableAnimation}
        />
      )}
    </div>
  )
}

export default SkeletonPhotoDetail
