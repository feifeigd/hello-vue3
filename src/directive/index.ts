import type { App } from "vue";

import { hasPerm } from "./permission";

export function setupDirective(app: App<Element>){
    
    // v-focus
    app.directive('focus', {    
        mounted(el) {
            // Focus the element
            el.focus();
        } 
    });

    // 使用 v-hasPerm 在所有组件中都可用
    app.directive("hasPerm", hasPerm);
}
