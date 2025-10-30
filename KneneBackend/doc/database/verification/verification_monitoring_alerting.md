# 数据库验证系统监控告警指南

## 概述

本文档详细描述了数据库验证系统的监控架构、告警策略、指标体系和最佳实践，帮助运维团队建立完善的监控告警体系，确保系统稳定运行。

## 监控架构设计

### 整体监控架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           监控系统架构                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        数据收集层                                   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │   │
│  │  │ 应用指标     │ │ 系统指标     │ │ 数据库指标   │ │ 业务指标     │     │   │
│  │  │   收集器     │ │   收集器     │ │   收集器     │ │   收集器     │     │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘     │   │
│  │         │               │               │               │             │   │
│  │         └───────────────┼───────────────┼───────────────┘             │   │
│  │                         ↓               ↓                           │   │
│  │                   ┌─────────────┐ ┌─────────────┐                     │   │
│  │                   │ Micrometer   │ │ JMX Exporter│                     │   │
│  │                   │   Metrics    │ │             │                     │   │
│  │                   └─────────────┘ └─────────────┘                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        数据存储层                                   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │   │
│  │  │ Prometheus  │ │ InfluxDB    │ │ Elasticsearch│ │ 时序数据库   │     │   │
│  │  │   Server    │ │   (可选)    │ │   (日志)     │ │             │     │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        数据处理层                                   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │   │
│  │  │ 聚合计算     │ │ 异常检测     │ │ 趋势分析     │ │ 预测分析     │     │   │
│  │  │   引擎       │ │   算法       │ │   模型       │ │   模型       │     │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        可视化展示层                                 │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │   │
│  │  │ Grafana     │ │ 自定义       │ │ 移动端       │ │ 大屏展示     │     │   │
│  │  │  仪表板     │ │   仪表板     │ │   应用       │ │   系统       │     │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        告警通知层                                   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │   │
│  │  │ AlertManager│ │ PagerDuty   │ │ 钉钉/飞书   │ │ 邮件/短信    │     │   │
│  │  │   告警管理   │ │   值班管理   │ │   即时通讯   │ │   传统通知   │     │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 核心监控组件

#### 1. Prometheus（指标收集和存储）
- **功能**：时序数据收集、存储、查询
- **优势**：强大的查询语言PromQL、生态系统完善
- **配置**：灵活的服务发现和抓取配置

#### 2. Grafana（可视化展示）
- **功能**：仪表板创建、图表展示、告警配置
- **优势**：丰富的图表类型、美观的界面、灵活的配置

#### 3. AlertManager（告警管理）
- **功能**：告警路由、分组、抑制、通知
- **优势**：智能告警处理、多渠道通知、故障升级

#### 4. Node Exporter（系统指标）
- **功能**：主机级系统指标收集
- **指标**：CPU、内存、磁盘、网络、文件系统

## 核心监控指标体系

### 1. 应用层指标

#### 验证执行指标
```yaml
# 验证执行统计
verification_executions_total:
  description: "验证执行总数"
  labels: [status, module, execution_type]
  type: counter

# 验证执行时长
verification_execution_duration_seconds:
  description: "验证执行时长"
  labels: [module, script_name]
  type: histogram
  buckets: [1, 5, 10, 30, 60, 120, 300, 600]

# 验证健康评分
verification_health_score:
  description: "验证健康评分"
  labels: [module, execution_id]
  type: gauge

# 验证问题数量
verification_issues_total:
  description: "验证问题数量"
  labels: [severity, module, issue_type]
  type: counter
```

#### 系统性能指标
```yaml
# JVM内存使用
jvm_memory_used_bytes:
  description: "JVM内存使用量"
  labels: [area, pool]
  type: gauge

# JVM线程数量
jvm_threads_live_threads:
  description: "活跃线程数"
  type: gauge

# 垃圾回收统计
jvm_gc_collection_seconds_total:
  description: "GC耗时统计"
  labels: [gc, action]
  type: counter

# HTTP请求统计
http_requests_total:
  description: "HTTP请求总数"
  labels: [method, status, handler]
  type: counter
```

#### 业务逻辑指标
```yaml
# 数据库连接状态
database_connection_status:
  description: "数据库连接状态"
  labels: [database]
  type: gauge

# 脚本发现数量
verification_scripts_discovered_total:
  description: "发现的验证脚本数量"
  labels: [module, status]
  type: gauge

# 并发执行统计
verification_concurrent_executions:
  description: "当前并发执行数量"
  type: gauge
```

### 2. 数据库层指标

#### MySQL性能指标
```yaml
# 连接数
mysql_global_status_threads_connected:
  description: "当前连接数"
  type: gauge

# 查询统计
mysql_global_status_queries:
  description: "查询总数"
  type: counter

# 慢查询统计
mysql_global_status_slow_queries:
  description: "慢查询数量"
  type: counter

# 缓冲池使用率
mysql_global_status_innodb_buffer_pool_pages_data:
  description: "缓冲池数据页数"
  type: gauge
```

#### 验证系统专用指标
```yaml
# 验证表大小
verification_table_size_bytes:
  description: "验证表大小"
  labels: [table_name]
  type: gauge

# 验证执行历史统计
verification_executions_by_type:
  description: "按类型统计验证执行"
  labels: [execution_type, status]
  type: counter
```

### 3. 系统层指标

#### 主机资源指标
```yaml
# CPU使用率
node_cpu_seconds_total:
  description: "CPU使用时间"
  labels: [cpu, mode]
  type: counter

# 内存使用率
node_memory_MemAvailable_bytes:
  description: "可用内存"
  type: gauge

# 磁盘使用率
node_filesystem_avail_bytes:
  description: "可用磁盘空间"
  labels: [device, mountpoint]
  type: gauge

# 网络流量
node_network_receive_bytes_total:
  description: "网络接收字节数"
  labels: [device]
  type: counter
```

## 告警策略设计

### 告警级别定义

#### Critical（严重）- 🔴
- **响应时间**：5分钟内
- **影响范围**：系统完全不可用
- **通知方式**：电话 + 短信 + 即时通讯
- **升级机制**：15分钟无响应自动升级

#### Warning（警告）- 🟡
- **响应时间**：30分钟内
- **影响范围**：部分功能异常
- **通知方式**：邮件 + 即时通讯
- **升级机制**：2小时无响应升级

#### Info（信息）- 🔵
- **响应时间**：工作时间响应
- **影响范围**：性能下降或配置问题
- **通知方式**：邮件
- **升级机制**：不升级

### 核心告警规则

#### 1. 服务可用性告警

```yaml
# 服务不可用告警
- alert: VerificationServiceDown
  expr: up{job="knene-verification"} == 0
  for: 1m
  labels:
    severity: critical
    service: verification
  annotations:
    summary: "验证系统服务不可用"
    description: "验证系统服务已停止运行超过1分钟"
    runbook_url: "https://wiki.company.com/verification/troubleshooting"

# 端口不可访问告警
- alert: VerificationPortUnreachable
  expr: probe_success{instance="verification:8080"} == 0
  for: 2m
  labels:
    severity: critical
    service: verification
  annotations:
    summary: "验证系统端口不可访问"
    description: "验证系统8080端口无法访问"
```

#### 2. 性能告警

```yaml
# 验证执行失败率过高
- alert: HighVerificationFailureRate
  expr: |
    (
      rate(verification_executions_total{status="failed"}[5m]) /
      rate(verification_executions_total[5m])
    ) > 0.1
  for: 5m
  labels:
    severity: warning
    service: verification
  annotations:
    summary: "验证失败率过高"
    description: "过去5分钟内验证失败率为 {{ $value | humanizePercentage }}"

# 验证执行超时
- alert: VerificationExecutionTimeout
  expr: increase(verification_timeouts_total[5m]) > 0
  for: 2m
  labels:
    severity: warning
    service: verification
  annotations:
    summary: "检测到验证执行超时"
    description: "过去5分钟内有 {{ $value }} 次验证执行超时"

# 健康评分过低
- alert: LowHealthScore
  expr: avg(verification_health_score) < 70
  for: 10m
  labels:
    severity: warning
    service: verification
  annotations:
    summary: "数据库健康评分过低"
    description: "当前平均健康评分为 {{ $value }}，低于70分阈值"
```

#### 3. 资源使用告警

```yaml
# CPU使用率过高
- alert: HighCPUUsage
  expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
  for: 5m
  labels:
    severity: warning
    service: system
  annotations:
    summary: "CPU使用率过高"
    description: "实例 {{ $labels.instance }} CPU使用率为 {{ $value }}%"

# 内存使用率过高
- alert: HighMemoryUsage
  expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 85
  for: 5m
  labels:
    severity: warning
    service: system
  annotations:
    summary: "内存使用率过高"
    description: "实例 {{ $labels.instance }} 内存使用率为 {{ $value }}%"

# 磁盘空间不足
- alert: DiskSpaceLow
  expr: (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 < 15
  for: 5m
  labels:
    severity: critical
    service: system
  annotations:
    summary: "磁盘空间不足"
    description: "实例 {{ $labels.instance }} 根分区剩余空间为 {{ $value }}%"
```

#### 4. 数据库告警

```yaml
# 数据库连接失败
- alert: DatabaseConnectionFailed
  expr: database_connection_status{database="knene_verification"} == 0
  for: 2m
  labels:
    severity: critical
    service: database
  annotations:
    summary: "数据库连接失败"
    description: "无法连接到knene_verification数据库"

# 慢查询增多
- alert: SlowQueriesIncreasing
  expr: rate(mysql_global_status_slow_queries[5m]) > 0.1
  for: 5m
  labels:
    severity: warning
    service: database
  annotations:
    summary: "慢查询数量增加"
    description: "过去5分钟内慢查询增长率为 {{ $value }} queries/second"

# 数据库连接数过高
- alert: HighDatabaseConnections
  expr: mysql_global_status_threads_connected > 80
  for: 5m
  labels:
    severity: warning
    service: database
  annotations:
    summary: "数据库连接数过高"
    description: "当前数据库连接数为 {{ $value }}，超过阈值80"
```

### 智能告警规则

#### 趋势检测告警

```yaml
# 健康评分持续下降
- alert: HealthScoreDeclining
  expr: |
    (
      predict_linear(verification_health_score[6h], 3600) < 70
      and verification_health_score < 80
    )
  for: 10m
  labels:
    severity: warning
    service: verification
  annotations:
    summary: "健康评分持续下降"
    description: "基于当前趋势，预计1小时后健康评分将低于70分"

# 执行时间增长趋势
- alert: ExecutionTimeIncreasing
  expr: |
    (
      predict_linear(avg(verification_execution_duration_seconds)[2h], 3600) >
      avg(verification_execution_duration_seconds) * 1.5
    )
  for: 15m
  labels:
    severity: warning
    service: verification
  annotations:
    summary: "验证执行时间呈增长趋势"
    description: "预计1小时后平均执行时间将增长50%以上"
```

#### 异常检测告警

```yaml
# 异常失败率检测
- alert: AnomalousFailureRate
  expr: |
    (
      rate(verification_executions_total{status="failed"}[5m]) >
      (
        avg_over_time(rate(verification_executions_total{status="failed"}[5m])[24h:1h]) +
        2 * stddev_over_time(rate(verification_executions_total{status="failed"}[5m])[24h:1h])
      )
    )
  for: 5m
  labels:
    severity: warning
    service: verification
  annotations:
    summary: "检测到异常失败率"
    description: "当前失败率 {{ $value | humanizePercentage }} 超过正常范围"

# 执行量异常下降
- alert: UnusualLowExecutionVolume
  expr: |
    (
      rate(verification_executions_total[5m]) <
      (
        avg_over_time(rate(verification_executions_total[5m])[24h:1h]) -
        2 * stddev_over_time(rate(verification_executions_total[5m])[24h:1h])
      )
    )
  for: 10m
  labels:
    severity: info
    service: verification
  annotations:
    summary: "验证执行量异常下降"
    description: "当前执行量 {{ $value }} 低于正常水平"
```

## 仪表板设计

### 1. 系统概览仪表板

#### 核心指标展示
```json
{
  "dashboard": {
    "title": "验证系统概览",
    "panels": [
      {
        "title": "系统状态",
        "type": "stat",
        "targets": [
          {
            "expr": "up{job=\"knene-verification\"}",
            "legendFormat": "{{instance}}"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "mappings": [
              {"options": {"0": {"text": "DOWN", "color": "red"}}},
              {"options": {"1": {"text": "UP", "color": "green"}}}
            ]
          }
        }
      },
      {
        "title": "当前健康评分",
        "type": "stat",
        "targets": [
          {
            "expr": "avg(verification_health_score)",
            "legendFormat": "健康评分"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "thresholds": {
              "steps": [
                {"color": "red", "value": 0},
                {"color": "yellow", "value": 70},
                {"color": "green", "value": 80}
              ]
            }
          }
        }
      },
      {
        "title": "验证执行趋势",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(verification_executions_total[5m])",
            "legendFormat": "执行频率"
          },
          {
            "expr": "rate(verification_executions_total{status=\"failed\"}[5m])",
            "legendFormat": "失败频率"
          }
        ]
      },
      {
        "title": "执行时长分布",
        "type": "heatmap",
        "targets": [
          {
            "expr": "rate(verification_execution_duration_seconds_bucket[5m])",
            "legendFormat": "{{le}}"
          }
        ]
      }
    ]
  }
}
```

### 2. 性能监控仪表板

#### JVM性能监控
```json
{
  "panels": [
    {
      "title": "JVM内存使用",
      "type": "graph",
      "targets": [
        {
          "expr": "jvm_memory_used_bytes{area=\"heap\"}",
          "legendFormat": "堆内存使用"
        },
        {
          "expr": "jvm_memory_max_bytes{area=\"heap\"}",
          "legendFormat": "堆内存最大"
        }
      ]
    },
    {
      "title": "GC活动",
      "type": "graph",
      "targets": [
        {
          "expr": "rate(jvm_gc_collection_seconds_total[5m])",
          "legendFormat": "{{gc}}-{{action}}"
        }
      ]
    },
    {
      "title": "线程数量",
      "type": "graph",
      "targets": [
        {
          "expr": "jvm_threads_live_threads",
          "legendFormat": "活跃线程"
        },
        {
          "expr": "jvm_threads_daemon_threads",
          "legendFormat": "守护线程"
        }
      ]
    }
  ]
}
```

### 3. 业务监控仪表板

#### 验证结果分析
```json
{
  "panels": [
    {
      "title": "各模块健康评分",
      "type": "graph",
      "targets": [
        {
          "expr": "avg by (module) (verification_health_score)",
          "legendFormat": "{{module}}"
        }
      ]
    },
    {
      "title": "问题严重程度分布",
      "type": "piechart",
      "targets": [
        {
          "expr": "sum by (severity) (verification_issues_total)",
          "legendFormat": "{{severity}}"
        }
      ]
    },
    {
      "title": "验证执行成功率",
      "type": "stat",
      "targets": [
        {
          "expr": "rate(verification_executions_total{status=\"success\"}[5m]) / rate(verification_executions_total[5m]) * 100",
          "legendFormat": "成功率"
        }
      ]
    }
  ]
}
```

## 告警通知配置

### 1. AlertManager配置

```yaml
# alertmanager.yml
global:
  smtp_smarthost: 'smtp.company.com:587'
  smtp_from: 'alerts@company.com'
  smtp_auth_username: 'alerts@company.com'
  smtp_auth_password: 'password'

# 路由配置
route:
  group_by: ['alertname', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'default'
  routes:
    # 严重告警立即通知
    - match:
        severity: critical
      receiver: 'critical-alerts'
      group_wait: 0s
      repeat_interval: 5m

    # 警告级别告警
    - match:
        severity: warning
      receiver: 'warning-alerts'
      group_wait: 30s
      repeat_interval: 30m

    # 数据库告警
    - match:
        service: database
      receiver: 'database-alerts'

# 接收器配置
receivers:
  # 默认接收器
  - name: 'default'
    email_configs:
      - to: 'team@company.com'
        subject: '[{{ .Status | toUpper }}] {{ .GroupLabels.alertname }}'
        body: |
          {{ range .Alerts }}
          告警名称: {{ .Annotations.summary }}
          告警描述: {{ .Annotations.description }}
          开始时间: {{ .StartsAt }}
          {{ end }}

  # 严重告警接收器
  - name: 'critical-alerts'
    email_configs:
      - to: 'oncall@company.com'
        subject: '[CRITICAL] {{ .GroupLabels.alertname }}'
    webhook_configs:
      - url: 'https://api.pagerduty.com/incidents'
        send_resolved: true

  # 警告告警接收器
  - name: 'warning-alerts'
    email_configs:
      - to: 'dev-team@company.com'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
        channel: '#verification-alerts'
        title: 'Warning: {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'

  # 数据库告警接收器
  - name: 'database-alerts'
    email_configs:
      - to: 'dba-team@company.com'
    webhook_configs:
      - url: 'http://dingtalk-webhook:8080/webhook'
        send_resolved: true

# 抑制规则
inhibit_rules:
  # 如果服务不可用，抑制该服务的其他告警
  - source_match:
      alertname: 'VerificationServiceDown'
    target_match_re:
      service: 'verification'
    equal: ['instance']
```

### 2. 邮件模板配置

```html
<!-- email_template.html -->
<!DOCTYPE html>
<html>
<head>
    <title>{{ .Status | toUpper }} - 验证系统告警</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .critical { color: #d32f2f; }
        .warning { color: #f57c00; }
        .info { color: #1976d2; }
        .resolved { color: #388e3c; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h2 class="{{ .Status | toLower }}">
        {{ .Status | toUpper }} - 验证系统告警
    </h2>

    <p><strong>触发时间:</strong> {{ .Alerts.FiredAt }}</p>
    <p><strong>告警数量:</strong> {{ len .Alerts }}</p>

    <table>
        <tr>
            <th>告警名称</th>
            <th>严重程度</th>
            <th>描述</th>
            <th>开始时间</th>
        </tr>
        {{ range .Alerts }}
        <tr>
            <td>{{ .Labels.alertname }}</td>
            <td class="{{ .Labels.severity }}">{{ .Labels.severity | toUpper }}</td>
            <td>{{ .Annotations.description }}</td>
            <td>{{ .StartsAt }}</td>
        </tr>
        {{ end }}
    </table>

    {{ if .GroupLabels.runbook_url }}
    <p><strong>操作手册:</strong> <a href="{{ .GroupLabels.runbook_url }}">点击查看</a></p>
    {{ end }}

    <hr>
    <p><small>此邮件由KNENE验证系统自动发送</small></p>
</body>
</html>
```

### 3. Slack通知配置

```yaml
# slack_config.yml
slack_configs:
  - api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
    channel: '#verification-alerts'
    title: '验证系统告警: {{ .GroupLabels.alertname }}'
    text: |
      {{ range .Alerts }}
      *告警名称*: {{ .Labels.alertname }}
      *严重程度*: {{ .Labels.severity | toUpper }}
      *描述*: {{ .Annotations.description }}
      *开始时间*: {{ .StartsAt }}
      {{ end }}
    send_resolved: true
    icon_emoji: ':warning:'
    username: 'KNENE Verification Bot'
```

## 监控最佳实践

### 1. 指标设计原则

#### GOLD指标体系
- **Latency（延迟）**：请求响应时间
- **Errors（错误率）**：请求失败比例
- **Availability（可用性）**：服务可用时间
- **Durability（持久性）**：数据持久性保障

#### USE指标体系
- **Utilization（使用率）**：资源使用百分比
- **Saturation（饱和度）**：资源繁忙程度
- **Errors（错误）**：错误计数

### 2. 告警设计原则

#### 告警黄金法则
1. **可行动性**：每个告警都应该有明确的行动
2. **可理解性**：告警信息应该清晰易懂
3. **及时性**：在问题恶化前及时通知
4. **准确性**：减少误报和漏报

#### 告警分级策略
```yaml
# 告警分级矩阵
severity_matrix:
  critical:
    impact: "业务完全中断"
    urgency: "立即处理"
    notification: ["phone", "sms", "slack", "email"]
    response_time: "5分钟"

  warning:
    impact: "部分功能异常"
    urgency: "工作时间处理"
    notification: ["slack", "email"]
    response_time: "30分钟"

  info:
    impact: "性能下降"
    urgency: "可延后处理"
    notification: ["email"]
    response_time: "4小时"
```

### 3. 仪表板设计原则

#### 仪表板分层设计
1. **战略层仪表板**：高层领导关注的核心指标
2. **战术层仪表板**：团队关注的性能和可用性指标
3. **操作层仪表板**：运维人员关注的详细技术指标

#### 仪表板设计最佳实践
- 使用统一的颜色规范
- 合理的图表布局和密度
- 清晰的标题和标签
- 适当的时间范围选择
- 关键指标的突出显示

## 监控系统部署

### 1. Prometheus部署配置

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules/*.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  # 验证系统监控
  - job_name: 'knene-verification'
    static_configs:
      - targets: ['verification:8080']
    metrics_path: '/actuator/prometheus'
    scrape_interval: 30s

  # 主机监控
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  # MySQL监控
  - job_name: 'mysql-exporter'
    static_configs:
      - targets: ['mysql-exporter:9104']
```

### 2. Grafana部署配置

```yaml
# grafana-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      containers:
      - name: grafana
        image: grafana/grafana:latest
        ports:
        - containerPort: 3000
        env:
        - name: GF_SECURITY_ADMIN_PASSWORD
          value: "admin_password"
        volumeMounts:
        - name: grafana-storage
          mountPath: /var/lib/grafana
        - name: grafana-config
          mountPath: /etc/grafana/provisioning
      volumes:
      - name: grafana-storage
        persistentVolumeClaim:
          claimName: grafana-pvc
      - name: grafana-config
        configMap:
          name: grafana-config
```

### 3. Docker Compose部署

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - ./rules:/etc/prometheus/rules
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'

  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager_data:/alertmanager

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'

volumes:
  prometheus_data:
  alertmanager_data:
  grafana_data:
```

## 总结

数据库验证系统的监控告警体系是保障系统稳定运行的重要组成部分。通过建立完善的监控架构、设计合理的告警策略、构建直观的仪表板，可以：

1. **及时发现问题**：通过实时监控和智能告警，在问题影响业务前及时发现
2. **快速定位故障**：通过丰富的指标信息，快速定位问题根因
3. **优化系统性能**：通过性能趋势分析，持续优化系统性能
4. **提升运维效率**：通过自动化告警和标准化流程，提升运维效率

建议定期回顾和优化监控告警配置，确保监控体系能够适应业务发展和技术变化，为系统稳定运行提供有力保障。