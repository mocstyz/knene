/**
 * 缓存管理器
 * 提供内存缓存、本地存储缓存和IndexedDB缓存的统一接口
 * 支持多级缓存策略、过期管理和缓存预热
 */

import { storageManager } from '@/infrastructure/storage/StorageService'

export interface CacheOptions {
  ttl?: number // 生存时间（毫秒）
  maxSize?: number // 最大缓存大小
  strategy?: 'memory' | 'localStorage' | 'indexedDB' | 'multi-level'
  serialize?: boolean // 是否序列化
  compress?: boolean // 是否压缩
}

export interface CacheItem<T = any> {
  key: string
  value: T
  timestamp: number
  ttl?: number
  accessCount: number
  lastAccessed: number
  size: number
}

export interface CacheStats {
  totalItems: number
  totalSize: number
  hitRate: number
  missRate: number
  evictionCount: number
}

/**
 * 内存缓存类
 */
class MemoryCache {
  private cache = new Map<string, CacheItem>()
  private maxSize: number
  private currentSize = 0
  private hitCount = 0
  private missCount = 0
  private evictionCount = 0

  constructor(maxSize = 100 * 1024 * 1024) { // 默认100MB
    this.maxSize = maxSize
    this.startCleanupTimer()
  }

  /**
   * 设置缓存
   */
  set<T>(key: string, value: T, options: CacheOptions = {}): void {
    const serializedValue = options.serialize ? JSON.stringify(value) : value
    const size = this.calculateSize(serializedValue)

    // 检查是否需要清理空间
    if (this.currentSize + size > this.maxSize) {
      this.evictLRU(size)
    }

    const item: CacheItem<T> = {
      key,
      value: serializedValue as T,
      timestamp: Date.now(),
      ttl: options.ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
      size
    }

    // 如果键已存在，先减去旧的大小
    if (this.cache.has(key)) {
      const oldItem = this.cache.get(key)!
      this.currentSize -= oldItem.size
    }

    this.cache.set(key, item)
    this.currentSize += size
  }

  /**
   * 获取缓存
   */
  get<T>(key: string, options: CacheOptions = {}): T | null {
    const item = this.cache.get(key)

    if (!item) {
      this.missCount++
      return null
    }

    // 检查是否过期
    if (this.isExpired(item)) {
      this.delete(key)
      this.missCount++
      return null
    }

    // 更新访问信息
    item.accessCount++
    item.lastAccessed = Date.now()
    this.hitCount++

    const value = options.serialize ? JSON.parse(item.value as string) : item.value
    return value as T
  }

  /**
   * 删除缓存
   */
  delete(key: string): boolean {
    const item = this.cache.get(key)
    if (item) {
      this.currentSize -= item.size
      this.cache.delete(key)
      return true
    }
    return false
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear()
    this.currentSize = 0
  }

  /**
   * 检查键是否存在
   */
  has(key: string): boolean {
    const item = this.cache.get(key)
    return item ? !this.isExpired(item) : false
  }

  /**
   * 获取所有键
   */
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * 获取缓存统计
   */
  getStats(): CacheStats {
    const totalRequests = this.hitCount + this.missCount
    return {
      totalItems: this.cache.size,
      totalSize: this.currentSize,
      hitRate: totalRequests > 0 ? this.hitCount / totalRequests : 0,
      missRate: totalRequests > 0 ? this.missCount / totalRequests : 0,
      evictionCount: this.evictionCount
    }
  }

  /**
   * 检查项目是否过期
   */
  private isExpired(item: CacheItem): boolean {
    if (!item.ttl) return false
    return Date.now() - item.timestamp > item.ttl
  }

  /**
   * LRU淘汰策略
   */
  private evictLRU(requiredSize: number): void {
    const items = Array.from(this.cache.values())
    
    // 按最后访问时间排序
    items.sort((a, b) => a.lastAccessed - b.lastAccessed)

    let freedSize = 0
    for (const item of items) {
      this.cache.delete(item.key)
      this.currentSize -= item.size
      freedSize += item.size
      this.evictionCount++

      if (freedSize >= requiredSize) {
        break
      }
    }
  }

  /**
   * 计算数据大小
   */
  private calculateSize(value: any): number {
    if (typeof value === 'string') {
      return value.length * 2 // Unicode字符占2字节
    }
    if (typeof value === 'object') {
      return JSON.stringify(value).length * 2
    }
    return 8 // 基本类型默认8字节
  }

  /**
   * 启动清理定时器
   */
  private startCleanupTimer(): void {
    setInterval(() => {
      this.cleanup()
    }, 60000) // 每分钟清理一次
  }

  /**
   * 清理过期项目
   */
  private cleanup(): void {
    const expiredKeys: string[] = []
    
    this.cache.forEach((item, key) => {
      if (this.isExpired(item)) {
        expiredKeys.push(key)
      }
    })

    expiredKeys.forEach(key => this.delete(key))
  }
}

/**
 * 缓存管理器主类
 */
export class CacheManager {
  private memoryCache: MemoryCache
  private defaultOptions: Required<CacheOptions>

  constructor(options: CacheOptions = {}) {
    this.defaultOptions = {
      ttl: 5 * 60 * 1000, // 默认5分钟
      maxSize: 100 * 1024 * 1024, // 默认100MB
      strategy: 'multi-level',
      serialize: true,
      compress: false
    }

    Object.assign(this.defaultOptions, options)
    this.memoryCache = new MemoryCache(this.defaultOptions.maxSize)
  }

  /**
   * 设置缓存
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const mergedOptions = { ...this.defaultOptions, ...options }
    const strategy = mergedOptions.strategy

    switch (strategy) {
      case 'memory':
        this.memoryCache.set(key, value, mergedOptions)
        break

      case 'localStorage':
        storageManager.localStorage.set(key, value, {
          ttl: mergedOptions.ttl,
          encrypt: false
        })
        break

      case 'indexedDB':
        await storageManager.indexedDB.put('cache', {
          key,
          value,
          timestamp: Date.now(),
          ttl: mergedOptions.ttl,
          type: 'cache'
        })
        break

      case 'multi-level':
      default:
        // 多级缓存：内存 -> localStorage -> IndexedDB
        this.memoryCache.set(key, value, mergedOptions)
        
        // 异步存储到持久化层
        setTimeout(async () => {
          try {
            storageManager.localStorage.set(key, value, {
              ttl: mergedOptions.ttl,
              encrypt: false
            })
            
            await storageManager.indexedDB.put('cache', {
              key,
              value,
              timestamp: Date.now(),
              ttl: mergedOptions.ttl,
              type: 'cache'
            })
          } catch (error) {
            console.warn('Failed to persist cache to storage:', error)
          }
        }, 0)
        break
    }
  }

  /**
   * 获取缓存
   */
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    const mergedOptions = { ...this.defaultOptions, ...options }
    const strategy = mergedOptions.strategy

    switch (strategy) {
      case 'memory':
        return this.memoryCache.get<T>(key, mergedOptions)

      case 'localStorage':
        return storageManager.localStorage.get<T>(key)

      case 'indexedDB':
        const item = await storageManager.indexedDB.get<any>('cache', key)
        if (item && (!item.ttl || Date.now() - item.timestamp < item.ttl)) {
          return item.value
        }
        return null

      case 'multi-level':
      default:
        // 多级缓存查找
        // 1. 先查内存缓存
        let value = this.memoryCache.get<T>(key, mergedOptions)
        if (value !== null) {
          return value
        }

        // 2. 查localStorage
        value = storageManager.localStorage.get<T>(key)
        if (value !== null) {
          // 回填到内存缓存
          this.memoryCache.set(key, value, mergedOptions)
          return value
        }

        // 3. 查IndexedDB
        try {
          const item = await storageManager.indexedDB.get<any>('cache', key)
          if (item && (!item.ttl || Date.now() - item.timestamp < item.ttl)) {
            value = item.value
            // 回填到上级缓存
            this.memoryCache.set(key, value, mergedOptions)
            storageManager.localStorage.set(key, value, {
              ttl: mergedOptions.ttl,
              encrypt: false
            })
            return value
          }
        } catch (error) {
          console.warn('Failed to get cache from IndexedDB:', error)
        }

        return null
    }
  }

  /**
   * 删除缓存
   */
  async delete(key: string, options: CacheOptions = {}): Promise<void> {
    const strategy = options.strategy || this.defaultOptions.strategy

    switch (strategy) {
      case 'memory':
        this.memoryCache.delete(key)
        break

      case 'localStorage':
        storageManager.localStorage.remove(key)
        break

      case 'indexedDB':
        await storageManager.indexedDB.delete('cache', key)
        break

      case 'multi-level':
      default:
        // 删除所有级别的缓存
        this.memoryCache.delete(key)
        storageManager.localStorage.remove(key)
        try {
          await storageManager.indexedDB.delete('cache', key)
        } catch (error) {
          console.warn('Failed to delete cache from IndexedDB:', error)
        }
        break
    }
  }

  /**
   * 清空缓存
   */
  async clear(options: CacheOptions = {}): Promise<void> {
    const strategy = options.strategy || this.defaultOptions.strategy

    switch (strategy) {
      case 'memory':
        this.memoryCache.clear()
        break

      case 'localStorage':
        storageManager.localStorage.clear()
        break

      case 'indexedDB':
        await storageManager.indexedDB.clear('cache')
        break

      case 'multi-level':
      default:
        this.memoryCache.clear()
        storageManager.localStorage.clear()
        try {
          await storageManager.indexedDB.clear('cache')
        } catch (error) {
          console.warn('Failed to clear IndexedDB cache:', error)
        }
        break
    }
  }

  /**
   * 检查缓存是否存在
   */
  async has(key: string, options: CacheOptions = {}): Promise<boolean> {
    const value = await this.get(key, options)
    return value !== null
  }

  /**
   * 获取缓存键列表
   */
  async keys(options: CacheOptions = {}): Promise<string[]> {
    const strategy = options.strategy || this.defaultOptions.strategy

    switch (strategy) {
      case 'memory':
        return this.memoryCache.keys()

      case 'localStorage':
        return storageManager.localStorage.keys()

      case 'indexedDB':
        const items = await storageManager.indexedDB.getAll<any>('cache')
        return items.map(item => item.key)

      case 'multi-level':
      default:
        // 合并所有级别的键
        const memoryKeys = this.memoryCache.keys()
        const localStorageKeys = storageManager.localStorage.keys()
        
        let indexedDBKeys: string[] = []
        try {
          const items = await storageManager.indexedDB.getAll<any>('cache')
          indexedDBKeys = items.map(item => item.key)
        } catch (error) {
          console.warn('Failed to get keys from IndexedDB:', error)
        }

        const allKeys = new Set([...memoryKeys, ...localStorageKeys, ...indexedDBKeys])
        return Array.from(allKeys)
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): CacheStats {
    return this.memoryCache.getStats()
  }

  /**
   * 缓存预热
   */
  async warmup<T>(data: Record<string, T>, options: CacheOptions = {}): Promise<void> {
    const promises = Object.entries(data).map(([key, value]) =>
      this.set(key, value, options)
    )

    await Promise.all(promises)
  }

  /**
   * 批量获取
   */
  async getMultiple<T>(keys: string[], options: CacheOptions = {}): Promise<Record<string, T | null>> {
    const promises = keys.map(async key => {
      const value = await this.get<T>(key, options)
      return [key, value] as [string, T | null]
    })

    const results = await Promise.all(promises)
    return Object.fromEntries(results)
  }

  /**
   * 批量设置
   */
  async setMultiple<T>(data: Record<string, T>, options: CacheOptions = {}): Promise<void> {
    const promises = Object.entries(data).map(([key, value]) =>
      this.set(key, value, options)
    )

    await Promise.all(promises)
  }

  /**
   * 批量删除
   */
  async deleteMultiple(keys: string[], options: CacheOptions = {}): Promise<void> {
    const promises = keys.map(key => this.delete(key, options))
    await Promise.all(promises)
  }

  /**
   * 获取或设置缓存（如果不存在则执行回调函数）
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T> | T,
    options: CacheOptions = {}
  ): Promise<T> {
    let value = await this.get<T>(key, options)
    
    if (value === null) {
      value = await factory()
      await this.set(key, value, options)
    }

    return value
  }

  /**
   * 刷新缓存（重新获取数据并更新缓存）
   */
  async refresh<T>(
    key: string,
    factory: () => Promise<T> | T,
    options: CacheOptions = {}
  ): Promise<T> {
    const value = await factory()
    await this.set(key, value, options)
    return value
  }
}

// 创建默认缓存管理器实例
export const cacheManager = new CacheManager()