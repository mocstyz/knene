/**
 * @fileoverview 开关切换组件
 * @description 提供统一样式的开关切换控件，支持多种尺寸、标签和描述文本
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-19 15:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'

// 开关组件属性接口，定义开关的各种配置选项
interface SwitchProps {
  checked: boolean // 是否选中状态
  onChange: (checked: boolean) => void // 状态变更回调函数
  disabled?: boolean // 是否禁用
  size?: 'sm' | 'md' | 'lg' // 开关尺寸
  label?: string // 开关标签
  description?: string // 开关描述文本
  className?: string // 自定义CSS类名
}

// 开关切换组件，提供统一样式的切换功能
export const Switch: React.FC<SwitchProps> = ({
  checked, // 当前选中状态
  onChange, // 状态变更回调
  disabled = false, // 默认不禁用
  size = 'md', // 默认中等尺寸
  label, // 开关标签
  description, // 开关描述
  className = '', // 自定义类名
}) => {
  // 开关轨道尺寸样式映射表 - 定义不同尺寸的宽高
  const sizeClasses = {
    sm: 'w-8 h-4', // 小尺寸：32x16px
    md: 'w-10 h-5', // 中等尺寸：40x20px
    lg: 'w-12 h-6', // 大尺寸：48x24px
  }

  // 开关滑块尺寸样式映射表 - 定义不同尺寸滑块的宽高
  const thumbSizeClasses = {
    sm: 'w-3 h-3', // 小尺寸滑块：12x12px
    md: 'w-4 h-4', // 中等尺寸滑块：16x16px
    lg: 'w-5 h-5', // 大尺寸滑块：20x20px
  }

  // 滑块位移样式映射表 - 根据选中状态和尺寸计算滑块位置
  const translateClasses = {
    sm: checked ? 'translate-x-4' : 'translate-x-0', // 小尺寸：选中时向右移动16px
    md: checked ? 'translate-x-5' : 'translate-x-0', // 中等尺寸：选中时向右移动20px
    lg: checked ? 'translate-x-6' : 'translate-x-0', // 大尺寸：选中时向右移动24px
  }

  return (
    <div className={`flex items-center ${className}`}>
      {/* 开关按钮元素 - 使用button实现更好的可访问性 */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)} // 点击时切换状态
        className={`relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses[size]} ${checked ? 'bg-blue-600' : 'bg-gray-200'} `}
      >
        {/* 开关滑块元素 - 根据选中状态改变位置 */}
        <span
          className={`pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${thumbSizeClasses[size]} ${translateClasses[size]} `}
        />
      </button>

      {/* 标签和描述区域 - 如果提供了label或description则显示 */}
      {(label || description) && (
        <div className="ml-3">
          {/* 标签文本 */}
          {label && (
            <label className="text-sm font-medium text-gray-900">{label}</label>
          )}
          {/* 描述文本 */}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Switch
