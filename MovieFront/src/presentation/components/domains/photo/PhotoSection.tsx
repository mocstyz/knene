/**
 * @fileoverview 首页写真模块组件
 * @description 首页写真模块的领域组件，使用BaseSection + PhotoList组合架构。
 * 遵循自包含组件设计原则，提供完整的写真模块功能。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 2.0.0
 */

import { PhotoList, type PhotoItem } from '@components/domains/photo'
import { BaseSection } from '@components/domains/shared'
import type { PhotoSectionProps } from '@types-unified'
import { cn } from '@utils/cn'
import React from 'react'


/**
 * 首页写真模块组件
 *
 * 使用BaseSection + PhotoList组合架构：
 * - BaseSection提供统一的Section布局
 * - PhotoList提供写真列表渲染
 * - 保持现有的props接口，确保向后兼容
 */
const PhotoSection: React.FC<PhotoSectionProps> = ({
  data,
  title = '写真',
  showMoreLink = false,
  moreLinkUrl,
  moreLinkText = '查看更多',
  cardConfig,
  columns,
  onPhotoClick,
  className,
}) => {
  // 添加调试日志
  console.log('📸 [PhotoSection] Received data:', {
    length: data?.length || 0,
    data: data
  })

  return (
    <BaseSection
      title={title}
      showMoreLink={showMoreLink}
      moreLinkUrl={moreLinkUrl}
      moreLinkText={moreLinkText}
      className={className}
    >
      <PhotoList
        photos={data}
        cardConfig={cardConfig}
        columns={columns}
        onPhotoClick={onPhotoClick}
      />
    </BaseSection>
  )
}

export { PhotoSection }
export type { PhotoSectionProps }
export default PhotoSection
