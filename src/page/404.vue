<template>
    <main-layout>
        <p>Page not found!</p>
    </main-layout>
</template>

<script lang="ts">
import { Component, toNative, Vue } from 'vue-facing-decorator';
import MainLayout from '../layouts/Main.vue';

@Component({
    components:{
        MainLayout,
    }
})
class Page404 extends Vue {

}
export default toNative(Page404);
</script>

<style>

</style>
