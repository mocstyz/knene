/**
 * @fileoverview 用户领域实体定义
 * @description 用户管理领域的核心实体，包含用户的基本信息、偏好设置和业务逻辑，实现完整的用户生命周期管理
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Avatar } from '@domain/value-objects/Avatar'
import { Email } from '@domain/value-objects/Email'
import { Password } from '@domain/value-objects/Password'

// 用户档案接口，定义用户的基本档案信息结构
export interface UserProfile {
  id: string // 用户唯一标识
  username: string // 用户名
  email: Email // 邮箱值对象
  avatar?: Avatar // 头像值对象
  nickname?: string // 昵称
  bio?: string // 个人简介
  createdAt: Date // 创建时间
  updatedAt: Date // 更新时间
}

// 用户偏好设置接口，定义用户的个人偏好配置选项
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto' // 主题模式
  language: 'zh-CN' | 'en-US' // 语言设置
  downloadPath: string // 下载路径
  maxConcurrentDownloads: number // 最大并发下载数
  autoDownload: boolean // 自动下载开关
  notifications: { // 通知设置
    downloadComplete: boolean // 下载完成通知
    newMovies: boolean // 新片通知
    systemUpdates: boolean // 系统更新通知
  }
}

// 用户领域实体类，聚合根：用户管理领域的核心实体，包含用户的完整信息和业务规则
export class User {
  constructor(
    public readonly id: string, // 用户唯一标识符
    public readonly profile: UserProfile, // 用户档案信息
    public readonly preferences: UserPreferences, // 用户偏好设置
    private password: Password, // 用户密码（加密存储）
    public readonly roles: string[] = ['user'], // 用户角色列表，默认为['user']
    public readonly isActive: boolean = true, // 账户是否激活，默认为true
    public readonly lastLoginAt?: Date // 最后登录时间
  ) {}

  // 兼容性属性访问器 - 提供用户详细信息的扁平化对象，保持与现有代码的兼容性
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

  // 更新用户档案信息 - 返回新的User实例保证不可变性
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

  // 更新用户偏好设置 - 合并新的偏好设置并返回新的User实例
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

  // 更改用户密码 - 安全地更新用户密码并返回新的User实例
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

  // 用户登录 - 更新最后登录时间并返回新的User实例
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

  // 检查用户角色 - 判断用户是否具有指定角色
  hasRole(role: string): boolean {
    return this.roles.includes(role)
  }

  // 检查下载权限 - 根据用户状态和角色判断是否具有下载权限
  canDownload(): boolean {
    return (
      this.isActive &&
      (this.hasRole('user') || this.hasRole('premium') || this.hasRole('admin'))
    )
  }

  // 获取最大并发下载数 - 根据用户角色返回对应的并发下载数限制
  getMaxConcurrentDownloads(): number {
    if (this.hasRole('premium')) return 10
    if (this.hasRole('admin')) return 20
    return this.preferences.maxConcurrentDownloads
  }

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
      theme: 'auto', // 默认自动主题
      language: 'zh-CN', // 默认中文
      downloadPath: './downloads', // 默认下载路径
      maxConcurrentDownloads: 3, // 默认并发下载数
      autoDownload: false, // 默认不自动下载
      notifications: {
        downloadComplete: true, // 下载完成通知默认开启
        newMovies: true, // 新片通知默认开启
        systemUpdates: false, // 系统更新通知默认关闭
      },
    }

    return new User(id, profile, preferences, password)
  }
}
