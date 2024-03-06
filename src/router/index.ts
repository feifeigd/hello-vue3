import { createRouter, createWebHistory } from "vue-router";

export default {
    '/': 'Home',
    '/about': 'About',
} as {[key:string]: string};

const routes: never[] = [

];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});


