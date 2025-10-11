/**
 * 评分值对象
 * 封装评分相关的属性和验证逻辑
 */
export class Rating {
  public readonly value: number // 1-10的评分
  public readonly count: number // 评分人数
  public readonly distribution: RatingDistribution // 评分分布

  constructor(
    value: number,
    count: number = 1,
    distribution?: RatingDistribution
  ) {
    this.validateValue(value)
    this.validateCount(count)

    this.value = Math.round(value * 10) / 10 // 保留一位小数
    this.count = count
    this.distribution =
      distribution || RatingDistribution.fromSingleRating(value)
  }

  // 验证方法
  private validateValue(value: number): void {
    if (typeof value !== 'number') {
      throw new Error('评分必须是数字')
    }

    if (value < 1 || value > 10) {
      throw new Error('评分必须在1-10之间')
    }
  }

  private validateCount(count: number): void {
    if (typeof count !== 'number') {
      throw new Error('评分人数必须是数字')
    }

    if (count < 0) {
      throw new Error('评分人数不能为负数')
    }

    if (!Number.isInteger(count)) {
      throw new Error('评分人数必须是整数')
    }
  }

  // 业务方法
  isExcellent(): boolean {
    return this.value >= 9.0
  }

  isVeryGood(): boolean {
    return this.value >= 8.0 && this.value < 9.0
  }

  isGood(): boolean {
    return this.value >= 7.0 && this.value < 8.0
  }

  isAverage(): boolean {
    return this.value >= 5.0 && this.value < 7.0
  }

  isPoor(): boolean {
    return this.value < 5.0
  }

  getRatingLevel(): 'excellent' | 'very-good' | 'good' | 'average' | 'poor' {
    if (this.isExcellent()) return 'excellent'
    if (this.isVeryGood()) return 'very-good'
    if (this.isGood()) return 'good'
    if (this.isAverage()) return 'average'
    return 'poor'
  }

  getRatingText(): string {
    const texts = {
      excellent: '优秀',
      'very-good': '很好',
      good: '良好',
      average: '一般',
      poor: '较差',
    }
    return texts[this.getRatingLevel()]
  }

  getRatingColor(): string {
    const colors = {
      excellent: '#10B981', // green
      'very-good': '#3B82F6', // blue
      good: '#F59E0B', // yellow
      average: '#F97316', // orange
      poor: '#EF4444', // red
    }
    return colors[this.getRatingLevel()]
  }

  getStarRating(): number {
    return Math.round(this.value / 2) // 转换为5星制
  }

  getStarRatingWithHalf(): { full: number; half: boolean; empty: number } {
    const ratingOutOf5 = this.value / 2
    const full = Math.floor(ratingOutOf5)
    const half = ratingOutOf5 - full >= 0.5
    const empty = 5 - full - (half ? 1 : 0)

    return { full, half, empty }
  }

  getConfidence(): 'high' | 'medium' | 'low' {
    if (this.count >= 1000) return 'high'
    if (this.count >= 100) return 'medium'
    return 'low'
  }

  getConfidenceText(): string {
    const texts = {
      high: '可信度高',
      medium: '可信度中等',
      low: '可信度低',
    }
    return texts[this.getConfidence()]
  }

  // 添加新评分
  addRating(newRating: number): Rating {
    this.validateValue(newRating)

    const totalScore = this.value * this.count + newRating
    const newCount = this.count + 1
    const newValue = totalScore / newCount

    const newDistribution = this.distribution.addRating(newRating)

    return new Rating(newValue, newCount, newDistribution)
  }

  // 移除评分
  removeRating(oldRating: number): Rating {
    this.validateValue(oldRating)

    if (this.count <= 1) {
      throw new Error('无法移除最后一个评分')
    }

    const totalScore = this.value * this.count - oldRating
    const newCount = this.count - 1
    const newValue = totalScore / newCount

    const newDistribution = this.distribution.removeRating(oldRating)

    return new Rating(newValue, newCount, newDistribution)
  }

  // 更新评分
  updateRating(oldRating: number, newRating: number): Rating {
    this.validateValue(oldRating)
    this.validateValue(newRating)

    const totalScore = this.value * this.count - oldRating + newRating
    const newValue = totalScore / this.count

    const newDistribution = this.distribution.updateRating(oldRating, newRating)

    return new Rating(newValue, this.count, newDistribution)
  }

  // 批量添加评分
  addRatings(ratings: number[]): Rating {
    if (ratings.length === 0) {
      return this
    }

    const validRatings = ratings.filter(rating => {
      try {
        this.validateValue(rating)
        return true
      } catch {
        return false
      }
    })

    if (validRatings.length === 0) {
      return this
    }

    const totalScore =
      this.value * this.count +
      validRatings.reduce((sum, rating) => sum + rating, 0)
    const newCount = this.count + validRatings.length
    const newValue = totalScore / newCount

    const newDistribution = validRatings.reduce(
      (dist, rating) => dist.addRating(rating),
      this.distribution
    )

    return new Rating(newValue, newCount, newDistribution)
  }

  // 比较方法
  isBetterThan(other: Rating): boolean {
    return this.value > other.value
  }

  isSameRating(other: Rating): boolean {
    return Math.abs(this.value - other.value) < 0.1
  }

  // 计算评分差异
  getDifference(other: Rating): number {
    return Math.abs(this.value - other.value)
  }

  // 静态工厂方法
  static fromRatings(ratings: number[]): Rating {
    if (ratings.length === 0) {
      throw new Error('评分列表不能为空')
    }

    const validRatings = ratings.filter(rating => {
      try {
        this.validateValueStatic(rating)
        return true
      } catch {
        return false
      }
    })

    if (validRatings.length === 0) {
      throw new Error('没有有效的评分数据')
    }

    const totalScore = validRatings.reduce((sum, rating) => sum + rating, 0)
    const average = totalScore / validRatings.length

    const distribution = RatingDistribution.fromRatings(validRatings)

    return new Rating(average, validRatings.length, distribution)
  }

  static createDefault(): Rating {
    return new Rating(
      7.0,
      0,
      new RatingDistribution(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    )
  }

  static createExcellent(): Rating {
    return new Rating(9.5, 1, RatingDistribution.fromSingleRating(9.5))
  }

  static createGood(): Rating {
    return new Rating(8.0, 1, RatingDistribution.fromSingleRating(8.0))
  }

  static createAverage(): Rating {
    return new Rating(6.0, 1, RatingDistribution.fromSingleRating(6.0))
  }

  static createPoor(): Rating {
    return new Rating(4.0, 1, RatingDistribution.fromSingleRating(4.0))
  }

  // 预定义的评分等级
  static readonly RATING_LEVELS = {
    EXCELLENT: { min: 9.0, max: 10.0, text: '优秀', color: '#10B981' },
    VERY_GOOD: { min: 8.0, max: 9.0, text: '很好', color: '#3B82F6' },
    GOOD: { min: 7.0, max: 8.0, text: '良好', color: '#F59E0B' },
    AVERAGE: { min: 5.0, max: 7.0, text: '一般', color: '#F97316' },
    POOR: { min: 1.0, max: 5.0, text: '较差', color: '#EF4444' },
  } as const

  // 工具方法
  private static validateValueStatic(value: number): void {
    if (typeof value !== 'number') {
      throw new Error('评分必须是数字')
    }

    if (value < 1 || value > 10) {
      throw new Error('评分必须在1-10之间')
    }
  }

  static getRatingLevel(
    value: number
  ): 'excellent' | 'very-good' | 'good' | 'average' | 'poor' {
    try {
      this.validateValueStatic(value)
    } catch {
      return 'average'
    }

    if (value >= 9.0) return 'excellent'
    if (value >= 8.0) return 'very-good'
    if (value >= 7.0) return 'good'
    if (value >= 5.0) return 'average'
    return 'poor'
  }

  static normalizeRating(value: number): number {
    try {
      this.validateValueStatic(value)
      return Math.round(value * 10) / 10
    } catch {
      return 5.0 // 默认评分
    }
  }

  // 序列化方法
  toJSON(): {
    value: number
    count: number
    distribution: ReturnType<RatingDistribution['toJSON']>
  } {
    return {
      value: this.value,
      count: this.count,
      distribution: this.distribution.toJSON(),
    }
  }

  static fromJSON(data: {
    value: number
    count: number
    distribution: {
      ones?: number
      twos?: number
      threes?: number
      fours?: number
      fives?: number
      sixes?: number
      sevens?: number
      eights?: number
      nines?: number
      tens?: number
    }
  }): Rating {
    const distribution = RatingDistribution.fromJSON(data.distribution)
    return new Rating(data.value, data.count, distribution)
  }

  // 字符串表示
  toString(): string {
    return `${this.value} (${this.count}人评价)`
  }

  getDetailedString(): string {
    return `${this.value}分 · ${this.count}人评价 · ${this.getRatingText()}`
  }

  // 格式化显示
  getDisplayValue(): string {
    return this.value.toFixed(1)
  }

  getDisplayText(): string {
    if (this.count === 0) {
      return '暂无评分'
    }

    return `${this.getDisplayValue()}分`
  }

  getFullDisplayText(): string {
    if (this.count === 0) {
      return '暂无评分'
    }

    return `${this.getDisplayValue}分 (${this.count}人)`
  }
}

/**
 * 评分分布值对象
 */
export class RatingDistribution {
  public readonly ones: number
  public readonly twos: number
  public readonly threes: number
  public readonly fours: number
  public readonly fives: number
  public readonly sixes: number
  public readonly sevens: number
  public readonly eights: number
  public readonly nines: number
  public readonly tens: number

  constructor(
    ones: number,
    twos: number,
    threes: number,
    fours: number,
    fives: number,
    sixes: number,
    sevens: number,
    eights: number,
    nines: number,
    tens: number
  ) {
    this.validateCount(ones, '1星')
    this.validateCount(twos, '2星')
    this.validateCount(threes, '3星')
    this.validateCount(fours, '4星')
    this.validateCount(fives, '5星')
    this.validateCount(sixes, '6星')
    this.validateCount(sevens, '7星')
    this.validateCount(eights, '8星')
    this.validateCount(nines, '9星')
    this.validateCount(tens, '10星')

    this.ones = ones
    this.twos = twos
    this.threes = threes
    this.fours = fours
    this.fives = fives
    this.sixes = sixes
    this.sevens = sevens
    this.eights = eights
    this.nines = nines
    this.tens = tens
  }

  private validateCount(count: number, rating: string): void {
    if (typeof count !== 'number' || count < 0 || !Number.isInteger(count)) {
      throw new Error(`${rating}评分数量必须是非负整数`)
    }
  }

  getTotalCount(): number {
    return (
      this.ones +
      this.twos +
      this.threes +
      this.fours +
      this.fives +
      this.sixes +
      this.sevens +
      this.eights +
      this.nines +
      this.tens
    )
  }

  getPercentage(rating: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10): number {
    const total = this.getTotalCount()
    if (total === 0) return 0

    const count = this.getRatingCount(rating)
    return Math.round((count / total) * 100)
  }

  getRatingCount(rating: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10): number {
    const counts = {
      1: this.ones,
      2: this.twos,
      3: this.threes,
      4: this.fours,
      5: this.fives,
      6: this.sixes,
      7: this.sevens,
      8: this.eights,
      9: this.nines,
      10: this.tens,
    }
    return counts[rating] || 0
  }

  addRating(rating: number): RatingDistribution {
    const roundedRating = Math.round(rating)
    if (roundedRating < 1 || roundedRating > 10) {
      return this
    }

    const counts = this.toArray()
    counts[roundedRating - 1]++

    return RatingDistribution.fromArray(counts)
  }

  removeRating(rating: number): RatingDistribution {
    const roundedRating = Math.round(rating)
    if (roundedRating < 1 || roundedRating > 10) {
      return this
    }

    const counts = this.toArray()
    if (counts[roundedRating - 1] > 0) {
      counts[roundedRating - 1]--
    }

    return RatingDistribution.fromArray(counts)
  }

  updateRating(oldRating: number, newRating: number): RatingDistribution {
    return this.removeRating(oldRating).addRating(newRating)
  }

  toArray(): number[] {
    return [
      this.ones,
      this.twos,
      this.threes,
      this.fours,
      this.fives,
      this.sixes,
      this.sevens,
      this.eights,
      this.nines,
      this.tens,
    ]
  }

  getChartData(): { rating: string; count: number; percentage: number }[] {
    const total = this.getTotalCount()
    const data = []

    for (let i = 1; i <= 10; i++) {
      const count = this.getRatingCount(
        i as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
      )
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0

      data.push({
        rating: `${i}星`,
        count,
        percentage,
      })
    }

    return data.reverse() // 从高到低显示
  }

  // 静态工厂方法
  static fromArray(counts: number[]): RatingDistribution {
    if (counts.length !== 10) {
      throw new Error('评分分布数组长度必须为10')
    }

    return new RatingDistribution(
      counts[0],
      counts[1],
      counts[2],
      counts[3],
      counts[4],
      counts[5],
      counts[6],
      counts[7],
      counts[8],
      counts[9]
    )
  }

  static fromRatings(ratings: number[]): RatingDistribution {
    const counts = new Array(10).fill(0)

    for (const rating of ratings) {
      const roundedRating = Math.round(rating)
      if (roundedRating >= 1 && roundedRating <= 10) {
        counts[roundedRating - 1]++
      }
    }

    return this.fromArray(counts)
  }

  static fromSingleRating(rating: number): RatingDistribution {
    const roundedRating = Math.round(rating)
    if (roundedRating < 1 || roundedRating > 10) {
      throw new Error('评分必须在1-10之间')
    }

    const counts = new Array(10).fill(0)
    counts[roundedRating - 1] = 1

    return this.fromArray(counts)
  }

  static createEmpty(): RatingDistribution {
    return new RatingDistribution(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
  }

  // 序列化方法
  toJSON(): {
    ones: number
    twos: number
    threes: number
    fours: number
    fives: number
    sixes: number
    sevens: number
    eights: number
    nines: number
    tens: number
  } {
    return {
      ones: this.ones,
      twos: this.twos,
      threes: this.threes,
      fours: this.fours,
      fives: this.fives,
      sixes: this.sixes,
      sevens: this.sevens,
      eights: this.eights,
      nines: this.nines,
      tens: this.tens,
    }
  }

  static fromJSON(data: {
    ones?: number
    twos?: number
    threes?: number
    fours?: number
    fives?: number
    sixes?: number
    sevens?: number
    eights?: number
    nines?: number
    tens?: number
  }): RatingDistribution {
    return new RatingDistribution(
      data.ones || 0,
      data.twos || 0,
      data.threes || 0,
      data.fours || 0,
      data.fives || 0,
      data.sixes || 0,
      data.sevens || 0,
      data.eights || 0,
      data.nines || 0,
      data.tens || 0
    )
  }
}
