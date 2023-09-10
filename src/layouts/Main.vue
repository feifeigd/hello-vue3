<template>
  <ul>
      <li v-for="(value, path) in routes" :key="path"><v-link :href="path">{{value}}</v-link></li>
  </ul>
  <slot />
</template>

<script lang="ts">
import { Component, toNative, Vue } from 'vue-facing-decorator';
import VLink from '../components/VLink.vue';
import routes from '../routes';

@Component({
    components:{
        VLink,
    }
})
class Main extends Vue{
    routes = routes;
    mounted(){
        console.log(routes);
    }
}
export default toNative(Main);
</script>

<style>

</style>