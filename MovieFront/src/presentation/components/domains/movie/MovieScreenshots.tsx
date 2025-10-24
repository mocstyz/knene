/**
 * @fileoverview 影片截图组件
 * @description 展示影片截图网格，支持响应式布局和图片懒加载
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'
import type { Screenshot } from '@types-movie'

// MovieScreenshots组件Props接口
interface MovieScreenshotsProps {
  screenshots: Screenshot[]
  onImageClick?: (index: number) => void
  title?: string // 可选的标题，默认为"影片截图"
}

// 影片截图组件，展示截图网格
export const MovieScreenshots: React.FC<MovieScreenshotsProps> = ({
  screenshots,
  onImageClick,
  title = '影片截图',
}) => {
  // 图片加载错误处理
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src =
      'https://via.placeholder.com/400x225/374151/9ca3af?text=Image+Not+Available'
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>

      {/* 截图网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {screenshots.map((screenshot, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition"
            onClick={() => onImageClick?.(index)}
          >
            <img
              alt={screenshot.alt}
              className="rounded-lg object-cover w-full h-full"
              src={screenshot.url}
              loading="lazy"
              onError={handleImageError}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
