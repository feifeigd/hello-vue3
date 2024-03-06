import i18n from "@/lang";

export function translateRouteTitle(title: string){
    // 判断是否存在国际化配置，如果没有则直接返回
    const key = `route.${title}`;
    const hasKey = i18n.global.te(key);
    if (!hasKey) return title;

    return i18n.global.t(key);
}
