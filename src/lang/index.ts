import { createI18n, useI18n } from 'vue-i18n';

// 语言包
// import zhCnLocale from './zh-cn.json';
// import enLocale from './package/en.json';
// import vueI18n from '@intlify/vite-plugin-vue-i18n';
import { useAppStoreHook } from '@/store/modules/app';
import messages from '@intlify/unplugin-vue-i18n/messages'
const appStore = useAppStoreHook();

// const messages = {
//     'zh-cn': zhCnLocale,
//     en: enLocale,
// };

const i18n = createI18n({
    legacy: false,  // SyntaxError: Not available in legacy mode @see https://blog.csdn.net/sinat_36728518/article/details/123661673
    locale: appStore.language,
    fallbackLocale: 'zh-cn',
    globalInjection: true,   // 全局注册$t方法
    messages: messages,
    // localeDir: '@/lang/package',
    // fullInstall: true,
    
    // include: './**/*.{json,yaml,yml}',
});

console.log('i18n:', i18n);
export default i18n;
