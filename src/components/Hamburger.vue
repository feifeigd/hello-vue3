<template>
    <div @click="toggle" class="px-[15px] flex items-center justify-center color-[var(--el-text-color-regular)]">
        <SvgIcon class="hamburger" icon-class="indent-decrease" :class="{'is-active': isActive}" />
    </div>
</template>

<script lang="ts">
import {  Prop, Emit } from 'vue-facing-decorator';

@Component
class Hamburger extends Vue {
    @Prop({ default: false,  required: true, type: Boolean, }) readonly isActive!: boolean;

    @Emit
    toggle() {
        return this.isActive;
    }
}
export default toNative(Hamburger);
</script>

<style scoped lang="scss">
.hamburger {
    cursor: pointer;
    transform: scaleX(-1);
    vertical-align: middle;

}
.hamburger.is-active {
    transform: scaleX(1);
}
</style>
