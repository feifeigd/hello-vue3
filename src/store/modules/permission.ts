import { RouteRecordRaw } from 'vue-router';
import { store } from '..';

import { listRoutes } from '@/api/menu';

const modules = import.meta.glob('@/views/**/*.vue') as Record<string, any>;

const Layout = () => import('@/layout/index.vue');

/**
 * use meta.role to determine if the current user has permission
 * @param roles 
 * @param route 
 * @returns 
 */
function hasPermission(roles: string[], route: RouteRecordRaw) {
    if(route.meta?.roles){
        if(roles.includes("ROOT"))
            return true;
        return roles.some(role => route.meta.roles.includes(role));
    }
    return false;
};

/**
 * 递归过滤有权限的异步(动态)路由
 * @param routes 
 * @param roles 
 * @returns 
 */
function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]){
    const asyncRoutes: RouteRecordRaw[] = [];

    routes.forEach(route => {
        const tmpRoute = { ...route };   // 拷贝
        if(!route.name)
            tmpRoute.name = route.path;

        if(hasPermission(roles, tmpRoute)){
            if(tmpRoute.component?.toString() == "Layout"){
                tmpRoute.component = Layout;
            }else {
                const componentPath = tmpRoute.component as string;
                const component = modules[`@/views${componentPath}.vue`];
                if(component){
                    tmpRoute.component = component;
                }
            }
            
            if(tmpRoute.children){
                tmpRoute.children = filterAsyncRoutes(tmpRoute.children, roles);
            }
            asyncRoutes.push(tmpRoute);
        }
    });

    return asyncRoutes;
}

// setup
export const usePermissionStore = defineStore("permission", ()=>{

    // state
    // 混合模式左侧菜单
    const mixLeftMenus = ref<RouteRecordRaw[]>([]);
    const routes = ref<RouteRecordRaw[]>([]);

    // actions
    // 生成路由
    function generateRoutes(roles: string[]){
        return new Promise<RouteRecordRaw[]>((resolve, reject)=>{
            // 接口获取所有路由
            listRoutes().then(({data: asyncRoutes})=>{                
                    const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
                    setRoutes(accessedRoutes);
                    resolve(accessedRoutes);
                }).catch( (error: Error)=> {
                    reject(error);
                });        
        });
    }

    function setMixLeftMenus(topMenuPath: string){
        const matchedItem = routes.value.find((item)=>item.path === topMenuPath);
        if(matchedItem && matchedItem.children){
            mixLeftMenus.value = matchedItem.children;
        }
    }

    function setRoutes(newRoutes: RouteRecordRaw[]){
        routes.value = newRoutes;
    }

    return {
        mixLeftMenus,
        routes,

        generateRoutes,
        setMixLeftMenus,
        setRoutes,
    };
});

// 非setup
export function usePermissionStoreHook(){
    return usePermissionStore(store);
}
