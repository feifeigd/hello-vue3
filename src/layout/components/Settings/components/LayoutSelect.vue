
<template>
    <div class="flex flex-wrap justify-around w-full h-12">
        <el-tooltip content="左侧模式" placement="bottom">
            <div class="layout-item left" :class="{'is-active': currentLayout === LayoutEnum.LEFT}" @click="updateValue(LayoutEnum.LEFT)">
                <div></div>
                <div></div>
            </div>
        </el-tooltip>
        <el-tooltip content="顶部模式" placement="bottom">
            <div class="layout-item top" :class="{'is-active': currentLayout === LayoutEnum.TOP}" @click="updateValue(LayoutEnum.TOP)">
                <div></div>
                <div></div>
            </div>
        </el-tooltip>
        <el-tooltip content="混合模式" placement="bottom">
            <div class="layout-item mix" :class="{'is-active': currentLayout === LayoutEnum.MIX}" @click="updateValue(LayoutEnum.MIX)">
                <div></div>
                <div></div>
            </div>
        </el-tooltip>
    </div>
</template>


<script lang="ts">
import { LayoutEnum } from '@/enums/LayoutEnum';
import { Emit, Model } from 'vue-facing-decorator';

@Component
class LayoutSelect extends Vue {
    LayoutEnum = LayoutEnum;

    @Model({ type: String, default: LayoutEnum.LEFT })
    currentLayout!: LayoutEnum;

    @Emit('update:modelValue')
    updateValue(value: LayoutEnum) {
        return value;
    }
}
export default toNative(LayoutSelect);

</script>

<style lang="scss" scoped>
.layout-selector{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 100%;
    height: 50px;
}

.layout-item {
    background: #f0f2f5;
    border-radius: 4px;
    cursor: pointer;
    height: 45px;
    overflow: hidden;
    position: relative;
    width: 18%;

    &.mix div:nth-child(1),
    &.top div:nth-child(1) {
        background-color: #1b2a47;
        box-shadow: 0 0 1px #888;
        height: 30%;
        width: 100%;
    }

    &.left {
        div:nth-child(1) {
            background-color: #1b2a47;
            height: 100%;
            width: 30%;
        }
        div:nth-child(2) {
            height: 30%;
            position: absolute;
            right: 0;
            top: 0;
            width: 70%;

            background: #fff;
            box-shadow: 0 0 1px #888;
        }
    }
    
    &.mix {
        div:nth-child(2) {
            bottom: 0;
            height: 70%;
            left: 0;
            width: 30%;
            position: absolute;
            background-color: #1b2a47;
            box-shadow: 0 0 1px #888;
        }
    }
    &.is-active {
        border: 2px solid var(--el-color-primary);
    }
}
</style>
