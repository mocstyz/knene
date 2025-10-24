/**
 * @fileoverview 影片评论组件
 * @description 展示影片评论系统，支持评论发表、嵌套回复、点赞点踩等功能
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React, { useState } from 'react'
import type { Comment } from '@types-movie'

// MovieComments组件Props接口
interface MovieCommentsProps {
  comments: Comment[]
  currentUser: {
    avatar: string
  }
  onCommentSubmit: (content: string) => Promise<void>
  onReplySubmit: (commentId: string, content: string) => Promise<void>
  onLike: (commentId: string) => void
  onDislike: (commentId: string) => void
}

// 单个评论项组件Props接口
interface CommentItemProps {
  comment: Comment
  onReply: (commentId: string, content: string) => Promise<void>
  onLike: (commentId: string) => void
  onDislike: (commentId: string) => void
  depth?: number
}

// 单个评论项组件，支持嵌套回复
const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onLike,
  onDislike,
  depth = 0,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 提交回复
  const handleReplySubmit = async () => {
    if (!replyContent.trim() || submitting) return

    try {
      setSubmitting(true)
      await onReply(comment.id, replyContent)
      setReplyContent('')
      setShowReplyInput(false)
    } catch (err) {
      console.error('Failed to submit reply:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // 根据深度确定头像大小
  const avatarSize = depth === 0 ? 'w-10 h-10' : depth === 1 ? 'w-8 h-8' : 'w-6 h-6'
  const textSize = depth === 0 ? 'text-base' : depth === 1 ? 'text-sm' : 'text-xs'
  const padding = depth === 0 ? 'p-4' : depth === 1 ? 'p-3' : 'p-2'

  return (
    <div className="flex space-x-4">
      <img
        alt={`${comment.userName} avatar`}
        className={`${avatarSize} rounded-full flex-shrink-0`}
        src={comment.userAvatar}
      />
      <div className="flex-1">
        {/* 评论卡片 */}
        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg">
          <div className={padding}>
            <div className="flex justify-between items-center">
              <span className={`font-semibold text-gray-900 dark:text-white ${textSize}`}>
                {comment.userName}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {comment.timestamp}
              </span>
            </div>
            <p className={`mt-2 text-gray-800 dark:text-gray-300 ${textSize}`}>
              {comment.content}
            </p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <button
            onClick={() => onLike(comment.id)}
            className="flex items-center space-x-1 hover:text-primary transition"
          >
            <span className="material-icons text-base">thumb_up_off_alt</span>
            <span>{comment.likes}</span>
          </button>
          <button
            onClick={() => onDislike(comment.id)}
            className="flex items-center space-x-1 hover:text-primary transition"
          >
            <span className="material-icons text-base">thumb_down_off_alt</span>
            <span>{comment.dislikes}</span>
          </button>
          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="hover:text-primary transition"
          >
            Reply
          </button>
        </div>

        {/* 回复输入框 */}
        {showReplyInput && (
          <div className="mt-4">
            <textarea
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="写下你的回复..."
              rows={2}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => {
                  setShowReplyInput(false)
                  setReplyContent('')
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition"
              >
                取消
              </button>
              <button
                onClick={handleReplySubmit}
                disabled={!replyContent.trim() || submitting}
                className="bg-primary text-gray-900 px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '发表中...' : '发表回复'}
              </button>
            </div>
          </div>
        )}

        {/* 嵌套回复 */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 ml-4 mt-4 space-y-4">
            {comment.replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onLike={onLike}
                onDislike={onDislike}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// 影片评论组件，展示评论列表和评论输入
export const MovieComments: React.FC<MovieCommentsProps> = ({
  comments,
  currentUser,
  onCommentSubmit,
  onReplySubmit,
  onLike,
  onDislike,
}) => {
  const [commentContent, setCommentContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 提交评论
  const handleCommentSubmit = async () => {
    if (!commentContent.trim() || submitting) return

    try {
      setSubmitting(true)
      await onCommentSubmit(commentContent)
      setCommentContent('')
    } catch (err) {
      console.error('Failed to submit comment:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">评论</h2>

      {/* 评论输入框 */}
      <div className="flex space-x-4">
        <img
          alt="Current user avatar"
          className="w-10 h-10 rounded-full flex-shrink-0"
          src={currentUser.avatar}
        />
        <div className="flex-1">
          <textarea
            value={commentContent}
            onChange={e => setCommentContent(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="写下你的评论..."
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleCommentSubmit}
              disabled={!commentContent.trim() || submitting}
              className="bg-primary text-gray-900 px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '发表中...' : '发表评论'}
            </button>
          </div>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="space-y-6">
        {comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={onReplySubmit}
            onLike={onLike}
            onDislike={onDislike}
          />
        ))}
      </div>
    </div>
  )
}
