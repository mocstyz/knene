/**
 * @fileoverview CSS类名合并工具函数
 * @description 提供统一的CSS类名合并功能，结合clsx的条件类名处理和tailwind-merge的Tailwind CSS类名智能合并，解决类名冲突问题，提供更好的开发体验
 * @created 2025-10-21 11:00:10
 * @updated 2025-10-22 10:34:41
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// CSS类名合并工具函数，结合clsx和tailwind-merge，提供更好的类名合并体验
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
