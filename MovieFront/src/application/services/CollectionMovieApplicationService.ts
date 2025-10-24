/**
 * @fileoverview 合集影片应用服务
 * @description 合集影片业务逻辑的应用层服务，遵循DDD架构原则
 *              协调领域层和基础设施层，提供合集影片相关的业务功能
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { CollectionRepository } from '@infrastructure/repositories/CollectionRepository'
import type { MovieDetail, CollectionItem } from '@types-movie'

// 合集影片查询选项接口
export interface CollectionMovieQueryOptions {
  collectionId: string
  page?: number
  pageSize?: number
  sortBy?: 'latest' | 'rating' | 'title' | 'top-rated'
}

// 合集影片查询结果接口
export interface CollectionMovieResult {
  movies: MovieDetail[]
  collectionInfo: CollectionItem | null
  total: number
}

// 合集影片应用服务类
export class CollectionMovieApplicationService {
  private collectionRepository: CollectionRepository

  constructor() {
    this.collectionRepository = new CollectionRepository()
  }

  // 获取合集影片列表
  async getCollectionMovies(options: CollectionMovieQueryOptions): Promise<CollectionMovieResult> {
    const { collectionId, page = 1, pageSize = 12, sortBy } = options

    try {
      // 获取合集信息
      const collectionInfo = await this.collectionRepository.getCollectionDetail(collectionId)

      // 获取合集中的影片列表
      const moviesResponse = await this.collectionRepository.getCollectionMovies(
        collectionId,
        {
          page,
          pageSize,
          sortBy
        }
      )

      return {
        movies: moviesResponse.data,
        collectionInfo,
        total: moviesResponse.pagination.total
      }
    } catch (error) {
      console.error('获取合集影片失败:', error)
      throw error
    }
  }

  // 获取合集影片总数
  async getCollectionMoviesCount(collectionId: string): Promise<number> {
    try {
      const result = await this.getCollectionMovies({
        collectionId,
        page: 1,
        pageSize: 1
      })
      return result.total
    } catch (error) {
      console.error('获取合集影片总数失败:', error)
      return 0
    }
  }
}
