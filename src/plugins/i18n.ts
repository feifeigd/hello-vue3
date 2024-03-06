import {App} from 'vue';

import i18n from '@/lang';

const install = (app: App<Element>, ...options: any) => {    
    // // vue 组件中访问 {{ $translate('greeting.hi') }}
    // app.config.globalProperties.$translate = (key: string) =>{
    //     return key.split('.').reduce((o, i)=>{if(o)return o[i]}, options)
    // };
    // // 缩写 {{ $t('greeting.hi') }}
    // app.config.globalProperties.$t = app.config.globalProperties.$translate;

    // app.provide('i18n', options);   // key, value
    app.use(i18n);
    console.log('i18n installed', options);
}

// app.use() 会调用 install 方法, use 第二个参数起会传给 install 的 options开始的参数
export default {install};
