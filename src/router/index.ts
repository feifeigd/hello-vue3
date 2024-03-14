import { RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router";

// export default {
//     '/': 'Home',
//     '/about': 'About',
// } as {[key:string]: string};

const Layout = () => import("@/layout/index.vue");

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "Home",
        component: Layout,
    },
    // {
    //     path: "/about",
    //     name: "About",
    //     component: () => import("@/views/About.vue"),
    // },
    {
        path: "/login",
        name: "Login",
        component: () => import("@/views/Login.vue"),
    },
    // {
    //     path: "/:catchAll(.*)",
    //     name: "NotFound",
    //     component: () => import("@/views/NotFound.vue"),
    // },
];

// 创建路由
const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes: constantRoutes,
    scrollBehavior(/*to, from, savedPosition*/) {
        // always scroll to top. 刷新时，滚动条位置还原到顶部
        return { left: 0, top: 0 };
    },
});

// 重置路由
export function resetRouter(){
    router.replace({path: "/login"});
}

export default router;
