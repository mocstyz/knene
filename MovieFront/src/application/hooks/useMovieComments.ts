/**
 * @fileoverview 影片评论Hook
 * @description 处理影片评论数据获取、提交、点赞等功能，提供完整的评论系统状态管理
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { useState, useEffect } from 'react'
import { movieDetailApi } from '@infrastructure/api/movieDetailApi'
import type { Comment } from '@types-movie'

// useMovieComments Hook返回值接口
interface UseMovieCommentsReturn {
  comments: Comment[]
  loading: boolean
  error: string | null
  submitComment: (content: string) => Promise<void>
  submitReply: (commentId: string, content: string) => Promise<void>
  likeComment: (commentId: string) => Promise<void>
  dislikeComment: (commentId: string) => Promise<void>
  refresh: () => Promise<void>
}

// 影片评论Hook，处理评论数据获取和交互
export function useMovieComments(movieId: string): UseMovieCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取评论列表
  const fetchComments = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await movieDetailApi.getMovieComments(movieId)
      setComments(data)
    } catch (err) {
      setError('加载评论失败，请稍后重试')
      console.error('Failed to fetch comments:', err)
    } finally {
      setLoading(false)
    }
  }

  // 提交评论
  const submitComment = async (content: string) => {
    if (!content.trim()) return

    try {
      const newComment = await movieDetailApi.submitComment(movieId, content)
      setComments([newComment, ...comments])
    } catch (err) {
      console.error('Failed to submit comment:', err)
      throw err
    }
  }

  // 提交回复
  const submitReply = async (commentId: string, content: string) => {
    if (!content.trim()) return

    try {
      const newReply = await movieDetailApi.submitReply(commentId, content)

      const updateCommentReplies = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply],
            }
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentReplies(comment.replies),
            }
          }
          return comment
        })
      }

      setComments(updateCommentReplies(comments))
    } catch (err) {
      console.error('Failed to submit reply:', err)
      throw err
    }
  }

  // 点赞评论
  const likeComment = async (commentId: string) => {
    try {
      await movieDetailApi.likeComment(commentId)

      const updateCommentLikes = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: comment.likes + 1,
            }
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentLikes(comment.replies),
            }
          }
          return comment
        })
      }

      setComments(updateCommentLikes(comments))
    } catch (err) {
      console.error('Failed to like comment:', err)
    }
  }

  // 点踩评论
  const dislikeComment = async (commentId: string) => {
    try {
      await movieDetailApi.dislikeComment(commentId)

      const updateCommentDislikes = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              dislikes: comment.dislikes + 1,
            }
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentDislikes(comment.replies),
            }
          }
          return comment
        })
      }

      setComments(updateCommentDislikes(comments))
    } catch (err) {
      console.error('Failed to dislike comment:', err)
    }
  }

  // 刷新评论列表
  const refresh = async () => {
    await fetchComments()
  }

  useEffect(() => {
    if (movieId) {
      fetchComments()
    }
  }, [movieId])

  return {
    comments,
    loading,
    error,
    submitComment,
    submitReply,
    likeComment,
    dislikeComment,
    refresh,
  }
}
