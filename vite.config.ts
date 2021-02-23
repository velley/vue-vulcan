import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import path from 'path';

const getPath = _path => path.resolve(__dirname, _path)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'packages/index.ts'),
      name: 'vueVulcan'
    },
    rollupOptions: {
      // 请确保外部化那些你的库中不需要的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        }
      },
      plugins: [ // 打包插件
        resolve(), // 查找和打包node_modules中的第三方模块
        commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
        typescript({
          "declaration": true, // 生成定义文件
          tsconfig: getPath('./tsconfig.json'), // 导入本地ts配置
        }), // 解析TypeScript      
      ]
    }
  }
})