/**
 * @fileoverview Vitest测试配置文件
 * @description Vitest测试框架的配置文件，包含测试环境、覆盖率和路径别名设置
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [react(), tsconfigPaths({ projects: ['./tsconfig.json'] })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@presentation': path.resolve(__dirname, './src/presentation'),
      '@components': path.resolve(__dirname, './src/presentation/components'),
      '@pages': path.resolve(__dirname, './src/presentation/pages'),
      '@domain': path.resolve(__dirname, './src/domain'),
      '@application': path.resolve(__dirname, './src/application'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@tokens': path.resolve(__dirname, './src/tokens'),
      '@data': path.resolve(__dirname, './src/data'),
      '@types': path.resolve(__dirname, './src/types'),
      '@types-movie': path.resolve(__dirname, './src/types/movie.types'),
      '@types-unified': path.resolve(__dirname, './src/types/unified-interfaces.types'),
      '@types-pagination': path.resolve(__dirname, './src/types/pagination.types'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@application/hooks': path.resolve(__dirname, './src/application/hooks'),
      '@application/stores': path.resolve(__dirname, './src/application/stores'),
      '@application/services': path.resolve(__dirname, './src/application/services'),
      '@domain/services': path.resolve(__dirname, './src/domain/services'),
      '@domain/entities': path.resolve(__dirname, './src/domain/entities'),
      '@domain/value-objects': path.resolve(__dirname, './src/domain/value-objects'),
      '@domain/events': path.resolve(__dirname, './src/domain/events'),
      '@infrastructure/api': path.resolve(__dirname, './src/infrastructure/api'),
      '@infrastructure/repositories': path.resolve(__dirname, './src/infrastructure/repositories'),
      '@infrastructure/storage': path.resolve(__dirname, './src/infrastructure/storage'),
      '@presentation/router': path.resolve(__dirname, './src/presentation/router'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@fonts': path.resolve(__dirname, './src/assets/fonts'),
      '@images': path.resolve(__dirname, './src/assets/images'),
      '@icons': path.resolve(__dirname, './src/assets/icons'),
      '@styles': path.resolve(__dirname, './src'),
    },
  },
})
