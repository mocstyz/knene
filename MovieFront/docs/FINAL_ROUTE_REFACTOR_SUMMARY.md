# 路由和 ID 格式重构 - 最终版本

## 重构日期
2025-01-26

## 重构原则

### ✅ 正确的做法
1. **数据源层面**：Mock 数据服务生成纯数字 ID
2. **路由层面**：路由接受任何字符串作为 ID 参数
3. **页面层面**：页面组件直接使用 URL 参数，不做任何转换
4. **API 层面**：模拟真实后端 API 的行为

### ❌ 错误的做法
- ~~在页面组件中做 ID 格式转换~~
- ~~添加向后兼容逻辑~~
- ~~在前端做 ID 清理~~

## 核心修改

### 1. Mock 数据服务 ID 生成

**文件：** `src/application/services/MockDataService.ts`

```typescript
// ✅ 正确：生成纯数字 ID
const collections = Array.from({ length: count }, (_, index) => {
  const id = `${index + 1}`  // "1", "2", "3", ...
  // ...
})

const movies = Array.from({ length: count }, (_, index) => {
  const id = `${index + 1}`  // "1", "2", "3", ...
  // ...
})

const photos = Array.from({ length: count }, (_, index) => {
  const id = `${index + 1}`  // "1", "2", "3", ...
  // ...
})
```

**关键点：**
- ID 是字符串类型（因为 TypeScript 接口定义为 `string`）
- ID 内容是纯数字（"1", "2", "3", ...）
- 合集影片 ID 使用计算规则：`collectionId * 1000 + index`

### 2. 清除缓存机制

```typescript
private constructor() {
  // 初始化时清除缓存，确保使用最新的数据格式
  this.mockDataCache.clear()
}
```

**原因：**
- Mock 服务使用了缓存机制
- 修改 ID 格式后，缓存中可能还有旧数据
- 初始化时清除缓存，确保每次重启都使用新格式

### 3. 路由配置

**文件：** `src/presentation/router/routes.tsx`

```typescript
// 影片路由
{
  path: '/movies',
  children: [
    {
      path: ':id',  // 接受任何字符串
      element: <MovieDetailPage />
    }
  ]
}

// 写真路由
{
  path: '/photos',
  children: [
    {
      path: ':id',  // 接受任何字符串
      element: <PhotoDetailPage />
    }
  ]
}

// 合集路由
{
  path: '/collections',
  children: [
    {
      path: ':collectionId',  // 接受任何字符串
      element: <CollectionDetailPage />
    }
  ]
}
```

**关键点：**
- 路由参数 `:id` 会匹配任何字符串
- 不在路由层面做 ID 格式验证
- 模拟真实场景：后端 API 也是接受任何 ID 参数

### 4. 页面组件

**文件：** 
- `src/presentation/pages/photo/PhotoDetailPage.tsx`
- `src/presentation/pages/movie/MovieDetailPage.tsx`
- `src/presentation/pages/collections/CollectionDetailPage.tsx`

```typescript
// ✅ 正确：直接使用 URL 参数
const { id: photoId } = useParams<{ id: string }>()

// ❌ 错误：不要做格式转换
// const photoId = rawPhotoId?.replace(/^photo_/, '') || ''
```

**原因：**
- 模拟真实场景：前端直接把 URL 参数传给后端 API
- 后端负责验证 ID 是否有效
- 前端不应该做 ID 格式转换

## 数据流

```
用户点击卡片
  ↓
navigate(`/photos/${photo.id}`)  // photo.id = "47"
  ↓
URL: /photos/47
  ↓
PhotoDetailPage 接收 photoId = "47"
  ↓
usePhotoDetail(photoId)
  ↓
photoDetailApi.getPhotoDetail("47")
  ↓
Mock API 返回数据（id: "47"）
  ↓
页面显示
```

## URL 格式

### 最终 URL 格式（纯数字 ID）

```
http://localhost:3000/collections          # 合集列表
http://localhost:3000/collections/65       # 合集详情
http://localhost:3000/movies/65001         # 影片详情
http://localhost:3000/photos/47            # 写真详情
http://localhost:3000/latest               # 最新更新
http://localhost:3000/hot/weekly           # 7天最热
```

### 旧 URL 格式（不再生成）

```
❌ http://localhost:3000/collections/collection_65
❌ http://localhost:3000/movies/movie_65001
❌ http://localhost:3000/photos/photo_47
```

**注意：**
- 旧 URL 格式不会再被生成
- 如果手动输入旧 URL，路由会匹配，但 Mock API 会找不到对应数据
- 这是正确的行为，模拟真实场景：后端 API 会返回 404

## 测试步骤

### 1. 重启开发服务器

```bash
# 停止服务器 (Ctrl+C)
npm run dev
```

### 2. 清除浏览器缓存

- 打开开发者工具（F12）
- Network 标签页勾选 "Disable cache"
- 或使用无痕模式

### 3. 测试新 URL

1. 访问首页：`http://localhost:3000`
2. 点击写真模块的卡片
3. 查看 URL：应该是 `/photos/47`（纯数字）
4. 查看页面：应该正常显示
5. 查看控制台：应该看到 `photoId = "47"`

### 4. 测试旧 URL（应该失败）

1. 手动输入：`http://localhost:3000/photos/photo_47`
2. 页面应该显示错误或空白（因为 Mock API 找不到 ID 为 "photo_47" 的数据）

## 修改的文件清单

### 数据层
- ✅ `src/application/services/MockDataService.ts`
  - 修改 ID 生成逻辑（纯数字）
  - 添加初始化清除缓存

### 路由层
- ✅ `src/presentation/router/routes.tsx`
  - 更新路由路径（复数形式）
  - 保持路由参数不变

### 页面层
- ✅ `src/presentation/pages/collections/CollectionsListPage.tsx`
- ✅ `src/presentation/pages/collections/CollectionDetailPage.tsx`
- ✅ `src/presentation/pages/photo/PhotoDetailPage.tsx`
- ✅ `src/presentation/pages/movie/MovieDetailPage.tsx`
- ✅ `src/presentation/pages/home/HomePage.tsx`
- ✅ `src/presentation/pages/user/DashboardPage.tsx`

### 工具层
- ✅ `src/utils/navigation-helpers.ts`

## 符合主流规范

### ✅ RESTful API 标准
```
GET /api/photos/47          # 获取 ID 为 47 的写真
GET /api/movies/65001       # 获取 ID 为 65001 的影片
GET /api/collections/65     # 获取 ID 为 65 的合集
```

### ✅ 前后端分离
- 前端：从 URL 获取 ID，传给 API
- 后端：验证 ID，返回数据或 404
- 前端：不做 ID 格式转换

### ✅ 类型安全
- ID 类型：`string`（符合 TypeScript 接口定义）
- ID 内容：纯数字字符串（符合业务规范）

## 重构完成 ✅

现在的实现：
1. ✅ 数据源生成纯数字 ID
2. ✅ 路由使用 RESTful 风格
3. ✅ 页面组件不做 ID 转换
4. ✅ 模拟真实后端 API 行为
5. ✅ 符合主流开发规范

**重启开发服务器后，所有新生成的链接都是纯数字 ID 格式！** 🎉
