/**
 * @fileoverview 合集列表页面组件
 * @description 合集列表页面主组件，展示所有精选合集，采用卡片式网格布局
 *              支持分页浏览、合集点击交互、响应式布局等功能，使用MockDataService
 *              提供统一的数据源和图片服务处理，确保最佳的用户体验和性能表现
 *
 * @author MovieFront Team
 * @version 1.0.0
 * @since 2025-01-01
 *
 * @example
 * ```tsx
 * import SpecialCollectionsPage from '@pages/special/SpecialCollectionsPage'
 * 
 * function App() {
 *   return <SpecialCollectionsPage />
 * }
 * ```
 */

import { HomeApplicationService } from '@application/services/HomeApplicationService'
import { CollectionList, type CollectionItem } from '@components/domains'
import { NavigationHeader } from '@components/organisms'
import { useImageService } from '@presentation/hooks/image'
import { RESPONSIVE_CONFIGS } from '@tokens/responsive-configs'
import React, { useState, useMemo } from 'react'

// 生成合集数据的自定义Hook - 使用MockDataService的统一数据源，模拟真实的后端数据获取
const useSpecialCollections = () => {
  const { getCollectionCover } = useImageService()

  // 获取合集数据 - 使用MockDataService的统一数据源并应用图片服务处理
  const collections = useMemo(() => {
    const { MockDataService } = require('@application/services/MockDataService')
    const mockDataService = MockDataService.getInstance()
    const mockCollections = mockDataService.generateMockCollections(120)

    // 图片URL处理 - 使用图片服务优化加载和显示
    return mockCollections.map((collection: any) => ({
      ...collection,
      imageUrl: getCollectionCover(collection.imageUrl, { width: 400, height: 500 }),
    }))
  }, [getCollectionCover])

  return collections
}

// 合集列表页面组件 - 展示所有精选合集，支持分页和交互功能
const SpecialCollectionsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)

  // 获取合集数据 - 使用重构后的数据Hook
  const collections = useSpecialCollections()

  // 分页配置 - 每页显示的合集数量
  const ITEMS_PER_PAGE = 12

  // 计算总页数 - 根据数据总数动态计算
  const totalPages = Math.ceil(collections.length / ITEMS_PER_PAGE)

  // 页面切换处理 - 验证页码有效性并更新状态
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // 合集点击处理 - 输出合集信息用于调试
  const handleCollectionClick = (collection: CollectionItem) => {
    console.log('点击合集:', collection.id)
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <NavigationHeader />

      <main className="container mx-auto px-4 pb-8 pt-24 sm:px-6 lg:px-8">
        <CollectionList
          collections={collections}
          title="合集列表"
          pagination={{
            currentPage,
            totalPages,
            onPageChange: handlePageChange,
            itemsPerPage: ITEMS_PER_PAGE,
          }}
          onCollectionClick={handleCollectionClick}
          variant="grid"
          cardConfig={{
            hoverEffect: true,
            aspectRatio: 'portrait',
            showVipBadge: true,
          }}
          columns={RESPONSIVE_CONFIGS.specialPage}
        />
      </main>
    </div>
  )
}

export default SpecialCollectionsPage
