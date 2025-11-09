import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@claude-viz/shared': path.resolve(__dirname, '../shared/src/index.ts'),
    },
  },
  optimizeDeps: {
    include: ['@claude-viz/shared'],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3456',
        changeOrigin: true,
      },
    },
  },
});
