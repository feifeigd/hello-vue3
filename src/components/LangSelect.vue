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

@Component({
    setup(){
        const {locale} = useI18n(); // 只能在setup中调用

        return {
            locale, 
        }
    }
})
class LangSelect extends Vue {
    @Prop
    size!: string;  // 图标大小

    readonly appStore = useAppStore();
    locale!: any;   // setup 中注入

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
        this.locale = lang;  // 少这行，无法实现动态切换语言
        const msg = lang = "en" ? "Switch language success" : "切换语言成功";
        ElMessage.success(msg);
    }
}

export default toNative(LangSelect);
</script>
