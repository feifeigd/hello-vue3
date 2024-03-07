
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
