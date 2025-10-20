/**
 * @fileoverview 认证API服务
 * @description 处理用户认证相关的所有API调用，包括登录、注册、密码管理、邮箱验证。
 *              支持两步验证、会话管理和用户账户操作等高级功能。
 *              遵循安全最佳实践，提供完整的用户认证和授权解决方案。
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-19 15:06:15
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { User } from '@application/stores/userStore'
import { httpClient } from '@infrastructure/api/movieApi'

// 认证API服务类 - 提供完整的用户认证功能
export class AuthApi {
  // 用户登录方法 - 验证用户凭据并返回认证信息
  static async login(
    email: string,
    password: string
  ): Promise<{
    user: User
    token: string
    refreshToken: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 800))

    const response = await httpClient.post<{
      user: User
      token: string
      refreshToken: string
    }>('/auth/login', { email, password })

    // 存储认证令牌到本地存储
    localStorage.setItem('auth_token', response.data.token)
    localStorage.setItem('refresh_token', response.data.refreshToken)

    return response.data
  }

  // 用户注册方法 - 创建新用户账户并返回认证信息
  static async register(userData: {
    email: string
    username: string
    password: string
    confirmPassword: string
  }): Promise<{
    user: User
    token: string
    refreshToken: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const response = await httpClient.post<{
      user: User
      token: string
      refreshToken: string
    }>('/auth/register', userData)

    // 存储认证令牌到本地存储
    localStorage.setItem('auth_token', response.data.token)
    localStorage.setItem('refresh_token', response.data.refreshToken)

    return response.data
  }

  // 用户登出方法 - 清除认证状态并清理本地存储
  static async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))

    try {
      await httpClient.post<void>('/auth/logout')
    } finally {
      // 清除本地存储的令牌和用户数据
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_data')
    }
  }

  // 刷新访问令牌 - 使用刷新令牌获取新的访问令牌
  static async refreshToken(): Promise<{
    token: string
    refreshToken: string
  }> {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    await new Promise(resolve => setTimeout(resolve, 400))

    const response = await httpClient.post<{
      token: string
      refreshToken: string
    }>('/auth/refresh', { refreshToken })

    // 更新存储的令牌
    localStorage.setItem('auth_token', response.data.token)
    localStorage.setItem('refresh_token', response.data.refreshToken)

    return response.data
  }

  // 获取当前用户信息 - 从服务器获取当前登录用户的详细资料
  static async getCurrentUser(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const response = await httpClient.get<User>('/auth/me')
    return response.data
  }

  // 更新用户资料 - 更新用户的基本信息和偏好设置
  static async updateProfile(updates: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 600))

    const response = await httpClient.put<User>('/auth/profile', updates)
    return response.data
  }

  // 更新用户偏好设置 - 更新用户的主题、语言等个人偏好
  static async updatePreferences(
    preferences: Partial<User['preferences']>
  ): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 400))

    const response = await httpClient.put<User>(
      '/auth/preferences',
      preferences
    )
    return response.data
  }

  // 修改密码 - 验证当前密码后设置新密码
  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800))

    await httpClient.put<void>('/auth/change-password', {
      currentPassword,
      newPassword,
    })
  }

  // 忘记密码 - 发送密码重置邮件到用户邮箱
  static async forgotPassword(email: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    await httpClient.post<void>('/auth/forgot-password', { email })
  }

  // 重置密码 - 使用重置令牌设置新密码
  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800))

    await httpClient.post<void>('/auth/reset-password', {
      token,
      newPassword,
    })
  }

  // 验证邮箱 - 使用验证令牌激活用户邮箱
  static async verifyEmail(token: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 600))

    await httpClient.post<void>('/auth/verify-email', { token })
  }

  // 重新发送验证邮件 - 向用户邮箱重新发送验证链接
  static async resendVerificationEmail(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))

    await httpClient.post<void>('/auth/resend-verification')
  }

  // 检查邮箱是否已存在 - 验证邮箱地址的唯一性
  static async checkEmailExists(email: string): Promise<{ exists: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const response = await httpClient.get<{ exists: boolean }>(
      `/auth/check-email?email=${encodeURIComponent(email)}`
    )
    return response.data
  }

  // 检查用户名是否已存在 - 验证用户名的唯一性
  static async checkUsernameExists(
    username: string
  ): Promise<{ exists: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const response = await httpClient.get<{ exists: boolean }>(
      `/auth/check-username?username=${encodeURIComponent(username)}`
    )
    return response.data
  }

  // 获取用户订阅信息 - 获取用户的订阅类型和到期时间
  static async getSubscription(): Promise<User['subscription']> {
    await new Promise(resolve => setTimeout(resolve, 400))

    const response =
      await httpClient.get<User['subscription']>('/auth/subscription')
    return response.data
  }

  // 更新订阅 - 升级或续费用户订阅
  static async updateSubscription(
    subscriptionType: 'basic' | 'premium' | 'vip'
  ): Promise<User['subscription']> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const response = await httpClient.post<User['subscription']>(
      '/auth/subscription',
      {
        type: subscriptionType,
      }
    )
    return response.data
  }

  // 取消订阅 - 取消用户的自动续费订阅
  static async cancelSubscription(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 600))

    await httpClient.delete<void>('/auth/subscription')
  }

  // 获取用户活动日志 - 获取用户的操作历史记录
  static async getActivityLog(params?: {
    page?: number
    limit?: number
    type?: string
  }): Promise<{
    activities: Array<{
      id: string
      type: string
      description: string
      timestamp: string
      metadata?: Record<string, unknown>
    }>
    total: number
    page: number
    totalPages: number
  }> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.type) queryParams.append('type', params.type)

    await new Promise(resolve => setTimeout(resolve, 500))

    const response = await httpClient.get<{
      activities: Array<{
        id: string
        type: string
        description: string
        timestamp: string
        metadata?: Record<string, unknown>
      }>
      total: number
      page: number
      totalPages: number
    }>(`/auth/activity-log?${queryParams.toString()}`)
    return response.data
  }

  // 删除账户 - 永久删除用户账户和所有相关数据
  static async deleteAccount(_password: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      await httpClient.delete<void>('/auth/account')
    } finally {
      // 清除本地存储
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_data')
    }
  }

  // 启用两步验证 - 设置两步验证并生成备用码
  static async enableTwoFactor(): Promise<{
    qrCode: string
    secret: string
    backupCodes: string[]
  }> {
    await new Promise(resolve => setTimeout(resolve, 600))

    const response = await httpClient.post<{
      qrCode: string
      secret: string
      backupCodes: string[]
    }>('/auth/2fa/enable')
    return response.data
  }

  // 确认两步验证 - 验证两步验证设置是否成功
  static async confirmTwoFactor(token: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400))

    await httpClient.post<void>('/auth/2fa/confirm', { token })
  }

  // 禁用两步验证 - 关闭账户的两步验证功能
  static async disableTwoFactor(password: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))

    await httpClient.post<void>('/auth/2fa/disable', { password })
  }

  // 验证两步验证码 - 验证登录时的两步验证码
  static async verifyTwoFactor(token: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))

    await httpClient.post<void>('/auth/2fa/verify', { token })
  }

  // 获取登录会话列表 - 获取所有活跃的登录会话信息
  static async getSessions(): Promise<
    Array<{
      id: string
      device: string
      location: string
      ipAddress: string
      lastActive: string
      current: boolean
    }>
  > {
    await new Promise(resolve => setTimeout(resolve, 400))

    const response = await httpClient.get<
      Array<{
        id: string
        device: string
        location: string
        ipAddress: string
        lastActive: string
        current: boolean
      }>
    >('/auth/sessions')
    return response.data
  }

  // 终止指定会话 - 终止特定设备的登录会话
  static async terminateSession(sessionId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))

    await httpClient.delete<void>(`/auth/sessions/${sessionId}`)
  }

  // 终止所有其他会话 - 终止除当前会话外的所有其他登录会话
  static async terminateAllOtherSessions(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))

    await httpClient.delete<void>('/auth/sessions/others')
  }
}
