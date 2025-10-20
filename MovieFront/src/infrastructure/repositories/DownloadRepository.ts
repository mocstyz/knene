/**
 * @fileoverview 下载仓储接口定义
 * @description 定义下载相关的数据访问接口，包含下载任务的创建、查询、更新、删除等操作规范
 * @created 2025-10-15 14:30:00
 * @updated 2025-10-19 10:15:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Download } from '@domain/entities/Download'

// 下载仓储接口，定义下载任务的数据访问规范
export interface DownloadRepository {
  // 创建新的下载任务
  create(download: Download): Promise<Download>
  // 根据ID查找下载任务
  findById(id: string): Promise<Download | null>
  // 根据用户ID查找下载任务列表
  findByUserId(userId: string): Promise<Download[]>
  // 根据影片ID查找下载任务列表
  findByMovieId(movieId: string): Promise<Download[]>
  // 查找用户活跃的下载任务
  findActiveDownloads(userId: string): Promise<Download[]>
  // 更新下载任务信息
  update(download: Download): Promise<Download>
  // 删除下载任务
  delete(id: string): Promise<boolean>
  // 获取用户下载统计信息
  getDownloadStats(userId: string): Promise<{
    total: number // 总下载数
    completed: number // 已完成数
    failed: number // 失败数
    inProgress: number // 进行中数
  }>
}
