import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

import {ElementPlusResolver} from 'unplugin-vue-components/resolvers';
import Icons from 'unplugin-icons/vite';
import IconsResoler from 'unplugin-icons/resolver';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

import { resolve } from 'path';

const pathSrc = resolve(__dirname, "src");
console.log(resolve(pathSrc, 'assets/icons'));

// https://vitejs.dev/config/
export default defineConfig(({mode}: ConfigEnv)=>{
  const env = loadEnv(mode, process.cwd());
  console.log('mode:', mode, env);

  return {
    build: {
      // 生成 manifest.json 
      manifest: true,
    },
    
    css: {
      // css预处理器
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
          javascriptEnabled: true,
        },
      },
    },

    // 插件
    plugins: [
      // 自动导入参考： https://github.com/sxzz/element-plus-best-practices/blob/main/vite.config.ts
      AutoImport({
        // 自动导入 Vue 相关函数，如 ref reactive 等
        imports: [
          "@vueuse/core", 
          "pinia", 
          'vue', "vue-i18n", "vue-router", 
          {
            "vue": [
              // Duplicated imports "Component", the one from "vue" has been ignored and "vue-facing-decorator" is used
              // ["Component", false, ],  // 不用导入 vue的 Component。目前还不支持这种写法
            ],
            "vue-facing-decorator": [
              "Component",
              "Inject",
              "toNative",
              "Vue",
            ]
          },
        ],
        // 自动导入 Element Plus 组件
        resolvers: [
          ElementPlusResolver(),
          IconsResoler(),
        ],
        eslintrc: {
          enabled: true,
          filepath: "./eslintrc-auto-import.json",  // 没有自动导入的话，写在这里即可导入
          globalsPropValue: true,
        },
        vueTemplate: true,
        dts: 'src/typings/auto-imports.d.ts',
        
      }),

      Components({
        extensions: ['vue', 'ts'],  // 组件的有效文件扩展名
        // 自定义组件的解析器
        resolvers: [
          ElementPlusResolver(),
          IconsResoler({enabledCollections: ['ep']}),  // 只导入 mdi 图标
        ],
        // 指定自定义组件的路径(默认为 'src/components')
        dirs: [`${pathSrc}/components`, `${pathSrc}/**/components`],
        dts: 'src/typings/components.d.ts',
      }),

      createSvgIconsPlugin({
        // 指定图标目录, 图标文件放在该目录下
        iconDirs: [resolve(pathSrc, 'assets/icons')],
        // 指定生成的组件名
        symbolId: 'icon-[dir]-[name]',
      }),

      Icons({
        autoInstall: true,
        compiler: 'vue3',
      }),
      vue(),
      VueI18nPlugin({
        include: [resolve(pathSrc, 'lang/package/**/*.{json,yaml,yml}')],
        
        // jitCompilation: true,
      })
    ],

    // 预加载项目必需的组件
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
      ],
    },
    
    resolve: {
      alias: {
        "@": pathSrc,
      },
    },

    server: {
      host: '0.0.0.0',
      // port: Number(env.VITE_PORT) || 3000,
      // open: true,  // 自动打开浏览器
      // 代理
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), ''),
        },

        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
});

