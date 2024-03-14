<template>
    <div v-if="!item.meta?.hidden" >
        <!-- 显示具体单个子路由的菜单项或没有子路由的父路由 -->
        <template v-if="hasOneShowingChild(item.children, item) && 
            (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.meta?.alwaysShow /* */">            
            <AppLink v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)"  >
                <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown': !isNest}">
                    <SidebarMenuItemTitle :icon="onlyOneChild.meta.icon || item.meta?.icon" :title="onlyOneChild.meta.title"  />
                </el-menu-item>
            </AppLink>
        </template>

        <!-- 显示多个子路由的父路由 -->
        <el-sub-menu v-else :index="resolvePath(item.path)" teleported>
            <template #title>
                <SidebarMenuItemTitle v-if="item.meta" :icon="item.meta.icon" :title="item.meta.title"  />
            </template>
            <SidebarMenuItem
                v-for="child in item.children"
                :key="child.path"
                :item="child"
                :base-path="resolvePath(child.path)"
                :is-nest="true"
            />
        </el-sub-menu>
    </div>
</template>

<script lang="ts">
import { isExternal } from '@/utils';
import path from 'path-browserify';
import { Prop } from 'vue-facing-decorator';
import { RouteRecordRaw } from 'vue-router';

@Component({
    name: 'SidebarMenuItem',
    inheritAttrs: false,
})
class SidebarMenuItem extends Vue {
    @Prop({ type: Object, required: true })
    item!: RouteRecordRaw;

    @Prop({ type: String, required: true })
    basePath!: string;  // 父级完整路由路径(eg: /system)

    @Prop({ type: Boolean, default: false })
    isNest!: boolean;

    onlyOneChild: any = {}; // 临时变量，唯一子路由

    /**
     * 当前路由是否只有一个子路由
     * @returns true 1：如果只有一个子路由
     * @returns true 2：如果无子路由
     */
    hasOneShowingChild(children: RouteRecordRaw[] = [], parent: RouteRecordRaw) {
        // 子路由
        const showingChildren = children.filter((child) => {
            if(child.meta?.hidden) {
                return false;
            }
            child.meta!.hidden = false;
            // 临时变量(多个子路由 onlyOneChild 变量是用不上的)
            this.onlyOneChild = child;  // 最后一个显示的子路由
            return true;
        });

        switch (showingChildren.length) {
            case 1:
                return true;
            case 0:
                this.onlyOneChild = {...parent, path: "", noShowingChildren: true}; // 无子路由, 则显示自己。这里插入了 noShowingChildren，所以类型不能指定为 RouteRecordRaw
                return true;
            default:    // 有多个子路由
                return false;
        }
    }

    /**
     * 解析路由路径(相对路径->绝对路径)
     */
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
export default toNative(SidebarMenuItem);

</script>

<!-- 这里不要写 scoped -->
<style lang="scss" >
.hideSidebar {
    .submenu-title-noDropdown {
        position: relative;
        padding: 0 !important;
        
        .el-tooltip {
            padding: 0 !important;
            .sub-el-icon {
                margin-left: 19px;
            }
        }

        & > span {
            display: inline-block;
            height: 0;
            overflow: hidden;
            visibility: hidden;
        }
    }

    .el-sub-menu{
        overflow: hidden;

        & > .el-sub-menu__title {
            padding: 0 !important;
            
            .sub-el-icon{
                margin-left: 19px;
            }

            .el-sub-menu__icon-arrow {
                display: none;
            }
        }
    }

    .el-menu--collapse {
        width: $sidebar-width-collapsed;
        .el-sub-menu{
            & > .el-sub-menu__title {
                & > span{
                    display: inline-block;
                    width: 0;
                    height: 0;
                    overflow: hidden;
                    visibility: hidden;
                }
            }

        }
    }
}
</style>
