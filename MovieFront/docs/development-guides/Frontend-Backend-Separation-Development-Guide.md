# 前后端分离开发规范 - Mock数据驱动开发模式

## 1. 规范概述

### 1.1 核心原则

**⚠️ 强制要求：所有前端开发必须基于Mock数据模拟后端响应，确保前后端完全解耦。**

**核心理念：**
- **数据驱动**：所有业务数据来源于服务层，前端组件只负责展示
- **接口先行**：先定义数据接口，再实现Mock数据，最后对接真实API
- **无缝切换**：Mock数据与真实API具有相同的数据结构和接口
- **分层清晰**：严格遵循DDD分层架构，数据流向清晰

### 1.2 开发流程

```
1. 定义数据接口 → 2. 实现Mock服务 → 3. 前端组件开发 → 4. 真实API对接
```

## 2. Mock数据服务规范 (强制执行)

### 2.1 服务层架构

**⚠️ 强制要求：所有Mock数据必须在应用层服务中实现，禁止在组件中直接生成数据。**

**服务层结构：**
```
@application/services/
├── HomeApplicationService.ts     # 首页相关业务服务
├── MovieApplicationService.ts    # 影片相关业务服务
├── UserApplicationService.ts     # 用户相关业务服务
├── AdminApplicationService.ts    # 管理后台业务服务
└── NotificationService.ts        # 通知相关业务服务
```

### 2.2 Mock数据实现规范

**标准Mock服务模板：**
```typescript
/**
 * 首页应用服务
 * 负责首页相关的业务逻辑和数据获取
 * 包含Mock数据实现，便于前后端分离开发
 */
export class HomeApplicationService {
  
  /**
   * 获取专题数据
   * @param count 数据数量
   * @returns Promise<TopicItem[]>
   */
  async getTopics(count: number = 10): Promise<TopicItem[]> {
    // TODO: 替换为真实API调用
    // return await this.apiClient.get('/api/topics', { params: { count } })
    
    // 当前使用Mock数据
    return this.getMockTopicsExtended(count)
  }

  /**
   * Mock数据生成方法
   * 模拟真实后端数据结构和业务逻辑
   * @private
   */
  private getMockTopicsExtended(count: number): TopicItem[] {
    // Mock数据实现...
    return mockData
  }

  /**
   * VIP状态判断逻辑
   * 模拟后端的VIP判断规则
   * @private
   */
  private shouldBeVipTopic(category: string, index: number): boolean {
    // 模拟真实的VIP判断逻辑
    const vipCategories = ['Fine Art Nudes', 'Portrait Photography', 'Black & White']
    return vipCategories.includes(category) || index % 5 === 0
  }
}
```

### 2.3 Mock数据质量要求

**⚠️ 强制要求：Mock数据必须完全模拟真实后端数据的结构、类型和业务逻辑。**

**质量标准：**
- **数据结构一致**：与后端API返回的数据结构完全一致
- **类型安全**：使用TypeScript严格类型定义
- **业务逻辑真实**：模拟真实的业务规则（如VIP判断、权限控制等）
- **数据丰富度**：提供足够的测试数据，覆盖各种边界情况
- **性能考虑**：大数据量时使用分页、懒加载等策略

## 3. 前端组件开发规范 (强制执行)

### 3.1 数据获取规范

**⚠️ 强制要求：前端组件禁止直接生成业务数据，必须通过服务层获取。**

**✅ 正确方式：**
```typescript
/**
 * 专题列表页面
 * 使用HomeApplicationService获取数据，模拟真实的后端数据获取
 */
const useSpecialCollections = () => {
  const { getTopicCover } = useImageService()
  const homeService = useMemo(() => new HomeApplicationService(), [])

  // 通过服务层获取数据
  const topics = useMemo(() => {
    const mockTopics = homeService.getMockTopicsExtended(120)
    
    // 只处理展示相关的逻辑（如图片URL转换）
    return mockTopics.map(topic => ({
      ...topic,
      imageUrl: getTopicCover(topic.imageUrl, { width: 400, height: 500 }),
    }))
  }, [homeService, getTopicCover])

  return topics
}
```

**❌ 禁止方式：**
```typescript
// 禁止在组件中直接生成业务数据
const topics = useMemo(() => {
  const topicsArray = []
  for (let i = 0; i < 120; i++) {
    topicsArray.push({
      id: `${i + 1}`,
      isVip: i % 3 === 0, // ❌ 禁止硬编码业务逻辑
      // ...
    })
  }
  return topicsArray
}, [])
```

### 3.2 组件职责分离

**组件职责边界：**
- **表现层组件**：只负责UI展示和用户交互
- **应用层服务**：负责业务逻辑和数据获取
- **基础设施层**：负责API调用和外部服务集成

## 4. API对接切换规范 (强制执行)

### 4.1 无缝切换策略

**⚠️ 强制要求：从Mock数据切换到真实API时，前端组件代码不允许修改。**

**切换步骤：**
1. **保持接口不变**：服务层的公共方法签名保持不变
2. **替换实现**：只修改服务层内部的数据获取逻辑
3. **环境配置**：通过环境变量控制使用Mock还是真实API
4. **渐进式切换**：可以按模块逐步切换，不影响其他功能

**环境配置示例：**
```typescript
export class HomeApplicationService {
  private readonly useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true'
  
  async getTopics(count: number = 10): Promise<TopicItem[]> {
    if (this.useMockData) {
      return this.getMockTopicsExtended(count)
    }
    
    // 真实API调用
    const response = await this.apiClient.get('/api/topics', { 
      params: { count } 
    })
    return response.data
  }
}
```

### 4.2 API客户端规范

**统一API客户端：**
```typescript
/**
 * API客户端基础设施
 * 提供统一的HTTP请求接口
 */
export class ApiClient {
  private readonly baseURL = import.meta.env.VITE_API_BASE_URL
  
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    // 统一的请求处理逻辑
  }
  
  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    // 统一的请求处理逻辑
  }
}
```

## 5. 数据类型定义规范 (强制执行)

### 5.1 类型定义策略

**⚠️ 强制要求：所有数据接口必须有完整的TypeScript类型定义。**

**类型定义结构：**
```
@types/
├── api/                    # API响应类型
│   ├── common.types.ts    # 通用API类型
│   ├── movie.types.ts     # 影片相关类型
│   └── user.types.ts      # 用户相关类型
├── domain/                # 领域实体类型
│   ├── movie.types.ts     # 影片领域类型
│   └── user.types.ts      # 用户领域类型
└── ui/                    # UI组件类型
    ├── component.types.ts # 组件Props类型
    └── theme.types.ts     # 主题相关类型
```

### 5.2 类型定义示例

**完整的类型定义：**
```typescript
/**
 * 专题项目接口
 * 定义专题数据的完整结构
 */
export interface TopicItem {
  id: string
  title: string
  description: string
  imageUrl: string
  type: 'Movie' | 'Photo' | 'Mixed'
  isNew: boolean
  newType?: 'new' | 'hot' | 'recommended'
  isVip: boolean
  category: string
  createdAt: string
  updatedAt: string
}

/**
 * API响应包装类型
 */
export interface ApiResponse<T> {
  data: T
  message: string
  code: number
  success: boolean
}

/**
 * 分页响应类型
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}
```

## 6. 测试规范

### 6.1 Mock数据测试

**测试覆盖要求：**
- Mock服务的数据生成逻辑测试
- 业务规则测试（如VIP判断逻辑）
- 数据结构验证测试
- 边界情况测试

**测试示例：**
```typescript
describe('HomeApplicationService', () => {
  let service: HomeApplicationService
  
  beforeEach(() => {
    service = new HomeApplicationService()
  })
  
  describe('getMockTopicsExtended', () => {
    it('应该生成指定数量的专题数据', () => {
      const topics = service.getMockTopicsExtended(10)
      expect(topics).toHaveLength(10)
    })
    
    it('应该正确设置VIP状态', () => {
      const topics = service.getMockTopicsExtended(20)
      const vipTopics = topics.filter(topic => topic.isVip)
      expect(vipTopics.length).toBeGreaterThan(0)
    })
  })
})
```

## 7. 文档规范

### 7.1 API文档要求

**⚠️ 强制要求：每个Mock服务必须提供完整的API文档。**

**文档内容：**
- 接口描述和用途
- 请求参数说明
- 响应数据结构
- 业务规则说明
- 使用示例

### 7.2 切换指南

**为每个服务提供API切换指南：**
```markdown
## API切换指南

### 当前状态
- 使用Mock数据：`HomeApplicationService.getMockTopicsExtended()`
- 数据来源：本地生成的模拟数据

### 切换到真实API
1. 设置环境变量：`VITE_USE_MOCK_DATA=false`
2. 配置API端点：`VITE_API_BASE_URL=https://api.example.com`
3. 确保后端API返回相同的数据结构
4. 无需修改前端组件代码

### 数据结构对比
- Mock数据结构：[链接到类型定义]
- API响应结构：[链接到API文档]
```

## 8. 最佳实践总结

### 8.1 开发流程最佳实践

1. **接口优先设计**：先定义TypeScript接口，再实现Mock数据
2. **业务逻辑真实化**：Mock数据的业务规则要尽可能接近真实场景
3. **渐进式开发**：先用简单Mock数据验证UI，再完善业务逻辑
4. **环境隔离**：开发、测试、生产环境使用不同的数据源配置

### 8.2 代码质量保障

1. **类型安全**：所有Mock数据都要有完整的TypeScript类型
2. **单元测试**：Mock服务的业务逻辑必须有测试覆盖
3. **代码审查**：重点审查数据结构一致性和业务逻辑正确性
4. **文档同步**：Mock数据变更时同步更新文档

### 8.3 团队协作规范

1. **前后端协作**：定期同步API设计，确保数据结构一致
2. **版本管理**：Mock数据版本与API版本保持同步
3. **问题追踪**：建立Mock数据与真实API的差异追踪机制
4. **知识共享**：定期分享Mock数据设计经验和最佳实践

## 9. 违规检查清单

**代码审查必检项：**
- [ ] 是否在组件中直接生成业务数据？
- [ ] Mock数据是否在应用层服务中实现？
- [ ] 数据结构是否有完整的TypeScript类型定义？
- [ ] 业务逻辑是否模拟真实场景？
- [ ] 是否提供了API切换的环境配置？
- [ ] 前端组件是否与数据获取逻辑解耦？
- [ ] 是否有相应的单元测试覆盖？

**违规处理：**
- 发现违规代码立即要求修改
- 重复违规者需要重新学习本规范
- 严重违规影响项目进度的，升级处理