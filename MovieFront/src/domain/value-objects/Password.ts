export class Password {
  private readonly _hashedValue: string

  constructor(value: string, isHashed: boolean = false) {
    if (isHashed) {
      this._hashedValue = value
    } else {
      this.validatePassword(value)
      this._hashedValue = this.hash(value)
    }
  }

  get hashedValue(): string {
    return this._hashedValue
  }

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

    const strengthCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar]
      .filter(Boolean).length

    if (strengthCount < 3) {
      throw new Error('密码必须包含大写字母、小写字母、数字和特殊字符中的至少3种')
    }

    // 检查常见弱密码
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'root', '12345678'
    ]

    if (commonPasswords.includes(password.toLowerCase())) {
      throw new Error('不能使用常见的弱密码')
    }
  }

  private hash(password: string): string {
    // 在实际应用中，这里应该使用bcrypt或其他安全的哈希算法
    // 这里只是示例实现
    return btoa(password + 'salt')
  }

  verify(plainPassword: string): boolean {
    try {
      const hashedInput = this.hash(plainPassword)
      return hashedInput === this._hashedValue
    } catch {
      return false
    }
  }

  equals(other: Password): boolean {
    return this._hashedValue === other._hashedValue
  }

  static getStrength(password: string): 'weak' | 'medium' | 'strong' | 'very-strong' {
    if (password.length < 8) return 'weak'

    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    const strengthCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar]
      .filter(Boolean).length

    if (password.length >= 12 && strengthCount === 4) {
      return 'very-strong'
    } else if (password.length >= 10 && strengthCount >= 3) {
      return 'strong'
    } else if (strengthCount >= 2) {
      return 'medium'
    } else {
      return 'weak'
    }
  }

  static fromHash(hashedValue: string): Password {
    return new Password(hashedValue, true)
  }
}