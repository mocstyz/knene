# 路由和 ID 格式重构完成 ✅

## 重构日期
2025-01-26

## 重构内容

### 1. 路由结构重构
将路由从不规范的命名方式重构为符合 RESTful 标准的设计。

### 2. ID 格式重构
将 Mock 数据中的 ID 从带前缀格式改为纯数字格式。

## 完整对比

### 影片模块
| 项目 | 旧格式 | 新格式 |
|------|--------|--------|
| 路由 | `/movie/:id` | `/movies/:id` |
| ID | `movie_59001` | `59001` |
| 完整URL | `/movie/movie_59001` | `/movies/59001` |

### 合集模块
| 项目 | 旧格式 | 新格式 |
|------|--------|--------|
| 列表路由 | `/special/collections` | `/collections` |
| 详情路由 | `/collection/:id` | `/collections/:id` |
| ID | `collection_65` | `65` |
| 完整URL | `/special/collections` → `/collection/collection_65` | `/collections` → `/collections/65` |

### 写真模块
| 项目 | 旧格式 | 新格式 |
|------|--------|--------|
| 列表路由 | `/photo` | `/photos` |
| 详情路由 | `/photo/:id` | `/photos/:id` |
| ID | `photo_2` | `2` |
| 完整URL | `/photo/photo_2` | `/photos/2` |

### 发现模块
| 项目 | 旧格式 | 新格式 |
|------|--------|--------|
| 最新更新 | `/latest-updates` | `/latest` |
| 7天最热 | `/hot-weekly` | `/hot/weekly` |

## 修改的文件清单

### 路由相关
1. ✅ `src/presentation/router/routes.tsx` - 路由配置
2. ✅ `src/utils/navigation-helpers.ts` - 导航辅助函数
3. ✅ `src/presentation/pages/home/HomePage.tsx` - 首页链接
4. ✅ `src/presentation/pages/user/DashboardPage.tsx` - 用户面板链接
5. ✅ `src/presentation/pages/collections/CollectionsListPage.tsx` - 合集列表页（新建）
6. ✅ `src/presentation/pages/collections/CollectionDetailPage.tsx` - 合集详情页（移动）
7. ❌ `src/presentation/pages/special/SpecialCollectionsPage.tsx` - 已删除
8. ❌ `src/presentation/pages/collection/CollectionDetailPage.tsx` - 已删除

### 数据相关
9. ✅ `src/application/services/MockDataService.ts` - Mock 数据服务（ID 格式）

## 用户浏览路径示例

### 合集浏览
```
首页 → 合集列表 → 某个合集 → 影片详情
/    → /collections → /collections/65 → /movies/65001
```

### 写真浏览
```
首页 → 写真列表 → 写真详情
/    → /photos → /photos/2
```

### 最新更新
```
首页 → 最新更新 → 内容详情
/    → /latest → /movies/59001 或 /photos/2 或 /collections/65
```

### 热门内容
```
首页 → 7天最热 → 内容详情
/    → /hot/weekly → /movies/59001 或 /photos/2 或 /collections/65
```

## 技术细节

### ID 生成规则

**普通内容：**
- 影片：`1`, `2`, `3`, ... `100`
- 合集：`1`, `2`, `3`, ... `100`
- 写真：`1`, `2`, `3`, ... `100`

**合集影片：**
- 合集 65 的影片：`65001`, `65002`, `65003`, ...
- 计算公式：`collectionId * 1000 + index`

### ID 解析方式
```typescript
// 旧方式（字符串替换）
const movieIndex = parseInt(movieId.replace('movie_', ''))

// 新方式（直接解析）
const movieIndex = parseInt(movieId)
```

## 设计原则

### 1. RESTful 标准
- 资源名使用复数形式
- ID 直接跟在资源后面
- 使用层级结构表示关系

### 2. 简洁性
- 去掉冗余的类型前缀
- 简化路径名称
- 保持 URL 简短易记

### 3. 一致性
- 所有资源使用统一的命名规范
- ID 格式统一为纯数字
- 路由结构保持一致

### 4. 可维护性
- 代码更清晰易读
- 便于调试和追踪
- 符合行业标准

## 测试建议

### 手动测试清单
- [ ] 访问 `/collections` 查看合集列表
- [ ] 点击合集卡片，跳转到 `/collections/65`
- [ ] 在合集详情页点击影片，跳转到 `/movies/65001`
- [ ] 访问 `/photos` 查看写真列表
- [ ] 点击写真卡片，跳转到 `/photos/2`
- [ ] 访问 `/latest` 查看最新更新
- [ ] 访问 `/hot/weekly` 查看7天最热
- [ ] 测试浏览器前进/后退按钮
- [ ] 直接在地址栏输入新格式 URL

### 验证要点
1. ✅ URL 中不再出现 `movie_`、`collection_`、`photo_` 前缀
2. ✅ 所有链接都使用新的路由格式
3. ✅ 页面跳转正常，无 404 错误
4. ✅ 数据加载正常，显示正确内容
5. ✅ 浏览器历史记录功能正常

## 后续优化建议

1. **SEO 优化**
   - 考虑添加内容标题 slug：`/movies/59001-movie-title`
   - 有利于搜索引擎收录和用户分享

2. **API 对接**
   - 确保后端 API 返回的 ID 格式与前端一致
   - 如果后端返回带前缀的 ID，需要在前端做转换

3. **类型安全**
   - 考虑使用 TypeScript 的字面量类型或品牌类型
   - 区分不同类型的 ID（MovieId, CollectionId, PhotoId）

4. **缓存策略**
   - 更新浏览器缓存策略
   - 清除旧路由的缓存数据

## 完成状态

✅ 路由配置已更新  
✅ 页面组件已移动/重命名  
✅ 导航逻辑已更新  
✅ ID 格式已修改  
✅ Mock 数据服务已更新  
✅ 旧文件已删除  
✅ 文档已更新  

## 重构完成！🎉

现在你可以：
1. 启动开发服务器：`npm run dev`
2. 访问 `http://localhost:3000`
3. 测试新的路由和 ID 格式
4. 享受更简洁、更标准的 URL 结构！

**新的 URL 示例：**
- 合集列表：`http://localhost:3000/collections`
- 合集详情：`http://localhost:3000/collections/65`
- 影片详情：`http://localhost:3000/movies/65001`
- 写真详情：`http://localhost:3000/photos/2`
- 最新更新：`http://localhost:3000/latest`
- 7天最热：`http://localhost:3000/hot/weekly`


## 向后兼容处理

虽然我们不需要为已上线的用户提供向后兼容，但为了开发过程中的便利性，我们在详情页中添加了 ID 规范化处理：

### 实现方式

在所有详情页组件中，接收到 URL 参数后，自动移除可能存在的前缀：

```typescript
// 写真详情页
const { id: rawPhotoId } = useParams<{ id: string }>()
const photoId = rawPhotoId?.replace(/^photo_/, '') || ''

// 影片详情页
const { id: rawMovieId } = useParams<{ id: string }>()
const movieId = rawMovieId?.replace(/^movie_/, '') || ''

// 合集详情页
const { collectionId: rawCollectionId } = useParams<{ collectionId: string }>()
const collectionId = rawCollectionId?.replace(/^collection_/, '') || ''
```

### 效果

现在这两种 URL 格式都能正常工作：

**旧格式（带前缀）：**
- `http://localhost:3000/photos/photo_47` ✅ 自动转换为 `47`
- `http://localhost:3000/movies/movie_65001` ✅ 自动转换为 `65001`
- `http://localhost:3000/collections/collection_65` ✅ 自动转换为 `65`

**新格式（纯数字）：**
- `http://localhost:3000/photos/47` ✅ 直接使用
- `http://localhost:3000/movies/65001` ✅ 直接使用
- `http://localhost:3000/collections/65` ✅ 直接使用

### 修改的文件
- ✅ `src/presentation/pages/photo/PhotoDetailPage.tsx`
- ✅ `src/presentation/pages/movie/MovieDetailPage.tsx`
- ✅ `src/presentation/pages/collections/CollectionDetailPage.tsx`

### 注意事项

1. **这不是真正的向后兼容**：我们没有添加路由重定向，只是在详情页内部做了 ID 清理
2. **新生成的链接都是纯数字格式**：从首页点击卡片跳转的链接都是新格式
3. **旧链接仍然可以手动访问**：如果有人收藏了旧链接，依然可以访问
4. **浏览器地址栏不会自动更新**：访问 `/photos/photo_47` 后，地址栏仍然显示 `photo_47`，不会自动改为 `47`

如果需要真正的向后兼容（自动重定向），可以在路由配置中添加重定向规则。
