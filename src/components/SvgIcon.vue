<template>
    <svg
        class="svg-icon"
        aria-hidden="true"
        :style="{width: size, height: size}"
    >
        <use :xlink:href="symbolId" :fill="color" />
    </svg>
</template>

<script lang="ts">
import { Prop } from 'vue-facing-decorator';

/**
 * svg图标组件
 * vite-plugin-svg-icons 会将所有的svg文件转换为Vue组件，然后导出一个svg文件的数组，这样就可以在项目中直接使用svg图标了
 */
@Component
class SvgIcon extends Vue {
    @Prop iconClass = "";
    @Prop({default: "1em"}) 
    size = "1em";
    @Prop({default: ""}) color = "";
    @Prop({default: "icon"}) prefix = "icon";

    get symbolId() {
        return `#${this.prefix}-${this.iconClass}`;
    }
}
export default toNative(SvgIcon);
</script>

<style lang="scss" scoped>
    .svg-icon {
        display: inline-block;
        width: 1em;
        height: 1em;

        vertical-align: -0.15em;    // 因icon大小被设置为和字体大小一致，而span等标签的下边缘会和字体的基线对齐，故需设置一个往下的偏移比例，来纠正视觉上的未对齐效果
        fill: currentColor; // 定义元素的颜色，currentColor是一个变量，这个变量的值就表示当前元素的color值，如果当前元素未设置color值，则从父元素继承

        outline: none;
        overflow: hidden;
    }
</style>
