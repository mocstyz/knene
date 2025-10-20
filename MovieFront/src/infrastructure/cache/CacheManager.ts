/**
 * @fileoverview 缓存管理器
 * @description 提供内存缓存、本地存储缓存和IndexedDB缓存的统一接口。
 *              支持多级缓存策略、过期管理和缓存预热功能。
 *              基于LRU算法实现内存缓存管理，提供企业级的缓存解决方案。
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-19 15:06:15
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { storageManager } from '@infrastructure/storage/StorageService'

// 缓存配置选项接口，定义缓存的行为和存储策略配置
export interface CacheOptions {
  ttl?: number // 缓存生存时间（毫秒），0表示永不过期
  maxSize?: number // 最大缓存大小（字节），超出时自动清理
  strategy?: 'memory' | 'localStorage' | 'indexedDB' | 'multi-level' // 缓存存储策略
  serialize?: boolean // 是否序列化存储，复杂对象建议启用
  compress?: boolean // 是否压缩存储，大数据建议启用
}

// 缓存项接口，定义单个缓存项的完整信息结构
export interface CacheItem<T = unknown> {
  key: string // 缓存键名
  value: T // 缓存值
  timestamp: number // 创建时间戳
  ttl?: number // 生存时间（毫秒）
  accessCount: number // 访问次数，用于LRU算法
  lastAccessed: number // 最后访问时间
  size: number // 缓存项大小（字节）
}

// 缓存统计信息接口，提供缓存性能和使用情况的详细数据
export interface CacheStats {
  totalItems: number // 总缓存项数量
  totalSize: number // 总缓存大小（字节）
  hitRate: number // 命中率，0-1之间
  missRate: number // 未命中率，0-1之间
  evictionCount: number // 被淘汰的缓存项数量
}

// 内存缓存类，提供基于LRU算法的内存缓存功能，支持自动过期和大小限制
class MemoryCache {
  private cache = new Map<string, CacheItem>() // 缓存存储Map
  private maxSize: number // 最大缓存大小（字节）
  private currentSize = 0 // 当前缓存大小（字节）
  private hitCount = 0 // 命中次数
  private missCount = 0 // 未命中次数
  private evictionCount = 0 // 淘汰次数

  constructor(maxSize = 100 * 1024 * 1024) {
    // 默认100MB内存缓存
    this.maxSize = maxSize
    this.startCleanupTimer()
  }

  // 设置缓存项，支持LRU淘汰策略和过期时间管理
  set<T>(key: string, value: T, options: CacheOptions = {}): void {
    const serializedValue = options.serialize ? JSON.stringify(value) : value
    const size = this.calculateSize(serializedValue)

    // 检查是否需要清理空间 - LRU淘汰策略
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
      size,
    }

    // 更新已存在的缓存项 - 先减去旧的大小
    if (this.cache.has(key)) {
      const oldItem = this.cache.get(key)!
      this.currentSize -= oldItem.size
    }

    this.cache.set(key, item)
    this.currentSize += size
  }

  // 获取缓存项，自动处理过期和访问统计
  get<T>(key: string, options: CacheOptions = {}): T | null {
    const item = this.cache.get(key)

    if (!item) {
      this.missCount++
      return null
    }

    // 检查是否过期 - 过期则删除并返回null
    if (this.isExpired(item)) {
      this.delete(key)
      this.missCount++
      return null
    }

    // 更新访问统计 - 用于LRU算法
    item.accessCount++
    item.lastAccessed = Date.now()
    this.hitCount++

    const value = options.serialize
      ? JSON.parse(item.value as string)
      : item.value
    return value as T
  }

  // 删除指定缓存项，并更新大小统计
  delete(key: string): boolean {
    const item = this.cache.get(key)
    if (item) {
      this.currentSize -= item.size
      this.cache.delete(key)
      return true
    }
    return false
  }

  // 清空所有缓存项，重置大小统计
  clear(): void {
    this.cache.clear()
    this.currentSize = 0
  }

  // 检查键是否存在且未过期
  has(key: string): boolean {
    const item = this.cache.get(key)
    return item ? !this.isExpired(item) : false
  }

  // 获取所有缓存键名
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  // 获取缓存统计信息，包括命中率、使用率等性能指标
  getStats(): CacheStats {
    const totalRequests = this.hitCount + this.missCount
    return {
      totalItems: this.cache.size,
      totalSize: this.currentSize,
      hitRate: totalRequests > 0 ? this.hitCount / totalRequests : 0,
      missRate: totalRequests > 0 ? this.missCount / totalRequests : 0,
      evictionCount: this.evictionCount,
    }
  }

  // 检查缓存项是否过期
  private isExpired(item: CacheItem): boolean {
    if (!item.ttl) return false
    return Date.now() - item.timestamp > item.ttl
  }

  // LRU淘汰策略实现 - 按最后访问时间淘汰最少使用的缓存项
  private evictLRU(requiredSize: number): void {
    const items = Array.from(this.cache.values())

    // 按最后访问时间排序 - 最早访问的排在前面
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

  // 计算数据大小 - 估算内存占用的字节数
  private calculateSize(value: unknown): number {
    if (typeof value === 'string') {
      return value.length * 2 // Unicode字符占2字节
    }
    if (typeof value === 'object') {
      return JSON.stringify(value).length * 2
    }
    return 8 // 基本类型默认8字节
  }

  // 启动定时清理任务 - 定期清理过期缓存项
  private startCleanupTimer(): void {
    setInterval(() => {
      this.cleanup()
    }, 60000) // 每分钟清理一次过期项
  }

  // 清理所有过期的缓存项，释放内存空间
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

// 缓存管理器主类，提供多级缓存的统一接口和高级缓存功能
export class CacheManager {
  private memoryCache: MemoryCache // 内存缓存实例
  private defaultOptions: Required<CacheOptions> // 默认缓存配置

  constructor(options: CacheOptions = {}) {
    // 设置默认配置 - 提供合理的默认值
    this.defaultOptions = {
      ttl: 5 * 60 * 1000, // 默认5分钟过期
      maxSize: 100 * 1024 * 1024, // 默认100MB大小限制
      strategy: 'multi-level', // 默认多级缓存策略
      serialize: true, // 默认启用序列化
      compress: false, // 默认不压缩
    }

    Object.assign(this.defaultOptions, options)
    this.memoryCache = new MemoryCache(this.defaultOptions.maxSize)
  }

  // 设置缓存项，支持多种存储策略和异步持久化
  async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): Promise<void> {
    const mergedOptions = { ...this.defaultOptions, ...options }
    const strategy = mergedOptions.strategy

    switch (strategy) {
      case 'memory':
        this.memoryCache.set(key, value, mergedOptions)
        break

      case 'localStorage':
        storageManager.localStorage.set(key, value, {
          ttl: mergedOptions.ttl,
          encrypt: false,
        })
        break

      case 'indexedDB':
        await storageManager.indexedDB.put('cache', {
          key,
          value,
          timestamp: Date.now(),
          ttl: mergedOptions.ttl,
          type: 'cache',
        })
        break

      case 'multi-level':
      default:
        // 多级缓存策略：内存 -> localStorage -> IndexedDB
        this.memoryCache.set(key, value, mergedOptions)

        // 异步存储到持久化层 - 不阻塞主线程
        setTimeout(async () => {
          try {
            storageManager.localStorage.set(key, value, {
              ttl: mergedOptions.ttl,
              encrypt: false,
            })

            await storageManager.indexedDB.put('cache', {
              key,
              value,
              timestamp: Date.now(),
              ttl: mergedOptions.ttl,
              type: 'cache',
            })
          } catch (error) {
            console.warn('Failed to persist cache to storage:', error)
          }
        }, 0)
        break
    }
  }

  // 获取缓存项，支持多级缓存查找和自动回填机制
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    const mergedOptions = { ...this.defaultOptions, ...options }
    const strategy = mergedOptions.strategy

    switch (strategy) {
      case 'memory':
        return this.memoryCache.get<T>(key, mergedOptions)

      case 'localStorage':
        return storageManager.localStorage.get<T>(key)

      case 'indexedDB': {
        const item = await storageManager.indexedDB.get<CacheItem<T>>(
          'cache',
          key
        )
        if (item && (!item.ttl || Date.now() - item.timestamp < item.ttl)) {
          return item.value
        }
        return null
      }

      case 'multi-level':
      default: {
        // 多级缓存查找策略 - 内存 -> localStorage -> IndexedDB
        // 1. 先查内存缓存（最快）
        let value = this.memoryCache.get<T>(key, mergedOptions)
        if (value !== null) {
          return value
        }

        // 2. 查localStorage（中等速度）
        value = storageManager.localStorage.get<T>(key)
        if (value !== null) {
          // 回填到内存缓存，提升后续访问速度
          this.memoryCache.set(key, value, mergedOptions)
          return value
        }

        // 3. 查IndexedDB（最慢但容量大）
        try {
          const item = await storageManager.indexedDB.get<CacheItem<T>>(
            'cache',
            key
          )
          if (item && (!item.ttl || Date.now() - item.timestamp < item.ttl)) {
            value = item.value
            // 回填到上级缓存，构建完整的缓存层次
            this.memoryCache.set(key, value, mergedOptions)
            storageManager.localStorage.set(key, value, {
              ttl: mergedOptions.ttl,
              encrypt: false,
            })
            return value
          }
        } catch (error) {
          console.warn('Failed to get cache from IndexedDB:', error)
        }

        return null
      }
    }
  }

  // 删除指定缓存项，支持多级缓存的同步删除
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
        // 多级缓存删除 - 同步删除所有级别的缓存项
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

  // 清空所有缓存项，根据策略清空对应存储层的数据
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
        // 多级缓存清空 - 清空所有存储层
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

  // 检查缓存项是否存在且未过期
  async has(key: string, options: CacheOptions = {}): Promise<boolean> {
    const value = await this.get(key, options)
    return value !== null
  }

  // 获取缓存键列表，支持多级缓存的键合并去重
  async keys(options: CacheOptions = {}): Promise<string[]> {
    const strategy = options.strategy || this.defaultOptions.strategy

    switch (strategy) {
      case 'memory':
        return this.memoryCache.keys()

      case 'localStorage':
        return storageManager.localStorage.keys()

      case 'indexedDB': {
        const items = await storageManager.indexedDB.getAll<CacheItem>('cache')
        return items.map(item => item.key)
      }

      case 'multi-level':
      default: {
        // 合并所有级别的键 - 去重避免重复
        const memoryKeys = this.memoryCache.keys()
        const localStorageKeys = storageManager.localStorage.keys()

        let indexedDBKeys: string[] = []
        try {
          const items =
            await storageManager.indexedDB.getAll<CacheItem>('cache')
          indexedDBKeys = items.map(item => item.key)
        } catch (error) {
          console.warn('Failed to get keys from IndexedDB:', error)
        }

        const allKeys = new Set([
          ...memoryKeys,
          ...localStorageKeys,
          ...indexedDBKeys,
        ])
        return Array.from(allKeys)
      }
    }
  }

  // 获取缓存统计信息，目前只返回内存缓存的统计
  getStats(): CacheStats {
    return this.memoryCache.getStats()
  }

  // 缓存预热功能，批量初始化常用数据到缓存中
  async warmup<T>(
    data: Record<string, T>,
    options: CacheOptions = {}
  ): Promise<void> {
    const promises = Object.entries(data).map(([key, value]) =>
      this.set(key, value, options)
    )

    await Promise.all(promises)
  }

  // 批量获取缓存项，提高批量操作的性能
  async getMultiple<T>(
    keys: string[],
    options: CacheOptions = {}
  ): Promise<Record<string, T | null>> {
    const promises = keys.map(async key => {
      const value = await this.get<T>(key, options)
      return [key, value] as [string, T | null]
    })

    const results = await Promise.all(promises)
    return Object.fromEntries(results)
  }

  // 批量设置缓存项，提供高效的批量缓存写入
  async setMultiple<T>(
    data: Record<string, T>,
    options: CacheOptions = {}
  ): Promise<void> {
    const promises = Object.entries(data).map(([key, value]) =>
      this.set(key, value, options)
    )

    await Promise.all(promises)
  }

  // 批量删除缓存项，支持多个键的同时删除
  async deleteMultiple(
    keys: string[],
    options: CacheOptions = {}
  ): Promise<void> {
    const promises = keys.map(key => this.delete(key, options))
    await Promise.all(promises)
  }

  // 获取或设置缓存项，如果缓存不存在则执行工厂函数获取数据
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

  // 刷新缓存项，强制重新获取数据并更新缓存
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

// 创建默认缓存管理器实例，全局单例模式使用
export const cacheManager = new CacheManager()
