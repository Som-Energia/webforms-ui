import react from '@vitejs/plugin-react-swc'
// import eslint from 'vite-plugin-eslint2'
import svgr from 'vite-plugin-svgr'
import {
  createAppConfig,
  createManualChunks,
} from '@somenergia/frontend-config/vite'

import pkg from './package.json'

export default createAppConfig((mode) => {
  const ovOptions =
    mode === 'ov'
      ? {
          entryFileNames: 'assets/main.js',
          chunkFileNames: ({ name }) => {
            return name.includes('vendor')
              ? 'assets/vendor.js' // Explicitly name the entry JS file
              : 'assets/[name]-[hash].js'
          },
          assetFileNames: ({ name }) => {
            return name.endsWith('.css') && name.includes('index')
              ? 'assets/index.css' // Explicitly name the CSS file
              : 'assets/[name]-[hash].[ext]'
          },
        }
      : {}

  return {
    resolve: {
      dedupe: Object.keys(pkg.dependencies),
    },
    plugins: [react(), svgr() /*eslint({ build: true, emitWarning: false })*/],
    build: {
      outDir: 'forms',
      manifest: 'asset-manifest.json',
      rollupOptions: {
        output: {
          ...ovOptions,
          manualChunks: createManualChunks([
            { chunk: 'vendor-phone', includes: ['libphonenumber-js'] },
            { chunk: 'vendor-forms', includes: ['formik', '/yup/'] },
            { chunk: 'vendor-dnd', includes: ['@dnd-kit'] },
            { chunk: 'vendor-lodash', includes: ['/lodash'] },
            { chunk: 'vendor-stdnum', includes: ['stdnum'] },
          ]),
        },
      },
    },
    server: {
      deps: {
        inline: ['@emotion/styled', '@emotion/react'],
      },
    },
    test: {
      exclude: ['**/node_modules/**', '**/cypress/**'],
      setupFiles: './src/tests/setupTests.js',
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: [
          '**/node_modules/**',
          '**/forms/**',
          '**/coverage/**',
          '**/scripts/**',
          '**/public/**',
          '**/cypress/**',
        ],
      },
    },
  }
})
