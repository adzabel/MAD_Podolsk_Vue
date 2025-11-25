import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // add visualizer only when ANALYZE=true is set in environment
    ...(process.env.ANALYZE === 'true' ? [visualizer({ filename: 'dist/stats.html', open: false })] : [])
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue')) return 'vendor_vue'
            if (id.includes('pinia') || id.includes('vue-router')) return 'vendor_state'
            return 'vendor'
          }
          if (id.includes('/src/api/')) return 'api'
        }
      }
    }
  },
  // Относительные ссылки на бандл, чтобы статика подтягивалась корректно
  // при раздаче из произвольного корня на хостинге.
  base: './',
})
