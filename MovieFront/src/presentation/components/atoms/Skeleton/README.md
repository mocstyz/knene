# Skeleton 组件库使用指南

基于 Radix UI 的统一骨架屏组件库，用于影视资源网站的加载占位符。

## 组件列表

### 1. SkeletonCard - 卡片骨架屏 ✅

用于电影、视频、写真、合集等卡片的加载占位符。

**使用场景：**
- 电影列表
- 视频网格
- 写真画廊
- 合集展示

**示例：**
```tsx
import { SkeletonCard } from '@components/atoms/Skeleton'

// 基础用法
<SkeletonCard aspectRatio="portrait" />

// 带标题和描述
<SkeletonCard 
  aspectRatio="portrait" 
  showTitle 
  showDescription 
/>

// 不同宽高比
<SkeletonCard aspectRatio="square" />    // 1:1
<SkeletonCard aspectRatio="video" />     // 16:9
<SkeletonCard aspectRatio="landscape" /> // 4:3
```

### 2. SkeletonHero - Hero 区域骨架屏 ✅

用于首页 Hero 轮播区域的加载占位符。

**使用场景：**
- 首页 Hero 轮播
- Banner 区域
- 大图展示区

**示例：**
```tsx
import { SkeletonHero } from '@components/atoms/Skeleton'

// 基础用法
<SkeletonHero />

// 自定义高度
<SkeletonHero height="h-96" />

// 不显示内容区域
<SkeletonHero showContent={false} />
```

### 3. SkeletonDetail - 详情页骨架屏 🚧

用于电影/视频详情页的加载占位符。

**使用场景：**
- 电影详情页
- 剧集详情页
- 写真详情页

**示例：**
```tsx
import { SkeletonDetail } from '@components/atoms/Skeleton'

// 基础用法（横向布局）
<SkeletonDetail />

// 纵向布局
<SkeletonDetail layout="vertical" />

// 完整版（包含演员和推荐）
<SkeletonDetail showCast showRecommendations />

// 简化版（不显示演员和推荐）
<SkeletonDetail showCast={false} showRecommendations={false} />
```

**TODO：**
- [ ] 根据实际详情页布局调整骨架屏结构
- [ ] 添加剧集列表骨架屏
- [ ] 添加评论区骨架屏
- [ ] 添加下载链接区域骨架屏
- [ ] 支持不同类型的详情页（电影、剧集、写真等）

### 4. SkeletonText - 文本骨架屏 ✅

用于标题、段落等文本内容的加载占位符。

**使用场景：**
- 标题
- 段落
- 描述文本
- 任何文本内容

**示例：**
```tsx
import { SkeletonText } from '@components/atoms/Skeleton'

// 标题
<SkeletonText width="w-1/2" height="h-8" />

// 段落（多行）
<SkeletonText lines={3} />

// 自定义宽度（百分比）
<SkeletonText width="60%" height="h-6" />

// 单行文本
<SkeletonText width="w-full" height="h-4" />
```

### 5. SkeletonAvatar - 头像骨架屏 ✅

用于用户头像、演员头像等的加载占位符。

**使用场景：**
- 用户头像
- 演员列表
- 评论区头像
- 任何圆形/方形头像

**示例：**
```tsx
import { SkeletonAvatar } from '@components/atoms/Skeleton'

// 圆形头像
<SkeletonAvatar />

// 方形头像
<SkeletonAvatar shape="square" />

// 带名称
<SkeletonAvatar showName />

// 不同尺寸
<SkeletonAvatar size="sm" />  // 小
<SkeletonAvatar size="md" />  // 中（默认）
<SkeletonAvatar size="lg" />  // 大
<SkeletonAvatar size="xl" />  // 超大
```

## 自动集成

### BaseList 自动使用

所有使用 `BaseList` 的组件都会自动使用 `SkeletonCard`：

```tsx
// CollectionList, HotList, PhotoList, LatestUpdateList 等
// 都会自动显示骨架屏，无需额外配置

<CollectionList 
  collections={data}
  loading={loading}           // ← 自动显示骨架屏
  isPageChanging={isPageChanging}  // ← 页面切换时显示骨架屏
/>
```

## 完整示例

### 首页示例

```tsx
import { 
  SkeletonHero, 
  SkeletonCard 
} from '@components/atoms/Skeleton'

function HomePage() {
  const { data, loading } = useHomeData()

  if (loading) {
    return (
      <div>
        {/* Hero 区域 */}
        <SkeletonHero />
        
        {/* 推荐列表 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} aspectRatio="portrait" />
          ))}
        </div>
      </div>
    )
  }

  return <div>{/* 实际内容 */}</div>
}
```

### 详情页示例

```tsx
import { SkeletonDetail } from '@components/atoms/Skeleton'

function MovieDetailPage() {
  const { movie, loading } = useMovieDetail()

  if (loading) {
    return <SkeletonDetail showCast showRecommendations />
  }

  return <div>{/* 实际内容 */}</div>
}
```

## 设计原则

1. **统一性**：所有骨架屏使用相同的动画和样式
2. **灵活性**：支持多种配置和自定义
3. **易用性**：简单的 API，开箱即用
4. **性能**：基于 Radix UI，性能优秀
5. **可维护性**：集中管理，易于修改

## 最佳实践

### ✅ 推荐做法

```tsx
// 1. 使用语义化的骨架屏组件
<SkeletonCard aspectRatio="portrait" />

// 2. 匹配实际内容的结构
<SkeletonDetail showCast showRecommendations />

// 3. 使用 BaseList 自动处理列表骨架屏
<CollectionList loading={loading} collections={data} />
```

### ❌ 不推荐做法

```tsx
// 1. 不要直接使用 Radix UI Skeleton
<Skeleton className="..." />  // ❌

// 2. 不要自己写骨架屏
<div className="animate-pulse bg-gray-200" />  // ❌

// 3. 不要在每个组件中重复实现
// 使用统一的 Skeleton 组件库 ✅
```

## 未来扩展

### 计划添加的组件

- [ ] `SkeletonComment` - 评论骨架屏
- [ ] `SkeletonTable` - 表格骨架屏
- [ ] `SkeletonForm` - 表单骨架屏
- [ ] `SkeletonChart` - 图表骨架屏

### 计划添加的功能

- [ ] 自定义动画速度
- [ ] 自定义颜色主题
- [ ] 暗色模式优化
- [ ] 更多预设变体

## 技术栈

- **Radix UI Themes** - 基础 Skeleton 组件
- **Tailwind CSS** - 样式和布局
- **TypeScript** - 类型安全

## 维护指南

### 修改骨架屏样式

如果要修改所有骨架屏的样式，只需要修改对应的组件文件：

```tsx
// SkeletonCard.tsx
<Skeleton className={cn(
  aspectRatioClass, 
  'w-full rounded-lg',
  'bg-gray-200 dark:bg-gray-700',  // ← 修改这里
  className
)} />
```

### 添加新的骨架屏组件

1. 在 `Skeleton/` 目录下创建新文件
2. 实现组件
3. 在 `index.ts` 中导出
4. 更新此 README

## 支持

如有问题或建议，请联系开发团队。
