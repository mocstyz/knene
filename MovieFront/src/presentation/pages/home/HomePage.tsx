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


const HomePage: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  // 使用重构后的数据Hook
  const { trendingMovies, popularMovies, newReleases, collectionsData, isLoading, error } =
    useHomeData()

  // 添加调试日志
  console.log('HomePage - collectionsData:', collectionsData)
  console.log('HomePage - collectionsData length:', collectionsData?.length)
  console.log('HomePage - trendingMovies:', trendingMovies)
  console.log('HomePage - trendingMovies length:', trendingMovies?.length)

  // 数据处理：使用统一数据转换API，将所有数据转换为统一格式
  // 处理影片合集数据
  const processedCollectionsData = useMemo(() => {
    console.log('🔍 [HomePage] Processing collectionsData:', {
      length: collectionsData?.length || 0,
      data: collectionsData
    })
    
    if (!collectionsData || collectionsData.length === 0) {
      console.log('⚠️ [HomePage] collectionsData is empty or undefined')
      return []
    }
    
    const unifiedData = collectionsData.map(toUnifiedContentItem)
    console.log('🔄 [HomePage] Unified collectionsData:', {
      length: unifiedData.length,
      data: unifiedData
    })
    
    const result = toCollectionItems(unifiedData)
    console.log('✅ [HomePage] Final processedCollectionsData:', {
      length: result.length,
      data: result
    })
    
    return result
  }, [collectionsData])

  // 处理写真数据
  const processedTrendingMovies = useMemo(() => {
    console.log('🔍 [HomePage] Processing trendingMovies:', {
      length: trendingMovies?.length || 0,
      data: trendingMovies
    })
    
    if (!trendingMovies || trendingMovies.length === 0) {
      console.log('⚠️ [HomePage] trendingMovies is empty or undefined')
      return []
    }
    
    const unifiedData = trendingMovies.map(toUnifiedContentItem)
    console.log('🔄 [HomePage] Unified trendingMovies:', {
      length: unifiedData.length,
      data: unifiedData
    })
    
    const result = toPhotoItems(unifiedData)
    console.log('✅ [HomePage] Final processedTrendingMovies:', {
      length: result.length,
      data: result
    })
    
    return result
  }, [trendingMovies])

  const processedPopularMovies = useMemo(() => {
    const unifiedData = (popularMovies || []).map(toUnifiedContentItem)
    return toLatestItems(unifiedData)
  }, [popularMovies])

  const processedNewReleases = useMemo(() => {
    const unifiedData = (newReleases || []).map(toUnifiedContentItem)
    return toHotItems(unifiedData)
  }, [newReleases])

  // 添加Header动态背景效果，与HTML中的JavaScript逻辑完全一致
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
        // past hero: ensure default blurred background
        header.classList.remove(...transparentClasses.split(' '))
        header.classList.add(...defaultClasses.split(' '))
      } else {
        // within hero: keep transparent
        header.classList.remove(...defaultClasses.split(' '))
        header.classList.add(...transparentClasses.split(' '))
      }
    }

    // Initial header state
    header.classList.add(...transparentClasses.split(' '))

    // Add scroll event listener
    window.addEventListener('scroll', updateHeader)

    // Initial check
    updateHeader()

    // Cleanup
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
          {/* 首页影片合集区块 */}
          <CollectionSection
            data={processedCollectionsData}
            showMoreLink={true}
            moreLinkUrl={ROUTES.SPECIAL.COLLECTIONS}
          />

          {/* 首页写真区块 */}
          <PhotoSection
            data={processedTrendingMovies}
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

          {/* 首页最近更新区块 */}
          <LatestUpdateSection
            data={processedPopularMovies}
            showMoreLink={true}
          />

          {/* 首页24小时热门区块 */}
          <HotSection
            movies={processedNewReleases}
            showViewMore={true}
          />
        </div>
      </main>
    </div>
  )
}

export default HomePage
