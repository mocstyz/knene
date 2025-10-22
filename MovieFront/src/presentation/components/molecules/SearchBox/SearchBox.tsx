/**
 * @fileoverview 搜索框组件
 * @description 提供完整的搜索功能，包含搜索输入、建议列表、清除按钮和提交功能，支持加载状态和外部点击关闭
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Button, Input, Icon } from '@components/atoms'
import { cn } from '@utils/cn'
import React from 'react'

// 搜索框组件属性接口，定义搜索框的完整配置参数
export interface SearchBoxProps {
  placeholder?: string // 输入框占位符文本
  value: string // 输入框当前值
  onChange: (value: string) => void // 输入值变化回调函数
  onSearch: (query: string) => void // 搜索提交回调函数
  onClear?: () => void // 清除输入回调函数
  loading?: boolean // 加载状态标识
  suggestions?: string[] // 搜索建议列表
  onSuggestionClick?: (suggestion: string) => void // 建议项点击回调函数
  className?: string // 自定义CSS类名
}

// 搜索框组件，提供完整的搜索功能和用户体验
const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = '搜索影片、演员、导演...', // 输入框占位符，默认搜索提示
  value, // 输入框当前值
  onChange, // 输入值变化回调函数
  onSearch, // 搜索提交回调函数
  onClear, // 清除输入回调函数
  loading = false, // 加载状态，默认非加载中
  suggestions = [], // 搜索建议列表，默认空数组
  onSuggestionClick, // 建议项点击回调函数
  className, // 自定义CSS类名
}) => {
  const [showSuggestions, setShowSuggestions] = React.useState(false) // 建议列表显示状态
  const searchBoxRef = React.useRef<HTMLDivElement>(null) // 搜索框容器引用

  // 处理搜索表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault() // 阻止表单默认提交行为
    if (value.trim()) {
      onSearch(value.trim()) // 执行搜索回调
      setShowSuggestions(false) // 隐藏建议列表
    }
  }

  // 处理输入框值变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue) // 更新输入值
    setShowSuggestions(newValue.length > 0 && suggestions.length > 0) // 根据输入和建议列表状态显示建议
  }

  // 处理清除输入
  const handleClear = () => {
    onChange('') // 清空输入值
    setShowSuggestions(false) // 隐藏建议列表
    onClear?.() // 执行清除回调
  }

  // 处理建议项点击
  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion) // 更新输入值为建议项
    setShowSuggestions(false) // 隐藏建议列表
    onSuggestionClick?.(suggestion) // 执行建议点击回调
    onSearch(suggestion) // 自动执行搜索
  }

  // 点击外部关闭建议列表 - 监听全局鼠标点击事件
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 检查点击是否在搜索框外部
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false) // 隐藏建议列表
      }
    }

    // 添加和清理事件监听器
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      ref={searchBoxRef}
      className={cn('relative w-full max-w-2xl', className)}
    >
      {/* 搜索表单 - 包含输入框和搜索按钮 */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            leftIcon={<Icon name="search" />}
            rightIcon={
              value && (
                // 清除按钮 - 仅在有输入值时显示
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  <Icon name="x" size="sm" />
                </button>
              )
            }
            className="pr-10"
            fullWidth
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={!value.trim() || loading}
          icon={loading ? undefined : <Icon name="search" />}
        >
          {loading ? '搜索中...' : '搜索'}
        </Button>
      </form>

      {/* 搜索建议列表 - 显示搜索建议供用户选择 */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="w-full border-b border-gray-100 px-4 py-2 text-left transition-colors last:border-b-0 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center gap-2">
                <Icon name="search" size="sm" className="text-gray-400" />
                <span className="text-gray-900">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export { SearchBox }
