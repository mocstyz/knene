# 评分颜色使用指南

## 快速开始

评分颜色逻辑已经统一抽象到 `@utils/formatters` 模块中，提供了两个主要函数。

## 函数说明

### 1. getRatingTextColorClass(rating: number)

**用于：** 文本、标题、数字显示

**示例：**
```tsx
import { getRatingTextColorClass } from '@utils/formatters'

// 在组件中使用
<span className={getRatingTextColorClass(8.5)}>
  8.5
</span>

// 结果：text-purple-500 dark:text-purple-300
```

### 2. getRatingColorType(rating: number)

**用于：** 徽章、标签

**示例：**
```tsx
import { getRatingColorType } from '@utils/formatters'

// 在组件中使用
const colorType = getRatingColorType(9.2)
// 结果：'red'

<RatingBadgeLayer 
  rating={9.2}
  textColor={colorType}
/>
```

## 颜色规则

| 评分范围 | 文本颜色 | 徽章颜色 | 含义 |
|---------|---------|---------|------|
| ≥9.0 | `text-red-500 dark:text-red-400` | `red` | 高分 |
| ≥8.0 | `text-purple-500 dark:text-purple-300` | `purple` | 优秀 |
| ≥7.0 | `text-gray-900 dark:text-gray-100` | `white` | 良好 |
| <7.0 | `text-gray-600 dark:text-gray-400` | `gray` | 一般 |

## 实际应用场景

### 场景1：详情页面评分显示

```tsx
// MovieHeroSection.tsx
import { getRatingTextColorClass } from '@utils/formatters'

<span className={`font-bold ${getRatingTextColorClass(parseFloat(movie.rating))}`}>
  {movie.rating}
</span>
```

### 场景2：卡片标题评分颜色

```tsx
// MovieLayer.tsx
<TitleLayer
  title={movie.title}
  color="rating"
  rating={movie.rating}
/>
```

### 场景3：评分徽章

```tsx
// 自动计算颜色
<RatingBadgeLayer 
  rating={8.5}
  // textColor会自动根据评分计算
/>

// 或手动指定颜色
<RatingBadgeLayer 
  rating={8.5}
  textColor="purple"
/>
```

## 注意事项

1. **评分范围：** 函数会自动将评分限制在0-10范围内
2. **类型转换：** 如果评分是字符串，需要先转换为数字：`parseFloat(rating)`
3. **暗色模式：** 颜色类名已包含暗色模式支持（`dark:` 前缀）
4. **一致性：** 整个应用应该使用这些统一的函数，避免自定义评分颜色逻辑

## 扩展使用

如果需要自定义评分颜色规则，建议在 `formatters.ts` 中添加新函数：

```tsx
// 示例：获取评分等级文本
export function getRatingLevel(rating: number): string {
  const value = Math.max(0, Math.min(10, rating))
  
  if (value >= 9.0) return '神作'
  if (value >= 8.0) return '优秀'
  if (value >= 7.0) return '良好'
  return '一般'
}
```

## 相关文件

- 函数定义：`src/utils/formatters.ts`
- 详情页面：`src/presentation/components/domains/movie/MovieHeroSection.tsx`
- 标题层：`src/presentation/components/layers/TitleLayer/TitleLayer.tsx`
- 评分徽章：`src/presentation/components/layers/RatingBadgeLayer/RatingBadgeLayer.tsx`
