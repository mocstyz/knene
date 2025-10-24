/**
 * @fileoverview 分页工具函数库
 * @description 提供完整的分页计算、页码生成、数据切片等工具函数，支持客户端和服务端分页场景
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import type { PaginationMeta, PageItem } from '@types-pagination'

// 计算总页数
export function calculateTotalPages(total: number, pageSize: number): number {
    if (pageSize <= 0) return 0
    return Math.ceil(total / pageSize)
}

// 获取当前页数据切片
export function getPageSlice<T>(
    data: T[],
    page: number,
    pageSize: number
): T[] {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    return data.slice(startIndex, endIndex)
}

// 生成页码列表，支持智能省略
export function generatePageNumbers(
    currentPage: number,
    totalPages: number,
    maxVisible: number = 7
): PageItem[] {
    if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: PageItem[] = []
    const sidePages = Math.floor((maxVisible - 4) / 2)

    pages.push(1)

    let startPage = Math.max(2, currentPage - sidePages)
    let endPage = Math.min(totalPages - 1, currentPage + sidePages)

    if (currentPage - sidePages <= 2) {
        endPage = Math.min(totalPages - 1, maxVisible - 2)
    }
    if (currentPage + sidePages >= totalPages - 1) {
        startPage = Math.max(2, totalPages - maxVisible + 3)
    }

    if (startPage > 2) {
        pages.push('ellipsis')
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }

    if (endPage < totalPages - 1) {
        pages.push('ellipsis')
    }

    if (totalPages > 1) {
        pages.push(totalPages)
    }

    return pages
}

// 验证页码有效性
export function isValidPage(page: number, totalPages: number): boolean {
    return Number.isInteger(page) && page >= 1 && page <= totalPages
}

// 获取分页元信息
export function getPaginationMeta(
    page: number,
    pageSize: number,
    total: number
): PaginationMeta {
    const totalPages = calculateTotalPages(total, pageSize)
    const startIndex = (page - 1) * pageSize + 1
    const endIndex = Math.min(page * pageSize, total)

    return {
        currentPage: page,
        pageSize,
        total,
        totalPages,
        startIndex,
        endIndex,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    }
}

// 格式化分页信息文本
export function formatPaginationInfo(
    template: string,
    data: {
        current: number
        total: number
        totalPages: number
        pageSize: number
        start: number
        end: number
    }
): string {
    return template
        .replace('{current}', String(data.current))
        .replace('{total}', String(data.total))
        .replace('{totalPages}', String(data.totalPages))
        .replace('{pageSize}', String(data.pageSize))
        .replace('{start}', String(data.start))
        .replace('{end}', String(data.end))
}
