/**
 * @fileoverview 基础Section组件
 * @description 通用的Section布局组件，为所有首页模块提供统一的布局结构，包含标题区域、更多链接和内容区域，遵循自包含组件设计原则。
 *              提供标准化的页面区块容器，支持自定义样式和事件处理，确保整体设计的一致性和可维护性。
 * @created 2025-10-20 14:07:15
 * @updated 2025-10-20 16:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { TextLink } from '@components/atoms'
import { cn } from '@utils/cn'
import type { ReactNode } from 'react'
import React from 'react'

// 基础Section组件属性接口，定义Section组件的所有配置选项
export interface BaseSectionComponentProps {
  title: string // Section标题
  children: ReactNode // 子元素内容
  showMoreLink?: boolean // 是否显示更多链接，默认false
  moreLinkUrl?: string // 更多链接URL，默认'#'
  moreLinkText?: string // 更多链接文本，默认'More >'
  onMoreLinkClick?: () => void // 更多链接点击回调
  className?: string // 自定义CSS类名
  headerClassName?: string // 标题区域自定义类名
  contentClassName?: string // 内容区域自定义类名
}

// 基础Section组件，提供统一的Section布局结构，包括标题和更多链接的横向布局、内容区域的容器、响应式间距设计和自包含的完整视觉效果
const BaseSection: React.FC<BaseSectionComponentProps> = ({
  title,
  children,
  showMoreLink = false,
  moreLinkUrl = '#',
  moreLinkText = 'More >',
  onMoreLinkClick,
  className,
  headerClassName,
  contentClassName,
}) => {
  // Section容器样式类 - 统一的容器布局样式
  const containerClasses = cn('space-y-4 min-w-[320px]', className)

  // 标题区域样式类 - 标题和更多链接的横向布局
  const headerClasses = cn('flex items-center justify-between', headerClassName)

  // 内容区域样式类 - 内容容器的基础样式
  const contentClasses = cn('', contentClassName)

  return (
    <section className={containerClasses}>
      {/* 标题和更多链接 */}
      <div className={headerClasses}>
        <h2 className="text-2xl font-bold">{title}</h2>
        {showMoreLink && (
          <TextLink
            href={moreLinkUrl}
            variant="primary"
            size="sm"
            onClick={onMoreLinkClick}
          >
            {moreLinkText}
          </TextLink>
        )}
      </div>

      {/* 内容区域 */}
      <div className={contentClasses}>{children}</div>
    </section>
  )
}

export { BaseSection }
export default BaseSection
