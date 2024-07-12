import { defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react'
import pkg from './package.json'
import { splitVendorChunkPlugin } from 'vite'

export default defineConfig(({mode}) => {
  // Vite provides import.meta.env.BASE_URL from its 'base' parameter,
  // but, by default, it ignores that parameter from .env files
  // (not VITE_APP_ prefixed).
  // Read it explicitly to have a mode dependant base.
  process.env = {...process.env, ...loadEnv(mode, process.cwd(), 'BASE_URL')}
  return {
    base: process.env.BASE_URL,
    resolve: {
      dedupe: Object.keys(pkg.dependencies)
    },
    plugins: [
      react(),
      splitVendorChunkPlugin(),
      // TODO: to be activated after fixing the issues
      // eslint()
    ],
    build: {
      outDir: 'build',
      manifest: 'asset-manifest.json',
      rollupOptions: {
        output: {
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
  }
})
