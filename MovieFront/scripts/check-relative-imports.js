#!/usr/bin/env node

/**
 * @fileoverview 精细化相对路径导入检查脚本
 * @description 检查src目录下所有文件的相对路径导入，确保使用@别名导入
 * @author Claude
 * @since 1.0.0
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class RelativeImportChecker {
  constructor() {
    this.issues = [];
    this.excludedPatterns = [
      // 配置文件
      /\/vite\.env\.(d\.ts|ts|js)$/,
      /\/tsconfig\.(json|node\.json)$/,
      /\/eslint\.config\.(js|ts|mjs)$/,
      /\/prettier\.config\.(js|ts)$/,
      /\/tailwind\.config\.(js|ts)$/,
      /\/postcss\.config\.(js|ts)$/,
      /\/vitest\.config\.(js|ts)$/,
      /\.config\.(js|ts|mjs)$/,

      // CSS文件
      /\.css$/,
      /\.scss$/,
      /\.sass$/,
      /\.less$/,
      /\.styl$/,

      // 类型声明文件
      /\.d\.ts$/,

      // 测试文件中的mock数据
      /\/mocks\//,
      /__mocks__/,

      // 第三方类型定义
      /node_modules/,
    ];

    this.allowedRelativePatterns = [
      // index.ts文件中的相对路径导出
      /^index\.(ts|tsx|js|jsx)$/,

      // 同级文件的相对导入（仅限原子级别组件）
      /^\.\//,

      // 测试文件中的相对导入
      /\.test\.(ts|tsx|js|jsx)$/,
      /\.spec\.(ts|tsx|js|jsx)$/,
    ];

    this.importPatterns = [
      // ES6 import
      /import\s+(?:.*?\s+from\s+)?['"`]([^'"`]+)['"`]/g,
      // Dynamic import
      /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
      // require
      /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
    ];

    this.nodeModulesPatterns = [
      /^@?\w[\w\-]*\//,  // scoped packages or normal packages
      /^[a-z][a-z0-9\-]*$/, // single package names
    ];
  }

  /**
   * 检查文件是否应该被排除
   */
  shouldExcludeFile(filePath) {
    const normalizedPath = path.normalize(filePath);

    return this.excludedPatterns.some(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(normalizedPath);
      }
      return normalizedPath.includes(pattern);
    });
  }

  /**
   * 检查文件是否为index文件
   */
  isIndexFile(filePath) {
    const fileName = path.basename(filePath);
    return this.allowedRelativePatterns[0].test(fileName);
  }

  /**
   * 检查文件是否为测试文件
   */
  isTestFile(filePath) {
    const fileName = path.basename(filePath);
    return this.allowedRelativePatterns[2].test(fileName);
  }

  /**
   * 检查是否为Node模块或第三方包
   */
  isNodeModule(importPath) {
    return this.nodeModulesPatterns.some(pattern => pattern.test(importPath));
  }

  /**
   * 检查是否为相对路径
   */
  isRelativePath(importPath) {
    return importPath.startsWith('./') || importPath.startsWith('../');
  }

  /**
   * 检查是否为合法的相对路径导入
   */
  isAllowedRelativeImport(filePath, importPath, lineContent) {
    // index文件中的相对导出是允许的
    if (this.isIndexFile(filePath)) {
      // 检查是否为export语句
      if (lineContent.includes('export') && !lineContent.includes('import')) {
        return true;
      }
    }

    // 测试文件中的相对导入是允许的
    if (this.isTestFile(filePath)) {
      return true;
    }

    // 类型导入的相对路径在特定情况下允许
    if (lineContent.includes('import type') && importPath.startsWith('./types/')) {
      return true;
    }

    return false;
  }

  /**
   * 检查单个文件的导入
   */
  checkFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, lineNumber) => {
        this.importPatterns.forEach(pattern => {
          let match;
          while ((match = pattern.exec(line)) !== null) {
            const importPath = match[1];

            // 跳过Node模块
            if (this.isNodeModule(importPath)) {
              continue;
            }

            // 检查是否为相对路径
            if (this.isRelativePath(importPath)) {
              // 检查是否为允许的相对导入
              if (!this.isAllowedRelativeImport(filePath, importPath, line)) {
                this.issues.push({
                  file: filePath,
                  line: lineNumber + 1,
                  column: match.index + 1,
                  importPath,
                  content: line.trim(),
                  reason: this.getReason(filePath, importPath, line)
                });
              }
            }
          }
        });
      });
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error.message);
    }
  }

  /**
   * 获取违反规则的原因
   */
  getReason(filePath, importPath, lineContent) {
    if (this.isIndexFile(filePath)) {
      return 'index文件中的import语句应使用@别名，只有export语句可以使用相对路径';
    }

    if (lineContent.includes('import type') && importPath.startsWith('./types/')) {
      return '类型导入应使用@types别名';
    }

    return '业务代码禁止使用相对路径导入，请使用@别名';
  }

  /**
   * 生成建议的@别名
   */
  generateSuggestion(filePath, importPath) {
    const fileDir = path.dirname(filePath);
    const absolutePath = path.resolve(fileDir, importPath);
    const srcIndex = absolutePath.indexOf('/src/');

    if (srcIndex === -1) {
      return null;
    }

    const relativeToSrc = absolutePath.substring(srcIndex + 5); // 去掉 '/src'

    // 移除文件扩展名
    const withoutExtension = relativeToSrc.replace(/\.(ts|tsx|js|jsx)$/, '');

    // 处理index文件
    if (path.basename(withoutExtension) === 'index') {
      return `@${path.dirname(withoutExtension).replace(/\\/g, '/')}`;
    }

    return `@${withoutExtension.replace(/\\/g, '/')}`;
  }

  /**
   * 检查目录中的所有文件
   */
  checkDirectory(directory) {
    const pattern = path.join(directory, '**/*.{ts,tsx,js,jsx}').replace(/\\/g, '/');
    const files = glob.sync(pattern);

    console.log(`\n🔍 检查目录: ${directory}`);
    console.log(`📁 找到 ${files.length} 个文件\n`);

    files.forEach(file => {
      if (!this.shouldExcludeFile(file)) {
        this.checkFile(file);
      }
    });

    return this.issues;
  }

  /**
   * 生成报告
   */
  generateReport() {
    if (this.issues.length === 0) {
      console.log('✅ 恭喜！没有发现相对路径导入违规问题\n');
      return;
    }

    console.log(`❌ 发现 ${this.issues.length} 个相对路径导入违规问题:\n`);

    // 按文件分组显示
    const issuesByFile = {};
    this.issues.forEach(issue => {
      if (!issuesByFile[issue.file]) {
        issuesByFile[issue.file] = [];
      }
      issuesByFile[issue.file].push(issue);
    });

    Object.keys(issuesByFile).forEach(filePath => {
      console.log(`📄 ${filePath}`);
      console.log('─'.repeat(80));

      issuesByFile[filePath].forEach(issue => {
        const suggestion = this.generateSuggestion(issue.file, issue.importPath);
        console.log(`  📍 第${issue.line}行，第${issue.column}列:`);
        console.log(`    当前: ${issue.content}`);
        console.log(`    原因: ${issue.reason}`);
        if (suggestion) {
          console.log(`    建议: 使用 "${suggestion}"`);
        }
        console.log('');
      });

      console.log('');
    });

    // 生成修复建议
    console.log('🔧 修复建议:');
    console.log('─'.repeat(50));
    console.log('1. 将所有相对路径导入改为@别名导入');
    console.log('2. 确保vite.config.ts中配置了正确的路径别名');
    console.log('3. 运行 npm run lint 检查其他代码规范问题');
    console.log('4. 提交前运行此脚本确保没有相对路径导入\n');
  }

  /**
   * 退出并返回状态码
   */
  exit() {
    if (this.issues.length > 0) {
      console.log(`💥 检查失败，发现 ${this.issues.length} 个问题\n`);
      process.exit(1);
    } else {
      console.log('🎉 检查通过！\n');
      process.exit(0);
    }
  }
}

// 主函数
function main() {
  const checker = new RelativeImportChecker();

  console.log('🚀 开始检查相对路径导入...\n');

  const srcDirectory = path.join(process.cwd(), 'src');

  if (!fs.existsSync(srcDirectory)) {
    console.error('❌ 错误: 找不到src目录');
    process.exit(1);
  }

  checker.checkDirectory(srcDirectory);
  checker.generateReport();
  checker.exit();
}

// 处理命令行参数
if (require.main === module) {
  main();
}

module.exports = RelativeImportChecker;