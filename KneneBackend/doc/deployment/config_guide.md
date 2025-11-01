# 电影资源网站配置指南

## 配置文件说明

本项目采用SpringBoot多环境配置方式，配置文件按以下规则组织：

1. **`application.yml`**：主配置文件，包含所有环境共用的基础配置
2. **`application-{profile}.yml`**：特定环境配置文件，包含环境特定的配置

## 环境配置

项目支持以下环境配置：

| 配置文件 | 环境 | 用途 |
|---------|------|-----|
| application-dev.yml | 开发环境 | 本地开发使用 |
| application-test.yml | 测试环境 | 集成测试和QA测试使用 |
| application-prod.yml | 生产环境 | 线上部署使用 |

## 配置切换

有以下几种方式切换环境配置：

### 1. 在`application.yml`中指定

```yaml
spring:
  profiles:
    active: dev  # 使用开发环境配置
```

### 2. 通过命令行参数指定

```bash
java -jar movie-backend.jar --spring.profiles.active=prod
```

### 3. 通过环境变量指定

```bash
# Linux/macOS
export SPRING_PROFILES_ACTIVE=prod
java -jar movie-backend.jar

# Windows
set SPRING_PROFILES_ACTIVE=prod
java -jar movie-backend.jar
```

## 敏感配置处理

在生产环境中，应避免将敏感信息如数据库密码直接写入配置文件。推荐以下方法：

### 1. 使用环境变量

```yaml
spring:
  datasource:
    password: ${DB_PASSWORD}
```

### 2. 使用外部配置文件

```bash
java -jar movie-backend.jar --spring.config.additional-location=file:/secure/path/application-prod.yml
```

### 3. 使用配置文件管理

对于单体应用，推荐使用配置文件管理：

```yaml
spring:
  config:
    import: optional:file:./config/application-prod.yml
```

## 数据库配置

### 开发环境（首次运行）

首次运行系统，数据库会通过Flyway自动创建：

1. 确保MySQL服务已启动
2. 检查`application-dev.yml`中的数据库连接信息是否正确
3. 启动应用，Flyway会自动执行迁移脚本创建数据库

Flyway会按照`src/main/resources/db/migration`目录下的SQL脚本顺序创建表结构。

### 生产环境部署

生产环境部署前，建议先创建空数据库：

```sql
CREATE DATABASE movie_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

然后修改`application-prod.yml`中的数据库连接信息，启动应用。

## Redis配置

系统使用Redis作为缓存和消息队列。确保Redis服务已启动，并在对应环境配置文件中设置正确的连接信息。

## 安全配置

JWT令牌配置位于各环境配置文件中，生产环境应使用足够复杂的密钥：

```yaml
jwt:
  secret: your-very-long-and-complex-secret-key
```

## 公共资源路径

可通过`security.public-paths`配置不需要认证的公共路径：

```yaml
security:
  public-paths:
    - /api/auth/login
    - /api/users/register
```

## 日志配置

日志输出可按环境单独配置，生产环境推荐使用文件输出：

```yaml
logging:
  file:
    name: /var/log/movie-backend/application.log
``` 