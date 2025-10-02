import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/components/atoms': path.resolve(__dirname, './src/presentation/components/atoms'),
      '@/components/molecules': path.resolve(__dirname, './src/presentation/components/molecules'),
      '@/components/templates': path.resolve(__dirname, './src/presentation/components/templates'),
      '@/components/organisms': path.resolve(__dirname, './src/presentation/components/organisms'),
      '@/components/guards': path.resolve(__dirname, './src/presentation/components/guards'),
      '@/components': path.resolve(__dirname, './src/presentation/components'),
      '@/pages': path.resolve(__dirname, './src/presentation/pages'),
      '@/hooks': path.resolve(__dirname, './src/application/hooks'),
      '@/stores': path.resolve(__dirname, './src/application/stores'),
      '@/services': path.resolve(__dirname, './src/application/services'),
      '@/application': path.resolve(__dirname, './src/application'),
      '@/presentation': path.resolve(__dirname, './src/presentation'),
      '@/domain': path.resolve(__dirname, './src/domain'),
      '@/infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query']
        }
      }
    }
  }
})