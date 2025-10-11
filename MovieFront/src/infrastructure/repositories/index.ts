// 仓储层统一导出
// 这里可以添加具体的仓储实现

// 基础仓储接口
export interface Repository<T, ID = string> {
  findById(id: ID): Promise<T | null>
  findAll(): Promise<T[]>
  save(entity: T): Promise<T>
  delete(id: ID): Promise<void>
}

// 用户仓储接口
export interface UserRepository extends Repository<any> {
  findByEmail(email: string): Promise<any | null>
  findByUsername(username: string): Promise<any | null>
}

// 影片仓储接口
export interface MovieRepository extends Repository<any> {
  findByGenre(genre: string): Promise<any[]>
  findByYear(year: number): Promise<any[]>
  search(query: string): Promise<any[]>
}

// 下载仓储接口
export interface DownloadRepository extends Repository<any> {
  findByUserId(userId: string): Promise<any[]>
  findActiveDownloads(): Promise<any[]>
}

// 导出仓储实现
import { DownloadRepositoryImpl } from './DownloadRepositoryImpl'
import { MovieRepositoryImpl } from './MovieRepositoryImpl'
import { UserRepositoryImpl } from './UserRepositoryImpl'

// 导出仓储接口（避免冲突）
export type { MovieRepository as IMovieRepository } from './MovieRepository'
export type { UserRepository as IUserRepository } from './UserRepository'
export type { DownloadRepository as IDownloadRepository } from './DownloadRepository'

// 创建仓储实例
export const userRepository = new UserRepositoryImpl()
export const movieRepository = new MovieRepositoryImpl()
export const downloadRepository = new DownloadRepositoryImpl()
