
import { store } from "@/store";
import { defineStore } from "pinia";
import { UserInfo } from "@/api/user/types";
import { resetRouter } from "@/router";
import { LoginData } from "@/api/auth/types";
import { loginApi, logoutApi } from "@/api/auth";
import { getUserInfoApi } from "@/api/user";

export const useUserStore = defineStore("user", ()=>{
    const user = ref<UserInfo>({
        roles: [],
        perms: [],
    });

    function getUserInfo(){
        return new Promise<UserInfo>((resolve, reject)=>{
            getUserInfoApi().then(({data}: any)=>{
                if(!data){
                    reject("Verification failed, please Login again.");
                    return;
                }
                const {roles} = data;
                if(!roles || roles.length <= 0){
                    reject("getInfo: roles must be a non-null array!");
                    return;
                }
                Object.assign(user.value, data);
                resolve(data);
            });
        });
    }

    function login(loginData: LoginData){
        return new Promise<void>((resolve, reject)=>{
            loginApi(loginData).then((result)=>{
                const {tokenType, accessToken} = result.data;   // 这里的字段名可能不一样
                localStorage.setItem("token", tokenType + " " + accessToken);
                resolve();
            }).catch((error)=>{
                reject(error);
            });
        });
    }

    function logout(){
        return new Promise<void>((resolve, reject)=>{
            // 这里的退出登录接口可能不一样
            logoutApi().then(()=>{
                localStorage.removeItem("token");
                location.reload(); // 清空路由
                resolve();
            }).catch((error)=>{
                reject(error);
            });
        });
    }

    function resetToken(){
        console.log("resetToken");
        return new Promise<void>((resolve)=>{
            localStorage.removeItem("token");
            resetRouter();
            resolve();
        });
    }

    return {
        user,

        getUserInfo,
        login,
        logout,
        resetToken,
    };
});

export function useUserStoreHook(){
    return useUserStore(store);
}
