
import { useUserStoreHook } from '@/store';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const baseURL = import.meta.env.VITE_APP_BASE_API;
console.log('baseURL:', baseURL);

const service = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
    },
});

// 请求拦截器
service.interceptors.request.use(
    (config) => {        
        // 在发送请求之前做些什么
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers['Authorization'] = accessToken;
        }
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        const { code, msg } = response.data;
        if (code === "00000") {
            return response.data;
        }
        // 响应数据为二进制流处理(Excel导出)
        if(response.data instanceof ArrayBuffer){
            return response;
        }
        ElMessage.error(msg || "系统出错");
        return Promise.reject(new Error(msg || "Error"));
    },
    (error) => {
        // 对响应错误做点什么
        if(error.response.data){
            const { code, msg } = error.response.data;
            // token 过期, 重新登录
            if(code === "A0230"){
                ElMessageBox.confirm(msg, "提示", {
                    confirmButtonText: "重新登录",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(()=>{
                    const userStore = useUserStoreHook();
                    userStore.resetToken().then(()=>{
                        location.reload();
                    });
                });                    
            }else{
                ElMessage.error(msg || "系统出错");            
            }
        }
        return Promise.reject(error.message);
    }
);

// 导出 axios 实例
export default service;
