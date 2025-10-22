/**
 * @fileoverview TextLink组件类型定义
 * @description 定义文本链接组件的属性接口和类型，提供完整的类型安全保障
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'

// 文本链接组件属性接口，定义链接的各种配置选项
export interface TextLinkProps {
  children: React.ReactNode // 链接内容
  href?: string // 链接地址，可选
  variant?: 'primary' | 'secondary' | 'default' | 'accent' | 'muted' | 'inherit' // 链接变体样式
  size?: 'xs' | 'sm' | 'md' | 'lg' // 文字尺寸
  external?: boolean // 是否为外部链接
  download?: boolean // 是否为下载链接
  className?: string // 自定义CSS类名
  onClick?: () => void // 点击事件处理函数
}

// 文本链接变体类型，从属性接口中提取必需的variant类型
export type TextLinkVariant = Required<TextLinkProps>['variant']

// 文本链接尺寸类型，从属性接口中提取必需的size类型
export type TextLinkSize = Required<TextLinkProps>['size']
