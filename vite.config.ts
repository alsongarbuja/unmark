import { resolve } from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  // build: {
  //   rollupOptions: {
  //     input: [
  //       "src/manifest.json",
  //     ]
  //   }
  // },
  plugins: [react()],
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
