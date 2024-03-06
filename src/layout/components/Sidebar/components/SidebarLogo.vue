<template>
    <div class="logo-container">
        <!-- animate.css -->
        <Transition enter-active-class="animate__animated animate__fadeInLeft">
            <RouterLink v-if="collapse" class="wh-full flex-center" to="/">
                <img v-if="settingsStore.sidebarLogo" :src="logo" alt="logo" class="logo-image"/>
            </RouterLink>

            <RouterLink v-else class="wh-full flex-center" to="/">
                <img v-if="settingsStore.sidebarLogo" :src="logo" alt="logo" class="logo-image"/>
                <span class="logo-title">{{ defaultSettings.title }}</span>
            </RouterLink>
        </Transition>
    </div>
</template>

<script lang="ts">
import defaultSettings from '@/settings';
import { useAppStore, useSettingsStore } from '@/store';
import { Prop } from 'vue-facing-decorator';

@Component
class SidebarLogo extends Vue {

    defaultSettings = defaultSettings;

    readonly settingsStore = useSettingsStore();
    readonly appStore = useAppStore();

    get logo() {
        return (new URL('../../../../assets/logo.png', import.meta.url)).href;
    }

    @Prop({ required: true, type: Boolean})
    collapse!: boolean;
}
export default toNative(SidebarLogo);
</script>

<style lang="scss" scoped>
    .logo-container {
        background-color: $sidebar-logo-background;
        height: $navbar-height;
        width: 100%;

        .logo-image {
            height: 20px;
            width: 20px;
        }

        .logo-title {
            color: white;
            flex-shrink: 0; // 防止容器在空间不足时缩小
            font-size: 14px;
            font-weight: bold;
            margin-left: 10px;
        }
    }

    .layout-top,
    .layout-mix {
        .logo-container {
            width: $sidebar-width;
        }

        &.hideSidebar {
            .logo-container {
                width: $sidebar-width-collapsed;
            }
        }
    }
</style>
