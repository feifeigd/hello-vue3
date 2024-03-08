
<!-- 混合布局菜单(top) -->
<template>
    <el-scrollbar>
        <el-menu
            mode="horizontal"
            :active-text-color="variables['menu-active-text']"
            :background-color="variables['menu-background']"
            :default-active="activePath"
            :text-color="variables['menu-text']"
            @select="handleMenuSelect"
        >
            <el-menu-item
                v-for="route in mixTopMenus"
                :key="route.path"
                :index="route.path"
            >
                <template #title>
                    <svg-icon :icon-class="route.meta?.icon" v-if="route.meta?.icon" />
                    <span v-if="route.path == '/'">首页</span>
                    <template v-else>
                        <span v-if="route.meta?.title" class="ml-1">
                            {{ translateRouteTitle(route.meta.title) }}
                        </span>
                    </template>
                </template>
            </el-menu-item>
        </el-menu>
    </el-scrollbar>
</template>

<script lang="ts">
import { useAppStore, usePermissionStore } from '@/store';
import variables from '@/styles/variables.module.scss';
import { RouteRecordRaw } from 'vue-router';
import { translateRouteTitle } from '@/utils/i18n';
const permissionStore = usePermissionStore();

@Component
class SidebarMixTopMenu extends Vue {
    translateRouteTitle = translateRouteTitle;
    variables = variables;

    readonly appStore = useAppStore();

    // 顶部菜单
    mixTopMenus: RouteRecordRaw[] = [];

    get activePath(){
        return this.appStore.activeTopMenuPath;
    }

    // 跳转到第一个菜单
    goToFirstMenu(menus: RouteRecordRaw[]){
        if(menus.length <= 0){
            return;
        }

        const firstMenu = menus[0];
        if(firstMenu.children && firstMenu.children.length > 0){
            this.goToFirstMenu(firstMenu.children);
        }else if(firstMenu.name){
            this.$router.push({name: firstMenu.name});
        }
    }

    handleMenuSelect(routePath: string){
        this.appStore.activeTopMenu(routePath);
        permissionStore.setMixLeftMenus(routePath);
        // 获取左侧菜单集合，默认跳转到第一个菜单
        const mixLeftMenus = permissionStore.mixLeftMenus;
        this.goToFirstMenu(mixLeftMenus);
    }

    mounted(){
        this.mixTopMenus = permissionStore.routes.filter(route => !route.meta?.hidden);
        console.log('mixTopMenus', this.mixTopMenus);    
    }

}
export default toNative(SidebarMixTopMenu);
</script>
