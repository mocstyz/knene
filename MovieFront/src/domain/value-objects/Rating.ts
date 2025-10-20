/**
 * @fileoverview 评分值对象
 * @description 评分值对象，封装评分数值、评分人数和评分分布等属性，提供评分的创建、验证、计算和展示功能
 * @created 2025-10-09 13:10:49
 * @updated 2025-10-19 10:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 评分值对象，封装评分数值、评分人数和评分分布等属性
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

  // 验证评分值
  private validateValue(value: number): void {
    if (typeof value !== 'number') {
      throw new Error('评分必须是数字')
    }

    if (value < 1 || value > 10) {
      throw new Error('评分必须在1-10之间')
    }
  }

  // 验证评分人数
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

  // 检查是否为优秀评分（8分以上）
  isExcellent(): boolean {
    return this.value >= 8
  }

  // 检查是否为良好评分（7分以上）
  isGood(): boolean {
    return this.value >= 7
  }

  // 检查是否为一般评分（5分以上）
  isAverage(): boolean {
    return this.value >= 5
  }

  // 检查是否为较差评分（5分以下）
  isPoor(): boolean {
    return this.value < 5
  }

  // 获取评分等级
  getGrade(): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (this.value >= 9) return 'A'
    if (this.value >= 8) return 'B'
    if (this.value >= 7) return 'C'
    if (this.value >= 6) return 'D'
    return 'F'
  }

  // 获取评分等级文本
  getGradeText(): string {
    const gradeTexts = {
      A: '优秀',
      B: '良好',
      C: '中等',
      D: '及格',
      F: '不及格'
    }
    return gradeTexts[this.getGrade()]
  }

  // 获取评分等级颜色
  getGradeColor(): string {
    const gradeColors = {
      A: 'text-green-600',
      B: 'text-blue-600',
      C: 'text-yellow-600',
      D: 'text-orange-600',
      F: 'text-red-600'
    }
    return gradeColors[this.getGrade()]
  }

  // 转换为5星制评分
  toFiveStars(): number {
    return Math.round((this.value / 10) * 5 * 10) / 10
  }

  // 转换为百分比评分
  toPercentage(): number {
    return Math.round((this.value / 10) * 100)
  }

  // 获取星型显示
  getStarsDisplay(): string {
    const stars = this.toFiveStars()
    const fullStars = Math.floor(stars)
    const hasHalfStar = stars % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return '★'.repeat(fullStars) +
           (hasHalfStar ? '☆' : '') +
           '☆'.repeat(emptyStars)
  }

  // 添加新评分
  addRating(newRating: number): Rating {
    this.validateValue(newRating)

    const totalCount = this.count + 1
    const totalScore = this.value * this.count + newRating
    const newValue = totalScore / totalCount

    const newDistribution = this.distribution.addRating(newRating)

    return new Rating(newValue, totalCount, newDistribution)
  }

  // 批量添加评分
  addRatings(ratings: number[]): Rating {
    if (ratings.length === 0) return this

    for (const rating of ratings) {
      this.validateValue(rating)
    }

    const totalCount = this.count + ratings.length
    const totalScore = this.value * this.count + ratings.reduce((sum, r) => sum + r, 0)
    const newValue = totalScore / totalCount

    const newDistribution = ratings.reduce(
      (dist, rating) => dist.addRating(rating),
      this.distribution
    )

    return new Rating(newValue, totalCount, newDistribution)
  }

  // 移除评分
  removeRating(oldRating: number): Rating {
    this.validateValue(oldRating)

    if (this.count <= 1) {
      throw new Error('至少需要保留一个评分')
    }

    const totalCount = this.count - 1
    const totalScore = this.value * this.count - oldRating
    const newValue = totalCount > 0 ? totalScore / totalCount : 1

    const newDistribution = this.distribution.removeRating(oldRating)

    return new Rating(newValue, totalCount, newDistribution)
  }

  // 获取最高评分占比
  getHighestRatingPercentage(): number {
    return this.distribution.getHighestRatingPercentage()
  }

  // 获取推荐度
  getRecommendationLevel(): 'highly-recommended' | 'recommended' | 'neutral' | 'not-recommended' {
    if (this.value >= 8.5) return 'highly-recommended'
    if (this.value >= 7) return 'recommended'
    if (this.value >= 5) return 'neutral'
    return 'not-recommended'
  }

  // 获取推荐度文本
  getRecommendationText(): string {
    const texts = {
      'highly-recommended': '强烈推荐',
      'recommended': '推荐',
      'neutral': '一般',
      'not-recommended': '不推荐'
    }
    return texts[this.getRecommendationLevel()]
  }

  // 检查评分是否可信（评分人数足够）
  isReliable(): boolean {
    return this.count >= 10
  }

  // 获取可信度级别
  getReliabilityLevel(): 'low' | 'medium' | 'high' | 'very-high' {
    if (this.count >= 1000) return 'very-high'
    if (this.count >= 100) return 'high'
    if (this.count >= 10) return 'medium'
    return 'low'
  }

  // 获取可信度文本
  getReliabilityText(): string {
    const texts = {
      low: '可信度低',
      medium: '可信度中等',
      high: '可信度高',
      'very-high': '可信度很高'
    }
    return texts[this.getReliabilityLevel()]
  }

  // 比较两个评分
  compare(other: Rating): number {
    return this.value - other.value
  }

  // 检查是否比另一个评分更好
  isBetterThan(other: Rating): boolean {
    return this.compare(other) > 0
  }

  // 转换为JSON格式
  toJSON(): {
    value: number
    count: number
    distribution: RatingDistribution
  } {
    return {
      value: this.value,
      count: this.count,
      distribution: this.distribution
    }
  }

  // 转换为字符串
  toString(): string {
    return `${this.value}/10 (${this.count}人评分)`
  }

  // ========== 静态工厂方法 ==========

  // 创建最高评分
  static max(): Rating {
    return new Rating(10, 1)
  }

  // 创建最低评分
  static min(): Rating {
    return new Rating(1, 1)
  }

  // 创建平均评分
  static average(): Rating {
    return new Rating(5.5, 2)
  }

  // 从多个评分值创建
  static fromRatings(ratings: number[]): Rating {
    if (ratings.length === 0) {
      throw new Error('至少需要一个评分')
    }

    const totalScore = ratings.reduce((sum, rating) => sum + rating, 0)
    const averageRating = totalScore / ratings.length
    const distribution = RatingDistribution.fromRatings(ratings)

    return new Rating(averageRating, ratings.length, distribution)
  }

  // 从JSON创建评分
  static fromJSON(json: {
    value: number
    count: number
    distribution?: RatingDistribution
  }): Rating {
    return new Rating(
      json.value,
      json.count,
      json.distribution
    )
  }

  // 验证评分数据
  static isValid(data: { value: number; count?: number }): boolean {
    try {
      new Rating(data.value, data.count || 1)
      return true
    } catch {
      return false
    }
  }

  // 计算多个评分的平均值
  static calculateAverage(ratings: Rating[]): Rating {
    if (ratings.length === 0) {
      throw new Error('至少需要一个评分对象')
    }

    const totalScore = ratings.reduce((sum, rating) => sum + rating.value * rating.count, 0)
    const totalCount = ratings.reduce((sum, rating) => sum + rating.count, 0)
    const averageValue = totalScore / totalCount

    // 合并评分分布
    const mergedDistribution = ratings.reduce(
      (merged, rating) => merged.merge(rating.distribution),
      new RatingDistribution()
    )

    return new Rating(averageValue, totalCount, mergedDistribution)
  }

  // 找到最高评分
  static getHighest(ratings: Rating[]): Rating {
    if (ratings.length === 0) {
      throw new Error('至少需要一个评分对象')
    }

    return ratings.reduce((highest, current) =>
      current.value > highest.value ? current : highest
    )
  }

  // 找到最低评分
  static getLowest(ratings: Rating[]): Rating {
    if (ratings.length === 0) {
      throw new Error('至少需要一个评分对象')
    }

    return ratings.reduce((lowest, current) =>
      current.value < lowest.value ? current : lowest
    )
  }

  // 按评分排序
  static sortByRating(ratings: Rating[]): Rating[] {
    return [...ratings].sort((a, b) => b.compare(a))
  }

  // 过滤优秀评分
  static filterExcellent(ratings: Rating[]): Rating[] {
    return ratings.filter(rating => rating.isExcellent())
  }

  // 过滤可信评分
  static filterReliable(ratings: Rating[]): Rating[] {
    return ratings.filter(rating => rating.isReliable())
  }
}

// 评分分布类
export class RatingDistribution {
  public readonly distribution: Map<number, number> // 评分值 -> 数量

  constructor(distribution: Map<number, number> = new Map()) {
    this.distribution = new Map(distribution)
    this.validateDistribution()
  }

  // 验证评分分布
  private validateDistribution(): void {
    for (const [rating, count] of this.distribution) {
      if (rating < 1 || rating > 10) {
        throw new Error('评分值必须在1-10之间')
      }
      if (count < 0 || !Number.isInteger(count)) {
        throw new Error('评分数量必须是非负整数')
      }
    }
  }

  // 获取总评分人数
  getTotalCount(): number {
    let total = 0
    for (const count of this.distribution.values()) {
      total += count
    }
    return total
  }

  // 获取指定评分的数量
  getCount(rating: number): number {
    return this.distribution.get(rating) || 0
  }

  // 获取指定评分的百分比
  getPercentage(rating: number): number {
    const total = this.getTotalCount()
    if (total === 0) return 0
    return Math.round((this.getCount(rating) / total) * 100)
  }

  // 获取最高评分占比
  getHighestRatingPercentage(): number {
    let maxPercentage = 0
    for (const [rating] of this.distribution) {
      const percentage = this.getPercentage(rating)
      if (percentage > maxPercentage) {
        maxPercentage = percentage
      }
    }
    return maxPercentage
  }

  // 添加评分
  addRating(rating: number): RatingDistribution {
    const newDistribution = new Map(this.distribution)
    const currentCount = newDistribution.get(rating) || 0
    newDistribution.set(rating, currentCount + 1)
    return new RatingDistribution(newDistribution)
  }

  // 移除评分
  removeRating(rating: number): RatingDistribution {
    const newDistribution = new Map(this.distribution)
    const currentCount = newDistribution.get(rating) || 0
    if (currentCount <= 1) {
      newDistribution.delete(rating)
    } else {
      newDistribution.set(rating, currentCount - 1)
    }
    return new RatingDistribution(newDistribution)
  }

  // 合并评分分布
  merge(other: RatingDistribution): RatingDistribution {
    const mergedDistribution = new Map(this.distribution)
    for (const [rating, count] of other.distribution) {
      const currentCount = mergedDistribution.get(rating) || 0
      mergedDistribution.set(rating, currentCount + count)
    }
    return new RatingDistribution(mergedDistribution)
  }

  // 获取条形图数据
  getBarChartData(): { rating: number; count: number; percentage: number }[] {
    const data = []
    for (let rating = 1; rating <= 10; rating++) {
      data.push({
        rating,
        count: this.getCount(rating),
        percentage: this.getPercentage(rating)
      })
    }
    return data.reverse() // 从高分到低分
  }

  // 转换为JSON格式
  toJSON(): Record<number, number> {
    const json: Record<number, number> = {}
    for (const [rating, count] of this.distribution) {
      json[rating] = count
    }
    return json
  }

  // ========== 静态工厂方法 ==========

  // 从单个评分创建分布
  static fromSingleRating(rating: number): RatingDistribution {
    const distribution = new Map<number, number>()
    distribution.set(Math.round(rating), 1)
    return new RatingDistribution(distribution)
  }

  // 从多个评分创建分布
  static fromRatings(ratings: number[]): RatingDistribution {
    const distribution = new Map<number, number>()
    for (const rating of ratings) {
      const roundedRating = Math.round(rating)
      const currentCount = distribution.get(roundedRating) || 0
      distribution.set(roundedRating, currentCount + 1)
    }
    return new RatingDistribution(distribution)
  }

  // 从JSON创建分布
  static fromJSON(json: Record<number, number>): RatingDistribution {
    const distribution = new Map<number, number>()
    for (const [ratingStr, count] of Object.entries(json)) {
      const rating = parseInt(ratingStr, 10)
      distribution.set(rating, count)
    }
    return new RatingDistribution(distribution)
  }

  // 创建均匀分布
  static uniform(countPerRating: number): RatingDistribution {
    const distribution = new Map<number, number>()
    for (let rating = 1; rating <= 10; rating++) {
      distribution.set(rating, countPerRating)
    }
    return new RatingDistribution(distribution)
  }

  // 创建正态分布
  static normal(center: number = 7, totalCount: number = 100): RatingDistribution {
    const distribution = new Map<number, number>()
    let remainingCount = totalCount

    // 简单的正态分布模拟
    for (let rating = 1; rating <= 10; rating++) {
      const distance = Math.abs(rating - center)
      let weight = Math.exp(-(distance * distance) / 2)

      if (remainingCount <= 0) break

      let count = Math.round(totalCount * weight)
      count = Math.min(count, remainingCount)

      distribution.set(rating, count)
      remainingCount -= count
    }

    return new RatingDistribution(distribution)
  }
}