# 相对路径导入检查脚本

## 概述

本项目提供了两个精细化的脚本，用于检查 MovieFront 项目中的相对路径导入，确保代码遵循 DDD 架构规范，使用 @ 别名导入而非相对路径。

## 脚本说明

### 1. check-relative-imports-simple.js（推荐）

纯 Node.js 实现的简化版本，无需额外依赖，功能完整。

**特点：**
- 不依赖 glob 包，纯 Node.js 实现
- 递归遍历所有文件
- 精细化检查各种导入语句类型
- 详细的错误报告和修复建议

### 2. check-relative-imports.js（完整版）

需要 glob 包的完整版本，性能更好。

**特点：**
- 使用 glob 包进行高效文件匹配
- 更多的排除规则和检查选项
- 支持更复杂的文件过滤逻辑

### 3. fix-relative-imports.cjs（自动修复）

自动修复相对路径导入的脚本，可以将大部分相对路径导入自动替换为@别名导入。

**特点：**
- 自动识别并替换相对路径导入
- 智能路径映射和别名生成
- 安全的文件修改机制
- 详细的修复报告

## 检测能力对比

经过与ESLint的对比测试，优化后的脚本具备更强的检测能力：

| 检测工具 | 检测问题数 | @/格式导入 | 相对路径导入 | 检测覆盖率 |
|---------|-----------|-----------|-------------|-----------|
| ESLint | 51个 | 4个 | 47个 | 基准 |
| 优化前脚本 | 18个 | 0个 | 18个 | 35% |
| **优化后脚本** | **57个** | **5个** | **52个** | **112%** |

### 🔍 新增检测能力

#### 1. @/格式导入检测
- 检测所有@/格式的导入
- 提供标准@别名的修复建议
- 例如：`@/types/movie.types` → `@types/movie.types`

#### 2. 更严格的相对路径检测
- 更精确的同目录组件导入规则
- 减少误报，提高检测准确性
- 支持更多导入语句格式

#### 3. 全面的导入语句支持
- ES6 import/export语句
- 动态import()语句
- require()语句
- export from语句
- 副作用导入语句

## 检查规则

### 📁 排除的文件类型

1. **配置文件：**
   - vite.env.*.ts
   - tsconfig.*.json
   - eslint.config.*.js
   - prettier.config.*.js
   - tailwind.config.*.js
   - postcss.config.*.js
   - vitest.config.*.js
   - 所有 *.config.*.js 文件

2. **样式文件：**
   - *.css, *.scss, *.sass, *.less, *.styl

3. **类型声明文件：**
   - *.d.ts

4. **Mock和测试数据文件：**
   - /mocks/ 目录
   - __mocks__ 目录
   - mockData.* 文件
   - *.mock.* 文件
   - /fixtures/ 目录
   - /test-data/ 目录

### ✅ 允许相对路径的情况

1. **index.ts 文件中的 export 语句**
   ```typescript
   // ✅ 允许
   export * from './Button'
   export { default as Card } from './Card'

   // ❌ 不允许
   import { Something } from './types'
   ```

2. **测试文件中的相对导入**
   ```typescript
   // ✅ 允许
   // in Component.test.ts
   import { renderComponent } from './test-utils'
   import mockData from './mockData'
   ```

3. **类型导入的特殊情况**
   ```typescript
   // ✅ 允许（但有更好的替代方案）
   import type { LocalType } from './types'

   // ❌ 推荐使用
   import type { LocalType } from '@types-local'
   ```

4. **静态资源导入**
   ```typescript
   // ✅ 允许
   import logo from './assets/logo.png'
   import styles from './styles.module.css'
   ```

### ❌ 禁止的相对路径

1. **业务代码中的所有相对路径导入**
   ```typescript
   // ❌ 禁止
   import { Button } from '../components/atoms/Button'
   import { UserService } from '../../services/UserService'
   import { API_ENDPOINTS } from '../../../config/api'

   // ✅ 正确
   import { Button } from '@components/atoms'
   import { UserService } from '@domain/services'
   import { API_ENDPOINTS } from '@infrastructure/api'
   ```

## 使用方法

### 通过 npm 脚本运行

```bash
# 运行简化版本（推荐）
npm run check:imports

# 运行完整版本
npm run check:imports:full

# 自动修复相对路径导入
npm run fix:imports
```

### 直接运行脚本

```bash
# 运行简化版本
node scripts/check-relative-imports-simple.cjs

# 运行完整版本
node scripts/check-relative-imports.js

# 自动修复
node scripts/fix-relative-imports.cjs
```

## 检查的导入语句类型

脚本能够识别以下导入语句类型：

1. **ES6 import 语句**
   ```typescript
   import something from './path'
   import { named } from './path'
   import * as alias from './path'
   import defaultExport, { named } from './path'
   ```

2. **副作用导入**
   ```typescript
   import './styles.css'
   import './polyfills'
   ```

3. **动态导入**
   ```typescript
   const module = await import('./lazy-module')
   ```

4. **require 语句**
   ```typescript
   const something = require('./path')
   ```

5. **export from 语句**
   ```typescript
   export * from './path'
   export { named } from './path'
   ```

## 输出报告

脚本会生成详细的检查报告，包括：

### 📊 统计信息
- 总问题数量
- 涉及文件数量
- 问题类型分布

### 📋 问题详情
每个问题包含：
- 文件路径和行号
- 具体的导入语句
- 违反规则的原因
- 修复建议（推荐的@别名）

### 🔧 修复建议
脚本会为每个问题生成具体的修复建议：
```typescript
// 当前: import { Button } from '../atoms/Button'
// 建议: 使用 "@components/atoms"
```

## 集成到开发流程

### 1. Git Hooks 集成

可以将检查脚本集成到 Git hooks 中：

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run check:imports && lint-staged"
    }
  }
}
```

### 2. CI/CD 集成

在 CI/CD 流程中添加检查：

```yaml
# .github/workflows/ci.yml
- name: Check relative imports
  run: npm run check:imports
```

### 3. VS Code 任务

添加 VS Code 任务来快速运行检查：

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Check Relative Imports",
      "type": "npm",
      "script": "check:imports",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
```

## 配置选项

如果需要自定义检查规则，可以修改脚本中的以下配置：

```javascript
// 添加更多排除模式
this.excludedPatterns = [
  // 现有模式...
  /your-custom-pattern/
];

// 添加允许相对路径的模式
this.allowedRelativePatterns = [
  // 现有模式...
  /^your-allowed-pattern\.(ts|tsx)$/
];
```

## 常见问题

### Q: 为什么 index 文件中的 export 语句可以使用相对路径？
A: index 文件的主要作用是重新导出模块内容，使用相对路径可以避免循环依赖，并且符合 Node.js 的模块组织最佳实践。

### Q: 测试文件为什么可以使用相对路径？
A: 测试文件通常需要导入同目录下的测试工具和 mock 数据，这些文件不适合通过 @ 别名导出，因此允许相对路径导入。

### Q: 如何处理复杂的路径别名？
A: 可以在 vite.config.ts 中配置更多的路径别名，然后脚本会自动生成相应的建议。

### Q: 脚本误报了怎么办？
A: 可以将误报的文件或模式添加到排除规则中，或者检查是否确实需要使用相对路径的特殊情况。

## 自动修复脚本使用说明

### ⚠️ 使用前准备

1. **备份代码**: 运行自动修复前，建议先提交代码或创建备份
2. **先运行检查**: 使用 `npm run check:imports` 了解需要修复的问题
3. **理解修复规则**: 确保了解脚本的修复逻辑

### 🔧 修复功能

自动修复脚本能够处理以下情况：

```typescript
// ❌ 修复前
import { Button } from '../atoms/Button'
import { UserService } from '../../services/UserService'
import { API_ENDPOINTS } from '../../../config/api'

// ✅ 修复后
import { Button } from '@components/atoms'
import { UserService } from '@domain/services'
import { API_ENDPOINTS } from '@infrastructure/api'
```

### 🛡️ 安全机制

- **跳过合理导入**: 不会修复CSS、图片资源、同目录types文件等合理的相对导入
- **确认机制**: 运行前需要用户确认，避免意外修改
- **详细报告**: 显示修复的文件数量和可能遇到的错误

### 📊 修复后验证

修复完成后，建议运行以下命令验证：

```bash
# 1. 验证相对路径导入已修复
npm run check:imports

# 2. 检查代码规范
npm run lint

# 3. 类型检查
npm run type-check

# 4. 运行测试
npm test
```

## 维护说明

- 脚本会根据项目结构自动生成 @ 别名建议
- 如果修改了 vite.config.ts 中的别名配置，脚本会自动适配
- 建议定期运行检查，确保代码规范的一致性
- 可以根据项目需要调整检查规则的严格程度

### 扩展路径映射

如果项目有特殊的路径别名需求，可以在 `fix-relative-imports.cjs` 中的 `pathMappings` 对象添加新的映射：

```javascript
this.pathMappings = {
  // 现有映射...
  'your/special/path': '@your-special-alias',
}
```