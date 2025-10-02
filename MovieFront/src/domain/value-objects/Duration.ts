export class Duration {
  private readonly _minutes: number

  constructor(minutes: number) {
    if (minutes < 0) {
      throw new Error('时长不能为负数')
    }

    if (minutes > 1440) { // 24小时
      throw new Error('时长不能超过24小时')
    }

    this._minutes = Math.floor(minutes)
  }

  get minutes(): number {
    return this._minutes
  }

  get hours(): number {
    return Math.floor(this._minutes / 60)
  }

  get remainingMinutes(): number {
    return this._minutes % 60
  }

  get totalSeconds(): number {
    return this._minutes * 60
  }

  equals(other: Duration): boolean {
    return this._minutes === other._minutes
  }

  isGreaterThan(other: Duration): boolean {
    return this._minutes > other._minutes
  }

  isLessThan(other: Duration): boolean {
    return this._minutes < other._minutes
  }

  add(other: Duration): Duration {
    return new Duration(this._minutes + other._minutes)
  }

  subtract(other: Duration): Duration {
    return new Duration(Math.max(0, this._minutes - other._minutes))
  }

  multiply(factor: number): Duration {
    if (factor < 0) {
      throw new Error('乘数不能为负数')
    }
    return new Duration(this._minutes * factor)
  }

  getCategory(): 'short' | 'medium' | 'long' | 'very-long' {
    if (this._minutes < 90) return 'short'
    if (this._minutes < 120) return 'medium'
    if (this._minutes < 180) return 'long'
    return 'very-long'
  }

  getCategoryText(): string {
    switch (this.getCategory()) {
      case 'short':
        return '短片'
      case 'medium':
        return '标准长度'
      case 'long':
        return '长片'
      case 'very-long':
        return '超长片'
      default:
        return '未知'
    }
  }

  toHumanReadable(): string {
    const hours = this.hours
    const minutes = this.remainingMinutes

    if (hours === 0) {
      return `${minutes}分钟`
    } else if (minutes === 0) {
      return `${hours}小时`
    } else {
      return `${hours}小时${minutes}分钟`
    }
  }

  toShortFormat(): string {
    const hours = this.hours
    const minutes = this.remainingMinutes

    if (hours === 0) {
      return `${minutes}m`
    } else if (minutes === 0) {
      return `${hours}h`
    } else {
      return `${hours}h${minutes}m`
    }
  }

  toTimeFormat(): string {
    const hours = this.hours
    const minutes = this.remainingMinutes
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  toString(): string {
    return this.toHumanReadable()
  }

  // 静态工厂方法
  static fromMinutes(minutes: number): Duration {
    return new Duration(minutes)
  }

  static fromHours(hours: number): Duration {
    return new Duration(hours * 60)
  }

  static fromHoursAndMinutes(hours: number, minutes: number): Duration {
    return new Duration(hours * 60 + minutes)
  }

  static fromSeconds(seconds: number): Duration {
    return new Duration(Math.floor(seconds / 60))
  }

  static zero(): Duration {
    return new Duration(0)
  }

  // 解析时长字符串
  static parse(durationString: string): Duration {
    const trimmed = durationString.trim()

    // 格式: "2h 30m" 或 "2小时30分钟"
    const hoursMinutesRegex = /(\d+)(?:h|小时)\s*(\d+)(?:m|分钟)?/i
    let match = trimmed.match(hoursMinutesRegex)
    if (match) {
      const hours = parseInt(match[1])
      const minutes = parseInt(match[2])
      return Duration.fromHoursAndMinutes(hours, minutes)
    }

    // 格式: "2h" 或 "2小时"
    const hoursOnlyRegex = /(\d+)(?:h|小时)/i
    match = trimmed.match(hoursOnlyRegex)
    if (match) {
      const hours = parseInt(match[1])
      return Duration.fromHours(hours)
    }

    // 格式: "90m" 或 "90分钟"
    const minutesOnlyRegex = /(\d+)(?:m|分钟)/i
    match = trimmed.match(minutesOnlyRegex)
    if (match) {
      const minutes = parseInt(match[1])
      return Duration.fromMinutes(minutes)
    }

    // 格式: "02:30" (HH:MM)
    const timeFormatRegex = /(\d{1,2}):(\d{2})/
    match = trimmed.match(timeFormatRegex)
    if (match) {
      const hours = parseInt(match[1])
      const minutes = parseInt(match[2])
      return Duration.fromHoursAndMinutes(hours, minutes)
    }

    // 纯数字，假设为分钟
    const numberRegex = /^\d+$/
    if (numberRegex.test(trimmed)) {
      const minutes = parseInt(trimmed)
      return Duration.fromMinutes(minutes)
    }

    throw new Error('无效的时长格式')
  }

  static validate(durationString: string): boolean {
    try {
      Duration.parse(durationString)
      return true
    } catch {
      return false
    }
  }

  // 常用时长
  static readonly SHORT_FILM = Duration.fromMinutes(30)
  static readonly STANDARD_FILM = Duration.fromMinutes(90)
  static readonly LONG_FILM = Duration.fromMinutes(120)
  static readonly EPIC_FILM = Duration.fromMinutes(180)
}