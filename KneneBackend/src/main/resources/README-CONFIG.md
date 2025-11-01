# 配置文件说明文档

## 概述

本文档详细说明了Knene影视资源下载网站后端项目的配置文件结构和用途。

## 配置文件列表

### 主要配置文件

1. **application.properties** - 基础配置文件
   - 仅包含应用名称
   - 启动时加载的主配置入口

2. **application.yml** - 主配置文件
   - 包含所有基础配置
   - 数据库、Redis、缓存等核心配置
   - 外部服务集成配置
   - 安全配置

3. **logback-spring.xml** - 日志配置文件
   - 控制台、文件、错误日志配置
   - 多环境日志级别配置
   - 异步日志配置

### 环境特定配置文件

4. **application-dev.yml** - 开发环境配置
   - 本地开发环境配置
   - 调试功能开启
   - 开发工具配置

5. **application-test.yml** - 测试环境配置
   - 测试数据库配置
   - 测试服务配置
   - 性能测试优化

6. **application-staging.yml** - 预发布环境配置
   - 生产前验证环境
   - 接近生产配置
   - 调试功能保留

7. **application-prod.yml** - 生产环境配置
   - 生产环境优化配置
   - 安全加固配置
   - 性能优化配置

### 专项配置文件

8. **prometheus.yml** - Prometheus监控配置
   - 应用监控配置
   - 告警规则配置
   - 基础设施监控

9. **rules/knene-alerts.yml** - 告警规则配置
   - 应用可用性告警
   - 业务指标告警
   - 基础设施告警

10. **elasticsearch.yml** - Elasticsearch配置
    - 集群配置
    - 索引模板配置
    - 中文分词配置

11. **datasource-config.yml** - 数据库配置
    - 读写分离配置
    - 分库分表配置
    - 连接池配置

12. **security-config.yml** - 安全配置
    - OAuth2配置
    - JWT配置
    - 密码策略配置
    - 访问控制配置

13. **external-services.yml** - 外部服务配置
    - TMDb API配置
    - 支付服务配置
    - 邮件服务配置
    - 短信服务配置

14. **cache-config.yml** - 缓存配置
    - 多级缓存配置
    - 缓存策略配置
    - 缓存监控配置

15. **.env.example** - 环境变量示例
    - 所有环境变量说明
    - 配置示例值
    - 部署参考

## 配置优先级

Spring Boot配置文件加载优先级（从高到低）：

1. 命令行参数
2. 环境变量
3. 外部配置文件
4. 内部配置文件

## 环境变量使用

### 必需的环境变量

生产环境必须配置的环境变量：

```bash
# 数据库
DB_HOST=your-db-host
DB_PORT=3306
DB_NAME=knene_prod
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT
JWT_SECRET=your-jwt-secret-key

# Elasticsearch
ES_URIS=http://your-es-host:9200
ES_USERNAME=your-es-username
ES_PASSWORD=your-es-password

# RocketMQ
ROCKETMQ_NAME_SERVER=your-rocketmq-host:9876

# MinIO
MINIO_ENDPOINT=https://your-minio-host:9000
MINIO_ACCESS_KEY=your-minio-access-key
MINIO_SECRET_KEY=your-minio-secret-key
MINIO_BUCKET_NAME=knene-resources
```

### 可选的环境变量

根据需要启用的功能配置：

```bash
# OAuth2登录
OAUTH2_ENABLED=true
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# 支付功能
ALIPAY_ENABLED=true
ALIPAY_APP_ID=your-alipay-app-id
ALIPAY_PRIVATE_KEY=your-alipay-private-key

# 邮件功能
MAIL_ENABLED=true
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-email-password

# 监控追踪
TRACING_ENABLED=true
ZIPKIN_BASE_URL=http://your-zipkin-host:9411
```

## 配置最佳实践

### 1. 敏感信息管理

- 使用环境变量存储敏感信息
- 不要在配置文件中硬编码密码
- 定期轮换密钥和令牌

### 2. 环境隔离

- 每个环境使用独立的数据库
- 不同环境使用不同的配置文件
- 生产环境配置要经过严格审查

### 3. 监控配置

- 启用应用监控和指标收集
- 配置合适的告警阈值
- 定期检查日志和监控数据

### 4. 安全配置

- 启用HTTPS和安全头
- 配置合适的CORS策略
- 启用CSRF保护
- 定期更新依赖版本

## 配置验证

### 启动时验证

应用启动时会验证以下配置：

1. 数据库连接
2. Redis连接
3. 必需的环境变量
4. 文件存储路径

### 运行时监控

通过Actuator端点监控配置：

- `/actuator/health` - 健康检查
- `/actuator/configprops` - 配置属性
- `/actuator/env` - 环境信息
- `/actuator/metrics` - 指标监控

## 故障排查

### 常见问题

1. **数据库连接失败**
   - 检查数据库服务状态
   - 验证连接参数
   - 检查网络连通性

2. **Redis连接失败**
   - 检查Redis服务状态
   - 验证认证信息
   - 检查防火墙设置

3. **外部服务调用失败**
   - 检查API密钥有效性
   - 验证网络连接
   - 查看服务状态页面

4. **内存溢出**
   - 调整JVM参数
   - 优化缓存配置
   - 检查内存泄漏

### 日志分析

通过日志文件排查问题：

- 应用日志：`logs/knene-backend.log`
- 错误日志：`logs/knene-backend-error.log`
- SQL日志：`logs/knene-backend-sql.log`

## 配置更新

### 热更新

部分配置支持热更新：

- 日志级别
- 缓存配置
- 监控配置

### 重启更新

需要重启应用的配置：

- 数据库配置
- 端口配置
- 安全配置

## 版本管理

配置文件版本管理建议：

1. 使用版本控制管理配置文件
2. 敏感信息使用环境变量
3. 生产配置需要审批流程
4. 定期备份配置文件

---

> 作者：mosctz
> 版本：1.0
> 更新时间：2024年