/**
 * @fileoverview 影片资源信息组件
 * @description 展示影片资源的详细信息，包括标题、标签、统计数据、上传者信息和操作按钮
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'
import type { ResourceInfo } from '@types-movie'
import { VipBadge } from '@components/atoms'

// MovieResourceInfo组件Props接口
interface MovieResourceInfoProps {
  resource: ResourceInfo
  isFavorited: boolean
  onFavoriteToggle: () => void
  onReport: () => void
}

// 标签颜色映射
const tagColorMap = {
  green: 'bg-primary/30 text-green-800 dark:text-primary',
  blue: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
  yellow:
    'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400',
  purple:
    'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400',
  red: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400',
  indigo:
    'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400',
}

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}`
  }
  return num.toString()
}

// 影片资源信息组件，展示资源详细信息和操作按钮
export const MovieResourceInfo: React.FC<MovieResourceInfoProps> = ({
  resource,
  isFavorited,
  onFavoriteToggle,
  onReport,
}) => {
  return (
    <div className="space-y-4">
      {/* 标题和操作按钮 */}
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          资源信息
        </h2>
        <div className="flex items-center space-x-4 text-2xl">
          {/* 收藏按钮 */}
          <button
            onClick={onFavoriteToggle}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            aria-label={isFavorited ? '取消收藏' : '收藏'}
          >
            <span className={`material-icons ${isFavorited ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
              {isFavorited ? 'favorite' : 'favorite_border'}
            </span>
          </button>

          {/* 举报按钮 */}
          <button
            onClick={onReport}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            aria-label="举报"
          >
            <span className="material-icons text-red-500">flag</span>
          </button>
        </div>
      </div>

      {/* 资源详情卡片 */}
      <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            {/* 资源标题 */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {resource.title} <VipBadge />
            </h3>

            {/* 标签列表 */}
            <div className="flex items-center space-x-2 text-sm mt-2">
              {resource.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`${tagColorMap[tag.color]
                    } px-2 py-1 rounded-full text-xs font-medium`}
                >
                  {tag.label}
                </span>
              ))}
            </div>

            {/* 统计数据 */}
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mt-3">
              <span className="flex items-center">
                <span className="material-icons text-base mr-1">
                  visibility
                </span>{' '}
                {formatNumber(resource.stats.views)}M
              </span>
              <span className="flex items-center">
                <span className="material-icons text-base mr-1">download</span>{' '}
                {resource.stats.downloads}
              </span>
              <span className="flex items-center">
                <span className="material-icons text-base mr-1">
                  check_circle
                </span>{' '}
                {resource.stats.likes}
              </span>
              <span className="flex items-center">
                <span className="material-icons text-base mr-1">
                  thumb_down
                </span>{' '}
                {resource.stats.dislikes}
              </span>
            </div>
          </div>

          {/* 上传者信息 */}
          <div className="text-right text-sm text-gray-500 dark:text-gray-400">
            <p>
              Uploaded by:{' '}
              <a
                href={`/user/${resource.uploader.name}`}
                className="text-primary hover:text-primary-dark hover:underline transition-colors"
              >
                {resource.uploader.name}
              </a>
            </p>
            <p>{resource.uploader.uploadTime}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
