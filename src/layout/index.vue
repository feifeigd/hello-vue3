<template>
    <div class="wh-full" :class="classObj">
        <!-- 遮罩层 -->
        <div 
            v-if="classObj.mobile && classObj.openSidebar"
            class="wh-full bg-black bg-opacity-30 fixed-lt z-999"
            @click="handleOutsideClick"
        >
            <!-- 遮罩层 -->
        </div>
        <!-- 公用侧边栏 -->
        <Sidebar class="sidebar-container" />
        <!-- 混合布局 -->
        <div v-if="layout === 'mix'" class="mix-container">
            <div class="mix-container__left">
                <SidebarMenu :menuList="permissionStore.mixLeftMenus" :base-path="appStore.activeTopMenuPath" />
                <div class="sidebar-toggle">
                    <Hamburger :is-active="appStore.sidebar.opened" @toggle="toggleSidebar" />
                </div>
            </div>

            <div :class="{hasTagsView: showTagsView}" class="main-container">
                <div :class="{'fixed-header': fixedHeader}">
                    <TagsView v-if="showTagsView" />
                </div>
                <AppMain />
                <Settings v-if="defaultSettings.showSettings" />
            </div>
        </div>
        <!-- 左侧布局 和 顶部布局 -->
        <div v-else :class="{hasTagsView: showTagsView}" class="main-container">
            <div :class="{'fixed-header': fixedHeader}">
                <NavBar v-if="layout === 'left'" />
                <TagsView v-if="showTagsView" />
            </div>
            <AppMain />
            <Settings v-if="defaultSettings.showSettings" />
        </div>
    </div>
</template>

<script lang="ts">
import defaultSettings from '@/settings';
import { useAppStore, usePermissionStore, useSettingsStore } from '@/store';
import { Watch } from 'vue-facing-decorator';

@Component({
    setup(){
        const appStore = useAppStore();
        const width = useWindowSize().width;
        const WIDTH = 992;  // 响应式布局容器固定宽度 大屏(>=1200px) 中屏(992px<=x<1200px) 小屏(<=768px)

        console.log("width", width);

        watchEffect(() => {
            console.log("watchEffect");
            if(width.value < WIDTH) {   // 小屏
                appStore.toggleDevice('mobile');
                appStore.closeSidebar();
            }else{
                appStore.toggleDevice('desktop');
                if(width.value >= 1200) // 大屏
                    appStore.openSidebar();
                else
                    appStore.closeSidebar();    // 中屏
            }
        });

        return {
            appStore,
        }
    }
})
class Index extends Vue {

    readonly appStore!: any;

    readonly permissionStore = usePermissionStore();
    readonly settingsStore = useSettingsStore();
    readonly defaultSettings = defaultSettings;

    get classObj() {
        return {
            hideSidebar: !this.appStore.sidebar.opened,
            openSidebar: this.appStore.sidebar.opened,
            mobile: this.appStore.device === 'mobile',
            "layout-left": this.layout === 'left',
            "layout-top": this.layout === 'top',
            "layout-mix": this.layout === 'mix',
        };
    }

    get fixedHeader() {
        return this.settingsStore.fixedHeader;
    }

    get layout() {
        return this.settingsStore.layout;
    }

    get showTagsView() {
        return this.settingsStore.tagsView;
    }

    handleOutsideClick() {
        this.appStore.closeSidebar();
    }

    @Watch('appStore.activeTopMenuPath', { deep: true, immediate: true })
    onActiveTopMenuPathChange(newValue: string, oldValue: string) {
        console.log("onActiveTopMenuPathChange", newValue, oldValue);
        this.permissionStore.setMixLeftMenus(newValue);
    }

    toggleSidebar() {
        this.appStore.toggleSidebar();
    }
}

export default toNative(Index);
</script>

<style lang="scss" scoped>
.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    transition: width 0.28s;
    width: calc(100% - $sidebar-width);
    z-index: 9;
}

.sidebar-container{
    background-color: $menu-background; // 空白的地方，显示背景色
    bottom: 0;
    height: 100%;
    left: 0;
    overflow: hidden;
    position: fixed;
    top: 0;
    transition: width 0.28s;    
    width: $sidebar-width;
    z-index: 999;   // 显示在上层

    :deep(.el-menu){
        border: none;
    }
}

.main-container{
    margin-left: $sidebar-width;
    min-height: 100%;
    position: relative;
    transition: margin-left 0.28s;
}

.layout-top{
    .fixed-header{
        top: $navbar-height;
        width: 100%;
    }

    .sidebar-container{
        display: flex;
        height: $navbar-height;
        width: 100% !important;
        z-index: 999;

        :deep(.el-scrollbar){
            flex: 1;
            height: $navbar-height;
        }

        :deep(.el-menu-item),
        :deep(.el-sub-menu__title),
        :deep(.el-menu--horizontal){
            height: $navbar-height;
            line-height: $navbar-height;
        }

        :deep(.el-menu--collapse){
            width: 100%;
        }
    }

    .main-container{
        min-height: calc(100vh - $navbar-height);
        padding-top: $navbar-height;
        margin-left: 0;
    }
}

.layout-mix{
    .sidebar-container{
        height: $navbar-height;
        width: 100% !important;

        :deep(.el-scrollbar){
            flex: 1;
            height: $navbar-height;
        }

        :deep(.el-menu-item),
        :deep(.el-sub-menu__title),
        :deep(.el-menu--horizontal){
            height: $navbar-height;
            line-height: $navbar-height;
        }

        :deep(.el-menu--horizontal.el-menu){
            border: none;
        }
    }

    .mix-container{
        display: flex;
        height: 100%;
        padding-top: $navbar-height;

        .mix-container__left{
            height: 100%;
            position: relative;
            width: $sidebar-width;

            :deep(.el-menu){
                border: none;
                height: 100%;
            }

            .sidebar-toggle{
                align-items: center;
                bottom: 0;
                box-shadow: 0 0 6px -2px var(--el-color-primary);
                display: flex;
                height: 50px;
                justify-content: center;
                line-height: 50px;
                position: absolute;
                width: 100%;

                div:hover{
                    background-color: var(--menu-background);
                }
                :deep(svg){
                    color: var(--el-color-primary) !important;
                }
            }
        }

        .main-container{
            flex: 1;
            margin-left: 0;
            min-width: 0;

            .fixed-header{
                top: $navbar-height;
            }
        }
    }
}

.hideSidebar{
    .fixed-header{
        left: $sidebar-width-collapsed;
        width: calc(100% - $sidebar-width-collapsed);
    }

    .main-container{
        margin-left: $sidebar-width-collapsed;
    }

    &.layout-top{
        .fixed-header{
            left: 0;
            width: 100%;
        }

        .main-container{
            margin-left: 0;
        }
    }
    &.layout-mix{
        .fixed-header{
            left: $sidebar-width-collapsed;
            width: calc(100% - $sidebar-width-collapsed);
        }
        .sidebar-container{
            width: 100% !important;
        }

        .mix-container{
            .main-container__left{
                margin-left: $sidebar-width-collapsed;
            }
        }
    }
}

.layout-left.hideSidebar{
    .sidebar-container{
        width: $sidebar-width-collapsed !important;
    }

    .main-container{
        margin-left: $sidebar-width-collapsed;
    }

    &.mobile{
        .sidebar-container{
            pointer-events: none;
            transition-duration: .3s;
            transform: translate3d(-210px, 0, 0);
        }

        .main-container{
            margin-left: 0;
        }
    }
}


.mobile {
  .fixed-header {
    left: 0;
    width: 100%;
  }

  .main-container {
    margin-left: 0;
  }

  &.layout-top {
    .sidebar-container {
      z-index: 999;
      display: flex;
      width: 100% !important;
      height: $navbar-height;

      :deep(.el-scrollbar) {
        flex: 1;
        min-width: 0;
        height: $navbar-height;
      }
    }

    .main-container {
      padding-top: $navbar-height;
      margin-left: 0;
      overflow: hidden;
    }

    // 顶部模式全局变量修改
    --el-menu-item-height: $navbar-height;
  }
}
</style>
