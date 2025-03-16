import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  root: resolve(__dirname),
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      'vue-heic-image': resolve(__dirname, '../src'),
    },
  },
  build: {
    outDir: resolve(__dirname, '../dist'),
    emptyOutDir: true,
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
}); 