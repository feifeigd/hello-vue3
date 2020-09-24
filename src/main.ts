import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);

// 注册全局自定义指令
// v-focus
app.directive('focus', {    
    mounted(el) {
        // Focus the element
        el.focus();
    } 
});
app.mount('#app');
