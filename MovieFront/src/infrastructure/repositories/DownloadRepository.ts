import { Download } from '@domain/entities/Download'

export interface DownloadRepository {
  create(download: Download): Promise<Download>
  findById(id: string): Promise<Download | null>
  findByUserId(userId: string): Promise<Download[]>
  findByMovieId(movieId: string): Promise<Download[]>
  findActiveDownloads(userId: string): Promise<Download[]>
  update(download: Download): Promise<Download>
  delete(id: string): Promise<boolean>
  getDownloadStats(userId: string): Promise<{
    total: number
    completed: number
    failed: number
    inProgress: number
  }>
}
