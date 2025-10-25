/**
 * @fileoverview 合集影片列表页面组件
 * @description 展示指定合集包含的所有影片，采用卡片式网格布局
 *              支持分页浏览、影片点击交互、响应式布局等功能，遵循DDD架构原则
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCollectionMovies } from '../../../application/hooks/useCollectionMovies'
import { NavigationHeader } from '@components/organisms'
import { BaseSection, BaseList } from '@components/domains/shared'
import { MovieLayer } from '@components/domains/latestupdate/components'
import { Pagination, SkeletonListPage } from '@components/atoms'
import { RESPONSIVE_CONFIGS } from '@tokens/responsive-configs'
import type { MovieDetail } from '@types-movie'

// 合集影片列表页面组件
const CollectionDetailPage: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 12

  // 页面加载时滚动到顶部
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // 获取合集影片数据
  const {
    movies,
    collectionInfo,
    loading,
    error,
    total,
    refresh,
    updateOptions,
    isPageChanging
  } = useCollectionMovies({
    collectionId: collectionId || '',
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    autoLoad: true,
    enableImageOptimization: true
  })

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  // 平滑滚动到页面顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // 页面切换处理
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page)
      updateOptions({ page })
      scrollToTop()
    }
  }

  // 影片点击处理
  const handleMovieClick = (movie: MovieDetail) => {
    console.log('🎬 [CollectionDetailPage] 点击影片:', {
      id: movie.id,
      title: movie.title,
      imageUrl: movie.imageUrl
    })
    // 通过路由状态传递图片URL
    navigate(`/movie/${movie.id}`, {
      state: { imageUrl: movie.imageUrl }
    })
  }

  // 加载状态处理 - 初次加载或分页切换时显示骨架屏
  if (loading && movies.length === 0) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <NavigationHeader />
        <SkeletonListPage
          cardCount={ITEMS_PER_PAGE}
          columns={RESPONSIVE_CONFIGS.latestUpdate}
          aspectRatio="portrait"
        />
      </div>
    )
  }

  // 错误状态处理
  if (error) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <NavigationHeader />
        <main className="container mx-auto px-4 pb-8 pt-24 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-text-primary mb-4">加载失败</h2>
              <p className="text-text-secondary mb-6">{error}</p>
              <button
                onClick={refresh}
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

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <NavigationHeader />

      <main className="container mx-auto px-4 pb-8 pt-24 sm:px-6 lg:px-8">
        <BaseSection
          title={collectionInfo?.title || '合集影片'}
          showMoreLink={false}
        >
          <BaseList<MovieDetail>
            items={movies}
            loading={loading}
            isPageChanging={isPageChanging}
            columns={RESPONSIVE_CONFIGS.latestUpdate}
            renderItem={(movie: MovieDetail) => (
              <MovieLayer
                movie={{
                  id: movie.id,
                  title: movie.title,
                  poster: movie.imageUrl,
                  rating: typeof movie.rating === 'string' ? parseFloat(movie.rating) : movie.rating,
                  quality: movie.quality,
                  genres: movie.genres,
                  alt: movie.alt
                }}
                variant="default"
                onPlay={() => handleMovieClick(movie)}
                showHover={true}
                showVipBadge={true}
                showQualityBadge={true}
                showRatingBadge={true}
                showNewBadge={true}
                newBadgeType="latest"
                qualityText={movie.quality}
              />
            )}
          />

        </BaseSection>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          mode="full"
          variant="default"
          size="md"
          showPageInfo={false}
          loading={loading}
          disabled={isPageChanging}
        />
      </main>
    </div>
  )
}

export default CollectionDetailPage
