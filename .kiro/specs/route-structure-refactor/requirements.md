# Requirements Document

## Introduction

本需求文档旨在重构应用的路由结构，实现两个主要目标：
1. 调整路由路径以符合新的业务链路设计（合集、写真、最新更新、热门内容）
2. 解决 routes.tsx 文件过大的问题，通过模块化拆分提高可维护性

当前路由文件已经超过 400 行，包含了所有路由配置、懒加载导入、路由守卫等逻辑，难以维护和扩展。同时，现有的路由路径与期望的业务链路不完全匹配。

**注意**: 项目未上线，无需考虑向后兼容性，直接使用新路径，不需要重定向配置。

## Requirements

### Requirement 1: 路由路径重构

**User Story:** 作为开发者，我希望路由路径能够清晰地反映业务链路，使得用户导航路径更加直观和符合业务逻辑

#### Acceptance Criteria

1. WHEN 用户访问合集相关页面 THEN 系统 SHALL 使用以下路由结构：
   - `/` → `/collections` → `/collections/:id` → `/movies/:id`
   - 合集列表路径为 `/collections`
   - 合集详情路径为 `/collections/:id`
   - 从合集进入的影片详情路径为 `/movies/:id`

2. WHEN 用户访问写真相关页面 THEN 系统 SHALL 使用以下路由结构：
   - `/` → `/photos` → `/photos/:id`
   - 写真列表路径为 `/photos`
   - 写真详情路径为 `/photos/:id`

3. WHEN 用户访问最新更新页面 THEN 系统 SHALL 使用以下路由结构：
   - `/` → `/latest` → `/movies/:id` 或 `/photos/:id`
   - 最新更新列表路径为 `/latest`

4. WHEN 用户访问热门内容页面 THEN 系统 SHALL 使用以下路由结构：
   - `/` → `/hot/weekly` → `/movies/:id` 或 `/photos/:id`
   - 7天最热列表路径为 `/hot/weekly`

5. WHEN 路由路径发生变化 THEN 系统 SHALL 更新 ROUTES 常量对象以反映新的路径结构

6. WHEN 路由路径发生变化 THEN 系统 SHALL 确保所有使用旧路径的组件和导航链接都被更新

### Requirement 2: 路由模块化拆分

**User Story:** 作为开发者，我希望将大型路由文件拆分成多个小的模块文件，使得代码更易于维护、测试和扩展

#### Acceptance Criteria

1. WHEN 实现路由模块化 THEN 系统 SHALL 按功能域将路由配置拆分到独立文件中：
   - `authRoutes.ts` - 认证相关路由
   - `userRoutes.ts` - 用户相关路由
   - `movieRoutes.ts` - 影片相关路由
   - `photoRoutes.ts` - 写真相关路由
   - `collectionRoutes.ts` - 合集相关路由
   - `contentRoutes.ts` - 内容浏览相关路由（最新、热门）
   - `adminRoutes.ts` - 管理员相关路由
   - `testRoutes.ts` - 测试页面路由

2. WHEN 拆分路由模块 THEN 每个路由模块文件 SHALL 导出一个返回 RouteObject[] 的函数或常量

3. WHEN 拆分路由模块 THEN 主路由文件 SHALL 导入并组合所有子路由模块

4. WHEN 拆分懒加载导入 THEN 系统 SHALL 将页面组件的懒加载导入移动到各自的路由模块文件中

5. WHEN 拆分路由常量 THEN 系统 SHALL 将 ROUTES 常量对象拆分到独立的 `routePaths.ts` 文件中

6. WHEN 重构完成后 THEN 主路由文件 `routes.tsx` SHALL 不超过 100 行代码

7. WHEN 重构完成后 THEN 系统 SHALL 保持所有现有的路由守卫功能（ProtectedRoute, AdminRoute, GuestRoute）

8. WHEN 重构完成后 THEN 系统 SHALL 保持 Suspense 包装器的行为不变

### Requirement 3: 代码质量和可维护性

**User Story:** 作为开发者，我希望重构后的代码具有良好的可读性、可维护性和可测试性

#### Acceptance Criteria

1. WHEN 创建路由模块文件 THEN 每个文件 SHALL 包含清晰的 JSDoc 注释说明其用途

2. WHEN 定义路由配置 THEN 系统 SHALL 使用 TypeScript 类型确保类型安全

3. WHEN 组织路由文件 THEN 系统 SHALL 遵循一致的文件命名和目录结构约定

4. WHEN 导出路由配置 THEN 系统 SHALL 使用命名导出以提高可读性

5. WHEN 重构完成后 THEN 代码 SHALL 通过现有的 ESLint 和 TypeScript 检查

6. WHEN 路由模块被修改 THEN 开发者 SHALL 能够快速定位和修改特定功能域的路由配置
