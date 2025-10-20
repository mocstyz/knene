/**
 * @fileoverview 首页影片合集模块组件
 * @description 首页影片合集模块的领域组件，使用BaseSection + CollectionList组合架构。
 *              遵循自包含组件设计原则，提供完整的影片合集模块功能。
 * @created 2025-10-16 11:21:33
 * @updated 2025-10-19 16:45:28
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import {
  CollectionList,
  type CollectionItem,
} from '@components/domains/collections'
import { BaseSection } from '@components/domains/shared'
import { RESPONSIVE_CONFIGS } from '@tokens/responsive-configs'
import type { CollectionSectionProps } from '@types-unified'
import { cn } from '@utils/cn'
import React from 'react'


// 首页影片合集模块组件，使用BaseSection + CollectionList组合架构，BaseSection提供统一的Section布局，CollectionList提供影片合集列表渲染，保持现有的props接口，确保向后兼容
const CollectionSection: React.FC<CollectionSectionProps> = ({
  data,
  title = '影片合集',
  showMoreLink = false,
  moreLinkUrl,
  moreLinkText = '查看更多',
  cardConfig,
  onCollectionClick,
  className,
}) => {
  // 添加调试日志
  console.log('🎬 [CollectionSection] Received data:', {
    length: data?.length || 0,
    data
  })

  return (
    <BaseSection
      title={title}
      showMoreLink={showMoreLink}
      moreLinkUrl={moreLinkUrl}
      moreLinkText={moreLinkText}
      className={className}
    >
      <CollectionList
        collections={data}
        cardConfig={cardConfig}
        onCollectionClick={onCollectionClick}
      />
    </BaseSection>
  )
}

export { CollectionSection }
export type { CollectionSectionProps } from '@types-unified'
export default CollectionSection
