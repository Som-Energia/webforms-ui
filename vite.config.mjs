import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite'
import pkg from './package.json'

export default defineConfig(({ mode }) => {
  // Vite provides import.meta.env.BASE_URL from its 'base' parameter,
  // but, by default, it ignores that parameter from .env files
  // (not VITE_ prefixed).
  // Read it explicitly to have a mode dependant base.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), 'BASE_URL') }

  const ovOptions =
    mode === 'ov'
      ? {
          entryFileNames: 'assets/main.js',
          chunkFileNames: (fileInfo) => {
            if (fileInfo.name.includes('vendor')) {
              return 'assets/vendor.js' // Explicitly name the entry JS file
            }
            return 'assets/[name]-[hash].js'
          },
          assetFileNames: (assetInfo) => {
            if (
              assetInfo.name.endsWith('.css') &&
              assetInfo.name.includes('index')
            ) {
              return 'assets/index.css' // Explicitly name the CSS file
            }
            return 'assets/[name]-[hash].[ext]'
          }
        }
      : {}

  return {
    base: process.env.BASE_URL,
    resolve: {
      dedupe: Object.keys(pkg.dependencies)
    },
    plugins: [
      react(),
      splitVendorChunkPlugin()
      // TODO: to be activated after fixing the issues
      // eslint()
    ],
    build: {
      outDir: 'forms',
      manifest: 'asset-manifest.json',
      rollupOptions: {
        output: {
          ...ovOptions
        }
      },
      target: 'es2020'
    },
    server: {
      open: true,
      port: 3000
    },
    test: {
      globals: true,
      environment: 'jsdom',
      css: true,
      setupFiles: './src/tests/setupTests.js',
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: [
          '**/node_modules/**',
          '**/forms/**',
          '**/coverage/**',
          '**/scripts/**',
          '**/public/**'
        ]
      }
    }
  }
})
