import {
  CollectionSection,
  PhotoSection,
  LatestUpdateSection,
  HotSection,
} from '@components/domains'
import { NavigationHeader, HeroSection } from '@components/organisms'
import { useHomeData } from '@data/home/homeData'
import { ROUTES } from '@presentation/router/routes'
import React, { useEffect, useRef } from 'react'

const HomePage: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  // 使用重构后的数据Hook
  const { trendingMovies, popularMovies, newReleases, collectionsData } =
    useHomeData()

  // 转换数据类型以匹配组件期望
  const convertedTrendingMovies = trendingMovies.map(movie => ({
    ...movie,
    rating: movie.rating ? parseFloat(movie.rating) : undefined,
    ratingColor: movie.ratingColor === 'purple' ? 'red' :
                  movie.ratingColor === 'white' ? 'default' :
                  movie.ratingColor || 'default',
  }))

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
            collections={collectionsData || []}
            showMoreLink={true}
            moreLinkUrl={ROUTES.SPECIAL.COLLECTIONS}
            moreLinkText="More >"
          />

          {/* 首页写真区块 */}
          <PhotoSection
            photos={convertedTrendingMovies || []}
            showMoreLink={true}
            moreLinkText="More >"
          />

          {/* 首页最近更新区块 */}
          <LatestUpdateSection
            latestItems={popularMovies || []}
            showMoreLink={true}
            moreLinkText="More >"
          />

          {/* 首页24小时热门区块 */}
          <HotSection
            hotItems={newReleases || []}
            showMoreLink={true}
            moreLinkText="More >"
          />
        </div>
      </main>
    </div>
  )
}

export default HomePage
