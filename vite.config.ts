import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import path from 'path';

const getPath = _path => path.resolve(__dirname, _path)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/index.php': {
        target: 'http://devserver.anyremote.cn/',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
