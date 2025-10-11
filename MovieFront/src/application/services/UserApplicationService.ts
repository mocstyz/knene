import { User } from '@domain/entities/User'
import { AuthenticationService } from '@domain/services/AuthenticationService'
import { Password } from '@domain/value-objects/Password'

/**
 * 用户应用服务
 * 协调用户相关的业务流程
 */
export class UserApplicationService {
  /**
   * 用户注册的完整业务流程
   */
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
      // 1. 验证输入数据
      this.validateRegistrationData(userData)

      // 2. 检查邮箱和用户名是否已存在
      await this.checkUserAvailability(userData.email, userData.username)

      // 3. 创建用户实体
      const user = await this.createUser(userData)

      // 4. 生成认证令牌
      const { token, refreshToken } = await this.generateAuthTokens(user)

      // 5. 发送验证邮件（如果需要）
      const requiresEmailVerification = await this.sendVerificationEmail(user)

      // 6. 记录注册事件
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

  /**
   * 用户登录的完整业务流程
   */
  static async loginUser(credentials: {
    email: string
    password: string
    rememberMe?: boolean
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

  /**
   * 更新用户资料的完整流程
   */
  static async updateUserProfile(
    userId: string,
    updates: Partial<{
      username: string
      avatar: string
      bio: string
      preferences: Record<string, unknown>
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

  /**
   * 用户密码修改流程
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // 1. 验证当前密码
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

      // 2. 验证新密码强度
      this.validatePasswordStrength(newPassword)

      // 3. 更新密码
      const newPasswordValue = new Password(newPassword)
      const updatedUser = currentUser.changePassword(newPasswordValue)
      await this.saveUser(updatedUser)

      // 4. 撤销所有现有会话（强制重新登录）
      await this.revokeAllUserSessions(userId)

      // 5. 记录密码修改事件
      await this.recordUserActivity(userId, 'change_password', {})

      // 6. 发送安全通知邮件
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

  /**
   * 用户注销流程
   */
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
