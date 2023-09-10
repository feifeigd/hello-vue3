import routes from './routes';
import {Component, Vue} from 'vue-facing-decorator';
import {defineAsyncComponent, getCurrentInstance, h, VueApp} from 'vue';

import { defineAsyncComponent } from 'vue'

@Component
export default class extends Vue{
    currentRoute = window.location.pathname;

    created(){
        window.addEventListener('popstate', ()=>{
            this.currentRoute = window.location.pathname;
        });
        const internalInstance = getCurrentInstance();
        const context = internalInstance.appContext;
        this.registerGlobalAnsyncComponents(context.app);
    }

    render(){
        return h(this.ViewComponent());
    }
    
    // 注册所有 page 
    registerGlobalAnsyncComponents(app:VueApp) {
        console.log("registerGlobalAnsyncComponents", app);
        const modules = import.meta.glob(`./page/**/*.vue`);
        for (const path in modules) {
            console.log(path);
            const result = path.match(/.*\/(.+).vue$/);
            if(result){
                const name = result[1];
                console.log(name);
                const component = modules[path];
                app.component(name, defineAsyncComponent(component));
            }
        }
    }

    ViewComponent(){
        const matchingPage = routes[this.currentRoute] || '404';
        // return require(`./page/${matchingPage}.vue`).default;
        const internalInstance = getCurrentInstance();
        console.log("ViewComponent: ", this.currentRoute, matchingPage);
        const page = internalInstance.appContext.components[matchingPage];
        return page;
    }
}
