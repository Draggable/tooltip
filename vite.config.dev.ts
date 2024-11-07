import { defineConfig, UserConfigExport } from 'vite'
import { resolve } from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import { isProduction, pkgName, shortName, version } from './env'

const config: UserConfigExport = defineConfig({
  root: 'src',
  base: isProduction ? `/${shortName}/` : '/',
  build: {
    rollupOptions: {
      input: {
        demo: resolve(__dirname, 'src/index.html'),
      },
      output: {
        entryFileNames: '[name].min.js',
        chunkFileNames: '[name].min.js',
      },
    },
    outDir: 'dist',
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
