import { Email } from '../value-objects/Email'
import { Password } from '../value-objects/Password'
import { Avatar } from '../value-objects/Avatar'

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

  // 业务方法
  updateProfile(updates: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>): User {
    const updatedProfile = {
      ...this.profile,
      ...updates,
      updatedAt: new Date()
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

  updatePreferences(updates: Partial<UserPreferences>): User {
    const updatedPreferences = {
      ...this.preferences,
      ...updates
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

  hasRole(role: string): boolean {
    return this.roles.includes(role)
  }

  canDownload(): boolean {
    return this.isActive && (this.hasRole('user') || this.hasRole('premium') || this.hasRole('admin'))
  }

  getMaxConcurrentDownloads(): number {
    if (this.hasRole('premium')) return 10
    if (this.hasRole('admin')) return 20
    return this.preferences.maxConcurrentDownloads
  }

  // 领域事件
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
      updatedAt: new Date()
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
        systemUpdates: false
      }
    }

    return new User(id, profile, preferences, password)
  }
}