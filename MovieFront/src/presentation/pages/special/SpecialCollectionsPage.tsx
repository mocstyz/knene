/**
 * @fileoverview 专题列表页面组件
 * @description 专题列表页面主组件，展示所有精选专题合集，采用卡片式网格布局
 *              支持分页浏览、专题点击交互、响应式布局等功能，使用MockDataService
 *              的统一数据源，模拟真实的后端数据结构和交互体验
 * @created 2025-10-15 23:06:53
 * @updated 2025-10-21 15:17:14
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { HomeApplicationService } from '@application/services/HomeApplicationService'
import { CollectionList, type CollectionItem } from '@components/domains'
import { NavigationHeader } from '@components/organisms'
import { useImageService } from '@presentation/hooks/image'
import { RESPONSIVE_CONFIGS } from '@tokens/responsive-configs'
import React, { useState, useMemo } from 'react'

// 生成专题数据的自定义Hook - 使用MockDataService的统一数据源，模拟真实的后端数据获取
const useSpecialCollections = () => {
  const { getTopicCover } = useImageService()

  // 获取专题数据 - 使用MockDataService的统一数据源并应用图片服务处理
  const topics = useMemo(() => {
    const { MockDataService } = require('@application/services/MockDataService')
    const mockDataService = MockDataService.getInstance()
    const mockTopics = mockDataService.generateMockCollections(120)

    // 图片URL处理 - 使用图片服务优化加载和显示
    return mockTopics.map((topic: any) => ({
      ...topic,
      imageUrl: getTopicCover(topic.imageUrl, { width: 400, height: 500 }),
    }))
  }, [getTopicCover])

  return topics
}

// 专题列表页面组件 - 展示所有精选专题合集，支持分页和交互功能
const SpecialCollectionsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)

  // 获取专题数据 - 使用重构后的数据Hook
  const topics = useSpecialCollections()

  // 分页配置 - 每页显示的专题数量
  const ITEMS_PER_PAGE = 12

  // 计算总页数 - 根据数据总数动态计算
  const totalPages = Math.ceil(topics.length / ITEMS_PER_PAGE)

  // 页面切换处理 - 验证页码有效性并更新状态
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // 专题点击处理 - 输出专题信息用于调试
  const handleTopicClick = (topic: CollectionItem) => {
    console.log('点击专题:', topic.id)
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <NavigationHeader />

      <main className="container mx-auto px-4 pb-8 pt-24 sm:px-6 lg:px-8">
        <CollectionList
          collections={topics}
          title="专题列表"
          pagination={{
            currentPage,
            totalPages,
            onPageChange: handlePageChange,
            itemsPerPage: ITEMS_PER_PAGE,
          }}
          onCollectionClick={handleTopicClick}
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
