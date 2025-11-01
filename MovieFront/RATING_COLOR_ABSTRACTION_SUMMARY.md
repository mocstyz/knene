# 评分颜色显示逻辑抽象总结

## 问题描述
详情页面（http://localhost:3000/movie/movie_101）的3个评分数字（Douban、IMDb、TMDb）颜色显示逻辑和首页最新更新模块里的卡片上的评分标签数字颜色显示逻辑需要统一抽象。

## 解决方案

### 1. 统一的评分颜色逻辑位置
所有评分颜色相关的逻辑已经统一抽象到 `src/utils/formatters.ts` 文件中。

### 2. 提供的函数

#### 2.1 `getRatingColorType(rating: number)`
**用途：** 用于Badge Layer（评分徽章）
**返回值：** `'red' | 'purple' | 'white' | 'gray'`
**规则：**
- ≥9.0 → `'red'` (高分 - 红色)
- ≥8.0 → `'purple'` (优秀 - 紫色)
- ≥7.0 → `'white'` (良好 - 白色)
- <7.0 → `'gray'` (一般 - 灰色)

#### 2.2 `getRatingTextColorClass(rating: number)`
**用途：** 用于Title Layer和文本显示（包括详情页面的评分数字）
**返回值：** Tailwind CSS 颜色类名字符串
**规则：**
- ≥9.0 → `'text-red-500 dark:text-red-400'` (高分 - 红色)
- ≥8.0 → `'text-purple-500 dark:text-purple-300'` (优秀 - 紫色)
- ≥7.0 → `'text-gray-900 dark:text-gray-100'` (良好 - 深灰色/浅灰色)
- <7.0 → `'text-gray-600 dark:text-gray-400'` (一般 - 灰色)

### 3. 使用场景

#### 3.1 详情页面（MovieHeroSection.tsx）
**位置：** `src/presentation/components/domains/movie/MovieHeroSection.tsx`
**使用方式：**
```tsx
import { getRatingTextColorClass } from '@utils/formatters'

// Douban评分
<span className={`font-bold ${getRatingTextColorClass(parseFloat(movie.rating))}`}>
  {movie.rating}
</span>

// IMDb评分
{movie.imdbRating && (
  <span className={`font-bold ${getRatingTextColorClass(movie.imdbRating)}`}>
    {movie.imdbRating.toFixed(1)}
  </span>
)}

// TMDb评分
{movie.tmdbRating && (
  <span className={`font-bold ${getRatingTextColorClass(movie.tmdbRating)}`}>
    {movie.tmdbRating.toFixed(1)}
  </span>
)}
```

**说明：** 详情页面显示3个评分（Douban、IMDb、TMDb），所有评分都使用统一的颜色逻辑。评分数据来自Mock API（开发环境）或真实API（生产环境）。

#### 3.2 首页最新更新模块（通过TitleLayer）
**位置：** `src/presentation/components/layers/TitleLayer/TitleLayer.tsx`
**使用方式：**
```tsx
import { getRatingTextColorClass } from '@utils/formatters'

// 在TitleLayer组件中
case 'rating':
  return rating !== undefined
    ? getRatingTextColorClass(rating)
    : 'text-white dark:text-white'
```

**说明：** 首页最新更新模块通过 `MovieLayer` → `TitleLayer` 的组合，使用 `color="rating"` 属性来应用评分颜色。

#### 3.3 评分徽章（RatingBadgeLayer）
**位置：** `src/presentation/components/layers/RatingBadgeLayer/RatingBadgeLayer.tsx`
**使用方式：**
```tsx
import { getRatingColorType } from '@utils/formatters'

// 自动计算评分颜色
const finalTextColor = textColor || 
  (ratingResult.numericValue !== undefined
    ? getRatingColorType(ratingResult.numericValue)
    : 'white')
```

### 4. 修复内容

#### 修复前的问题
- `MovieHeroSection.tsx` 导入了不存在的 `@utils/rating` 模块
- 使用了不存在的 `getRatingTextColor` 函数
- IMDb和TMDb评分是硬编码的数字
- 缺少评分颜色逻辑

#### 修复后
- 统一使用 `@utils/formatters` 中的 `getRatingTextColorClass` 函数
- 确保详情页面和首页使用相同的评分颜色逻辑
- 在 `MovieDetail` 类型中添加 `imdbRating` 和 `tmdbRating` 字段
- 在Mock数据中添加评分数据（imdbRating: 9.2, tmdbRating: 8.5）
- 所有评分都从数据流中获取，不再硬编码

### 5. 优势

1. **DRY原则：** 评分颜色逻辑只在一个地方定义，避免重复代码
2. **易于维护：** 如果需要调整评分颜色规则，只需修改 `formatters.ts` 中的函数
3. **类型安全：** 使用TypeScript类型定义，确保返回值类型正确
4. **一致性：** 整个应用中的评分颜色显示保持一致
5. **可扩展：** 未来其他地方需要评分颜色逻辑时，可以直接复用这些函数

### 6. 使用建议

- **Badge/徽章场景：** 使用 `getRatingColorType()`
- **文本/标题场景：** 使用 `getRatingTextColorClass()`
- **自定义场景：** 可以基于这两个函数的逻辑创建新的变体

### 7. 数据流说明

#### Mock数据配置
在开发环境中（`VITE_ENABLE_MOCK=true`），评分数据来自 `movieDetailApi.ts` 的Mock数据：

```typescript
const mockData: MovieDetail = {
  // ...
  rating: '7.5',        // Douban评分 - 显示深灰色（≥7.0）
  imdbRating: 9.2,      // IMDb评分 - 显示红色（≥9.0）
  tmdbRating: 8.5,      // TMDb评分 - 显示紫色（≥8.0）
  // ...
}
```

#### 数据流路径
1. `movieDetailApi.getMovieDetail()` → 返回 `MovieDetail` 数据
2. `useMovieDetail()` Hook → 管理状态和数据获取
3. `MovieDetailPage` → 接收数据并传递给子组件
4. `MovieHeroSection` → 显示评分并应用颜色逻辑

### 8. 测试验证

可以通过以下方式验证评分颜色逻辑：

1. 访问详情页面：http://localhost:3000/movie/movie_101
2. 检查3个评分数字的颜色：
   - Douban (7.5) → 深灰色
   - IMDb (9.2) → 红色
   - TMDb (8.5) → 紫色
3. 访问首页最新更新模块
4. 检查卡片上的评分标签颜色
5. 确认两处使用相同的颜色规则

## 总结

评分颜色显示逻辑已经完全抽象到 `src/utils/formatters.ts` 文件中，提供了两个专用函数：
- `getRatingColorType()` - 用于徽章
- `getRatingTextColorClass()` - 用于文本

详情页面和首页最新更新模块都使用这些统一的函数，确保了整个应用的评分颜色显示逻辑的一致性和可维护性。
