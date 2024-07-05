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
          const filePath = path.join(pathPrefix, value.fileName)
          manifest.files[value.fileName] = filePath

          // Identify entry points
          if (value.isEntry) {
            manifest.entrypoints.push(value.fileName);
          }
          // Ensure CSS entry is included only once
          const cssFile = Object.values(bundle).find(asset => asset.fileName === 'assets/main.css');
          if (cssFile) {
            if (!manifest.entrypoints.includes(cssFile.fileName)) {
              manifest.entrypoints.push(cssFile.fileName)
            }
          }
        }
      }

      this.emitFile({
        type: 'asset',
        fileName: 'asset-manifest.json',
        source: JSON.stringify(manifest, null, 2)
      })
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
    outDir: 'build',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/main.js', // Explicitly name the entry JS file
        chunkFileNames: 'assets/[name].js', // Name for chunk JS files (if any)
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/main.css'; // Explicitly name the CSS file
          }
          return 'assets/[name].[ext]';
        }
      }
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
