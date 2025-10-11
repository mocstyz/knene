import { Download } from '@domain/entities/Download'
import { DownloadRepository } from '@infrastructure/repositories/DownloadRepository'

/**
 * 下载仓储实现
 * 负责下载数据的持久化和查询
 */
export class DownloadRepositoryImpl implements DownloadRepository {
  private cache = new Map<string, Download>()
  private cacheExpiry = new Map<string, number>()
  private readonly CACHE_DURATION = 2 * 60 * 1000 // 2分钟缓存

  /**
   * 根据ID查找下载任务
   */
  async findById(id: string): Promise<Download | null> {
    try {
      // 1. 检查缓存
      const cached = this.getFromCache(id)
      if (cached) return cached

      // 2. 从API获取数据
      const response = await fetch(`/api/downloads/${id}`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`获取下载任务失败: ${response.statusText}`)
      }

      const downloadData = await response.json()
      const download = this.mapToDownloadEntity(downloadData)

      // 3. 缓存结果
      this.setCache(id, download)

      return download
    } catch (error) {
      console.error('查找下载任务失败:', error)
      throw error
    }
  }

  /**
   * 获取所有下载任务
   */
  async findAll(): Promise<Download[]> {
    try {
      const response = await fetch('/api/downloads', {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`获取下载列表失败: ${response.statusText}`)
      }

      const downloadsData = await response.json()
      return downloadsData.map((data: any) => this.mapToDownloadEntity(data))
    } catch (error) {
      console.error('获取下载列表失败:', error)
      throw error
    }
  }

  /**
   * 保存下载任务
   */
  async save(download: Download): Promise<Download> {
    try {
      const downloadData = this.mapFromDownloadEntity(download)

      const response = await fetch(`/api/downloads/${download.detail.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(downloadData),
      })

      if (!response.ok) {
        throw new Error(`保存下载任务失败: ${response.statusText}`)
      }

      const savedDownloadData = await response.json()
      const savedDownload = this.mapToDownloadEntity(savedDownloadData)

      // 更新缓存
      this.setCache(download.detail.id, savedDownload)

      return savedDownload
    } catch (error) {
      console.error('保存下载任务失败:', error)
      throw error
    }
  }

  /**
   * 删除下载任务
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/downloads/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`删除下载任务失败: ${response.statusText}`)
      }

      // 清除缓存
      this.clearCache(id)
      return true
    } catch (error) {
      console.error('删除下载任务失败:', error)
      throw error
    }
  }

  /**
   * 根据用户ID查找下载任务
   */
  async findByUserId(userId: string): Promise<Download[]> {
    try {
      const response = await fetch(`/api/users/${userId}/downloads`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`获取用户下载任务失败: ${response.statusText}`)
      }

      const downloadsData = await response.json()
      return downloadsData.map((data: any) => this.mapToDownloadEntity(data))
    } catch (error) {
      console.error('获取用户下载任务失败:', error)
      throw error
    }
  }

  /**
   * 查找活跃的下载任务
   */
  async findActiveDownloads(): Promise<Download[]> {
    try {
      const response = await fetch('/api/downloads/active', {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`获取活跃下载任务失败: ${response.statusText}`)
      }

      const downloadsData = await response.json()
      return downloadsData.map((data: any) => this.mapToDownloadEntity(data))
    } catch (error) {
      console.error('获取活跃下载任务失败:', error)
      throw error
    }
  }

  /**
   * 创建新的下载任务
   */
  async create(download: Download): Promise<Download> {
    try {
      const downloadData = {
        userId: download.detail.userId,
        movieId: download.detail.movieId,
        movieTitle: download.detail.movieTitle,
        quality: download.detail.quality,
        format: download.detail.format,
        fileSize: download.detail.fileSize || 0,
        downloadUrl: download.detail.downloadUrl,
        priority: download.detail.priority,
      }

      const response = await fetch('/api/downloads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(downloadData),
      })

      if (!response.ok) {
        throw new Error(`创建下载任务失败: ${response.statusText}`)
      }

      const createdDownloadData = await response.json()
      const createdDownload = this.mapToDownloadEntity(createdDownloadData)

      // 缓存新下载任务
      this.setCache(createdDownload.detail.id, createdDownload)

      return createdDownload
    } catch (error) {
      console.error('创建下载任务失败:', error)
      throw error
    }
  }

  /**
   * 更新下载进度
   */
  async updateProgress(
    downloadId: string,
    progress: {
      downloadedSize: number
      speed: number
      percentage: number
    }
  ): Promise<void> {
    try {
      const response = await fetch(`/api/downloads/${downloadId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(progress),
      })

      if (!response.ok) {
        throw new Error(`更新下载进度失败: ${response.statusText}`)
      }

      // 清除缓存，强制下次重新获取
      this.clearCache(downloadId)
    } catch (error) {
      console.error('更新下载进度失败:', error)
      throw error
    }
  }

  /**
   * 暂停下载任务
   */
  async pauseDownload(downloadId: string): Promise<void> {
    try {
      const response = await fetch(`/api/downloads/${downloadId}/pause`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`暂停下载任务失败: ${response.statusText}`)
      }

      // 清除缓存
      this.clearCache(downloadId)
    } catch (error) {
      console.error('暂停下载任务失败:', error)
      throw error
    }
  }

  /**
   * 恢复下载任务
   */
  async resumeDownload(downloadId: string): Promise<void> {
    try {
      const response = await fetch(`/api/downloads/${downloadId}/resume`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`恢复下载任务失败: ${response.statusText}`)
      }

      // 清除缓存
      this.clearCache(downloadId)
    } catch (error) {
      console.error('恢复下载任务失败:', error)
      throw error
    }
  }

  /**
   * 取消下载任务
   */
  async cancelDownload(downloadId: string, reason?: string): Promise<void> {
    try {
      const response = await fetch(`/api/downloads/${downloadId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ reason }),
      })

      if (!response.ok) {
        throw new Error(`取消下载任务失败: ${response.statusText}`)
      }

      // 清除缓存
      this.clearCache(downloadId)
    } catch (error) {
      console.error('取消下载任务失败:', error)
      throw error
    }
  }

  /**
   * 重试下载任务
   */
  async retryDownload(downloadId: string): Promise<void> {
    try {
      const response = await fetch(`/api/downloads/${downloadId}/retry`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`重试下载任务失败: ${response.statusText}`)
      }

      // 清除缓存
      this.clearCache(downloadId)
    } catch (error) {
      console.error('重试下载任务失败:', error)
      throw error
    }
  }

  /**
   * 获取下载统计信息
   */
  async getDownloadStats(userId: string): Promise<{
    total: number
    completed: number
    failed: number
    inProgress: number
  }> {
    try {
      const url = userId
        ? `/api/users/${userId}/download-stats`
        : '/api/downloads/stats'

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`获取下载统计失败: ${response.statusText}`)
      }

      const stats = await response.json()
      // 转换数据结构以匹配接口定义
      return {
        total: stats.totalDownloads || 0,
        completed: stats.completedDownloads || 0,
        failed: stats.failedDownloads || 0,
        inProgress: stats.activeDownloads || 0,
      }
    } catch (error) {
      console.error('获取下载统计失败:', error)
      throw error
    }
  }

  /**
   * 清理已完成的下载任务
   */
  async cleanupCompletedDownloads(
    userId: string,
    olderThanDays: number = 30
  ): Promise<number> {
    try {
      const response = await fetch(`/api/users/${userId}/downloads/cleanup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ olderThanDays }),
      })

      if (!response.ok) {
        throw new Error(`清理下载任务失败: ${response.statusText}`)
      }

      const result = await response.json()
      return result.deletedCount || 0
    } catch (error) {
      console.error('清理下载任务失败:', error)
      throw error
    }
  }

  /**
   * 获取下载历史记录
   */
  async getDownloadHistory(
    userId: string,
    filters?: {
      status?: string
      dateRange?: { start: Date; end: Date }
      limit?: number
      offset?: number
    }
  ): Promise<{
    downloads: Download[]
    total: number
  }> {
    try {
      const params = new URLSearchParams()

      if (filters?.status) {
        params.append('status', filters.status)
      }

      if (filters?.dateRange) {
        params.append('startDate', filters.dateRange.start.toISOString())
        params.append('endDate', filters.dateRange.end.toISOString())
      }

      if (filters?.limit) {
        params.append('limit', filters.limit.toString())
      }

      if (filters?.offset) {
        params.append('offset', filters.offset.toString())
      }

      const response = await fetch(
        `/api/users/${userId}/download-history?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`获取下载历史失败: ${response.statusText}`)
      }

      const result = await response.json()

      return {
        downloads: result.downloads.map((data: any) =>
          this.mapToDownloadEntity(data)
        ),
        total: result.total,
      }
    } catch (error) {
      console.error('获取下载历史失败:', error)
      throw error
    }
  }

  // 私有辅助方法

  /**
   * 从缓存获取数据
   */
  private getFromCache(id: string): Download | null {
    const cached = this.cache.get(id)
    const expiry = this.cacheExpiry.get(id)

    if (cached && expiry && Date.now() < expiry) {
      return cached
    }

    // 缓存过期，清除
    this.cache.delete(id)
    this.cacheExpiry.delete(id)
    return null
  }

  /**
   * 设置缓存
   */
  private setCache(id: string, download: Download): void {
    this.cache.set(id, download)
    this.cacheExpiry.set(id, Date.now() + this.CACHE_DURATION)
  }

  /**
   * 清除缓存
   */
  private clearCache(id: string): void {
    this.cache.delete(id)
    this.cacheExpiry.delete(id)
  }

  /**
   * 获取认证令牌
   */
  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || ''
  }

  /**
   * 将API数据映射为下载实体
   */
  private mapToDownloadEntity(data: any): Download {
    return {
      detail: {
        id: data.id,
        userId: data.userId,
        movieId: data.movieId,
        movieTitle: data.movieTitle,
        quality: data.quality,
        format: data.format,
        fileSize: data.fileSize,
        downloadedSize: data.downloadedSize || 0,
        downloadUrl: data.downloadUrl,
        savePath: data.savePath,
        status: data.status,
        progress: data.progress || 0,
        speed: data.speed ? { value: data.speed, unit: 'MB/s' } : undefined,
        priority: data.priority || 'normal',
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
        error: data.error,
      },
    } as Download
  }

  /**
   * 将下载实体映射为API数据格式
   */
  /**
   * 根据影片ID查找下载任务
   */
  async findByMovieId(movieId: string): Promise<Download[]> {
    try {
      const response = await fetch(`/api/downloads/movie/${movieId}`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`查找影片下载任务失败: ${response.statusText}`)
      }

      const result = await response.json()
      return result.downloads.map((data: any) => this.mapToDownloadEntity(data))
    } catch (error) {
      console.error('查找影片下载任务失败:', error)
      return []
    }
  }

  /**
   * 更新下载任务
   */
  async update(download: Download): Promise<Download> {
    try {
      const downloadData = this.mapFromDownloadEntity(download)

      const response = await fetch(`/api/downloads/${download.detail.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(downloadData),
      })

      if (!response.ok) {
        throw new Error(`更新下载任务失败: ${response.statusText}`)
      }

      const updatedData = await response.json()
      const updatedDownload = this.mapToDownloadEntity(updatedData)

      // 更新缓存
      this.setCache(updatedDownload.detail.id, updatedDownload)

      return updatedDownload
    } catch (error) {
      console.error('更新下载任务失败:', error)
      throw error
    }
  }

  private mapFromDownloadEntity(download: Download): any {
    return {
      id: download.detail.id,
      userId: download.detail.userId,
      movieId: download.detail.movieId,
      movieTitle: download.detail.movieTitle,
      quality: download.detail.quality,
      format: download.detail.format,
      fileSize: download.detail.fileSize,
      downloadedSize: download.detail.downloadedSize,
      downloadUrl: download.detail.downloadUrl,
      savePath: download.detail.savePath,
      status: download.detail.status,
      progress: download.detail.progress,
      speed: download.detail.speed?.value,
      priority: download.detail.priority,
      updatedAt: new Date().toISOString(),
      error: download.detail.error,
    }
  }
}
