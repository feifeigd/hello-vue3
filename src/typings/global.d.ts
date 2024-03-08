
declare global{
    /**
     * 分页查询参数
     */
    interface PageQuery {
        /**
         * 页码
         */
        page: number;
        /**
         * 每页数量
         */
        limit: number;
    }

    /**
     * 分页查询结果
     */
    interface PageResult<T> {
        /**
         * 总数
         */
        total: number;
        /**
         * 数据
         */
        list: T[];
    }

    /**
     * 页签对象
     */
    interface TagView{
        name: string;
        /**
         * 标题
         */
        title: string;
        /**
         * 路由
         */
        path: string;
        fullPath: string;
        icon?: string;
        affix?: boolean;
        keepAlive?: boolean;
        // 路由查询参数
        query?: any;

        /**
         * 是否缓存
         */
        // cache: boolean;
        /**
         * 是否显示
         */
        // show: boolean;
    }

    /**
     * 系统设置
     */
    interface AppSettings {
        title: string;
        version: string;
        showSettings: boolean;
        fixedHeader: boolean;
        tagsView: boolean;
        sidebarLogo: boolean;
        size: string;
        layout: string;
        theme: string;
        themeColor: string;
        language: string;
        watermarkEnabled: boolean;
        watermarkContent: string;
    }

    /**
     * 组件数据源
     */
    interface OptionType{
        label: string;
        value: string | number;
        children?: OptionType[];
    }
}

export {};
