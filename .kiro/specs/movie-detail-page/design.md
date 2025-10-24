# Design Document

## Overview

本设计文档定义了影片详情页面的技术架构和实现方案。该页面将HTML设计稿迁移到React + DDD架构中，100%还原视觉效果，同时遵循项目的所有开发规范。页面采用自包含组件架构，最大化复用现有组件，使用Tailwind CSS + Radix UI实现样式，支持深色/浅色主题切换和响应式布局。

## Architecture

### 分层架构设计

```
表现层 (Presentation Layer)
├── MovieDetailPage.tsx                    # 页面主组件
├── components/
│   ├── MovieHeroSection.tsx              # Hero区域组件
│   ├── MovieResourceInfo.tsx             # 资源信息组件
│   ├── MovieFileInfo.tsx                 # 文件信息组件
│   ├── MovieScreenshots.tsx              # 截图展示组件
│   ├── MovieComments.tsx                 # 评论系统组件
│   └── SubtitleDownloadModal.tsx         # 字幕下载弹窗组件

应用层 (Application Layer)
├── hooks/
│   ├── useMovieDetail.ts                 # 影片详情数据Hook
│   ├── useMovieComments.ts               # 评论数据Hook
│   └── useSubtitleModal.ts               # 字幕弹窗状态Hook
├── services/
│   └── MovieDetailService.ts             # 影片详情应用服务

领域层 (Domain Layer)
├── entities/
│   ├── MovieDetail.ts                    # 影片详情实体
│   └── Comment.ts                        # 评论实体
└── services/
    └── MovieDomainService.ts             # 影片领域服务

基础设施层 (Infrastructure Layer)
├── api/
│   ├── movieDetailApi.ts                 # 影片详情API
│   └── commentApi.ts                     # 评论API
└── repositories/
    └── MovieDetailRepository.ts          # 影片详情仓储
```

### 组件复用策略

**复用现有组件：**
- `NavigationHeader` - 页面头部导航
- `Button` - 所有按钮（下载、字幕、谢谢你、发表评论等）
- `Badge` - 标签展示（特效字幕、DIY、首发等）
- `Avatar` - 用户头像
- `Icon` - 图标展示
- `Skeleton` - 加载骨架屏
- `ImageLayer` - 图片展示层
- `RatingBadge` - 评分徽章

**新建组件：**
- `MovieHeroSection` - Hero区域（自包含组件）
- `MovieResourceInfo` - 资源信息卡片
- `MovieFileInfo` - 文件信息展示
- `MovieScreenshots` - 截图网格
- `MovieComments` - 评论系统
- `SubtitleDownloadModal` - 字幕下载弹窗

## Components and Interfaces

### 1. MovieDetailPage 主页面组件

**职责：**
- 页面路由参数处理
- 数据获取和状态管理
- 子组件组合和布局
- 错误处理和加载状态

**接口定义：**
```typescript
interface MovieDetailPageProps {
  // 无props，从URL获取参数
}

interface MovieDetailPageState {
  movieId: string
  loading: boolean
  error: string | null
}
```

**关键逻辑：**
- 使用 `useParams` 获取 movieId
- 使用 `useMovieDetail` Hook 获取影片数据
- 使用 `useMovieComments` Hook 获取评论数据
- 处理加载状态、错误状态、空状态
- 组合所有子组件形成完整页面

### 2. MovieHeroSection Hero区域组件

**职责：**
- 展示影片主要信息（海报、标题、评分、简介等）
- 背景模糊效果和渐变遮罩
- 操作按钮（下载、字幕、谢谢你）
- 响应式布局（移动端垂直，桌面端水平）

**接口定义：**
```typescript
interface MovieHeroSectionProps {
  movie: {
    id: string
    title: string
    year: number
    imageUrl: string
    rating: number
    votes: number
    description: string
    cast: string[]
  }
  onDownload: () => void
  onSubtitleClick: () => void
  onThankYou: () => void
  thankYouCount: number
  isThankYouActive: boolean
}
```

**样式特性：**
- 高度：70vh
- 背景：模糊海报 + 黑色半透明遮罩 + 渐变遮罩
- 海报：2:3宽高比，响应式尺寸（移动端40%，平板25%，桌面16%）
- 按钮：主色调（下载）、半透明白色（字幕）、粉色（谢谢你）
- 评分：紫色文字 + 黄色星级图标

### 3. MovieResourceInfo 资源信息组件

**职责：**
- 展示资源标题和标签
- 展示统计数据（浏览量、下载量、点赞、点踩）
- 展示上传者信息和时间
- 收藏和举报功能

**接口定义：**
```typescript
interface MovieResourceInfoProps {
  resource: {
    title: string
    tags: Array<{
      label: string
      color: 'green' | 'blue' | 'yellow' | 'purple' | 'red' | 'indigo'
    }>
    stats: {
      views: number
      downloads: number
      likes: number
      dislikes: number
    }
    uploader: {
      name: string
      uploadTime: string
    }
  }
  isFavorited: boolean
  onFavoriteToggle: () => void
  onReport: () => void
}
```

**样式特性：**
- 背景：半透明白色/深色 + 背景模糊
- 圆角：xl
- 阴影：lg
- 标签：彩色背景 + 圆角全角
- 图标：Material Icons

### 4. MovieFileInfo 文件信息组件

**职责：**
- 展示文件技术规格（格式、大小、时长）
- 展示视频信息（编码、分辨率、帧率）
- 展示音频信息（编码、声道、采样率）
- 展示字幕语言列表

**接口定义：**
```typescript
interface MovieFileInfoProps {
  fileInfo: {
    format: string
    size: string
    duration: string
    video: {
      codec: string
      resolution: string
      fps: string
    }
    audio: {
      codec: string
      channels: string
      sampleRate: string
    }
    subtitles: Array<{
      language: string
      isHighlighted: boolean
    }>
  }
}
```

**样式特性：**
- 响应式网格：1列（移动）、2列（平板）、3列（桌面）
- 字幕标签：中文红色背景，其他灰色背景
- 文字：粗体标签 + 普通值

### 5. MovieScreenshots 截图组件

**职责：**
- 展示影片截图网格
- 图片懒加载
- 响应式布局

**接口定义：**
```typescript
interface MovieScreenshotsProps {
  screenshots: Array<{
    url: string
    alt: string
  }>
  onImageClick?: (index: number) => void
}
```

**样式特性：**
- 响应式网格：1列（移动）、2列（平板）、3列（桌面）
- 间距：gap-4
- 圆角：lg
- 图片：object-cover，w-full h-full

### 6. MovieComments 评论组件

**职责：**
- 评论输入和发表
- 评论列表展示
- 嵌套回复支持
- 点赞/点踩/回复功能

**接口定义：**
```typescript
interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: string
  likes: number
  dislikes: number
  replies?: Comment[]
}

interface MovieCommentsProps {
  comments: Comment[]
  currentUser: {
    avatar: string
  }
  onCommentSubmit: (content: string) => Promise<void>
  onReplySubmit: (commentId: string, content: string) => Promise<void>
  onLike: (commentId: string) => void
  onDislike: (commentId: string) => void
}
```

**样式特性：**
- 输入框：border + rounded-lg + focus ring
- 评论卡片：灰色背景 + 圆角
- 嵌套回复：左侧边框 + 左边距 + 左内边距
- 头像：圆形，尺寸递减（10 -> 8 -> 6）
- 按钮：hover效果 + 主色调

### 7. SubtitleDownloadModal 字幕弹窗组件

**职责：**
- 显示字幕下载源列表
- 点击跳转到外部网站
- 弹窗打开/关闭动画
- 点击外部区域关闭

**接口定义：**
```typescript
interface SubtitleSource {
  name: string
  description: string
  url: string
}

interface SubtitleDownloadModalProps {
  isOpen: boolean
  sources: SubtitleSource[]
  onClose: () => void
}
```

**样式特性：**
- 遮罩：黑色半透明
- 弹窗：白色/深色背景 + 圆角 + 阴影
- 最大宽度：md
- 列表项：hover效果 + 过渡动画

## Data Models

### MovieDetail 实体

```typescript
interface MovieDetail {
  // 基础信息
  id: string
  title: string
  year: number
  imageUrl: string
  rating: number
  votes: number
  description: string
  cast: string[]
  
  // 资源信息
  resource: {
    title: string
    tags: ResourceTag[]
    stats: ResourceStats
    uploader: UploaderInfo
  }
  
  // 文件信息
  fileInfo: FileInfo
  
  // 截图
  screenshots: Screenshot[]
  
  // 统计
  thankYouCount: number
  isFavorited: boolean
  isThankYouActive: boolean
}

interface ResourceTag {
  label: string
  color: 'green' | 'blue' | 'yellow' | 'purple' | 'red' | 'indigo'
}

interface ResourceStats {
  views: number
  downloads: number
  likes: number
  dislikes: number
}

interface UploaderInfo {
  name: string
  uploadTime: string
}

interface FileInfo {
  format: string
  size: string
  duration: string
  video: VideoInfo
  audio: AudioInfo
  subtitles: SubtitleInfo[]
}

interface VideoInfo {
  codec: string
  resolution: string
  fps: string
}

interface AudioInfo {
  codec: string
  channels: string
  sampleRate: string
}

interface SubtitleInfo {
  language: string
  isHighlighted: boolean
}

interface Screenshot {
  url: string
  alt: string
}
```

### Comment 实体

```typescript
interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: string
  likes: number
  dislikes: number
  replies: Comment[]
}
```

## Error Handling

### 错误类型

1. **网络错误**
   - 场景：API请求失败
   - 处理：显示错误提示 + 重试按钮
   - UI：错误页面组件

2. **404错误**
   - 场景：影片ID不存在
   - 处理：跳转到404页面
   - UI：NotFoundPage组件

3. **数据验证错误**
   - 场景：API返回数据格式错误
   - 处理：使用默认值 + 控制台警告
   - UI：降级显示

4. **图片加载错误**
   - 场景：图片URL无效
   - 处理：显示占位图
   - UI：灰色背景 + 图标

### 错误处理策略

```typescript
// 页面级错误处理
try {
  const movieData = await fetchMovieDetail(movieId)
  setMovie(movieData)
} catch (error) {
  if (error.status === 404) {
    navigate('/404')
  } else {
    setError('加载失败，请稍后重试')
  }
}

// 组件级错误处理
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.src = '/placeholder.png'
}

// 表单提交错误处理
const handleCommentSubmit = async (content: string) => {
  try {
    await submitComment(content)
    toast.success('评论发表成功')
  } catch (error) {
    toast.error('评论发表失败，请重试')
  }
}
```

## Testing Strategy

### 单元测试

**测试范围：**
- Hook逻辑测试（useMovieDetail, useMovieComments）
- 工具函数测试（数据转换、格式化）
- 组件渲染测试（快照测试）

**测试工具：**
- Vitest
- React Testing Library
- Mock Service Worker (MSW)

**测试用例示例：**
```typescript
describe('useMovieDetail', () => {
  it('should fetch movie detail successfully', async () => {
    const { result } = renderHook(() => useMovieDetail('movie_1'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.movie).toBeDefined()
    expect(result.current.error).toBeNull()
  })
  
  it('should handle 404 error', async () => {
    const { result } = renderHook(() => useMovieDetail('invalid_id'))
    await waitFor(() => expect(result.current.error).toBe('影片不存在'))
  })
})
```

### 集成测试

**测试范围：**
- 页面完整流程测试
- 用户交互测试（点击、输入、提交）
- 路由跳转测试

**测试用例示例：**
```typescript
describe('MovieDetailPage', () => {
  it('should display movie information', async () => {
    render(<MovieDetailPage />, { route: '/movie/movie_1' })
    await waitFor(() => {
      expect(screen.getByText('Uncut Gems (2019)')).toBeInTheDocument()
      expect(screen.getByText(/评分 7.5/)).toBeInTheDocument()
    })
  })
  
  it('should open subtitle modal on button click', async () => {
    render(<MovieDetailPage />, { route: '/movie/movie_1' })
    const subtitleButton = await screen.findByText('Download Subtitles')
    fireEvent.click(subtitleButton)
    expect(screen.getByText('选择字幕下载源')).toBeInTheDocument()
  })
})
```

### E2E测试

**测试范围：**
- 完整用户流程（从首页 -> 合集详情 -> 影片详情）
- 跨页面交互测试
- 性能测试

**测试工具：**
- Playwright

**测试用例示例：**
```typescript
test('user can navigate to movie detail and download', async ({ page }) => {
  await page.goto('/')
  await page.click('text=合集名称')
  await page.click('text=影片名称')
  await expect(page).toHaveURL(/\/movie\/\w+/)
  await page.click('text=Download')
  // 验证下载行为
})
```

## 响应式设计

### 断点配置

```typescript
const BREAKPOINTS = {
  xs: '0px',      // 移动端
  sm: '640px',    // 大屏手机
  md: '768px',    // 平板
  lg: '1024px',   // 桌面
  xl: '1280px',   // 大屏桌面
  xxl: '1536px'   // 超大屏
}
```

### 响应式布局策略

**Hero区域：**
- xs-sm: 垂直布局，海报40%宽度
- md: 水平布局，海报25%宽度
- lg+: 水平布局，海报16%宽度

**文件信息网格：**
- xs-sm: 1列
- md: 2列
- lg+: 3列

**截图网格：**
- xs-sm: 1列
- md: 2列
- lg+: 3列

**操作按钮：**
- xs-sm: 垂直堆叠或更小尺寸
- md+: 水平排列

## 主题支持

### 颜色变量

```typescript
const THEME_COLORS = {
  light: {
    background: '#f8f9fa',
    cardBackground: 'rgba(255, 255, 255, 0.8)',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
  },
  dark: {
    background: '#121212',
    cardBackground: 'rgba(31, 41, 55, 0.8)',
    text: '#f9fafb',
    textSecondary: '#9ca3af',
    border: '#374151',
  }
}
```

### 主题切换实现

```typescript
// 使用Tailwind的dark:前缀
<div className="bg-background-light dark:bg-background-dark">
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
    <h2 className="text-gray-900 dark:text-white">标题</h2>
    <p className="text-gray-600 dark:text-gray-300">内容</p>
  </div>
</div>
```

## 性能优化

### 图片优化

1. **懒加载**
   - 使用 `loading="lazy"` 属性
   - 使用 Intersection Observer API
   - 优先加载可视区域图片

2. **响应式图片**
   - 使用 `srcset` 提供多尺寸
   - 根据设备像素比选择合适尺寸
   - 使用 WebP 格式（降级到 JPEG）

3. **占位符**
   - 使用模糊占位图（LQIP）
   - 使用骨架屏
   - 渐进式加载

### 代码分割

```typescript
// 路由级代码分割
const MovieDetailPage = lazy(() => import('./pages/movie/MovieDetailPage'))

// 组件级代码分割（可选）
const MovieComments = lazy(() => import('./components/MovieComments'))
```

### 数据缓存

```typescript
// 使用TanStack Query缓存
const { data: movie } = useQuery({
  queryKey: ['movie', movieId],
  queryFn: () => fetchMovieDetail(movieId),
  staleTime: 5 * 60 * 1000, // 5分钟
  cacheTime: 30 * 60 * 1000, // 30分钟
})
```

### 虚拟滚动

```typescript
// 评论列表使用虚拟滚动（如果评论数量很大）
import { useVirtualizer } from '@tanstack/react-virtual'

const virtualizer = useVirtualizer({
  count: comments.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 100,
})
```

## 代码规范遵循

### @别名导入

```typescript
// ✅ 正确
import { Button, Badge } from '@components/atoms'
import { NavigationHeader } from '@components/organisms'
import { useMovieDetail } from '@application/hooks'
import type { MovieDetail } from '@types-movie'

// ❌ 错误
import { Button } from '../../../components/atoms/Button'
import { NavigationHeader } from '../../organisms/Header'
```

### JSDoc注释

```typescript
/**
 * @fileoverview 影片详情页面组件
 * @description 展示影片的完整信息，包括海报、基本信息、评分、剧情简介、
 *              演员阵容、下载链接、文件信息、影片截图和用户评论等内容
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 影片详情页面组件，展示影片完整信息和相关功能
const MovieDetailPage: React.FC = () => {
  // 实现...
}
```

### DDD分层

```
表现层：MovieDetailPage.tsx, MovieHeroSection.tsx 等
应用层：useMovieDetail.ts, MovieDetailService.ts
领域层：MovieDetail.ts, MovieDomainService.ts
基础设施层：movieDetailApi.ts, MovieDetailRepository.ts
```

### 组件复用

- 优先使用现有的 Button, Badge, Avatar, Icon 等原子组件
- 使用 ImageLayer 处理图片展示
- 使用 Skeleton 处理加载状态
- 使用 NavigationHeader 作为页面头部

## 实现优先级

### Phase 1: 核心页面结构（高优先级）
1. MovieDetailPage 主页面组件
2. MovieHeroSection Hero区域组件
3. 基础路由和数据获取

### Phase 2: 信息展示（高优先级）
4. MovieResourceInfo 资源信息组件
5. MovieFileInfo 文件信息组件
6. MovieScreenshots 截图组件

### Phase 3: 交互功能（中优先级）
7. SubtitleDownloadModal 字幕弹窗
8. 下载和感谢功能
9. 收藏和举报功能

### Phase 4: 评论系统（中优先级）
10. MovieComments 评论组件
11. 评论发表和回复
12. 点赞和点踩功能

### Phase 5: 优化和测试（低优先级）
13. 性能优化（懒加载、缓存）
14. 单元测试和集成测试
15. E2E测试
