/**
 * @fileoverview 举报弹窗组件
 * @description 展示举报表单弹窗，支持用户填写举报原因
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'

// ReportModal组件Props接口
interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: string, description: string) => Promise<void>
}

// 举报原因选项
const REPORT_REASONS = [
  '侵犯版权',
  '虚假信息',
  '恶意内容',
  '垃圾广告',
  '其他原因',
]

// 举报弹窗组件，展示举报表单
export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedReason, setSelectedReason] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

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

  // 提交举报
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReason || submitting) return

    try {
      setSubmitting(true)
      await onSubmit(selectedReason, description)
      setSelectedReason('')
      setDescription('')
      onClose()
    } catch (err) {
      console.error('Failed to submit report:', err)
    } finally {
      setSubmitting(false)
    }
  }

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
            举报内容
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            aria-label="关闭"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* 举报表单 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 举报原因选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              举报原因 *
            </label>
            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => (
                <label
                  key={reason}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {reason}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 详细描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              详细描述（可选）
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="请描述具体问题..."
              rows={4}
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!selectedReason || submitting}
              className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '提交中...' : '提交举报'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
