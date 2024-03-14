import { RouteRecordName, RouteRecordRaw } from "vue-router";

export function hasClass(el: HTMLElement, className: string): boolean {
    return el.classList.contains(className);
}

export function addClass(el: HTMLElement, className: string): void {
    el.classList.add(className);
}

export function removeClass(el: HTMLElement, className: string): void {
    el.classList.remove(className);
}

export function toggleClass(el: HTMLElement, className: string): void {
    el.classList.toggle(className);
}

export function isExternal(path: string): boolean {
    return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * 设置样式属性
 * @param style 
 * @param value 
 * @param el 
 */
export function setStyleProperty(style: string, value: string, el: HTMLElement = document.documentElement): void {
    el.style.setProperty(style, value);
}

// 找到最外层的父节点
export function findOutermostParent(tree: RouteRecordRaw[], findName: string) {
    let parentMap: Record<RouteRecordName, RouteRecordRaw | null> = {};

    function buildParentMap(node: RouteRecordRaw, parent: RouteRecordRaw | null) {
        if(node.name) {
            parentMap[node.name] = parent;
        }
        if(node.children) {
            node.children.forEach((child: any) => {
                buildParentMap(child, node);
            });
        }
    }

    tree.forEach((node: RouteRecordRaw) => {
        buildParentMap(node, null);
    });
    let currentNode = parentMap[findName];
    while(currentNode) {
        const node = parentMap[currentNode.name as string];
        if(!node) {
            return currentNode; // 找到最外层的父节点
        }
        currentNode = node;
    }
    return null;
}
