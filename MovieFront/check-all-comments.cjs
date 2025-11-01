#!/usr/bin/env node

/**
 * 注释规范检查脚本 - 完整版本
 * 根据 claude.md 第13章注释规范检查整个src目录的代码
 *
 * 检查范围：
 * - src目录下所有 .ts, .tsx, .js, .jsx 文件
 * - 排除：.md, .css, .json, 配置文件等
 *
 * 规范要点：
 * 1. 只有文件头可以使用JSDoc块注释
 * 2. 业务代码（第11行及之后）禁止使用JSDoc块注释格式
 * 3. 参数、属性、字段不添加注释
 * 4. 统一使用单行注释
 * 5. 单行注释最多连续3行
 */

const fs = require('fs');
const path = require('path');

// 获取所有需要检查的文件
function getAllFilesToCheck() {
  const files = [];

  function walkDir(dir, excludeDirs = []) {
    if (excludeDirs.includes(dir)) return;

    try {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // 排除某些目录
          const excludeSubDirs = [
            '.git',
            'node_modules',
            'dist',
            'build',
            '.vscode',
            '.idea',
            'coverage'
          ];
          walkDir(fullPath, excludeSubDirs);
        } else if (stat.isFile()) {
          // 只检查特定扩展名的文件
          const ext = path.extname(item);
          const baseName = path.basename(item);

          // 排除不需要检查的文件类型
          const excludeFiles = [
            '.md',
            '.css',
            '.scss',
            '.sass',
            '.less',
            '.json',
            '.yml',
            '.yaml',
            '.xml',
            '.txt',
            '.config.js',
            '.config.ts',
            'tailwind.config.js',
            'vite.config.js',
            'package.json',
            'package-lock.json',
            'yarn.lock',
            'pnpm-lock.yaml',
            '.eslintrc.js',
            '.eslintrc.json',
            'tsconfig.json',
            'prettierrc.json',
            '.prettierrc.js'
          ];

          const shouldExclude = excludeFiles.some(exclude =>
            baseName.endsWith(exclude) || baseName.startsWith('.') && ext === ''
          );

          if (!shouldExclude && (ext === '.ts' || ext === '.tsx' || ext === '.js' || ext === '.jsx')) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // 忽略无法访问的目录
    }
  }

  walkDir('./src');
  return files;
}

// 检查单个文件的注释规范
function checkFileComments(filePath) {
  if (!fs.existsSync(filePath)) {
    return { error: '文件不存在', violations: [] };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const violations = [];

  // 检查每一行
  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];
    const trimmedLine = line.trim();

    // 1. 检查第11行及之后是否有 JSDoc 块注释
    if (lineNum > 10 && trimmedLine.includes('/**')) {
      // 排除文件头注释的关键词
      if (!trimmedLine.includes('@fileoverview') &&
          !trimmedLine.includes('@description') &&
          !trimmedLine.includes('@author') &&
          !trimmedLine.includes('@since') &&
          !trimmedLine.includes('@version')) {

        // 检查是否是JSDoc块注释的开始（包括单行和多行）
        // 向下查找对应的结束标记 */
        let isCompleteBlock = false;
        let endLine = lineNum;

        // 检查当前行是否包含 */
        if (trimmedLine.includes('*/')) {
          isCompleteBlock = true;
        } else {
          // 向下查找 */ 结束标记
          for (let j = i + 1; j < lines.length; j++) {
            if (lines[j].trim().includes('*/')) {
              isCompleteBlock = true;
              endLine = j + 1;
              break;
            }
            // 如果找到下一个 /** 或者函数/接口定义，说明前一个块注释未完整
            if (lines[j].trim().includes('/**') ||
                lines[j].trim().includes('interface') ||
                lines[j].trim().includes('function') ||
                lines[j].trim().includes('const')) {
              break;
            }
          }
        }

        if (isCompleteBlock) {
          violations.push({
            type: 'ILLEGAL_BLOCK_COMMENT',
            line: lineNum,
            endLine: endLine,
            content: trimmedLine,
            description: '第11行及之后禁止使用JSDoc块注释 /** */，应使用单行注释 //'
          });
        }
      }
    }

    // 2. 检查连续单行注释是否超过3行
    if (trimmedLine.startsWith('//')) {
      let consecutiveCount = 1;
      let j = i + 1;

      while (j < lines.length && lines[j].trim().startsWith('//')) {
        consecutiveCount++;
        j++;
      }

      if (consecutiveCount > 3) {
        violations.push({
          type: 'EXCESSIVE_CONSECUTIVE_COMMENTS',
          line: lineNum,
          endLine: i + consecutiveCount,
          count: consecutiveCount,
          description: `连续单行注释${consecutiveCount}行，超过规范的3行限制`
        });
        i = j - 1; // 跳过已检查的注释行
      }
    }

    // 3. 检查JSDOC标签违规使用 - 更精确的检测
    // 检查是否是完整的JSDoc标签（以 @ 开头的行，且在块注释内）
    if (lineNum > 10 && (trimmedLine.includes('@param') ||
                      trimmedLine.includes('@returns') ||
                      trimmedLine.includes('@type') ||
                      trimmedLine.includes('@example'))) {

      // 检查是否在JSDoc块注释内
      let inJsDocBlock = false;

      // 向上查找最近的 /**
      for (let k = i; k >= Math.max(0, i - 10); k--) {
        if (lines[k].trim().includes('/**')) {
          inJsDocBlock = true;
          break;
        }
      }

      // 排除常见的误报场景
      const isEmail = /['"].*?@.*?['"]/.test(trimmedLine) || // 邮箱地址
                     trimmedLine.includes('@example.com') || // 常见邮箱域名
                     /^[^/]*email.*:.*@/.test(trimmedLine); // email属性值

      // 如果不在JSDoc块内，且不是import/export语句、邮箱地址等，才是违规
      if (!inJsDocBlock &&
          !trimmedLine.includes('import') &&
          !trimmedLine.includes('export') &&
          !trimmedLine.includes('=') &&
          !trimmedLine.includes('from') &&
          !isEmail) {
        violations.push({
          type: 'ILLEGAL_JSDOC_TAGS',
          line: lineNum,
          content: trimmedLine,
          description: '业务代码中禁止使用JSDOC标签（@param, @returns等）'
        });
      }
    }
  }

  return { violations };
}

// 检查文件头注释是否规范
function checkFileHeader(filePath) {
  if (!fs.existsSync(filePath)) {
    return { valid: false, error: '文件不存在' };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const first10Lines = lines.slice(0, 10);
  const headerContent = first10Lines.join('\n');

  // 检查是否有文件头注释
  const hasBlockComment = first10Lines.some(line => line.trim().includes('/**'));

  if (hasBlockComment) {
    // 检查文件头注释是否包含必要字段
    const hasFileoverview = headerContent.includes('@fileoverview');
    const hasDescription = headerContent.includes('@description');
    const hasAuthor = headerContent.includes('@author');
    const hasSince = headerContent.includes('@since');
    const hasVersion = headerContent.includes('@version');

    const issues = [];
    if (!hasFileoverview) issues.push('缺少 @fileoverview');
    if (!hasDescription) issues.push('缺少 @description');
    if (!hasAuthor) issues.push('缺少 @author');
    if (!hasSince) issues.push('缺少 @since');
    if (!hasVersion) issues.push('缺少 @version');

    return {
      hasHeader: true,
      valid: issues.length === 0,
      issues
    };
  }

  return { hasHeader: false, valid: true };
}

// 主函数
function main() {
  console.log('🔍 开始检查整个src目录的注释规范...\n');

  // 获取所有需要检查的文件
  const allFiles = getAllFilesToCheck();
  console.log(`📁 找到需要检查的文件: ${allFiles.length}个\n`);

  if (allFiles.length === 0) {
    console.log('❌ 没有找到需要检查的文件');
    return;
  }

  const allViolations = [];
  const headerIssues = [];
  const processedFiles = [];

  // 检查每个文件
  allFiles.forEach((filePath, index) => {
    const relativePath = path.relative('.', filePath);
    console.log(`🔍 [${index + 1}/${allFiles.length}] 检查文件: ${relativePath}`);

    processedFiles.push(relativePath);

    // 检查文件头注释
    const headerCheck = checkFileHeader(filePath);
    if (headerCheck.error) {
      console.log(`  ❌ ${headerCheck.error}`);
      return;
    }

    if (!headerCheck.valid) {
      headerIssues.push({
        file: relativePath,
        issues: headerCheck.issues
      });
      console.log(`  ⚠️  文件头注释不规范: ${headerCheck.issues.join(', ')}`);
    }

    // 检查业务代码注释
    const commentCheck = checkFileComments(filePath);

    if (commentCheck.error) {
      console.log(`  ❌ ${commentCheck.error}`);
      return;
    }

    if (commentCheck.violations.length > 0) {
      console.log(`  ❌ 发现 ${commentCheck.violations.length} 个违规注释:`);
      commentCheck.violations.forEach(violation => {
        console.log(`    第${violation.line}行: ${violation.description}`);
        console.log(`    内容: ${violation.content}`);
        allViolations.push({
          file: relativePath,
          ...violation
        });
      });
    } else {
      console.log(`  ✅ 符合规范`);
    }
    console.log();
  });

  // 输出总结
  console.log('📊 检查结果总结:');
  console.log(`- 检查文件总数: ${allFiles.length}`);
  console.log(`- 发现违规注释: ${allViolations.length}个`);
  console.log(`- 文件头问题: ${headerIssues.length}个`);

  if (allViolations.length > 0) {
    console.log('\n❌ 发现以下违规注释需要修复:');

    // 按文件分组显示违规
    const violationsByFile = {};
    allViolations.forEach(violation => {
      if (!violationsByFile[violation.file]) {
        violationsByFile[violation.file] = [];
      }
      violationsByFile[violation.file].push(violation);
    });

    let violationIndex = 1;
    Object.keys(violationsByFile).forEach(file => {
      console.log(`\n📄 文件: ${file}`);
      violationsByFile[file].forEach(violation => {
        console.log(`  ${violationIndex}. 第${violation.line}行 (${violation.type})`);
        console.log(`     描述: ${violation.description}`);
        console.log(`     内容: ${violation.content}`);
        violationIndex++;
      });
    });

    console.log('\n🔧 修复建议:');
    console.log('1. 将 JSDoc 块注释 /** */ 改为单行注释 //');
    console.log('2. 删除参数、属性、字段的注释');
    console.log('3. 连续注释控制在3行以内');
    console.log('4. 删除业务代码中的 @param、@returns 等JSDoc标签');

    process.exit(1);
  } else {
    console.log('✅ 所有文件都符合注释规范！');
  }
}

// 运行主函数
main();