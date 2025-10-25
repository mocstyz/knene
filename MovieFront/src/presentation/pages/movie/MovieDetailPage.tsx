/**
 * @fileoverview 影片详情页面组件
 * @description 影片详情页面主组件，展示影片的详细信息包括基本信息、演员阵容、
 *              剧情简介、评分评论、相关推荐等内容，支持在线播放和下载功能
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useMovieDetail } from '@application/hooks/useMovieDetail'
import { useMovieComments } from '@application/hooks/useMovieComments'
import { useSubtitleModal } from '@application/hooks/useSubtitleModal'
import { NavigationHeader } from '@components/organisms'
import { MovieHeroSection } from '@components/domains/movie/MovieHeroSection'
import { MovieResourceInfo } from '@components/domains/movie/MovieResourceInfo'
import { MovieFileInfo } from '@components/domains/movie/MovieFileInfo'
import { MovieScreenshots } from '@components/domains/movie/MovieScreenshots'
import { MovieComments } from '@components/domains/movie/MovieComments'
import { SubtitleDownloadModal } from '@components/domains/movie/SubtitleDownloadModal'
import { ReportModal } from '@components/domains/movie/ReportModal'
import { SkeletonHero, SkeletonCard, SkeletonDetail } from '@components/atoms'

// 影片详情页面组件，展示影片完整信息和相关功能
const MovieDetailPage: React.FC = () => {
  const { id: movieId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  
  // 从路由状态获取图片URL（如果有的话）
  const stateImageUrl = (location.state as { imageUrl?: string })?.imageUrl

  // 页面加载时滚动到顶部
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const {
    movie,
    loading: movieLoading,
    error: movieError,
    refresh: refreshMovie,
    toggleFavorite,
    incrementThankYou,
  } = useMovieDetail(movieId || '')

  const {
    comments,
    loading: commentsLoading,
    submitComment,
    submitReply,
    likeComment,
    dislikeComment,
  } = useMovieComments(movieId || '')

  const {
    isOpen: isSubtitleModalOpen,
    sources: subtitleSources,
    open: openSubtitleModal,
    close: closeSubtitleModal,
  } = useSubtitleModal()

  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false)

  // 下载按钮处理
  const handleDownload = () => {
    console.log('Download movie:', movieId)
  }

  // 举报按钮处理
  const handleReport = () => {
    setIsReportModalOpen(true)
  }

  // 提交举报
  const handleReportSubmit = async (reason: string, description: string) => {
    console.log('Report submitted:', { movieId, reason, description })
    // TODO: 调用API提交举报
  }

  // 错误状态处理
  if (movieError) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <NavigationHeader />
        <main className="container mx-auto px-4 pb-8 pt-24 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                加载失败
              </h2>
              <p className="text-text-secondary mb-6">{movieError}</p>
              <button
                onClick={refreshMovie}
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
  if (movieLoading || !movie) {
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
      <MovieHeroSection
        movie={{
          id: movie.id,
          title: movie.title,
          year: movie.year || 2019,
          imageUrl: stateImageUrl || movie.imageUrl, // 优先使用路由传递的图片URL
          rating: movie.rating,
          votes: movie.votes || 0,
          imdbRating: movie.imdbRating,
          tmdbRating: movie.tmdbRating,
          description: movie.description || '',
          cast: movie.cast || [],
        }}
        onDownload={handleDownload}
        onSubtitleClick={openSubtitleModal}
        onThankYou={incrementThankYou}
        thankYouCount={movie.thankYouCount || 0}
        isThankYouActive={movie.isThankYouActive || false}
      />

      {/* 主内容区域 */}
      <div className="container mx-auto p-8 relative z-10 -mt-24">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 space-y-8">
          {/* 资源信息 */}
          {movie.resource && (
            <MovieResourceInfo
              resource={movie.resource}
              isFavorited={movie.isFavorited || false}
              onFavoriteToggle={toggleFavorite}
              onReport={handleReport}
            />
          )}

          {/* 文件信息 */}
          {movie.fileInfo && <MovieFileInfo fileInfo={movie.fileInfo} />}

          {/* 影片截图 */}
          {movie.screenshots && movie.screenshots.length > 0 && (
            <MovieScreenshots screenshots={movie.screenshots} />
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

      {/* 字幕下载弹窗 */}
      <SubtitleDownloadModal
        isOpen={isSubtitleModalOpen}
        sources={subtitleSources}
        onClose={closeSubtitleModal}
      />

      {/* 举报弹窗 */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  )
}

export default MovieDetailPage
