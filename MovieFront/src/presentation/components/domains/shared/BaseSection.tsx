/**
 * @fileoverview 基础Section组件
 * @description 通用的Section布局组件，为所有首页模块提供统一的布局结构。
 * 包含标题区域、更多链接和内容区域，遵循自包含组件设计原则。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { TextLink } from '@components/atoms'
import { cn } from '@utils/cn'
import type { ReactNode } from 'react'
import React from 'react'

/**
 * 基础Section组件属性接口
 */
export interface BaseSectionComponentProps {
  /** Section标题 */
  title: string
  /** 子元素内容 */
  children: ReactNode
  /** 是否显示更多链接 */
  showMoreLink?: boolean
  /** 更多链接URL */
  moreLinkUrl?: string
  /** 更多链接文本 */
  moreLinkText?: string
  /** 更多链接点击回调 */
  onMoreLinkClick?: () => void
  /** 自定义CSS类名 */
  className?: string
  /** 标题区域自定义类名 */
  headerClassName?: string
  /** 内容区域自定义类名 */
  contentClassName?: string
}

/**
 * 基础Section组件
 *
 * 提供统一的Section布局结构：
 * - 标题和更多链接的横向布局
 * - 内容区域的容器
 * - 响应式间距设计
 * - 自包含的完整视觉效果
 */
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
  // Section容器样式类
  const containerClasses = cn('space-y-4 min-w-[320px]', className)

  // 标题区域样式类
  const headerClasses = cn('flex items-center justify-between', headerClassName)

  // 内容区域样式类
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
