/**
 * @fileoverview 外部链接组件
 * @description 展示影片在Douban、IMDb、TMDb等外部网站的链接图标
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'
import { ExternalLinkIcon } from '@components/atoms'

// 外部链接组件属性接口
export interface ExternalLinksProps {
  doubanUrl?: string // 豆瓣链接
  imdbUrl?: string // IMDb链接
  tmdbUrl?: string // TMDb链接
  size?: 'sm' | 'md' | 'lg' // 图标尺寸
  className?: string // 自定义样式类名
}

// 外部链接组件，展示影片的外部网站链接
export const ExternalLinks: React.FC<ExternalLinksProps> = ({
  doubanUrl,
  imdbUrl,
  tmdbUrl,
  size = 'md',
  className = '',
}) => {
  // 如果没有任何链接，不渲染组件
  if (!doubanUrl && !imdbUrl && !tmdbUrl) {
    return null
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm text-gray-400 dark:text-gray-500">查看更多:</span>
      <div className="flex items-center gap-2">
        {doubanUrl && (
          <ExternalLinkIcon type="douban" url={doubanUrl} size={size} />
        )}
        {imdbUrl && (
          <ExternalLinkIcon type="imdb" url={imdbUrl} size={size} />
        )}
        {tmdbUrl && (
          <ExternalLinkIcon type="tmdb" url={tmdbUrl} size={size} />
        )}
      </div>
    </div>
  )
}

export default ExternalLinks
