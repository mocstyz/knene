/**
 * @fileoverview 领域实体统一导出
 * @description 统一导出所有领域实体类和类型定义，包括影片、用户、下载、消息等核心业务实体
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-19 13:56:30
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

export { Movie } from './Movie'
export type { MovieDetail, MovieCategory, MovieRating } from './Movie'
export { User } from './User'
export { Download } from './Download'
export { Message, MessageThreadManager } from './Message'
export type { MessageDetail, MessageThread, Notification } from './Message'
