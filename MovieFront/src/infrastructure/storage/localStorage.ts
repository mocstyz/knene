/**
 * @fileoverview 本地存储管理器
 * @description 提供类型安全的本地存储操作，包含数据序列化、过期时间管理、批量操作等功能
 * 支持存储配额检查、数据导入导出、监听存储变化等高级功能
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 本地存储管理器类，提供类型安全的本地存储操作
export class LocalStorageManager {
  // 存储键名常量，定义应用中使用的所有存储键
  static readonly KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    USER_PREFERENCES: 'user_preferences',
    MOVIE_FAVORITES: 'movie_favorites',
    RECENTLY_VIEWED: 'recently_viewed',
    DOWNLOAD_SETTINGS: 'download_settings',
    THEME_PREFERENCE: 'theme_preference',
    LANGUAGE_PREFERENCE: 'language_preference',
    SEARCH_HISTORY: 'search_history',
    FILTER_PREFERENCES: 'filter_preferences',
    PLAYBACK_SETTINGS: 'playback_settings',
    NOTIFICATION_SETTINGS: 'notification_settings',
    CACHE_TIMESTAMP: 'cache_timestamp',
    OFFLINE_DATA: 'offline_data',
  } as const

  // 设置存储项，自动序列化数据并添加时间戳
  static setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify({
        data: value,
        timestamp: Date.now(),
        version: '1.0',
      })
      localStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error('Failed to set localStorage item:', error)
      throw new Error(`Failed to store data for key: ${key}`)
    }
  }

  // 获取存储项，支持默认值和旧格式数据兼容
  static getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      if (!item) {
        return defaultValue ?? null
      }

      const parsed = JSON.parse(item)

      // 检查数据格式
      if (typeof parsed === 'object' && parsed !== null && 'data' in parsed) {
        return parsed.data as T
      }

      // 兼容旧格式数据
      return parsed as T
    } catch (error) {
      console.error('Failed to get localStorage item:', error)
      return defaultValue ?? null
    }
  }

  // 移除指定的存储项
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove localStorage item:', error)
    }
  }

  // 清空所有本地存储数据
  static clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  }

  // 检查存储项是否存在
  static hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null
  }

  // 获取所有存储键名
  static getAllKeys(): string[] {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        keys.push(key)
      }
    }
    return keys
  }

  // 获取存储大小（字节）
  static getStorageSize(): number {
    let total = 0
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        total += localStorage[key].length + key.length
      }
    }
    return total
  }

  // 检查存储配额使用情况
  static checkStorageQuota(): {
    used: number
    available: number
    percentage: number
  } {
    const used = this.getStorageSize()
    const available = 5 * 1024 * 1024 // 假设5MB限制
    const percentage = (used / available) * 100

    return {
      used,
      available,
      percentage,
    }
  }

  // 设置带过期时间的存储项，支持自动过期清理
  static setItemWithExpiry<T>(
    key: string,
    value: T,
    expiryMinutes: number
  ): void {
    const expiryTime = Date.now() + expiryMinutes * 60 * 1000
    const item = {
      data: value,
      expiry: expiryTime,
      timestamp: Date.now(),
      version: '1.0',
    }

    try {
      localStorage.setItem(key, JSON.stringify(item))
    } catch (error) {
      console.error('Failed to set localStorage item with expiry:', error)
      throw new Error(`Failed to store data for key: ${key}`)
    }
  }

  // 获取带过期检查的存储项，过期数据自动清理
  static getItemWithExpiry<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      if (!item) {
        return defaultValue ?? null
      }

      const parsed = JSON.parse(item)

      // 检查是否有过期时间
      if (parsed.expiry && Date.now() > parsed.expiry) {
        localStorage.removeItem(key)
        return defaultValue ?? null
      }

      return parsed.data as T
    } catch (error) {
      console.error('Failed to get localStorage item with expiry:', error)
      return defaultValue ?? null
    }
  }

  // 批量设置存储项，提高操作效率
  static setMultipleItems(items: Record<string, unknown>): void {
    Object.entries(items).forEach(([key, value]) => {
      this.setItem(key, value)
    })
  }

  // 批量获取存储项，支持类型安全的批量操作
  static getMultipleItems<T extends Record<string, unknown>>(
    keys: (keyof T)[]
  ): Partial<T> {
    const result: Partial<T> = {}
    keys.forEach(key => {
      const value = this.getItem(key as string)
      if (value !== null) {
        result[key] = value as T[keyof T]
      }
    })
    return result
  }

  // 批量移除存储项，支持清理多个键
  static removeMultipleItems(keys: string[]): void {
    keys.forEach(key => {
      this.removeItem(key)
    })
  }

  // 清理所有过期的存储项，返回清理数量
  static cleanupExpiredItems(): number {
    let cleanedCount = 0
    const keys = this.getAllKeys()

    keys.forEach(key => {
      try {
        const item = localStorage.getItem(key)
        if (item) {
          const parsed = JSON.parse(item)
          if (parsed.expiry && Date.now() > parsed.expiry) {
            localStorage.removeItem(key)
            cleanedCount++
          }
        }
      } catch (error) {
        // 忽略解析错误，可能是非JSON数据
      }
    })

    return cleanedCount
  }

  // 导出所有存储数据为JSON格式
  static exportData(): string {
    const data: Record<string, unknown> = {}
    const keys = this.getAllKeys()

    keys.forEach(key => {
      const value = this.getItem(key)
      if (value !== null) {
        data[key] = value
      }
    })

    return JSON.stringify(data, null, 2)
  }

  // 从JSON格式导入存储数据
  static importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData)
      Object.entries(data).forEach(([key, value]) => {
        this.setItem(key, value)
      })
    } catch (error) {
      console.error('Failed to import localStorage data:', error)
      throw new Error('Invalid JSON data for import')
    }
  }

  // 监听存储变化事件，返回清理函数
  static onStorageChange(callback: (event: StorageEvent) => void): () => void {
    window.addEventListener('storage', callback)

    // 返回清理函数
    return () => {
      window.removeEventListener('storage', callback)
    }
  }

  // 安全地执行存储操作，支持错误回退
  static safeOperation<T>(operation: () => T, fallback?: T): T | null {
    try {
      return operation()
    } catch (error) {
      console.error('localStorage operation failed:', error)
      return fallback ?? null
    }
  }

  // 检查localStorage是否可用
  static isAvailable(): boolean {
    try {
      const testKey = '__localStorage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch (error) {
      return false
    }
  }

  // 获取存储统计信息，包含项目数量、大小、最大项等
  static getStorageStats(): {
    totalItems: number
    totalSize: number
    largestItem: { key: string; size: number } | null
    oldestItem: { key: string; timestamp: number } | null
  } {
    const keys = this.getAllKeys()
    let totalSize = 0
    let largestItem: { key: string; size: number } | null = null
    let oldestItem: { key: string; timestamp: number } | null = null

    keys.forEach(key => {
      const item = localStorage.getItem(key)
      if (item) {
        const itemSize = item.length + key.length
        totalSize += itemSize

        // 找到最大的项
        if (!largestItem || itemSize > largestItem.size) {
          largestItem = { key, size: itemSize }
        }

        // 找到最旧的项
        try {
          const parsed = JSON.parse(item)
          if (parsed.timestamp) {
            if (!oldestItem || parsed.timestamp < oldestItem.timestamp) {
              oldestItem = { key, timestamp: parsed.timestamp }
            }
          }
        } catch (error) {
          // 忽略解析错误
        }
      }
    })

    return {
      totalItems: keys.length,
      totalSize,
      largestItem,
      oldestItem,
    }
  }
}
