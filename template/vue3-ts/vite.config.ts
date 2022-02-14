import { loadEnv, defineConfig } from 'vite'
import path from 'path'
import config from './build/config'
import { createProxy } from './build/proxy'
import { wrapperEnv } from './build/utils'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VueUseComponentsResolver } from 'unplugin-vue-components/resolvers'
import OptimizationPersist from 'vite-plugin-optimize-persist'
import PkgConfig from 'vite-plugin-package-config'
import svgLoader from 'vite-svg-loader'

// 重新启用插件 vite-plugin-style-import 的原因见 Issue：https://github.com/antfu/unplugin-vue-components/issues/301
// 对于 ElMessage 组件的第一次扫描失效，只有手动进入了页面才会加载
// TODO: 何时问题解决，何时移除插件
// import styleImport, { ElementPlusResolve } from 'vite-plugin-style-import'

const resolve = (...args) => path.resolve(__dirname, ...args)

// https://vitejs.dev/config/
export default defineConfig((env) => {
  const envs = loadEnv(env.mode, process.cwd())

  const viteEnv = wrapperEnv(envs)

  const { VITE_PORT } = viteEnv

  return {
    plugins: [
      vue({
        include: [/\.vue$/, /\.md$/], // <--
      }),
      svgLoader(),
      AutoImport({
        dts: 'src/auto-imports.d.ts',
        imports: ['vue', 'pinia', 'vue-router', '@vueuse/core'],
        /**
         * UI组件库参考
         * https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/antdv.ts
         */
        resolvers: [],
      }),
      Components({
        dts: 'src/components.d.ts',
        dirs: ['src/components/'],
        // 哪些文件需要自动按需引入
        extensions: ['vue'],
        resolvers: [VueUseComponentsResolver()],
      }),
      // styleImport({
      //   resolves: [ElementPlusResolve()],
      // }),
      PkgConfig(),
      OptimizationPersist(),
    ],
    server: {
      host: true,
      port: VITE_PORT,
      proxy: createProxy(config.proxy),
    },
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    build: {
      brotliSize: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000,
      // 在生产环境移除console.log
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      assetsDir: 'static/assets',
      // 静态资源打包到dist下的不同目录
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    css: {
      preprocessorOptions: {
        // 全局引入了 scss 的文件
        scss: {
          additionalData: `
          @import "@/assets/styles/variables.scss";
        `,
          javascriptEnabled: true,
        },
      },
    },
  }
})
