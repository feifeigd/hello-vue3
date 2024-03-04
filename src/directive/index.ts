import type { App } from "vue";

import { hasPerm } from "./permission";

export function setupDirective(app: App<Element>){
    // 使用 v-hasPerm 在所有组件中都可用
    app.directive("hasPerm", hasPerm);
}
