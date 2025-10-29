# 系统架构总览

## 🏗️ 架构设计概述

本文档描述影视资源下载网站的总体架构设计，包括技术选型、架构模式、系统分层和关键技术决策。

---

## 🎯 架构设计原则

### 1. 单体架构现代化
- **简洁性优先**：采用单体架构，避免微服务复杂性
- **模块化设计**：通过清晰的模块边界实现高内聚低耦合
- **现代化工具链**：使用最新的技术栈和开发工具
- **可演进性**：预留微服务化改造空间

### 2. 技术依赖关系优先
- **数据库优先**：数据层先行，为业务功能提供基础支撑
- **领域模型驱动**：以业务领域为核心组织代码结构
- **基础设施支撑**：缓存、安全、监控等基础组件优先建设
- **业务功能叠加**：基于稳定基础设施逐步实现业务功能

### 3. 开发效率导向
- **后端主导**：API接口和数据结构由后端定义，前端适配
- **真实数据驱动**：所有开发基于真实数据库数据和API接口
- **工具赋能**：集成高效开发工具，提升开发质量和效率
- **文档先行**：完善的技术文档支撑团队协作

---

## 🛠️ 技术栈选型

### 核心框架与技术

#### 后端技术栈
```
Spring Boot 3.3.x          // 应用框架
Java 21                   // 开发语言
Spring Security 6.x       // 安全框架
MyBatis-Plus 3.5.x        // ORM框架
```

#### 数据存储
```
MySQL 8.0                // 主数据库
Redis 7.x                // 缓存系统
Elasticsearch 8.x         // 全文搜索
```

#### 开发与测试工具
```
Maven                    // 项目构建
JUnit 5.10+             // 单元测试
Mockito 5.x             // Mock测试
Testcontainers          // 集成测试
Instancio               // 测试数据生成
```

#### 监控与运维
```
Spring Boot Admin        // 应用监控
Prometheus + Grafana     // 指标监控
PLG Stack (Loki)        // 日志管理
Docker                  // 容器化
```

### 工具库集成

#### Hutool 全能工具包 5.8.38
```java
// 字符串处理
StrUtil.isBlank(str)           // 字符串判空
StrUtil.format(template, args) // 字符串格式化

// 日期时间
DateUtil.format(date, pattern) // 日期格式化
DateUtil.between(startTime, endTime) // 时间差计算

// 加密解密
SecureUtil.md5(str)            // MD5加密
SecureUtil.aesEncrypt(data, key) // AES加密

// 集合操作
CollUtil.isNotEmpty(list)       // 集合判空
CollUtil.union(list1, list2)    // 集合并集

// 文件操作
FileUtil.readUtf8String(filePath) // 文件读取
FileUtil.writeUtf8String(filePath, content) // 文件写入

// HTTP客户端
HttpUtil.get(url)              // GET请求
HttpUtil.post(url, data)       // POST请求
```

---

## 📐 架构模式

### 1. DDD 领域驱动设计

#### 分层架构
```
┌─────────────────────────────────────┐
│        Interfaces Layer             │  # 接口层：API接口、Web控制器
├─────────────────────────────────────┤
│       Application Layer             │  # 应用层：业务流程编排、用例实现
├─────────────────────────────────────┤
│         Domain Layer                │  # 领域层：核心业务逻辑、领域模型
├─────────────────────────────────────┤
│     Infrastructure Layer            │  # 基础设施层：技术实现、外部依赖
└─────────────────────────────────────┘
```

#### 领域模块划分
```
核心领域模块：
├── User Domain           # 用户领域：注册、登录、权限
├── Resource Domain       # 资源领域：影视资源管理
├── Content Domain        # 内容领域：文章、Wiki管理
├── VIP Domain           # 会员领域：会员权益、订单
├── Search Domain        # 搜索领域：全文搜索、推荐
└── Crawler Domain       # 爬虫领域：资源采集、处理

支撑领域模块：
├── Auth Domain          # 认证领域：身份验证、授权
├── Payment Domain       # 支付领域：支付流程、交易
├── Notification Domain  # 通知领域：消息推送、邮件
└── Monitoring Domain    # 监控领域：性能监控、日志
```

### 2. 六边形架构（Ports & Adapters）

#### 核心设计理念
- **业务核心隔离**：核心业务逻辑与技术实现完全解耦
- **端口定义**：通过接口定义业务核心与外部的交互点
- **适配器实现**：具体技术实现通过适配器模式集成
- **可替换性**：技术实现可以独立于业务核心进行替换

#### 端口与适配器
```
                    ┌─────────────────┐
                    │   Core Domain   │
                    │                 │
                    │  Business Logic │
                    └─────────────────┘
                             │
                    ┌────────┬────────┐
                    │        │        │
             Input Ports  │   Output Ports
           (Service Interfaces)   │
                    │        │        │
         ┌──────────┘        │        └───────────┐
         │                          │           │
  Input Adapters               Output Adapters
  (Controllers)            (Database, External APIs)
```

---

## 🗂️ 系统分层详解

### 1. 接口层 (Interfaces Layer)

#### 职责
- 处理外部请求和响应
- 数据传输对象转换
- 参数验证和格式化
- 异常处理和错误响应

#### 主要组件
```java
// REST API 控制器
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    // 处理HTTP请求，调用应用服务
}

// WebSocket 处理器
@Component
public class NotificationHandler {
    // 处理实时消息推送
}

// 对象组装器
@Component
public class UserAssembler {
    // DTO与实体对象转换
}
```

### 2. 应用层 (Application Layer)

#### 职责
- 业务流程编排
- 用例逻辑实现
- 事务边界控制
- 领域服务协调

#### 主要组件
```java
// 应用服务
@Service
public class UserApplicationService {
    // 用户注册用例实现
    public UserDTO register(UserRegisterRequest request) {
        // 1. 参数验证
        // 2. 调用领域服务
        // 3. 保存数据
        // 4. 发布事件
    }
}

// 事件发布器
@Component
public class DomainEventPublisher {
    // 发布领域事件
}
```

### 3. 领域层 (Domain Layer)

#### 职责
- 核心业务逻辑实现
- 领域模型定义
- 业务规则验证
- 领域服务实现

#### 主要组件
```java
// 领域实体
@Entity
public class User {
    private UserId id;
    private Email email;
    private Password password;

    // 业务方法
    public void changePassword(Password newPassword) {
        // 密码修改业务逻辑
    }
}

// 领域服务
@Service
public class UserDomainService {
    // 复杂业务逻辑
    public boolean isEmailUnique(Email email) {
        // 邮箱唯一性检查
    }
}

// 仓储接口
public interface UserRepository {
    User save(User user);
    User findById(UserId id);
    List<User> findByCriteria(UserCriteria criteria);
}
```

### 4. 基础设施层 (Infrastructure Layer)

#### 职责
- 技术实现细节
- 外部服务集成
- 数据持久化
- 交叉关注点

#### 主要组件
```java
// 仓储实现
@Repository
public class UserRepositoryImpl implements UserRepository {
    // MyBatis-Plus实现数据访问
}

// 外部服务适配器
@Service
public class PaymentGatewayAdapter {
    // 支付网关集成
}

// 缓存实现
@Service
public class RedisCacheService implements CacheService {
    // Redis缓存操作
}
```

---

## 🗄️ 数据架构设计

### 1. 数据库分层设计

#### 第一层：核心基础表（阶段1）
```sql
-- 用户权限核心表
users, user_profiles, roles, permissions

-- 系统基础表
system_configs, dictionaries, file_storages

-- 审计日志表
operation_logs, audit_logs
```

#### 第二层：业务功能表（阶段2-4）
```sql
-- 认证权限表（阶段2）
user_roles, refresh_tokens, login_history

-- VIP业务表（阶段3）
vip_memberships, orders, payment_records

-- 用户中心表（阶段4）
favorites, download_history, user_comments
```

#### 第三层：高级功能表（阶段5-6）
```sql
-- PT站点集成表
pt_sites, torrent_files, crawl_tasks

-- 质量管理表
quality_scores, duplicate_detection

-- 监控分析表
search_logs, user_statistics
```

### 2. 缓存架构设计

#### 多级缓存策略
```
┌─────────────────────────────────────┐
│            Application               │
├─────────────────────────────────────┤
│         L1 Cache (Caffeine)         │  # 本地缓存，热点数据
├─────────────────────────────────────┤
│         L2 Cache (Redis)            │  # 分布式缓存，共享数据
├─────────────────────────────────────┤
│         Database (MySQL)            │  # 持久化存储
└─────────────────────────────────────┘
```

#### 缓存场景设计
```java
// 用户缓存
@Cacheable(value = "user:session", key = "#userId")
public UserSession getUserSession(Long userId) {
    // 用户登录状态缓存，TTL 2小时
}

// 系统配置缓存
@Cacheable(value = "system:config", key = "#configKey")
public SystemConfig getSystemConfig(String configKey) {
    // 系统配置缓存，TTL 24小时
}

// 资源缓存
@Cacheable(value = "resource:hot", key = "#categoryId")
public List<Resource> getHotResources(Long categoryId) {
    // 热门资源缓存，TTL 30分钟
}
```

---

## 🔐 安全架构设计

### 1. 认证授权架构

#### JWT 认证流程
```
Client → API Gateway → Authentication Service → JWT Token → Resource Access
```

#### RBAC 权限模型
```
User → UserRole → Role → RolePermission → Permission
  用户    用户角色    角色    角色权限        权限
```

### 2. 数据安全设计

#### 密码安全
```java
@Component
public class PasswordService {
    // BCrypt加密
    public String encryptPassword(String rawPassword) {
        return BCrypt.hashpw(rawPassword, BCrypt.gensalt());
    }

    // 密码验证
    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return BCrypt.checkpw(rawPassword, encodedPassword);
    }
}
```

#### 敏感数据处理
```java
// 数据脱敏
public class UserDataMasking {
    public String maskEmail(String email) {
        // user@example.com → u***@example.com
        return email.replaceAll("(?<=.).(?=[^@]*?@)", "*");
    }

    public String maskPhone(String phone) {
        // 13812345678 → 138****5678
        return phone.replaceAll("(\\d{3})\\d{4}(\\d{4})", "$1****$2");
    }
}
```

---

## 🔧 部署架构设计

### 1. 容器化部署

#### Docker 多阶段构建
```dockerfile
# 构建阶段
FROM maven:3.9-openjdk-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# 运行阶段
FROM openjdk:21-jre-slim
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### Docker Compose 编排
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - mysql
      - redis
    environment:
      - SPRING_PROFILES_ACTIVE=dev

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: knene_db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

### 2. 现代化部署架构

#### Nginx 反向代理
```nginx
upstream backend {
    server app1:8080;
    server app2:8080;
}

server {
    listen 80;
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        root /var/www/static;
        expires 1y;
    }
}
```

#### 监控体系
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   App A     │    │   App B     │    │   App C     │
│   + Grafana │───▶│  + Prometheus│───▶│  + Loki     │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                  ┌─────────────┐
                  │ Spring Boot  │
                  │   Admin      │
                  └─────────────┘
```

---

## 📊 性能优化策略

### 1. 数据库优化
- **索引策略**：复合索引、覆盖索引优化
- **查询优化**：避免SELECT *，合理使用EXISTS
- **连接池**：Druid连接池配置与监控
- **读写分离**：后期可考虑主从复制

### 2. 缓存优化
- **缓存预热**：应用启动时预加载热点数据
- **缓存穿透**：布隆过滤器 + 空值缓存
- **缓存雪崩**：随机TTL + 多级降级
- **缓存击穿**：互斥锁 + 热点数据永不过期

### 3. 接口优化
- **限流策略**：用户级别、IP级别、接口级别限流
- **异步处理**：非核心业务异步化处理
- **批量操作**：支持批量数据操作
- **响应压缩**：启用gzip压缩减少传输

---

## 🔮 架构演进规划

### 短期目标（6个月）
- ✅ 单体架构现代化实施
- ✅ DDD架构模式落地
- ✅ 完善的技术工具链集成
- ✅ 稳定的监控运维体系

### 中期目标（1-2年）
- 🚀 性能优化和扩展
- 🚀 搜索功能增强
- 🚀 高可用部署架构
- 🚀 数据分析能力建设

### 长期目标（2年以上）
- 🎯 微服务化改造（如需要）
- 🎯 云原生架构迁移
- 🎯 大数据处理能力
- 🎯 AI/ML 功能集成

---

## 📋 架构决策记录 (ADR)

### ADR-001: 单体架构 vs 微服务架构
**决策**：采用单体架构
**原因**：
- 团队规模小，单体架构更高效
- 技术复杂度可控，维护成本低
- 部署运维简单，适合快速迭代
- 预留微服务化改造空间

### ADR-002: DDD + 六边形架构
**决策**：采用DDD领域驱动设计和六边形架构
**原因**：
- 业务复杂度高，需要清晰的领域模型
- 技术与业务解耦，提高可测试性
- 支持渐进式架构演进
- 便于团队理解和维护

### ADR-003: Redis缓存策略
**决策**：采用Cache-Aside + 多级缓存策略
**原因**：
- 提供高性能数据访问
- 保证缓存一致性
- 支持高并发访问
- 便于监控和运维

---

**文档维护**：架构设计文档随项目发展持续更新
**最后更新**：2025-10-29
**维护人员**：开发团队