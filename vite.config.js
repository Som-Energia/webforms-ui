///<reference types='vitest'/>
///<reference types='vite/client'/>

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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