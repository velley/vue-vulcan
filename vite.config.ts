import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import path from 'path';

const getPath = _path => path.resolve(__dirname, _path)

// https://vitejs.dev/config/
// 目前vite仅用于运行demo，构建打包请直接执行rollup命令
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
