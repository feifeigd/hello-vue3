<template>
    <main-layout>
        <p>About page.</p>
    </main-layout>
</template>

<script lang="ts">
import { Component, toNative, Vue} from 'vue-facing-decorator';
import MainLayout from '../layouts/Main.vue';

@Component({
    components:{
        MainLayout,
    }
})
class About extends Vue {

}
export default toNative(About);
</script>

<style>

</style>
