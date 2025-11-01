# 分页器通用化重构设计文档

## 概述

本文档详细描述了通用分页组件系统的架构设计、组件接口、数据模型和实现策略。设计遵循项目现有的设计系统规范，采用原子化组件设计理念，提供灵活可配置的分页解决方案。

## 架构设计

### 组件层次结构

```
@components/atoms/
└── Pagination/
    ├── index.ts                    # 组件导出
    ├── Pagination.tsx              # 主组件实现
    ├── PaginationButton.tsx        # 分页按钮子组件
    ├── PaginationEllipsis.tsx      # 省略号子组件
    └── PaginationInfo.tsx          # 分页信息子组件

@types/
└── pagination.ts                   # 分页类型定义

@utils/
└── pagination.ts                   # 分页工具函数
```

### 设计原则

1. **原子化设计** - 作为原子组件放置在 `@components/atoms` 目录
2. **组合优于继承** - 通过组合子组件实现复杂功能
3. **配置驱动** - 通过 props 配置实现不同的显示模式
4. **类型安全** - 完整的 TypeScript 类型定义
5. **可访问性优先** - 完整的 ARIA 属性和键盘导航支持
6. **响应式设计** - 适配移动端和桌面端

## 组件接口设计

### 核心类型定义

```typescript
// @types/pagination.ts

/**
 * 分页配置接口 - 定义分页组件的核心配置参数
 */
export interface PaginationConfig {
  /** 当前页码，从1开始 */
  currentPage: number
  
  /** 总页数 */
  totalPages: number
  
  /** 每页显示条数 */
  pageSize: number
  
  /** 数据总条数 */
  total: number
  
  /** 页码变更回调函数 */
  onPageChange: (page: number) => void
}

/**
 * 分页显示模式
 */
export type PaginationMode = 
  | 'simple'    // 简单模式：仅上一页/下一页 + 页码信息
  | 'full'      // 完整模式：显示所有页码按钮
  | 'compact'   // 紧凑模式：智能省略，最多显示7个按钮

/**
 * 分页组件变体样式
 */
export type PaginationVariant = 
  | 'default'   // 默认绿色主题
  | 'primary'   // 蓝色主题
  | 'ghost'     // 透明背景

/**
 * 分页组件尺寸
 */
export type PaginationSize = 'sm' | 'md' | 'lg'

/**
 * 分页响应数据接口 - 统一的API分页响应格式
 */
export interface PaginatedResponse<T> {
  /** 数据列表 */
  data: T[]
  
  /** 分页元信息 */
  pagination: {
    currentPage: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
```

### Pagination 组件接口

```typescript
// @components/atoms/Pagination/Pagination.tsx

export interface PaginationProps {
  /** 当前页码 */
  currentPage: number
  
  /** 总页数 */
  totalPages: number
  
  /** 页码变更回调 */
  onPageChange: (page: number) => void
  
  /** 显示模式，默认 'full' */
  mode?: PaginationMode
  
  /** 样式变体，默认 'default' */
  variant?: PaginationVariant
  
  /** 组件尺寸，默认 'md' */
  size?: PaginationSize
  
  /** 是否显示分页信息文本，默认 false */
  showPageInfo?: boolean
  
  /** 分页信息配置（当 showPageInfo 为 true 时使用） */
  pageInfo?: {
    total?: number        // 总条数
    pageSize?: number     // 每页条数
    template?: string     // 自定义模板，如 "第 {current} 页，共 {total} 页"
  }
  
  /** 是否显示快速跳转，默认 false */
  showQuickJumper?: boolean
  
  /** 是否禁用，默认 false */
  disabled?: boolean
  
  /** 是否处于加载状态，默认 false */
  loading?: boolean
  
  /** 紧凑模式下最多显示的页码按钮数，默认 7 */
  maxVisiblePages?: number
  
  /** 自定义 CSS 类名 */
  className?: string
  
  /** 自定义按钮 CSS 类名 */
  buttonClassName?: string
  
  /** 上一页按钮文本/图标 */
  prevLabel?: React.ReactNode
  
  /** 下一页按钮文本/图标 */
  nextLabel?: React.ReactNode
  
  /** 首页按钮文本/图标（仅在 mode='full' 时显示） */
  firstLabel?: React.ReactNode
  
  /** 末页按钮文本/图标（仅在 mode='full' 时显示） */
  lastLabel?: React.ReactNode
  
  /** 是否在移动端自动切换为简单模式，默认 true */
  responsiveMode?: boolean
}
```

### 子组件接口

```typescript
// PaginationButton 子组件
interface PaginationButtonProps {
  page: number | 'prev' | 'next' | 'first' | 'last'
  active?: boolean
  disabled?: boolean
  onClick: () => void
  variant: PaginationVariant
  size: PaginationSize
  children: React.ReactNode
  className?: string
}

// PaginationEllipsis 子组件
interface PaginationEllipsisProps {
  size: PaginationSize
  className?: string
}

// PaginationInfo 子组件
interface PaginationInfoProps {
  currentPage: number
  totalPages: number
  total?: number
  pageSize?: number
  template?: string
  className?: string
}
```

## 数据模型

### 页码生成算法

```typescript
/**
 * 生成页码列表算法
 * 
 * 规则：
 * - 总页数 <= maxVisible: 显示所有页码
 * - 总页数 > maxVisible: 智能省略
 *   - 始终显示首页和末页
 *   - 当前页附近显示 (maxVisible - 4) 个页码
 *   - 使用省略号表示跳过的页码
 * 
 * 示例（maxVisible = 7）：
 * - 总页数 10，当前页 1: [1] 2 3 4 5 ... 10
 * - 总页数 10，当前页 5: 1 ... 4 [5] 6 ... 10
 * - 总页数 10，当前页 10: 1 ... 6 7 8 9 [10]
 */
type PageItem = number | 'ellipsis'

function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7
): PageItem[] {
  // 实现逻辑见工具函数部分
}
```

### 状态管理

```typescript
/**
 * 分页状态计算
 */
interface PaginationState {
  /** 是否可以上一页 */
  canGoPrev: boolean
  
  /** 是否可以下一页 */
  canGoNext: boolean
  
  /** 当前显示的页码列表 */
  visiblePages: PageItem[]
  
  /** 是否显示首页按钮 */
  showFirstButton: boolean
  
  /** 是否显示末页按钮 */
  showLastButton: boolean
}

function computePaginationState(
  currentPage: number,
  totalPages: number,
  mode: PaginationMode,
  maxVisible: number
): PaginationState {
  // 实现逻辑见工具函数部分
}
```

## 样式设计

### 设计令牌（Design Tokens）

```typescript
// @tokens/design-system/pagination-variants.ts

export const paginationVariants = {
  // 基础样式
  base: 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
  
  // 变体样式
  variant: {
    default: {
      button: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
      active: 'bg-green-100 text-green-900 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800',
      disabled: 'opacity-50 cursor-not-allowed',
    },
    primary: {
      button: 'text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-blue-900/20',
      active: 'bg-blue-600 text-white hover:bg-blue-700',
      disabled: 'opacity-50 cursor-not-allowed',
    },
    ghost: {
      button: 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
      active: 'text-gray-900 font-bold dark:text-gray-100',
      disabled: 'opacity-50 cursor-not-allowed',
    },
  },
  
  // 尺寸样式
  size: {
    sm: {
      button: 'h-8 w-8 text-xs sm:h-8 sm:w-8',
      spacing: 'space-x-1',
      info: 'text-xs',
    },
    md: {
      button: 'h-8 w-8 text-xs sm:h-10 sm:w-10 sm:text-sm',
      spacing: 'space-x-1 sm:space-x-2',
      info: 'text-sm',
    },
    lg: {
      button: 'h-10 w-10 text-sm sm:h-12 sm:w-12 sm:text-base',
      spacing: 'space-x-2',
      info: 'text-base',
    },
  },
  
  // 容器样式
  container: 'flex items-center justify-center',
  
  // 分页信息样式
  info: 'text-gray-500 dark:text-gray-400',
}
```

### 响应式设计

```typescript
// 响应式断点策略
const responsiveStrategy = {
  // 移动端（< 640px）
  mobile: {
    defaultMode: 'simple',      // 默认使用简单模式
    maxVisiblePages: 5,         // 最多显示5个页码
    buttonSize: 'sm',           // 使用小尺寸按钮
    hidePageInfo: false,        // 保留分页信息
    hideQuickJumper: true,      // 隐藏快速跳转
  },
  
  // 平板端（640px - 1024px）
  tablet: {
    defaultMode: 'compact',     // 使用紧凑模式
    maxVisiblePages: 7,         // 最多显示7个页码
    buttonSize: 'md',           // 使用中等尺寸按钮
    hidePageInfo: false,        // 显示分页信息
    hideQuickJumper: false,     // 显示快速跳转
  },
  
  // 桌面端（>= 1024px）
  desktop: {
    defaultMode: 'full',        // 使用完整模式
    maxVisiblePages: 9,         // 最多显示9个页码
    buttonSize: 'md',           // 使用中等尺寸按钮
    hidePageInfo: false,        // 显示分页信息
    hideQuickJumper: false,     // 显示快速跳转
  },
}
```

## 工具函数设计

### 分页计算工具

```typescript
// @utils/pagination.ts

/**
 * 计算总页数
 */
export function calculateTotalPages(total: number, pageSize: number): number {
  if (pageSize <= 0) return 0
  return Math.ceil(total / pageSize)
}

/**
 * 获取当前页数据切片
 */
export function getPageSlice<T>(
  data: T[],
  page: number,
  pageSize: number
): T[] {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  return data.slice(startIndex, endIndex)
}

/**
 * 生成页码列表
 */
export function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7
): (number | 'ellipsis')[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | 'ellipsis')[] = []
  const sidePages = Math.floor((maxVisible - 4) / 2)

  // 始终显示首页
  pages.push(1)

  // 计算当前页附近的页码范围
  let startPage = Math.max(2, currentPage - sidePages)
  let endPage = Math.min(totalPages - 1, currentPage + sidePages)

  // 调整范围以保持固定数量的页码
  if (currentPage - sidePages <= 2) {
    endPage = Math.min(totalPages - 1, maxVisible - 2)
  }
  if (currentPage + sidePages >= totalPages - 1) {
    startPage = Math.max(2, totalPages - maxVisible + 3)
  }

  // 添加左侧省略号
  if (startPage > 2) {
    pages.push('ellipsis')
  }

  // 添加中间页码
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  // 添加右侧省略号
  if (endPage < totalPages - 1) {
    pages.push('ellipsis')
  }

  // 始终显示末页
  if (totalPages > 1) {
    pages.push(totalPages)
  }

  return pages
}

/**
 * 验证页码有效性
 */
export function isValidPage(page: number, totalPages: number): boolean {
  return Number.isInteger(page) && page >= 1 && page <= totalPages
}

/**
 * 获取分页元信息
 */
export function getPaginationMeta(
  page: number,
  pageSize: number,
  total: number
) {
  const totalPages = calculateTotalPages(total, pageSize)
  const startIndex = (page - 1) * pageSize + 1
  const endIndex = Math.min(page * pageSize, total)

  return {
    currentPage: page,
    pageSize,
    total,
    totalPages,
    startIndex,
    endIndex,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

/**
 * 格式化分页信息文本
 */
export function formatPaginationInfo(
  template: string,
  data: {
    current: number
    total: number
    totalPages: number
    pageSize: number
    start: number
    end: number
  }
): string {
  return template
    .replace('{current}', String(data.current))
    .replace('{total}', String(data.total))
    .replace('{totalPages}', String(data.totalPages))
    .replace('{pageSize}', String(data.pageSize))
    .replace('{start}', String(data.start))
    .replace('{end}', String(data.end))
}
```

## 无障碍访问设计

### ARIA 属性

```typescript
// 分页容器
<nav aria-label="分页导航" role="navigation">
  
// 页码按钮
<button
  aria-label={`第 ${page} 页`}
  aria-current={isActive ? 'page' : undefined}
  aria-disabled={disabled}
  role="button"
  tabIndex={disabled ? -1 : 0}
>

// 上一页按钮
<button
  aria-label="上一页"
  aria-disabled={!canGoPrev}
>

// 下一页按钮
<button
  aria-label="下一页"
  aria-disabled={!canGoNext}
>

// 省略号
<span aria-hidden="true" role="presentation">
  ...
</span>
```

### 键盘导航

```typescript
// 键盘事件处理
const handleKeyDown = (e: React.KeyboardEvent, page: number) => {
  switch (e.key) {
    case 'Enter':
    case ' ':
      e.preventDefault()
      onPageChange(page)
      break
    case 'ArrowLeft':
      e.preventDefault()
      if (currentPage > 1) {
        onPageChange(currentPage - 1)
      }
      break
    case 'ArrowRight':
      e.preventDefault()
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1)
      }
      break
    case 'Home':
      e.preventDefault()
      onPageChange(1)
      break
    case 'End':
      e.preventDefault()
      onPageChange(totalPages)
      break
  }
}
```

## 错误处理

### 输入验证

```typescript
// Props 验证
function validatePaginationProps(props: PaginationProps): void {
  const { currentPage, totalPages } = props

  if (!Number.isInteger(currentPage) || currentPage < 1) {
    console.warn('[Pagination] currentPage 必须是大于等于 1 的整数')
  }

  if (!Number.isInteger(totalPages) || totalPages < 0) {
    console.warn('[Pagination] totalPages 必须是大于等于 0 的整数')
  }

  if (currentPage > totalPages && totalPages > 0) {
    console.warn('[Pagination] currentPage 不能大于 totalPages')
  }
}
```

### 边界情况处理

```typescript
// 边界情况
const boundaryConditions = {
  // 总页数为 0 或 1
  noPages: totalPages === 0,
  singlePage: totalPages === 1,
  
  // 当前页超出范围
  pageOutOfRange: currentPage < 1 || currentPage > totalPages,
  
  // 处理策略
  handleNoPages: () => null,  // 不渲染分页器
  handleSinglePage: () => null,  // 不渲染分页器
  handleOutOfRange: () => {
    // 自动修正到有效范围
    const validPage = Math.max(1, Math.min(currentPage, totalPages))
    onPageChange(validPage)
  },
}
```

## 测试策略

### 单元测试

```typescript
describe('Pagination Component', () => {
  describe('页码生成', () => {
    it('应正确生成少量页码', () => {
      const pages = generatePageNumbers(1, 5, 7)
      expect(pages).toEqual([1, 2, 3, 4, 5])
    })

    it('应正确生成带省略号的页码', () => {
      const pages = generatePageNumbers(5, 10, 7)
      expect(pages).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10])
    })
  })

  describe('用户交互', () => {
    it('应正确处理页码点击', () => {
      const onPageChange = jest.fn()
      render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />)
      
      fireEvent.click(screen.getByText('2'))
      expect(onPageChange).toHaveBeenCalledWith(2)
    })

    it('应禁用第一页的上一页按钮', () => {
      render(<Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />)
      
      const prevButton = screen.getByLabelText('上一页')
      expect(prevButton).toBeDisabled()
    })
  })

  describe('响应式行为', () => {
    it('应在移动端自动切换为简单模式', () => {
      // 模拟移动端视口
      global.innerWidth = 375
      render(<Pagination currentPage={1} totalPages={10} onPageChange={jest.fn()} responsiveMode />)
      
      // 验证只显示上一页/下一页按钮
    })
  })
})
```

### 集成测试

```typescript
describe('Pagination Integration', () => {
  it('应与 CollectionList 正确集成', () => {
    // 测试在 CollectionList 中的使用
  })

  it('应与 CollectionDetailPage 正确集成', () => {
    // 测试在 CollectionDetailPage 中的使用
  })
})
```

## 性能优化

### 优化策略

1. **记忆化计算** - 使用 `useMemo` 缓存页码列表计算结果
2. **事件处理优化** - 使用 `useCallback` 避免不必要的重新渲染
3. **条件渲染** - 根据配置按需渲染组件
4. **虚拟化** - 对于超大页数，考虑虚拟化渲染

```typescript
// 性能优化示例
const Pagination: React.FC<PaginationProps> = (props) => {
  // 记忆化页码列表
  const visiblePages = useMemo(
    () => generatePageNumbers(currentPage, totalPages, maxVisiblePages),
    [currentPage, totalPages, maxVisiblePages]
  )

  // 记忆化点击处理
  const handlePageClick = useCallback(
    (page: number) => {
      if (page !== currentPage && !disabled && !loading) {
        onPageChange(page)
      }
    },
    [currentPage, disabled, loading, onPageChange]
  )

  // 条件渲染
  if (totalPages <= 1) return null

  return (
    // 组件实现
  )
}
```

## 迁移指南

### 从 CollectionList 迁移

```typescript
// 旧代码
<CollectionList
  collections={collections}
  pagination={{
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
    itemsPerPage: ITEMS_PER_PAGE,
  }}
/>

// 新代码
import { Pagination } from '@components/atoms'

<CollectionList
  collections={collections}
  // 移除 pagination prop
/>
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  mode="full"
  variant="default"
  showPageInfo
  pageInfo={{
    total: collections.length,
    pageSize: ITEMS_PER_PAGE,
  }}
/>
```

### 从 CollectionDetailPage 迁移

```typescript
// 旧代码
{totalPages > 1 && (
  <div className="mt-8 flex justify-center">
    <div className="flex items-center gap-2">
      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        上一页
      </button>
      <span>{currentPage} / {totalPages}</span>
      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        下一页
      </button>
    </div>
  </div>
)}

// 新代码
import { Pagination } from '@components/atoms'

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  mode="simple"
  variant="default"
  showPageInfo
  pageInfo={{
    total,
    pageSize: ITEMS_PER_PAGE,
  }}
/>
```

## 扩展性设计

### 自定义渲染

```typescript
// 支持自定义按钮渲染
interface PaginationProps {
  // ... 其他 props
  
  /** 自定义页码按钮渲染 */
  renderPageButton?: (page: number, isActive: boolean) => React.ReactNode
  
  /** 自定义省略号渲染 */
  renderEllipsis?: () => React.ReactNode
  
  /** 自定义分页信息渲染 */
  renderPageInfo?: (info: PaginationMeta) => React.ReactNode
}
```

### 插件系统

```typescript
// 未来可扩展的插件系统
interface PaginationPlugin {
  name: string
  onPageChange?: (page: number) => void
  beforeRender?: (props: PaginationProps) => PaginationProps
  afterRender?: (element: React.ReactElement) => React.ReactElement
}

// 使用示例
<Pagination
  {...props}
  plugins={[
    analyticsPlugin,  // 分页分析插件
    historyPlugin,    // 历史记录插件
  ]}
/>
```

## 文档和示例

### 使用示例

```typescript
// 基础用法
<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => console.log(page)}
/>

// 完整配置
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  mode="compact"
  variant="primary"
  size="md"
  showPageInfo
  pageInfo={{
    total: 100,
    pageSize: 10,
    template: "显示 {start}-{end} 条，共 {total} 条"
  }}
  showQuickJumper
  maxVisiblePages={7}
  responsiveMode
/>

// 服务端分页
<Pagination
  currentPage={serverPage}
  totalPages={serverTotalPages}
  onPageChange={async (page) => {
    await fetchData(page)
  }}
  loading={isLoading}
/>
```

## 总结

本设计文档提供了一个完整、灵活、可扩展的分页组件系统设计方案。通过统一的类型定义、清晰的组件接口、完善的工具函数和详细的实现指南，确保了分页功能在整个项目中的一致性和可维护性。
