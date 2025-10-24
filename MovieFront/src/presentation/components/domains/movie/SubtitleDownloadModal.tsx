/**
 * @fileoverview 字幕下载弹窗组件
 * @description 展示字幕下载源选择弹窗，支持点击外部区域关闭
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React, { useEffect } from 'react'
import type { SubtitleSource } from '@types-movie'

// SubtitleDownloadModal组件Props接口
interface SubtitleDownloadModalProps {
  isOpen: boolean
  sources: SubtitleSource[]
  onClose: () => void
}

// 字幕下载弹窗组件，展示字幕下载源列表
export const SubtitleDownloadModal: React.FC<SubtitleDownloadModalProps> = ({
  isOpen,
  sources,
  onClose,
}) => {
  // 点击外部区域关闭弹窗
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // ESC键关闭弹窗
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // 阻止页面滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        {/* 弹窗头部 */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            选择字幕下载源
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            aria-label="关闭"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* 字幕源列表 */}
        <div className="p-6 space-y-4">
          {sources.map((source, index) => (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-left p-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {source.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {source.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
