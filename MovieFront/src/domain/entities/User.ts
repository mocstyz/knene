/**
 * @fileoverview 用户实体
 * @description 用户管理领域的核心实体，包含用户的基本信息、偏好设置和业务逻辑。
 * 实现了完整的用户生命周期管理，包括注册、登录、权限控制等功能。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.2.0
 */

import { Avatar } from '@domain/value-objects/Avatar'
import { Email } from '@domain/value-objects/Email'
import { Password } from '@domain/value-objects/Password'

/**
 * 用户档案接口
 * 定义用户的基本档案信息
 */
export interface UserProfile {
  id: string
  username: string
  email: Email
  avatar?: Avatar
  nickname?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * 用户偏好设置接口
 * 定义用户的个人偏好配置
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: 'zh-CN' | 'en-US'
  downloadPath: string
  maxConcurrentDownloads: number
  autoDownload: boolean
  notifications: {
    downloadComplete: boolean
    newMovies: boolean
    systemUpdates: boolean
  }
}

/**
 * 用户实体类
 *
 * 聚合根：用户管理领域的核心实体，包含用户的完整信息和业务规则
 *
 * @param id 用户唯一标识符
 * @param profile 用户档案信息
 * @param preferences 用户偏好设置
 * @param password 用户密码（加密存储）
 * @param roles 用户角色列表，默认为['user']
 * @param isActive 账户是否激活，默认为true
 * @param lastLoginAt 最后登录时间
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly profile: UserProfile,
    public readonly preferences: UserPreferences,
    private password: Password,
    public readonly roles: string[] = ['user'],
    public readonly isActive: boolean = true,
    public readonly lastLoginAt?: Date
  ) {}

  /**
   * 兼容性属性 - 提供对用户数据的直接访问
   * @returns {Object} 用户详细信息的扁平化对象
   */
  get detail(): {
    id: string
    email: string
    username: string
    password: string
    avatar?: string
    bio?: string
    isActive: boolean
    isEmailVerified: boolean
    subscription: {
      type: string
      expiresAt: Date
    }
    preferences: UserPreferences
    createdAt: Date
    updatedAt: Date
  } {
    return {
      id: this.id,
      email: this.profile.email.value,
      username: this.profile.username,
      password: this.password.hashedValue,
      avatar: this.profile.avatar?.url,
      bio: this.profile.bio,
      isActive: this.isActive,
      isEmailVerified: true, // 假设邮箱已验证
      subscription: {
        type: this.hasRole('premium') ? 'premium' : 'basic',
        expiresAt: this.hasRole('premium')
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(),
      },
      preferences: this.preferences,
      createdAt: this.profile.createdAt,
      updatedAt: this.profile.updatedAt,
    }
  }

  // ========== 业务方法 ==========

  /**
   * 更新用户档案信息
   * @param updates 要更新的档案信息（排除id、创建时间和更新时间）
   * @returns {User} 返回包含更新档案的新User实例
   */
  updateProfile(
    updates: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>
  ): User {
    const updatedProfile = {
      ...this.profile,
      ...updates,
      updatedAt: new Date(),
    }

    return new User(
      this.id,
      updatedProfile,
      this.preferences,
      this.password,
      this.roles,
      this.isActive,
      this.lastLoginAt
    )
  }

  /**
   * 更新用户偏好设置
   * @param updates 要更新的偏好设置
   * @returns {User} 返回包含更新偏好的新User实例
   */
  updatePreferences(updates: Partial<UserPreferences>): User {
    const updatedPreferences = {
      ...this.preferences,
      ...updates,
    }

    return new User(
      this.id,
      this.profile,
      updatedPreferences,
      this.password,
      this.roles,
      this.isActive,
      this.lastLoginAt
    )
  }

  /**
   * 更改用户密码
   * @param newPassword 新的加密密码
   * @returns {User} 返回包含新密码的新User实例
   */
  changePassword(newPassword: Password): User {
    return new User(
      this.id,
      this.profile,
      this.preferences,
      newPassword,
      this.roles,
      this.isActive,
      this.lastLoginAt
    )
  }

  /**
   * 用户登录，更新最后登录时间
   * @returns {User} 返回更新了登录时间的新User实例
   */
  login(): User {
    return new User(
      this.id,
      this.profile,
      this.preferences,
      this.password,
      this.roles,
      this.isActive,
      new Date()
    )
  }

  /**
   * 检查用户是否具有指定角色
   * @param role 要检查的角色名称
   * @returns {boolean} 如果用户具有该角色则返回true
   */
  hasRole(role: string): boolean {
    return this.roles.includes(role)
  }

  /**
   * 检查用户是否具有下载权限
   * @returns {boolean} 如果用户可以下载则返回true
   */
  canDownload(): boolean {
    return (
      this.isActive &&
      (this.hasRole('user') || this.hasRole('premium') || this.hasRole('admin'))
    )
  }

  /**
   * 获取用户最大并发下载数
   * @returns {number} 返回用户的最大并发下载数
   */
  getMaxConcurrentDownloads(): number {
    if (this.hasRole('premium')) return 10
    if (this.hasRole('admin')) return 20
    return this.preferences.maxConcurrentDownloads
  }

  // ========== 静态工厂方法 ==========

  /**
   * 创建新用户（领域事件）
   * @param id 用户唯一标识符
   * @param username 用户名
   * @param email 用户邮箱
   * @param password 用户密码
   * @param avatar 用户头像（可选）
   * @returns {User} 返回新创建的User实例
   */
  static create(
    id: string,
    username: string,
    email: Email,
    password: Password,
    avatar?: Avatar
  ): User {
    const profile: UserProfile = {
      id,
      username,
      email,
      avatar,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const preferences: UserPreferences = {
      theme: 'auto',
      language: 'zh-CN',
      downloadPath: './downloads',
      maxConcurrentDownloads: 3,
      autoDownload: false,
      notifications: {
        downloadComplete: true,
        newMovies: true,
        systemUpdates: false,
      },
    }

    return new User(id, profile, preferences, password)
  }
}
