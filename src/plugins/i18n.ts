import {App} from 'vue';

 const install = (app: App, options: any) => {
    app.config.globalProperties.$translate = (key: string) =>{
        return key.split('.').reduce((o, i)=>{if(o)return o[i]}, options)
    };
    app.config.globalProperties.$t = app.config.globalProperties.$translate;
    app.provide('i18n', options);
}
export default {install};
