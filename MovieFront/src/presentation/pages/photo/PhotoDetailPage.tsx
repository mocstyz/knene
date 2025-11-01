/**
 * @fileoverview 写真详情页面组件
 * @description 写真详情页面主组件，展示写真的详细信息包括基本信息、图片集合、评论等内容
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { usePhotoDetail } from '@application/hooks/usePhotoDetail'
import { useMovieComments } from '@application/hooks/useMovieComments'
import { NavigationHeader } from '@components/organisms'
import { PhotoHeroSection } from '@components/domains/photo/PhotoHeroSection'
import { MovieResourceInfo } from '@components/domains/movie/MovieResourceInfo'
import { MovieScreenshots } from '@components/domains/movie/MovieScreenshots'
import { MovieComments } from '@components/domains/movie/MovieComments'
import { ReportModal } from '@components/domains/movie/ReportModal'
import { SkeletonHero, SkeletonCard, SkeletonDetail } from '@components/atoms'

// 写真详情页面组件
const PhotoDetailPage: React.FC = () => {
  const { id: photoId } = useParams<{ id: string }>()
  const location = useLocation()

  // 从路由状态获取图片URL（如果有的话）
  const stateImageUrl = (location.state as { imageUrl?: string })?.imageUrl

  const {
    photo,
    loading: photoLoading,
    error: photoError,
    refresh: refreshPhoto,
    toggleFavorite,
    incrementThankYou,
  } = usePhotoDetail(photoId || '')

  const {
    comments,
    loading: commentsLoading,
    submitComment,
    submitReply,
    likeComment,
    dislikeComment,
  } = useMovieComments(photoId || '')

  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false)

  // 下载按钮处理
  const handleDownload = () => {
    console.log('Download photo:', photoId)
  }

  // 举报按钮处理
  const handleReport = () => {
    setIsReportModalOpen(true)
  }

  // 提交举报
  const handleReportSubmit = async (reason: string, description: string) => {
    console.log('Report submitted:', { photoId, reason, description })
    // TODO: 调用API提交举报
  }

  // 错误状态处理
  if (photoError) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <NavigationHeader />
        <main className="container mx-auto px-4 pb-8 pt-24 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                加载失败
              </h2>
              <p className="text-text-secondary mb-6">{photoError}</p>
              <button
                onClick={refreshPhoto}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                重新加载
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // 加载状态处理
  if (photoLoading || !photo) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <NavigationHeader />
        <SkeletonHero />
        <main className="container mx-auto px-4 pb-8 pt-24 sm:px-6 lg:px-8">
          <SkeletonCard />
          <SkeletonDetail />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <NavigationHeader />

      {/* Hero区域 */}
      <PhotoHeroSection
        photo={{
          id: photo.id,
          title: photo.title,
          year: photo.year,
          imageUrl: stateImageUrl || photo.imageUrl,
        }}
        onDownload={handleDownload}
        onThankYou={incrementThankYou}
        thankYouCount={photo.thankYouCount || 0}
        isThankYouActive={photo.isThankYouActive || false}
      />

      {/* 主内容区域 */}
      <div className="container mx-auto p-8 relative z-10 -mt-24">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 space-y-8">
          {/* 资源信息 */}
          {photo.resource && (
            <MovieResourceInfo
              resource={photo.resource}
              isFavorited={photo.isFavorited || false}
              onFavoriteToggle={toggleFavorite}
              onReport={handleReport}
            />
          )}

          {/* 写真图片 */}
          {photo.screenshots && photo.screenshots.length > 0 && (
            <MovieScreenshots 
              screenshots={photo.screenshots} 
              title="写真图片"
            />
          )}

          {/* 评论系统 */}
          <MovieComments
            comments={comments}
            currentUser={{
              avatar:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDTEqR1YQqerF5AOEqMhsLZEhx7X3qpkwWHaFihPsgdANEIU9xlzXEidjxxUzTFmLfEBdnbJR9RPASUfRrxoNIDT56Me2T3FSY_AcdKAqTFVcIa56OBe8ihk50aoEsj2zY7gQX5Uh0fCSSPYjpgR6yYfGdzzghlqO9Q8lO_QTEbAyCcou5Pn6aqUdjiEqA0j5AQXac6GQXOWydrLISNhlsBy-5bLcLY9KJH2YflHryVQhIV7jVOQwF29_8Y0COBwiGK1MmUOkZQVUg',
            }}
            onCommentSubmit={submitComment}
            onReplySubmit={submitReply}
            onLike={likeComment}
            onDislike={dislikeComment}
          />
        </div>
      </div>

      {/* 举报弹窗 */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  )
}

export default PhotoDetailPage
