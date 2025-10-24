/**
 * @fileoverview 分页省略号子组件
 * @description 分页器的省略号组件，用于表示被省略的页码范围
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import { paginationVariants } from '@tokens/design-system/pagination-variants'
import type { PaginationSize } from '@types-pagination'
import React from 'react'

// 分页省略号组件属性接口
export interface PaginationEllipsisProps {
  size: PaginationSize
  className?: string
}

// 分页省略号组件，显示省略的页码
export const PaginationEllipsis: React.FC<PaginationEllipsisProps> = ({
  size,
  className,
}) => {
  const sizeStyles = paginationVariants.size[size]

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        sizeStyles.button,
        'text-gray-500 dark:text-gray-400',
        className
      )}
    >
      ...
    </span>
  )
}

export default PaginationEllipsis
