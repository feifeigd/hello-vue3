<template>
    <div>
        <input v-focus>
    </div>
    <div>支持多个根标签了</div>
</template>

<script lang="ts">
import {toNative, Vue} from 'vue-facing-decorator'

class Directive extends Vue{
    
}
export default toNative(Directive);
</script>
