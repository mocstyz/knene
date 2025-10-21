/**
 * @fileoverview 时长值对象
 * @description 时长值对象，提供时长的创建、计算、格式化等功能，支持分钟和小时单位的转换，以及人类可读的时间格式显示
 * @created 2025-10-09 13:10:49
 * @updated 2025-10-19 10:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 时长值对象，提供时长的创建、计算、格式化等功能
export class Duration {
  private readonly _minutes: number

  // 构造函数，初始化时长值对象，限制在0-24小时范围内
  constructor(minutes: number) {
    if (minutes < 0) {
      throw new Error('时长不能为负数')
    }

    if (minutes > 1440) {
      // 24小时
      throw new Error('时长不能超过24小时')
    }

    this._minutes = Math.floor(minutes)
  }

  // 获取分钟数
  get minutes(): number {
    return this._minutes
  }

  // 获取小时数
  get hours(): number {
    return Math.floor(this._minutes / 60)
  }

  // 获取剩余分钟数
  get remainingMinutes(): number {
    return this._minutes % 60
  }

  // 获取总秒数
  get totalSeconds(): number {
    return this._minutes * 60
  }

  // 比较两个时长是否相等
  equals(other: Duration): boolean {
    return this._minutes === other._minutes
  }

  // 判断当前时长是否大于另一个时长
  isGreaterThan(other: Duration): boolean {
    return this._minutes > other._minutes
  }

  // 判断当前时长是否小于另一个时长
  isLessThan(other: Duration): boolean {
    return this._minutes < other._minutes
  }

  // 时长相加，返回新的时长对象
  add(other: Duration): Duration {
    return new Duration(this._minutes + other._minutes)
  }

  // 时长相减，返回新的时长对象，最小为0
  subtract(other: Duration): Duration {
    return new Duration(Math.max(0, this._minutes - other._minutes))
  }

  // 乘以倍数，返回新的时长对象
  multiply(factor: number): Duration {
    if (factor < 0) {
      throw new Error('乘数不能为负数')
    }
    return new Duration(this._minutes * factor)
  }

  // 除以除数，返回新的时长对象
  divide(divisor: number): Duration {
    if (divisor <= 0) {
      throw new Error('除数必须大于0')
    }
    return new Duration(this._minutes / divisor)
  }

  // 格式化为标准时间格式 HH:MM
  toFormattedString(): string {
    const hours = this.hours.toString().padStart(2, '0')
    const minutes = this.remainingMinutes.toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  // 格式化为人类可读格式
  toHumanReadable(): string {
    if (this._minutes === 0) return '0分钟'

    const hours = this.hours
    const minutes = this.remainingMinutes

    if (hours === 0) return `${minutes}分钟`
    if (minutes === 0) return `${hours}小时`
    return `${hours}小时${minutes}分钟`
  }

  // 转换为字符串
  toString(): string {
    return this.toFormattedString()
  }

  // ========== 静态工厂方法 ==========

  // 从分钟创建时长对象
  static fromMinutes(minutes: number): Duration {
    return new Duration(minutes)
  }

  // 从小时创建时长对象
  static fromHours(hours: number): Duration {
    return new Duration(hours * 60)
  }

  // 从小时和分钟创建时长对象
  static fromHoursAndMinutes(hours: number, minutes: number): Duration {
    return new Duration(hours * 60 + minutes)
  }

  // 从字符串创建时长对象，支持 HH:MM 格式
  static fromString(timeString: string): Duration {
    const regex = /^(\d{1,2}):(\d{1,2})$/
    const match = timeString.trim().match(regex)

    if (!match) {
      throw new Error('无效的时间格式，请使用 HH:MM 格式')
    }

    const hours = parseInt(match[1], 10)
    const minutes = parseInt(match[2], 10)

    if (hours > 23) {
      throw new Error('小时数不能超过23')
    }

    if (minutes > 59) {
      throw new Error('分钟数不能超过59')
    }

    return Duration.fromHoursAndMinutes(hours, minutes)
  }

  // 从秒数创建时长对象
  static fromSeconds(seconds: number): Duration {
    return new Duration(seconds / 60)
  }

  // 创建零时长对象
  static zero(): Duration {
    return new Duration(0)
  }

  // 计算平均时长
  static average(durations: Duration[]): Duration {
    if (durations.length === 0) return Duration.zero()

    const totalMinutes = durations.reduce((sum, duration) => sum + duration._minutes, 0)
    return new Duration(totalMinutes / durations.length)
  }

  // 找到最大时长
  static max(durations: Duration[]): Duration {
    if (durations.length === 0) return Duration.zero()

    return durations.reduce((max, current) =>
      current._minutes > max._minutes ? current : max
    )
  }

  // 找到最小时长
  static min(durations: Duration[]): Duration {
    if (durations.length === 0) return Duration.zero()

    return durations.reduce((min, current) =>
      current._minutes < min._minutes ? current : min
    )
  }
}
