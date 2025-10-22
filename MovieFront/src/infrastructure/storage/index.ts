/**
 * @fileoverview 存储基础设施层统一导出模块
 * @description 提供存储层的统一入口，包含本地存储、会话存储、内存存储等多种存储方式的抽象和实现
 * 遵循DDD架构中的基础设施层模式，提供数据持久化的抽象层
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 存储基础设施层统一导出
import { LocalStorageManager } from './localStorage'
import { SessionStorageManager } from './sessionStorage'

export { LocalStorageManager } from './localStorage'
export { SessionStorageManager } from './sessionStorage'

// 存储工具类型
export interface StorageItem<T = any> {
  data: T
  timestamp: number
  version: string
  expiry?: number
}

export interface StorageStats {
  totalItems: number
  totalSize: number
  largestItem: { key: string; size: number } | null
}

// 统一存储接口，定义所有存储管理器必须实现的核心方法
export interface IStorageManager {
  setItem<T>(key: string, value: T): void
  getItem<T>(key: string, defaultValue?: T): T | null
  removeItem(key: string): void
  clear(): void
  hasItem(key: string): boolean
  getAllKeys(): string[]
  getStorageSize(): number
  isAvailable(): boolean
}

// 存储适配器工厂类，负责创建和管理不同类型的存储适配器
export class StorageAdapterFactory {
  // 创建本地存储适配器，提供持久化存储功能
  static createLocalStorage(): IStorageManager {
    return {
      setItem: LocalStorageManager.setItem.bind(LocalStorageManager),
      getItem: LocalStorageManager.getItem.bind(LocalStorageManager),
      removeItem: LocalStorageManager.removeItem.bind(LocalStorageManager),
      clear: LocalStorageManager.clear.bind(LocalStorageManager),
      hasItem: LocalStorageManager.hasItem.bind(LocalStorageManager),
      getAllKeys: LocalStorageManager.getAllKeys.bind(LocalStorageManager),
      getStorageSize:
        LocalStorageManager.getStorageSize.bind(LocalStorageManager),
      isAvailable: LocalStorageManager.isAvailable.bind(LocalStorageManager),
    }
  }

  // 创建会话存储适配器，提供临时存储功能（页面会话期间有效）
  static createSessionStorage(): IStorageManager {
    return {
      setItem: SessionStorageManager.setItem.bind(SessionStorageManager),
      getItem: SessionStorageManager.getItem.bind(SessionStorageManager),
      removeItem: SessionStorageManager.removeItem.bind(SessionStorageManager),
      clear: SessionStorageManager.clear.bind(SessionStorageManager),
      hasItem: SessionStorageManager.hasItem.bind(SessionStorageManager),
      getAllKeys: SessionStorageManager.getAllKeys.bind(SessionStorageManager),
      getStorageSize: SessionStorageManager.getStorageSize.bind(
        SessionStorageManager
      ),
      isAvailable: SessionStorageManager.isAvailable.bind(
        SessionStorageManager
      ),
    }
  }

  // 创建内存存储适配器，用于测试或不支持Web Storage的环境
  static createMemoryStorage(): IStorageManager {
    const storage = new Map<string, string>()

    return {
      setItem<T>(key: string, value: T): void {
        storage.set(
          key,
          JSON.stringify({
            data: value,
            timestamp: Date.now(),
            version: '1.0',
          })
        )
      },

      getItem<T>(key: string, defaultValue?: T): T | null {
        const item = storage.get(key)
        if (!item) {
          return defaultValue ?? null
        }

        try {
          const parsed = JSON.parse(item)
          return parsed.data as T
        } catch {
          return defaultValue ?? null
        }
      },

      removeItem(key: string): void {
        storage.delete(key)
      },

      clear(): void {
        storage.clear()
      },

      hasItem(key: string): boolean {
        return storage.has(key)
      },

      getAllKeys(): string[] {
        return Array.from(storage.keys())
      },

      getStorageSize(): number {
        let total = 0
        for (const [key, value] of storage) {
          total += key.length + value.length
        }
        return total
      },

      isAvailable(): boolean {
        return true
      },
    }
  }

  // 获取当前环境下最佳可用的存储适配器，支持自动降级
  static getBestAvailableStorage(): IStorageManager {
    if (LocalStorageManager.isAvailable()) {
      return this.createLocalStorage()
    }

    if (SessionStorageManager.isAvailable()) {
      return this.createSessionStorage()
    }

    // 回退到内存存储
    return this.createMemoryStorage()
  }
}

// 导出StorageService中的实例
export { StorageManager, storageManager } from './StorageService'
