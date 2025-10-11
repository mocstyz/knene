import { User } from '@application/stores/userStore'
import { httpClient } from '@infrastructure/api/movieApi'

/**
 * 认证API服务
 */
export class AuthApi {
  /**
   * 用户登录
   */
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

    // 存储认证令牌
    localStorage.setItem('auth_token', response.data.token)
    localStorage.setItem('refresh_token', response.data.refreshToken)

    return response.data
  }

  /**
   * 用户注册
   */
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

    // 存储认证令牌
    localStorage.setItem('auth_token', response.data.token)
    localStorage.setItem('refresh_token', response.data.refreshToken)

    return response.data
  }

  /**
   * 用户登出
   */
  static async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))

    try {
      await httpClient.post<void>('/auth/logout')
    } finally {
      // 清除本地存储的令牌
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_data')
    }
  }

  /**
   * 刷新访问令牌
   */
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

  /**
   * 获取当前用户信息
   */
  static async getCurrentUser(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const response = await httpClient.get<User>('/auth/me')
    return response.data
  }

  /**
   * 更新用户资料
   */
  static async updateProfile(updates: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 600))

    const response = await httpClient.put<User>('/auth/profile', updates)
    return response.data
  }

  /**
   * 更新用户偏好设置
   */
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

  /**
   * 修改密码
   */
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

  /**
   * 忘记密码
   */
  static async forgotPassword(email: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    await httpClient.post<void>('/auth/forgot-password', { email })
  }

  /**
   * 重置密码
   */
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

  /**
   * 验证邮箱
   */
  static async verifyEmail(token: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 600))

    await httpClient.post<void>('/auth/verify-email', { token })
  }

  /**
   * 重新发送验证邮件
   */
  static async resendVerificationEmail(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))

    await httpClient.post<void>('/auth/resend-verification')
  }

  /**
   * 检查邮箱是否已存在
   */
  static async checkEmailExists(email: string): Promise<{ exists: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const response = await httpClient.get<{ exists: boolean }>(
      `/auth/check-email?email=${encodeURIComponent(email)}`
    )
    return response.data
  }

  /**
   * 检查用户名是否已存在
   */
  static async checkUsernameExists(
    username: string
  ): Promise<{ exists: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const response = await httpClient.get<{ exists: boolean }>(
      `/auth/check-username?username=${encodeURIComponent(username)}`
    )
    return response.data
  }

  /**
   * 获取用户订阅信息
   */
  static async getSubscription(): Promise<User['subscription']> {
    await new Promise(resolve => setTimeout(resolve, 400))

    const response =
      await httpClient.get<User['subscription']>('/auth/subscription')
    return response.data
  }

  /**
   * 更新订阅
   */
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

  /**
   * 取消订阅
   */
  static async cancelSubscription(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 600))

    await httpClient.delete<void>('/auth/subscription')
  }

  /**
   * 获取用户活动日志
   */
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

  /**
   * 删除账户
   */
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

  /**
   * 启用两步验证
   */
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

  /**
   * 确认两步验证
   */
  static async confirmTwoFactor(token: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400))

    await httpClient.post<void>('/auth/2fa/confirm', { token })
  }

  /**
   * 禁用两步验证
   */
  static async disableTwoFactor(password: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))

    await httpClient.post<void>('/auth/2fa/disable', { password })
  }

  /**
   * 验证两步验证码
   */
  static async verifyTwoFactor(token: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))

    await httpClient.post<void>('/auth/2fa/verify', { token })
  }

  /**
   * 获取登录会话列表
   */
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

  /**
   * 终止指定会话
   */
  static async terminateSession(sessionId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))

    await httpClient.delete<void>(`/auth/sessions/${sessionId}`)
  }

  /**
   * 终止所有其他会话
   */
  static async terminateAllOtherSessions(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))

    await httpClient.delete<void>('/auth/sessions/others')
  }
}
