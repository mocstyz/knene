/**
 * 专题列表页面
 * 展示所有精选专题合集，采用卡片式网格布局
 * 使用HomeApplicationService的mock数据，模拟真实后端数据结构
 */

import { HomeApplicationService } from '@application/services/HomeApplicationService'
import { CollectionList, type CollectionItem } from '@components/domains'
import { NavigationHeader } from '@components/organisms'
import { useImageService } from '@presentation/hooks/image'
import { RESPONSIVE_CONFIGS } from '@tokens/responsive-configs'
import React, { useState, useMemo } from 'react'

/**
 * 生成专题数据的Hook
 * 使用MockDataService的统一数据源，模拟真实的后端数据获取
 */
const useSpecialCollections = () => {
  const { getTopicCover } = useImageService()

  // 使用MockDataService的统一数据源
  const topics = useMemo(() => {
    const { MockDataService } = require('@application/services/MockDataService')
    const mockDataService = MockDataService.getInstance()
    const mockTopics = mockDataService.generateMockCollections(120)
    
    // 处理图片URL，使用图片服务
    return mockTopics.map((topic: any) => ({
      ...topic,
      imageUrl: getTopicCover(topic.imageUrl, { width: 400, height: 500 }),
    }))
  }, [getTopicCover])

  return topics
}

const SpecialCollectionsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)

  // 使用重构后的数据Hook
  const topics = useSpecialCollections()

  // 每页显示的专题数量
  const ITEMS_PER_PAGE = 12

  // 根据数据总数动态计算总页数
  const totalPages = Math.ceil(topics.length / ITEMS_PER_PAGE)

  // 处理页面切换
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // 处理专题点击事件
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
