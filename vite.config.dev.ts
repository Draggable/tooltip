import { defineConfig } from 'vite'
import type { UserConfigExport } from 'vite'
import { resolve } from 'node:path'
import { createHtmlPlugin } from 'vite-plugin-html'
import { patchCssModules } from 'vite-css-modules'
import { isProduction, pkgName, shortName, version } from './env.ts'

const config: UserConfigExport = defineConfig({
  root: 'src',
  base: isProduction ? `/${shortName}/` : '/',
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: isProduction ? '[hash:base64:8]' : '[local]_[hash:base64:5]',
    },
  },
  build: {
    target: 'esnext',
    cssMinify: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        demo: resolve(__dirname, 'src/index.html'),
      },
      output: {
        entryFileNames: '[name].min.js',
        chunkFileNames: '[name].min.js',
      },
    },
    outDir: '../dist',
    emptyOutDir: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  plugins: [
    createHtmlPlugin({
      minify: true,
      entry: 'js/demo.ts',
      template: 'index.html',
      inject: {
        data: {
          version: version,
        },
      },
    }),
    // patchCssModules({
    //   generateSourceTypes: true,
    // }),
  ],
  resolve: {
    alias: {
      [pkgName]: resolve(__dirname, 'src/js/index.ts'),
    },
  },
  server: {
    open: true,
    fs: {
      strict: false,
    },
  },
})

export default config
