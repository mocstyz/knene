/**
 * @fileoverview 最新更新列表页面组件
 * @description 最新更新列表页面主组件，展示所有最新更新的混合内容（影片/写真/合集），采用卡片式网格布局，支持分页浏览和点击跳转详情
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { useLatestUpdateList } from '@application/hooks/useLatestUpdateList'
import { MixedContentList } from '@components/domains/shared'
import { Pagination, SkeletonListPage } from '@components/atoms'
import { NavigationHeader } from '@components/organisms'
import { RESPONSIVE_CONFIGS } from '@tokens/responsive-configs'
import { navigateToContentDetail } from '@utils/navigation-helpers'
import type { BaseContentItem } from '@components/domains/shared/content-renderers'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 最新更新列表页面组件,展示所有最新更新的混合内容并支持分页
const LatestUpdateListPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)

  // 分页配置
  const ITEMS_PER_PAGE = 12

  // 获取最新更新数据
  const { items, loading, error, total, refresh, updateOptions, isPageChanging } = useLatestUpdateList({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    sortBy: 'latest',
    autoLoad: true,
    enableImageOptimization: true
  })

  // 计算总页数
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

  // 内容点击处理
  const handleContentClick = (item: BaseContentItem) => {
    console.log('🔄 [LatestUpdateListPage] 点击内容:', {
      id: item.id,
      title: item.title,
      contentType: item.contentType
    })
    navigateToContentDetail(item, navigate)
  }

  // 加载状态处理 - 初次加载或分页切换时显示骨架屏
  if (loading && items.length === 0) {
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
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">最新更新</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            共 {total} 个内容
          </p>
        </div>

        {/* 混合内容列表 */}
        <MixedContentList
          items={items}
          onItemClick={handleContentClick}
          variant="grid"
          columns={RESPONSIVE_CONFIGS.latestUpdate}
          defaultRendererConfig={{
            hoverEffect: true,
            aspectRatio: 'portrait',
            showVipBadge: true,
            showNewBadge: true,
            showQualityBadge: true,
            showRatingBadge: true,
          }}
          loading={loading}
          error={error}
          onRetry={refresh}
        />

        {/* 分页器 */}
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

export default LatestUpdateListPage
