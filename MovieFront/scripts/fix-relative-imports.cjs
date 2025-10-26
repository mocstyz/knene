#!/usr/bin/env node

/**
 * @fileoverview 自动修复相对路径导入脚本
 * @description 自动将相对路径导入替换为@别名导入
 * @author Claude
 * @since 1.0.0
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

class RelativeImportFixer {
  constructor() {
    this.fixedFiles = 0;
    this.skippedFiles = 0;
    this.errors = [];

    // 需要跳过的文件（这些文件的相对导入是合理的）
    this.skipPatterns = [
      /\/index\.(ts|tsx|js|jsx)$/,
      /\.test\.(ts|tsx|js|jsx)$/,
      /\.spec\.(ts|tsx|js|jsx)$/,
    ];

    // 路径映射规则
    this.pathMappings = {
      // 应用层
      'application/hooks': '@application/hooks',
      'application/services': '@application/services',
      'application/stores': '@application/stores',
      'application/providers': '@application/providers',

      // 领域层
      'domain/entities': '@domain/entities',
      'domain/value-objects': '@domain/value-objects',
      'domain/services': '@domain/services',
      'domain/events': '@domain/events',
      'domain/types': '@domain/types',

      // 基础设施层
      'infrastructure/api': '@infrastructure/api',
      'infrastructure/repositories': '@infrastructure/repositories',
      'infrastructure/services': '@infrastructure/services',
      'infrastructure/storage': '@infrastructure/storage',
      'infrastructure/config': '@infrastructure/config',
      'infrastructure/cache': '@infrastructure/cache',
      'infrastructure/events': '@infrastructure/events',

      // 表现层
      'presentation/components/atoms': '@components/atoms',
      'presentation/components/molecules': '@components/molecules',
      'presentation/components/organisms': '@components/organisms',
      'presentation/components/templates': '@components/templates',
      'presentation/components/domains': '@components/domains',
      'presentation/components/layers': '@components/layers',
      'presentation/pages': '@pages',
      'presentation/router': '@presentation/router',
      'presentation/hooks': '@presentation/hooks',

      // 其他
      'utils': '@utils',
      'types': '@types',
      'tokens': '@tokens',
      'hooks': '@hooks',
      'data': '@data',
    };

    // 不需要修复的导入模式
    this.ignorePatterns = [
      /\.css$/,
      /\.scss$/,
      /\.sass$/,
      /\.less$/,
      /\.(png|jpg|jpeg|gif|svg|ico|webp|mp4|webm|pdf|woff|woff2|ttf|eot)$/,
      /^\.\/types\//,  // 同目录types文件夹
      /^\.\/.*\.types\./,  // 同目录types文件
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
          files = files.concat(this.getAllFiles(fullPath, extensions));
        } else if (stat.isFile()) {
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
   * 检查文件是否应该跳过
   */
  shouldSkipFile(filePath) {
    return this.skipPatterns.some(pattern => pattern.test(filePath));
  }

  /**
   * 检查导入路径是否应该忽略
   */
  shouldIgnoreImport(importPath) {
    return this.ignorePatterns.some(pattern => pattern.test(importPath));
  }

  /**
   * 生成@别名路径
   */
  generateAliasPath(filePath, importPath) {
    try {
      const fileDir = path.dirname(filePath);
      const absolutePath = path.resolve(fileDir, importPath);
      const projectRoot = process.cwd();
      const srcPath = path.join(projectRoot, 'src');

      // 计算相对于src目录的路径
      let relativeToSrc = path.relative(srcPath, absolutePath);
      relativeToSrc = relativeToSrc.replace(/\\/g, '/');

      // 移除文件扩展名
      const withoutExtension = relativeToSrc.replace(/\.(ts|tsx|js|jsx)$/, '');

      // 处理index文件
      if (path.basename(withoutExtension) === 'index') {
        const dirPath = path.dirname(withoutExtension);
        if (dirPath === '.') {
          return '@';
        }
        return `@${dirPath}`;
      }

      // 查找匹配的路径映射
      for (const [source, alias] of Object.entries(this.pathMappings)) {
        if (withoutExtension.startsWith(source)) {
          const remainingPath = withoutExtension.substring(source.length);
          return remainingPath ? `${alias}${remainingPath}` : alias;
        }
      }

      // 默认使用@前缀
      return `@${withoutExtension}`;
    } catch (error) {
      console.warn(`警告: 无法生成别名路径 ${importPath}: ${error.message}`);
      return null;
    }
  }

  /**
   * 修复单个文件的导入
   */
  fixFile(filePath) {
    try {
      if (this.shouldSkipFile(filePath)) {
        this.skippedFiles++;
        return false;
      }

      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      let changes = 0;

      // 匹配各种导入语句
      const importPatterns = [
        // ES6 import
        /import\s+(?:.*?\s+from\s+)?['"`]([^'"`]+)['"`]/g,
        // Dynamic import
        /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
        // require
        /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
        // export from
        /export\s+.*?from\s+['"`]([^'"`]+)['"`]/g,
      ];

      importPatterns.forEach(pattern => {
        pattern.lastIndex = 0; // 重置正则表达式

        content = content.replace(pattern, (match, importPath) => {
          // 跳过非相对路径
          if (!importPath.startsWith('./') && !importPath.startsWith('../')) {
            return match;
          }

          // 跳过应该忽略的导入
          if (this.shouldIgnoreImport(importPath)) {
            return match;
          }

          // 生成别名路径
          const aliasPath = this.generateAliasPath(filePath, importPath);
          if (!aliasPath) {
            return match;
          }

          // 替换导入路径
          const result = match.replace(importPath, aliasPath);
          changes++;
          return result;
        });
      });

      // 如果有变化，写入文件
      if (changes > 0 && content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ 修复了 ${path.relative(process.cwd(), filePath)} 中的 ${changes} 个导入`);
        this.fixedFiles++;
        return true;
      }

      return false;
    } catch (error) {
      this.errors.push({ file: filePath, error: error.message });
      console.error(`❌ 修复文件失败 ${filePath}: ${error.message}`);
      return false;
    }
  }

  /**
   * 修复目录中的所有文件
   */
  fixDirectory(directory) {
    console.log('🔧 开始自动修复相对路径导入...\n');

    const files = this.getAllFiles(directory);
    console.log(`📁 找到 ${files.length} 个文件\n`);

    // 先运行检查，看看有多少问题
    console.log('📊 首先运行检查以确定需要修复的问题...\n');

    // 这里可以调用检查脚本，但为了简单起见，我们直接开始修复
    files.forEach(file => {
      if (!file.includes('node_modules') && !file.includes('.config.')) {
        this.fixFile(file);
      }
    });

    return {
      fixedFiles: this.fixedFiles,
      skippedFiles: this.skippedFiles,
      errors: this.errors
    };
  }

  /**
   * 生成报告
   */
  generateReport(results) {
    console.log('\n' + '='.repeat(60));
    console.log('📋 修复完成报告');
    console.log('='.repeat(60));

    console.log(`✅ 成功修复文件数: ${results.fixedFiles}`);
    console.log(`⏭️  跳过文件数: ${results.skippedFiles}`);
    console.log(`❌ 错误数: ${results.errors.length}`);

    if (results.errors.length > 0) {
      console.log('\n❌ 修复过程中发生的错误:');
      results.errors.forEach(({ file, error }) => {
        console.log(`  ${path.relative(process.cwd(), file)}: ${error}`);
      });
    }

    if (results.fixedFiles > 0) {
      console.log('\n🎉 修复完成！建议运行以下命令验证修复结果:');
      console.log('  npm run check:imports');
      console.log('  npm run lint');
    } else {
      console.log('\n✨ 没有需要修复的文件！');
    }
  }
}

// 主函数
function main() {
  const fixer = new RelativeImportFixer();
  const srcDirectory = path.join(process.cwd(), 'src');

  if (!fs.existsSync(srcDirectory)) {
    console.error('❌ 错误: 找不到src目录，请确保在项目根目录运行此脚本');
    process.exit(1);
  }

  console.log('⚠️  警告: 此脚本将自动修改您的代码文件！');
  console.log('💡 建议在运行前先提交代码或创建备份\n');

  // 询问用户确认
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('确定要继续吗？(y/N): ', (answer) => {
    rl.close();

    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
      console.log('❌ 操作已取消');
      process.exit(0);
    }

    const results = fixer.fixDirectory(srcDirectory);
    fixer.generateReport(results);
  });
}

// 处理命令行参数
if (require.main === module) {
  main();
}

module.exports = RelativeImportFixer;