// main.js
import axios from 'axios';
import {useUserStore} from "@/stores/index.js";

// 将实例添加到 Vue 原型中，以便在组件中使用

export const http = axios.create({
    baseURL: 'http://api.unical.liverpooooool.online/', // 设置基本 URL
    timeout: 5000, // 设置请求超时时间
    headers: {
      'Content-Type': 'application/json', // 设置请求头
    },
    withCredentials: false, // 允许携带 cookie
});


http.interceptors.request.use((config) => {
    const userStore = useUserStore();
    // const {cancelSame, loading} = config.requestOptions;
    // if (cancelSame) {
    //     axiosCancel.addPending(config);
    // }

    if (userStore.state.isAuthenticated) {
        config.headers['Authorization'] = userStore.state.token ?? "";
        config.headers['token'] = userStore.state.token ?? "";
    }
    // if (loading) {
    //     axiosLoading.addLoading();
    // }

    return config;
});

http.interceptors.response.use(
    (response) => {
        const data = response.data;
        // axiosCancel.removePending(response.config);
        if (data.code === '200') {
            // addAjaxLog(response);
            return data.data;
        } else {
            // addAjaxErrorLog(response, data.message);
            // eslint-disable-next-line no-undef
            ElMessage.error(data.msg);
            return Promise.reject(data);
        }
    },
    (error) => {
        // axiosCancel.removePending(error.config);
        // axiosLoading.removeLoading();
        // addAjaxErrorLog(error.response, error.message);
        // eslint-disable-next-line no-undef
        ElMessage.error(error.message);
        return Promise.reject(error);
    }
);