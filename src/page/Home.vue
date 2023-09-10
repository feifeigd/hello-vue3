<template>
    <main-layout>
        <p>Welcom home!</p>
    </main-layout>
</template>

<script lang="ts">
import {Component, toNative, Vue } from 'vue-facing-decorator';
import MainLayout from '../layouts/Main.vue';

@Component({
    components:{
        MainLayout,
    }
})
class Home extends Vue {

}
export default toNative(Home);

</script>

<style>

</style>
