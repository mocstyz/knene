/**
 * @fileoverview 分页主组件
 * @description 通用分页组件，支持多种显示模式、样式变体和响应式布局，提供完整的分页导航功能
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import { paginationVariants } from '@tokens/design-system/pagination-variants'
import { generatePageNumbers } from '@utils/pagination'
import { PaginationButton } from './PaginationButton'
import { PaginationEllipsis } from './PaginationEllipsis'
import { PaginationInfo } from './PaginationInfo'
import type {
  PaginationMode,
  PaginationVariant,
  PaginationSize,
} from '@types-pagination'
import React, { useMemo, useCallback } from 'react'

// 分页组件属性接口
export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  mode?: PaginationMode
  variant?: PaginationVariant
  size?: PaginationSize
  showPageInfo?: boolean
  pageInfo?: {
    total?: number
    pageSize?: number
    template?: string
  }
  showQuickJumper?: boolean
  disabled?: boolean
  loading?: boolean
  maxVisiblePages?: number
  className?: string
  buttonClassName?: string
  prevLabel?: React.ReactNode
  nextLabel?: React.ReactNode
  firstLabel?: React.ReactNode
  lastLabel?: React.ReactNode
  responsiveMode?: boolean
}

// 分页主组件，提供完整的分页导航功能
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  mode = 'full',
  variant = 'default',
  size = 'md',
  showPageInfo = false,
  pageInfo,
  showQuickJumper = false,
  disabled = false,
  loading = false,
  maxVisiblePages = 7,
  className,
  buttonClassName,
  prevLabel,
  nextLabel,
  firstLabel,
  lastLabel,
  responsiveMode = true,
}) => {
  if (totalPages <= 1) return null

  if (currentPage < 1 || currentPage > totalPages) {
    console.warn(
      `[Pagination] currentPage (${currentPage}) 超出有效范围 [1, ${totalPages}]`
    )
  }

  const sizeStyles = paginationVariants.size[size as keyof typeof paginationVariants.size]
  const isDisabled = disabled || loading

  const visiblePages = useMemo(
    () => generatePageNumbers(currentPage, totalPages, maxVisiblePages),
    [currentPage, totalPages, maxVisiblePages]
  )

  const handlePageClick = useCallback(
    (page: number) => {
      if (page !== currentPage && !isDisabled) {
        onPageChange(page)
      }
    },
    [currentPage, isDisabled, onPageChange]
  )

  const handlePrevClick = useCallback(() => {
    if (currentPage > 1 && !isDisabled) {
      onPageChange(currentPage - 1)
    }
  }, [currentPage, isDisabled, onPageChange])

  const handleNextClick = useCallback(() => {
    if (currentPage < totalPages && !isDisabled) {
      onPageChange(currentPage + 1)
    }
  }, [currentPage, totalPages, isDisabled, onPageChange])

  const renderPrevButton = () => (
    <PaginationButton
      page="prev"
      disabled={currentPage === 1 || isDisabled}
      onClick={handlePrevClick}
      variant={variant}
      size={size}
      className={buttonClassName}
    >
      {prevLabel || (
        <svg
          className="h-4 w-4 sm:h-4.5 sm:w-4.5"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
        </svg>
      )}
    </PaginationButton>
  )

  const renderNextButton = () => (
    <PaginationButton
      page="next"
      disabled={currentPage === totalPages || isDisabled}
      onClick={handleNextClick}
      variant={variant}
      size={size}
      className={buttonClassName}
    >
      {nextLabel || (
        <svg
          className="h-4 w-4 sm:h-4.5 sm:w-4.5"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
        </svg>
      )}
    </PaginationButton>
  )

  const renderPageButtons = () => {
    if (mode === 'simple') {
      return (
        <span className={cn('px-4 py-2', paginationVariants.info)}>
          {currentPage} / {totalPages}
        </span>
      )
    }

    if (mode === 'full' && totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <PaginationButton
          key={page}
          page={page}
          active={page === currentPage}
          disabled={isDisabled}
          onClick={() => handlePageClick(page)}
          variant={variant}
          size={size}
          className={buttonClassName}
        >
          {page}
        </PaginationButton>
      ))
    }

    return visiblePages.map((item, index) => {
      if (item === 'ellipsis') {
        return <PaginationEllipsis key={`ellipsis-${index}`} size={size} />
      }

      return (
        <PaginationButton
          key={item}
          page={item}
          active={item === currentPage}
          disabled={isDisabled}
          onClick={() => handlePageClick(item)}
          variant={variant}
          size={size}
          className={buttonClassName}
        >
          {item}
        </PaginationButton>
      )
    })
  }

  return (
    <div className={cn('w-full space-y-4 mt-8', className)}>
      <div className={cn(paginationVariants.container, sizeStyles.spacing)}>
        {renderPrevButton()}
        <div className={cn('flex items-center', sizeStyles.spacing)}>
          {renderPageButtons()}
        </div>
        {renderNextButton()}
      </div>

      {showPageInfo && (
        <PaginationInfo
          currentPage={currentPage}
          totalPages={totalPages}
          total={pageInfo?.total}
          pageSize={pageInfo?.pageSize}
          template={pageInfo?.template}
          size={size}
        />
      )}
    </div>
  )
}

export default Pagination
