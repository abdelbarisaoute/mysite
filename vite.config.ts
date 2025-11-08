import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/mysite/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'katex': ['katex'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'dompurify': ['dompurify']
        }
      }
    }
  }
});
