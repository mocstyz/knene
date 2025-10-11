import {
  TopicSection,
  PhotoSection,
  LatestSection,
  TopSection,
} from '@components/domains'
import { NavigationHeader, HeroSection } from '@components/organisms'
import { useHomeData } from '@data/home/homeData'
import { ROUTES } from '@presentation/router/routes'
import React, { useEffect, useRef } from 'react'

const HomePage: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  // 使用重构后的数据Hook
  const { trendingMovies, popularMovies, newReleases, topicsData } =
    useHomeData()

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
          {/* 首页专题区块 */}
          <TopicSection
            topics={topicsData || []}
            showMoreLink={true}
            moreLinkUrl={ROUTES.SPECIAL.COLLECTIONS}
            moreLinkText="More >"
          />

          {/* 首页写真区块 */}
          <PhotoSection
            photos={trendingMovies || []}
            showMoreLink={true}
            moreLinkText="More >"
          />

          {/* 首页最近更新区块 */}
          <LatestSection
            latestItems={popularMovies || []}
            showMoreLink={true}
            moreLinkText="More >"
          />

          {/* 首页24小时TOP区块 */}
          <TopSection
            topItems={newReleases || []}
            showMoreLink={true}
            moreLinkText="More >"
          />
        </div>
      </main>
    </div>
  )
}

export default HomePage
