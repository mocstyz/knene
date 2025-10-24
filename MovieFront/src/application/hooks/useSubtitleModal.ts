/**
 * @fileoverview 字幕弹窗Hook
 * @description 处理字幕下载弹窗的状态管理和字幕源数据获取
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { useState, useEffect } from 'react'
import { movieDetailApi } from '@infrastructure/api/movieDetailApi'
import type { SubtitleSource } from '@types-movie'

// useSubtitleModal Hook返回值接口
interface UseSubtitleModalReturn {
  isOpen: boolean
  sources: SubtitleSource[]
  loading: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

// 字幕弹窗Hook，处理弹窗状态和字幕源数据
export function useSubtitleModal(): UseSubtitleModalReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [sources, setSources] = useState<SubtitleSource[]>([])
  const [loading, setLoading] = useState(false)

  // 获取字幕下载源列表
  const fetchSubtitleSources = async () => {
    try {
      setLoading(true)
      const data = await movieDetailApi.getSubtitleSources()
      setSources(data)
    } catch (err) {
      console.error('Failed to fetch subtitle sources:', err)
    } finally {
      setLoading(false)
    }
  }

  // 打开弹窗
  const open = () => {
    setIsOpen(true)
  }

  // 关闭弹窗
  const close = () => {
    setIsOpen(false)
  }

  // 切换弹窗状态
  const toggle = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (isOpen && sources.length === 0) {
      fetchSubtitleSources()
    }
  }, [isOpen])

  return {
    isOpen,
    sources,
    loading,
    open,
    close,
    toggle,
  }
}
