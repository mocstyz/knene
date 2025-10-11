/**
 * 会话存储管理器
 * 提供类型安全的会话存储操作
 */
export class SessionStorageManager {
  /**
   * 存储键名常量
   */
  static readonly KEYS = {
    CURRENT_SESSION: 'current_session',
    NAVIGATION_STATE: 'navigation_state',
    FORM_DATA: 'form_data',
    SEARCH_FILTERS: 'search_filters',
    PLAYER_STATE: 'player_state',
    DOWNLOAD_PROGRESS: 'download_progress',
    TEMP_USER_DATA: 'temp_user_data',
    PAGE_CACHE: 'page_cache',
    SCROLL_POSITION: 'scroll_position',
    MODAL_STATE: 'modal_state',
    NOTIFICATION_QUEUE: 'notification_queue',
    TEMP_SETTINGS: 'temp_settings',
  } as const

  /**
   * 设置存储项
   */
  static setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify({
        data: value,
        timestamp: Date.now(),
        version: '1.0',
      })
      sessionStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error('Failed to set sessionStorage item:', error)
      throw new Error(`Failed to store session data for key: ${key}`)
    }
  }

  /**
   * 获取存储项
   */
  static getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(key)
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
      console.error('Failed to get sessionStorage item:', error)
      return defaultValue ?? null
    }
  }

  /**
   * 移除存储项
   */
  static removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove sessionStorage item:', error)
    }
  }

  /**
   * 清空所有存储
   */
  static clear(): void {
    try {
      sessionStorage.clear()
    } catch (error) {
      console.error('Failed to clear sessionStorage:', error)
    }
  }

  /**
   * 检查存储项是否存在
   */
  static hasItem(key: string): boolean {
    return sessionStorage.getItem(key) !== null
  }

  /**
   * 获取所有键名
   */
  static getAllKeys(): string[] {
    const keys: string[] = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key) {
        keys.push(key)
      }
    }
    return keys
  }

  /**
   * 获取存储大小（字节）
   */
  static getStorageSize(): number {
    let total = 0
    for (const key in sessionStorage) {
      if (Object.prototype.hasOwnProperty.call(sessionStorage, key)) {
        total += sessionStorage[key].length + key.length
      }
    }
    return total
  }

  /**
   * 批量设置存储项
   */
  static setMultipleItems(items: Record<string, unknown>): void {
    Object.entries(items).forEach(([key, value]) => {
      this.setItem(key, value)
    })
  }

  /**
   * 批量获取存储项
   */
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

  /**
   * 批量移除存储项
   */
  static removeMultipleItems(keys: string[]): void {
    keys.forEach(key => {
      this.removeItem(key)
    })
  }

  /**
   * 设置页面状态
   */
  static setPageState(pageId: string, state: Record<string, unknown>): void {
    const pageStates = this.getItem<Record<string, Record<string, unknown>>>(
      'page_states',
      {}
    )
    if (pageStates) {
      pageStates[pageId] = {
        ...state,
        timestamp: Date.now(),
      }
      this.setItem('page_states', pageStates)
    }
  }

  /**
   * 获取页面状态
   */
  static getPageState<T>(pageId: string): T | null {
    const pageStates = this.getItem<Record<string, Record<string, unknown>>>(
      'page_states',
      {}
    )
    return (pageStates?.[pageId]?.data as T) || null
  }

  /**
   * 移除页面状态
   */
  static removePageState(pageId: string): void {
    const pageStates = this.getItem<Record<string, Record<string, unknown>>>(
      'page_states',
      {}
    )
    if (pageStates) {
      delete pageStates[pageId]
      this.setItem('page_states', pageStates)
    }
  }

  /**
   * 设置滚动位置
   */
  static setScrollPosition(
    pageId: string,
    position: { x: number; y: number }
  ): void {
    const scrollPositions = this.getItem<
      Record<string, { x: number; y: number }>
    >('scroll_positions', {})
    if (scrollPositions) {
      scrollPositions[pageId] = position
      this.setItem('scroll_positions', scrollPositions)
    }
  }

  /**
   * 获取滚动位置
   */
  static getScrollPosition(pageId: string): { x: number; y: number } | null {
    const scrollPositions = this.getItem<
      Record<string, { x: number; y: number }>
    >('scroll_positions', {})
    return scrollPositions?.[pageId] || null
  }

  /**
   * 设置表单数据
   */
  static setFormData(formId: string, data: unknown): void {
    const formDataMap = this.getItem<
      Record<string, { data: unknown; timestamp: number }>
    >('form_data_map', {})
    if (formDataMap) {
      formDataMap[formId] = {
        data,
        timestamp: Date.now(),
      }
      this.setItem('form_data_map', formDataMap)
    }
  }

  /**
   * 获取表单数据
   */
  static getFormData<T>(formId: string): T | null {
    const formDataMap = this.getItem<
      Record<string, { data: unknown; timestamp: number }>
    >('form_data_map', {})
    if (!formDataMap) return null

    const formData = formDataMap[formId]

    if (!formData) return null

    // 检查数据是否过期（30分钟）
    const isExpired = Date.now() - formData.timestamp > 30 * 60 * 1000
    if (isExpired) {
      this.removeFormData(formId)
      return null
    }

    return formData.data as T
  }

  /**
   * 移除表单数据
   */
  static removeFormData(formId: string): void {
    const formDataMap = this.getItem<
      Record<string, { data: unknown; timestamp: number }>
    >('form_data_map', {})
    if (formDataMap) {
      delete formDataMap[formId]
      this.setItem('form_data_map', formDataMap)
    }
  }

  /**
   * 设置导航状态
   */
  static setNavigationState(state: {
    currentPath: string
    previousPath?: string
    params?: Record<string, unknown>
    query?: Record<string, unknown>
  }): void {
    this.setItem(this.KEYS.NAVIGATION_STATE, state)
  }

  /**
   * 获取导航状态
   */
  static getNavigationState(): {
    currentPath: string
    previousPath?: string
    params?: Record<string, unknown>
    query?: Record<string, unknown>
  } | null {
    return this.getItem(this.KEYS.NAVIGATION_STATE)
  }

  /**
   * 设置播放器状态
   */
  static setPlayerState(
    movieId: string,
    state: {
      currentTime: number
      duration: number
      volume: number
      playbackRate: number
      quality: string
      subtitles?: boolean
    }
  ): void {
    const playerStates =
      (this.getItem('player_states') as Record<string, unknown> | null) || {}
    playerStates[movieId] = {
      ...state,
      timestamp: Date.now(),
    }
    this.setItem('player_states', playerStates)
  }

  /**
   * 获取播放器状态
   */
  static getPlayerState(movieId: string): {
    currentTime: number
    duration: number
    volume: number
    playbackRate: number
    quality: string
    subtitles?: boolean
  } | null {
    const playerStates =
      (this.getItem('player_states') as Record<
        string,
        {
          currentTime: number
          duration: number
          volume: number
          playbackRate: number
          quality: string
          subtitles?: boolean
        }
      > | null) || {}
    return playerStates[movieId] || null
  }

  /**
   * 设置搜索过滤器
   */
  static setSearchFilters(filters: {
    query?: string
    genre?: string
    year?: number
    rating?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): void {
    this.setItem(this.KEYS.SEARCH_FILTERS, filters)
  }

  /**
   * 获取搜索过滤器
   */
  static getSearchFilters(): {
    query?: string
    genre?: string
    year?: number
    rating?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } | null {
    return this.getItem(this.KEYS.SEARCH_FILTERS)
  }

  /**
   * 设置模态框状态
   */
  static setModalState(modalId: string, isOpen: boolean, data?: unknown): void {
    const modalStates =
      (this.getItem('modal_states') as Record<string, unknown> | null) || {}
    modalStates[modalId] = {
      isOpen,
      data,
      timestamp: Date.now(),
    }
    this.setItem('modal_states', modalStates)
  }

  /**
   * 获取模态框状态
   */
  static getModalState(modalId: string): {
    isOpen: boolean
    data?: unknown
  } | null {
    const modalStates =
      (this.getItem('modal_states') as Record<
        string,
        {
          isOpen: boolean
          data?: unknown
        }
      > | null) || {}
    return modalStates[modalId] || null
  }

  /**
   * 安全地执行存储操作
   */
  static safeOperation<T>(operation: () => T, fallback?: T): T | null {
    try {
      return operation()
    } catch (error) {
      console.error('sessionStorage operation failed:', error)
      return fallback ?? null
    }
  }

  /**
   * 检查sessionStorage是否可用
   */
  static isAvailable(): boolean {
    try {
      const testKey = '__sessionStorage_test__'
      sessionStorage.setItem(testKey, 'test')
      sessionStorage.removeItem(testKey)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * 获取存储统计信息
   */
  static getStorageStats(): {
    totalItems: number
    totalSize: number
    largestItem: { key: string; size: number } | null
  } {
    const keys = this.getAllKeys()
    let totalSize = 0
    let largestItem: { key: string; size: number } | null = null

    keys.forEach(key => {
      const item = sessionStorage.getItem(key)
      if (item) {
        const itemSize = item.length + key.length
        totalSize += itemSize

        // 找到最大的项
        if (!largestItem || itemSize > largestItem.size) {
          largestItem = { key, size: itemSize }
        }
      }
    })

    return {
      totalItems: keys.length,
      totalSize,
      largestItem,
    }
  }

  /**
   * 清理过期的表单数据
   */
  static cleanupExpiredFormData(): void {
    const formDataMap = this.getItem('form_data_map') as Record<
      string,
      { data: unknown; timestamp: number }
    > | null
    if (!formDataMap) return

    let cleanedCount = 0
    const now = Date.now()
    const expireTime = 30 * 60 * 1000 // 30分钟

    Object.keys(formDataMap).forEach(formId => {
      const formData = formDataMap[formId]
      if (formData && now - formData.timestamp > expireTime) {
        delete formDataMap[formId]
        cleanedCount++
      }
    })

    if (cleanedCount > 0) {
      this.setItem('form_data_map', formDataMap)
    }
  }

  /**
   * 导出会话数据
   */
  static exportData(): string {
    const data: Record<string, any> = {}
    const keys = this.getAllKeys()

    keys.forEach(key => {
      const value = this.getItem(key)
      if (value !== null) {
        data[key] = value
      }
    })

    return JSON.stringify(data, null, 2)
  }
}
