import path from 'path'
import { defineConfig, UserConfigExport } from 'vite'
import banner from 'vite-plugin-banner'
import compression from 'vite-plugin-compression'
import { bannerTemplate, camelCaseName, isProduction, shortName } from './env'


const config: UserConfigExport = defineConfig({
  plugins: [
    banner(bannerTemplate),
    compression({
      algorithm: 'brotliCompress',
      ext: '.gz',
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: 'src/index.ts',
      name: camelCaseName,
      formats: ['es', 'cjs', 'umd', 'iife'],
      fileName: format => `${shortName}.${format}.min.js`,
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        banner: bannerTemplate,
      },
    },
    sourcemap: isProduction ? false: 'inline',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.json', '.ts'],
  }
})


export default config
