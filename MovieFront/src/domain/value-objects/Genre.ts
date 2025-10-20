/**
 * @fileoverview 电影类型值对象
 * @description 电影类型值对象，提供电影类型的创建、验证、比较和展示功能，确保类型名称的规范性和唯一性，支持多种格式的类型显示和搜索
 * @created 2025-10-09 13:10:49
 * @updated 2025-10-19 10:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 电影类型值对象，提供电影类型的创建、验证、比较和展示功能
export class Genre {
  private readonly _name: string
  private readonly _slug: string

  // 构造函数，验证类型名称并生成标准化slug
  constructor(name: string) {
    const trimmed = name.trim()

    if (!trimmed) {
      throw new Error('电影类型名称不能为空')
    }

    if (trimmed.length > 50) {
      throw new Error('电影类型名称长度不能超过50个字符')
    }

    this._name = trimmed
    this._slug = this.createSlug(trimmed)
  }

  // 获取类型名称
  get name(): string {
    return this._name
  }

  // 获取类型slug（用于URL）
  get slug(): string {
    return this._slug
  }

  // 创建URL友好的slug
  private createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 移除特殊字符
      .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
      .replace(/^-+|-+$/g, '') // 移除首尾连字符
  }

  // 比较两个类型是否相等
  equals(other: Genre): boolean {
    return this._name === other._name
  }

  // 检查类型名称是否包含关键词
  contains(keyword: string): boolean {
    return this._name.toLowerCase().includes(keyword.toLowerCase())
  }

  // 获取类型名称长度
  get length(): number {
    return this._name.length
  }

  // 转换为字符串
  toString(): string {
    return this._name
  }

  // 转换为JSON格式
  toJSON(): { name: string; slug: string } {
    return {
      name: this._name,
      slug: this._slug
    }
  }

  // ========== 静态工厂方法 ==========

  // 创建类型对象
  static create(name: string): Genre {
    return new Genre(name)
  }

  // 从slug创建类型对象
  static fromSlug(slug: string): Genre {
    const name = slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
    return new Genre(name)
  }

  // 从JSON创建类型对象
  static fromJSON(json: { name: string; slug?: string }): Genre {
    if (json.slug) {
      return Genre.fromSlug(json.slug)
    }
    return new Genre(json.name)
  }

  // 验证类型名称是否有效
  static isValid(name: string): boolean {
    try {
      new Genre(name)
      return true
    } catch {
      return false
    }
  }

  // 创建预设的常见电影类型
  static commonGenres(): Genre[] {
    const genres = [
      '动作', '喜剧', '剧情', '爱情', '科幻', '恐怖', '悬疑', '动画',
      '纪录片', '战争', '犯罪', '冒险', '家庭', '奇幻', '音乐', '传记',
      '历史', '西部', '运动', '惊悚'
    ]
    return genres.map(genre => new Genre(genre))
  }

  // 搜索类型
  static search(genres: Genre[], keyword: string): Genre[] {
    const lowerKeyword = keyword.toLowerCase()
    return genres.filter(genre =>
      genre._name.toLowerCase().includes(lowerKeyword) ||
      genre._slug.includes(lowerKeyword)
    )
  }

  // 按名称排序
  static sortByName(genres: Genre[]): Genre[] {
    return [...genres].sort((a, b) => a._name.localeCompare(b._name))
  }

  // 获取所有类型的名称列表
  static getNames(genres: Genre[]): string[] {
    return genres.map(genre => genre._name)
  }

  // 查找重复的类型
  static findDuplicates(genres: Genre[]): Genre[] {
    const seen = new Set<string>()
    const duplicates: Genre[] = []

    for (const genre of genres) {
      const key = genre._name.toLowerCase()
      if (seen.has(key)) {
        duplicates.push(genre)
      } else {
        seen.add(key)
      }
    }

    return duplicates
  }

  // 合并重复的类型
  static mergeDuplicates(genres: Genre[]): Genre[] {
    const unique = new Map<string, Genre>()

    for (const genre of genres) {
      const key = genre._name.toLowerCase()
      if (!unique.has(key)) {
        unique.set(key, genre)
      }
    }

    return Array.from(unique.values())
  }
}