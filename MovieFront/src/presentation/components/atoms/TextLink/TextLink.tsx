/**
 * @fileoverview 文本链接组件
 * @description 提供统一的文本链接样式和交互效果，支持多种变体和尺寸，智能区分应用内导航（React Router）和外部链接
 * @author mosctz
 * @since 1.0.0
 * @version 2.0.0
 */

import type { TextLinkProps } from '@components/atoms/TextLink/TextLink.types'
import { textLinkVariants } from '@tokens/design-system/base-variants'
import { cn } from '@utils/cn'
import React from 'react'
import { Link } from 'react-router-dom'

// 文本链接组件，智能区分应用内导航和外部链接，提供统一的样式和交互效果
export const TextLink: React.FC<TextLinkProps> = ({
  children, // 链接内容
  to, // React Router内部链接地址
  href, // 外部链接地址
  variant = 'primary', // 默认主要样式
  size = 'md', // 默认中等尺寸
  external = false, // 默认非外部链接
  download = false, // 默认非下载链接
  className, // 自定义类名
  onClick, // 点击事件
  ...props // 其他属性
}) => {
  // 构建最终的样式类名 - 合并基础样式、变体样式、尺寸样式和自定义类名
  const classNames = cn(
    textLinkVariants.base, // 基础样式
    textLinkVariants.variant[variant], // 变体样式
    textLinkVariants.size[size], // 尺寸样式
    className // 自定义类名
  )

  // 情况1: 使用to属性 → React Router Link（应用内导航，无整页刷新）
  if (to) {
    return (
      <Link to={to} className={classNames} onClick={onClick}>
        {children}
      </Link>
    )
  }

  // 情况2: 外部链接 → 普通<a>标签 + target="_blank"（新标签页打开）
  if (external && href) {
    return (
      <a
        href={href}
        className={classNames}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    )
  }

  // 情况3: 下载链接 → 普通<a>标签 + download属性
  if (download && href) {
    return (
      <a
        href={href}
        className={classNames}
        download={true}
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    )
  }

  // 情况4: 普通链接 → 普通<a>标签
  if (href) {
    return (
      <a href={href} className={classNames} onClick={onClick} {...props}>
        {children}
      </a>
    )
  }

  // 情况5: 无链接 → 按钮样式的span元素（支持键盘交互）
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
