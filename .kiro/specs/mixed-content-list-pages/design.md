# Design Document

## Overview

本设计文档描述了两个新的混合内容列表页面的技术设计：最新更新列表页面（LatestUpdateListPage）和7天最热门列表页面（HotListPage）。这两个页面将作为首页对应模块的"更多"跳转目标，展示混合类型的内容卡片（写真/影片/合集）。

设计遵循项目的DDD架构原则，复用现有的组件和服务，确保代码的一致性和可维护性。页面布局参考现有的PhotoListPage，使用MixedContentList组件支持混合内容类型的渲染。

## Architecture

### 分层架构设计

```
┌─────────────────────────────────────────────────────────────┐
│  Presentation Layer (表现层)                                 │
│  ├── LatestUpdateListPage.tsx                               │
│  ├── HotListPage.tsx                                        │
│  └── 复用组件:                                               │
│      ├── NavigationHeader (导航栏)                          │
│      ├── MixedContentList (混合内容列表)                    │
│      └── Pagination (分页器)                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Application Layer (应用层)                                  │
│  ├── useLatestUpdateList (最新更新数据Hook)                 │
│  ├── useHotList (热门内容数据Hook)                          │
│  └── 复用Hook:                                               │
│      └── usePhotoList (参考实现)                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Infrastructure Layer (基础设施层)                           │
│  ├── API调用 (复用现有API)                                  │
│  └── 数据转换 (data-converters)                             │
└─────────────────────────────────────────────────────────────┘
```

### 组件复用策略

1. **页面布局复用**: 参考PhotoListPage的布局结构
2. **内容渲染复用**: 使用MixedContentList组件支持混合内容类型
3. **数据转换复用**: 使用现有的data-converters工具函数
4. **导航复用**: 使用navigation-helpers统一处理内容跳转
5. **样式配置复用**: 使用RESPONSIVE_CONFIGS统一响应式配置

## Components and Interfaces

### 1. LatestUpdateListPage 组件

**职责**: 最新更新列表页面，展示所有最新更新的混合内容

**组件结构**:
```typescript
interface LatestUpdateListPageProps {}

const LatestUpdateListPage: React.FC = () => {
  // 状态管理
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()
  
  // 数据获取
  const { 
    items, 
    loading, 
    error, 
    total, 
    refresh, 
    updateOptions,
    isPageChanging 
  } = useLatestUpdateList({
    page: currentPage,
    pageSize: 12,
    sortBy: 'latest',
    autoLoad: true
  })
  
  // 事件处理
  const handlePageChange = (page: number) => { /* ... */ }
  const handleContentClick = (item: BaseContentItem) => { /* ... */ }
  
  // 渲染
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <NavigationHeader />
      <main className="container mx-auto px-4 pb-8 pt-24 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1>最新更新</h1>
          <p>共 {total} 个内容</p>
        </div>
        
        {/* 混合内容列表 */}
        <MixedContentList
          items={items}
          onItemClick={handleContentClick}
          variant="grid"
          columns={RESPONSIVE_CONFIGS.latestUpdate}
          defaultRendererConfig={{
            hoverEffect: true,
            aspectRatio: 'portrait',
            showVipBadge: true,
            showNewBadge: true,
            showQualityBadge: true,
            showRatingBadge: true,
          }}
        />
        
        {/* 分页器 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          loading={loading}
          disabled={isPageChanging}
        />
      </main>
    </div>
  )
}
```

**关键特性**:
- 使用MixedContentList支持混合内容类型（写真/影片/合集）
- 复用PhotoListPage的布局结构和样式
- 使用统一的响应式配置和卡片配置
- 支持分页加载和平滑滚动
- 统一的错误处理和加载状态

### 2. HotListPage 组件

**职责**: 7天最热门列表页面，展示7天内最热门的混合内容

**组件结构**:
```typescript
interface HotListPageProps {}

const HotListPage: React.FC = () => {
  // 状态管理
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()
  
  // 数据获取
  const { 
    items, 
    loading, 
    error, 
    total, 
    refresh, 
    updateOptions,
    isPageChanging 
  } = useHotList({
    page: currentPage,
    pageSize: 12,
    period: '7days',
    autoLoad: true
  })
  
  // 事件处理
  const handlePageChange = (page: number) => { /* ... */ }
  const handleContentClick = (item: BaseContentItem) => { /* ... */ }
  
  // 渲染
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <NavigationHeader />
      <main className="container mx-auto px-4 pb-8 pt-24 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1>7天最热门</h1>
          <p>共 {total} 个内容</p>
        </div>
        
        {/* 混合内容列表 */}
        <MixedContentList
          items={items}
          onItemClick={handleContentClick}
          variant="grid"
          columns={RESPONSIVE_CONFIGS.hot}
          defaultRendererConfig={{
            hoverEffect: true,
            aspectRatio: 'portrait',
            showVipBadge: true,
            showNewBadge: true,
            showQualityBadge: true,
            showRatingBadge: true,
          }}
        />
        
        {/* 分页器 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          loading={loading}
          disabled={isPageChanging}
        />
      </main>
    </div>
  )
}
```

**关键特性**:
- 与LatestUpdateListPage结构相同，仅数据源不同
- 使用MixedContentList支持混合内容类型
- 复用相同的布局和样式配置
- 支持7天热门内容的筛选和展示

### 3. useLatestUpdateList Hook

**职责**: 管理最新更新列表的数据获取和状态

**接口设计**:
```typescript
interface UseLatestUpdateListOptions {
  page?: number
  pageSize?: number
  sortBy?: 'latest' | 'popular'
  autoLoad?: boolean
  enableImageOptimization?: boolean
}

interface UseLatestUpdateListReturn {
  items: BaseContentItem[]
  loading: boolean
  error: string | null
  total: number
  refresh: () => void
  updateOptions: (options: Partial<UseLatestUpdateListOptions>) => void
  isPageChanging: boolean
}

const useLatestUpdateList = (
  options: UseLatestUpdateListOptions
): UseLatestUpdateListReturn => {
  // 实现数据获取逻辑
  // 参考usePhotoList的实现模式
}
```

**实现要点**:
- 参考usePhotoList的实现模式
- 使用TanStack Query进行数据缓存和状态管理
- 支持分页、排序、自动加载等配置
- 提供loading、error、refresh等状态和方法
- 返回BaseContentItem[]格式的统一数据

### 4. useHotList Hook

**职责**: 管理热门内容列表的数据获取和状态

**接口设计**:
```typescript
interface UseHotListOptions {
  page?: number
  pageSize?: number
  period?: '24hours' | '7days' | '30days'
  autoLoad?: boolean
  enableImageOptimization?: boolean
}

interface UseHotListReturn {
  items: BaseContentItem[]
  loading: boolean
  error: string | null
  total: number
  refresh: () => void
  updateOptions: (options: Partial<UseHotListOptions>) => void
  isPageChanging: boolean
}

const useHotList = (
  options: UseHotListOptions
): UseHotListReturn => {
  // 实现数据获取逻辑
  // 参考usePhotoList的实现模式
}
```

**实现要点**:
- 与useLatestUpdateList结构相同
- 支持不同时间周期的热门内容筛选
- 使用相同的数据获取和状态管理模式

## Data Models

### BaseContentItem 统一数据模型

```typescript
interface BaseContentItem {
  id: string
  title: string
  imageUrl: string
  contentType: 'movie' | 'photo' | 'collection'
  rating?: number
  quality?: string
  isVip?: boolean
  isNew?: boolean
  description?: string
  metadata?: Record<string, any>
}
```

**数据转换流程**:
```
原始API数据 (BaseMovieItem/PhotoItem/CollectionItem)
    ↓
toUnifiedContentItem() - 转换为统一格式
    ↓
BaseContentItem - 统一的内容项格式
    ↓
MixedContentList - 使用内容渲染器系统渲染
```

### 分页数据模型

```typescript
interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
```

## Error Handling

### 错误处理策略

1. **数据加载错误**:
   - 显示友好的错误提示信息
   - 提供"重新加载"按钮
   - 记录错误日志用于调试

2. **分页错误**:
   - 验证页码范围
   - 防止重复请求
   - 处理边界情况

3. **内容渲染错误**:
   - MixedContentList内置错误处理
   - 显示降级UI（不支持的内容类型提示）
   - 不影响其他内容项的正常渲染

4. **导航错误**:
   - 使用try-catch包裹导航逻辑
   - 提供fallback路由
   - 记录导航失败日志

### 错误状态UI

```typescript
// 错误状态组件
if (error) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          加载失败
        </h2>
        <p className="text-text-secondary mb-6">{error}</p>
        <button
          onClick={refresh}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          重新加载
        </button>
      </div>
    </div>
  )
}
```

## Testing Strategy

### 单元测试

1. **Hook测试**:
   - useLatestUpdateList数据获取逻辑
   - useHotList数据获取逻辑
   - 分页状态管理
   - 错误处理逻辑

2. **组件测试**:
   - LatestUpdateListPage渲染测试
   - HotListPage渲染测试
   - 分页交互测试
   - 内容点击导航测试

### 集成测试

1. **页面流程测试**:
   - 从首页点击"更多"按钮跳转
   - 列表页面加载和渲染
   - 分页切换和数据加载
   - 点击内容卡片跳转详情

2. **数据流测试**:
   - API数据获取
   - 数据转换和格式化
   - 状态更新和UI响应

### E2E测试

1. **用户场景测试**:
   - 用户浏览最新更新列表
   - 用户浏览热门内容列表
   - 用户切换分页
   - 用户点击内容查看详情

## Routing Configuration

### 路由配置

```typescript
// 在routes.tsx中添加新路由
export const ROUTES = {
  // ... 现有路由
  
  // 最新更新路由
  LATEST_UPDATE: {
    LIST: '/latest-updates',
  },
  
  // 热门内容路由
  HOT: {
    LIST: '/hot-weekly',
  },
}

// 路由配置
const routeConfig: RouteObject[] = [
  // ... 现有路由
  
  // 最新更新列表路由
  {
    path: '/latest-updates',
    element: (
      <SuspenseWrapper>
        <LatestUpdateListPage />
      </SuspenseWrapper>
    ),
  },
  
  // 热门内容列表路由
  {
    path: '/hot-weekly',
    element: (
      <SuspenseWrapper>
        <HotListPage />
      </SuspenseWrapper>
    ),
  },
]
```

### 首页模块链接更新

```typescript
// HomePage.tsx中更新链接
<LatestUpdateSection
  data={processedLatestUpdates}
  showMoreLink={true}
  moreLinkUrl={ROUTES.LATEST_UPDATE.LIST}  // 更新链接
  onItemClick={handleContentClick}
/>

<HotSection
  title="7天最热门"
  movies={processedHotDaily}
  showViewMore={true}
  moreLinkUrl={ROUTES.HOT.LIST}  // 添加链接属性
  onItemClick={handleContentClick}
/>
```

## Implementation Notes

### 代码规范要点

1. **文件头注释**: 使用标准JSDoc格式，包含@fileoverview、@description、@author、@since、@version
2. **函数注释**: 使用单行注释描述用途，不对参数添加注释
3. **导入路径**: 强制使用@别名，禁止相对路径
4. **组件命名**: PascalCase，文件名与组件名一致
5. **Hook命名**: camelCase，以use开头

### 样式一致性

1. **响应式配置**: 使用RESPONSIVE_CONFIGS统一配置
2. **卡片样式**: 与首页模块保持完全一致
3. **布局结构**: 参考PhotoListPage的布局
4. **主题支持**: 支持亮色/暗色主题切换

### 性能优化

1. **懒加载**: 使用React.lazy和Suspense
2. **数据缓存**: 使用TanStack Query缓存
3. **虚拟滚动**: 大数据量时考虑虚拟滚动
4. **图片优化**: 使用图片服务系统优化加载

### 可扩展性

1. **配置驱动**: 通过props控制功能和样式
2. **组件复用**: 最大化复用现有组件
3. **类型安全**: 完整的TypeScript类型定义
4. **渲染器系统**: 支持新增内容类型渲染器
