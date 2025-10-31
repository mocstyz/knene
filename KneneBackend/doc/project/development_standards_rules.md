# 影视资源下载网站后端开发规范

## 1. 开发原则

### 1.1 数据库优先开发原则
- **数据库设计优先**：优先设计数据库结构和表关系
- **测试数据驱动**：插入充足的测试数据（每个表50-100条记录）
- **真实数据开发**：基于真实数据库数据进行所有开发工作
- **数据完整性**：确保所有API调用都基于真实数据响应

### 1.2 后端主导开发原则
- **API权威性**：后端定义的API接口规范和数据结构为唯一标准
- **业务逻辑核心**：以后端业务逻辑完整性为准，前端适配后端功能
- **数据结构权威**：后端领域模型和数据结构是前端实现的依据

## 2. 项目目录结构

### 2.1 项目总体目录结构

```
KneneBackend/
├── src/                              # 源代码目录
│   ├── main/                         # 主代码目录
│   │   ├── java/                     # Java源代码
│   │   │   └── com/knene/            # 根包名
│   │   │       ├── KneneApplication.java     # Spring Boot启动类
│   │   │       ├── application/        # 应用层（Application Layer）
│   │   │       │   ├── auth/          # 认证应用服务（示例结构）
│   │   │       │   │   ├── service/    # 认证服务实现
│   │   │       │   │   ├── dto/        # 认证相关DTO
│   │   │       │   │   └── exception/  # 认证异常处理
│   │   │       │   ├── user/          # 用户应用服务
│   │   │       │   ├── resource/      # 资源应用服务
│   │   │       │   ├── content/       # 内容应用服务
│   │   │       │   ├── vip/           # VIP应用服务
│   │   │       │   ├── search/        # 搜索应用服务
│   │   │       │   ├── crawler/       # 爬虫应用服务
│   │   │       │   ├── payment/       # 支付应用服务
│   │   │       │   ├── notification/  # 通知应用服务
│   │   │       │   ├── download/      # 下载应用服务
│   │   │       │   ├── request/       # 求片应用服务（新增）
│   │   │       │   ├── signin/        # 签到应用服务（新增）
│   │   │       │   ├── points/        # 积分应用服务（新增）
│   │   │       │   ├── exchange/      # 兑换应用服务（新增）
│   │   │       │   ├── compliance/    # 合规应用服务（新增）
│   │   │       │   ├── advertisement/ # 广告应用服务（新增）
│   │   │       │   ├── analytics/     # 数据分析应用服务（新增）
│   │   │       │   ├── quality/       # 质量管理应用服务（新增）
│   │   │       │   ├── monitoring/    # 监控系统应用服务（新增）
│   │   │       │   └── event/         # 事件处理
│   │   │       │       ├── service/    # 事件服务实现
│   │   │       │       ├── handler/    # 事件处理器
│   │   │       │       └── publisher/  # 事件发布器
│   │   │       ├── domain/           # 领域层（Domain Layer）
│   │   │       │   ├── common/        # 通用领域组件
│   │   │       │   │   ├── entity/    # 通用实体
│   │   │       │   │   ├── valueobject/ # 通用值对象
│   │   │       │   │   ├── aggregate/ # 通用聚合根
│   │   │       │   │   └── exception/ # 通用领域异常
│   │   │       │   ├── user/          # 用户领域模型（示例结构）
│   │   │       │   │   ├── entity/    # 用户实体
│   │   │       │   │   ├── valueobject/ # 用户值对象
│   │   │       │   │   ├── aggregate/ # 用户聚合根
│   │   │       │   │   ├── repository/ # 用户仓储接口
│   │   │       │   │   ├── service/   # 用户领域服务
│   │   │       │   │   └── exception/ # 用户领域异常
│   │   │       │   ├── resource/      # 资源领域模型
│   │   │       │   ├── content/       # 内容领域模型
│   │   │       │   ├── vip/           # VIP领域模型
│   │   │       │   ├── download/      # 下载领域模型
│   │   │       │   ├── search/        # 搜索领域模型
│   │   │       │   ├── request/       # 求片领域模型（新增）
│   │   │       │   ├── signin/        # 签到领域模型（新增）
│   │   │       │   ├── points/        # 积分领域模型（新增）
│   │   │       │   ├── exchange/      # 兑换领域模型（新增）
│   │   │       │   ├── compliance/    # 合规模型（新增）
│   │   │       │   ├── advertisement/ # 广告领域（新增）
│   │   │       │   ├── quality/       # 质量管理领域（新增）
│   │   │       │   └── monitoring/    # 监控领域（新增）
│   │   │       ├── infrastructure/   # 基础设施层（Infrastructure Layer）
│   │   │       │   ├── common/        # 通用基础设施
│   │   │       │   │   ├── aop/        # AOP切面
│   │   │       │   │   ├── exception/  # 异常处理
│   │   │       │   │   ├── util/       # 工具类（集成Hutool全能工具包）
│   │   │       │   │   ├── constant/   # 常量定义
│   │   │       │   │   └── config/     # 通用配置
│   │   │       │   ├── config/         # 配置管理
│   │   │       │   │   ├── properties/ # 配置属性类
│   │   │       │   │   ├── database/   # 数据库配置
│   │   │       │   │   ├── redis/      # Redis配置
│   │   │       │   │   └── elasticsearch/ # ES配置
│   │   │       │   ├── persistence/    # 持久化实现
│   │   │       │   │   ├── mapper/     # MyBatis Plus Mapper接口
│   │   │       │   │   ├── entity/     # 数据库实体
│   │   │       │   │   ├── repository/ # 仓储实现
│   │   │       │   │   └── migration/  # Flyway数据库迁移脚本
│   │   │       │   ├── security/       # 安全设施
│   │   │       │   │   ├── jwt/        # JWT工具
│   │   │       │   │   ├── rbac/       # RBAC权限控制
│   │   │       │   │   ├── encryption/ # 加密工具
│   │   │       │   │   └── validation/ # 参数验证
│   │   │       │   ├── cache/          # 缓存设施
│   │   │       │   │   ├── redis/      # Redis缓存实现
│   │   │       │   │   ├── caffeine/   # 本地缓存实现
│   │   │       │   │   └── strategy/   # 缓存策略
│   │   │       │   ├── email/          # 邮件设施
│   │   │       │   │   ├── service/    # 邮件服务
│   │   │       │   │   ├── template/   # 邮件模板
│   │   │       │   │   └── queue/      # 邮件队列
│   │   │       │   ├── captcha/        # 验证码设施
│   │   │       │   │   ├── image/      # 图形验证码
│   │   │       │   │   ├── sms/        # 短信验证码
│   │   │       │   │   └── email/      # 邮件验证码
│   │   │       │   ├── crawler/        # 爬虫设施
│   │   │       │   │   ├── engine/     # 爬虫引擎
│   │   │       │   │   ├── parser/     # 页面解析器
│   │   │       │   │   ├── proxy/      # 代理管理
│   │   │       │   │   └── scheduler/  # 爬虫调度
│   │   │       │   ├── storage/        # 存储设施
│   │   │       │   │   ├── local/      # 本地存储
│   │   │       │   │   ├── oss/        # 对象存储服务
│   │   │       │   │   ├── netdisk/    # 网盘存储
│   │   │       │   │   └── imagehost/  # 图床服务
│   │   │       │   ├── payment/        # 支付设施
│   │   │       │   │   ├── alipay/     # 支付宝支付
│   │   │       │   │   ├── wechat/     # 微信支付
│   │   │       │   │   ├── callback/   # 支付回调
│   │   │       │   │   └── order/      # 订单管理
│   │   │       │   ├── search/         # 搜索设施（新增ES）
│   │   │       │   │   ├── elasticsearch/ # ES客户端
│   │   │       │   │   ├── index/      # 索引管理
│   │   │       │   │   ├── query/      # 查询构建器
│   │   │       │   │   └── analyzer/   # 分词器配置
│   │   │       │   ├── notification/   # 通知设施
│   │   │       │   │   ├── websocket/  # WebSocket通知
│   │   │       │   │   ├── push/       # 推送服务
│   │   │       │   │   ├── sms/        # 短信通知
│   │   │       │   │   └── system/     # 系统通知
│   │   │       │   ├── external/       # 外部服务集成
│   │   │       │   │   ├── ga4/        # Google Analytics 4
│   │   │       │   │   ├── hotjar/     # Hotjar热力图
│   │   │       │   │   ├── moviedb/    # 外部电影数据库API（如TMDb、豆瓣）
│   │   │       │   │   ├── payment/    # 外部支付服务API
│   │   │       │   │   └── adnetwork/  # 广告联盟API
│   │   │       │   ├── task/           # 定时任务
│   │   │       │   │   ├── scheduler/  # 任务调度器
│   │   │       │   │   ├── job/        # 定时任务
│   │   │       │   │   └── cron/       # Cron表达式
│   │   │       │   ├── monitor/        # 监控设施（PLG Stack集成）
│   │   │       │   │   ├── prometheus/ # Prometheus指标
│   │   │       │   │   ├── loki/       # Loki日志
│   │   │       │   │   ├── grafana/    # Grafana仪表板
│   │   │       │   │   └── alert/      # 告警配置
│   │   │       │   └── tracking/       # 埋点基础设施（新增）
│   │   │       │       ├── ga4/        # GA4埋点
│   │   │       │       ├── hotjar/     # Hotjar埋点
│   │   │       │       ├── event/      # 事件追踪
│   │   │       │       └── analytics/  # 数据分析
│   │   │       └── interfaces/       # 接口层（Interfaces Layer）
│   │   │           ├── api/            # REST API控制器
│   │   │           │   ├── v1/         # API版本1
│   │   │           │   │   ├── auth/   # 认证API（示例结构）
│   │   │           │   │   ├── user/   # 用户API
│   │   │           │   │   ├── resource/ # 资源API
│   │   │           │   │   ├── content/ # 内容API
│   │   │           │   │   ├── vip/    # VIP API
│   │   │           │   │   ├── search/ # 搜索API
│   │   │           │   │   ├── crawler/ # 爬虫API
│   │   │           │   │   ├── payment/ # 支付API
│   │   │           │   │   ├── notification/ # 通知API
│   │   │           │   │   ├── download/ # 下载API
│   │   │           │   │   ├── request/ # 求片API
│   │   │           │   │   ├── signin/ # 签到API
│   │   │           │   │   ├── points/ # 积分API
│   │   │           │   │   ├── exchange/ # 兑换API
│   │   │           │   │   ├── compliance/ # 合规API
│   │   │           │   │   ├── advertisement/ # 广告API
│   │   │           │   │   ├── analytics/ # 数据分析API
│   │   │           │   │   ├── quality/    # 质量管理API（新增）
│   │   │           │   │   ├── monitoring/ # 监控系统API（新增）
│   │   │           │   │   ├── netdisk/    # 网盘管理API
│   │   │           │   │   │   ├── controller/ # 网盘控制器
│   │   │           │   │   │   ├── dto/       # 网盘DTO
│   │   │           │   │   │   └── service/   # 网盘服务接口
│   │   │           │   │   └── movie/      # 电影信息API
│   │   │           │   │       ├── controller/ # 电影控制器
│   │   │           │   │       ├── dto/       # 电影DTO
│   │   │           │   │       └── service/   # 电影服务接口
│   │   │           │   └── v2/         # API版本2（预留）
│   │   │           ├── assembler/      # 对象组装器
│   │   │           │   ├── auth/       # 认证组装器（示例结构）
│   │   │           │   ├── user/       # 用户组装器
│   │   │           │   ├── resource/   # 资源组装器
│   │   │           │   ├── content/    # 内容组装器
│   │   │           │   └── vip/        # VIP组装器
│   │   │           ├── dto/            # 数据传输对象
│   │   │           │   ├── request/    # 请求DTO
│   │   │           │   ├── response/   # 响应DTO
│   │   │           │   ├── common/     # 通用DTO
│   │   │           │   └── validation/ # 验证DTO
│   │   │           ├── websocket/      # WebSocket接口
│   │   │           │   ├── config/     # WebSocket配置
│   │   │           │   ├── handler/    # WebSocket处理器
│   │   │           │   └── session/    # WebSocket会话管理
│   │   │           ├── filter/         # 过滤器
│   │   │           │   ├── auth/       # 认证过滤器
│   │   │           │   ├── logging/    # 日志过滤器
│   │   │           │   ├── cors/       # 跨域过滤器
│   │   │           │   └── rate/       # 限流过滤器
│   │   │           └── webhook/        # 第三方回调（新增）
│   │   │               ├── payment/    # 支付回调
│   │   │               ├── notification/ # 通知回调
│   │   │               └── external/   # 外部服务回调
│   │   └── resources/                # 资源文件目录
│   │       ├── application.yml       # 应用配置文件
│   │       ├── application-dev.yml   # 开发环境配置
│   │       ├── application-test.yml  # 测试环境配置
│   │       ├── application-prod.yml  # 生产环境配置
│   │       ├── logback-spring.xml    # 日志配置文件
│   │       ├── db/migration/         # Flyway数据库迁移脚本
│   │       │   ├── V1.1.1__Create_core_tables.sql
│   │       │   ├── V1.1.2__Insert_core_data.sql
│   │       │   └── V2.1.1__Create_auth_tables.sql
│   │       ├── static/               # 静态资源文件
│   │       │   ├── css/              # 样式文件
│   │       │   ├── js/               # JavaScript文件
│   │       │   ├── images/           # 图片文件
│   │       │   └── fonts/            # 字体文件
│   │       └── templates/            # 模板文件目录
│   │           ├── email/            # 邮件模板
│   │           ├── error/            # 错误页面模板
│   │           └── notification/     # 通知模板
│   └── test/                         # 测试代码目录
│       ├── java/                     # 测试Java代码
│       │   └── com/knene/            # 测试根包名
│       │       ├── integration/      # 集成测试
│       │       │   ├── auth/         # 认证集成测试
│       │       │   ├── user/         # 用户集成测试
│       │       │   ├── resource/     # 资源集成测试
│       │       │   └── payment/      # 支付集成测试
│       │       ├── unit/             # 单元测试
│       │       │   ├── application/  # 应用层单元测试
│       │       │   ├── domain/       # 领域层单元测试
│       │       │   └── infrastructure/ # 基础设施层单元测试
│       │       ├── testdata/         # 测试数据生成器
│       │       │   ├── builder/      # 测试数据构建器
│       │       │   ├── template/     # Instancio模板
│       │       │   └── generator/    # 测试数据生成器
│       │       └── e2e/              # 端到端测试
│       │           ├── scenario/     # 测试场景
│       │           └── testcase/     # 测试用例
│       └── resources/                # 测试资源文件
│           ├── application-test.yml  # 测试配置
│           ├── testcontainers/       # Testcontainers配置
│           ├── fixtures/             # 测试固件数据
│           └── properties/           # 测试属性文件
├── doc/                              # 项目文档目录
│   ├── project/                      # 项目级文档目录
│   │   ├── development_standards_rules.md # 开发规范文档
│   │   ├── development_modular_monolith_roadmap.md # 开发路线图
│   │   ├── development_micro_service_roadmap.md # 微服务路线图
│   │   ├── backend_complete_documentation.md # 完整后端文档
│   │   └── README.md                 # 项目文档索引
│   ├── modules/                      # 业务模块文档目录（与src结构对应）
│   │   ├── auth/                     # 认证模块文档
│   │   ├── user/                     # 用户模块文档
│   │   ├── resource/                 # 资源模块文档
│   │   ├── content/                  # 内容模块文档
│   │   ├── vip/                      # VIP模块文档
│   │   ├── search/                   # 搜索模块文档
│   │   ├── crawler/                  # 爬虫模块文档
│   │   ├── payment/                  # 支付模块文档
│   │   ├── notification/             # 通知模块文档
│   │   ├── download/                 # 下载模块文档
│   │   ├── request/                  # 求片模块文档
│   │   ├── signin/                   # 签到模块文档
│   │   ├── points/                   # 积分模块文档
│   │   ├── exchange/                 # 兑换模块文档
│   │   ├── compliance/               # 合规模块文档
│   │   ├── advertisement/            # 广告模块文档
│   │   ├── analytics/                # 数据分析模块文档
│   │   ├── quality/                  # 质量管理模块文档
│   │   └── monitoring/               # 监控系统模块文档
│   ├── architecture/                 # 架构设计文档
│   │   ├── ddd/                      # DDD架构文档
│   │   ├── hexagonal/                # 六边形架构文档
│   │   ├── database/                 # 数据库设计文档
│   │   ├── cache/                    # 缓存架构文档
│   │   ├── security/                 # 安全架构文档
│   │   └── deployment/               # 部署架构文档
│   ├── infrastructure/               # 基础设施文档
│   │   ├── storage/                  # 存储设施文档
│   │   ├── monitoring/               # 监控设施文档
│   │   └── external/                 # 外部服务文档
│   ├── deployment/                   # 部署相关文档
│   │   ├── docker/                   # Docker部署文档
│   │   ├── kubernetes/               # Kubernetes部署文档
│   │   ├── nginx/                    # Nginx配置文档
│   │   ├── monitoring/               # 监控部署文档
│   │   └── ci-cd/                    # CI/CD流水线文档
│   ├── database/                     # 数据库设计文档
│   │   ├── schema/                   # 数据库表结构文档
│   │   ├── migration/                # 数据库迁移文档
│   │   ├── index/                    # 索引设计文档
│   │   ├── optimization/             # 数据库优化文档
│   │   └── redis_design.md           # Redis设计文档
│   ├── development/                  # 开发相关文档
│   │   ├── coding-standards/         # 编码规范文档
│   │   ├── testing/                  # 测试规范文档
│   │   ├── git-workflow/             # Git工作流文档
│   │   └── code-review/              # 代码评审文档
│   └── user-guide/                   # 用户指南文档
│       ├── getting-started/          # 快速开始指南
│       ├── api-usage/                # API使用指南
│       └── troubleshooting/          # 故障排除指南
├── scripts/                          # 脚本目录
│   ├── docker/                       # Docker相关脚本
│   │   ├── build.sh                  # Docker构建脚本
│   │   ├── run.sh                    # Docker运行脚本
│   │   ├── cleanup.sh                # Docker清理脚本
│   │   └── compose/                  # Docker Compose脚本
│   │       ├── dev.yml               # 开发环境编排
│   │       ├── test.yml              # 测试环境编排
│   │       └── prod.yml              # 生产环境编排
│   ├── database/                     # 数据库脚本
│   │   ├── init/                     # 数据库初始化脚本
│   │   │   ├── create-database.sql   # 创建数据库脚本
│   │   │   └── create-user.sql       # 创建数据库用户脚本
│   │   ├── migration/                # 数据库迁移脚本
│   │   │   ├── flyway/               # Flyway迁移脚本
│   │   │   └── rollback/             # 回滚脚本
│   │   ├── backup/                   # 数据库备份脚本
│   │   │   ├── backup.sh             # 备份脚本
│   │   │   └── restore.sh            # 恢复脚本
│   │   └── data/                     # 数据脚本
│   │       ├── sample-data.sql       # 示例数据脚本
│   │       └── test-data.sql         # 测试数据脚本
│   ├── deploy/                       # 部署脚本
│   │   ├── deploy-dev.sh             # 开发环境部署脚本
│   │   ├── deploy-test.sh            # 测试环境部署脚本
│   │   ├── deploy-prod.sh            # 生产环境部署脚本
│   │   ├── rollback.sh               # 回滚脚本
│   │   └── health-check.sh           # 健康检查脚本
│   ├── tools/                        # 工具脚本
│   │   ├── code-generator/           # 代码生成工具
│   │   │   ├── entity-generator.sh   # 实体生成脚本
│   │   │   └── api-generator.sh      # API生成脚本
│   │   ├── performance/              # 性能测试工具
│   │   │   ├── load-test.sh          # 负载测试脚本
│   │   │   └── stress-test.sh        # 压力测试脚本
│   │   ├── security/                 # 安全工具
│   │   │   ├── security-scan.sh      # 安全扫描脚本
│   │   │   └── vulnerability-check.sh # 漏洞检查脚本
│   │   └── monitoring/               # 监控工具
│   │       ├── log-analyzer.sh       # 日志分析脚本
│   │       └── metrics-collector.sh  # 指标收集脚本
│   └── migration/                    # 迁移脚本
│       ├── data-migration/           # 数据迁移脚本
│       └── version-migration/        # 版本迁移脚本
├── docker/                           # Docker配置目录
│   ├── Dockerfile                    # 应用Dockerfile
│   │   ├── Dockerfile.dev            # 开发环境Dockerfile
│   │   ├── Dockerfile.test           # 测试环境Dockerfile
│   │   └── Dockerfile.prod           # 生产环境Dockerfile
│   ├── docker-compose.yml            # 开发环境编排
│   ├── docker-compose.test.yml       # 测试环境编排
│   ├── docker-compose.prod.yml       # 生产环境编排
│   ├── docker-compose.monitoring.yml # 监控环境编排
│   ├── nginx/                        # Nginx配置
│   │   ├── nginx.conf                # Nginx主配置文件
│   │   ├── conf.d/                   # Nginx配置目录
│   │   │   ├── default.conf         # 默认配置
│   │   │   ├── ssl.conf              # SSL配置
│   │   │   └── upstream.conf         # 上游服务配置
│   │   └── ssl/                      # SSL证书目录
│   │       ├── cert.pem              # SSL证书
│   │       └── key.pem               # SSL私钥
│   ├── monitoring/                   # 监控Docker配置
│   │   ├── prometheus/               # Prometheus配置
│   │   │   ├── prometheus.yml        # Prometheus配置文件
│   │   │   └── rules/                # 告警规则
│   │   ├── grafana/                  # Grafana配置
│   │   │   ├── grafana.ini           # Grafana配置文件
│   │   │   └── dashboards/           # 仪表板配置
│   │   ├── loki/                     # Loki配置
│   │   │   └── loki-config.yml       # Loki配置文件
│   │   └── promtail/                 # Promtail配置
│   │       └── promtail-config.yml   # Promtail配置文件
│   └── scripts/                      # Docker脚本
│       ├── entrypoint.sh             # 容器入口脚本
│       ├── healthcheck.sh            # 健康检查脚本
│       └── wait-for-it.sh            # 服务等待脚本
├── .gitignore                        # Git忽略文件
├── .gitlab-ci.yml                    # GitLab CI配置
├── .gitattributes                    # Git属性配置
├── README.md                         # 项目说明文档
├── CHANGELOG.md                      # 变更日志
├── LICENSE                           # 开源协议
├── pom.xml                           # Maven配置文件
├── pom-build.xml                     # 构建配置文件
├── iterativeoptimal.md              # 迭代记录文档
├── package.json                      # 项目元数据文件
└── version.properties                # 版本属性文件
```

### 2.2 目录结构说明

为避免冗余，相同结构的目录只展示详细子结构，其他目录保持简化：
- **application层**：auth目录展示详细结构，其他业务模块结构相同
- **domain层**：user目录展示详细结构，其他领域模块结构相同
- **interfaces层**：auth和netdisk目录展示详细结构，其他API模块结构相同

### 2.3 架构层次说明

项目采用**领域驱动设计（DDD）**和**六边形架构（Ports & Adapters）**：

- **应用层**：业务流程编排，处理用例逻辑
- **领域层**：核心业务逻辑和领域模型，业务规则的体现
- **基础设施层**：技术实现细节，外部依赖集成
- **接口层**：对外提供API接口，处理外部交互

### 2.3 核心业务模块

- **用户系统**：用户注册、登录、权限管理
- **资源系统**：影视资源管理、分类、搜索
- **内容管理**：文章、Wiki、评论系统
- **VIP系统**：会员管理、订单、支付流程
- **搜索推荐**：全文搜索、智能推荐
- **爬虫系统**：自动化资源采集
- **支付系统**：多渠道支付集成
- **通知系统**：邮件、短信、实时推送

## 3. 技术栈与依赖管理

### 3.1 核心技术栈

#### 3.1.1 开发工具类库
- **Hutool**：全能Java工具包，提供丰富的工具类
  - 字符串处理：StrUtil - 字符串判空、截取、格式化等常用操作
  - 日期时间：DateUtil - 日期解析、格式化、计算等操作
  - 加密解密：SecureUtil - MD5、SHA、AES、RSA等加密算法
  - 集合操作：CollUtil - 集合判空、交集、并集、差集等操作
  - 文件操作：FileUtil - 文件读写、复制、删除等操作
  - HTTP客户端：HttpUtil - HTTP请求发送和响应处理
  - JSON处理：JSONUtil - JSON序列化和反序列化操作
  - 验证码：CaptchaUtil - 图形验证码生成和验证
  - ID生成：IdUtil - 雪花算法、UUID等ID生成策略

#### 3.1.2 Maven依赖配置
```xml
<!-- Hutool全能工具包 -->
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.38</version>
</dependency>
```

### 3.2 架构设计原则

- **领域驱动设计（DDD）**：以业务领域为核心组织代码，强调领域模型的表达
- **六边形架构（Ports & Adapters）**：业务核心与外部依赖解耦，便于扩展和测试
- **SOLID 原则**：
  - 单一职责（SRP）：每个类/模块只负责一项功能
  - 开闭原则（OCP）：对扩展开放，对修改关闭
  - 依赖倒置（DIP）：依赖于抽象而非具体实现
  - 接口隔离（ISP）：接口精细、职责单一
  - 里氏替换（LSP）：子类可替换父类

### 3.3 基础编码规范

#### 3.3.1 命名规范
- **驼峰命名法**：类名首字母大写，方法和变量首字母小写
- **常量命名**：全大写，下划线分隔
- **包名命名**：全小写，点号分隔

#### 3.3.2 注释规范
- **文件头注释**：所有文件顶部都必须使用标准的javadoc注释格式，说明文件用途、作者：相笑与春风、版本信息
- **其他注释规范**：除了文件头注释外，其他任何地方（包括类、方法、字段、代码块等）都只能使用//注释，严禁使用/* */块注释
- **方法注释规范**：方法、类、内部类等所有非文件头的注释都使用//格式，写在方法/类定义的上一行
- **注释长度限制**：//注释可以换行，但是// 最多不超过3行，如果内容太多要超过3行，就要精简提炼
- **参数字段注释**：只有特别重要的参数、字段才在后面加//注释，位置在定义行的后面
- **顺序步骤注释**：对于有执行顺序的代码块，使用数字编号（1. 2. 3.）来标注执行步骤，提高代码可读性

**文件头javadoc注释示例：**
```java
/**
 * 用户应用服务类
 * 负责处理用户相关的业务逻辑，包括注册、登录、信息管理等功能
 *
 * @author 相笑与春风
 * @version 1.0
 */
```

**其他注释格式示例：**
```java
// 用户应用服务类实现 - 处理用户相关业务逻辑
@Service
public class UserServiceImpl implements UserService {

    // 用户注册方法 - 实现用户注册功能
    @Override
    public UserDTO register(UserRegisterRequest request) {
        // 1. 参数验证
        if (request == null) {
            throw new IllegalArgumentException("请求参数不能为空"); // 抛出参数异常
        }

        // 2. 创建用户对象
        User user = new User();
        user.setUsername(request.getUsername()); // 设置用户名
        user.setPassword(encryptPassword(request.getPassword())); // 加密密码

        // 3. 保存用户并返回DTO
        return convertToDTO(userRepository.save(user)); // 保存并返回DTO
    }

    // 复杂业务流程示例 - 订单处理流程
    public OrderDTO processOrder(OrderRequest request) {
        // 1. 订单基础验证
        if (request == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("订单信息不完整"); // 验证订单基础信息
        }

        // 2. 库存检查和锁定
        List<Item> lockedItems = inventoryService.lockItems(request.getItems()); // 锁定库存
        if (lockedItems.size() != request.getItems().size()) {
            throw new BusinessException("库存不足"); // 检查库存是否充足
        }

        // 3. 价格计算和优惠处理
        BigDecimal totalPrice = calculateTotalPrice(request.getItems()); // 计算总价
        BigDecimal discountPrice = applyDiscounts(totalPrice, request.getCouponCode()); // 应用优惠

        // 4. 创建订单记录
        Order order = createOrderRecord(request, discountPrice); // 创建订单实体
        order.setStatus(OrderStatus.PENDING_PAYMENT); // 设置订单状态

        // 5. 支付处理
        PaymentResult paymentResult = paymentService.process(order); // 处理支付
        if (!paymentResult.isSuccess()) {
            // 5.1 支付失败处理
            inventoryService.releaseItems(lockedItems); // 释放库存
            order.setStatus(OrderStatus.PAYMENT_FAILED); // 更新订单状态
            throw new PaymentException("支付失败"); // 抛出支付异常
        }

        // 6. 订单完成处理
        order.setStatus(OrderStatus.PAID); // 更新为已支付状态
        orderRepository.save(order); // 保存订单
        notificationService.sendOrderConfirmation(order); // 发送确认通知

        return convertToDTO(order); // 返回订单DTO
    }

    // 内部类 - 用户验证器
    @Component
    private static class UserValidator {
        // 验证用户名格式
        public boolean validateUsername(String username) {
            return username != null && username.length() >= 3; // 用户名长度至少3位
        }
    }
}
```

**注释规范要点：**
- ✅ 文件头：使用 `/** ... */` javavadoc格式
- ✅ 类/方法/字段：使用 `//` 单行注释
- ✅ 行内注释：使用 `//` 在代码行后面
- ✅ 顺序步骤：使用 `// 1. 2. 3.` 标注执行流程
- ✅ 子步骤：使用 `// 5.1 5.2` 标注子流程
- ❌ 禁止使用：`/* */` 块注释（除文件头外）

**顺序步骤注释使用场景：**
- 业务流程处理（如订单处理、用户注册流程）
- 数据处理管道（ETL流程、数据清洗）
- 复杂算法步骤（排序、搜索算法）
- 系统初始化流程
- 错误处理流程
- 配置加载步骤

#### 3.3.3 异常处理
- **统一异常处理**：使用全局异常处理器
- **自定义异常**：根据业务需要定义自定义异常类
- **异常日志**：记录详细的异常信息便于排查

#### 3.3.4 日志规范
- **结构化日志**：使用统一的日志格式
- **日志级别**：合理使用 ERROR、WARN、INFO、DEBUG 级别
- **敏感信息**：避免在日志中记录敏感信息

### 3.4 项目管理规范

#### 3.4.1 代码修改规范
1. **变更说明**：所有新增、修改、删除操作前，需说明原因。若为 BUG 修复，需明确指出问题性质、原因及位置
2. **模块化组织**：新增文件/目录应按功能模块化，保持高内聚低耦合
3. **同步一致性**：涉及 src 组件/逻辑变更需保持同步
4. **废弃清理**：替换新方案后，必须删除废弃代码
5. **错误检查**：每次修改后，立即处理编译器和开发工具报错
6. **零错误提交**：禁止提交包含编译错误的代码

#### 3.4.2 项目管理要求
1. **核心原则**：始终遵循 SOLID 原则，保持高内聚低耦合
2. **项目认知**：项目开始前，务必阅读并理解 README.md，明确目标、架构、技术栈和开发计划
3. **文档维护**：如无 README.md，需主动创建。每次目录/文件变更后，及时更新文档，保持一致

### 3.5 Hutool工具类使用规范

#### 3.5.1 集成原则
- **统一集成**：项目中所有工具类需求优先使用Hutool提供的解决方案
- **避免重复**：不允许自行开发与Hutool功能重复的工具类
- **版本管理**：统一使用hutool-all 5.8.38版本，确保依赖一致性
- **按需使用**：根据实际需求选择合适的工具类，避免引入不需要的功能

#### 3.5.2 常用工具类使用指南
- **字符串处理**：使用`StrUtil`替代Apache Commons Lang的StringUtils
- **日期时间**：使用`DateUtil`替代Java 8之前的Date和Calendar类
- **加密解密**：使用`SecureUtil`进行各种加密算法操作
- **集合操作**：使用`CollUtil`进行集合的常用操作
- **文件操作**：使用`FileUtil`进行文件读写、复制等操作
- **HTTP请求**：使用`HttpUtil`替代OkHttp或Apache HttpClient进行简单HTTP操作
- **JSON处理**：使用`JSONUtil`进行JSON序列化和反序列化

#### 3.5.3 代码示例
```java
// 字符串处理
String result = StrUtil.isNotBlank(str) ? str.trim() : "default";

// 日期格式化
String formattedDate = DateUtil.format(new Date(), "yyyy-MM-dd HH:mm:ss");

// MD5加密
String encrypted = SecureUtil.md5(password);

// 集合判空
if (CollUtil.isNotEmpty(list)) {
    // 处理集合
}

// 文件读取
String content = FileUtil.readUtf8String(filePath);
```

## 4. API设计基础规范

### 4.1 RESTful API设计原则

#### 4.1.1 URL设计规范
- 使用名词而非动词：`/api/v1/resources` 而非 `/api/v1/getResources`
- 使用复数形式：`/api/v1/users`, `/api/v1/resources`
- 层级关系清晰：`/api/v1/users/{userId}/favorites`
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
  "timestamp": "2024-01-01T12:00:00Z"
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
  "timestamp": "2024-01-01T12:00:00Z"
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
  "timestamp": "2024-01-01T12:00:00Z"
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
- URL路径版本：`/api/v1/`, `/api/v2/`
- 向后兼容原则：新版本保持旧版本兼容
- 版本生命周期：一个版本至少维护6个月
- 废弃通知：提前3个月通知版本废弃

### 4.5 接口限流策略

#### 4.5.1 限流规则
- 普通用户：每分钟60次请求
- VIP用户：每分钟200次请求
- 管理员：每分钟500次请求
- 下载接口：每分钟最多10次请求

#### 4.5.2 限流维度
- 用户维度：每个用户每分钟最多请求次数
- IP维度：每个IP每分钟最多请求次数
- 接口维度：不同接口设置不同限流阈值

## 5. 测试规范

### 5.1 测试策略

#### 5.1.1 测试金字塔
- **单元测试**：70%，快速反馈，业务逻辑验证
- **集成测试**：20%，服务间集成测试
- **端到端测试**：10%，用户场景测试

#### 5.1.2 测试类型
- **功能测试**：业务功能正确性验证
- **性能测试**：系统性能和负载能力
- **安全测试**：安全漏洞和风险评估
- **兼容性测试**：不同环境兼容性验证

### 5.2 测试数据生成规范

#### 5.2.1 Instancio工具使用
- **工具选型**：统一使用Instancio作为智能测试数据生成工具
- **基础使用**：
  ```java
  // 标准实体生成
  Movie movie = Instancio.create(Movie.class);

  // 列表数据生成
  List<Movie> movies = Instancio.ofList(Movie.class).size(100).create();
  ```
- **字段控制**：
  ```java
  // 精确字段控制
  User user = Instancio.of(User.class)
      .set(field(User::getEmail), "test@example.com")
      .set(field(User::getAge), gen -> gen.ints().range(18, 65))
      .create();
  ```

#### 5.2.2 测试数据要求
- **数据质量**：生成的数据必须符合Bean Validation注解约束
- **关联数据**：关联数据必须保持完整性和一致性
- **敏感数据**：敏感数据（邮箱、手机号等）必须进行脱敏处理
- **性能要求**：单次批量数据生成不超过10000条记录

### 5.3 测试环境管理

#### 5.3.1 环境分类
- **开发环境**：开发人员本地测试
- **测试环境**：功能测试和集成测试
- **预生产环境**：生产环境完整测试
- **生产环境**：生产验证和监控

#### 5.3.2 环境要求
- **数据隔离**：不同环境使用独立的数据库
- **配置隔离**：不同环境使用不同的配置文件
- **网络隔离**：测试环境不能访问生产环境

### 5.4 自动化测试

#### 5.4.1 CI集成测试
- 代码提交触发自动测试
- 单元测试覆盖率检查
- 代码质量检查
- 安全漏洞扫描

#### 5.4.2 测试覆盖率要求
- 核心业务逻辑测试覆盖率不低于 90%
- 测试方法名清晰描述测试场景
- 使用测试数据库隔离测试环境

## 6. 数据库规范

### 6.1 数据库设计原则

#### 6.1.1 设计优先级
- **核心表优先**：用户、权限、配置等核心表优先设计
- **渐进式设计**：边开发边完善数据库设计
- **版本化管理**：通过Flyway等工具管理数据库变更
- **测试数据驱动**：每个模块设计完成后立即插入测试数据

#### 6.1.2 版本管理
- **Flyway版本控制**：使用Flyway管理数据库版本
- **版本命名**：V{序号}__{描述}.sql格式
- **回滚脚本**：重要变更需要提供回滚脚本
- **环境隔离**：不同环境使用不同的数据库实例

### 6.2 命名与规范

#### 6.2.1 命名规范
- **表名**：小写字母，下划线分隔，使用复数形式
- **字段名**：小写字母，下划线分隔，使用有意义的名称
- **索引名**：idx_表名_字段名，唯一索引以uniq_开头
- **外键名**：fk_表名_字段名_引用表名_引用字段

#### 6.2.2 索引规范
- **主键索引**：每个表必须有主键，推荐使用自增ID
- **唯一索引**：业务唯一字段必须建立唯一索引
- **复合索引**：根据查询频率和字段区分度合理创建复合索引

#### 6.2.3 SQL规范
- **关键字大小写**：SQL关键字大写，表名和字段名小写
- **格式规范**：合理使用缩进和换行，保持SQL可读性
- **注释规范**：复杂SQL需要添加注释说明
- **性能优化**：避免使用SELECT *，合理使用EXISTS替代IN

### 6.3 事务与缓存

#### 6.3.1 事务规范
- **事务粒度**：事务尽可能短小，避免长事务
- **异常处理**：事务异常时必须正确回滚
- **隔离级别**：根据业务需要选择合适的事务隔离级别

#### 6.3.2 缓存策略
- **多级缓存**：L1本地缓存（Caffeine）+ L2分布式缓存（Redis）
- **缓存策略**：Cache-Aside模式，旁路缓存策略
- **一致性保证**：TTL过期 + 主动失效
- **监控告警**：缓存命中率、缓存大小监控

## 7. 开发流程规范

### 7.1 基本开发流程

1. **需求分析**：理解业务需求，明确技术方案
2. **设计评审**：编写设计文档，进行技术评审
3. **编码实现**：按照编码规范进行开发
4. **单元测试**：编写并执行单元测试
5. **代码评审**：提交代码前进行同行评审
6. **集成测试**：在测试环境进行集成测试
7. **部署上线**：按照部署流程进行上线

### 7.2 质量管理

#### 7.2.1 代码质量要求
- **代码审查**：Pull Request必须经过代码审查
- **自动化测试**：单元测试覆盖率90%+
- **集成测试**：关键业务流程端到端测试
- **质量门禁**：SonarQube质量门禁（A等级）

#### 7.2.2 安全开发
- **输入验证**：所有用户输入严格验证
- **输出编码**：防止XSS攻击
- **SQL注入防护**：参数化查询
- **认证授权**：最小权限原则

### 7.3 Git使用规范

#### 7.3.1 分支策略
- **main分支**：生产环境分支，只接受来自release分支的合并
- **develop分支**：开发主分支，功能分支由此分支创建
- **feature分支**：功能开发分支，命名格式为feature/功能名称
- **hotfix分支**：紧急修复分支，命名格式为hotfix/问题描述

#### 7.3.2 提交规范
- **提交格式**：type(scope): description
- **类型说明**：
  - feat：新功能
  - fix：bug修复
  - docs：文档更新
  - style：代码格式调整
  - refactor：代码重构
  - test：测试相关
  - chore：构建工具或辅助工具的变动

---

> 本规范文档为影视资源下载网站后端开发的统一标准，所有开发人员必须严格遵守。如有疑问或建议，请及时反馈给团队负责人。

---