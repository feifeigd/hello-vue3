<template>
    <el-dropdown trigger="click" @command="handleSizeChange">
        <div>
            <SvgIcon icon-class="size"/>
        </div>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item
                    v-for="item in sizeOptions"
                    :key="item.value"
                    :command="item.value"
                    :disabled="item.value === size"
                >
                    {{ item.label }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>


<script lang="ts">

import { useAppStore } from '@/store';

const appStore = useAppStore();

@Component
class SizeSelect extends Vue {
    sizeOptions = [
        {
            value: 'default',
            label: '默认',
        },
        {
            value: 'large',
            label: '大型',
        },
        {
            value: 'small',
            label: '小型',
        },
    ];

    get size(){
        return appStore.size;    
    }

    handleSizeChange(size: string) {        
        appStore.changeSize(size);
        ElMessage.success(`布局大小设置为 ${size}`);
    }
}
export default toNative(SizeSelect);
</script>
