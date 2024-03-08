
import type { App } from 'vue';
import { createPinia } from 'pinia';

// 状态管理
const store = createPinia();    // 根 store

// 全局注册 store
export function setupStore(app: App){
    app.use(store);
}

export * from "./modules/app";
export * from "./modules/permission";
export * from "./modules/settings";
export * from "./modules/tagsView";
export * from "./modules/user";

export { store };
