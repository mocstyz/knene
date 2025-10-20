/**
 * @fileoverview 首页最新更新模块组件
 * @description 首页最新更新模块的领域组件，使用BaseSection + LatestList组合架构。
 * 遵循自包含组件设计原则，提供完整的最新更新模块功能。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 2.0.0
 */

import { LatestUpdateList } from '@components/domains/latestupdate/LatestUpdateList'
import { BaseSection } from '@components/domains/shared'
import { RESPONSIVE_CONFIGS } from '@tokens/responsive-configs'
import type { LatestUpdateSectionProps } from '@types-unified'
import React from 'react'


/**
 * 首页最新更新模块组件
 *
 * 使用BaseSection + LatestUpdateList组合架构：
 * - BaseSection提供统一的Section布局
 * - LatestUpdateList提供最新更新列表渲染
 * - 保持现有的props接口，确保向后兼容
 */
const LatestUpdateSection: React.FC<LatestUpdateSectionProps> = ({
  data: latestItems,
  title = "最新更新",
  showMoreLink = false,
  moreLinkUrl = '#',
  moreLinkText = 'More >',
  onItemClick: onLatestClick,
  className,
  cardConfig = {
    variant: 'grid',
    columns: {
      xs: 2,
      sm: 3,
      md: 4,
      lg: 4,
      xl: 5,
      xxl: 6,
    },
    showRatingBadge: true,
    showQualityBadge: true,
    showVipBadge: true,
    showNewBadge: true,
    aspectRatio: 'portrait',
    hoverEffect: true,
  },
}) => {
  return (
    <BaseSection
      title={title}
      showMoreLink={showMoreLink}
      moreLinkUrl={moreLinkUrl}
      moreLinkText={moreLinkText}
      className={className}
    >
      <LatestUpdateList
        latestItems={latestItems}
        onLatestClick={onLatestClick}
        variant={cardConfig.variant}
        columns={RESPONSIVE_CONFIGS.latestUpdate}
        cardConfig={{
          showRatingBadge: cardConfig.showRatingBadge,
          showQualityBadge: cardConfig.showQualityBadge,
          showVipBadge: cardConfig.showVipBadge,
          showNewBadge: cardConfig.showNewBadge,
          aspectRatio: cardConfig.aspectRatio,
          hoverEffect: cardConfig.hoverEffect,
        }}
      />
    </BaseSection>
  )
}

export { LatestUpdateSection }
export type { LatestUpdateSectionProps } from '@types-unified'
export default LatestUpdateSection
