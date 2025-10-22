/**
 * @fileoverview 首页组件
 * @description 首页主组件，包含导航栏、英雄区块和各种内容区块的完整首页布局
 *              使用重构后的数据Hook和统一数据转换API，支持影片合集、写真、
 *              最新更新和热门内容的展示，具备动态背景效果和响应式布局
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import {
  CollectionSection,
  PhotoSection,
  LatestUpdateSection,
  HotSection,
} from '@components/domains'
import { NavigationHeader, HeroSection } from '@components/organisms'
import { useHomeData } from '@data/home/homeData'
import { ROUTES } from '@presentation/router/routes'
import { toUnifiedContentItem } from '@types-movie'
import { toCollectionItems, toPhotoItems, toLatestItems, toHotItems } from '@utils/data-converters'
import React, { useEffect, useRef, useMemo } from 'react'


// 首页主组件，包含导航栏、英雄区块和各种内容区块的完整首页布局
const HomePage: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  // 获取首页数据 - 使用重构后的数据Hook
  const { photos, latestUpdates, hotDaily, collections, isLoading, error } =
    useHomeData()

  // 调试日志 - 输出数据获取情况用于开发调试
  console.log('HomePage - collections:', collections)
  console.log('HomePage - collections length:', collections?.length)
  console.log('HomePage - photos:', photos)
  console.log('HomePage - photos length:', photos?.length)

  // 数据转换处理 - 使用统一数据转换API，将所有数据转换为统一格式
  // 影片合集数据处理 - 转换为CollectionItem格式并缓存
  const processedCollections = useMemo(() => {
    console.log('🔍 [HomePage] Processing collections:', {
      length: collections?.length || 0,
      data: collections
    })
    
    if (!collections || collections.length === 0) {
      console.log('⚠️ [HomePage] collections is empty or undefined')
      return []
    }
    
    const unifiedData = collections.map(toUnifiedContentItem)
    console.log('🔄 [HomePage] Unified collections:', {
      length: unifiedData.length,
      data: unifiedData
    })
    
    const result = toCollectionItems(unifiedData)
    console.log('✅ [HomePage] Final processedCollections:', {
      length: result.length,
      data: result
    })
    
    return result
  }, [collections])

  // 写真数据处理 - 转换为PhotoItem格式并缓存
  const processedPhotos = useMemo(() => {
    console.log('🔍 [HomePage] Processing photos:', {
      length: photos?.length || 0,
      data: photos
    })
    
    if (!photos || photos.length === 0) {
      console.log('⚠️ [HomePage] photos is empty or undefined')
      return []
    }
    
    const unifiedData = photos.map(toUnifiedContentItem)
    console.log('🔄 [HomePage] Unified photos:', {
      length: unifiedData.length,
      data: unifiedData
    })
    
    const result = toPhotoItems(unifiedData)
    console.log('✅ [HomePage] Final processedPhotos:', {
      length: result.length,
      data: result
    })
    
    return result
  }, [photos])

  // 最新更新数据处理 - 转换为LatestItem格式并缓存
  const processedLatestUpdates = useMemo(() => {
    const unifiedData = (latestUpdates || []).map(toUnifiedContentItem)
    return toLatestItems(unifiedData)
  }, [latestUpdates])

  // 热门内容数据处理 - 转换为HotItem格式并缓存
  const processedHotDaily = useMemo(() => {
    const unifiedData = (hotDaily || []).map(toUnifiedContentItem)
    return toHotItems(unifiedData)
  }, [hotDaily])

  // Header动态背景效果 - 实现滚动时导航栏背景透明度变化，与HTML设计稿保持一致
  useEffect(() => {
    const header = headerRef.current
    const hero = heroRef.current

    if (!header || !hero) return

    const defaultClasses =
      'bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm'
    const transparentClasses = 'bg-transparent backdrop-blur-0'

    const updateHeader = () => {
      const heroBottom = hero.getBoundingClientRect().bottom
      if (heroBottom <= 0) {
        // 超出英雄区域时 - 显示模糊背景
        header.classList.remove(...transparentClasses.split(' '))
        header.classList.add(...defaultClasses.split(' '))
      } else {
        // 在英雄区域内时 - 保持透明背景
        header.classList.remove(...defaultClasses.split(' '))
        header.classList.add(...transparentClasses.split(' '))
      }
    }

    // 初始化Header状态 - 设置为透明背景
    header.classList.add(...transparentClasses.split(' '))

    // 添加滚动事件监听器
    window.addEventListener('scroll', updateHeader)

    // 初始检查 - 立即执行一次背景状态更新
    updateHeader()

    // 清理函数 - 移除事件监听器
    return () => {
      window.removeEventListener('scroll', updateHeader)
    }
  }, [])

  return (
    <div className="min-h-screen">
      <NavigationHeader ref={headerRef} />

      <main className="pt-16">
        <HeroSection ref={heroRef} />

        <div className="container mx-auto space-y-12 px-4 py-12 sm:px-6 lg:px-8">
          {/* 首页影片合集区块 - 展示精选影片合集内容 */}
          <CollectionSection
            data={processedCollections}
            showMoreLink={true}
            moreLinkUrl={ROUTES.SPECIAL.COLLECTIONS}
          />

          {/* 首页写真区块 - 展示写真内容，支持VIP标识和新片标识 */}
          <PhotoSection
            data={processedPhotos}
            showMoreLink={true}
            cardConfig={{
              showNewBadge: true,
              showVipBadge: true,
              showQualityBadge: true,
              showRatingBadge: false,
              aspectRatio: 'portrait',
              hoverEffect: true,
            }}
          />

          {/* 首页最近更新区块 - 展示最新更新的影片内容 */}
          <LatestUpdateSection
            data={processedLatestUpdates}
            showMoreLink={true}
          />

          {/* 首页24小时热门区块 - 展示热门影片内容 */}
          <HotSection
            movies={processedHotDaily}
            showViewMore={true}
          />
        </div>
      </main>
    </div>
  )
}

export default HomePage
