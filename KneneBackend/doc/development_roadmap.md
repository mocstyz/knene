# 电影网站系统前后端统一开发路线图

## 概述

本文档基于项目模块分解计划，按照开发优先级和依赖关系重新组织内容，提供清晰的阶段性开发路线图。整个项目分为5个主要阶段，每个阶段都有明确的目标和可交付成果。

**开发策略：后端主导，前端适配**
- 后端定义API接口规范和数据结构，前端严格遵循
- 以后端业务逻辑完整性为准，前端页面适配后端功能
- 后端领域模型和数据结构是前端实现的唯一标准
- 每个阶段先完成后端功能，再进行前端适配

**数据库优先开发原则**
- 优先设计数据库结构和表关系
- 插入充足的测试数据（每个表50-100条记录）
- 基于真实数据库数据进行前端开发
- 所有API调用都基于真实数据响应

## 前端项目现状分析

**技术架构：**
- React 18.2.0 + TypeScript 5.2.2 + Vite 5.0.0
- DDD分层架构设计（与后端架构理念一致）
- Zustand状态管理 + TanStack Query
- Tailwind CSS + Radix UI Primitives

**现有组件基础：**
- 已有基础组件架构（原子、分子、有机体组件）
- 已有页面组件骨架（但功能未实现）
- 已有路由守卫和权限控制框架
- 已有统一的组件设计和开发规范

**适配策略：**
- 基于后端API实现现有组件的具体功能
- 严格遵循后端数据结构和接口规范
- 实现完整的前后端功能集成

## 开发策略核心原则

### 模块依赖处理策略
1. **数据库优先原则**：优先设计数据库结构，插入测试数据
2. **依赖注入模式**：使用Spring的依赖注入解耦模块间关系
3. **核心功能优先**：优先实现依赖模块的核心功能
4. **契约式设计**：事先定义模块间的数据交换格式和API契约
5. **适配器模式**：使用适配器隔离外部依赖变化

### 数据驱动开发策略
- 基于真实数据库数据进行开发
- 通过测试数据验证业务逻辑
- 使用真实数据支持前端开发
- 采用数据驱动的增量集成策略

---

## 第一阶段：核心基础功能实现与前端基础适配（11.5周）

### 阶段目标
建立系统基础架构，实现用户认证和基础资源管理功能，完成前端基础页面适配，确保核心业务流程可用。

**阶段开发顺序：**
1. **数据库设计**（第1周）：设计核心表结构（用户、角色、权限、资源等），插入测试数据
2. **后端开发**（第2-7周）：实现所有核心API和业务逻辑
3. **前端适配**（第3-8周）：基于真实API和数据实现前端功能
4. **集成测试**（持续进行）：实时验证前后端功能集成

**阶段交付标准：**
- 后端：用户认证系统完整可用，基础资源管理API全部实现
- 前端：用户认证页面功能完整，基础资源浏览页面可用
- 集成：前后端用户流程完整，API调用无错误

### 1.1 基础架构层（2.5周）

#### 1.1.1 核心配置模块（优先级：最高）- 1天
- 项目骨架搭建
  - 创建Maven项目结构
  - 配置pom.xml依赖管理
  - 设置基础目录结构
- 应用配置管理
  - 环境配置文件创建（dev/test/prod）
  - 通用配置属性定义
  - 配置加载与验证机制
- 日志系统配置
  - 日志级别与输出配置
  - 日志切面实现
  - 操作日志记录工具类

#### 1.1.2 数据库设计与实施（优先级：最高）- 5天
- 数据库设计
  - 实体关系图设计
  - 表结构设计（用户、资源、内容、VIP、积分、签到、系统管理）
  - 索引与约束设计
- 数据库设计规范与标准
  - 表结构设计规范
  - 索引设计指导原则
  - 数据字典管理
- 数据库性能优化
  - 查询优化指导
  - 数据库参数调优

#### 1.1.3 缓存基础设施设计（优先级：高）- 2天
- Redis基础架构设计
  - Redis集群规划：主从复制+哨兵模式
  - Redis数据分片策略：按业务模块分库
  - Redis连接池配置：Lettuce客户端集成
  - Redis序列化策略：JSON序列化与二进制序列化选择
- Redis基础配置
  - Redis多环境配置（dev/test/prod）
  - 连接超时与重试机制配置
  - Redis密码认证配置
  - Redis监控与日志配置
- 缓存抽象层设计
  - 缓存接口定义：CacheManager抽象接口
  - 缓存操作封装：基础CRUD操作接口
  - 缓存策略定义：TTL策略、过期策略、淘汰策略
  - 缓存异常处理：Redis故障时的降级策略

#### 1.1.4 数据访问基础架构（优先级：高）- 2.5天
- 数据库连接池设计
  - Druid连接池选型与配置
  - 连接池配置策略
  - 多数据源支持
- 数据库连接配置
  - Druid连接池集成
  - 数据源配置
  - 连接池参数优化
- 基础持久化框架
  - MyBatis-Plus配置
  - 通用Mapper实现
  - 分页插件配置
- 数据库版本管理
  - Flyway集成与配置
  - 基础数据库脚本创建
  - 数据初始化脚本
  - 数据库版本管理与迁移

#### 1.1.5 通用工具模块（优先级：中）- 2天
- 异常处理框架
  - 自定义异常类层次结构
  - 全局异常处理器
  - 错误码系统实现
- 通用工具类库
  - 字符串处理工具
  - 日期时间工具
  - 加密解密工具
  - ID生成工具
- 响应结果封装
  - 统一响应对象定义
  - 成功/失败结果构建
  - 分页结果封装

#### 1.1.6 安全基础设施（优先级：高）- 1.5天
- 密码加密系统
  - BCrypt加密实现
  - 密码加密接口定义
  - 密码强度验证工具
- JWT工具模块
  - Token生成工具
  - Token解析与验证
  - 刷新Token机制
- 安全过滤器
  - 认证过滤器
  - 授权过滤器
  - 跨域配置

### 1.2 前端埋点系统（1周）【与用户系统并行开发】

#### 1.2.1 埋点技术架构设计 - 2天
- 技术栈选型确认：GA4 + Hotjar + Google Data Studio
- 埋点SDK架构设计：统一埋点接口设计
- 数据收集架构：前端埋点 + 后端事件同步
- 数据流向设计：前端 → GA4/Hotjar → Data Studio → 展示

#### 1.2.2 埋点SDK开发 - 3天
- 统一埋点SDK：封装GA4和Hotjar集成
- 自动数据收集：页面浏览、用户信息、设备信息
- 事件追踪接口：统一的事件追踪API
- 数据验证机制：埋点数据格式和完整性验证

#### 1.2.3 基础埋点实施与集成 - 2天
- 页面访问埋点：自动页面浏览追踪
- 用户交互埋点：点击、滚动、表单交互
- 错误监控埋点：JavaScript错误、API错误
- 性能监控埋点：页面加载时间、API响应时间
- GA4配置与集成
- Hotjar配置与集成
- Google Data Studio报表开发

### 1.3 用户认证与权限系统（2周）

#### 1.3.1 后端：用户领域模型（优先级：最高）- 1天
- 用户实体模型
  - User领域实体
  - 值对象定义（如Email、Password等）
  - 实体间关系定义
- 用户仓储接口
  - UserRepository接口定义
  - 查询方法签名设计
  - 更新方法签名设计
- 用户领域服务接口
  - UserService接口定义
  - 服务方法签名设计
  - 领域事件定义

#### 1.3.2 前端：认证系统适配（并行开发）
**适配目标：**基于后端认证API实现完整的用户认证流程

**页面适配任务：**
- 登录页面功能实现（基于后端 `/api/v1/auth/login` API）
- 注册页面功能实现（基于后端 `/api/v1/auth/register` API）
- 忘记密码页面功能实现（基于后端 `/api/v1/auth/forgot-password` API）
- 密码重置页面功能实现（基于后端 `/api/v1/auth/reset-password` API）

**技术适配要求：**
- 前端用户数据结构必须严格遵循后端User实体
- JWT Token存储和管理机制（基于后端Token格式）
- 前端路由守卫实现（基于后端权限验证API）
- 错误处理与后端错误码映射

**数据结构适配：**
```typescript
// 前端类型定义必须与后端一致
export interface UserProfile {
  id: number
  username: string
  email: string
  avatar?: string
  isVip: boolean
  vipExpireAt?: string
  createdAt: string
}

export interface LoginRequest {
  username: string  // 支持用户名或邮箱
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: UserProfile
}
```

#### 1.3.3 后端：认证核心模块（优先级：最高）- 4天
- 用户注册功能
  - 注册DTO与验证
  - 用户唯一性检查
  - 密码加密处理
  - 用户初始化逻辑
  - 注册事件发布
- 用户登录功能
  - 登录DTO与验证
  - 用户认证逻辑
  - JWT令牌生成
  - 登录历史记录
  - 登录尝试限制
- 账户验证功能
  - 邮箱验证流程
  - 验证码生成与发送
  - 验证激活处理
- 密码管理功能
  - 密码重置请求
  - 重置链接生成与发送
  - 新密码设置
  - 密码修改逻辑
  - 密码历史管理

#### 1.3.4 前端：认证功能集成开发（并行开发）
**适配目标：**实现完整的认证流程和状态管理

**核心功能实现：**
- 基于Zustand的用户状态管理（适配后端用户数据）
- API调用服务封装（基于后端认证API）
- 表单验证逻辑（适配后端验证规则）
- 错误处理和用户反馈（映射后端错误码）

**组件功能完善：**
- 登录表单组件：实现完整的登录逻辑和状态管理
- 注册表单组件：实现注册流程和验证逻辑
- 密码重置组件：实现密码重置流程
- 认证状态管理：实现全局认证状态和权限控制

**技术实现要求：**
- 使用TanStack Query管理API调用状态
- 实现Token自动刷新机制
- 实现登录状态持久化
- 实现路由权限守卫

#### 1.3.5 后端：权限管理模块（优先级：高）- 5天
- 角色管理功能
  - 角色定义与关系
  - 角色CRUD操作
  - 用户-角色关联
- 权限模型实现
  - 权限定义与分类
  - 权限-角色映射
  - 权限检查服务
- 动态权限控制
  - 权限变更API
  - 权限缓存更新
  - 按功能权限分配
- 权限校验切面
  - 注解式权限控制
  - 接口权限验证
  - 数据权限过滤

#### 1.3.6 前端：权限系统适配（并行开发）
**适配目标：**基于后端权限系统实现前端权限控制

**权限适配任务：**
- 前端权限常量定义（基于后端权限模型）
- 路由守卫实现（基于后端权限验证API）
- 角色权限控制组件（适配后端角色系统）
- 用户权限显示和管理

**技术适配要求：**
- 前端权限数据结构必须严格遵循后端权限模型
- 实现权限检查Hook（基于后端权限API）
- 实现动态权限更新（基于后端权限变更事件）
- 实现权限缓存机制（适配后端权限缓存）

**权限控制实现：**
```typescript
// 前端权限定义必须与后端一致
export const PERMISSIONS = {
  USER_VIEW: 'user:view',
  USER_UPDATE: 'user:update',
  MOVIE_VIEW: 'movie:view',
  MOVIE_DOWNLOAD: 'movie:download',
  ADMIN_PANEL: 'admin:panel'
} as const

export const ROLES = {
  USER: 'user',
  VIP: 'vip',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
} as const
```

#### 1.3.7 后端：用户管理模块（优先级：高）- 4天
- 用户信息管理
  - 用户资料CRUD
  - 头像URL管理
  - 个人设置存储
- 用户状态管理
  - 用户激活/停用
  - 账户锁定/解锁
  - 用户黑名单管理
- 用户查询功能
  - 条件查询实现
  - 分页查询优化
  - 高级筛选功能

### 1.4 Redis缓存基础实施（1周）【与资源系统并行开发】

#### 1.4.1 后端：基础缓存功能实施（优先级：高）- 3天
- 用户会话缓存
  - 用户登录状态缓存：Key格式 `auth:user:session:{userId}`，TTL 2小时
  - 用户权限信息缓存：Key格式 `auth:user:permissions:{userId}`，TTL 30分钟
  - 用户基本信息缓存：Key格式 `user:info:{userId}`，TTL 1小时
- 系统配置缓存
  - 系统配置项缓存：Key格式 `config:system:{config_key}`，TTL 24小时
  - 字典数据缓存：Key格式 `dict:{type}`，TTL 12小时
  - 权限配置缓存：Key格式 `auth:permissions:all`，TTL 6小时
- 验证码缓存
  - 邮箱验证码缓存：Key格式 `verify:email:{email}`，TTL 10分钟
  - 手机验证码缓存：Key格式 `verify:sms:{phone}`，TTL 5分钟
  - 图形验证码缓存：Key格式 `verify:captcha:{session_id}`，TTL 5分钟

#### 1.4.2 前端：缓存策略适配（并行开发）
**适配目标：**基于后端Redis缓存实现前端状态管理和性能优化

**状态管理适配：**
- 基于Zustand实现用户状态缓存（适配后端用户会话缓存）
- 实现权限状态缓存（适配后端权限信息缓存）
- 实现系统配置缓存（适配后端配置缓存）
- 实现验证码状态管理（适配后端验证码缓存）

**技术适配要求：**
- 前端缓存失效策略与后端TTL同步
- 实现缓存预加载机制（基于后端缓存预热）
- 实现缓存错误处理（后端缓存不可用时的降级策略）
- 实现缓存一致性保证（与后端缓存更新同步）

**缓存Hook实现：**
```typescript
// 用户状态缓存Hook
export const useUserCache = () => {
  const [user, setUser] = useUserStore()

  // 缓存用户信息，TTL与后端一致（1小时）
  const cacheUserInfo = useCallback((userInfo: UserProfile) => {
    setUser(userInfo)
    localStorage.setItem('user_cache', JSON.stringify(userInfo))
    localStorage.setItem('user_cache_time', Date.now().toString())
  }, [])

  // 检查缓存是否过期
  const isCacheValid = useCallback(() => {
    const cacheTime = localStorage.getItem('user_cache_time')
    return cacheTime && (Date.now() - parseInt(cacheTime)) < 3600000 // 1小时
  }, [])

  return { cacheUserInfo, isCacheValid }
}
```

**组件缓存优化：**
- 实现数据预取（基于用户行为预测）
- 实现组件级缓存（减少重复渲染）
- 实现路由级缓存（提升页面切换性能）
- 实现图片缓存策略（优化图片加载）

#### 1.4.3 后端：缓存中间件集成（优先级：高）- 2天
- Spring Cache集成
  - @Cacheable注解配置
  - @CacheEvict注解配置
  - @CachePut注解配置
  - 缓存键生成策略配置
- Redis Template配置
  - RedisTemplate<String, Object>配置
  - StringRedisTemplate配置
  - 序列化器配置（JSON、String）
  - 连接工厂配置
- 缓存切面实现
  - 缓存操作日志记录
  - 缓存命中率统计
  - 缓存异常处理
  - 缓存性能监控

#### 1.4.4 前端：缓存集成开发（并行开发）
**适配目标：**实现前端与后端缓存系统的完整集成

**TanStack Query集成：**
- 配置查询缓存（适配后端缓存TTL）
- 实现查询失效策略（与后端缓存同步）
- 实现乐观更新（适配后端数据更新）
- 实现分页查询缓存（适配后端分页API）

**缓存配置示例：**
```typescript
// TanStack Query配置
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟，与后端缓存同步
      cacheTime: 10 * 60 * 1000, // 10分钟
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
})

// 用户查询Hook
export const useUserQuery = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUserInfo,
    staleTime: 30 * 60 * 1000, // 30分钟，与后端用户缓存TTL一致
  })
}
```

**缓存协调机制：**
- 实现前端缓存失效通知（监听后端缓存更新事件）
- 实现多标签页缓存同步
- 实现离线缓存支持（PWA）
- 实现缓存预热策略

#### 1.4.5 后端：分布式锁基础实现（优先级：中）- 2天
- 分布式锁接口设计
  - 分布式锁抽象接口定义
  - 锁获取与释放方法设计
  - 锁续期机制设计
  - 锁超时处理机制
- Redis分布式锁实现
  - 基于SET NX EX的简单锁实现
  - RedLock算法实现（高可用分布式锁）
  - 锁重试机制实现
  - 锁释放的安全机制
- 分布式锁应用场景
  - 用户注册时的唯一性检查锁
  - 资源更新时的并发控制锁
  - 积分变动时的事务锁

### 1.5 资源模型与基础管理（2周）

#### 1.5.1 后端：资源领域模型（优先级：最高）- 2天
- 资源实体定义
  - Resource核心实体
  - 资源类型与状态定义
  - 资源元数据模型
- 资源仓储接口
  - ResourceRepository接口
  - 查询方法签名设计
  - 更新方法签名设计
- 资源领域服务
  - ResourceService接口
  - 资源操作方法定义
  - 资源领域事件定义

#### 1.5.2 基础爬虫框架（优先级：高）- 3天
- 爬虫抽象层
  - 爬虫任务接口
  - 页面解析抽象类
  - 代理管理组件
- HTTP工具模块
  - HTTP客户端封装
  - 请求重试机制
  - 响应解析工具
- 任务调度系统
  - 任务队列管理
  - 定时任务框架
  - 并发控制策略

#### 1.5.3 普通资源爬取模块（优先级：高）- 4天
- TorrentGalaxy爬虫
  - 页面解析实现
  - 资源提取逻辑
  - 下载链接提取（记录外部BT链接地址）
  - 元数据标准化
- IMDB信息集成
  - IMDB API客户端
  - 影片信息匹配
  - 数据融合处理
- 豆瓣信息爬取
  - 豆瓣页面解析
  - 中文影片信息提取
  - 评分与评论获取

#### 1.5.4 图片处理模块（优先级：中）- 3天
- 图片下载功能
  - 图片URL抽取
  - 图片下载实现
  - 图片格式验证
- 图床上传功能
  - 图床API客户端
  - 图片上传处理
  - 上传结果处理
- 图片缓存管理
  - 原站图片缓存
  - 缓存策略实现
  - 失效检测与处理

#### 1.5.5 后端：资源管理模块（优先级：高）- 4天
- 资源创建更新
  - 资源保存逻辑
  - 资源更新处理
  - 资源状态管理
- 资源查询功能
  - 基础查询实现
  - 条件筛选功能
  - 分页性能优化
- 资源分类管理
  - 分类体系实现
  - 资源分类映射
  - 分类统计功能

#### 1.5.6 前端：资源展示系统适配（并行开发）
**适配目标：**基于后端资源API实现完整的内容展示系统

**页面适配任务：**
- 首页内容展示（基于后端 `/api/v1/resources/home` API）
- 影片详情页面（基于后端 `/api/v1/resources/{id}` API）
- 分类浏览页面（基于后端 `/api/v1/resources/category/{category}` API）
- 搜索功能页面（基于后端 `/api/v1/resources/search` API）

**技术适配要求：**
- 前端资源数据结构必须严格遵循后端Resource实体
- 实现资源列表分页和筛选（适配后端分页API）
- 实现搜索功能（适配后端搜索API）
- 实现资源缓存机制（适配后端缓存策略）

**数据结构适配：**
```typescript
// 前端类型定义必须与后端一致
export interface Resource {
  id: number
  title: string
  description: string
  category: string
  type: 'movie' | 'photo' | 'collection'
  status: 'active' | 'inactive' | 'pending'
  poster?: string
  screenshots: string[]
  metadata: {
    year?: number
    genre?: string[]
    rating?: number
    duration?: number
    fileSize?: number
    quality?: string
  }
  createdAt: string
  updatedAt: string
}

export interface ResourceListResponse {
  content: Resource[]
  page: number
  size: number
  total: number
  totalPages: number
}
```

**组件功能实现：**
- 资源卡片组件：展示资源基础信息
- 资源列表组件：实现分页和筛选
- 搜索组件：实现搜索功能
- 详情页面组件：展示完整资源信息

### 1.6 内容管理基础功能（2周）

#### 1.6.1 后端：内容领域模型（优先级：高）- 1天
- 文章实体定义
  - Article领域实体
  - 文章状态与类型
  - 文章元数据模型
- 知识库实体定义
  - WikiEntry领域实体
  - 知识点类型定义
  - 版本历史模型
- 内容仓储接口
  - ArticleRepository接口
  - WikiRepository接口
  - 查询方法签名设计

#### 1.6.2 前端：新闻公告系统适配（并行开发）
**适配目标：**基于后端内容管理API实现完整的新闻公告功能

**页面适配任务：**
- 新闻公告列表页面（基于后端 `/api/v1/articles` API）
- 新闻公告详情页面（基于后端 `/api/v1/articles/{id}` API）
- 分类新闻页面（基于后端 `/api/v1/articles/category/{category}` API）

**技术适配要求：**
- 前端文章数据结构严格遵循后端Article实体
- 实现文章列表分页和筛选（适配后端分页API）
- 实现文章搜索功能（适配后端搜索API）
- 实现文章状态管理（适配后端文章状态）

**数据结构适配：**
```typescript
// 前端类型定义必须与后端一致
export interface Article {
  id: number
  title: string
  content: string
  summary?: string
  author: string
  category: string
  tags: string[]
  status: 'published' | 'draft' | 'archived'
  isTop: boolean
  viewCount: number
  likeCount: number
  commentCount: number
  publishedAt: string
  createdAt: string
  updatedAt: string
}
```

**组件功能实现：**
- 文章卡片组件：展示文章基础信息
- 文章列表组件：实现分页和筛选
- 搜索组件：实现文章搜索功能
- 详情页面组件：展示完整文章内容
- 评论组件：实现评论互动功能

#### 1.6.3 后端：新闻管理模块（优先级：中）- 4天
- 文章管理功能
  - 文章CRUD操作
  - 文章状态控制
  - 文章排序管理
- 分类标签系统
  - 分类管理功能
  - 标签管理功能
  - 文章分类映射
- 文章查询功能
  - 基础查询实现
  - 条件筛选功能
  - 相关文章推荐
- 评论互动功能
  - 评论系统实现
  - 点赞功能开发
  - 分享功能集成

#### 1.6.4 前端：帮助文档系统适配（并行开发）
**适配目标：**基于后端WIKI知识库API实现完整的帮助文档功能

**页面适配任务：**
- 帮助文档首页（基于后端 `/api/v1/wiki/home` API）
- 知识目录页面（基于后端 `/api/v1/wiki/categories` API）
- 知识详情页面（基于后端 `/api/v1/wiki/{id}` API）
- 帮助文档搜索页面（基于后端 `/api/v1/wiki/search` API）

**技术适配要求：**
- 前端知识条目数据结构严格遵循后端WikiEntry实体
- 实现知识目录树形结构（适配后端目录体系）
- 实现全文搜索功能（适配后端搜索API）
- 实现内部链接解析（适配后端链接系统）

**数据结构适配：**
```typescript
// 前端类型定义必须与后端一致
export interface WikiEntry {
  id: number
  title: string
  content: string
  summary?: string
  category: string
  tags: string[]
  status: 'published' | 'draft' | 'reviewing'
  author: string
  contributor?: string
  version: number
  viewCount: number
  parentEntryId?: number
  childEntries: WikiEntry[]
  internalLinks: WikiLink[]
  createdAt: string
  updatedAt: string
}

export interface WikiLink {
  id: number
  sourceEntryId: number
  targetEntryId: number
  linkText: string
  linkType: 'internal' | 'external'
}
```

**组件功能实现：**
- 知识卡片组件：展示知识条目基础信息
- 知识目录组件：实现树形目录结构
- 搜索组件：实现知识搜索功能
- 详情页面组件：展示完整知识内容
- 导航组件：实现知识导航和面包屑

#### 1.6.5 后端：WIKI知识库模块（优先级：中）- 5天
- 知识点管理
  - 知识条目CRUD
  - 版本历史记录
  - 贡献者跟踪
- 知识结构管理
  - 目录体系实现
  - 知识点关联
  - 内部链接系统
- 搜索功能实现
  - 全文搜索集成
  - 关键词索引
  - 搜索结果排序
- 用户贡献系统
  - 编辑建议提交
  - 修改审核流程
  - 贡献积分系统

### 1.7 测试体系构建（1周，基础部分）

#### 1.7.1 后端：测试基础设施（优先级：高）- 3天
- 测试环境搭建
  - 单元测试环境配置
  - 集成测试环境搭建
  - 测试数据准备策略
  - 数据库测试环境配置
- 测试框架集成
  - JUnit5 + Mockito配置
  - Testcontainers集成测试
  - 测试覆盖率工具配置
  - 测试报告生成

#### 1.7.2 前端：测试基础设施适配（并行开发）
**适配目标：**基于后端测试体系实现完整的前端测试覆盖

**测试环境配置：**
- 前端单元测试环境配置（Vitest + React Testing Library）
- E2E测试环境搭建（Playwright）
- 后端API测试环境配置
- 测试数据库数据管理策略

**测试框架集成：**
```typescript
// Vitest配置示例
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

**测试类型适配：**
- 组件单元测试（基于后端数据结构）
- API集成测试（基于后端API规范）
- 用户交互测试（基于用户流程）
- 性能测试（基于性能标准）

#### 1.7.3 后端：基础测试策略（优先级：高）- 2天
- 单元测试实施
  - 核心业务逻辑单元测试
  - Repository层测试策略
  - Service层测试实施
  - 工具类测试覆盖
- 集成测试实施
  - API接口集成测试
  - 数据库集成测试
  - 外部服务集成测试
  - 消息队列测试

#### 1.7.4 前端：测试策略实施（并行开发）
**适配目标：**实现前后端一致的测试策略

**组件测试实施：**
```typescript
// 组件测试示例
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserCard } from '@components/molecules'

describe('UserCard', () => {
  const mockUser: UserProfile = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    isVip: false,
    createdAt: '2024-01-01T00:00:00Z'
  }

  it('renders user information correctly', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <UserCard user={mockUser} />
      </QueryClientProvider>
    )

    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })
})
```

**API测试实施：**
- 真实API服务集成测试
- API响应测试（验证数据格式正确）
- 错误处理测试（验证错误处理正确）
- 性能测试（验证加载性能）

**E2E测试实施：**
- 用户流程测试（注册→登录→使用功能）
- 跨浏览器测试（Chrome、Firefox、Safari）
- 移动端适配测试
- 性能测试（页面加载速度）

---

## 第二阶段：核心业务功能实现与前端适配（8周）

### 阶段目标
实现VIP系统、支付功能、资源获取和网盘集成等核心业务功能，完成前端高级功能适配，确保核心业务流程完整可用。

**阶段交付标准：**
- 后端：VIP系统、支付系统、下载管理功能完整可用
- 前端：VIP相关页面、支付流程页面、下载管理页面完整可用
- 集成：前后端业务流程完整，支付下载等核心功能正常

### 2.1 VIP系统与支付功能（2周）

#### 2.1.1 后端：会员领域模型（优先级：高）- 1天
- 会员实体定义
  - VipMembership实体
  - 会员等级与权益
  - 会员状态定义
- 订单实体定义
  - Order实体模型
  - 订单状态流转
  - 支付记录关联
- 会员仓储接口
  - VipRepository接口
  - OrderRepository接口
  - 查询方法签名设计

#### 2.1.2 前端：VIP会员系统适配（并行开发）
**适配目标：**基于后端VIP系统API实现完整的会员功能

**页面适配任务：**
- VIP会员介绍页面（基于后端 `/api/v1/vip/plans` API）
- 会员购买页面（基于后端 `/api/v1/vip/purchase` API）
- 会员中心页面（基于后端 `/api/v1/vip/dashboard` API）
- 会员特权说明页面（基于后端 `/api/v1/vip/benefits` API）

**技术适配要求：**
- 前端VIP数据结构严格遵循后端VipMembership实体
- 实现会员等级权益显示（适配后端权益配置）
- 实现会员状态管理（适配后端会员状态）
- 实现会员特权控制（适配后端权限验证）

**数据结构适配：**
```typescript
// 前端类型定义必须与后端一致
export interface VipMembership {
  id: number
  userId: number
  vipLevel: 'basic' | 'premium' | 'ultimate'
  status: 'active' | 'expired' | 'pending'
  startDate: string
  endDate: string
  autoRenew: boolean
  benefits: VipBenefit[]
  createdAt: string
  updatedAt: string
}

export interface VipBenefit {
  id: number
  name: string
  description: string
  type: 'download_unlimited' | 'priority_support' | 'exclusive_content'
  isActive: boolean
}

export interface VipPlan {
  id: number
  name: string
  duration: number // 月数
  price: number
  originalPrice: number
  currency: string
  benefits: string[]
  isPopular?: boolean
}
```

**组件功能实现：**
- VIP会员卡片组件：展示会员信息和特权
- 会员等级展示组件：展示不同等级权益
- 购买流程组件：实现会员购买流程
- 会员状态组件：显示会员状态和到期时间

#### 2.1.3 后端：会员管理模块（优先级：高）- 3天
- 会员等级体系
  - 等级定义与配置
  - 会员权益设置
  - 等级升降规则
- 会员状态管理
  - 会员激活逻辑
  - 到期处理机制
  - 自动续费设置
- 会员特权控制
  - 下载次数控制
  - VIP资源访问
  - 特殊功能开放

#### 2.1.4 前端：支付系统适配（并行开发）
**适配目标：**基于后端支付系统API实现完整的支付流程

**页面适配任务：**
- 支付选择页面（基于后端 `/api/v1/payment/methods` API）
- 订单确认页面（基于后端 `/api/v1/orders/confirm` API）
- 支付处理页面（基于后端 `/api/v1/payment/process` API）
- 支付结果页面（基于后端 `/api/v1/payment/result` API）

**技术适配要求：**
- 前端订单数据结构严格遵循后端Order实体
- 实现支付状态管理（适配后端订单状态）
- 实现支付结果处理（适配后端支付回调）
- 实现安全支付流程（适配后端安全验证）

**数据结构适配：**
```typescript
// 前端类型定义必须与后端一致
export interface Order {
  id: number
  orderNo: string
  userId: number
  vipPlanId: number
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'cancelled' | 'refunded'
  paymentMethod: 'alipay' | 'wechat' | 'credit_card'
  paymentUrl?: string
  paidAt?: string
  expiredAt: string
  createdAt: string
  updatedAt: string
}

export interface PaymentRequest {
  orderId: number
  paymentMethod: 'alipay' | 'wechat'
  returnUrl: string
  notifyUrl: string
}

export interface PaymentResponse {
  success: boolean
  paymentUrl?: string
  orderId: number
  message: string
}
```

**组件功能实现：**
- 支付方式选择组件：支持多种支付方式
- 订单确认组件：展示订单详情和价格
- 支付处理组件：处理支付流程和状态
- 支付结果组件：显示支付成功或失败结果

**安全适配：**
- 实现支付防重复提交
- 实现支付超时处理
- 实现支付状态实时查询
- 实现支付结果验证

#### 2.1.5 后端：支付系统模块（优先级：中）- 4天
- 支付通道集成
  - 支付宝接口
  - 微信支付接口
  - 其他支付方式
- 订单管理系统
  - 订单创建流程
  - 订单状态管理
  - 订单查询功能
- 支付通知处理
  - 支付回调处理
  - 订单完成逻辑
  - 会员状态更新
- 交易记录管理
  - 交易历史存储
  - 交易记录查询
  - 交易统计分析

#### 2.1.4 营销活动模块（优先级：低）- 2天
- 优惠券系统
  - 优惠券类型定义
  - 优惠券生成发放
  - 优惠券使用规则
- 促销活动管理
  - 活动类型定义
  - 活动规则配置
  - 活动效果统计
- 会员推荐系统
  - 推荐码生成
  - 推荐奖励处理
  - 推荐跟踪分析

### 2.2 爬虫系统与资源获取（3周）

#### 2.2.1 后端：VIP资源爬取模块（优先级：中）- 4天
- SpringSunday爬虫
  - PT站登录认证
  - 资源页面解析
  - 种子获取与下载
- 资源下载处理
  - qBittorrent客户端集成（用于临时下载和做种）
  - 下载任务管理（下载到临时服务器）
  - 下载完成处理（触发上传到115网盘流程）

#### 2.2.2 前端：VIP资源获取管理适配（并行开发）
**适配目标：**基于后端资源获取系统实现完整的VIP资源管理功能

**页面适配任务：**
- VIP资源求片页面（基于后端 `/api/v1/requests` API）
- 求片状态查询页面（基于后端 `/api/v1/requests/{id}/status` API）
- VIP资源下载页面（基于后端 `/api/v1/downloads/vip` API）
- 下载历史页面（基于后端 `/api/v1/downloads/history` API）

**技术适配要求：**
- 前端请求数据结构严格遵循后端Request实体
- 实现求片状态管理（适配后端请求状态）
- 实现VIP下载权限控制（适配后端权限验证）
- 实现下载进度跟踪（适配后端下载状态）

**数据结构适配：**
```typescript
// 前端类型定义必须与后端一致
export interface ResourceRequest {
  id: number
  userId: number
  title: string
  description?: string
  category: string
  tags: string[]
  priority: 'low' | 'normal' | 'high'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  resourceUrl?: string
  downloadUrl?: string
  isVip: boolean
  createdAt: string
  updatedAt: string
}

export interface VipDownloadRecord {
  id: number
  userId: number
  resourceId: number
  resourceTitle: string
  downloadUrl: string
  fileType: 'magnet' | 'direct' | '115'
  fileSize?: number
  downloadCount: number
  status: 'pending' | 'downloading' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
}
```

**VIP特权展示：**
- VIP求片优先级显示
- VIP下载特权说明
- VIP专属资源标记
- VIP下载速度提升

#### 2.2.3 后端：求片系统模块（优先级：中）- 4天
- 求片请求管理
  - 求片请求创建
  - 请求状态管理
  - 请求列表查询
- 自动搜索引擎
  - PT站搜索客户端
  - 搜索结果解析
  - 资源匹配算法
- 处理流程自动化
  - 自动下载流程（临时下载到服务器，处理完成后删除）
  - 自动上传网盘
  - 资源入库处理
- 通知反馈系统
  - 处理状态更新
  - 完成通知发送
  - 用户反馈收集

#### 2.2.4 前端：签到积分系统适配（并行开发）
**适配目标：**基于后端签到积分系统实现完整的用户激励功能

**页面适配任务：**
- 每日签到页面（基于后端 `/api/v1/signin/daily` API）
- 签到日历页面（基于后端 `/api/v1/signin/calendar` API）
- 积分商城页面（基于后端 `/api/v1/points/shop` API）
- 积分明细页面（基于后端 `/api/v1/points/transactions` API）

**技术适配要求：**
- 前端签到数据结构严格遵循后端SigninRecord实体
- 实现签到状态管理（适配后端签到状态）
- 实现积分余额显示（适配后端积分账户）
- 实现积分兑换流程（适配后端兑换系统）

**数据结构适配：**
```typescript
// 前端类型定义必须与后端一致
export interface SigninRecord {
  id: number
  userId: number
  signinDate: string
  consecutiveDays: number
  pointsEarned: number
  bonusPoints?: number
  createdAt: string
}

export interface PointsAccount {
  id: number
  userId: number
  currentBalance: number
  totalEarned: number
  totalSpent: number
  lastSigninDate?: string
  createdAt: string
  updatedAt: string
}

export interface PointsTransaction {
  id: number
  userId: number
  type: 'earned' | 'spent' | 'bonus'
  amount: number
  description: string
  referenceId?: number
  balanceAfter: number
  createdAt: string
}
```

**组件功能实现：**
- 签到按钮组件：实现每日签到功能
- 签到日历组件：展示签到历史和连续天数
- 积分展示组件：显示积分余额和明细
- 兑换商品组件：展示可兑换商品和价格

#### 2.2.5 后端：签到系统模块（优先级：中）- 3天
- 签到功能实现
  - 每日签到接口
  - 签到状态管理
  - 连续签到天数统计
  - 签到奖励计算
- 签到日历功能
  - 签到历史查询
  - 签到日历展示
  - 签到统计分析
- 签到奖励机制
  - 基础签到奖励（5积分/天）
  - 连续签到奖励（7天30积分，15天50积分，30天100积分）
  - 断签重置机制
  - 签到积分发放

#### 2.2.4 积分系统模块（优先级：中）- 4天
- 积分账户管理
  - 积分账户创建
  - 积分余额查询
  - 积分流水记录
  - 积分统计分析
- 积分获取机制
  - 签到积分发放
  - 积分购买充值
  - 活动积分赠送
  - VIP积分赠送
- 积分兑换商城
  - 兑换商品管理
  - VIP会员兑换（1月300积分，3月800积分，12月3000积分）
  - 实物商品兑换
  - 兑换订单管理
- 兑换订单处理
  - 兑换订单创建
  - 订单状态管理
  - 实物商品配送
  - 兑换记录查询

#### 2.2.5 资源失效处理模块（优先级：中）- 3天
- 失效举报系统
  - 举报接口实现
  - 举报验证处理
  - 举报统计分析
- 资源验证系统
  - 链接有效性检查
  - 定期验证任务
  - 失效标记处理
- 资源恢复流程
  - 重新爬取逻辑
  - 资源替换处理
  - 通知用户机制

#### 2.2.6 前端：资源失效处理适配（并行开发）
**适配目标：**基于后端资源失效处理系统实现完整的用户举报和资源管理功能

**页面适配任务：**
- 资源举报页面（基于后端 `/api/v1/resources/report` API）
- 举报状态查询页面（基于后端 `/api/v1/reports/{id}/status` API）
- 资源验证页面（基于后端 `/api/v1/resources/verify` API）
- 失效资源列表页面（基于后端 `/api/v1/resources/invalid` API）

**技术适配要求：**
- 前端举报数据结构严格遵循后端Report实体
- 实现举报状态管理（适配后端举报状态）
- 实现资源验证显示（适配后端验证结果）
- 实现失效资源标记（适配后端失效状态）

**数据结构适配：**
```typescript
// 前端类型定义必须与后端一致
export interface ResourceReport {
  id: number
  resourceId: number
  resourceTitle: string
  userId: number
  reason: 'invalid_link' | 'expired' | 'inappropriate' | 'other'
  description: string
  contact?: string
  status: 'pending' | 'processing' | 'resolved' | 'rejected'
  processedBy?: number
  processResult?: string
  createdAt: string
  processedAt?: string
}

export interface ResourceVerification {
  id: number
  resourceId: number
  resourceUrl: string
  status: 'valid' | 'invalid' | 'expired' | 'checking'
  lastCheckedAt: string
  checkResult?: string
  httpStatus?: number
  responseTime?: number
  isAccessible: boolean
}

export interface InvalidResource {
  id: number
  title: string
  originalUrl: string
  category: string
  reportCount: number
  status: 'reported' | 'checking' | 'replaced' | 'removed'
  reportedAt: string
  replacementUrl?: string
  replacementId?: number
}
```

**组件功能实现：**
- 举报按钮组件：在资源详情页显示举报入口
- 举报表单组件：实现举报原因选择和描述输入
- 举报状态组件：显示举报处理进度和结果
- 失效标记组件：在列表页标记失效资源
- 资源恢复通知组件：显示资源恢复成功的通知

**用户体验优化：**
- 举报成功反馈提示
- 举报处理进度实时更新
- 失效资源自动隐藏或标记
- 资源恢复成功自动通知

### 2.3 网盘集成与资源处理（2周）

#### 2.3.1 网盘服务集成（优先级：高）- 4天
- 115网盘API
  - 登录认证实现
  - 文件上传功能
  - 分享链接获取
- 115网盘离线下载功能
  - 115网盘BT离线下载任务提交
  - 115网盘下载状态监控
  - 下载完成事件处理（获取115分享链接）
- 文件管理功能
  - 文件夹管理
  - 文件操作接口
  - 配额管理功能

#### 2.3.2 外部集成模块（优先级：高）- 3天
- 电影信息集成
  - TMDb API客户端
  - TMDb API缓存策略
  - 豆瓣信息抓取
  - 电影信息整合
- 第三方服务管理
  - 服务依赖管理
  - 服务降级策略
  - 数据同步管理

#### 2.3.3 API限流与缓存策略（优先级：中）- 3天
- 限流策略实施
  - 接口级别限流配置
  - 用户级别限流控制
  - 动态限流调整机制
  - 限流告警配置
- 缓存策略优化
  - 第三方数据缓存策略
  - 缓存失效机制
  - 缓存预热策略
  - 缓存监控与分析

#### 2.3.4 前端：网盘集成适配（并行开发）
**适配目标：**基于后端网盘集成系统实现完整的网盘资源管理功能

**页面适配任务：**
- 115网盘绑定页面（基于后端 `/api/v1/netdisk/115/bind` API）
- 网盘资源管理页面（基于后端 `/api/v1/netdisk/resources` API）
- 网盘上传页面（基于后端 `/api/v1/netdisk/upload` API）
- 网盘下载页面（基于后端 `/api/v1/netdisk/download` API）

**技术适配要求：**
- 前端网盘数据结构严格遵循后端NetDiskAccount实体
- 实现网盘状态管理（适配后端连接状态）
- 实现上传进度显示（适配后端上传状态）
- 实现离线下载管理（适配后端下载任务）

**数据结构适配：**
```typescript
// 前端类型定义必须与后端一致
export interface NetDiskAccount {
  id: number
  userId: number
  platform: '115' | 'baidu' | 'aliyun'
  username: string
  status: 'connected' | 'disconnected' | 'expired'
  quotaUsed: number
  quotaTotal: number
  accessToken?: string
  refreshToken?: string
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

export interface NetDiskResource {
  id: number
  accountId: number
  fileId: string
  fileName: string
  fileSize: number
  fileType: 'file' | 'folder'
  shareUrl?: string
  downloadUrl?: string
  pickCode?: string
  status: 'active' | 'expired' | 'processing'
  createdAt: string
  expiresAt?: string
}

export interface NetDiskUploadTask {
  id: number
  userId: number
  fileName: string
  fileSize: number
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'failed'
  uploadSpeed?: number
  estimatedTime?: number
  fileId?: string
  errorMessage?: string
  createdAt: string
  completedAt?: string
}

export interface OfflineDownloadTask {
  id: number
  userId: number
  taskUrl: string
  fileName: string
  fileSize?: number
  progress: number
  status: 'pending' | 'downloading' | 'completed' | 'failed'
  downloadSpeed?: number
  errorMessage?: string
  createdAt: string
  completedAt?: string
}
```

**组件功能实现：**
- 网盘绑定组件：实现115网盘账号绑定
- 网盘状态组件：显示网盘连接状态和配额信息
- 上传进度组件：显示文件上传进度和速度
- 下载任务组件：管理离线下载任务
- 分享链接组件：生成和管理网盘分享链接

**用户体验优化：**
- 网盘连接状态实时显示
- 上传下载进度实时更新
- 文件大小和剩余时间估算
- 网盘配额不足提醒

### 2.4 图床服务与图片管理（1周）

#### 2.4.1 图床集成完善 - 3天
- 多图床支持
  - 主图床和备用图床配置
  - 图床故障自动切换
  - 图片CDN加速
- 图片优化处理
  - 图片压缩和格式转换
  - 响应式图片支持
  - 图片水印添加

#### 2.4.2 图片管理优化 - 2天
- 图片分类管理
  - 按资源类型分类
  - 按来源站点分类
  - 图片标签管理
- 图片统计分析
  - 图片使用统计
  - 存储空间分析
  - 热门图片排行

#### 2.4.3 前端：图床服务适配（并行开发）
**适配目标：**基于后端图床服务系统实现完整的图片管理和优化功能

**页面适配任务：**
- 图片上传页面（基于后端 `/api/v1/images/upload` API）
- 图片管理页面（基于后端 `/api/v1/images/gallery` API）
- 图片分类页面（基于后端 `/api/v1/images/categories` API）
- 图片统计分析页面（基于后端 `/api/v1/images/analytics` API）

**技术适配要求：**
- 前端图片数据结构严格遵循后端Image实体
- 实现图片上传进度显示（适配后端上传状态）
- 实现图片分类管理（适配后端分类系统）
- 实现CDN图片优化（适配后端CDN配置）

**数据结构适配：**
```typescript
// 前端类型定义必须与后端一致
export interface ImageInfo {
  id: number
  originalName: string
  fileName: string
  fileSize: number
  mimeType: string
  width: number
  height: number
  url: string
  thumbnailUrl: string
  mediumUrl: string
  category: string
  tags: string[]
  source: 'upload' | 'crawl' | 'import'
  sourceUrl?: string
  status: 'active' | 'processing' | 'failed'
  cdnUrl?: string
  altText?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface ImageCategory {
  id: number
  name: string
  slug: string
  description?: string
  parentId?: number
  imageCount: number
  totalSize: number
  createdAt: string
}

export interface ImageUploadTask {
  id: number
  fileName: string
  fileSize: number
  progress: number
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed'
  uploadSpeed?: number
  estimatedTime?: number
  imageUrl?: string
  errorMessage?: string
  createdAt: string
  completedAt?: string
}

export interface ImageAnalytics {
  totalImages: number
  totalSize: number
  categories: ImageCategoryStats[]
  uploadTrend: UploadTrendData[]
  popularImages: PopularImage[]
  storageUsage: StorageUsage
}
```

**组件功能实现：**
- 图片上传组件：支持拖拽上传和批量上传
- 图片预览组件：支持缩放、旋转、裁剪
- 图片编辑组件：添加水印、调整大小、格式转换
- 图片分类组件：实现分类树和标签管理
- 图片统计组件：显示存储使用和热门图片

**性能优化适配：**
- 响应式图片加载（适配后端多尺寸图片）
- 图片懒加载实现
- CDN图片缓存策略
- 图片压缩和格式优化

**用户体验优化：**
- 上传进度实时显示
- 图片预览和编辑功能
- 批量操作支持
- 图片搜索和筛选

---

## 第三阶段：增强功能（6周）

### 阶段目标
完善系统的增强功能，包括搜索推荐、后台管理、安全加固等。

### 3.1 搜索系统与推荐功能（1周）

#### 3.1.1 基础搜索模块（优先级：高）- 2天
- 搜索引擎抽象层
  - 搜索服务接口
  - 搜索结果模型
  - 查询构建器
- 数据库搜索实现
  - 资源搜索功能
  - 内容搜索功能
  - 复合查询优化
- 搜索缓存系统
  - 热门搜索缓存
  - 查询结果缓存
  - 缓存失效策略

#### 3.1.2 全文搜索模块（优先级：中）- 3天
- Elasticsearch集成
  - ES客户端配置
  - 索引结构设计
  - 查询DSL构建
- 数据同步机制
  - 资源索引同步
  - 内容索引同步
  - 增量更新策略
- 高级搜索功能
  - 多字段搜索
  - 聚合分析功能
  - 搜索相关性调优

#### 3.1.3 搜索增强功能（优先级：低）- 2天
- 搜索建议系统
  - 自动补全功能
  - 搜索建议生成
  - 热门搜索推荐
- 搜索历史功能
  - 用户搜索历史
  - 历史记录管理
  - 历史搜索建议

#### 3.1.4 前端：搜索系统适配（并行开发）
**适配目标：**基于后端搜索系统实现完整的搜索和推荐功能

**页面适配任务：**
- 搜索主页（基于后端 `/api/v1/search/home` API）
- 搜索结果页面（基于后端 `/api/v1/search/results` API）
- 高级搜索页面（基于后端 `/api/v1/search/advanced` API）
- 搜索历史页面（基于后端 `/api/v1/search/history` API）

**技术适配要求：**
- 前端搜索数据结构严格遵循后端SearchResult实体
- 实现搜索建议功能（适配后端自动补全）
- 实现搜索结果高亮（适配后端搜索标记）
- 实现搜索历史管理（适配后端历史记录）

**数据结构适配：**
```typescript
// 前端类型定义必须与后端一致
export interface SearchRequest {
  query: string
  category?: string
  filters: SearchFilter[]
  sort: 'relevance' | 'date' | 'popularity' | 'rating'
  page: number
  size: number
  includeAdult?: boolean
}

export interface SearchResult {
  id: number
  title: string
  description: string
  category: string
  tags: string[]
  imageUrl?: string
  url?: string
  type: 'movie' | 'series' | 'documentary' | 'other'
  score: number
  publishDate?: string
  fileSize?: string
  downloadCount?: number
  highlightedFields: {
    title?: string
    description?: string
    tags?: string[]
  }
}

export interface SearchSuggestion {
  text: string
  type: 'query' | 'category' | 'tag'
  count: number
  highlight?: string
}

export interface SearchHistory {
  id: number
  userId: number
  query: string
  filters: SearchFilter[]
  resultCount: number
  searchedAt: string
}

export interface SearchFilter {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains'
  value: any
}
```

**组件功能实现：**
- 搜索输入组件：支持自动补全和历史建议
- 搜索结果组件：支持高亮显示和排序筛选
- 高级搜索组件：提供复杂条件构建
- 搜索历史组件：显示和管理搜索历史
- 热门搜索组件：显示热门搜索词

**用户体验优化：**
- 搜索实时建议
- 搜索结果高亮显示
- 搜索历史快捷访问
- 搜索结果分页和加载优化

### 3.2 后台管理与统计功能（1周）

#### 3.2.1 后台管理框架（优先级：高）- 3天
- 权限控制系统
  - 管理员权限模型
  - 权限验证实现
  - 动态权限配置
- 后台用户管理
  - 管理员CRUD
  - 角色分配功能
  - 操作日志记录
- 系统配置管理
  - 配置项定义
  - 配置CRUD操作
  - 配置缓存管理

#### 3.2.2 资源管理后台（优先级：高）- 3天
- 资源列表管理
  - 资源查询功能
  - 资源状态控制
  - 批量操作功能
- 资源编辑功能
  - 资源信息编辑
  - 资源链接管理
  - 资源分类管理
- 资源审核流程
  - 新资源审核
  - 资源质量评估
  - 问题资源处理

#### 3.2.3 用户管理后台（优先级：中）- 1天
- 用户列表管理
  - 用户查询功能
  - 用户状态控制
  - 用户类型管理
- 会员管理功能
  - 会员信息查询
  - 会员操作功能
  - 会员统计分析

#### 3.2.4 前端：后台管理系统适配（并行开发）
**适配目标：**基于后端管理系统实现完整的后台管理和统计功能

**页面适配任务：**
- 管理后台首页（基于后端 `/api/v1/admin/dashboard` API）
- 资源管理页面（基于后端 `/api/v1/admin/resources` API）
- 用户管理页面（基于后端 `/api/v1/admin/users` API）
- 系统设置页面（基于后端 `/api/v1/admin/settings` API）

**技术适配要求：**
- 前端管理数据结构严格遵循后端Admin实体
- 实现权限控制（适配后端权限系统）
- 实现批量操作（适配后端批量API）
- 实现数据统计（适配后端统计系统）

**数据结构适配：**
```typescript
// 前端类型定义必须与后端一致
export interface AdminUser {
  id: number
  username: string
  email: string
  role: 'super_admin' | 'admin' | 'moderator'
  permissions: string[]
  status: 'active' | 'inactive' | 'suspended'
  lastLoginAt?: string
  createdAt: string
}

export interface ResourceManagement {
  id: number
  title: string
  category: string
  status: 'active' | 'pending' | 'rejected' | 'archived'
  reportCount: number
  downloadCount: number
  createdAt: string
  reviewedAt?: string
  reviewedBy?: number
}

export interface UserManagement {
  id: number
  username: string
  email: string
  type: 'user' | 'vip' | 'moderator'
  status: 'active' | 'inactive' | 'banned'
  vipLevel?: string
  registrationDate: string
  lastLoginAt?: string
  reportCount: number
}

export interface SystemStats {
  totalUsers: number
  totalResources: number
  totalDownloads: number
  totalRevenue: number
  activeUsers: number
  newUsersToday: number
  popularCategories: CategoryStats[]
  recentActivities: ActivityLog[]
}

export interface ActivityLog {
  id: number
  userId: number
  username: string
  action: string
  resource?: string
  ipAddress: string
  userAgent: string
  createdAt: string
}
```

**组件功能实现：**
- 管理员布局组件：侧边栏导航和顶部菜单
- 数据表格组件：支持排序、筛选、分页
- 批量操作组件：支持多选和批量处理
- 统计图表组件：显示用户、资源、下载统计
- 操作日志组件：显示管理操作记录

**权限控制适配：**
- 路由权限守卫（适配后端权限验证）
- 组件级权限控制
- 操作按钮权限控制
- 菜单显示权限控制

**用户体验优化：**
- 响应式管理界面
- 快捷搜索和筛选
- 批量操作优化
- 操作确认和反馈

---

## 第四阶段：优化与完善（4周）

### 阶段目标
优化系统性能，加强安全防护，改进用户体验。

### 4.1 性能优化与缓存系统（2周）

#### 4.1.1 缓存架构设计（优先级：中）- 2天
- 本地缓存框架
  - 内存缓存实现
  - 过期策略设计
  - 缓存统计功能
- 分布式缓存集成
  - Redis客户端配置
  - 缓存操作封装
  - 序列化策略优化
- 多级缓存实现
  - 缓存级联设计
  - 缓存同步机制
  - 缓存预热策略

#### 4.1.2 关键业务缓存（优先级：高）- 2天
- 资源元数据缓存
  - 热门资源缓存
  - 资源详情缓存
  - 资源列表缓存
- 用户会话缓存
  - 用户信息缓存
  - 权限数据缓存
  - 登录状态缓存
- 搜索结果缓存
  - 热门搜索缓存
  - 搜索建议缓存
  - 分页结果缓存

#### 4.1.3 性能优化模块（优先级：高）- 4天
- 应用层性能优化
  - 异步处理框架
  - 并行处理策略
  - 线程池优化
  - JVM调优
  - 代码优化
- 数据层性能优化
  - 索引优化策略
  - SQL查询优化
  - 连接池优化
  - 读写分离实现
  - 分库分表策略
- 网络层性能优化
  - 接口压缩优化
  - HTTP/2协议支持
  - CDN加速配置
  - API网关优化

#### 4.1.4 Redis高级功能实现（优先级：中）- 4天
- Redis高级数据结构应用
  - HyperLogLog用户统计：日活、周活用户数统计
  - Bitmap用户签到：用户签到状态记录与统计
  - ZSet排行榜实现：热门资源排行、积分排行
  - Geo地理位置：用户地域分布统计
- Redis集群优化
  - 分片策略优化：按业务热度和访问模式优化分片
  - 内存优化：键值设计优化、内存使用分析
  - 网络优化：pipeline批量操作、连接复用优化
  - 持久化优化：RDB和AOF混合持久化策略
- 限流功能实现（高级）
  - 滑动窗口限流：基于Redis ZSet实现
  - 令牌桶算法：分布式令牌桶限流
  - 漏桶算法：平滑请求处理
  - 自适应限流：基于系统负载动态调整限流阈值
- 消息队列实现（高级）
  - 延迟队列实现：基于Redis ZSet的延迟消息队列
  - 死信队列处理：失败消息处理机制
  - 消息可靠性保证：At-Least-Once和Exactly-Once语义
  - 集群消息同步：跨节点消息同步机制

#### 4.1.5 Redis监控与运维（优先级：低）- 2天
- Redis监控系统
  - 关键指标收集
  - 监控面板实现
  - 性能分析工具
- 数据备份策略
  - RDB备份配置
  - AOF备份配置
  - 备份恢复测试
- 缓存故障处理
  - 优雅降级机制
  - 缓存雪崩预防
  - 缓存穿透防护

#### 4.1.6 前端：性能优化适配（并行开发）
**适配目标：**基于后端性能优化实现前端性能提升和用户体验优化

**页面适配任务：**
- 性能监控页面（基于后端 `/api/v1/performance/monitoring` API）
- 缓存状态页面（基于后端 `/api/v1/cache/status` API）
- 系统健康页面（基于后端 `/api/v1/system/health` API）

**技术适配要求：**
- 前端性能数据结构严格遵循后端Performance实体
- 实现智能缓存策略（适配后端缓存系统）
- 实现懒加载和预加载（适配后端性能优化）
- 实现资源压缩和CDN（适配后端网络优化）

**数据结构适配：**
```typescript
// 前端类型定义必须与后端一致
export interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
  cacheHitRate: number
  apiResponseTime: number
  resourceLoadTime: number
}

export interface CacheStatus {
  enabled: boolean
  hitRate: number
  missRate: number
  size: number
  maxSize: number
  entries: CacheEntry[]
}

export interface CacheEntry {
  key: string
  size: number
  expiresAt: number
  accessCount: number
  lastAccessed: number
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  cpu: number
  memory: number
  disk: number
  network: number
  services: ServiceHealth[]
}
```

**性能优化适配：**
- 实现虚拟滚动（适配后端分页优化）
- 实现图片懒加载（适配后端CDN优化）
- 实现API请求缓存（适配后端缓存策略）
- 实现代码分割和按需加载

**用户体验优化：**
- 骨架屏加载效果
- 错误边界和重试机制
- 离线页面和缓存策略
- 性能监控和报告

### 4.2 安全加固与监控告警（1周）

#### 4.2.1 系统安全模块 - 3天
- 认证与授权系统
  - JWT认证系统
  - OAuth2集成设计
  - RBAC权限模型
- 数据安全系统
  - 数据加密策略
  - 输入验证与防护
  - 数据安全合规
- 网络安全系统
  - 网络防护策略
  - API安全防护
  - 安全监控与审计

#### 4.2.2 反爬虫模块 - 2天
- 请求频率限制
  - IP限流实现
  - 用户请求限制
  - 接口调用配额
- 行为分析系统
  - 异常模式检测
  - 爬虫特征识别
  - 防护规则配置
- 封禁管理系统
  - 临时封禁功能
  - 永久封禁功能
  - 解封审核流程

#### 4.2.3 监控告警系统 - 2天
- 性能监控功能
  - 系统指标采集
  - 性能瓶颈分析
  - 资源使用监控
- 异常监控功能
  - 系统异常跟踪
  - 业务异常统计
  - 错误率监控
- 告警系统实现
  - 告警规则设置
  - 告警通知渠道
  - 告警升级策略

#### 4.2.4 前端：安全加固适配（并行开发）
**适配目标：**基于后端安全系统实现前端安全防护和监控功能

**页面适配任务：**
- 安全设置页面（基于后端 `/api/v1/security/settings` API）
- 登录历史页面（基于后端 `/api/v1/security/login-history` API）
- 设备管理页面（基于后端 `/api/v1/security/devices` API）
- 安全监控页面（基于后端 `/api/v1/security/monitoring` API）

**技术适配要求：**
- 前端安全数据结构严格遵循后端Security实体
- 实现二次验证（适配后端MFA系统）
- 实现设备指纹识别（适配后端设备管理）
- 实现安全日志记录（适配后端审计系统）

**数据结构适配：**
```typescript
// 前端类型定义必须与后端一致
export interface SecuritySettings {
  userId: number
  mfaEnabled: boolean
  mfaMethod: 'totp' | 'sms' | 'email'
  loginNotifications: boolean
  sessionTimeout: number
  allowedDevices: DeviceInfo[]
  trustedIps: string[]
  createdAt: string
  updatedAt: string
}

export interface LoginHistory {
  id: number
  userId: number
  loginTime: string
  logoutTime?: string
  ipAddress: string
  userAgent: string
  device: string
  location: string
  status: 'success' | 'failed' | 'blocked'
  failureReason?: string
}

export interface DeviceInfo {
  id: number
  userId: number
  deviceId: string
  deviceName: string
  deviceType: 'mobile' | 'desktop' | 'tablet'
  userAgent: string
  lastLoginAt: string
  isTrusted: boolean
  createdAt: string
}

export interface SecurityAlert {
  id: number
  userId: number
  type: 'suspicious_login' | 'new_device' | 'password_change' | 'mfa_disabled'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  isRead: boolean
  createdAt: string
}
```

**安全功能适配：**
- 实现会话超时控制（适配后端会话管理）
- 实现异常登录检测（适配后端行为分析）
- 实现权限实时验证（适配后端权限系统）
- 实现安全事件通知（适配后端告警系统）

**用户体验优化：**
- 安全状态可视化显示
- 异常活动实时提醒
- 安全设置向导引导
- 紧急安全措施快速执行

### 4.3 用户体验改进（1周）

#### 4.3.1 个人中心模块完善 - 2天
- 个人资料管理
  - 资料编辑功能
  - 设置保存功能
  - 头像URL设置
- 下载历史跟踪
  - 外部链接下载记录存储
  - 下载历史查询
  - 下载统计报表
- 收藏管理功能
  - 收藏CRUD接口
  - 收藏分类功能
  - 收藏列表展示
- 评论管理功能
  - 评论历史查询
  - 评论编辑删除
  - 评论互动记录

#### 4.3.2 消息中心模块完善 - 2天
- 通知系统实现
  - 通知类型定义
  - 通知存储与查询
  - 已读/未读状态
- 消息发送功能
  - 系统消息发送
  - 管理员消息发送
  - 批量消息处理
- 工单系统功能
  - 工单创建与分类
  - 工单处理流程
  - 工单状态追踪
  - 工单回复功能
- 用户反馈系统
  - 反馈提交功能
  - 反馈处理流程
  - 反馈统计分析

#### 4.3.3 数据统计与分析 - 3天
- 用户行为统计
  - 用户访问统计
  - 用户交互统计
  - 用户画像构建
- 资源统计分析
  - 资源热度分析
  - 资源质量分析
  - 资源运营分析
- 业务运营分析
  - 会员业务分析
  - 营收分析
  - 内容运营分析
- 数据分析平台建设
  - 数据收集体系
  - 数据可视化
  - 数据分析工具

#### 4.3.4 前端：用户体验改进适配（并行开发）
**适配目标：**基于后端用户体验系统实现完整的个人中心和消息管理功能

**页面适配任务：**
- 个人中心页面（基于后端 `/api/v1/user/profile` API）
- 下载历史页面（基于后端 `/api/v1/user/downloads` API）
- 收藏管理页面（基于后端 `/api/v1/user/favorites` API）
- 消息中心页面（基于后端 `/api/v1/user/messages` API）
- 工单系统页面（基于后端 `/api/v1/user/tickets` API）

**技术适配要求：**
- 前端用户数据结构严格遵循后端User实体
- 实现个人资料编辑（适配后端用户管理）
- 实现下载历史跟踪（适配后端下载记录）
- 实现收藏分类管理（适配后端收藏系统）
- 实现消息状态管理（适配后端消息系统）

**数据结构适配：**
```typescript
// 前端类型定义必须与后端一致
export interface UserProfile {
  id: number
  username: string
  email: string
  nickname?: string
  avatar?: string
  bio?: string
  isVip: boolean
  vipLevel?: string
  vipExpireAt?: string
  totalDownloads: number
  totalFavorites: number
  joinDate: string
  lastLoginAt: string
}

export interface DownloadHistory {
  id: number
  userId: number
  resourceId: number
  resourceTitle: string
  downloadUrl: string
  fileType: 'magnet' | 'direct' | '115'
  downloadTime: string
  fileSize?: number
  status: 'completed' | 'failed' | 'cancelled'
}

export interface FavoriteItem {
  id: number
  userId: number
  resourceId: number
  resourceTitle: string
  category: string
  thumbnail?: string
  folderName?: string
  tags: string[]
  createdAt: string
}

export interface Message {
  id: number
  userId: number
  type: 'system' | 'admin' | 'download' | 'vip'
  title: string
  content: string
  isRead: boolean
  priority: 'low' | 'normal' | 'high'
  actionUrl?: string
  createdAt: string
  readAt?: string
}

export interface SupportTicket {
  id: number
  userId: number
  subject: string
  category: 'technical' | 'account' | 'content' | 'other'
  status: 'open' | 'pending' | 'resolved' | 'closed'
  priority: 'low' | 'normal' | 'high'
  description: string
  replies: TicketReply[]
  createdAt: string
  updatedAt: string
}

export interface TicketReply {
  id: number
  ticketId: number
  userId?: number
  adminId?: number
  content: string
  isFromAdmin: boolean
  createdAt: string
}
```

**组件功能实现：**
- 个人资料编辑组件：支持头像、昵称、个人简介编辑
- 下载历史组件：支持搜索、筛选、导出功能
- 收藏管理组件：支持文件夹分类和批量操作
- 消息中心组件：支持消息状态管理和批量操作
- 工单系统组件：支持工单创建、回复、状态跟踪

**用户体验优化：**
- 个人信息实时同步
- 下载进度可视化
- 收藏夹智能分类
- 消息推送和提醒
- 工单状态实时更新

---

## 第五阶段：部署与运维（4周）

### 阶段目标
建立完整的部署运维体系，确保系统稳定运行。

### 5.1 部署与运维体系（2周）

#### 5.1.1 环境管理（优先级：高）- 4天
- 环境配置管理
  - 开发环境配置标准化
  - 测试环境配置管理
  - 预生产环境配置
  - 生产环境配置规范
- 基础设施即代码
  - Docker容器化配置
  - Kubernetes部署清单
  - 配置文件管理策略
  - 密钥管理系统

#### 5.1.2 部署策略实施（优先级：高）- 5天
- CI/CD流水线构建
  - 构建流程自动化
  - 测试自动执行
  - 部署流程自动化
  - 回滚机制实现
- 发布策略
  - 蓝绿部署实施
  - 金丝雀发布配置
  - 滚动更新策略
  - 发布审批流程

#### 5.1.3 监控告警体系（优先级：中）- 3天
- 应用监控
  - Spring Boot Actuator配置
  - Micrometer指标收集
  - 自定义业务指标
  - 健康检查配置
- 基础设施监控
  - 服务器资源监控
  - 数据库性能监控
  - 缓存监控
  - 网络监控
- 告警机制
  - 告警规则配置
  - 通知渠道配置
  - 告警升级策略
  - 值班轮换机制

#### 5.1.4 运维自动化 - 2天
- 自动化部署
  - CI/CD流水线
  - 蓝绿部署
  - 金丝雀发布
  - 回滚机制
- 配置管理
  - 环境配置
  - 配置中心
  - 密钥管理
  - 配置版本控制
- 容器化运维
  - Docker容器化
  - Kubernetes管理
  - 服务网格
  - 资源调度

#### 5.1.5 前端：运维监控适配（并行开发）
**适配目标：**基于后端运维系统实现运维监控的可视化界面

**页面适配任务：**
- 运维监控仪表板（基于后端 `/api/v1/ops/dashboard` API）
- 部署状态页面（基于后端 `/api/v1/ops/deployments` API）
- 系统健康页面（基于后端 `/api/v1/ops/health` API）
- 告警中心页面（基于后端 `/api/v1/ops/alerts` API）

**技术适配要求：**
- 前端运维数据结构严格遵循后端Ops实体
- 实现实时监控数据展示（适配后端监控指标）
- 实现部署状态可视化（适配后端部署流程）
- 实现告警信息管理（适配后端告警系统）

**数据结构适配：**
```typescript
// 前端类型定义必须与后端一致
export interface OpsDashboard {
  systemStatus: 'healthy' | 'warning' | 'critical'
  totalServices: number
  activeServices: number
  totalDeployments: number
  activeDeployments: number
  recentAlerts: OpsAlert[]
  systemMetrics: SystemMetrics[]
}

export interface DeploymentInfo {
  id: number
  name: string
  version: string
  environment: 'dev' | 'test' | 'staging' | 'prod'
  status: 'pending' | 'deploying' | 'success' | 'failed' | 'rolling_back'
  startTime: string
  endTime?: string
  deployer: string
  changes: string[]
}

export interface OpsAlert {
  id: number
  level: 'info' | 'warning' | 'error' | 'critical'
  service: string
  message: string
  details?: string
  isResolved: boolean
  createdAt: string
  resolvedAt?: string
}

export interface SystemMetrics {
  serviceName: string
  cpu: number
  memory: number
  disk: number
  network: number
  requests: number
  errors: number
  responseTime: number
  uptime: number
}
```

**组件功能实现：**
- 监控仪表板组件：实时显示系统状态和关键指标
- 部署状态组件：显示部署进度和状态
- 告警管理组件：显示告警信息和处理状态
- 系统健康组件：显示各服务的健康状态
- 性能图表组件：显示性能指标趋势

**用户体验优化：**
- 实时数据更新
- 告警信息分类和筛选
- 部署进度可视化
- 快速操作和响应

### 5.2 团队协作与开发规范（1周）

#### 5.2.1 版本控制规范（优先级：高）- 2天
- Git工作流规范
  - 分支策略制定（Git Flow）
  - 提交信息规范
  - 代码合并流程
  - 冲突解决策略
- 代码审查流程
  - Pull Request模板
  - 代码审查清单
  - 审查响应时间要求
  - 审查通过标准

#### 5.2.2 文档管理规范（优先级：中）- 2天
- 技术文档管理
  - API文档自动生成
  - 架构决策记录(ADR)
  - 技术方案文档模板
  - 知识库维护流程
- 项目文档规范
  - 项目进度文档
  - 会议纪要模板
  - 风险跟踪表
  - 变更记录管理

#### 5.2.3 沟通协作机制（优先级：中）- 3天
- 会议机制
  - 每日站会规范
  - 周度进度回顾会
  - 技术评审会议
  - 项目里程碑评审
- 协作工具使用规范
  - 项目管理工具使用
  - 即时通讯工具规范
  - 文档协作平台使用
  - 代码托管平台规范

### 5.3 数据初始化与迁移（1周）

#### 5.3.1 系统初始化策略（优先级：高）- 3天
- 基础数据准备
  - 系统配置数据初始化
  - 字典数据准备
  - 管理员账户初始化
  - 默认权限配置
- 测试数据管理
  - 测试数据生成策略
  - 数据脱敏处理
  - 测试数据版本管理
  - 数据清理机制

#### 5.3.2 数据迁移方案（优先级：中）- 2天
- 迁移策略制定
  - 迁移方案设计
  - 数据映射规则
  - 迁移脚本开发
  - 回滚方案准备
- 迁移实施流程
  - 迁移前数据验证
  - 迁移过程监控
  - 迁移后数据校验
  - 迁移报告生成

### 5.4 测试体系完善（持续进行）

#### 5.4.1 自动化测试流程 - 3天
- CI/CD测试集成
  - 持续集成测试流水线
  - 自动化测试触发机制
  - 测试失败处理流程
  - 测试结果通知机制
- 性能测试实施
  - 压力测试脚本开发
  - 性能基准测试
  - 接口性能测试
  - 数据库性能测试

#### 5.4.2 质量保证流程 - 4天
- 代码质量检查
  - SonarQube集成配置
  - 代码质量标准制定
  - 技术债务管理流程
  - 代码审查清单
- 安全测试
  - 安全扫描工具集成
  - 依赖漏洞检查
  - API安全测试
  - 数据安全验证

---

## 开发里程碑与关键节点

### 里程碑1：核心功能MVP（第11.5周）
- ✅ 基础架构完成
- ✅ 用户认证系统可用
- ✅ 基础资源管理功能
- ✅ 基础内容管理功能
- ✅ 测试体系基础框架

### 里程碑2：业务功能完善（第19.5周）
- ✅ VIP系统与支付功能
- ✅ 资源爬取系统
- ✅ 网盘集成功能
- ✅ 图床服务功能

### 里程碑3：系统功能完整（第25.5周）
- ✅ 搜索推荐系统
- ✅ 后台管理功能
- ✅ 安全防护体系
- ✅ 性能优化方案

### 里程碑4：生产就绪（第29.5周）
- ✅ 性能优化完成
- ✅ 安全加固实施
- ✅ 用户体验优化
- ✅ 监控告警体系

### 里程碑5：运维体系完善（第33.5周）
- ✅ 部署运维体系
- ✅ 团队协作规范
- ✅ 数据迁移方案
- ✅ 测试体系完善

---

## 风险控制与质量保证

### 开发风险控制
1. **模块依赖风险**：实施接口优先策略，优先实现依赖模块的核心功能
2. **外部服务不稳定风险**：实现优雅降级机制，关键功能提供备选方案
3. **性能瓶颈风险**：提前设计缓存策略、分布式处理和异步任务机制
4. **安全风险**：实现IP轮换、访问频率控制，遵守网站robots.txt
5. **需求变更风险**：采用模块化和松耦合设计，提高系统应对变化的能力

### 质量保证措施
1. **代码质量**：集成代码质量检查工具，建立代码审查流程
2. **测试覆盖**：单元测试、集成测试、端到端测试全覆盖
3. **性能监控**：建立性能基准，持续监控系统性能指标
4. **安全测试**：定期进行安全扫描和渗透测试
5. **文档维护**：保持技术文档与代码同步更新

---

## 资源与准备清单

### 开发环境需求
- Java 21+ JDK
- Maven 3.6+
- MySQL 8.0+
- Redis 5.0+
- Elasticsearch 7.x（可选，用于高级搜索）
- Git版本控制系统
- IDE（推荐IntelliJ IDEA）
- Docker（用于开发和测试环境）

### 外部服务账号
- TMDb API密钥（获取电影数据）
- 图床API账号与密钥
- 115网盘账号与API凭证
- 支付宝/微信支付商户账号（测试环境）
- PT站账号（TorrentGalaxy和SpringSunday）

``### 基础设施准备
- 开发服务器（本地开发环境）
- 测试服务器环境
- 代理服务器（用于爬虫访问外部资源）
- 临时文件存储空间（用于VIP资源的临时下载和做种）
- CI/CD流水线（Jenkins或GitHub Actions）
- 数据库服务器（开发和测试环境）

---

## 前后端接口协调机制（后端主导）

### 1. API设计主导权

**后端职责：**
- 定义所有API接口规范和数据结构
- 设计统一的响应格式和错误处理机制
- 编写完整的API文档（OpenAPI 3.0规范）
- 提供API测试环境和真实测试数据
- 保证API向后兼容性

**前端职责：**
- 严格遵循后端API接口规范
- 根据后端数据结构设计前端TypeScript类型
- 实现API调用逻辑和错误处理
- 基于后端API设计前端页面和组件

### 2. 数据结构权威性

**后端实体模型是前端实现的唯一标准：**

```java
// 后端实体定义（权威）
@Entity
public class User {
    private Long id;
    private String username;
    private String email;
    private String avatar;
    private Boolean isVip;
    private LocalDateTime vipExpireAt;
    private LocalDateTime createdAt;
}
```

```typescript
// 前端类型定义必须严格遵循后端实体
export interface UserProfile {
  id: number
  username: string
  email: string
  avatar?: string
  isVip: boolean
  vipExpireAt?: string
  createdAt: string
}
```

### 3. API接口规范标准

**统一响应格式：**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {},
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "req-123456"
}
```

**错误响应格式：**
```json
{
  "code": "USER_NOT_FOUND",
  "message": "用户不存在",
  "details": {
    "userId": 123
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "req-123456"
}
```

### 4. 开发协作流程

#### 4.1 需求分析阶段
1. **后端主导需求分析**：分析业务需求，设计领域模型
2. **API接口设计**：后端设计API接口和数据结构
3. **接口评审会议**：前后端共同评审API设计
4. **API契约确定**：确定API规范作为开发契约

#### 4.2 开发阶段
1. **数据库设计**：后端设计数据库结构并插入测试数据
2. **后端优先开发**：后端实现API接口和业务逻辑
3. **前端适配开发**：前端基于真实API和真实数据实现页面功能
4. **实时联调**：前后端实时进行功能联调和数据验证

#### 4.3 集成测试阶段
1. **功能验证**：验证前后端功能完整性
2. **数据完整性测试**：验证数据流和数据一致性
3. **端到端测试**：完整用户操作流程测试
4. **性能优化**：基于真实数据进行性能调优

---

## 各阶段具体交付标准（后端主导）

### 阶段一交付标准（11.5周）

#### 后端交付标准
**功能完整性：**
- ✅ 用户认证系统完整可用（注册、登录、密码重置）
- ✅ RBAC权限系统正确实现，权限控制准确
- ✅ 基础资源管理API全部可用（CRUD、搜索、分类）
- ✅ Redis缓存系统正常工作，性能满足要求
- ✅ 系统配置和字典数据API可用

**性能标准：**
- API响应时间 < 500ms（95%请求）
- Redis缓存命中率 > 90%
- 数据库查询优化，慢查询 < 100ms
- 系统并发支持 > 1000 QPS

**质量标准：**
- API接口文档完整度 100%
- 单元测试覆盖率 > 80%
- 集成测试覆盖率 > 70%
- 代码质量检查通过率 100%

#### 前端交付标准
**功能完整性：**
- ✅ 用户认证页面功能完整（登录、注册、密码重置）
- ✅ 基础资源展示页面可用（首页、详情、分类、搜索）
- ✅ 用户个人中心基础功能可用（资料、设置）
- ✅ 路由权限守卫正确实现
- ✅ 错误处理与后端错误码完全对应

**技术标准：**
- 前端数据结构严格遵循后端实体
- API调用无错误，错误处理完整
- 页面加载性能优化（FCP < 2s）
- 移动端适配完整，响应式设计正确

**用户体验标准：**
- 用户注册登录流程完整无中断
- 页面间状态保持正确
- 错误提示友好准确
- 加载状态反馈及时

#### 集成交付标准
- 前后端用户流程完整，从注册到基础使用无中断
- API调用无错误，前后端数据同步正确
- 权限控制前后端一致
- 性能满足用户体验要求

### 阶段二交付标准（8周）

#### 后端交付标准
**功能完整性：**
- ✅ VIP会员系统完整可用，权限控制正确
- ✅ 支付系统完整可用，支付流程无中断
- ✅ 下载管理功能完整，权限控制正确
- ✅ 消息通知系统完整，实时推送正常
- ✅ 签到积分系统完整可用

#### 前端交付标准
**功能完整性：**
- ✅ VIP相关功能完整可用，UI与后端逻辑一致
- ✅ 支付流程完整可用，用户体验流畅
- ✅ 下载管理功能完整可用，权限显示正确
- ✅ 消息中心功能完整，实时通知正常
- ✅ 签到积分功能完整可用

### 阶段三交付标准（6周）

#### 后端交付标准
**功能完整性：**
- ✅ 管理后台功能完整，权限控制正确
- ✅ 高级搜索功能快速准确
- ✅ 推荐系统效果良好
- ✅ 系统监控实时有效

#### 前端交付标准
**功能完整性：**
- ✅ 管理后台功能完整可用
- ✅ 高级搜索用户体验良好
- ✅ 推荐内容展示正确
- ✅ 监控数据可视化清晰

### 阶段四交付标准（4周）

#### 后端交付标准
- 性能优化完成，系统响应速度提升50%
- 安全加固实施，通过安全扫描
- Redis高级功能实现，缓存优化效果明显

#### 前端交付标准
- 性能优化完成，页面加载速度提升40%
- 用户体验改进，交互更加流畅
- 与后端优化功能完全集成

### 阶段五交付标准（4周）

#### 后端交付标准
- 部署运维体系完整，自动化部署可用
- 监控告警体系完善，系统稳定运行
- 团队协作规范建立，开发效率提升

#### 前端交付标准
- 前端部署流程自动化
- 监控告警集成，前端错误实时追踪
- 前后端协作规范完全遵循

---

## 总结

本路线图采用后端主导、前端适配的策略，确保：
1. **后端权威性**：API接口和数据结构由后端定义，前端严格遵循
2. **功能完整性**：以后端业务逻辑完整性为准，保证系统功能完整
3. **开发效率**：前后端并行开发，定期集成，提高整体开发效率
4. **质量保证**：每个阶段都有明确的交付标准，确保项目质量

通过这个统一的前后端开发路线图，项目团队可以清晰地了解每个阶段的开发任务、交付标准和协作方式，确保项目按时高质量交付。