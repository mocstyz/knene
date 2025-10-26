# 路由结构文档

## 概述

本文档描述了应用的路由结构，包括路由路径、模块化组织和使用方法。

## 路由路径

### 核心路由

| 功能 | 路径 | 说明 |
|------|------|------|
| 首页 | `/` | 应用入口 |
| 404 | `/404` | 错误页面 |

### 合集路由

| 功能 | 路径 | 说明 |
|------|------|------|
| 合集列表 | `/collections` | 展示所有合集 |
| 合集详情 | `/collections/:id` | 展示合集详情和包含的影片 |

**使用示例：**
```typescript
import { ROUTES } from '@presentation/router'

// 导航到合集列表
navigate(ROUTES.COLLECTIONS.LIST)

// 导航到合集详情
navigate(ROUTES.COLLECTIONS.DETAIL(59))
```

### 影片路由

| 功能 | 路径 | 说明 |
|------|------|------|
| 影片详情 | `/movies/:id` | 展示影片详情 |
| 影片搜索 | `/movies/search` | 搜索影片 |
| 影片分类 | `/movies/category/:cat` | 按分类浏览影片 |

**使用示例：**
```typescript
import { ROUTES } from '@presentation/router'

// 导航到影片详情
navigate(ROUTES.MOVIES.DETAIL(99))

// 导航到影片搜索
navigate(ROUTES.MOVIES.SEARCH)

// 导航到影片分类
navigate(ROUTES.MOVIES.CATEGORY('action'))
```

### 写真路由

| 功能 | 路径 | 说明 |
|------|------|------|
| 写真列表 | `/photos` | 展示所有写真 |
| 写真详情 | `/photos/:id` | 展示写真详情 |

**使用示例：**
```typescript
import { ROUTES } from '@presentation/router'

// 导航到写真列表
navigate(ROUTES.PHOTOS.LIST)

// 导航到写真详情
navigate(ROUTES.PHOTOS.DETAIL(2))
```

### 内容浏览路由

| 功能 | 路径 | 说明 |
|------|------|------|
| 最新更新 | `/latest` | 展示最新更新的内容 |
| 7天最热 | `/hot/weekly` | 展示7天内最热门的内容 |

**使用示例：**
```typescript
import { ROUTES } from '@presentation/router'

// 导航到最新更新
navigate(ROUTES.LATEST)

// 导航到7天最热
navigate(ROUTES.HOT.WEEKLY)
```

### 用户路由

| 功能 | 路径 | 说明 |
|------|------|------|
| 用户仪表板 | `/user/dashboard` | 用户主页 |
| 用户资料 | `/user/profile` | 用户资料页 |
| 用户设置 | `/user/settings` | 用户设置页 |
| 用户下载 | `/user/downloads` | 用户下载记录 |
| 用户收藏 | `/user/favorites` | 用户收藏列表 |
| 用户消息 | `/user/messages` | 用户消息中心 |

**使用示例：**
```typescript
import { ROUTES } from '@presentation/router'

// 导航到用户仪表板
navigate(ROUTES.USER.DASHBOARD)

// 导航到用户设置
navigate(ROUTES.USER.SETTINGS)
```

### 认证路由

| 功能 | 路径 | 说明 |
|------|------|------|
| 登录 | `/auth/login` | 用户登录 |
| 注册 | `/auth/register` | 用户注册 |
| 忘记密码 | `/auth/forgot-password` | 忘记密码 |
| 重置密码 | `/auth/reset-password` | 重置密码 |

**使用示例：**
```typescript
import { ROUTES } from '@presentation/router'

// 导航到登录页
navigate(ROUTES.AUTH.LOGIN)

// 导航到注册页
navigate(ROUTES.AUTH.REGISTER)
```

### 管理员路由

| 功能 | 路径 | 说明 |
|------|------|------|
| 管理员仪表板 | `/admin/dashboard` | 管理员主页 |
| 用户管理 | `/admin/users` | 管理用户 |
| 影片管理 | `/admin/movies` | 管理影片 |
| 系统管理 | `/admin/system` | 系统设置 |

**使用示例：**
```typescript
import { ROUTES } from '@presentation/router'

// 导航到管理员仪表板
navigate(ROUTES.ADMIN.DASHBOARD)

// 导航到用户管理
navigate(ROUTES.ADMIN.USERS)
```

## 路由模块化

路由配置按功能域拆分为多个模块文件：

```
src/presentation/router/
├── index.ts                    # 主入口，导出 router 和 ROUTES
├── routes.tsx                  # 路由组合器（<100行）
├── routePaths.ts              # 路由路径常量定义
└── modules/                   # 路由模块目录
    ├── authRoutes.ts          # 认证路由模块
    ├── userRoutes.ts          # 用户路由模块
    ├── movieRoutes.ts         # 影片路由模块
    ├── photoRoutes.ts         # 写真路由模块
    ├── collectionRoutes.ts    # 合集路由模块
    ├── contentRoutes.ts       # 内容浏览路由（最新、热门）
    ├── adminRoutes.ts         # 管理员路由模块
    ├── testRoutes.ts          # 测试路由模块
    └── errorRoutes.ts         # 错误页面路由模块
```

## 路由守卫

应用使用以下路由守卫保护特定路由：

- **ProtectedRoute**: 保护需要登录的路由（用户页面）
- **AdminRoute**: 保护需要管理员权限的路由（管理员页面）
- **GuestRoute**: 保护只允许未登录用户访问的路由（登录、注册页面）

## ID 格式

所有资源 ID 使用数字格式（由后端生成）：

- 合集 ID: `1`, `2`, `3`, ...
- 影片 ID: `1`, `2`, `3`, ...
- 写真 ID: `1`, `2`, `3`, ...

**示例 URL：**
- `/collections/59` - 合集 59
- `/movies/99` - 影片 99
- `/photos/2` - 写真 2

## 业务链路

### 合集链路
```
首页 → 合集列表 → 合集详情 → 影片详情
/    → /collections → /collections/59 → /movies/99
```

### 写真链路
```
首页 → 写真列表 → 写真详情
/    → /photos → /photos/2
```

### 最新更新链路
```
首页 → 最新更新 → 影片/写真详情
/    → /latest → /movies/99 或 /photos/2
```

### 7天最热链路
```
首页 → 7天最热 → 影片/写真详情
/    → /hot/weekly → /movies/99 或 /photos/2
```

## 最佳实践

1. **使用 ROUTES 常量**：始终使用 `ROUTES` 常量而不是硬编码路径
2. **类型安全**：ROUTES 常量提供类型安全的路径生成函数
3. **模块化**：新增路由时，在对应的模块文件中添加
4. **懒加载**：所有页面组件使用 React.lazy 进行懒加载
5. **Suspense 包装**：使用 SuspenseWrapper 包装懒加载组件

## 迁移说明

如果你有旧的路由引用，请按以下方式更新：

| 旧路径 | 新路径 |
|--------|--------|
| `ROUTES.SPECIAL.COLLECTIONS` | `ROUTES.COLLECTIONS.LIST` |
| `ROUTES.COLLECTION.DETAIL(id)` | `ROUTES.COLLECTIONS.DETAIL(id)` |
| `ROUTES.MOVIE.DETAIL(id)` | `ROUTES.MOVIES.DETAIL(id)` |
| `ROUTES.PHOTO.LIST` | `ROUTES.PHOTOS.LIST` |
| `ROUTES.PHOTO.DETAIL(id)` | `ROUTES.PHOTOS.DETAIL(id)` |
| `ROUTES.LATEST_UPDATE.LIST` | `ROUTES.LATEST` |
| `ROUTES.HOT.LIST` | `ROUTES.HOT.WEEKLY` |

## 常见问题

### Q: 为什么使用数字 ID 而不是字符串 ID？

A: 数字 ID 更接近真实后端（数据库自增 ID），URL 更简洁，符合 RESTful 最佳实践。

### Q: 前端需要验证 ID 格式吗？

A: 不需要。前端只检查 ID 是否存在，格式验证由后端 API 处理。后端会返回 404 如果 ID 无效。

### Q: 如何添加新的路由？

A: 
1. 在对应的路由模块文件中添加路由配置
2. 在 `routePaths.ts` 中添加路径常量
3. 确保使用懒加载和 Suspense 包装器

### Q: 路由守卫如何工作？

A: 路由守卫在路由配置中包装组件，在渲染前检查用户权限。未授权访问会重定向到登录页或首页。
