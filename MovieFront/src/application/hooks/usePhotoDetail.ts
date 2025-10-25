/**
 * @fileoverview 写真详情Hook
 * @description 处理写真详情数据获取和状态管理
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { useState, useEffect } from 'react'
import { photoDetailApi } from '@infrastructure/api/photoDetailApi'
import type { PhotoDetail } from '@/types/photo.types'

// usePhotoDetail Hook返回值接口
interface UsePhotoDetailReturn {
  photo: PhotoDetail | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  toggleFavorite: () => Promise<void>
  incrementThankYou: () => Promise<void>
}

// 写真详情Hook，处理写真数据获取和状态管理
export function usePhotoDetail(photoId: string): UsePhotoDetailReturn {
  const [photo, setPhoto] = useState<PhotoDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取写真详情数据
  const fetchPhotoDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await photoDetailApi.getPhotoDetail(photoId)
      
      setPhoto(data)
    } catch (err) {
      setError('加载写真详情失败，请稍后重试')
      console.error('Failed to fetch photo detail:', err)
    } finally {
      setLoading(false)
    }
  }

  // 刷新数据
  const refresh = async () => {
    await fetchPhotoDetail()
  }

  // 切换收藏状态
  const toggleFavorite = async () => {
    if (!photo) return

    try {
      const newFavoritedState = await photoDetailApi.toggleFavorite(
        photoId,
        photo.isFavorited || false
      )
      setPhoto({
        ...photo,
        isFavorited: newFavoritedState,
      })
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
    }
  }

  // 增加感谢计数
  const incrementThankYou = async () => {
    if (!photo) return

    try {
      const newCount = await photoDetailApi.incrementThankYou(photoId)
      setPhoto({
        ...photo,
        thankYouCount: newCount,
        isThankYouActive: true,
      })
    } catch (err) {
      console.error('Failed to increment thank you:', err)
    }
  }

  useEffect(() => {
    if (photoId) {
      fetchPhotoDetail()
    }
  }, [photoId])

  return {
    photo,
    loading,
    error,
    refresh,
    toggleFavorite,
    incrementThankYou,
  }
}
