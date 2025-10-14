/**
 * 专题列表页面
 * 展示所有精选专题合集，采用卡片式网格布局
 */

import { TopicList } from '@components/domains'
import { NavigationHeader } from '@components/organisms'
import { useImageService } from '@presentation/hooks/image'
import React, { useState } from 'react'

/**
 * 配置化专题标题生成函数
 * @param category 专题分类名称
 * @param pageNum 页码
 * @param itemIndex 当前页的项目索引
 * @returns 格式化的专题标题
 */
const generateTopicTitle = (
  category: string,
  pageNum: number,
  itemIndex: number
): string => {
  return `${category} - 第${pageNum}页-${itemIndex + 1}`
}

/**
 * 生成专题数据的Hook
 * 使用配置化图片服务替换硬编码URL
 */
const useSpecialCollections = () => {
  const { getTopicCover } = useImageService()

  // 专题数据生成
  const topics = (() => {
    const topicsArray = []
    const categories = [
      'Modern Architecture',
      'Abstract Art',
      'Nature Photography',
      'Urban Landscapes',
      'Portrait Photography',
      'Still Life',
      'Wildlife Safari',
      'Street Photography',
      'Fine Art Nudes',
      'Landscape Masters',
      'Black & White',
      'Digital Art',
      'Cinematic Masterpieces',
      'Nature Documentary',
      'Travel Photography',
      'Food Photography',
      'Fashion Photography',
      'Sports Photography',
      'Architecture Photography',
      'Night Photography',
      'Macro Photography',
      'Aerial Photography',
    ]

    const descriptions = [
      '探索当代建筑的简约美学',
      '色彩与形状的视觉交响曲',
      '大自然的壮美瞬间定格',
      '城市风光的现代诠释',
      '人物情感的艺术捕捉',
      '静物的诗意美学',
      '野生动物的自然栖息地',
      '城市街头的人文故事',
      '人体艺术的美学探索',
      '风景摄影的经典之作',
      '黑白摄影的艺术魅力',
      '数字艺术的无限可能',
      '电影史上的经典之作',
      '自然世界的精彩记录',
      '旅行摄影的精彩世界',
      '美食摄影的诱人魅力',
      '时尚摄影的潮流趋势',
      '体育摄影的动感瞬间',
      '建筑摄影的空间美学',
      '夜景摄影的神秘魅力',
      '微距摄影的细节世界',
      '航拍摄影的壮丽视角',
    ]

    // 生成120个专题数据（10页）
    for (let i = 0; i < 120; i++) {
      const categoryIndex = i % categories.length
      const pageNum = Math.floor(i / 12) + 1

      topicsArray.push({
        id: `${i + 1}`,
        title: generateTopicTitle(categories[categoryIndex], pageNum, i % 12), // 使用配置化函数
        imageUrl: getTopicCover(`collection${i}`, { width: 400, height: 500 }),
        description: descriptions[categoryIndex],
        type: 'Movie' as const,
        isNew: true, // 添加new标识
        newType: 'new' as const, // 添加new类型
      })
    }

    return topicsArray
  })()

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
  const handleTopicClick = (topic: any) => {
    console.log('点击专题:', topic.id)
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <NavigationHeader />

      <main className="container mx-auto px-4 pb-8 pt-24 sm:px-6 lg:px-8">
        <TopicList
          topics={topics}
          title="专题列表"
          pagination={{
            currentPage,
            totalPages,
            onPageChange: handlePageChange,
            itemsPerPage: ITEMS_PER_PAGE,
          }}
          onTopicClick={handleTopicClick}
          variant="grid"
          hoverEffect={true}
          showHoverOverlay={true}
          columns={{ sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6 }}
        />
      </main>
    </div>
  )
}

export default SpecialCollectionsPage
