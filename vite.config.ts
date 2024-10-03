import { resolve } from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// const rootDir = resolve(__dirname);
// const outDir = resolve(rootDir, '..', 'dist');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        // notification: resolve(__dirname, 'notification.js'),
      }
    }
  }
  // publicDir: resolve(rootDir, 'public'),
  // build: {
  //   lib: {
  //     formats: ['iife'],
  //     entry: resolve(__dirname, 'src/features/Notification.ts'),
  //     name: 'BackgroundScript',
  //     fileName: 'background',
  //   },
  //   outDir,
  //   emptyOutDir: false,
  //   rollupOptions: {
  //     external: ['chrome'],
  //   },
  // },
})
