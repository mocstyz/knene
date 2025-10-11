import { User } from '@domain/entities/User'
import { UserRepository } from '@infrastructure/repositories/UserRepository'

/**
 * 用户仓储实现
 * 负责用户数据的持久化和查询
 */
export class UserRepositoryImpl implements UserRepository {
  private cache = new Map<string, User>()
  private cacheExpiry = new Map<string, number>()
  private readonly CACHE_DURATION = 10 * 60 * 1000 // 10分钟缓存

  /**
   * 根据ID查找用户
   */
  async findById(id: string): Promise<User | null> {
    try {
      // 1. 检查缓存
      const cached = this.getFromCache(id)
      if (cached) return cached

      // 2. 从API获取数据
      const response = await fetch(`/api/users/${id}`)
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`获取用户失败: ${response.statusText}`)
      }

      const userData = await response.json()
      const user = this.mapToUserEntity(userData)

      // 3. 缓存结果
      this.setCache(id, user)

      return user
    } catch (error) {
      console.error('查找用户失败:', error)
      throw error
    }
  }

  /**
   * 获取所有用户
   */
  async findAll(): Promise<User[]> {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error(`获取用户列表失败: ${response.statusText}`)
      }

      const usersData = await response.json()
      return usersData.map((data: any) => this.mapToUserEntity(data))
    } catch (error) {
      console.error('获取用户列表失败:', error)
      throw error
    }
  }

  /**
   * 保存用户
   */
  async save(user: User): Promise<User> {
    try {
      const userData = this.mapFromUserEntity(user)

      const response = await fetch(`/api/users/${user.detail.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error(`保存用户失败: ${response.statusText}`)
      }

      const savedUserData = await response.json()
      const savedUser = this.mapToUserEntity(savedUserData)

      // 更新缓存
      this.setCache(user.detail.id, savedUser)

      return savedUser
    } catch (error) {
      console.error('保存用户失败:', error)
      throw error
    }
  }

  /**
   * 删除用户
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`删除用户失败: ${response.statusText}`)
      }

      // 清除缓存
      this.clearCache(id)
      return true
    } catch (error) {
      console.error('删除用户失败:', error)
      throw error
    }
  }

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const response = await fetch(
        `/api/users/by-email/${encodeURIComponent(email)}`
      )
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`根据邮箱查找用户失败: ${response.statusText}`)
      }

      const userData = await response.json()
      return this.mapToUserEntity(userData)
    } catch (error) {
      console.error('根据邮箱查找用户失败:', error)
      throw error
    }
  }

  /**
   * 根据用户名查找用户
   */
  async findByUsername(username: string): Promise<User | null> {
    try {
      const response = await fetch(
        `/api/users/by-username/${encodeURIComponent(username)}`
      )
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`根据用户名查找用户失败: ${response.statusText}`)
      }

      const userData = await response.json()
      return this.mapToUserEntity(userData)
    } catch (error) {
      console.error('根据用户名查找用户失败:', error)
      throw error
    }
  }

  /**
   * 创建新用户
   */
  async create(user: User): Promise<User> {
    try {
      const userData = {
        email: user.profile.email.value,
        username: user.profile.username,
        password: 'hashed_password', // 实际应用中应该从安全的地方获取
        avatar: user.profile.avatar?.url,
        bio: user.detail.bio,
      }

      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error(`创建用户失败: ${response.statusText}`)
      }

      const createdUserData = await response.json()
      const createdUser = this.mapToUserEntity(createdUserData)

      // 缓存新用户
      this.setCache(createdUser.detail.id, createdUser)

      return createdUser
    } catch (error) {
      console.error('创建用户失败:', error)
      throw error
    }
  }

  /**
   * 用户认证
   */
  async authenticate(
    email: string,
    password: string
  ): Promise<{
    user: User
    token: string
    refreshToken: string
  }> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error(`用户认证失败: ${response.statusText}`)
      }

      const authResult = await response.json()
      const user = this.mapToUserEntity(authResult.user)

      // 缓存用户信息
      this.setCache(user.detail.id, user)

      return {
        user,
        token: authResult.token,
        refreshToken: authResult.refreshToken,
      }
    } catch (error) {
      console.error('用户认证失败:', error)
      throw error
    }
  }

  /**
   * 更新用户密码
   */
  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const response = await fetch(`/api/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (!response.ok) {
        throw new Error(`更新密码失败: ${response.statusText}`)
      }

      // 清除缓存，强制下次重新获取
      this.clearCache(userId)
    } catch (error) {
      console.error('更新密码失败:', error)
      throw error
    }
  }

  /**
   * 更新用户资料
   */
  async updateProfile(
    userId: string,
    updates: {
      username?: string
      avatar?: string
      bio?: string
      preferences?: any
    }
  ): Promise<User> {
    try {
      const response = await fetch(`/api/users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error(`更新用户资料失败: ${response.statusText}`)
      }

      const updatedUserData = await response.json()
      const updatedUser = this.mapToUserEntity(updatedUserData)

      // 更新缓存
      this.setCache(userId, updatedUser)

      return updatedUser
    } catch (error) {
      console.error('更新用户资料失败:', error)
      throw error
    }
  }

  /**
   * 获取用户收藏列表
   */
  async getUserFavorites(userId: string): Promise<string[]> {
    try {
      const response = await fetch(`/api/users/${userId}/favorites`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`获取用户收藏失败: ${response.statusText}`)
      }

      const result = await response.json()
      return result.favorites || []
    } catch (error) {
      console.error('获取用户收藏失败:', error)
      throw error
    }
  }

  /**
   * 添加收藏
   */
  async addFavorite(userId: string, movieId: string): Promise<void> {
    try {
      const response = await fetch(`/api/users/${userId}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ movieId }),
      })

      if (!response.ok) {
        throw new Error(`添加收藏失败: ${response.statusText}`)
      }
    } catch (error) {
      console.error('添加收藏失败:', error)
      throw error
    }
  }

  /**
   * 移除收藏
   */
  async removeFavorite(userId: string, movieId: string): Promise<void> {
    try {
      const response = await fetch(
        `/api/users/${userId}/favorites/${movieId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`移除收藏失败: ${response.statusText}`)
      }
    } catch (error) {
      console.error('移除收藏失败:', error)
      throw error
    }
  }

  /**
   * 获取用户活动记录
   */
  async getUserActivity(userId: string, limit: number = 20): Promise<any[]> {
    try {
      const response = await fetch(
        `/api/users/${userId}/activity?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`获取用户活动失败: ${response.statusText}`)
      }

      const result = await response.json()
      return result.activities || []
    } catch (error) {
      console.error('获取用户活动失败:', error)
      throw error
    }
  }

  /**
   * 检查用户名是否可用
   */
  async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      const response = await fetch(
        `/api/users/check-username/${encodeURIComponent(username)}`
      )
      if (!response.ok) {
        throw new Error(`检查用户名可用性失败: ${response.statusText}`)
      }

      const result = await response.json()
      return result.available
    } catch (error) {
      console.error('检查用户名可用性失败:', error)
      throw error
    }
  }

  /**
   * 检查邮箱是否可用
   */
  async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const response = await fetch(
        `/api/users/check-email/${encodeURIComponent(email)}`
      )
      if (!response.ok) {
        throw new Error(`检查邮箱可用性失败: ${response.statusText}`)
      }

      const result = await response.json()
      return result.available
    } catch (error) {
      console.error('检查邮箱可用性失败:', error)
      throw error
    }
  }

  /**
   * 获取用户统计信息
   */
  async getUserStats(userId: string): Promise<{
    downloadsCount: number
    favoritesCount: number
    messagesCount: number
  }> {
    try {
      const response = await fetch(`/api/users/${userId}/stats`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`获取用户统计失败: ${response.statusText}`)
      }

      const stats = await response.json()
      return {
        downloadsCount: stats.totalDownloads || 0,
        favoritesCount: stats.favoriteMovies || 0,
        messagesCount: 0, // 如果API不提供消息数量，默认为0
      }
    } catch (error) {
      console.error('获取用户统计失败:', error)
      throw error
    }
  }

  // 私有辅助方法

  /**
   * 从缓存获取数据
   */
  private getFromCache(id: string): User | null {
    const cached = this.cache.get(id)
    const expiry = this.cacheExpiry.get(id)

    if (cached && expiry && Date.now() < expiry) {
      return cached
    }

    // 缓存过期，清除
    this.cache.delete(id)
    this.cacheExpiry.delete(id)
    return null
  }

  /**
   * 设置缓存
   */
  private setCache(id: string, user: User): void {
    this.cache.set(id, user)
    this.cacheExpiry.set(id, Date.now() + this.CACHE_DURATION)
  }

  /**
   * 清除缓存
   */
  private clearCache(id: string): void {
    this.cache.delete(id)
    this.cacheExpiry.delete(id)
  }

  /**
   * 获取认证令牌
   */
  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || ''
  }

  /**
   * 将API数据映射为用户实体
   */
  private mapToUserEntity(data: any): User {
    return {
      detail: {
        id: data.id,
        email: data.email,
        username: data.username,
        password: data.password, // 注意：实际应用中不应该返回密码
        avatar: data.avatar || '',
        bio: data.bio || '',
        isActive: data.isActive !== false,
        isEmailVerified: data.isEmailVerified || false,
        subscription: data.subscription || {
          type: 'basic',
          expiresAt: new Date(),
        },
        preferences: data.preferences || {},
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      },
    } as User
  }

  /**
   * 更新用户信息
   */
  async update(user: User): Promise<User> {
    try {
      const userData = this.mapFromUserEntity(user)

      const response = await fetch(`/api/users/${user.detail.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error(`更新用户失败: ${response.statusText}`)
      }

      const updatedData = await response.json()
      const updatedUser = this.mapToUserEntity(updatedData)

      // 更新缓存
      this.setCache(updatedUser.detail.id, updatedUser)

      return updatedUser
    } catch (error) {
      console.error('更新用户失败:', error)
      throw error
    }
  }

  /**
   * 更新用户偏好设置
   */
  async updatePreferences(
    userId: string,
    preferences: Record<string, any>
  ): Promise<User> {
    try {
      const response = await fetch(`/api/users/${userId}/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ preferences }),
      })

      if (!response.ok) {
        throw new Error(`更新用户偏好失败: ${response.statusText}`)
      }

      const updatedData = await response.json()
      const updatedUser = this.mapToUserEntity(updatedData)

      // 更新缓存
      this.setCache(updatedUser.detail.id, updatedUser)

      return updatedUser
    } catch (error) {
      console.error('更新用户偏好失败:', error)
      throw error
    }
  }

  /**
   * 将用户实体映射为API数据格式
   */
  private mapFromUserEntity(user: User): any {
    return {
      id: user.detail.id,
      email: user.detail.email,
      username: user.detail.username,
      avatar: user.detail.avatar,
      bio: user.detail.bio,
      isActive: user.detail.isActive,
      isEmailVerified: user.detail.isEmailVerified,
      subscription: user.detail.subscription,
      preferences: user.detail.preferences,
      updatedAt: new Date().toISOString(),
    }
  }
}
