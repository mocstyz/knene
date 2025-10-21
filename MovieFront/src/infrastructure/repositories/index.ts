/**
 * @fileoverview 仓储层统一导出模块
 * @description 提供仓储层的统一入口，包含基础仓储接口、各领域仓储接口和实现类的导出
 * 遵循DDD架构中的仓储模式，提供数据访问的抽象层
 * @created 2025-10-19 15:30:47
 * @updated 2025-10-21 14:41:39
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 基础仓储接口，定义通用的CRUD操作
export interface Repository<T, ID = string> {
  findById(id: ID): Promise<T | null>
  findAll(): Promise<T[]>
  save(entity: T): Promise<T>
  delete(id: ID): Promise<void>
}

// 用户仓储接口，扩展基础仓储接口
export interface UserRepository extends Repository<any> {
  findByEmail(email: string): Promise<any | null>
  findByUsername(username: string): Promise<any | null>
}

// 影片仓储接口，扩展基础仓储接口
export interface MovieRepository extends Repository<any> {
  findByGenre(genre: string): Promise<any[]>
  findByYear(year: number): Promise<any[]>
  search(query: string): Promise<any[]>
}

// 下载仓储接口，扩展基础仓储接口
export interface DownloadRepository extends Repository<any> {
  findByUserId(userId: string): Promise<any[]>
  findActiveDownloads(): Promise<any[]>
}

// 导出仓储实现类
import { DownloadRepositoryImpl } from './DownloadRepositoryImpl'
import { MovieRepositoryImpl } from './MovieRepositoryImpl'
import { UserRepositoryImpl } from './UserRepositoryImpl'

// 导出具体的仓储接口（避免命名冲突）
export type { MovieRepository as IMovieRepository } from './MovieRepository'
export type { UserRepository as IUserRepository } from './UserRepository'
export type { DownloadRepository as IDownloadRepository } from './DownloadRepository'

// 创建并导出仓储实例
export const userRepository = new UserRepositoryImpl()
export const movieRepository = new MovieRepositoryImpl()
export const downloadRepository = new DownloadRepositoryImpl()

// 仓储层统一导出
export * from './HomeRepository'
export * from './ICollectionRepository'
export * from './IHomeRepository'
export * from './CollectionRepository'
