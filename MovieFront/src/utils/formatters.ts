/**
 * @fileoverview 格式化工具函数集
 * @description 统一管理所有格式化逻辑，遵循DRY原则，提供文件大小、下载速度、时长、时间、评分、百分比、数字、日期等数据格式化功能，以及评分等级判断、颜色样式获取和状态处理等工具函数
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 格式化文件大小，将字节数转换为易读的格式
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// 格式化下载速度，显示为文件大小/秒的格式
export function formatDownloadSpeed(bytesPerSecond: number): string {
  return `${formatFileSize(bytesPerSecond)}/s`
}

// 格式化时长（分钟），支持小时和分钟的组合显示
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0分钟'

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${remainingMinutes}分钟`
  }

  return `${hours}小时${remainingMinutes > 0 ? `${remainingMinutes}分钟` : ''}`
}

// 格式化时间（秒），支持小时、分钟、秒的组合显示
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

// 格式化评分，支持自定义精度
export function formatRating(rating: number, precision: number = 1): string {
  if (typeof rating !== 'number' || isNaN(rating)) {
    return '0.0'
  }

  return rating.toFixed(precision)
}

// 根据评分获取颜色类型，用于Badge Layer
// 评分规则：≥9.0红色、≥8.0紫色、≥7.0白色、<7.0灰色
export function getRatingColorType(
  rating: number
): 'red' | 'purple' | 'white' | 'gray' {
  const value = Math.max(0, Math.min(10, rating)) // 确保在0-10范围内

  if (value >= 9.0) return 'red' // 高分 - 红色
  if (value >= 8.0) return 'purple' // 优秀 - 紫色
  if (value >= 7.0) return 'white' // 良好 - 白色
  return 'gray' // 一般 - 灰色
}

// 根据评分获取文本颜色类名，用于Title Layer
// 评分规则：≥9.0红色、≥8.0紫色、≥7.0深灰色、<7.0灰色
export function getRatingTextColorClass(rating: number): string {
  const value = Math.max(0, Math.min(10, rating)) // 确保在0-10范围内

  if (value >= 9.0) return 'text-red-500 dark:text-red-400' // 高分 - 红色
  if (value >= 8.0) return 'text-purple-500 dark:text-purple-300' // 优秀 - 紫色
  if (value >= 7.0) return 'text-gray-900 dark:text-gray-100' // 良好 - 深灰色/浅灰色
  return 'text-gray-600 dark:text-gray-400' // 一般 - 灰色
}

// 格式化百分比，支持自定义精度
export function formatPercentage(
  value: number,
  total: number,
  precision: number = 1
): string {
  if (total === 0) return '0%'

  const percentage = (value / total) * 100
  return `${percentage.toFixed(precision)}%`
}

// 格式化数字（添加千分位分隔符）
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN')
}

// 格式化日期，支持多种日期格式输入
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

// 格式化相对时间，显示"刚刚"、"X分钟前"等相对时间格式
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

// 格式化短日期（月日格式），如"1月15日"
export function formatDateShort(date: Date | number | string): string {
  const dateObj =
    typeof date === 'number' || typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) {
    return '无效日期'
  }

  return dateObj.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })
}

// 生成随机评分，支持自定义范围和精度
export function generateRandomRating(
  min: number = 5.0,
  max: number = 10.0,
  precision: number = 1
): string {
  const rating = Math.random() * (max - min) + min
  return rating.toFixed(precision)
}

// 评分验证和格式化函数，支持数字和字符串评分的验证处理
export function formatAndValidateRating(rating: number | string): {
  isValid: boolean
  displayText: string
  numericValue?: number
} {
  // 处理字符串评分
  if (typeof rating === 'string') {
    // 去除空格并转为大写
    const cleanRating = rating.trim().toUpperCase()

    // 处理特殊评分文本
    if (
      cleanRating === 'NC-17' ||
      cleanRating === 'NR' ||
      cleanRating === 'NOT RATED'
    ) {
      return { isValid: true, displayText: cleanRating }
    }

    // 尝试提取数字部分
    const numericMatch = cleanRating.match(/(\d+\.?\d*)/)
    if (numericMatch) {
      const numValue = parseFloat(numericMatch[1])
      return {
        isValid: true,
        displayText: rating,
        numericValue: numValue,
      }
    }

    // 其他字符串评分（如"A"、"B+"等）
    return { isValid: true, displayText: rating }
  }

  // 处理数字评分
  if (typeof rating === 'number') {
    if (isNaN(rating) || rating < 0) {
      return { isValid: false, displayText: '', numericValue: 0 }
    }

    // 限制评分范围在0-10之间
    const clampedRating = Math.min(Math.max(rating, 0), 10)
    return {
      isValid: true,
      displayText: formatRating(clampedRating),
      numericValue: clampedRating,
    }
  }

  return { isValid: false, displayText: '', numericValue: 0 }
}

// 获取状态颜色类名，根据状态返回对应的Tailwind CSS颜色类名
export function getStatusColor(status: string): string {
  switch (status) {
    case 'downloading':
      return 'text-blue-600'
    case 'completed':
      return 'text-green-600'
    case 'paused':
      return 'text-yellow-600'
    case 'failed':
      return 'text-red-600'
    case 'pending':
      return 'text-gray-600'
    default:
      return 'text-gray-600'
  }
}

// 获取状态文本，将状态英文转换为中文显示
export function getStatusText(status: string): string {
  switch (status) {
    case 'downloading':
      return '下载中'
    case 'completed':
      return '已完成'
    case 'paused':
      return '已暂停'
    case 'failed':
      return '下载失败'
    case 'pending':
      return '等待中'
    case 'cancelled':
      return '已取消'
    default:
      return '未知状态'
  }
}
