/**
 * @fileoverview 分页信息子组件
 * @description 分页器的信息显示组件，展示当前页码、总页数、总条数等分页信息
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import { paginationVariants } from '@tokens/design-system/pagination-variants'
import { formatPaginationInfo, getPaginationMeta } from '@utils/pagination'
import type { PaginationSize } from '@types-pagination'
import React from 'react'

// 分页信息组件属性接口
export interface PaginationInfoProps {
  currentPage: number
  totalPages: number
  total?: number
  pageSize?: number
  template?: string
  size: PaginationSize
  className?: string
}

// 分页信息组件，显示分页相关信息
export const PaginationInfo: React.FC<PaginationInfoProps> = ({
  currentPage,
  totalPages,
  total,
  pageSize,
  template,
  size,
  className,
}) => {
  const sizeStyles = paginationVariants.size[size]

  const getInfoText = () => {
    if (template && total && pageSize) {
      const meta = getPaginationMeta(currentPage, pageSize, total)
      return formatPaginationInfo(template, {
        current: currentPage,
        total: total,
        totalPages: totalPages,
        pageSize: pageSize,
        start: meta.startIndex,
        end: meta.endIndex,
      })
    }

    if (total && pageSize) {
      return `第 ${currentPage} 页，共 ${totalPages} 页，总计 ${total} 条`
    }

    return `第 ${currentPage} 页，共 ${totalPages} 页`
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        paginationVariants.info,
        sizeStyles.info,
        className
      )}
    >
      <span>{getInfoText()}</span>
    </div>
  )
}

export default PaginationInfo
