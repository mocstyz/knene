#!/usr/bin/env node

/**
 * @fileoverview 精细化相对路径导入检查脚本（纯Node.js版本）
 * @description 检查src目录下所有文件的相对路径导入，确保使用@别名导入
 * @author Claude
 * @since 1.0.0
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

class RelativeImportCheckerSimple {
  constructor() {
    this.issues = [];
    this.checkedFiles = 0;
    this.skippedFiles = 0;

    // 文件排除规则
    this.excludedPatterns = [
      // 配置文件
      /vite\.env\.(d\.ts|ts|js)$/,
      /tsconfig\.(json|node\.json)$/,
      /eslint\.config\.(js|ts|mjs)$/,
      /prettier\.config\.(js|ts)$/,
      /tailwind\.config\.(js|ts)$/,
      /postcss\.config\.(js|ts)$/,
      /vitest\.config\.(js|ts)$/,
      /\.config\.(js|ts|mjs)$/,

      // CSS和样式文件
      /\.css$/,
      /\.scss$/,
      /\.sass$/,
      /\.less$/,
      /\.styl$/,

      // 类型声明文件
      /\.d\.ts$/,

      // Mock文件
      /\/mocks\//,
      /__mocks__/,
      /mockData\./,
      /\.mock\./,

      // 测试数据文件
      /\/fixtures\//,
      /\/test-data\//,
    ];

    // 允许相对路径的文件类型
    this.allowedRelativePatterns = [
      /^index\.(ts|tsx|js|jsx)$/,  // index文件
      /\.test\.(ts|tsx|js|jsx)$/,   // 测试文件
      /\.spec\.(ts|tsx|js|jsx)$/,   // 规格测试文件
    ];

    // 导入语句匹配模式
    this.importPatterns = [
      // ES6 import - various forms
      // import something from './path'
      /import\s+.*?from\s+['"`]([^'"`]+)['"`]/g,
      // import './path' (side effects)
      /import\s+['"`]([^'"`]+)['"`]/g,
      // Dynamic import
      /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
      // require
      /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
      // export from
      /export\s+.*?from\s+['"`]([^'"`]+)['"`]/g,
    ];

    // Node模块和第三方包识别
    this.nodeModulesPatterns = [
      /^@?\w[\w\-]*\//,     // @babel/core, lodash/, react/
      /^[a-z][a-z0-9\-]*$/,  // react, lodash, moment
      /^[a-z][a-z0-9\-]*\/.*/, // lodash/debounce
    ];
  }

  /**
   * 递归获取目录下所有文件
   */
  getAllFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
    let files = [];

    try {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // 递归获取子目录文件
          files = files.concat(this.getAllFiles(fullPath, extensions));
        } else if (stat.isFile()) {
          // 检查文件扩展名
          const ext = path.extname(item);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(`警告: 无法读取目录 ${dir}: ${error.message}`);
    }

    return files;
  }

  /**
   * 检查文件是否应该被排除
   */
  shouldExcludeFile(filePath) {
    const normalizedPath = path.normalize(filePath);

    return this.excludedPatterns.some(pattern => pattern.test(normalizedPath));
  }

  /**
   * 检查文件是否为允许相对路径的文件类型
   */
  isAllowedRelativeFile(filePath) {
    const fileName = path.basename(filePath);
    return this.allowedRelativePatterns.some(pattern => pattern.test(fileName));
  }

  /**
   * 检查是否为Node模块或第三方包
   */
  isNodeModule(importPath) {
    // 排除绝对路径和以 . 开头的路径
    if (path.isAbsolute(importPath) || importPath.startsWith('.')) {
      return false;
    }

    return this.nodeModulesPatterns.some(pattern => pattern.test(importPath));
  }

  /**
   * 检查是否为相对路径
   */
  isRelativePath(importPath) {
    return importPath.startsWith('./') || importPath.startsWith('../');
  }

  /**
   * 检查是否为@/格式导入
   */
  isAtSlashFormat(importPath) {
    return importPath.startsWith('@/');
  }

  /**
   * 检查是否为合法的相对路径导入
   */
  isAllowedRelativeImport(filePath, importPath, lineContent) {
    // index文件中的export语句是允许的
    if (path.basename(filePath).startsWith('index.')) {
      if (lineContent.includes('export') && !lineContent.includes('import')) {
        return true;
      }
    }

    // 测试文件中的相对导入是允许的
    if (this.isAllowedRelativeFile(filePath)) {
      return true;
    }

    // 特殊情况：同目录下的types文件导入（仅限类型导入）
    if (importPath.startsWith('./types/') && lineContent.includes('import type')) {
      return true;
    }

    // 特殊情况：同目录类型文件导入
    if (importPath.match(/^\.\/[^\/]+\.types\./) && lineContent.includes('import type')) {
      return true;
    }

    // 特殊情况：CSS文件导入（样式文件）
    if (importPath.endsWith('.css')) {
      return true;
    }

    // 特殊情况：图片资源或静态文件
    if (/\.(png|jpg|jpeg|gif|svg|ico|webp|mp4|webm|pdf|woff|woff2|ttf|eot)$/.test(importPath)) {
      return true;
    }

    // 特殊情况：同目录下的组件子模块（更严格的规则）
    const fileName = path.basename(filePath);
    const fileDir = path.dirname(filePath);
    const fileDirName = path.basename(fileDir);

    // 如果是组件目录的主要文件，允许导入同目录的子组件（仅限特定情况）
    if (importPath.startsWith('./') &&
        !importPath.includes('../') &&
        !fileName.startsWith('index.')) {
      const importFileName = path.basename(importPath);

      // 只允许导入完全匹配目录名的组件文件
      // 例如：Pagination目录允许导入PaginationButton, PaginationEllipsis等
      if (importFileName === `${fileDirName}Button.tsx` ||
          importFileName === `${fileDirName}Ellipsis.tsx` ||
          importFileName === `${fileDirName}Info.tsx` ||
          importFileName === `${fileDirName}Base.tsx` ||
          importFileName === `${fileDirName}Text.tsx` ||
          importFileName === `${fileDirName}Card.tsx` ||
          importFileName === `${fileDirName}Circle.tsx` ||
          importFileName === `${fileDirName}Avatar.tsx` ||
          importFileName === `${fileDirName}Comments.tsx` ||
          importFileName === `${fileDirName}SectionHeader.tsx` ||
          importFileName === `${fileDirName}List.tsx` ||
          importFileName === `${fileDirName}Item.tsx`) {
        return true;
      }

      // 允许导入同目录的样式文件
      if (importFileName.endsWith('.css') ||
          importFileName.endsWith('.scss') ||
          importFileName.endsWith('.module.css')) {
        return true;
      }
    }

    return false;
  }

  /**
   * 检查是否为合法的@/格式导入
   */
  isAllowedAtSlashImport(filePath, importPath, lineContent) {
    // 测试文件中的@/导入是允许的（虽然不推荐）
    if (this.isAllowedRelativeFile(filePath)) {
      return true;
    }

    // 目前项目中不允许任何@/格式的导入
    return false;
  }

  /**
   * 检查指定行或前一行是否有ESLint忽略注释
   */
  hasEslintDisableComment(lines, currentLineIndex) {
    // 检查当前行
    const currentLine = lines[currentLineIndex] || '';
    if (currentLine.includes('eslint-disable') || currentLine.includes('eslint-disable-next-line')) {
      return true;
    }

    // 检查前一行
    const previousLine = lines[currentLineIndex - 1] || '';
    if (previousLine.includes('eslint-disable-next-line')) {
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
        // 跳过注释行
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
          return;
        }

        this.importPatterns.forEach(pattern => {
          // 重置正则表达式的lastIndex
          pattern.lastIndex = 0;

          let match;
          while ((match = pattern.exec(line)) !== null) {
            const importPath = match[1];

            // 跳过空路径
            if (!importPath || importPath.trim() === '') {
              continue;
            }

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
                  reason: this.getReason(filePath, importPath, line),
                  suggestion: this.generateSuggestion(filePath, importPath)
                });
              }
            }
            // 检查是否为@/格式导入
            else if (this.isAtSlashFormat(importPath)) {
              // 检查是否为允许的@/导入
              if (!this.isAllowedAtSlashImport(filePath, importPath, line)) {
                // 跳过有ESLint忽略注释的导入
                const hasEslintDisable = this.hasEslintDisableComment(lines, lineNumber);
                if (hasEslintDisable) {
                  continue;
                }

                this.issues.push({
                  file: filePath,
                  line: lineNumber + 1,
                  column: match.index + 1,
                  importPath,
                  content: line.trim(),
                  reason: this.getReasonForAtSlash(filePath, importPath, line),
                  suggestion: this.generateSuggestionForAtSlash(importPath)
                });
              }
            }
          }
        });
      });

      this.checkedFiles++;
    } catch (error) {
      console.error(`错误: 无法读取文件 ${filePath}: ${error.message}`);
    }
  }

  /**
   * 获取违反规则的原因
   */
  getReason(filePath, importPath, lineContent) {
    const fileName = path.basename(filePath);

    if (fileName.startsWith('index.')) {
      return 'index文件中的import语句应使用@别名，只有export语句可以使用相对路径';
    }

    if (this.isAllowedRelativeFile(filePath)) {
      return '测试文件应该避免使用相对路径，推荐使用@别名';
    }

    if (lineContent.includes('import type') && importPath.startsWith('./types/')) {
      return '类型导入应使用@types别名，而非相对路径';
    }

    return '业务代码禁止使用相对路径导入，请使用@别名导入';
  }

  /**
   * 获取@/格式导入违规的原因
   */
  getReasonForAtSlash(filePath, importPath, lineContent) {
    return '禁止使用@/格式导入，请使用标准@别名格式';
  }

  /**
   * 生成建议的@别名
   */
  generateSuggestion(filePath, importPath) {
    try {
      const fileDir = path.dirname(filePath);
      const absolutePath = path.resolve(fileDir, importPath);
      const projectRoot = process.cwd();
      const srcPath = path.join(projectRoot, 'src');

      // 计算相对于src目录的路径
      let relativeToSrc = path.relative(srcPath, absolutePath);

      // 标准化路径分隔符
      relativeToSrc = relativeToSrc.replace(/\\/g, '/');

      // 移除文件扩展名
      const withoutExtension = relativeToSrc.replace(/\.(ts|tsx|js|jsx)$/, '');

      // 特殊类型文件映射（避免与第三方包冲突）
      if (withoutExtension === 'types/movie.types') {
        return '@types-movie';
      }
      if (withoutExtension === 'types/photo.types') {
        return '@types-photo';
      }
      if (withoutExtension === 'types/unified-interfaces.types') {
        return '@types-unified';
      }
      if (withoutExtension === 'types/pagination.types') {
        return '@types-pagination';
      }

      // 处理index文件
      if (path.basename(withoutExtension) === 'index') {
        const dirPath = path.dirname(withoutExtension);
        return `@${dirPath === '.' ? '' : dirPath}`;
      }

      // 处理App文件的特殊情况
      if (withoutExtension === 'App') {
        return '@App'; // 或者保持相对路径，根据项目规范
      }

      return `@${withoutExtension}`;
    } catch (error) {
      return null;
    }
  }

  /**
   * 为@/格式导入生成建议的标准@别名
   */
  generateSuggestionForAtSlash(importPath) {
    // 根据项目配置生成正确的别名
    if (importPath === '@/types/movie.types') {
      return '@types-movie';
    }
    if (importPath === '@/types/photo.types') {
      return '@types-photo';
    }
    if (importPath === '@/types/unified-interfaces.types') {
      return '@types-unified';
    }
    if (importPath === '@/types/pagination.types') {
      return '@types-pagination';
    }
    if (importPath === '@/App') {
      return '@App';
    }

    // 默认替换@/为@
    return importPath.replace('@/', '@');
  }

  /**
   * 检查目录中的所有文件
   */
  checkDirectory(directory) {
    console.log(`🔍 开始检查目录: ${directory}`);
    console.log('─'.repeat(60));

    const files = this.getAllFiles(directory);
    console.log(`📁 找到 ${files.length} 个TypeScript/JavaScript文件\n`);

    files.forEach(file => {
      if (this.shouldExcludeFile(file)) {
        this.skippedFiles++;
        return;
      }

      this.checkFile(file);
    });

    console.log(`✅ 检查完成! 已检查 ${this.checkedFiles} 个文件，跳过 ${this.skippedFiles} 个文件\n`);
    return this.issues;
  }

  /**
   * 生成详细的报告
   */
  generateReport() {
    if (this.issues.length === 0) {
      console.log('🎉 恭喜！没有发现相对路径导入违规问题\n');
      return;
    }

    console.log(`❌ 发现 ${this.issues.length} 个相对路径导入违规问题:\n`);

    // 按文件分组显示问题
    const issuesByFile = {};
    this.issues.forEach(issue => {
      if (!issuesByFile[issue.file]) {
        issuesByFile[issue.file] = [];
      }
      issuesByFile[issue.file].push(issue);
    });

    Object.keys(issuesByFile).forEach(filePath => {
      const relativePath = path.relative(process.cwd(), filePath);
      console.log(`📄 ${relativePath}`);
      console.log('─'.repeat(80));

      issuesByFile[filePath].forEach((issue, index) => {
        console.log(`  ${index + 1}. 第${issue.line}行，第${issue.column}列:`);
        console.log(`     当前: ${issue.content}`);
        console.log(`     路径: "${issue.importPath}"`);
        console.log(`     原因: ${issue.reason}`);

        if (issue.suggestion) {
          console.log(`     建议: 使用 "${issue.suggestion}"`);
        }
        console.log('');
      });
    });

    // 统计信息
    console.log('📊 统计信息:');
    console.log('─'.repeat(30));
    console.log(`总问题数: ${this.issues.length}`);
    console.log(`涉及文件数: ${Object.keys(issuesByFile).length}`);

    // 按问题类型统计
    const reasons = {};
    const atSlashCount = this.issues.filter(issue => issue.importPath.startsWith('@/')).length;
    const relativeCount = this.issues.filter(issue => issue.importPath.startsWith('./') || issue.importPath.startsWith('../')).length;

    this.issues.forEach(issue => {
      reasons[issue.reason] = (reasons[issue.reason] || 0) + 1;
    });

    console.log('\n问题类型分布:');
    if (atSlashCount > 0) {
      console.log(`  ${atSlashCount}个: @/格式导入问题`);
    }
    if (relativeCount > 0) {
      console.log(`  ${relativeCount}个: 相对路径导入问题`);
    }
    Object.entries(reasons).forEach(([reason, count]) => {
      console.log(`  ${count}个: ${reason}`);
    });

    // 生成修复建议
    console.log('\n🔧 修复建议:');
    console.log('─'.repeat(50));
    console.log('1. 将所有相对路径导入改为@别名导入');
    console.log('2. 确保vite.config.ts中配置了正确的路径别名');
    console.log('3. 运行 npm run lint 检查其他代码规范问题');
    console.log('4. 提交前运行此脚本确保没有相对路径导入');
    console.log('5. 对于复杂的路径问题，参考项目的别名配置规则\n');
  }

  /**
   * 退出并返回状态码
   */
  exit() {
    if (this.issues.length > 0) {
      console.log(`💥 检查失败，发现 ${this.issues.length} 个问题！\n`);
      process.exit(1);
    } else {
      console.log('✨ 检查通过！代码符合导入规范。\n');
      process.exit(0);
    }
  }
}

// 主函数
function main() {
  console.log('🚀 精细化相对路径导入检查工具\n');

  const checker = new RelativeImportCheckerSimple();
  const srcDirectory = path.join(process.cwd(), 'src');

  // 检查src目录是否存在
  if (!fs.existsSync(srcDirectory)) {
    console.error('❌ 错误: 找不到src目录，请确保在项目根目录运行此脚本');
    console.log(`💡 提示: 当前工作目录: ${process.cwd()}`);
    process.exit(1);
  }

  // 开始检查
  checker.checkDirectory(srcDirectory);
  checker.generateReport();
  checker.exit();
}

// 处理命令行参数
if (require.main === module) {
  main();
}

module.exports = RelativeImportCheckerSimple;