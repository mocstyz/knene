/**
 * @fileoverview 密码值对象
 * @description 密码值对象，提供密码的创建、验证、加密和比较功能，确保密码的安全性和合规性
 * @created 2025-10-09 13:10:49
 * @updated 2025-10-19 10:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 密码值对象，提供密码的创建、验证、加密和比较功能
export class Password {
  private readonly _hashedValue: string

  // 构造函数，支持明文和已哈希密码的创建
  constructor(value: string, isHashed: boolean = false) {
    if (isHashed) {
      this._hashedValue = value
    } else {
      this.validatePassword(value)
      this._hashedValue = this.hash(value)
    }
  }

  // 获取哈希后的密码值
  get hashedValue(): string {
    return this._hashedValue
  }

  // 验证密码强度和格式
  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new Error('密码长度至少为8位')
    }

    if (password.length > 128) {
      throw new Error('密码长度不能超过128位')
    }

    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (!hasUpperCase) {
      throw new Error('密码必须包含至少一个大写字母')
    }

    if (!hasLowerCase) {
      throw new Error('密码必须包含至少一个小写字母')
    }

    if (!hasNumbers) {
      throw new Error('密码必须包含至少一个数字')
    }

    if (!hasSpecialChar) {
      throw new Error('密码必须包含至少一个特殊字符')
    }
  }

  // 简单的哈希函数（实际应用中应使用更安全的哈希算法）
  private hash(password: string): string {
    // 注意：这里使用简单的哈希仅用于演示，实际应用中应使用bcrypt等安全算法
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // 转换为32位整数
    }
    return btoa(hash.toString()).replace(/[/+=]/g, '')
  }

  // 验证明文密码是否匹配
  verify(plainPassword: string): boolean {
    return this._hashedValue === this.hash(plainPassword)
  }

  // 比较两个密码是否相等
  equals(other: Password): boolean {
    return this._hashedValue === other._hashedValue
  }

  // 获取密码强度等级
  getStrength(): 'weak' | 'medium' | 'strong' | 'very-strong' {
    const length = this._hashedValue.length
    if (length < 20) return 'weak'
    if (length < 30) return 'medium'
    if (length < 40) return 'strong'
    return 'very-strong'
  }

  // 检查密码是否需要更新
  needsUpdate(): boolean {
    return this.getStrength() === 'weak'
  }

  // 转换为字符串（返回哈希值）
  toString(): string {
    return this._hashedValue
  }

  // ========== 静态工厂方法 ==========

  // 从明文密码创建密码对象
  static fromPlain(plainPassword: string): Password {
    return new Password(plainPassword, false)
  }

  // 从哈希密码创建密码对象
  static fromHashed(hashedPassword: string): Password {
    return new Password(hashedPassword, true)
  }

  // 生成随机密码
  static generate(length: number = 12): Password {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const specialChars = '!@#$%^&*(),.?":{}|<>'
    const allChars = uppercase + lowercase + numbers + specialChars

    let password = ''

    // 确保包含各种类型的字符
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length))
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length))
    password += numbers.charAt(Math.floor(Math.random() * numbers.length))
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length))

    // 填充剩余长度
    for (let i = 4; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length))
    }

    // 打乱字符顺序
    password = password.split('').sort(() => Math.random() - 0.5).join('')

    return new Password(password)
  }

  // 验证密码格式是否有效
  static isValid(plainPassword: string): boolean {
    try {
      new Password(plainPassword)
      return true
    } catch {
      return false
    }
  }

  // 检查密码强度
  static checkStrength(plainPassword: string): {
    score: number
    feedback: string[]
    level: 'weak' | 'medium' | 'strong' | 'very-strong'
  } {
    let score = 0
    const feedback: string[] = []

    if (plainPassword.length >= 8) score += 1
    else feedback.push('密码长度至少需要8位')

    if (plainPassword.length >= 12) score += 1
    else feedback.push('建议密码长度至少12位')

    if (/[A-Z]/.test(plainPassword)) score += 1
    else feedback.push('需要包含大写字母')

    if (/[a-z]/.test(plainPassword)) score += 1
    else feedback.push('需要包含小写字母')

    if (/\d/.test(plainPassword)) score += 1
    else feedback.push('需要包含数字')

    if (/[!@#$%^&*(),.?":{}|<>]/.test(plainPassword)) score += 1
    else feedback.push('需要包含特殊字符')

    let level: 'weak' | 'medium' | 'strong' | 'very-strong' = 'weak'
    if (score >= 5) level = 'very-strong'
    else if (score >= 4) level = 'strong'
    else if (score >= 3) level = 'medium'

    return { score, feedback, level }
  }
}
