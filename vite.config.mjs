import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function customManifestPlugin() {
  return {
    name: 'custom-manifest',
    generateBundle(options, bundle) {
      const manifest = { files: {}, entrypoints: [] };
      const pathPrefix = '/wp-content/plugins/react-wordpress/webforms/build/';

      for (const [key, value] of Object.entries(bundle)) {
        if (value.type === 'asset' || value.type === 'chunk') {
          const filePath = path.join(pathPrefix, value.fileName);
          manifest.files[value.fileName] = filePath;

          // Identify main entry points
          if (value.isEntry) {
            manifest.entrypoints.push(value.fileName);
          } else if (key.endsWith('.js') || key.endsWith('.css')) {
            if (key.includes('main')) {
              manifest.entrypoints.push(value.fileName);
            }
          }
        }
      }

      this.emitFile({
        type: 'asset',
        fileName: 'asset-manifest.json',
        source: JSON.stringify(manifest, null, 2)
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    customManifestPlugin(),
    // TODO: to be activated after fixing the issues
    // eslint()
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
    },
  },
  server: {
    open: true,
    port: 3000,
  },
  test: {
    globals: true,
    environment: "jsdom",
    css: true,
    setupFiles: './src/tests/setupTests.js'
  }
});
