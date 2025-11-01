/**
 * @fileoverview 影片Hero区域组件
 * @description 展示影片主要信息的Hero区域，包括背景模糊效果、海报、标题、评分、简介、演员和操作按钮
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'
import { ExternalLinkIcon } from '@components/atoms'
import { getRatingTextColorClass } from '@utils/formatters'

// MovieHeroSection组件Props接口
interface MovieHeroSectionProps {
  movie: {
    id: string
    title: string
    year: number
    imageUrl: string
    rating: string
    votes: number
    imdbRating?: number
    tmdbRating?: number
    description: string
    cast: string[]
  }
  onDownload: () => void
  onSubtitleClick: () => void
  onThankYou: () => void
  thankYouCount: number
  isThankYouActive: boolean
  isVip?: boolean
}

// 影片Hero区域组件，展示影片主要信息和操作按钮
export const MovieHeroSection: React.FC<MovieHeroSectionProps> = ({
  movie,
  onDownload,
  onSubtitleClick,
  onThankYou,
  thankYouCount,
  isThankYouActive,
  isVip = false,
}) => {
  // 计算星级评分
  const rating = parseFloat(movie.rating)
  const fullStars = Math.floor(rating / 2)
  const hasHalfStar = rating % 2 >= 1
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  // 格式化投票数
  const formatVotes = (votes: number): string => {
    if (votes >= 1000000) {
      return `${(votes / 1000000).toFixed(1)}M`
    }
    if (votes >= 1000) {
      return `${(votes / 1000).toFixed(1)}k`
    }
    return votes.toString()
  }

  // 格式化感谢数
  const formatThankYouCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  return (
    <div className="relative h-[70vh] text-white">
      {/* 背景模糊图片 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('${movie.imageUrl}')`
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-lg"></div>
      </div>

      {/* 渐变遮罩 - 优化渐变过渡 */}
      <div className="absolute inset-0 bg-gradient-to-t from-background-light via-background-light/40 to-transparent dark:from-background-dark dark:via-background-dark/40"></div>

      {/* 内容区域 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-8 flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-10">
          {/* 海报 */}
          <div className="w-2/5 md:w-1/4 lg:w-1/6 flex-shrink-0">
            <img
              alt={`${movie.title} movie poster`}
              className="rounded-lg shadow-2xl w-full aspect-[2/3] object-cover"
              src={movie.imageUrl}
            />
          </div>

          {/* 信息区域 - 使用flex布局垂直均匀分布 */}
          <div className="w-full md:w-2/3 flex flex-col justify-between">
            {/* 标题 */}
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              {movie.title} ({movie.year})
            </h1>

            {/* 评分区域 */}
            <div className="flex items-center gap-4 text-lg flex-wrap">
              {/* Douban评分 */}
              <div className="flex items-center gap-2">
                <ExternalLinkIcon 
                  type="douban" 
                  url="https://movie.douban.com" 
                  size="sm"
                  className="flex-shrink-0"
                />
                <span className={`font-bold ${getRatingTextColorClass(parseFloat(movie.rating))}`}>{movie.rating}</span>
                <div className="flex items-center text-yellow-400">
                  {/* 满星 */}
                  {Array.from({ length: fullStars }).map((_, i) => (
                    <span key={`full-${i}`} className="material-icons text-xl">
                      star
                    </span>
                  ))}
                  {/* 半星 */}
                  {hasHalfStar && (
                    <span className="material-icons text-xl">star_half</span>
                  )}
                  {/* 空星 */}
                  {Array.from({ length: emptyStars }).map((_, i) => (
                    <span key={`empty-${i}`} className="material-icons text-xl">
                      star_border
                    </span>
                  ))}
                </div>
                <span className="text-gray-300">({formatVotes(movie.votes)} votes)</span>
              </div>

              {/* IMDb评分 */}
              {movie.imdbRating && (
                <div className="flex items-center gap-2">
                  <ExternalLinkIcon 
                    type="imdb" 
                    url="https://www.imdb.com" 
                    size="sm"
                    className="flex-shrink-0"
                  />
                  <span className={`font-bold ${getRatingTextColorClass(movie.imdbRating)}`}>
                    {movie.imdbRating.toFixed(1)}
                  </span>
                </div>
              )}

              {/* TMDb评分 */}
              {movie.tmdbRating && (
                <div className="flex items-center gap-2">
                  <ExternalLinkIcon 
                    type="tmdb" 
                    url="https://www.themoviedb.org" 
                    size="sm"
                    className="flex-shrink-0"
                  />
                  <span className={`font-bold ${getRatingTextColorClass(movie.tmdbRating)}`}>
                    {movie.tmdbRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* 剧情简介 */}
            <p className="text-gray-200 max-w-2xl break-words leading-relaxed">{movie.description}</p>

            {/* 主演 */}
            <div>
              <span className="font-semibold text-white">主演: </span>
              <span className="text-gray-200">{movie.cast.join(', ')}</span>
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-4 pt-4">
              {/* 下载按钮 */}
              <button
                onClick={onDownload}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:opacity-90 transition ${
                  isVip ? '' : 'bg-primary text-gray-900'
                }`}
                style={
                  isVip
                    ? {
                        background: 'linear-gradient(90deg, #F5E6C8 0%, #F4D03F 100%)',
                        color: '#5D4E37',
                      }
                    : undefined
                }
              >
                <span className="material-icons text-xl">download</span>
                <span>Download</span>
              </button>

              {/* 字幕按钮 */}
              <button
                onClick={onSubtitleClick}
                className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-opacity-30 transition"
              >
                <span className="material-icons text-xl">subtitles</span>
                <span>Download Subtitles</span>
              </button>

              {/* 谢谢你按钮 */}
              <button
                onClick={onThankYou}
                disabled={isThankYouActive}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition ${
                  isThankYouActive
                    ? 'bg-pink-600 text-white cursor-not-allowed'
                    : 'bg-pink-500 bg-opacity-80 text-white hover:bg-opacity-100'
                }`}
              >
                <span className="material-icons text-xl">thumb_up</span>
                <span>谢谢你 ({formatThankYouCount(thankYouCount)})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
