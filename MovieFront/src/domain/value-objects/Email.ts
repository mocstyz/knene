export class Email {
  private readonly _value: string

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error('无效的邮箱地址格式')
    }
    this._value = value.toLowerCase().trim()
  }

  get value(): string {
    return this._value
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  }

  equals(other: Email): boolean {
    return this._value === other._value
  }

  getDomain(): string {
    return this._value.split('@')[1]
  }

  getLocalPart(): string {
    return this._value.split('@')[0]
  }

  toString(): string {
    return this._value
  }

  static isValidEmail(email: string): boolean {
    try {
      new Email(email)
      return true
    } catch {
      return false
    }
  }
}