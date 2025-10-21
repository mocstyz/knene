/**
 * @fileoverview 首页最新更新模块组件
 * @description 首页最新更新模块的领域组件，使用BaseSection + LatestUpdateList组合架构。
 *              遵循自包含组件设计原则，提供完整的最新更新模块功能。
 *              负责展示最新更新内容列表，支持自定义标题和查看更多功能。
 * @created 2025-10-16 11:21:33
 * @updated 2025-10-20 14:07:15
 * @author mosctz
 * @since 1.0.0
 * @version 2.0.0
 */

import { LatestUpdateList } from '@components/domains/latestupdate/LatestUpdateList'
import { BaseSection } from '@components/domains/shared'
import { RESPONSIVE_CONFIGS } from '@tokens/responsive-configs'
import type { LatestUpdateSectionProps } from '@types-unified'
import React from 'react'


// 首页最新更新模块组件，使用BaseSection + LatestUpdateList组合架构，遵循自包含组件设计原则
const LatestUpdateSection: React.FC<LatestUpdateSectionProps> = ({
  data: latestItems,
  title = "最新更新",
  showMoreLink = false,
  moreLinkUrl = '#',
  moreLinkText, // 移除硬编码默认值，使用BaseSection的默认值
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
