/**
 * @fileoverview 首页热门模块组件
 * @description 首页24小时热门模块的领域组件，使用BaseSection + HotList组合架构。
 *              遵循自包含组件设计原则，提供完整的热门模块功能。
 *              负责展示热门内容列表，支持自定义标题和查看更多功能。
 * @created 2025-10-16 11:21:33
 * @updated 2025-10-20 14:07:15
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */


import { BaseSection } from '@components/domains/shared'
import type { HotItem } from '@types-movie'
import { RESPONSIVE_CONFIGS } from '@tokens/responsive-configs'
import { UI_TEXT } from '@tokens/text-constants'

import { HotList } from './HotList'

// 热门模块属性接口，定义热门模块组件的所有配置选项
interface HotSectionProps {
  movies: HotItem[] // 热门数据列表
  title?: string // 区块标题，默认"24小时热门"
  showViewMore?: boolean // 是否显示查看更多按钮，默认true
  onViewMore?: () => void // 查看更多按钮点击处理
  className?: string // 自定义CSS类名
}

// 首页热门模块组件，使用BaseSection + HotList组合架构，遵循自包含组件设计原则，提供完整的热门模块功能
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
      // 移除硬编码的moreLinkText，使用BaseSection的默认值
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
