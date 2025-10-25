/**
 * @fileoverview 专题合集列表页面组件
 * @description 专题合集列表页面主组件，展示所有精选合集，采用卡片式网格布局
 *              支持分页浏览、合集点击交互、响应式布局等功能，遵循DDD架构原则，
 *              通过应用服务层获取数据，提供统一的数据源和图片服务处理，确保最佳的用户体验和性能表现
 *
 * @author MovieFront Team
 * @version 2.0.0
 * @since 2025-01-01
 */

import { useSpecialCollections } from '@application/hooks/useSpecialCollections'
import { CollectionList, type CollectionItem } from '@components/domains'
import { Pagination, SkeletonListPage } from '@components/atoms'
import { NavigationHeader } from '@components/organisms'
import { RESPONSIVE_CONFIGS } from '@tokens/responsive-configs'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 专题合集列表页面组件 - 展示所有精选合集,支持分页和交互功能
const SpecialCollectionsPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)

  // 分页配置 - 每页显示的合集数量
  const ITEMS_PER_PAGE = 12

  // 获取专题合集数据 - 使用标准化Hook，遵循DDD架构
  const { collections, loading, error, total, refresh, updateOptions, isPageChanging } = useSpecialCollections({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    sortBy: 'latest',
    autoLoad: true,
    enableImageOptimization: true
  })

  // 计算总页数 - 根据数据总数动态计算
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  // 平滑滚动到页面顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // 页面切换处理 - 更新查询选项以获取对应页面的数据
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page)
      updateOptions({ page })
      scrollToTop()
    }
  }

  // 合集点击处理 - 跳转到合集详情页
  const handleCollectionClick = (collection: CollectionItem) => {
    console.log('🎬 [SpecialCollectionsPage] 点击合集:', {
      id: collection.id,
      title: collection.title,
      type: collection.type
    })
    navigate(`/collection/${collection.id}`)
  }

  // 加载状态处理 - 初次加载或分页切换时显示骨架屏
  if (loading && collections.length === 0) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <NavigationHeader />
        <SkeletonListPage
          cardCount={ITEMS_PER_PAGE}
          columns={RESPONSIVE_CONFIGS.specialPage}
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
        <CollectionList
          collections={collections}
          title="专题合集"
          loading={loading}
          isPageChanging={isPageChanging}
          onCollectionClick={handleCollectionClick}
          variant="grid"
          cardConfig={{
            hoverEffect: true,
            aspectRatio: 'portrait',
            showVipBadge: true,
          }}
          columns={RESPONSIVE_CONFIGS.specialPage}
        />

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

export default SpecialCollectionsPage
