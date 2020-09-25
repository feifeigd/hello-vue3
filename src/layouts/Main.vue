<template>
  <ul>
      <li v-for="(value, path) in routes" :key="path"><v-link :href="path">{{value}}</v-link></li>
  </ul>
  <slot />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import VLink from '../components/VLink.vue';
import routes from '../routes';

@Options({
    components:{
        VLink,
    }
})
export default class extends Vue{
    routes = routes;
    mounted(){
        console.log(routes);
    }
}
</script>

<style>

</style>