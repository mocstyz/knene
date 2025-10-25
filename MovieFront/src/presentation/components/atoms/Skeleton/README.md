# Skeleton 骨架屏组件系统

## 概述

Skeleton 骨架屏组件系统提供了一套完整的、具有统一动画效果的骨架屏组件,用于在数据加载期间为用户提供清晰的视觉反馈。所有组件都使用从左到右的光泽扫过动画(shimmer effect),并完美支持明暗两种主题模式。

## 核心特性

- ✨ **统一动画效果**: 所有组件使用相同的 shimmer 动画
- 🎨 **主题适配**: 完美支持明暗主题切换
- ♿ **可访问性**: 包含 ARIA 属性,对屏幕阅读器友好
- ⚡ **性能优化**: 使用 CSS transform 和硬件加速
- 📱 **响应式设计**: 支持各种屏幕尺寸
- 🎯 **灵活组合**: 原子组件可自由组合构建复杂布局

## 组件层次结构

```
骨架屏系统
├── 核心层
│   └── SkeletonBase - 基础骨架屏组件
│
├── 原子层
│   ├── SkeletonBox - 矩形骨架屏
│   ├── SkeletonCircle - 圆形骨架屏
│   ├── SkeletonText - 文本骨架屏
│   ├── SkeletonCard - 卡片骨架屏
│   └── SkeletonAvatar - 头像骨架屏
│
├── 分子层
│   ├── SkeletonPageHeader - 页面标题骨架屏
│   ├── SkeletonSectionHeader - Section 标题骨架屏
│   ├── SkeletonCardGrid - 卡片网格骨架屏
│   └── SkeletonPagination - 分页器骨架屏
│
└── 页面层
    ├── SkeletonHomePage - 首页骨架屏
    ├── SkeletonListPage - 列表页骨架屏
    ├── SkeletonHero - Hero 区域骨架屏
    └── SkeletonDetail - 详情页骨架屏
```

## 快速开始

### 基础用法

```tsx
import { SkeletonCard, SkeletonText } from '@components/atoms'

// 简单的卡片骨架屏
<SkeletonCard aspectRatio="portrait" />

// 文本骨架屏
<SkeletonText width={200} height={20} />

// 多行文本
<SkeletonText lines={3} width="100%" height={16} />
```

### 页面级骨架屏

```tsx
import { SkeletonListPage, SkeletonHomePage } from '@components/atoms'

// 列表页骨架屏
<SkeletonListPage
  cardCount={12}
  columns={{ xs: 2, sm: 3, md: 4, lg: 5 }}
  aspectRatio="portrait"
/>

// 首页骨架屏
<SkeletonHomePage
  showHero={true}
  sectionCount={4}
  cardsPerSection={5}
/>
```

## 核心组件

### SkeletonBase

基础骨架屏组件,提供统一的 shimmer 动画效果。

```tsx
interface SkeletonBaseProps {
  className?: string
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  disableAnimation?: boolean
  children?: React.ReactNode
  style?: React.CSSProperties
}

// 示例
<SkeletonBase width={200} height={20} borderRadius={4} />
```

### SkeletonBox

基础矩形骨架屏,最灵活的原子组件。

```tsx
<SkeletonBox width="100%" height={100} borderRadius={8} />
```

### SkeletonCircle

圆形骨架屏,用于头像、图标等。

```tsx
<SkeletonCircle size={40} />
<SkeletonCircle size={64} />
```

### SkeletonText

文本骨架屏,支持单行和多行。

```tsx
// 单行文本
<SkeletonText width={200} height={20} />

// 多行文本
<SkeletonText lines={3} width="100%" height={16} />

// 每行不同宽度
<SkeletonText
  lines={3}
  width={['100%', '90%', '75%']}
  height={16}
/>
```

### SkeletonCard

卡片骨架屏,用于列表、网格等场景。

```tsx
<SkeletonCard
  aspectRatio="portrait"
  showTitle={true}
  showDescription={true}
/>
```

**Props:**
- `aspectRatio`: 'square' | 'video' | 'portrait' | 'landscape'
- `showTitle`: 是否显示标题骨架屏
- `showDescription`: 是否显示描述骨架屏

## 分子层组件

### SkeletonPageHeader

页面标题区域骨架屏。

```tsx
<SkeletonPageHeader
  showDescription={true}
  showStats={true}
/>
```

### SkeletonSectionHeader

Section 标题骨架屏。

```tsx
<SkeletonSectionHeader showMoreLink={true} />
```

### SkeletonCardGrid

卡片网格骨架屏,支持响应式布局。

```tsx
<SkeletonCardGrid
  count={12}
  columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
  aspectRatio="portrait"
  showTitle={false}
  showDescription={false}
/>
```

### SkeletonPagination

分页器骨架屏。

```tsx
// 完整模式
<SkeletonPagination mode="full" />

// 简单模式
<SkeletonPagination mode="simple" />
```

## 页面层组件

### SkeletonListPage

列表页完整骨架屏。

```tsx
<SkeletonListPage
  showPageHeader={true}
  cardCount={12}
  columns={{ xs: 2, sm: 3, md: 4, lg: 5 }}
  showPagination={true}
  aspectRatio="portrait"
/>
```

### SkeletonHomePage

首页完整骨架屏。

```tsx
<SkeletonHomePage
  showHero={true}
  sectionCount={4}
  cardsPerSection={5}
/>
```

### SkeletonHero

Hero 区域骨架屏。

```tsx
<SkeletonHero
  height="h-[500px]"
  showContent={true}
/>
```

### SkeletonDetail

详情页骨架屏。

```tsx
<SkeletonDetail
  layout="horizontal"
  showCast={true}
  showRecommendations={true}
/>
```

## 在页面中使用

### 列表页示例

```tsx
import { SkeletonListPage } from '@components/atoms'
import { RESPONSIVE_CONFIGS } from '@tokens/responsive-configs'

const MyListPage: React.FC = () => {
  const { items, loading } = useMyData()

  // 初次加载显示骨架屏
  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen">
        <NavigationHeader />
        <SkeletonListPage
          cardCount={12}
          columns={RESPONSIVE_CONFIGS.myPage}
          aspectRatio="portrait"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <NavigationHeader />
      <main>
        {/* 实际内容 */}
      </main>
    </div>
  )
}
```

### 首页示例

```tsx
import { SkeletonHomePage } from '@components/atoms'

const HomePage: React.FC = () => {
  const { data, isLoading } = useHomeData()

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <NavigationHeader />
        <main className="pt-16">
          <SkeletonHomePage
            showHero={true}
            sectionCount={4}
            cardsPerSection={5}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <NavigationHeader />
      <main className="pt-16">
        <HeroSection />
        {/* 其他内容 */}
      </main>
    </div>
  )
}
```

### BaseList 组件

BaseList 组件已经内置了骨架屏支持,会自动显示:

```tsx
<BaseList
  items={items}
  loading={loading}
  isPageChanging={isPageChanging}
  columns={RESPONSIVE_CONFIGS.myPage}
  renderItem={(item) => <MyCard item={item} />}
/>
```

## 主题配置

骨架屏使用 CSS 变量管理颜色,可以在全局样式中自定义:

```css
/* 明亮主题 */
:root {
  --skeleton-bg: #e5e7eb;
  --skeleton-shimmer: rgba(255, 255, 255, 0.8);
}

/* 暗黑主题 */
.dark {
  --skeleton-bg: #374151;
  --skeleton-shimmer: rgba(75, 85, 99, 0.8);
}
```

## 性能优化

### 禁用动画

```tsx
// 全局禁用
<SkeletonCard disableAnimation={true} />

// 自动检测用户偏好
// 组件会自动检测 prefers-reduced-motion 设置
```

### 懒加载

对于大量骨架屏,可以使用懒加载:

```tsx
const [visibleCount, setVisibleCount] = useState(6)

useEffect(() => {
  const timer = setTimeout(() => {
    setVisibleCount(12)
  }, 100)
  return () => clearTimeout(timer)
}, [])

<SkeletonCardGrid count={visibleCount} />
```

## 可访问性

所有骨架屏组件都包含适当的 ARIA 属性:

```tsx
<div
  role="status"
  aria-busy="true"
  aria-label="Loading"
>
  <span className="sr-only">Loading...</span>
  {/* 骨架屏内容 */}
</div>
```

## 最佳实践

1. **使用页面级组件**: 优先使用 SkeletonListPage、SkeletonHomePage 等页面级组件
2. **保持一致性**: 骨架屏布局应该与实际内容布局一致
3. **合理的数量**: 不要显示过多的骨架屏项目,12-15 个通常足够
4. **响应式配置**: 使用与实际内容相同的响应式列数配置
5. **初次加载 vs 分页**: 初次加载显示完整骨架屏,分页切换只显示内容区骨架屏

## 常见问题

### Q: 如何自定义骨架屏颜色?

A: 通过 CSS 变量自定义:

```css
:root {
  --skeleton-bg: #your-color;
  --skeleton-shimmer: rgba(your-color, 0.8);
}
```

### Q: 如何禁用动画?

A: 使用 `disableAnimation` prop:

```tsx
<SkeletonCard disableAnimation={true} />
```

### Q: 骨架屏会自动适配暗色模式吗?

A: 是的,骨架屏会自动根据 `.dark` 类切换颜色。

### Q: 如何在 BaseList 中使用骨架屏?

A: BaseList 已经内置了骨架屏支持,只需传递 `loading` 和 `isPageChanging` props。

## 浏览器兼容性

- Chrome/Edge: 最新版本
- Firefox: 最新版本
- Safari: 最新版本
- Mobile Safari: iOS 12+
- Chrome Mobile: 最新版本

所有现代浏览器都完全支持,无需 polyfills。

## 详情页专用组件

### SkeletonComments

评论区域骨架屏,模拟评论输入框和评论列表。

```tsx
<SkeletonComments
  commentCount={3}
  showReplies={true}
/>
```

**Props:**
- `commentCount`: 评论数量 (默认 3)
- `showReplies`: 是否显示回复 (默认 true)
- `disableAnimation`: 禁用动画

### SkeletonMovieDetail

影片详情页完整骨架屏,包括资源信息、文件信息、截图和评论。

```tsx
<SkeletonMovieDetail
  showFileInfo={true}
  showScreenshots={true}
  showComments={true}
/>
```

**Props:**
- `showFileInfo`: 是否显示文件信息 (默认 true)
- `showScreenshots`: 是否显示截图 (默认 true)
- `showComments`: 是否显示评论 (默认 true)
- `disableAnimation`: 禁用动画

### SkeletonPhotoDetail

写真详情页完整骨架屏,包括资源信息、写真图片和评论。

```tsx
<SkeletonPhotoDetail
  showPhotos={true}
  showComments={true}
  photoCount={12}
/>
```

**Props:**
- `showPhotos`: 是否显示写真图片 (默认 true)
- `showComments`: 是否显示评论 (默认 true)
- `photoCount`: 写真图片数量 (默认 12)
- `disableAnimation`: 禁用动画

### 详情页使用示例

```tsx
// 影片详情页
const MovieDetailPage: React.FC = () => {
  const { movie, loading } = useMovieDetail(movieId)

  if (loading || !movie) {
    return (
      <div className="min-h-screen">
        <NavigationHeader />
        <SkeletonHero />
        <div className="container mx-auto p-8 relative z-10 -mt-24">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6">
            <SkeletonMovieDetail
              showFileInfo={true}
              showScreenshots={true}
              showComments={true}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    // 实际内容
  )
}

// 写真详情页
const PhotoDetailPage: React.FC = () => {
  const { photo, loading } = usePhotoDetail(photoId)

  if (loading || !photo) {
    return (
      <div className="min-h-screen">
        <NavigationHeader />
        <SkeletonHero />
        <div className="container mx-auto p-8 relative z-10 -mt-24">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6">
            <SkeletonPhotoDetail
              showPhotos={true}
              showComments={true}
              photoCount={12}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    // 实际内容
  )
}
```

## 更新日志

### v1.1.0 (2025-01-XX)

- ✨ 新增 SkeletonComments 评论骨架屏组件
- ✨ 新增 SkeletonMovieDetail 影片详情页骨架屏
- ✨ 新增 SkeletonPhotoDetail 写真详情页骨架屏
- 🔧 优化详情页骨架屏结构,更贴近实际页面布局
- 🔧 所有数据加载延迟统一设置为 5000ms 以便查看效果

### v1.0.0 (2025-01-XX)

- ✨ 初始版本发布
- ✨ 完整的骨架屏组件系统
- ✨ Shimmer 动画效果
- ✨ 明暗主题支持
- ✨ 响应式设计
- ✨ 可访问性支持
