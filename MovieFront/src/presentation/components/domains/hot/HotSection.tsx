/**
 * @fileoverview 首页热门模块组件
 * @description 首页24小时热门模块的领域组件，使用BaseSection + HotList组合架构。
 *              遵循自包含组件设计原则，提供完整的热门模块功能。
 * @created 2025-10-16 11:21:33
 * @updated 2025-10-19 17:11:42
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { HotList } from './HotList'
import { BaseSection } from '@components/domains/shared'
import { RESPONSIVE_CONFIGS } from '@tokens/responsive-configs'
import type { HotItem } from '@infrastructure/repositories/HomeRepository'

interface HotSectionProps {
  /**
   * 热门数据列表
   */
  movies: HotItem[]
  
  /**
   * 区块标题
   * @default "24小时热门"
   */
  title?: string
  
  /**
   * 是否显示查看更多按钮
   * @default true
   */
  showViewMore?: boolean
  
  /**
   * 查看更多按钮点击处理
   */
  onViewMore?: () => void
  
  /**
   * 自定义CSS类名
   */
  className?: string
}

export const HotSection: React.FC<HotSectionProps> = ({
  movies,
  title = "24小时热门",
  showViewMore = true,
  onViewMore,
  className,
}) => {
  return (
    <BaseSection
      title={title}
      showMoreLink={showViewMore}
      moreLinkUrl="#"
      moreLinkText="查看更多 >"
      onMoreLinkClick={onViewMore}
      className={className}
    >
      <HotList 
        hotItems={movies}
        columns={RESPONSIVE_CONFIGS.hot}
      />
    </BaseSection>
  )
}

export type { HotSectionProps }
