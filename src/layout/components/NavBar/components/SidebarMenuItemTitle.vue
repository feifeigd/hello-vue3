<template>
    <!-- 菜单图标 -->
    <el-icon v-if="icon?.startsWith('el-icon')" class="sub-el-icon">
        <component :is="icon.replace('el-icon-', '')"  />
    </el-icon>
    <SvgIcon v-else-if="icon" :icon-class="icon" />
    <!-- 默认图标 -->
    <SvgIcon v-else icon-class="menu" />
    <!-- 菜单标题 -->
    <span v-if="title" class="ml-1">{{ translateRouteTitle }}</span>
    <!-- 菜单标题结束 -->
</template>

<script lang="ts">
import { translateRouteTitle } from '@/utils/i18n';
import { Prop } from 'vue-facing-decorator';

@Component
class SidebarMenuItemTitle extends Vue {
    @Prop({ type: String, default: '' })
    icon!: string;

    @Prop({ type: String, default: '' })
    title!: string;

    get translateRouteTitle() {        
        return translateRouteTitle(this.title);
    }
}
export default toNative(SidebarMenuItemTitle);
</script>

<style lang="scss" scoped>
.sub-el-icon {
    color: currentColor;
    font-size: 14px !important;
    margin-right: 0 !important;
    width: 14px !important;
}

.hideSidebar {
    .el-sub-menu, .el-menu-item {
        .svg-icon, .sub-el-icon {
            margin-left: 20px;
        }
    }
}
</style>
