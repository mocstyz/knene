export class Genre {
  private readonly _name: string
  private readonly _slug: string

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

  get name(): string {
    return this._name
  }

  get slug(): string {
    return this._slug
  }

  private createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  equals(other: Genre): boolean {
    return this._name === other._name
  }

  toString(): string {
    return this._name
  }

  // 预定义的电影类型
  static readonly ACTION = new Genre('动作')
  static readonly ADVENTURE = new Genre('冒险')
  static readonly ANIMATION = new Genre('动画')
  static readonly COMEDY = new Genre('喜剧')
  static readonly CRIME = new Genre('犯罪')
  static readonly DOCUMENTARY = new Genre('纪录片')
  static readonly DRAMA = new Genre('剧情')
  static readonly FAMILY = new Genre('家庭')
  static readonly FANTASY = new Genre('奇幻')
  static readonly HISTORY = new Genre('历史')
  static readonly HORROR = new Genre('恐怖')
  static readonly MUSIC = new Genre('音乐')
  static readonly MYSTERY = new Genre('悬疑')
  static readonly ROMANCE = new Genre('爱情')
  static readonly SCIENCE_FICTION = new Genre('科幻')
  static readonly THRILLER = new Genre('惊悚')
  static readonly WAR = new Genre('战争')
  static readonly WESTERN = new Genre('西部')

  // 获取所有预定义类型
  static getAllGenres(): Genre[] {
    return [
      Genre.ACTION,
      Genre.ADVENTURE,
      Genre.ANIMATION,
      Genre.COMEDY,
      Genre.CRIME,
      Genre.DOCUMENTARY,
      Genre.DRAMA,
      Genre.FAMILY,
      Genre.FANTASY,
      Genre.HISTORY,
      Genre.HORROR,
      Genre.MUSIC,
      Genre.MYSTERY,
      Genre.ROMANCE,
      Genre.SCIENCE_FICTION,
      Genre.THRILLER,
      Genre.WAR,
      Genre.WESTERN,
    ]
  }

  // 根据名称查找类型
  static findByName(name: string): Genre | undefined {
    return Genre.getAllGenres().find(genre => 
      genre.name.toLowerCase() === name.toLowerCase()
    )
  }

  // 根据slug查找类型
  static findBySlug(slug: string): Genre | undefined {
    return Genre.getAllGenres().find(genre => 
      genre.slug === slug.toLowerCase()
    )
  }

  // 验证类型名称
  static validate(name: string): boolean {
    try {
      new Genre(name)
      return true
    } catch {
      return false
    }
  }

  // 创建自定义类型
  static fromString(name: string): Genre {
    return new Genre(name)
  }

  // 安全创建类型
  static createSafe(name: string): Genre | null {
    try {
      return new Genre(name)
    } catch {
      return null
    }
  }

  // 类型分组
  static getGenresByCategory(): Record<string, Genre[]> {
    return {
      '动作冒险': [Genre.ACTION, Genre.ADVENTURE, Genre.THRILLER],
      '剧情文艺': [Genre.DRAMA, Genre.ROMANCE, Genre.HISTORY],
      '喜剧家庭': [Genre.COMEDY, Genre.FAMILY, Genre.ANIMATION],
      '科幻奇幻': [Genre.SCIENCE_FICTION, Genre.FANTASY, Genre.HORROR],
      '其他': [Genre.DOCUMENTARY, Genre.MUSIC, Genre.MYSTERY, Genre.CRIME, Genre.WAR, Genre.WESTERN],
    }
  }

  // 获取类型颜色（用于UI显示）
  getColor(): string {
    const colorMap: Record<string, string> = {
      '动作': 'bg-red-100 text-red-800',
      '冒险': 'bg-orange-100 text-orange-800',
      '动画': 'bg-pink-100 text-pink-800',
      '喜剧': 'bg-yellow-100 text-yellow-800',
      '犯罪': 'bg-gray-100 text-gray-800',
      '纪录片': 'bg-green-100 text-green-800',
      '剧情': 'bg-blue-100 text-blue-800',
      '家庭': 'bg-purple-100 text-purple-800',
      '奇幻': 'bg-indigo-100 text-indigo-800',
      '历史': 'bg-amber-100 text-amber-800',
      '恐怖': 'bg-red-100 text-red-800',
      '音乐': 'bg-cyan-100 text-cyan-800',
      '悬疑': 'bg-slate-100 text-slate-800',
      '爱情': 'bg-rose-100 text-rose-800',
      '科幻': 'bg-emerald-100 text-emerald-800',
      '惊悚': 'bg-zinc-100 text-zinc-800',
      '战争': 'bg-stone-100 text-stone-800',
      '西部': 'bg-orange-100 text-orange-800',
    }

    return colorMap[this._name] || 'bg-gray-100 text-gray-800'
  }
}