import { createApp } from 'vue'
//import App from './App.vue'
import App from './SimpleRouterApp'
import i18n from './plugins/i18n';
const app = createApp(App);

// 注册全局自定义指令
// v-focus
app.directive('focus', {    
    mounted(el) {
        // Focus the element
        el.focus();
    } 
});
const i18nStrings = {
    greeting: {
        hi: 'Hello!',
    }
};
app.use(i18n, i18nStrings);
app.mount('#app');
