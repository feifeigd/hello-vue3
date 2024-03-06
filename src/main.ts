
import "./style.css"

import { createApp } from 'vue'
import App from './App.vue'
// import App from './SimpleRouterApp'
import plugins from './plugins';
import { setupDirective } from "@/directive";
import { setupStore } from "@/store";
import router from "./router";

const app = createApp(App);

// 注册全局自定义指令
setupDirective(app);

// 注册全局状态管理
setupStore(app);

// 注册自定义插件
app.use(plugins);
app.use(router);

console.log("vue version:", app.version)
app.mount('#app');
