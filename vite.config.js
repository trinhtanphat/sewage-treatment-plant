import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { loadEnv } from 'vite';
import * as path from 'path';

// export default 的定义函数
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd()) // 推荐使用 process.cwd()
  return {
    // 插件配置
    plugins: [
      vue(), // 使用 Vue 插件
      Components({
        resolvers: [AntDesignVueResolver({
          importStyle: 'less' // 指定 Ant Design Vue 样式以 less 格式引入
        })],
      }),
    ],
    // 公共路径配置，适合打包后的相对路径
    base: env.VITE_MODE === 'production' ? '/sewage/' : '/', // Vite 中使用 'base' 而不是 'publicPath'
    resolve: {
      // 配置路径别名
      alias: {
        '/@': path.resolve(__dirname, 'src'), // 将 '/@' 映射到 'src' 目录
      }
    },
    build: {
      sourcemap: false, // 不生成 source map
      terserOptions: {
        compress: {
          // 打包时清除 console 和 debug 相关代码
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  }
})
