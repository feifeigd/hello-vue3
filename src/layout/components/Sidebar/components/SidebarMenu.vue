<!-- 左侧边菜单：包括左侧布局(left), 顶部布局(all)和混合布局(mix) -->
<template>
    <el-menu
        :active-text-color="variables['menu-active-text']"
        :background-color="variables['menu-background']"
        :collapse="!appStore.sidebar.opened"
        :collapse-transition="false"
        :default-active="$route.path"
        :text-color="variables['menu-text']"
        :unique-opened="false"
        :mode="layout === 'top' ? 'horizontal' : 'vertical'"
    >
        <SidebarMenuItem v-for="item in menuList" :key="item.path" :item="item" :base-path="resolvePath(item.path)" :is-collapse="!appStore.sidebar.opened" />
    </el-menu>
</template>

<script lang="ts">
import { useAppStore, useSettingsStore } from '@/store';
import { isExternal } from '@/utils';
import { Prop } from 'vue-facing-decorator';
import { RouteRecordRaw } from 'vue-router';
import variables from '@/styles/variables.module.scss';

import path from "path-browserify";

@Component
class SidebarMenu extends Vue {

    @Prop({ type: String, required: true, })
    basePath = '';

    @Prop({ type: Array, default: () => [], required: true})
    menuList!: RouteRecordRaw[];
    
    readonly appStore = useAppStore();
    readonly settingsStore = useSettingsStore();

    variables = variables;

    get layout() {
        return this.settingsStore.layout;
    }
    
    resolvePath(routePath: string) {
        if(isExternal(routePath)) {
            return routePath;            
        }
        if(isExternal(this.basePath)) {
            return this.basePath;            
        }
        return path.resolve(this.basePath, routePath);
    }
}
export default toNative(SidebarMenu);
</script>
