# 数据库验证系统运维手册

## 概述

本文档为数据库验证系统的运维手册，提供系统部署、日常运维、监控管理、故障处理和系统优化等方面的详细指导。

## 系统部署指南

### 部署前准备

#### 环境要求检查清单

- [ ] **硬件要求**
  - [ ] CPU: 4核心以上（推荐8核心）
  - [ ] 内存: 8GB以上（推荐16GB）
  - [ ] 存储: 100GB以上可用空间
  - [ ] 网络: 稳定的网络连接，低延迟

- [ ] **软件要求**
  - [ ] 操作系统: Linux (CentOS 7+, Ubuntu 18.04+) 或 Windows Server 2016+
  - [ ] 数据库: MySQL 8.0+ 或 MariaDB 10.5+
  - [ ] Java: JDK 11+ 或 OpenJDK 11+
  - [ ] 应用服务器: Tomcat 9+ 或 内嵌Spring Boot
  - [ ] 构建工具: Maven 3.6+ 或 Gradle 6+

- [ ] **权限要求**
  - [ ] 数据库管理员权限
  - [ ] 文件系统读写权限
  - [ ] 网络端口访问权限
  - [ ] 系统服务管理权限

#### 依赖服务检查

```bash
# 检查MySQL服务状态
systemctl status mysql
# 或
systemctl status mysqld

# 检查Java版本
java -version

# 检查网络连通性
telnet mysql-server-host 3306

# 检查磁盘空间
df -h

# 检查内存使用
free -h
```

### 安装部署步骤

#### 1. 数据库设置

```sql
-- 1. 创建验证系统专用数据库
CREATE DATABASE knene_verification
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 2. 创建验证系统专用用户
CREATE USER 'verification_system'@'%' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON knene_verification.* TO 'verification_system'@'%';
GRANT SELECT ON *.* TO 'verification_system'@'%'; -- 验证需要读取所有数据库
FLUSH PRIVILEGES;

-- 3. 验证连接
mysql -u verification_system -p -h mysql-server-host knene_verification
```

#### 2. 应用部署

```bash
# 1. 创建应用目录
mkdir -p /opt/knene/verification
cd /opt/knene/verification

# 2. 部署应用包
# 假设已经有构建好的JAR包
cp knene-backend-verification.jar app.jar

# 3. 创建配置文件
mkdir -p config
cat > config/application-prod.yml << EOF
spring:
  profiles:
    active: prod
  datasource:
    url: jdbc:mysql://mysql-server-host:3306/knene_verification?useUnicode=true&characterEncoding=utf8&useSSL=true&serverTimezone=Asia/Shanghai
    username: verification_system
    password: strong_password_here
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000

  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
    validate-on-migrate: true

verification:
  enabled: true
  production-mode: true
  auto-execute:
    on-migration: true
    on-startup: false
    scheduled: true
  execution:
    timeout-seconds: 600
    max-concurrent-scripts: 3
  alerts:
    email:
      enabled: true
      smtp-host: smtp.company.com
      smtp-port: 587
      username: verification-alert@company.com
      password: email_password
      recipients:
        - admin@company.com
        - dba@company.com
    webhook:
      enabled: true
      urls:
        - https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK

logging:
  level:
    com.knene.verification: INFO
    org.flywaydb: WARN
  file:
    name: /var/log/knene/verification/verification.log
  logback:
    rollingpolicy:
      max-file-size: 100MB
      max-history: 30
EOF

# 4. 创建启动脚本
cat > start.sh << 'EOF'
#!/bin/bash

APP_HOME="/opt/knene/verification"
APP_JAR="$APP_HOME/app.jar"
PID_FILE="$APP_HOME/verification.pid"
LOG_FILE="/var/log/knene/verification/startup.log"

# 创建日志目录
mkdir -p "$(dirname "$LOG_FILE")"

# JVM参数
JVM_OPTS="-Xms2g -Xmx4g -XX:+UseG1GC -XX:MaxGCPauseMillis=200"
JVM_OPTS="$JVM_OPTS -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/log/knene/verification/"
JVM_OPTS="$JVM_OPTS -Dspring.profiles.active=prod"

cd "$APP_HOME"

case "$1" in
  start)
    if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
      echo "Verification system is already running"
      exit 1
    fi

    echo "Starting verification system..."
    nohup java $JVM_OPTS -jar "$APP_JAR" > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    echo "Verification system started with PID $(cat $PID_FILE)"
    ;;

  stop)
    if [ ! -f "$PID_FILE" ]; then
      echo "PID file not found"
      exit 1
    fi

    PID=$(cat "$PID_FILE")
    echo "Stopping verification system (PID: $PID)..."
    kill "$PID"

    # 等待进程结束
    for i in {1..30}; do
      if ! kill -0 "$PID" 2>/dev/null; then
        break
      fi
      sleep 1
    done

    # 如果进程还在运行，强制终止
    if kill -0 "$PID" 2>/dev/null; then
      echo "Force killing verification system..."
      kill -9 "$PID"
    fi

    rm -f "$PID_FILE"
    echo "Verification system stopped"
    ;;

  restart)
    $0 stop
    sleep 2
    $0 start
    ;;

  status)
    if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
      echo "Verification system is running (PID: $(cat $PID_FILE))"
    else
      echo "Verification system is not running"
    fi
    ;;

  *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac
EOF

chmod +x start.sh

# 5. 创建系统服务
sudo cat > /etc/systemd/system/knene-verification.service << EOF
[Unit]
Description=KNENE Database Verification System
After=network.target mysql.service

[Service]
Type=forking
User=knene
Group=knene
WorkingDirectory=/opt/knene/verification
ExecStart=/opt/knene/verification/start.sh start
ExecStop=/opt/knene/verification/start.sh stop
ExecReload=/opt/knene/verification/start.sh restart
PIDFile=/opt/knene/verification/verification.pid
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# 6. 启用并启动服务
sudo systemctl daemon-reload
sudo systemctl enable knene-verification
sudo systemctl start knene-verification
```

#### 3. 验证部署

```bash
# 1. 检查服务状态
sudo systemctl status knene-verification

# 2. 查看启动日志
tail -f /var/log/knene/verification/startup.log

# 3. 检查API接口
curl -X GET "http://localhost:8080/api/verification/health"

# 4. 执行手动验证测试
curl -X POST "http://localhost:8080/api/verification/execute" \
  -H "Content-Type: application/json" \
  -d '{
    "executionType": "MANUAL",
    "triggerSource": "Deployment Test",
    "modules": ["core"]
  }'
```

## 日常运维操作

### 系统监控检查

#### 每日检查清单

```bash
#!/bin/bash
# daily_health_check.sh - 每日健康检查脚本

echo "=== KNENE 验证系统每日健康检查 - $(date) ==="

# 1. 检查服务状态
echo "1. 检查服务状态..."
if systemctl is-active --quiet knene-verification; then
    echo "✅ 验证系统服务运行正常"
else
    echo "❌ 验证系统服务未运行"
    exit 1
fi

# 2. 检查数据库连接
echo "2. 检查数据库连接..."
mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "SELECT 1;" >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ 数据库连接正常"
else
    echo "❌ 数据库连接失败"
    exit 1
fi

# 3. 检查最近的验证执行情况
echo "3. 检查最近的验证执行情况..."
RECENT_EXECUTIONS=$(mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "
    SELECT
        execution_id,
        execution_type,
        health_score,
        execution_status,
        start_time
    FROM verification_executions
    WHERE start_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    ORDER BY start_time DESC
    LIMIT 5;
" | column -t)

if [ -n "$RECENT_EXECUTIONS" ]; then
    echo "✅ 最近的验证执行情况："
    echo "$RECENT_EXECUTIONS"
else
    echo "⚠️  过去24小时内没有验证执行记录"
fi

# 4. 检查错误和警告
echo "4. 检查错误和警告..."
ERROR_COUNT=$(mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "
    SELECT COUNT(*)
    FROM verification_executions
    WHERE start_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    AND execution_status = 'FAILED';
" | tail -1)

if [ "$ERROR_COUNT" -gt 0 ]; then
    echo "❌ 过去24小时内有 $ERROR_COUNT 次验证失败"
    # 显示失败的验证详情
    mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "
        SELECT execution_id, error_message, start_time
        FROM verification_executions
        WHERE start_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        AND execution_status = 'FAILED'
        ORDER BY start_time DESC;
    "
else
    echo "✅ 过去24小时内没有验证失败"
fi

# 5. 检查磁盘空间
echo "5. 检查磁盘空间..."
DISK_USAGE=$(df /opt/knene/verification | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    echo "❌ 磁盘使用率过高: ${DISK_USAGE}%"
else
    echo "✅ 磁盘使用率正常: ${DISK_USAGE}%"
fi

# 6. 检查内存使用
echo "6. 检查内存使用..."
MEMORY_USAGE=$(ps -p $(cat /opt/knene/verification/verification.pid) -o %mem --no-headers | tr -d ' ')
if [ "$(echo "$MEMORY_USAGE > 80" | bc -l)" -eq 1 ]; then
    echo "⚠️  内存使用率较高: ${MEMORY_USAGE}%"
else
    echo "✅ 内存使用率正常: ${MEMORY_USAGE}%"
fi

echo "=== 每日健康检查完成 ==="
```

#### 每周检查清单

```bash
#!/bin/bash
# weekly_maintenance.sh - 每周维护脚本

echo "=== KNENE 验证系统每周维护 - $(date) ==="

# 1. 分析验证执行趋势
echo "1. 分析验证执行趋势..."
mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "
    SELECT
        DATE(start_time) as date,
        COUNT(*) as executions,
        AVG(health_score) as avg_health_score,
        COUNT(CASE WHEN execution_status = 'FAILED' THEN 1 END) as failures
    FROM verification_executions
    WHERE start_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    GROUP BY DATE(start_time)
    ORDER BY date DESC;
"

# 2. 检查长期未验证的模块
echo "2. 检查长期未验证的模块..."
mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "
    SELECT
        module_name,
        MAX(start_time) as last_verification,
        TIMESTAMPDIFF(DAY, MAX(start_time), NOW()) as days_since_last
    FROM verification_results
    GROUP BY module_name
    HAVING days_since_last > 7
    ORDER BY days_since_last DESC;
"

# 3. 清理旧的执行记录（保留90天）
echo "3. 清理旧的执行记录..."
DELETED_COUNT=$(mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "
    DELETE FROM verification_executions
    WHERE start_time < DATE_SUB(NOW(), INTERVAL 90 DAY);
" | grep -E '[0-9]+' | head -1)
echo "清理了 $DELETED_COUNT 条旧的执行记录"

# 4. 检查验证脚本更新情况
echo "4. 检查验证脚本更新情况..."
cd /opt/knene/verification/scripts/database
for script in verify_*.sql; do
    last_modified=$(stat -c %Y "$script")
    days_old=$(( ($(date +%s) - last_modified) / 86400 ))
    if [ "$days_old" -gt 30 ]; then
        echo "⚠️  脚本 $script 已经 $days_old 天未更新"
    fi
done

# 5. 生成周报
echo "5. 生成周报..."
mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "
    SELECT
        'Weekly Summary' as metric,
        COUNT(*) as total_executions,
        AVG(health_score) as avg_health_score,
        COUNT(CASE WHEN execution_status = 'FAILED' THEN 1 END) as total_failures,
        COUNT(CASE WHEN health_score < 70 THEN 1 END) as low_score_count
    FROM verification_executions
    WHERE start_time >= DATE_SUB(NOW(), INTERVAL 7 DAY);
"

echo "=== 每周维护完成 ==="
```

### 手动操作指南

#### 手动执行验证

```bash
# 1. 执行单个模块验证
curl -X POST "http://localhost:8080/api/verification/execute" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_TOKEN" \
  -d '{
    "executionType": "MANUAL",
    "triggerSource": "Manual Test",
    "modules": ["core"],
    "forceExecute": true
  }'

# 2. 执行所有模块验证
curl -X POST "http://localhost:8080/api/verification/execute" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_TOKEN" \
  -d '{
    "executionType": "MANUAL",
    "triggerSource": "Full Manual Test",
    "modules": ["all"],
    "forceExecute": true
  }'

# 3. 使用命令行工具
java -jar /opt/knene/verification/app.jar \
  --spring.profiles.active=prod \
  --verification.manual.execute=true \
  --verification.manual.modules="core,auth,vip"
```

#### 查询验证状态

```bash
# 1. 查询特定执行状态
curl -X GET "http://localhost:8080/api/verification/status/VERIF_20250130_143022_123" \
  -H "Authorization: Bearer $API_TOKEN"

# 2. 查询最近的执行历史
curl -X GET "http://localhost:8080/api/verification/history?limit=10" \
  -H "Authorization: Bearer $API_TOKEN"

# 3. 查询系统健康状态
curl -X GET "http://localhost:8080/api/verification/health" \
  -H "Authorization: Bearer $API_TOKEN"

# 4. 获取详细报告
curl -X GET "http://localhost:8080/api/verification/report/VERIF_20250130_143022_123" \
  -H "Authorization: Bearer $API_TOKEN"
```

#### 管理验证脚本

```bash
# 1. 查看所有验证脚本
curl -X GET "http://localhost:8080/api/verification/scripts" \
  -H "Authorization: Bearer $API_TOKEN"

# 2. 启用/禁用特定脚本
curl -X PUT "http://localhost:8080/api/verification/scripts/verify_core_tables.sql" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_TOKEN" \
  -d '{"isActive": false}'

# 3. 更新脚本配置
curl -X PUT "http://localhost:8080/api/verification/scripts/verify_core_tables.sql/config" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_TOKEN" \
  -d '{
    "timeoutSeconds": 120,
    "retryCount": 2,
    "executionOrder": 1
  }'
```

## 监控和告警

### 系统监控配置

#### Prometheus监控指标

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'knene-verification'
    static_configs:
      - targets: ['localhost:8080']
    metrics_path: '/actuator/prometheus'
    scrape_interval: 30s
```

#### Grafana仪表板

```json
{
  "dashboard": {
    "title": "KNENE数据库验证系统监控",
    "panels": [
      {
        "title": "验证执行成功率",
        "type": "stat",
        "targets": [
          {
            "expr": "rate(verification_executions_total{status=\"success\"}[5m]) / rate(verification_executions_total[5m]) * 100"
          }
        ]
      },
      {
        "title": "平均健康评分",
        "type": "graph",
        "targets": [
          {
            "expr": "avg(verification_health_score)"
          }
        ]
      },
      {
        "title": "执行时长分布",
        "type": "histogram",
        "targets": [
          {
            "expr": "rate(verification_execution_duration_seconds_bucket[5m])"
          }
        ]
      }
    ]
  }
}
```

### 告警规则配置

#### Prometheus告警规则

```yaml
# verification_alerts.yml
groups:
  - name: verification_system
    rules:
      - alert: VerificationSystemDown
        expr: up{job="knene-verification"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "验证系统服务不可用"
          description: "验证系统服务已停止运行超过1分钟"

      - alert: VerificationHighFailureRate
        expr: rate(verification_executions_total{status="failed"}[5m]) / rate(verification_executions_total[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "验证失败率过高"
          description: "过去5分钟内验证失败率超过10%"

      - alert: VerificationLowHealthScore
        expr: avg(verification_health_score) < 70
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "数据库健康评分过低"
          description: "数据库平均健康评分低于70分"

      - alert: VerificationExecutionTimeout
        expr: increase(verification_timeouts_total[5m]) > 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "验证执行超时"
          description: "检测到验证执行超时"
```

## 故障处理

### 常见故障及解决方案

#### 1. 服务启动失败

**症状**：
- 服务无法启动
- 日志显示连接错误
- 端口占用

**排查步骤**：
```bash
# 1. 检查端口占用
netstat -tlnp | grep 8080

# 2. 检查日志
tail -100 /var/log/knene/verification/startup.log

# 3. 检查配置文件
cat /opt/knene/verification/config/application-prod.yml

# 4. 检查数据库连接
mysql -u verification_system -p -h $DB_HOST knene_verification
```

**解决方案**：
```bash
# 解决端口占用
sudo lsof -ti:8080 | xargs kill -9

# 修正配置文件权限
sudo chown -R knene:knene /opt/knene/verification/

# 重启服务
sudo systemctl restart knene-verification
```

#### 2. 验证执行失败

**症状**：
- 验证执行状态为FAILED
- 健康评分过低
- 错误日志显示SQL异常

**排查步骤**：
```sql
-- 查询失败原因
SELECT
    execution_id,
    error_message,
    start_time,
    execution_duration_seconds
FROM verification_executions
WHERE execution_status = 'FAILED'
ORDER BY start_time DESC
LIMIT 10;

-- 查询具体失败的脚本
SELECT
    script_name,
    module_name,
    execution_status,
    detailed_results
FROM verification_results
WHERE execution_id = 'FAILED_EXECUTION_ID'
AND execution_status = 'FAILED';
```

**解决方案**：
```bash
# 1. 手动执行失败的脚本
mysql -u verification_system -p -h $DB_HOST knene_verification < scripts/database/verify_failing_script.sql

# 2. 检查数据库表结构
mysql -u verification_system -p -h $DB_HOST knene_verification -e "DESCRIBE table_name;"

# 3. 修复数据问题
mysql -u verification_system -p -h $DB_HOST knene_verification -e "UPDATE table_name SET ... WHERE ...;"
```

#### 3. 性能问题

**症状**：
- 验证执行时间过长
- 内存使用过高
- 数据库负载增加

**排查步骤**：
```bash
# 1. 检查系统资源使用
top -p $(cat /opt/knene/verification/verification.pid)
iostat -x 1

# 2. 检查数据库性能
mysql -u verification_system -p -h $DB_HOST knene_verification -e "
  SHOW PROCESSLIST;
  SHOW FULL PROCESSLIST;
"

# 3. 分析慢查询
mysql -u verification_system -p -h $DB_HOST knene_verification -e "
  SELECT * FROM mysql.slow_log WHERE start_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR);
"
```

**解决方案**：
```yaml
# 优化配置
verification:
  execution:
    timeout-seconds: 300  # 减少超时时间
    max-concurrent-scripts: 1  # 减少并发数
  performance:
    batch-size: 1000  # 批处理大小
    fetch-size: 500   # 查询获取大小
```

### 故障恢复流程

#### 1. 紧急故障响应

```bash
#!/bin/bash
# emergency_response.sh - 紧急故障响应脚本

echo "=== 紧急故障响应流程启动 ==="

# 1. 快速诊断
echo "1. 执行快速诊断..."
if ! systemctl is-active --quiet knene-verification; then
    echo "❌ 服务未运行，尝试重启..."
    sudo systemctl restart knene-verification
    sleep 10
fi

# 2. 检查数据库连接
if ! mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "SELECT 1;" >/dev/null 2>&1; then
    echo "❌ 数据库连接失败，请联系DBA"
    exit 1
fi

# 3. 执行基础验证
echo "3. 执行基础验证..."
curl -X POST "http://localhost:8080/api/verification/execute" \
  -H "Content-Type: application/json" \
  -d '{
    "executionType": "EMERGENCY",
    "triggerSource": "Emergency Response",
    "modules": ["core"]
  }'

echo "=== 紧急故障响应完成 ==="
```

#### 2. 系统恢复验证

```bash
#!/bin/bash
# recovery_verification.sh - 系统恢复验证脚本

echo "=== 系统恢复验证 ==="

# 1. 服务状态验证
echo "1. 验证服务状态..."
systemctl is-active knene-verification && echo "✅ 服务正常" || echo "❌ 服务异常"

# 2. API接口验证
echo "2. 验证API接口..."
curl -f -s "http://localhost:8080/api/verification/health" >/dev/null && echo "✅ API正常" || echo "❌ API异常"

# 3. 数据库连接验证
echo "3. 验证数据库连接..."
mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "SELECT 1;" >/dev/null 2>&1 && echo "✅ 数据库正常" || echo "❌ 数据库异常"

# 4. 执行完整验证
echo "4. 执行完整验证..."
RESPONSE=$(curl -s -X POST "http://localhost:8080/api/verification/execute" \
  -H "Content-Type: application/json" \
  -d '{
    "executionType": "RECOVERY_TEST",
    "triggerSource": "Recovery Verification",
    "modules": ["all"]
  }')

EXECUTION_ID=$(echo "$RESPONSE" | jq -r '.data.executionId')
echo "验证执行ID: $EXECUTION_ID"

# 5. 等待执行完成
for i in {1..30}; do
    STATUS=$(curl -s "http://localhost:8080/api/verification/status/$EXECUTION_ID" | jq -r '.data.executionStatus')
    if [ "$STATUS" = "COMPLETED" ]; then
        echo "✅ 验证执行完成"
        break
    elif [ "$STATUS" = "FAILED" ]; then
        echo "❌ 验证执行失败"
        exit 1
    fi
    sleep 10
done

echo "=== 系统恢复验证完成 ==="
```

## 系统优化

### 性能优化建议

#### 1. 数据库优化

```sql
-- 创建验证结果索引
CREATE INDEX idx_verification_results_execution_id ON verification_results(execution_id);
CREATE INDEX idx_verification_results_module_name ON verification_results(module_name);
CREATE INDEX idx_verification_executions_start_time ON verification_executions(start_time);

-- 优化历史数据清理
CREATE TABLE verification_executions_archive LIKE verification_executions;
CREATE TABLE verification_results_archive LIKE verification_results;

-- 分区表设计（MySQL 8.0+）
ALTER TABLE verification_executions
PARTITION BY RANGE (TO_DAYS(start_time)) (
    PARTITION p_current VALUES LESS THAN (TO_DAYS(CURRENT_DATE)),
    PARTITION p_history VALUES LESS THAN MAXVALUE
);
```

#### 2. 应用优化

```yaml
# JVM优化参数
JAVA_OPTS="-Xms4g -Xmx8g"
JAVA_OPTS="$JAVA_OPTS -XX:+UseG1GC"
JAVA_OPTS="$JAVA_OPTS -XX:MaxGCPauseMillis=200"
JAVA_OPTS="$JAVA_OPTS -XX:+UnlockExperimentalVMOptions"
JAVA_OPTS="$JAVA_OPTS -XX:+UseStringDeduplication"

# 连接池优化
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
      leak-detection-threshold: 60000
```

#### 3. 验证脚本优化

```sql
-- 使用批量操作减少网络往返
INSERT INTO verification_results (execution_id, script_name, module_name, ...)
VALUES
    ('EXEC1', 'script1.sql', 'module1', ...),
    ('EXEC1', 'script2.sql', 'module2', ...);

-- 使用临时表提高查询性能
CREATE TEMPORARY TABLE temp_verification_data AS
SELECT * FROM large_table WHERE condition;

-- 使用索引提示优化查询
SELECT /*+ INDEX(users idx_user_email) */ * FROM users WHERE email = 'test@example.com';
```

### 容量规划

#### 存储容量规划

```bash
#!/bin/bash
# capacity_planning.sh - 容量规划脚本

echo "=== 验证系统容量规划分析 ==="

# 1. 当前存储使用情况
echo "1. 当前存储使用情况..."
du -sh /opt/knene/verification/
du -sh /var/log/knene/verification/

# 2. 数据库存储使用
echo "2. 数据库存储使用..."
mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "
  SELECT
      table_name,
      ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)',
      table_rows
  FROM information_schema.TABLES
  WHERE table_schema = 'knene_verification'
  ORDER BY (data_length + index_length) DESC;
"

# 3. 增长趋势分析
echo "3. 数据增长趋势分析..."
mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "
  SELECT
      DATE(start_time) as date,
      COUNT(*) as executions,
      SUM(CASE WHEN execution_status = 'FAILED' THEN 1 ELSE 0 END) as failures
  FROM verification_executions
  WHERE start_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  GROUP BY DATE(start_time)
  ORDER BY date;
"

# 4. 容量预测
echo "4. 容量预测（基于当前增长趋势）..."
# 这里可以添加基于历史数据的容量预测逻辑

echo "=== 容量规划分析完成 ==="
```

## 安全管理

### 安全配置检查

#### 定期安全检查

```bash
#!/bin/bash
# security_audit.sh - 安全审计脚本

echo "=== 验证系统安全审计 ==="

# 1. 检查文件权限
echo "1. 检查文件权限..."
find /opt/knene/verification -type f -perm /o+r -exec ls -la {} \;
find /opt/knene/verification -type f -name "*.yml" -exec ls -la {} \;

# 2. 检查数据库权限
echo "2. 检查数据库权限..."
mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "SHOW GRANTS FOR CURRENT_USER();"

# 3. 检查敏感信息
echo "3. 检查敏感信息泄露..."
grep -r "password" /opt/knene/verification/config/ 2>/dev/null
grep -r "secret" /opt/knene/verification/config/ 2>/dev/null

# 4. 检查日志中的敏感信息
echo "4. 检查日志敏感信息..."
grep -i "password\|secret\|token" /var/log/knene/verification/*.log 2>/dev/null | head -5

echo "=== 安全审计完成 ==="
```

#### 访问控制管理

```sql
-- 创建只读用户用于监控
CREATE USER 'verification_monitor'@'%' IDENTIFIED BY 'monitor_password';
GRANT SELECT ON knene_verification.* TO 'verification_monitor'@'%';

-- 创建审计用户
CREATE USER 'verification_audit'@'%' IDENTIFIED BY 'audit_password';
GRANT SELECT, INSERT ON knene_verification.verification_audit_logs TO 'verification_audit'@'%';
GRANT SELECT ON knene_verification.* TO 'verification_audit'@'%';

-- 定期清理不需要的权限
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'test_user'@'%';
DROP USER IF EXISTS 'test_user'@'%';
```

## 备份和恢复

### 数据备份策略

#### 自动备份脚本

```bash
#!/bin/bash
# backup_verification_system.sh - 验证系统备份脚本

BACKUP_DIR="/backup/knene/verification"
DATE=$(date +%Y%m%d_%H%M%S)
DB_BACKUP_FILE="$BACKUP_DIR/db_backup_$DATE.sql"
APP_BACKUP_FILE="$BACKUP_DIR/app_backup_$DATE.tar.gz"

# 创建备份目录
mkdir -p "$BACKUP_DIR"

echo "=== 开始备份验证系统 - $DATE ==="

# 1. 数据库备份
echo "1. 备份数据库..."
mysqldump -u verification_system -p$DB_PASSWORD -h $DB_HOST \
  --single-transaction \
  --routines \
  --triggers \
  knene_verification > "$DB_BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ 数据库备份成功: $DB_BACKUP_FILE"
    gzip "$DB_BACKUP_FILE"
else
    echo "❌ 数据库备份失败"
    exit 1
fi

# 2. 应用文件备份
echo "2. 备份应用文件..."
tar -czf "$APP_BACKUP_FILE" \
    -C /opt/knene/verification \
    --exclude='logs' \
    --exclude='tmp' \
    .

if [ $? -eq 0 ]; then
    echo "✅ 应用文件备份成功: $APP_BACKUP_FILE"
else
    echo "❌ 应用文件备份失败"
    exit 1
fi

# 3. 配置文件备份
echo "3. 备份配置文件..."
cp -r /opt/knene/verification/config "$BACKUP_DIR/config_backup_$DATE"

# 4. 清理旧备份（保留30天）
echo "4. 清理旧备份..."
find "$BACKUP_DIR" -name "*.gz" -mtime +30 -delete
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete
find "$BACKUP_DIR" -name "config_backup_*" -mtime +30 -exec rm -rf {} \;

# 5. 验证备份完整性
echo "5. 验证备份完整性..."
gunzip -t "$DB_BACKUP_FILE.gz"
tar -tzf "$APP_BACKUP_FILE" >/dev/null

echo "=== 备份完成 ==="
```

### 恢复流程

#### 系统恢复脚本

```bash
#!/bin/bash
# restore_verification_system.sh - 验证系统恢复脚本

if [ $# -ne 1 ]; then
    echo "用法: $0 <backup_date>"
    echo "示例: $0 20250130_143022"
    exit 1
fi

BACKUP_DATE=$1
BACKUP_DIR="/backup/knene/verification"
DB_BACKUP_FILE="$BACKUP_DIR/db_backup_$BACKUP_DATE.sql.gz"
APP_BACKUP_FILE="$BACKUP_DIR/app_backup_$BACKUP_DATE.tar.gz"

echo "=== 开始恢复验证系统 - $BACKUP_DATE ==="

# 1. 停止服务
echo "1. 停止验证系统服务..."
sudo systemctl stop knene-verification

# 2. 备份当前数据（以防恢复失败）
echo "2. 备份当前数据..."
CURRENT_DATE=$(date +%Y%m%d_%H%M%S)
mv /opt/knene/verification/config "/opt/knene/verification/config_backup_$CURRENT_DATE"

# 3. 恢复数据库
echo "3. 恢复数据库..."
if [ -f "$DB_BACKUP_FILE" ]; then
    gunzip -c "$DB_BACKUP_FILE" | mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification
    if [ $? -eq 0 ]; then
        echo "✅ 数据库恢复成功"
    else
        echo "❌ 数据库恢复失败"
        exit 1
    fi
else
    echo "❌ 数据库备份文件不存在: $DB_BACKUP_FILE"
    exit 1
fi

# 4. 恢复应用文件
echo "4. 恢复应用文件..."
if [ -f "$APP_BACKUP_FILE" ]; then
    tar -xzf "$APP_BACKUP_FILE" -C /opt/knene/verification
    if [ $? -eq 0 ]; then
        echo "✅ 应用文件恢复成功"
    else
        echo "❌ 应用文件恢复失败"
        exit 1
    fi
else
    echo "❌ 应用备份文件不存在: $APP_BACKUP_FILE"
    exit 1
fi

# 5. 恢复配置文件
echo "5. 恢复配置文件..."
if [ -d "$BACKUP_DIR/config_backup_$BACKUP_DATE" ]; then
    cp -r "$BACKUP_DIR/config_backup_$BACKUP_DATE"/* /opt/knene/verification/config/
    echo "✅ 配置文件恢复成功"
else
    echo "⚠️  配置备份不存在，使用默认配置"
fi

# 6. 设置文件权限
echo "6. 设置文件权限..."
sudo chown -R knene:knene /opt/knene/verification/
chmod +x /opt/knene/verification/start.sh

# 7. 启动服务
echo "7. 启动验证系统服务..."
sudo systemctl start knene-verification

# 8. 验证恢复结果
echo "8. 验证恢复结果..."
sleep 30
if systemctl is-active --quiet knene-verification; then
    echo "✅ 服务启动成功"
else
    echo "❌ 服务启动失败"
    sudo journalctl -u knene-verification -n 50
    exit 1
fi

# 9. 执行恢复验证
echo "9. 执行恢复验证..."
curl -X POST "http://localhost:8080/api/verification/execute" \
  -H "Content-Type: application/json" \
  -d '{
    "executionType": "RECOVERY_TEST",
    "triggerSource": "System Recovery",
    "modules": ["core"]
  }'

echo "=== 系统恢复完成 ==="
```

## 总结

数据库验证系统的运维是一个持续的过程，需要建立完善的监控体系、规范的操作流程和快速的故障响应机制。通过本手册提供的指导，运维人员可以：

1. **可靠部署**：按照标准化流程完成系统部署
2. **日常监控**：通过定期检查确保系统稳定运行
3. **故障处理**：快速定位和解决常见问题
4. **性能优化**：持续优化系统性能和资源使用
5. **安全管理**：保障系统安全和数据保护
6. **备份恢复**：确保数据的完整性和可恢复性

建议建立运维知识库，记录处理过的故障和解决方案，不断完善运维流程，提高系统的可靠性和可维护性。