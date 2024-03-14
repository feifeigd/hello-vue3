<template>
    <!-- 顶部导航栏 -->
    <div class="navbar-container">
        <!-- 导航栏左侧 -->
        <NavbarLeft />
        <!-- 导航栏后侧 -->
        <NavbarRight />
    </div>
</template>

<script lang="ts">
@Component
class NavBar extends Vue {
}
export default  toNative(NavBar);
</script>

<style lang="scss">
    .navbar-container {
        @apply flex-x-between;
        height: $navbar-height;

        background: var(--el-bg-color);
    }
</style>
