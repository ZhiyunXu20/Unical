import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Relative base: the built files work from any sub-path, e.g.
// https://zhiyunxu20.github.io/projects/unical/ or /Unical/.
export default defineConfig({
  base: process.env.BASE_PATH || './',
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        // Jekyll (GitHub Pages) ignores files starting with "_": avoid them.
        entryFileNames: 'assets/app-[hash].js',
        chunkFileNames: 'assets/chunk-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
})
