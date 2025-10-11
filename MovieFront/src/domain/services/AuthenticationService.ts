import { User } from '@domain/entities/User'

/**
 * 认证领域服务
 * 处理用户认证相关的业务逻辑
 */
export class AuthenticationService {
  /**
   * 验证用户凭据
   */
  static validateCredentials(
    email: string,
    password: string
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // 邮箱验证
    if (!email) {
      errors.push('邮箱不能为空')
    } else if (!this.isValidEmail(email)) {
      errors.push('邮箱格式不正确')
    }

    // 密码验证
    if (!password) {
      errors.push('密码不能为空')
    } else if (password.length < 6) {
      errors.push('密码长度不能少于6位')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * 验证注册信息
   */
  static validateRegistration(userData: {
    email: string
    username: string
    password: string
    confirmPassword: string
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // 邮箱验证
    if (!userData.email) {
      errors.push('邮箱不能为空')
    } else if (!this.isValidEmail(userData.email)) {
      errors.push('邮箱格式不正确')
    }

    // 用户名验证
    if (!userData.username) {
      errors.push('用户名不能为空')
    } else if (userData.username.length < 2) {
      errors.push('用户名长度不能少于2位')
    } else if (userData.username.length > 20) {
      errors.push('用户名长度不能超过20位')
    } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(userData.username)) {
      errors.push('用户名只能包含字母、数字、下划线和中文')
    }

    // 密码验证
    if (!userData.password) {
      errors.push('密码不能为空')
    } else if (userData.password.length < 6) {
      errors.push('密码长度不能少于6位')
    } else if (userData.password.length > 50) {
      errors.push('密码长度不能超过50位')
    } else if (!this.isStrongPassword(userData.password)) {
      errors.push('密码必须包含字母和数字')
    }

    // 确认密码验证
    if (userData.password !== userData.confirmPassword) {
      errors.push('两次输入的密码不一致')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * 验证密码强度
   */
  static isStrongPassword(password: string): boolean {
    // 至少包含一个字母和一个数字
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    return hasLetter && hasNumber
  }

  /**
   * 验证密码
   */
  static async verifyPassword(
    inputPassword: string,
    storedPassword: string
  ): Promise<boolean> {
    // 这里应该使用安全的密码验证算法
    // 暂时使用简单比较，实际应该使用 bcrypt 等
    return inputPassword === storedPassword
  }

  /**
   * 验证邮箱格式
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * 验证邮箱格式（别名方法，保持向后兼容）
   */
  static validateEmail(email: string): boolean {
    return this.isValidEmail(email)
  }

  /**
   * 检查密码强度
   */
  static checkPasswordStrength(password: string): {
    score: number
    feedback: string[]
    isValid: boolean
  } {
    const feedback: string[] = []
    let score = 0

    // 长度检查
    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push('密码长度至少需要8个字符')
    }

    // 包含小写字母
    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push('密码需要包含小写字母')
    }

    // 包含大写字母
    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push('密码需要包含大写字母')
    }

    // 包含数字
    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push('密码需要包含数字')
    }

    // 包含特殊字符
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1
    } else {
      feedback.push('密码建议包含特殊字符')
    }

    return {
      score,
      feedback,
      isValid: score >= 3,
    }
  }

  /**
   * 生成用户会话令牌
   */
  static generateSessionToken(user: User): string {
    // 在实际应用中，这应该是一个安全的JWT令牌
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2)
    return `${user.id}_${timestamp}_${randomStr}`
  }

  /**
   * 验证会话令牌
   */
  static validateSessionToken(token: string): {
    isValid: boolean
    userId?: string
  } {
    try {
      const parts = token.split('_')
      if (parts.length !== 3) {
        return { isValid: false }
      }

      const userId = parts[0]
      const timestamp = parseInt(parts[1])
      const now = Date.now()

      // 检查令牌是否过期（24小时）
      const isExpired = now - timestamp > 24 * 60 * 60 * 1000

      return {
        isValid: !isExpired,
        userId: isExpired ? undefined : userId,
      }
    } catch {
      return { isValid: false }
    }
  }

  /**
   * 检查用户权限
   */
  static hasPermission(user: User, permission: string): boolean {
    // 管理员拥有所有权限
    if (user.hasRole('admin')) {
      return true
    }

    // VIP用户权限
    if (user.detail.subscription?.type === 'premium') {
      const vipPermissions = [
        'download_hd',
        'download_4k',
        'unlimited_downloads',
        'priority_support',
        'ad_free',
      ]
      if (vipPermissions.includes(permission)) {
        return true
      }
    }

    // 高级用户权限
    if (user.detail.subscription?.type === 'premium') {
      const premiumPermissions = [
        'download_hd',
        'multiple_downloads',
        'ad_free',
      ]
      if (premiumPermissions.includes(permission)) {
        return true
      }
    }

    // 基础用户权限
    const basicPermissions = ['view_movies', 'download_sd', 'create_favorites']

    return basicPermissions.includes(permission)
  }

  /**
   * 检查订阅状态
   */
  static isSubscriptionActive(user: User): boolean {
    if (!user.detail.subscription) {
      return false
    }

    const now = new Date()
    const expiryDate = new Date(user.detail.subscription.expiresAt!)

    return expiryDate > now
  }

  /**
   * 获取用户可用的下载质量选项
   */
  static getAvailableQualities(user: User): string[] {
    const baseQualities = ['SD']

    if (this.hasPermission(user, 'download_hd')) {
      baseQualities.push('HD')
    }

    if (this.hasPermission(user, 'download_4k')) {
      baseQualities.push('4K')
    }

    return baseQualities
  }

  /**
   * 获取用户最大并发下载数
   */
  static getMaxConcurrentDownloads(user: User): number {
    if (this.hasPermission(user, 'unlimited_downloads')) {
      return 10
    }

    if (this.hasPermission(user, 'multiple_downloads')) {
      return 3
    }

    return 1
  }

  /**
   * 检查用户是否可以访问管理功能
   */
  static canAccessAdmin(user: User): boolean {
    return user.hasRole('admin')
  }

  /**
   * 生成密码重置令牌
   */
  static generatePasswordResetToken(email: string): string {
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2)
    return `reset_${email}_${timestamp}_${randomStr}`
  }

  /**
   * 验证密码重置令牌
   */
  static validatePasswordResetToken(token: string): {
    isValid: boolean
    email?: string
  } {
    try {
      const parts = token.split('_')
      if (parts.length !== 4 || parts[0] !== 'reset') {
        return { isValid: false }
      }

      const email = parts[1]
      const timestamp = parseInt(parts[2])
      const now = Date.now()

      // 检查令牌是否过期（1小时）
      const isExpired = now - timestamp > 60 * 60 * 1000

      return {
        isValid: !isExpired && this.isValidEmail(email),
        email: isExpired ? undefined : email,
      }
    } catch {
      return { isValid: false }
    }
  }
}
