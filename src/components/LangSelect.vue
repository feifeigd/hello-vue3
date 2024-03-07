<template>
    <el-dropdown trigger="click" @command="handleLanguageChange">
        <div>
            <SvgIcon icon-class="language" :size="size"  />
        </div>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item v-for="item in langList" :key="item.value" :value="item.value" :command="item.value" :disabled="appStore.language === item.value" >
                    {{ item.label }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script lang="ts">
import { useAppStore } from '@/store';
import { ElMessage } from 'element-plus';
import { Prop } from 'vue-facing-decorator';

@Component
class LangSelect extends Vue {
    @Prop
    size!: string;  // 图标大小

    readonly appStore = useAppStore();
    
    // 语言列表
    langList = [
        {
            label: '简体中文',
            value: 'zh-cn',
        },
        {
            label: 'English',
            value: 'en',
        },
    ];

    // 切换语言
    handleLanguageChange(lang: string) {
        console.log('handleLanguageChange', lang);
        this.appStore.changeLanguage(lang);
        const msg = lang = "en" ? "Switch language success" : "切换语言成功";
        ElMessage.success(msg);
    }
}

export default toNative(LangSelect);
</script>
