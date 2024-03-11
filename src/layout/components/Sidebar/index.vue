<template>
    <div :class="{'has-logo': sidebarLogo}">
        <!-- 混合布局 -->
        <div class="flex w-full" v-if="layout==='mix'">
            <SidebarLogo v-if="sidebarLogo" :collapse="!appStore.sidebar.opened" />
            <SidebarMixTopMenu class="flex-1" />
            <NavbarRight />
        </div>
        <!-- 左侧布局 || 顶部布局 -->
        <template v-else>
            <SidebarLogo v-if="sidebarLogo" :collapse="!appStore.sidebar.opened" />
            <el-scrollbar wrap-class="el-scrollbar__wrap" class="flex-1" :view-style="{height: 'calc(100vh - 64px)'}">
                <SidebarMenu :menu-list="permissionStore.routes" base-path="" />
            </el-scrollbar>
            <NavbarRight v-if="layout === 'top'" />
        </template>
    </div>
</template>

<script lang="ts">

import { useAppStore, usePermissionStore, useSettingsStore } from '@/store';

@Component
class Sidebar extends Vue {

    readonly appStore = useAppStore();
    readonly settingsStore = useSettingsStore();
    readonly permissionStore = usePermissionStore();

    get layout(): string {
        return this.settingsStore.layout;
    }
    get sidebarLogo() {
        return this.settingsStore.sidebarLogo;
    }
}

export default toNative(Sidebar);
</script>

<style lang="scss" scoped>
    .has-logo {
        .el-scrollbar {
            height: calc(100vh - $navbar-height);
        }
    }
</style>
