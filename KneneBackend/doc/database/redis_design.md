# Redis设计文档

## 概述

本项目使用Redis作为高性能的内存数据存储，主要用于**缓存层**、**分布式会话管理**、**限流防刷**、**轻量级消息队列**和**分布式锁**等场景，以提高系统性能、可扩展性和用户体验。Redis是一个高性能的键值存储数据库，支持多种数据结构。

## Redis配置

### 连接配置 (开发环境示例 - 请根据实际情况修改)

项目使用Spring Boot中的Redis配置。请确保密码安全，不要硬编码在代码或配置文件中，推荐使用环境变量或配置中心。

```yaml
spring:
  data:
    redis:
      host: 192.168.11.130 # 修改为你的 Redis 服务器 IP 地址 (例如: 虚拟机IP)
      port: 6379
      password: "" # ⚠️ 生产环境必须设置强密码！开发环境可为空
      database: 0 # 默认数据库
      timeout: 5000ms # 连接超时时间 (毫秒)
    lettuce:
      pool: # Lettuce 连接池配置
        max-active: 8 # 最大连接数
        max-idle: 8 # 最大空闲连接数
        min-idle: 0 # 最小空闲连接数
        max-wait: -1ms # 连接获取超时时间 (-1表示无限等待)
```

### 集群配置（生产环境）

在生产环境中，强烈建议使用Redis Sentinel（哨兵模式）或Redis Cluster（集群模式）以确保高可用性。

```yaml
# Redis Sentinel 示例
# spring:
#   data:
#     redis:
#       sentinel:
#         master: mymaster # Sentinel 主节点名称
#         nodes:
#           - redis-sentinel1:26379
#           - redis-sentinel2:26379
#           - redis-sentinel3:26379
#       password: your_password
#       database: 0

# Redis Cluster 示例
# spring:
#   data:
#     redis:
#       cluster:
#         nodes:
#           - redis-node1:6379
#           - redis-node2:6379
#           - redis-node3:6379
#         max-redirects: 3 # 最大重定向次数
#       password: your_password
```

## 键命名规范

为了保持一致性和可维护性，Redis键应遵循以下命名规范：

### 格式

`项目名:业务领域:实体:[实体ID]:[属性/子集/场景]`

*   **项目名 (app):** `movie` (固定)
*   **业务领域 (domain):** 如 `user`, `resource`, `verifycode`, `ratelimit`, `ad`, `signin`, `session`, `stats`, `queue`等。
*   **实体 (entity):** 具体的业务对象，如 `profile`, `meta`, `trending`, `attempt`, `position`等 (根据领域可能省略)。
*   **实体ID (id):** 唯一标识符，如用户ID、资源ID、邮箱地址、IP地址等。
*   **属性/子集/场景 (field):** 具体的数据项或场景描述，如 `info`, `status`, `daily`, `page:1`等。

### 示例

- `movie:user:123:profile` - 用户123的基本信息 (Hash)
- `movie:resource:456:meta` - 资源456的元数据 (Hash/String)
- `movie:verifycode:register:user@example.com` - 用户注册验证码 (String)
- `movie:ratelimit:ip:1.2.3.4:send_verify_code` - IP发送验证码限流 (String/ZSet)
- `movie:ad:position:home_banner` - 首页横幅广告位下的广告列表 (List/String)

### 分隔符

- 使用冒号(`:`)作为分隔符。
- 键名本身避免使用冒号。
- ID或Target中如果包含特殊字符（如邮箱的`@`），通常没问题，但要确保客户端库能正确处理。

## 数据过期策略 (TTL)

合理设置TTL至关重要，可以有效利用内存并保证数据相对新鲜。

### 基本原则

- **频繁读取、不常变化、可接受轻微延迟的数据:** 适合较长TTL（如资源元数据、广告详情）。
- **需要实时性或经常变化的数据:** TTL较短或不缓存（如用户积分余额，如果要求绝对实时），或者采用更新时失效策略。
- **临时性数据:** TTL等于其业务有效期（如验证码、会话）。
- **统计类数据:** TTL根据统计周期设定（如每日统计 -> 24小时+）。
- **防止缓存雪崩:** 可以在基础TTL上增加一个小的随机值。

### 具体建议 (见下文"缓存使用场景")

## 缓存策略

### 缓存模式选择

- **Look-Aside缓存（Lazy Loading）:** **本项目主要采用此模式**。实现简单，按需加载。适用于读多写少的场景。
- **Write-Through缓存:** 适用于需要强一致性的场景，但会增加写操作延迟。
- **Write-Back缓存:** 适用于写密集型应用，但实现复杂，有数据丢失风险。

### 缓存更新/失效策略

1.  **基于时间的失效 (TTL):** 主要策略，简单有效。
2.  **主动更新/失效 (Cache Aside):** 当数据库中相关数据发生变更（增、删、改）时，应用程序**主动删除**缓存中对应的Key。这是保证数据一致性的关键补充。

## 缓存使用场景 (具体设计)

以下是结合项目功能的具体Redis Key设计和说明：

---

### 1. 用户系统 (Domain: `user`)

| Key 模板                                         | 数据结构 | TTL 建议        | 说明                                                                         |
| :----------------------------------------------- | :------- | :-------------- | :--------------------------------------------------------------------------- |
| `movie:user:{userId}:profile`                    | Hash     | 1h - 6h        | 缓存用户常用非敏感信息 (昵称, 头像, 用户类型, VIP等级ID, 积分)。数据变更时主动失效。 |
| `movie:user:{userId}:vipstatus`                  | Hash     | 1h / Session TTL | 缓存VIP状态 (`active`, `inactive`) 和到期时间 (`expireTime`)，用于快速权限检查。      |
| `movie:user:{userId}:download:{YYYY-MM-DD}`      | String   | 24h + 随机数   | 缓存用户某天已下载次数 (使用 INCRBY)。需要后台任务或首次访问时重置。           |
| `movie:user:{userId}:signin`                     | Hash     | 永不/长期      | 存储 `lastSignDate` (YYYY-MM-DD) 和 `continuousDays`。签到时更新。                |
| `movie:user:email_to_id:{email}`                 | String   | 24h - 7d       | 缓存邮箱到用户ID的映射，加速登录或检查邮箱是否存在的过程。用户修改邮箱时失效。       |

---

### 2. 认证与会话 (Domains: `session`, `token`)

| Key 模板                           | 数据结构 | TTL 建议        | 说明                                                                             |
| :--------------------------------- | :------- | :-------------- | :------------------------------------------------------------------------------- |
| `movie:session:{sessionId}`        | Hash     | 30 min (可配置) | 存储会话信息，关联用户ID。用于服务端会话管理（如果使用）。                             |
| `movie:token:blacklist:{jwtId}`    | String   | JWT剩余有效期   | 如果实现JWT黑名单机制，存储已失效的JWT ID。                                        |
| `movie:token:refresh:{userId}`     | String   | 刷新令牌有效期 | 如果使用刷新令牌机制，存储用户的有效刷新令牌。                                       |
| `movie:user:{userId}:loginattempt` | String   | 5-15 min        | 记录用户登录失败次数 (INCRBY)，用于锁定账户或显示验证码。登录成功后删除此Key。       |

---

### 3. 验证码 (Domain: `verifycode`)

| Key 模板                                | 数据结构 | TTL 建议   | 说明                                                                       |
| :-------------------------------------- | :------- | :--------- | :------------------------------------------------------------------------- |
| `movie:verifycode:{type}:{target}`      | String   | 5-10 min   | 存储验证码本身。`{type}`= `register`或`resetpwd`。`{target}`= 邮箱地址。       |
| `movie:verifycode:attempt:{type}:{target}` | String   | 同验证码TTL | 存储验证尝试次数 (INCRBY)。达到阈值后，在验证码过期前不再允许验证。                 |

---

### 4. 资源系统 (Domain: `resource`)

| Key 模板                                   | 数据结构 | TTL 建议     | 说明                                                                                       |
| :----------------------------------------- | :------- | :----------- | :----------------------------------------------------------------------------------------- |
| `movie:resource:{resourceId}:meta`         | Hash     | 6h - 24h     | 缓存资源元数据（标题, 描述, 年份, 分类ID等）。资源更新时主动失效。                             |
| `movie:resource:{resourceId}:stats`        | Hash     | 15m - 1h     | 缓存资源的统计数据（下载数, 查看数, 评分等）。可通过后台任务定期更新或实时更新（INCRBY）。        |
| `movie:resource:trending:{type}`           | ZSet     | 1h (daily)   | 热门资源榜单 (`{type}`= `daily`, `weekly`)。Score为综合得分，Value为资源ID。后台任务计算更新。 |
| `movie:resource:category:{categoryId}:page:{pageNum}` | String   | 15m - 30m    | 缓存分类列表分页结果 (存储JSON字符串)。分类或资源变更时考虑失效（或接受短暂延迟）。           |
| `movie:resource:search:{queryHash}:page:{pageNum}` | String   | 10m - 30m    | 缓存搜索结果分页 (存储JSON字符串)。`{queryHash}`是搜索关键词的哈希值。                     |

---

### 5. 广告系统 (Domain: `ad`)

| Key 模板                      | 数据结构     | TTL 建议   | 说明                                                                     |
| :---------------------------- | :----------- | :--------- | :----------------------------------------------------------------------- |
| `movie:ad:position:{code}`    | String (JSON)| 1h - 6h    | 缓存某个广告位代码下的广告列表（包含广告ID、标题、图片、链接等）。后台更新时失效。 |
| `movie:ad:{adId}:detail`      | String (JSON)| 6h - 24h   | 缓存单个广告的详细信息。广告内容变更时失效。                               |

---

### 6. 限流防刷 (Domain: `ratelimit`)

使用 **Sliding Window Rate Limiter** 模式 (基于 ZSet) 或 **Fixed Window Counter** 模式 (基于 String INCR + TTL)。以下以 Fixed Window 为例，实现简单。

| Key 模板                                   | 数据结构 | TTL 建议 (窗口期) | 说明                                                                                    |
| :----------------------------------------- | :------- | :---------------- | :-------------------------------------------------------------------------------------- |
| `movie:ratelimit:ip:{ip}:{action}`         | String   | 60s / 1h / 24h    | IP级别限流计数器。`{action}` 如 `send_verify_code`, `login_attempt`。                     |
| `movie:ratelimit:user:{userId}:{action}`   | String   | 60s / 1h / 24h    | 用户级别限流计数器。                                                                     |
| `movie:ratelimit:target:{target}:{action}` | String   | 60s / 1h / 24h    | 针对特定目标（如邮箱）的限流计数器。`{target}` 为邮箱地址，`{action}` 为 `send_verify_code`。 |

**注意:** 限流逻辑需要在代码中实现：`INCR` 获取当前计数值，如果首次 INCR 则设置 TTL，判断计数值是否超过阈值。

---

## 消息队列设计 (Domain: `queue`)

使用 Redis List 作为简单队列 (LPUSH/BRPOP 或 RPUSH/BLPOP)。

| Key 模板                  | 说明                                                |
| :------------------------ | :-------------------------------------------------- |
| `movie:queue:email`       | 邮件发送任务队列 (如发送验证码、通知邮件)。          |
| `movie:queue:user_event`  | 用户事件队列 (如注册成功后送积分、发欢迎通知等异步任务)。 |
| `movie:queue:stats_update`| 统计数据更新队列 (如下载数、查看数更新任务)。           |

**实现注意:** 消费者需要使用 `BRPOP` 或 `BLPOP` 进行阻塞式拉取，并处理好任务失败和重试逻辑。考虑使用更专业的队列如 RabbitMQ 或 Kafka 处理复杂场景。

## 分布式锁实现 (Domain: `lock`)

使用 Redis SETNX (或 SET key value NX PX milliseconds) 实现。

| Key 模板                 | 说明                                                                                              |
| :----------------------- | :------------------------------------------------------------------------------------------------ |
| `movie:lock:user:{userId}:update_points` | 更新用户积分操作锁。                                                                    |
| `movie:lock:resource:{resourceId}:update_stats` | 更新资源统计数据锁。                                                                |
| `movie:lock:signin:{userId}` | 用户签到操作锁，防止并发签到。                                                              |

**实现注意:** 必须设置锁的过期时间，防止死锁。释放锁时需要判断是否为自己持有的锁（通常通过存储一个唯一的请求ID作为value）。Lua脚本是保证释放锁原子性的最佳方式。

```lua
-- 释放锁的 Lua 脚本示例
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end
```

## Redis监控

### 关键指标监控

- 内存使用率
- 命中率和未命中率
- 连接数
- 操作延迟
- 过期键数量

### 监控工具

- Redis CLI命令 (INFO, MONITOR, SLOWLOG GET)
- **RedisInsight:** Redis 官方提供的 GUI 工具，非常适合开发和调试。
- Prometheus + Redis Exporter + Grafana
- Spring Boot Actuator (`/actuator/health`, `/actuator/metrics`)

## 备份策略

### RDB备份

配置：
```
save 900 1
save 300 10
save 60 10000
```

### AOF备份

配置：
```
appendonly yes
appendfsync everysec
```

### 备份计划

- 每日快照
- 每小时增量备份
- 每周完整备份

## 性能优化建议

1. **避免使用耗时命令**：如KEYS，应使用SCAN替代
2. **批量操作**：使用MGET、MSET等批量命令
3. **合理使用数据结构**：针对不同场景选择恰当的数据结构
4. **合理设置过期时间**：避免缓存雪崩
5. **使用管道（Pipeline）**：减少网络往返
6. **定期清理过期键**：避免内存泄漏

## 缓存安全考虑

### 🔒 生产环境安全配置（强制要求）

1. **身份认证**
   ```yaml
   # 必须设置Redis密码
   spring:
     data:
       redis:
         password: ${REDIS_PASSWORD:your-strong-password-here}
   ```

2. **网络隔离**
   ```yaml
   # 绑定到特定IP地址
   bind: 127.0.0.1 192.168.1.100
   # 禁用危险命令
   rename-command FLUSHDB ""
   rename-command FLUSHALL ""
   rename-command KEYS ""
   rename-command CONFIG ""
   ```

3. **访问控制**
   ```bash
   # 创建专用Redis用户
   createuser redisuser --pwprompt
   # 限制访问权限
   redis-cli --user redisuser --auth your-password
   ```

### 🛡️ 通用安全建议

4. **敏感数据加密**：存储前加密敏感数据
5. **SSL/TLS加密**：启用SSL连接
6. **定期更新**：保持Redis版本更新，修复安全漏洞
7. **监控告警**：设置异常访问监控
8. **备份加密**：备份数据加密存储

## 故障恢复计划

1. **主从复制**：配置Redis主从复制
2. **哨兵模式**：使用Redis Sentinel监控实例健康状态
3. **集群模式**：使用Redis Cluster提高可用性
4. **故障自动切换**：配置故障自动切换 

对于单机开发环境，主要是做好数据备份。生产环境必须考虑 Sentinel 或 Cluster 