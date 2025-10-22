// API服务工厂，根据配置自动选择Mock或真实API服务
import { apiConfig } from '@infrastructure/config/ApiConfig'
import { ICollectionApi, IHomeApi } from '@infrastructure/api/interfaces'
import { MockCollectionApiService, MockHomeApiService } from '@infrastructure/api/MockApiService'
import type { ApiResponse, PaginatedResponse } from '@infrastructure/api/interfaces/ICollectionApi'
import type { PhotoItem, LatestItem, CollectionItem } from '@types-movie'
import type { HotItem } from '@types-movie'
import type { 
  HotContentQueryParams, 
  HomeDataResponse, 
  CollectionsQueryParams, 
  PhotosQueryParams, 
  LatestUpdatesQueryParams,
  HomeDataParams 
} from '@infrastructure/api/interfaces/IHomeApi'

// 真实API服务类（占位符，待实现）
class RealCollectionApiService implements ICollectionApi {
  async getCollections(params: any): Promise<any> {
    // TODO: 实现真实API调用
    throw new Error('真实API服务尚未实现')
  }

  async getCollectionDetail(id: string): Promise<any> {
    // TODO: 实现真实API调用
    throw new Error('真实API服务尚未实现')
  }

  async getCollectionMovies(id: string, params: any): Promise<any> {
    // TODO: 实现真实API调用
    throw new Error('真实API服务尚未实现')
  }

  async getHotCollections(limit: number): Promise<any> {
    // TODO: 实现真实API调用
    throw new Error('真实API服务尚未实现')
  }

  async getLatestCollections(limit: number): Promise<any> {
    // TODO: 实现真实API调用
    throw new Error('真实API服务尚未实现')
  }

  async searchCollections(query: string, filters?: any): Promise<any> {
    // TODO: 实现真实API调用
    throw new Error('真实API服务尚未实现')
  }

  async getRecommendedCollections(limit: number): Promise<any> {
    // TODO: 实现真实API调用
    throw new Error('真实API服务尚未实现')
  }

  async getCollectionsByCategory(category: string, params: any): Promise<any> {
    // TODO: 实现真实API调用
    throw new Error('真实API服务尚未实现')
  }

  async existsCollection(id: string): Promise<any> {
    // TODO: 实现真实API调用
    throw new Error('真实API服务尚未实现')
  }

  async getCollectionStats(id: string): Promise<any> {
    // TODO: 实现真实API调用
    throw new Error('真实API服务尚未实现')
  }
}

class RealHomeApiService implements IHomeApi {
  async getHomeData(): Promise<ApiResponse<HomeDataResponse>> {
    // TODO: 实现真实API调用
    throw new Error('真实API服务尚未实现')
  }

  async getCollections(params?: CollectionsQueryParams): Promise<ApiResponse<CollectionItem[]>> {
    // TODO: 实现真实API调用
    throw new Error('真实API服务尚未实现')
  }

  async getPhotos(params?: PhotosQueryParams): Promise<ApiResponse<PhotoItem[]>> {
    // TODO: 实现真实API调用
    throw new Error('真实API服务尚未实现')
  }

  async getLatestUpdates(params?: LatestUpdatesQueryParams): Promise<ApiResponse<LatestItem[]>> {
    // TODO: 实现真实API调用
    throw new Error('真实API服务尚未实现')
  }

  async getHotContent(params?: HotContentQueryParams): Promise<ApiResponse<HotItem[]>> {
    // TODO: 实现真实API调用
    throw new Error('真实API服务尚未实现')
  }

  async getDailyHot(limit?: number): Promise<ApiResponse<HotItem[]>> {
    // TODO: 实现真实API调用
    throw new Error('真实API服务尚未实现')
  }

  async getFeaturedCollections(limit?: number): Promise<ApiResponse<CollectionItem[]>> {
    // TODO: 实现真实API调用
    throw new Error('真实API服务尚未实现')
  }

  async getLatestPhotos(limit?: number): Promise<ApiResponse<PhotoItem[]>> {
    // TODO: 实现真实API调用
    throw new Error('真实API服务尚未实现')
  }
}

// API服务工厂类
export class ApiServiceFactory {
  private static collectionApiInstance: ICollectionApi | null = null
  private static homeApiInstance: IHomeApi | null = null

  // 创建合集API服务实例
  static createCollectionApiService(): ICollectionApi {
    if (!ApiServiceFactory.collectionApiInstance) {
      if (apiConfig.isMockEnabled()) {
        console.log('🔧 使用Mock合集API服务')
        ApiServiceFactory.collectionApiInstance = new MockCollectionApiService()
      } else {
        console.log('🌐 使用真实合集API服务')
        ApiServiceFactory.collectionApiInstance = new RealCollectionApiService()
      }
    }
    // 确保返回非null值
    if (!ApiServiceFactory.collectionApiInstance) {
      throw new Error('Failed to create collection API service')
    }
    return ApiServiceFactory.collectionApiInstance
  }

  // 创建首页API服务实例
  static createHomeApiService(): IHomeApi {
    if (!ApiServiceFactory.homeApiInstance) {
      if (apiConfig.isMockEnabled()) {
        console.log('🔧 使用Mock首页API服务')
        ApiServiceFactory.homeApiInstance = new MockHomeApiService()
      } else {
        console.log('🌐 使用真实首页API服务')
        ApiServiceFactory.homeApiInstance = new RealHomeApiService()
      }
    }
    return ApiServiceFactory.homeApiInstance
  }

  // 重置服务实例（用于环境切换）
  static resetServices(): void {
    ApiServiceFactory.collectionApiInstance = null
    ApiServiceFactory.homeApiInstance = null
    console.log('🔄 API服务实例已重置')
  }

  // 切换到Mock模式
  static switchToMock(): void {
    apiConfig.toggleMock(true)
    ApiServiceFactory.resetServices()
    console.log('🔧 已切换到Mock模式')
  }

  // 切换到真实API模式
  static switchToReal(): void {
    apiConfig.toggleMock(false)
    ApiServiceFactory.resetServices()
    console.log('🌐 已切换到真实API模式')
  }

  // 获取当前模式信息
  static getCurrentMode(): { isMock: boolean; environment: string } {
    return {
      isMock: apiConfig.isMockEnabled(),
      environment: apiConfig.getEnvironment()
    }
  }
}

// 导出便捷方法
export const createCollectionApiService = () => ApiServiceFactory.createCollectionApiService()
export const createHomeApiService = () => ApiServiceFactory.createHomeApiService()
export const switchToMockMode = () => ApiServiceFactory.switchToMock()
export const switchToRealMode = () => ApiServiceFactory.switchToReal()
export const getCurrentApiMode = () => ApiServiceFactory.getCurrentMode()