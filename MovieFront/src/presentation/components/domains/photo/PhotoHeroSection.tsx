/**
 * @fileoverview 写真Hero区域组件
 * @description 展示写真主要信息的Hero区域，包括背景模糊效果、海报、标题和操作按钮
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'

// PhotoHeroSection组件Props接口
interface PhotoHeroSectionProps {
  photo: {
    id: string
    title: string
    year: number
    imageUrl: string
  }
  onDownload: () => void
  onThankYou: () => void
  thankYouCount: number
  isThankYouActive: boolean
}

// 写真Hero区域组件，展示写真主要信息和操作按钮
export const PhotoHeroSection: React.FC<PhotoHeroSectionProps> = ({
  photo,
  onDownload,
  onThankYou,
  thankYouCount,
  isThankYouActive,
}) => {
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
          backgroundImage: `url('${photo.imageUrl}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-lg"></div>
      </div>

      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-background-light via-background-light/40 to-transparent dark:from-background-dark dark:via-background-dark/40"></div>

      {/* 内容区域 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-8 flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-10">
          {/* 海报 */}
          <div className="w-2/5 md:w-1/4 lg:w-1/6 flex-shrink-0">
            <img
              alt={`${photo.title} poster`}
              className="rounded-lg shadow-2xl w-full aspect-[2/3] object-cover"
              src={photo.imageUrl}
            />
          </div>

          {/* 信息区域 */}
          <div className="w-full md:w-2/3 flex flex-col justify-between">
            {/* 标题 */}
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              {photo.title} ({photo.year})
            </h1>

            {/* 占位空间，保持布局平衡 */}
            <div></div>
            <div></div>

            {/* 操作按钮 */}
            <div className="flex space-x-4 pt-4">
              {/* 下载按钮 */}
              <button
                onClick={onDownload}
                className="bg-primary text-gray-900 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:opacity-90 transition"
              >
                <span className="material-icons text-xl">download</span>
                <span>Download</span>
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
