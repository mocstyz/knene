/**
 * @fileoverview 影片详情Hook
 * @description 处理影片详情数据获取和状态管理，提供加载状态、错误处理和数据刷新功能
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { useState, useEffect } from 'react'
import { movieDetailApi } from '@infrastructure/api/movieDetailApi'
import type { MovieDetail } from '@types-movie'

// useMovieDetail Hook返回值接口
interface UseMovieDetailReturn {
  movie: MovieDetail | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  toggleFavorite: () => Promise<void>
  incrementThankYou: () => Promise<void>
}

// 影片详情Hook，处理影片数据获取和状态管理
export function useMovieDetail(movieId: string): UseMovieDetailReturn {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取影片详情数据
  const fetchMovieDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await movieDetailApi.getMovieDetail(movieId)
      setMovie(data)
    } catch (err) {
      setError('加载影片详情失败，请稍后重试')
      console.error('Failed to fetch movie detail:', err)
    } finally {
      setLoading(false)
    }
  }

  // 刷新数据
  const refresh = async () => {
    await fetchMovieDetail()
  }

  // 切换收藏状态
  const toggleFavorite = async () => {
    if (!movie) return

    try {
      const newFavoritedState = await movieDetailApi.toggleFavorite(
        movieId,
        movie.isFavorited || false
      )
      setMovie({
        ...movie,
        isFavorited: newFavoritedState,
      })
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
    }
  }

  // 增加感谢计数
  const incrementThankYou = async () => {
    if (!movie) return

    try {
      const newCount = await movieDetailApi.incrementThankYou(movieId)
      setMovie({
        ...movie,
        thankYouCount: newCount,
        isThankYouActive: true,
      })
    } catch (err) {
      console.error('Failed to increment thank you:', err)
    }
  }

  useEffect(() => {
    if (movieId) {
      fetchMovieDetail()
    }
  }, [movieId])

  return {
    movie,
    loading,
    error,
    refresh,
    toggleFavorite,
    incrementThankYou,
  }
}
