import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'
import eslint from 'vite-plugin-eslint2'
import svgr from 'vite-plugin-svgr'

import pkg from './package.json'

/**
 * Splitting vendor chunks manually
 */
const vendorChunks = [
  { chunk: 'vendor-mui', includes: ['@mui', '@emotion'] },
  {
    chunk: 'vendor-react',
    includes: [
      '/node_modules/react/',
      '/node_modules/react-dom/',
      '/node_modules/react-router',
    ],
  },
  {
    chunk: 'vendor-charts',
    includes: [
      '/recharts/',
      '/d3-',
      '/react-smooth/',
      '/recharts-scale/',
      '/decimal.js-light/',
    ],
  },
  { chunk: 'vendor-phone', includes: ['libphonenumber-js'] },
  { chunk: 'vendor-i18n', includes: ['i18next', 'react-i18next'] },
  { chunk: 'vendor-forms', includes: ['formik', '/yup/'] },
  { chunk: 'vendor-dnd', includes: ['@dnd-kit'] },
  { chunk: 'vendor-lodash', includes: ['/lodash'] },
  { chunk: 'vendor-stdnum', includes: ['stdnum'] },
  { chunk: 'vendor-somenergia', includes: ['@somenergia'] },
]

function manualChunks(id) {
  if (!id.includes('node_modules')) return
  const match = vendorChunks.find(({ includes }) =>
    includes.some((pkg) => id.includes(pkg)),
  )
  return match ? match.chunk : 'vendor'
}

export default defineConfig(({ mode, command }) => {
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
          },
        }
      : {}

  return {
    base: process.env.BASE_URL,
    resolve: {
      dedupe: Object.keys(pkg.dependencies),
    },
    plugins: [
      react(),
      svgr(),
      command === 'build' && eslint({ emitWarning: false, failOnError: true }),
    ],
    build: {
      outDir: 'forms',
      manifest: 'asset-manifest.json',
      rollupOptions: {
        output: {
          ...ovOptions,
          manualChunks,
        },
      },
      target: 'es2020',
    },
    server: {
      open: true,
      port: 3000,
      deps: {
        inline: ['@emotion/styled', '@emotion/react'],
      },
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
          '**/public/**',
        ],
      },
    },
  }
})
