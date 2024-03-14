<template>
    <el-drawer
        v-model="settingsVisible"
        size="300"
        title="项目设置">

        <el-divider >主题设置</el-divider>
        <div class="flex-center">
            <el-switch
                v-model="isDark"
                :active-icon="Moon"
                :inactive-icon="Sunny"
                @change="changeTheme"
                />
        </div>

        <el-divider >界面设置</el-divider>

        <div class="settings-option">
            <el-text>主题颜色</el-text>
            <ThemeColorPicker v-model="settingsStore.themeColor" @update:model-value="changeThemeColor" />
        </div>

        <div class="settings-option">
            <el-text>开启 Tags-View</el-text>
            <el-switch
                v-model="settingsStore.tagsView" />
        </div>

        <div class="settings-option">
            <span class="text-xs">固定 Header</span>
            <el-switch
                v-model="settingsStore.fixedHeader" />
        </div>
        <div class="settings-option">
            <span class="text-xs">侧边栏 Logo </span>
            <el-switch
                v-model="settingsStore.sidebarLogo" />
        </div>

        <div class="settings-option">
            <span class="text-xs">开启水印</span>
            <el-switch
                v-model="settingsStore.watermarkEnabled" />
        </div>

        <el-divider >导航设置</el-divider>
        <LayoutSelect v-model="settingsStore.layout" @update:model-value="changeLayout" />
    </el-drawer>
</template>

<script lang="ts">
import { LayoutEnum } from '@/enums/LayoutEnum';
import { ThemeEnum } from '@/enums/ThemeEnum';
import defaultSettings from '@/settings';
import { useAppStore, usePermissionStore, useSettingsStore } from '@/store';
import { findOutermostParent } from '@/utils';
import {Moon, Sunny} from '@element-plus/icons-vue';

const appStore = useAppStore();
const permissionStore = usePermissionStore();

@Component({
    setup() {
        return {
            Moon,
            Sunny
        }
    }
})
class Settings extends Vue {
    Moon!: any;
    Sunny!: any;

    readonly defaultSettings = defaultSettings;
    settingsStore = useSettingsStore();
    
    get isDark(){
        return this.settingsStore.theme == ThemeEnum.DARK;    
    }

    set isDark(val: boolean) {
        this.settingsStore.changeTheme(val ? ThemeEnum.DARK : ThemeEnum.LIGHT);
    }

    get settingsVisible() {
        return this.settingsStore.settingsVisible;
    }

    set settingsVisible(val: boolean) {
        this.settingsStore.settingsVisible = val;
    }

    againActiveTop(name: string) {
        const parent = findOutermostParent(permissionStore.routes, name);
        if (parent && appStore.activeTopMenuPath !== parent.path) {
            appStore.activeTopMenu(parent.path);
        }
    }

    changeLayout(layout: string) {
        console.log("changeLayout", layout);
        this.settingsStore.changeLayout(layout);
        if(layout === LayoutEnum.MIX){
            this.$route.name && this.againActiveTop(this.$route.name as string)
        }else if(layout === LayoutEnum.TOP){
            appStore.openSidebar();
        }
    }

    changeTheme(val: any) {
        console.log("changeTheme", val);
        this.isDark = val;
    }

    changeThemeColor(val: string) {
        console.log("changeThemeColor", val);
        this.settingsStore.changeThemeColor(val);
    }
}
export default toNative(Settings);

</script>

<style lang="scss">
.settings-option {
    @apply py-1 flex-x-between;
}
</style>
