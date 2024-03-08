
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import defaultSettings from "@/settings";
import { store } from "..";

// 你可以任意命名 `defineStore()` 的返回值，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。
// (比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
// defineStore() 的第二个参数可接受两类值：Setup 函数或 Option 对象。
// 在 Setup Store 中：
// ref() 就是 state 属性
// computed() 就是 getters
// function() 就是 actions
// https://pinia.vuejs.org/zh/core-concepts/#setup-stores
// setup
export const useAppStore = defineStore("app", ()=>{
    // state
    const activeTopMenuPath = useStorage("activeTopMenuPath", "");
    const device    = useStorage("device", "desktop");
    const language  = useStorage("language", "zh-cn");

    const sidebarStatus   = useStorage("sidebarStatus", "closed");
    const sidebar = reactive({
        opened: sidebarStatus.value !== "closed",
        withoutAnimation: false,
    });

    const size      = useStorage("size", defaultSettings.size);

    // getters
    /**
     * 根据语言标识读取对应的语言包
     */
    const locale = computed(()=>{
        if(language?.value == "en"){
            return en;
        }
        return zhCn;
    });

    // actions
    function toggleSidebar(){
        sidebar.opened = !sidebar.opened;
        sidebarStatus.value = sidebar.opened ? "opened" : "closed";
    }

    function closeSidebar(){
        sidebar.opened = false;
        sidebarStatus.value = "closed";
    }

    function openSidebar(){
        sidebar.opened = true;
        sidebarStatus.value = "opened";
    }

    function toggleDevice(val: string){
        device.value = val;
    }

    function changeSize(val: string){
        size.value = val;
    }

    function changeLanguage(val: string){
        language.value = val;
    }

    function activeTopMenu(path: string){
        activeTopMenuPath.value = path;
    }

    return {
        // state
        activeTopMenuPath,  // 当前激活的顶部菜单
        device,
        language,
        sidebar,
        size,

        // getters
        locale,

        // actions
        activeTopMenu,
        changeSize,
        changeLanguage,
        closeSidebar,
        openSidebar,
        toggleDevice,
        toggleSidebar,
    };
});

// 非 setup
export function useAppStoreHook(){
    return useAppStore(store);
}
