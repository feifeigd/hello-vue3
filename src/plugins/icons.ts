import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { App } from "vue";

function install(app: App<Element>) {
    console.log('install plugin: icon');
    for(const [key, component] of Object.entries(ElementPlusIconsVue)){
        // console.log(key, component);
        app.component(key, component);
    }
}
export default { install };
