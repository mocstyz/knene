# 加载状态使用指南

本文档定义了 MovieFront 项目中加载状态的使用规范，包括何时使用骨架屏、何时使用 Spinner，以及如何正确使用 LoadingSpinner 组件。

## 📊 使用场景决策树

```
需要显示加载状态？
├─ 是页面初始加载？ → 使用骨架屏
├─ 是大内容区域加载（预计 > 1秒）？ → 使用骨架屏
├─ 是按钮提交/操作？ → 使用 Button loading 属性
├─ 是路由切换？ → 使用 RouteLoader（自动）
├─ 是权限验证？ → 使用 LoadingSpinner fullscreen
├─ 是小区域加载？ → 使用 LoadingSpinner
└─ 是模态框加载？ → 使用 LoadingSpinner overlay
```

## 🎯 骨架屏 vs Spinner

### 何时使用骨架屏？

**✅ 适用场景：**
- 页面初始加载
- 大内容区域加载（预计加载时间 > 1 秒）
- 列表/网格内容加载
- 详情页内容加载
- 分页切换

**优点：**
- 提供更好的内容预期
- 减少感知等待时间
- 更好的用户体验

**示例：**
```typescript
// 首页加载
if (loading && movies.length === 0) {
  return <SkeletonHomePage showHero={true} sectionCount={4} />
}

// 列表页加载
if (loading && items.length === 0) {
  return (
    <SkeletonListPage
      cardCount={12}
      columns={RESPONSIVE_CONFIGS.latestUpdate}
      aspectRatio="portrait"
    />
  )
}

// 详情页加载
if (loading || !movie) {
  return (
    <>
      <SkeletonHero />
      <SkeletonMovieDetail showFileInfo showScreenshots showComments />
    </>
  )
}
```

### 何时使用 Spinner？

**✅ 适用场景：**
- 按钮提交/操作
- 小区域加载
- 路由切换
- 权限验证
- 表单验证
- 模态框加载
- 短时间等待（< 1 秒）

**优点：**
- 轻量级
- 适合短时间等待
- 适合小区域显示

## 📦 LoadingSpinner 组件

### API 文档

```typescript
interface LoadingSpinnerProps {
  /**
   * 旋转器尺寸
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  
  /**
   * 自定义CSS类名
   */
  className?: string
  
  /**
   * 显示文本
   */
  text?: string
  
  /**
   * 自定义颜色
   * @default 'currentColor'
   */
  color?: string
  
  /**
   * 全屏模式 - 居中显示在全屏容器中
   * @default false
   */
  fullscreen?: boolean
  
  /**
   * 遮罩模式 - 显示半透明遮罩层
   * @default false
   */
  overlay?: boolean
  
  /**
   * 动画速度（秒）
   * @default 1
   */
  speed?: number
  
  /**
   * 是否禁用动画
   * @default false
   */
  disableAnimation?: boolean
}
```

### 尺寸说明

| 尺寸 | 大小 | 边框 | 使用场景 |
|------|------|------|----------|
| xs | 12x12px | 1px | 超小按钮、图标旁 |
| sm | 16x16px | 1px | 小按钮、内联文本 |
| md | 32x32px | 2px | 默认尺寸、卡片内 |
| lg | 48x48px | 2px | 全屏加载、页面级 |
| xl | 64x64px | 3px | 特大场景 |

### 使用示例

#### 1. 基础用法

```typescript
import { LoadingSpinner } from '@components/atoms'

// 默认 spinner
<LoadingSpinner />

// 指定尺寸
<LoadingSpinner size="lg" />

// 带文本
<LoadingSpinner text="加载中..." />
```

#### 2. 全屏模式

```typescript
// 路由加载
if (isLoading) {
  return (
    <LoadingSpinner 
      size="lg" 
      fullscreen 
      text="页面加载中..." 
    />
  )
}

// 权限验证
if (isLoading) {
  return (
    <LoadingSpinner 
      size="lg" 
      fullscreen 
      text="正在验证身份..." 
    />
  )
}
```

#### 3. 遮罩模式

```typescript
// 模态框加载
<div className="relative">
  {/* 模态框内容 */}
  {isLoading && (
    <LoadingSpinner 
      overlay 
      text="处理中..." 
    />
  )}
</div>
```

#### 4. 按钮加载

```typescript
import { Button } from '@components/atoms'

// Button 组件自动使用 LoadingSpinner
<Button loading={isSubmitting}>
  提交
</Button>

// loading 时显示 "提交中..."
<Button loading={isSubmitting}>
  {isSubmitting ? '提交中...' : '提交'}
</Button>
```

#### 5. 自定义颜色

```typescript
// 使用自定义颜色
<LoadingSpinner color="#ff0000" />

// 继承父元素颜色
<div className="text-blue-600">
  <LoadingSpinner color="currentColor" />
</div>
```

#### 6. 内联显示

```typescript
// 在文本旁显示
<div className="flex items-center gap-2">
  <LoadingSpinner size="sm" />
  <span>加载中...</span>
</div>

// 在卡片中显示
<div className="card">
  <LoadingSpinner size="md" text="加载数据..." />
</div>
```

## 🚀 RouteLoader 组件

### API 文档

```typescript
interface RouteLoaderProps {
  /**
   * 延迟显示时间（毫秒）
   * @default 200
   */
  delay?: number
  
  /**
   * 显示文本
   * @default '页面加载中...'
   */
  text?: string
}
```

### 使用说明

RouteLoader 用于路由懒加载的 Suspense fallback，会延迟 200ms 显示以避免快速加载时的闪烁。

```typescript
import { RouteLoader } from '@components/atoms'
import { Suspense } from 'react'

// 在 routes.tsx 中使用
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Suspense fallback={<RouteLoader />}>{children}</Suspense>

// 自定义延迟和文本
<Suspense fallback={<RouteLoader delay={300} text="加载页面..." />}>
  {children}
</Suspense>
```

## 📋 最佳实践

### 1. 优先使用骨架屏

对于页面级加载，优先使用骨架屏而不是 spinner：

```typescript
// ✅ 好 - 使用骨架屏
if (loading) {
  return <SkeletonListPage cardCount={12} />
}

// ❌ 差 - 页面级使用 spinner
if (loading) {
  return <LoadingSpinner fullscreen />
}
```

### 2. 按钮使用 loading 属性

按钮加载状态使用 Button 的 loading 属性，而不是手动添加 spinner：

```typescript
// ✅ 好 - 使用 loading 属性
<Button loading={isSubmitting}>提交</Button>

// ❌ 差 - 手动添加 spinner
<Button disabled={isSubmitting}>
  {isSubmitting && <LoadingSpinner size="xs" />}
  提交
</Button>
```

### 3. 延迟显示避免闪烁

对于可能快速完成的加载，使用延迟显示：

```typescript
// ✅ 好 - 使用 RouteLoader（自动延迟）
<Suspense fallback={<RouteLoader />}>
  {children}
</Suspense>

// ✅ 好 - 手动实现延迟
const [showSpinner, setShowSpinner] = useState(false)

useEffect(() => {
  const timer = setTimeout(() => setShowSpinner(true), 200)
  return () => clearTimeout(timer)
}, [])

if (loading && showSpinner) {
  return <LoadingSpinner />
}
```

### 4. 合适的尺寸

根据使用场景选择合适的尺寸：

```typescript
// ✅ 好 - 根据场景选择尺寸
<Button loading={isLoading}>提交</Button> // 自动选择 xs/sm
<LoadingSpinner size="md" /> // 卡片内
<LoadingSpinner size="lg" fullscreen /> // 全屏

// ❌ 差 - 尺寸不合适
<Button><LoadingSpinner size="lg" /></Button> // 太大
<LoadingSpinner size="xs" fullscreen /> // 太小
```

### 5. 提供有意义的文本

为 spinner 提供有意义的加载文本：

```typescript
// ✅ 好 - 有意义的文本
<LoadingSpinner text="正在验证身份..." />
<LoadingSpinner text="加载用户设置..." />
<LoadingSpinner text="处理支付..." />

// ❌ 差 - 通用文本
<LoadingSpinner text="加载中..." />
<LoadingSpinner text="请稍候..." />
```

### 6. 可访问性

确保 spinner 对屏幕阅读器友好：

```typescript
// ✅ 好 - LoadingSpinner 自动包含 ARIA 属性
<LoadingSpinner text="加载中..." />
// 渲染为：
// <div role="status" aria-busy="true" aria-label="加载中...">
//   <span className="sr-only">加载中...</span>
// </div>

// ❌ 差 - 缺少可访问性属性
<div className="animate-spin" />
```

## 🎨 主题支持

LoadingSpinner 自动适配明暗主题：

```typescript
// 明亮主题
// 边框颜色：#d1d5db (gray-300)
// 高亮颜色：#2563eb (blue-600)

// 暗黑主题
// 边框颜色：#4b5563 (gray-600)
// 高亮颜色：#60a5fa (blue-400)

// 自定义颜色会覆盖主题颜色
<LoadingSpinner color="#ff0000" />
```

## ⚡ 性能优化

### 1. 减少动画偏好

LoadingSpinner 自动检测用户的减少动画偏好：

```typescript
// 用户启用了 prefers-reduced-motion
// LoadingSpinner 会自动禁用动画
<LoadingSpinner /> // 不会旋转
```

### 2. 条件渲染

只在需要时渲染 spinner：

```typescript
// ✅ 好 - 条件渲染
{loading && <LoadingSpinner />}

// ❌ 差 - 始终渲染
<LoadingSpinner className={loading ? 'block' : 'hidden'} />
```

### 3. 避免过多 spinner

避免在同一页面显示过多 spinner：

```typescript
// ✅ 好 - 使用单个 spinner
if (loading) {
  return <LoadingSpinner fullscreen />
}

// ❌ 差 - 多个 spinner
<div>
  {items.map(item => (
    <div key={item.id}>
      {item.loading && <LoadingSpinner />}
    </div>
  ))}
</div>
```

## 🔧 故障排除

### Spinner 不显示

1. 检查是否正确导入：
```typescript
import { LoadingSpinner } from '@components/atoms'
```

2. 检查条件是否正确：
```typescript
{loading && <LoadingSpinner />}
```

### Spinner 不旋转

1. 检查是否禁用了动画：
```typescript
<LoadingSpinner disableAnimation={false} />
```

2. 检查 CSS 是否正确加载：
```typescript
// 确保 Tailwind CSS 已正确配置
```

### Button loading 不工作

1. 确保使用了 loading 属性：
```typescript
<Button loading={isLoading}>提交</Button>
```

2. 检查 Button 组件版本是否最新

## 📚 相关文档

- [骨架屏系统文档](./SKELETON_SYSTEM.md)
- [Button 组件文档](../src/presentation/components/atoms/Button/README.md)
- [设计系统文档](./DESIGN_SYSTEM.md)

## 🆘 常见问题

### Q: 何时使用骨架屏，何时使用 Spinner？

A: 简单规则：
- 页面级加载 → 骨架屏
- 按钮/小区域加载 → Spinner
- 预计加载时间 > 1 秒 → 骨架屏
- 预计加载时间 < 1 秒 → Spinner

### Q: 如何自定义 Spinner 颜色？

A: 使用 color 属性：
```typescript
<LoadingSpinner color="#ff0000" />
<LoadingSpinner color="currentColor" />
```

### Q: 如何在 Button 中使用 Spinner？

A: 直接使用 Button 的 loading 属性：
```typescript
<Button loading={isLoading}>提交</Button>
```

### Q: 如何避免快速加载时的闪烁？

A: 使用 RouteLoader（自动延迟 200ms）或手动实现延迟显示。

### Q: Spinner 支持哪些尺寸？

A: 支持 5 种尺寸：xs (12px), sm (16px), md (32px), lg (48px), xl (64px)

---

**最后更新：** 2024-01-20  
**维护者：** mosctz
