
import 'vue-router';    // 这个不能少

declare module 'vue-router' {
    // https://router.vuejs.org/zh/guide/advanced/meta.html#typescript
    // 可以通过扩展 RouteMeta 接口来输入 meta 字段
    interface RouteMeta {
        // 菜单名称
        title?: string;
        // 菜单图标
        icon?: string;
        // 是否固定在 tagsView
        affix?: boolean;
        // 是否在面包屑上隐藏
        breadcrumb?: boolean;
        // 是否隐藏
        hidden?: boolean;
        // 是否缓存页面
        keepAlive?: boolean;
        // 拥有菜单权限的角色编码
        roles?: string[];
    }
}

export {};
