/**
 * @fileoverview 用户应用服务
 * @description 协调用户相关业务流程，编排注册、登录、资料更新、密码修改与注销等逻辑
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */
import { User } from '@domain/entities/User'
import { AuthenticationService } from '@domain/services/AuthenticationService'
import { Password } from '@domain/value-objects/Password'

// 用户应用服务类，协调用户业务流程，编排注册、登录、资料更新、密码修改与注销等逻辑
export class UserApplicationService {
  // 用户注册的完整业务流程，包含数据验证、用户创建、令牌生成、邮件验证等
  static async registerUser(userData: {
    email: string
    username: string
    password: string
    confirmPassword: string
  }): Promise<{
    user: User
    token: string
    refreshToken: string
    requiresEmailVerification: boolean
  }> {
    try {
      // 输入数据验证 - 检查邮箱格式、密码强度、用户名长度等
      this.validateRegistrationData(userData)

      // 唯一性检查 - 验证邮箱和用户名是否已被其他用户使用
      await this.checkUserAvailability(userData.email, userData.username)

      // 用户实体创建 - 通过工厂方法创建包含完整信息的用户领域对象
      const user = await this.createUser(userData)

      // 认证令牌生成 - 生成访问令牌和刷新令牌用于会话管理
      const { token, refreshToken } = await this.generateAuthTokens(user)

      // 邮件验证发送 - 向用户注册邮箱发送验证邮件
      const requiresEmailVerification = await this.sendVerificationEmail(user)

      // 业务事件记录 - 记录用户注册行为用于审计和分析
      await this.recordUserActivity(user.detail.id, 'register', {
        email: userData.email,
        username: userData.username,
      })

      return {
        user,
        token,
        refreshToken,
        requiresEmailVerification,
      }
    } catch (error) {
      console.error('用户注册失败:', error)
      throw error
    }
  }

  // 用户登录的完整业务流程，包含凭据验证、两步验证检查、令牌生成等
  static async loginUser(credentials: {
    email: string
    password: string
    rememberMe?: boolean // 是否记住登录状态，影响token有效期
  }): Promise<{
    user: User
    token: string
    refreshToken: string
    requiresTwoFactor: boolean
    twoFactorMethods?: string[]
  }> {
    try {
      // 1. 验证登录凭据
      const validation = AuthenticationService.validateCredentials(
        credentials.email,
        credentials.password
      )

      if (!validation.isValid) {
        throw new Error(`登录凭据无效: ${validation.errors.join(', ')}`)
      }

      // 模拟用户查找 - 实际应该从仓储查找
      const authResult = await this.findUserByEmail(credentials.email)

      // 2. 检查是否需要两步验证
      const twoFactorResult = await this.checkTwoFactorRequirement(
        authResult.user
      )

      if (twoFactorResult.required) {
        return {
          user: authResult.user,
          token: '', // 两步验证完成后再提供
          refreshToken: '',
          requiresTwoFactor: true,
          twoFactorMethods: twoFactorResult.methods,
        }
      }

      // 3. 生成认证令牌
      const { token, refreshToken } = await this.generateAuthTokens(
        authResult.user
      )

      // 4. 更新最后登录时间
      await this.updateLastLogin(authResult.user.detail.id)

      // 5. 记录登录事件
      await this.recordUserActivity(authResult.user.detail.id, 'login', {
        email: credentials.email,
        rememberMe: credentials.rememberMe,
      })

      return {
        user: authResult.user,
        token,
        refreshToken,
        requiresTwoFactor: false,
      }
    } catch (error) {
      console.error('用户登录失败:', error)
      throw error
    }
  }

  // 更新用户资料的完整流程，包含数据验证、更新应用、事件记录等
  static async updateUserProfile(
    userId: string,
    updates: Partial<{
      username: string
      avatar: string
      bio: string
      preferences: Record<string, unknown> // 用户偏好设置，可选配置项
    }>
  ): Promise<User> {
    try {
      // 1. 获取当前用户信息
      const currentUser = await this.getUserById(userId)
      if (!currentUser) {
        throw new Error('用户不存在')
      }

      // 2. 验证更新数据
      await this.validateProfileUpdates(userId, updates)

      // 3. 应用更新
      const updatedUser = await this.applyProfileUpdates(currentUser, updates)

      // 4. 保存更新
      await this.saveUser(updatedUser)

      // 5. 记录更新事件
      await this.recordUserActivity(userId, 'update_profile', updates)

      return updatedUser
    } catch (error) {
      console.error('更新用户资料失败:', error)
      throw error
    }
  }

  // 用户密码修改流程，包含密码验证、强度检查、会话撤销、安全通知等
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // 身份验证 - 验证用户身份和当前密码的正确性
      const currentUser = await this.getUserById(userId)
      if (!currentUser) {
        throw new Error('用户不存在')
      }

      const isCurrentPasswordValid = await AuthenticationService.verifyPassword(
        currentPassword,
        currentUser.detail.password
      )

      if (!isCurrentPasswordValid) {
        throw new Error('当前密码不正确')
      }

      // 新密码验证 - 检查新密码强度和安全性要求
      this.validatePasswordStrength(newPassword)

      // 密码更新 - 创建新的密码值对象并更新用户实体
      const newPasswordValue = new Password(newPassword)
      const updatedUser = currentUser.changePassword(newPasswordValue)
      await this.saveUser(updatedUser)

      // 安全措施 - 撤销所有现有会话强制用户重新登录
      await this.revokeAllUserSessions(userId)

      // 安全审计 - 记录密码修改事件用于安全监控
      await this.recordUserActivity(userId, 'change_password', {})

      // 用户通知 - 发送安全通知邮件提醒用户密码已修改
      await this.sendSecurityNotification(userId, 'password_changed')

      return {
        success: true,
        message: '密码修改成功，请重新登录',
      }
    } catch (error) {
      console.error('密码修改失败:', error)
      throw error
    }
  }

  // 用户注销流程，包含密码验证、下载检查、账户停用、数据清理等
  static async deactivateUser(userId: string, password: string): Promise<void> {
    try {
      // 1. 验证用户密码
      const currentUser = await this.getUserById(userId)
      if (!currentUser) {
        throw new Error('用户不存在')
      }

      const isPasswordValid = await AuthenticationService.verifyPassword(
        password,
        currentUser.detail.password
      )

      if (!isPasswordValid) {
        throw new Error('密码不正确')
      }

      // 2. 检查用户是否有未完成的下载任务
      const activeDownloads = await this.getActiveDownloads(userId)
      if (activeDownloads.length > 0) {
        throw new Error('您有未完成的下载任务，请等待完成或取消后再注销账户')
      }

      // 3. 停用用户账户
      await this.deactivateUserAccount(userId)

      // 4. 撤销所有会话
      await this.revokeAllUserSessions(userId)

      // 5. 清理用户数据（可选）
      await this.cleanupUserData(userId)

      // 6. 记录注销事件
      await this.recordUserActivity(userId, 'deactivate_account', {})

      // 7. 发送确认邮件
      await this.sendAccountNotification(userId, 'account_deactivated')
    } catch (error) {
      console.error('用户注销失败:', error)
      throw error
    }
  }

  // 私有辅助方法
  private static validateRegistrationData(userData: {
    email: string
    username: string
    password: string
    confirmPassword: string
  }): void {
    if (!userData.email || !userData.username || !userData.password) {
      throw new Error('所有字段都是必填的')
    }

    if (userData.password !== userData.confirmPassword) {
      throw new Error('两次输入的密码不一致')
    }

    if (userData.password.length < 8) {
      throw new Error('密码长度至少8位')
    }

    if (!this.isValidEmail(userData.email)) {
      throw new Error('邮箱格式不正确')
    }

    if (userData.username.length < 3 || userData.username.length > 20) {
      throw new Error('用户名长度必须在3-20个字符之间')
    }
  }

  private static async checkUserAvailability(
    email: string,
    username: string
  ): Promise<void> {
    // 这里应该调用仓储层检查
    // 暂时模拟检查逻辑
    console.log(`检查用户可用性: ${email}, ${username}`)
  }

  private static async createUser(userData: {
    email: string
    username: string
    password: string
    confirmPassword: string
  }): Promise<User> {
    // 这里应该通过工厂方法创建用户实体
    // 暂时返回模拟用户
    return {
      detail: {
        id: `user-${Date.now()}`,
        email: userData.email,
        username: userData.username,
        password: userData.password, // 实际应该是哈希值
        avatar: '',
        bio: '',
        isActive: true,
        isEmailVerified: false,
        subscription: { type: 'basic', expiresAt: new Date() },
        preferences: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    } as User
  }

  private static async generateAuthTokens(_user: User): Promise<{
    token: string
    refreshToken: string
  }> {
    // 这里应该调用JWT服务生成令牌
    return {
      token: `mock-jwt-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
    }
  }

  private static async sendVerificationEmail(user: User): Promise<boolean> {
    // 这里应该调用邮件服务
    console.log(`发送验证邮件到: ${user.detail.email}`)
    return true
  }

  private static async checkTwoFactorRequirement(_user: User): Promise<{
    required: boolean
    methods?: string[]
  }> {
    // 检查用户是否启用了两步验证
    return {
      required: false,
      methods: [],
    }
  }

  private static async updateLastLogin(userId: string): Promise<void> {
    // 更新用户最后登录时间
    console.log(`更新用户最后登录时间: ${userId}`)
  }

  private static async getUserById(userId: string): Promise<User | null> {
    // 从仓储获取用户 - 暂时返回null，需要实现用户查找逻辑
    console.log(`查找用户ID: ${userId}`)
    return null
  }

  private static async validateProfileUpdates(
    _userId: string,
    updates: Record<string, unknown>
  ): Promise<void> {
    if (updates.username && typeof updates.username === 'string') {
      if (updates.username.length < 3 || updates.username.length > 20) {
        throw new Error('用户名长度必须在3-20个字符之间')
      }
      // 检查用户名是否已被占用
      await this.checkUserAvailability('', updates.username)
    }
  }

  private static async applyProfileUpdates(
    user: User,
    _updates: Record<string, unknown>
  ): Promise<User> {
    // 应用更新到用户实体
    return user // 这里应该返回更新后的用户
  }

  private static async saveUser(user: User): Promise<void> {
    // 保存用户到仓储
    console.log(`保存用户: ${user.detail.id}`)
  }

  private static async recordUserActivity(
    userId: string,
    action: string,
    metadata: Record<string, unknown>
  ): Promise<void> {
    // 记录用户活动
    console.log(`记录用户活动: ${userId} - ${action}`, metadata)
  }

  private static validatePasswordStrength(password: string): void {
    if (password.length < 8) {
      throw new Error('密码长度至少8位')
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      throw new Error('密码必须包含大小写字母和数字')
    }
  }

  private static async revokeAllUserSessions(userId: string): Promise<void> {
    // 撤销用户所有会话
    console.log(`撤销用户所有会话: ${userId}`)
  }

  private static async sendSecurityNotification(
    userId: string,
    type: string
  ): Promise<void> {
    // 发送安全通知邮件
    console.log(`发送安全通知: ${userId} - ${type}`)
  }

  private static async getActiveDownloads(userId: string): Promise<unknown[]> {
    // 获取用户活跃的下载任务
    const { useDownloadStore } = await import(
      '@application/stores/downloadStore'
    )
    return useDownloadStore
      .getState()
      .downloads.filter(d => d.userId === userId && d.status === 'downloading')
  }

  private static async deactivateUserAccount(userId: string): Promise<void> {
    // 停用用户账户
    console.log(`停用用户账户: ${userId}`)
  }

  private static async cleanupUserData(userId: string): Promise<void> {
    // 清理用户相关数据
    console.log(`清理用户数据: ${userId}`)
  }

  private static async sendAccountNotification(
    userId: string,
    type: string
  ): Promise<void> {
    // 发送账户相关通知
    console.log(`发送账户通知: ${userId} - ${type}`)
  }

  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  private static async findUserByEmail(
    _email: string
  ): Promise<{ user: User }> {
    // 模拟用户查找 - 实际应该从仓储查找
    // 暂时抛出错误，表示需要实现仓储层查找
    throw new Error('用户查找功能需要实现仓储层查找')
  }
}
