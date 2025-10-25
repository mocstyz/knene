/**
 * @fileoverview 导航辅助函数
 * @description 提供统一的内容项导航逻辑，根据内容类型跳转到对应页面
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { ROUTES } from '@presentation/router/routes'
import type { BaseContentItem } from '@components/domains/shared/content-renderers'

// 根据内容项类型导航到对应页面
export function navigateToContentDetail(
  item: BaseContentItem,
  navigate: (path: string, options?: any) => void
): void {
  // 准备传递给详情页的状态数据
  const state = {
    imageUrl: item.imageUrl,
    title: item.title,
    description: item.description,
  }

  switch (item.contentType) {
    case 'movie':
      // 跳转到影片详情页，传递图片信息
      navigate(ROUTES.MOVIE.DETAIL(item.id), { state })
      break
    case 'photo':
      // 跳转到写真详情页，传递图片信息
      navigate(ROUTES.PHOTO.DETAIL(item.id), { state })
      break
    case 'collection':
      // 跳转到合集影片列表页，传递图片信息
      navigate(ROUTES.COLLECTION.DETAIL(item.id), { state })
      break
    default:
      console.warn(`Unknown content type: ${item.contentType}`)
  }
}

// 获取内容项的详情页URL
export function getContentDetailUrl(item: BaseContentItem): string {
  switch (item.contentType) {
    case 'movie':
      return ROUTES.MOVIE.DETAIL(item.id)
    case 'photo':
      return ROUTES.PHOTO.DETAIL(item.id)
    case 'collection':
      return ROUTES.COLLECTION.DETAIL(item.id)
    default:
      return '#'
  }
}
