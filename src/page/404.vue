<template>
    <main-layout>
        <p>Page not found!</p>
    </main-layout>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import MainLayout from '../layouts/Main.vue';

@Options({
    components:{
        MainLayout,
    }
})
export default class extends Vue {

}
</script>

<style>

</style>
