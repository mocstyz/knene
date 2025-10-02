# 影视资源网站前端开发规范文档 (DDD架构)

## 1. 项目概述与架构设计

### 1.1 项目信息
- 项目名称：影视资源下载网站前端
- 架构模式：领域驱动设计 (Domain-Driven Design)
- 技术栈：React 18+ + TypeScript 5+
- 构建工具：Vite
- 包管理器：pnpm
- 样式方案：Tailwind CSS + @apply指令 + CSS-in-JS (Emotion)
- 状态管理：Zustand + TanStack Query
- 路由：React Router v6
- UI组件库：Headless UI + Radix UI + 自定义设计系统
- 下载组件：React Download Manager + 进度条组件
- 开发工具：Storybook + React DevTools + Zustand DevTools
- 代码规范：ESLint + Prettier + Husky + lint-staged
- 测试框架：Vitest + React Testing Library + Playwright

### 1.2 DDD架构概述

#### 1.2.1 领域驱动设计原则
- **业务优先**: 代码结构反映业务逻辑
- **领域分离**: 通过有界上下文划分业务边界
- **聚合设计**: 保证数据一致性和业务规则
- **事件驱动**: 通过领域事件实现松耦合

#### 1.2.2 分层架构
```
┌─────────────────────────────────────┐
│        表现层 (Presentation)         │ ← React组件、页面、UI交互
├─────────────────────────────────────┤
│        应用层 (Application)          │ ← 用例服务、应用逻辑协调
├─────────────────────────────────────┤
│        领域层 (Domain)               │ ← 业务实体、值对象、领域服务
├─────────────────────────────────────┤
│        基础设施层 (Infrastructure)   │ ← API调用、数据持久化、外部服务
└─────────────────────────────────────┘
```

### 1.3 业务领域划分

#### 1.3.1 用户管理领域 (User Management)
- **聚合根**: User
- **实体**: UserProfile, UserPreferences
- **值对象**: Email, Password, Avatar
- **领域服务**: AuthenticationService, UserValidationService
- **业务规则**: 用户注册验证、权限管理、账户状态

#### 1.3.2 影片管理领域 (Movie Management)
- **聚合根**: Movie
- **实体**: MovieDetail, MovieCategory, MovieRating
- **值对象**: Title, Genre, Duration, ReleaseDate
- **领域服务**: MovieCatalogService, RatingService
- **业务规则**: 影片分类、评分计算、内容审核

#### 1.3.3 下载管理领域 (Download Management)
- **聚合根**: Download
- **实体**: DownloadTask, DownloadHistory
- **值对象**: DownloadStatus, FileSize, DownloadSpeed
- **领域服务**: DownloadScheduler, DownloadValidator
- **业务规则**: 下载权限、并发限制、存储管理

#### 1.3.4 消息通知领域 (Notification Management)
- **聚合根**: Message
- **实体**: Notification, MessageThread
- **值对象**: MessageContent, MessageType, ReadStatus
- **领域服务**: NotificationService, MessageDeliveryService
- **业务规则**: 消息推送、已读状态、消息归档

#### 1.3.5 管理后台领域 (Admin Management)
- **聚合根**: AdminUser
- **实体**: SystemConfig, UserManagement, ContentModeration
- **值对象**: Permission, Role, AuditLog
- **领域服务**: AdminAuthService, SystemMonitorService
- **业务规则**: 权限控制、系统监控、内容审核

## 2. 代码风格规范

### 2.1 命名规范

#### 2.1.1 文件命名
- 组件文件：PascalCase（如 `MovieCard.tsx`）
- 工具函数文件：camelCase（如 `apiHelper.ts`）
- 常量文件：UPPER_SNAKE_CASE（如 `API_ENDPOINTS.ts`）
- 类型定义文件：camelCase + .types（如 `user.types.ts`）
- Hook文件：camelCase + use（如 `useAuth.ts`）

#### 2.1.2 变量和函数命名
- 变量：camelCase（如 `userName`）
- 常量：UPPER_SNAKE_CASE（如 `MAX_FILE_SIZE`）
- 函数：camelCase（如 `handleLogin`）
- 类名：PascalCase（如 `MovieService`）
- 接口：PascalCase（如 `IUser`）
- 类型别名：PascalCase（如 `MovieType`）

### 2.2 代码格式化

#### 2.2.1 基础规范
- 使用2个空格缩进
- 字符串使用单引号
- 行尾不加分号
- 对象和数组最后一个元素后加逗号
- 使用箭头函数而非function关键字
- 解构赋值优先使用

#### 2.2.2 函数规范
- 组件函数使用函数式组件和Hooks
- 优先使用箭头函数
- 函数参数不超过3个，超过则使用对象参数
- 使用TypeScript严格类型检查

## 3. DDD组件开发规范 (强制执行)

### 3.1 组件最大化复用原则 (强制执行)

**⚠️ 强制要求：所有组件开发必须遵循最大化复用原则，违反者代码不予通过审查。**

#### 3.1.1 复用优先级原则
1. **复用现有组件 > 扩展现有组件 > 创建新组件**
2. **抽象通用逻辑 > 重复实现**
3. **组合模式 > 继承模式**
4. **配置驱动 > 硬编码**

#### 3.1.2 强制复用检查规则

**开发前强制检查**
- [ ] 是否在现有组件库中搜索了相似组件？
- [ ] 是否分析了UI设计稿中的重复元素？
- [ ] 是否制定了组件复用计划？

**开发中强制检查**
- [ ] 新组件是否可以通过配置现有组件实现？
- [ ] 是否提取了可复用的样式和逻辑？
- [ ] 是否使用了@别名导入？

**代码审查强制检查**
- [ ] 是否存在重复的UI实现？
- [ ] 组件API是否具有良好的扩展性？
- [ ] 是否遵循了DDD分层架构？

### 3.2 组件分层架构

#### 3.2.1 原子设计模式结合DDD

**原子组件 (Atoms)**
- **定义**: 最基础的UI元素，对应DDD中的值对象概念
- **特点**: 不可再分割，纯展示功能，无业务逻辑
- **示例**: Button, Input, Label, Icon, Avatar

**分子组件 (Molecules)**
- **定义**: 由多个原子组件组合，对应DDD中的实体概念
- **特点**: 具有特定功能，可复用，包含简单交互逻辑
- **示例**: SearchBox, MovieCard, UserAvatar, DownloadProgress

**有机体组件 (Organisms)**
- **定义**: 复杂的UI区块，对应DDD中的聚合概念
- **特点**: 包含完整的业务功能，管理内部状态
- **示例**: MovieList, UserProfile, DownloadManager, MessageCenter

**模板组件 (Templates)**
- **定义**: 页面级布局结构，对应DDD中的应用服务概念
- **特点**: 定义页面结构，不包含具体内容
- **示例**: AuthTemplate, UserTemplate, AdminTemplate

### 3.3 DDD领域组件规范

#### 3.3.1 实体组件 (Entity Components)
- **定义**: 代表业务实体的组件，具有唯一标识
- **特点**: 包含实体的完整信息和行为
- **命名**: 以实体名称命名，如 `UserProfile`, `MovieDetail`

#### 3.3.2 聚合组件 (Aggregate Components)
- **定义**: 管理相关实体和值对象的组件
- **特点**: 确保业务规则和数据一致性
- **命名**: 以聚合根命名，如 `UserAggregate`, `MovieAggregate`

### 3.4 组件通信规范

#### 3.4.1 领域事件通信
- 使用领域事件实现组件间松耦合通信
- 事件命名采用过去式，如 `MovieSelected`, `DownloadCompleted`

## 4. HTML设计稿迁移策略 (强制执行)

### 4.1 迁移策略：组件化 + 渐进式迁移

**⚠️ 强制要求：HTML设计稿迁移必须100%保持视觉效果，不允许任何UI变化。**

#### 4.1.1 实施步骤

**第一阶段：完整页面组件实现**
- 创建完整的页面组件，确保100%视觉还原
- 保持原有的CSS样式和交互效果
- 验证所有动画、响应式布局、交互行为

**第二阶段：逐步提取可复用组件**
- 识别页面中的重复UI元素
- 提取为可复用的原子、分子组件
- 保持组件API的灵活性和扩展性

**第三阶段：整合到DDD架构**
- 将组件按业务领域分类
- 整合到相应的DDD层级结构
- 实现领域事件和状态管理

#### 4.1.2 视觉保真度要求
- **100%像素级还原**：所有UI元素必须与设计稿完全一致
- **交互行为一致**：所有hover、focus、active状态必须保持
- **响应式布局**：所有断点下的布局必须正确
- **动画效果**：所有过渡动画必须流畅自然

### 4.2 @别名导入导出 (强制执行)

**⚠️ 强制要求：所有导入导出必须使用@别名，禁止使用相对路径。**

#### 4.2.1 Vite配置
```typescript
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/presentation/components'),
      '@pages': path.resolve(__dirname, './src/presentation/pages'),
      '@hooks': path.resolve(__dirname, './src/presentation/hooks'),
      '@services': path.resolve(__dirname, './src/application/services'),
      '@domain': path.resolve(__dirname, './src/domain'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets')
    }
  }
})
```

#### 4.2.2 TypeScript配置
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/presentation/components/*"],
      "@pages/*": ["./src/presentation/pages/*"],
      "@hooks/*": ["./src/presentation/hooks/*"],
      "@services/*": ["./src/application/services/*"],
      "@domain/*": ["./src/domain/*"],
      "@infrastructure/*": ["./src/infrastructure/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"],
      "@assets/*": ["./src/assets/*"]
    }
  }
}
```

#### 4.2.3 ESLint强制规则
```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["../*", "./*"],
            "message": "禁止使用相对路径导入，请使用@别名"
          }
        ]
      }
    ]
  }
}
```

## 5. TypeScript使用规范

### 5.1 类型定义规范
- 所有组件Props必须定义接口
- 使用严格的类型检查
- 避免使用any类型
- 优先使用联合类型而非枚举

### 5.2 泛型使用
- 合理使用泛型提高代码复用性
- 泛型命名使用T、K、V等约定
- 复杂泛型添加注释说明

## 6. DDD状态管理规范

### 6.1 Zustand + TanStack Query架构
- Zustand管理客户端状态
- TanStack Query管理服务端状态
- 按领域划分Store

### 6.2 状态设计原则
- 最小化状态
- 单一数据源
- 不可变更新
- 领域事件驱动

## 7. API调用规范

### 7.1 接口定义
- 使用OpenAPI规范
- 统一错误处理
- 请求响应类型定义

### 7.2 错误处理
- 统一错误码
- 用户友好提示
- 网络异常处理

## 8. 样式规范

### 8.1 CSS命名规范
- 使用BEM命名法
- Tailwind CSS优先
- 组件样式隔离

### 8.2 响应式设计
- 移动端优先
- 断点统一管理
- 弹性布局

## 9. 路由规范

### 9.1 路由结构
- 嵌套路由设计
- 路由守卫实现
- 懒加载优化

### 9.2 权限控制
- 基于角色的访问控制
- 页面访问控制

## 10. 性能优化规范

### 10.1 代码分割
- 路由级别分割
- 组件级别分割
- 第三方库分割

### 10.2 渲染优化
- 虚拟滚动
- 图片懒加载
- 合理使用memo

## 11. 测试规范

### 11.1 测试框架
- 单元测试：Vitest + React Testing Library
- 集成测试：Playwright
- 关键业务逻辑100%覆盖

## 12. 构建部署规范

### 12.1 环境配置
- 开发、测试、生产环境分离
- 环境变量管理
- 缓存策略

## 13. 错误处理和监控策略

### 13.1 错误边界实现
- React错误边界
- 全局错误处理
- 用户友好错误页面

### 13.2 性能监控
- 核心Web指标监控
- 用户行为分析
- 错误日志收集

## 14. 安全规范

### 14.1 跨站脚本攻击(XSS)防护
- 输入验证和过滤
- 输出编码
- Content Security Policy

### 14.2 跨站请求伪造(CSRF)防护
- CSRF Token验证
- SameSite Cookie设置
- 请求来源验证

## 15. Git提交规范

### 15.1 提交信息格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 15.2 提交类型
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构
- test: 测试相关
- chore: 构建工具或辅助工具的变动

## 16. 代码审查规范

### 16.1 审查要点
- 代码质量和规范
- 业务逻辑正确性
- 性能和安全考虑
- 测试覆盖率

## 17. 开发体验优化

### 17.1 Storybook集成
- 组件文档化
- 交互式开发
- 视觉回归测试

### 17.2 开发工具配置
- VSCode配置
- 调试工具
- 热重载优化

## 18. DDD项目结构规范

### 18.1 整体架构结构
```
src/
├── presentation/          # 表现层
│   ├── components/       # UI组件
│   ├── pages/           # 页面组件
│   └── hooks/           # 自定义Hooks
├── application/          # 应用层
│   ├── services/        # 应用服务
│   └── usecases/        # 用例
├── domain/              # 领域层
│   ├── entities/        # 实体
│   ├── valueObjects/    # 值对象
│   └── services/        # 领域服务
├── infrastructure/      # 基础设施层
│   ├── api/            # API调用
│   ├── storage/        # 存储
│   └── external/       # 外部服务
├── types/              # 类型定义
└── utils/              # 工具函数
```

### 18.2 领域边界划分
- 用户管理 (User Management)
- 影片管理 (Movie Management)  
- 下载管理 (Download Management)
- 消息通知 (Notification Management)
- 管理后台 (Admin Management)

## 19. 开发工具配置

### 19.1 ESLint配置
- TypeScript规则
- React规则
- 自定义规则

### 19.2 Prettier配置
- 代码格式化
- 与ESLint集成
- 保存时自动格式化

### 19.3 Husky + lint-staged
- 提交前代码检查
- 自动格式化
- 测试运行