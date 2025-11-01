# Design Document

## Overview

本设计文档描述了影片详情页面UI改进功能的技术实现方案。该功能通过修改MovieHeroSection、MovieResourceInfo、MovieFileInfo和MovieScreenshots组件，优化响应式布局、文本换行、分隔线样式、用户链接和背景图片显示，提升整体视觉一致性和用户体验。

## Architecture

### 组件层次结构

```
MovieDetailPage
├── MovieHeroSection (修改)
│   ├── 背景图片样式优化
│   └── 简介文本换行优化
├── MovieResourceInfo (修改)
│   ├── 分隔线样式统一
│   └── 上传者名称链接化
├── MovieFileInfo (修改)
│   └── 分隔线样式统一
└── MovieScreenshots (修改)
    └── 分隔线样式统一
```

## Components and Interfaces

### 1. MovieHeroSection组件优化

**文件路径:** `MovieFront/src/presentation/components/domains/movie/MovieHeroSection.tsx`

**修改内容:**

#### 背景图片样式优化

**当前问题:**
```tsx
<div
  className="absolute inset-0 bg-cover bg-center"
  style={{ backgroundImage: `url('${movie.imageUrl}')` }}
>
```

**优化方案:**
```tsx
<div
  className="absolute inset-0 bg-cover bg-center"
  style={{ 
    backgroundImage: `url('${movie.imageUrl}')`,
    backgroundSize: 'cover',  // 确保覆盖整个区域
    backgroundPosition: 'center center'  // 居中显示
  }}
>
```

**CSS类名调整:**
- 保持 `bg-cover` 确保图片覆盖整个容器
- 添加内联样式确保跨浏览器兼容性

#### 简介文本换行优化

**当前问题:**
```tsx
<p className="text-gray-200 max-w-2xl">{movie.description}</p>
```

**优化方案:**
```tsx
<p className="text-gray-200 max-w-2xl break-words leading-relaxed">
  {movie.description}
</p>
```

**CSS类名说明:**
- `break-words`: 允许长单词在必要时断行
- `leading-relaxed`: 增加行高提升可读性（1.625）

#### 响应式布局优化

**当前布局:**
```tsx
<div className="container mx-auto flex flex-col md:flex-row items-center gap-10">
```

**优化方案:**
```tsx
<div className="container mx-auto flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
```

**调整说明:**
- `items-center md:items-start`: 移动端居中，桌面端顶部对齐
- `gap-6 md:gap-10`: 响应式间距调整

### 2. MovieResourceInfo组件优化

**文件路径:** `MovieFront/src/presentation/components/domains/movie/MovieResourceInfo.tsx`

**修改内容:**

#### 分隔线样式统一

**当前代码:**
```tsx
<div className="mt-2 h-1 w-16 bg-primary rounded-full"></div>
```

**保持不变** - 已经是标准样式

#### 上传者名称链接化

**当前代码:**
```tsx
<div className="text-right text-sm text-gray-500 dark:text-gray-400">
  <p>Uploaded by: {resource.uploader.name}</p>
  <p>{resource.uploader.uploadTime}</p>
</div>
```

**优化方案:**
```tsx
<div className="text-right text-sm text-gray-500 dark:text-gray-400">
  <p>
    Uploaded by:{' '}
    <a
      href={`/user/${resource.uploader.id || resource.uploader.name}`}
      className="text-primary hover:text-primary-dark hover:underline transition-colors"
    >
      {resource.uploader.name}
    </a>
  </p>
  <p>{resource.uploader.uploadTime}</p>
</div>
```

**样式说明:**
- `text-primary`: 使用主题色区分链接
- `hover:text-primary-dark`: 悬停时颜色加深
- `hover:underline`: 悬停时显示下划线
- `transition-colors`: 平滑颜色过渡

### 3. MovieFileInfo组件优化

**文件路径:** `MovieFront/src/presentation/components/domains/movie/MovieFileInfo.tsx`

**修改内容:**

#### 分隔线样式统一

**当前代码:**
```tsx
<div className="mt-2 h-1 w-16 bg-primary rounded-full"></div>
```

**保持不变** - 已经是标准样式

### 4. MovieScreenshots组件优化

**文件路径:** `MovieFront/src/presentation/components/domains/movie/MovieScreenshots.tsx`

**修改内容:**

#### 分隔线样式统一

**当前代码:**
```tsx
<div className="mt-2 h-1 w-16 bg-primary rounded-full"></div>
```

**保持不变** - 已经是标准样式

### 5. 类型定义更新

**文件路径:** `MovieFront/src/types/movie.types.ts`

**修改内容:**

确保 `ResourceInfo` 类型包含上传者ID：

```typescript
export interface ResourceInfo {
  // ... 其他字段
  uploader: {
    name: string
    id?: string  // 添加可选的用户ID字段
    uploadTime: string
  }
}
```

## Implementation Details

### 标准分隔线组件模式

所有标题区域使用统一的分隔线样式：

```tsx
<div>
  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
    {title}
  </h2>
  <div className="mt-2 h-1 w-16 bg-primary rounded-full"></div>
</div>
```

**样式规范:**
- 标题字体: `text-2xl font-bold`
- 标题颜色: `text-gray-900 dark:text-white`
- 分隔线间距: `mt-2` (8px)
- 分隔线高度: `h-1` (4px)
- 分隔线宽度: `w-16` (64px)
- 分隔线颜色: `bg-primary`
- 分隔线圆角: `rounded-full`

### 背景图片最佳实践

```tsx
<div
  className="absolute inset-0"
  style={{
    backgroundImage: `url('${imageUrl}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat'
  }}
>
  <div className="absolute inset-0 bg-black/40 backdrop-blur-lg"></div>
</div>
```

**关键点:**
- `backgroundSize: 'cover'`: 确保图片覆盖整个容器
- `backgroundPosition: 'center center'`: 居中显示
- `backgroundRepeat: 'no-repeat'`: 不重复
- 叠加层: `bg-black/40 backdrop-blur-lg` 提供对比度和模糊效果

### 文本换行最佳实践

```tsx
<p className="text-gray-200 max-w-2xl break-words leading-relaxed">
  {longText}
</p>
```

**关键类名:**
- `break-words`: 允许长单词断行
- `leading-relaxed`: 行高1.625提升可读性
- `max-w-2xl`: 限制最大宽度保持可读性

### 链接样式最佳实践

```tsx
<a
  href={url}
  className="text-primary hover:text-primary-dark hover:underline transition-colors"
>
  {text}
</a>
```

**关键类名:**
- `text-primary`: 使用主题色
- `hover:text-primary-dark`: 悬停时加深
- `hover:underline`: 悬停时下划线
- `transition-colors`: 平滑过渡

## Error Handling

### 1. 图片加载失败

Hero区域背景图片加载失败时，黑色背景仍然可见，不影响内容可读性。

### 2. 用户ID缺失

如果 `uploader.id` 不存在，使用 `uploader.name` 作为fallback：

```tsx
href={`/user/${resource.uploader.id || resource.uploader.name}`}
```

### 3. 长文本处理

使用 `break-words` 确保即使是超长单词也能正确换行，避免溢出。

## Testing Strategy

### 1. 视觉回归测试

**测试场景:**
- 不同屏幕尺寸下的Hero区域布局
- 长文本和短文本的换行效果
- 分隔线在不同主题下的显示
- 链接的悬停效果

### 2. 响应式测试

**测试断点:**
- 移动端: < 640px
- 平板: 640px - 1024px
- 桌面: > 1024px

**测试内容:**
- Hero区域布局切换
- 文本换行适配
- 间距调整

### 3. 交互测试

**测试用例:**
- 点击上传者名称跳转到用户页面
- 悬停在上传者名称上显示悬停效果
- 背景图片正确加载和显示

### 4. 主题测试

**测试场景:**
- 亮色主题下的所有组件显示
- 暗色主题下的所有组件显示
- 主题切换时的平滑过渡

## Design Decisions

### 1. 为什么使用break-words而不是overflow-hidden？

**决策:** 使用 `break-words` 允许文本换行

**理由:**
- 用户需要阅读完整的简介内容
- 截断文本会丢失信息
- 换行是更好的用户体验

### 2. 为什么统一分隔线样式？

**决策:** 所有标题使用相同的分隔线样式

**理由:**
- 视觉一致性
- 建立清晰的视觉层次
- 提升专业感

### 3. 为什么使用内联样式设置背景图片？

**决策:** 使用内联 `style` 属性而不是纯CSS类

**理由:**
- 动态图片URL需要内联样式
- 确保跨浏览器兼容性
- 更精确的控制

### 4. 为什么上传者名称使用主题色？

**决策:** 链接使用 `text-primary` 而不是默认蓝色

**理由:**
- 与整体设计系统保持一致
- 主题色更符合品牌形象
- 提供更好的视觉和谐

## Migration Plan

### 阶段1: Hero区域优化
1. 修改背景图片样式
2. 优化简介文本换行
3. 调整响应式布局

### 阶段2: 资源信息优化
1. 上传者名称链接化
2. 验证分隔线样式

### 阶段3: 其他组件验证
1. 检查文件信息分隔线
2. 检查截图区域分隔线
3. 确保样式一致性

### 阶段4: 测试验证
1. 视觉回归测试
2. 响应式测试
3. 交互测试
4. 主题测试
