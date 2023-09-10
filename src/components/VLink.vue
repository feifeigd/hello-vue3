<template>
  <a :href="href" @click.prevent="go">
      <slot></slot>
  </a>
</template>

<script lang="ts">
import {Component, toNative, Vue} from 'vue-facing-decorator';
import routes from '../routes';

@Component({
    props: ['href', ],
})
class VLink extends Vue{
    // href!:string;
    
    go(){
        console.log('go', this.href);
        let root = this.$root as any;
        if(root)root.currentRoute = this.href;
        window.history.pushState(null, routes[this.href], this.href);
    }
}
export default toNative(VLink);
</script>

<style>

</style>