/**
 * 格式化相关的工具函数集
 * 统一管理所有格式化逻辑，遵循DRY原则
 */

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * 格式化下载速度
 * @param bytesPerSecond 每秒字节数
 * @returns 格式化后的速度字符串
 */
export function formatDownloadSpeed(bytesPerSecond: number): string {
  return `${formatFileSize(bytesPerSecond)}/s`
}

/**
 * 格式化时长（分钟）
 * @param minutes 分钟数
 * @returns 格式化后的时长字符串
 */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0分钟'

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${remainingMinutes}分钟`
  }

  return `${hours}小时${remainingMinutes > 0 ? `${remainingMinutes}分钟` : ''}`
}

/**
 * 格式化时间（秒）
 * @param seconds 秒数
 * @returns 格式化后的时间字符串
 */
export function formatTime(seconds: number): string {
  if (seconds <= 0) return '0秒'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  const parts: string[] = []

  if (hours > 0) {
    parts.push(`${hours}小时`)
  }

  if (minutes > 0) {
    parts.push(`${minutes}分钟`)
  }

  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(`${remainingSeconds}秒`)
  }

  return parts.join('')
}

/**
 * 格式化评分
 * @param rating 评分值
 * @param precision 精度，默认1位小数
 * @returns 格式化后的评分字符串
 */
export function formatRating(rating: number, precision: number = 1): string {
  if (typeof rating !== 'number' || isNaN(rating)) {
    return '0.0'
  }

  return rating.toFixed(precision)
}

/**
 * 获取评分等级
 * @param rating 评分值 (1-10)
 * @returns 评分等级
 */
export function getRatingLevel(
  rating: number
): 'excellent' | 'very-good' | 'good' | 'average' | 'poor' {
  const value = Math.max(1, Math.min(10, rating)) // 确保在1-10范围内

  if (value >= 9.0) return 'excellent'
  if (value >= 8.0) return 'very-good'
  if (value >= 7.0) return 'good'
  if (value >= 5.0) return 'average'
  return 'poor'
}

/**
 * 获取评分颜色（Tailwind CSS类名）
 * @param rating 评分值 (1-10)
 * @returns Tailwind CSS颜色类名
 */
export function getRatingColorClass(rating: number): string {
  const level = getRatingLevel(rating)

  const colorClasses = {
    excellent: 'text-green-600',
    'very-good': 'text-blue-600',
    good: 'text-yellow-600',
    average: 'text-orange-600',
    poor: 'text-red-600',
  }

  return colorClasses[level]
}

/**
 * 获取评分背景颜色（Tailwind CSS类名）
 * @param rating 评分值 (1-10)
 * @returns Tailwind CSS背景色类名
 */
export function getRatingBgColorClass(rating: number): string {
  const level = getRatingLevel(rating)

  const bgClasses = {
    excellent: 'bg-green-100',
    'very-good': 'bg-blue-100',
    good: 'bg-yellow-100',
    average: 'bg-orange-100',
    poor: 'bg-red-100',
  }

  return bgClasses[level]
}

/**
 * 获取评分文本
 * @param rating 评分值 (1-10)
 * @returns 评分等级文本
 */
export function getRatingText(rating: number): string {
  const level = getRatingLevel(rating)

  const texts = {
    excellent: '优秀',
    'very-good': '很好',
    good: '良好',
    average: '一般',
    poor: '较差',
  }

  return texts[level]
}

/**
 * 获取评分颜色（十六进制值）
 * @param rating 评分值 (1-10)
 * @returns 十六进制颜色值
 */
export function getRatingColor(rating: number): string {
  const level = getRatingLevel(rating)

  const colors = {
    excellent: '#10B981',
    'very-good': '#3B82F6',
    good: '#F59E0B',
    average: '#F97316',
    poor: '#EF4444',
  }

  return colors[level]
}

/**
 * 获取海报评分颜色类名（根据特殊规则：<9.0白色、>=9.0红色）
 * @param rating 评分值 (1-10)
 * @returns Tailwind CSS颜色类名
 */
export function getPosterRatingColorClass(rating: number): string {
  const value = Math.max(1, Math.min(10, rating)) // 确保在1-10范围内

  if (value >= 9.0) {
    return 'text-red-500' // 红色
  } else {
    return 'text-white' // 白色
  }
}

/**
 * 获取电影标题颜色类名（根据特殊规则：<9.0默认色、>=9.0红色）
 * @param rating 评分值 (1-10)
 * @returns Tailwind CSS颜色类名
 */
export function getMovieTitleColorClass(rating: number): string {
  const value = Math.max(1, Math.min(10, rating)) // 确保在1-10范围内

  if (value >= 9.0) {
    return 'text-red-500' // 红色
  } else {
    return '' // 默认颜色
  }
}

/**
 * 格式化百分比
 * @param value 数值
 * @param total 总数
 * @param precision 精度，默认1位小数
 * @returns 格式化后的百分比字符串
 */
export function formatPercentage(
  value: number,
  total: number,
  precision: number = 1
): string {
  if (total === 0) return '0%'

  const percentage = (value / total) * 100
  return `${percentage.toFixed(precision)}%`
}

/**
 * 格式化数字（添加千分位分隔符）
 * @param num 数字
 * @returns 格式化后的数字字符串
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN')
}

/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | number | string): string {
  const dateObj =
    typeof date === 'number' || typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) {
    return '无效日期'
  }

  return dateObj.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * 格式化相对时间
 * @param date 日期对象或时间戳
 * @returns 相对时间字符串
 */
export function formatRelativeTime(date: Date | number | string): string {
  const dateObj =
    typeof date === 'number' || typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) {
    return '无效时间'
  }

  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) {
    return '刚刚'
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`
  } else if (diffHours < 24) {
    return `${diffHours}小时前`
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return formatDate(dateObj)
  }
}
