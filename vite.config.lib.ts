import path from 'node:path'
import { defineConfig } from 'vite'
import type { UserConfigExport } from 'vite'
import banner from 'vite-plugin-banner'
import compression from 'vite-plugin-compression'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dts from 'vite-plugin-dts'

import { bannerTemplate, camelCaseName, isProduction, shortName } from './env'

const config: UserConfigExport = defineConfig({
  root: './',
  plugins: [
    cssInjectedByJsPlugin(),
    banner(bannerTemplate),
    compression({
      algorithm: 'brotliCompress',
      ext: '.gz',
    }),
    dts({
      insertTypesEntry: true,
    }),
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
      scopeBehaviour: 'local',
      generateScopedName: isProduction ? '[hash:base64:8]' : 'st_[local]_[hash:base64:5]',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: 'src/js/index.ts',
      name: camelCaseName,
      formats: ['es', 'cjs', 'umd', 'iife'],
      fileName: format => `${shortName}.${format}.min.js`,
    },
    cssMinify: true,
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/js/index.ts'),
      },
      output: {
        banner: bannerTemplate,
        exports: 'named',
        inlineDynamicImports: true,
      },
    },
    sourcemap: isProduction ? false : 'inline',
  },
  resolve: {
    extensions: ['.js', '.json', '.ts'],
  },
})

export default config
