# 影视资源下载网站后端开发规范

## 开发原则

### 数据库优先开发原则
- **数据库设计优先**：优先设计数据库结构和表关系
- **测试数据驱动**：插入充足的测试数据（每个表50-100条记录）
- **真实数据开发**：基于真实数据库数据进行所有开发工作
- **数据完整性**：确保所有API调用都基于真实数据响应

### 后端主导开发原则
- **API权威性**：后端定义的API接口规范和数据结构为唯一标准
- **业务逻辑核心**：以后端业务逻辑完整性为准，前端适配后端功能
- **数据结构权威**：后端领域模型和数据结构是前端实现的依据

## 1. 项目目录结构

```
KneneBackend
├── .gitattributes
├── .gitignore
├── .mvn/
│   └── wrapper/
│       └── maven-wrapper.properties
├── docs/
│   ├── config_guide.md
│   ├── redis_design.md
│   ├── project_modules_plan_process.md
│   ├── backend_complete_documentation.md
│   └── development_standards.md
├── logs/
│   └── application-dev.log
├── lombok.config
├── mvnw
├── mvnw.cmd
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── knene/
│   │   │           └── movie/
│   │   │               ├── MovieBackendApplication.java
│   │   │               ├── application/                    # 应用层 - 应用服务
│   │   │               │   ├── auth/                      # 认证应用服务
│   │   │               │   │   ├── AuthService.java
│   │   │               │   │   ├── dto/
│   │   │               │   │   └── service/
│   │   │               │   ├── user/                      # 用户应用服务
│   │   │               │   │   ├── UserApplicationService.java
│   │   │               │   │   ├── command/
│   │   │               │   │   └── dto/
│   │   │               │   ├── resource/                  # 资源应用服务
│   │   │               │   │   ├── ResourceApplicationService.java
│   │   │               │   │   ├── command/
│   │   │               │   │   └── dto/
│   │   │               │   ├── content/                   # 内容应用服务
│   │   │               │   │   ├── ContentApplicationService.java
│   │   │               │   │   ├── command/
│   │   │               │   │   └── dto/
│   │   │               │   ├── vip/                       # VIP应用服务
│   │   │               │   │   ├── VipApplicationService.java
│   │   │               │   │   ├── command/
│   │   │               │   │   └── dto/
│   │   │               │   ├── search/                    # 搜索应用服务
│   │   │               │   │   ├── SearchApplicationService.java
│   │   │               │   │   ├── command/
│   │   │               │   │   └── dto/
│   │   │               │   ├── crawler/                   # 爬虫应用服务
│   │   │               │   │   ├── CrawlerApplicationService.java
│   │   │               │   │   ├── command/
│   │   │               │   │   └── dto/
│   │   │               │   ├── payment/                   # 支付应用服务
│   │   │               │   │   ├── PaymentApplicationService.java
│   │   │               │   │   ├── command/
│   │   │               │   │   └── dto/
│   │   │               │   ├── notification/              # 通知应用服务
│   │   │               │   │   ├── NotificationApplicationService.java
│   │   │               │   │   ├── command/
│   │   │               │   │   └── dto/
│   │   │               │   ├── download/                  # 下载应用服务
│   │   │               │   │   ├── DownloadApplicationService.java
│   │   │               │   │   ├── command/
│   │   │               │   │   └── dto/
│   │   │               │   ├── request/                   # 求片应用服务
│   │   │               │   │   ├── RequestApplicationService.java
│   │   │               │   │   ├── command/
│   │   │               │   │   └── dto/
│   │   │               │   ├── signin/                    # 签到应用服务
│   │   │               │   │   ├── SignInApplicationService.java
│   │   │               │   │   ├── command/
│   │   │               │   │   └── dto/
│   │   │               │   ├── points/                    # 积分应用服务
│   │   │               │   │   ├── PointsApplicationService.java
│   │   │               │   │   ├── command/
│   │   │               │   │   └── dto/
│   │   │               │   ├── exchange/                  # 兑换应用服务
│   │   │               │   │   ├── ExchangeApplicationService.java
│   │   │               │   │   ├── command/
│   │   │               │   │   └── dto/
│   │   │               │   └── event/                     # 事件处理
│   │   │               │       ├── EventHandler.java
│   │   │               │       └── listener/
│   │   │               ├── domain/                        # 领域层 - 领域模型
│   │   │               │   ├── common/                    # 通用领域组件
│   │   │               │   │   ├── base/                   # 基础类
│   │   │               │   │   ├── valueobject/            # 值对象
│   │   │               │   │   └── exception/              # 领域异常
│   │   │               │   ├── user/                      # 用户领域
│   │   │               │   │   ├── entity/                 # 实体
│   │   │               │   │   │   ├── User.java
│   │   │               │   │   │   ├── UserProfile.java
│   │   │               │   │   │   └── UserPermission.java
│   │   │               │   │   ├── enums/                  # 枚举
│   │   │               │   │   │   ├── UserStatus.java
│   │   │               │   │   │   └── UserLevel.java
│   │   │               │   │   ├── event/                  # 领域事件
│   │   │               │   │   │   ├── UserRegisteredEvent.java
│   │   │               │   │   │   └── UserUpdatedEvent.java
│   │   │               │   │   ├── repository/             # 仓储接口
│   │   │               │   │   │   ├── UserRepository.java
│   │   │               │   │   │   └── UserProfileRepository.java
│   │   │               │   │   └── service/                # 领域服务
│   │   │               │   │       ├── UserDomainService.java
│   │   │               │   │       └── impl/
│   │   │               │   ├── resource/                  # 资源领域
│   │   │               │   │   ├── entity/
│   │   │               │   │   │   ├── Resource.java
│   │   │               │   │   │   ├── ResourceFile.java
│   │   │               │   │   │   ├── Category.java
│   │   │               │   │   │   └── Tag.java
│   │   │               │   │   ├── enums/
│   │   │               │   │   │   ├── ResourceType.java
│   │   │               │   │   │   └── ResourceStatus.java
│   │   │               │   │   ├── event/
│   │   │               │   │   │   ├── ResourceCreatedEvent.java
│   │   │               │   │   │   └── ResourceUpdatedEvent.java
│   │   │               │   │   ├── repository/
│   │   │               │   │   │   ├── ResourceRepository.java
│   │   │               │   │   │   └── CategoryRepository.java
│   │   │               │   │   └── service/
│   │   │               │   │       ├── ResourceDomainService.java
│   │   │               │   │       └── impl/
│   │   │               │   ├── content/                   # 内容领域
│   │   │               │   │   ├── entity/
│   │   │               │   │   │   ├── Article.java
│   │   │               │   │   │   ├── WikiEntry.java
│   │   │               │   │   │   └── Comment.java
│   │   │               │   │   ├── enums/
│   │   │               │   │   │   ├── ArticleType.java
│   │   │               │   │   │   └── CommentStatus.java
│   │   │               │   │   ├── repository/
│   │   │               │   │   │   ├── ArticleRepository.java
│   │   │               │   │   │   └── WikiRepository.java
│   │   │               │   │   └── service/
│   │   │               │   │       ├── ContentDomainService.java
│   │   │               │   │       └── impl/
│   │   │               │   ├── vip/                       # VIP领域
│   │   │               │   │   ├── entity/
│   │   │               │   │   │   ├── VipMembership.java
│   │   │               │   │   │   ├── Order.java
│   │   │               │   │   │   └── PaymentRecord.java
│   │   │               │   │   ├── enums/
│   │   │               │   │   │   ├── VipLevel.java
│   │   │               │   │   │   └── OrderStatus.java
│   │   │               │   │   ├── repository/
│   │   │               │   │   │   ├── VipMembershipRepository.java
│   │   │               │   │   │   └── OrderRepository.java
│   │   │               │   │   └── service/
│   │   │               │   │       ├── VipDomainService.java
│   │   │               │   │       └── impl/
│   │   │               │   ├── verification/              # 验证领域
│   │   │               │   │   ├── entity/
│   │   │               │   │   │   ├── EmailVerification.java
│   │   │               │   │   │   └── PasswordReset.java
│   │   │               │   │   ├── repository/
│   │   │               │   │   │   └── VerificationRepository.java
│   │   │               │   │   └── service/
│   │   │               │   │       └── impl/
│   │   │               │   ├── download/                  # 下载领域
│   │   │               │   │   ├── entity/
│   │   │               │   │   │   ├── DownloadRecord.java
│   │   │               │   │   │   └── DownloadStats.java
│   │   │               │   │   ├── repository/
│   │   │               │   │   │   └── DownloadRepository.java
│   │   │               │   │   └── service/
│   │   │               │   │       └── impl/
│   │   │               │   └── search/                    # 搜索领域
│   │   │               │       ├── entity/
│   │   │               │       │   ├── SearchHistory.java
│   │   │               │       │   └── SearchSuggestion.java
│   │   │               │       ├── repository/
│   │   │               │       │   └── SearchRepository.java
│   │   │               │       └── service/
│   │   │               │           └── impl/
│   │   │               ├── infrastructure/                # 基础设施层
│   │   │               │   ├── common/                    # 通用基础设施
│   │   │               │   │   ├── aop/                    # 切面编程
│   │   │               │   │   │   ├── LoggingAspect.java
│   │   │               │   │   │   ├── PerformanceAspect.java
│   │   │               │   │   │   └── SecurityAspect.java
│   │   │               │   │   ├── exception/              # 异常处理
│   │   │               │   │   │   ├── GlobalExceptionHandler.java
│   │   │               │   │   │   └── BusinessException.java
│   │   │               │   │   └── utils/                  # 工具类
│   │   │               │   │       ├── StringUtils.java
│   │   │               │   │       ├── DateUtils.java
│   │   │               │   │       ├── EncryptUtils.java
│   │   │               │   │       ├── IdGenerator.java
│   │   │               │   │       └── ResponseUtils.java
│   │   │               │   ├── config/                    # 配置管理
│   │   │               │   │   ├── properties/             # 配置属性
│   │   │               │   │   │   ├── AppProperties.java
│   │   │               │   │   │   ├── DatabaseProperties.java
│   │   │               │   │   │   └── RedisProperties.java
│   │   │               │   │   ├── WebMvcConfig.java       # Web配置
│   │   │               │   │   └── SwaggerConfig.java      # API文档配置
│   │   │               │   ├── persistence/                # 持久化层
│   │   │               │   │   ├── config/                  # 持久化配置
│   │   │               │   │   │   ├── DruidConfig.java       # Druid连接池配置
│   │   │               │   │   │   └── DataSourceConfig.java  # 数据源配置
│   │   │               │   │   ├── base/                   # 基础持久化
│   │   │               │   │   │   ├── BaseEntity.java
│   │   │               │   │   │   ├── BaseMapper.java
│   │   │               │   │   │   └── BaseRepository.java
│   │   │               │   │   ├── repository/             # 仓储实现
│   │   │               │   │   │   └── impl/
│   │   │               │   │   │       ├── UserRepositoryImpl.java
│   │   │               │   │   │       ├── ResourceRepositoryImpl.java
│   │   │               │   │   │       ├── ContentRepositoryImpl.java
│   │   │               │   │   │       ├── VipRepositoryImpl.java
│   │   │               │   │   │       ├── VerificationRepositoryImpl.java
│   │   │               │   │   │       ├── DownloadRepositoryImpl.java
│   │   │               │   │   │       └── SearchRepositoryImpl.java
│   │   │               │   │   ├── mapper/                  # MyBatis映射
│   │   │               │   │   │   ├── user/
│   │   │               │   │   │   │   ├── UserMapper.java
│   │   │               │   │   │   │   ├── UserMapper.xml
│   │   │               │   │   │   │   ├── UserProfileMapper.java
│   │   │               │   │   │   │   └── UserProfileMapper.xml
│   │   │               │   │   │   ├── resource/
│   │   │               │   │   │   │   ├── ResourceMapper.java
│   │   │               │   │   │   │   ├── ResourceMapper.xml
│   │   │               │   │   │   │   ├── CategoryMapper.java
│   │   │               │   │   │   │   └── CategoryMapper.xml
│   │   │               │   │   │   ├── content/
│   │   │               │   │   │   │   ├── ArticleMapper.java
│   │   │               │   │   │   │   ├── ArticleMapper.xml
│   │   │               │   │   │   │   ├── WikiMapper.java
│   │   │               │   │   │   │   └── WikiMapper.xml
│   │   │               │   │   │   ├── vip/
│   │   │               │   │   │   │   ├── VipMembershipMapper.java
│   │   │               │   │   │   │   ├── VipMembershipMapper.xml
│   │   │               │   │   │   │   ├── OrderMapper.java
│   │   │               │   │   │   │   └── OrderMapper.xml
│   │   │               │   │   │   ├── verification/
│   │   │               │   │   │   │   ├── EmailVerificationMapper.java
│   │   │               │   │   │   │   └── EmailVerificationMapper.xml
│   │   │               │   │   │   └── download/
│   │   │               │   │   │       ├── DownloadRecordMapper.java
│   │   │               │   │   │       └── DownloadRecordMapper.xml
│   │   │               │   │   └── entity/                  # 数据库实体
│   │   │               │   │       ├── user/
│   │   │               │   │       │   ├── UserDO.java
│   │   │               │   │       │   ├── UserProfileDO.java
│   │   │               │   │       │   └── UserPermissionDO.java
│   │   │               │   │       ├── resource/
│   │   │               │   │       │   ├── ResourceDO.java
│   │   │               │   │       │   ├── ResourceFileDO.java
│   │   │               │   │       │   ├── CategoryDO.java
│   │   │               │   │       │   └── TagDO.java
│   │   │               │   │       ├── content/
│   │   │               │   │       │   ├── ArticleDO.java
│   │   │               │   │       │   ├── WikiEntryDO.java
│   │   │               │   │       │   └── CommentDO.java
│   │   │               │   │       ├── vip/
│   │   │               │   │       │   ├── VipMembershipDO.java
│   │   │               │   │       │   ├── OrderDO.java
│   │   │               │   │       │   └── PaymentRecordDO.java
│   │   │               │   │       ├── verification/
│   │   │               │   │       │   ├── EmailVerificationDO.java
│   │   │               │   │       │   └── PasswordResetDO.java
│   │   │               │   │       └── download/
│   │   │               │   │           ├── DownloadRecordDO.java
│   │   │               │   │           └── DownloadStatsDO.java
│   │   │               │   ├── security/                  # 安全设施
│   │   │               │   │   ├── annotation/             # 安全注解
│   │   │               │   │   │   ├── RequireAuth.java
│   │   │               │   │   │   ├── RequirePermission.java
│   │   │               │   │   │   └── RequireVip.java
│   │   │               │   │   ├── aspect/                 # 安全切面
│   │   │               │   │   │   ├── AuthAspect.java
│   │   │               │   │   │   ├── PermissionAspect.java
│   │   │               │   │   │   └── RateLimitAspect.java
│   │   │               │   │   ├── filter/                 # 安全过滤器
│   │   │               │   │   │   ├── JwtAuthenticationFilter.java
│   │   │               │   │   │   ├── CorsFilter.java
│   │   │               │   │   │   └── RateLimitFilter.java
│   │   │               │   │   ├── service/                # 安全服务
│   │   │               │   │   │   ├── JwtService.java
│   │   │               │   │   │   ├── PasswordService.java
│   │   │               │   │   │   ├── PermissionService.java
│   │   │               │   │   │   └── impl/
│   │   │               │   │   │       ├── JwtServiceImpl.java
│   │   │               │   │   │       ├── PasswordServiceImpl.java
│   │   │               │   │   │       └── PermissionServiceImpl.java
│   │   │               │   │   └── handler/                # 安全处理器
│   │   │               │   │       ├── AuthenticationFailureHandler.java
│   │   │               │   │       └── AccessDeniedHandler.java
│   │   │               │   ├── cache/                    # 缓存设施
│   │   │               │   │   ├── CacheService.java
│   │   │               │   │   ├── impl/
│   │   │               │   │   │   ├── RedisCacheServiceImpl.java
│   │   │               │   │   │   └── LocalCacheServiceImpl.java
│   │   │               │   │   └── annotation/
│   │   │               │   │       ├── Cacheable.java
│   │   │               │   │       └── CacheEvict.java
│   │   │               │   ├── email/                   # 邮件设施
│   │   │               │   │   ├── EmailService.java
│   │   │               │   │   ├── impl/
│   │   │               │   │   │   ├── SmtpEmailServiceImpl.java
│   │   │               │   │   │   └── EmailServiceImpl.java
│   │   │               │   │   └── template/
│   │   │               │   │       ├── WelcomeEmailTemplate.html
│   │   │               │   │       └── PasswordResetEmailTemplate.html
│   │   │               │   ├── captcha/                 # 验证码设施
│   │   │               │   │   ├── CaptchaService.java
│   │   │               │   │   ├── TurnstileService.java
│   │   │               │   │   └── impl/
│   │   │               │   ├── crawler/                 # 爬虫设施
│   │   │               │   │   ├── CrawlerEngine.java
│   │   │               │   │   ├── PageParser.java
│   │   │               │   │   ├── ProxyManager.java
│   │   │               │   │   ├── impl/
│   │   │               │   │   │   ├── TorrentGalaxyCrawler.java
│   │   │               │   │   │   ├── SpringSundayCrawler.java
│   │   │               │   │   │   └── DoubanCrawler.java
│   │   │               │   │   └── config/
│   │   │               │   │       ├── CrawlerConfig.java
│   │   │               │   │       └── ProxyConfig.java
│   │   │               │   ├── storage/                 # 存储设施
│   │   │               │   │   ├── FileStorageService.java
│   │   │               │   │   ├── ImageUploadService.java
│   │   │               │   │   ├── impl/
│   │   │               │   │   │   ├── LocalFileStorageServiceImpl.java
│   │   │               │   │   │   ├── ImageHostingServiceImpl.java
│   │   │               │   │   │   └── NetDiskStorageServiceImpl.java
│   │   │               │   │   └── config/
│   │   │               │   │       ├── StorageConfig.java
│   │   │               │   │       └── ImageHostingConfig.java
│   │   │               │   ├── payment/                 # 支付设施
│   │   │               │   │   ├── PaymentService.java
│   │   │               │   │   ├── AlipayService.java
│   │   │               │   │   ├── WechatPayService.java
│   │   │               │   │   ├── impl/
│   │   │               │   │   │   ├── AlipayServiceImpl.java
│   │   │               │   │   │   └── WechatPayServiceImpl.java
│   │   │               │   │   └── handler/
│   │   │               │   │       ├── PaymentCallbackHandler.java
│   │   │               │   │       └── PaymentNotifyHandler.java
│   │   │               │   ├── search/                  # 搜索设施
│   │   │               │   │   ├── SearchService.java
│   │   │               │   │   ├── ElasticsearchService.java
│   │   │               │   │   ├── impl/
│   │   │               │   │   │   ├── DatabaseSearchServiceImpl.java
│   │   │               │   │   │   └── ElasticsearchSearchServiceImpl.java
│   │   │               │   │   └── config/
│   │   │               │   │       ├── ElasticsearchConfig.java
│   │   │               │   │       └── SearchIndexConfig.java
│   │   │               │   ├── notification/             # 通知设施
│   │   │               │   │   ├── NotificationService.java
│   │   │               │   │   ├── WebSocketNotificationService.java
│   │   │               │   │   ├── impl/
│   │   │               │   │   │   ├── EmailNotificationServiceImpl.java
│   │   │               │   │   │   └── WebSocketNotificationServiceImpl.java
│   │   │               │   │   └── config/
│   │   │               │   │       ├── WebSocketConfig.java
│   │   │               │   │       └── NotificationConfig.java
│   │   │               │   ├── external/                 # 外部服务集成
│   │   │               │   │   ├── TmdbService.java         # TMDb API
│   │   │               │   │   ├── NetdiskService.java     # 网盘服务
│   │   │               │   │   ├── impl/
│   │   │               │   │   │   ├── TmdbServiceImpl.java
│   │   │               │   │   │   └── NetdiskServiceImpl.java
│   │   │               │   │   └── config/
│   │   │               │   │       ├── ExternalApiConfig.java
│   │   │               │   │       └── NetdiskConfig.java
│   │   │               │   ├── task/                    # 定时任务
│   │   │               │   │   ├── ResourceUpdateTask.java
│   │   │               │   │   ├── CacheCleanupTask.java
│   │   │               │   │   ├── LinkValidationTask.java
│   │   │               │   │   └── TaskScheduler.java
│   │   │               │   └── monitor/                 # 监控设施
│   │   │               │       ├── MetricsService.java
│   │   │               │       ├── HealthCheckService.java
│   │   │               │       ├── PerformanceMonitor.java
│   │   │               │       └── impl/
│   │   │               └── interfaces/                  # 接口层
│   │   │                   ├── api/                      # REST API
│   │   │                   │   ├── auth/                  # 认证API
│   │   │                   │   │   ├── AuthController.java
│   │   │                   │   │   ├── RegisterRequest.java
│   │   │                   │   │   ├── LoginRequest.java
│   │   │                   │   │   └── AuthResponse.java
│   │   │                   │   ├── user/                  # 用户API
│   │   │                   │   │   ├── UserController.java
│   │   │                   │   │   ├── UserProfileController.java
│   │   │                   │   │   ├── UserRequest.java
│   │   │                   │   │   └── UserResponse.java
│   │   │                   │   ├── resource/              # 资源API
│   │   │                   │   │   ├── ResourceController.java
│   │   │                   │   │   ├── CategoryController.java
│   │   │                   │   │   ├── ResourceRequest.java
│   │   │                   │   │   └── ResourceResponse.java
│   │   │                   │   ├── content/               # 内容API
│   │   │                   │   │   ├── ArticleController.java
│   │   │                   │   │   ├── WikiController.java
│   │   │                   │   │   ├── CommentController.java
│   │   │                   │   │   ├── ArticleRequest.java
│   │   │                   │   │   └── ArticleResponse.java
│   │   │                   │   ├── vip/                   # VIP API
│   │   │                   │   │   ├── VipController.java
│   │   │                   │   │   ├── OrderController.java
│   │   │                   │   │   ├── VipRequest.java
│   │   │                   │   │   └── VipResponse.java
│   │   │                   │   ├── search/                # 搜索API
│   │   │                   │   │   ├── SearchController.java
│   │   │                   │   │   ├── SearchRequest.java
│   │   │                   │   │   └── SearchResponse.java
│   │   │                   │   ├── download/              # 下载API
│   │   │                   │   │   ├── DownloadController.java
│   │   │                   │   │   ├── DownloadRequest.java
│   │   │                   │   │   └── DownloadResponse.java
│   │   │                   │   ├── admin/                 # 管理API
│   │   │                   │   │   ├── AdminUserController.java
│   │   │                   │   │   ├── AdminResourceController.java
│   │   │                   │   │   ├── AdminContentController.java
│   │   │                   │   │   └── AdminSystemController.java
│   │   │                   │   └── common/                # 通用API
│   │   │                   │       ├── HealthController.java
│   │   │                   │       ├── InfoController.java
│   │   │                   │       └── UploadController.java
│   │   │                   ├── assembler/                # 对象组装器
│   │   │                   │   ├── UserAssembler.java
│   │   │                   │   ├── ResourceAssembler.java
│   │   │                   │   ├── ContentAssembler.java
│   │   │                   │   ├── VipAssembler.java
│   │   │                   │   └── SearchAssembler.java
│   │   │                   ├── dto/                     # 数据传输对象
│   │   │                   │   ├── request/               # 请求DTO
│   │   │                   │   │   ├── user/
│   │   │                   │   │   │   ├── UserCreateRequest.java
│   │   │                   │   │   │   ├── UserUpdateRequest.java
│   │   │                   │   │   │   └── UserQueryRequest.java
│   │   │                   │   │   ├── resource/
│   │   │                   │   │   │   ├── ResourceCreateRequest.java
│   │   │                   │   │   │   ├── ResourceUpdateRequest.java
│   │   │                   │   │   │   └── ResourceQueryRequest.java
│   │   │                   │   │   ├── content/
│   │   │                   │   │   │   ├── ArticleCreateRequest.java
│   │   │                   │   │   │   ├── ArticleUpdateRequest.java
│   │   │                   │   │   │   └── ArticleQueryRequest.java
│   │   │                   │   │   ├── vip/
│   │   │                   │   │   │   ├── VipPurchaseRequest.java
│   │   │                   │   │   │   └── OrderCreateRequest.java
│   │   │                   │   │   ├── search/
│   │   │                   │   │   │   └── SearchRequest.java
│   │   │                   │   │   └── common/
│   │   │                   │   │       ├── PageRequest.java
│   │   │                   │   │       └── SortRequest.java
│   │   │                   │   └── response/              # 响应DTO
│   │   │                   │       ├── user/
│   │   │                   │       │   ├── UserResponse.java
│   │   │                   │       │   ├── UserProfileResponse.java
│   │   │                   │       │   └── UserPermissionResponse.java
│   │   │                   │       ├── resource/
│   │   │                   │       │   ├── ResourceResponse.java
│   │   │                   │       │   ├── ResourceListResponse.java
│   │   │                   │       │   └── CategoryResponse.java
│   │   │                   │       ├── content/
│   │   │                   │       │   ├── ArticleResponse.java
│   │   │                   │       │   ├── ArticleListResponse.java
│   │   │                   │       │   └── CommentResponse.java
│   │   │                   │       ├── vip/
│   │   │                   │       │   ├── VipMembershipResponse.java
│   │   │                   │       │   └── OrderResponse.java
│   │   │                   │       ├── search/
│   │   │                   │       │   ├── SearchResponse.java
│   │   │                   │       │   └── SearchResult.java
│   │   │                   │       └── common/
│   │   │                   │           ├── PageResponse.java
│   │   │                   │           ├── ApiResponse.java
│   │   │                   │           └── ErrorResponse.java
│   │   │                   ├── websocket/              # WebSocket接口
│   │   │                   │   ├── WebSocketConfig.java
│   │   │                   │   ├── NotificationWebSocketHandler.java
│   │   │                   │   └── WebSocketSessionManager.java
│   │   │                   └── filter/                 # 过滤器
│   │   │                       ├── RequestLoggingFilter.java
│   │   │                       ├── CorsFilter.java
│   │   │                       └── RateLimitFilter.java
│   │   └── resources/
│   │       ├── application.yml                 # 主配置文件
│   │       ├── application-dev.yml             # 开发环境配置
│   │       ├── application-test.yml            # 测试环境配置
│   │       ├── application-prod.yml            # 生产环境配置
│   │       ├── db/                              # 数据库脚本
│   │       │   └── migration/                  # Flyway迁移脚本
│   │       │       ├── V1__init_database.sql
│   │       │       ├── V2__create_user_tables.sql
│   │       │       ├── V3__create_resource_tables.sql
│   │       │       ├── V4__create_content_tables.sql
│   │       │       ├── V5__create_vip_tables.sql
│   │       │       ├── V6__create_verification_tables.sql
│   │       │       ├── V7__create_download_tables.sql
│   │       │       └── V8__init_data.sql
│   │       ├── mapper/                          # MyBatis映射文件
│   │       │   ├── user/
│   │       │   │   ├── UserMapper.xml
│   │       │   │   └── UserProfileMapper.xml
│   │       │   ├── resource/
│   │       │   │   ├── ResourceMapper.xml
│   │       │   │   └── CategoryMapper.xml
│   │       │   ├── content/
│   │       │   │   ├── ArticleMapper.xml
│   │       │   │   └── WikiMapper.xml
│   │       │   ├── vip/
│   │       │   │   ├── VipMembershipMapper.xml
│   │       │   │   └── OrderMapper.xml
│   │       │   ├── verification/
│   │       │   │   └── EmailVerificationMapper.xml
│   │       │   └── download/
│   │       │       └── DownloadRecordMapper.xml
│   │       ├── static/                          # 静态资源
│   │       │   ├── css/
│   │       │   ├── js/
│   │       │   └── images/
│   │       ├── templates/                       # 模板文件
│   │       │   ├── email/
│   │       │   │   ├── welcome.html
│   │       │   │   └── password-reset.html
│   │       │   └── error/
│   │       │       ├── 404.html
│   │       │       └── 500.html
│   │       └── logback-spring.xml              # 日志配置
│   └── test/
│       ├── java/
│       │   └── com/
│       │       └── knene/
│       │           └── movie/
│       │               ├── domain/               # 领域层测试
│       │               │   ├── user/
│       │               │   │   ├── UserServiceTest.java
│       │               │   │   ├── UserRepositoryTest.java
│       │               │   │   └── UserDomainServiceTest.java
│       │               │   ├── resource/
│       │               │   │   ├── ResourceServiceTest.java
│       │               │   │   ├── ResourceRepositoryTest.java
│       │               │   │   └── ResourceDomainServiceTest.java
│       │               │   └── content/
│       │               │       ├── ArticleServiceTest.java
│       │               │       └── WikiServiceTest.java
│       │               ├── application/           # 应用层测试
│       │               │   ├── auth/
│       │               │   │   └── AuthServiceTest.java
│       │               │   ├── user/
│       │               │   │   └── UserApplicationServiceTest.java
│       │               │   └── resource/
│       │               │       └── ResourceApplicationServiceTest.java
│       │               ├── infrastructure/        # 基础设施测试
│       │               │   ├── persistence/
│       │               │   │   ├── repository/
│       │               │   │   │   ├── UserRepositoryImplTest.java
│       │               │   │   │   └── ResourceRepositoryImplTest.java
│       │               │   │   └── mapper/
│       │               │   │       ├── UserMapperTest.java
│       │               │   │       └── ResourceMapperTest.java
│       │               │   ├── security/
│       │               │   │   ├── JwtServiceTest.java
│       │               │   │   └── PasswordServiceTest.java
│       │               │   └── crawler/
│       │               │       ├── TorrentGalaxyCrawlerTest.java
│       │               │       └── SpringSundayCrawlerTest.java
│       │               ├── interfaces/             # 接口层测试
│       │               │   ├── api/
│       │               │   │   ├── auth/
│       │               │   │   │   └── AuthControllerTest.java
│       │               │   │   ├── user/
│       │               │   │   │   └── UserControllerTest.java
│       │               │   │   └── resource/
│       │               │   │       └── ResourceControllerTest.java
│       │               │   └── websocket/
│       │               │       └── NotificationWebSocketTest.java
│       │               └── integration/            # 集成测试
│       │                   ├── AuthIntegrationTest.java
│       │                   ├── UserIntegrationTest.java
│       │                   ├── ResourceIntegrationTest.java
│       │                   ├── ContentIntegrationTest.java
│       │                   ├── VipIntegrationTest.java
│       │                   ├── SearchIntegrationTest.java
│       │                   └── DownloadIntegrationTest.java
│       └── resources/
│           ├── application-test.yml            # 测试配置
│           ├── test-data.sql                   # 测试数据
│           └── testcontainers/                 # 容器测试配置
└── target/                                     # Maven构建输出
```

### 1.1 架构层次说明

项目采用**领域驱动设计（DDD）**和**六边形架构（Ports & Adapters）**，分为以下主要层次：

#### 1.1.1 应用层（Application Layer）
负责应用服务和业务流程编排，处理用例相关的逻辑：
- **auth**: 认证应用服务
- **user**: 用户应用服务
- **resource**: 资源应用服务
- **content**: 内容应用服务
- **vip**: VIP应用服务
- **search**: 搜索应用服务
- **crawler**: 爬虫应用服务
- **payment**: 支付应用服务
- **notification**: 通知应用服务
- **download**: 下载应用服务
- **request**: 求片应用服务
- **signin**: 签到应用服务
- **points**: 积分应用服务
- **exchange**: 兑换应用服务
- **event**: 事件处理

#### 1.1.2 领域层（Domain Layer）
包含核心业务逻辑和领域模型：
- **common**: 通用领域组件
- **user**: 用户领域模型
- **resource**: 资源领域模型
- **content**: 内容领域模型
- **vip**: VIP领域模型
- **verification**: 验证领域模型
- **download**: 下载领域模型
- **search**: 搜索领域模型
- **request**: 求片领域模型
- **signin**: 签到领域模型
- **points**: 积分领域模型
- **exchange**: 兑换领域模型

#### 1.1.3 基础设施层（Infrastructure Layer）
提供技术实现和外部依赖：
- **common**: 通用基础设施（AOP、异常处理、工具类）
- **config**: 配置管理
- **persistence**: 持久化实现（数据库、MyBatis、Druid连接池）
- **security**: 安全设施（JWT、权限控制）
- **cache**: 缓存设施
- **email**: 邮件设施
- **captcha**: 验证码设施
- **crawler**: 爬虫设施
- **storage**: 存储设施
- **payment**: 支付设施
- **search**: 搜索设施
- **notification**: 通知设施
- **external**: 外部服务集成
- **task**: 定时任务
- **monitor**: 监控设施

#### 1.1.4 接口层（Interfaces Layer）
对外提供接口和交互：
- **api**: REST API控制器
- **assembler**: 对象组装器
- **dto**: 数据传输对象
- **websocket**: WebSocket接口
- **filter**: 过滤器

### 1.2 模块说明

#### 1.2.1 用户系统模块
- **领域模型**: User、UserProfile、UserPermission
- **应用服务**: 用户注册、登录、信息管理、权限控制
- **基础设施**: 用户数据持久化、安全认证

#### 1.2.2 资源系统模块
- **领域模型**: Resource、ResourceFile、Category、Tag
- **应用服务**: 资源管理、分类管理、搜索功能
- **基础设施**: 资源数据持久化、爬虫集成

#### 1.2.3 内容管理模块
- **领域模型**: Article、WikiEntry、Comment
- **应用服务**: 文章管理、Wiki管理、评论系统
- **基础设施**: 内容数据持久化、搜索集成

#### 1.2.4 VIP系统模块
- **领域模型**: VipMembership、Order、PaymentRecord
- **应用服务**: 会员管理、订单处理、支付流程
- **基础设施**: 支付集成、VIP数据持久化

#### 1.2.5 搜索推荐模块
- **领域模型**: SearchHistory、SearchSuggestion
- **应用服务**: 搜索功能、推荐功能
- **基础设施**: Elasticsearch集成、搜索索引管理

#### 1.2.6 爬虫模块
- **基础设施**: 爬虫引擎、页面解析、代理管理
- **爬虫实现**: TorrentGalaxy、SpringSunday、豆瓣爬虫

#### 1.2.7 支付模块
- **基础设施**: 支付服务、支付宝/微信支付集成
- **应用服务**: 支付流程、回调处理、订单管理

#### 1.2.8 通知模块
- **基础设施**: 通知服务、邮件服务、WebSocket
- **应用服务**: 系统通知、用户消息、实时推送

#### 1.2.9 下载模块
- **领域模型**: DownloadRecord、DownloadStats
- **应用服务**: 下载管理、统计跟踪、权限控制
- **基础设施**: 下载记录持久化、限流控制

## 2. 代码与架构核心原则

### 2.1 架构设计原则

- **领域驱动设计（DDD）**：以业务领域为核心组织代码，强调领域模型的表达。
- **六边形架构（Ports & Adapters）**：业务核心与外部依赖解耦，便于扩展和测试。
- **SOLID 原则**：
  - 单一职责（SRP）：每个类/模块只负责一项功能。
  - 开闭原则（OCP）：对扩展开放，对修改关闭。
  - 依赖倒置（DIP）：依赖于抽象而非具体实现。
  - 接口隔离（ISP）：接口精细、职责单一。
  - 里氏替换（LSP）：子类可替换父类。

### 2.2 编码原则

- **DRY 原则**：避免重复代码，通用逻辑抽取到基类或工具类。
- **模板方法模式**：通用流程在基类实现，特殊逻辑由子类扩展。
- **依赖注入**：优先构造器注入，提升可测试性和灵活性。
- **高内聚低耦合**：模块内部紧密协作，模块间松耦合。
- **javadoc 注释**：所有类需有标准 javadoc 注释，便于维护和协作。

## 3. 开发与管理规范

### 3.1 代码修改规范

1. **变更说明**：所有新增、修改、删除操作前，需说明原因。若为 BUG 修复，需明确指出问题性质、原因及位置。
2. **模块化组织**：新增文件/目录应按功能模块化，保持高内聚低耦合。
3. **同步一致性**：涉及 src 组件/逻辑变更需保持同步。
4. **废弃清理**：替换新方案后，必须删除废弃代码。
5. **错误检查**：每次修改后，立即处理编译器和开发工具报错。
6. **零错误提交**：禁止提交包含编译错误的代码。

### 3.2 项目管理规范

1. **核心原则**：始终遵循 SOLID 原则，保持高内聚低耦合。
2. **项目认知**：项目开始前，务必阅读并理解 README.md，明确目标、架构、技术栈和开发计划。
3. **文档维护**：如无 README.md，需主动创建。每次目录/文件变更后，及时更新文档，保持一致。
4. **迭代记录**：每次代码变更后，需在 iterativeoptimal.md 记录修改内容，按 Markdown 顺序标记进度，已完成项注明"已完成"。

### 3.3 代码规范

#### 3.3.1 命名规范
- **驼峰命名法**：类名首字母大写，方法和变量首字母小写
- **常量命名**：全大写，下划线分隔
- **包名命名**：全小写，点号分隔

#### 3.3.2 注释规范
- **文件头注释**：所有文件顶部都必须使用标准的javadoc注释格式，说明文件用途、作者：mosctz、版本信息
- **行内注释**：除了文件头注释外，其他地方只用// 不要用块注释（/* */）
- **注释长度限制**：//注释可以换行，但是// 最多不超过3行，如果内容太多要超过3行，就要精简提炼，保证// 注释最多3行
- **参数字段注释**：参数、字段定义，只有特别重要，关键的才在后面加//注释，注意//的位置在参数/字段定义这一行的后面，不要在上面一行

**文件头javadoc注释示例：**
```java
/**
 * 用户应用服务类
 * 负责处理用户相关的业务逻辑，包括注册、登录、信息管理等功能
 *
 * @author mosctz
 * @version 1.0
 */
```

#### 3.3.3 异常处理
- **统一异常处理**：使用全局异常处理器
- **自定义异常**：根据业务需要定义自定义异常类
- **异常日志**：记录详细的异常信息便于排查

#### 3.3.4 日志规范
- **结构化日志**：使用统一的日志格式
- **日志级别**：合理使用 ERROR、WARN、INFO、DEBUG 级别
- **敏感信息**：避免在日志中记录敏感信息
- **日志架构**：
  - 开发环境：Spring Boot + Logback → Loki + Grafana
  - 生产环境：Spring Boot + Logback → Filebeat → Loki + Grafana
- **日志收集**：使用 PLG Stack (Promtail, Loki, Grafana) 替代传统 ELK Stack

#### 3.3.5 单元测试
- **测试覆盖率**：核心业务逻辑测试覆盖率不低于 80%
- **测试命名**：测试方法名清晰描述测试场景
- **测试隔离**：使用测试数据库隔离测试环境

## 4. API接口设计规范

### 4.1 RESTful API设计原则

#### 4.1.1 URL设计规范
- 使用名词而非动词：/api/v1/resources 而非 /api/v1/getResources
- 使用复数形式：/api/v1/users, /api/v1/resources
- 层级关系清晰：/api/v1/users/{userId}/favorites
- 避免深层嵌套：最多3层嵌套

#### 4.1.2 HTTP方法使用规范
- GET：获取资源
- POST：创建资源
- PUT：完整更新资源
- PATCH：部分更新资源
- DELETE：删除资源

### 4.2 统一响应格式

#### 4.2.1 成功响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {
    // 具体数据
  },
  "timestamp": "2024-01-01T12:00:00Z",
  "requestId": "uuid"
}
```

#### 4.2.2 分页响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [],
    "page": 1,
    "size": 20,
    "total": 100,
    "totalPages": 5
  },
  "timestamp": "2024-01-01T12:00:00Z",
  "requestId": "uuid"
}
```

#### 4.2.3 错误响应格式
```json
{
  "code": 400,
  "message": "参数错误",
  "error": {
    "type": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "邮箱格式不正确"
      }
    ]
  },
  "timestamp": "2024-01-01T12:00:00Z",
  "requestId": "uuid"
}
```

### 4.3 错误码定义

#### 4.3.1 系统级错误码
- 200：成功
- 400：请求参数错误
- 401：未认证
- 403：权限不足
- 404：资源不存在
- 429：请求过于频繁
- 500：服务器内部错误

#### 4.3.2 业务级错误码
- 10001：用户不存在
- 10002：密码错误
- 10003：账号已禁用
- 20001：资源不存在
- 20002：资源已下架
- 20003：VIP资源权限不足
- 30001：下载次数超限
- 30002：下载链接失效

### 4.4 API版本控制

#### 4.4.1 版本策略
- URL路径版本：/api/v1/, /api/v2/
- 向后兼容原则：新版本保持旧版本兼容
- 版本生命周期：一个版本至少维护6个月
- 废弃通知：提前3个月通知版本废弃

#### 4.4.2 版本升级策略
- 渐进式升级：新功能先在新版本实现
- 灰度发布：按用户比例切换到新版本
- 兼容性测试：确保新版本不影响现有功能

### 4.5 接口权限矩阵

#### 4.5.1 普通用户权限
- GET /api/v1/resources：查看普通资源
- GET /api/v1/resources/{id}：查看资源详情
- POST /api/v1/auth/login：用户登录
- GET /api/v1/user/profile：查看个人资料
- PUT /api/v1/user/profile：更新个人资料

#### 4.5.2 VIP用户权限
- 包含普通用户所有权限
- GET /api/v1/vip/resources：查看VIP资源
- POST /api/v1/download：下载VIP资源
- POST /api/v1/request：提交求片请求

#### 4.5.3 管理员权限
- 包含VIP用户所有权限
- POST /api/v1/admin/resources：创建资源
- PUT /api/v1/admin/resources/{id}：更新资源
- DELETE /api/v1/admin/resources/{id}：删除资源
- GET /api/v1/admin/users：用户管理
- POST /api/v1/admin/notifications：发送系统通知

### 4.6 接口限流策略

#### 4.6.1 限流维度
- 用户维度：每个用户每分钟最多100次请求
- IP维度：每个IP每分钟最多200次请求
- 接口维度：不同接口设置不同限流阈值
- 全局限流：系统整体每秒最多1000次请求

#### 4.6.2 限流规则
- 普通用户：每分钟60次请求
- VIP用户：每分钟200次请求
- 管理员：每分钟500次请求
- 下载接口：每分钟最多10次请求

## 5. 数据库规范

### 5.1 命名规范
- **表名**：小写字母，下划线分隔，使用复数形式
- **字段名**：小写字母，下划线分隔，使用有意义的名称
- **索引名**：idx_表名_字段名，唯一索引以uniq_开头
- **外键名**：fk_表名_字段名_引用表名_引用字段

### 5.2 索引规范
- **主键索引**：每个表必须有主键，推荐使用自增ID
- **唯一索引**：业务唯一字段必须建立唯一索引
- **复合索引**：根据查询频率和字段区分度合理创建复合索引
- **索引命名**：遵循统一的命名规范

### 5.3 SQL规范
- **关键字大小写**：SQL关键字大写，表名和字段名小写
- **格式规范**：合理使用缩进和换行，保持SQL可读性
- **注释规范**：复杂SQL需要添加注释说明
- **性能优化**：避免使用SELECT *，合理使用EXISTS替代IN

### 5.4 事务规范
- **事务粒度**：事务尽可能短小，避免长事务
- **异常处理**：事务异常时必须正确回滚
- **隔离级别**：根据业务需要选择合适的事务隔离级别
- **嵌套事务**：避免使用嵌套事务

### 5.5 版本控制
- **Flyway版本控制**：使用Flyway管理数据库版本
- **版本命名**：V{序号}__{描述}.sql格式
- **回滚脚本**：重要变更需要提供回滚脚本
- **环境隔离**：不同环境使用不同的数据库实例

## 6. 开发流程与最佳实践

### 6.1 开发流程

1. **需求分析**：理解业务需求，明确技术方案
2. **设计评审**：编写设计文档，进行技术评审
3. **编码实现**：按照编码规范进行开发
4. **单元测试**：编写并执行单元测试
5. **代码评审**：提交代码前进行同行评审
6. **集成测试**：在测试环境进行集成测试
7. **部署上线**：按照部署流程进行上线

### 6.2 Git使用规范

#### 6.2.1 分支策略
- **main分支**：生产环境分支，只接受来自release分支的合并
- **develop分支**：开发主分支，功能分支由此分支创建
- **feature分支**：功能开发分支，命名格式为feature/功能名称
- **hotfix分支**：紧急修复分支，命名格式为hotfix/问题描述
- **release分支**：发布分支，命名格式为release/版本号

#### 6.2.2 提交规范
- **提交格式**：type(scope): description
- **类型说明**：
  - feat：新功能
  - fix：bug修复
  - docs：文档更新
  - style：代码格式调整
  - refactor：代码重构
  - test：测试相关
  - chore：构建工具或辅助工具的变动

### 6.3 代码评审清单

#### 6.3.1 功能性检查
- [ ] 功能是否按照需求正确实现
- [ ] 边界条件是否考虑完整
- [ ] 异常处理是否合理
- [ ] 性能是否满足要求

#### 6.3.2 代码质量检查
- [ ] 代码是否遵循编码规范
- [ ] 是否存在代码重复
- [ ] 变量和方法命名是否合理
- [ ] 注释是否充分且准确

#### 6.3.3 安全性检查
- [ ] 是否存在SQL注入风险
- [ ] 敏感信息是否正确处理
- [ ] 权限控制是否合理
- [ ] 输入验证是否充分

### 6.4 性能优化指南

#### 6.4.1 数据库优化
- 合理使用索引，避免全表扫描
- 优化查询语句，避免不必要的关联查询
- 使用连接池，合理配置连接数
- 定期分析慢查询日志

#### 6.4.2 缓存优化
- 合理使用缓存，设置合适的过期时间
- 避免缓存穿透和缓存雪崩
- 使用缓存预热机制
- 监控缓存命中率

#### 6.4.3 代码优化
- 避免在循环中进行数据库操作
- 合理使用异步处理
- 减少不必要的对象创建
- 优化算法和数据结构选择

## 7. 前端埋点开发规范

### 7.1 埋点技术架构

**技术栈选择**：
- **Google Analytics 4 (GA4)**：核心数据分析平台
- **Hotjar**：用户体验分析工具
- **统一埋点SDK**：自建埋点管理工具

**埋点架构设计**：
```
前端应用 → 统一埋点SDK → GA4 + Hotjar → 数据分析平台
     ↓           ↓
   业务事件 → 后端API → 结构化日志 → 后端监控系统
```

### 7.2 埋点代码规范

#### 7.2.1 埋点SDK集成
```javascript
// 埋点SDK统一配置
class AnalyticsSDK {
  constructor(config) {
    this.ga4Config = config.ga4;
    this.hotjarConfig = config.hotjar;
    this.init();
  }

  // 统一事件追踪接口
  track(eventName, parameters = {}) {
    // 自动添加通用参数
    const enrichedParams = {
      ...parameters,
      timestamp: new Date().toISOString(),
      user_id: this.getUserId(),
      session_id: this.getSessionId(),
      page_url: window.location.href,
      user_agent: navigator.userAgent
    };

    // 发送到GA4
    this.sendToGA4(eventName, enrichedParams);

    // 关键业务事件同步发送到后端
    if (this.isBusinessCritical(eventName)) {
      this.sendToBackend(eventName, enrichedParams);
    }
  }
}
```

#### 7.2.2 事件命名规范
- **事件名称**：使用动词_名词格式，小写+下划线
- **参数名称**：使用snake_case格式
- **事件分类**：按业务模块分类（user_action, download_action, search_action等）

**标准事件示例**：
```javascript
// 用户行为事件
'user_page_view'
'user_register_success'
'user_login_success'
'user_logout'

// 资源相关事件
'resource_detail_view'
'resource_download_start'
'resource_download_complete'
'resource_favorite_add'
'resource_rating_submit'

// 搜索相关事件
'search_query_submit'
'search_result_click'
'search_filter_apply'

// 转化事件
'vip_purchase_start'
'vip_purchase_complete'
'vip_subscription_cancel'
```

#### 7.2.3 参数定义规范
```javascript
// 通用参数（自动添加）
{
  timestamp: '2024-01-01T12:00:00Z',    // 事件时间
  user_id: 'user_12345',              // 用户ID
  session_id: 'sess_67890',           // 会话ID
  page_url: 'https://example.com/page', // 页面URL
  user_agent: 'Mozilla/5.0...',       // 用户代理
  device_type: 'mobile',             // 设备类型
  user_type: 'vip'                   // 用户类型
}

// 业务特定参数
{
  resource_id: 'movie_12345',          // 资源ID
  resource_type: 'movie',             // 资源类型
  resource_quality: '1080p',          // 资源质量
  download_source: 'torrent_galaxy',  // 下载来源
  search_keyword: '热门电影',          // 搜索关键词
  search_result_count: 25,            // 搜索结果数
  vip_plan_type: 'monthly',           // VIP套餐类型
  payment_method: 'alipay'            // 支付方式
}
```

### 7.3 埋点实施规范

#### 7.3.1 页面埋点
```javascript
// 页面加载时自动触发
document.addEventListener('DOMContentLoaded', () => {
  AnalyticsSDK.track('page_view', {
    page_title: document.title,
    page_path: window.location.pathname,
    referrer: document.referrer
  });
});
```

#### 7.3.2 用户交互埋点
```javascript
// 按钮点击埋点
function setupButtonTracking() {
  document.addEventListener('click', (event) => {
    const element = event.target.closest('[data-track]');
    if (element) {
      const trackData = JSON.parse(element.dataset.track);
      AnalyticsSDK.track(trackData.event, trackData.params);
    }
  });
}

// HTML中使用方式
<button data-track='{"event": "download_click", "params": {"resource_id": "123"}}'>
  下载资源
</button>
```

#### 7.3.3 表单交互埋点
```javascript
// 表单提交埋点
function setupFormTracking() {
  document.querySelectorAll('form[data-track-form]').forEach(form => {
    form.addEventListener('submit', () => {
      const trackData = JSON.parse(form.dataset.trackForm);
      AnalyticsSDK.track(trackData.event, trackData.params);
    });
  });
}
```

### 7.4 埋点测试规范

#### 7.4.1 测试环境配置
```javascript
// 开发环境埋点配置
const analyticsConfig = {
  environment: process.env.NODE_ENV,
  ga4: {
    measurement_id: process.env.GA4_MEASUREMENT_ID,
    debug_mode: process.env.NODE_ENV === 'development'
  },
  hotjar: {
    site_id: process.env.HOTJAR_SITE_ID,
    enabled: process.env.NODE_ENV === 'production'
  }
};
```

#### 7.4.2 埋点数据验证
- **开发阶段**：启用debug模式，在控制台输出埋点数据
- **测试阶段**：使用GA4 DebugView验证数据接收
- **生产环境**：定期验证数据完整性

#### 7.4.3 埋点测试清单
- [ ] 事件名称符合命名规范
- [ ] 参数格式正确且完整
- [ ] 用户ID和会话ID正确关联
- [ ] 页面URL和标题信息准确
- [ ] 设备和浏览器信息正确
- [ ] 关键业务事件能够正常触发

### 7.5 数据隐私与合规

#### 7.5.1 隐私保护原则
- **数据最小化**：只收集业务必需的数据
- **匿名化处理**：敏感信息脱敏处理
- **用户控制权**：提供数据查看和删除功能
- **透明度**：明确告知用户数据收集范围

#### 7.5.2 数据脱敏规则
```javascript
// 敏感数据脱敏处理
function sanitizeData(data) {
  const sensitiveFields = ['email', 'phone', 'id_card'];
  return Object.keys(data).reduce((sanitized, key) => {
    if (sensitiveFields.includes(key)) {
      sanitized[key] = maskSensitiveData(data[key]);
    } else {
      sanitized[key] = data[key];
    }
    return sanitized;
  }, {});
}

function maskSensitiveData(value) {
  // 邮箱脱敏：user@example.com → u***@example.com
  if (value.includes('@')) {
    const [username, domain] = value.split('@');
    return `${username[0]}***@${domain}`;
  }
  // 手机脱敏：13812345678 → 138****5678
  return value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}
```

#### 7.5.3 用户同意管理
```javascript
// 用户同意管理
class ConsentManager {
  constructor() {
    this.consents = this.loadConsents();
  }

  hasConsent(category) {
    return this.consents[category] === true;
  }

  updateConsent(category, granted) {
    this.consents[category] = granted;
    this.saveConsents();
    this.updateTracking(category, granted);
  }

  updateTracking(category, granted) {
    switch(category) {
      case 'analytics':
        this.toggleAnalytics(granted);
        break;
      case 'marketing':
        this.toggleMarketing(granted);
        break;
    }
  }
}
```

### 7.6 埋点监控与维护

#### 7.6.1 数据质量监控
- **数据完整性检查**：确保必要字段不缺失
- **数据格式验证**：验证数据格式是否符合规范
- **异常数据检测**：识别和处理异常数据
- **数据量监控**：监控数据发送量和接收量

#### 7.6.2 埋点性能影响
- **异步发送**：埋点数据异步发送，不阻塞用户操作
- **数据缓存**：网络异常时本地缓存数据，恢复后重发
- **批量发送**：合并多个事件，减少网络请求
- **错误处理**：埋点失败不影响业务功能

#### 7.6.3 埋点版本管理
```javascript
// 埋点版本控制
const TRACKING_VERSION = '1.0.0';

// 版本兼容性处理
function handleVersionCompatibility(trackingData) {
  const dataVersion = trackingData.version || '1.0.0';

  if (dataVersion !== TRACKING_VERSION) {
    return migrateTrackingData(trackingData, dataVersion, TRACKING_VERSION);
  }

  return trackingData;
}
```

### 7.7 埋点文档管理

#### 7.7.1 事件文档模板
```markdown
## [事件名称]

### 事件描述
简要描述事件触发场景和业务意义

### 事件名称
`event_name_example`

### 触发时机
具体说明何时触发此事件

### 事件参数
| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| param1 | string | 是 | 参数说明 |
| param2 | number | 否 | 参数说明 |

### 代码示例
```javascript
AnalyticsSDK.track('event_name_example', {
  param1: 'value1',
  param2: 123
});
```

### 业务价值
说明此事件对业务分析的价值
```

#### 7.7.2 埋点变更管理
- **新增事件**：需要更新事件文档和埋点代码
- **修改事件**：需要考虑向后兼容性
- **废弃事件**：需要设定废弃时间表和替代方案
- **变更通知**：及时通知数据分析师和业务方

## 8. 测试规范

### 8.1 测试策略

#### 7.1.1 测试金字塔
- **单元测试**：70%，快速反馈，业务逻辑验证
- **集成测试**：20%，服务间集成测试
- **端到端测试**：10%，用户场景测试

#### 7.1.2 测试类型
- **功能测试**：业务功能正确性验证
- **性能测试**：系统性能和负载能力
- **安全测试**：安全漏洞和风险评估
- **兼容性测试**：不同环境兼容性验证

### 7.2 测试环境

#### 7.2.1 环境分类
- **开发环境**：开发人员本地测试
- **测试环境**：功能测试和集成测试
- **预生产环境**：生产环境完整测试
- **生产环境**：生产验证和监控

#### 7.2.2 环境要求
- **数据隔离**：不同环境使用独立的数据库
- **配置隔离**：不同环境使用不同的配置文件
- **网络隔离**：测试环境不能访问生产环境

### 7.3 自动化测试

#### 7.3.1 CI集成测试
- 代码提交触发自动测试
- 单元测试覆盖率检查
- 代码质量检查（SonarQube）
- 安全漏洞扫描

#### 7.3.2 测试数据管理
- **数据生成**：自动化生成测试数据
- **数据隔离**：不同测试用例数据隔离
- **数据清理**：测试完成后数据清理
- **数据脱敏**：生产数据脱敏处理

---

> 本规范文档为影视资源下载网站后端开发的统一标准，所有开发人员必须严格遵守。如有疑问或建议，请及时反馈给团队负责人。