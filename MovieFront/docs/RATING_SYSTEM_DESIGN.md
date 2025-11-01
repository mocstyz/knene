# 评分系统设计说明

## 问题分析

### 原有问题
1. `MediaRatingItem` 接口中的 `rating` 字段命名不明确
2. 没有明确说明 `rating` 是哪个平台的评分（实际上是 Douban）
3. 多平台评分（Douban、IMDb、TMDb）的类型定义不统一

### 你的观点是正确的
你提出的问题非常准确：
- `rating` 字段应该明确命名为 `doubanRating`
- 这样可以避免混淆，提高代码可读性
- 符合多平台评分系统的设计原则

## 解决方案

### 1. 类型定义重构

#### MediaRatingItem 接口
```typescript
export interface MediaRatingItem {
  rating: string // Douban评分值（字符串格式，如 "7.5"）
  doubanRating?: string // Douban评分（明确命名，与rating保持兼容）
  ratingColor?: 'purple' | 'red' | 'white' | 'default'
}
```

**设计说明：**
- 保留 `rating` 字段以保持向后兼容
- 添加 `doubanRating` 字段明确表示 Douban 评分
- 两个字段可以同时使用，优先使用 `doubanRating`

#### MovieDetail 接口
```typescript
export interface MovieDetail extends FullMovieItem {
  // ... 其他字段
  
  // 多平台评分系统
  // rating 字段继承自 MediaRatingItem，实际上是 Douban 评分（字符串格式）
  doubanRating?: string // Douban评分（明确命名，字符串格式如 "7.5"）
  imdbRating?: number // IMDb评分 (0-10，数字格式)
  tmdbRating?: number // TMDb评分 (0-10，数字格式)
}
```

### 2. 继承关系

```
MediaRatingItem (rating: string)
    ↓
BaseMovieItem
    ↓
FullMovieItem
    ↓
MovieDetail (+ doubanRating, imdbRating, tmdbRating)
```

### 3. 评分字段对比

| 字段 | 类型 | 来源 | 格式 | 说明 |
|------|------|------|------|------|
| `rating` | string | MediaRatingItem | "7.5" | Douban评分（继承字段，保持兼容） |
| `doubanRating` | string | MovieDetail | "6.3" | Douban评分（明确命名） |
| `imdbRating` | number | MovieDetail | 9.2 | IMDb评分 |
| `tmdbRating` | number | MovieDetail | 8.5 | TMDb评分 |

### 4. Mock数据示例

```typescript
const mockData: MovieDetail = {
  // ...
  rating: '6.3',        // Douban评分（继承字段）
  doubanRating: '6.3',  // Douban评分（明确命名）
  imdbRating: 9.2,      // IMDb评分
  tmdbRating: 8.5,      // TMDb评分
  // ...
}
```

### 5. 使用建议

#### 推荐做法
```typescript
// 优先使用明确命名的字段
const doubanScore = movie.doubanRating || movie.rating
const imdbScore = movie.imdbRating
const tmdbScore = movie.tmdbRating
```

#### 在组件中使用
```typescript
// MovieHeroSection.tsx
<span className={getRatingTextColorClass(parseFloat(movie.rating))}>
  {movie.rating}
</span>

// 或者使用明确命名
<span className={getRatingTextColorClass(parseFloat(movie.doubanRating || movie.rating))}>
  {movie.doubanRating || movie.rating}
</span>
```

## 设计优势

### 1. 明确性
- `doubanRating` 明确表示这是 Douban 平台的评分
- 避免了 `rating` 字段的歧义

### 2. 向后兼容
- 保留 `rating` 字段，不破坏现有代码
- 新代码可以逐步迁移到 `doubanRating`

### 3. 扩展性
- 支持多平台评分系统
- 可以轻松添加其他平台评分（如 Rotten Tomatoes）

### 4. 类型安全
- Douban 评分使用字符串类型（与API返回格式一致）
- IMDb/TMDb 评分使用数字类型（便于计算和比较）

## 未来改进建议

### 1. 统一评分类型
考虑将所有评分统一为数字类型：
```typescript
export interface MovieDetail extends FullMovieItem {
  doubanRating?: number // 统一为数字类型
  imdbRating?: number
  tmdbRating?: number
}
```

### 2. 评分对象化
创建专门的评分接口：
```typescript
export interface Rating {
  value: number
  platform: 'douban' | 'imdb' | 'tmdb'
  votes?: number
  maxScore: number // 最高分（Douban/IMDb是10，Rotten Tomatoes是100）
}

export interface MovieDetail extends FullMovieItem {
  ratings: Rating[] // 多平台评分数组
}
```

### 3. 评分工具函数
```typescript
// 获取指定平台的评分
export function getRatingByPlatform(
  movie: MovieDetail, 
  platform: 'douban' | 'imdb' | 'tmdb'
): number | undefined {
  switch (platform) {
    case 'douban':
      return parseFloat(movie.doubanRating || movie.rating)
    case 'imdb':
      return movie.imdbRating
    case 'tmdb':
      return movie.tmdbRating
  }
}
```

## 总结

你的观点完全正确：
1. ✅ `rating` 字段命名不够明确
2. ✅ 应该使用 `doubanRating` 明确表示 Douban 评分
3. ✅ 多平台评分应该有清晰的命名规范

现在的实现：
- 保留了 `rating` 字段以保持兼容性
- 添加了 `doubanRating` 字段提供明确的命名
- 统一了多平台评分的类型定义
- 所有评分都使用统一的颜色逻辑函数
