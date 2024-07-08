import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json'

export default defineConfig({
  resolve: {
    dedupe: Object.keys(pkg.dependencies)
  },
  plugins: [
    react()
    // TODO: to be activated after fixing the issues
    // eslint()
  ],
  build: {
    outDir: 'build',
    manifest: 'asset-manifest.json',
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    },
    target: "es2020",
  },
  server: {
    open: true,
    port: 3000
  },
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: './src/tests/setupTests.js'
  }
})
