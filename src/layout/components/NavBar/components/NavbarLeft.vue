<template>
    <div class="flex">
        <Hamburger :is-active="appStore.sidebar.opened" @toggle="appStore.toggleSidebar" />
    </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store';

const appStore = useAppStore();

</script>
