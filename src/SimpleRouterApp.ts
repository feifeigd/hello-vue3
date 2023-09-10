import routes from './routes';
import {Component, Vue, toNative} from 'vue-facing-decorator';
import {defineAsyncComponent, getCurrentInstance, h, App, AsyncComponentLoader} from 'vue';

import { RouteRecordRaw, Router, createRouter, createWebHistory, useRouter } from "vue-router";

@Component
class SimpleRouterApp extends Vue{
    currentRoute = window.location.pathname;
    router!: Router

    created(){
        window.addEventListener('popstate', (e)=>{
            console.log("popstate ", e);
            this.currentRoute = window.location.pathname;
        });
        const internalInstance = getCurrentInstance();
        const context = internalInstance?.appContext;
        const app = context?.app;        
        app && this.registerGlobalAnsyncComponents(app);
        this.router = useRouter();
        console.log("window.location.pathname=", window.location.pathname, this.router.currentRoute);
    }

    render(){
        const component = this.ViewComponent();
        if(component)
            return h(component);
        return h(`${this.currentRoute} not found!`);
    }
    
    // 注册所有 page 
    registerGlobalAnsyncComponents(app: App) {
        console.log("registerGlobalAnsyncComponents", app);
        const modules = import.meta.glob(`./page/**/*.vue`);
        const routes: RouteRecordRaw[] = [];
        for (const path in modules) {
            console.log(path);
            const result = path.match(/.*\/(.+).vue$/);
            if(result){
                console.log(result);

                const name = result[1];
                console.log(name);
                const component = modules[path] as AsyncComponentLoader;
                console.log("path, name, component=", path, name, component)
                app.component(name, defineAsyncComponent(component));
                routes.push({
                    path: "/" + name,
                    name,
                    component,
                })
            }
        }
       
        const router = createRouter({
            history: createWebHistory(),
            routes,
        });

        app.use(router);
    }
    
    ViewComponent(){
        const matchingPage = routes[this.currentRoute] || '404';
        // return require(`./page/${matchingPage}.vue`).default;
        const internalInstance = getCurrentInstance();
        const page = internalInstance?.appContext.components[matchingPage];
        console.log("ViewComponent: ", this.currentRoute, matchingPage, page);
        return page;
    }
}
export default toNative(SimpleRouterApp);
