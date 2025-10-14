/**
 * TextLink组件
 * 提供统一的文本链接样式和交互效果
 * 原子组件 - 自包含完整的视觉效果
 */

import { textLinkVariants } from '@tokens/design-system/base-variants'
import { cn } from '@utils/cn'
import React from 'react'

// eslint-disable-next-line no-restricted-imports
import type { TextLinkProps } from './TextLink.types'

/**
 * TextLink组件 - 统一的文本链接
 * @param children - 链接内容
 * @param href - 链接地址
 * @param variant - 链接变体样式
 * @param size - 文字大小
 * @param external - 是否为外部链接
 * @param download - 是否为下载链接
 * @param className - 自定义类名
 * @param onClick - 点击事件
 * @param props
 */
export const TextLink: React.FC<TextLinkProps> = ({
  children,
  href,
  variant = 'primary',
  size = 'md',
  external = false,
  download = false,
  className,
  onClick,
  ...props
}) => {
  // 构建链接属性
  const linkProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    href,
    onClick,
    ...props,
  }

  // 外部链接处理
  if (external && href) {
    linkProps.target = '_blank'
    linkProps.rel = 'noopener noreferrer'
  }

  // 下载链接处理
  if (download && href) {
    linkProps.download = true
  }

  // 构建样式类名
  const classNames = cn(
    textLinkVariants.base,
    textLinkVariants.variant[variant],
    textLinkVariants.size[size],
    className
  )

  // 如果没有href，渲染为按钮样式的span
  if (!href) {
    return (
      <span
        className={classNames}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
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

  return (
    <a className={classNames} {...linkProps}>
      {children}
    </a>
  )
}
