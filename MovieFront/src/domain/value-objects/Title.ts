/**
 * @fileoverview 标题值对象
 * @description 标题值对象，提供标题的创建、验证、比较和搜索功能，确保标题内容的规范性和一致性
 * @created 2025-10-09 13:10:49
 * @updated 2025-10-19 10:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 标题值对象，提供标题的创建、验证、比较和搜索功能
export class Title {
  private readonly _value: string

  // 构造函数，验证标题格式并初始化标题值对象
  constructor(value: string) {
    const trimmed = value.trim()

    if (!trimmed) {
      throw new Error('标题不能为空')
    }

    if (trimmed.length > 200) {
      throw new Error('标题长度不能超过200个字符')
    }

    if (trimmed.length < 1) {
      throw new Error('标题长度至少为1个字符')
    }

    this._value = trimmed
  }

  // 获取标题值
  get value(): string {
    return this._value
  }

  // 比较两个标题是否相等
  equals(other: Title): boolean {
    return this._value === other._value
  }

  // 检查标题是否包含关键词
  contains(keyword: string): boolean {
    return this._value.toLowerCase().includes(keyword.toLowerCase())
  }

  // 检查标题是否以指定文本开头
  startsWith(prefix: string): boolean {
    return this._value.startsWith(prefix)
  }

  // 检查标题是否以指定文本结尾
  endsWith(suffix: string): boolean {
    return this._value.endsWith(suffix)
  }

  // 获取标题长度
  get length(): number {
    return this._value.length
  }

  // 检查标题是否为空
  isEmpty(): boolean {
    return this._value.length === 0
  }

  // 获取标题的单词数量
  get wordCount(): number {
    return this._value.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  // 截取标题的指定部分
  substring(startIndex: number, endIndex?: number): Title {
    return new Title(this._value.substring(startIndex, endIndex))
  }

  // 转换为大写
  toUpperCase(): Title {
    return new Title(this._value.toUpperCase())
  }

  // 转换为小写
  toLowerCase(): Title {
    return new Title(this._value.toLowerCase())
  }

  // 首字母大写
  toTitleCase(): Title {
    const words = this._value.toLowerCase().split(' ')
    const titleCased = words.map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
    return new Title(titleCased)
  }

  // 移除多余的空格
  normalizeSpaces(): Title {
    const normalized = this._value.replace(/\s+/g, ' ').trim()
    return new Title(normalized)
  }

  // 转换为字符串
  toString(): string {
    return this._value
  }

  // ========== 静态工厂方法 ==========

  // 创建标题对象
  static create(value: string): Title {
    return new Title(value)
  }

  // 从多个部分组合成标题
  static fromParts(...parts: string[]): Title {
    return new Title(parts.join(' '))
  }

  // 创建空标题对象
  static empty(): Title {
    return new Title('')
  }

  // 验证标题是否有效
  static isValid(value: string): boolean {
    try {
      new Title(value)
      return true
    } catch {
      return false
    }
  }

  // 生成随机标题（用于测试）
  static random(length: number = 10): Title {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 '
    let result = ''
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return new Title(result.trim())
  }

  // 找到最长的标题
  static longest(titles: Title[]): Title {
    if (titles.length === 0) return Title.empty()

    return titles.reduce((longest, current) =>
      current.length > longest.length ? current : longest
    )
  }

  // 找到最短的标题
  static shortest(titles: Title[]): Title {
    if (titles.length === 0) return Title.empty()

    return titles.reduce((shortest, current) =>
      current.length < shortest.length ? current : shortest
    )
  }
}