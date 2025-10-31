#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Java注释规范检测脚本
检测Java文件是否符合development_standards_rules.md中的注释规范

@author 相笑与春风
@version 1.0
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple

class CommentViolationChecker:
    """Java注释规范检测器"""

    def __init__(self):
        self.violations = []
        self.total_files = 0
        self.violation_files = 0

    def check_directory(self, directory: str) -> Dict:
        """检查目录下的所有Java文件"""
        print(f"开始扫描目录: {directory}")

        # 递归查找所有Java文件
        java_files = []
        for root, dirs, files in os.walk(directory):
            for file in files:
                if file.endswith('.java'):
                    java_files.append(os.path.join(root, file))

        print(f"找到 {len(java_files)} 个Java文件")

        # 检查每个文件
        for java_file in java_files:
            self.check_file(java_file)
            self.total_files += 1

        return {
            'total_files': self.total_files,
            'violation_files': self.violation_files,
            'violations': self.violations
        }

    def check_file(self, file_path: str):
        """检查单个Java文件的注释规范"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')

            file_violations = []

            # 检查各种违规情况
            file_violations.extend(self.check_javadoc_violations(lines, file_path))
            file_violations.extend(self.check_block_comment_violations(lines, file_path))
            file_violations.extend(self.check_decorative_comments(lines, file_path))
            file_violations.extend(self.check_long_comments(lines, file_path))
            file_violations.extend(self.check_misaligned_comments(lines, file_path))

            if file_violations:
                self.violation_files += 1
                self.violations.extend(file_violations)
                print(f"\n发现违规文件: {file_path}")
                for violation in file_violations:
                    print(f"  第{violation['line']}行: {violation['message']}")

        except Exception as e:
            print(f"处理文件 {file_path} 时出错: {e}")

    def check_javadoc_violations(self, lines: List[str], file_path: str) -> List[Dict]:
        """检查JavaDoc注释违规 - 除文件头外禁止使用 /** */"""
        violations = []

        # 检查文件头是否已有JavaDoc（在前30行内查找包含@author的JavaDoc）
        has_file_header = False
        file_header_end = 0
        for i, line in enumerate(lines[:30]):
            if '/**' in line:
                # 查找这个JavaDoc块是否包含@author
                for j in range(i, min(i+15, len(lines))):
                    if j < len(lines) and '@author' in lines[j]:
                        has_file_header = True
                        file_header_end = j + 1
                        break
                if has_file_header:
                    break

        in_javadoc = False
        javadoc_start_line = 0

        for i, line in enumerate(lines):
            stripped = line.strip()

            # 检测JavaDoc开始（包括在//注释中的/**）
            if '/**' in line:
                # 跳过文件头JavaDoc
                if i < file_header_end:
                    continue

                # 检查是否是 // /** 这种违规情况
                if stripped.startswith('//') and '/**' in stripped:
                    violations.append({
                        'file': file_path,
                        'line': i + 1,
                        'type': 'JAVADOC_VIOLATION',
                        'message': '禁止在//注释中使用 /** （违规的注释格式）',
                        'content': line.strip()
                    })

                # 检查是否是真正的JavaDoc注释（不是在//注释中）
                elif not stripped.startswith('//'):
                    in_javadoc = True
                    javadoc_start_line = i + 1
                    violations.append({
                        'file': file_path,
                        'line': i + 1,
                        'type': 'JAVADOC_VIOLATION',
                        'message': '禁止使用JavaDoc注释 /** */（除文件头外）',
                        'content': line.strip()
                    })

            # 检测JavaDoc结束
            if in_javadoc and '*/' in line:
                in_javadoc = False

            # 检测JavaDoc中间的行（排除已经是//注释的情况）
            if in_javadoc and not stripped.startswith('//'):
                violations.append({
                    'file': file_path,
                    'line': i + 1,
                    'type': 'JAVADOC_VIOLATION',
                    'message': '禁止使用JavaDoc注释 /** */（除文件头外）',
                    'content': line.strip()
                })

        return violations

    def check_block_comment_violations(self, lines: List[str], file_path: str) -> List[Dict]:
        """检查块注释违规 - 禁止使用 /* */"""
        violations = []
        in_block_comment = False

        for i, line in enumerate(lines):
            # 检测块注释开始
            if '/*' in line and not line.strip().startswith('//'):
                # 跳过已经检测过的JavaDoc
                if '/**' not in line:
                    in_block_comment = True
                    violations.append({
                        'file': file_path,
                        'line': i + 1,
                        'type': 'BLOCK_COMMENT_VIOLATION',
                        'message': '禁止使用块注释 /* */（除文件头外）',
                        'content': line.strip()
                    })

            # 检测块注释结束
            if in_block_comment and '*/' in line:
                in_block_comment = False
                if not line.strip().startswith('//'):
                    violations.append({
                        'file': file_path,
                        'line': i + 1,
                        'type': 'BLOCK_COMMENT_VIOLATION',
                        'message': '禁止使用块注释 /* */（除文件头外）',
                        'content': line.strip()
                    })

            # 检测块注释中间的行
            if in_block_comment and not line.strip().startswith('//'):
                violations.append({
                    'file': file_path,
                    'line': i + 1,
                    'type': 'BLOCK_COMMENT_VIOLATION',
                    'message': '禁止使用块注释 /* */（除文件头外）',
                    'content': line.strip()
                })

        return violations

    def check_decorative_comments(self, lines: List[str], file_path: str) -> List[Dict]:
        """检查装饰性分隔线注释违规"""
        violations = []
        decorative_patterns = [
            r'^\s*//\s*[-=]{3,}\s*$',  # // --- 或 // ===
            r'^\s*//\s*[=-]{3,}.*[=-]{3,}\s*$',  # // ===== 内容 =====
            r'^\s*//\s*[-=\s]*$',  # 纯装饰性线条
        ]

        for i, line in enumerate(lines):
            stripped = line.strip()
            if stripped.startswith('//'):
                # 检查是否是纯装饰性注释
                comment_content = stripped[2:].strip()  # 移除 // 并去除空格

                # 1. 检查单行空注释（只有 // 没有内容）
                if comment_content == '':
                    violations.append({
                        'file': file_path,
                        'line': i + 1,
                        'type': 'DECORATIVE_COMMENT_VIOLATION',
                        'message': '禁止使用空的装饰性注释',
                        'content': line.strip()
                    })
                # 2. 检查装饰性分隔线模式
                else:
                    for pattern in decorative_patterns:
                        if re.match(pattern, stripped):
                            violations.append({
                                'file': file_path,
                                'line': i + 1,
                                'type': 'DECORATIVE_COMMENT_VIOLATION',
                                'message': '禁止使用装饰性分隔线注释',
                                'content': line.strip()
                            })
                            break

        return violations

    def check_long_comments(self, lines: List[str], file_path: str) -> List[Dict]:
        """检查过长的单行注释 - 超过3行的连续注释"""
        violations = []
        comment_line_count = 0
        comment_start_line = 0

        for i, line in enumerate(lines):
            stripped = line.strip()

            if stripped.startswith('//'):
                if comment_line_count == 0:
                    comment_start_line = i + 1
                comment_line_count += 1
            else:
                if comment_line_count > 3:
                    violations.append({
                        'file': file_path,
                        'line': comment_start_line,
                        'type': 'LONG_COMMENT_VIOLATION',
                        'message': f'连续单行注释超过3行（共{comment_line_count}行），需要精简提炼',
                        'content': f'从第{comment_start_line}行开始的连续注释'
                    })
                comment_line_count = 0

        # 检查文件末尾的注释
        if comment_line_count > 3:
            violations.append({
                'file': file_path,
                'line': comment_start_line,
                'type': 'LONG_COMMENT_VIOLATION',
                'message': f'连续单行注释超过3行（共{comment_line_count}行），需要精简提炼',
                'content': f'从第{comment_start_line}行开始的连续注释'
            })

        return violations

    def check_misaligned_comments(self, lines: List[str], file_path: str) -> List[Dict]:
        """检查注释不对齐的情况"""
        violations = []

        # Java代码关键字，用于识别代码行
        java_keywords = [
            'public', 'private', 'protected', 'static', 'final', 'abstract',
            'class', 'interface', 'enum', 'void', 'int', 'String', 'boolean',
            'double', 'float', 'long', 'short', 'byte', 'char', 'var',
            'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default',
            'try', 'catch', 'finally', 'throw', 'throws', 'return',
            'new', 'this', 'super', 'instanceof', 'import', 'package'
        ]

        # 常见的Java集合类型
        java_types = [
            'String', 'Integer', 'Double', 'Float', 'Long', 'Boolean',
            'List', 'Map', 'Set', 'ArrayList', 'HashMap', 'HashSet',
            'LinkedList', 'TreeMap', 'TreeSet', 'Vector', 'Hashtable'
        ]

        for i, line in enumerate(lines):
            stripped = line.strip()
            if stripped.startswith('//'):
                # 查找下一个非空、非注释行
                next_code_line = None
                next_code_line_index = -1

                for j in range(i + 1, min(i + 5, len(lines))):  # 向下查找最多5行
                    candidate_line = lines[j].strip()
                    if candidate_line and not candidate_line.startswith('//') and not candidate_line.startswith('@'):
                        next_code_line = lines[j]
                        next_code_line_index = j
                        break

                if next_code_line:
                    next_stripped = next_code_line.strip()

                    # 检查是否是代码行（排除import、package等声明）
                    is_code_line = (
                        # 包含Java关键字
                        any(keyword in next_stripped.split()[0] for keyword in java_keywords if next_stripped.split()) or
                        # 包含Java类型
                        any(type_name in next_stripped for type_name in java_types) or
                        # 包含变量赋值
                        ('=' in next_stripped and not next_stripped.startswith('//')) or
                        # 包含方法调用
                        ('(' in next_stripped and ')' in next_stripped) or
                        # 包含花括号
                        ('{' in next_stripped or '}' in next_stripped)
                    )

                    # 排除package和import语句
                    if next_stripped.startswith('package ') or next_stripped.startswith('import '):
                        is_code_line = False

                    if is_code_line:
                        # 计算缩进
                        current_indent = len(line) - len(line.lstrip())
                        next_line_indent = len(next_code_line) - len(next_code_line.lstrip())

                        # 判断不对齐的情况
                        # 1. 完全没有缩进的注释（缩进为0）但下一行有缩进
                        if current_indent == 0 and next_line_indent > 0:
                            violations.append({
                                'file': file_path,
                                'line': i + 1,
                                'type': 'MISALIGNED_COMMENT_VIOLATION',
                                'message': '注释完全没有缩进，与下方代码不对齐',
                                'content': line.strip()
                            })

                        # 2. 缩进差异过大（超过4个空格）
                        elif abs(current_indent - next_line_indent) > 4:
                            violations.append({
                                'file': file_path,
                                'line': i + 1,
                                'type': 'MISALIGNED_COMMENT_VIOLATION',
                                'message': f'注释缩进与下方代码差异过大（相差{abs(current_indent - next_line_indent)}个空格）',
                                'content': line.strip()
                            })

                        # 3. 注释缩进少于代码缩进且差异明显
                        elif current_indent < next_line_indent and (next_line_indent - current_indent) >= 2:
                            violations.append({
                                'file': file_path,
                                'line': i + 1,
                                'type': 'MISALIGNED_COMMENT_VIOLATION',
                                'message': '注释缩进不足，与下方代码不对齐',
                                'content': line.strip()
                            })

        return violations

    def generate_report(self) -> str:
        """生成检测报告"""
        report = []
        report.append("=" * 80)
        report.append("Java注释规范检测报告")
        report.append("=" * 80)
        report.append(f"总文件数: {self.total_files}")
        report.append(f"违规文件数: {self.violation_files}")
        report.append(f"总违规数: {len(self.violations)}")
        report.append("")

        # 按类型统计违规
        violation_types = {}
        for violation in self.violations:
            vtype = violation['type']
            violation_types[vtype] = violation_types.get(vtype, 0) + 1

        report.append("违规类型统计:")
        for vtype, count in violation_types.items():
            report.append(f"  {vtype}: {count}次")
        report.append("")

        # 详细违规信息
        report.append("详细违规信息:")
        report.append("-" * 80)

        current_file = None
        for violation in self.violations:
            if violation['file'] != current_file:
                current_file = violation['file']
                report.append(f"\n文件: {current_file}")
                report.append("-" * 60)

            report.append(f"第{violation['line']}行 [{violation['type']}]: {violation['message']}")
            report.append(f"  内容: {violation['content']}")

        return "\n".join(report)

    def auto_fix_file(self, file_path: str):
        """自动修复文件中的注释违规"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')

            fixed_lines = []
            i = 0

            # 首先确定文件头JavaDoc的结束位置
            file_header_end = 0
            for j, line in enumerate(lines[:30]):
                if '/**' in line:
                    # 查找这个JavaDoc块是否包含@author
                    for k in range(j, min(j+15, len(lines))):
                        if k < len(lines) and '@author' in lines[k]:
                            file_header_end = k + 1
                            break
                    if file_header_end > 0:
                        break

            while i < len(lines):
                line = lines[i]
                stripped = line.strip()

                # 1. 修复JavaDoc违规（除文件头外）
                if '/**' in line and i >= file_header_end:
                    # 检查是否是 // /** 这种情况，转换为单行注释
                    if stripped.startswith('//') and '/**' in stripped:
                        # 将 // /** 转换为 // 单行注释
                        comment_content = stripped.replace('// /**', '//').strip()
                        fixed_lines.append(' ' * (len(line) - len(line.lstrip())) + comment_content)
                        i += 1
                        continue

                    # 跳过整个JavaDoc块
                    while i < len(lines) and '*/' not in lines[i]:
                        i += 1
                    i += 1  # 跳过 */
                    continue

                # 2. 修复块注释违规
                if '/*' in line and not stripped.startswith('//') and '/**' not in line:
                    # 跳过整个块注释
                    while i < len(lines) and '*/' not in lines[i]:
                        i += 1
                    i += 1  # 跳过 */
                    continue

                # 3. 修复装饰性分隔线
                if re.match(r'^\s*//\s*[-=]{3,}', stripped) or stripped == '//':
                    # 删除装饰性分隔线和空注释
                    i += 1
                    continue

                # 4. 检查并处理连续注释超过3行的情况（包含对齐修复）
                if stripped.startswith('//'):
                    # 查找连续的注释行
                    comment_lines = []
                    comment_indents = []
                    comment_start_index = i

                    j = i
                    while j < len(lines) and lines[j].strip().startswith('//'):
                        comment_lines.append(lines[j])
                        comment_indents.append(len(lines[j]) - len(lines[j].lstrip()))
                        j += 1

                    comment_count = len(comment_lines)

                    # 检查每个注释行的对齐情况，并修复
                    fixed_comment_lines = []
                    for k, comment_line in enumerate(comment_lines):
                        comment_stripped = comment_line.strip()

                        # 查找这个注释行对应的下一个代码行
                        next_code_line = None
                        for m in range(k + comment_start_index + 1, min(k + comment_start_index + 10, len(lines))):
                            candidate_line = lines[m].strip()
                            if candidate_line and not candidate_line.startswith('//') and not candidate_line.startswith('@') and not candidate_line.startswith('/*') and not candidate_line.startswith('*'):
                                # 更全面的判断是否是代码行
                                words = candidate_line.split()
                                is_code_line = (
                                    # 包含Java关键字
                                    (words and any(keyword == words[0] for keyword in ['public', 'private', 'protected', 'static', 'final', 'abstract', 'synchronized', 'native', 'void', 'int', 'String', 'boolean', 'double', 'float', 'long', 'short', 'byte', 'char', 'var'])) or
                                    # 包含Java类型
                                    any(type_name in candidate_line for type_name in ['String', 'Integer', 'Double', 'Float', 'Long', 'Boolean', 'List', 'Map', 'Set', 'ArrayList', 'HashMap', 'HashSet', 'LinkedList', 'TreeMap', 'TreeSet']) or
                                    # 包含变量赋值
                                    ('=' in candidate_line and not candidate_line.startswith('//')) or
                                    # 包含方法调用
                                    (candidate_line.count('(') > 0 and candidate_line.count(')') > 0) or
                                    # 包含花括号
                                    ('{' in candidate_line or '}' in candidate_line) or
                                    # 包含控制语句
                                    any(keyword in candidate_line for keyword in ['if ', 'else', 'for ', 'while ', 'do ', 'switch ', 'case ', 'default:', 'try ', 'catch', 'finally', 'return ', 'throw ', 'break;', 'continue;'])
                                )

                                if is_code_line:
                                    next_code_line = lines[m]
                                    break

                        if next_code_line:
                            current_indent = comment_indents[k]
                            next_line_indent = len(next_code_line) - len(next_code_line.lstrip())

                            # 修复对齐逻辑
                            should_fix = False
                            fixed_indent = current_indent

                            # 1. 完全没有缩进的注释，但下一行有缩进
                            if current_indent == 0 and next_line_indent > 0:
                                should_fix = True
                                fixed_indent = next_line_indent

                            # 2. 缩进差异过大（超过6个空格）
                            elif abs(current_indent - next_line_indent) > 6:
                                should_fix = True
                                fixed_indent = next_line_indent

                            # 3. 注释缩进明显少于代码缩进（差异2个空格以上）
                            elif current_indent < next_line_indent and (next_line_indent - current_indent) >= 2:
                                should_fix = True
                                fixed_indent = next_line_indent

                            # 4. 特殊情况：注释缩进超过代码缩进太多
                            elif current_indent > next_line_indent and (current_indent - next_line_indent) > 2:
                                should_fix = True
                                fixed_indent = next_line_indent

                            if should_fix:
                                fixed_comment_lines.append(' ' * fixed_indent + comment_stripped)
                            else:
                                fixed_comment_lines.append(comment_line)
                        else:
                            fixed_comment_lines.append(comment_line)

                    if comment_count > 3:
                        # 超过3行的连续注释需要精简
                        # 合并前3行的内容为1-2行
                        all_content = []
                        for k in range(min(3, len(fixed_comment_lines))):
                            content = fixed_comment_lines[k].strip()
                            if content.startswith('//'):
                                content = content[2:].strip()
                            if content:  # 只添加非空内容
                                all_content.append(content)

                        if all_content:
                            # 将内容合并为1-2行
                            combined_content = ' '.join(all_content)
                            if len(combined_content) > 80:  # 如果太长，分成两行
                                # 简单的分割逻辑
                                mid = len(combined_content) // 2
                                split_pos = combined_content.rfind(' ', 0, mid)
                                if split_pos == -1:
                                    split_pos = mid

                                line1 = combined_content[:split_pos]
                                line2 = combined_content[split_pos:].strip()

                                # 添加合并后的注释
                                indent = min(comment_indents)  # 使用最小缩进
                                fixed_lines.append(' ' * indent + '// ' + line1)
                                if line2:
                                    fixed_lines.append(' ' * indent + '// ' + line2)
                            else:
                                # 一行就够了
                                indent = min(comment_indents)
                                fixed_lines.append(' ' * indent + '// ' + combined_content)

                        i = j  # 跳过所有原始注释行
                    else:
                        # 不超过3行，使用修复后的注释
                        for fixed_comment in fixed_comment_lines:
                            fixed_lines.append(fixed_comment)
                        i = j
                    continue
                    # 查找连续的注释行
                    comment_lines = []
                    comment_indents = []

                    j = i
                    while j < len(lines) and lines[j].strip().startswith('//'):
                        comment_lines.append(lines[j])
                        comment_indents.append(len(lines[j]) - len(lines[j].lstrip()))
                        j += 1

                    comment_count = len(comment_lines)

                    if comment_count > 3:
                        # 超过3行的连续注释需要精简
                        # 合并前3行的内容为1-2行
                        all_content = []
                        for k in range(min(3, len(comment_lines))):
                            content = comment_lines[k].strip()
                            if content.startswith('//'):
                                content = content[2:].strip()
                            if content:  # 只添加非空内容
                                all_content.append(content)

                        if all_content:
                            # 将内容合并为1-2行
                            combined_content = ' '.join(all_content)
                            if len(combined_content) > 80:  # 如果太长，分成两行
                                # 简单的分割逻辑
                                mid = len(combined_content) // 2
                                split_pos = combined_content.rfind(' ', 0, mid)
                                if split_pos == -1:
                                    split_pos = mid

                                line1 = combined_content[:split_pos]
                                line2 = combined_content[split_pos:].strip()

                                # 添加合并后的注释
                                indent = min(comment_indents)  # 使用最小缩进
                                fixed_lines.append(' ' * indent + '// ' + line1)
                                if line2:
                                    fixed_lines.append(' ' * indent + '// ' + line2)
                            else:
                                # 一行就够了
                                indent = min(comment_indents)
                                fixed_lines.append(' ' * indent + '// ' + combined_content)

                        i = j  # 跳过所有原始注释行
                        continue

                # 5. 修复不对齐的注释
                if stripped.startswith('//') and i < len(lines) - 1:
                    # 查找下一个代码行
                    next_code_line = None
                    next_code_line_index = -1
                    for j in range(i + 1, min(i + 10, len(lines))):  # 扩大查找范围
                        candidate_line = lines[j].strip()
                        if candidate_line and not candidate_line.startswith('//') and not candidate_line.startswith('@') and not candidate_line.startswith('/*') and not candidate_line.startswith('*'):
                            # 更全面的判断是否是代码行
                            words = candidate_line.split()
                            is_code_line = (
                                # 包含Java关键字
                                (words and any(keyword == words[0] for keyword in ['public', 'private', 'protected', 'static', 'final', 'abstract', 'synchronized', 'native', 'void', 'int', 'String', 'boolean', 'double', 'float', 'long', 'short', 'byte', 'char', 'var'])) or
                                # 包含Java类型
                                any(type_name in candidate_line for type_name in ['String', 'Integer', 'Double', 'Float', 'Long', 'Boolean', 'List', 'Map', 'Set', 'ArrayList', 'HashMap', 'HashSet', 'LinkedList', 'TreeMap', 'TreeSet']) or
                                # 包含变量赋值
                                ('=' in candidate_line and not candidate_line.startswith('//')) or
                                # 包含方法调用
                                (candidate_line.count('(') > 0 and candidate_line.count(')') > 0) or
                                # 包含花括号
                                ('{' in candidate_line or '}' in candidate_line) or
                                # 包含控制语句
                                any(keyword in candidate_line for keyword in ['if ', 'else', 'for ', 'while ', 'do ', 'switch ', 'case ', 'default:', 'try ', 'catch', 'finally', 'return ', 'throw ', 'break;', 'continue;'])
                            )

                            if is_code_line:
                                next_code_line = lines[j]
                                next_code_line_index = j
                                break

                    if next_code_line:
                        current_indent = len(line) - len(line.lstrip())
                        next_line_indent = len(next_code_line) - len(next_code_line.lstrip())

                        # 更智能的修复逻辑
                        should_fix = False
                        fixed_indent = current_indent

                        # 1. 完全没有缩进的注释，但下一行有缩进
                        if current_indent == 0 and next_line_indent > 0:
                            should_fix = True
                            fixed_indent = next_line_indent

                        # 2. 缩进差异过大（超过6个空格）
                        elif abs(current_indent - next_line_indent) > 6:
                            should_fix = True
                            fixed_indent = next_line_indent

                        # 3. 注释缩进明显少于代码缩进（差异2个空格以上）
                        elif current_indent < next_line_indent and (next_line_indent - current_indent) >= 2:
                            should_fix = True
                            fixed_indent = next_line_indent

                        # 4. 特殊情况：注释缩进超过代码缩进太多
                        elif current_indent > next_line_indent and (current_indent - next_line_indent) > 2:
                            should_fix = True
                            fixed_indent = next_line_indent

                        if should_fix:
                            fixed_lines.append(' ' * fixed_indent + stripped)
                            i += 1
                            continue

                fixed_lines.append(line)
                i += 1

            # 写回文件
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(fixed_lines))

            print(f"已自动修复文件: {file_path}")

        except Exception as e:
            print(f"修复文件 {file_path} 时出错: {e}")

def main():
    """主函数"""
    if len(sys.argv) != 2:
        print("使用方法: python comment_checker.py <Java源代码目录>")
        print("示例: python comment_checker.py KneneBackend/src")
        sys.exit(1)

    directory = sys.argv[1]

    if not os.path.exists(directory):
        print(f"错误: 目录 {directory} 不存在")
        sys.exit(1)

    checker = CommentViolationChecker()
    result = checker.check_directory(directory)

    print("\n" + checker.generate_report())

    # 询问是否自动修复（仅用于测试文件）
    if result['violations']:
        try:
            fix_choice = input("\n是否自动修复检测到的违规？(y/n): ").strip().lower()
            if fix_choice == 'y':
                unique_files = set(v['file'] for v in result['violations'])
                for file_path in unique_files:
                    # 确保只修复测试文件，保护其他文件
                    if 'CommentViolationTest.java' in file_path:
                        checker.auto_fix_file(file_path)
                        print(f"已修复测试文件: {file_path}")
                    else:
                        print(f"跳过非测试文件: {file_path}")
                print("\n自动修复完成！")
        except EOFError:
            print("\n跳过自动修复。")

    print(f"\n检测完成！共发现 {len(result['violations'])} 个违规项。")

if __name__ == "__main__":
    main()