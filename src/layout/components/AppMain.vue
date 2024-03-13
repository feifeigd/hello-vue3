<template>
    <section class="app-main">
        <router-view >
            <template #default="{ Component, route }">
                <Transition
                    enter-active-class="animate__animated animate__fadeIn" mode="out-in"
                >
                    <KeepAlive :include="cachedViews">
                        <component :is="Component" :key="route.path" />
                    </KeepAlive>
                </Transition>
            </template>
        </router-view>
    </section>
</template>


<script setup lang="ts">
import { useTagsViewStore } from '@/store';
const cachedViews = computed(() => useTagsViewStore().cachedViews);
</script>

<style lang="scss" scoped>
.app-main {
    min-height: calc(100vh - $navbar-height);
    overflow: hidden;
    position: relative;
    width: 100%;

    flex: 1;
    z-index: 1;
    transition: margin-left 0.3s;
    margin-left: 0;
    padding: 20px;
    background-color: var(--el-bg-color-page);
}

.hasTagsView .app-main {
    min-height: calc(100vh - $navbar-height - $tags-view-height);
}

.fixed-header + .app-main {
    min-height: 100vh;
    padding-top: $navbar-height;
}

.hasTagsView .fixed-header + .app-main {
    min-height: 100vh;
    padding-top: $navbar-height + $tags-view-height;
}

.layout-mix, .layout-top{
    .fixed-header + .app-main {
        padding-top: 0;
    }
}

.layout-mix {
    .app-main {
        height: calc(100vh - $navbar-height);
        padding-top: 0;
        overflow: auto;
    }

    .hasTagsView .app-main{
        height: calc(100vh - $navbar-height - $tags-view-height);
        min-height: calc(100vh - $navbar-height - $tags-view-height);
    }

    .fixed-header + .app-main {
        min-height: calc(100vh - $navbar-height);
    }

    .hasTagsView .fixed-header + .app-main {
        height: calc(100vh - $navbar-height);
        min-height: calc(100vh - $navbar-height);
        padding-top: $tags-view-height;
    }
}

.layout-top {
    .hasTagsView .fixed-header + .app-main {
        padding-top: $tags-view-height;
    }
}

</style>
