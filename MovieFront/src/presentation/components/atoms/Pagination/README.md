# Pagination 组件使用文档

## 概述

Pagination 是一个通用的分页导航组件，支持多种显示模式、样式变体和响应式布局。组件遵循项目的设计系统规范，提供完整的分页功能。

## 功能特性

- ✅ 三种显示模式：simple（简单）、full（完整）、compact（紧凑）
- ✅ 三种样式变体：default（绿色）、primary（蓝色）、ghost（透明）
- ✅ 三种尺寸：sm（小）、md（中）、lg（大）
- ✅ 智能页码省略（紧凑模式）
- ✅ 分页信息显示
- ✅ 加载和禁用状态
- ✅ 响应式设计
- ✅ 完整的 TypeScript 类型支持

## 基础用法

```tsx
import { Pagination } from '@components/atoms'

function MyComponent() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 10

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  )
}
```

## 显示模式

### Simple 模式

仅显示上一页/下一页按钮和当前页信息，适合移动端或空间受限的场景。

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  mode="simple"
/>
```

### Full 模式（默认）

显示所有页码按钮，适合页数较少的场景。

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  mode="full"
/>
```

### Compact 模式

智能省略页码，最多显示指定数量的页码按钮，适合页数较多的场景。

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  mode="compact"
  maxVisiblePages={7}
/>
```

## 样式变体

### Default 变体（绿色主题）

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  variant="default"
/>
```

### Primary 变体（蓝色主题）

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  variant="primary"
/>
```

### Ghost 变体（透明背景）

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  variant="ghost"
/>
```

## 尺寸配置

```tsx
// 小尺寸（移动端）
<Pagination size="sm" {...props} />

// 中等尺寸（默认）
<Pagination size="md" {...props} />

// 大尺寸
<Pagination size="lg" {...props} />
```

## 分页信息显示

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  showPageInfo
  pageInfo={{
    total: 100,
    pageSize: 10,
  }}
/>
```

### 自定义分页信息模板

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  showPageInfo
  pageInfo={{
    total: 100,
    pageSize: 10,
    template: "显示 {start}-{end} 条，共 {total} 条"
  }}
/>
```

## 加载和禁用状态

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  loading={isLoading}
  disabled={isDisabled}
/>
```

## 服务端分页示例

```tsx
function ServerPaginatedList() {
  const [currentPage, setCurrentPage] = useState(1)
  const { data, loading, total } = useServerData(currentPage)
  
  const totalPages = Math.ceil(total / 12)

  const handlePageChange = async (page: number) => {
    setCurrentPage(page)
    await fetchData(page)
  }

  return (
    <>
      <DataList items={data} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
        showPageInfo
        pageInfo={{
          total,
          pageSize: 12,
        }}
      />
    </>
  )
}
```

## 完整配置示例

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  mode="compact"
  variant="default"
  size="md"
  showPageInfo
  pageInfo={{
    total: 100,
    pageSize: 10,
    template: "第 {current} 页，共 {totalPages} 页"
  }}
  maxVisiblePages={7}
  loading={false}
  disabled={false}
  className="my-4"
  buttonClassName="custom-button"
/>
```

## Props 接口

```typescript
interface PaginationProps {
  // 必需属性
  currentPage: number              // 当前页码
  totalPages: number               // 总页数
  onPageChange: (page: number) => void  // 页码变更回调

  // 可选属性
  mode?: 'simple' | 'full' | 'compact'  // 显示模式，默认 'full'
  variant?: 'default' | 'primary' | 'ghost'  // 样式变体，默认 'default'
  size?: 'sm' | 'md' | 'lg'        // 组件尺寸，默认 'md'
  
  showPageInfo?: boolean           // 是否显示分页信息，默认 false
  pageInfo?: {
    total?: number                 // 总条数
    pageSize?: number              // 每页条数
    template?: string              // 自定义模板
  }
  
  showQuickJumper?: boolean        // 是否显示快速跳转，默认 false
  disabled?: boolean               // 是否禁用，默认 false
  loading?: boolean                // 是否加载中，默认 false
  maxVisiblePages?: number         // 紧凑模式最多显示页码数，默认 7
  
  className?: string               // 自定义容器类名
  buttonClassName?: string         // 自定义按钮类名
  
  prevLabel?: React.ReactNode      // 上一页按钮内容
  nextLabel?: React.ReactNode      // 下一页按钮内容
  firstLabel?: React.ReactNode     // 首页按钮内容
  lastLabel?: React.ReactNode      // 末页按钮内容
  
  responsiveMode?: boolean         // 是否启用响应式模式，默认 true
}
```

## 迁移指南

### 从 CollectionList 迁移

**旧代码：**
```tsx
<CollectionList
  collections={collections}
  pagination={{
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
    itemsPerPage: 12,
  }}
/>
```

**新代码：**
```tsx
<CollectionList collections={collections} />
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  mode="full"
  variant="default"
  showPageInfo
  pageInfo={{
    total: collections.length,
    pageSize: 12,
  }}
/>
```

### 从 CollectionDetailPage 迁移

**旧代码：**
```tsx
{totalPages > 1 && (
  <div className="mt-8 flex justify-center">
    <button onClick={() => handlePageChange(currentPage - 1)}>
      上一页
    </button>
    <span>{currentPage} / {totalPages}</span>
    <button onClick={() => handlePageChange(currentPage + 1)}>
      下一页
    </button>
  </div>
)}
```

**新代码：**
```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  mode="simple"
  variant="default"
  showPageInfo
  pageInfo={{
    total,
    pageSize: 12,
  }}
/>
```

## 工具函数

项目提供了一套完整的分页工具函数，位于 `@utils/pagination`：

```typescript
import {
  calculateTotalPages,
  getPageSlice,
  generatePageNumbers,
  isValidPage,
  getPaginationMeta,
  formatPaginationInfo,
} from '@utils/pagination'

// 计算总页数
const totalPages = calculateTotalPages(100, 10) // 10

// 获取当前页数据切片
const pageData = getPageSlice(allData, 2, 10)

// 生成页码列表（智能省略）
const pages = generatePageNumbers(5, 20, 7)
// 结果: [1, 'ellipsis', 4, 5, 6, 'ellipsis', 20]

// 验证页码有效性
const isValid = isValidPage(5, 10) // true

// 获取分页元信息
const meta = getPaginationMeta(2, 10, 100)
// 结果: { currentPage: 2, pageSize: 10, total: 100, ... }

// 格式化分页信息
const info = formatPaginationInfo(
  "第 {current} 页，共 {totalPages} 页",
  { current: 2, totalPages: 10, ... }
)
```

## 注意事项

1. **页码从 1 开始**：currentPage 和 totalPages 都从 1 开始计数
2. **边界检查**：组件会自动处理页码超出范围的情况
3. **自动隐藏**：当 totalPages <= 1 时，组件不会渲染
4. **响应式**：默认启用响应式模式，在移动端自动调整样式
5. **性能优化**：使用 useMemo 和 useCallback 优化性能

## 最佳实践

1. **服务端分页**：使用 loading 状态提供更好的用户体验
2. **客户端分页**：配合 getPageSlice 工具函数使用
3. **大数据集**：使用 compact 模式避免页码过多
4. **移动端**：考虑使用 simple 模式节省空间
5. **一致性**：在整个应用中使用统一的变体和尺寸

## 常见问题

**Q: 如何实现客户端分页？**
A: 使用 getPageSlice 工具函数对数据进行切片：
```tsx
const pageData = getPageSlice(allData, currentPage, pageSize)
```

**Q: 如何自定义按钮样式？**
A: 使用 buttonClassName 属性：
```tsx
<Pagination buttonClassName="custom-class" {...props} />
```

**Q: 如何处理异步页码切换？**
A: 在 onPageChange 回调中处理异步逻辑，并使用 loading 状态：
```tsx
const handlePageChange = async (page: number) => {
  setLoading(true)
  await fetchData(page)
  setCurrentPage(page)
  setLoading(false)
}
```

## 相关资源

- [设计令牌文档](../../../../tokens/design-system/pagination-variants.ts)
- [工具函数文档](../../../../utils/pagination.ts)
- [类型定义文档](../../../../types/pagination.ts)
