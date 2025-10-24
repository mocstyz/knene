/**
 * @fileoverview 影片文件信息组件
 * @description 展示影片文件的技术规格信息，包括格式、大小、时长、视频、音频和字幕信息，支持展开查看完整技术详情
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React, { useState } from 'react'
import type { FileInfo } from '@types-movie'

// MovieFileInfo组件Props接口
interface MovieFileInfoProps {
  fileInfo: FileInfo
}

// 解析并格式化技术信息文本，确保对齐
const formatRawInfo = (rawInfo: string): React.ReactNode => {
  const lines = rawInfo.split('\n')
  const formattedLines: React.ReactNode[] = []
  
  lines.forEach((line, index) => {
    // 检查是否是标题行（没有冒号的行）
    if (!line.includes(':')) {
      formattedLines.push(
        <div key={index} className="font-bold text-primary mt-3 mb-1">
          {line.trim()}
        </div>
      )
    } else {
      // 包含冒号的行，分割为键值对
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim()
        const value = line.substring(colonIndex + 1).trim()
        
        formattedLines.push(
          <div key={index} className="flex text-xs leading-relaxed">
            <span className="text-gray-600 dark:text-gray-400 w-48 flex-shrink-0">
              {key}
            </span>
            <span className="text-gray-500 dark:text-gray-500 mx-2">:</span>
            <span className="text-gray-800 dark:text-gray-300 flex-1">
              {value}
            </span>
          </div>
        )
      } else {
        // 没有有效的冒号分隔，直接显示
        formattedLines.push(
          <div key={index} className="text-xs text-gray-700 dark:text-gray-400">
            {line}
          </div>
        )
      }
    }
  })
  
  return <div className="space-y-0.5">{formattedLines}</div>
}

// 影片文件信息组件，展示文件技术规格
export const MovieFileInfo: React.FC<MovieFileInfoProps> = ({ fileInfo }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  return (
    <div className="space-y-4">
      {/* 标题和展开按钮 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          文件信息
        </h2>
        {fileInfo.rawInfo && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition"
            aria-label={isExpanded ? '收起详情' : '展开详情'}
          >
            <span className="text-sm">
              {isExpanded ? '收起详情' : '查看完整信息'}
            </span>
            <span className="material-icons text-xl">
              {isExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        )}
      </div>

      {/* 文件信息网格 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        {/* 基础信息 */}
        <div className="space-y-2">
          <p className="flex">
            <strong className="text-gray-600 dark:text-gray-300 w-16 flex-shrink-0">格式:</strong>
            <span>{fileInfo.format}</span>
          </p>
          <p className="flex">
            <strong className="text-gray-600 dark:text-gray-300 w-16 flex-shrink-0">大小:</strong>
            <span>{fileInfo.size}</span>
          </p>
          <p className="flex">
            <strong className="text-gray-600 dark:text-gray-300 w-16 flex-shrink-0">时长:</strong>
            <span>{fileInfo.duration}</span>
          </p>
        </div>

        {/* 视频信息 */}
        <div className="space-y-2">
          <p className="flex">
            <strong className="text-gray-600 dark:text-gray-300 w-16 flex-shrink-0">视频:</strong>
            <span>{fileInfo.video.codec}</span>
          </p>
          <p className="flex">
            <strong className="text-gray-600 dark:text-gray-300 w-16 flex-shrink-0">分辨率:</strong>
            <span>{fileInfo.video.resolution}</span>
          </p>
          <p className="flex">
            <strong className="text-gray-600 dark:text-gray-300 w-16 flex-shrink-0">帧率:</strong>
            <span>{fileInfo.video.fps}</span>
          </p>
        </div>

        {/* 音频信息 */}
        <div className="space-y-2">
          <p className="flex">
            <strong className="text-gray-600 dark:text-gray-300 w-16 flex-shrink-0">音频:</strong>
            <span>{fileInfo.audio.codec}</span>
          </p>
          <p className="flex">
            <strong className="text-gray-600 dark:text-gray-300 w-16 flex-shrink-0">声道:</strong>
            <span>{fileInfo.audio.channels}</span>
          </p>
          <p className="flex">
            <strong className="text-gray-600 dark:text-gray-300 w-16 flex-shrink-0">采样率:</strong>
            <span>{fileInfo.audio.sampleRate}</span>
          </p>
        </div>

        {/* 字幕信息 */}
        <div className="md:col-span-3">
          <p className="flex">
            <strong className="text-gray-600 dark:text-gray-300 w-16 flex-shrink-0">字幕:</strong>
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {fileInfo.subtitles.map((subtitle, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-semibold ${subtitle.isHighlighted
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
              >
                {subtitle.language}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 完整技术信息（展开时显示） */}
      {isExpanded && fileInfo.rawInfo && (
        <div className="mt-6">
          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                完整技术信息 ({fileInfo.rawInfoType === 'bdinfo' ? 'BDInfo' : 'MediaInfo'})
              </h3>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(fileInfo.rawInfo || '')
                    setCopySuccess(true)
                    setTimeout(() => setCopySuccess(false), 2000)
                  } catch (err) {
                    console.error('复制失败:', err)
                  }
                }}
                className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition"
              >
                <span className="material-icons text-base">content_copy</span>
                <span>{copySuccess ? '已复制!' : '复制'}</span>
              </button>
            </div>
            <div>
              {formatRawInfo(fileInfo.rawInfo)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
