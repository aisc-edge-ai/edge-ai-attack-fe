import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    hmr: {
      path: '/edge-ai-vite-hmr',
      clientPort: 80,
    },
    watch: {
      usePolling: true,
      interval: 300,
    },
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/models': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/dashboard': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/attack': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/datasets': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/results': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/static': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/artifacts': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
      },
    },
  },
  preview: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/models': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/dashboard': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/attack': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/datasets': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/results': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/static': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/artifacts': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
      },
    },
  },
})
