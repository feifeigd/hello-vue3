
import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { CaptchaResult, LoginData, LoginResult } from "./types";

/**
 * 登录
 * @param data 
 * @returns 
 */
export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("captchaKey", data.captchaKey || "");
    formData.append("captchaCode", data.captchaCode || "");

    return request({
        url: "/api/v1/auth/login",
        method: "post",
        data: formData,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
}

/**
 * 退出登录
 * @returns 
 */
export function logoutApi(): AxiosPromise<void> {
    return request({
        url: "/api/v1/auth/logout",
        method: "delete",
    });
}

/**
 * 获取验证码
 * @returns 
 */
export function getCaptchaApi(): AxiosPromise<CaptchaResult> {
    return request({
        url: "/api/v1/auth/captcha",
        method: "get",
    });
}
