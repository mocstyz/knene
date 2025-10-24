# 合集影片列表页面测试指南

## Mock数据说明

由于后端API尚未实现，我们使用Mock数据来模拟合集详情和影片列表功能。

### Mock数据生成规则

#### 1. 合集数据
- **合集ID格式**：`collection_1`, `collection_2`, ..., `collection_50`
- **合集数量**：系统预生成50个合集
- **合集标题**：`精选合集 1`, `精选合集 2`, ...
- **合集封面**：使用picsum.photos随机图片

#### 2. 影片数据
- **影片数量**：每个合集包含20-50部影片（根据合集ID动态生成）
- **影片ID格式**：`movie_{collectionIndex * 100 + movieIndex}`
  - 例如：合集1的影片ID为 `movie_101`, `movie_102`, ...
  - 例如：合集2的影片ID为 `movie_201`, `movie_202`, ...
- **影片标题**：`合集{collectionIndex}-影片{index}`
- **影片类型**：动作、喜剧、剧情、科幻、恐怖、爱情、悬疑（循环）
- **影片质量**：4K、HD、1080P、720P（循环）
- **评分范围**：6.0-10.0

### Mock数据特点

1. **数据一致性**：同一个合集ID每次访问返回相同的影片列表
2. **分页支持**：支持标准的分页参数（page, pageSize）
3. **真实模拟**：模拟真实API的响应结构和数据格式

## 测试步骤

### 1. 访问合集列表页
```
http://localhost:3000/special/collections
```

**预期结果**：
- 显示12个合集卡片
- 每个卡片显示合集标题、封面图片
- 支持分页浏览

### 2. 点击合集卡片
点击任意合集卡片（例如：精选合集 1）

**预期结果**：
- 跳转到合集详情页：`http://localhost:3000/collection/collection_1`
- 页面标题显示：`精选合集 1`
- 显示该合集包含的影片列表

### 3. 查看影片列表
在合集详情页查看影片列表

**预期结果**：
- 显示影片卡片网格布局
- 每个卡片包含：
  - 影片封面图片
  - 影片标题（在卡片下方）
  - 影片分类标签（在卡片下方）
  - NEW标签（左上角）
  - VIP标签（右下角）
  - 质量标签（右上角，如4K、HD）
  - 评分标签（左下角，带颜色）
- 响应式布局：
  - 手机：2列
  - 平板：3列
  - 桌面：4列
  - 大屏：5列
  - 超大屏：6列

### 4. 测试分页功能
如果合集包含超过12部影片，会显示分页控件

**预期结果**：
- 显示"上一页"和"下一页"按钮
- 显示当前页码和总页数（如：1 / 3）
- 点击"下一页"加载下一页影片
- 点击"上一页"返回上一页
- 页面切换时显示骨架屏加载效果
- 自动滚动到页面顶部

### 5. 测试加载状态
刷新页面或切换页面时

**预期结果**：
- 显示骨架屏加载效果（至少500ms）
- 骨架屏显示12个占位卡片
- 加载完成后平滑过渡到实际内容

### 6. 测试不同合集
访问不同的合集ID

**测试URL**：
```
http://localhost:3000/collection/collection_1
http://localhost:3000/collection/collection_2
http://localhost:3000/collection/collection_10
```

**预期结果**：
- 每个合集显示不同的影片列表
- 影片数量可能不同（20-50部）
- 影片ID和标题与合集ID相关联

### 7. 测试错误处理
访问不存在的合集ID

**测试URL**：
```
http://localhost:3000/collection/collection_999
```

**预期结果**：
- 显示默认合集信息
- 标题显示：`合集 collection_999`
- 影片列表为空或显示默认数据

## 控制台日志

在开发环境下，控制台会输出详细的日志信息：

### 1. 数据获取日志
```
🎬 [useCollectionMovies] 开始获取合集影片数据
🎬 [useCollectionMovies] 数据获取成功
```

### 2. Mock数据日志
```
Development: API not available, using mock data for collection collection_1
Development: API not available, using mock data for collection collection_1 movies
```

### 3. 页面切换日志
```
🎬 [useCollectionMovies] 页面切换
🎬 [useCollectionMovies] 更新查询选项
```

## 功能验证清单

- [ ] 合集列表页正常显示
- [ ] 点击合集卡片能跳转到详情页
- [ ] 合集详情页显示正确的标题
- [ ] 影片列表正常显示
- [ ] 影片卡片样式正确（标题和分类在下方）
- [ ] 所有标签正常显示（NEW/VIP/质量/评分）
- [ ] 响应式布局正常工作
- [ ] 分页功能正常工作
- [ ] 骨架屏加载效果正常
- [ ] 页面切换时自动滚动到顶部
- [ ] 不同合集显示不同的影片
- [ ] 控制台无错误信息

## 已知限制

1. **Mock数据限制**：
   - 合集数量固定为50个
   - 影片数据为随机生成，不是真实数据
   - 图片使用picsum.photos占位图

2. **功能限制**：
   - 暂不支持影片搜索
   - 暂不支持影片筛选
   - 暂不支持排序切换
   - 点击影片卡片暂无跳转（影片详情页未实现）

3. **性能限制**：
   - 首次加载会生成Mock数据，可能稍慢
   - Mock数据会缓存，后续访问更快

## 后续开发

当后端API准备好后，需要：

1. **配置API端点**：
   - 在`.env`文件中配置`VITE_API_BASE_URL`
   - 确保API返回的数据格式与Mock数据一致

2. **API接口要求**：
   ```
   GET /api/collections/{collectionId}
   返回：合集详情信息
   
   GET /api/collections/{collectionId}/movies?page=1&limit=12
   返回：影片列表和分页信息
   ```

3. **数据格式要求**：
   - 参考`MovieDetail`类型定义
   - 参考`CollectionItem`类型定义
   - 参考`PaginatedResponse`类型定义

4. **移除Mock数据**：
   - 将`import.meta.env.DEV`改为实际的环境判断
   - 或直接移除Mock数据相关代码

## 调试技巧

### 1. 查看Mock数据
在浏览器控制台执行：
```javascript
// 查看合集详情
mockDataService.getMockCollectionDetail('collection_1')

// 查看合集影片
mockDataService.getMockCollectionMovies({
  collectionId: 'collection_1',
  page: 1,
  pageSize: 12
})
```

### 2. 清除缓存
如果需要重新生成Mock数据：
```javascript
mockDataService.clearCache()
```

### 3. 查看缓存统计
```javascript
mockDataService.getCacheStats()
```

## 问题排查

### 问题1：页面显示"加载失败"
**原因**：Mock数据生成失败或合集ID不存在
**解决**：检查合集ID是否在1-50范围内

### 问题2：影片列表为空
**原因**：分页参数错误或Mock数据未生成
**解决**：检查控制台日志，确认Mock数据是否正常生成

### 问题3：骨架屏一直显示
**原因**：数据加载失败或Hook状态异常
**解决**：检查控制台错误信息，查看网络请求状态

### 问题4：分页不工作
**原因**：总数计算错误或页码状态异常
**解决**：检查`total`和`totalPages`的值是否正确

## 性能优化建议

1. **图片优化**：
   - 使用图片服务优化URL
   - 设置合适的图片尺寸
   - 启用懒加载

2. **数据缓存**：
   - Mock数据已自动缓存
   - 考虑添加API响应缓存

3. **骨架屏优化**：
   - 最小显示时间500ms
   - 避免闪烁效果

4. **分页优化**：
   - 预加载下一页数据
   - 使用虚拟滚动（大数据量时）

## 相关文档

- [实现文档](./COLLECTION_DETAIL_IMPLEMENTATION.md)
- [DDD架构规范](./CLAUDE.md)
- [Mock数据服务](./src/application/services/MockDataService.ts)
