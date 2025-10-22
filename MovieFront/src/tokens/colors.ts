/**
 * @fileoverview 颜色设计令牌配置
 * @description 颜色设计令牌系统定义，包括语义化状态颜色、渐变色配置和颜色工具函数
 *              基于Radix UI Themes的主题系统，专注于业务特定的颜色需求，提供统一的
 *              颜色管理和应用方案，确保整个应用的颜色效果一致性和可维护性
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 语义化状态颜色配置 - 定义各种业务状态的语义化颜色，基于Radix UI Themes的色调系统
export const statusColors = {
  // 成功状态颜色 - 用于操作成功、确认通过等正面状态
  success: {
    light: 'text-green-11', // 浅色主题下的文字颜色
    dark: 'text-green-11', // 深色主题下的文字颜色
    background: 'bg-green-2', // 背景颜色
    border: 'border-green-7', // 边框颜色
  },

  // 警告状态颜色 - 用于需要注意、潜在问题等警示状态
  warning: {
    light: 'text-yellow-11', // 浅色主题下的文字颜色
    dark: 'text-yellow-11', // 深色主题下的文字颜色
    background: 'bg-yellow-2', // 背景颜色
    border: 'border-yellow-7', // 边框颜色
  },

  // 错误状态颜色 - 用于操作失败、错误信息等负面状态
  error: {
    light: 'text-red-11', // 浅色主题下的文字颜色
    dark: 'text-red-11', // 深色主题下的文字颜色
    background: 'bg-red-2', // 背景颜色
    border: 'border-red-7', // 边框颜色
  },

  // 信息状态颜色 - 用于提示信息、帮助说明等中性状态
  info: {
    light: 'text-blue-11', // 浅色主题下的文字颜色
    dark: 'text-blue-11', // 深色主题下的文字颜色
    background: 'bg-blue-2', // 背景颜色
    border: 'border-blue-7', // 边框颜色
  },
} as const

// 渐变色配置 - 定义业务特定的渐变效果，用于按钮、卡片、背景等装饰性元素
export const gradients = {
  primary: 'bg-gradient-to-r from-accent-6 to-accent-9', // 主要渐变 - 品牌色调
  secondary: 'bg-gradient-to-r from-gray-6 to-gray-9', // 次要渐变 - 中性色调
  success: 'bg-gradient-to-r from-green-6 to-green-9', // 成功渐变 - 绿色调
  warning: 'bg-gradient-to-r from-yellow-6 to-yellow-9', // 警告渐变 - 黄色调
  danger: 'bg-gradient-to-r from-red-6 to-red-9', // 危险渐变 - 红色调
  info: 'bg-gradient-to-r from-blue-6 to-blue-9', // 信息渐变 - 蓝色调
} as const

// 颜色工具函数 - 提供便捷的颜色获取和处理功能

// 获取状态颜色 - 根据状态类型和颜色类型返回对应的CSS类名
export const getStatusColor = (
  status: keyof typeof statusColors, // 状态类型
  type: 'light' | 'dark' | 'background' | 'border' // 颜色类型
) => {
  return statusColors[status]?.[type] || statusColors.info.light
}

// 获取渐变类名 - 根据渐变类型返回对应的CSS渐变类名
export const getGradientClass = (type: keyof typeof gradients) => {
  return gradients[type] || gradients.primary
}

// 颜色相关类型定义 - 定义颜色系统的TypeScript类型，确保类型安全

// 状态颜色类型 - 定义可用的状态颜色选项
export type StatusColorType = keyof typeof statusColors

// 渐变类型 - 定义可用的渐变选项
export type GradientType = keyof typeof gradients
