<template>
    <div class="tags-container">
        <el-scrollbar class="scroll-container" :vertical="false" @wheel.prevent="handleScroll">
            <RouterLink ref="tagRef" 
                v-for="tag in visitedViews" 
                :class="'tags-item ' + (isActive(tag) ? 'active' : '')"
                :key="tag.fullPath" :to="{path: tag.path, query: tag.query}"
                @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
                @contextmenu.prevent="openContextMenu(tag, $event)"
            >
                {{ translateRouteTitle(tag.title) }}
                <i-ep-close class="close-icon" size="12px" v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)" />
            </RouterLink>            
        </el-scrollbar>

        <!-- tag 标签操作菜单 -->
        <ul v-show="contentMenuVisible" class="contextmenu" :style="{left: left + 'px', top: top + 'px'}">
            <li @click="refreshSelectedTag(selectedTag)"><SvgIcon icon-class="refresh"/>刷新</li>
            <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)"><SvgIcon icon-class="close"/>关闭</li>
            <li @click="closeOtherTags"><SvgIcon icon-class="close_other" /> 关闭其他</li>
            <li v-if="!isFirstView()" @click="closeLeftTags"><SvgIcon icon-class="close_left" /> 关闭左侧</li>
            <li v-if="!isLastView()" @click="closeRightTags"><SvgIcon icon-class="close_right" /> 关闭右侧</li>
            <li @click="closeAllTags(selectedTag)"><SvgIcon icon-class="close_all" /> 关闭所有</li>
        </ul>
    </div>

</template>

<script lang="ts">
import { useAppStore, usePermissionStore, useSettingsStore, useTagsViewStore } from '@/store';
import { resolve } from 'path-browserify';
import { Watch } from 'vue-facing-decorator';
import { RouteRecordName, RouteRecordRaw } from 'vue-router';
import {translateRouteTitle} from '@/utils/i18n';

const appStore = useAppStore();
const permissionStore = usePermissionStore();
const settingsStore = useSettingsStore();

@Component
class TagsView extends Vue {

    readonly tagsViewStore = useTagsViewStore();
    readonly translateRouteTitle = translateRouteTitle;

    left = 0;
    top = 0;

    selectedTag: TagView = {
        fullPath: "",
        path: "",
        name: "",
        title: "",
        affix: false,
        keepAlive: false,    
    };

    get layout() {
        return settingsStore.layout;
    }

    @Watch("$route", { immediate: true })
    onRouteChange() {
        console.log("onRouteChange");
        this.addTags();
        this.moveToCurrentTag();
    }

    @Watch("$route.name", {deep: true})
    onRouteNameChange(newName: string, oldName: string) {
        console.log("onRouteNameChange", newName, oldName);
        if(newName) {
            this.againActiveTop(newName);
        }
    }

    againActiveTop(newName: string) {
        if(this.layout !== "mix")return;
        const parent = this.findOutermostParent(permissionStore.routes, newName);
        if(parent && appStore.activeTopMenu !== parent.path) {
            appStore.activeTopMenu = parent.path;
        }
    }

    // 右键菜单是否显示
    contentMenuVisible = false;
    @Watch('contentMenuVisible')
    onContentMenuVisibleChange(val: boolean) {
        console.log("onContentMenuVisibleChange", val);
        if(val) {
            this.$nextTick(() => {
                document.addEventListener('click', this.closeContentMenu);  // 在空白处单击，关闭右键菜单
            });
        }else{
            document.removeEventListener('click', this.closeContentMenu);
        }
    }

    get visitedViews() {
        return this.tagsViewStore.visitedViews;
    }

    mounted() {
        console.log("mounted");
        this.initTags();
    }

    addTags(){
        console.log("addTags");
        const route = this.$route;
        if(route.meta?.title) {
            this.tagsViewStore.addView({
                fullPath: route.fullPath,
                path: route.path,
                name: route.name as string,
                title: route.meta?.title,
                affix: route.meta?.affix,
                keepAlive: route.meta?.keepAlive,
            });
        }
    }

    closeAllTags(view: TagView) {
        console.log("closeAlllTags");
        this.tagsViewStore.delAllViews().then((res: any) => {
            this.toLastView(res.visitedViews, view);
        });
    }

    // 关闭右键菜单
    closeContentMenu() {
        this.contentMenuVisible = false;
    }

    closeLeftTags(){
        console.log("closeLeftTags");        
        this.$router.push(this.selectedTag);
        this.tagsViewStore.delLeftViews(this.selectedTag).then((res: any) => {
            if(!res.visitedViews.find((tag: TagView) => tag.path === this.$route.path)) {
                this.toLastView(res.visitedViews);
            }
        });
    }

    closeOtherTags() {
        console.log("closeOtherTags");
        this.$router.push(this.selectedTag);
        this.tagsViewStore.delOtherViews(this.selectedTag).then((res: any) => {
            this.moveToCurrentTag();
        });
    }

    closeRightTags() {
        console.log("closeRightTags");
        this.$router.push(this.selectedTag);
        this.tagsViewStore.delRightViews(this.selectedTag).then((res: any) => {
            if(!res.visitedViews.find((tag: TagView) => tag.path === this.$route.path)) {
                this.toLastView(res.visitedViews);
            }
        });
    }

    closeSelectedTag(tag: TagView) {
        console.log("closeSelectedTag", tag);
        this.tagsViewStore.delView(tag).then((res: any) => {
            if(this.isActive(tag)) {    // 删除当前页面，要显示新的页面
                this.toLastView(res.visitedViews, tag);
            }
        });
    }

    filterAffixTags(routes: RouteRecordRaw[], basePath = "/") {
        let tags: TagView[] = [];
        routes.forEach((route: RouteRecordRaw) => {
            if(route.meta?.affix) {
                console.log("filterAffixTags", routes);
                const tagPath = resolve(basePath, route.path);
                tags.push({
                    fullPath: tagPath,
                    path: tagPath,
                    name: String(route.name),
                    title: route.meta?.title || "no-name",
                    affix: route.meta?.affix,
                    keepAlive: route.meta?.keepAlive,
                });
            }

            if(route.children) {
                const tempTags = this.filterAffixTags(route.children, basePath + route.path);
                tags = tags.concat(tempTags);
            }
        });
        return tags;
    }

    // 找到最外层的父节点
    findOutermostParent(tree: RouteRecordRaw[], findName: string) {
        let parentMap: Record<RouteRecordName, RouteRecordRaw | null> = {};

        function buildParentMap(node: RouteRecordRaw, parent: RouteRecordRaw | null) {
            if(node.name) {
                parentMap[node.name] = parent;
            }
            if(node.children) {
                node.children.forEach((child: any) => {
                    buildParentMap(child, node);
                });
            }
        }

        tree.forEach((node: RouteRecordRaw) => {
            buildParentMap(node, null);
        });
        let currentNode = parentMap[findName];
        while(currentNode) {
            const node = parentMap[currentNode.name as string];
            if(!node) {
                return currentNode; // 找到最外层的父节点
            }
            currentNode = node;
        }
        return null;
    }

    handleScroll(e: WheelEvent) {
        console.log("handleScroll", e);
        this.closeContentMenu();
    }

    initTags() {
        const tags: TagView[] = this.filterAffixTags(permissionStore.routes);
        console.log("initTags", tags);
        for(const tag of tags) {
            if(tag.name)
                this.tagsViewStore.addView(tag);
        }
    }

    isActive(tag: TagView) {
        console.log("isActive");
        return tag.path === this.$route.path;
    }

    isAffix(tag: TagView) {
        console.log("isAffix");
        return tag?.affix;
    }

    isFirstView() {
        console.log("isFirstView");
        try
        {
            return this.selectedTag.path == "/dashboard" || this.visitedViews[0].fullPath === this.selectedTag.fullPath;
        }catch(e) {
            return false;
        }
    }

    isLastView() {
        console.log("isLastView");
        try
        {
            return this.visitedViews[this.visitedViews.length - 1].fullPath === this.selectedTag.fullPath;
        }catch(e) {
            return false;
        }
    }

    moveToCurrentTag() {
        console.log("moveToCurrentTag");
        // 用 nextTick 的目的是确保在更新tagsView组件之前，scrollPaneRef 对象已经滚动到了正确的位置
        this.$nextTick(() => {
            for(const tag of this.visitedViews) {
                const route = this.$route;
                if(tag.path === route.path) {
                    if(tag.fullPath !== route.fullPath) {
                        this.tagsViewStore.updateVisitedView({
                            fullPath: route.fullPath,
                            path: route.path,
                            name: route.name as string,
                            title: route.meta?.title || "no-name",
                            affix: route.meta?.affix,
                            keepAlive: route.meta?.keepAlive,                        
                        });
                    }
                    // break;
                }
            }
        });
    }

    openContextMenu(tag: TagView, event: MouseEvent) {
        console.log("openContextMenu", tag, event);
        const menuMinWidth = 105;
        // const proxy = this.getCurrentInstance()?.proxy;
        const offsetLeft = this.$el?.getBoundingClientRect().left || 0;   // 获取当前元素的左边距 margin left
        const offsetWidth = this.$el?.offsetWidth || 0;   // 获取当前元素的宽度 container width
        const maxLeft = offsetWidth - menuMinWidth;  // left boundary
        const l = event.clientX - offsetLeft + 15;  // right boundary 15: margin right

        this.left = Math.min(maxLeft, l);

        // 混合模式下，需要减去顶部菜单(fixed)的高度
        if(this.layout === "mix") {
            this.top = event.clientY - 50;  // 50: 顶部菜单高度
        }else{
            this.top = event.clientY;
        }

        this.contentMenuVisible = true;
        this.selectedTag = tag;
    }

    refreshSelectedTag(tag: TagView) {
        console.log("refreshSelectedTag", tag);
        this.tagsViewStore.delCachedView(tag);
        nextTick(() => {
            this.$router.replace({path: '/redirect' + tag.fullPath});
        });
    }

    /**
     * 关闭 view 标签, 并且显示最后一个 view
     */
    toLastView(views: TagView[], view?: TagView) {
        console.log("toLastView", views, view);
        const latestView = views.slice(-1)[0];
        if(latestView?.fullPath) {
            this.$router.push(latestView.fullPath);
        }else{
            // 如果没有最后一个视图，则跳转到首页
            if(view?.name === "Dashboard"){
                // to reload home page
                this.$router.push('/redirect' + view.fullPath);
            }else{
                this.$router.push('/');
            }
        }
    }
}
export default toNative(TagsView);
</script>


<style lang="scss" scoped>
.tags-container {
  width: 100%;
  height: 34px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  box-shadow: 0 1px 1px var(--el-box-shadow-light);

  .tags-item {
    display: inline-block;
    padding: 3px 8px;
    margin: 4px 0 0 5px;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid var(--el-border-color-light);

    &:hover {
      color: var(--el-color-primary);
    }

    &:first-of-type {
      margin-left: 15px;
    }

    &:last-of-type {
      margin-right: 15px;
    }

    .close-icon {
      border-radius: 50%;

      &:hover {
        color: #fff;
        background-color: var(--el-color-primary);
      }
    }

    &.active {
      color: #fff;
      background-color: var(--el-color-primary);

      &::before {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 5px;
        content: "";
        background: #fff;
        border-radius: 50%;
      }

      .close-icon:hover {
        color: var(--el-color-primary);
        background-color: var(--el-fill-color-light);
      }
    }
  }
}

.contextmenu {
  position: absolute;
  z-index: 99;
  font-size: 12px;
  background: var(--el-bg-color-overlay);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);

  li {
    padding: 8px 16px;
    cursor: pointer;

    &:hover {
      background: var(--el-fill-color-light);
    }
  }
}

.scroll-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;

  .el-scrollbar__bar {
    bottom: 0;
  }

  .el-scrollbar__wrap {
    height: 49px;
  }
}
</style>
