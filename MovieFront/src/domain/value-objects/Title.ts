export class Title {
  private readonly _value: string

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

  get value(): string {
    return this._value
  }

  equals(other: Title): boolean {
    return this._value === other._value
  }

  contains(keyword: string): boolean {
    return this._value.toLowerCase().includes(keyword.toLowerCase())
  }

  startsWith(prefix: string): boolean {
    return this._value.toLowerCase().startsWith(prefix.toLowerCase())
  }

  endsWith(suffix: string): boolean {
    return this._value.toLowerCase().endsWith(suffix.toLowerCase())
  }

  getLength(): number {
    return this._value.length
  }

  getWordCount(): number {
    return this._value.split(/\s+/).filter(word => word.length > 0).length
  }

  truncate(maxLength: number, suffix: string = '...'): string {
    if (this._value.length <= maxLength) {
      return this._value
    }

    const truncated = this._value.substring(0, maxLength - suffix.length)
    return truncated + suffix
  }

  toSlug(): string {
    return this._value
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 移除特殊字符
      .replace(/\s+/g, '-') // 空格替换为连字符
      .replace(/-+/g, '-') // 多个连字符合并为一个
      .trim()
  }

  highlight(keyword: string): string {
    if (!keyword.trim()) return this._value

    const regex = new RegExp(`(${keyword})`, 'gi')
    return this._value.replace(regex, '<mark>$1</mark>')
  }

  toString(): string {
    return this._value
  }

  // 静态工厂方法
  static fromString(value: string): Title {
    return new Title(value)
  }

  static createSafe(value: string): Title | null {
    try {
      return new Title(value)
    } catch {
      return null
    }
  }

  static validate(value: string): boolean {
    try {
      new Title(value)
      return true
    } catch {
      return false
    }
  }

  // 标题格式化工具
  static formatMovieTitle(title: string, year?: number): Title {
    let formatted = title.trim()

    // 移除多余的空格
    formatted = formatted.replace(/\s+/g, ' ')

    // 如果有年份，添加到标题后
    if (year && year > 1800 && year <= new Date().getFullYear() + 5) {
      if (!formatted.includes(year.toString())) {
        formatted = `${formatted} (${year})`
      }
    }

    return new Title(formatted)
  }

  static extractYear(title: string): number | null {
    const yearMatch = title.match(/\((\d{4})\)/)
    if (yearMatch) {
      const year = parseInt(yearMatch[1])
      if (year > 1800 && year <= new Date().getFullYear() + 5) {
        return year
      }
    }
    return null
  }

  static removeYear(title: string): string {
    return title.replace(/\s*\(\d{4}\)\s*$/, '').trim()
  }
}