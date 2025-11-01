/**
 * @fileoverview 分页按钮子组件
 * @description 分页器的按钮子组件，支持页码按钮、上一页、下一页等多种类型，提供完整的样式变体和状态管理
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import { paginationVariants } from '@tokens/design-system/pagination-variants'
import type { PaginationVariant, PaginationSize } from '@types-pagination'
import React from 'react'

// 分页按钮组件属性接口
export interface PaginationButtonProps {
  page: number | 'prev' | 'next' | 'first' | 'last'
  active?: boolean
  disabled?: boolean
  onClick: () => void
  variant: PaginationVariant
  size: PaginationSize
  children: React.ReactNode
  className?: string
}

// 分页按钮组件，提供统一的按钮样式和交互
export const PaginationButton: React.FC<PaginationButtonProps> = ({
  page,
  active = false,
  disabled = false,
  onClick,
  variant,
  size,
  children,
  className,
}) => {
  const variantStyles = paginationVariants.variant[variant]
  const sizeStyles = paginationVariants.size[size]

  const buttonClasses = cn(
    paginationVariants.base,
    sizeStyles.button,
    active ? variantStyles.active : variantStyles.button,
    disabled && variantStyles.disabled,
    className
  )

  const handleClick = () => {
    if (!disabled) {
      onClick()
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  )
}

export default PaginationButton
