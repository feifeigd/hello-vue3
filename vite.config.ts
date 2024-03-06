import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

import {ElementPlusResolver} from 'unplugin-vue-components/resolvers';
import Icons from 'unplugin-icons/vite';
import IconsResoler from 'unplugin-icons/resolver';

import { resolve } from 'path';

const pathSrc = resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig(()=>{

  return {
    build: {
      // 生成 manifest.json 
      manifest: true,
    },

    // 插件
    plugins: [
      vue(),
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
        // eslintrc: {
        //   enabled: false,
        //   filepath: "./eslintrc-auto-import.json",
        //   globalsPropValue: true,
        // },
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
  }
});

