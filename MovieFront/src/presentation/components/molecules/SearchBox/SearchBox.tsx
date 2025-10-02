import React from 'react'
import { Button, Input, Icon } from '@/components/atoms'
import { cn } from '@/utils/cn'

export interface SearchBoxProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
  onClear?: () => void
  loading?: boolean
  suggestions?: string[]
  onSuggestionClick?: (suggestion: string) => void
  className?: string
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "搜索影片、演员、导演...",
  value,
  onChange,
  onSearch,
  onClear,
  loading = false,
  suggestions = [],
  onSuggestionClick,
  className
}) => {
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const searchBoxRef = React.useRef<HTMLDivElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSearch(value.trim())
      setShowSuggestions(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setShowSuggestions(newValue.length > 0 && suggestions.length > 0)
  }

  const handleClear = () => {
    onChange('')
    setShowSuggestions(false)
    onClear?.()
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
    onSuggestionClick?.(suggestion)
    onSearch(suggestion)
  }

  // 点击外部关闭建议列表
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={searchBoxRef} className={cn('relative w-full max-w-2xl', className)}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            leftIcon={<Icon name="search" />}
            rightIcon={
              value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
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

      {/* 搜索建议列表 */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
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