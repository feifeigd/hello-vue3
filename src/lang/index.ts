import { createI18n } from 'vue-i18n';

// 语言包
import zhCnLocale from './package/zh-cn';
import enLocale from './package/en';

import { useAppStoreHook } from '@/store/modules/app';

const appStore = useAppStoreHook();

const messages = {
    'zh-cn': zhCnLocale,
    en: enLocale,
};

const i18n = createI18n({
    locale: appStore.language,
    fallbackLocale: 'zh-cn',
    globalInjection: true,
    messages,
});

export default i18n;
