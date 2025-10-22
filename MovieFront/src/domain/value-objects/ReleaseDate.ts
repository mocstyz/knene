/**
 * @fileoverview 发布日期值对象
 * @description 发布日期值对象，封装电影或内容的发布日期信息，提供日期的创建、验证、比较和格式化功能
 * @created 2025-10-09 13:10:49
 * @updated 2025-10-19 10:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 发布日期值对象，封装电影或内容的发布日期信息
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

  // 获取日期对象副本
  get date(): Date {
    return new Date(this._date.getTime())
  }

  // 获取年份
  get year(): number {
    return this._date.getFullYear()
  }

  // 获取月份（1-12）
  get month(): number {
    return this._date.getMonth() + 1
  }

  // 获取日期
  get day(): number {
    return this._date.getDate()
  }

  // 比较两个日期是否相等
  equals(other: ReleaseDate): boolean {
    return this._date.getTime() === other._date.getTime()
  }

  // 检查是否早于另一个日期
  isBefore(other: ReleaseDate): boolean {
    return this._date < other._date
  }

  // 检查是否晚于另一个日期
  isAfter(other: ReleaseDate): boolean {
    return this._date > other._date
  }

  // 检查是否为同一年
  isSameYear(other: ReleaseDate): boolean {
    return this.year === other.year
  }

  // 检查是否为同一个月
  isSameMonth(other: ReleaseDate): boolean {
    return this.year === other.year && this.month === other.month
  }

  // 检查是否为同一天
  isSameDay(other: ReleaseDate): boolean {
    return this.isSameMonth(other) && this.day === other.day
  }

  // 获取星期几
  getDayOfWeek(): number {
    return this._date.getDay() // 0-6，0为周日
  }

  // 获取星期几文本
  getDayOfWeekText(): string {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[this.getDayOfWeek()]
  }

  // 获取季度
  getQuarter(): number {
    return Math.ceil(this.month / 3)
  }

  // 获取季度文本
  getQuarterText(): string {
    return `第${this.getQuarter()}季度`
  }

  // 检查是否为未来日期
  isFuture(): boolean {
    return this._date > new Date()
  }

  // 检查是否为过去日期
  isPast(): boolean {
    return this._date < new Date()
  }

  // 检查是否为今天
  isToday(): boolean {
    const today = new Date()
    return this.isSameYear(new ReleaseDate(today)) &&
           this.month === today.getMonth() + 1 &&
           this.day === today.getDate()
  }

  // 检查是否为昨天
  isYesterday(): boolean {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return this.isSameDay(new ReleaseDate(yesterday))
  }

  // 检查是否为明天
  isTomorrow(): boolean {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return this.isSameDay(new ReleaseDate(tomorrow))
  }

  // 检查是否为本周
  isThisWeek(): boolean {
    const today = new Date()
    const todayWeek = ReleaseDate.getWeekNumber(today)
    const dateWeek = ReleaseDate.getWeekNumber(this._date)
    return todayWeek === dateWeek && this.year === today.getFullYear()
  }

  // 检查是否为本月
  isThisMonth(): boolean {
    const today = new Date()
    return this.year === today.getFullYear() && this.month === today.getMonth() + 1
  }

  // 检查是否为本年
  isThisYear(): boolean {
    return this.year === new Date().getFullYear()
  }

  // 获取年份年代
  getDecade(): number {
    return Math.floor(this.year / 10) * 10
  }

  // 获取年代文本
  getDecadeText(): string {
    return `${this.getDecade()}年代`
  }

  // 获取世纪
  getCentury(): number {
    return Math.floor((this.year - 1) / 100) + 1
  }

  // 获取世纪文本
  getCenturyText(): string {
    return `第${this.getCentury()}世纪`
  }

  // 检查是否为新发布（30天内）
  isNewRelease(): boolean {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return this._date >= thirtyDaysAgo
  }

  // 检查是否为最新发布（7天内）
  isLatestRelease(): boolean {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return this._date >= sevenDaysAgo
  }

  // 检查是否为经典（10年前）
  isClassic(): boolean {
    const tenYearsAgo = new Date()
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10)
    return this._date <= tenYearsAgo
  }

  // 获取年龄（年数）
  getAge(): number {
    const today = new Date()
    let age = today.getFullYear() - this.year
    const monthDiff = today.getMonth() + 1 - this.month
    const dayDiff = today.getDate() - this.day

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--
    }

    return age
  }

  // 获取年龄文本
  getAgeText(): string {
    const age = this.getAge()
    if (age === 0) return '今年'
    if (age === 1) return '1年前'
    return `${age}年前`
  }

  // 获取距离现在的天数
  getDaysFromNow(): number {
    const today = new Date()
    const diffTime = this._date.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // 格式化为短日期格式 (YYYY-MM-DD)
  toShortFormat(): string {
    const year = this.year
    const month = this.month.toString().padStart(2, '0')
    const day = this.day.toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 格式化为中文日期格式
  toChineseFormat(): string {
    return `${this.year}年${this.month}月${this.day}日`
  }

  // 格式化为长日期格式
  toLongFormat(): string {
    const year = this.year
    const month = this.month
    const day = this.day
    const weekday = this.getDayOfWeekText()
    return `${year}年${month}月${day}日 ${weekday}`
  }

  // 格式化为ISO字符串
  toISOString(): string {
    return this._date.toISOString()
  }

  // 获取相对时间文本
  getRelativeTimeText(): string {
    if (this.isToday()) return '今天'
    if (this.isYesterday()) return '昨天'
    if (this.isTomorrow()) return '明天'

    const daysFromNow = this.getDaysFromNow()
    if (daysFromNow > 0 && daysFromNow <= 7) {
      return `${daysFromNow}天后`
    }
    if (daysFromNow < 0 && Math.abs(daysFromNow) <= 7) {
      return `${Math.abs(daysFromNow)}天前`
    }

    if (this.isThisMonth()) {
      if (this.isFuture()) return '本月'
      return '上个月'
    }

    if (this.isThisYear()) {
      if (this.isFuture()) return '今年'
      return '去年'
    }

    return `${this.year}年`
  }

  // 转换为JSON格式
  toJSON(): string {
    return this._date.toISOString()
  }

  // 转换为字符串
  toString(): string {
    return this.toChineseFormat()
  }

  // ========== 静态工厂方法 ==========

  // 从字符串创建发布日期
  static fromString(dateString: string): ReleaseDate {
    return new ReleaseDate(dateString)
  }

  // 从日期对象创建发布日期
  static fromDate(date: Date): ReleaseDate {
    return new ReleaseDate(date)
  }

  // 从年月日创建发布日期
  static fromYMD(year: number, month: number, day: number): ReleaseDate {
    const date = new Date(year, month - 1, day)
    return new ReleaseDate(date)
  }

  // 获取当前日期
  static today(): ReleaseDate {
    return new ReleaseDate(new Date())
  }

  // 获取昨天日期
  static yesterday(): ReleaseDate {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return new ReleaseDate(yesterday)
  }

  // 获取明天日期
  static tomorrow(): ReleaseDate {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return new ReleaseDate(tomorrow)
  }

  // 获取N天后的日期
  static daysFromNow(days: number): ReleaseDate {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return new ReleaseDate(date)
  }

  // 获取N天前的日期
  static daysAgo(days: number): ReleaseDate {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return new ReleaseDate(date)
  }

  // 获取N个月后的日期
  static monthsFromNow(months: number): ReleaseDate {
    const date = new Date()
    date.setMonth(date.getMonth() + months)
    return new ReleaseDate(date)
  }

  // 获取N个月前的日期
  static monthsAgo(months: number): ReleaseDate {
    const date = new Date()
    date.setMonth(date.getMonth() - months)
    return new ReleaseDate(date)
  }

  // 获取N年后的日期
  static yearsFromNow(years: number): ReleaseDate {
    const date = new Date()
    date.setFullYear(date.getFullYear() + years)
    return new ReleaseDate(date)
  }

  // 获取N年前的日期
  static yearsAgo(years: number): ReleaseDate {
    const date = new Date()
    date.setFullYear(date.getFullYear() - years)
    return new ReleaseDate(date)
  }

  // 从JSON创建发布日期
  static fromJSON(json: string): ReleaseDate {
    return new ReleaseDate(new Date(json))
  }

  // 验证日期字符串
  static isValid(dateString: string): boolean {
    try {
      new ReleaseDate(dateString)
      return true
    } catch {
      return false
    }
  }

  // 计算两个日期之间的天数差
  static daysBetween(from: ReleaseDate, to: ReleaseDate): number {
    const diffTime = to._date.getTime() - from._date.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // 查找最早的日期
  static earliest(dates: ReleaseDate[]): ReleaseDate {
    if (dates.length === 0) {
      throw new Error('至少需要一个日期')
    }
    return dates.reduce((earliest, current) =>
      current.isBefore(earliest) ? current : earliest
    )
  }

  // 查找最晚的日期
  static latest(dates: ReleaseDate[]): ReleaseDate {
    if (dates.length === 0) {
      throw new Error('至少需要一个日期')
    }
    return dates.reduce((latest, current) =>
      current.isAfter(latest) ? current : latest
    )
  }

  // 按日期排序
  static sortByDate(dates: ReleaseDate[]): ReleaseDate[] {
    return [...dates].sort((a, b) => a._date.getTime() - b._date.getTime())
  }

  // 按日期倒序排序
  static sortByDateDesc(dates: ReleaseDate[]): ReleaseDate[] {
    return [...dates].sort((a, b) => b._date.getTime() - a._date.getTime())
  }

  // 过滤未来日期
  static filterFuture(dates: ReleaseDate[]): ReleaseDate[] {
    return dates.filter(date => date.isFuture())
  }

  // 过滤过去日期
  static filterPast(dates: ReleaseDate[]): ReleaseDate[] {
    return dates.filter(date => date.isPast())
  }

  // 过滤最新发布日期（30天内）
  static filterLatestReleases(dates: ReleaseDate[]): ReleaseDate[] {
    return dates.filter(date => date.isNewRelease())
  }

  // 过滤经典日期
  static filterClassics(dates: ReleaseDate[]): ReleaseDate[] {
    return dates.filter(date => date.isClassic())
  }

  // 获取指定年份的日期
  static filterByYear(dates: ReleaseDate[], year: number): ReleaseDate[] {
    return dates.filter(date => date.year === year)
  }

  // 获取指定月份的日期
  static filterByMonth(dates: ReleaseDate[], year: number, month: number): ReleaseDate[] {
    return dates.filter(date => date.year === year && date.month === month)
  }

  // 获取周数
  private static getWeekNumber(date: Date): number {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7)
    const week1 = new Date(d.getFullYear(), 0, 4)
    return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
  }

  // 获取周数（实例方法）
  getWeekNumber(): number {
    return ReleaseDate.getWeekNumber(this._date)
  }
}
