/**
 * @fileoverview Vitest测试环境设置文件
 * @description 配置测试环境，包括DOM测试库和全局测试工具
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// 每个测试后自动清理
afterEach(() => {
  cleanup()
})

// 扩展expect断言
expect.extend({})
