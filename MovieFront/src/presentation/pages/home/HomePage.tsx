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
import { navigateToContentDetail } from '../../../utils/navigation-helpers'
import type { BaseContentItem } from '@components/domains/shared/content-renderers'
import React, { useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'


// 首页主组件，包含导航栏、英雄区块和各种内容区块的完整首页布局
const HomePage: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  // 获取首页数据 - 使用重构后的数据Hook
  const { photos, latestUpdates, hotDaily, collections } = useHomeData()

  // 统一的内容项点击处理器
  const handleContentClick = (item: BaseContentItem) => {
    navigateToContentDetail(item, navigate)
  }

  // 合集点击处理器（使用统一的handleContentClick）
  const handleCollectionClick = (collection: any) => {
    handleContentClick(collection)
  }

  // 写真点击处理器（使用统一的handleContentClick）
  const handlePhotoClick = (photo: any) => {
    handleContentClick(photo)
  }

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



  return (
    <div className="min-h-screen">
      <NavigationHeader ref={headerRef} transparentMode={true} />

      <main className="pt-16">
        <HeroSection ref={heroRef} />

        <div className="container mx-auto space-y-12 px-4 py-12 sm:px-6 lg:px-8">
          {/* 首页影片合集区块 - 展示精选影片合集内容 */}
          <CollectionSection
            data={processedCollections}
            showMoreLink={true}
            moreLinkUrl={ROUTES.SPECIAL.COLLECTIONS}
            onCollectionClick={handleCollectionClick}
          />

          {/* 首页写真区块 - 展示写真内容，支持VIP标识和新片标识 */}
          <PhotoSection
            data={processedPhotos}
            showMoreLink={true}
            moreLinkUrl={ROUTES.PHOTO.LIST}
            onPhotoClick={handlePhotoClick}
            cardConfig={{
              showNewBadge: true,
              showVipBadge: true,
              showQualityBadge: true,
              showRatingBadge: false,
              aspectRatio: 'portrait',
              hoverEffect: true,
            }}
          />

          {/* 首页最近更新区块 - 展示最新更新的影片内容（混合类型：影片、写真、合集） */}
          <LatestUpdateSection
            data={processedLatestUpdates}
            showMoreLink={true}
            onItemClick={(item: any) => {
              // LatestItem转换为BaseContentItem进行导航
              const baseItem: BaseContentItem = {
                id: item.id,
                title: item.title,
                imageUrl: item.imageUrl,
                contentType: item.type === 'Movie' ? 'movie' : item.type === 'Photo' ? 'photo' : 'collection',
              }
              handleContentClick(baseItem)
            }}
          />

          {/* 首页7天最热门区块 - 展示7天内最热门内容（混合类型：影片、写真、合集） */}
          <HotSection
            title="7天最热门"
            movies={processedHotDaily}
            showViewMore={true}
            onItemClick={(item: any) => {
              // HotItem转换为BaseContentItem进行导航
              const baseItem: BaseContentItem = {
                id: item.id,
                title: item.title,
                imageUrl: item.imageUrl,
                contentType: item.type === 'Movie' ? 'movie' : item.type === 'Photo' ? 'photo' : 'collection',
              }
              handleContentClick(baseItem)
            }}
          />
        </div>
      </main>
    </div>
  )
}

export default HomePage
