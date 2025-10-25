/**
 * @fileoverview 首页骨架屏组件
 * @description 用于首页的完整加载占位符,包含 Hero 区域和多个 Section
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'
import { SkeletonHero } from './SkeletonHero'
import { SkeletonSectionHeader } from './SkeletonSectionHeader'
import { SkeletonCardGrid } from './SkeletonCardGrid'

export interface SkeletonHomePageProps {
  showHero?: boolean
  sectionCount?: number
  cardsPerSection?: number
  className?: string
  disableAnimation?: boolean
}

// 首页骨架屏组件,包含 Hero 和多个 Section
export const SkeletonHomePage: React.FC<SkeletonHomePageProps> = ({
  showHero = true,
  sectionCount = 4,
  cardsPerSection = 5,
  className,
  disableAnimation,
}) => {
  return (
    <div className={cn('min-h-screen', className)}>
      {/* Hero 区域 */}
      {showHero && (
        <SkeletonHero disableAnimation={disableAnimation} />
      )}

      {/* Section 列表 */}
      <div className="container mx-auto space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        {Array.from({ length: sectionCount }).map((_, index) => (
          <div key={index} className="space-y-6">
            <SkeletonSectionHeader disableAnimation={disableAnimation} />
            <SkeletonCardGrid
              count={cardsPerSection}
              columns={{ xs: 2, sm: 3, md: 4, lg: 5 }}
              aspectRatio="portrait"
              disableAnimation={disableAnimation}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkeletonHomePage
