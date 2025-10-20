/**
 * @fileoverview 存储服务基础设施
 * @description 提供统一的本地存储、会话存储和IndexedDB接口，支持数据加密和过期管理
 * 包含存储抽象基类、具体实现类以及存储管理器，遵循DDD架构中的基础设施层模式
 * @created 2025-10-15 15:35:00
 * @updated 2025-10-19 11:25:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

export interface StorageOptions {
  encrypt?: boolean
  ttl?: number // 生存时间（毫秒）
  namespace?: string
}

export interface StoredItem<T = unknown> {
  value: T
  timestamp: number
  ttl?: number
  encrypted?: boolean
}

export interface DatabaseSchema {
  name: string
  version: number
  stores: {
    name: string
    keyPath?: string
    autoIncrement?: boolean
    indexes?: Array<{
      name: string
      keyPath: string | string[]
      unique?: boolean
    }>
  }[]
}

// 存储服务抽象基类，提供通用的存储功能
abstract class BaseStorageService {
  protected namespace: string

  constructor(namespace = 'movie-app') {
    this.namespace = namespace
  }

  // 生成带命名空间的键，避免键名冲突
  protected getNamespacedKey(key: string): string {
    return `${this.namespace}:${key}`
  }

  // 检查存储项目是否过期
  protected isExpired(item: StoredItem): boolean {
    if (!item.ttl) return false
    return Date.now() - item.timestamp > item.ttl
  }

  // 加密存储数据
  protected encrypt(data: string): string {
    // 简单的Base64编码，实际项目中应使用更安全的加密算法
    return btoa(encodeURIComponent(data))
  }

  // 解密数据，将Base64编码的数据解码并转换为UTF-8字符串
  protected decrypt(encryptedData: string): string {
    try {
      return decodeURIComponent(atob(encryptedData))
    } catch {
      throw new Error('解密失败')
    }
  }

  // 序列化数据，将数据转换为存储格式并添加时间戳、过期时间等元信息
  protected serialize<T>(value: T, options: StorageOptions = {}): string {
    const item: StoredItem<T> = {
      value,
      timestamp: Date.now(),
      ttl: options.ttl,
      encrypted: options.encrypt,
    }

    let serialized = JSON.stringify(item)

    if (options.encrypt) {
      serialized = this.encrypt(serialized)
    }

    return serialized
  }

  // 反序列化数据，将存储格式数据解析并检查过期时间，支持自动解密
  protected deserialize<T>(data: string): T | null {
    try {
      let parsed: StoredItem<T>

      // 尝试解密
      try {
        const decrypted = this.decrypt(data)
        parsed = JSON.parse(decrypted)
      } catch {
        // 如果解密失败，尝试直接解析
        parsed = JSON.parse(data)
      }

      // 检查是否过期
      if (this.isExpired(parsed)) {
        return null
      }

      return parsed.value
    } catch {
      return null
    }
  }
}

// 本地存储服务，基于localStorage实现的持久化存储
export class LocalStorageService extends BaseStorageService {
  // 设置数据到localStorage，支持命名空间、加密和过期时间
  set<T>(key: string, value: T, options: StorageOptions = {}): void {
    try {
      const namespacedKey = this.getNamespacedKey(key)
      const serialized = this.serialize(value, options)
      localStorage.setItem(namespacedKey, serialized)
    } catch (error) {
      console.error('LocalStorage set error:', error)
      throw new Error('存储数据失败')
    }
  }

  // 从localStorage获取数据，自动检查过期时间并清理过期数据
  get<T>(key: string): T | null {
    try {
      const namespacedKey = this.getNamespacedKey(key)
      const data = localStorage.getItem(namespacedKey)

      if (!data) return null

      const result = this.deserialize<T>(data)

      // 如果数据过期，删除它
      if (result === null) {
        this.remove(key)
      }

      return result
    } catch (error) {
      console.error('LocalStorage get error:', error)
      return null
    }
  }

  // 从localStorage删除指定键的数据
  remove(key: string): void {
    const namespacedKey = this.getNamespacedKey(key)
    localStorage.removeItem(namespacedKey)
  }

  // 清除localStorage中当前命名空间的所有数据
  clear(): void {
    const keys = Object.keys(localStorage)
    const namespacePrefix = `${this.namespace}:`

    keys.forEach(key => {
      if (key.startsWith(namespacePrefix)) {
        localStorage.removeItem(key)
      }
    })
  }

  // 获取localStorage中当前命名空间的所有键名
  keys(): string[] {
    const keys = Object.keys(localStorage)
    const namespacePrefix = `${this.namespace}:`

    return keys
      .filter(key => key.startsWith(namespacePrefix))
      .map(key => key.substring(namespacePrefix.length))
  }

  // 检查指定键是否存在于localStorage中
  has(key: string): boolean {
    const namespacedKey = this.getNamespacedKey(key)
    return localStorage.getItem(namespacedKey) !== null
  }

  // 获取localStorage中当前命名空间数据的总大小（字节）
  getSize(): number {
    let size = 0
    const namespacePrefix = `${this.namespace}:`

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(namespacePrefix)) {
        size += localStorage.getItem(key)?.length || 0
      }
    })

    return size
  }

  // 清理localStorage中的过期数据，自动删除过期的存储项
  cleanup(): void {
    const keys = this.keys()

    keys.forEach(key => {
      this.get(key)
      // get方法会自动删除过期数据
    })
  }
}

// 会话存储服务，基于sessionStorage实现的临时存储
export class SessionStorageService extends BaseStorageService {
  // 设置数据到sessionStorage，支持命名空间、加密和过期时间
  set<T>(key: string, value: T, options: StorageOptions = {}): void {
    try {
      const namespacedKey = this.getNamespacedKey(key)
      const serialized = this.serialize(value, options)
      sessionStorage.setItem(namespacedKey, serialized)
    } catch (error) {
      console.error('SessionStorage set error:', error)
      throw new Error('存储数据失败')
    }
  }

  // 从sessionStorage获取数据，自动检查过期时间并清理过期数据
  get<T>(key: string): T | null {
    try {
      const namespacedKey = this.getNamespacedKey(key)
      const data = sessionStorage.getItem(namespacedKey)

      if (!data) return null

      const result = this.deserialize<T>(data)

      if (result === null) {
        this.remove(key)
      }

      return result
    } catch (error) {
      console.error('SessionStorage get error:', error)
      return null
    }
  }

  // 从sessionStorage删除指定键的数据
  remove(key: string): void {
    const namespacedKey = this.getNamespacedKey(key)
    sessionStorage.removeItem(namespacedKey)
  }

  // 清除sessionStorage中当前命名空间的所有数据
  clear(): void {
    const keys = Object.keys(sessionStorage)
    const namespacePrefix = `${this.namespace}:`

    keys.forEach(key => {
      if (key.startsWith(namespacePrefix)) {
        sessionStorage.removeItem(key)
      }
    })
  }

  // 获取sessionStorage中当前命名空间的所有键名
  keys(): string[] {
    const keys = Object.keys(sessionStorage)
    const namespacePrefix = `${this.namespace}:`

    return keys
      .filter(key => key.startsWith(namespacePrefix))
      .map(key => key.substring(namespacePrefix.length))
  }

  // 检查指定键是否存在于sessionStorage中
  has(key: string): boolean {
    const namespacedKey = this.getNamespacedKey(key)
    return sessionStorage.getItem(namespacedKey) !== null
  }
}

// IndexedDB存储服务，提供客户端数据库存储功能
export class IndexedDBService {
  private dbName: string
  private version: number
  private db: IDBDatabase | null = null
  private schema: DatabaseSchema

  constructor(schema: DatabaseSchema) {
    this.schema = schema
    this.dbName = schema.name
    this.version = schema.version
  }

  // 初始化数据库，创建数据库和对象存储
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        reject(new Error('打开数据库失败'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result

        // 创建对象存储
        this.schema.stores.forEach(storeConfig => {
          if (!db.objectStoreNames.contains(storeConfig.name)) {
            const store = db.createObjectStore(storeConfig.name, {
              keyPath: storeConfig.keyPath,
              autoIncrement: storeConfig.autoIncrement,
            })

            // 创建索引
            storeConfig.indexes?.forEach(indexConfig => {
              store.createIndex(indexConfig.name, indexConfig.keyPath, {
                unique: indexConfig.unique,
              })
            })
          }
        })
      }
    })
  }

  // 向对象存储添加数据
  async add<T>(storeName: string, data: T): Promise<IDBValidKey> {
    if (!this.db) throw new Error('数据库未初始化')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.add(data)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error('添加数据失败'))
    })
  }

  // 从对象存储获取数据
  async get<T>(storeName: string, key: IDBValidKey): Promise<T | null> {
    if (!this.db) throw new Error('数据库未初始化')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(new Error('获取数据失败'))
    })
  }

  // 更新对象存储中的数据
  async put<T>(storeName: string, data: T): Promise<IDBValidKey> {
    if (!this.db) throw new Error('数据库未初始化')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(data)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error('更新数据失败'))
    })
  }

  // 从对象存储删除数据
  async delete(storeName: string, key: IDBValidKey): Promise<void> {
    if (!this.db) throw new Error('数据库未初始化')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('删除数据失败'))
    })
  }

  // 获取对象存储中的所有数据
  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) throw new Error('数据库未初始化')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error('获取所有数据失败'))
    })
  }

  // 通过索引查询数据
  async getByIndex<T>(
    storeName: string,
    indexName: string,
    key: IDBValidKey
  ): Promise<T[]> {
    if (!this.db) throw new Error('数据库未初始化')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const request = index.getAll(key)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error('通过索引查询失败'))
    })
  }

  // 清空对象存储中的所有数据
  async clear(storeName: string): Promise<void> {
    if (!this.db) throw new Error('数据库未初始化')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('清空存储失败'))
    })
  }

  // 获取对象存储中的数据条数
  async count(storeName: string): Promise<number> {
    if (!this.db) throw new Error('数据库未初始化')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.count()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error('计数失败'))
    })
  }

  // 关闭数据库连接
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

// 统一存储管理器，提供多种存储方式的统一接口
export class StorageManager {
  public localStorage: LocalStorageService
  public sessionStorage: SessionStorageService
  public indexedDB: IndexedDBService

  constructor(namespace = 'movie-app') {
    this.localStorage = new LocalStorageService(namespace)
    this.sessionStorage = new SessionStorageService(namespace)

    // 默认IndexedDB配置
    const defaultSchema: DatabaseSchema = {
      name: `${namespace}-db`,
      version: 1,
      stores: [
        {
          name: 'cache',
          keyPath: 'key',
          indexes: [
            { name: 'timestamp', keyPath: 'timestamp' },
            { name: 'type', keyPath: 'type' },
          ],
        },
        {
          name: 'downloads',
          keyPath: 'id',
          indexes: [
            { name: 'status', keyPath: 'status' },
            { name: 'userId', keyPath: 'userId' },
          ],
        },
        {
          name: 'events',
          keyPath: 'id',
          autoIncrement: true,
          indexes: [
            { name: 'type', keyPath: 'type' },
            { name: 'timestamp', keyPath: 'timestamp' },
            { name: 'aggregateId', keyPath: 'aggregateId' },
          ],
        },
      ],
    }

    this.indexedDB = new IndexedDBService(defaultSchema)
  }

  // 初始化所有存储服务，包含定期清理任务
  async init(): Promise<void> {
    await this.indexedDB.init()

    // 定期清理过期数据
    setInterval(() => {
      this.localStorage.cleanup()
    }, 60000) // 每分钟清理一次
  }

  // 清理所有存储数据
  clearAll(): void {
    this.localStorage.clear()
    this.sessionStorage.clear()
    // IndexedDB需要逐个清理存储
  }

  // 获取存储使用情况统计信息
  getStorageInfo(): {
    localStorage: { size: number; keys: number }
    sessionStorage: { keys: number }
  } {
    return {
      localStorage: {
        size: this.localStorage.getSize(),
        keys: this.localStorage.keys().length,
      },
      sessionStorage: {
        keys: this.sessionStorage.keys().length,
      },
    }
  }
}

// 创建默认存储管理器实例
export const storageManager = new StorageManager()
