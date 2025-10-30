# 数据库验证系统故障排除指南

## 概述

本文档提供数据库验证系统常见故障的诊断和解决方案，包括问题分类、诊断步骤、解决方法和预防措施。帮助运维人员快速定位和解决系统问题。

## 问题分类体系

### 按严重程度分类

#### 🔴 Critical（严重问题）
- 系统完全不可用
- 数据丢失或损坏
- 安全漏洞被利用
- 业务完全中断

#### 🟡 Warning（警告问题）
- 性能明显下降
- 部分功能异常
- 配置不当
- 潜在风险

#### 🔵 Info（信息问题）
- 配置建议
- 优化提示
- 状态变更
- 统计信息

### 按故障类型分类

#### 1. 服务启动问题
- 应用无法启动
- 端口占用
- 配置错误
- 依赖服务不可用

#### 2. 数据库连接问题
- 连接超时
- 认证失败
- 网络问题
- 权限不足

#### 3. 验证执行问题
- 脚本语法错误
- 执行超时
- 内存不足
- 锁冲突

#### 4. 性能问题
- 执行缓慢
- 资源占用过高
- 并发问题
- 内存泄漏

#### 5. 数据一致性问题
- 数据不匹配
- 外键约束冲突
- 事务回滚
- 数据损坏

## 诊断工具和方法

### 1. 系统状态检查

#### 基础健康检查脚本

```bash
#!/bin/bash
# health_check.sh - 系统健康检查脚本

echo "=== KNENE验证系统健康检查 - $(date) ==="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查函数
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        return 0
    else
        echo -e "${RED}❌ $2${NC}"
        return 1
    fi
}

check_warning() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${YELLOW}⚠️  $2${NC}"
    fi
}

# 1. 检查服务状态
echo -e "${BLUE}1. 检查服务状态${NC}"
if systemctl is-active --quiet knene-verification; then
    check_status 0 "验证系统服务运行正常"
    SERVICE_STATUS="running"
else
    check_status 1 "验证系统服务未运行"
    SERVICE_STATUS="stopped"
fi

# 2. 检查端口监听
echo -e "${BLUE}2. 检查端口监听${NC}"
if netstat -tlnp | grep -q ":8080.*LISTEN"; then
    check_status 0 "端口8080正常监听"
else
    check_status 1 "端口8080未监听"
fi

# 3. 检查数据库连接
echo -e "${BLUE}3. 检查数据库连接${NC}"
if mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "SELECT 1;" >/dev/null 2>&1; then
    check_status 0 "数据库连接正常"
    DB_STATUS="connected"
else
    check_status 1 "数据库连接失败"
    DB_STATUS="disconnected"
fi

# 4. 检查磁盘空间
echo -e "${BLUE}4. 检查磁盘空间${NC}"
DISK_USAGE=$(df /opt/knene/verification | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    check_status 0 "磁盘使用率正常 (${DISK_USAGE}%)"
elif [ "$DISK_USAGE" -lt 90 ]; then
    check_warning 1 "磁盘使用率较高 (${DISK_USAGE}%)"
else
    check_status 1 "磁盘使用率过高 (${DISK_USAGE}%)"
fi

# 5. 检查内存使用
echo -e "${BLUE}5. 检查内存使用${NC}"
if [ "$SERVICE_STATUS" = "running" ]; then
    MEMORY_USAGE=$(ps -p $(cat /opt/knene/verification/verification.pid 2>/dev/null) -o %mem --no-headers 2>/dev/null | tr -d ' ')
    if [ -n "$MEMORY_USAGE" ]; then
        if [ "$(echo "$MEMORY_USAGE > 80" | bc -l 2>/dev/null || echo 0)" -eq 1 ]; then
            check_warning 1 "内存使用率较高 (${MEMORY_USAGE}%)"
        else
            check_status 0 "内存使用率正常 (${MEMORY_USAGE}%)"
        fi
    else
        check_warning 1 "无法获取内存使用信息"
    fi
else
    echo -e "${YELLOW}⚠️  服务未运行，跳过内存检查${NC}"
fi

# 6. 检查最近的验证执行
echo -e "${BLUE}6. 检查最近的验证执行${NC}"
if [ "$DB_STATUS" = "connected" ]; then
    RECENT_RESULT=$(mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "
        SELECT execution_status, health_score
        FROM verification_executions
        ORDER BY start_time DESC
        LIMIT 1;
    " 2>/dev/null | tail -1)

    if [ -n "$RECENT_RESULT" ]; then
        STATUS=$(echo "$RECENT_RESULT" | awk '{print $1}')
        SCORE=$(echo "$RECENT_RESULT" | awk '{print $2}')

        if [ "$STATUS" = "COMPLETED" ] || [ "$STATUS" = "SUCCESS" ]; then
            if [ "$(echo "$SCORE >= 70" | bc -l 2>/dev/null || echo 1)" -eq 1 ]; then
                check_status 0 "最近验证执行正常 (状态: $STATUS, 评分: $SCORE)"
            else
                check_warning 1 "最近验证评分较低 (状态: $STATUS, 评分: $SCORE)"
            fi
        else
            check_status 1 "最近验证执行失败 (状态: $STATUS)"
        fi
    else
        check_warning 1 "没有找到验证执行记录"
    fi
else
    echo -e "${YELLOW}⚠️  数据库连接失败，跳过验证检查${NC}"
fi

# 7. 检查日志错误
echo -e "${BLUE}7. 检查日志错误${NC}"
ERROR_COUNT=$(tail -1000 /var/log/knene/verification/verification.log 2>/dev/null | grep -i "error\|exception\|failed" | wc -l)
if [ "$ERROR_COUNT" -eq 0 ]; then
    check_status 0 "最近日志无错误"
elif [ "$ERROR_COUNT" -lt 5 ]; then
    check_warning 1 "最近日志有少量错误 ($ERROR_COUNT 个)"
else
    check_status 1 "最近日志有较多错误 ($ERROR_COUNT 个)"
fi

echo ""
echo -e "${BLUE}=== 健康检查完成 ===${NC}"

# 输出总体状态
if [ "$SERVICE_STATUS" = "running" ] && [ "$DB_STATUS" = "connected" ]; then
    echo -e "${GREEN}总体状态：系统运行正常${NC}"
    exit 0
else
    echo -e "${RED}总体状态：系统存在问题，需要处理${NC}"
    exit 1
fi
```

### 2. 详细诊断脚本

```bash
#!/bin/bash
# detailed_diagnosis.sh - 详细诊断脚本

echo "=== KNENE验证系统详细诊断 - $(date) ==="
echo ""

# 获取系统信息
echo -e "${BLUE}系统信息:${NC}"
echo "操作系统: $(uname -s) $(uname -r)"
echo "架构: $(uname -m)"
echo "主机名: $(hostname)"
echo "当前用户: $(whoami)"
echo ""

# 获取Java信息
echo -e "${BLUE}Java环境:${NC}"
if command -v java >/dev/null 2>&1; then
    java -version 2>&1 | head -2
    echo "Java路径: $(which java)"
else
    echo "Java未安装或不在PATH中"
fi
echo ""

# 获取应用信息
echo -e "${BLUE}应用信息:${NC}"
if [ -f /opt/knene/verification/app.jar ]; then
    echo "应用路径: /opt/knene/verification/app.jar"
    echo "应用大小: $(du -h /opt/knene/verification/app.jar | cut -f1)"
    echo "应用修改时间: $(stat -c %y /opt/knene/verification/app.jar)"
else
    echo "应用文件不存在"
fi

# 获取进程信息
echo -e "${BLUE}进程信息:${NC}"
if [ -f /opt/knene/verification/verification.pid ]; then
    PID=$(cat /opt/knene/verification/verification.pid)
    if kill -0 "$PID" 2>/dev/null; then
        echo "进程ID: $PID"
        echo "进程启动时间: $(ps -p $PID -o lstart --no-headers)"
        echo "进程CPU使用: $(ps -p $PID -o %cpu --no-headers)%"
        echo "进程内存使用: $(ps -p $PID -o %mem --no-headers)%"
        echo "进程状态: $(ps -p $PID -o stat --no-headers)"
    else
        echo "进程不存在 (PID文件存在但进程已终止)"
    fi
else
    echo "PID文件不存在"
fi
echo ""

# 获取网络连接信息
echo -e "${BLUE}网络连接:${NC}"
netstat -tlnp 2>/dev/null | grep ":8080" || echo "端口8080未监听"
echo ""

# 获取数据库连接状态
echo -e "${BLUE}数据库连接:${NC}"
if mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "SELECT 1;" >/dev/null 2>&1; then
    echo "数据库连接: 正常"

    # 获取数据库版本
    DB_VERSION=$(mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "SELECT VERSION();" 2>/dev/null | tail -1)
    echo "数据库版本: $DB_VERSION"

    # 获取连接数
    CONNECTION_COUNT=$(mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "SHOW STATUS LIKE 'Threads_connected';" 2>/dev/null | tail -1 | awk '{print $2}')
    echo "当前连接数: $CONNECTION_COUNT"
else
    echo "数据库连接: 失败"
fi
echo ""

# 获取最近的错误日志
echo -e "${BLUE}最近的错误日志:${NC}"
if [ -f /var/log/knene/verification/verification.log ]; then
    echo "最近10条错误/异常记录:"
    tail -1000 /var/log/knene/verification/verification.log | grep -i "error\|exception\|failed" | tail -10 | while read line; do
        echo "  $line"
    done
else
    echo "日志文件不存在"
fi
echo ""

# 获取系统资源使用情况
echo -e "${BLUE}系统资源使用:${NC}"
echo "CPU负载: $(uptime | awk -F'load average:' '{print $2}')"
echo "内存使用: $(free -h | awk 'NR==2{printf "已用: %s, 可用: %s, 使用率: %.1f%%", $3, $7, $3/$2*100}')"
echo "磁盘使用: $(df -h / | awk 'NR==2{printf "已用: %s, 可用: %s, 使用率: %s", $3, $4, $5}')"
echo ""

echo "=== 详细诊断完成 ==="
```

## 常见故障及解决方案

### 1. 服务启动失败

#### 故障现象
- 服务无法启动
- systemctl status显示failed
- 启动日志中有异常信息

#### 诊断步骤

```bash
# 1. 查看服务状态
sudo systemctl status knene-verification

# 2. 查看详细日志
sudo journalctl -u knene-verification -n 50 --no-pager

# 3. 查看应用启动日志
tail -100 /var/log/knene/verification/startup.log

# 4. 检查配置文件
cat /opt/knene/verification/config/application-prod.yml

# 5. 检查端口占用
sudo netstat -tlnp | grep 8080
```

#### 常见原因及解决方案

**原因1: 端口被占用**
```bash
# 查找占用端口的进程
sudo lsof -i :8080

# 终止占用进程
sudo kill -9 <PID>

# 或修改配置文件使用其他端口
```

**原因2: 数据库连接失败**
```bash
# 测试数据库连接
mysql -u verification_system -p -h $DB_HOST knene_verification

# 检查数据库服务状态
sudo systemctl status mysql

# 重启数据库服务
sudo systemctl restart mysql
```

**原因3: 配置文件错误**
```bash
# 验证YAML语法
python -c "import yaml; yaml.safe_load(open('/opt/knene/verification/config/application-prod.yml'))"

# 检查关键配置项
grep -E "(datasource|verification)" /opt/knene/verification/config/application-prod.yml
```

**原因4: 权限问题**
```bash
# 检查文件权限
ls -la /opt/knene/verification/

# 修正权限
sudo chown -R knene:knene /opt/knene/verification/
sudo chmod +x /opt/knene/verification/start.sh
```

### 2. 验证执行失败

#### 故障现象
- 验证执行状态为FAILED
- 健康评分为0或很低
- 错误日志显示SQL异常

#### 诊断步骤

```sql
-- 1. 查询失败的执行记录
SELECT
    execution_id,
    execution_type,
    trigger_source,
    start_time,
    end_time,
    execution_duration_seconds,
    execution_status,
    error_message,
    health_score
FROM verification_executions
WHERE execution_status = 'FAILED'
ORDER BY start_time DESC
LIMIT 10;

-- 2. 查询具体失败的脚本
SELECT
    script_name,
    module_name,
    start_time,
    end_time,
    execution_status,
    error_message,
    detailed_results
FROM verification_results
WHERE execution_id = 'FAILED_EXECUTION_ID'
AND execution_status = 'FAILED';

-- 3. 查询最近的错误统计
SELECT
    DATE(start_time) as date,
    COUNT(*) as total_executions,
    COUNT(CASE WHEN execution_status = 'FAILED' THEN 1 END) as failed_count,
    AVG(health_score) as avg_health_score
FROM verification_executions
WHERE start_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(start_time)
ORDER BY date DESC;
```

#### 常见原因及解决方案

**原因1: SQL语法错误**
```sql
-- 手动测试失败的SQL语句
-- 从错误日志中提取具体SQL并测试
SELECT * FROM problematic_table WHERE condition;

-- 检查表结构
DESCRIBE problematic_table;

-- 修复SQL语法错误
```

**原因2: 表或数据不存在**
```sql
-- 检查表是否存在
SHOW TABLES LIKE 'table_name';

-- 检查数据是否存在
SELECT COUNT(*) FROM table_name WHERE condition;

-- 创建缺失的表或数据
```

**原因3: 权限不足**
```sql
-- 检查当前用户权限
SHOW GRANTS FOR CURRENT_USER();

-- 授予必要权限
GRANT SELECT ON database_name.* TO 'verification_system'@'%';
```

**原因4: 执行超时**
```bash
# 检查超时配置
grep -A 5 "timeout" /opt/knene/verification/config/application-prod.yml

# 增加超时时间
# 或优化SQL查询性能
```

### 3. 性能问题

#### 故障现象
- 验证执行时间过长
- 内存使用持续增长
- CPU使用率过高
- 数据库负载增加

#### 诊断步骤

```bash
# 1. 监控系统资源使用
top -p $(cat /opt/knene/verification/verification.pid)
iostat -x 1 10

# 2. 分析Java堆内存使用
jstat -gc $(cat /opt/knene/verification/verification.pid) 5s

# 3. 生成线程转储
jstack $(cat /opt/knene/verification/verification.pid) > thread_dump.txt

# 4. 生成堆转储
jmap -dump:format=b,file=heap_dump.hprof $(cat /opt/knene/verification/verification.pid)

# 5. 检查数据库性能
mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "
  SHOW FULL PROCESSLIST;
  SHOW ENGINE INNODB STATUS;
"
```

#### 性能优化方案

**内存优化**
```yaml
# 调整JVM参数
JAVA_OPTS="-Xms2g -Xmx4g"
JAVA_OPTS="$JAVA_OPTS -XX:+UseG1GC"
JAVA_OPTS="$JAVA_OPTS -XX:MaxGCPauseMillis=200"
JAVA_OPTS="$JAVA_OPTS -XX:+HeapDumpOnOutOfMemoryError"
```

**数据库优化**
```sql
-- 创建必要的索引
CREATE INDEX idx_table_column ON table_name(column_name);

-- 优化查询语句
EXPLAIN SELECT * FROM table_name WHERE condition;

-- 分批处理大数据量
SELECT * FROM large_table LIMIT 1000 OFFSET 0;
```

**并发控制**
```yaml
verification:
  execution:
    max-concurrent-scripts: 2  # 减少并发数
    timeout-seconds: 300       # 调整超时时间
```

### 4. 数据一致性问题

#### 故障现象
- 验证结果显示数据不一致
- 外键约束冲突
- 统计数据不匹配

#### 诊断步骤

```sql
-- 1. 检查数据完整性
SELECT
    'users' as table_name,
    COUNT(*) as total_count,
    COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) as null_email_count,
    COUNT(CASE WHEN created_at > updated_at THEN 1 END) as invalid_date_count
FROM users

UNION ALL

SELECT
    'user_roles' as table_name,
    COUNT(*) as total_count,
    COUNT(CASE WHERE user_id NOT IN (SELECT id FROM users) THEN 1 END) as orphaned_count,
    0 as invalid_date_count
FROM user_roles;

-- 2. 检查外键约束
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'knene'
    AND REFERENCED_TABLE_NAME IS NOT NULL;

-- 3. 检查数据不一致的具体情况
-- 根据验证脚本的具体检查逻辑进行查询
```

#### 数据修复方案

```sql
-- 1. 修复孤立记录
DELETE FROM user_roles
WHERE user_id NOT IN (SELECT id FROM users);

-- 2. 修复NULL值
UPDATE users
SET email = CONCAT('user_', id, '@temp.com')
WHERE email IS NULL OR email = '';

-- 3. 修复日期不一致
UPDATE users
SET updated_at = created_at
WHERE updated_at < created_at;

-- 4. 重建统计信息
ANALYZE TABLE users;
ANALYZE TABLE user_roles;
```

### 5. 网络连接问题

#### 故障现象
- 数据库连接超时
- API接口无法访问
- 网络中断

#### 诊断步骤

```bash
# 1. 检查网络连通性
ping $DB_HOST
telnet $DB_HOST 3306

# 2. 检查防火墙设置
sudo ufw status
sudo iptables -L -n | grep 3306

# 3. 检查DNS解析
nslookup $DB_HOST
dig $DB_HOST

# 4. 检查端口监听
netstat -tlnp | grep 8080
netstat -tlnp | grep 3306

# 5. 检查网络配置
ip addr show
route -n
```

#### 解决方案

**网络配置修复**
```bash
# 重启网络服务
sudo systemctl restart network

# 修改防火墙规则
sudo ufw allow 3306
sudo ufw allow 8080

# 修改hosts文件
echo "$DB_HOST_IP $DB_HOST" | sudo tee -a /etc/hosts
```

**连接池配置优化**
```yaml
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

## 应急响应流程

### 紧急故障响应

#### 1. 故障识别和分级

```bash
#!/bin/bash
# emergency_response.sh - 紧急故障响应脚本

SEVERITY_LEVEL=$1
EXECUTION_ID=$2

echo "=== 紧急故障响应 - $(date) ==="
echo "严重级别: $SEVERITY_LEVEL"
echo "执行ID: $EXECUTION_ID"

case $SEVERITY_LEVEL in
    "CRITICAL")
        echo "启动严重故障响应流程..."

        # 1. 立即停止可能造成损害的操作
        sudo systemctl stop knene-verification

        # 2. 保存现场数据
        mkdir -p /tmp/emergency_$(date +%Y%m%d_%H%M%S)
        cp -r /var/log/knene/verification /tmp/emergency_$(date +%Y%m%d_%H%M%S)/
        jstack $(cat /opt/knene/verification/verification.pid 2>/dev/null) > /tmp/emergency_$(date +%Y%m%d_%H%M%S)/thread_dump.txt 2>/dev/null

        # 3. 通知相关人员
        send_emergency_notification "CRITICAL" "验证系统严重故障，已停止服务"

        # 4. 记录事件
        log_emergency_event "CRITICAL" "系统停止，原因待查"
        ;;

    "WARNING")
        echo "启动警告故障响应流程..."

        # 1. 增加监控频率
        increase_monitoring_frequency

        # 2. 通知相关人员
        send_emergency_notification "WARNING" "验证系统警告，需要关注"

        # 3. 记录事件
        log_emergency_event "WARNING" "系统警告，持续监控"
        ;;

    *)
        echo "未知严重级别: $SEVERITY_LEVEL"
        exit 1
        ;;
esac

echo "=== 紧急响应完成 ==="
```

#### 2. 快速恢复程序

```bash
#!/bin/bash
# quick_recovery.sh - 快速恢复程序

echo "=== 快速恢复程序启动 ==="

# 1. 检查系统基础状态
echo "1. 检查系统基础状态..."
./health_check.sh

# 2. 尝试基础恢复
echo "2. 尝试基础恢复..."

# 清理临时文件
find /tmp -name "*verification*" -mtime +1 -delete 2>/dev/null

# 重启数据库连接
sudo systemctl restart mysql

# 清理应用缓存
rm -rf /opt/knene/verification/tmp/*

# 3. 重启服务
echo "3. 重启验证服务..."
sudo systemctl restart knene-verification

# 4. 验证恢复结果
echo "4. 验证恢复结果..."
sleep 30

if systemctl is-active --quiet knene-verification; then
    echo "✅ 服务重启成功"

    # 执行基础验证
    BASIC_VERIFY_RESULT=$(curl -s -X POST "http://localhost:8080/api/verification/execute" \
        -H "Content-Type: application/json" \
        -d '{
            "executionType": "RECOVERY_CHECK",
            "triggerSource": "Emergency Recovery",
            "modules": ["core"]
        }')

    echo "基础验证结果: $BASIC_VERIFY_RESULT"

    if echo "$BASIC_VERIFY_RESULT" | grep -q "success"; then
        echo "✅ 快速恢复成功"
        send_recovery_notification "SUCCESS" "系统已快速恢复"
    else
        echo "❌ 快速恢复部分失败，需要进一步处理"
        send_recovery_notification "PARTIAL" "系统部分恢复，需要进一步处理"
    fi
else
    echo "❌ 服务重启失败"
    send_recovery_notification "FAILED" "系统重启失败，需要手动干预"
fi

echo "=== 快速恢复程序完成 ==="
```

### 故障后分析和改进

#### 1. 故障报告模板

```markdown
# 故障报告 - [故障标题]

## 基本信息
- **故障ID**: INCIDENT-YYYYMMDD-001
- **故障时间**: 2025-01-30 14:30:22
- **发现时间**: 2025-01-30 14:35:15
- **解决时间**: 2025-01-30 15:45:30
- **持续时间**: 75分钟
- **影响范围**: 验证系统完全不可用
- **严重级别**: Critical

## 故障描述
[详细描述故障现象和影响]

## 故障时间线
- 14:30:22 - 系统出现异常
- 14:35:15 - 运维团队发现故障
- 14:40:00 - 启动应急响应
- 15:20:00 - 确定故障原因
- 15:45:30 - 系统恢复

## 根本原因分析
[分析故障的根本原因]

## 解决措施
[描述采取的解决措施]

## 预防措施
[提出预防类似故障的措施]

## 经验教训
[总结经验教训]
```

#### 2. 故障统计和分析

```sql
-- 故障统计查询
SELECT
    DATE(created_at) as date,
    incident_type,
    severity_level,
    COUNT(*) as incident_count,
    AVG(resolution_time_minutes) as avg_resolution_time
FROM incident_reports
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(created_at), incident_type, severity_level
ORDER BY date DESC, incident_count DESC;

-- MTTR (Mean Time To Repair) 计算
SELECT
    severity_level,
    AVG(resolution_time_minutes) as mttr,
    MIN(resolution_time_minutes) as min_resolution_time,
    MAX(resolution_time_minutes) as max_resolution_time,
    COUNT(*) as incident_count
FROM incident_reports
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)
GROUP BY severity_level;
```

## 监控和告警优化

### 1. 自定义监控指标

```java
@Component
public class CustomVerificationMetrics {

    private final MeterRegistry meterRegistry;
    private final Counter verificationExecutionCounter;
    private final Timer verificationExecutionTimer;
    private final Gauge healthScoreGauge;

    public CustomVerificationMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;

        this.verificationExecutionCounter = Counter.builder("verification_executions_total")
            .description("Total number of verification executions")
            .tag("status", "unknown")
            .register(meterRegistry);

        this.verificationExecutionTimer = Timer.builder("verification_execution_duration")
            .description("Verification execution duration")
            .register(meterRegistry);

        this.healthScoreGauge = Gauge.builder("verification_health_score")
            .description("Current health score")
            .register(meterRegistry, this, CustomVerificationMetrics::getCurrentHealthScore);
    }

    public void recordExecution(String status, Duration duration) {
        verificationExecutionCounter.increment(Tags.of("status", status));
        verificationExecutionTimer.record(duration);
    }

    private double getCurrentHealthScore() {
        // 实现获取当前健康评分的逻辑
        return 85.0; // 示例值
    }
}
```

### 2. 智能告警规则

```yaml
# 智能告警配置
alerts:
  - name: "verification_performance_degradation"
    condition: "avg_verification_duration > threshold * 1.5"
    threshold: "avg(verification_execution_duration[1h])"
    severity: "warning"
    message: "验证执行性能下降超过50%"

  - name: "verification_error_rate_spike"
    condition: "error_rate > baseline * 2"
    baseline: "avg(verification_error_rate[24h])"
    severity: "critical"
    message: "验证错误率异常增加"

  - name: "verification_health_score_decline"
    condition: "health_score < 70 AND trend(health_score, 6h) < 0"
    severity: "warning"
    message: "健康评分持续下降"
```

## 预防性维护

### 1. 定期维护任务

```bash
#!/bin/bash
# preventive_maintenance.sh - 预防性维护脚本

echo "=== 预防性维护 - $(date) ==="

# 1. 系统健康检查
echo "1. 执行系统健康检查..."
./health_check.sh

# 2. 日志清理
echo "2. 清理旧日志..."
find /var/log/knene/verification -name "*.log" -mtime +30 -delete
find /var/log/knene/verification -name "*.log.*" -mtime +7 -delete

# 3. 数据库维护
echo "3. 执行数据库维护..."
mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "
  OPTIMIZE TABLE verification_executions;
  OPTIMIZE TABLE verification_results;
  ANALYZE TABLE verification_executions;
  ANALYZE TABLE verification_results;
"

# 4. 配置文件检查
echo "4. 检查配置文件..."
python -c "
import yaml
try:
    with open('/opt/knene/verification/config/application-prod.yml', 'r') as f:
        yaml.safe_load(f)
    print('✅ 配置文件语法正确')
except Exception as e:
    print(f'❌ 配置文件语法错误: {e}')
"

# 5. 磁盘空间检查
echo "5. 检查磁盘空间..."
DISK_USAGE=$(df /opt/knene/verification | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 85 ]; then
    echo "⚠️  磁盘使用率过高: ${DISK_USAGE}%"
    # 执行清理操作
    find /opt/knene/verification -name "*.tmp" -delete
    find /opt/knene/verification -name "*.bak" -mtime +7 -delete
fi

# 6. 性能基准测试
echo "6. 执行性能基准测试..."
curl -s -X POST "http://localhost:8080/api/verification/execute" \
    -H "Content-Type: application/json" \
    -d '{
        "executionType": "MAINTENANCE_TEST",
        "triggerSource": "Preventive Maintenance",
        "modules": ["core"]
    }' > /tmp/maintenance_test_result.json

# 7. 生成维护报告
echo "7. 生成维护报告..."
cat > /var/log/knene/verification/maintenance_report_$(date +%Y%m%d).txt << EOF
预防性维护报告 - $(date)
========================================
系统状态: $([ -f /opt/knene/verification/verification.pid ] && kill -0 $(cat /opt/knene/verification/verification.pid) 2>/dev/null && echo "正常" || echo "异常")
磁盘使用率: ${DISK_USAGE}%
日志清理: 完成
数据库优化: 完成
配置检查: 完成
性能测试: 完成

维护结果:
$(cat /tmp/maintenance_test_result.json | jq -r '.message // "Unknown"')
EOF

echo "=== 预防性维护完成 ==="
```

### 2. 容量规划建议

```bash
#!/bin/bash
# capacity_planning.sh - 容量规划脚本

echo "=== 容量规划分析 - $(date) ==="

# 1. 当前资源使用情况
echo "1. 当前资源使用情况"
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "内存: $(free | awk 'NR==2{printf "%.1f%%", $3/$2*100}')"
echo "磁盘: $(df /opt/knene/verification | awk 'NR==2{print $5}')"

# 2. 数据增长趋势
echo "2. 数据增长趋势分析"
mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "
  SELECT
      'verification_executions' as table_name,
      table_rows,
      ROUND(((data_length + index_length) / 1024 / 1024), 2) as size_mb,
      ROUND(table_rows / NULLIF(DATEDIFF(NOW(), create_time), 0), 2) as daily_growth
  FROM information_schema.TABLES t
  JOIN (
      SELECT MIN(created_at) as create_time FROM verification_executions
  ) c ON 1=1
  WHERE table_schema = 'knene_verification' AND table_name = 'verification_executions'
  UNION ALL
  SELECT
      'verification_results' as table_name,
      table_rows,
      ROUND(((data_length + index_length) / 1024 / 1024), 2) as size_mb,
      ROUND(table_rows / NULLIF(DATEDIFF(NOW(), create_time), 0), 2) as daily_growth
  FROM information_schema.TABLES t
  JOIN (
      SELECT MIN(created_at) as create_time FROM verification_results
  ) c ON 1=1
  WHERE table_schema = 'knene_verification' AND table_name = 'verification_results';
"

# 3. 性能趋势分析
echo "3. 性能趋势分析"
mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "
  SELECT
      DATE(start_time) as date,
      COUNT(*) as executions,
      AVG(execution_duration_seconds) as avg_duration,
      AVG(health_score) as avg_health_score
  FROM verification_executions
  WHERE start_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  GROUP BY DATE(start_time)
  ORDER BY date DESC
  LIMIT 7;
"

# 4. 容量预测
echo "4. 容量预测（未来30天）"
# 这里可以添加基于历史数据的容量预测算法
CURRENT_SIZE=$(mysql -u verification_system -p$DB_PASSWORD -h $DB_HOST knene_verification -e "
  SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2)
  FROM information_schema.TABLES
  WHERE table_schema = 'knene_verification';
" | tail -1)

echo "当前数据库大小: ${CURRENT_SIZE}MB"
echo "预计30天后大小: $(echo "$CURRENT_SIZE * 1.2" | bc)MB (假设20%增长率)"

echo "=== 容量规划分析完成 ==="
```

## 总结

数据库验证系统的故障排除需要建立完善的诊断体系、标准化的处理流程和预防性维护机制。通过本指南提供的工具和方法，运维人员可以：

1. **快速诊断**：使用标准化脚本快速定位问题
2. **分类处理**：根据故障类型采取相应解决方案
3. **应急响应**：在严重故障时快速恢复服务
4. **持续改进**：通过故障分析优化系统
5. **预防维护**：通过定期维护减少故障发生

建议建立故障知识库，记录所有故障案例和解决方案，不断完善故障处理流程，提高系统的可靠性和可维护性。