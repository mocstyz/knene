/**
 * @fileoverview 文本链接组件
 * @description 提供统一的文本链接样式和交互效果，支持多种变体和尺寸，可渲染为链接或按钮样式
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-19 15:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import type { TextLinkProps } from '@components/atoms/TextLink/TextLink.types'
import { textLinkVariants } from '@tokens/design-system/base-variants'
import { cn } from '@utils/cn'
import React from 'react'

// eslint-disable-next-line no-restricted-imports

// 文本链接组件，提供统一的文本链接样式和交互效果，原子组件设计自包含完整的视觉效果
export const TextLink: React.FC<TextLinkProps> = ({
  children, // 链接内容
  href, // 链接地址
  variant = 'primary', // 默认主要样式
  size = 'md', // 默认中等尺寸
  external = false, // 默认非外部链接
  download = false, // 默认非下载链接
  className, // 自定义类名
  onClick, // 点击事件
  ...props // 其他属性
}) => {
  // 构建基础链接属性对象
  const linkProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    href,
    onClick,
    ...props,
  }

  // 外部链接处理 - 添加target和rel属性以确保安全性
  if (external && href) {
    linkProps.target = '_blank' // 在新标签页打开
    linkProps.rel = 'noopener noreferrer' // 安全性设置
  }

  // 下载链接处理 - 添加download属性
  if (download && href) {
    linkProps.download = true
  }

  // 构建最终的样式类名 - 合并基础样式、变体样式、尺寸样式和自定义类名
  const classNames = cn(
    textLinkVariants.base, // 基础样式
    textLinkVariants.variant[variant], // 变体样式
    textLinkVariants.size[size], // 尺寸样式
    className // 自定义类名
  )

  // 如果没有href，渲染为按钮样式的span元素 - 支持键盘交互
  if (!href) {
    return (
      <span
        className={classNames}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          // 支持Enter和空格键触发点击事件
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick?.()
          }
        }}
      >
        {children}
      </span>
    )
  }

  // 渲染为标准的链接元素
  return (
    <a className={classNames} {...linkProps}>
      {children}
    </a>
  )
}
