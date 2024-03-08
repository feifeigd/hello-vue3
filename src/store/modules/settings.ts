import defaultSettings from "@/settings";
import { setStyleProperty } from "@/utils";
import { genMixColor } from "@/utils/color";

type SettingsValue = boolean | string;

export const useSettingsStore = defineStore("settings", ()=>{
    const fixedHeader = useStorage<boolean>("fixedHeader", defaultSettings.fixedHeader);
    // 本地存储
    const layout = useStorage<string>("layout", defaultSettings.layout);

    const settingsVisible = ref<boolean>(false);
    const sidebarLogo = useStorage<boolean>("sidebarLogo", defaultSettings.sidebarLogo);
    // 是否显示标签视图
    const tagsView = useStorage<boolean>("tagsView", defaultSettings.tagsView);

    const theme = useStorage<string>("theme", defaultSettings.theme);
    const themeColor = useStorage<string>("themeColor", defaultSettings.themeColor);
    const watermarkEnabled = useStorage<boolean>("watermarkEnabled", defaultSettings.watermarkEnabled);

    const settingsMap: Record<string, Ref<SettingsValue>> = {
        fixedHeader,
        layout,
        sidebarLogo,
        tagsView,
        watermarkEnabled,
    };

    function changeLayout(value: string){
        layout.value = value;
    }

    function changeSetting(key: string, value: SettingsValue){
        const setting = settingsMap[key];
        if(setting){
            setting.value = value;
        }
    }

    function changeTheme(value: string){
        theme.value = value;
    }

    function changeThemeColor(value: string){
        themeColor.value = value;
    }

    // 监听主题变化
    watch([theme, themeColor],
        ([newTheme, newThemeColor], [oldTheme, oldThemeColor])=>{
            if(newTheme !== oldTheme){
                if(newTheme === "dark")
                    document.documentElement.classList.add("dark");
                else
                    document.documentElement.classList.remove("dark");
            }

            if(newThemeColor !== oldThemeColor){
                const { DEFAULT, dark, light } = genMixColor(newThemeColor);
                setStyleProperty("--el-color-primary", DEFAULT);
                setStyleProperty("--el-color-primary-dark-2", dark[2]);
                setStyleProperty("--el-color-primary-light-3", light[3]);
                setStyleProperty("--el-color-primary-light-5", light[5]);
                setStyleProperty("--el-color-primary-light-7", light[7]);
                setStyleProperty("--el-color-primary-light-8", light[8]);
                setStyleProperty("--el-color-primary-light-9", light[9]);
            }
        },
        {
            immediate: true,    // 立即执行，确保在侦听器创建时执行一次
        },
    );

    return {
        fixedHeader,
        layout,
        settingsVisible,
        sidebarLogo,
        tagsView,
        theme,
        themeColor,
        watermarkEnabled,

        changeLayout,
        changeSetting,
        changeTheme,
        changeThemeColor,
    };
});
