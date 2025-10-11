export class ReleaseDate {
  private readonly _date: Date

  constructor(date: Date | string) {
    let parsedDate: Date

    if (typeof date === 'string') {
      parsedDate = new Date(date)
    } else {
      parsedDate = new Date(date.getTime())
    }

    if (isNaN(parsedDate.getTime())) {
      throw new Error('无效的发布日期')
    }

    // 验证日期范围（电影发明后到未来5年）
    const minDate = new Date('1895-01-01') // 电影发明年份
    const maxDate = new Date()
    maxDate.setFullYear(maxDate.getFullYear() + 5)

    if (parsedDate < minDate || parsedDate > maxDate) {
      throw new Error('发布日期必须在1895年到未来5年之间')
    }

    this._date = parsedDate
  }

  get date(): Date {
    return new Date(this._date.getTime())
  }

  get year(): number {
    return this._date.getFullYear()
  }

  get month(): number {
    return this._date.getMonth() + 1 // 返回1-12
  }

  get day(): number {
    return this._date.getDate()
  }

  equals(other: ReleaseDate): boolean {
    return this._date.getTime() === other._date.getTime()
  }

  isBefore(other: ReleaseDate): boolean {
    return this._date < other._date
  }

  isAfter(other: ReleaseDate): boolean {
    return this._date > other._date
  }

  isSameYear(other: ReleaseDate): boolean {
    return this.year === other.year
  }

  isSameMonth(other: ReleaseDate): boolean {
    return this.year === other.year && this.month === other.month
  }

  isSameDay(other: ReleaseDate): boolean {
    return this._date.toDateString() === other._date.toDateString()
  }

  isInFuture(): boolean {
    return this._date > new Date()
  }

  isInPast(): boolean {
    return this._date < new Date()
  }

  isToday(): boolean {
    const today = new Date()
    return this.isSameDay(new ReleaseDate(today))
  }

  getAge(): number {
    const now = new Date()
    return now.getFullYear() - this.year
  }

  getDecade(): string {
    const decade = Math.floor(this.year / 10) * 10
    return `${decade}年代`
  }

  getEra(): string {
    if (this.year < 1930) return '早期电影'
    if (this.year < 1960) return '黄金时代'
    if (this.year < 1980) return '新好莱坞'
    if (this.year < 2000) return '现代电影'
    return '当代电影'
  }

  getDaysUntilRelease(): number {
    if (!this.isInFuture()) return 0

    const now = new Date()
    const diffTime = this._date.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  getDaysSinceRelease(): number {
    if (this.isInFuture()) return 0

    const now = new Date()
    const diffTime = now.getTime() - this._date.getTime()
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }

  // 格式化方法
  toISOString(): string {
    return this._date.toISOString().split('T')[0]
  }

  toLocaleDateString(locale: string = 'zh-CN'): string {
    return this._date.toLocaleDateString(locale)
  }

  toYearString(): string {
    return this.year.toString()
  }

  toYearMonthString(): string {
    return `${this.year}年${this.month}月`
  }

  toFullString(): string {
    return `${this.year}年${this.month}月${this.day}日`
  }

  toShortString(): string {
    return `${this.year}-${this.month.toString().padStart(2, '0')}-${this.day.toString().padStart(2, '0')}`
  }

  toString(): string {
    return this.toFullString()
  }

  // 静态工厂方法
  static fromDate(date: Date): ReleaseDate {
    return new ReleaseDate(date)
  }

  static fromString(dateString: string): ReleaseDate {
    return new ReleaseDate(dateString)
  }

  static fromYear(year: number): ReleaseDate {
    return new ReleaseDate(new Date(year, 0, 1))
  }

  static fromYearMonth(year: number, month: number): ReleaseDate {
    return new ReleaseDate(new Date(year, month - 1, 1))
  }

  static fromYearMonthDay(
    year: number,
    month: number,
    day: number
  ): ReleaseDate {
    return new ReleaseDate(new Date(year, month - 1, day))
  }

  static today(): ReleaseDate {
    return new ReleaseDate(new Date())
  }

  static parse(dateString: string): ReleaseDate {
    // 支持多种格式
    const formats = [
      /^(\d{4})$/, // 2023
      /^(\d{4})-(\d{1,2})$/, // 2023-12
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // 2023-12-25
      /^(\d{4})年$/, // 2023年
      /^(\d{4})年(\d{1,2})月$/, // 2023年12月
      /^(\d{4})年(\d{1,2})月(\d{1,2})日$/, // 2023年12月25日
    ]

    for (const format of formats) {
      const match = dateString.trim().match(format)
      if (match) {
        const year = parseInt(match[1])
        const month = match[2] ? parseInt(match[2]) : 1
        const day = match[3] ? parseInt(match[3]) : 1

        return ReleaseDate.fromYearMonthDay(year, month, day)
      }
    }

    // 尝试直接解析
    return new ReleaseDate(dateString)
  }

  static validate(dateString: string): boolean {
    try {
      ReleaseDate.parse(dateString)
      return true
    } catch {
      return false
    }
  }

  // 比较方法
  static compare(a: ReleaseDate, b: ReleaseDate): number {
    return a._date.getTime() - b._date.getTime()
  }

  static earliest(...dates: ReleaseDate[]): ReleaseDate {
    if (dates.length === 0) {
      throw new Error('至少需要一个日期')
    }

    return dates.reduce((earliest, current) =>
      current.isBefore(earliest) ? current : earliest
    )
  }

  static latest(...dates: ReleaseDate[]): ReleaseDate {
    if (dates.length === 0) {
      throw new Error('至少需要一个日期')
    }

    return dates.reduce((latest, current) =>
      current.isAfter(latest) ? current : latest
    )
  }
}
