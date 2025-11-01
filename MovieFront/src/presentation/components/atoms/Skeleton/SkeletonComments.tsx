/**
 * @fileoverview 评论骨架屏组件
 * @description 用于评论区域的加载占位符，模拟评论输入框和评论列表的结构
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'
import { SkeletonBase } from './SkeletonBase'
import { SkeletonText } from './SkeletonText'
import { SkeletonAvatar } from './SkeletonAvatar'

export interface SkeletonCommentsProps {
  className?: string
  commentCount?: number
  showReplies?: boolean
  disableAnimation?: boolean
}

// 单个评论项骨架屏
const SkeletonCommentItem: React.FC<{
  depth?: number
  showReply?: boolean
  disableAnimation?: boolean
}> = ({ depth = 0, showReply = false, disableAnimation }) => {
  const avatarSize = depth === 0 ? 40 : depth === 1 ? 32 : 24
  const padding = depth === 0 ? 'p-4' : depth === 1 ? 'p-3' : 'p-2'

  return (
    <div className="flex space-x-4">
      <SkeletonAvatar size={avatarSize} disableAnimation={disableAnimation} />
      <div className="flex-1 space-y-2">
        {/* 评论卡片 */}
        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg">
          <div className={cn(padding, 'space-y-2')}>
            {/* 用户名和时间 */}
            <div className="flex justify-between items-center">
              <SkeletonText width={120} height={16} disableAnimation={disableAnimation} />
              <SkeletonText width={80} height={12} disableAnimation={disableAnimation} />
            </div>
            {/* 评论内容 */}
            <div className="space-y-1">
              <SkeletonText width="100%" height={14} disableAnimation={disableAnimation} />
              <SkeletonText width="85%" height={14} disableAnimation={disableAnimation} />
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center space-x-4">
          <SkeletonText width={60} height={16} disableAnimation={disableAnimation} />
          <SkeletonText width={60} height={16} disableAnimation={disableAnimation} />
          <SkeletonText width={50} height={16} disableAnimation={disableAnimation} />
        </div>

        {/* 嵌套回复 */}
        {showReply && depth < 2 && (
          <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 ml-4 mt-4 space-y-4">
            <SkeletonCommentItem depth={depth + 1} disableAnimation={disableAnimation} />
          </div>
        )}
      </div>
    </div>
  )
}

// 评论骨架屏组件
export const SkeletonComments: React.FC<SkeletonCommentsProps> = ({
  className,
  commentCount = 3,
  showReplies = true,
  disableAnimation,
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      {/* 标题 */}
      <SkeletonText width={100} height={32} disableAnimation={disableAnimation} />

      {/* 评论输入框 */}
      <div className="flex space-x-4">
        <SkeletonAvatar size={40} disableAnimation={disableAnimation} />
        <div className="flex-1 space-y-2">
          <SkeletonBase
            width="100%"
            height={80}
            borderRadius={8}
            disableAnimation={disableAnimation}
          />
          <div className="flex justify-end">
            <SkeletonBase
              width={120}
              height={40}
              borderRadius={8}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="space-y-6">
        {Array.from({ length: commentCount }).map((_, index) => (
          <SkeletonCommentItem
            key={index}
            showReply={showReplies && index === 0}
            disableAnimation={disableAnimation}
          />
        ))}
      </div>
    </div>
  )
}

export default SkeletonComments
