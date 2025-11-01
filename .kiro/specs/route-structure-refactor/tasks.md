# Implementation Plan

- [x] 1. 创建路由模块目录结构和路径常量文件


  - 创建 `src/presentation/router/modules/` 目录
  - 创建 `routePaths.ts` 文件，定义新的 ROUTES 常量对象
  - _Requirements: 1.1, 1.5, 2.5_

- [x] 2. 调整 Mock 数据服务的 ID 格式



  - [x] 2.1 更新 MockDataService 中的 ID 生成逻辑

    - 将 `generateMockCollections` 中的 ID 从 `collection_${index}` 改为纯数字
    - 将 `generateMockMovies` 中的 ID 从 `movie_${index}` 改为纯数字
    - 将 `generateMockPhotos` 中的 ID 从 `photo_${index}` 改为纯数字
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 2.2 更新类型定义中的 ID 类型


    - 在 `@types-movie` 中将所有内容项的 `id` 类型从 `string` 改为 `number`
    - 更新 `BaseContentItem`, `CollectionItem`, `MovieDetail`, `PhotoItem` 等类型
    - _Requirements: 1.1, 1.2, 1.3, 1.4_





- [ ] 3. 创建路由模块文件
  - [ ] 3.1 创建 collectionRoutes.ts
    - 实现合集列表路由 `/collections`


    - 实现合集详情路由 `/collections/:id`
    - 使用懒加载和 Suspense 包装器
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.7, 2.8_

  - [x] 3.2 创建 movieRoutes.ts


    - 实现影片详情路由 `/movies/:id`
    - 实现影片搜索路由 `/movies/search`
    - 实现影片分类路由 `/movies/category/:cat`
    - 使用懒加载和 Suspense 包装器


    - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.7, 2.8_

  - [ ] 3.3 创建 photoRoutes.ts
    - 实现写真列表路由 `/photos`


    - 实现写真详情路由 `/photos/:id`
    - 使用懒加载和 Suspense 包装器
    - _Requirements: 1.2, 2.1, 2.2, 2.3, 2.7, 2.8_


  - [-] 3.4 创建 contentRoutes.ts

    - 实现最新更新路由 `/latest`
    - 实现7天最热路由 `/hot/weekly`
    - 使用懒加载和 Suspense 包装器

    - _Requirements: 1.3, 1.4, 2.1, 2.2, 2.3, 2.7, 2.8_


  - [ ] 3.5 创建 authRoutes.ts
    - 实现认证相关路由（login, register, forgot-password, reset-password）

    - 应用 GuestRoute 守卫

    - 使用懒加载和 Suspense 包装器
    - _Requirements: 2.1, 2.2, 2.3, 2.7, 2.8_



  - [ ] 3.6 创建 userRoutes.ts
    - 实现用户相关路由（dashboard, profile, settings, downloads, favorites, messages）



    - 应用 ProtectedRoute 守卫

    - 使用懒加载和 Suspense 包装器
    - _Requirements: 2.1, 2.2, 2.3, 2.7, 2.8_

  - [x] 3.7 创建 adminRoutes.ts

    - 实现管理员相关路由（dashboard, users, movies, system）

    - 应用 AdminRoute 守卫

    - 使用懒加载和 Suspense 包装器

    - _Requirements: 2.1, 2.2, 2.3, 2.7, 2.8_

  - [ ] 3.8 创建 testRoutes.ts
    - 实现测试页面路由（theme, badge）
    - 使用懒加载和 Suspense 包装器
    - _Requirements: 2.1, 2.2, 2.3, 2.7, 2.8_

  - [ ] 3.9 创建 errorRoutes.ts
    - 实现 404 错误页面路由
    - 实现通配符路由重定向到 404
    - 使用懒加载和 Suspense 包装器
    - _Requirements: 2.1, 2.2, 2.3, 2.7, 2.8_

- [ ] 4. 重构主路由文件
  - [ ] 4.1 更新 routes.tsx
    - 导入所有路由模块
    - 组合路由配置数组
    - 保持首页路由和错误边界
    - 确保文件不超过 100 行
    - _Requirements: 2.3, 2.6, 2.7, 2.8_

  - [ ] 4.2 更新 router/index.ts
    - 从 routePaths.ts 导出 ROUTES 常量
    - 从 routes.tsx 导出 router 实例
    - _Requirements: 2.5_

- [x] 5. 更新页面组件中的路由引用

  - [x] 5.1 更新 HomePage.tsx

    - 更新 ROUTES 导入路径
    - 更新合集链接：`ROUTES.SPECIAL.COLLECTIONS` → `ROUTES.COLLECTIONS.LIST`
    - 更新写真链接：`ROUTES.PHOTO.LIST` → `ROUTES.PHOTOS.LIST`
    - 更新最新更新链接：`ROUTES.LATEST_UPDATE.LIST` → `ROUTES.LATEST`
    - 更新热门链接：`ROUTES.HOT.LIST` → `ROUTES.HOT.WEEKLY`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6_

  - [x] 5.2 更新 CollectionsListPage.tsx


    - 更新导航链接：`/collections/${id}` 使用 `ROUTES.COLLECTIONS.DETAIL(id)`
    - _Requirements: 1.1, 1.6_


  - [x] 5.3 更新 CollectionDetailPage.tsx

    - 更新影片详情导航：`/movies/${id}` 使用 `ROUTES.MOVIES.DETAIL(id)`
    - _Requirements: 1.1, 1.6_


  - [x] 5.4 更新其他页面组件中的路由引用


    - 搜索并更新所有使用旧路径的组件
    - 确保使用新的 ROUTES 常量
    - _Requirements: 1.6_

- [-] 6. 验证和测试


  - [x] 6.1 验证路由配置

    - 启动开发服务器，确保无编译错误
    - 检查路由器实例创建成功
    - _Requirements: 2.6, 3.1, 4.5_

  - [x] 6.2 手动测试路由导航

    - 测试首页到合集列表的导航
    - 测试合集列表到合集详情的导航
    - 测试合集详情到影片详情的导航
    - 测试首页到写真列表的导航
    - 测试写真列表到写真详情的导航
    - 测试首页到最新更新的导航
    - 测试首页到7天最热的导航
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1_


  - [ ] 6.3 验证旧路径不可访问
    - 访问 `/special/collections` 应显示 404
    - 访问 `/collection/59` 应显示 404
    - 访问 `/movie/99` 应显示 404
    - 访问 `/photo` 应显示 404
    - 访问 `/latest-updates` 应显示 404
    - 访问 `/hot-weekly` 应显示 404
    - _Requirements: 3.1_

  - [x] 6.4 验证路由守卫功能

    - 测试未登录访问用户页面重定向到登录页
    - 测试非管理员访问管理员页面被拒绝
    - 测试已登录访问登录页重定向到首页
    - _Requirements: 2.7_

- [x] 7. 代码质量检查和文档更新




  - [x] 7.1 运行代码质量检查

    - 运行 ESLint 检查
    - 运行 TypeScript 类型检查
    - 修复所有错误和警告
    - _Requirements: 4.5_


  - [x] 7.2 更新相关文档

    - 更新路由使用文档
    - 记录新的路由路径结构
    - 提供路由模块化的说明
    - _Requirements: 3.2, 4.1, 4.2, 4.3_
