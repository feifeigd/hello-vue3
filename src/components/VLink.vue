<template>
  <a :href="href" @click.prevent="go">
      <slot></slot>
  </a>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import routes from '../routes';

@Options({
    props: ['href', ],
})
export default class extends Vue{
    href!:string;
    
    go(){
        console.log('go', this.href);
        let root = this.$root as any;
        if(root)root.currentRoute = this.href;
        window.history.pushState(null, routes[this.href], this.href);
    }
}
</script>

<style>

</style>