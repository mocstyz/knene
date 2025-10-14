/**
 * TextLink组件类型定义
 * 提供统一的文本链接样式和交互效果
 */
import React from 'react'

export interface TextLinkProps {
  /** 链接内容 */
  children: React.ReactNode
  /** 链接地址 */
  href?: string
  /** 链接变体样式 */
  variant?: 'primary' | 'secondary' | 'default' | 'accent' | 'muted' | 'inherit'
  /** 文字大小 */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  /** 是否为外部链接 */
  external?: boolean
  /** 是否为下载链接 */
  download?: boolean
  /** 自定义类名 */
  className?: string
  /** 点击事件 */
  onClick?: () => void
}

export type TextLinkVariant = Required<TextLinkProps>['variant']
export type TextLinkSize = Required<TextLinkProps>['size']
