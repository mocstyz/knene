# 合集影片列表页面实现文档

## 概述

本文档描述了合集影片列表页面（Collection Detail Page）的实现，该页面用于展示指定合集包含的所有影片。

## 功能特性

### 1. 页面功能
- ✅ 展示指定合集的影片列表
- ✅ 显示合集标题和描述
- ✅ 支持分页浏览
- ✅ 响应式网格布局
- ✅ 影片卡片点击跳转到影片详情页
- ✅ 加载状态和错误处理
- ✅ 骨架屏加载效果

### 2. 卡片样式
- 标题和分类显示在卡片下方（类似首页最新更新）
- 根据后端数据展示标签：
  - NEW标签（新片标识）
  - VIP标签（会员内容）
  - 质量标签（4K、HD等）
  - 评分标签（带颜色区分）

### 3. 与合集列表的区别
- **合集列表**：主标题+副标题在卡片上
- **影片列表**：标题和分类在卡片下方

## 技术实现

### 1. 文件结构

```
MovieFront/src/
├── presentation/
│   └── pages/
│       └── collection/
│           └── CollectionDetailPage.tsx          # 合集影片列表页面
├── application/
│   ├── hooks/
│   │   ├── useCollectionMovies.ts                # 合集影片数据Hook
│   │   └── index.ts                              # 导出Hook
│   └── services/
│       ├── CollectionMovieApplicationService.ts  # 合集影片应用服务
│       └── index.ts                              # 导出服务
└── infrastructure/
    └── repositories/
        └── CollectionRepository.ts               # 已有，包含getCollectionMovies方法
```

### 2. 路由配置

路由已在 `routes.tsx` 中配置：

```typescript
{
  path: '/collection/:collectionId',
  element: (
    <SuspenseWrapper>
      <CollectionDetailPage />
    </SuspenseWrapper>
  ),
}
```

访问路径：`/collection/{collectionId}`

### 3. 数据流

```
CollectionDetailPage
    ↓
useCollectionMovies (Hook)
    ↓
CollectionMovieApplicationService (应用服务)
    ↓
CollectionRepository (基础设施层)
    ↓
API调用
```

### 4. 核心组件

#### CollectionDetailPage
- 负责页面布局和交互逻辑
- 使用 `BaseSection` + `BaseList` 组合架构
- 使用 `MovieLayer` 渲染影片卡片
- 自定义分页组件

#### useCollectionMovies Hook
- 管理合集影片数据状态
- 支持分页、加载状态、错误处理
- 集成图片优化服务
- 提供刷新和加载更多功能

#### CollectionMovieApplicationService
- 协调领域层和基础设施层
- 获取合集信息和影片列表
- 处理业务逻辑

### 5. 响应式配置

使用 `RESPONSIVE_CONFIGS.latestUpdate` 配置：
- xs: 2列（手机）
- sm: 3列（平板）
- md: 4列（桌面）
- lg: 4列（大屏）
- xl: 5列（超大屏）
- xxl: 6列（超超大屏）

## 使用方式

### 1. 从合集列表跳转

在 `SpecialCollectionsPage.tsx` 中，点击合集卡片会跳转到合集详情页：

```typescript
const handleCollectionClick = (collection: CollectionItem) => {
  navigate(`/collection/${collection.id}`)
}
```

### 2. 直接访问

通过URL直接访问：`http://localhost:3000/collection/{collectionId}`

## API接口

### 获取合集详情
- 端点：`GET /api/collections/{collectionId}`
- 返回：合集基本信息

### 获取合集影片列表
- 端点：`GET /api/collections/{collectionId}/movies`
- 参数：
  - `page`: 页码
  - `limit`: 每页数量
  - `sortBy`: 排序方式（latest/rating/title/top-rated）
- 返回：影片列表和分页信息

## 状态管理

### Hook状态
```typescript
{
  movies: MovieDetail[]           // 影片列表
  collectionInfo: CollectionItem  // 合集信息
  loading: boolean                // 加载状态
  error: string | null            // 错误信息
  total: number                   // 总数量
  hasMore: boolean                // 是否还有更多
  isPageChanging: boolean         // 页面切换状态
}
```

### Hook操作
```typescript
{
  refresh: () => Promise<void>    // 刷新数据
  loadMore: () => Promise<void>   // 加载更多
  updateOptions: (options) => void // 更新查询选项
}
```

## 样式特性

### 1. 卡片布局
- 使用 `MovieLayer` 组件
- 图片区域：2:3宽高比
- 信息区域：标题 + 分类标签

### 2. 标签显示
- NEW标签：左上角，红色背景
- VIP标签：右下角，黄色文字
- 质量标签：右上角，白色文字
- 评分标签：左下角，根据评分显示颜色

### 3. 交互效果
- 卡片悬停：缩放效果
- 标题悬停：红色高亮
- 按钮悬停：背景色变化

## 错误处理

### 1. 加载失败
显示错误信息和重新加载按钮

### 2. 空状态
显示"暂无影片"提示

### 3. 网络错误
自动重试或显示错误提示

## 性能优化

### 1. 图片优化
- 使用图片服务优化URL
- 设置合适的尺寸和质量
- 支持懒加载

### 2. 骨架屏
- 页面切换时显示骨架屏
- 最小显示时间500ms
- 提升用户体验

### 3. 请求取消
- 支持取消过时的请求
- 避免竞态条件

## 后续优化建议

1. **筛选功能**：添加按类型、评分、年份筛选
2. **排序功能**：支持多种排序方式切换
3. **搜索功能**：在合集内搜索影片
4. **收藏功能**：支持收藏影片
5. **分享功能**：分享合集链接
6. **无限滚动**：替代分页，提升体验

## 测试建议

1. **单元测试**：测试Hook和Service逻辑
2. **集成测试**：测试页面交互流程
3. **E2E测试**：测试完整用户流程
4. **性能测试**：测试大数据量加载性能

## 相关文档

- [DDD架构规范](./CLAUDE.md)
- [组件设计规范](./CLAUDE.md#3-ddd组件开发规范)
- [路由配置](./src/presentation/router/routes.tsx)
- [响应式配置](./src/tokens/responsive-configs.ts)
