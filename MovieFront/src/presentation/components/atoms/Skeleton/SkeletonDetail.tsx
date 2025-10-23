/**
 * @fileoverview 详情页骨架屏组件
 * @description 用于电影/视频详情页的加载占位符
 * @author MovieFront Team
 * @since 1.0.0
 * @version 1.0.0
 * 
 * TODO: 根据实际详情页布局调整骨架屏结构
 * TODO: 添加更多配置选项（如是否显示演员列表、相关推荐等）
 * TODO: 支持不同类型的详情页（电影、剧集、写真等）
 */

import { Skeleton } from '@radix-ui/themes'
import { cn } from '@utils/cn'
import React from 'react'

export interface SkeletonDetailProps {
  /**
   * 自定义类名
   */
  className?: string
  
  /**
   * 布局类型
   * - horizontal: 横向布局（封面在左，信息在右）
   * - vertical: 纵向布局（封面在上，信息在下）
   */
  layout?: 'horizontal' | 'vertical'
  
  /**
   * 是否显示演员列表骨架屏
   */
  showCast?: boolean
  
  /**
   * 是否显示相关推荐骨架屏
   */
  showRecommendations?: boolean
}

/**
 * 详情页骨架屏组件
 * 
 * 用于电影/视频详情页的加载占位符
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <SkeletonDetail />
 * 
 * // 纵向布局
 * <SkeletonDetail layout="vertical" />
 * 
 * // 完整版（包含演员和推荐）
 * <SkeletonDetail showCast showRecommendations />
 * ```
 * 
 * @todo 根据实际详情页设计调整布局和元素
 */
export const SkeletonDetail: React.FC<SkeletonDetailProps> = ({
  className,
  layout = 'horizontal',
  showCast = true,
  showRecommendations = true,
}) => {
  return (
    <div className={cn('space-y-8', className)}>
      {/* 主要信息区域 */}
      <div
        className={cn(
          'flex gap-8',
          layout === 'vertical' ? 'flex-col' : 'flex-col md:flex-row'
        )}
      >
        {/* 封面图 */}
        <div className={cn(layout === 'vertical' ? 'w-full' : 'w-full md:w-1/3')}>
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
        </div>

        {/* 详情信息 */}
        <div className={cn('flex-1 space-y-6', layout === 'vertical' ? 'w-full' : '')}>
          {/* 标题 */}
          <Skeleton className="h-10 w-3/4 rounded" />

          {/* 元数据（年份、时长、分类等） */}
          <div className="flex gap-4">
            <Skeleton className="h-6 w-20 rounded" />
            <Skeleton className="h-6 w-24 rounded" />
            <Skeleton className="h-6 w-16 rounded" />
          </div>

          {/* 评分 */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          </div>

          {/* 简介 */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-full rounded" />
            <Skeleton className="h-5 w-full rounded" />
            <Skeleton className="h-5 w-4/5 rounded" />
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32 rounded-lg" />
            <Skeleton className="h-12 w-32 rounded-lg" />
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>

          {/* TODO: 添加更多详情信息骨架屏 */}
          {/* 例如：导演、编剧、制片国家、语言等 */}
        </div>
      </div>

      {/* 演员列表 */}
      {showCast && (
        <div className="space-y-4">
          <Skeleton className="h-8 w-32 rounded" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 space-y-2">
                <Skeleton className="h-32 w-24 rounded-lg" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 相关推荐 */}
      {showRecommendations && (
        <div className="space-y-4">
          <Skeleton className="h-8 w-40 rounded" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-full rounded" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TODO: 添加更多区域的骨架屏 */}
      {/* 例如：剧集列表、评论区、下载链接等 */}
    </div>
  )
}

export default SkeletonDetail
