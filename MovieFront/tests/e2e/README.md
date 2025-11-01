# E2E测试说明

## 概述

本目录包含VIP数据流的端到端（E2E）测试，使用Playwright测试框架。这些测试验证从首页卡片到详情页的完整用户流程，确保VIP标签和样式在整个链路中保持一致。

## 测试覆盖范围

### 1. 合集完整链路测试 (12.1)
- ✅ 首页合集卡片显示VIP标签
- ✅ 合集影片列表页所有影片显示VIP标签
- ✅ 影片详情页显示VIP专属样式（金色渐变按钮和VIP标签）
- ✅ 整个链路VIP标识的一致性

### 2. 写真完整链路测试 (12.2)
- ✅ 首页写真卡片显示VIP标签
- ✅ 写真列表页所有写真显示VIP标签
- ✅ 写真详情页显示VIP专属样式
- ✅ 整个链路VIP标识的一致性

### 3. 普通影片链路测试 (12.3)
- ✅ 首页普通影片卡片不显示VIP标签
- ✅ 普通影片详情页显示绿色下载按钮
- ✅ 普通影片详情页资源信息标题后无VIP标签
- ✅ VIP影片和普通影片的样式差异

### 4. 混合内容列表测试 (12.4)
- ✅ 最新更新页面合集和写真显示VIP标签
- ✅ 热门页面标签显示规则一致
- ✅ 从混合列表进入合集影片列表的VIP继承
- ✅ 标签显示保持一致

## 运行测试

### 前提条件

1. 确保已安装依赖：
```bash
pnpm install
```

2. 安装Playwright浏览器：
```bash
pnpm exec playwright install
```

### 运行所有E2E测试

```bash
pnpm test:e2e
```

### 运行特定测试文件

```bash
pnpm exec playwright test vip-data-flow.spec.ts
```

### 运行特定测试用例

```bash
pnpm exec playwright test -g "应该在首页显示合集卡片的VIP标签"
```

### 调试模式运行

```bash
pnpm exec playwright test --debug
```

### 查看测试报告

```bash
pnpm exec playwright show-report
```

## 测试数据标识符

为了使E2E测试能够准确定位元素，需要在组件中添加以下data-testid属性：

### 模块标识符
- `data-testid="collections-section"` - 合集模块
- `data-testid="photos-section"` - 写真模块
- `data-testid="latest-updates-section"` - 最新更新模块
- `data-testid="hot-section"` - 热门模块

### 卡片标识符
- `data-testid="collection-card"` - 合集卡片
- `data-testid="photo-card"` - 写真卡片
- `data-testid="movie-card"` - 影片卡片

### 标签标识符
- `data-testid="vip-badge"` - VIP标签
- `data-testid="new-badge"` - NEW标签
- `data-testid="quality-badge"` - 质量标签
- `data-testid="rating-badge"` - 评分标签

### 详情页标识符
- `data-testid="vip-download-button"` - VIP专属下载按钮（金色渐变）
- `data-testid="download-button"` - 普通下载按钮（绿色）
- `data-testid="resource-vip-badge"` - 资源信息VIP标签

### 其他标识符
- `data-testid="more-button"` - 更多按钮
- `data-testid="collection-title"` - 合集标题

## 注意事项

1. **测试环境**：E2E测试需要实际运行应用程序，确保开发服务器正在运行或配置了webServer选项。

2. **数据一致性**：测试依赖于MockDataService生成的数据，确保Mock数据的业务规则与测试断言一致。

3. **异步操作**：所有页面导航和元素查找都使用了适当的等待策略，确保测试的稳定性。

4. **浏览器兼容性**：测试配置为在Chromium、Firefox和WebKit上运行，确保跨浏览器兼容性。

5. **测试隔离**：每个测试用例都是独立的，使用beforeEach钩子重置状态。

## 故障排查

### 测试失败

1. 检查应用程序是否正常运行
2. 验证data-testid属性是否正确添加到组件中
3. 检查Mock数据是否按预期生成
4. 查看测试截图和trace文件

### 元素未找到

1. 确认组件已添加正确的data-testid属性
2. 检查元素是否在视口内
3. 增加等待时间或使用更具体的选择器

### 样式验证失败

1. 检查CSS类名是否正确
2. 验证样式是否已应用
3. 使用浏览器开发工具检查实际样式

## 持续集成

E2E测试可以集成到CI/CD流程中：

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm exec playwright install --with-deps
      - run: pnpm test:e2e
```

## 扩展测试

要添加新的E2E测试：

1. 在`tests/e2e`目录下创建新的`.spec.ts`文件
2. 使用Playwright的API编写测试用例
3. 确保添加必要的data-testid属性
4. 运行测试验证功能
5. 更新本README文档

## 参考资料

- [Playwright文档](https://playwright.dev/)
- [测试最佳实践](https://playwright.dev/docs/best-practices)
- [选择器指南](https://playwright.dev/docs/selectors)
