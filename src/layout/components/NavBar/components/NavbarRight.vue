<template>
    <div class="flex">
        <template v-if="device !=='mobile'">
            <!-- 全屏切换 -->
            <div class="setting-item" @click="toggle">
                <SvgIcon :icon-class="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" />
            </div>

            <!-- 布局大小 -->
            <el-tooltip content="布局大小" placement="bottom" effect="dark">
                <SizeSelect />
            </el-tooltip>

            <!-- 语言选择 -->
            <LangSelect />
        </template>

        <!-- 用户头像 -->
        <el-dropdown trigger="click"  class="setting-item">
            <div class="flex-center h100% p10px">
                <img class="rounded-full mr-10px w24px w24px" 
                    :src="userStore.user.avatar + '?imageView2/1/w/80/h80'"  :alt="userStore.user.avatar"  />
                <span >{{ userStore.user.username }}</span>
            </div>
            <template #dropdown>
                <a target="_blank" href="https://github.com/feifeigd"><el-dropdown-item>项目地址</el-dropdown-item></a>
                <a target="_blank" href="https://github.com/feifeigd"><el-dropdown-item>项目文档</el-dropdown-item></a>
                <el-dropdown-item divided @click="logout">注销登录</el-dropdown-item>
            </template>
        </el-dropdown>
            
        <!-- 设置 -->
        <template v-if="defaultSettings.showSettings">
            <div class="setting-item" @click="settingStore.settingsVisible = true">
                <SvgIcon icon-class="setting" />
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import defaultSettings from '@/settings';
import { useAppStore, useSettingsStore, useTagsViewStore, useUserStore } from '@/store';

const appStore = useAppStore();
const tagsViewStore = useTagsViewStore();

@Component({
    setup() {
        const {isFullscreen, toggle} = useFullscreen();

        return { 
            defaultSettings,
            isFullscreen, toggle, 
            settingStore: useSettingsStore(),
            userStore: useUserStore(),
        };
    }
})
class NavbarRight extends Vue {

    defaultSettings!: any;
    isFullscreen!: any;
    settingStore!: any;
    toggle!: any;
    userStore!: any;

    get device() {
        return appStore.device;
    }    

    logout() {
        ElMessageBox.confirm('确定要注销登录吗?', '注销登录', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            lockScroll: false,
        }).then(() => {
            this.userStore.logout().then(()=>{
                tagsViewStore.delAllViews();        
            }).then(() => {
                this.$router.push({ path: `/login?redirect=${this.$route.fullPath}` });
            });
        });
    }
}
export default toNative(NavbarRight);
</script>

<style lang="scss" scoped>
.setting-item {
    padding: 0 10px;

    color: var(--el-text-color);
    cursor: pointer;
    display: inline-block;
    height: $navbar-height;
    line-height: $navbar-height;
    min-width: 40px;
    text-align: center;

    &:hover {
        background-color: rgba(0 0 0 / 10%);
    }
}

.layout-top,
.layout-mix{
    .setting-item, .el-icon {
        color: var(--el-color-white);
    }
}

.dark .setting-item:hover {
    background-color: rgba(255 255 255 / 10%);
}
</style>
