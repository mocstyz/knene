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

### 1.1 项目总体目录结构

```
KneneBackend/
├── src/                              # 源代码目录
│   ├── main/                         # 主代码目录
│   │   ├── java/                     # Java源代码
│   │   │   └── com/knene/            # 根包名
│   │   │       ├── KneneApplication.java     # Spring Boot启动类
│   │   │       ├── application/        # 应用层（Application Layer）
│   │   │       │   ├── auth/          # 认证应用服务
│   │   │       │   │   ├── service/    # 认证服务实现
│   │   │       │   │   ├── dto/        # 认证相关DTO
│   │   │       │   │   └── exception/  # 认证异常处理
│   │   │       │   ├── user/          # 用户应用服务
│   │   │       │   │   ├── service/    # 用户服务实现
│   │   │       │   │   ├── dto/        # 用户相关DTO
│   │   │       │   │   └── exception/  # 用户异常处理
│   │   │       │   ├── resource/      # 资源应用服务
│   │   │       │   │   ├── service/    # 资源服务实现
│   │   │       │   │   ├── dto/        # 资源相关DTO
│   │   │       │   │   └── exception/  # 资源异常处理
│   │   │       │   ├── content/       # 内容应用服务
│   │   │       │   │   ├── service/    # 内容服务实现
│   │   │       │   │   ├── dto/        # 内容相关DTO
│   │   │       │   │   └── exception/  # 内容异常处理
│   │   │       │   ├── vip/           # VIP应用服务
│   │   │       │   │   ├── service/    # VIP服务实现
│   │   │       │   │   ├── dto/        # VIP相关DTO
│   │   │       │   │   └── exception/  # VIP异常处理
│   │   │       │   ├── search/        # 搜索应用服务
│   │   │       │   │   ├── service/    # 搜索服务实现
│   │   │       │   │   ├── dto/        # 搜索相关DTO
│   │   │       │   │   └── exception/  # 搜索异常处理
│   │   │       │   ├── crawler/       # 爬虫应用服务
│   │   │       │   │   ├── service/    # 爬虫服务实现
│   │   │       │   │   ├── dto/        # 爬虫相关DTO
│   │   │       │   │   └── exception/  # 爬虫异常处理
│   │   │       │   ├── payment/       # 支付应用服务
│   │   │       │   │   ├── service/    # 支付服务实现
│   │   │       │   │   ├── dto/        # 支付相关DTO
│   │   │       │   │   └── exception/  # 支付异常处理
│   │   │       │   ├── notification/  # 通知应用服务
│   │   │       │   │   ├── service/    # 通知服务实现
│   │   │       │   │   ├── dto/        # 通知相关DTO
│   │   │       │   │   └── exception/  # 通知异常处理
│   │   │       │   ├── download/      # 下载应用服务
│   │   │       │   │   ├── service/    # 下载服务实现
│   │   │       │   │   ├── dto/        # 下载相关DTO
│   │   │       │   │   └── exception/  # 下载异常处理
│   │   │       │   ├── request/       # 求片应用服务（新增）
│   │   │       │   │   ├── service/    # 求片服务实现
│   │   │       │   │   ├── dto/        # 求片相关DTO
│   │   │       │   │   └── exception/  # 求片异常处理
│   │   │       │   ├── signin/        # 签到应用服务（新增）
│   │   │       │   │   ├── service/    # 签到服务实现
│   │   │       │   │   ├── dto/        # 签到相关DTO
│   │   │       │   │   └── exception/  # 签到异常处理
│   │   │       │   ├── points/        # 积分应用服务（新增）
│   │   │       │   │   ├── service/    # 积分服务实现
│   │   │       │   │   ├── dto/        # 积分相关DTO
│   │   │       │   │   └── exception/  # 积分异常处理
│   │   │       │   ├── exchange/      # 兑换应用服务（新增）
│   │   │       │   │   ├── service/    # 兑换服务实现
│   │   │       │   │   ├── dto/        # 兑换相关DTO
│   │   │       │   │   └── exception/  # 兑换异常处理
│   │   │       │   ├── compliance/    # 合规应用服务（新增）
│   │   │       │   │   ├── service/    # 合规服务实现
│   │   │       │   │   ├── dto/        # 合规相关DTO
│   │   │       │   │   └── exception/  # 合规异常处理
│   │   │       │   ├── advertisement/ # 广告应用服务（新增）
│   │   │       │   │   ├── service/    # 广告服务实现
│   │   │       │   │   ├── dto/        # 广告相关DTO
│   │   │       │   │   └── exception/  # 广告异常处理
│   │   │       │   ├── analytics/     # 数据分析应用服务（新增）
│   │   │       │   │   ├── service/    # 数据分析服务实现
│   │   │       │   │   ├── dto/        # 数据分析相关DTO
│   │   │       │   │   └── exception/  # 数据分析异常处理
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
│   │   │       │   ├── user/          # 用户领域模型
│   │   │       │   │   ├── entity/    # 用户实体
│   │   │       │   │   ├── valueobject/ # 用户值对象
│   │   │       │   │   ├── aggregate/ # 用户聚合根
│   │   │       │   │   ├── repository/ # 用户仓储接口
│   │   │       │   │   ├── service/   # 用户领域服务
│   │   │       │   │   └── exception/ # 用户领域异常
│   │   │       │   ├── resource/      # 资源领域模型
│   │   │       │   │   ├── entity/    # 资源实体
│   │   │       │   │   ├── valueobject/ # 资源值对象
│   │   │       │   │   ├── aggregate/ # 资源聚合根
│   │   │       │   │   ├── repository/ # 资源仓储接口
│   │   │       │   │   ├── service/   # 资源领域服务
│   │   │       │   │   └── exception/ # 资源领域异常
│   │   │       │   ├── content/       # 内容领域模型
│   │   │       │   │   ├── entity/    # 内容实体
│   │   │       │   │   ├── valueobject/ # 内容值对象
│   │   │       │   │   ├── aggregate/ # 内容聚合根
│   │   │       │   │   ├── repository/ # 内容仓储接口
│   │   │       │   │   ├── service/   # 内容领域服务
│   │   │       │   │   └── exception/ # 内容领域异常
│   │   │       │   ├── vip/           # VIP领域模型
│   │   │       │   │   ├── entity/    # VIP实体
│   │   │       │   │   ├── valueobject/ # VIP值对象
│   │   │       │   │   ├── aggregate/ # VIP聚合根
│   │   │       │   │   ├── repository/ # VIP仓储接口
│   │   │       │   │   ├── service/   # VIP领域服务
│   │   │       │   │   └── exception/ # VIP领域异常
│   │   │       │   ├── verification/  # 验证领域模型
│   │   │       │   │   ├── entity/    # 验证实体
│   │   │       │   │   ├── valueobject/ # 验证值对象
│   │   │       │   │   ├── aggregate/ # 验证聚合根
│   │   │       │   │   ├── repository/ # 验证仓储接口
│   │   │       │   │   ├── service/   # 验证领域服务
│   │   │       │   │   └── exception/ # 验证领域异常
│   │   │       │   ├── download/      # 下载领域模型
│   │   │       │   │   ├── entity/    # 下载实体
│   │   │       │   │   ├── valueobject/ # 下载值对象
│   │   │       │   │   ├── aggregate/ # 下载聚合根
│   │   │       │   │   ├── repository/ # 下载仓储接口
│   │   │       │   │   ├── service/   # 下载领域服务
│   │   │       │   │   └── exception/ # 下载领域异常
│   │   │       │   ├── search/        # 搜索领域模型
│   │   │       │   │   ├── entity/    # 搜索实体
│   │   │       │   │   ├── valueobject/ # 搜索值对象
│   │   │       │   │   ├── aggregate/ # 搜索聚合根
│   │   │       │   │   ├── repository/ # 搜索仓储接口
│   │   │       │   │   ├── service/   # 搜索领域服务
│   │   │       │   │   └── exception/ # 搜索领域异常
│   │   │       │   ├── request/       # 求片领域模型（新增）
│   │   │       │   │   ├── entity/    # 求片实体
│   │   │       │   │   ├── valueobject/ # 求片值对象
│   │   │       │   │   ├── aggregate/ # 求片聚合根
│   │   │       │   │   ├── repository/ # 求片仓储接口
│   │   │       │   │   ├── service/   # 求片领域服务
│   │   │       │   │   └── exception/ # 求片领域异常
│   │   │       │   ├── signin/        # 签到领域模型（新增）
│   │   │       │   │   ├── entity/    # 签到实体
│   │   │       │   │   ├── valueobject/ # 签到值对象
│   │   │       │   │   ├── aggregate/ # 签到聚合根
│   │   │       │   │   ├── repository/ # 签到仓储接口
│   │   │       │   │   ├── service/   # 签到领域服务
│   │   │       │   │   └── exception/ # 签到领域异常
│   │   │       │   ├── points/        # 积分领域模型（新增）
│   │   │       │   │   ├── entity/    # 积分实体
│   │   │       │   │   ├── valueobject/ # 积分值对象
│   │   │       │   │   ├── aggregate/ # 积分聚合根
│   │   │       │   │   ├── repository/ # 积分仓储接口
│   │   │       │   │   ├── service/   # 积分领域服务
│   │   │       │   │   └── exception/ # 积分领域异常
│   │   │       │   ├── exchange/      # 兑换领域模型（新增）
│   │   │       │   │   ├── entity/    # 兑换实体
│   │   │       │   │   ├── valueobject/ # 兑换值对象
│   │   │       │   │   ├── aggregate/ # 兑换聚合根
│   │   │       │   │   ├── repository/ # 兑换仓储接口
│   │   │       │   │   ├── service/   # 兑换领域服务
│   │   │       │   │   └── exception/ # 兑换领域异常
│   │   │       │   ├── compliance/    # 合规模型（新增）
│   │   │       │   │   ├── entity/    # 合规实体
│   │   │       │   │   ├── valueobject/ # 合规值对象
│   │   │       │   │   ├── aggregate/ # 合规聚合根
│   │   │       │   │   ├── repository/ # 合规仓储接口
│   │   │       │   │   ├── service/   # 合规领域服务
│   │   │       │   │   └── exception/ # 合规领域异常
│   │   │       │   ├── advertisement/ # 广告领域（新增）
│   │   │       │   │   ├── entity/    # 广告实体
│   │   │       │   │   ├── valueobject/ # 广告值对象
│   │   │       │   │   ├── aggregate/ # 广告聚合根
│   │   │       │   │   ├── repository/ # 广告仓储接口
│   │   │       │   │   ├── service/   # 广告领域服务
│   │   │       │   │   └── exception/ # 广告领域异常
│   │   │       │   ├── quality/       # 质量管理领域（新增）
│   │   │       │   │   ├── entity/    # 质量管理实体
│   │   │       │   │   ├── valueobject/ # 质量管理值对象
│   │   │       │   │   ├── aggregate/ # 质量管理聚合根
│   │   │       │   │   ├── repository/ # 质量管理仓储接口
│   │   │       │   │   ├── service/   # 质量管理领域服务
│   │   │       │   │   └── exception/ # 质量管理领域异常
│   │   │       │   └── monitoring/    # 监控领域（新增）
│   │   │       │       ├── entity/    # 监控实体
│   │   │       │       ├── valueobject/ # 监控值对象
│   │   │       │       ├── aggregate/ # 监控聚合根
│   │   │       │       ├── repository/ # 监控仓储接口
│   │   │       │       ├── service/   # 监控领域服务
│   │   │       │       └── exception/ # 监控领域异常
│   │   │       ├── infrastructure/   # 基础设施层（Infrastructure Layer）
│   │   │       │   ├── common/        # 通用基础设施
│   │   │       │   │   ├── aop/        # AOP切面
│   │   │       │   │   ├── exception/  # 异常处理
│   │   │       │   │   ├── util/       # 工具类
│   │   │       │   │   ├── constant/   # 常量定义
│   │   │       │   │   └── config/     # 通用配置
│   │   │       │   ├── config/         # 配置管理
│   │   │       │   │   ├── properties/ # 配置属性类
│   │   │       │   │   ├── database/   # 数据库配置
│   │   │       │   │   ├── redis/      # Redis配置
│   │   │       │   │   └── elasticsearch/ # ES配置
│   │   │       │   ├── persistence/    # 持久化实现
│   │   │       │   │   ├── mapper/     # MyBatis Mapper接口
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
│   │   │           │   │   ├── auth/   # 认证API
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
│   │   │           │   ├── auth/       # 认证组装器
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
│   ├── development_standards_new.md  # 开发规范文档
│   ├── development_modular_monolith_roadmap.md # 开发路线图
│   ├── api/                          # API文档目录
│   │   ├── v1/                       # API版本1文档
│   │   │   ├── auth.md               # 认证API文档
│   │   │   ├── user.md               # 用户API文档
│   │   │   ├── resource.md           # 资源API文档
│   │   │   ├── content.md            # 内容API文档
│   │   │   ├── vip.md                # VIP API文档
│   │   │   ├── search.md             # 搜索API文档
│   │   │   ├── crawler.md            # 爬虫API文档
│   │   │   ├── payment.md            # 支付API文档
│   │   │   ├── notification.md       # 通知API文档
│   │   │   ├── download.md           # 下载API文档
│   │   │   ├── request.md            # 求片API文档
│   │   │   ├── signin.md             # 签到API文档
│   │   │   ├── points.md             # 积分API文档
│   │   │   ├── exchange.md           # 兑换API文档
│   │   │   ├── compliance.md         # 合规API文档
│   │   │   ├── advertisement.md      # 广告API文档
│   │   │   └── analytics.md          # 数据分析API文档
│   │   └── v2/                       # API版本2文档（预留）
│   ├── architecture/                 # 架构设计文档
│   │   ├── ddd/                      # DDD架构文档
│   │   ├── hexagonal/                # 六边形架构文档
│   │   ├── database/                 # 数据库设计文档
│   │   ├── cache/                    # 缓存架构文档
│   │   ├── security/                 # 安全架构文档
│   │   └── deployment/               # 部署架构文档
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
│   │   └── optimization/             # 数据库优化文档
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

### 1.2 架构层次说明

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
- **request**: 求片应用服务（新增）
- **signin**: 签到应用服务（新增）
- **points**: 积分应用服务（新增）
- **exchange**: 兑换应用服务（新增）
- **compliance**: 合规应用服务（新增）
- **advertisement**: 广告应用服务（新增）
- **analytics**: 数据分析应用服务（新增）
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
- **request**: 求片领域模型（新增）
- **signin**: 签到领域模型（新增）
- **points**: 积分领域模型（新增）
- **exchange**: 兑换领域模型（新增）
- **compliance**: 合规模型（新增）
- **advertisement**: 广告领域（新增）
- **quality**: 质量管理领域（新增）
- **monitoring**: 监控领域（新增）

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
- **search**: 搜索设施（新增ES）
- **notification**: 通知设施
- **external**: 外部服务集成（GA4/Hotjar、网盘、广告联盟）
- **task**: 定时任务
- **monitor**: 监控设施（PLG Stack集成）
- **tracking**: 埋点基础设施（新增）

#### 1.1.4 接口层（Interfaces Layer）
对外提供接口和交互：
- **api**: REST API控制器（包含所有新增模块API）
- **assembler**: 对象组装器
- **dto**: 数据传输对象
- **websocket**: WebSocket接口
- **filter**: 过滤器
- **webhook**: 第三方回调（新增）

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

#### 1.2.10 新增模块
- **求片系统**: 资源请求、自动搜索、状态跟踪
- **签到积分系统**: 签到记录、积分账户、兑换商城
- **兑换系统**: 积分兑换、订单管理、配送跟踪
- **合规管理**: 版权风险、内容过滤、地域限制
- **广告系统**: 广告位管理、投放策略、联盟集成
- **数据分析**: 用户行为、资源分析、业务统计
- **质量管理**: 重复检测、质量评分、完整性验证
- **监控系统**: 链接健康度、失败分析、行为分析

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
  - 开发环境：Spring Boot + Logback → Promtail → Loki → Grafana
  - 生产环境：Spring Boot + Logback → Filebeat → Loki → Grafana
- **日志收集**：使用 PLG Stack (Promtail, Loki, Grafana) 统一日志管理

#### 3.3.5 单元测试
- **测试覆盖率**：核心业务逻辑测试覆盖率不低于 90%
- **测试命名**：测试方法名清晰描述测试场景
- **测试隔离**：使用测试数据库隔离测试环境
- **测试数据生成**：统一使用Instancio生成测试数据，确保数据的一致性和可维护性

#### 3.3.6 Instancio测试代码规范
- **导入规范**：
  ```java
  import org.instancio.Instancio;
  import org.instancio.junit.InstancioExtension;
  import org.instancio.junit.InstancioSource;
  import static org.instancio.Select.field;
  ```
- **基础使用规范**：
  ```java
  // 标准实体生成
  Movie movie = Instancio.create(Movie.class);

  // 列表数据生成
  List<Movie> movies = Instancio.ofList(Movie.class).size(100).create();

  // 参数化测试
  @ParameterizedTest
  @InstancioSource
  void testMovieCreation(Movie movie) {
      // 测试逻辑
  }
  ```
- **字段控制规范**：
  ```java
  // 精确字段控制
  User user = Instancio.of(User.class)
      .set(field(User::getEmail), "test@example.com")
      .set(field(User::getAge), gen -> gen.ints().range(18, 65))
      .create();
  ```
- **关联对象生成规范**：
  ```java
  // 生成带关联的对象
  Movie movie = Instancio.of(Movie.class)
      .set(field(Movie::getDirector), Instancio.create(Director.class))
      .set(field(Movie::getGenres), Instancio.ofList(Genre.class).size(3).create())
      .create();
  ```
- **性能最佳实践**：
  - 避免在循环中重复调用Instancio.create()
  - 使用批量生成方法提高效率
  - 合理设置生成数据量，避免内存溢出
  - 复杂对象生成时控制深度层次

#### 3.3.7 Instancio测试数据生成标准
- **工具选型**：统一使用Instancio作为智能测试数据生成工具
- **配置规范**：
  - 为每个实体类创建标准Instancio生成模板
  - 使用`@InstancioSource`注解进行参数化测试数据生成
  - 配置全局Instancio设置确保数据一致性和性能
- **字段匹配规则**：
  - 利用Instancio的智能字段匹配功能，基于字段名称自动生成合适数据
  - 特殊字段使用`set()`方法进行精确控制
  - 关联字段使用`supply()`方法提供自定义生成逻辑
- **数据质量标准**：
  - 生成的数据必须符合Bean Validation注解约束
  - 关联数据必须保持完整性和一致性
  - 敏感数据（邮箱、手机号等）必须进行脱敏处理
- **性能要求**：
  - 单次批量数据生成不超过10000条记录
  - 复杂对象图生成深度不超过5层
  - 内存使用控制在合理范围内，避免OOM
- **版本管理**：
  - Instancio配置模板纳入版本控制
  - 数据生成规格变更需要更新测试用例
  - 定期review和优化数据生成配置

#### 3.3.8 测试数据分类标准
- **基础功能测试数据**：
  - 使用Instancio生成标准业务实体数据
  - 覆盖正常、边界、异常三种场景
  - 每个测试类至少3组有效测试数据
- **性能测试数据**：
  - 使用Instancio批量生成大规模数据集（1000-10000条）
  - 模拟真实数据分布和关联关系
  - 确保性能测试数据的一致性和可重现性
- **集成测试数据**：
  - 生成完整的业务流程数据链
  - 包含用户、资源、下载记录等关联数据
  - 使用Instancio的关联对象生成功能
- **安全测试数据**：
  - 生成包含特殊字符和恶意内容的数据
  - 测试SQL注入、XSS等安全问题
  - 验证数据校验和过滤机制

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

#### 4.6.3 高级限流功能
- **滑动窗口限流**：基于Redis ZSet实现
- **令牌桶算法**：分布式令牌桶限流
- **漏桶算法**：平滑请求处理
- **自适应限流**：基于系统负载动态调整限流阈值

## 5. 数据库规范

### 5.1 数据库分层设计原则

#### 5.1.1 第一层：核心基础表（第一阶段设计）
- **用户权限核心表**：users, user_profiles, roles, permissions
- **系统基础表**：system_configs, dictionaries, file_storages
- **审计日志表**：operation_logs, audit_logs

#### 5.1.2 第二层：业务功能表（按阶段设计）
- **第二阶段**：认证权限表（user_roles, refresh_tokens, login_history）
- **第三阶段**：VIP业务表（vip_memberships, orders, payment_records）
- **第四阶段**：用户中心表（favorites, download_history, user_comments）

#### 5.1.3 第三层：高级功能表（按需设计）
- **PT站点集成表**：pt_sites, torrent_files, crawl_tasks
- **质量管理表**：quality_scores, duplicate_detection
- **监控分析表**：search_logs, user_statistics

### 5.2 增量式数据库设计原则

#### 5.2.1 核心表优先设计
- 用户、权限、配置等核心表优先设计
- 渐进式设计：边开发边完善数据库设计
- 版本化管理：通过Flyway等工具管理数据库变更
- 测试数据驱动：每个模块设计完成后立即插入测试数据
- 真实数据开发：所有前端开发都基于真实数据库数据

#### 5.2.2 数据库版本管理
- **Flyway版本控制**：使用Flyway管理数据库版本
- **版本命名**：V{序号}__{描述}.sql格式
- **回滚脚本**：重要变更需要提供回滚脚本
- **环境隔离**：不同环境使用不同的数据库实例

### 5.3 命名规范
- **表名**：小写字母，下划线分隔，使用复数形式
- **字段名**：小写字母，下划线分隔，使用有意义的名称
- **索引名**：idx_表名_字段名，唯一索引以uniq_开头
- **外键名**：fk_表名_字段名_引用表名_引用字段

### 5.4 索引规范
- **主键索引**：每个表必须有主键，推荐使用自增ID
- **唯一索引**：业务唯一字段必须建立唯一索引
- **复合索引**：根据查询频率和字段区分度合理创建复合索引
- **索引命名**：遵循统一的命名规范

### 5.5 SQL规范
- **关键字大小写**：SQL关键字大写，表名和字段名小写
- **格式规范**：合理使用缩进和换行，保持SQL可读性
- **注释规范**：复杂SQL需要添加注释说明
- **性能优化**：避免使用SELECT *，合理使用EXISTS替代IN

### 5.6 事务规范
- **事务粒度**：事务尽可能短小，避免长事务
- **异常处理**：事务异常时必须正确回滚
- **隔离级别**：根据业务需要选择合适的事务隔离级别
- **嵌套事务**：避免使用嵌套事务

### 5.7 缓存架构设计规范

#### 5.7.1 多级缓存策略
- **L1缓存**：本地缓存（Caffeine），存储热点数据
- **L2缓存**：Redis分布式缓存，存储共享数据
- **缓存策略**：Cache-Aside模式，旁路缓存策略

#### 5.7.2 缓存场景设计
- **用户缓存**：登录状态、权限信息、基本资料
- **资源缓存**：热门资源、分类信息、搜索结果
- **配置缓存**：系统配置、字典数据、权限规则

#### 5.7.3 缓存一致性保证
- **失效策略**：TTL过期 + 主动失效
- **更新机制**：数据更新时同步更新缓存
- **监控告警**：缓存命中率、缓存大小监控

#### 5.7.4 缓存高级策略
- **缓存预热**：应用启动时预加载热点数据
- **缓存雪崩防护**：随机TTL过期时间 + 多级降级
- **缓存穿透防护**：布隆过滤器 + 空值缓存
- **缓存击穿防护**：互斥锁 + 热点数据永不过期
- **缓存监控**：Redis监控 + Druid连接池监控

#### 5.7.5 Redis高级数据结构应用
- **HyperLogLog用户统计**：日活、周活用户数统计
- **Bitmap用户签到**：用户签到状态记录与统计
- **ZSet排行榜实现**：热门资源排行、积分排行
- **Geo地理位置**：用户地域分布统计

## 6. 开发流程与最佳实践

### 6.1 开发流程

1. **需求分析**：理解业务需求，明确技术方案
2. **设计评审**：编写设计文档，进行技术评审
3. **编码实现**：按照编码规范进行开发
4. **单元测试**：编写并执行单元测试
5. **代码评审**：提交代码前进行同行评审
6. **集成测试**：在测试环境进行集成测试
7. **部署上线**：按照部署流程进行上线

### 6.2 现代化开发实践

#### 6.2.1 IDE和工具配置
- **IDE统一**: IntelliJ IDEA + 统一配置文件
- **代码格式化**: 统一代码风格（Google Java Style）
- **静态分析**: SonarLint + Checkstyle + PMD
- **版本控制**: Git + Git Flow工作流

#### 6.2.2 代码质量管理
- **代码审查**: Pull Request必须经过代码审查
- **自动化测试**: 单元测试覆盖率90%+
- **集成测试**: 关键业务流程端到端测试
- **性能测试**: 接口性能基准测试

#### 6.2.3 质量门禁设置
- **代码质量**: SonarQube质量门禁（A等级）
- **测试覆盖率**: 单元测试覆盖率 ≥ 90%
- **安全扫描**: 无高危安全漏洞
- **性能基准**: 接口响应时间 ≤ 200ms

### 6.3 安全开发实践

#### 6.3.1 安全左移
- **依赖安全扫描**: Maven插件自动扫描第三方依赖
- **代码安全审计**: SonarQube安全规则检查
- **静态应用安全测试**: SAST工具集成
- **动态应用安全测试**: DAST工具集成

#### 6.3.2 安全编码规范
- **输入验证**: 所有用户输入严格验证
- **输出编码**: 防止XSS攻击
- **SQL注入防护**: 参数化查询
- **认证授权**: 最小权限原则

### 6.4 DevOps最佳实践

#### 6.4.1 基础设施即代码
- **Docker容器化**: 多阶段构建优化镜像大小
- **Docker Compose**: 本地开发环境一键启动
- **环境配置**: 环境变量统一管理
- **密钥管理**: 敏感信息安全存储

#### 6.4.2 CI/CD流水线设计
```yaml
stages:
  - code-quality    # 代码质量检查
  - unit-test      # 单元测试
  - build          # 应用构建
  - integration-test # 集成测试
  - security-scan  # 安全扫描
  - deploy-dev     # 开发环境部署
  - deploy-staging # 预发布环境部署
  - deploy-prod    # 生产环境部署
```

#### 6.4.3 监控和可观测性
- **应用监控**: Spring Boot Actuator + 自定义指标
- **日志聚合**: PLG Stack统一日志管理
- **性能监控**: Micrometer + Prometheus指标收集
- **链路追踪**: 分布式请求链路跟踪

### 6.5 Git使用规范

#### 6.5.1 分支策略
- **main分支**：生产环境分支，只接受来自release分支的合并
- **develop分支**：开发主分支，功能分支由此分支创建
- **feature分支**：功能开发分支，命名格式为feature/功能名称
- **hotfix分支**：紧急修复分支，命名格式为hotfix/问题描述
- **release分支**：发布分支，命名格式为release/版本号

#### 6.5.2 提交规范
- **提交格式**：type(scope): description
- **类型说明**：
  - feat：新功能
  - fix：bug修复
  - docs：文档更新
  - style：代码格式调整
  - refactor：代码重构
  - test：测试相关
  - chore：构建工具或辅助工具的变动

### 6.6 代码评审清单

#### 6.6.1 功能性检查
- [ ] 功能是否按照需求正确实现
- [ ] 边界条件是否考虑完整
- [ ] 异常处理是否合理
- [ ] 性能是否满足要求

#### 6.6.2 代码质量检查
- [ ] 代码是否遵循编码规范
- [ ] 是否存在代码重复
- [ ] 变量和方法命名是否合理
- [ ] 注释是否充分且准确

#### 6.6.3 安全性检查
- [ ] 是否存在SQL注入风险
- [ ] 敏感信息是否正确处理
- [ ] 权限控制是否合理
- [ ] 输入验证是否充分

### 6.7 性能优化指南

#### 6.7.1 数据库优化
- 合理使用索引，避免全表扫描
- 优化查询语句，避免不必要的关联查询
- 使用连接池，合理配置连接数
- 定期分析慢查询日志

#### 6.7.2 缓存优化
- 合理使用缓存，设置合适的过期时间
- 避免缓存穿透和缓存雪崩
- 使用缓存预热机制
- 监控缓存命中率

#### 6.7.3 代码优化
- 避免在循环中进行数据库操作
- 合理使用异步处理
- 减少不必要的对象创建
- 优化算法和数据结构选择

### 6.8 文档和知识管理

#### 6.8.1 技术文档体系
- **API文档**: SpringDoc OpenAPI自动生成
- **架构文档**: C4模型架构图
- **部署文档**: Docker + Nginx部署指南
- **运维手册**: 监控、备份、故障处理

#### 6.8.2 知识分享机制
- **技术分享会**: 每周技术分享
- **代码 walkthrough**: 新功能代码走查
- **最佳实践库**: 团队编程规范和最佳实践
- **问题知识库**: 常见问题和解决方案

## 7. 测试规范

### 7.1 测试策略

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

#### 7.3.3 Instancio测试数据生成标准
- **工具选型**：统一使用Instancio作为智能测试数据生成工具
- **配置规范**：
  - 为每个实体类创建标准Instancio生成模板
  - 使用`@InstancioSource`注解进行参数化测试数据生成
  - 配置全局Instancio设置确保数据一致性和性能
- **字段匹配规则**：
  - 利用Instancio的智能字段匹配功能，基于字段名称自动生成合适数据
  - 特殊字段使用`set()`方法进行精确控制
  - 关联字段使用`supply()`方法提供自定义生成逻辑
- **数据质量标准**：
  - 生成的数据必须符合Bean Validation注解约束
  - 关联数据必须保持完整性和一致性
  - 敏感数据（邮箱、手机号等）必须进行脱敏处理
- **性能要求**：
  - 单次批量数据生成不超过10000条记录
  - 复杂对象图生成深度不超过5层
  - 内存使用控制在合理范围内，避免OOM
- **版本管理**：
  - Instancio配置模板纳入版本控制
  - 数据生成规格变更需要更新测试用例
  - 定期review和优化数据生成配置

#### 7.3.4 测试数据分类标准
- **基础功能测试数据**：
  - 使用Instancio生成标准业务实体数据
  - 覆盖正常、边界、异常三种场景
  - 每个测试类至少3组有效测试数据
- **性能测试数据**：
  - 使用Instancio批量生成大规模数据集（1000-10000条）
  - 模拟真实数据分布和关联关系
  - 确保性能测试数据的一致性和可重现性
- **集成测试数据**：
  - 生成完整的业务流程数据链
  - 包含用户、资源、下载记录等关联数据
  - 使用Instancio的关联对象生成功能
- **安全测试数据**：
  - 生成包含特殊字符和恶意内容的数据
  - 测试SQL注入、XSS等安全问题
  - 验证数据校验和过滤机制

---

> 本规范文档为影视资源下载网站后端开发的统一标准，所有开发人员必须严格遵守。如有疑问或建议，请及时反馈给团队负责人。