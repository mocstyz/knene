/**
 * @fileoverview 用户相关API服务 - 服务端状态管理
 * @description 处理用户认证、资料、偏好设置等API调用
 */

import { User } from '@application/stores/userStore'

// 登录请求数据
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

// 注册请求数据
export interface RegisterRequest {
  email: string
  username: string
  password: string
  confirmPassword: string
}

// 更新资料请求数据
export interface UpdateProfileRequest {
  username?: string
  avatar?: string
  preferences?: Partial<User['preferences']>
}

// 用户API服务类
export class UserApiService {
  // 登录
  static async login(data: LoginRequest): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟登录逻辑
    if (data.email === 'admin@example.com' && data.password === 'admin123') {
      return {
        id: 'admin-1',
        email: data.email,
        username: '管理员',
        avatar: 'https://via.placeholder.com/100x100/0066cc/ffffff?text=A',
        role: 'admin',
        status: 'active',
        permissions: ['read', 'write', 'delete', 'manage_users'],
        preferences: {
          theme: 'system',
          language: 'zh-CN',
          autoPlay: true,
          downloadQuality: 'ultra',
          autoDownload: true,
          downloadPath: '/downloads',
          emailNotifications: true,
          pushNotifications: true,
        },
        subscription: {
          type: 'vip',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 一年后
        },
      }
    }

    if (data.email === 'vip@example.com' && data.password === 'vip123') {
      return {
        id: 'vip-1',
        email: data.email,
        username: 'VIP用户',
        avatar: 'https://via.placeholder.com/100x100/FFD700/000000?text=VIP',
        role: 'vip',
        status: 'active',
        permissions: ['read', 'download', 'high_quality'],
        preferences: {
          theme: 'dark',
          language: 'zh-CN',
          autoPlay: true,
          downloadQuality: 'ultra',
          autoDownload: false,
          downloadPath: '/downloads/vip',
          emailNotifications: true,
          pushNotifications: false,
        },
        subscription: {
          type: 'premium',
          expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 半年后
        },
      }
    }

    // 普通用户
    if (data.email && data.password.length >= 6) {
      return {
        id: `user-${Date.now()}`,
        email: data.email,
        username: data.email.split('@')[0],
        avatar: `https://via.placeholder.com/100x100/6366f1/ffffff?text=${data.email[0].toUpperCase()}`,
        role: 'user',
        status: 'active',
        permissions: ['read', 'download'],
        preferences: {
          theme: 'system',
          language: 'zh-CN',
          autoPlay: false,
          downloadQuality: 'high',
          autoDownload: false,
          downloadPath: '/downloads',
          emailNotifications: true,
          pushNotifications: true,
        },
        subscription: {
          type: 'free',
        },
      }
    }

    throw new Error('邮箱或密码错误')
  }

  // 注册
  static async register(data: RegisterRequest): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 验证密码匹配
    if (data.password !== data.confirmPassword) {
      throw new Error('密码不匹配')
    }

    if (data.password.length < 6) {
      throw new Error('密码长度至少6位')
    }

    // 模拟邮箱已存在
    if (data.email === 'admin@example.com') {
      throw new Error('该邮箱已被注册')
    }

    return {
      id: `user-${Date.now()}`,
      email: data.email,
      username: data.username,
      avatar: `https://via.placeholder.com/100x100/10b981/ffffff?text=${data.username[0].toUpperCase()}`,
      role: 'user',
      status: 'active',
      permissions: ['read', 'download'],
      preferences: {
        theme: 'system',
        language: 'zh-CN',
        autoPlay: false,
        downloadQuality: 'high',
        autoDownload: false,
        downloadPath: '/downloads',
        emailNotifications: true,
        pushNotifications: true,
      },
      subscription: {
        type: 'free',
      },
    }
  }

  // 获取用户资料
  static async getProfile(userId: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300))

    // 模拟用户不存在
    if (userId === 'not-found') {
      throw new Error('用户不存在')
    }

    // 返回模拟用户数据
    return {
      id: userId,
      email: 'user@example.com',
      username: '测试用户',
      avatar: 'https://via.placeholder.com/100x100/8b5cf6/ffffff?text=T',
      role: 'user',
      status: 'active',
      permissions: ['read', 'download'],
      preferences: {
        theme: 'light',
        language: 'zh-CN',
        autoPlay: true,
        downloadQuality: 'high',
        autoDownload: false,
        downloadPath: '/downloads',
        emailNotifications: true,
        pushNotifications: false,
      },
      subscription: {
        type: 'free',
      },
    }
  }

  // 更新用户资料
  static async updateProfile(
    userId: string,
    data: UpdateProfileRequest
  ): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 800))

    // 模拟用户不存在
    if (userId === 'not-found') {
      throw new Error('用户不存在')
    }

    // 模拟更新用户资料
    const currentUser = await this.getProfile(userId)

    return {
      ...currentUser,
      ...data,
      preferences: {
        ...currentUser.preferences,
        ...data.preferences,
      },
    }
  }

  // 更新偏好设置
  static async updatePreferences(
    userId: string,
    preferences: Partial<User['preferences']>
  ): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const currentUser = await this.getProfile(userId)

    return {
      ...currentUser,
      preferences: {
        ...currentUser.preferences,
        ...preferences,
      },
    }
  }

  // 修改密码
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800))

    if (currentPassword === newPassword) {
      throw new Error('新密码不能与当前密码相同')
    }

    if (newPassword.length < 6) {
      throw new Error('密码长度至少6位')
    }

    // 模拟密码修改成功
    console.log(`用户 ${userId} 密码修改成功`)
  }

  // 忘记密码
  static async forgotPassword(email: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟发送重置密码邮件
    console.log(`重置密码邮件已发送到: ${email}`)
  }

  // 重置密码
  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800))

    if (!token) {
      throw new Error('重置令牌无效')
    }

    if (newPassword.length < 6) {
      throw new Error('密码长度至少6位')
    }

    console.log('密码重置成功')
  }

  // 验证邮箱
  static async verifyEmail(token: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (!token) {
      throw new Error('验证令牌无效')
    }

    console.log('邮箱验证成功')
  }

  // 检查认证状态
  static async checkAuth(token?: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 200))

    if (!token) {
      return null
    }

    // 模拟令牌验证
    if (token === 'valid-admin-token') {
      return {
        id: 'admin-1',
        email: 'admin@example.com',
        username: '管理员',
        role: 'admin',
        status: 'active',
        permissions: ['read', 'write', 'delete', 'manage_users'],
        preferences: {
          theme: 'system',
          language: 'zh-CN',
          autoPlay: true,
          downloadQuality: 'ultra',
          autoDownload: true,
          downloadPath: '/downloads',
          emailNotifications: true,
          pushNotifications: true,
        },
        subscription: {
          type: 'vip',
        },
      }
    }

    return null
  }

  // 登出
  static async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200))
    console.log('用户已登出')
  }
}
