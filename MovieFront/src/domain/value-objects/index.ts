/**
 * @fileoverview 值对象统一导出
 * @description 统一导出所有值对象类，提供模块化的值对象访问入口，确保值对象的一致性和可维护性
 * @created 2025-10-09 13:10:49
 * @updated 2025-10-19 10:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 用户相关值对象
export { Title } from './Title'
export { Email } from './Email'
export { Password } from './Password'
export { Avatar } from './Avatar'

// 影片相关值对象
export { Genre } from './Genre'
export { Duration } from './Duration'
export { ReleaseDate } from './ReleaseDate'
export { MovieQuality } from './MovieQuality'
export { Rating, RatingDistribution } from './Rating'

// 下载相关值对象
export { DownloadSpeed } from './DownloadSpeed'
export { DownloadStatus, DownloadStatusValue } from './DownloadStatus'
export { FileSize } from './FileSize'

// 消息相关值对象
export { MessageContent } from './MessageContent'
export type { MessageAttachment } from './MessageContent'
export { MessageType } from './MessageType'
export { ReadStatus } from './ReadStatus'