/**
 * 颜色工具函数 - 基于新的主题系统
 * 注意：基础颜色已由 Radix UI Themes 提供，此处只保留业务特定颜色
 */

// 语义化状态颜色 - Radix UI Themes 未提供的业务特定颜色
export const statusColors = {
  // 成功状态 - 使用 Radix UI 的 accent 颜色
  success: {
    light: 'text-green-11',
    dark: 'text-green-11',
    background: 'bg-green-2',
    border: 'border-green-7',
  },

  // 警告状态
  warning: {
    light: 'text-yellow-11',
    dark: 'text-yellow-11',
    background: 'bg-yellow-2',
    border: 'border-yellow-7',
  },

  // 错误状态
  error: {
    light: 'text-red-11',
    dark: 'text-red-11',
    background: 'bg-red-2',
    border: 'border-red-7',
  },

  // 信息状态
  info: {
    light: 'text-blue-11',
    dark: 'text-blue-11',
    background: 'bg-blue-2',
    border: 'border-blue-7',
  },
} as const

// 渐变色 - 业务特定的渐变效果
export const gradients = {
  primary: 'bg-gradient-to-r from-accent-6 to-accent-9',
  secondary: 'bg-gradient-to-r from-gray-6 to-gray-9',
  success: 'bg-gradient-to-r from-green-6 to-green-9',
  warning: 'bg-gradient-to-r from-yellow-6 to-yellow-9',
  danger: 'bg-gradient-to-r from-red-6 to-red-9',
  info: 'bg-gradient-to-r from-blue-6 to-blue-9',
} as const

// 颜色工具函数
export const getStatusColor = (
  status: keyof typeof statusColors,
  type: 'light' | 'dark' | 'background' | 'border'
) => {
  return statusColors[status]?.[type] || statusColors.info.light
}

// 获取渐变类名
export const getGradientClass = (type: keyof typeof gradients) => {
  return gradients[type] || gradients.primary
}

// 类型定义
export type StatusColorType = keyof typeof statusColors
export type GradientType = keyof typeof gradients
