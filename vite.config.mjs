import react from "@vitejs/plugin-react-swc"
import eslint from "vite-plugin-eslint2"
import svgr from "vite-plugin-svgr"
import {
  createAppConfig,
  createManualChunks,
} from "@somenergia/frontend-config/vite"

import pkg from "./package.json"

export default createAppConfig(({ mode }) => {
  const ovOptions =
    mode === "ov"
      ? {
          entryFileNames: "assets/main.js",
          chunkFileNames: ({ name }) => {
            return name.includes("vendor")
              ? "assets/[name].js"
              : "assets/[name]-[hash].js"
          },
          assetFileNames: ({ name }) => {
            return name.endsWith(".css")
              ? "assets/index.css" // Explicitly name the CSS file
              : "assets/[name]-[hash].[ext]"
          },
        }
      : {}

  return {
    resolve: {
      dedupe: Object.keys(pkg.dependencies),
    },
    define: {
      "import.meta.env.VITE_API_VERSION": JSON.stringify(pkg.apiVersion),
      "import.meta.env.VITE_APP_VERSION": JSON.stringify(pkg.version),
      "import.meta.env.VITE_APP_COMMIT_SHA": JSON.stringify(
        process.env.VITE_APP_COMMIT_SHA ||
          process.env.RAILWAY_GIT_COMMIT_SHA ||
          "",
      ),
    },
    plugins: [
      react(),
      svgr(),
      eslint({
        build: true,
        lintOnStart: true,
        emitWarning: false,
        cache: false,
        include: ["src/**/*.{js,jsx}"],
      }),
    ],
    build: {
      outDir: "forms",
      manifest: "asset-manifest.json",
      rollupOptions: {
        output: {
          ...ovOptions,
          manualChunks: createManualChunks([
            { chunk: "vendor-phone", includes: ["libphonenumber-js"] },
            { chunk: "vendor-forms", includes: ["formik", "/yup/"] },
            { chunk: "vendor-dnd", includes: ["@dnd-kit"] },
            { chunk: "vendor-lodash", includes: ["/lodash"] },
            { chunk: "vendor-stdnum", includes: ["stdnum"] },
          ]),
        },
      },
    },
    server: {
      deps: {
        inline: ["@emotion/styled", "@emotion/react"],
      },
    },
    preview: {
      open: false,
      allowedHosts: [".up.railway.app"],
    },
    test: {
      exclude: ["**/node_modules/**", "**/cypress/**"],
      setupFiles: "./src/tests/setupTests.js",
      coverage: {
        reporter: ["text", "json", "html"],
        exclude: [
          "**/node_modules/**",
          "**/forms/**",
          "**/coverage/**",
          "**/scripts/**",
          "**/public/**",
          "**/cypress/**",
        ],
      },
    },
  }
})
