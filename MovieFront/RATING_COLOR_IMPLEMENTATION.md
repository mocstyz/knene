# 评分颜色显示逻辑实现文档

## 实现日期
2025-10-23

## 实现方案
采用**方案A：纯工具函数方案**

---

## 一、颜色规则

### 评分颜色映射表

| 评分范围 | 颜色 | 说明 | Tailwind类名 |
|---------|------|------|-------------|
| ≥ 9.0 | 🔴 红色 | 高分 | `text-red-500 dark:text-red-400` |
| 8.0 - 8.9 | 🟣 紫色 | 优秀 | `text-purple-400 dark:text-purple-300` |
| 7.0 - 7.9 | ⚪ 白色 | 良好 | `text-white dark:text-gray-100` |
| < 7.0 | ⚫ 灰色 | 一般 | `text-gray-400 dark:text-gray-500` |

### 应用场景
- ✅ 评分标签文本（RatingBadgeLayer）
- ✅ 标题文本（TitleLayer，当 color='rating' 时）
- ✅ 所有使用评分显示的影视卡片

---

## 二、实现细节

### 1. 新增工具函数 - `formatters.ts`

#### 函数1：`getRatingColorType()`
**用途**：为 RatingBadgeLayer 组件提供颜色类型

```typescript
export function getRatingColorType(
  rating: number
): 'red' | 'purple' | 'white' | 'gray' {
  const value = Math.max(0, Math.min(10, rating))
  
  if (value >= 9.0) return 'red'      // 高分
  if (value >= 8.0) return 'purple'   // 优秀
  if (value >= 7.0) return 'white'    // 良好
  return 'gray'                        // 一般
}
```

#### 函数2：`getRatingTextColorClass()`
**用途**：为 TitleLayer 组件提供 Tailwind CSS 类名

```typescript
export function getRatingTextColorClass(rating: number): string {
  const value = Math.max(0, Math.min(10, rating))
  
  if (value >= 9.0) return 'text-red-500 dark:text-red-400'
  if (value >= 8.0) return 'text-purple-400 dark:text-purple-300'
  if (value >= 7.0) return 'text-white dark:text-gray-100'
  return 'text-gray-400 dark:text-gray-500'
}
```

**特性**：
- ✅ 自动限制评分范围在 0-10
- ✅ 支持深色模式
- ✅ 返回类型安全

---

### 2. 修改 Token 配置 - `badge-layer-variants.ts`

**新增颜色**：
```typescript
ratingColor: {
  // ... 现有颜色
  gray: 'text-gray-400 dark:text-gray-500', // 新增：用于低分评分显示
}
```

**更新类型定义**：
```typescript
export type BadgeLayerRatingColor =
  | 'red'     // 红色 - 高分（≥9.0）
  | 'purple'  // 紫色 - 优秀（8.0-8.9）
  | 'white'   // 白色 - 良好（7.0-7.9）
  | 'gray'    // 灰色 - 一般（<7.0）
  // ... 其他颜色
```

---

### 3. 修改组件 - `RatingBadgeLayer.tsx`

**修改前**：
```typescript
const finalTextColor = textColor || 'white'
```

**修改后**：
```typescript
const finalTextColor =
  textColor ||
  (ratingResult.numericValue !== undefined
    ? getRatingColorType(ratingResult.numericValue)
    : 'white')
```

**逻辑说明**：
1. 优先使用手动指定的 `textColor`
2. 如果有数字评分，自动计算颜色
3. 否则默认使用白色（用于字符串评分如 "NC-17"）

---

### 4. 修改组件 - `TitleLayer.tsx`

**修改前**：
```typescript
case 'rating':
  return 'text-white dark:text-white'
```

**修改后**：
```typescript
case 'rating':
  return rating !== undefined
    ? getRatingTextColorClass(rating)
    : 'text-white dark:text-white'
```

**逻辑说明**：
1. 当 `color='rating'` 且提供了 `rating` 值时，自动计算颜色
2. 否则默认使用白色

---

## 三、修改的文件列表

| 文件 | 修改类型 | 说明 |
|------|---------|------|
| `src/utils/formatters.ts` | ✅ 新增 | 新增2个工具函数 |
| `src/tokens/design-system/badge-layer-variants.ts` | ✅ 修改 | 新增 gray 颜色配置 |
| `src/presentation/components/layers/RatingBadgeLayer/RatingBadgeLayer.tsx` | ✅ 修改 | 使用 getRatingColorType() |
| `src/presentation/components/layers/TitleLayer/TitleLayer.tsx` | ✅ 修改 | 使用 getRatingTextColorClass() |

**代码统计**：
- 新增代码：约40行
- 修改代码：约10行
- 新增函数：2个
- 新增颜色配置：1个

---

## 四、使用示例

### 示例1：RatingBadgeLayer 自动颜色

```tsx
// 评分 9.5 - 显示红色
<RatingBadgeLayer rating={9.5} />

// 评分 8.3 - 显示紫色
<RatingBadgeLayer rating={8.3} />

// 评分 7.5 - 显示白色
<RatingBadgeLayer rating={7.5} />

// 评分 6.2 - 显示灰色
<RatingBadgeLayer rating={6.2} />
```

### 示例2：手动指定颜色（覆盖自动计算）

```tsx
// 强制显示绿色，忽略评分值
<RatingBadgeLayer rating={9.5} textColor="green" />
```

### 示例3：TitleLayer 评分颜色

```tsx
// 标题根据评分显示颜色
<TitleLayer 
  title="复仇者联盟" 
  color="rating" 
  rating={9.2}  // 显示红色
/>
```

---

## 五、测试要点

### 边界值测试

| 测试值 | 期望颜色 | 说明 |
|--------|---------|------|
| 10.0 | 🔴 红色 | 最高分 |
| 9.0 | 🔴 红色 | 红色下限 |
| 8.9 | 🟣 紫色 | 紫色上限 |
| 8.0 | 🟣 紫色 | 紫色下限 |
| 7.9 | ⚪ 白色 | 白色上限 |
| 7.0 | ⚪ 白色 | 白色下限 |
| 6.9 | ⚫ 灰色 | 灰色上限 |
| 0.0 | ⚫ 灰色 | 最低分 |

### 特殊值测试

| 测试值 | 期望行为 |
|--------|---------|
| `undefined` | 默认白色 |
| `NaN` | 不显示标签 |
| `"NC-17"` | 默认白色 |
| `-1` | 自动修正为 0，显示灰色 |
| `11` | 自动修正为 10，显示红色 |

### 视觉测试

- ✅ 浅色模式下的可读性
- ✅ 深色模式下的可读性
- ✅ 不同背景下的对比度
- ✅ 与现有 hover 效果的兼容性

---

## 六、兼容性说明

### 向后兼容
- ✅ 不影响现有的 hover 效果
- ✅ 支持手动指定颜色（textColor prop）
- ✅ 字符串评分默认显示白色
- ✅ 无评分值时默认显示白色

### 不影响的功能
- ❌ 卡片 hover 效果（保持不变）
- ❌ 其他标签层（VIP、NEW、Quality）
- ❌ Repository 层逻辑
- ❌ 数据转换逻辑

---

## 七、后续优化建议

1. **性能优化**：如果评分颜色计算频繁，可以考虑使用 `useMemo` 缓存结果
2. **可配置化**：如果需要支持不同的颜色规则，可以将阈值提取为配置
3. **国际化**：如果需要支持不同地区的评分标准，可以扩展函数参数
4. **动画效果**：可以为颜色变化添加平滑的过渡动画

---

## 八、注意事项

⚠️ **重要提示**：
1. 此实现只修改了**正常状态**下的颜色显示
2. **不要修改**现有的 hover 效果逻辑
3. 灰色色值 `text-gray-400 dark:text-gray-500` 可根据实际效果调整
4. 所有修改已通过 TypeScript 类型检查

---

## 九、问题修复

### 问题：颜色逻辑未生效

**原因**：两个 `MovieLayer` 组件在调用 `RatingBadgeLayer` 时，手动传入了 `textColor={mapRatingColor(ratingColor)}`，这会覆盖自动颜色计算逻辑。

**解决方案**：
1. 删除 `RatingBadgeLayer` 的 `textColor` 属性传递
2. 删除 `mapRatingColor` 函数
3. 删除 `ratingColor` prop

**修改的文件**：
- `MovieFront/src/presentation/components/layers/MovieLayer/MovieLayer.tsx`
- `MovieFront/src/presentation/components/domains/latestupdate/components/MovieLayer.tsx`

**修改前**：
```tsx
<RatingBadgeLayer
  rating={movie.rating}
  position="bottom-left"
  variant="default"
  textColor={mapRatingColor(ratingColor)}  // ❌ 覆盖了自动计算
/>
```

**修改后**：
```tsx
<RatingBadgeLayer
  rating={movie.rating}
  position="bottom-left"
  variant="default"
  // ✅ 让组件自动根据评分计算颜色
/>
```

### 问题2：标题颜色未改变

**原因**：`TitleLayer` 的 `color` 属性设置为 `"primary"`，而不是 `"rating"`，并且没有传入 `rating` 值。

**解决方案**：
1. 将 `color` 属性从 `"primary"` 改为 `"rating"`
2. 传入 `rating={movie.rating}` 属性

**修改的位置**：
- 两个 MovieLayer 文件中的所有 TitleLayer 使用（包括默认变体和列表变体）

**修改前**：
```tsx
<TitleLayer
  title={movie.title}
  variant="primary"
  size="lg"
  maxLines={1}
  color="primary"  // ❌ 使用固定颜色
  weight="bold"
  clickable={!!onPlay}
  onClick={() => onPlay?.(movie.id)}
/>
```

**修改后**：
```tsx
<TitleLayer
  title={movie.title}
  variant="primary"
  size="lg"
  maxLines={1}
  color="rating"  // ✅ 使用评分颜色
  rating={movie.rating}  // ✅ 传入评分值
  weight="bold"
  clickable={!!onPlay}
  onClick={() => onPlay?.(movie.id)}
/>
```

---

## 十、验收标准

- [x] 评分 ≥ 9.0 显示红色
- [x] 8.0 ≤ 评分 < 9.0 显示紫色
- [x] 7.0 ≤ 评分 < 8.0 显示白色
- [x] 评分 < 7.0 显示灰色
- [x] 深色模式正常显示
- [x] 不影响现有 hover 效果
- [x] 通过 TypeScript 类型检查
- [x] 代码符合项目规范
- [x] 修复了颜色逻辑未生效的问题

---

## 十、相关文档

- [评分颜色重构总结](./RATING_COLOR_REFACTOR_SUMMARY.md)
- [设计系统文档](./src/tokens/design-system/README.md)
- [组件使用指南](./src/presentation/components/layers/README.md)
