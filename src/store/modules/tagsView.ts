
export const useTagsViewStore = defineStore("tagsView", () => {
    const cachedViews = ref<string[]>([]); // 缓存的视图
    const visitedViews = ref<TagView[]>([]); // 访问过的视图

    function addCachedView(view: TagView) {
        console.log("addCachedView");
        const viewName = view.name;
        if (cachedViews.value.includes(viewName)) return;   // 不能重复添加

        if(view.keepAlive)
            cachedViews.value.push(viewName);
    }

    function addView(view: TagView) {
        console.log("addView");
        addVisitedView(view);
        addCachedView(view);
    }

    function addVisitedView(view: TagView) {
        console.log("addVisitedView");
        if (view?.path) {
            if (visitedViews.value.some((v) => v.path === view.path)) return;   // 不能重复添加
            
            // 如果视图是固定的(affix), 则在已访问的视图的前面添加
            if (view?.affix) {
                visitedViews.value.unshift(view);
            } else {
                // 否则在已访问的视图的后面添加
                visitedViews.value.push(view);
            }
        }
    }

    function delAllViews() {
        console.log("delAllViews");
        return new Promise((resolve) => {
            cachedViews.value = [];
            const affixTags = visitedViews.value.filter((tag) => tag?.affix);   // 固定的不能删除
            visitedViews.value = affixTags;
            cachedViews.value = affixTags.map((tag) => tag.name);
            resolve({
                visitedViews: [...visitedViews.value],
                cachedViews: [...cachedViews.value],
            });
        });
    }

    function delAllVisitedViews() {
        console.log("delAllVisitedViews");
        return new Promise((resolve) => {
            const affixTags = visitedViews.value.filter((tag) => tag?.affix);   // 固定的不能删除
            visitedViews.value = affixTags;
            resolve([...visitedViews.value]);
        });
    }

    function delAllCachedViews() {
        console.log("delAllCachedViews");
        return new Promise((resolve) => {
            cachedViews.value = [];
            resolve([...cachedViews.value]);
        });
    }

    function delCachedView(view: TagView) {
        console.log("delCachedView");
        return new Promise((resolve) => {
            const index = cachedViews.value.indexOf(view.name);
            if (index > -1) {
                cachedViews.value.splice(index, 1);
            }
            resolve([...cachedViews.value]);
        });
    }

    function delLeftViews(view: TagView) {
        console.log("delLeftViews");
        return new Promise((resolve) => {
            const index = visitedViews.value.findIndex((v) => v.path === view.path);
            if (index < 0) {
                return;
            }
            visitedViews.value = visitedViews.value.filter((v, i) => {
                if( v.affix || i >= index) {
                    return true;
                }

                // 同时删除缓存
                const cacheIndex = cachedViews.value.indexOf(v.name);
                if(cacheIndex > -1) {
                    cachedViews.value.splice(cacheIndex, 1);
                }
                return false;
            });

            resolve([...visitedViews.value]);
        });
    }

    function delOtherCachedViews(view: TagView) {
        console.log("delOtherCachedViews");
        return new Promise((resolve) => {
            const index = cachedViews.value.indexOf(view.name);
            if (index > -1) {
                cachedViews.value = cachedViews.value.slice(index, index + 1);
            } else {    // 如果没有找到, 则删除所有的                
                cachedViews.value = [];
            }
            resolve([...cachedViews.value]);
        });
    }

    function delOtherViews(view: TagView) {
        console.log("delOtherViews");
        return new Promise((resolve) => {
            delOtherVisitedViews(view).then(() => {
                delOtherCachedViews(view).then(() => {
                    resolve({
                        visitedViews: [...visitedViews.value],
                        cachedViews: [...cachedViews.value],
                    });
                });
            });
        });
    }

    function delOtherVisitedViews(view: TagView) {
        console.log("delOtherVisitedViews");
        return new Promise((resolve) => {
            visitedViews.value = visitedViews.value.filter((v) => {
                return v.affix || v.path === view.path;
            });
            resolve([...visitedViews.value]);
        });
    }

    function delRightViews(view: TagView) {
        console.log("delRightViews");
        return new Promise((resolve) => {
            const index = visitedViews.value.findIndex((v) => v.path === view.path);
            if (index < 0) {
                return;
            }
            visitedViews.value = visitedViews.value.filter((v, i) => {
                if( v.affix || i <= index) {
                    return true;
                }

                // 同时删除缓存
                const cacheIndex = cachedViews.value.indexOf(v.name);
                if(cacheIndex > -1) {
                    cachedViews.value.splice(cacheIndex, 1);
                }
                return false;
            });

            resolve([...visitedViews.value]);
        });
    }

    function delView(view: TagView) {
        console.log("delView");
        return new Promise((resolve) => {
            delVisitedView(view).then(() => {
                delCachedView(view).then(() => {
                    resolve({
                        visitedViews: [...visitedViews.value],
                        cachedViews: [...cachedViews.value],
                    });
                });
            });
        });
    }

    function delVisitedView(view: TagView) {
        console.log("delVisitedView");
        return new Promise((resolve) => {
            for (const [i, v] of visitedViews.value.entries()) {
                if (v.path === view.path) {
                    visitedViews.value.splice(i, 1);
                    break;
                }
            }
            resolve([...visitedViews.value]);
        });
    }

    function updateVisitedView(view: TagView) {
        console.log("updateVisitedView");
        for (let v of visitedViews.value) {
            if (v.path === view.path) {
                v = Object.assign(v, view);
                break;
            }
        }
    }

    return {
        cachedViews,
        visitedViews,

        addCachedView,
        addView,     
        addVisitedView,

        delAllCachedViews,   
        delAllViews,
        delAllVisitedViews,
        delCachedView,
        delLeftViews,
        delOtherCachedViews,
        delOtherViews,
        delOtherVisitedViews,
        delRightViews,
        delView,
        delVisitedView,

        updateVisitedView,
    };
});
