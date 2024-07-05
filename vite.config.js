///<reference types='vitest'/>
///<reference types='vite/client'/>

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
    // TODO: to be activated after fixing the issues
    // eslint()
  ],
  server: {
    open: true,
    port: 3000,
  },
  test:{
    globals: true,
    environment: "jsdom",
    css: true,
    setupFiles: './src/tests/setupTests.js'
  }
})