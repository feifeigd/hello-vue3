<template>
    <el-color-picker v-model="currentColor" :predefine="colorPresets" popper-class="theme-picker-dropdown" />
</template>

<script lang="ts">
import { Model } from 'vue-facing-decorator';

@Component
class ThemeColorPicker extends Vue {
    // 定义颜色预设
    readonly colorPresets = [
        '#13ce66',
        '#20a0ff',
        '#2d8cf0',
        '#f04864',
        '#f6bd16',
        '#e6a23c',
        '#6f7ad3',
        '#909399',
        
        "#409EFF",
        "#ff4500",
        "#ff8c00",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsva(120, 40, 94)",
    ];
    // v-model="" 绑定的值
    // 修改了值，会触发 update:modelValue 事件, this.$emit("update:modelValue", val);
    @Model
    currentColor!: string;
}
export default toNative(ThemeColorPicker);
</script>

<style lang="scss" scoped>
// 深度选择器 https://juejin.cn/post/6978781674070884366
:deep(.theme-picker-dropdown) {
    .el-color-dropdown {
        z-index: 99999 !important;
    }
}
</style>
