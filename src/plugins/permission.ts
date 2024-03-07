
import router from "@/router";
import { usePermissionStore, useUserStore } from "@/store";
import NProgress from "@/utils/nprogress";

function install(){
    // 白名单路由
    const whiteList = ["/login", "/404", "/401"];

    router.afterEach(() => {
        NProgress.done();
    });

    router.beforeEach(async(to, from, next) => {
        NProgress.start();
        
        // 获取token
        const hasToken = localStorage.getItem("token");
        if (hasToken) {
            if (to.path === "/login") {
                // 如果已登录，则直接跳转到首页
                next({ path: "/" });
                NProgress.done();
            } else {
                const userStore = useUserStore();
                const hasRoles = userStore.user.roles.length > 0;
                if (hasRoles) {
                    // 未匹配到路由，跳转 404
                    if (to.matched.length === 0) {
                        from.name? next({name: from.name}) : next("/404");
                    }else{
                        next();
                    }
                } else {
                    const permissionStore = usePermissionStore();

                    try {
                        // 获取用户信息
                        const { roles } = await userStore.getUserInfo();
                        // 获取用户菜单, 动态路由
                        const accessRoutes = await permissionStore.generateRoutes(roles);
                        accessRoutes.forEach((route) => {
                            router.addRoute(route);
                        });
                        next({ ...to, replace: true });
                    } catch (error) {
                        // 移除token并跳转到登录页重新登录
                        await userStore.resetToken();
                        next(`/login?redirect=${to.path}`);
                        NProgress.done();
                    }
                }
            }
        } else {
            if ( whiteList.includes(to.path)) {
                next(); // 在免登录白名单，直接进入
            } else {
                next(`/login?redirect=${to.path}`);
                NProgress.done();
            }
        }
    });
}

export default {
    install,
}
