/**
 * @fileoverview Vite构建配置文件
 * @description Vite构建工具的配置文件，包含完整的DDD架构路径别名、开发服务器设置和生产构建优化。
 * 支持TypeScript、React，并实现了复杂的模块解析策略以确保干净的导入。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.2.0
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

/**
 * Vite配置对象
 *
 * 配置包括：
 * - React插件用于JSX和Fast Refresh
 * - 遵循DDD架构的完整路径别名
 * - 开发服务器设置
 * - 具有手动分块的生产构建优化
 */
export default defineConfig({
  plugins: [react(), tsconfigPaths({ projects: ['./tsconfig.json'] })],
  resolve: {
    alias: {
      // 根目录别名
      '@': path.resolve(__dirname, './src'),

      // DDD架构主要层级别名
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

      // 高频使用的子目录别名（基于项目实际需求）
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@application/hooks': path.resolve(__dirname, './src/application/hooks'),
      '@application/stores': path.resolve(
        __dirname,
        './src/application/stores'
      ),
      '@application/services': path.resolve(
        __dirname,
        './src/application/services'
      ),
      '@domain/services': path.resolve(__dirname, './src/domain/services'),
      '@domain/entities': path.resolve(__dirname, './src/domain/entities'),
      '@domain/value-objects': path.resolve(
        __dirname,
        './src/domain/value-objects'
      ),
      '@domain/events': path.resolve(__dirname, './src/domain/events'),
      '@infrastructure/api': path.resolve(
        __dirname,
        './src/infrastructure/api'
      ),
      '@infrastructure/repositories': path.resolve(
        __dirname,
        './src/infrastructure/repositories'
      ),
      '@infrastructure/storage': path.resolve(
        __dirname,
        './src/infrastructure/storage'
      ),
      '@presentation/router': path.resolve(
        __dirname,
        './src/presentation/router'
      ),

      // 静态资源别名
      '@assets': path.resolve(__dirname, './src/assets'),
      '@fonts': path.resolve(__dirname, './src/assets/fonts'),
      '@images': path.resolve(__dirname, './src/assets/images'),
      '@icons': path.resolve(__dirname, './src/assets/icons'),
      '@styles': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
})
