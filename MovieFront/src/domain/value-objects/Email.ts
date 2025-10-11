/**
 * @fileoverview 邮箱值对象
 * @description 用户管理领域的邮箱值对象，提供邮箱地址的验证、比较和信息提取功能。
 * 确保邮箱地址的格式正确性和一致性，作为用户实体的核心组成部分。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.2.0
 */

/**
 * 邮箱值对象类
 *
 * 值对象：表示用户邮箱地址，包含验证逻辑和邮箱操作方法
 */
export class Email {
  private readonly _value: string

  /**
   * 创建邮箱值对象实例
   * @param value 邮箱地址字符串
   * @throws {Error} 如果邮箱格式无效则抛出错误
   */
  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error('无效的邮箱地址格式')
    }
    this._value = value.toLowerCase().trim()
  }

  /**
   * 获取邮箱地址值
   * @returns {string} 返回标准化后的邮箱地址
   */
  get value(): string {
    return this._value
  }

  /**
   * 验证邮箱格式是否有效
   * @param email 要验证的邮箱地址
   * @returns {boolean} 如果邮箱格式有效则返回true
   */
  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  }

  /**
   * 比较两个邮箱是否相等
   * @param other 要比较的另一个邮箱值对象
   * @returns {boolean} 如果邮箱地址相同则返回true
   */
  equals(other: Email): boolean {
    return this._value === other._value
  }

  /**
   * 获取邮箱域名部分
   * @returns {string} 返回邮箱的域名部分
   */
  getDomain(): string {
    return this._value.split('@')[1]
  }

  /**
   * 获取邮箱本地部分（@符号前的部分）
   * @returns {string} 返回邮箱的本地部分
   */
  getLocalPart(): string {
    return this._value.split('@')[0]
  }

  /**
   * 转换为字符串表示
   * @returns {string} 返回邮箱地址字符串
   */
  toString(): string {
    return this._value
  }

  /**
   * 静态方法：验证邮箱地址是否有效
   * @param email 要验证的邮箱地址
   * @returns {boolean} 如果邮箱有效则返回true，否则返回false
   */
  static isValidEmail(email: string): boolean {
    try {
      new Email(email)
      return true
    } catch {
      return false
    }
  }
}
