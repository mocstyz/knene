/**
 * @fileoverview 下拉选择框组件
 * @description 提供统一样式的下拉选择框，支持标签、错误状态、必填标识等功能
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Icon } from '@components/atoms/Icon'
import React from 'react'

// 选择框选项接口，定义单个选项的数据结构
export interface SelectOption {
  value: string // 选项值
  label: string // 选项显示文本
  disabled?: boolean // 是否禁用该选项
}

// 选择框组件属性接口，定义选择框的各种配置选项
interface SelectProps {
  value: string // 当前选中的值
  onChange: (value: string) => void // 值变更回调函数
  options: SelectOption[] // 选项列表
  placeholder?: string // 占位符文本
  disabled?: boolean // 是否禁用整个选择框
  error?: string // 错误信息
  label?: string // 选择框标签
  required?: boolean // 是否必填
  className?: string // 自定义CSS类名
}

// 下拉选择框组件，提供统一样式的选择功能
export const Select: React.FC<SelectProps> = ({
  value, // 当前选中的值
  onChange, // 值变更回调
  options, // 选项列表
  placeholder = '请选择...', // 默认占位符
  disabled = false, // 默认不禁用
  error, // 错误信息
  label, // 选择框标签
  required = false, // 默认非必填
  className = '', // 自定义类名
}) => {
  // 基础样式类名 - 定义选择框的默认外观和交互状态
  const baseClasses = `
    w-full px-3 py-2 border rounded-lg shadow-sm appearance-none bg-white
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    transition-colors duration-200
  `

  // 根据错误状态计算边框样式类名
  const errorClasses = error
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' // 错误状态：红色边框和焦点
    : 'border-gray-300' // 正常状态：灰色边框

  return (
    <div className={`space-y-1 ${className}`}>
      {/* 渲染标签元素 - 如果提供了label则显示对应的label标签 */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {/* 必填标识 - 如果required为true则显示红色星号 */}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {/* 原生select元素 - 应用组合后的样式类名 */}
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          className={`${baseClasses} ${errorClasses} pr-10`}
        >
          {/* 占位符选项 - 如果提供了placeholder则显示禁用的空值选项 */}
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {/* 渲染选项列表 - 遍历options数组生成option元素 */}
          {options.map(option => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* 下拉箭头图标 - 绝对定位在选择框右侧 */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <Icon name="chevron-down" className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* 错误信息 - 如果有error则显示红色的错误文本 */}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default Select
